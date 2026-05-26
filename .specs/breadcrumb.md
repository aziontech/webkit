---
name: breadcrumb
category: navigation
structure: composition
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6301
  node_id: 3374:6301
checksum: 3a8cdcdee5edffecac5713a4f76f342684c901399258047237b799fc7f8fb984
created: 2026-05-25
last_updated: 2026-05-25
---

# Breadcrumb — Component Spec

## Purpose

Shows the page hierarchy so users can navigate back to parent views. Composes `BreadcrumbList`, `BreadcrumbItem`, and `BreadcrumbSeparator` (chevron). Accepts an `items` array for the common case or slot composition for custom layouts. Reference: PrimeNG Breadcrumb (adapted to Webkit tokens).

## Sub-components

- `breadcrumb.vue` — Root `<nav>` with `aria-label="Breadcrumb"`.
- `breadcrumb-list.vue` — Ordered list wrapper (`<ol>`) for segments.
- `breadcrumb-item.vue` — Re-exported segment control (same API as `@aziontech/webkit/navigation/breadcrumb-item`).
- `breadcrumb-separator.vue` — Decorative chevron between segments (`aria-hidden`).

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `items` | `BreadcrumbItemData[]` | `() => []` | no | Ordered path segments; the last entry is treated as the current page when `current` is omitted on that entry. |

`BreadcrumbItemData`: `{ label: string; href?: string; showIcon?: boolean; icon?: string; current?: boolean }`

## Events

| Event | Payload | Notes |
|---|---|---|
| `navigate` | `href: string` | Fires when an ancestor segment is activated. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Custom composition (`BreadcrumbList` + items + separators). Used when `items` is empty. |

## States

- Visual states: inherited from `BreadcrumbItem` (default, hover, focus-visible, disabled)
- Last segment in `items` is current when its `current` is not explicitly `false`

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography | `.text-label-lg` |
| text (ancestor) | `var(--text-muted)` |
| text (current) | `var(--text-default)` |
| separator icon | `var(--text-muted)` |
| spacing gap | `var(--spacing-1)` |
| shape | `var(--shape-elements)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: on each interactive `BreadcrumbItem` segment.
- Keyboard map: `Tab` moves between ancestor links; current page is not in tab order when rendered as `span`.
- ARIA: root `nav` with `aria-label="Breadcrumb"`; list uses `<ol>` / `<li>`; separators are `aria-hidden`.
- Contrast ≥4.5:1 for labels and chevron.
- `motion-reduce:transition-none` on segment color transitions.

## Stories (Storybook)

- Default
- TwoItems — Figma Level=2 (one ancestor + current page).
- SingleItem — Figma Level=1 (current page only).
- FiveItems — Figma Level=5 (full depth demo).

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
