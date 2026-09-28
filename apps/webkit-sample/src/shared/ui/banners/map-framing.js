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
// `15 175 860 536` is the ACCENT FIELD'S OWN WINDOW. Both longitudes are measured off the
// artwork rather than chosen, and `xMax` parks the crop's east edge against the band's outer
// edge — on a bleeding hero, the side away from the copy:
//
//   x 15    the artwork's own western edge (the landmass bounding box under PAIR_FRAMING
//           starts at 14.9), so the band opens on the first drawn cell and no empty Pacific
//           is paid for on the side the copy column sits over.
//   x 875   4 units past the easternmost accent square (871). Everything east of that is
//           landmass with no network on it — see MAP_NODES, which says so about its own
//           eastern end — so this is where the right rule stops standing on a map that has
//           nothing left to say. It was 986, which put 125 units of silent Asia at the rule.
//
// ── THE CROP'S WIDTH IS THE ZOOM CONTROL, ON HALF THE BANDS ──
//
// This note used to say the band is HEIGHT-constrained and the width only pans. That is true
// of two of the four bands that render this crop, and the opposite is true of the other two.
// Measured at 1440 — artwork box, constrained axis, cell:
//
//   /site/home           804x761   WIDTH    4.65px
//   /site/solutions/web-apps       804x604   WIDTH    4.65px
//   /site/azion-heros   1386x844   HEIGHT   7.84px, 32px of slack west of the crop
//   /site/products/our-network   1386x583   HEIGHT   5.42px, 451px of slack west of the crop
//
// So pulling the east edge in ZOOMS the two tall boxes and only pans the two wide ones, and
// that is why `y` had to move with it. On a width-constrained band the visible latitude is the
// box height over the scale, so trimming 986 -> 875 costs 36 units of south — which is the one
// direction this crop could least afford, the Americas being what it is for. `y 175` pays that
// back: the northernmost accent square (Helsinki, 211.6) sits 37 units inside the top rule, and
// what the pan spends is the Canadian Arctic and Greenland, which carry no accent at all.
//
// Sampled on the home band with this crop, p99 over the Atlantic half (no copy in that region):
// coastline 51, accent 240 — a 4.7x lead, against the 2.3x MapBanner keeps as the hero's floor.
export const HERO_FRAMING = {
  crop: [15, 175, 860, 536],
  fit: 'xMaxYMid meet'
}

export const NETWORK_FRAMING = {
  crop: [15, 415, 860, 1000],
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

// THE ARTWORK'S OWN PoP FIELD, in artwork units — the 172 squares MapBanner picks out of the
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
// Sorted west to east, so the Americas run out first (x 154-573), then Europe and Africa (x 672-911).
// Anything east of 911 is landmass with no accent on it, so a crop that pans much past it is
// showing a map with no network on it. That is the constraint the vision slide's drift is
// bounded by, not an accident of this list.
export const MAP_NODES = [
  [154, 254],
  [164, 274],
  [174, 264],
  [174, 294],
  [174, 353],
  [174, 373],
  [184, 393],
  [194, 274],
  [194, 314],
  [194, 353],
  [194, 373],
  [194, 403],
  [214, 373],
  [214, 393],
  [234, 363],
  [234, 383],
  [254, 363],
  [254, 443],
  [254, 463],
  [254, 483],
  [264, 353],
  [264, 403],
  [264, 423],
  [274, 443],
  [274, 463],
  [274, 483],
  [284, 344],
  [284, 403],
  [294, 423],
  [304, 324],
  [304, 413],
  [304, 503],
  [314, 513],
  [324, 324],
  [324, 363],
  [324, 403],
  [334, 344],
  [334, 523],
  [344, 393],
  [353, 324],
  [353, 353],
  [353, 373],
  [353, 403],
  [353, 423],
  [353, 463],
  [353, 543],
  [353, 612],
  [363, 443],
  [363, 642],
  [373, 334],
  [373, 363],
  [373, 483],
  [373, 543],
  [373, 563],
  [373, 592],
  [373, 612],
  [383, 314],
  [383, 383],
  [383, 642],
  [383, 662],
  [393, 353],
  [393, 483],
  [393, 533],
  [393, 563],
  [393, 583],
  [403, 324],
  [403, 682],
  [403, 802],
  [413, 344],
  [413, 483],
  [413, 583],
  [413, 662],
  [413, 782],
  [423, 304],
  [423, 493],
  [423, 682],
  [433, 324],
  [433, 543],
  [433, 563],
  [433, 792],
  [443, 612],
  [453, 543],
  [453, 592],
  [463, 612],
  [463, 712],
  [463, 742],
  [463, 782],
  [473, 732],
  [473, 762],
  [473, 792],
  [473, 812],
  [493, 752],
  [493, 782],
  [503, 712],
  [503, 762],
  [513, 752],
  [523, 662],
  [523, 682],
  [523, 702],
  [523, 722],
  [543, 612],
  [543, 642],
  [543, 672],
  [543, 692],
  [543, 712],
  [553, 662],
  [563, 622],
  [573, 642],
  [672, 483],
  [682, 503],
  [692, 373],
  [702, 363],
  [702, 413],
  [712, 274],
  [712, 344],
  [712, 433],
  [722, 264],
  [722, 383],
  [732, 254],
  [732, 294],
  [732, 353],
  [742, 284],
  [742, 324],
  [742, 363],
  [742, 553],
  [762, 304],
  [762, 324],
  [762, 403],
  [762, 543],
  [772, 284],
  [782, 204],
  [782, 224],
  [782, 304],
  [782, 413],
  [792, 274],
  [792, 294],
  [792, 324],
  [802, 204],
  [802, 224],
  [802, 244],
  [802, 344],
  [812, 274],
  [812, 314],
  [812, 363],
  [812, 632],
  [821, 204],
  [821, 224],
  [821, 284],
  [821, 304],
  [821, 612],
  [831, 443],
  [841, 214],
  [841, 244],
  [841, 274],
  [841, 304],
  [841, 324],
  [841, 423],
  [841, 772],
  [851, 353],
  [851, 373],
  [851, 752],
  [861, 214],
  [861, 264],
  [861, 284],
  [861, 304],
  [861, 324],
  [871, 234],
  [871, 363],
  [891, 722],
  [901, 622],
  [911, 602],
  [911, 712]
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
