---
name: divider
category: layout
structure: monolithic
status: approved
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=479-886
  node_id: 479:886
checksum: abadc01cd4dc1c015b0b91cd69604d389744f3f06fcd52eb00dc2e7fbad08570
created: 2026-06-25
last_updated: 2026-06-26
---

# Divider — Component Spec

## Purpose

Thin separator line that visually splits content into groups. Renders as a full-width hairline (`horizontal`) or full-height hairline (`vertical`), and can carry centered content (an "Or"-style label) when the default slot or `label` prop is set. Unlike `ScrollArea` it adds no scrolling behaviour; it is a purely decorative-yet-semantic boundary exposing `role="separator"`.

## Usage

```vue
<script setup>
import Divider from '@aziontech/webkit/divider'
</script>

<template>
  <Divider />
  <Divider orientation="vertical" />
  <Divider label="Or" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | no | Layout axis of the separator line. |
| `label` | `string` | `''` | no | Fallback centered text shown when the default slot is empty. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Centered content; overrides `label` when provided. |

## States

- Visual states: `default`
- `data-orientation` mirrors the `orientation` prop: `horizontal` | `vertical`

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| line | `var(--border-default)` |
| typography (label) | `.text-label-sm` |
| text (label) | `var(--text-muted)` |
| spacing (gap around label) | `var(--spacing-sm)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — the separator is non-interactive and not in the tab order.
- Keyboard map: not applicable — no interactive controls.
- ARIA: root carries `role="separator"` and `aria-orientation="{orientation}"`. A labelled divider keeps the `separator` role; the label is exposed as the separator's accessible content.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state — the muted label text meets the body-text ratio against canvas/surface.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states — not applicable; the component declares no motion.
- Touch target ≥40×40 px — not applicable; the component is non-interactive.

## Stories (Storybook)

All stories share one reactive render that binds both `orientation` and `label`, so every control updates the canvas live.

- Default — reactive playground; the `orientation` and `label` controls drive a single divider.
- WithLabel — horizontal divider with a centered `label` ("OR") in the middle. Exercises the `label` prop / default slot.
- Vertical — vertical divider with a centered `label` ("OR") in the middle (the parent supplies the height); covers the `vertical` orientation with a label.

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
