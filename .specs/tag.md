---
name: tag
category: content
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=476-940&vars=1
  node_id: 476:940
checksum: 764558c5a07a5346565592bbeba77c3a6142813525fe7e93e62af66d57f021d3
created: 2026-05-22
last_updated: 2026-11-11
---

# Tag — Component Spec

## Purpose

Compact status or category label with severity-based color coding. Supports optional icon, pill shape via `rounded`, and two sizes aligned with the Webkit Figma Tag component set.

## When to use

- Label or categorize an item with a short descriptive text, optionally with a leading icon or pill shape.
- Show a status/category with severity color via `kind`.

## When NOT to use

- It is purely a count or one-glance status label → use `badge`.
- The user can select or remove it (filters, multi-select values) → use `chip`.

## Related

- `badge` — denser count/short-label indicator with no icon affordance.
- `chip` — interactive/removable token.

## Best practices

- Severity comes from `kind`; the optional icon is decorative — keep it `aria-hidden`.
- Use `rounded` for the pill shape rather than a custom radius.

## Usage

```vue
<script setup>
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <Tag
    label="Label"
    severity="primary"
    size="medium"
  />
</template>
```

## Props

| Prop       | Type                                                                                                 | Default     | Required | JSDoc                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------- | ----------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `label`    | `string`                                                                                             | `''`        | false    | Fallback text when the default slot is empty.                                                             |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warning' \| 'danger' \| 'accent' \| 'contrast'` | `'primary'` | false    | Color style for the tag surface and label; `contrast` uses `var(--bg-contrast)` / `var(--text-contrast)`. |
| `size`     | `'small' \| 'medium'`                                                                                | `'medium'`  | false    | Size token; `medium` is 24px tall, `small` is 20px.                                                       |
| `rounded`  | `boolean`                                                                                            | `false`     | false    | Pill shape when true.                                                                                     |
| `icon`     | `string`                                                                                             | `undefined` | false    | PrimeIcons class for the leading icon.                                                                    |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes         |
| --------- | ----- | ------------- |
| `default` | —     | Main content. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`

## Motion & Animations

_none_

## Tokens

| Region                 | Token (DESIGN.md)                                                    |
| ---------------------- | -------------------------------------------------------------------- |
| typography (medium)    | `.text-tag-md` + `leading-none` (Figma Typography/Tag/md, 12px)      |
| typography (small)     | `.text-tag-sm` + `leading-none` (Figma Typography/Tag/sm, 11px)      |
| spacing (medium)       | `var(--spacing-xs)` horizontal padding and icon gap                  |
| spacing (small)        | `var(--spacing-xxs)` horizontal padding and icon gap                 |
| shape (all severities) | `var(--shape-elements)`                                              |
| surface (primary)      | `var(--primary)` / `var(--primary-contrast)`, WCAG AA in both themes |
| surface (contrast)     | `var(--bg-contrast)` / `var(--text-contrast)`                        |
| shape (pill)           | `rounded-full`                                                       |
| ring                   | `var(--ring-color)`                                                  |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional `icon` is the consumer's choice and does not mirror.
- Keyboard: no horizontal arrow-key logic.
- Isolation: the label renders `dir="auto"`, so a value in another script (a domain, an ID) keeps its own direction inside right-to-left UI.

## Examples

- Default
- Types
- Sizes
- WithIcon

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=label]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
