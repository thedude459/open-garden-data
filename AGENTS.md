# Working in open-garden-data

The open plant dataset for [Open Garden](https://github.com/thedude459/open-garden).
Read `CONTRIBUTING.md` (data rules, ids, changelog, releases) and
`ROADMAP.md` (order of work) before changing anything.

- `npm run validate` and `npm test` must pass; `npm run format:check` too.
- A change to the data or schema adds a line under **Unreleased** in
  `CHANGELOG.md`.
- Values come from CC0-compatible sources listed in `sources.yaml`, in our
  own words.
- While working, watch for data gaps, performance gains, and pipeline or CI
  improvements outside the task at hand. Do not make them in the same change.
  Add each as one line under **Ideas** in `ROADMAP.md` (what, why, rough
  size), and list them in the pull request under **Noticed**. Bugs go in a
  GitHub issue labelled `bug`.
