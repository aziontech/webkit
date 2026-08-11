---
name: frame-box
category: layout
structure: monolithic
status: approved
spec_version: 1
checksum: 4d6e12997c98851fd89c5db4d0ad34ab13b3a227b50e29a9fe13b5b278bc43ef
style_seam: true
created: 2026-08-11
last_updated: 2026-08-11
---

# Frame Box — Component Spec

## Purpose

The registration frame: a hairline box with a small square set inside each corner and an optional vertical hatch texture behind its content. It is the container every framed page section is built from — a section title, the gap between two sections, a cell of a divider grid — so a page's rules and corner marks come from one component instead of from per-screen borders.

## When to use

- Wrapping a page section, band, or grid cell that should read as a framed module.
- Building a page whose vertical rhythm is drawn by rules rather than by margins: stack frames and let `flush` collapse each junction to a single hairline.
- Adding the corner registration marks (and optionally the hatch texture) to an area that already has its rules drawn by a surrounding grid — set `borders="none"` and keep `marks`.

## When NOT to use

- For a card-shaped surface with padding, a header and a footer → use `card-box` instead.
- For a single separating line between two blocks → use `divider` instead.
- For the empty framed band that separates two sections → use `section-gap`, which is this frame configured for that one job.

## Related

- `section-gap` — an empty `frame-box` that holds the air between two sections.
- `section-title` — a `frame-box` around a centered section header.
- `card-box` — a padded surface with header/content/footer regions; a card, not a frame.
- `divider` — one hairline with optional centered label; no corners, no content.

## Best practices

- Stack frames with `flush` so a junction between two of them reads as one hairline instead of two.
- Use `borders` rather than overriding the border utilities from the call site: `y` for a full-bleed band that keeps only its top and bottom rules, `none` for a cell of a `gap-px` divider grid whose edges are already drawn by the grid's seams.
- Keep `marks` on: the corner squares are the frame's identity, and they cost nothing when the rules are handed over to a grid.
- Reach for `hatch` sparingly — one hatched frame per view reads as texture; several read as noise.

## Usage

```vue
<script setup>
import FrameBox from '@aziontech/webkit/frame-box'
</script>

<template>
  <FrameBox hatch>
    <div class="p-(--spacing-xl) text-center">Framed content</div>
  </FrameBox>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `borders` | `'all' \| 'x' \| 'y' \| 'none'` | `'all'` | false | Which of the frame's own rules to draw. Use `y` for a full-bleed band and `none` when a surrounding grid already draws every edge. |
| `marks` | `boolean` | `true` | false | Show the four corner registration squares, inset from both rules. |
| `hatch` | `boolean` | `false` | false | Show the faint vertical hatch-line texture behind the content, faded toward the edges. |
| `flush` | `boolean` | `false` | false | Pull the frame up by its border width so its top rule lands on the bottom rule of the block above, drawing the shared edge once. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Frame content; rendered above the hatch texture and stretched to the frame height. |

## States

- Visual states: `default`
- `data-borders` mirrors the `borders` prop: `all` | `x` | `y` | `none`
- `data-marks` present when the corner squares are drawn
- `data-hatch` present when the hatch texture is drawn
- `data-flush` present when the frame shares the rule above

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| frame rule | `var(--border-default)` |
| corner mark | `var(--border-default)` |
| hatch line | `var(--border-muted)` |
| hatch pitch | `var(--spacing-lg)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — the frame is a container and holds no interactive surface of its own; focusable content composed into it keeps its own `focus-visible:ring-2 focus-visible:ring-(--ring-color)` ring.
- Keyboard map: none — the frame is not focusable and traps nothing; `Tab` order is decided entirely by the slotted content.
- ARIA: the hatch texture and the four corner squares are decorative and carry `aria-hidden="true"`; the root adds no role, so the slotted content's semantics reach the accessibility tree unchanged.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons) — the rules and marks are non-informational decoration, and the slotted content owns its own contrast.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable, no interactive control.

## Stories (Storybook)

- Default
- Borders — composite story rendering every `borders` value side-by-side (justified: `borders` is the component's only enum axis, and the difference between `all`/`x`/`y`/`none` is only legible when the four are compared in one frame)
- Hatch — the `hatch` texture on (mutually-exclusive boolean state of the `hatch` prop)
- Flush — two frames stacked, the lower one `flush` (justified: sharing one hairline with the block above is invisible on a single frame; the story is what proves the junction is 1px)

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
