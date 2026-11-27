---
name: badge
category: content
structure: monolithic
status: implemented
spec_version: 4
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=476-909
  node_id: 476:909
checksum: 95cfca620496b4ef02d3d1ec67d831eab8684e3e50a678d3aa49cb7089f0e955
created: 2026-06-23
last_updated: 2026-11-23
---

# Badge — Component Spec

## Purpose

Use Badge only for a number attached to something else (unread count, 12, 99+). For the state of a resource use StatusIndicator, for a category or outcome word use Tag, for a removable or selectable token use Chip, and for the "+N" of a truncated list use OverflowCount.

Badge is a compact, non-interactive count with severity-based color coding, commonly overlaid on icons, avatars or buttons, or set beside a heading. It differs from its sibling `tag`: `tag` carries words (optional leading icon, optional pill shape, masked surfaces), whereas `badge` carries a number on a fully filled surface with no icon affordance.

## When to use

- A number attached to another element: a bell with its unread count, a section heading with how many items it holds.
- Color the count through `variant` (the brand look: `primary`, `secondary`) or `severity` (neutral / info / success / warning / danger) with a fully filled surface; `severity` wins when both are set.

## When NOT to use

- A status word (Active, Failed, Deploying) → use `status-indicator`.
- A category or outcome word (Production, Beta, Allowed) → use `tag`.
- The label is user-removable or selectable → use `chip`.
- The "+N" that opens the hidden items of a truncated list → use `overflow-count`.

## Related

- `tag` — labelled status/category chip with optional icon and pill shape; use when the label is descriptive, not a count.
- `chip` — interactive/removable token; use when the user can select or dismiss it.

## Best practices

- Keep the content to a number (`12`, `99+`); words belong in `tag` or `status-indicator`.
- Drive color from `variant` or `severity`, never a hardcoded color or a raw palette class.

## Usage

```vue
<script setup>
  import Badge from '@aziontech/ui/badge'
</script>

<template>
  <Badge
    label="99"
    variant="primary"
    size="medium"
  />
</template>
```

## Props

| Prop       | Type                                                                                       | Default     | Required | JSDoc                                                                                                                                                                                                                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------ | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`    | `string`                                                                                   | `''`        | false    | Fallback text when the default slot is empty.                                                                                                                                                                                                                                                                     |
| `variant`  | `'primary' \| 'secondary'` | `'primary'` | false | Brand look of the badge surface and label, used when `severity` is not set. |
| `severity` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | — | false | Status colour of the badge surface and label; wins over `variant` when set. `neutral` uses the `var(--bg-surface)` / `var(--text-default)` surface. The values are the shared `Severity` scale (exported from this component). |
| `size`     | `'small' \| 'medium' \| 'large'`                                                           | `'medium'`  | false    | Size token; `small` is 20px tall, `medium` is 24px, `large` is 30px.                                                                                                                                                                                                                                              |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                           |
| --------- | ----- | ----------------------------------------------- |
| `default` | —     | Main content; falls back to `label` when empty. |

## States

Badge is non-interactive: it has no hover, focus, active, or disabled states and emits no events. Variants are exposed verbatim as `data-*` attributes on the root for Tailwind variant styling and for test/Code-Connect hooks:

- `data-severity` mirrors the `severity` prop when it is set (`neutral` | `info` | `success` | `warning` | `danger`).
- `data-variant` mirrors the `variant` prop when `severity` is not set (`primary` | `secondary`).
- `data-size` mirrors the `size` prop (`small` | `medium` | `large`).

## Motion & Animations

_none_

## Tokens

| Region                     | Token (TOKENS.md)                                                   |
| -------------------------- | ------------------------------------------------------------------- |
| typography (medium, large) | `.text-label-md` + `leading-none` (Figma Typography/Label/md, 14px) |
| typography (small)         | `.text-label-sm` + `leading-none` (Figma Typography/Label/sm, 12px) |
| spacing (medium, large)    | `var(--spacing-xs)` horizontal padding                              |
| spacing (small)            | `var(--spacing-2xs)` horizontal padding                             |
| shape (all severities)     | `var(--shape-control)`                                             |
| surface (primary)          | `var(--primary)` / `var(--primary-foreground)`                        |
| surface (secondary)        | `var(--secondary)` / `var(--secondary-foreground)`                    |
| surface (success)          | `var(--success)` / `var(--success-foreground)`                        |
| surface (info)             | `var(--info)` / `var(--info-foreground)`                              |
| surface (warning)          | `var(--warning)` / `var(--warning-foreground)`                        |
| surface (danger)           | `var(--danger)` / `var(--danger-foreground)`                          |
| surface (default)          | `var(--bg-surface)` / `var(--text-default)`                         |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — Badge is non-interactive (no focus, no keyboard, no tab stop).
- Keyboard map: none — Badge is not focusable and exposes no interactive affordance.
- ARIA: the root is a presentational `<span>`; consumers that use the badge as a live count should label the host control (e.g. `aria-label="3 unread"`) since the visual label alone is not announced as status.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): every severity pairs a surface token with its matching `-foreground` (or `--text-default` for `neutral`), which the theme guarantees in both light and dark.
- `motion-reduce:*`: not applicable — Badge is static (no motion).
- Touch target: not applicable — Badge is non-interactive.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none mirror.
- Keyboard: no horizontal arrow-key logic.
- Isolation: the label renders `dir="auto"`, so a value in another script keeps its own direction; a label with no letter (a count, `+3`, `-12%`) renders `dir="ltr"`, so its sign and unit stay in order in every engine.

## Examples

- Default
- Types — composite story rendering every `variant` and `severity` side-by-side.
- Sizes — composite story rendering every `size` label side-by-side.

<!-- Loading/Disabled stories are omitted: Badge declares neither prop and is non-interactive, so there are no such states to demonstrate (consistent with the canonical layout, which gates those stories on the props existing). -->

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/ui/*` path must exist in `packages/ui/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=label]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
