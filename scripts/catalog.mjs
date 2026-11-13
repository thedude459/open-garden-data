// Validate the dataset and build the release file.
//
//   node scripts/catalog.mjs validate
//   node scripts/catalog.mjs report          # Markdown: optional fields each crop lacks
//   node scripts/catalog.mjs build 0.1.0     # writes dist/open-garden-catalog-0.1.0.json + .sha256
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import { parse } from 'yaml';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const COMPANION_KINDS = new Set(['helps', 'hinders', 'attracts-pollinators']);
/** Licenses whose terms allow CC0 output. Anything else (BY-SA, NC, unknown) is refused. */
const ALLOWED_LICENSES = new Set(['CC0-1.0', 'Public domain']);
const SOURCE_KINDS = new Set(['reference', 'curation', 'bootstrap']);
const ROOTSTOCK_ORDER = ['dwarf', 'semiDwarf', 'standard'];
/**
 * In-row spacing a plant of each habit can plausibly have, in cm. Wide enough
 * for real crops (peas at 5 cm, thyme at 25), narrow enough to catch metres
 * or feet entered as centimetres, or a stray zero.
 */
const SPACING_CM_BY_HABIT = {
  herbaceous: [2, 150],
  vine: [2, 300],
  cane: [20, 200],
  shrub: [15, 400],
  tree: [150, 1200],
};

/** Read every data file under `dir`. */
export function load(dir = ROOT) {
  const read = (file) => parse(readFileSync(join(dir, file), 'utf8'));
  const cropDir = join(dir, 'crops');
  const crops = readdirSync(cropDir)
    .filter((f) => f.endsWith('.yaml'))
    .sort()
    .map((file) => ({ file, crop: parse(readFileSync(join(cropDir, file), 'utf8')) }));
  return {
    families: read('families.yaml') ?? [],
    sources: read('sources.yaml') ?? [],
    companions: read('companions.yaml') ?? [],
    crops,
  };
}

/** Every problem found, as "file: message". Empty means valid. */
export function validate(data, schema = readSchema()) {
  const errors = [];
  const check = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
  const familyIds = idSet(data.families, 'families.yaml', errors);
  const sourceIds = idSet(data.sources, 'sources.yaml', errors);
  const sourceKind = new Map();
  for (const src of Array.isArray(data.sources) ? data.sources : []) {
    if (!ALLOWED_LICENSES.has(src?.license)) {
      errors.push(
        `sources.yaml: "${src?.id}" has license "${src?.license}"; only ${[...ALLOWED_LICENSES].join(', ')} allow CC0 output`,
      );
    }
    if (!SOURCE_KINDS.has(src?.kind)) {
      errors.push(`sources.yaml: "${src?.id}" needs a kind: ${[...SOURCE_KINDS].join(', ')}`);
    }
    sourceKind.set(src?.id, src?.kind);
  }
  const cropIds = new Set();
  const varietyIds = new Set();
  const englishNames = new Map();

  for (const { file, crop } of data.crops) {
    const at = `crops/${file}`;
    if (!check(crop)) {
      for (const e of check.errors ?? [])
        errors.push(`${at}: ${e.instancePath || '/'} ${e.message}`);
      continue;
    }
    if (basename(file, '.yaml') !== crop.id)
      errors.push(`${at}: id "${crop.id}" must match the file name`);
    if (cropIds.has(crop.id)) errors.push(`${at}: duplicate crop id "${crop.id}"`);
    cropIds.add(crop.id);

    const name = crop.names.en.toLowerCase();
    if (englishNames.has(name))
      errors.push(
        `${at}: English name "${crop.names.en}" is also used by ${englishNames.get(name)}`,
      );
    englishNames.set(name, at);

    if (!familyIds.has(crop.family)) errors.push(`${at}: unknown family "${crop.family}"`);
    for (const s of crop.sources) {
      if (!sourceIds.has(s.source)) errors.push(`${at}: unknown source "${s.source}"`);
    }
    errors.push(...checkProvenance(at, crop, sourceKind));
    errors.push(...checkPlausible(at, crop));
    for (const [method, w] of Object.entries(crop.windows)) {
      if (w.weeksEarliest > w.weeksLatest)
        errors.push(`${at}: windows.${method} starts after it ends`);
    }
    for (const [field, range] of [
      ['germinationDays', crop.germinationDays],
      ['daysToMaturity', crop.daysToMaturity],
    ]) {
      if (range && range.min > range.max) errors.push(`${at}: ${field}.min is above max`);
    }
    if (crop.lifeCycle === 'perennial' && !crop.hardinessZones) {
      errors.push(`${at}: a perennial needs hardinessZones (the zones where it survives winter)`);
    }
    if (crop.hardinessZones && crop.hardinessZones.min > crop.hardinessZones.max) {
      errors.push(`${at}: hardinessZones.min is above max`);
    }
    if (crop.habit === 'tree' && !crop.rootstocks) {
      errors.push(`${at}: a tree needs rootstocks (spacing for dwarf, semi-dwarf, or standard)`);
    }
    if (crop.rootstocks && crop.habit !== 'tree') {
      errors.push(`${at}: rootstocks apply only to trees`);
    }
    for (const [size, r] of Object.entries(crop.rootstocks ?? {})) {
      for (const field of ['heightM', 'yearsToFruit']) {
        if (r[field] && r[field].min > r[field].max)
          errors.push(`${at}: rootstocks.${size}.${field}.min is above max`);
      }
    }
    const t = crop.temperatureC;
    if (
      t &&
      (t.min > t.max || (t.optimal !== undefined && (t.optimal < t.min || t.optimal > t.max)))
    ) {
      errors.push(`${at}: temperatureC must run min ≤ optimal ≤ max`);
    }
    for (const v of crop.varieties ?? []) {
      if (!v.id.startsWith(`${crop.id}-`))
        errors.push(`${at}: variety "${v.id}" must start with "${crop.id}-"`);
      if (varietyIds.has(v.id)) errors.push(`${at}: duplicate variety id "${v.id}"`);
      varietyIds.add(v.id);
      if (v.daysToMaturity && v.daysToMaturity.min > v.daysToMaturity.max) {
        errors.push(`${at}: variety "${v.id}" daysToMaturity.min is above max`);
      }
    }
  }

  if (!Array.isArray(data.companions)) {
    errors.push('companions.yaml: must be a list');
  } else {
    data.companions.forEach((pair, i) => {
      const at = `companions.yaml[${i}]`;
      const [a, b] = Array.isArray(pair?.crops) ? pair.crops : [];
      if (!a || !b || pair.crops.length !== 2)
        return errors.push(`${at}: crops must name exactly two crops`);
      if (a === b) errors.push(`${at}: a crop cannot pair with itself`);
      for (const id of [a, b]) if (!cropIds.has(id)) errors.push(`${at}: unknown crop "${id}"`);
      if (!COMPANION_KINDS.has(pair.kind))
        errors.push(`${at}: kind must be one of ${[...COMPANION_KINDS].join(', ')}`);
      if (typeof pair.reason !== 'string' || !pair.reason.trim())
        errors.push(`${at}: reason is required`);
      if (!sourceIds.has(pair.source)) errors.push(`${at}: unknown source "${pair.source}"`);
    });
  }
  return errors;
}

/** The release file's content: every crop, family, source, and pair, in a stable order. */
export function build(data, version) {
  if (!/^\d+\.\d+\.\d+$/.test(version))
    throw new Error(`version must be MAJOR.MINOR.PATCH, got "${version}"`);
  return {
    version,
    license: 'CC0-1.0',
    units: { length: 'cm', temperature: 'C' },
    families: data.families,
    sources: data.sources,
    crops: data.crops.map((c) => c.crop),
    companions: data.companions,
  };
}

/**
 * A Markdown report of the optional fields each crop leaves out, for the CI
 * summary. Trees and perennials leave some out on purpose; the report shows
 * where data could be added, it does not fail.
 */
export function completeness(data, schema = readSchema()) {
  const optional = Object.keys(schema.properties).filter((f) => !schema.required.includes(f));
  // Rootstocks apply only to trees and hardiness zones only to perennials, so
  // other crops are not missing them.
  const applies = (field, crop) =>
    (field !== 'rootstocks' || crop.habit === 'tree') &&
    (field !== 'hardinessZones' || crop.lifeCycle === 'perennial');
  const rows = data.crops.map(({ crop }) => [
    crop.id,
    optional.filter((f) => applies(f, crop) && crop[f] === undefined),
  ]);
  const lines = [
    '## Completeness',
    '',
    `${data.crops.length} crops; optional fields: ${optional.map((f) => `\`${f}\``).join(', ')}.`,
    '',
    '| Field | Crops with it |',
    '|---|---|',
    ...optional.map(
      (f) => `| \`${f}\` | ${rows.filter(([, missing]) => !missing.includes(f)).length} |`,
    ),
    '',
    '| Crop | Missing |',
    '|---|---|',
    ...rows
      .filter(([, missing]) => missing.length)
      .map(([id, missing]) => `| ${id} | ${missing.join(', ')} |`),
  ];
  return `${lines.join('\n')}\n`;
}

/** Taxonomy must come from a reference source; a bootstrap source needs a curator too. */
function checkProvenance(at, crop, sourceKind) {
  const errors = [];
  for (const field of ['scientificName', 'family']) {
    const backed = crop.sources.some(
      (s) => sourceKind.get(s.source) === 'reference' && s.fields?.includes(field),
    );
    if (!backed)
      errors.push(`${at}: ${field} must be credited to a reference source (fields: [${field}])`);
  }
  const kinds = new Set(crop.sources.map((s) => sourceKind.get(s.source)));
  if (kinds.has('bootstrap') && !kinds.has('curation')) {
    errors.push(`${at}: a bootstrap source must be checked by a curator; add the curation source`);
  }
  return errors;
}

/** Values that pass the schema but cannot be right. */
function checkPlausible(at, crop) {
  const errors = [];
  const { indoorStart, directSow, transplant } = crop.windows;
  if (crop.frostTolerance === 'tender') {
    for (const [method, w] of [
      ['directSow', directSow],
      ['transplant', transplant],
    ]) {
      if (w?.frost === 'last' && w.weeksEarliest < 0) {
        errors.push(
          `${at}: a frost-tender crop cannot go outside before the last frost (windows.${method})`,
        );
      }
    }
  }
  if (indoorStart && !transplant) {
    errors.push(`${at}: an indoor start needs a transplant window for the seedlings`);
  }
  if (
    indoorStart &&
    transplant &&
    indoorStart.frost === transplant.frost &&
    indoorStart.weeksLatest >= transplant.weeksEarliest
  ) {
    errors.push(`${at}: indoor start must end before transplanting begins`);
  }
  if (
    crop.germinationDays &&
    crop.daysToMaturity &&
    crop.germinationDays.max >= crop.daysToMaturity.min
  ) {
    errors.push(`${at}: germination must finish before the crop matures`);
  }
  const rows = [
    ['spacingCm', crop.spacingCm],
    ...(crop.varieties ?? []).map((v) => [`variety "${v.id}" spacingCm`, v.spacingCm]),
  ];
  for (const [size, r] of Object.entries(crop.rootstocks ?? {}))
    rows.push([`rootstocks.${size}.spacingCm`, r.spacingCm]);
  for (const [where, sp] of rows) {
    if (sp?.betweenRows !== undefined && sp.betweenRows < sp.inRow)
      errors.push(`${at}: ${where} rows cannot be closer than plants in a row`);
  }
  const [low, high] = SPACING_CM_BY_HABIT[crop.habit] ?? [0, Infinity];
  for (const [where, sp] of rows) {
    if (sp && (sp.inRow < low || sp.inRow > high)) {
      errors.push(
        `${at}: ${where}.inRow is ${sp.inRow} cm; a ${crop.habit} is spaced ${low}–${high} cm. Is it in another unit?`,
      );
    }
  }
  for (const v of crop.varieties ?? []) {
    const own = v.daysToMaturity;
    const all = crop.daysToMaturity;
    if (own && all && (own.min < all.min || own.max > all.max)) {
      errors.push(
        `${at}: variety "${v.id}" daysToMaturity must sit within the crop's (${all.min}–${all.max})`,
      );
    }
  }
  if (
    crop.frostTolerance === 'tender' &&
    crop.lifeCycle === 'perennial' &&
    crop.hardinessZones?.min < 9
  ) {
    errors.push(
      `${at}: a frost-tender perennial cannot survive winter below zone 9 (hardinessZones.min is ${crop.hardinessZones.min})`,
    );
  }
  const optimal = crop.temperatureC?.optimal;
  if (
    crop.minSoilTemperatureC !== undefined &&
    optimal !== undefined &&
    crop.minSoilTemperatureC > optimal
  ) {
    errors.push(
      `${at}: minSoilTemperatureC (${crop.minSoilTemperatureC}) is above the optimal air temperature (${optimal})`,
    );
  }
  if (crop.rootstocks) {
    const present = ROOTSTOCK_ORDER.filter((k) => crop.rootstocks[k]).map((k) => [
      k,
      crop.rootstocks[k],
    ]);
    for (let i = 1; i < present.length; i++) {
      const [smallName, small] = present[i - 1];
      const [bigName, big] = present[i];
      if (
        small.spacingCm.inRow > big.spacingCm.inRow ||
        (small.heightM && big.heightM && small.heightM.max > big.heightM.max)
      ) {
        errors.push(`${at}: rootstocks.${smallName} must be no larger than rootstocks.${bigName}`);
      }
    }
    const semi = crop.rootstocks.semiDwarf;
    if (
      semi &&
      (semi.spacingCm.inRow !== crop.spacingCm.inRow ||
        semi.spacingCm.betweenRows !== crop.spacingCm.betweenRows)
    ) {
      errors.push(
        `${at}: spacingCm is the default for an unknown rootstock and must match rootstocks.semiDwarf`,
      );
    }
  }
  return errors;
}

function idSet(list, file, errors) {
  const ids = new Set();
  if (!Array.isArray(list)) {
    errors.push(`${file}: must be a list`);
    return ids;
  }
  for (const item of list) {
    if (typeof item?.id !== 'string') errors.push(`${file}: every entry needs an id`);
    else if (ids.has(item.id)) errors.push(`${file}: duplicate id "${item.id}"`);
    else ids.add(item.id);
  }
  return ids;
}

function readSchema() {
  return JSON.parse(readFileSync(join(ROOT, 'schema', 'crop.schema.json'), 'utf8'));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [command, version] = process.argv.slice(2);
  const data = load();
  const errors = validate(data);
  if (errors.length) {
    console.error(errors.join('\n'));
    console.error(`\n${errors.length} problem(s) found.`);
    process.exit(1);
  }
  if (command === 'validate') {
    console.log(
      `Valid: ${data.crops.length} crop(s), ${data.families.length} families, ${data.companions.length} companion pair(s).`,
    );
  } else if (command === 'report') {
    process.stdout.write(completeness(data));
  } else if (command === 'build') {
    const name = `open-garden-catalog-${version}.json`;
    const json = `${JSON.stringify(build(data, version), null, 2)}\n`;
    mkdirSync(join(ROOT, 'dist'), { recursive: true });
    writeFileSync(join(ROOT, 'dist', name), json);
    const sha = createHash('sha256').update(json).digest('hex');
    writeFileSync(join(ROOT, 'dist', `${name}.sha256`), `${sha}  ${name}\n`);
    console.log(`Wrote dist/${name} (sha256 ${sha})`);
  } else {
    console.error('Usage: node scripts/catalog.mjs validate | report | build <version>');
    process.exit(2);
  }
}
