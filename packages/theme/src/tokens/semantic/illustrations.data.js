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
 *
 * ── Sweeping it ────────────────────────────────────────────────────────────────
 *
 * The ramp's angle is `--illustration-rim-angle`, registered with `@property` so it
 * INTERPOLATES: rotate it and the two lit ends travel around the edge, which is the
 * whole "light moving over the scene" effect (`.illustration-rim-sweep`, below).
 *
 * A var() inside a custom property is substituted where that property is DECLARED, not
 * where it is used — so overriding `--illustration-rim-angle` on an element does not
 * re-resolve the `--illustration-rim` it inherited from `:root`. That is why the sweep
 * utility re-declares the whole ramp stack on the element it animates: declared there,
 * the ramp re-resolves against that element's own (animating) angle every frame, and the
 * parts below inherit the new value. It is also why `--illustration-fill` only takes
 * effect where the stack is declared.
 */

const RIM_RAMP = (color, angle = '135deg') =>
  `linear-gradient(${angle}, ${color} 0%, ${color} 18%, transparent 45%, transparent 55%, ${color} 82%, ${color} 100%)`

const FILL = 'var(--illustration-fill, var(--bg-surface))'
const FILL_LAYER = `linear-gradient(${FILL}, ${FILL})`
const RIM_STACK = (ramp) => `${FILL_LAYER}, ${ramp}, ${FILL_LAYER}`

const ANGLE = 'var(--illustration-rim-angle, 135deg)'

export const illustrationsData = {
  // Where the ramp is lit from. Registered as an `<angle>` (see
  // `illustrationsProperties`) so it can be animated instead of snapping.
  'illustration-rim-angle': { _: '135deg' },

  // Rim ramps.
  'illustration-rim': { _: RIM_RAMP('var(--border-default)') },
  'illustration-rim-active': { _: RIM_RAMP('var(--primary)') },

  // The painted stack (see the header) and its origin/clip list.
  'illustration-rim-layers': {
    _: RIM_STACK('var(--illustration-rim)')
  },
  'illustration-rim-layers-active': {
    _: RIM_STACK('var(--illustration-rim-active)')
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
  'illustration-canvas-height': { _: '8rem' }
}

/**
 * `@property` registrations. An unregistered custom property is an untyped token
 * stream, so a keyframe or transition on it flips at 50% instead of interpolating —
 * these two have to be typed for the sweep to move and the gauge to count.
 *
 * `--illustration-gauge-value` is an `<integer>` on purpose: it seeds a CSS counter
 * (`.illustration-gauge-readout`), and a counter cannot take a fraction. Every frame of
 * the transition therefore lands on a whole number the readout can print, and the arc
 * steps by 1% of its ring — about a pixel at illustration scale.
 */
export const illustrationsProperties = {
  '--illustration-rim-angle': {
    syntax: "'<angle>'",
    inherits: 'true',
    'initial-value': '135deg'
  },
  '--illustration-gauge-value': {
    syntax: "'<integer>'",
    inherits: 'true',
    'initial-value': '0'
  }
}

/**
 * `.illustration-rim-sweep` — the rim light travelling around the scene.
 *
 * Emitted as `@utility` (not `@layer components`) so it composes with variants: a
 * consumer applies it to the illustration and starts it from an ancestor's hover —
 *
 *     illustration-rim-sweep group-hover/card:[animation-play-state:running]
 *
 * It carries the animation already **paused**, so hover only sets it running: leaving
 * freezes the light where it is, where removing the animation would snap it back to
 * 135°. (v4 dropped v3's `paused` / `running` utilities, hence the arbitrary property.)
 *
 * The stack is re-declared here — see the header — because the `:root` copy already
 * resolved its angle. `--illustration-rim-color` is the second knob the re-declaration
 * buys: it lets the same hover raise the resting rim to the brand colour.
 */
export const illustrationsUtilities = {
  'illustration-rim-sweep': {
    '--illustration-rim': RIM_RAMP('var(--illustration-rim-color, var(--border-default))', ANGLE),
    '--illustration-rim-active': RIM_RAMP(
      'var(--illustration-rim-color-active, var(--primary))',
      ANGLE
    ),
    '--illustration-rim-layers': RIM_STACK('var(--illustration-rim)'),
    '--illustration-rim-layers-active': RIM_STACK('var(--illustration-rim-active)'),
    animation: 'var(--animate-illustration-rim-sweep)',
    'animation-play-state': 'paused'
  },

  /**
   * `.illustration-gauge-readout` — the number in the middle of a gauge, printed from
   * the same `--illustration-gauge-value` that draws the arc.
   *
   * It is a CSS counter rather than DOM text because that is what lets the number
   * COUNT: a transition on the registered `<integer>` moves the arc and re-prints the
   * digits from one value, so the two can never disagree mid-animation. `content` only
   * exists on a pseudo-element, hence `::before` (the span itself stays empty).
   */
  'illustration-gauge-readout': {
    'counter-reset': 'illustration-gauge var(--illustration-gauge-value, 0)',
    '&::before': { content: 'counter(illustration-gauge)' }
  }
}

export default { illustrationsData, illustrationsProperties, illustrationsUtilities }
