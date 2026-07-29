---
name: empty-state
category: feedback
structure: monolithic
status: approved
spec_version: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=446-864
  node_id: 446:864
checksum: 4ee0f68c74c6046d625e69c006af16abf34e63dfac4b3d569eb229ac0207cd20
created: 2026-06-25
last_updated: 2026-07-22
---

# Empty State — Component Spec

## Purpose

Centered placeholder shown when a resource list or section has no content yet. Stacks an optional standardized adornment, a title, an optional description, and a consumer-composed actions area (buttons + documentation link) to guide the user toward a first action. The adornment is a standardized, size-scaled featured-icon tile driven by the `icon` prop; the consumer may instead supply custom content via the `icon` slot, or omit both for no adornment. Unlike `Message`, which is an inline severity banner, `EmptyState` is a full-region zero-data state and renders either inside a bordered surface card or on a plain transparent background.

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
| `icon` | `string` | `''` | no | PrimeIcons/Azion icon class for the standardized adornment (e.g. `pi pi-inbox`). When set, renders a size-scaled featured-icon tile; when empty and the `icon` slot is unused, no adornment renders. |
| `size` | `'small' \| 'medium'` | `'medium'` | no | Size token (subset — only `small` and `medium`; no `large`). Scales the whole block on one harmonic ramp — the adornment size, the title and description typography, the surrounding padding, and the gaps between adornment, text, and actions all step up together. |
| `bordered` | `boolean` | `false` | no | When true, wraps the content in a dashed-bordered surface card; otherwise renders on a transparent background. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `icon` | — | Custom adornment centered above the title, rendered inside an `aria-hidden` container. Overrides the `icon` prop's featured-icon tile. When neither this slot nor the `icon` prop is provided, no adornment renders. |
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
| title typography | per-`size` — see harmonic scale below |
| description typography | per-`size` — see harmonic scale below |
| surface (bordered) | `var(--bg-surface)` |
| border (bordered) | `var(--border-default)` (dashed, `var(--border-width-default)`) |
| title text | `var(--text-default)` |
| description text | `var(--text-muted)` |
| adornment tile surface | `var(--bg-surface)` |
| adornment tile border | `var(--border-default)` |
| adornment decorative layers | `var(--bg-canvas)` · `var(--border-strong)` |
| adornment shape | `var(--shape-card)` · `var(--shape-elements)` |
| adornment icon | `var(--text-default)` |
| shape (bordered) | `var(--shape-button)` |
| spacing (title gap) | `var(--spacing-xs)` |
| spacing (actions gap) | `var(--spacing-xs)` |

### Harmonic scale (per `size`)

Every axis steps up one rung per size on a single harmonic ramp. The title climbs the **heading** scale (`heading` tokens only — never `body`); the description climbs the **body** scale one rung below it, so the pair stays in proportion at every size.

| Axis | `small` | `medium` |
|---|---|---|
| title typography | `.text-heading-xxs` (14px) | `.text-heading-sm` (14 → 18px) |
| description typography | `.text-body-xs` (12px) | `.text-body-sm` (14px) |
| adornment tile | `size-8` (32px) | `size-10` (40px) |
| padding (x · y) | `var(--spacing-6)` · `var(--spacing-8)` | `var(--spacing-8)` · `var(--spacing-12)` |
| stack gap | `var(--spacing-4)` | `var(--spacing-6)` |

## Theme gaps

_none_ — the title now uses `heading` tokens at every size (`.text-heading-xxs` is 14px regular, matching the Figma `Typography/Heading/xss` title), so the previous body-token workaround is retired.

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `Tab` focuses the consumer-supplied controls in the `actions` slot in DOM order; the region itself is non-interactive.
- ARIA: root uses `role="status"` so assistive tech announces the empty-data message; the `icon` slot container is `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Stories (Storybook)

- Default — renders the standardized featured-icon tile via the `icon` prop.
- Sizes — composite story rendering every `size` value side by side (adornment scales with `size`).
- Icon — the standardized featured-icon tile adornment driven by the `icon` prop; justified because the tile is the primary adornment path and must be documented distinctly from custom slot content.
- NoAdornment — omits both the `icon` prop and the `icon` slot; justified because "no adornment" is a distinct rendered state (the adornment container does not render) that the default illustration previously masked.
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
