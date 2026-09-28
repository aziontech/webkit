---
name: network-map
category: content
structure: monolithic
status: implemented
spec_version: 1
checksum: 2a59670eba0e7f94db7a0ccd5ccab11aa3375442c7e418bf4f28f6a2da3c3e94
created: 2026-09-26
last_updated: 2026-09-26
---

# Network Map — Component Spec

## Purpose

A decorative, full-bleed layer that paints the dotted world map with Azion's PoPs lit in the brand accent. It is a material like `texture-material` — it takes no content and claims no space — but unlike an illustration it is tuned by the consumer (region, PoP density, landmass opacity, static or animated) to sit behind a band's copy.

## When to use

- As the backdrop of a band whose subject is the network (reach, data centers, latency, resilience), composed as a sibling under the band's copy inside a positioned, clipping ancestor.
- When a band is about one part of the network, so only that region's PoPs should light (`region`) while the whole world stays drawn.
- When the same artwork has to read with more or fewer PoPs lit, or with none at all (`density="none"`), from one component instead of separate exports.

## When NOT to use

- For a neutral lattice with no geography → use `texture-material`.
- For a meaningful image or diagram that carries information the copy does not → use `illustration`.
- For a real node/edge diagram driven by data → use `flow`.
- As a wrapper around content. The layer is absolutely positioned and paints only itself; content is a sibling above it.

## Related

- `texture-material` — the same material contract (full-bleed, `aria-hidden`, `fade`), with a tiling texture instead of a map.
- `hero` — the band whose `background` slot this can be composed into.
- `frame-box` — the ruled box a network band usually sits in; it supplies the positioned, clipping ancestor.
- `illustration` — the static, meaningful artwork library; `network-map` is decorative and configurable by comparison.

## Best practices

- Give the layer a positioned ancestor (`relative overflow-hidden`); it fills that box and nothing else.
- Never offset or resize the layer with utilities (`left-*`, `w-*`, `inset-*`). It always fills its positioned ancestor, and `position` + `fade` place the map inside that box — so a fade measures from the band's own edges. An offset box moves the fade's edges off the band's and makes the two placements fight.
- To make the map smaller or larger inside its box, set `scale` instead of resizing the layer. The map shrinks toward its `position` corner, so there is no hard edge and the fade keeps measuring from the band's edges.
- Keep `opacity` low (the default `0.4`) when copy sits over the landmass; the PoPs keep full strength so the network still reads.
- For copy on one side of a band, park the map on the other side with `position` and fade it toward the copy (`position="right"` + `fade="left"`); the default stops need no consumer class.
- Tune where a fade holds and ends with `--network-map-fade-start` / `--network-map-fade-end` only when the default stops do not fit, instead of adding masks.
- Leave `animated` off by default; turn it on for the one band per page whose subject is the network.
- To nudge the map or let it run off the band, set `offsetX` / `offsetY` (for example `:offset-x="0.15"` to bleed right, `:offset-y="-0.1"` to bleed up) instead of offsetting the layer.
- `asia` and `oceania` hold no PoPs — the artwork carries no accent field there — so either region lights none and the map reads as landmass alone.

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

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `region` | `'world' \| 'atlantic' \| 'americas' \| 'north-america' \| 'south-america' \| 'europe' \| 'africa' \| 'asia' \| 'oceania'` | `'world'` | false | Which part of the world has its PoPs lit; the map always frames the whole world. |
| `density` | `'none' \| 'low' \| 'medium' \| 'high'` | `'medium'` | false | How many PoPs are lit, from `none` to `high`. |
| `animated` | `boolean` | `false` | false | Pulses the PoPs in three staggered waves; static when false. |
| `opacity` | `number` | `0.4` | false | Opacity of the landmass dots, from 0 to 1; the PoPs stay at full strength. |
| `position` | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'center'` | false | Where the map parks in the space the box leaves over. |
| `scale` | `number` | `0.85` | false | Size of the map relative to the box; 1 fits it, below 1 shrinks it toward its position, above 1 enlarges it. |
| `offsetX` | `number` | `0` | false | Horizontal shift as a fraction of the map width; negative moves it left, positive right, past the box edge if large enough. |
| `offsetY` | `number` | `0` | false | Vertical shift as a fraction of the map height; negative moves it up, positive down, past the box edge if large enough. |
| `fade` | `'none' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'edges' \| 'vignette'` | `'none'` | false | Fades the map out along an axis so it meets content without a hard edge. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `data-region`, `data-density` and `data-fade` on the root mirror their props; `data-fade` drives the mask that fades the layer out
- `density="none"` draws the landmass alone, with no hole where a PoP would be — every PoP cell is also a landmass cell
- `density` levels are cumulative: `low` (65 PoPs) ⊂ `medium` (186) ⊂ `high` (275); `core` carries a PoP on every main Brazilian capital, so they light at every density
- Each PoP path carries `data-animated` (present only when `animated` is set) and `data-phase` (`0` / `1` / `2`), which select the pulse and its wave delay
- The map always frames the whole world; `region` only chooses which PoPs light — a PoP renders when its cell falls inside the region's bounds, and a phase with no PoP left renders no path
- `scale` sizes the map around the `position` anchor, so it renders at that fraction of its fitted size while the anchored edge stays put; a value of 0 or below falls back to `1`
- `offsetX` / `offsetY` translate the map after `position` and `scale` place it, by that fraction of the map's own width / height; the sign is the direction (negative left / up, positive right / down), so each axis moves independently of the anchor
- The default `scale` of `0.85` leaves room on both axes, so every `position` moves the map in any box shape. At `1` the fitted map fills one axis edge to edge, so `position` acts only on the other axis: `top` / `center` / `bottom` render alike in a wide box, and `left` / `center` / `right` in a tall one
- `top` / `bottom` / `left` / `right` fade the map out toward that edge: full ink from the opposite edge up to `--network-map-fade-start`, zero at `--network-map-fade-end`, both measured from the opposite edge. `top` / `bottom` default to 16% / 55%; `left` / `right` default to 50% / 80%, which clears a copy column on that side of a band
- Custom properties tune the fade in place, set from the consumer's class: `--network-map-fade-start` / `--network-map-fade-end` (where the fade holds full ink and where it reaches zero)

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| `animated` set — PoP pulse, three waves at 0 / 700 / 1400ms | `animate-pulse` | catalog (`animate.js`, Tailwind stock loop) | `motion-reduce:animate-none` (static PoPs) |

Static by default: without `animated` no PoP carries an animation class.

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| landmass dots | `var(--text-muted)` |
| PoPs | `var(--primary)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Decorative: the root is `aria-hidden="true"` and `pointer-events-none`; the network's claims are carried by the band's copy, never by the artwork
- Keyboard map: none — the layer is not focusable and has no interactive parts
- Visible focus: not applicable (nothing receives focus)
- Contrast: not applicable to the artwork (decorative); the copy above it keeps its own ≥4.5:1 against the band, which the low default `opacity` protects
- `motion-reduce:animate-none` stops the pulse under reduced motion
- Touch target: not applicable (no interactive parts)

## Stories (Storybook)

`region`, `density` and `fade` are this component's multi-option axes — its equivalent of `kind` — so each gets one composite story in place of Types / Sizes, which it does not have. `animated` is the one state prop, so it gets the one state story. `position` is left to the Default story's controls: it only shows when the box's ratio differs from the region's, so nine frames of the same map would teach little. `scale`, `offsetX` and `offsetY` are left there too, since they are continuous ranges rather than sets of options.

- Default
- Regions — composite story rendering every `region` value side-by-side.
- Densities — composite story rendering every `density` value side-by-side.
- Fades — composite story rendering every `fade` value side-by-side.
- Animated — state story; the Default args plus `animated: true`.

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
