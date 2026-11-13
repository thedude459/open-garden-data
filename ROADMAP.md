# Roadmap

What the dataset needs next, as releases. The
[Open Garden roadmap](https://github.com/thedude459/open-garden/blob/main/docs/roadmap.md)
sets the order of work across both repositories and says which dataset
version each app feature needs.

## Order of work

The [Open Garden roadmap](https://github.com/thedude459/open-garden/blob/main/docs/roadmap.md#implementation-order)
holds the one order across both repositories (re-prioritized November 2026).
For this repository:

1. **Done: tag v0.1.0.** The app bundles it as its plant catalog.
2. **Done: [data quality checks](#data-quality-checks) and release notes**:
   spacing ranges by habit, the consistency rules, a completeness report, a
   schema for the release file, and a Prettier check. They guard the v0.2
   data, which Claude drafts from public-domain and CC0 sources and the
   maintainer reviews.
3. **v0.2 in three small releases** (next), so each review stays short:
   - **v0.2.0:** `soilPh`, fall sowing windows (`fallSow`), and hot pepper.
   - **v0.2.1:** crop coefficients (`cropCoefficients`)
     for watering by water balance.
   - **v0.2.2:** companion plants as crops, and companion pairs with
     benefits, evidence, and sources.
4. **v0.3**, about 150 crops and pests and diseases, while the app adds care
   features.
5. **Later:** wet and dry seasons, crop icons, and names in other languages
   as they are contributed.

## Releases

| Version   | Content                                                                                                                                                                                                                          | The app uses it for                                                                                                                             |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **v0.1**  | Schema v1 and the [first 50 crops](#v01-the-first-50-crops), each with family, habit, use, spacing, and sowing windows                                                                                                           | The catalog importer, sowing calendars, crop rotation by family, and typed areas (habit and use decide what an area accepts)                    |
| **v0.2**  | Companion pairs, each with benefits, an evidence level, a reason, and a source; the [companion plants they need](#v02-companion-plants-first) as crops; hot pepper; fall sowing windows; `soilPh` and crop coefficients per crop | Companion advice from data instead of only household-entered pairs, fall crops in the calendar, soil-test advice, and watering by water balance |
| **v0.3**  | About 150 crops: more vegetables and herbs, fruit and nut trees (with [named rootstocks](#schema-changes-planned)), cane fruit, and soft fruit; [common pests and diseases](#pests-and-diseases) linked to crops and companions  | Orchard and bramble areas with real plants, a catalog broad enough for most home gardens, and pest advice on plant pages                        |
| **Later** | Wet and dry seasons, crop icons; names in other languages as they are contributed                                                                                                                                                | Worldwide climate support and a localized catalog                                                                                               |

A release is a tag (`v0.1.0`); publishing it attaches
`open-garden-catalog-<version>.json`, its SHA-256, and a provenance
attestation. Minor versions add crops or optional fields; a major version
removes a field or changes what one means.

### v0.1: the first 50 crops

Chosen to cover what most home gardens grow, plus a few trees, canes, and a
shrub so the app's area rules have real plants to check.

- **Vegetables (34):** tomato, sweet pepper, eggplant, potato, lettuce,
  spinach, kale, cabbage, broccoli, cauliflower, Brussels sprouts, radish,
  carrot, beet, Swiss chard, onion, garlic, leek, pea, bush bean, pole bean,
  cucumber, summer squash, winter squash, pumpkin, melon, watermelon, sweet
  corn, celery, parsnip, sweet potato, okra, asparagus, rhubarb
- **Herbs (8):** basil, parsley, cilantro, dill, chives, thyme, oregano, mint
- **Fruit (8):** strawberry, raspberry, blackberry, blueberry, apple, pear,
  peach, sweet cherry

Each crop needs at least: English name, scientific name, family, habit, use,
life cycle, frost tolerance, sun, water, feeding (light, moderate, or heavy),
in-row spacing, the sowing windows it is grown by, days to maturity, and its
sources. Perennials also need hardiness zones, and trees need spacing by
rootstock (dwarf, semi-dwarf, standard). Varieties are optional in v0.1.

**Decided (November 2026):** a crop is what gardeners grow as one kind, not strictly one
species. Bush and pole beans, or summer squash and pumpkin, differ in habit,
spacing, and timing, so they are separate crops that may share a scientific
name. Varieties sit under a crop.

Open a pull request per crop or small group; say which one you are working
on in an issue first so two people do not research the same crop.

### v0.2: companion plants first

A companion pair names two crops, and the validator refuses a pair whose
crop does not exist. Many well-known companions are not food crops, so v0.2
adds them as crops before any pair can name them: marigold, nasturtium,
borage, calendula, and tansy (`use: flower`, or `herb` for borage), plus
others a pair needs.

Each pair then carries:

- **`benefits`**, one or more of: `deters-pests`, `trap-crop`,
  `attracts-beneficials` (predators such as ladybirds and lacewings),
  `attracts-pollinators`, `fixes-nitrogen`, `support`, `shade`,
  `ground-cover`. A pair that hinders lists what goes wrong: `competes`,
  `suppresses-growth`, or `shares-pests`.
- **`evidence`**: `research` (field trials), `extension` (extension-service
  guidance), or `traditional` (gardening lore without trials). Much
  companion planting is lore, and apps should show which kind of advice it
  is.
- **`pests`** (from v0.3): the pest ids a `deters-pests` or `trap-crop`
  benefit acts on.

`kind` (helps, hinders) stays for a one-word summary.

## Schema changes planned

| Change                                                                                                                                                                                                                                                   | When                       | Why                                                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `companions.yaml` filled, with `kind` = helps, hinders, or attracts-pollinators                                                                                                                                                                          | v0.2                       | Already in the schema; v0.2 adds the data                                                                                                                                                                                                                                                |
| Common names beyond English (`names.<locale>`)                                                                                                                                                                                                           | Contributions              | Already allowed by the schema. Added by people who speak the language ([CONTRIBUTING](CONTRIBUTING.md#names-in-other-languages)); Open Garden shows English only until its own translation is contributed. See the Wikidata findings below                                               |
| Frost-free sowing by wet/dry season                                                                                                                                                                                                                      | Later                      | By temperature is done: Open Garden places windows from `temperatureC` and `minSoilTemperatureC` where frost is rare ([its ADR 0025](https://github.com/thedude459/open-garden/blob/main/docs/adr/0025-sowing-by-temperature-where-frost-is-rare.md)). Wet and dry seasons need new data |
| Per-value `confidence`                                                                                                                                                                                                                                   | If needed                  | Sources are recorded per crop today, optionally per field; add confidence only if reviewers need it                                                                                                                                                                                      |
| Crop icons (CC0, made for the project)                                                                                                                                                                                                                   | Later                      | Photos only from Wikimedia Commons, with per-image license stored alongside                                                                                                                                                                                                              |
| `deprecated: true` and `replacedBy: <id>` on a crop or variety                                                                                                                                                                                           | Before the first removal   | Ids never change and files are never deleted (that would be a major release); a deprecated record points apps at its replacement so plantings can move                                                                                                                                   |
| `soilPh: { min, max }` per crop                                                                                                                                                                                                                          | v0.2                       | Soil-test advice in the app: blueberries need 4.5–5.5, most vegetables 6.0–7.0, potatoes 5.0–6.5                                                                                                                                                                                         |
| `cropCoefficients`: `{ initial, mid, late }` crop coefficients (Kc) and the length of each growth stage in days                                                                                                                                          | v0.2                       | Watering by water balance in the app: daily water use = reference evapotranspiration (ET₀) × Kc for the stage, minus rain. FAO-56 publishes Kc and stage lengths for common crops; write them in our own words and cite it                                                               |
| Seeding data: `seedsPerGram` and typical `germinationRate`                                                                                                                                                                                               | v0.3                       | Seed inventory and a seeds-needed calculator ("this bed needs about 2 g of carrot seed"); in-row spacing and the bed size give the plant count                                                                                                                                           |
| Sensor ranges: `soilMoisturePercent: { min, max }` and `lightDli: { min, max }` (daily light integral, mol/m²/day)                                                                                                                                       | v0.3                       | Open Garden judges moisture and light sensor readings against the crop (`temperatureC` already covers temperature). Values from CC0-compatible sources in our own words; Open Plantbook's ranges need an account and are not CC0, so they cannot be used                                 |
| Variety-level `scientificName`                                                                                                                                                                                                                           | With hot pepper (v0.2)     | Hot pepper is its own crop, but habanero is _Capsicum chinense_ while jalapeño and cayenne are _C. annuum_, so a variety needs its own species                                                                                                                                           |
| A fall sowing window (`fallSow`)                                                                                                                                                                                                                         | v0.2                       | Lettuce, peas, radish, and spinach are sown again for fall; each method has one window today                                                                                                                                                                                             |
| Named rootstocks per tree crop: `rootstocks.<class>.named[]`, each with an `id` and name (M.9, Bud 9, G.41, MM.111, Antonovka), size as a percent of standard, in-row spacing, `hardinessZones: { min, max }`, whether it needs staking, and its sources | v0.3, with the fruit trees | A tree is only as hardy as its rootstock: Bud 9 and G.41 dwarfs take colder winters than M.9, and a size class spans a range of spacings. The three classes stay as the fallback when the rootstock is not known                                                                         |
| Mature height (`heightCm`)                                                                                                                                                                                                                               | v0.3                       | Planning borders and shade (corn, pole beans, sunflowers)                                                                                                                                                                                                                                |
| Bloom season and a toxicity flag                                                                                                                                                                                                                         | With flowers               | For flowers, days to maturity means days to bloom; a flag warns about plants harmful to pets or children                                                                                                                                                                                 |
| New `use` values (cover crops, grains)                                                                                                                                                                                                                   | When needed                | A minor release; apps skip what they cannot read                                                                                                                                                                                                                                         |

## Pests and diseases

From v0.3, `pests.yaml` lists common garden pests and diseases the way
`families.yaml` lists families: an id, a name, the signs to look for, and
organic controls, written in our own words with sources. Crops list the pests
they are prone to (`pests: [aphids, cabbage-worm]`), and companion benefits
can name the pest they act on, with evidence. Crop rotation by family is the
other half of disease control and needs no new data.

## Sources

Only sources whose terms allow CC0 output. The full list, with licenses, is
in [sources.yaml](sources.yaml).

| Source                                                 | License                                     | Use                                                        |
| ------------------------------------------------------ | ------------------------------------------- | ---------------------------------------------------------- |
| Contributor curation                                   | CC0 (contributors agree in the PR template) | Sowing windows and temperatures, written in your own words |
| USDA PLANTS                                            | Public domain                               | Scientific names, US native status                         |
| Wikidata                                               | CC0                                         | Taxonomy, family, common names in many languages           |
| OpenFarm rescue (`thefullnacho/openfarm-crops-rescue`) | CC0 (claimed; check each record)            | Starting point for growing guides, spacing, and companions |
| Seed packets and extension-service guides              | Facts only; write in your own words         | Cross-checking windows and spacing                         |

**Not used:** Growstuff, Permapeople, and Practical Plants (CC BY-SA would
force the whole dataset to BY-SA), PFAF (restrictive terms), and Perenual
(needs a key, and its zone and sowing data is thin).

## Data quality checks

Added to `scripts/catalog.mjs` and CI before outside contributions start:

- **Done: spacing ranges by habit**, to catch spacing in the wrong unit or
  with a stray zero: herbaceous 2–150 cm, vines 2–300 (peas at 5), canes
  20–200, shrubs 15–400 (thyme at 25), trees 150–1,200. Outliers fail with a
  hint. A tomato at `inRow: 18` (inches typed as cm) still passes; no range
  can catch a factor of 2.54 inside a crop's real span.
- **Done: consistency rules:** a variety's days to maturity within its
  crop's range; a frost-tender perennial not hardy below zone 9; minimum soil
  temperature no higher than the optimal air temperature.
- **Done: `wikidataId` per crop** (`Q…`), required, and checked against
  the scientific name by `verify:wikidata`. Names on Wikidata can be corrected or merged; the item
  id stays fixed, and it makes filling names in other languages simple.
- **Done: a completeness report** in the CI summary: which optional fields each crop
  lacks. Trees and perennials leave some out on purpose.
- **Done: a schema for the release file** (`open-garden-catalog-<version>.json`),
  attached to each release, so other apps can validate what they download.
- **Done: a Prettier check** in CI, so formatting does not drift as contributors
  join.

## Pipeline and process

- **Done: release notes that say what changed.** Each release lists the crops and
  varieties added, changed, and deprecated since the previous tag, generated
  from the two builds and attached to the GitHub Release. Reviewers see the
  impact, and Open Garden's planned "Catalog version" page can show the same
  diff.
- **Names in other languages from Wikidata.** Every crop is matched to a
  Wikidata item, and Wikidata's labels are CC0. A script fills
  `names.<locale>` for chosen languages; each addition is still reviewed in a
  pull request. Findings from November 2026: taxon items carry almost no
  common names now (labels moved to the language-neutral `mul`); the food
  item each species links to with "this taxon is source of" (P1672) does,
  and its shortest label was right for about 60% of crop and language pairs
  in de, es, fr, it, nl, and pt. The rest were products (oils, juices,
  sugar), Latin, or missing (blackberry, blueberry, Brussels sprouts,
  celery, leek, mint), and crops that share a species (bush and pole bean,
  the squashes) need names of their own. Expect to curate about two names in
  five by hand. Done as contributions from speakers of each language.
- **A required reviewer once there is a second contributor.** Add
  `CODEOWNERS` so data pull requests need a review from someone other than
  their author. Until then the maintainer reviews their own.
- **Done: apps check each release.** Open Garden's daily
  [Dataset compatibility](https://github.com/thedude459/open-garden/blob/main/.github/workflows/dataset-compat.yml)
  workflow imports the latest release, attestation included, so a release it
  cannot read is caught within a day.

## How changes get in

1. Edit YAML in a pull request. CI checks the schema and the cross-file rules
   (file names, families, sources, window order, unique variety ids, companion
   pairs that refer to real crops).
2. Corrections without YAML: open a
   [plant data issue](https://github.com/thedude459/open-garden-data/issues/new/choose).
3. Later, the Open Garden app lets users suggest a correction on a plant page;
   admins export those as issues or patches here. Households can also keep
   custom varieties in their own garden and offer them upstream.
