// THE SLIDE CANVAS CONTRACT — one source for the HTML preview and the Figma build.
//
// A slide is a FIXED artboard, and that is the whole reason this file exists. Every
// other surface in this app takes its measure from the window: the theme's spacing and
// type tokens carry breakpoint maps, so `--spacing-xl` is 24px on a phone and 48px on a
// wide screen, and a component reads whichever one the viewport resolves. A 1920x1080
// slide has no viewport of its own — it is 1920 wide whether you preview it in a 1280px
// window or present it on a 4K display — so it must PIN those tokens to the step the
// theme intends for a wide screen (`xl`, >=1280px) instead of inheriting the window's.
// That is `CANVAS_TOKENS` below, and SlideStage binds it as the stage's inline style.
//
// Pinning is a re-declaration of tokens the theme already owns, so it is the one place
// in this deck where a literal length is allowed. Every value is copied from the theme's
// own `xl` step (semantic/spacings.data.js and semantic/texts.data.js, as compiled into
// the media-query blocks of @aziontech/theme's globals.css). Nothing else in the deck
// writes a raw length: geometry comes from the constants here, and everything visual
// comes from `var(--token)` utilities.
//
// The second reason this file exists: the Figma slide is built from absolute x/y
// coordinates, and the preview is what those coordinates are read off. Both import the
// SAME numbers, so a slide cannot be 246px from the edge in the browser and 240 in
// Figma. See .claude/skills/figma-slides/SKILL.md.

/** The Figma Slides artboard. Not configurable — this is the size Slides gives you. */
export const CANVAS = { width: 1920, height: 1080 }

// THE FRAME is the deck's signature: one bordered box per slide, with a registration
// tick in each corner (the industrial language documented in .claude/docs/CONTAINERS.md).
// Its width is `--container-7xl` (1620px), the theme's widest container and the measure
// the site's own top bar takes. A slide is chrome held at the two ends of a fixed canvas
// rather than a column of prose read down a scrolling page, so it takes the bar's measure,
// not the page frame's — and the COPY inside it is then capped the way the site caps its
// hero copy (HEADLINE_MAX / DESCRIPTION_MAX below). Vertically the frame is inset by
// `--spacing-xxl`, so the bezel is the largest step of the theme's own scale on all sides.
//
// The frame's width is named once, above the object, because `x` centres the frame BY it. Written
// as two independent literals — `x: (CANVAS.width - 1620) / 2` beside `width: 1620` — the two can
// be edited apart, and the deck then draws a 1620px frame anchored wherever the arithmetic in `x`
// happened to land: flush to one edge, with the whole difference as dead space on the other. It
// went out that way once (`- 1920`, x = 0, 300px of nothing down the right of all 23 slides) and
// nothing caught it, because every slide still rendered and every coordinate was still internally
// consistent — just consistently off-centre.
const FRAME_WIDTH = 1620 // --container-7xl

export const FRAME = {
  x: (CANVAS.width - FRAME_WIDTH) / 2, // 150
  y: 96, // --spacing-xxl @ xl
  width: FRAME_WIDTH,
  height: CANVAS.height - 2 * 96 // 888
}

/** Padding from the frame's rules to its content. `--spacing-xxl` @ xl. */
export const FRAME_PADDING = 96

/** The box every slide lays its content out in. */
export const CONTENT = {
  x: FRAME.x + FRAME_PADDING, // 246
  y: FRAME.y + FRAME_PADDING, // 192
  width: FRAME.width - 2 * FRAME_PADDING, // 1428
  height: FRAME.height - 2 * FRAME_PADDING // 696
}

// A 12-COLUMN GRID THAT DIVIDES EXACTLY. 12 columns of 97px with `--spacing-lg` (24px)
// gutters fill the 1428px content box with no remainder (12*97 + 11*24 = 1428), which is
// what lets a half (6 cols = 702), a third (4 cols = 460) and a quarter (3 cols = 339)
// all land on whole pixels — in the browser and in Figma. Span a run with `span()`.
export const GRID = { columns: 12, column: 97, gutter: 24 }

/** Width of a run of `n` grid columns, gutters included. */
export const span = (n) => n * GRID.column + (n - 1) * GRID.gutter

/** x of the left edge of column `i` (0-based), relative to the content box. */
export const columnX = (i) => i * (GRID.column + GRID.gutter)

// THE COVER'S FRAME is the one slide that does not take the deck's square, hairline box: it
// is the brand deck's cover shape — the same 1620x888 box, but with rounded corners, its
// top-left corner cut away on the diagonal, and three status squares sitting in the cut. The
// deck's own frame says "everything here is on a grid"; the cover's says which deck it is,
// so it is allowed to be the one slide with a different perimeter.
//
// Measured off the reference render (canvas coordinates, so directly comparable): a ~32px
// corner radius, a ~115px diagonal cut, three ~13px squares at ~25px pitch in the cut, and a
// texture panel ~560px wide held ~20px off the frame's right rule. The numbers below round
// those to the deck's own scale wherever one exists — the cut is FRAME_PADDING, so the
// diagonal ends exactly where the content box begins, and the marks sit on a 24px
// (`--spacing-lg`) pitch. The radius is the one value with no token behind it: the shape
// ladder tops out at 8px, which is a control's radius and reads square on a 1620px box.
export const COVER = {
  /** Corner radius of the three right-angle corners. */
  radius: 32,
  /** Radius of the two joints where the diagonal cut meets the rules. */
  joint: 16,
  /** Stroke of the cover's rule — `border-2`, drawn in `--border-strong`. The deck's frame is a
   *  1px `--border-default` hairline because it is scaffolding behind content; the cover's rule
   *  IS the content, it carries the shape, and at a hairline it antialiases on a scaled stage to
   *  a grey that reads as an artefact rather than a rule. */
  stroke: 2,
  // The cut is sized BY the marks, not by the frame: the three squares sit in the triangle it
  // removes, so their row has to clear the diagonal (x + y < chamfer, measured from the corner).
  // The row reaches x + y = 96, and 120 — five --spacing-lg steps — leaves 17px of perpendicular
  // clearance to the rule, which is the reference's own (18px). Widen `gap` and the cut has to
  // grow with it: at gap 24 the row reaches 120 and needs a 144 chamfer for the same clearance.
  /** How far the diagonal cut reaches along each axis from the top-left corner. */
  chamfer: 120,
  /** The three squares in the cut: size, gap between them, and inset from the two rules. */
  marks: { size: 12, gap: 12, inset: 12 },
  /** The texture panel: a run of grid columns, held off the frame's rules by `inset`. */
  panel: { columns: 5, inset: 24 },
  /** The band below the frame that carries the mark and the tagline. */
  footer: { height: CANVAS.height - (FRAME.y + FRAME.height) } // 96 — one --spacing-xxl
}

// The corner tick: a 6px filled square inset 4px from both rules, so it reads as a
// registration mark INSIDE the frame rather than as a second, competing border. Same
// geometry the design system's FrameBox draws (`m-1 size-1.5`).
export const MARK = { size: 6, inset: 4 }

/** Copy caps, from the design system's own hero and section headers. */
export const HEADLINE_MAX = 1024 // --container-4xl
export const DESCRIPTION_MAX = 752 // --container-2xl

// THE QR PLATE on the closing `thanks` slide. Two numbers, and both of them are about being
// scanned rather than about looking right.
//
// `plate` is the white square's side, and it is a run of FOUR GRID COLUMNS rather than a round
// number of spacing steps. A QR is read at whatever angle the room allows, from wherever the
// person is sitting, so the code wants to be as large as the composition can carry — but sizing
// it by "the largest square the half holds" pins it to that half's padding, and the first time
// anyone re-splits the slide the plate silently overhangs the frame's rule. Four columns is a
// measure the grid already guarantees: it lands on whole pixels, it fits the six-column half
// with room on both sides, and it is the same unit every other slide's content is sized in.
//
// `quiet` is the light margin the standard requires around a symbol, measured in MODULES, not
// pixels — a scanner looks for four modules' worth of clear space and can miss the code without
// it. The layout spends it as the plate's own inset (an SVG viewBox grown by 8 modules), so the
// white square IS the quiet zone and no padding value can drift away from it.
export const QR = { plate: span(4), quiet: 4 } // 460

// ── The pinned canvas tokens ────────────────────────────────────────────────────────
//
// Only the tokens that CARRY a breakpoint map need pinning; a token with a single value
// (`--spacing-md`, `--text-body-md-font-size`) already resolves the same everywhere and
// is deliberately absent. Values are the theme's `xl` step, except the type sizes, whose
// last step is `md` (>=768) — the theme grows type to `md` and spacing to `xl`.
export const CANVAS_TOKENS = {
  // spacing — xl step (>=1280)
  '--spacing-xxl': '6rem',
  '--spacing-xl': '3rem',
  '--spacing-lg': '1.5rem',
  // type — md step (>=768), the last step each of these declares
  '--text-heading-2xl-font-size': '3.5rem',
  '--text-heading-xl-font-size': '2.25rem',
  '--text-heading-lg-font-size': '1.875rem',
  '--text-heading-md-font-size': '1.5rem',
  '--text-heading-sm-font-size': '1.125rem',
  '--text-body-lg-font-size': '1.125rem',
  '--text-overline-md-font-size': '0.875rem',
  '--text-big-number-lg-font-size': '3.5rem',
  '--text-big-number-md-font-size': '2.25rem',
  '--text-amount-lg-font-size': '3.5rem',
  '--text-amount-md-font-size': '1.5rem'
}

// ── The palette, resolved ───────────────────────────────────────────────────────────
//
// The deck is DARK, like the marketing site (SiteLayout pins the dark theme for the same
// reason). The preview never uses these hexes — it uses `bg-(--bg-canvas)` and friends,
// so it follows the theme. They are here because the Figma Plugin API takes 0-1 RGB
// floats and cannot read a CSS custom property, so the Figma script needs the resolved
// values, and resolving them TWICE is how a deck ends up a different orange from the app.
export const PALETTE = {
  'bg-canvas': '#000000',
  'bg-surface': '#0A0A0A',
  'bg-surface-raised': '#141414',
  // The inverted pair, and the deck's only light surface: the `clients` wall flips its half of
  // the frame to these so every client mark can carry its own brand colours instead of being
  // filtered to a white silhouette. On this dark theme `bg-contrast` IS #FAFAFA — the same
  // value as `text-default`, which is the point of the token rather than a duplicate: one is
  // the ground, the other is the ink, and on a light theme they swap.
  'bg-contrast': '#FAFAFA',
  'text-contrast': '#000000',
  'text-default': '#FAFAFA',
  'text-muted': '#808080',
  'text-disabled': '#4D4D4D',
  'border-default': '#2B2B2B',
  'border-muted': '#242424',
  'border-strong': '#FFFFFF',
  primary: '#F3652B',
  // White on this deck's dark theme (`primitives.base.white`); black on light. The ink for
  // anything filled with `--primary` — the route slide's origin disc.
  'primary-contrast': '#FFFFFF',
  accent: '#0072F5',
  secondary: '#FFFFFF',
  // The ink on `--secondary`. On this dark deck that pair is a white plate with black on it,
  // which is what the `thanks` slide's QR is drawn with — the one place the deck needs a
  // light-on-dark inversion, and a QR has to be dark-on-light to scan reliably.
  'secondary-contrast': '#000000',
  'success-contrast': '#52E086',
  'warning-contrast': '#F7BD08',
  'danger-contrast': '#ED7878',
  'info-contrast': '#66ADFF',
  'orange-400': '#FF8E4D',
  'orange-600': '#D94A03',
  'accent-400': '#9F9AF1',
  'code-keyword': '#3392FF',
  'code-function': '#F3652B',
  'code-type': '#FAD76B',
  'code-identifier': '#FAFAFA',
  'code-punctuation': '#999999',
  'code-comment': '#999999',
  'code-line-number': '#999999'
}

/** `#RRGGBB` to the Plugin API's `{ r, g, b }` (0-1 floats). */
export const figmaRgb = (hex) => {
  const n = Number.parseInt(hex.slice(1), 16)
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }
}

/** The whole palette as Plugin API colors — paste into a Figma build script's preamble. */
export const FIGMA_PALETTE = Object.fromEntries(
  Object.entries(PALETTE).map(([name, hex]) => [name, figmaRgb(hex)])
)
