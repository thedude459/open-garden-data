import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import {
  build,
  changelogSection,
  completeness,
  load,
  releaseNotes,
  validate,
} from '../scripts/catalog.mjs';
import { buildQuery, compare } from '../scripts/verify-wikidata.mjs';

const clone = (value) => structuredClone(value);
/** The tomato entry: the tests change it, whatever order the crop files load in. */
const tomatoOf = (data) => data.crops.find((c) => c.crop.id === 'tomato');

test('the dataset in this repository is valid', () => {
  assert.deepEqual(validate(load()), []);
});

test('catches the mistakes a schema cannot', () => {
  const data = clone(load());
  const tomato = tomatoOf(data).crop;
  tomato.family = 'no-such-family';
  tomato.windows.transplant = { frost: 'last', weeksEarliest: 3, weeksLatest: 1 };
  tomato.varieties = [{ id: 'cherry', name: 'Cherry' }];
  data.crops.push({ file: 'wrong-name.yaml', crop: clone(tomatoOf(load()).crop) });
  data.companions = [
    { crops: ['tomato', 'nothing'], kind: 'helps', reason: 'x', source: 'hand-curation' },
  ];

  const errors = validate(data).join('\n');
  assert.match(errors, /unknown family "no-such-family"/);
  assert.match(errors, /windows.transplant starts after it ends/);
  assert.match(errors, /variety "cherry" must start with "tomato-"/);
  assert.match(errors, /id "tomato" must match the file name/);
  assert.match(errors, /English name "Tomato" is also used/);
  assert.match(errors, /unknown crop "nothing"/);
});

test('a perennial needs hardiness zones, in order', () => {
  const data = clone(load());
  const tomato = tomatoOf(data).crop;
  tomato.lifeCycle = 'perennial';
  assert.match(validate(data).join('\n'), /a perennial needs hardinessZones/);
  tomato.hardinessZones = { min: 9, max: 4 };
  assert.match(validate(data).join('\n'), /hardinessZones.min is above max/);
  // Tomato is frost-tender, so as a perennial it survives only from zone 9.
  tomato.hardinessZones = { min: 9, max: 11 };
  assert.deepEqual(validate(data), []);
});

test('trees need rootstocks, and only trees may have them', () => {
  const data = clone(load());
  const apple = data.crops.find((c) => c.crop.id === 'apple').crop;
  const tomato = tomatoOf(data).crop;
  const { rootstocks } = apple;
  delete apple.rootstocks;
  tomato.rootstocks = rootstocks;
  const errors = validate(data).join('\n');
  assert.match(errors, /apple.yaml: a tree needs rootstocks/);
  assert.match(errors, /tomato.yaml: rootstocks apply only to trees/);
});

test('sources need an allowed license and a kind; taxonomy needs a reference source', () => {
  const data = clone(load());
  data.sources.push({
    id: 'some-wiki',
    name: 'Some wiki',
    license: 'CC-BY-SA-4.0',
    url: 'https://example.org',
  });
  const tomato = tomatoOf(data).crop;
  tomato.sources = [{ source: 'hand-curation' }];
  const errors = validate(data).join('\n');
  assert.match(errors, /"some-wiki" has license "CC-BY-SA-4.0"/);
  assert.match(errors, /"some-wiki" needs a kind/);
  assert.match(errors, /tomato.yaml: scientificName must be credited to a reference source/);
  assert.match(errors, /tomato.yaml: family must be credited to a reference source/);
});

test('a bootstrap source needs a curator', () => {
  const data = clone(load());
  tomatoOf(data).crop.sources = [
    { source: 'wikidata', fields: ['scientificName', 'family'] },
    { source: 'openfarm-rescue' },
  ];
  assert.match(validate(data).join('\n'), /a bootstrap source must be checked by a curator/);
});

test('catches values that pass the schema but cannot be right', () => {
  const data = clone(load());
  const tomato = tomatoOf(data).crop;
  tomato.windows.transplant = { frost: 'last', weeksEarliest: -2, weeksLatest: 1 };
  tomato.windows.indoorStart = { frost: 'last', weeksEarliest: -6, weeksLatest: -1 };
  tomato.germinationDays = { min: 5, max: 60 };
  tomato.spacingCm = { inRow: 90, betweenRows: 50 };
  const carrot = data.crops.find((c) => c.crop.id === 'carrot').crop;
  carrot.windows.indoorStart = { frost: 'last', weeksEarliest: -6, weeksLatest: -4 };
  const apple = data.crops.find((c) => c.crop.id === 'apple').crop;
  apple.rootstocks.dwarf.spacingCm.inRow = 900;
  apple.spacingCm.inRow = 400;
  const errors = validate(data).join('\n');
  assert.match(
    errors,
    /tomato.yaml: a frost-tender crop cannot go outside before the last frost \(windows.transplant\)/,
  );
  assert.match(errors, /tomato.yaml: indoor start must end before transplanting begins/);
  assert.match(errors, /tomato.yaml: germination must finish before the crop matures/);
  assert.match(errors, /tomato.yaml: spacingCm rows cannot be closer than plants in a row/);
  assert.match(errors, /carrot.yaml: an indoor start needs a transplant window/);
  assert.match(errors, /apple.yaml: rootstocks.dwarf must be no larger than rootstocks.semiDwarf/);
  assert.match(errors, /apple.yaml: spacingCm is the default .* must match rootstocks.semiDwarf/);
});

test('rejects values outside the schema', () => {
  const data = clone(load());
  const tomato = tomatoOf(data).crop;
  tomato.habit = 'bush';
  tomato.spacingCm.inRow = -5;
  delete tomato.feeding;
  const errors = validate(data).join('\n');
  assert.match(errors, /must have required property 'feeding'/);
  assert.match(errors, /\/habit must be equal to one of the allowed values/);
  assert.match(errors, /\/spacingCm\/inRow must be > 0/);
});

test('builds a release with a fixed version and metric units', () => {
  const release = build(load(), '0.1.0');
  assert.equal(release.version, '0.1.0');
  assert.deepEqual(release.units, { length: 'cm', temperature: 'C' });
  assert.ok(release.crops.some((c) => c.id === 'tomato'));
  assert.throws(() => build(load(), 'v1'), /MAJOR.MINOR.PATCH/);
});

test('the Wikidata check reports unknown names and family differences', () => {
  const crops = [
    { id: 'a', scientificName: 'Known one', family: 'solanaceae' },
    { id: 'b', scientificName: 'Other family', family: 'solanaceae' },
    { id: 'c', scientificName: 'Not there', family: 'rosaceae' },
  ];
  const row = (name, family) => ({
    name: { value: name },
    ...(family && { familyName: { value: family } }),
  });
  const problems = compare(crops, [
    row('Known one', 'Solanaceae'),
    row('Other family', 'Rosaceae'),
  ]);
  assert.deepEqual(problems, [
    'b: family is solanaceae, Wikidata says rosaceae',
    'c: Wikidata has no taxon named "Not there"',
  ]);
  assert.match(buildQuery(['A b']), /VALUES \?name \{ "A b" \}/);
});

test('the Wikidata check reports an item that is not the named taxon', () => {
  const item = (name, q) => ({
    name: { value: name },
    item: { value: `http://www.wikidata.org/entity/${q}` },
    familyName: { value: 'Solanaceae' },
  });
  const crop = { id: 'a', scientificName: 'Known one', family: 'solanaceae' };
  assert.deepEqual(compare([{ ...crop, wikidataId: 'Q1' }], [item('Known one', 'Q1')]), []);
  assert.deepEqual(compare([{ ...crop, wikidataId: 'Q2' }], [item('Known one', 'Q1')]), [
    'a: Q2 is not the Wikidata item named "Known one"',
  ]);
});

test('spacing must fit the habit, so a value in the wrong unit fails', () => {
  const data = clone(load());
  const tomato = tomatoOf(data).crop;
  tomato.spacingCm = { inRow: 450 };
  assert.match(
    validate(data).join('\n'),
    /spacingCm.inRow is 450 cm; a herbaceous is spaced 2–150 cm/,
  );
  tomato.spacingCm = { inRow: 1 };
  assert.match(validate(data).join('\n'), /Is it in another unit\?/);
});

test('consistency: variety maturity, tender perennials, and soil temperature', () => {
  const data = clone(load());
  const tomato = tomatoOf(data).crop;
  tomato.varieties[0].daysToMaturity = {
    min: tomato.daysToMaturity.min - 10,
    max: tomato.daysToMaturity.max,
  };
  tomato.lifeCycle = 'perennial';
  tomato.hardinessZones = { min: 5, max: 11 };
  tomato.minSoilTemperatureC = tomato.temperatureC.optimal + 1;
  const errors = validate(data).join('\n');
  assert.match(errors, /daysToMaturity must sit within the crop's/);
  assert.match(errors, /frost-tender perennial cannot survive winter below zone 9/);
  assert.match(errors, /minSoilTemperatureC .* is above the optimal air temperature/);
});

test('the completeness report lists optional fields each crop leaves out', () => {
  const report = completeness(load());
  assert.match(report, /^## Completeness/);
  assert.match(report, /\| `temperatureC` \| 39 \|/);
  assert.match(report, /\| apple \| [^|]*temperatureC/);
  assert.doesNotMatch(report, /\| tomato \|/);
});

test('a built release matches the release-file schema', () => {
  const schema = (name) =>
    JSON.parse(readFileSync(new URL(`../schema/${name}`, import.meta.url), 'utf8'));
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  ajv.addSchema(schema('crop.schema.json'));
  const check = ajv.compile(schema('catalog.schema.json'));
  assert.ok(check(build(load(), '1.2.3')), JSON.stringify(check.errors));
  assert.equal(check({ ...build(load(), '1.2.3'), license: 'CC-BY-4.0' }), false);
});

test('release notes list what was added, removed, and changed', () => {
  const before = build(load(), '0.1.0');
  const after = structuredClone(before);
  after.version = '0.2.0';
  after.crops = after.crops.filter((c) => c.id !== 'okra');
  const tomato = after.crops.find((c) => c.id === 'tomato');
  tomato.spacingCm = { inRow: 50 };
  tomato.varieties[0].name = 'Renamed';
  tomato.varieties.push({ id: 'tomato-roma', name: 'Roma' });
  after.crops.push({ ...structuredClone(tomato), id: 'tomatillo', varieties: [] });
  const notes = releaseNotes(before, after);
  assert.match(notes, /since v0\.1\.0/);
  assert.match(notes, /\*\*Crops added \(1\):\*\* tomatillo/);
  assert.match(notes, /\*\*Crops removed \(1\):\*\* okra/);
  assert.match(notes, /- `spacingCm` \(1\): tomato/);
  assert.match(notes, /- `varieties` \(1\): tomato/);
  assert.match(notes, /\*\*Varieties added \(1\):\*\* tomato-roma/);
  assert.match(releaseNotes(after, after), /No crop or variety changed\./);
  assert.match(releaseNotes(null, after), /since nothing \(first release\)/);
});

test('release notes group a field changed in every crop', () => {
  const before = build(load(), '0.1.0');
  const after = structuredClone(before);
  for (const crop of after.crops) crop.soilPh = { min: 3, max: 10 };
  assert.match(
    releaseNotes(before, after),
    new RegExp(`- \`soilPh\`: every crop \\(${after.crops.length}\\)`),
  );
});

test('the changelog gives a version its notes', () => {
  const text = '# Changelog\n\n## Unreleased\n\n## v0.2.0\n\nAdded pH.\n\n## v0.1.0\n\nFirst.\n';
  assert.equal(changelogSection(text, '0.2.0'), 'Added pH.');
  assert.equal(changelogSection(text, '0.1.0'), 'First.');
  assert.equal(changelogSection(text, '0.3.0'), null);
  assert.equal(changelogSection('## v0.2.0\n\n## v0.1.0\n', '0.2.0'), null);
  // The real changelog has notes for every version released so far.
  const real = readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8');
  assert.ok(changelogSection(real, '0.2.0'));
  assert.ok(changelogSection(real, '0.1.0'));
});

test('a fall sowing counts from the first frost, and soil pH runs low to high', () => {
  const data = clone(load());
  const lettuce = data.crops.find((c) => c.crop.id === 'lettuce').crop;
  lettuce.windows.fallSow.frost = 'last';
  lettuce.soilPh = { min: 7, max: 6 };
  const errors = validate(data).join('\n');
  assert.match(errors, /windows.fallSow is a fall sowing, counted from the first fall frost/);
  assert.match(errors, /soilPh.min is above max/);
});

test('a crop coefficient peaks mid-season', () => {
  const data = clone(load());
  const tomato = data.crops.find((c) => c.crop.id === 'tomato').crop;
  tomato.cropCoefficients.initial = 1.2;
  assert.match(validate(data).join('\n'), /cropCoefficients.mid is the peak/);
});
