---
name: network-map
category: content
structure: monolithic
status: implemented
spec_version: 3
checksum: e899b4b39bb035b5d9bcfa76352ac51a7cd6a87e46b8128bd06c7aa50c78ef93
created: 2026-09-26
last_updated: 2026-11-25
---

# Network Map — Component Spec

## Purpose

A decorative, full-bleed layer that paints the dotted world map with Azion's data centers lit in the brand accent. It is a material — it takes no content and claims no space — but unlike a static illustration it is tuned by the consumer (region, data center density, landmass opacity, static or animated) to sit behind a band's copy.

## When to use

- Use NetworkMap as a decorative world-map backdrop; for data by location use MapChart.
- As the backdrop of a band whose subject is the network (reach, data centers, latency, resilience), composed as a sibling under the band's copy inside a positioned, clipping ancestor.
- When a band is about one part of the network, so only that region's data centers should light (`region`) while the whole world stays drawn.
- When the same artwork has to read with more or fewer data centers lit, or with none at all (`density="none"`), from one component instead of separate exports.

## When NOT to use

- For a real node/edge diagram driven by data → use `flow-diagram`.
- As a wrapper around content. The layer is absolutely positioned and paints only itself; content is a sibling above it.

## Related

- `registration-frame` — the ruled box a network band usually sits in; it supplies the positioned, clipping ancestor.

## Best practices

- Give the layer a positioned ancestor (`relative overflow-hidden`); it fills that box and nothing else.
- Never offset or resize the layer with utilities (`left-*`, `w-*`, `inset-*`). It always fills its positioned ancestor, and `position` + `fade` place the map inside that box — so a fade measures from the band's own edges. An offset box moves the fade's edges off the band's and makes the two placements fight.
- To make the map smaller or larger inside its box, set `scale` instead of resizing the layer. The map shrinks toward its `position` corner, so there is no hard edge and the fade keeps measuring from the band's edges.
- Keep `opacity` low (the default `0.4`) when copy sits over the landmass; the data centers keep full strength so the network still reads.
- For copy on one side of a band, park the map on the other side with `position` and fade it toward the copy (`position="right"` + `fade="left"`); the default stops need no consumer class.
- Tune where a fade holds and ends with `--network-map-fade-start` / `--network-map-fade-end` only when the default stops do not fit, instead of adding masks.
- Leave `animated` off by default; turn it on for the one band per page whose subject is the network.
- To nudge the map or let it run off the band, set `offsetX` / `offsetY` (for example `:offset-x="0.15"` to bleed right, `:offset-y="-0.1"` to bleed up) instead of offsetting the layer.
- The landmass is the design's pixel map cell for cell (4,987 cells on a 10-unit grid), and the default `medium` density lights the design's data center field exactly: 172 cells, each metro a capital with up to two satellites, pulsing in the design's three phases. `low` lights the capitals alone (71); `high` adds 31 outlying data centers.
- `asia` and `oceania` hold no data centers — the artwork carries no accent field there — so either region lights none and the map reads as landmass alone, which looks like a broken map or no coverage on a page: do not place them, and the Regions example leaves them out.

## Usage

```vue
<script setup>
  import NetworkMap from '@aziontech/webkit/network-map'
</script>

<template>
  <div class="relative overflow-hidden">
    <NetworkMap
      region="atlantic"
      density="medium"
      :opacity="0.4"
      position="right"
      :scale="0.8"
      fade="left"
      animated
    />
  </div>
</template>
```

**Three ways in** (decision RV-K2-1, rule `webkit-content-channels`). The same data renders from a docs page as the `<NetworkMap>` tag `DocMarkdown` mounts (braced attribute values are JSON), set in a framed 2:1 box because the map is a background layer that fills its container. The site places it through `network-section`.

## Props

| Prop       | Type                                                                                                                       | Default    | Required | JSDoc                                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `region`   | `'world' \| 'atlantic' \| 'americas' \| 'north-america' \| 'south-america' \| 'europe' \| 'africa' \| 'asia' \| 'oceania'` | `'world'`  | false    | Which part of the world has its data centers lit; the map always frames the whole world.                                                  |
| `density`  | `'none' \| 'low' \| 'medium' \| 'high'`                                                                                    | `'medium'` | false    | How many data centers are lit, from `none` to `high`.                                                                                     |
| `animated` | `boolean`                                                                                                                  | `false`    | false    | Pulses the data centers in three staggered waves that settle within five seconds; static when false.                                      |
| `opacity`  | `number`                                                                                                                   | `0.4`      | false    | Opacity of the landmass dots, from 0 to 1; the data centers stay at full strength.                                                        |
| `position` | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'`       | `'center'` | false    | Where the map parks in the space the box leaves over.                                                                                     |
| `scale`    | `number`                                                                                                                   | `0.85`     | false    | Size of the map relative to the box; 1 fits it, below 1 shrinks it toward its position, above 1 enlarges it.                              |
| `offsetX`  | `number`                                                                                                                   | `0`        | false    | Horizontal shift as a fraction of the map width; negative moves it left, positive right, past the box edge if large enough.               |
| `offsetY`  | `number`                                                                                                                   | `0`        | false    | Vertical shift as a fraction of the map height; negative moves it up, positive down, past the box edge if large enough.                   |
| `fade`     | `'none' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'edges' \| 'vignette'`                                                | `'none'`   | false    | Fades the map out along an axis so it meets content without a hard edge.                                                                  |
| `traffic`  | `boolean`                                                                                                                  | `false`    | false    | Draws traffic between lit data centers: faint links and, while `animated`, packets that cross them; the links alone under reduced motion. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `data-region`, `data-density` and `data-fade` on the root mirror their props; `data-fade` drives the mask that fades the layer out
- `density="none"` draws the landmass alone, with no hole where a data center would be — every data center cell is also a landmass cell
- `density` levels are cumulative: `low` (65 data centers) ⊂ `medium` (186) ⊂ `high` (275); `core` carries a data center on every main Brazilian capital, so they light at every density
- Each data center path carries `data-animated` (present only when `animated` is set) and `data-phase` (`0` / `1` / `2`), which select the pulse and its wave delay
- The map always frames the whole world; `region` only chooses which data centers light — a data center renders when its cell falls inside the region's bounds, and a phase with no data center left renders no path
- `scale` sizes the map around the `position` anchor, so it renders at that fraction of its fitted size while the anchored edge stays put; a value of 0 or below falls back to `1`
- `offsetX` / `offsetY` translate the map after `position` and `scale` place it, by that fraction of the map's own width / height; the sign is the direction (negative left / up, positive right / down), so each axis moves independently of the anchor
- The default `scale` of `0.85` leaves room on both axes, so every `position` moves the map in any box shape. At `1` the fitted map fills one axis edge to edge, so `position` acts only on the other axis: `top` / `center` / `bottom` render alike in a wide box, and `left` / `center` / `right` in a tall one
- `top` / `bottom` / `left` / `right` fade the map out toward that edge: full ink from the opposite edge up to `--network-map-fade-start`, zero at `--network-map-fade-end`, both measured from the opposite edge. `top` / `bottom` default to 16% / 55%; `left` / `right` default to 50% / 80%, which clears a copy column on that side of a band
- Custom properties tune the fade in place, set from the consumer's class: `--network-map-fade-start` / `--network-map-fade-end` (where the fade holds full ink and where it reaches zero)

## Motion & Animations

| Trigger                                                                                         | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations)           | Reduced-motion fallback                            |
| ----------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------- | -------------------------------------------------- |
| `animated` set — data center pulse, three waves at 0 / 350 / 700ms, two pulses each, then still | `animate-pulse-settle` | catalog `pulse-settle` (2s, 2 runs; last wave ends at 4.7s) | `motion-reduce:animate-none` (static data centers) |

| `traffic` with `animated` — a packet grows out of one data center, crosses its ray and is absorbed into the other (dash length 0 → 30 → 0 and offset 0 → −100 over the first 45% of the ray's cycle, then parked); each ray stops by itself within 4.8 s of mount, on a parked frame | Web Animations API on each packet path; every ray on its own 3.4–6.2 s clock so the field never pulses in step, with a finite iteration count that ends either at the 4.8 s mark (when that falls in the parked part of the cycle) or at the last whole cycle before it | — (one-off geometry, no token) | none: the packets stay parked at zero length and the links draw at 0.24 instead of 0.12, the still frame of the mesh |

Static by default: without `animated` no data center carries an animation class. `traffic` builds the mesh from the lit data centers, deterministically (a fixed-seed generator, so server and client and every export draw the same network): 14 participants by farthest-point sampling, each linked to at least two and at most three others no closer than 60 map units, each ray a quadratic bowed 5–9% of its length to a random side. Links are `--border-strong`, packets `--primary`, both `non-scaling-stroke` so they stay hairlines at any size. The server renders the links and the parked packets; the packets start on mount.

## Tokens

| Region        | Token (DESIGN.md)   |
| ------------- | ------------------- |
| landmass dots | `var(--text-muted)` |
| data centers  | `var(--primary)`    |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Decorative: the root is `aria-hidden="true"` and `pointer-events-none`; the network's claims are carried by the band's copy, never by the artwork
- Keyboard map: none — the layer is not focusable and has no interactive parts
- Visible focus: not applicable (nothing receives focus)
- Contrast: not applicable to the artwork (decorative); the copy above it keeps its own ≥4.5:1 against the band, which the low default `opacity` protects
- `motion-reduce:animate-none` stops the pulse under reduced motion
- Pause, Stop, Hide (WCAG 2.2.2): with `animated`, the data center pulse and the traffic packets stop by themselves within 5 seconds of mount (pulses by 4.7 s, packets by 4.8 s) and rest on the static map, so the layer needs no pause control
- Touch target: not applicable (no interactive parts)

## Examples

`region`, `density` and `fade` are this component's multi-option axes — its equivalent of `kind` — so each gets one composite story in place of Types / Sizes, which it does not have. `animated` is the one state prop, so it gets the one state story. `position` is left to the Default story's controls: it only shows when the box's ratio differs from the region's, so nine frames of the same map would teach little. `scale`, `offsetX` and `offsetY` are left there too, since they are continuous ranges rather than sets of options.

- Default
- Regions — composite story rendering every `region` value that holds data centers side-by-side (`asia` and `oceania` are left out).
- Densities — composite story rendering every `density` value side-by-side.
- Fades — composite story rendering every `fade` value side-by-side.
- Traffic — `traffic` with `animated` over the Atlantic at high density.
- Animated — state story; the Default args plus `animated: true`.
- Markdown — a `<NetworkMap />` tag in its frame rendered by `DocMarkdown` inside `DocProse`. Justified: the docs channel (RV-K2-1).

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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
