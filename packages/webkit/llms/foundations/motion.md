# Motion

> The catalogued animate-* utilities, their timing, when to use each, and reduced motion.

Animation in UI built on `@aziontech/webkit` is constrained to the design system's motion
vocabulary: the `animate-*` utilities and the `duration-*` / `ease-*` / `curve` tokens from
`@aziontech/theme`. Motion confirms an action or guides attention — it never decorates — and it
always has a reduced-motion escape. This is the invariant behind the `/webkit-motion-polish` skill
(which is the how-to); this rule is the constraint.

## Do

- Animate with the catalogued `animate-*` utilities (`animate-fade-in`, `animate-slide-down`,
  `animate-popup-scale-in/out`, …) — discover the catalog via the webkit MCP or
  `node_modules/@aziontech/theme`. For `animate-popup-scale-*`, set `--popup-origin` per instance.
- Take timing only from tokens: `duration-fast-01/02`, `duration-moderate-01/02`,
  `duration-slow-01/02`; curves `ease-productive-entrance/exit`, `ease-expressive-entrance/exit`.
- Animate **only compositor props** — `transform` and `opacity` (plus the catalogued
  `animate-slide-down` for disclosure height). Interaction feedback is ≤ `duration-moderate-01`
  (150ms): `ease-out` on entrance, `ease-in` on exit.
- Pair **every** motion-bearing class with a `motion-reduce:*` escape on the same class string:
  `motion-reduce:transition-none` / `motion-reduce:transform-none` / `motion-reduce:animate-none`.
- For `data-state="open|closed"` overlay motion, read `duration` + `curve` from the tokens and emit
  the inline `transition` per phase; keep transform/opacity in classes, only timing inline.

## The panel recipe (sidebar / drawer / any v-if region)

A conditionally rendered region never animates by itself — wrap the `v-if` in a Vue `Transition`
and hand the enter/leave phases to the catalogued utilities. For lateral panels the pair is
`animate-slide-in-left` / `animate-slide-out-left` (right-anchored drawers use the `-right` pair):

```vue
<Transition
  enter-active-class="animate-slide-in-left motion-reduce:animate-none"
  leave-active-class="animate-slide-out-left motion-reduce:animate-none"
>
  <aside v-if="sidebarOpen">...</aside>
</Transition>
```

Content or backdrops appearing in place use `animate-fade-in` / `animate-fade-out` in the same
shape; vertical disclosure uses `animate-slide-down`. Ask the webkit MCP
(`list_tokens` with category `animations`) for every utility, its timing, and when to use it.

## Never

- A hardcoded duration (`duration-[180ms]`, `transition: opacity 200ms`) or an inline
  `ease-[cubic-bezier(...)]` — the values live in the theme tokens.
- Animating layout props (`width`, `height`, `top`, `left`, `margin`, `padding`) — they thrash
  layout (exception: the catalogued `animate-slide-down`).
- A component-local `@keyframes`, or any external animation library (`gsap`, `framer-motion`,
  `motion`, `@vueuse/motion`, `@formkit/auto-animate`, lottie, popmotion). Use the utilities above +
  Vue `<Transition>` / `<TransitionGroup>`.
- A motion class with no `motion-reduce:*` fallback.

## Enforcement

- The mandatory `motion-reduce:*` escape overlaps the shipped `webkit-accessibility` rule (motion is
  an a11y concern) and is verified at runtime by the `webkit-ui-verifier` agent (it exercises
  `prefers-reduced-motion`).
- The no-external-lib constraint holds because the forbidden packages are never installed — an import
  fails the build.
- The token discipline (no hardcoded ms / inline `cubic-bezier` / layout-prop animation) is the
  `/webkit-motion-polish` review pass; where a stylelint rule can catch a raw `cubic-bezier(` or a
  bare `transition: all`, wire it as the mechanical floor. Suggestion is not the ceiling: what a lint
  can block, block.

### Known `no-hardcoded-motion` gaps (review still owns these)

The lint is a heuristic over class and style strings; three shapes are known to slip past it and
stay a review concern:

- **Tailwind arbitrary properties** bypass the timing check: in `[transition:opacity_200ms]` the
  underscore defeats the word boundary, and `[animation-delay:2s]` sits outside the `animation:`
  prefix — while `[transition:all]` is caught.
- **Tailwind v4's dynamic numeric scale**: `duration-937` passes (only the bracketed
  `duration-[937ms]` form is flagged).
- **The `motion-reduce:` pairing check reads only the static `class` attribute** — when the escape
  lives in a coexisting bound `:class` fragment, the static-side motion class is flagged even
  though the element is correctly paired.

## Animation utilities

| Class | Value | Use when |
| --- | --- | --- |
| `animate-blink` | `blink 1s step-end infinite` | Text caret / terminal cursor blink. |
| `animate-bounce` | `bounce 1s infinite` | Playful attention bounce (scroll-down hints); use sparingly. |
| `animate-brand-marquee` | `brandMarquee 59s linear infinite` | A strip of logos looping forever (client trust strips, framework strips). Apply to a track holding its row exactly twice, the duplicate aria-hidden, and set animation-duration ON THE ELEMENT from the mark count so every strip on a site moves at one speed rather than one duration — a var in this shorthand would resolve at :root and never see it. Pause it on hover and focus-within so a linked mark can be reached. |
| `animate-content-enter` | `contentEnter 240ms cubic-bezier(0.39, 0.57, 0.56, 1) var(--content-enter-delay, 0s) backwards` | Content settling INSIDE a page that is already on screen — a loading window resolving, a filtered list swapping, a step changing. Never on first paint of a page whose own entrance is already running (use it after that entrance, or after a wire). Stagger a follower with --content-enter-delay. |
| `animate-fade-in` | `fadeIn 220ms ease-in-out` | Content or backdrop appearing in place (no directional origin). |
| `animate-fade-out` | `fadeOut 220ms ease-in-out` | Content or backdrop leaving in place (pair of fade-in). |
| `animate-flow-dash` | `flowDash 700ms linear infinite` | Flowing connection along an SVG connector stroke in a node-based / network diagram. Set a stroke-dasharray whose cycle divides 24 (e.g. 4 4) so the loop is seamless. |
| `animate-highlight-fade` | `highlight 1100ms ease-in forwards` | Row/item briefly highlighted after an update (recently changed). |
| `animate-page-enter` | `pageEnter 240ms cubic-bezier(0.39, 0.57, 0.56, 1)` | A page arriving on a route change — on the CONTENT ZONE only, never the shell. The chrome is the same before and after, and sliding it announces a reload that did not happen. Key it on the route path so a component serving several paths still replays it. Nothing inside the page may animate on mount at the same time: the two run in lockstep and read as one element travelling on a diagonal. |
| `animate-ping` | `ping 1s cubic-bezier(0, 0, 0.2, 1) infinite` | One-off attention ring radiating from a small element (notification dot). |
| `animate-popup-scale-in` | `popupScaleIn 150ms cubic-bezier(0.39, 0.57, 0.56, 1)` | Anchored overlays opening (dropdown, popover, tooltip, menu); set --popup-origin. |
| `animate-popup-scale-out` | `popupScaleOut 110ms cubic-bezier(0.55, 0.09, 0.68, 0.53)` | Anchored overlays closing (pair of popup-scale-in). |
| `animate-progress-indeterminate` | `progressIndeterminate 2100ms cubic-bezier(0.39, 0.57, 0.56, 1) infinite` | Indeterminate linear progress bar (primary sweep). |
| `animate-progress-indeterminate-short` | `progressIndeterminateShort 2100ms cubic-bezier(0.17, 0.84, 0.44, 1) 1100ms infinite` | Indeterminate linear progress bar (secondary short sweep). |
| `animate-pulse` | `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite` | Skeleton/placeholder opacity pulse while content loads. |
| `animate-shimmer` | `shimmer 1.6s linear infinite` | Skeleton shimmer sweep while content loads. |
| `animate-slide-down` | `slideDown 220ms ease-in-out` | Vertical disclosure expanding (accordion panel, expandable row). |
| `animate-slide-in-left` | `slideInLeft 240ms cubic-bezier(0.39, 0.57, 0.56, 1)` | Left-anchored panel entering (sidebar, navigation drawer). Wrap the v-if region in a Vue Transition with enter-active-class. |
| `animate-slide-in-right` | `slideInRight 240ms cubic-bezier(0.39, 0.57, 0.56, 1)` | Right-anchored panel entering (settings/detail drawer). |
| `animate-slide-out-left` | `slideOutLeft 150ms cubic-bezier(0.55, 0.09, 0.68, 0.53)` | Left-anchored panel leaving (pair of slide-in-left; use as leave-active-class). |
| `animate-slide-out-right` | `slideOutRight 150ms cubic-bezier(0.55, 0.09, 0.68, 0.53)` | Right-anchored panel leaving (pair of slide-in-right). |
| `animate-spin` | `spin 1s linear infinite` | Indeterminate circular spinners (loading icons). |
| `animate-texture-wave-a` | `textureWaveA 13s linear infinite` | One of the two crossing bands of a pixelate texture, travelling left. Set --texture-wave-shift on the element to one period of its banding measured along X, and overhang the element by that much on the side it travels toward, or the field uncovers mid-cycle. |
| `animate-texture-wave-b` | `textureWaveB 19s linear infinite` | The counter-travelling band of that pair (pair of texture-wave-a; same --texture-wave-shift contract, opposite direction). |

## Duration and easing tokens

| Group | Count | Tokens |
| --- | --- | --- |
| transition | 8 | `--transition-duration-fast-01` · `--transition-duration-fast-02` · `--transition-duration-moderate-01` · `--transition-duration-moderate-02` · `--transition-duration-slow-01` · `--transition-duration-slow-02` · `--transition-duration-slow-03` · `--transition-duration-slow-04` |
| ease | 7 | `--ease-expressive-entrance` · `--ease-expressive-exit` · `--ease-in` · `--ease-in-out` · `--ease-out` · `--ease-productive-entrance` · `--ease-productive-exit` |
| animate | 24 | `--animate-blink` · `--animate-bounce` · `--animate-brand-marquee` · `--animate-content-enter` · `--animate-fade-in` · `--animate-fade-out` · `--animate-flow-dash` · `--animate-highlight-fade` · `--animate-page-enter` · `--animate-ping` · `--animate-popup-scale-in` · `--animate-popup-scale-out` · `--animate-progress-indeterminate` · `--animate-progress-indeterminate-short` · `--animate-pulse` · `--animate-shimmer` · `--animate-slide-down` · `--animate-slide-in-left` · `--animate-slide-in-right` · `--animate-slide-out-left` · `--animate-slide-out-right` · `--animate-spin` · `--animate-texture-wave-a` · `--animate-texture-wave-b` |
