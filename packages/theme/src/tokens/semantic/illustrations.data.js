/**
 * Declarative illustration tokens — the foundation of the Illustration System.
 *
 * Illustrations in this design system are *built*, not drawn: composed from HTML
 * primitives (box, node, connector, pill, window) styled entirely by tokens, so a
 * single theme drives both light and dark and every part can animate. These tokens
 * are the shared vocabulary those primitives read; they are consumed as
 * `var(--illustration-*)` in `@aziontech/webkit` illustration components and are
 * not meant for general component styling.
 *
 * ── The rim light ──────────────────────────────────────────────────────────────
 *
 * Every enclosing part carries a "rim light": a 135° three-stop ramp that is opaque
 * at the two ends of the top-left→bottom-right axis and transparent through the
 * middle, so an edge reads as lit from the top-left and again from the bottom-right.
 * `--illustration-rim` is the resting rim; `--illustration-rim-active` is the same
 * ramp in the brand color, for the part the illustration is drawing attention to.
 *
 * The resting rim is `--border-default` — the same hairline role every bordered surface
 * in the system uses (10% white in dark, 8% black in light), so an illustration's edge
 * reads at the weight of a border and not as a drawn white outline. Only the active rim
 * goes to full strength, in `--primary`. Because both reference semantic roles rather
 * than a literal, the rim follows the theme instead of vanishing in one of the two.
 *
 * ── Painting it ────────────────────────────────────────────────────────────────
 *
 * `border-image` cannot follow `border-radius`, so a rim is painted as three stacked
 * background layers over a transparent border. Top to bottom:
 *
 *   1. the part's fill, clipped to the padding box — the interior, which hides the
 *      ramp from everything inside the border;
 *   2. the ramp, across the border box — visible only in the ring left by (1);
 *   3. the part's fill again, across the border box — an opaque backing so the
 *      ramp's transparent midpoint blends over the part's own surface rather than
 *      over whatever sits behind the element.
 *
 * `--illustration-rim-layers` is that stack and `--illustration-rim-boxes` the
 * matching origin/clip list, so the layer count cannot drift between the two:
 *
 *     border: var(--illustration-rim-width) solid transparent;
 *     background-image: var(--illustration-rim-layers);
 *     background-origin: var(--illustration-rim-boxes);
 *     background-clip: var(--illustration-rim-boxes);
 *
 * The fill resolves `--illustration-fill`, which a part sets when its surface is not
 * `--bg-surface` (a window sits on `--bg-canvas`).
 */

const RIM_RAMP = (color) =>
  `linear-gradient(135deg, ${color} 0%, ${color} 18%, transparent 45%, transparent 55%, ${color} 82%, ${color} 100%)`;

const FILL = 'var(--illustration-fill, var(--bg-surface))';
const FILL_LAYER = `linear-gradient(${FILL}, ${FILL})`;

export const illustrationsData = {
  // Rim ramps.
  'illustration-rim': { _: RIM_RAMP('var(--border-default)') },
  'illustration-rim-active': { _: RIM_RAMP('var(--primary)') },

  // The painted stack (see the header) and its origin/clip list.
  'illustration-rim-layers': {
    _: `${FILL_LAYER}, var(--illustration-rim), ${FILL_LAYER}`,
  },
  'illustration-rim-layers-active': {
    _: `${FILL_LAYER}, var(--illustration-rim-active), ${FILL_LAYER}`,
  },
  'illustration-rim-boxes': { _: 'padding-box, border-box, border-box' },

  // Rim thickness: hairline for the smallest parts, regular everywhere else.
  'illustration-rim-width': { _: 'var(--border-2)' },
  'illustration-rim-width-hairline': { _: 'var(--border-width-default)' },

  // Corner radius per part size. Only the small step has a semantic equivalent
  // (`--shape-card`); the node step and the two larger ones exist as radius primitives only.
  'illustration-shape-node': { _: 'var(--radius-sm)' },
  'illustration-shape-small': { _: 'var(--radius-lg)' },
  'illustration-shape-medium': { _: 'var(--radius-xl)' },
  'illustration-shape-large': { _: 'var(--radius-2xl)' },

  // The smallest label in the system sits below the typography scale's floor.
  'illustration-label-small': { _: '0.5rem' },

  // The canvas a registered asset composes on. Every asset in the library is authored
  // against this one frame, so parts can be placed at exact coordinates and every
  // illustration lines up with its neighbours in a grid.
  'illustration-canvas-width': { _: '10.625rem' },
  'illustration-canvas-height': { _: '8rem' },
};

export default { illustrationsData };
