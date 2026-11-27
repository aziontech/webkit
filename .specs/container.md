---
name: container
category: layout
structure: monolithic
status: implemented
spec_version: 2
checksum: 28c7a562a48fbe2292e1db6df90d8c38c6de92a1256b38ec1f5c1396dddd90c3
style_seam: true
created: 2026-09-23
last_updated: 2026-11-15
---

# Container — Component Spec

## Purpose

The framed content column: a centered, width-capped block carrying only its two vertical rules, which every section below a hero stacks inside. It is the middle layer of the page language — the hero above it owns the page's top rule, the footer below it owns the bottom, and this column owns the sides — so a page's frame is drawn once, by three components, instead of by every band that happens to need an edge.

## When to use

- Use Container once per marketing page as the framed column below the hero.
- As the container for every band below a `hero`, on a marketing, hub or documentation page.
- Whenever a stack of `module` bricks needs one continuous frame around it.
- For a plain prose column that should sit on the page's own measure, with `padded`.

## When NOT to use

- For the full-bleed band at the top of a page → use `hero`, which is the hero rule.
- For one band inside the column → use `module`, the brick this container stacks.
- For a hairline grid of cells → use `card-grid`, which draws its rules as gaps.
- For a bordered box around arbitrary content → use `registration-frame`.

## Related

- `hero` — the full-bleed opening band above this column; its `border-b` is this column's top edge.
- `module` — the brick stacked inside this column.
- `card-grid` — the hairline cell grid a module's body holds.
- `registration-frame` — the registration frame a module wraps its body in.

## Best practices

- Leave `padded` off for a stack of modules: each brick owns its own padding, and column padding would double it and pull the bricks off the frame.
- Match `maxWidth` to the `hero` above it so the band's content and the column's content open on one vertical.
- Turn `bordered` off only for a column nested inside another frame, where the outer frame already draws the sides.

## Usage

```vue
<script setup>
  import Container from '@aziontech/ui/container'
  import Module from '@aziontech/ui/module'
</script>

<template>
  <Container max-width="site">
    <Module
      :divided="false"
      title="What it does"
      >…</Module
    >
    <Module title="How it works">…</Module>
  </Container>
</template>
```

## Props

| Prop       | Type             | Default | Required | JSDoc                                                                                                |
| ---------- | ---------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `maxWidth` | `ContainerWidth` | `'7xl'` | false    | Width the column is capped at; `site` is the marketing measure every band of that page frame shares. |
| `bordered` | `boolean`        | `true`  | false    | Draw the column's two vertical rules.                                                                |
| `padded`   | `boolean`        | `false` | false    | Pad the column itself. Leave off for a stack of modules that own their padding.                      |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                  |
| --------- | ----- | ------------------------------------------------------ |
| `default` | —     | The bands stacked inside the column, in reading order. |

## States

- Visual states: `default`
- `data-width` carries the resolved width key
- `data-bordered` present when the vertical rules are drawn
- `data-padded` present when the column pads its own content

## Motion & Animations

_none_

## Tokens

| Region        | Token (TOKENS.md)                               |
| ------------- | ----------------------------------------------- |
| column rule   | `var(--border-default)`                         |
| column inset  | `var(--layout-boundary-inline)`                 |
| column rhythm | `var(--spacing-2xl)`                            |
| width cap     | `var(--container-3xl)` … `var(--container-7xl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — the column is a container and holds no interactive surface of its own.
- Keyboard map: none — the column is not focusable; `Tab` order is decided entirely by the slotted content.
- ARIA: the root adds no role, so the slotted content's semantics reach the accessibility tree unchanged.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons) — the rules are non-informational decoration and the slotted content owns its own contrast.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable, no interactive control.

## Examples

- Default
- Widths — composite story rendering the width keys side-by-side (justified: a cap is only legible when two are compared in one view)
- Bordered — the column with its rules off (mutually-exclusive boolean state of the `bordered` prop)
- Padded — the column padding its own content (mutually-exclusive boolean state of the `padded` prop)

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/ui/*` path must exist in `packages/ui/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
