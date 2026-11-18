# Contributing

Thank you for helping gardeners get better advice. You do not need to know
the Open Garden app to contribute: everything here is YAML.

## Rules for data

- **Facts, in your own words.** Sowing windows, spacing, and temperatures are
  facts and can be shared freely; the wording of a book, website, or seed
  packet cannot. Never copy sentences or tables.
- **Compatible sources only.** Use public-domain or CC0 sources, extension
  service guides and seed packets as cross-checks, and your own records. Do
  not import from share-alike (CC BY-SA) or non-commercial sources such as
  Growstuff, Permapeople, Practical Plants, or PFAF: they would force the
  whole dataset to change license.
- **Name the source.** Every crop lists its `sources`; add a new source to
  `sources.yaml` before using it. A source needs a license the validator
  allows (CC0-1.0 or public domain) and a kind:
  - `reference`: authoritative taxonomy such as Wikidata or USDA PLANTS. Each
    crop's scientific name and family must be credited to one.
  - `curation`: values contributors wrote and checked in their own words.
  - `bootstrap`: a starting point such as the OpenFarm archive. It counts only
    alongside `curation`, meaning someone checked it.
- **Names are checked against Wikidata.** `npm run verify:wikidata` (and CI on
  every crop change) confirms each scientific name exists there and has the
  family we list.
- **Say where advice applies.** Windows assume a temperate climate with frost.
  Put regional caveats in `notes`.

## Names in other languages

Every crop needs an English name (`names.en`). Names in other languages are
welcome from people who speak them: add `names.<locale>` (`de`, `fr`, `es`,
`pt-BR`, ...) with the name a gardener there would use for the crop, not the
fruit, an oil, or the Latin name. Cite Wikidata (CC0) where the name comes
from there, or say in the pull request that you are a speaker. Open Garden
shows English only until a translation of the app itself is contributed;
the names are ready for it.

## Ids never change

A crop's `id` and a variety's `id` are permanent once released: apps use them
as keys, and renaming one looks to an app like deleting a plant and adding a
new one, which orphans what people planted. Fix a name in `names`, not in the
id. Choose ids with care: lower-case, hyphenated, the common English name
(`pole-bean`, `tomato-cherry`).

## What counts as a breaking change

Releases follow semver, and apps importing the catalog rely on it:

- **Minor (0.x → 0.x+1, or 1.2 → 1.3):** adding crops, varieties, families,
  sources, companion pairs, optional fields, or new values in a list such as
  `use` or `habit`. Apps must ignore fields they do not know and skip a crop
  they cannot read, rather than refuse the whole file.
- **Major:** removing or renaming a field, an id, or a list value; making an
  optional field required; changing a unit or what a field means.

## Companion pairs

A pair in `companions.yaml` names two crops, what the pairing does
(`benefits`), how well it is known (`evidence`: research, extension, or
traditional), where it was shown (`shownIn`, with USDA hardiness zones), and
for research or extension evidence a `reference` to the study or extension
guide. Write the reason in your own words; extension pages and papers are
references, not sources, because they are not CC0. Advice that only appears
in gardening charts is `traditional`.

## Changelog and releases

Say what your pull request changes in a line under **Unreleased** in
[CHANGELOG.md](CHANGELOG.md), under the section it belongs to (New features,
Improvements, Bug fixes, Known issues, Deprecated features), in plain words:
"Adds okra" or "Fixes the pea spacing". The `changelog` CI check asks for
it; label a pull request that changes only scripts, CI, or the roadmap
`skip-changelog`.

**When:** a release whenever the data has changed in a way apps should pick
up; Open Garden's roadmap says which version each of its features needs.

**To release** (a maintainer):

1. In a pull request, cut the entry and write its Summary:

   ```bash
   node scripts/catalog.mjs cut 0.3.0 "$(date +%F)"
   ```

   This renames **Unreleased** to `## v0.3.0 (date)` and starts a new empty
   **Unreleased**. Merge it.

2. Run **Actions → Release → Run workflow** on `main` with the version
   (`0.3.0`). The release workflow builds and signs the catalog, writes the
   notes (the Summary, then each section, "None" when empty,
   then a generated list of the crops and fields that changed), and
   publishes the GitHub Release, which creates the `v0.3.0` tag. It fails if
   the changelog has no entry for the version or the release already exists.

To correct notes after a release, edit the entry and paste the output of
`node scripts/catalog.mjs changelog 0.3.0` into the GitHub Release.

## Your contribution is CC0

By opening a pull request you agree to release your contribution under
[CC0 1.0](LICENSE), the same as the rest of the dataset.

## Making a change

1. Edit or add a file under `crops/`. The file name is the crop id
   (`crops/pole-bean.yaml` has `id: pole-bean`); variety ids start with the
   crop id (`pole-bean-kentucky-wonder`).
2. A new crop needs an icon at `icons/<crop id>.svg`: look in
   `icons/library/` first, or draw one to the
   [icon style guide](icons/README.md).
3. Run `npm ci`, then `npm run validate` and `npm test`.
4. Open a pull request. CI runs the same checks.

While working, watch for data gaps, performance gains, and pipeline or CI
improvements outside the change at hand. Do not make them in the same pull
request. Add each as one line under
[Ideas](ROADMAP.md#ideas) in `ROADMAP.md` (what, why, rough size), and list
them in the pull request under **Noticed**. Bugs go in a
[GitHub issue](https://github.com/thedude459/open-garden-data/issues/new/choose)
with the `bug` label instead.

To report a problem without editing YAML, open a
[plant data issue](https://github.com/thedude459/open-garden-data/issues/new/choose).

## Conduct

This project follows the [Contributor Covenant 3.0](CODE_OF_CONDUCT.md).
