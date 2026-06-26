---
name: empty-state
category: feedback
structure: monolithic
status: approved
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=446-864
  node_id: 446:864
checksum: 29f1b8b4fe22c0f15d54fbc3611a02685f3d3cf8133ec27d7be66ce12549d023
created: 2026-06-25
last_updated: 2026-06-25
---

# Empty State — Component Spec

## Purpose

Centered placeholder shown when a resource list or section has no content yet. Stacks a decorative illustration, a title, an optional description, and a consumer-composed actions area (buttons + documentation link) to guide the user toward a first action. Unlike `Message`, which is an inline severity banner, `EmptyState` is a full-region zero-data state and renders either inside a bordered surface card or on a plain transparent background.

## Usage

```vue
<script setup>
import EmptyState from '@aziontech/webkit/empty-state'
import Button from '@aziontech/webkit/button'
import MiniButton from '@aziontech/webkit/mini-button'
</script>

<template>
  <EmptyState
    title="No resource yet"
    description="Get started by creating your first resource."
    bordered
  >
    <template #actions>
      <div class="flex gap-[var(--spacing-3)]">
        <Button kind="secondary" label="Secondary Item" />
        <Button kind="outlined" label="Create Item" />
      </div>
      <MiniButton label="View Documentation" icon="pi pi-arrow-right" size="medium" href="#" />
    </template>
  </EmptyState>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `—` | yes | Primary heading announcing the empty resource. |
| `description` | `string` | `''` | no | Supporting body copy below the title. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Size token; affects the illustration size, the surrounding padding, and the gaps between illustration, text, and actions. |
| `bordered` | `boolean` | `false` | no | When true, wraps the content in a bordered surface card; otherwise renders on a transparent background. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `icon` | — | Decorative illustration centered above the title; rendered inside an `aria-hidden` container. Defaults to the bundled `EmptyStateIllustration` sub-component when not provided. |
| `actions` | — | Action area below the description; consumer composes buttons and the documentation link. |

## States

- Visual states: `default`
- `data-size` mirrors the `size` prop
- `data-bordered` mirrors the `bordered` prop

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| title typography | `.text-body-sm` |
| description typography | `.text-body-xs` |
| surface (bordered) | `var(--bg-surface)` |
| border (bordered) | `var(--border-default)` |
| title text | `var(--text-default)` |
| description text | `var(--text-muted)` |
| shape (bordered) | `var(--shape-button)` |
| spacing (padding, medium) | `var(--spacing-8)` (x) · `var(--spacing-12)` (y) |
| spacing (stack gap, medium) | `var(--spacing-6)` |
| spacing (title gap) | `var(--spacing-xs)` |
| spacing (actions gap) | `var(--spacing-xs)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `Typography/Heading/xss` (title, 14px regular) | `.text-body-sm` (14px regular — size/weight match) | `TODO: catalogar` — naming-only gap; no heading-named token exists at 14px. |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `Tab` focuses the consumer-supplied controls in the `actions` slot in DOM order; the region itself is non-interactive.
- ARIA: root uses `role="status"` so assistive tech announces the empty-data message; the `icon` slot container is `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Stories (Storybook)

- Default
- Sizes — composite story rendering every `size` value side by side.
- Bordered — state story (args delta `bordered: true`); justified because the bordered surface card is a distinct top-level Figma frame (446:864) that materially changes the rendered container.

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
- Do not add bespoke Storybook stories beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Stories (Storybook)" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
