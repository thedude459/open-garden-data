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

### Improvements

### Bug fixes

### Documentation

### Security

### Known issues

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
