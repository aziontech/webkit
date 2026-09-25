---
name: section-container
category: marketing
structure: monolithic
status: approved
spec_version: 1
checksum: 8ff53931f5fed46ecf52d47a38f7f411b4d676df5780b518dd2a93424765ffc8
style_seam: true
created: 2026-09-23
last_updated: 2026-09-23
---

# Section Container — Component Spec

## Purpose

The framed content column: a centered, width-capped block carrying only its two vertical rules, which every section below a hero stacks inside. It is the middle layer of the page language — the hero above it owns the page's top rule, the footer below it owns the bottom, and this column owns the sides — so a page's frame is drawn once, by three components, instead of by every band that happens to need an edge.

## When to use

- As the container for every band below a `hero`, on a marketing, hub or documentation page.
- Whenever a stack of `section-module` bricks needs one continuous frame around it.
- For a plain prose column that should sit on the page's own measure, with `padded`.

## When NOT to use

- For the full-bleed band at the top of a page → use `hero`, which is the hero rule.
- For one band inside the column → use `section-module`, the brick this container stacks.
- For a hairline grid of cells → use `card-grid`, which draws its rules as gaps.
- For a bordered box around arbitrary content → use `frame-box`.

## Related

- `hero` — the full-bleed opening band above this column; its `border-b` is this column's top edge.
- `section-module` — the brick stacked inside this column.
- `card-grid` — the hairline cell grid a module's body holds.
- `frame-box` — the registration frame a module wraps its body in.

## Best practices

- Leave `padded` off for a stack of modules: each brick owns its own padding, and column padding would double it and pull the bricks off the frame.
- Match `maxWidth` to the `hero` above it so the band's content and the column's content open on one vertical.
- Turn `bordered` off only for a column nested inside another frame, where the outer frame already draws the sides.

## Usage

```vue
<script setup>
import SectionContainer from '@aziontech/webkit/section-container'
import SectionModule from '@aziontech/webkit/section-module'
</script>

<template>
  <SectionContainer max-width="site">
    <SectionModule :divided="false" title="What it does">…</SectionModule>
    <SectionModule title="How it works">…</SectionModule>
  </SectionContainer>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `maxWidth` | `SectionContainerWidth` | `'7xl'` | false | Width the column is capped at; `site` is the marketing measure every band of that page frame shares. |
| `bordered` | `boolean` | `true` | false | Draw the column's two vertical rules. |
| `padded` | `boolean` | `false` | false | Pad the column itself. Leave off for a stack of modules that own their padding. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The bands stacked inside the column, in reading order. |

## States

- Visual states: `default`
- `data-width` carries the resolved width key
- `data-bordered` present when the vertical rules are drawn
- `data-padded` present when the column pads its own content

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| column rule | `var(--border-default)` |
| column inset | `var(--layout-boundary-inline)` |
| column rhythm | `var(--spacing-xxl)` |
| width cap | `var(--container-3xl)` … `var(--container-7xl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — the column is a container and holds no interactive surface of its own.
- Keyboard map: none — the column is not focusable; `Tab` order is decided entirely by the slotted content.
- ARIA: the root adds no role, so the slotted content's semantics reach the accessibility tree unchanged.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons) — the rules are non-informational decoration and the slotted content owns its own contrast.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable, no interactive control.

## Stories (Storybook)

- Default
- Widths — composite story rendering the width keys side-by-side (justified: a cap is only legible when two are compared in one view)
- Bordered — the column with its rules off (mutually-exclusive boolean state of the `bordered` prop)
- Padded — the column padding its own content (mutually-exclusive boolean state of the `padded` prop)

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
