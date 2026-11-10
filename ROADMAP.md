# Roadmap

What the dataset needs next, as releases. The
[Open Garden roadmap](https://github.com/thedude459/open-garden/blob/main/docs/roadmap.md)
sets the order of work across both repositories and says which dataset
version each app feature needs.

## Releases

| Version | Content | The app uses it for |
|---|---|---|
| **v0.1** | Schema v1 and the [first 50 crops](#v01-the-first-50-crops), each with family, habit, use, spacing, and sowing windows | The catalog importer, sowing calendars, crop rotation by family, and typed areas (habit and use decide what an area accepts) |
| **v0.2** | Companion pairs, each with benefits, an evidence level, a reason, and a source; the [companion plants they need](#v02-companion-plants-first) as crops; hot pepper; fall sowing windows | Companion advice from data instead of only household-entered pairs, and fall crops in the calendar |
| **v0.3** | About 150 crops: more vegetables and herbs, fruit and nut trees, cane fruit, and soft fruit; [common pests and diseases](#pests-and-diseases) linked to crops and companions | Orchard and bramble areas with real plants, a catalog broad enough for most home gardens, and pest advice on plant pages |
| **Later** | Frost-free windows, names in other languages, crop icons | Worldwide climate support and a localized catalog |

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

| Change | When | Why |
|---|---|---|
| `companions.yaml` filled, with `kind` = helps, hinders, or attracts-pollinators | v0.2 | Already in the schema; v0.2 adds the data |
| Common names beyond English (`names.<locale>`) | Later | Already allowed by the schema; filled from Wikidata |
| Frost-free sowing by temperature or wet/dry season | Later | Windows tied to frost do not work where it never frosts; `minSoilTemperatureC` is the start |
| Per-value `confidence` | If needed | Sources are recorded per crop today, optionally per field; add confidence only if reviewers need it |
| Crop icons (CC0, made for the project) | Later | Photos only from Wikimedia Commons, with per-image license stored alongside |
| `deprecated: true` and `replacedBy: <id>` on a crop or variety | Before the first removal | Ids never change and files are never deleted (that would be a major release); a deprecated record points apps at its replacement so plantings can move |
| Variety-level `scientificName` | With hot pepper (v0.2) | Hot pepper is its own crop, but habanero is *Capsicum chinense* while jalapeño and cayenne are *C. annuum*, so a variety needs its own species |
| A fall sowing window (`fallSow`) | v0.2 | Lettuce, peas, radish, and spinach are sown again for fall; each method has one window today |
| Mature height (`heightCm`) | v0.3 | Planning borders and shade (corn, pole beans, sunflowers) |
| Bloom season and a toxicity flag | With flowers | For flowers, days to maturity means days to bloom; a flag warns about plants harmful to pets or children |
| New `use` values (cover crops, grains) | When needed | A minor release; apps skip what they cannot read |

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

| Source | License | Use |
|---|---|---|
| Contributor curation | CC0 (contributors agree in the PR template) | Sowing windows and temperatures, written in your own words |
| USDA PLANTS | Public domain | Scientific names, US native status |
| Wikidata | CC0 | Taxonomy, family, common names in many languages |
| OpenFarm rescue (`thefullnacho/openfarm-crops-rescue`) | CC0 (claimed; check each record) | Starting point for growing guides, spacing, and companions |
| Seed packets and extension-service guides | Facts only; write in your own words | Cross-checking windows and spacing |

**Not used:** Growstuff, Permapeople, and Practical Plants (CC BY-SA would
force the whole dataset to BY-SA), PFAF (restrictive terms), and Perenual
(needs a key, and its zone and sowing data is thin).

## Pipeline and process

- **Release notes that say what changed.** Each release lists the crops and
  varieties added, changed, and deprecated since the previous tag, generated
  from the two builds and attached to the GitHub Release. Reviewers see the
  impact, and Open Garden's planned "Catalog version" page can show the same
  diff.
- **Names in other languages from Wikidata.** Every crop is matched to a
  Wikidata item, and Wikidata's labels are CC0. A script fills
  `names.<locale>` for chosen languages; each addition is still reviewed in a
  pull request.
- **A required reviewer once there is a second contributor.** Add
  `CODEOWNERS` so data pull requests need a review from someone other than
  their author. Until then the maintainer reviews their own.
- **Apps check each release.** Open Garden runs its importer against the
  latest release on a schedule, so a release it cannot read is caught early.

## How changes get in

1. Edit YAML in a pull request. CI checks the schema and the cross-file rules
   (file names, families, sources, window order, unique variety ids, companion
   pairs that refer to real crops).
2. Corrections without YAML: open a
   [plant data issue](https://github.com/thedude459/open-garden-data/issues/new/choose).
3. Later, the Open Garden app lets users suggest a correction on a plant page;
   admins export those as issues or patches here. Households can also keep
   custom varieties in their own garden and offer them upstream.
