---
name: split-button
category: actions
structure: monolithic
status: approved
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=477-957&m=dev
  node_id: 477:957
checksum: f80b6a31121b9fc587479a52a16fbc63ea41fd8a1c65c068fb62217657753d1e
created: 2026-06-30
last_updated: 2026-07-05
---

# Split Button — Component Spec

## Purpose

A primary command button visually joined to a chevron toggle that opens an overlay menu of related actions defined by a `model` array. The primary button runs the default action; the joined toggle composes `navigation/dropdown` to present the remaining actions. Opt into `updateLabelOnSelect` to have the primary segment mirror the last-chosen menu action (label + icon), turning the control into a "default is the last selection" pattern; the primary `click` then reports that mirrored action as its second argument, so a single handler can run whichever action is active. Use it when one action is the default and related actions belong in an attached menu; for a single action use `Button`, and for a standalone menu use `Dropdown`.

## Usage

```vue
<script setup>
import SplitButton from '@aziontech/webkit/split-button'

const items = [
  { label: 'Update', value: 'update', icon: 'pi pi-refresh' },
  { label: 'Delete', value: 'delete', icon: 'pi pi-trash', disabled: true }
]
</script>

<template>
  <SplitButton
    label="Save"
    icon="pi pi-check"
    :model="items"
    @click="onSave"
    @item-click="onAction"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `label` | `string` | `''` | no | Visible label text on the primary command button. |
| `icon` | `string` | `''` | no | PrimeIcons class for the primary button's leading icon. |
| `model` | `SplitButtonItem[]` | `[]` | no | Actions rendered as rows in the attached overlay menu. |
| `kind` | `'primary' \| 'secondary' \| 'outlined'` | `'primary'` | no | Visual variant applied to both joined segments. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | no | Size token; affects height, padding, and typography. |
| `disabled` | `boolean` | `false` | no | Disables both segments and prevents the menu from opening. |
| `loading` | `boolean` | `false` | no | Shows a spinner on the primary button and takes the disabled status: both segments are disabled and the menu cannot open while it resolves. |
| `updateLabelOnSelect` | `boolean` | `false` | no | When true, selecting a menu action updates the primary button's label and icon to mirror that action and marks it as selected in the menu. Opt-in; the mirrored action is also reported as the primary `click`'s second argument, so the consumer decides what each segment does. |

`SplitButtonItem` is the menu-action shape: `{ label: string; value?: string; icon?: string; disabled?: boolean }`. When `value` is omitted, `label` identifies the action.

## Events

| Event | Payload | Notes |
|---|---|---|
| `click` | `(event: MouseEvent, item: SplitButtonItem \| null)` | Fired by the primary command button on activation. `item` is the action currently mirrored on the primary segment when `updateLabelOnSelect` is on, otherwise `null`. Never fires while `disabled` or `loading`. |
| `item-click` | `SplitButtonItem` | Fired when a menu action is selected; carries the matched `model` item. The menu cannot open while `disabled` or `loading`, so it never fires in those states. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`
- `data-kind` mirrors the `kind` prop
- `data-size` mirrors the `size` prop
- `data-disabled` mirrors the `disabled` prop
- `data-loading` mirrors the `loading` prop
- `data-state` on the menu toggle: `open` | `closed` (provided by the composed `Dropdown.Trigger`)
- When `loading`, the control takes the disabled status: the primary button shows the spinner over the disabled tokens and blocks activation (owned by `Button`), the menu toggle is natively disabled with the disabled tokens, and the composed `Dropdown` is disabled so the menu cannot open. No `click` or `item-click` is emitted while loading.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover/active state change | `transition-opacity` ghost layer (`duration-fast-02 ease-productive-entrance`) | semantic (matches `Button`) | `motion-reduce:transition-none` |
| hover/focus state change | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |
| menu open / close | provided by the composed `navigation/dropdown` overlay | semantic (owned by `Dropdown`) | owned by `Dropdown` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (large) | `.text-button-lg` |
| typography (small / medium) | `text-button-md` (semantic sibling of `.text-button-lg`) |
| brand surface | `var(--primary)` |
| brand text | `var(--primary-contrast)` |
| secondary surface | `var(--secondary)` |
| secondary text | `var(--secondary-contrast)` |
| outlined surface | `var(--bg-surface)` |
| neutral text | `var(--text-default)` |
| segment divider / border | `var(--border-default)` |
| hover overlay | `var(--bg-hover)` |
| active overlay | `var(--bg-active)` |
| outlined hover overlay | `var(--bg-mask)` |
| spacing | `var(--spacing-md)` |
| shape | `var(--shape-button)` |
| ring | `var(--ring-color)` |
| ring offset | `var(--bg-canvas)` |
| disabled surface | `var(--bg-disabled)` |
| disabled text | `var(--text-disabled)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]` on both segments; the focused segment raises its z-index so the ring is not clipped by its neighbor.
- Keyboard map: `Tab` focuses each segment; `Enter`/`Space` activates the primary button; on the toggle `Enter`/`Space`/`Down` open the menu, arrows navigate items, `Esc` closes and returns focus to the toggle (behavior owned by `Dropdown`).
- ARIA: the primary button is a native `button`; the toggle exposes `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls` via `Dropdown.Trigger` and carries an `aria-label`; the chevron icon is `aria-hidden`; `aria-busy` reflects the loading state. While `loading`, the toggle is a natively disabled button, so the menu cannot be opened by pointer or keyboard and assistive tech perceives the whole control as non-interactive.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none` on animated states.
- Touch target ≥40×40 px at the large size.

## Stories (Storybook)

Canonical layout — matches `apps/storybook/src/stories/components/actions/button/Button.stories.js`. Composite stories render every variant of one axis side-by-side in a single frame; state stories use the reusable `Template` with an args delta.

- Default
- Types — composite story rendering every `kind` value side-by-side.
- Sizes — composite story rendering every `size` value side-by-side.
- Loading — `loading` prop demonstrated: the whole control takes the disabled status (spinner on the primary segment, toggle disabled, menu blocked).
- Disabled — `disabled` prop demonstrated.
- UpdateLabelOnSelect — `updateLabelOnSelect` prop demonstrated: selecting a menu action swaps the primary button's label/icon and marks the row selected. Justified as a distinct interactive behavior not covered by the default story.

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
