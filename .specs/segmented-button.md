---
name: segmented-button
category: actions
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2904-5892
  node_id: 2904:5892
checksum: 2c6ba99a0eedbfb43a754baa8c9773ab79900ffea513837a8bb4a8e4729c6eee
created: 2026-11-09
last_updated: 2026-11-09
---

# SegmentedButton — Component Spec

## Purpose

SegmentedButton is a connected group of buttons that picks exactly one value out of a small set of related options, with a selection indicator that slides to the active segment. It renders as a `radiogroup` whose segments are `radio` buttons, is driven by an `options` array plus `v-model`, and works uncontrolled through `defaultValue`. It differs from `tab-view`, which switches between content panels it owns: a segmented button only holds the chosen value and leaves rendering what that value means to the consumer.

## When to use

- Switch in place between two to five related modes, views or ranges (a time range, a list/grid view, a filter scope) where exactly one is always active.
- Offer a compact single choice in a toolbar or a card header where a radio list would take too much room.
- Show a choice that is currently unavailable as a locked segment (`disabled` option) instead of hiding it.

## When NOT to use

- The choice switches between content panels that belong to the control → use `tab-view`.
- The choice is a form field with a label, helper text or validation → use `field-radio`, or `field-radio-block` when each option needs a description.
- The value is a binary on/off setting → use `switch` (or `field-switch` inside a form).
- The user can pick more than one option → use `checkbox` (or `field-checkbox`).
- The control triggers an action instead of holding a value → use `button` or `split-button`.

## Related

- `tab-view` — tabs that own their panels; reach for it when each option reveals its own content region.
- `field-radio` — the form-field single choice with label and helper text; use it inside forms.
- `field-radio-block` — single choice where each option carries a title and description.
- `switch` — a single boolean toggle.
- `button` — a lone action; the segments here hold a value instead of firing one.

## Best practices

- Keep labels to one or two words: segments never wrap (`whitespace-nowrap`) and long labels truncate.
- Give every option a unique `value`; values are coerced to strings and used as the list key and the selection identity, so duplicates collide.
- Pass `ariaLabel` whenever no visible label names the group.
- Use `fluid` to make the group fill a narrow container and share its width across segments, instead of styling the width at the call site.
- Bind `v-model` when the selection lives in the parent; use `defaultValue` only to seed an uncontrolled group.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import SegmentedButton from '@aziontech/webkit/segmented-button'

const range = ref('24h')
const options = [
  { label: '1h', value: '1h' },
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d', disabled: true }
]
</script>

<template>
  <SegmentedButton
    v-model="range"
    :options="options"
    aria-label="Time range"
    size="medium"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `options` | `SegmentedButtonOption[]` (`{ label?: string \| number; value?: string \| number; disabled?: boolean }`) | `[]` | false | Segmented choices shown as a mutually exclusive group. |
| `ariaLabel` | `string` | `undefined` | false | Accessible name when no visible group label is associated. |
| `defaultValue` | `string` | `undefined` | false | Initial selection when `v-model` is not set. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | false | Size token, on the same 28 / 32 / 40 rhythm every other control uses. |
| `fluid` | `boolean` | `false` | false | Stretches the group to its container and lets the options share that width. |

## v-model

| Model | Type | Default | Emits | Notes |
|---|---|---|---|---|
| `v-model` | `string \| undefined` | `undefined` | `update:modelValue` | Selected option value via `defineModel`. While unbound (`undefined`) the group is uncontrolled: it starts at `defaultValue`, else the first non-disabled option. Emits only when the selection changes to a different value, always as the string-coerced option `value`. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states per segment: `default`, `focus-visible`, `selected`, `disabled`.
- Root: `role="radiogroup"`; `data-size` mirrors `size` (`small` | `medium` | `large`); `data-fluid` is present only when `fluid` is set.
- Segment: `role="radio"` with `aria-checked`; `data-state="active"` on the selected segment and `"inactive"` on the others; `data-disabled` and the native `disabled` attribute on a disabled option, which also renders a trailing lock icon (`pi pi-lock`).
- Indicator: an `aria-hidden` span positioned under the selected segment from its measured size and offset; hidden when nothing is selected or the selected segment is not rendered. It re-measures on option, selection and size changes (`ResizeObserver`).
- Option normalization: a missing `label` falls back to `value`, then to `Option <n>`; a missing `value` falls back to `label`, then to the index.
- Test ids: root `actions-segmented-button` (consumer `data-testid` wins), `<testId>__indicator`, `<testId>__option`, `<testId>__option-lock`.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| segment selected / deselected (text color) | `transition-colors duration-fast-02 ease-productive-entrance` | semantic `fast-02` · `productive-entrance` | `motion-reduce:transition-none` |
| indicator slides to the selected segment | inline `transition` on `transform`, `width`, `height` (from `presets/transitions.ts`) | `duration['moderate-02']` · `curve['productive-entrance']` from `@aziontech/theme/animations` | `motion-reduce:transition-none` is declared on the indicator, but the inline `transition` style takes precedence over it |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (small, medium) | `.text-label-sm` |
| typography (large) | `.text-label-md` |
| height | `h-7` (small) · `h-8` (medium) · `h-10` (large) |
| group surface | `var(--bg-surface)` |
| group border | `var(--border-muted)` |
| group padding / gap | `var(--spacing-xxs)` |
| segment padding.x | `var(--spacing-xs)` (small) · `var(--spacing-sm)` (medium) · `var(--spacing-md)` (large) |
| segment gap (label to lock icon) | `var(--spacing-xs)` |
| shape (group, segment, indicator) | `var(--shape-button)` |
| indicator surface | `var(--bg-selected)` |
| text (selected) | `var(--text-default)` |
| text (unselected) | `var(--text-muted)` |
| disabled segment | `var(--bg-disabled)` / `var(--text-disabled)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` with `focus-visible:outline-none` on each segment.
- Keyboard map: `Tab` moves through every enabled segment (each is a native button in the tab order); `Enter` / `Space` select the focused segment; `ArrowRight` / `ArrowLeft` move the selection to the next / previous enabled segment, wrapping at the ends. Focus stays on the segment that had it while the selection moves.
- ARIA: root `role="radiogroup"` named by `ariaLabel` (`aria-label` is omitted when it is unset); each segment `role="radio"` with `aria-checked`; the indicator and the lock icon are `aria-hidden="true"`.
- Disabled options use the native `disabled` attribute, so they are skipped by `Tab` and by arrow navigation and cannot be clicked.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons): selected text uses `var(--text-default)` on `var(--bg-selected)`, unselected text `var(--text-muted)` on `var(--bg-surface)`.
- `motion-reduce:transition-none` on the segment color transition; the indicator slide is set inline and is not suppressed by it.
- Touch target: segments fill the group height minus its padding (40px group at `size="large"`).

## Stories (Storybook)

- Default
- WithDisabledOption — a group with one disabled option, showing the lock affordance and that arrow navigation skips it. Justified: disabled is per option, there is no root `disabled` prop to drive a Disabled story.
- Sizes — composite story rendering every `size` value side-by-side.
- Fluid — the group with `fluid` inside a wider container. Justified: `fluid` changes the layout of the whole group and cannot be shown in the Default frame.

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
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
