// Check every crop's Wikidata item, scientific name, and family against Wikidata.
//
//   node scripts/verify-wikidata.mjs
//
// Exits 1 when a name is unknown to Wikidata or its family differs, and 2
// when Wikidata cannot be reached. Needs the network, so CI runs it as an
// extra check rather than a required one.
import { load } from './catalog.mjs';

const ENDPOINT = 'https://query.wikidata.org/sparql';
const USER_AGENT = 'open-garden-data-verify/0.1 (https://github.com/thedude459/open-garden-data)';

export function buildQuery(names) {
  const values = names.map((n) => JSON.stringify(n)).join(' ');
  return `SELECT ?name ?item ?familyName WHERE {
  VALUES ?name { ${values} }
  ?item wdt:P225 ?name .
  OPTIONAL { ?item wdt:P171* ?fam . ?fam wdt:P105 wd:Q35409 . ?fam wdt:P225 ?familyName }
}`;
}

/** Problems found, given Wikidata's rows for the crops' names. */
export function compare(crops, bindings) {
  const families = new Map();
  const items = new Map();
  for (const row of bindings) {
    const name = row.name.value;
    if (!families.has(name)) families.set(name, new Set());
    if (!items.has(name)) items.set(name, new Set());
    if (row.familyName) families.get(name).add(row.familyName.value.toLowerCase());
    if (row.item) items.get(name).add(row.item.value.split('/').pop());
  }
  const problems = [];
  for (const crop of crops) {
    const found = families.get(crop.scientificName);
    if (!found) problems.push(`${crop.id}: Wikidata has no taxon named "${crop.scientificName}"`);
    else if (!found.has(crop.family)) {
      problems.push(
        `${crop.id}: family is ${crop.family}, Wikidata says ${[...found].join(', ') || 'none'}`,
      );
    }
    if (found && crop.wikidataId && !items.get(crop.scientificName)?.has(crop.wikidataId)) {
      problems.push(
        `${crop.id}: ${crop.wikidataId} is not the Wikidata item named "${crop.scientificName}"`,
      );
    }
  }
  return problems;
}

if (process.argv[1]?.endsWith('verify-wikidata.mjs')) {
  const crops = load().crops.map((c) => c.crop);
  const names = [...new Set(crops.map((c) => c.scientificName))];
  let bindings;
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/sparql-results+json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': USER_AGENT,
      },
      body: new URLSearchParams({ query: buildQuery(names) }),
      signal: AbortSignal.timeout(60_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    bindings = (await res.json()).results.bindings;
  } catch (err) {
    console.error(`Could not reach Wikidata: ${err.message}`);
    process.exit(2);
  }
  const problems = compare(crops, bindings);
  if (problems.length) {
    console.error(problems.join('\n'));
    console.error(`\n${problems.length} of ${crops.length} crop(s) do not match Wikidata.`);
    process.exit(1);
  }
  console.log(`All ${crops.length} crops match Wikidata (item, scientific name, and family).`);
}
