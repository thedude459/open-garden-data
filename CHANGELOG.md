# Changelog

What each release changes, in plain words. A pull request that changes the
data or the schema adds a line under **Unreleased**. To release, rename
**Unreleased** to the version (`## v0.2.1`), start a new empty **Unreleased**
above it, merge, and push the tag. The release workflow puts the version's
section at the top of the release notes, followed by a generated list of the
crops and fields that changed.

## Unreleased

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
