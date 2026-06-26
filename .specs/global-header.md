---
name: global-header
category: layout
structure: composition
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4310-19617
  node_id: 4310:19617
checksum: 71c9e497979cb35460c5bbc6c42d632640caefda8eb5bcf0c01888fcd7e00dc1
created: 2026-05-23
last_updated: 2026-06-23
---
# Global Header — Component Spec

## Purpose

Application chrome for the top menubar: a fixed-height horizontal bar with three composable regions (start, center, end) and a dedicated brand slot for Azion logo variants. Matches the Webkit GlobalHeader (Figma node 4310:19617) — a Shell Core part with symmetric horizontal padding, a hairline bottom border, the menu trigger and brand grouped at the start, a growing nav region in the center, and trailing actions (Create, Copilot, Feedback, help, avatar) at the end. Consumers reorder or omit regions; logo and actions are not baked in.

## Sub-components

- `global-header-container.vue` — Start cluster wrapper; groups the menu trigger (`Left`) and `Brand` into one `shrink-0` flex unit, mirroring the Figma `Container` region. Optional — consumers may still place `Left`/`Brand` directly in the root.
- `global-header-left.vue` — Start region; flex row for menu and leading actions.
- `global-header-middle.vue` — Center region; grows to fill space between start and end. Also exposed as `GlobalHeader.Nav` (Figma `Nav` name); both names reference the same component.
- `global-header-right.vue` — End region; trailing actions aligned to the end.
- `global-header-brand.vue` — Brand slot wrapper sized for Azion logo SVGs (default / min).

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `ariaLabel` | `string` | `'Global header'` | no | Accessible name for the header landmark. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Root: compose `Container` (or `Left` + `Brand`), `Middle`/`Nav`, and `Right` sub-components. |
| `default` | — | Each sub-component (incl. `Container`) exposes `default` for region content. |
| `default` | — | `global-header-brand` exposes `default` for logo markup. |

## States

- Visual states: `default`
- No interactive states on the shell; children own focus/hover/disabled.

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| shell height | `h-14` (56px) |
| shell padding-x | `var(--spacing-md)` |
| shell region gap | `var(--spacing-md)` |
| start cluster (container) gap | `var(--spacing-md)` |
| start (left) region gap | `var(--spacing-xs)` |
| end (right) region gap | `var(--spacing-sm)` |
| brand logo height | `18px` |
| surface | `var(--bg-surface)` |
| border (bottom) | `var(--border-default)` |
| ring (focus on children) | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Root renders as `<header role="banner">` with `aria-label` from `ariaLabel`.
- Keyboard map: none on the shell; interactive children supply Tab order.
- ARIA: landmark only on root; brand slot should include an accessible name on the logo link or `aria-label` on the SVG parent.
- Contrast ≥4.5:1 for text and icons in slotted content.
- `motion-reduce:*` on any animated slotted controls (owned by children).
- Touch target ≥40×40 px on slotted buttons (owned by children).

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
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
