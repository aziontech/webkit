---
name: platform-shell
category: templates
structure: monolithic
status: implemented
spec_version: 3
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3735-13804
  node_id: 3735:13804
checksum: f5db463419b0357eba4b62a68d187c435b3fd75973b87e7ca76f3feca4865a39
created: 2026-05-23
last_updated: 2026-05-23
---
# Platform Shell — Component Spec

## Purpose

Application shell template for console-style layouts per [Webkit Example (Figma 3735:13804)](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3735-13804): a full-width `GlobalHeader` menubar, a persistent navigation column in the layout stack (typically `@aziontech/webkit/layout/sidebar`), a page heading region, `TabView` tabs in the main column, and scrollable panel content. The sidebar is not an overlay — it sits beside main content in a horizontal flex row below the header.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `headerAriaLabel` | `string` | `'Global header'` | no | Accessible name for the header landmark. |
| `tabDefaultValue` | `string \| number \| null` | `'tab-1'` | no | Initial active tab when the `tabs` slot is used (uncontrolled). |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `header-left` | — | Start region inside `GlobalHeader`. |
| `header-middle` | — | Center region inside `GlobalHeader`. |
| `header-right` | — | End region inside `GlobalHeader`. |
| `sidebar` | — | Navigation column; rendered in a fixed-width aside (`320px`, Figma shell). |
| `page-header` | — | Page heading and actions above tabs (Figma PageHeading). |
| `tabs` | — | `TabView.List` + `TabView.Content` children inside shell `TabView.Root`. |
| `default` | — | Main page content when the `tabs` slot is omitted. |

## States

- Visual states: `default`

## Motion & Animations

_none_

## Tokens

| Region | Token (Design.md) |
|---|---|
| canvas | `var(--bg-canvas)` |
| main surface | inherits from children |
| navigation column width | `320px` (Figma shell aside) |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Root is a full-height layout; `GlobalHeader` renders `<header role="banner">`.
- Main content is in `<main>`.
- Navigation column is owned by slotted `layout/sidebar` (`<aside>` + `<nav>`).
- Contrast and touch targets are owned by slotted header and navigation children.

## Stories (Storybook)

- Default

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
- Do not edit `.claude/docs/Design.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
