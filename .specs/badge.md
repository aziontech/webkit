---
name: badge
category: content
structure: monolithic
status: approved
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=476-909
  node_id: 476:909
checksum: d37492bd1dbec8cc3c561dc9a2f23db9a3b8e7d3b16ceed1233adbd53b3dfda3
created: 2026-06-23
last_updated: 2026-06-25
---
# Badge — Component Spec

## Purpose

Badge is a compact, non-interactive indicator that surfaces a numeric count or a very short status value with severity-based color coding. Use it to draw attention to a small piece of state — an unread count, a quantity, a short status word — and it is commonly overlaid on icons, avatars, or buttons. It differs from its sibling `tag`: `tag` is a labelled status/category chip (optional leading icon, optional pill shape, masked surfaces), whereas `badge` is a denser count/short-value indicator with fully filled severity surfaces and no icon affordance.

## When to use

- Surface a numeric count or a very short status value attached to another element (a bell with unread count, a status dot with a label).
- Convey severity through `kind` (neutral / success / danger / …) with a fully filled surface.

## When NOT to use

- The label is user-removable or selectable → use `chip`.
- It is a labelled category/status with an optional leading icon or pill shape → use `tag`.

## Related

- `tag` — labelled status/category chip with optional icon and pill shape; use when the label is descriptive, not a count.
- `chip` — interactive/removable token; use when the user can select or dismiss it.

## Best practices

- Keep the content to a count or a 1–2 word value; longer text belongs in `tag`.
- Drive color from `kind`, never a hardcoded color or a raw palette class.

## Usage

```vue
<script setup>
import Badge from '@aziontech/webkit/badge'
</script>

<template>
  <Badge value="99" severity="primary" size="medium" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `value` | `string` | `''` | no | Fallback text when the default slot is empty. |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'default'` | `'primary'` | no | Color style for the badge surface and label; `default` uses the neutral `var(--bg-surface)` / `var(--text-default)` surface. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Size token; `small` is 20px tall, `medium` is 24px, `large` is 30px. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Main content; falls back to `value` when empty. |

## States

Badge is non-interactive: it has no hover, focus, active, or disabled states and emits no events. Variants are exposed verbatim as `data-*` attributes on the root for Tailwind variant styling and for test/Code-Connect hooks:

- `data-severity` mirrors the `severity` prop (`primary` | `secondary` | `success` | `warning` | `danger` | `default`).
- `data-size` mirrors the `size` prop (`small` | `medium` | `large`).

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (medium, large) | `.text-label-md` + `leading-none` (Figma Typography/Label/md, 14px) |
| typography (small) | `.text-label-sm` + `leading-none` (Figma Typography/Label/sm, 12px) |
| spacing (medium, large) | `var(--spacing-xs)` horizontal padding |
| spacing (small) | `var(--spacing-xxs)` horizontal padding |
| shape (all severities) | `var(--shape-elements)` |
| surface (primary) | `var(--primary)` / `var(--primary-contrast)` |
| surface (secondary) | `var(--secondary)` / `var(--secondary-contrast)` |
| surface (success) | `var(--success)` / `var(--success-contrast)` |
| surface (warning) | `var(--warning)` / `var(--warning-contrast)` |
| surface (danger) | `var(--danger)` / `var(--danger-contrast)` |
| surface (default) | `var(--bg-surface)` / `var(--text-default)` |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — Badge is non-interactive (no focus, no keyboard, no tab stop).
- Keyboard map: none — Badge is not focusable and exposes no interactive affordance.
- ARIA: the root is a presentational `<span>`; consumers that use the badge as a live count should label the host control (e.g. `aria-label="3 unread"`) since the visual value alone is not announced as status.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): every severity pairs a surface token with its matching `-contrast` (or `--text-default` for `default`), which the theme guarantees in both light and dark.
- `motion-reduce:*`: not applicable — Badge is static (no motion).
- Touch target: not applicable — Badge is non-interactive.

## Stories (Storybook)

- Default
- Types — composite story rendering every `severity` value side-by-side.
- Sizes — composite story rendering every `size` value side-by-side.

<!-- Loading/Disabled stories are omitted: Badge declares neither prop and is non-interactive, so there are no such states to demonstrate (consistent with the canonical layout, which gates those stories on the props existing). -->

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
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
