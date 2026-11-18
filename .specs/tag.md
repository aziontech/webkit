---
name: tag
category: content
structure: monolithic
status: implemented
spec_version: 8
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=476-940&vars=1
  node_id: 476:940
checksum: 2c5cca0907517f78281aa0d7258f753989c5cabc677d71f313cf4862a2aebf15
created: 2026-05-22
last_updated: 2026-11-15
---

# Tag — Component Spec

## Purpose

Use Tag for a read-only category or outcome word on an item (Production, Beta, Allowed) that is not a lifecycle state. The state of a resource is a StatusIndicator, a number is a Badge, a removable or selectable token is a Chip, and a level on the critical → info scale is a SeverityTag.

A compact, read-only word on an item, colored by its brand look `variant` or its status colour `severity` so the category or outcome reads at a glance (Production in `variant="primary"`, Blocked in `severity="danger"`). It takes an optional leading icon, a pill shape with `rounded`, and two sizes; it is never interactive and never counts.

## When to use

- Label or categorize an item with a short descriptive text, optionally with a leading icon or pill shape.
- Show a status with its colour via `severity` (`neutral`, `info`, `success`, `warning`, `danger`), or a category with a brand look via `variant` (`primary`, `accent`, `contrast`, `highlight`); `severity` wins when both are set.
- Mark the one value a list highlights (the Owner role in a users table) with `variant="highlight"`: the brand orange as a tint, orange text on `--primary-mask`, like the success, info and warning tints.

## When NOT to use

- It is purely a count or one-glance status label → use `badge`.
- The user can select or remove it (filters, multi-select values) → use `chip`.

## Related

- `badge` — denser count/short-label indicator with no icon affordance.
- `chip` — interactive/removable token.

## Best practices

- Colour comes from `variant` or `severity`; the optional icon is decorative — keep it `aria-hidden`.
- Pick the severity by meaning: `success` Active, `warning` Pending, `neutral` Inactive or a neutral category (Developer, Viewer), `info` a second role (Admin), `variant="highlight"` the one value to single out (Owner), `primary` a solid brand label. Do not use `danger` for a state that is only off (Inactive): it reads as an error.
- Do not restyle a Tag with colour classes to get a tint; every tint is a `variant` or a `severity`.
- Use `rounded` for the pill shape rather than a custom radius.

## Usage

```vue
<script setup>
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <Tag
    label="Label"
    variant="primary"
    size="medium"
  />
</template>
```

## Props

| Prop       | Type                                                        | Default     | Required | JSDoc                                                                                                                                                                                                                        |
| ---------- | ----------------------------------------------------------- | ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`    | `string`                                                    | `''`        | false    | Fallback text when the default slot is empty.                                                                                                                                                                                |
| `variant`  | `'primary' \| 'accent' \| 'contrast' \| 'highlight'`        | `'primary'` | false    | Brand look of the tag surface and label, used when `severity` is not set: `primary` (solid brand orange), `accent`, `highlight` (the brand orange as a tint) and `contrast` (`var(--bg-contrast)` / `var(--text-contrast)`). |
| `severity` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | —           | false    | Status colour of the tag surface and label, the shared `Severity` scale exported from this component; wins over `variant` when set.                                                                                          |
| `size`     | `'small' \| 'medium'`                                       | `'medium'`  | false    | Size token; `medium` is 24px tall, `small` is 20px.                                                                                                                                                                          |
| `rounded`  | `boolean`                                                   | `false`     | false    | Pill shape when true.                                                                                                                                                                                                        |
| `icon`     | `string`                                                    | `''`        | false    | Azion icon class for the leading icon.                                                                                                                                                                                       |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes         |
| --------- | ----- | ------------- |
| `default` | —     | Main content. |

## States

- Visual states: `default`. A tag is static text: it takes no focus and has no hover or active state.
- `data-severity` mirrors `severity` when it is set; otherwise `data-variant` mirrors `variant`.

## Motion & Animations

_none_

## Tokens

| Region                 | Token (DESIGN.md)                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| typography (medium)    | `.text-tag-md` + `leading-none` (Figma Typography/Tag/md, 12px)                                                      |
| typography (small)     | `.text-tag-sm` + `leading-none` (Figma Typography/Tag/sm, 11px)                                                      |
| spacing (medium)       | `var(--spacing-xs)` horizontal padding and icon gap                                                                  |
| spacing (small)        | `var(--spacing-2xs)` horizontal padding and icon gap                                                                 |
| shape (all severities) | `var(--shape-control)`                                                                                               |
| surface (primary)      | `var(--primary)` / `var(--primary-foreground)`, WCAG AA in both themes                                               |
| surface (contrast)     | `var(--bg-contrast)` / `var(--text-contrast)`                                                                        |
| surface (highlight)    | `var(--primary-mask)` / `var(--text-brand)`, the logo orange: AA in dark, an owner-accepted brand exception in light |
| shape (pill)           | `rounded-full`                                                                                                       |
| ring                   | `var(--ring-color)`                                                                                                  |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: none; the tag is not focusable. A focusable control that holds a tag draws its own ring.
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state; the `highlight` label is the logo orange `#F3652B`, an owner-accepted brand exception in light (about 3:1, `rules/webkit-tokens.md` § "Contrast: APCA and WCAG 2").
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional `icon` is the consumer's choice and does not mirror.
- Keyboard: no horizontal arrow-key logic.
- Isolation: the label renders `dir="auto"`, so a value in another script (a domain, an ID) keeps its own direction inside right-to-left UI.

## Examples

- Default
- Types — every variant and every severity.
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
- Do not add examples beyond Default + per `variant` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
