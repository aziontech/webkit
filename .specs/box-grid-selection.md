---
name: box-grid-selection
category: inputs
structure: monolithic
status: implemented
spec_version: 1
checksum: 6e2f27ab192e33d9d23a681042fb68d6045e42d111fc3ca33d29bd4a0e64a485
created: 2026-05-23
last_updated: 2026-05-23
---
# Box Grid Selection — Component Spec

## Purpose

Horizontal grid of selectable cards for mutually exclusive choices (plans, roles, feature tiers). Each option shows label, optional icon and description, with optional trailing content via the `tag` slot. Migrated from the legacy `box-grid-selection` core component into the webkit inputs layer.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `string \| number \| undefined` | `undefined` | no | Currently selected item value (v-model). |
| `items` | `BoxGridSelectionItem[]` | `undefined` | yes | Options rendered as selectable cards; each entry must include `value` and `label`. |
| `disabled` | `boolean` | `false` | no | Disables all options and applies disabled tokens. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `string \| number` | v-model when the user selects an option. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | `{ item: BoxGridSelectionItem; selected: boolean }` | Overrides the entire card body for an option. |
| `tag` | `{ item: BoxGridSelectionItem; selected: boolean }` | Trailing content below label/description (e.g. plan badge). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `selected`
- `data-disabled` mirrors the `disabled` prop on root and each option
- `data-selected` mirrors whether `modelValue === item.value`

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| state change | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (label) | `.text-body-sm` |
| typography (description) | `.text-body-xs` |
| surface | `var(--bg-surface)` |
| surface (selected) | `var(--primary-selected)` |
| text | `var(--text-default)` |
| text (muted) | `var(--text-muted)` |
| border (muted) | `var(--border-muted)` |
| border (selected) | `var(--border-selected)` |
| spacing (gap) | `var(--spacing-2)` |
| spacing (card) | `var(--spacing-3)` |
| spacing (tight) | `var(--spacing-1)` |
| shape | `var(--shape-elements)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]` on each option.
- Keyboard map: `Tab` / arrow keys move focus between options; `Enter` / `Space` selects the focused option.
- ARIA: root `role="radiogroup"`; each option `role="radio"` with `aria-checked` and `aria-label` from `item.ariaLabel` or `item.label`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on color transitions.
- Touch target ≥40×40 px via card padding.

## Stories (Storybook)

- Default
- Disabled
- WithTag — demonstrates the `tag` named slot with plan badges.

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
