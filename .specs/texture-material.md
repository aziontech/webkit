---
name: texture-material
category: marketing
structure: monolithic
status: approved
spec_version: 1
checksum: 62607952c1023d1d0260592efc0b00e6d78be2d26622474db20b3075f7ec410c
created: 2026-09-23
last_updated: 2026-09-24
---

# Texture Material — Component Spec

## Purpose

The one decorative surface every band in the system is painted on: a full-bleed, non-interactive layer that tiles a texture behind whatever sits above it. It is a material, not a container — it takes no content and claims no space, so a band composes it into its own backdrop slot and keeps ownership of its layout.

## When to use

- In a band's `background` slot (`hero`), where the opening band needs the site's own lattice under its copy.
- Behind a panel, dropzone or slide that would read as empty at a flat fill.
- Anywhere a surface should look like a technical drawing ground without shipping an image.

## When NOT to use

- To draw the rules between real content cells → use `frame-box`, whose rules are structural.
- For the ruled divider between sections → use `section-gap`, which composes this layer's `lines` kind and owns that treatment.
- For a meaningful image or diagram → use `illustration`.
- As a wrapper around content. The layer is absolutely positioned and paints only itself; content is a sibling above it, inside the positioned ancestor.

## Related

- `hero` — the band whose `background` slot this is composed into.
- `frame-box` — structural rules and corner marks, not decoration.
- `section-gap` — the hatched rhythm band between sections.
- `hero` — the marketing band that paints this texture behind its own copy.

## Best practices

- Give the layer a positioned ancestor (`relative`) that also clips it; it fills that box and nothing else.
- Keep the texture behind copy, never over it. `dots` is the quiet default; `lines` is quieter still and reads as ruled paper; `dither` and `pixelate` are loud enough to need their ink dropped or their dense end steered away from the words.
- Do not stack two layers at different pitches — that reads as a moiré, not as a texture.
- Quiet a texture with `--texture-ink` rather than with `opacity`, so the ground keeps showing through at full strength.
- Leave it out when the band already sits inside a `frame-box`; rules plus texture is usually one layer too many.

## Usage

```vue
<script setup>
import Hero from '@aziontech/webkit/hero'
import TextureMaterial from '@aziontech/webkit/texture-material'
</script>

<template>
  <Hero kind="screen">
    <template #background>
      <TextureMaterial kind="dots" fade="bottom" />
    </template>

    <h1>Anything here sits above the texture.</h1>
  </Hero>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `'dots' \| 'grid' \| 'lines' \| 'dither' \| 'pixelate' \| 'none'` | `'dots'` | false | Which texture to paint; `none` renders the layer with no texture at all. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Pitch of the tiling — how far apart the cells sit. |
| `fade` | `'none' \| 'top' \| 'bottom' \| 'edges' \| 'vignette'` | `'none'` | false | Fades the layer out along an axis so it meets content without a hard edge. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `data-kind`, `data-size` and `data-fade` mirror their props and drive which texture paints, at what pitch, and how it fades out
- `kind="none"` paints nothing, so a band can switch its texture off without unmounting the layer
- `fade="none"` leaves the layer unmasked; every other value masks it so the ink reaches zero before the layer's own edge
- Custom properties tune a texture in place, set from the consumer's class: `--texture-ink` (every kind), `--texture-fade-start` / `--texture-fade-end` (where the fade holds full ink and where it reaches zero), `--texture-from` / `--texture-to` / `--texture-direction` (the `dither` ramp's density span and axis), `--texture-pool-x` (where both `pixelate` light pools sit on the x axis), `--texture-pool-a` / `--texture-pool-b` (each pool's own `x y` position, so the two can sit on opposite edges; either falls back to `--texture-pool-x`)

## Motion & Animations

| Region | Animation class | Reduced-motion fallback |
|---|---|---|
| pixelate wave, leading | `animate-texture-wave-a` | `motion-reduce:animate-none` |
| pixelate wave, trailing | `animate-texture-wave-b` | `motion-reduce:animate-none` |

Reduced motion keeps both crests — they are part of the picture, not only of the animation — and stops them travelling.

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| texture ink | `var(--text-default)` (mixed down, so the step off the ground is equal in both themes) |
| pixelate light | `var(--primary)` |
| spacing (pitch, small) | `var(--spacing-sm)` |
| spacing (pitch, medium) | `var(--spacing-lg)` |
| spacing (pitch, large) | `var(--spacing-xxl)` |
| lines pitch (small / medium / large) | 6 / 8 / 14 px — a measured ladder of its own, not a multiple of the shared `--texture-scale`, because a scaled-down line pitch stops reading as rules and starts reading as a flat wash |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — the layer is decorative and holds no interactive control.
- Keyboard map: none; the layer is `pointer-events-none` and is never in the tab order.
- ARIA: the root carries `aria-hidden="true"`, so no texture is announced and the layer adds no role.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the ink is mixed down from `var(--text-default)` to a surface step, deliberately below text contrast — content above the layer keeps its own colours and its own contrast against the page canvas.
- `motion-reduce:animate-none` on both pixelate waves; every other kind is static.
- Touch target ≥40×40 px — not applicable, no interactive target.

## Stories (Storybook)

- Default
- Kinds — composite story rendering every `kind` value side by side
- Sizes — composite story rendering every `size` value side by side

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
