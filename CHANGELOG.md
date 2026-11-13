# Changelog

What each release changes, in plain words. A pull request that changes the
data or the schema adds a line under **Unreleased**. To release, rename
**Unreleased** to the version (`## v0.2.1`), start a new empty **Unreleased**
above it, merge, and push the tag. The release workflow puts the version's
section at the top of the release notes, followed by a generated list of the
crops and fields that changed.

## Unreleased

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
