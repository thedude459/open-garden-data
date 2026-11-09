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
  `sources.yaml` with its license before using it.
- **Say where advice applies.** Windows assume a temperate climate with frost.
  Put regional caveats in `notes`.

## Your contribution is CC0

By opening a pull request you agree to release your contribution under
[CC0 1.0](LICENSE), the same as the rest of the dataset.

## Making a change

1. Edit or add a file under `crops/`. The file name is the crop id
   (`crops/pole-bean.yaml` has `id: pole-bean`); variety ids start with the
   crop id (`pole-bean-kentucky-wonder`).
2. Run `npm ci`, then `npm run validate` and `npm test`.
3. Open a pull request. CI runs the same checks.

To report a problem without editing YAML, open a
[plant data issue](https://github.com/thedude459/open-garden-data/issues/new/choose).

## Conduct

This project follows the [Contributor Covenant 3.0](CODE_OF_CONDUCT.md).
