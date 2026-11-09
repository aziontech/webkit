---
name: breadcrumb-item
category: navigation
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6288
  node_id: 3374:6288
checksum: 4af9ce45511272f8e8887ea5d3e041c93957e5bae281d2dd3b49ed7f1bb1fdec
created: 2026-05-25
last_updated: 2026-11-09
---

# Breadcrumb Item — Component Spec

## Purpose

Single segment in a breadcrumb trail. Ancestor segments use muted label text and optional leading icon; the current page uses default text. Hover and focus-visible states match the Webkit navigation pattern (ghost overlay + focus ring).

## When to use

- Composing a breadcrumb trail by hand inside `Breadcrumb.List`, one segment per ancestor plus the current page.
- A single ancestor or current-page segment that must match the breadcrumb's muted / current styling and focus ring.

## When NOT to use

- The whole trail is known as data → use `breadcrumb` with `items`, which renders the segments for you.
- It is a standalone text link in content or a page footer → use `link`.
- It is a navigation row in an app menu → use `menu`.

## Related

- `breadcrumb` — the trail root; renders `breadcrumb-item` for each entry of `items` and re-exports it as `Breadcrumb.Item`.
- `link` — a general-purpose link without the segment's ghost hover and current-page treatment.

## Best practices

- Set `current` on the last segment only; it renders a `span` with `aria-current="page"`, drops out of the tab order and ignores `href`.
- Always pass a real `href` on ancestors — it defaults to `'#'`, and the segment renders an `a`.
- Use `show-icon` together with `icon` (a PrimeIcons class, default `pi pi-box`); `icon` alone renders nothing.
- `disabled` suppresses the `click` emit and removes the segment from the tab order; prefer omitting an unreachable ancestor over disabling it.

## Usage

```vue
<script setup>
import BreadcrumbItem from '@aziontech/webkit/breadcrumb-item'
</script>

<template>
  <BreadcrumbItem label="Applications" href="/applications" show-icon icon="pi pi-box" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `label` | `string` | `'Page Name'` | false | Visible segment label. |
| `href` | `string` | `'#'` | false | Destination when the segment is a link (ignored when `current` is true). |
| `current` | `boolean` | `false` | false | Marks the current page (last segment); renders as span with `aria-current="page"`. |
| `showIcon` | `boolean` | `false` | false | When true, renders a leading PrimeIcons icon before the label. |
| `icon` | `string` | `'pi pi-box'` | false | PrimeIcons class for the leading icon when `showIcon` is true. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `click` | `(event: MouseEvent, item: { label: string; href: string })` | Fires when the segment's link is activated (the `current` segment renders a non-interactive `span`). `item` carries the segment's `label` and `href`. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `disabled`
- `data-current` mirrors the `current` prop
- `data-disabled` mirrors the `disabled` prop

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| state change | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography | `.text-label-lg` |
| text (ancestor) | `var(--text-muted)` |
| text (current / hover) | `var(--text-default)` |
| surface (focus) | `var(--bg-mask)` |
| border (focus) | `var(--border-default)` |
| spacing gap | `var(--spacing-2)` |
| padding x | `var(--spacing-2)` |
| padding y | `var(--spacing-1)` |
| shape | `var(--shape-elements)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses link segments; `Enter` activates.
- ARIA: current segment uses `aria-current="page"`; disabled segments use `aria-disabled="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on color transitions.
- Touch target ≥40×40 px on interactive segments (padding + min height).

## Stories (Storybook)

- Default
- Current
- WithIcon
- Disabled

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
