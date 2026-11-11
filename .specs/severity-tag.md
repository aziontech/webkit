---
name: severity-tag
category: content
structure: monolithic
status: implemented
spec_version: 1
checksum: 008e66b3b44cae2eaa5d4c1a19f9457abe9b02e8d08653d672c93a76a8e6ac6b
created: 2026-11-10
last_updated: 2026-11-11
---

# SeverityTag — Component Spec

## Purpose

SeverityTag labels an item with its place on an ordered severity scale: critical, high, medium, low or info. The level reads from a four-bar glyph, where the filled bars count the level, and from the label, so two levels never depend on colour alone to differ. It differs from `tag`, whose `severity` prop is a colour tone (success, warning, danger) with no order between values.

## When to use

- Show how severe an alert, finding, detection, incident or vulnerability is, in a table cell, a list row or a detail header.
- Rank items on a fixed five-step scale where critical and high must stay visibly distinct.

## When NOT to use

- The value is an outcome or a status with no order (allowed, blocked, healthy) → use `tag`.
- The value is a count or a one-word indicator on an icon or avatar → use `badge`.
- The user can select or remove the value (a severity filter) → use `chip`.

## Related

- `tag` — a toned status or category label; use it for outcomes and states, not for an ordered level.
- `badge` — a dense count or short-label indicator.
- `chip` — an interactive or removable token, for severity filters.

## Best practices

- Keep the default label (the level name from the locale catalog, translated under `WebkitProvider`) so the text always names the level; override `label` only when the product glossary names the level differently.
- Use one SeverityTag per row, in its own column, so the glyphs line up and the scale reads down the column.
- Do not pair the tag with a toned `tag` for the same level; the glyph and the ramp already carry it.

## Usage

```vue
<script setup>
  import SeverityTag from '@aziontech/webkit/severity-tag'
</script>

<template>
  <SeverityTag
    severity="high"
    size="medium"
  />
</template>
```

## Props

| Prop       | Type                                                  | Default    | Required | JSDoc                                                                                         |
| ---------- | ----------------------------------------------------- | ---------- | -------- | --------------------------------------------------------------------------------------------- |
| `severity` | `'critical' \| 'high' \| 'medium' \| 'low' \| 'info'` | `'info'`   | false    | Severity level; sets how many glyph bars fill, their colour and the default label.            |
| `label`    | `string`                                              | `''`       | false    | Text of the tag. Empty uses the locale catalog (`Critical`, `High`, `Medium`, `Low`, `Info`). |
| `size`     | `'small' \| 'medium'`                                 | `'medium'` | false    | Size token; `medium` is 24px tall, `small` is 20px.                                           |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                    |
| --------- | ----- | ------------------------ |
| `default` | —     | Replaces the label text. |

## States

- Visual states: `default` (static, non-interactive)
- `data-severity` mirrors the `severity` prop: `critical` | `high` | `medium` | `low` | `info`
- `data-size` mirrors the `size` prop: `small` | `medium`
- Filled bars per level: critical 4, high 3, medium 2, low 1, info 0

## Motion & Animations

_none_

## Tokens

| Region                  | Token (DESIGN.md)                                                                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| typography (both sizes) | `.text-label-sm`                                                                                                                                                                   |
| surface                 | `var(--bg-canvas)`                                                                                                                                                                 |
| border                  | `var(--border-default)` at `var(--border-width-default)`                                                                                                                           |
| text                    | `var(--text-default)`                                                                                                                                                              |
| spacing (medium)        | `var(--spacing-xs)` horizontal padding and glyph gap                                                                                                                               |
| spacing (small)         | `var(--spacing-xxs)` horizontal padding and glyph gap                                                                                                                              |
| shape                   | `var(--shape-elements)`                                                                                                                                                            |
| glyph bar (filled)      | `var(--severity-critical)` · `var(--severity-high)` · `var(--severity-medium)` · `var(--severity-low)`; info fills no bar, and `var(--severity-info)` colors info series in charts |
| glyph bar (empty)       | `var(--border-default)`                                                                                                                                                            |

## Theme gaps

| Figma variable      | Temporary primitive                                              | Follow-up                                                                                           |
| ------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `severity-critical` | `primitives.red.600` (light) · `primitives.red.400` (dark)       | Add the `severity` theme role in `packages/theme/src/tokens/theme/severity.js` with this component. |
| `severity-high`     | `primitives.orange.600` (light) · `primitives.orange.400` (dark) | Same role.                                                                                          |
| `severity-medium`   | `primitives.yellow.700` (light) · `primitives.yellow.500` (dark) | Same role.                                                                                          |
| `severity-low`      | `primitives.blue.600` (light) · `primitives.blue.400` (dark)     | Same role.                                                                                          |
| `severity-info`     | `primitives.gray.500` (light) · `primitives.gray.400` (dark)     | Same role.                                                                                          |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not focusable; the tag is static text and takes no `tabindex`.
- Keyboard map: none; the tag has no interaction.
- ARIA: the glyph is `aria-hidden="true"`; the visible text names the level, so the tag needs no `role` or `aria-label`.
- Contrast ≥4.5:1 for the label (`var(--text-default)` on `var(--bg-canvas)`) and ≥3:1 for every filled bar on `var(--bg-canvas)` in both themes.
- No motion, so no `motion-reduce:*` fallback is needed.
- Touch target: not applicable; the tag is not interactive.

## Examples

- Default — one tag at the default level.
- Levels — composite story rendering every `severity` value side by side, in order from critical to info. It replaces Types because the variant axis is `severity`, not `kind`.
- Sizes — composite story rendering both `size` values for one level.

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
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
