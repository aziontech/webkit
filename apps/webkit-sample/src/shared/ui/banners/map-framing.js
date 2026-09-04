// THE MAP'S SLIDE FRAMING — the first crop something else drew on top of.
//
// MapBanner keeps its `panel` crop inline, next to the long derivation that produced it. The
// two here are modules because they are READ TWICE: by the banner, to frame the artwork, and
// by whatever draws ON the artwork — the deck's backdrop slide annotates the map
// with a request travelling from a user to a data centre, and a marker that is not projected
// through the same crop is a marker sitting in the ocean. Two copies of these numbers is the
// one failure this file exists to make impossible.
//
// ── THE CROP ──
//
// The artwork's western two thirds, minus the Arctic: x 0-790, y 50-930 of the 1594x936
// export. What that frames is the WESTERN HEMISPHERE — the Americas from the Canadian Arctic
// to Tierra del Fuego, the whole Atlantic east of them, and the western edges of Europe and
// Africa arriving at the frame's right rule. Each edge is set by something, not chosen:
//
//   y 50-930  the Americas, top to bottom, filling the frame's height exactly. 880 units of
//             latitude in an 886px frame is scale 1.007 — one artwork unit per canvas pixel,
//             a 5.0px cell, the density the marketing band renders this artwork at on a 1920
//             screen. Tierra del Fuego lands ON the bottom rule and only an Arctic sliver is
//             cut off the top.
//   x 790     the east edge, pinned to the frame's right rule by `xMax`. It puts the Atlantic
//             east of Brazil in frame and lets the rule cut through Iberia and West Africa,
//             which is what makes the hemisphere read as a hemisphere rather than as a
//             continent floating in black.
//   x 0       the artwork's own western edge. It lands at 51% of the frame — inside the copy
//             column's wash, which holds canvas to 44% and is gone by 70% — so what the wash
//             covers is the Pacific and the west coast, and everything the ROUTE touches (the
//             eastern seaboard, Brazil, the Atlantic between them) is in the clear.
//
// Two consequences worth knowing before moving any of this. `xMax` pins the east edge, so the
// crop's WIDTH is not a zoom control here: while the fit stays height-constrained, widening or
// narrowing it only moves the artwork's own west edge into or out of the wash. And the
// hemisphere's eastern seaboard sits at ~78% of the frame however it is framed — a route
// between two points 125 units apart in longitude cannot be centred in a window that starts
// at the copy column's edge, so the annotation belongs in the right third by construction.
export const SLIDE_FRAMING = {
  crop: [0, 50, 790, 880],
  fit: 'xMaxYMid meet'
}

// THE HERO'S FRAMING — the marketing band's crop, and now the second one drawn on top of.
//
// The values are MapBanner's own, unchanged; what changed is where they live. They were two
// literals in that file (`'150 115 760 447'` and `'xMaxYMid meet'`) for as long as nothing
// else had to agree with them, and `NetworkBanner` draws requests across the same artwork —
// a mesh is registered to the map by NOTHING but a shared crop, so a second copy of these
// four numbers is the exact failure the file above exists to prevent.
//
// `74 70 912 536` is a ~1.7x zoom on the transatlantic corridor. Its 1.70 ratio is the
// marketing band's own, so a hero at that ratio fills with no letterboxing; `xMax` parks the
// artwork against the outer edge on any band wider than that, which on a bleeding hero is the
// side away from the copy. The zoom is what makes an individual node read as a node rather
// than dissolve into the dot grid — the derivation for that is still in MapBanner, beside the
// panel crop it was reasoned about with.
//
// ── IT WAS `150 115 760 447`, AND THE CROP IS THE ZOOM CONTROL ──
//
// The band is HEIGHT-constrained (the network band is 469px tall against 803.9px of artwork
// column, ratio 1.717, over a 1.70 crop), so the crop's HEIGHT is what sets the scale and its
// width only pans — the same relationship the panel derivation in MapBanner spells out, and
// the opposite of what `xMax` suggests at a glance. Measured on that band at 1440:
//
//   760x447   scale 1.047, a 5.21px cell. The top of the range MapBanner's own framings
//             render at (3.03-5.33px), and the number that file records as reading "as tiles"
//             rather than as a network on the crop it was first measured on.
//   912x536   scale 0.873, a 4.35px cell. SHIPPED. The same 1.70 window opened 20% — near the
//             4.10px the panel lands at on this viewport, in the middle of the range rather
//             than at its ceiling.
//
// It is opened about the crop's own CENTRE (530, 338.5), so the transatlantic corridor stays
// the subject and every edge gains equally: x 74-986 puts the whole Americas in frame with the
// Pacific running into the copy column's wash, and y 70-607 brings the Brazilian coast up off
// the bottom rule, which is where a third of the accent field lives. The east edge moves from
// 910 to 986 — past the accent field's own 861 — so there is more networkless landmass in the
// east than before; that is the price of the wider window, and it is paid on the side the
// hemisphere already reads as context.
export const HERO_FRAMING = {
  crop: [74, 70, 912, 536],
  fit: 'xMaxYMid meet'
}

// THE GLOBE'S FRAMING — the same latitudes, a square crop, and the bleed on the inside.
//
// The vision slide clips the map into a disc and TURNS it, and neither of those works on
// `SLIDE_FRAMING`. Two independent reasons, both geometric:
//
//   A SQUARE WINDOW WANTS A SQUARE CROP. `SLIDE_FRAMING` is 790x880 for a wide band. Fitted
//   with `meet` into the disc's 396px square it is height-constrained (880 units of latitude
//   at scale 0.45 is exactly 396px) and only 355.5px wide — so 40.5px of the disc is
//   structurally empty whatever the alignment does with it. 880 units of longitude is 396px,
//   so the crop below is square and the artwork fills the disc edge to edge.
//
//   `xMin`, NOT `xMax`, BECAUSE THE BLEED HAS TO BE INSIDE THE ELEMENT. An outermost `<svg>`
//   clips to its element box, not to its viewBox — that is what lets a crop's surroundings
//   bleed into whatever `meet` leaves over. But `xMax` pins the crop's RIGHT edge to the
//   element's right edge, which puts everything east of the crop (Europe, Africa, western
//   Asia) outside the box, where `overflow: hidden` deletes it. The disc drifts east into
//   exactly that material. Measured with `xMax`: at the far end of the drift the map ended
//   145px short of the limb and the trailing third of the disc was empty canvas.
//
// The latitudes are deliberately IDENTICAL to `SLIDE_FRAMING`'s (y 50-930), so the globe and
// the backdrop slide's full-bleed map are the same view of the Americas at the same scale —
// two windows onto one world, which is what lets the two slides argue with each other.
export const GLOBE_FRAMING = {
  crop: [0, 50, 880, 880],
  fit: 'xMinYMid meet'
}

// THE PAIRED CROP — the western landmass alone, for two small maps shown side by side.
//
// The versus slide puts two of these maps either side of one divider: the same world twice, and
// the only difference between them is how many lights are on. That is a THIRD framing job, and
// neither of the two above can do it. `SLIDE_FRAMING` is a wide transatlantic band — fitted into
// a 453x676 column it comes out at 2.85px per cell, half the density the artwork reads at, and
// it spends a third of the column on the Atlantic and the edge of Europe, which is not what the
// comparison is about. `GLOBE_FRAMING` is square.
//
// ── THE CROP IS THE LANDMASS'S OWN BOUNDING BOX ──
//
// Measured off the artwork rather than chosen: every drawn cell west of x 645 — the Americas,
// Greenland, and Alaska with its Aleutian tail — occupies x 14.9-642.3, y 5.0-931.0. The crop
// below is that box with 5-10 units of water around it, so NOTHING IS CUT.
//
// That last property is what lets this framing carry no mask (see `layerMask` in MapBanner). A
// crop that slices through a continent has an edge the reader can see, and the artwork then has
// to be faded into the page; a crop drawn around the whole landmass ends at its own coastlines,
// which is an edge nobody has to soften. The hero and the panel fade because they cut; the slide
// and the globe do not fade because a rule and a clip end them. This one does not fade because
// there is nothing there to end.
//
// ── `xMid`, BECAUSE THE PAIR IS MIRRORED ABOUT ONE LINE ──
//
// Both other framings anchor the artwork to an edge (`xMax` against a rule, `xMin` into the
// bleed the disc drifts through). Two maps facing each other across a divider have to be
// centred in their own boxes instead: anchored, the pair would sit lopsided about the line it
// is being compared across, and the composition's symmetry is the whole reason the divider
// reads as a pivot.
//
// The ratio is 0.681 against the versus slide's 0.670 column, so the fit is width-constrained
// by 11px — the crop fills the column and the artwork lands at 3.52px per cell, inside the
// 3.03-5.33px band MapBanner's own three framings already render at.
export const PAIR_FRAMING = {
  crop: [10, 0, 640, 940],
  fit: 'xMidYMid meet'
}

/** `crop` as the `viewBox` attribute string. */
export const viewBoxOf = (framing) => framing.crop.join(' ')

// WHERE THINGS ARE, in artwork units. The map is a ~5000-square dot approximation, not a
// projection anyone should reverse-engineer: each entry below is a point READ OFF the
// rendered artwork (a coordinate grid over Map.svg), on land, near the city it names. They
// are anchors for annotation, never geodesy — and they are here rather than in a deck's
// content file because they are a fact about the artwork, like its viewBox.
//
// ON LAND MEANS INSIDE A SQUARE, and it is worth checking rather than eyeballing: the field is
// a 4.979-unit cell on a 9.957 pitch, so "near the coast" and "in the Atlantic" are twenty
// units apart. `us-east` was [430, 335] — past the mainland's last column (410.7 at this
// latitude; the 420-440 columns two rows north are Nova Scotia running northeast) and visibly
// a marker floating offshore. Each entry below sits INSIDE a drawn square.
export const MAP_PLACES = {
  /** The US eastern seaboard — the mid-Atlantic coast, where us-east lives. */
  'us-east': [412, 333],
  /** Brazil's southeast — the Sao Paulo / Rio coast. */
  'br-southeast': [552, 682],
  /**
   * The US west coast — the northern California coast.
   *
   * Added for the versus slide's legacy map, which marks the handful of regions a centralized
   * cloud actually runs in. Verified the way the two above were: it sits INSIDE a drawn cell
   * (nearest cell centre 174.3 / 363.4, 1.4 units away), not in the Pacific beside one.
   */
  'us-west': [174, 363]
}

// THE ARTWORK'S OWN PoP FIELD, in artwork units — the 78 squares MapBanner picks out of the
// landmass in the brand accent. They are read straight out of that layer's paths (each entry
// is a square's CENTRE: its `M x y` corner plus half of the 4.979-unit cell), so a mesh drawn
// from them lands on the accent squares that are already painted rather than near them.
//
// This is the same class of fact as `MAP_PLACES` and lives here for the same reason: it is a
// property of the artwork, not of any deck. The difference is what it is FOR. `MAP_PLACES`
// names two places because the backdrop slide argues about one distance and needs to label
// both of its ends. This is a FIELD — the nodes are anonymous and interchangeable, which is
// the whole point of drawing traffic across it.
//
// Sorted west to east, so the Americas run out first (x 164-572), then the Atlantic islands
// and Europe (x 662-801), then West Africa and the Mediterranean (x 801-861). Anything east
// of 861 is landmass with no accent on it — the field was rebalanced away from a Brazil-heavy
// export and never extended past the Atlantic world, so a crop that pans much past 861 is
// showing a map with no network on it. That is the constraint the vision slide's drift is
// bounded by, not an accident of this list.
export const MAP_NODES = [
  [164, 363],
  [174, 373],
  [184, 313],
  [184, 393],
  [204, 443],
  [214, 343],
  [214, 403],
  [224, 303],
  [224, 373],
  [234, 433],
  [253, 343],
  [263, 413],
  [263, 443],
  [273, 383],
  [273, 433],
  [283, 313],
  [283, 423],
  [313, 353],
  [323, 303],
  [323, 393],
  [333, 532],
  [353, 323],
  [353, 413],
  [363, 443],
  [373, 363],
  [373, 492],
  [373, 552],
  [383, 393],
  [383, 612],
  [393, 313],
  [393, 652],
  [403, 353],
  [403, 542],
  [403, 682],
  [413, 592],
  [423, 333],
  [423, 492],
  [433, 562],
  [443, 532],
  [443, 602],
  [443, 642],
  [443, 682],
  [472, 612],
  [472, 692],
  [482, 562],
  [492, 771],
  [502, 602],
  [502, 652],
  [512, 682],
  [532, 642],
  [552, 612],
  [552, 672],
  [572, 642],
  [662, 174],
  [682, 542],
  [702, 283],
  [711, 243],
  [721, 363],
  [731, 263],
  [741, 283],
  [751, 303],
  [761, 204],
  [771, 224],
  [791, 293],
  [791, 343],
  [801, 174],
  [801, 214],
  [821, 194],
  [821, 283],
  [821, 313],
  [831, 154],
  [841, 214],
  [841, 253],
  [851, 283],
  [861, 164],
  [861, 194],
  [861, 234],
  [861, 313]
]

const ALIGN = { Min: 0, Mid: 0.5, Max: 1 }

/**
 * Project a point in ARTWORK units onto the box the banner fills.
 *
 * This is exactly what the browser does with `viewBox` + `preserveAspectRatio` `meet`, done
 * by hand because the thing being placed is NOT inside the svg: markers and labels are HTML,
 * so they can carry the design system's own type, shape and colour tokens instead of raw svg
 * numbers. The alternative — drawing them as svg children in artwork units — would place
 * itself for free and then need a font size of 11.2 units and a hand-built pill.
 *
 * `meet` scales by whichever axis constrains and leaves slack on the other; the alignment
 * (`xMaxYMid`) says how that slack is divided. Both are read off the framing, so a change to
 * the crop moves the artwork and the annotation together.
 */
export const projectOnMap = ({ framing, box, point }) => {
  const [cropX, cropY, cropWidth, cropHeight] = framing.crop
  const scale = Math.min(box.width / cropWidth, box.height / cropHeight)
  const [align] = framing.fit.split(' ')
  return {
    x: (box.width - cropWidth * scale) * ALIGN[align.slice(1, 4)] + (point[0] - cropX) * scale,
    y: (box.height - cropHeight * scale) * ALIGN[align.slice(5)] + (point[1] - cropY) * scale
  }
}
