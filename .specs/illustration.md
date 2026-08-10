---
name: illustration
category: content
structure: composition
status: approved
spec_version: 1
figma:
  url: https://www.figma.com/design/y38AUdg5uXuMeXofUkOxv6/Illustrations?node-id=412-140497
  node_id: 412:140497
checksum: 1d4b243c26d2d632e881a39d95e89a52be2eda902a14e20172e101bcdd12a5d9
created: 2026-08-05
last_updated: 2026-08-07
---

# Illustration — Component Spec

## Purpose

Renders a product illustration that is **built, not drawn** — composed from token-styled HTML
primitives (icon box, node, connector, pill, window) rather than an exported SVG. Pass `name` to
render a registered asset, or compose the parts by hand. Because every part is HTML + design
tokens, one illustration follows light and dark, scales with `size`, and can animate; an exported
`.svg` can do none of those.

## When to use

- An empty state, error page, onboarding step, or marketing tile needs a diagrammatic illustration of a product concept (a deploy, a request path, a connected service).
- The same illustration must read correctly in both light and dark themes without shipping two files.
- The illustration should highlight one focal part (`active`) — for example the step a flow is currently on.
- The illustration must scale to the container without rasterizing or re-exporting.

## When NOT to use

- A single glyph is enough → use an icon from `@aziontech/icons` (`<i class="ai ai-…">`).
- The artwork is pictorial or brand-authored (a logo, a mascot, a photo) → use `svg/azion/*` or an `<img>`; those are drawn, not composed.
- The whole component is "no data here, with a title and an action" → use `empty-state`, which already owns that layout and may embed an `Illustration`.
- The graphic is a live data visualization → that is a chart, not an illustration.

## Related

- `empty-state` — the surrounding layout (illustration + title + description + actions); reach for it first and put an `Illustration` inside it.
- `flow` — a real interactive node/edge diagram driven by data; `Illustration` is decorative and static by comparison.
- `skeleton` — the loading placeholder; an illustration is never a loading state.
- `svg/azion/*` — drawn brand marks, for artwork that is not composable from primitives.

## Best practices

- Prefer `name` over hand-composition: a registered asset is reviewed once and reused everywhere, so the same concept never drifts between screens.
- Leave the illustration decorative (no `ariaLabel`) unless it carries information the surrounding copy does not. A decorative illustration is `aria-hidden`, which keeps screen readers out of a graphic that adds nothing.
- Set `active` on the one focal part, not on several — the rim light loses its meaning when everything is lit.
- Size a hand-composed illustration through `size`, not a wrapper `width`; the parts pick coherent radii, rim thicknesses and connector lengths per step. A registered asset is fixed to its canvas — scale it with a CSS transform if a call site needs it smaller.
- Compose assets only from the parts. A one-off `<div>` inside an asset is a token leak that will not follow the theme.

## Usage

```vue
<script setup>
  import Illustration from '@aziontech/webkit/illustration'
</script>

<template>
  <!-- Data-driven: render a registered asset on its fixed canvas. -->
  <Illustration name="ship" />

  <!-- Composed: the same parts, arranged by hand. -->
  <Illustration size="medium">
    <Illustration.Window
      kind="website"
      active
    />
    <Illustration.Connector
      kind="dashed"
      animated
    />
    <Illustration.Node />
    <Illustration.Connector />
    <Illustration.Box icon="ai ai-edge-application" />
    <Illustration.Pill
      icon="ai ai-real-time-metrics"
      label="Metrics"
    />
  </Illustration>
</template>
```

## Sub-components

The root `Illustration` owns two things: resolving `name` against the asset registry, and providing
the scene defaults. Shared state flows through `provide`/`inject` (`size`, `active`), so every part
is context-aware and the consumer wires nothing — an asset never repeats geometry. Each part also
accepts `size` / `active` as its **own** prop; a part-level value wins over the scene default, which
is how one focal part lights up inside an otherwise resting illustration. Absence means "inherit",
so those props default to unquoted `undefined`.

Member names mirror this component's anatomy. There is no `Trigger` or `Content` here — an
illustration has no open/closed state.

- `illustration-box/illustration-box.vue` — a rounded square holding one centered glyph; the workhorse part, standing for a service, resource, or capability. Carries the rim light. 32 / 64 / 128 px with a 16 / 32 / 48 px glyph, hairline rim at `small` and regular rim above.
  - Props: `size?: 'small' \| 'medium' \| 'large'` (default `undefined` → inherits); `shape?: 'rounded' \| 'square'` (default `'rounded'`) — a square box reads as scaffolding, a rounded one as a real surface; `active?: boolean` (default `undefined` → inherits); `icon?: string` (default `''`) — an `@aziontech/icons` class pair, e.g. `'ai ai-edge-application'`.
  - Events: _none_.
  - Slots: `default` — replaces the glyph; falls back to `icon`.
- `illustration-node/illustration-node.vue` — an 8 px junction point where connectors meet. Fixed size in every state (it is a joint, not a scaled part), so it takes no `size`. Uses a solid-color hairline border, not the rim: a dashed edge needs a real border.
  - Props: `kind?: 'solid' \| 'dashed'` (default `'solid'`); `emphasis?: 'default' \| 'strong'` (default `'default'`) — `strong` takes `--border-strong`, for a junction that pins a structural corner rather than marking a hop; `active?: boolean` (default `undefined` → inherits).
  - Events: _none_.
  - Slots: _none_.
- `illustration-connector/illustration-connector.vue` — the line between two parts, rendered as an inline `<svg><line>` so the dashed variant can animate its `stroke-dashoffset`. Strokes a hairline; no rim (a stroke is not a border). Its length is a property of the scene, not of the line, so it takes **no `size` prop** and reads the scale from context only — 24 / 48 / 96 px along `orientation`, roughly 1.5× the box it spans. A scene that needs an exact run sets `--illustration-connector-length` inline; a consumer that wants it to fill instead adds `grow`.
  - Props: `kind?: 'solid' \| 'dashed'` (default `'solid'`); `orientation?: 'horizontal' \| 'vertical'` (default `'horizontal'`); `active?: boolean` (default `undefined` → inherits); `animated?: boolean` (default `false`) — marches the dashes to suggest flow; only meaningful when `kind` is `dashed`.
  - Events: _none_.
  - Slots: _none_.
- `illustration-pill/illustration-pill.vue` — a small labelled capsule (glyph + uppercase mono label) for naming a part of the scene. Carries the rim light. Three steps: `large` takes the regular rim, `--shape-card`, and a 14 px glyph; `medium` and `small` take the hairline rim, `--shape-elements`, and a 12 / 10 px glyph, with `small` dropping to the illustration label size.
  - Props: `size?: 'small' \| 'medium' \| 'large'` (default `undefined` → inherits); `active?: boolean` (default `undefined` → inherits); `icon?: string` (default `''`) — an `@aziontech/icons` class pair; `label?: string` (default `''`).
  - Events: _none_.
  - Slots: `default` — replaces the label text; falls back to `label`.
- `illustration-window/illustration-window.vue` — an abstracted application window: three status dots over one of three scenario bodies (`icon` centers a glyph, `chat` runs a live copilot conversation, `website` stacks a header, a hero, and a footer block). The `chat` scene is a transcript advancing bottom-to-top over a fixed thinking row: four **equal-height** alternating messages — asked narrow and right, answered wide and left — rendered **twice** on a track twice the height of its clipped viewport, so `animate-illustration-chat-scroll` steps it one message at a time and lands on an identical frame, giving a one-way loop with no seam (equal heights are what make one step exactly one message; length is carried by width). Each bubble pops into the gap that step opens at the bottom, on `animate-illustration-chat-pop`, phase-locked to the scroll by a negative delay. The viewport is masked unevenly — deep at the top where messages leave (`mask-t-from-72%`), shallow at the bottom where they arrive (`mask-b-from-92%`), since a deep bottom fade is one message tall and would land every arrival half-faded. The thinking row — a spinning ring beside a pulsing bar — sits below the scroll, saying the assistant is still working on the next answer. Carries the rim light over `--bg-canvas`. Only `medium` and `large` — a 32 px window has no room for a scene.
  - Props: `kind?: 'icon' \| 'chat' \| 'website'` (default `'icon'`); `size?: 'medium' \| 'large'` (default `undefined` → inherits, clamped to `medium` when the scene is `small`); `active?: boolean` (default `undefined` → inherits); `icon?: string` (default `''`) — an `@aziontech/icons` class pair, used by `kind: 'icon'`.
  - Events: _none_.
  - Slots: `default` — replaces the scenario body, keeping the window chrome.
- `illustration-elbow/illustration-elbow.vue` — a connector that turns 90° through a rounded corner, for a path that changes axis between two parts. Drawn as two adjacent CSS borders with a radius on the corner between them rather than an SVG path: `d` accepts neither `%` nor `calc()`, so a path would have to be recomputed from a measured box, while two borders give a true circular arc and follow the box at any size. Its span comes from the scene, so it takes no `size`.
  - Props: `kind?: 'solid' \| 'dashed'` (default `'solid'`); `corner?: 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` (default `'bottom-left'`) — the corner the bend turns through, with the arms running along the two edges that meet there; `active?: boolean` (default `undefined` → inherits).
  - Events: _none_.
  - Slots: _none_.
- `illustration-branch/illustration-branch.vue` — an S-curve tributary leaving a trunk and meeting a label at a different height, the shape a branch diagram reads as. A cubic with horizontal tangents at both ends, plotted in a unit-square viewBox stretched to the box so one curve serves every span, with `vector-effect: non-scaling-stroke` keeping the hairline and dash pattern uniform under that stretch. Its span comes from the scene, so it takes no `size`.
  - Props: `kind?: 'solid' \| 'dashed'` (default `'solid'`); `direction?: 'up' \| 'down'` (default `'up'`); `active?: boolean` (default `undefined` → inherits); `accent?: boolean` (default `false`) — draws the branch in `--accent`, for the one branch that leads somewhere else entirely; `animated?: boolean` (default `false`).
  - Events: _none_.
  - Slots: _none_.
- `illustration-surface/illustration-surface.vue` — the plainest part: a rectangle with an edge, either a raised panel that holds other parts or a bare frame a scene is arranged against. Sized by its content or by the scene, so it takes no `size`. Both kinds carry the rim light, by two routes: a `filled` panel uses the same three-layer stack as every other part, because its own opaque fill hides the ramp from the interior; an `outline` has no fill to hide behind, so it paints the ramp across the border box and masks the padding box back out (`mask-composite: exclude`, which unlike `border-image` still follows `border-radius`).
  - Props: `kind?: 'filled' \| 'outline'` (default `'filled'`); `shape?: 'rounded' \| 'square'` (default `'rounded'`); `active?: boolean` (default `undefined` → inherits).
  - Events: _none_.
  - Slots: `default` — the parts the panel holds.
- `illustration-gauge/illustration-gauge.vue` — a circular progress ring with an optional value in the middle. The arc is drawn by dashing the circumference under `pathLength="100"`, which renormalizes it so the dash **is** the value — no 2πr arithmetic, and one CSS variable can drive it. That variable, `--illustration-gauge-value`, is written on the root as `var(--illustration-gauge-target, <value>)`: the prop is the resting score and any scene above can raise it (a hovering card setting the target), with the root's transition counting arc and readout up together and back down on leave.
  - Props: `value?: number` (default `100`) — resting share of the ring filled, 0–100, clamped and rounded (it seeds a CSS counter); `severity?: 'success' \| 'warning' \| 'danger' \| 'info'` (default `'success'`) — which feedback role colors the arc; `label?: string` (default `''`) — text in the middle; `showValue?: boolean` (default `false`) — prints the live value in the middle instead of `label`, as a CSS counter (`.illustration-gauge-readout`) seeded by the same variable that draws the arc, so the number cannot drift from the ring mid-animation; `active?: boolean` (default `undefined` → inherits) — draws the arc in the brand color instead of its severity.
  - Events: _none_.
  - Slots: _none_.
- `illustration-chart/illustration-chart.vue` — a sparkline over column backdrops with square markers at each point and an optional axis; one column can be emphasized with the brand ramp. Values are normalized against their own range, so a series of any magnitude fills the plot.
  - Props: `data?: number[]` (default `[]`); `labels?: string[]` (default `[]`) — one per point; empty renders no axis; `highlight?: number` (default `-1`) — index of the emphasized column, -1 for none; `active?: boolean` (default `undefined` → inherits).
  - Events: _none_.
  - Slots: _none_.
- `illustration-list/illustration-list.vue` — rows of mono text divided by hairline rules: a table reduced to the shape of one. The emphasized row takes the brand fill so a scene can point at a single record.
  - Props: `rows?: IllustrationListRow[]` (default `[]`) — each `{ label, value, status }`; `highlight?: number` (default `-1`) — index of the emphasized row, -1 for none; `active?: boolean` (default `undefined` → inherits).
  - Events: _none_.
  - Slots: _none_.

<!-- Resulting layout (composition, canonical):

  packages/webkit/src/components/content/illustration/
  ├── illustration.vue
  ├── index.ts                    (compound: Object.assign attaches every sub-component; vue-tsc emits index.d.ts)
  ├── injection-key.ts            (shared by every sub-component)
  ├── composables/use-illustration-context.ts
  ├── illustration-box/illustration-box.vue
  ├── illustration-node/illustration-node.vue
  ├── illustration-connector/illustration-connector.vue
  ├── illustration-pill/illustration-pill.vue
  ├── illustration-window/illustration-window.vue
  └── assets/                     (registry + one .vue per registered asset)

  The root export (`./illustration`) points at `index.ts`; `./illustration-root` points at
  `illustration.vue`. Sub-component exports stay flat (`./illustration-box`) and point at
  their `.vue`. -->

<!-- index.ts
```ts
import Illustration from './illustration.vue'
import IllustrationBox from './illustration-box/illustration-box.vue'
import IllustrationNode from './illustration-node/illustration-node.vue'
import IllustrationConnector from './illustration-connector/illustration-connector.vue'
import IllustrationPill from './illustration-pill/illustration-pill.vue'
import IllustrationWindow from './illustration-window/illustration-window.vue'

export default Object.assign(Illustration, {
  Box: IllustrationBox,
  Node: IllustrationNode,
  Connector: IllustrationConnector,
  Elbow: IllustrationElbow,
  Branch: IllustrationBranch,
  Pill: IllustrationPill,
  Window: IllustrationWindow,
  Surface: IllustrationSurface,
  Gauge: IllustrationGauge,
  Chart: IllustrationChart,
  List: IllustrationList
})
```
-->

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `name` | `string` | `''` | no | Key of a registered asset to render; empty renders the composed default slot instead. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Scale of the whole scene; every part inherits it unless it sets its own. |
| `active` | `boolean` | `false` | no | Scene-level emphasis; parts inherit it and switch to the brand rim light. |
| `ariaLabel` | `string` | `''` | no | Accessible name; empty keeps the illustration decorative and hidden from assistive tech. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The composed anatomy. Rendered when `name` is empty; ignored when `name` resolves an asset. |

## States

- Visual states: `default`, `active`
- A registered asset is authored against the fixed illustration canvas (`--illustration-canvas-width` × `--illustration-canvas-height`) and places its parts at exact coordinates, so it renders at its designed size and does not follow `size`. `size` governs hand-composed illustrations. A composition that does not fit the canvas is not a registered asset: hand-compose it at the call site, which is also where anything the design system should not ship — a third-party brand mark, say — belongs (`IllustrationBox`'s default slot replaces the glyph for exactly that).
- `data-size` mirrors the resolved scale on the root and on every scale-bearing part — `small` \| `medium` \| `large` (the window clamps to `medium` \| `large`; the connector carries it for its length even though it has no `size` prop; the node has no scale)
- `data-active` mirrors the `active` prop (present only when true), on the root and on every part
- `data-kind` on the parts that have one: `solid` \| `dashed` (node, connector), `icon` \| `chat` \| `website` (window)
- `data-orientation` on the connector: `horizontal` \| `vertical`
- `data-shape` on the box and the surface: `rounded` \| `square`
- `data-emphasis` on the node: `default` \| `strong`
- `data-corner` on the elbow: `top-left` \| `top-right` \| `bottom-left` \| `bottom-right`
- `data-direction` on the branch: `up` \| `down`; `data-accent` when it takes the accent stroke
- `data-severity` on the gauge: `success` \| `warning` \| `danger` \| `info`
- `data-highlight` on the emphasized chart column and list row
- Non-states: an illustration is decorative — it has no `hover`, `focus-visible`, `disabled`, or `loading` state, and is never interactive. An unknown `name` renders nothing and warns in development; it must not throw.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| dashed connector with `animated` | `animate-flow-dash` on the `<line>`, `stroke-dasharray="2 2"` (cycle 4 divides the keyframe travel of 24, so the loop has no seam) | semantic (700ms · linear infinite) | `aria-hidden="true"` + `motion-reduce:animate-none` |
| `active` toggling on a part | `transition-[background-image] duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |
| a registered asset mounting | `animate-fade-in` | semantic (220ms · ease-in-out) | `motion-reduce:animate-none` |
| a scene above raising `--illustration-gauge-target` | `transition-[--illustration-gauge-value] duration-700 ease-out` on the gauge root — the registered `<integer>` interpolates, so the arc sweeps and the readout counts from one number | inline (matches catalog) | `motion-reduce:transition-none` (the value snaps) |
| a scene applying `.illustration-rim-sweep` (consumer-driven, e.g. card hover) | `animate-illustration-rim-sweep` — the rim's ramp angle rotates 135°→315°, carried paused so the scene only sets `animation-play-state` | semantic (2100ms · linear infinite) | `motion-reduce:animate-none` |
| the `chat` window, always (an idle copilot is still a live one) | `animate-illustration-chat-scroll` on the transcript track — four holds with a one-message slide between them (translateY 0 → -50% in 12.5% steps) over a track twice its clipped viewport whose two halves hold the same four equal-height messages, so the one-way bottom-to-top loop lands on an identical frame and has no seam | semantic (9s · `productive-entrance` infinite) | `motion-safe:` prefix + `motion-reduce:animate-none` |
| each message arriving at the bottom of the `chat` transcript | `animate-illustration-chat-pop` on the bubble — scale 0.9 → 1 + fade from its own bottom corner, phase-locked to the scroll by a per-message negative `animation-delay` so it fires on the step boundary, with the message standing still and whole at the bottom | semantic (9s · `expressive-entrance` infinite — same duration as the scroll, by construction) | `motion-safe:` prefix + `motion-reduce:animate-none` |
| the `chat` window thinking row | `animate-spin` on the ring + `animate-pulse` on the bar beside it — the assistant working on the next answer | semantic (1s · linear infinite / 2s · infinite) | `motion-safe:` prefix + `motion-reduce:animate-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| rim light (resting) | `var(--illustration-rim-layers)` |
| rim light (active) | `var(--illustration-rim-layers-active)` |
| rim origin + clip | `var(--illustration-rim-boxes)` |
| rim thickness | `var(--illustration-rim-width)` |
| rim thickness (small parts) | `var(--illustration-rim-width-hairline)` |
| rim ramp angle (registered `<angle>`, swept by `.illustration-rim-sweep`) | `var(--illustration-rim-angle)` |
| gauge value — drives the arc dash and the readout counter (registered `<integer>`; raised by `--illustration-gauge-target`) | `var(--illustration-gauge-value)` |
| shape (node) | `var(--illustration-shape-node)` |
| shape (small part) | `var(--illustration-shape-small)` |
| shape (medium part) | `var(--illustration-shape-medium)` |
| shape (large part) | `var(--illustration-shape-large)` |
| typography (pill label) | `.text-overline-sm` |
| typography (pill label, small) | `var(--illustration-label-small)` |
| asset canvas | `var(--illustration-canvas-width)` |
| asset canvas | `var(--illustration-canvas-height)` |
| surface (box, pill, node) | `var(--bg-surface)` |
| surface (window) | `var(--bg-canvas)` |
| placeholder blocks (window body) | `var(--bg-placeholder)` |
| placeholder shape (window body) | `var(--shape-button)` |
| chat thinking spinner (ring · head) | `var(--border-default)` · `var(--text-muted)` |
| glyph + label color | `var(--text-default)` |
| node border (resting) | `var(--border-default)` |
| node border (strong) | `var(--border-strong)` |
| node border (active) | `var(--border-selected)` |
| connector stroke (resting) | `var(--border-default)` |
| connector stroke (active) | `var(--primary)` |
| window status dot (1) | `var(--danger-contrast)` |
| window status dot (2) | `var(--warning-contrast)` |
| window status dot (3) | `var(--success-contrast)` |
| gauge arc (success) | `var(--success-contrast)` |
| gauge arc (warning) | `var(--warning-contrast)` |
| gauge arc (danger) | `var(--danger-contrast)` |
| gauge arc (info) | `var(--info-contrast)` |
| gauge track · list rule · elbow · branch | `var(--border-default)` |
| branch (accent) | `var(--accent)` |
| surface (filled) | `var(--bg-surface-raised)` |
| chart column · list · chart marker fill | `var(--bg-placeholder)` |
| chart line · marker edge · highlighted column | `var(--primary)` |
| highlighted list row text | `var(--primary-contrast)` |
| elbow corner radius | `var(--illustration-shape-large)` |
| elevation (box, pill) | `var(--shadow-sm)` |
| spacing (window padding, gap) | `var(--spacing-sm)` |
| spacing (pill padding, gap) | `var(--spacing-xs)` |
| spacing (pill padding, small) | `var(--spacing-xxs)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `Border Gradient` (135° white ramp, flattened to a solid by the Figma API) | `var(--illustration-rim)` | Closed — added to `semantic/illustrations.data.js` in this change |
| `Active linear` (135° brand ramp) | `var(--illustration-rim-active)` | Closed — added to `semantic/illustrations.data.js` in this change |
| `--radius-xl` / `--radius-2xl` (12 / 16 px, no semantic equivalent) | `var(--illustration-shape-medium)` / `var(--illustration-shape-large)` | Closed — added to `semantic/illustrations.data.js` in this change |
| Super-small label at 8 px (below the typography scale floor of 12 px) | `var(--illustration-label-small)` | Closed — added to `semantic/illustrations.data.js` in this change |
| `--color-red-500` / `--color-yellow-400` / `--color-green-600` (window status dots) | `var(--danger-contrast)` / `var(--warning-contrast)` / `var(--success-contrast)` | Accepted — the semantic contrast tokens are the mode-aware saturated red/yellow/green; raw `var(--color-*)` is forbidden in components |
| `shadow/shadow-sm` (two stacked drop shadows) | `var(--shadow-sm)` | Accepted — the primitive scale already covers it |
| `ai-bot-manager` glyph (used by the `bot-manager` asset) | `ai ai-secure-pillar` | `TODO`: `@aziontech/icons` ships no bot glyph — add it with `/include-icons`, then swap the asset |
| Content Pill label tracking (Proto Mono, normal letter-spacing) | `.text-overline-sm` | `TODO`: the only display-font class carries `tracking-widest`, so pill labels sit ~1 step wider than Figma. Needs a normal-tracking display style in `texts.data.js` |
| Content Pill at `border-2` + `--shape-elements` (the `functions` pills) | `size="medium"` (hairline rim) | Accepted — a detached Figma instance mixing two foundation variants; the hairline reads the same at 10% alpha |

## Accessibility (WCAG 2.1 AA)

- Visible focus: _not applicable_ — an illustration is never focusable or interactive, so it declares no focus ring.
- Keyboard map: _none_ — no interactive elements, nothing in the tab order.
- ARIA: with no `ariaLabel` the root is `role="presentation"` + `aria-hidden="true"`, so assistive tech skips a purely decorative graphic; with an `ariaLabel` the root is `role="img"` + `aria-label`, and the decorative interior stays hidden. Every glyph `<i>` is `aria-hidden="true"`. The animated connector is `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the pill label is `var(--text-default)` on `var(--bg-surface)`; glyphs are `var(--text-default)`. The rim light and the placeholder blocks are decorative shape, not information, so they carry no contrast requirement — no meaning is conveyed by the rim alone.
- `motion-reduce:transition-none motion-reduce:animate-none` on the flowing connector, the `active` transition, and the asset entrance.
- Touch target ≥40×40 px: _not applicable_ — nothing here is a target.

## Stories (Storybook)

- Default — the `name`-driven form with Controls.
- Sizes — composite story rendering `small` / `medium` / `large` side-by-side.
- Assets — composite story rendering every registered asset side-by-side. **Justified addition:** `name` is one half of the public API and its valid values are a closed registry, so the story is the only place a consumer can see what `name` accepts. A Controls dropdown alone would not show them together.
- Active — the emphasis state (an args delta of `active: true`).
- Parts — composite story rendering every part with each of its variants and both states. **Justified addition:** the five parts are individually exported and are the compound API's whole surface; without this story a consumer composing by hand has no rendered reference for `Illustration.Box` and its siblings.

There is no `Types` story: the root has no `kind`. There are no `Loading` / `Disabled` stories: the component declares neither prop (see § States).

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
