# The deck build preamble

Paste this block at the top of **every** `use_figma` build script for the deck, verbatim, per
batch. It is not a module this repo executes — it runs inside Figma's plugin context, where
`figma` is a global and the helpers are called by the script that follows.

```js
// build-preamble.js — paste this at the top of EVERY `use_figma` build script for the deck.
//
// Copy it verbatim, per batch, without re-deriving it. The whole point of a preamble is that
// slide 11 is built from the same palette object as slide 1; a palette re-typed per batch is a
// deck that changes colour halfway through.
//
// Values come from apps/webkit-sample/src/preview/lib/deck-canvas.js — the module the HTML
// preview also reads — resolved for the DARK theme, which is the only theme this deck has.
// If a value here ever disagrees with that module, the module wins: regenerate, do not patch.

// ── Geometry ────────────────────────────────────────────────────────────────────────────
const CANVAS = { w: 1920, h: 1080 }
const FRAME = { x: 150, y: 96, w: 1620, h: 888 } // --container-7xl, inset --spacing-xxl vertically
const PAD = 96 // --spacing-xxl @ xl
const CONTENT = { x: 246, y: 192, w: 1428, h: 696 }
const MARK = { size: 6, inset: 4 } // corner registration tick, inside both rules
// The cover's own shape (the `cover` kind only) — see deck-canvas.js § COVER.
const COVER = {
  radius: 32,
  joint: 16,
  chamfer: 120, // sized by the marks' row, which has to clear the diagonal (x + y < chamfer)
  stroke: 2, // border-2, in --border-strong (not the deck's --border-default hairline)
  marks: { size: 12, gap: 12, inset: 12 },
  panel: { columns: 5, inset: 24 },
  dither: { pitch: 24, dot: 6, from: 0.06, to: 0.92, ink: 0.85 }
}
const GRID = { columns: 12, column: 97, gutter: 24 } // 12*97 + 11*24 = 1428 exactly
const span = (n) => n * GRID.column + (n - 1) * GRID.gutter
const colX = (i) => CONTENT.x + i * (GRID.column + GRID.gutter)

// ── Palette (dark) ──────────────────────────────────────────────────────────────────────
// Plugin API colours are 0-1 floats. Prefer BINDING a Figma variable from the Webkit library
// (see SKILL.md § Bind variables); these literals are the fallback when a token has no variable.
const C = {
  canvas: { r: 0, g: 0, b: 0 }, // --bg-canvas          #000000
  surface: { r: 0.0392, g: 0.0392, b: 0.0392 }, // --bg-surface         #0A0A0A
  raised: { r: 0.0784, g: 0.0784, b: 0.0784 }, // --bg-surface-raised  #141414
  text: { r: 0.9804, g: 0.9804, b: 0.9804 }, // --text-default       #FAFAFA
  muted: { r: 0.502, g: 0.502, b: 0.502 }, // --text-muted         #808080
  disabled: { r: 0.302, g: 0.302, b: 0.302 }, // --text-disabled      #4D4D4D
  border: { r: 0.1686, g: 0.1686, b: 0.1686 }, // --border-default     #2B2B2B
  borderMuted: { r: 0.1412, g: 0.1412, b: 0.1412 }, // --border-muted       #242424
  borderStrong: { r: 1, g: 1, b: 1 }, // --border-strong      #FFFFFF
  primary: { r: 0.9529, g: 0.3961, b: 0.1686 }, // --primary            #F3652B
  accent: { r: 0, g: 0.4471, b: 0.9608 }, // --accent             #0072F5
  orange400: { r: 1, g: 0.5569, b: 0.302 }, // --color-orange-400   #FF8E4D
  orange600: { r: 0.851, g: 0.2902, b: 0.0118 }, // --color-orange-600   #D94A03
  codeKeyword: { r: 0.2, g: 0.5725, b: 1 }, // --code-sintax-keyword    #3392FF
  codeFunction: { r: 0.9529, g: 0.3961, b: 0.1686 }, // --code-sintax-function   #F3652B
  codeType: { r: 0.9804, g: 0.8431, b: 0.4196 }, // --code-sintax-type       #FAD76B
  codeMuted: { r: 0.6, g: 0.6, b: 0.6 } // --code-sintax-punctuation #999999
}

// ── Type (resolved at this canvas' pinned step) ─────────────────────────────────────────
// `lh` is PERCENT (the tokens are unitless multipliers); `ls` is PIXELS; `case` is UPPER only
// where the token bakes it in. Style names are Figma's — VERIFY them with
// listAvailableFontsAsync() before the first mutation (see SKILL.md § Fonts).
const T = {
  heading2xl: { family: 'Sora', style: 'Regular', size: 56, lh: 125 },
  headingXl: { family: 'Sora', style: 'Regular', size: 36, lh: 125 },
  headingLg: { family: 'Sora', style: 'Regular', size: 30, lh: 125 },
  headingMd: { family: 'Sora', style: 'Regular', size: 24, lh: 125 },
  headingSm: { family: 'Sora', style: 'Regular', size: 18, lh: 137.5 },
  bodyLg: { family: 'Sora', style: 'Regular', size: 18, lh: 137.5 },
  bodyMd: { family: 'Sora', style: 'Regular', size: 16, lh: 137.5 },
  labelMd: { family: 'Sora', style: 'Regular', size: 14, lh: 150 },
  overlineMd: {
    family: 'Proto Mono',
    style: 'Medium',
    size: 14,
    lh: 137.5,
    ls: 1.6,
    case: 'UPPER'
  },
  overlineSm: {
    family: 'Proto Mono',
    style: 'Medium',
    size: 12,
    lh: 137.5,
    ls: 1.6,
    case: 'UPPER'
  },
  bigNumberLg: { family: 'Proto Mono', style: 'Regular', size: 56, lh: 125 },
  codeMd: { family: 'Roboto Mono', style: 'Regular', size: 14, lh: 100 }
}

// ── Fonts: one batched load, every family AND style you will touch ──────────────────────
await Promise.all(
  [...new Set(Object.values(T).map((t) => `${t.family}|${t.style}`))].map((k) => {
    const [family, style] = k.split('|')
    return figma.loadFontAsync({ family, style })
  })
)

// ── Helpers: appendChild BEFORE x/y, at every level of nesting ──────────────────────────
// Not a style choice. A new node in a Slides file is auto-parented at absolute (240, 240), so
// x/y written before the real appendChild is stored against that origin and the node lands at
// (intended - 240). The bug is intermittent, so one frame looking right proves nothing. Never
// compensate by adding 240 back — fix the order.
function addFrame(parent, { x, y, w, h }, fill, radius) {
  const f = figma.createFrame()
  parent.appendChild(f)
  f.resize(w, h)
  f.fills = fill ? [{ type: 'SOLID', color: fill }] : []
  f.clipsContent = false
  if (radius !== undefined) f.cornerRadius = radius
  f.x = x
  f.y = y
  return f
}

function addRect(parent, { x, y, w, h }, fill) {
  const r = figma.createRectangle()
  parent.appendChild(r)
  r.resize(w, h)
  r.fills = [{ type: 'SOLID', color: fill }]
  r.x = x
  r.y = y
  return r
}

function addText(parent, t, color, chars, { x, y, w }) {
  const n = figma.createText()
  parent.appendChild(n)
  n.fontName = { family: t.family, style: t.style }
  n.fontSize = t.size
  n.lineHeight = { unit: 'PERCENT', value: t.lh }
  if (t.ls) n.letterSpacing = { unit: 'PIXELS', value: t.ls }
  if (t.case) n.textCase = t.case
  n.characters = chars
  n.fills = [{ type: 'SOLID', color }]
  // Fix the width and let height follow, so a wrapped line never pushes past its column.
  if (w) {
    n.textAutoResize = 'HEIGHT'
    n.resize(w, n.height)
  } else {
    n.textAutoResize = 'WIDTH_AND_HEIGHT'
  }
  n.x = x
  n.y = y
  return n
}

// A HAIRLINE IS A RECTANGLE, not a border. One rule per edge is the deck's governing rule, and
// a 1px rect is the only form where "who owns this edge" is unambiguous: two frames with borders
// meeting at a shared edge composite into a heavier line and there is nothing to point at.
const addRule = (parent, { x, y, w, h }) =>
  addRect(parent, { x, y, w: w ?? 1, h: h ?? 1 }, C.border)

// THE FRAME: four rules and four ticks, drawn as fills. `borders` selects the edges so a
// bleeding layout can hand an edge to a neighbour instead of drawing it twice.
function addSlideFrame(slide, { hatch = false } = {}) {
  const g = addFrame(slide, { x: 0, y: 0, w: CANVAS.w, h: CANVAS.h }, null)
  g.name = 'Frame'
  addRule(g, { x: FRAME.x, y: FRAME.y, w: FRAME.w, h: 1 })
  addRule(g, { x: FRAME.x, y: FRAME.y + FRAME.h - 1, w: FRAME.w, h: 1 })
  addRule(g, { x: FRAME.x, y: FRAME.y, w: 1, h: FRAME.h })
  addRule(g, { x: FRAME.x + FRAME.w - 1, y: FRAME.y, w: 1, h: FRAME.h })
  const { size, inset } = MARK
  for (const [mx, my] of [
    [FRAME.x + inset, FRAME.y + inset],
    [FRAME.x + FRAME.w - inset - size, FRAME.y + inset],
    [FRAME.x + inset, FRAME.y + FRAME.h - inset - size],
    [FRAME.x + FRAME.w - inset - size, FRAME.y + FRAME.h - inset - size]
  ]) {
    addRect(g, { x: mx, y: my, w: size, h: size }, C.border)
  }
  // The hatch: vertical rules at the --spacing-lg pitch. Figma has no radial mask on a
  // background, so fade it with an opacity ramp instead of trying to reproduce the CSS mask —
  // and keep it well under 1 so it never competes with copy.
  if (hatch) {
    const h = addFrame(g, { x: FRAME.x + 1, y: FRAME.y + 1, w: FRAME.w - 2, h: FRAME.h - 2 }, null)
    h.name = 'Hatch'
    h.clipsContent = true
    for (let x = 0; x < FRAME.w - 2; x += GRID.gutter) {
      const line = addRect(h, { x, y: 0, w: 1, h: FRAME.h - 2 }, C.border)
      line.opacity = 0.6 - 0.5 * Math.abs(x / (FRAME.w - 2) - 0.5) * 2
    }
  }
  return g
}

// THE COVER'S FRAME — the one slide that does not take the four rules above. Rounded corners,
// the top-left corner cut on the diagonal, three status squares in the cut. It is a VECTOR,
// not four rects: a chamfered rounded rectangle is one closed path, four rects cannot draw a
// diagonal, and a frame's border cannot follow one either.
//
// The path is generated by the preview (SlideCover.vue rounds every vertex by the tangent
// distance of a circle inscribed in its angle) and pasted here as the same string, already
// inset by half the stroke so the whole weight lands inside FRAME. If COVER changes — the stroke
// and the chamfer included, since the inset is half of one and the path traces the other —
// re-read `framePath` off the preview rather than re-deriving it by hand.
const COVER_PATH =
  'M 115.31 5.69 A 16 16 0 0 1 126.63 1 L 1587 1 A 32 32 0 0 1 1619 33 ' +
  'L 1619 855 A 32 32 0 0 1 1587 887 L 33 887 A 32 32 0 0 1 1 855 ' +
  'L 1 126.63 A 16 16 0 0 1 5.69 115.31 Z'

function addCoverFrame(slide) {
  const g = addFrame(slide, { x: 0, y: 0, w: CANVAS.w, h: CANVAS.h }, null)
  g.name = 'Cover frame'
  const rule = figma.createVector()
  g.appendChild(rule)
  // Paths BEFORE position: setting vectorPaths recomputes the node's bounding box, so an x/y
  // written first is discarded.
  rule.vectorPaths = [{ windingRule: 'NONE', data: COVER_PATH }]
  rule.x = FRAME.x
  rule.y = FRAME.y
  rule.fills = []
  rule.strokes = [{ type: 'SOLID', color: C.borderStrong }]
  rule.strokeWeight = COVER.stroke
  rule.strokeAlign = 'CENTER'
  rule.strokeJoin = 'ROUND'
  rule.name = 'Rule'
  const { size, gap, inset } = COVER.marks
  const inks = [C.primary, C.text, C.muted]
  inks.forEach((ink, i) => {
    addRect(g, { x: FRAME.x + inset + i * (size + gap), y: FRAME.y + inset, w: size, h: size }, ink)
  })
  return g
}

// THE DITHER — the cover's texture. In the browser it is 16 masked planes of one lattice; here
// the lit squares are simply COMPUTED and drawn, because Figma has no per-layer mask and the
// pattern is deterministic: a square exists where its 4x4 Bayer rank falls under the density
// the ramp has reached at that row. ~450 rects for the cover's panel, one flat ink, group
// opacity carrying the 85% (never per-rect fills — that is 450 paint objects to re-tint).
//
// The browser fades each plane in over one density step, which Figma cannot express per-plane;
// the hard threshold here reads a touch crisper at the transitions and identical elsewhere.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
]

function addDither(parent, { x, y, w, h }) {
  const g = addFrame(parent, { x, y, w, h }, null)
  g.name = 'Dither'
  g.clipsContent = true
  g.opacity = COVER.dither.ink
  const { pitch, dot, from, to } = COVER.dither
  for (let row = 0; row * pitch < h; row++) {
    const density = from + ((row * pitch) / h) * (to - from)
    for (let col = 0; col * pitch < w; col++) {
      if ((BAYER[row % 4][col % 4] + 0.5) / 16 > density) continue
      addRect(g, { x: col * pitch, y: row * pitch, w: dot, h: dot }, C.text)
    }
  }
  return g
}
```
