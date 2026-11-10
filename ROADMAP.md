# Roadmap

What the dataset needs next, as releases. The
[Open Garden roadmap](https://github.com/thedude459/open-garden/blob/main/docs/roadmap.md)
sets the order of work across both repositories and says which dataset
version each app feature needs.

## Releases

| Version | Content | The app uses it for |
|---|---|---|
| **v0.1** | Schema v1 and the [first 50 crops](#v01-the-first-50-crops), each with family, habit, use, spacing, and sowing windows | The catalog importer, sowing calendars, crop rotation by family, and typed areas (habit and use decide what an area accepts) |
| **v0.2** | Companion pairs, each with a reason and a source | Companion advice from data instead of only household-entered pairs |
| **v0.3** | About 150 crops: more vegetables and herbs, fruit and nut trees, cane fruit, and soft fruit | Orchard and bramble areas with real plants, and a catalog broad enough for most home gardens |
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
  peach, cherry

Each crop needs at least: English name, scientific name, family, habit, use,
life cycle, frost tolerance, sun, water, in-row spacing, the sowing windows it
is grown by, days to maturity, and its sources. Varieties are optional in
v0.1.

**Decided (November 2026):** a crop is what gardeners grow as one kind, not strictly one
species. Bush and pole beans, or summer squash and pumpkin, differ in habit,
spacing, and timing, so they are separate crops that may share a scientific
name. Varieties sit under a crop.

Open a pull request per crop or small group; say which one you are working
on in an issue first so two people do not research the same crop.

## Schema changes planned

| Change | When | Why |
|---|---|---|
| `companions.yaml` filled, with `kind` = helps, hinders, or attracts-pollinators | v0.2 | Already in the schema; v0.2 adds the data |
| Common names beyond English (`names.<locale>`) | Later | Already allowed by the schema; filled from Wikidata |
| Frost-free sowing by temperature or wet/dry season | Later | Windows tied to frost do not work where it never frosts; `minSoilTemperatureC` is the start |
| Per-value `confidence` | If needed | Sources are recorded per crop today, optionally per field; add confidence only if reviewers need it |
| Crop icons (CC0, made for the project) | Later | Photos only from Wikimedia Commons, with per-image license stored alongside |

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

## How changes get in

1. Edit YAML in a pull request. CI checks the schema and the cross-file rules
   (file names, families, sources, window order, unique variety ids, companion
   pairs that refer to real crops).
2. Corrections without YAML: open a
   [plant data issue](https://github.com/thedude459/open-garden-data/issues/new/choose).
3. Later, the Open Garden app lets users suggest a correction on a plant page;
   admins export those as issues or patches here. Households can also keep
   custom varieties in their own garden and offer them upstream.
