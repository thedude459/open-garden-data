// Validate the dataset and build the release file.
//
//   node scripts/catalog.mjs validate
//   node scripts/catalog.mjs build 0.1.0     # writes dist/open-garden-catalog-0.1.0.json + .sha256
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import { parse } from 'yaml';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const COMPANION_KINDS = new Set(['helps', 'hinders', 'attracts-pollinators']);

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
  const cropIds = new Set();
  const varietyIds = new Set();
  const englishNames = new Map();

  for (const { file, crop } of data.crops) {
    const at = `crops/${file}`;
    if (!check(crop)) {
      for (const e of check.errors ?? []) errors.push(`${at}: ${e.instancePath || '/'} ${e.message}`);
      continue;
    }
    if (basename(file, '.yaml') !== crop.id) errors.push(`${at}: id "${crop.id}" must match the file name`);
    if (cropIds.has(crop.id)) errors.push(`${at}: duplicate crop id "${crop.id}"`);
    cropIds.add(crop.id);

    const name = crop.names.en.toLowerCase();
    if (englishNames.has(name)) errors.push(`${at}: English name "${crop.names.en}" is also used by ${englishNames.get(name)}`);
    englishNames.set(name, at);

    if (!familyIds.has(crop.family)) errors.push(`${at}: unknown family "${crop.family}"`);
    for (const s of crop.sources) {
      if (!sourceIds.has(s.source)) errors.push(`${at}: unknown source "${s.source}"`);
    }
    for (const [method, w] of Object.entries(crop.windows)) {
      if (w.weeksEarliest > w.weeksLatest) errors.push(`${at}: windows.${method} starts after it ends`);
    }
    for (const [field, range] of [
      ['germinationDays', crop.germinationDays],
      ['daysToMaturity', crop.daysToMaturity],
    ]) {
      if (range && range.min > range.max) errors.push(`${at}: ${field}.min is above max`);
    }
    const t = crop.temperatureC;
    if (t && (t.min > t.max || (t.optimal !== undefined && (t.optimal < t.min || t.optimal > t.max)))) {
      errors.push(`${at}: temperatureC must run min ≤ optimal ≤ max`);
    }
    for (const v of crop.varieties ?? []) {
      if (!v.id.startsWith(`${crop.id}-`)) errors.push(`${at}: variety "${v.id}" must start with "${crop.id}-"`);
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
      if (!a || !b || pair.crops.length !== 2) return errors.push(`${at}: crops must name exactly two crops`);
      if (a === b) errors.push(`${at}: a crop cannot pair with itself`);
      for (const id of [a, b]) if (!cropIds.has(id)) errors.push(`${at}: unknown crop "${id}"`);
      if (!COMPANION_KINDS.has(pair.kind)) errors.push(`${at}: kind must be one of ${[...COMPANION_KINDS].join(', ')}`);
      if (typeof pair.reason !== 'string' || !pair.reason.trim()) errors.push(`${at}: reason is required`);
      if (!sourceIds.has(pair.source)) errors.push(`${at}: unknown source "${pair.source}"`);
    });
  }
  return errors;
}

/** The release file's content: every crop, family, source, and pair, in a stable order. */
export function build(data, version) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`version must be MAJOR.MINOR.PATCH, got "${version}"`);
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
    console.log(`Valid: ${data.crops.length} crop(s), ${data.families.length} families, ${data.companions.length} companion pair(s).`);
  } else if (command === 'build') {
    const name = `open-garden-catalog-${version}.json`;
    const json = `${JSON.stringify(build(data, version), null, 2)}\n`;
    mkdirSync(join(ROOT, 'dist'), { recursive: true });
    writeFileSync(join(ROOT, 'dist', name), json);
    const sha = createHash('sha256').update(json).digest('hex');
    writeFileSync(join(ROOT, 'dist', `${name}.sha256`), `${sha}  ${name}\n`);
    console.log(`Wrote dist/${name} (sha256 ${sha})`);
  } else {
    console.error('Usage: node scripts/catalog.mjs validate | build <version>');
    process.exit(2);
  }
}
