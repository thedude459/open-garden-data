# Crop icons

One colour drawing per crop, for apps to show beside the crop's name. The set
continues OpenFarm's [open-crop-icons](https://github.com/openfarmcc/open-crop-icons),
which most of these come from: see [CREDITS.md](CREDITS.md). Like the rest of
this repository, the icons are CC0.

## Files

- `icons/<crop id>.svg`: the icon for a crop in `crops/`, named by its id.
  Every crop needs one, and the check (`npm run validate`, `npm test`) fails
  without it. A crop's icon covers all its varieties.
- `icons/generic-plant.svg` and `icons/generic-flower.svg`: for plants that
  have no icon of their own.
- `icons/library/<name>.svg`: drawings with no crop in the catalog yet, most
  from open-crop-icons. When a crop is added, look here first: rename or move
  the drawing to `icons/<crop id>.svg`.

Ids never change, so an icon's file name never changes either.

## Style guide

This builds on open-crop-icons' own style guide
([issue #8](https://github.com/openfarmcc/open-crop-icons/issues/8)) and on how
its drawings look. A new icon should sit beside the existing ones without
standing out.

### Subject

- Draw the part people grow the crop for: the fruit, root, head, leaves, or
  flower. Show a sprig or leaf with it only where that is what makes the crop
  recognisable (a carrot's tops, a cherry's stem).
- One item, or a small group where the crop grows that way (a bunch of chives,
  a cluster of cherries).
- Seen from the front or a slight three-quarter angle, upright or on a gentle
  diagonal from lower left to upper right.
- Fill the square: centred, touching or nearly touching two opposite edges,
  with the background left transparent. No ground, pot, frame, or text.

### Colour and light

- Flat colour. **No gradients**, patterns, shadows, or blur.
- Colours bright but slightly desaturated, close to the real crop. Keep the
  palette small: usually three to six colours.
- Each shape has a darker shade of its own hue, either as an outline or as a
  band along its lower right edge. Dark outlines are about 3% of the canvas
  wide (2 units on a 64-unit canvas).
- Light comes from the **top left**: small white or pale highlights near the
  upper left of round shapes, and the darker shades on the lower right.
- Greens most of the set share, to reuse for leaves and stems: `#7cab09`
  (leaf), `#4e670c` (its outline), `#c0cc8f` (veins).

### Sizes

- Apps show icons at 24, 32, and 64 pixels, and sometimes larger. Check the
  drawing at all three: at 24 px it must still read as that crop, so drop
  small detail that turns to noise and keep contrast high.
- Use a square `viewBox`. `0 0 64 64` is preferred for new icons; imported
  ones use other sizes, which is fine.

### File

- SVG only, as plain drawing: paths and basic shapes, fills and strokes.
- Keep strokes as strokes; do not convert them to shapes.
- Name groups by what they are (`id="highlight"`, `id="outline"`), not
  `Layer_1`, where the drawing has layers.
- No scripts, event handlers, embedded images, fonts or text, or links to
  other files. The check refuses them, because apps put these files on their
  pages.
- Aim for under 20 kB. Simplify paths exported from a drawing program. The
  check refuses anything over 150 kB.

## Adding an icon

1. Draw it to the style guide, or adapt a CC0 or public-domain drawing (say
   where it came from in [CREDITS.md](CREDITS.md)). Nothing under another
   licence.
2. Save it as `icons/<crop id>.svg` (or in `icons/library/` if there is no
   crop for it yet).
3. Look at it at 24, 32, and 64 px next to a few existing icons.
4. Run `npm test`, and note the new icon in `CHANGELOG.md`.
