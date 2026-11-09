# Open Garden Data

[![Validate](https://github.com/thedude459/open-garden-data/actions/workflows/validate.yml/badge.svg)](https://github.com/thedude459/open-garden-data/actions/workflows/validate.yml)
[![License: CC0-1.0](https://img.shields.io/badge/license-CC0--1.0-green)](LICENSE)

An open dataset of garden crops for home growers: sowing windows relative to
frost, spacing, crop families for rotation, growth habit, and companion pairs.
It is dedicated to the public domain under [CC0 1.0](LICENSE), so anyone can
use it for anything, no attribution required.

[Open Garden](https://github.com/thedude459/open-garden) uses it as its plant
catalog, but nothing here depends on that app.

## Layout

| Path | What it holds |
|---|---|
| `crops/<id>.yaml` | One crop (species level) per file, varieties nested |
| `families.yaml` | Botanical families, used for crop rotation |
| `companions.yaml` | Companion pairs: two crops, a kind, a reason, a source |
| `sources.yaml` | Every source, with its license and URL |
| `schema/crop.schema.json` | JSON Schema for a crop file |
| `scripts/catalog.mjs` | Validates the data and builds the release file |

Units are metric: centimetres and degrees Celsius. Sowing windows are in weeks
relative to the last spring frost or the first fall frost (negative means
before), with a minimum soil temperature as the fallback where there is no
frost.

## Releases

Each [release](https://github.com/thedude459/open-garden-data/releases)
attaches `open-garden-catalog-<version>.json`, its SHA-256, and a build
provenance attestation. Verify a download with:

```bash
gh attestation verify open-garden-catalog-0.1.0.json --owner thedude459
```

Versions follow semver: a new major version means a field was removed or
changed meaning; minor versions add crops or fields.

## Working on the data

```bash
npm ci
npm run validate   # schema and cross-file checks
npm test
npm run build -- 0.1.0
```

See [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.
