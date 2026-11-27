---
name: tag
category: content
structure: monolithic
status: implemented
spec_version: 9
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=476-940&vars=1
  node_id: 476:940
checksum: 94476f8527e05506e1ed2c11208069667d80b16347151fb4cd2ebbe9ec0c3d10
created: 2026-05-22
last_updated: 2026-11-25
---

# Tag — Component Spec

## Purpose

Use Tag for a read-only category or outcome word on an item (Production, Beta, Allowed) that is not a lifecycle state. The state of a resource is a StatusIndicator, a number is a Badge, a removable or selectable token is a Chip, and a level on the critical → info scale is a SeverityTag.

A compact, read-only word on an item, colored by its brand look `variant` or its status colour `severity` so the category or outcome reads at a glance (Production in `variant="primary"`, Blocked in `severity="danger"`). It takes an optional leading icon and two sizes, and has one shape; it is never interactive and never counts.

## When to use

- Label or categorize an item with a short descriptive text, optionally with a leading icon.
- Pick the colour from one of two sets, never both on one tag: `severity` when the word is an outcome or a status (`neutral`, `info`, `success`, `warning`, `danger`), `variant` when it is a category that needs emphasis (`primary`, `accent`, `contrast`). `severity` wins when both are set.

| Case                                                                | Prop and value       | Example                              |
| ------------------------------------------------------------------- | -------------------- | ------------------------------------ |
| A plain category, an inactive or off value                          | `severity="neutral"` | Developer, Viewer, Inactive, Staging |
| A second category that has to stand apart from neutral              | `severity="info"`    | Admin, Preview                       |
| A good outcome                                                      | `severity="success"` | Active, Allowed, Verified            |
| Needs attention soon                                                | `severity="warning"` | Pending, Expiring                    |
| Failed or blocked                                                   | `severity="danger"`  | Blocked, Failed                      |
| The one value the screen singles out                                | `variant="primary"`  | Owner, Current, Recommended          |
| A category in the accent colour (an entity type next to others)     | `variant="accent"`   | Organization                         |
| A neutral label with the strongest contrast, on media or a busy row | `variant="contrast"` | Beta, New                            |

- The logo orange (`variant="primary"`) marks **one** value per list or card. When several values need emphasis, use `severity` or `accent`.

## When NOT to use

- It is purely a count or one-glance status label → use `badge`.
- The user can select or remove it (filters, multi-select values) → use `chip`.

## Related

- `badge` — denser count/short-label indicator with no icon affordance.
- `chip` — interactive/removable token.

## Best practices

- Colour comes from `variant` or `severity`; the optional icon is decorative — keep it `aria-hidden`.
- Pick the colour by meaning with the table in When to use. Do not use `danger` for a state that is only off (Inactive): it reads as an error.
- Do not restyle a Tag with colour classes to get a tint; every tint is a `variant` or a `severity`.
- Do not round a Tag into a pill with a class: every Tag has the one control shape, so tags in a row line up.

## Usage

```vue
<script setup>
  import Tag from '@aziontech/ui/tag'
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

| Prop       | Type                                                        | Default     | Required | JSDoc                                                                                                                                                                                                  |
| ---------- | ----------------------------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`    | `string`                                                    | `''`        | false    | Fallback text when the default slot is empty.                                                                                                                                                          |
| `variant`  | `'primary' \| 'accent' \| 'contrast'`                       | `'primary'` | false    | Emphasis look of the tag surface and label, used when `severity` is not set: `primary` (the logo orange, one value per list), `accent` and `contrast` (`var(--bg-contrast)` / `var(--text-contrast)`). |
| `severity` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | —           | false    | Status colour of the tag surface and label, the shared `Severity` scale exported from this component; wins over `variant` when set.                                                                    |
| `size`     | `'small' \| 'medium'`                                       | `'medium'`  | false    | Size token; `medium` is 24px tall, `small` is 20px.                                                                                                                                                    |
| `icon`     | `string`                                                    | `''`        | false    | Azion icon class for the leading icon.                                                                                                                                                                 |

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

| Region              | Token (TOKENS.md)                                                      |
| ------------------- | ---------------------------------------------------------------------- |
| typography (medium) | `.text-tag-md` + `leading-none` (Figma Typography/Tag/md, 12px)        |
| typography (small)  | `.text-tag-sm` + `leading-none` (Figma Typography/Tag/sm, 11px)        |
| spacing (medium)    | `var(--spacing-xs)` horizontal padding and icon gap                    |
| spacing (small)     | `var(--spacing-2xs)` horizontal padding and icon gap                   |
| shape               | `var(--shape-control)`, the one shape of every tag                     |
| surface (primary)   | `var(--primary)` / `var(--primary-foreground)`, WCAG AA in both themes |
| surface (contrast)  | `var(--bg-contrast)` / `var(--text-contrast)`                          |
| surface (neutral)   | `var(--bg-selected)` / `var(--text-default)`                           |
| ring                | `var(--ring-color)`                                                    |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: none; the tag is not focusable. A focusable control that holds a tag draws its own ring.
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state; the `primary` label is `--primary-foreground` on the logo orange fill (6.7:1).
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional `icon` is the consumer's choice and does not mirror.
- Keyboard: no horizontal arrow-key logic.
- Isolation: the label renders `dir="auto"`, so a value in another script (a domain, an ID) keeps its own direction inside right-to-left UI; a label with no letter (a count, `+10.5%`, `#1024`) renders `dir="ltr"`, so its sign and unit stay in order in every engine.

## Examples

- Default
- Severities — the five status colours.
- Variants — the three emphasis looks.
- Sizes
- WithIcon

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
- Do not add examples beyond Default + per `variant` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
