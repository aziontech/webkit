---
name: dropdown-menu
category: overlay
structure: composition
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3775-16746
  node_id: 3775:16746
checksum: 4127c081919eccd8281c4b69251be703cd99317f3c72c7b7e89eec3c3e3f2d88
created: 2026-05-22
last_updated: 2026-05-29
---
# Dropdown Menu — Component Spec

## Purpose

Layered surface above the page (modal, drawer, menu). Migrated from the existing implementation at `packages/webkit/src/components/webkit/overlay/dropdown-menu/`.

## Sub-components

- `dropdown-menu-content.vue` — Public sub-component `dropdown-menu-content`.
- `dropdown-menu-from-model.vue` — Public sub-component `dropdown-menu-from-model`.
- `dropdown-menu-group.vue` — Public sub-component `dropdown-menu-group`.
- `dropdown-menu-item.vue` — Public sub-component `dropdown-menu-item`.
- `dropdown-menu-portal.vue` — Public sub-component `dropdown-menu-portal`.
- `dropdown-menu-separator.vue` — Public sub-component `dropdown-menu-separator`.
- `dropdown-menu-trigger.vue` — Public sub-component `dropdown-menu-trigger`.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `open` | `boolean` | `undefined` | no | Controlled open state. Use with `v-model:open`. |
| `defaultOpen` | `boolean` | `undefined` | no | Initial open state when uncontrolled. |
| `closeable` | `boolean` | `undefined` | no | When true, Escape and outside click close the menu. |
| `closeOnSelect` | `boolean` | `undefined` | no | When true, selecting an item closes the menu. |
| `side` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'auto'` | `'auto'` | no | Preferred panel placement. `auto` picks the side with the most viewport space; explicit sides flip to the opposite when they overflow. |
| `sideOffset` | `number` | `undefined` | no | Gap between trigger and panel (px). |
| `alignOffset` | `number` | `undefined` | no | Horizontal offset from trigger left edge (px). |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:open` | `value: boolean` | v-model:open. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values: `open` | `closed` (where applicable)

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography | .text-body-sm |
| surface | `var(--bg-surface)` |
| text | `var(--text-default)` |
| spacing | `var(--spacing-3)` |
| shape | `var(--shape-elements)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

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
