import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build, load, validate } from '../scripts/catalog.mjs';
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
  data.companions = [{ crops: ['tomato', 'nothing'], kind: 'helps', reason: 'x', source: 'hand-curation' }];

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
  tomato.hardinessZones = { min: 4, max: 9 };
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
  data.sources.push({ id: 'some-wiki', name: 'Some wiki', license: 'CC-BY-SA-4.0', url: 'https://example.org' });
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
  assert.match(errors, /tomato.yaml: a frost-tender crop cannot go outside before the last frost \(windows.transplant\)/);
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
  const row = (name, family) => ({ name: { value: name }, ...(family && { familyName: { value: family } }) });
  const problems = compare(crops, [row('Known one', 'Solanaceae'), row('Other family', 'Rosaceae')]);
  assert.deepEqual(problems, [
    'b: family is solanaceae, Wikidata says rosaceae',
    'c: Wikidata has no taxon named "Not there"',
  ]);
  assert.match(buildQuery(['A b']), /VALUES \?name \{ "A b" \}/);
});
