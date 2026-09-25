---
name: big-numbers
category: marketing
structure: monolithic
status: implemented
spec_version: 2
checksum: 182e1ccce24783cf9dc3a9f87f5c8e04cd84332e55ca7c8a01ceed4f279abf40
created: 2026-09-22
last_updated: 2026-09-23
---

# Big Numbers — Component Spec

## Purpose

A band of headline figures — throughput, uptime, points of presence — set in the display face at big-number scale, each in its own cell of a hairline `card-grid` with a short caption underneath. It is the proof band of a marketing page: the one place a page states its numbers, between a `section-title` and the section body.

## When to use

- To state a handful of measured facts (2–6) as the proof band of a marketing or landing page.
- Whenever the figure itself is the message and the caption only names what was measured.
- Under a `section-title`, as the opening evidence of a section.

## When NOT to use

- For a single monetary amount → use `currency`, which owns the amount ladder and its symbol placement.
- For a plan's headline price inside a pricing card → use `card-pricing`.
- For tabular or comparable figures a reader will scan row by row → use `table`.
- For a label-and-value pair at body scale inside a card or list → use `item`.

## Related

- `section-title` — the framed section header this band usually sits under.
- `card-grid` — the hairline grid the cells sit in; its `gap-px` seams are the rules between them.
- `currency` — a monetary amount at three reading distances, with symbol handling.
- `card-pricing` — a plan card, where the headline figure is a price.

## Best practices

- The band draws no frame of its own: the rule and the corner marks belong to the `section-module` or `frame-box` that the page assembles it into, so a band placed in a framed column never lands a second hairline on the column's own.

- Keep the band to 2–6 figures: it reads as a row, and past six the cells stop being scannable.
- Put the unit in `suffix` and the qualifier in `prefix`, so the figure itself stays the largest, highest-contrast thing in the cell.
- Keep `label` to a few words — it is set at overline scale and is a caption, not a sentence.
- Round the figures. A band is a claim, not a readout; `99.99%` belongs here, `99.9873%` does not.
- Leave `size` at `medium` unless the band is the page's hero statement (`large`) or sits inside a denser section (`small`).

## Usage

```vue
<script setup>
import BigNumbers from '@aziontech/webkit/big-numbers'
</script>

<template>
  <BigNumbers
    :items="[
      { value: '120', suffix: '+', label: 'Points of presence' },
      { value: '99.99', suffix: '%', label: 'Availability' },
      { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
      { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `items` | `BigNumberItem[]` | `[]` | false | The figures rendered as cells, in order; each item is `{ value, label, prefix?, suffix? }` where `value` is the figure, `label` its caption, and `prefix` / `suffix` the qualifier and unit set beside it. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token; picks the big-number scale the figures are set at. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `data-size` mirrors the `size` prop and drives the figure's type scale
- Empty: when `items` is empty the band renders no cells and draws no frame — a marketing proof band with nothing to prove is absent from the page, not an `empty-state`

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (figure, small) | `.text-big-number-sm` |
| typography (figure, medium) | `.text-big-number-md` |
| typography (figure, large) | `.text-big-number-lg` |
| typography (caption) | `.text-overline-sm` |
| figure text | `var(--text-default)` |
| prefix accent | `var(--primary)` |
| suffix text | `var(--text-muted)` |
| caption text | `var(--text-muted)` |
| cell rules and marks | `var(--border-default)` |
| spacing (cell padding) | `var(--spacing-xl)` |
| spacing (figure to caption) | `var(--spacing-sm)` |
| spacing (figure parts) | `var(--spacing-xxs)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — the band is static copy and holds no interactive control.
- Keyboard map: none of its own; the band contains no focusable element and is skipped by `Tab`.
- ARIA: each cell is a `<figure>` whose `<figcaption>` carries the caption, so the figure and what it measures are one unit for a screen reader; `prefix` and `suffix` are plain spans inside the figure's text, so the announced value is the whole expression.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the figure is `var(--text-default)` (17.65:1 light, 20.12:1 dark) and the accent prefix `var(--primary)` is large text (3.00:1 light, 6.71:1 dark). The caption is `var(--text-muted)` at overline scale — 5.32:1 on the dark canvas, but **3.78:1 on the light canvas, under AA for normal text**. This is a system-wide property of `--text-muted`, not of this component; it is carried as a theme-level follow-up and is not worked around here with an off-token colour.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable, no interactive target.

## Stories (Storybook)

- Default
- Sizes — composite story rendering every `size` value one under the other

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
