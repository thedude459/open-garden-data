# Changelog

What each release changes, in plain words. Every pull request adds a line
under **Unreleased**, in the section it belongs to (a CI check asks for it;
see [CONTRIBUTING](CONTRIBUTING.md#changelog-and-releases)). The Release
workflow publishes a version's entry as its release notes, in The Good Docs
Project's layout, followed by a generated list of the crops and fields that
changed.

Sections, in this order (leave one empty when nothing belongs there):
**Summary** (one or two sentences, written when the release is cut), **New
features**, **Improvements**, **Bug fixes**, **Documentation** (the README,
CONTRIBUTING, the icon style guide, and other guides), **Security** (a dataset release
has no code that runs, so this is normally empty and the notes say "Not
applicable"), **Known issues**, and **Deprecated features** (crops or fields a
later release removes; see "Ids never change" in CONTRIBUTING).

## Unreleased

### Summary

### New features

- **References** (`references.yaml`): every guide, paper, database, and
  regulation the dataset cites, once, with its address, 45 in all. Companion
  pairs, pest regions, and `occursIn` cite them by id in `references`, so an
  app can link to the guide behind any advice, and the release file carries
  them. Citations that named only "UMN" or "Clemson" now say which guide.

### Improvements

### Bug fixes

### Documentation

- CONTRIBUTING says how to cite a guide or paper.

### Security

### Known issues

### Deprecated features

## v0.3.2 (2026-11-26)

### Summary

Pests and diseases for integrated pest management: 26 to start, from
aphids and squash vine borer to codling moth, apple scab, and fire blight,
each with the crops it attacks, when to scout, and controls in IPM order.
Guidance is by region, with the countries a pest lives in where EPPO
records them, and products allowed in organic growing come before
conventional ones.

### New features

- **Pests and diseases** (`pests.yaml`), organized for integrated pest
  management, 26 to start. Vegetables: aphids, flea beetles, twospotted
  spider mite, Colorado potato beetle, tomato hornworm, brown marmorated stink
  bug, squash bug, squash vine borer, cucumber beetles, imported cabbageworm,
  cabbage looper, Mexican bean beetle, onion thrips, and carrot rust fly.
  Fruit: Japanese beetle, spotted wing drosophila, codling moth, and plum
  curculio. Diseases: early blight, late blight, Septoria leaf spot,
  bacterial wilt and powdery and downy mildew of cucurbits, apple scab, and
  fire blight. Each names the crops it attacks, how to recognize it, the crop
  stages to scout at, and the controls that work anywhere, in IPM order
  (cultural, physical, biological). What changes with place is per region:
  when to look, the threshold for acting, and products, least toxic first,
  since each country allows its own. Products allowed in organic growing
  (`organic`, by the US National Organic Program in US regions) come before
  conventional ones (`conventional`), and apps show organic options by
  default. Each region names its country
  and zones, so an app can pick guidance near a garden; guidance comes from
  Minnesota, Maryland, North Carolina, South Carolina, New Hampshire, Utah,
  and California, and Septoria leaf spot has two regions. `occursIn` lists the countries a pest lives in, from
  EPPO's Global Database, for the nine it records, among them Colorado potato
  beetle (49 countries; absent from others such as Great Britain, Ireland,
  Japan, and Norway), Japanese beetle (10), codling moth (71), and plum
  curculio (Canada and the US only). EPPO
  records distribution only for regulated pests, so the rest have none yet,
  which apps read as not known.
- A pest has `names` by locale, as crops do, and `aliases` for search
  ("cabbage white" finds the imported cabbageworm).
- Companion pairs that act on a pest name it (`pests`), so an app can show
  the trap crops and deterrents for a pest; 21 pairs do, 12 of them for the
  cabbage looper as well as the imported cabbageworm.

### Improvements

### Bug fixes

### Documentation

- CONTRIBUTING says how to write a pest or disease.

### Security

### Known issues

### Deprecated features

## v0.3.1 (2026-11-24)

### Summary

Fruit for Open Garden's fruit gardens: named rootstocks for apple, pear,
sweet cherry, and peach, and 17 more fruits and nuts (107 crops in all),
from trees to bushes and woody vines, with soil pH, varieties, and
warnings to keep berries away from the tomato family.

### New features

- **Keep berries away from the tomato family:** 16 companion pairs warn
  against planting strawberries, raspberries, or blackberries beside or
  after tomatoes, potatoes, eggplant, or peppers (and raspberries after
  strawberries), which carry Verticillium wilt in the soil. From Utah
  State, Penn State, and Illinois extension guides.
- **Varieties for thirteen fruits and nuts**, as named in extension
  guides: almond, apricot, aronia, Asian pear, elderberry, fig, gooseberry,
  haskap, pawpaw, American persimmon, plum, red currant, and sour cherry
  (for example Montmorency and North Star, Hosui and Shinseiki, Poorman and
  Invicta). Sources: Utah State, New Hampshire, Penn State, Minnesota,
  North Carolina State, and Alabama.
- **Soil pH for twelve fruits**, so soil tests give advice for them:
  plum, apricot, and sour cherry (6.0 to 7.0, New Hampshire), nectarine
  and Asian pear (6.0 to 6.5, Penn State), fig (6.0 to 6.5, North Carolina
  State), pawpaw (5.5 to 6.5, Missouri), American persimmon (4.4 to 7.0,
  Mississippi State), aronia (5.1 to 6.5, Minnesota), hardy kiwi (5.6 to
  6.5, Oregon State), elderberry (5.5 to 7.0, Utah State), and grape (5.5
  to 7.0, Penn State). Almond, haskap, and hazelnut wait for a source.
- **Pawpaw, American persimmon, and aronia:** native fruits, with zones,
  spacing, and pollination from Clemson, Maryland, Penn State, Illinois,
  Minnesota, Missouri, Oregon State, and North Carolina State guides, and
  icons drawn to the style guide. Two families join (Annonaceae,
  Ebenaceae). Quince, mulberry, and serviceberry wait for a source giving
  both their zones and spacing.
- **Grape, hardy kiwi, and haskap:** grape covers American and cold-hardy
  hybrid grapes (zones 3 to 8, with Concord, Marquette, and Bluebell), hardy
  kiwi needs a male vine near the females, and haskap needs a second
  variety. Values from Illinois, Minnesota, Oregon State, and Utah State
  guides and the Fedco Trees catalog; crop coefficients from FAO-56
  (table grapes, kiwi, and berry bushes); icons drawn to the style guide.
  Three families join for them (Actinidiaceae, Caprifoliaceae, Vitaceae).
- Red currant, gooseberry, and elderberry get FAO-56's berry-bush crop
  coefficients, and the named apple, pear, cherry, and plum rootstocks get
  hardiness zones from the Fedco Trees catalog; Antonovka joins as apple's
  hardiest standard rootstock.
- **Seven more fruits and nuts:** nectarine and sour cherry (trees), red
  currant, gooseberry, elderberry, and fig (shrubs), and hazelnut, with
  zones, spacing, pollination, and site advice from Utah State, Minnesota,
  Penn State, Oregon State, Illinois, Wisconsin, North Carolina State,
  Georgia, and Alabama guides. Four families join for them (Betulaceae,
  Grossulariaceae, Moraceae, Viburnaceae). New icons were drawn for sour
  cherry, red currant, gooseberry, elderberry, fig, and hazelnut; nectarine's
  comes from `icons/library/`.
- **Four tree crops:** apricot and European plum (zones 5 to 8), almond
  (zones 6 to 9), and Asian pear (zones 5 to 8), with spacing, pollination,
  and spring-frost advice from Utah State, University of California,
  Oregon State, North Carolina State, Georgia, and Alabama guides, crop
  coefficients from FAO-56 Table 12, and named rootstocks for plum and
  Asian pear.
- **Named rootstocks** (`rootstocks.<class>.named`): each rootstock a
  nursery sells by name, in the size class it falls in, with its size as a
  percent of a standard tree, spacing where it differs, whether the tree
  needs support, and notes on hardiness, soil, and disease. Apple has 17
  (Bud 9 to seedling, including the Geneva series), pear 10, sweet cherry 9
  (Gisela 3 to Mazzard), and peach 7. Where sources give different sizes,
  the range spans them. Sources: Kentucky (HO-82), West Virginia, Penn
  State, Maryland, Minnesota, New Hampshire, and Alabama extension guides;
  Oregon State's PNW 619; Michigan State; Ontario's peach guide; UC Davis Foundation Plant
  Services rootstock records; Cornell and Virginia Tech cold and
  spring-frost trials. The size classes stay the fallback when the
  rootstock is not known.

### Improvements

### Bug fixes

- The stevia icon no longer starts with an XML declaration, and the icon
  check now requires every icon to start with `<svg`, so apps can inline
  them as released.

### Documentation

### Security

### Known issues

- Almond, haskap, and hazelnut have no soil pH, and nectarine and
  hazelnut no varieties, until a source is found.
- Fig, hazelnut, pawpaw, and American persimmon have no crop coefficients
  (FAO-56 does not list them), so Open Garden waters them on a fixed
  interval.

### Deprecated features

## v0.3.0 (2026-11-23)

### Summary

The first v0.3 release: 32 more vegetables and herbs, for 90 crops in all,
each with values from named extension guides and, for most, crop
coefficients for watering by water balance.

### New features

- **Eight more vegetables and herbs:** fava bean, bunching onion, black
  salsify, watercress, chamomile, garlic chives, lovage, and stevia. Fava
  bean, black salsify, garlic chives, and lovage have no frost-anchored
  date in any guide found, so they take the windows of pea, salsify, and
  chives, and their `notes` say so; lovage's and stevia's hardiness zones
  come from seed-company guides. Crop coefficients from FAO-56 for fava bean
  and bunching onion (green onions), Pereira et al. (2024) for chamomile and
  stevia, and FAO-56's root group for black salsify.
- **Seven more crops:** napa cabbage, celeriac, endive, salsify, radicchio,
  peanut, and lemongrass, from Maryland, Penn State, Washington State, Utah
  State, Minnesota, and Clemson extension guides, named in each crop's
  `notes`. Crop coefficients come from Pereira et al. (2024) for napa
  cabbage, celeriac, and endive; from FAO-56 for peanut (groundnut); and
  from FAO-56's group values for salsify (roots and tubers) and radicchio
  (small vegetables). Lemongrass has none.
- **Shallot**, from Utah State, Washington State, and Maryland guides, with
  FAO-56's dry-onion crop coefficients and spring and fall planting windows
  from Maryland's calendar.
- **Sixteen crops:** the vegetables kohlrabi, turnip, rutabaga, collards,
  lima bean, edamame, tomatillo, arugula, bok choy, mustard greens, and
  Florence fennel, and the herbs lemon balm, lavender, rosemary, sage, and
  sweet marjoram. Each has spacing and sowing windows, and where a guide
  gives them soil pH, a sowing soil temperature, and hardiness zones. Values
  come from extension guides (Utah State, Minnesota, Colorado State, Penn
  State, Clemson, Wisconsin, Oregon State, Maine, Maryland, Missouri, Texas
  A&M, Illinois, and Florida), named in each crop's `notes`. Crop
  coefficients come from Pereira et al. (2024) for collards, lima bean,
  arugula, bok choy, lemon balm, lavender, and rosemary; from FAO-56 for
  turnip and rutabaga; and from FAO-56's group values for kohlrabi, mustard
  greens, Florence fennel, and tomatillo. Edamame, sage, and marjoram have
  none: FAO-56's soybean values are for a dry-seed harvest, and no open
  source covers the two herbs. Icons come from `icons/library/`.

### Improvements

- Bok choy has days to maturity (30 to 50), and mustard greens' `notes`
  give the spacing for full-size plants, from Washington State's
  _Home Vegetable Gardening in Washington_ (EM057E).

### Bug fixes

### Documentation

### Security

### Known issues

- Fava bean, black salsify, garlic chives, and lovage borrow the sowing
  windows of pea, salsify, and chives, as no guide found ties them to frost
  dates; lovage's and stevia's hardiness zones come from seed-company guides.
- Edamame, sage, marjoram, lemongrass, garlic chives, lovage, and watercress
  have no crop coefficients, so Open Garden waters them on a fixed interval.

### Deprecated features

## v0.2.3 (2026-11-23)

### Summary

Crop icons, shipped with each release, and the gaps in today's crops
filled: crop coefficients for 12 more crops (51 of 58 now) and soil
temperatures for sowing borage and calendula.

### New features

- **Crop icons** in `icons/`: one colour SVG per crop, named by crop id, and
  a check that every crop has one and that each is a plain drawing. 51 come
  from OpenFarm's [open-crop-icons](https://github.com/openfarmcc/open-crop-icons)
  (CC0), credited in `icons/CREDITS.md`; calendula, comfrey, marigold,
  nasturtium, rhubarb, sweet alyssum, and tansy were drawn to match. The rest
  of that set is in `icons/library/` for crops still to come, and
  `icons/README.md` is the style guide for new icons.
- **Releases ship the icons:** each release attaches
  `open-garden-icons-<version>.zip`, signed like the catalog, so an app can
  take the icons of the version it pins.

### Improvements

- **Crop coefficients for seven more crops:** kale, basil, cilantro, parsley,
  oregano, thyme, and okra now have `cropCoefficients { initial, mid, end }`,
  from the standard values in Table 7 of Pereira, Mota, Raziei, and Paredes
  (2024), "Water requirements and crop coefficients of edible, spicy and
  medicinal herbs and vegetables", _Irrigation Science_ 42:1199–1228
  (doi:10.1007/s00271-024-00960-4), values unchanged, used under
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The review gives no stage
  lengths, so none are set. Each
  crop's `notes` cites the review.
- **Crop coefficients from FAO-56's group values** for five crops FAO-56
  does not list by name, as v0.2.1 did for the cane berries: rhubarb takes
  the perennial vegetables with winter dormancy (0.5 / 1.00 / 0.80); chives
  take green onions' mid and end with the small-vegetable initial value
  (0.7 / 1.00 / 1.00); leek, Swiss chard, and dill take the small-vegetable
  group (0.7 / 1.05 / 0.95). No stage lengths. Each crop's `notes` says so.
  The companion flowers still have none.
- **Calendula's soil temperature for sowing:** 16 °C (`minSoilTemperatureC`),
  from UNH Extension's "How to grow calendula" (60 °F), so its sowing window
  works where frost is rare; its `notes` cite the guide.
- **Borage's soil temperature for sowing:** 10 °C, from the Ontario Ministry
  of Agriculture's borage crop profile (above 10 °C at planting), in line
  with a North Dakota State University germination study (9 °C minimum).
  Sweet alyssum still has none: the figures found are seed companies'
  germination optimums, not a minimum.
- Release notes start with the Summary under a release titled with the
  version, and have a Documentation section for guide and install changes.

### Bug fixes

### Documentation

### Security

### Known issues

- The seven companion flowers have no crop coefficients, and sweet alyssum
  no soil temperature for sowing: no open source gives them yet.

### Deprecated features

## v0.2.2

Companion plants: the last of v0.2's three small releases.

- **31 companion pairs** in `companions.yaml`, drawn from research trials and
  extension guidance only (no lore): trap crops (Blue Hubbard squash for
  squash bugs and cucumber beetles), plants that deter or distract pests
  (nasturtium, marigold, thyme, and onion with squash and cabbage-family
  crops; marigold and basil with tomato), plants that feed beneficial
  insects (sweet alyssum and cilantro with lettuce; dill, parsley, and tansy
  with cabbage and broccoli, for the wasps and flies that attack cabbage
  caterpillars), the three sisters, and
  flowers for pollination. Three pairs to keep apart: tomato and potato
  (late blight), potato and eggplant (Colorado potato beetle), tomato and
  sweet corn (corn earworm).
- **Each pair now carries** `benefits`, `evidence` (research, extension, or
  traditional), `shownIn` (where it was shown, with USDA hardiness zones),
  and `reference` (the studies or extension guides behind it). `kind` is
  now `helps` or `hinders`; attracting pollinators moved to `benefits`.
  No release had companion pairs before, so nothing used the old values.
- **Seven new crops:** marigold (French), nasturtium, borage, calendula,
  sweet alyssum, tansy, and comfrey. Tansy draws beneficial insects but is
  invasive in much of North America and toxic, and as a potato companion it
  did not reduce Colorado potato beetle in field trials; its notes say all
  three. Comfrey is grown for potassium-rich leaves to mulch with; its notes
  cover its pollinators, its spreading roots, and why it must not be eaten.
  No source I could reach supports a comfrey companion pair, so none is
  listed.
- **Two families:** borage (Boraginaceae) and nasturtium (Tropaeolaceae).
- **Validation:** a pair's benefits must match its kind, research and
  extension pairs need a reference, and every pair says where it was shown.

Sources read: University of Minnesota Extension, Clemson Cooperative
Extension HGIC, UC IPM, University of Maine and UNH Extension; studies cited
by them (Iowa State, University of Missouri, University of Florida, PLOS ONE,
Agronomy, Entomologia Experimentalis et Applicata), and Moreau et al. (2006),
Biological Agriculture & Horticulture 23(4), on companions for Colorado
potato beetle.

## v0.2.1

Crop coefficients, for watering by water balance: a crop uses about
reference evapotranspiration (ET0) × its crop coefficient (Kc).

- **`cropCoefficients { initial, mid, end }`** on 39 crops: Kc while young,
  at full cover, and at harvest or leaf fall, from FAO Irrigation and
  Drainage Paper 56 (FAO-56), Table 12.
- **`cropCoefficients.stageDays { initial, development, mid, late }`** on 32
  of them: typical days in each stage from FAO-56 Table 11, taken from the
  first row planted in March to May (or its only row). Apps scale the stages
  to the crop's days to maturity. Garlic, parsnip, mint, strawberry, and the
  cane and bush berries have no Table 11 row, so no stage lengths.
- Where FAO-56 groups or splits crops: hot pepper uses bell pepper's values;
  melon uses "sweet melons"; Brussels sprouts use the "crucifers" stage row;
  apple, pear, and sweet cherry use the orchard values without ground cover
  and with a killing frost, peach the stone-fruit ones; raspberry,
  blackberry, and blueberry use "berries (bushes)"; tomato's end value is
  0.80, the middle of FAO-56's 0.70–0.90.
- Not in FAO-56, so left out: basil, chives, cilantro, dill, kale, leek,
  okra, oregano, parsley, rhubarb, Swiss chard, thyme.
- Validation: `cropCoefficients.mid` must be at least `initial` and `end`.

## v0.2.0

The first of v0.2's small releases: soil pH for every crop, a fall sowing
window, and hot pepper.

- **`soilPh { min, max }`** on all 51 crops: the soil pH each grows best in.
  Most vegetables are 6.0–7.0; blueberry is the outlier at 4.5–5.5. Required
  from this release on.
- **`windows.fallSow`**: a second outdoor sowing for a fall crop, counted back
  from the first fall frost. Lettuce (8–4 weeks before), pea (12–10), radish
  (6–2), and spinach (8–4).
- **Hot pepper** (_Capsicum annuum_), with Jalapeño and Cayenne varieties.
- Validation: `windows.fallSow` must count from the first frost, and
  `soilPh.min` must not be above `max`.
- Every crop now carries its `wikidataId`, checked against Wikidata.

Soil pH and fall sowing values are hand-curated, in line with common
extension-service guidance.

## v0.1.0

The first release: schema v1 and 50 crops, each with family, habit, use,
spacing, and sowing windows.
