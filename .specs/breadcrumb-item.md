---
name: breadcrumb-item
category: navigation
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6288
  node_id: 3374:6288
checksum: 744eb43445f8bfba62546a4b43ece21ee5f8a58cea59e4e2433205294fb1e4cc
created: 2026-05-25
last_updated: 2026-05-25
---

# Breadcrumb Item — Component Spec

## Purpose

Single segment in a breadcrumb trail. Ancestor segments use muted label text and optional leading icon; the current page uses default text. Hover and focus-visible states match the Webkit navigation pattern (ghost overlay + focus ring).

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `label` | `string` | `'Page Name'` | no | Visible segment label. |
| `href` | `string` | `'#'` | no | Destination when the segment is a link (ignored when `current` is true). |
| `current` | `boolean` | `false` | no | Marks the current page (last segment); renders as span with `aria-current="page"`. |
| `showIcon` | `boolean` | `false` | no | When true, renders a leading PrimeIcons icon before the label. |
| `icon` | `string` | `'pi pi-box'` | no | PrimeIcons class for the leading icon when `showIcon` is true. |
| `disabled` | `boolean` | `false` | no | Disables interaction and applies disabled tokens. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `click` | `MouseEvent` | Fires when the segment is activated (link or button). |

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

| Region | Token (Design.md) |
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

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
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
- Do not edit `.claude/docs/Design.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
