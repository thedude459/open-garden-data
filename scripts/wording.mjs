// Copied-text check: values must be in our own words (CONTRIBUTING.md). For
// each text value that cites a reference with an address, fetch the page and
// flag any run of RUN or more words the value shares with it. Short shared
// phrases ("insecticidal soap", "the label is the law") are fine; a shared
// sentence is not. Needs the network, so it runs weekly and when pests or
// companions change, not as a required check.
//
//   node scripts/wording.mjs           report, exit 1 when a run is found
//   node scripts/wording.mjs --json    the same, as JSON
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

/** Words shared in a row that count as copied. */
export const RUN = 8;

/**
 * Shared runs that are not wording: lists of names, which are facts, in the
 * only order that makes sense. Each says why. Keep this short; reword first.
 */
export const ALLOWED = [
  {
    where: 'pests/apple-scab (Minnesota, USA)',
    run: 'dayton freedom liberty mcshay pixie crunch pristine redfree',
    why: 'Apple varieties immune to scab, listed A to Z.',
  },
];

/** Lower-case words, letters and digits only, so punctuation and case never hide a copy. */
export function words(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/** The text of an HTML page, without scripts, styles, and tags. */
export function pageText(html) {
  return html
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&[a-z]+;|&#\d+;/g, ' ');
}

/** Every run of `n` words in `list`, joined, for fast lookup. */
export function shingles(list, n = RUN) {
  const out = new Set();
  for (let i = 0; i + n <= list.length; i++) out.add(list.slice(i, i + n).join(' '));
  return out;
}

/**
 * The longest stretches of `value` (at least `n` words) that also appear in
 * the page, as text. Overlapping matches merge into one stretch.
 */
export function copiedRuns(value, page, n = RUN) {
  const list = words(value);
  const hits = [];
  for (let i = 0; i + n <= list.length; i++) {
    if (page.has(list.slice(i, i + n).join(' '))) hits.push(i);
  }
  const runs = [];
  for (const start of hits) {
    const last = runs.at(-1);
    if (last && start <= last.end) last.end = start + n;
    else runs.push({ start, end: start + n });
  }
  return runs.map((r) => list.slice(r.start, r.end).join(' '));
}

/** Text values and the reference ids they rest on, with where each is. */
export function citedValues(pests, companions) {
  const out = [];
  const steps = (controls) => Object.values(controls ?? {}).flatMap((list) => list ?? []);
  for (const pest of pests) {
    const all = new Set([
      ...pest.regions.flatMap((r) => r.references ?? []),
      ...(pest.occursIn?.references ?? []),
    ]);
    // The shared part rests on the pest's regional guides.
    const shared = [pest.signs, ...steps(pest.controls)];
    for (const text of shared) out.push({ where: `pests/${pest.id}`, text, refs: [...all] });
    for (const region of pest.regions) {
      const texts = [region.when, region.threshold, ...steps(region.controls)].filter(Boolean);
      for (const text of texts) {
        out.push({
          where: `pests/${pest.id} (${region.where})`,
          text,
          refs: region.references ?? [],
        });
      }
    }
  }
  for (const pair of companions) {
    out.push({
      where: `companions/${pair.crops.join('+')} (${pair.kind})`,
      text: pair.reason,
      refs: pair.references ?? [],
    });
  }
  return out;
}

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': 'open-garden-data wording check' },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get('content-type') ?? '';
  if (!type.includes('html') && !type.includes('text')) throw new Error(`not a page (${type})`);
  return shingles(words(pageText(await res.text())));
}

async function main() {
  const read = (file) => parse(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'));
  const references = new Map(read('references.yaml').map((r) => [r.id, r]));
  const values = citedValues(read('pests.yaml'), read('companions.yaml'));

  const pages = new Map();
  const unread = [];
  for (const id of new Set(values.flatMap((v) => v.refs))) {
    const url = references.get(id)?.url;
    if (!url) continue;
    try {
      pages.set(id, await fetchPage(url));
    } catch (err) {
      unread.push({ id, url, error: String(err.message ?? err) });
    }
  }

  const found = [];
  for (const value of values) {
    for (const ref of value.refs) {
      const page = pages.get(ref);
      if (!page) continue;
      for (const run of copiedRuns(value.text, page)) {
        if (ALLOWED.some((a) => a.where === value.where && run.includes(a.run))) continue;
        found.push({ where: value.where, ref, run });
      }
    }
  }

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ checked: pages.size, unread, found }, null, 2));
  } else {
    console.log(`Checked ${values.length} values against ${pages.size} pages.`);
    for (const u of unread) console.log(`Could not read ${u.id} (${u.url}): ${u.error}`);
    for (const f of found)
      console.log(`${f.where}: ${RUN}+ words shared with ${f.ref}: "${f.run}"`);
    if (!found.length) console.log('No copied wording found.');
  }
  process.exitCode = found.length ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
