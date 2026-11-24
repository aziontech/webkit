---
name: toggle-group
category: action
structure: monolithic
status: implemented
spec_version: 8
template: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2904-5892
  node_id: 2904:5892
checksum: 171ceaca9918037b9b856d612e0ce9b14d497547e1f6d9399bca1e131f946d37
created: 2026-11-09
last_updated: 2026-11-23
---

# ToggleGroup — Component Spec

## Purpose

ToggleGroup is a connected group of buttons that picks exactly one value out of a small set of related options, with a selection indicator that slides to the active segment. It renders as a `radiogroup` whose segments are `radio` buttons, is driven by an `options` array plus `v-model`, and works uncontrolled through `defaultValue`. It differs from `tabs`, which switches between content panels it owns: a segmented button only holds the chosen value and leaves rendering what that value means to the consumer.

## When to use

- Use ToggleGroup (segmented control) to switch a view or mode in place (Table/Chart, 1h/24h), with two to five short segments; it is not a form field. For one choice in a form use RadioGroup; for an on/off setting use Switch; for the theme in app chrome use ThemeSwitcher.
- Switch in place between two to five related modes, views or ranges (a time range, a list/grid view, a filter scope) where exactly one is always active.
- Offer a compact single choice in a toolbar or a card header where a radio list would take too much room.
- Show a choice that is currently unavailable as a disabled segment instead of hiding it; mark it `locked` when it is unavailable because of a plan or a permission.

## When NOT to use

- The choice switches between content panels that belong to the control → use `tabs`.
- The choice is a form field with a label, helper text or validation → use `radio-group` (`variant="card"` when each option needs a description).
- The value is a binary on/off setting → use `switch` (in a horizontal `field` inside a form).
- The user can pick more than one option → use `checkbox` (in a horizontal `field`).
- The control triggers an action instead of holding a value → use `button` or `split-button`.

## Related

- `tabs` — tabs that own their panels; reach for it when each option reveals its own content region.
- `radio-group` — the form-field single choice; `variant="card"` when each option carries a description.
- `theme-switcher` — the system / light / dark choice in app chrome.
- `switch` — a single boolean toggle.
- `button` — a lone action; the segments here hold a value instead of firing one.
- Naming: Radix and shadcn `ToggleGroup` is a group of `aria-pressed` toggles with `type="single" | "multiple"`. This component is the single-select segmented control (Cloudscape and Geist call it a segmented control): one value is always selected and the segments are radios. There is no multiple mode; for several independent toggles use `checkbox`es or `ButtonGroup` toggles.

## Best practices

- Keep labels to one or two words. When the options do not fit their container they flow onto another row, and a label breaks across lines only when one option alone is wider than the group; a label is never cut off.
- Give every option a unique `value`; values are coerced to strings and used as the list key and the selection identity, so duplicates collide.
- Pass `ariaLabel` whenever no visible label names the group.
- Use `fluid` to make the group fill a narrow container and share its width across segments, instead of styling the width at the call site.
- Bind `v-model` when the selection lives in the parent; use `defaultValue` only to seed an uncontrolled group.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import ToggleGroup from '@aziontech/webkit/toggle-group'

  const range = ref('24h')
  const options = [
    { label: '1h', value: '1h' },
    { label: '24h', value: '24h' },
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d', disabled: true }
  ]
</script>

<template>
  <ToggleGroup
    v-model="range"
    :options="options"
    aria-label="Time range"
    size="medium"
  />
</template>
```

## Props

| Prop           | Type                                                                                                                   | Default     | Required | JSDoc                                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `options`      | `ToggleGroupOption[]` (`{ label?: string \| number; value?: string \| number; disabled?: boolean; locked?: boolean }`) | `[]`        | false    | Segmented choices shown as a mutually exclusive group.                                                                   |
| `ariaLabel`    | `string`                                                                                                               | `''`        | false    | Accessible name when no visible group label is associated.                                                               |
| `defaultValue` | `string`                                                                                                               | `undefined` | false    | Initial selection when `v-model` is not set.                                                                             |
| `size`         | `'small' \| 'medium' \| 'large'`                                                                                       | `'large'`   | false    | Size token, on the same 28 / 32 / 40 rhythm every other control uses.                                                    |
| `fluid`        | `boolean`                                                                                                              | `false`     | false    | Stretches the group to its container and lets the options share that width.                                              |
| `disabled`     | `boolean`                                                                                                              | `false`     | false    | Disables every option of the group.                                                                                      |
| `name`         | `string`                                                                                                               | `''`        | false    | Form field name. Set, a hidden input carries the selected value so a native `form` submits it; `disabled` leaves it out. |

**Generic.** Props stay an inline literal in `defineProps` because the component is generic (`TValue`): a named `interface Props` inside a generic `<script setup>` fails declaration emit (TS4025).

**Locked options.** `locked: true` on an option draws the trailing lock icon (unavailable because of a plan or a permission). `disabled` alone draws no lock; set `locked: true` on the options a plan or a permission blocks (6.0 removed the implicit lock on disabled options).

## v-model

| Model     | Type                  | Default     | Emits               | Notes                                                                                                                                                                                                                                                                     |
| --------- | --------------------- | ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `TValue \| undefined` | `undefined` | `update:modelValue` | Selected option value via `defineModel`. While unbound (`undefined`) the group is uncontrolled: it starts at `defaultValue`, else the first non-disabled option. Emits only when the selection changes to a different value, always as the string-coerced option `value`. |

**Generic.** The component is generic over `TValue extends string` (default `string`), inferred from the bound `v-model`: on a `Ref<'day' | 'week'>`, `update:modelValue` sends `'day' | 'week' | undefined` (the `undefined` of an unbound model), so `v-model` binds the union with no cast. `ToggleGroupOption<TOptionValue = string | number>` types a list against the same union (`ToggleGroupOption<'day' | 'week'>[]`); the `options` prop itself stays `ToggleGroupOption[]`, so a list typed `{ label: string; value: string }[]` still binds. `ToggleGroupOption` and `ToggleGroupSize` are exported by `@aziontech/webkit/toggle-group`.

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states per segment: `default`, `focus-visible`, `selected`, `disabled`.
- Root: `role="radiogroup"`; consumer attributes (`id`, `aria-labelledby`, `aria-describedby`, …) land on it; `data-disabled` when `disabled`; `data-size` mirrors `size` (`small` | `medium` | `large`); `data-fluid` is present only when `fluid` is set.
- Segment: `role="radio"` with `aria-checked`; `data-state="active"` on the selected segment and `"inactive"` on the others; `data-disabled` and the native `disabled` attribute on a disabled option (or every option when the root is `disabled`); a trailing lock icon (`az az-lock`) and `data-locked` on a locked option (see Locked options). Each segment carries a touch-target span that grows its hit area to 44px tall under `pointer-coarse`, never sideways into a neighbour.
- Indicator: an `aria-hidden` span positioned under the selected segment from its measured size and offset; hidden when nothing is selected or the selected segment is not rendered. It re-measures on option, selection and size changes (`ResizeObserver`).
- Option normalization: a missing `label` falls back to `value`, then to `Option <n>`; a missing `value` falls back to `label`, then to the index.
- Test ids: root `toggle-group` (consumer `data-testid` wins), `<testId>__indicator`, `<testId>__option`, `<testId>__option-lock`.
- Reflow: the root is capped at the width of its container (`max-w-full`, `min-w-0`) and wraps (`flex-wrap`): options that do not fit move to another row, the selected-option indicator follows them, and a label wraps inside its option only when that option alone is wider than the group. Heights are minimums (28 / 32 / 40 px for one row), so a wrapped group grows instead of clipping.

## Motion & Animations

| Trigger                                    | Animation / Transition                                                                                                                               | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| segment selected / deselected (text color) | `transition-colors duration-fast-02 ease-productive-entrance`                                                                                        | semantic `fast-02` · `productive-entrance`        | `motion-reduce:transition-none` |
| indicator slides to the selected segment   | `transition-[transform,width,height] duration-moderate-02 ease-productive-entrance` (the offset is an inline `transform`, the transition is a class) | semantic `moderate-02` · `productive-entrance`    | `motion-reduce:transition-none` |

## Tokens

| Region                            | Token (DESIGN.md)                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| typography (small, medium)        | `.text-label-sm`                                                                         |
| typography (large)                | `.text-label-md`                                                                         |
| height                            | `min-h-7` (small) · `min-h-8` (medium) · `min-h-10` (large): one row; a wrapped group grows |
| group surface                     | `var(--bg-surface)`                                                                      |
| group border                      | `var(--border-muted)`                                                                    |
| group padding / gap               | `var(--spacing-2xs)`                                                                     |
| segment padding.x                 | `var(--spacing-xs)` (small) · `var(--spacing-sm)` (medium) · `var(--spacing-md)` (large) |
| segment gap (label to lock icon)  | `var(--spacing-xs)`                                                                      |
| shape (group, segment, indicator) | `var(--shape-button)`                                                                    |
| indicator surface                 | `var(--bg-selected)`                                                                     |
| text (selected)                   | `var(--text-default)`                                                                    |
| text (unselected)                 | `var(--text-muted)`                                                                      |
| disabled segment                  | transparent / `var(--text-disabled)` (no fill, so it never reads as a second selected option) |
| ring                              | `var(--ring-color)`                                                                      |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` with `focus-visible:outline-none` on each segment.
- Keyboard map: the group is one tab stop (roving `tabindex`): `Tab` lands on the selected segment, or on the first enabled one when nothing is selected, and the next `Tab` leaves the group; `Enter` / `Space` select the focused segment; `ArrowRight` / `ArrowDown` and `ArrowLeft` / `ArrowUp` move the selection to the next / previous enabled segment, wrapping at the ends, and `Home` / `End` to the first / last enabled one (the APG radio group map), and focus moves with it so the newly checked radio is announced.
- ARIA: root `role="radiogroup"` named by `ariaLabel` (`aria-label` is omitted when it is empty) or by a consumer `aria-labelledby` pointing at a visible label; each segment `role="radio"` with `aria-checked`; the indicator and the lock icon are `aria-hidden="true"`.
- Disabled options use the native `disabled` attribute, so they are skipped by arrow navigation, never take the tab stop and cannot be clicked.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons): selected text uses `var(--text-default)` on `var(--bg-selected)`, unselected text `var(--text-muted)` on `var(--bg-surface)`.
- `motion-reduce:transition-none` on the segment color transition and on the indicator slide.
- Touch target: segments fill the group height minus its padding (40px group at `size="large"`); under `pointer-coarse` a touch-target span extends each segment's hit area to 44px tall.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: item icons are the consumer's and do not mirror.
- Keyboard: `ArrowRight`/`ArrowLeft` move to the next/previous item, swapped under `dir="rtl"` (`useDirection(rootEl)` + `logicalArrowKey`): `ArrowLeft` moves forward.
- Indicator: the selection pill is anchored with a physical `left: 0` and moved by the measured `offsetLeft`, which is already a physical distance, so it lands on the selected item in both directions.
- User data: none.

## Internationalization

| Key                  | English source   | Override prop                  |
| -------------------- | ---------------- | ------------------------------ |
| `toggleGroup.option` | `Option {index}` | an option `label` (or `value`) |

- Option labels are consumer copy; the catalog string is only the fallback for an option with neither `label` nor `value`.

## Responsive

- The root is capped at its container (`max-w-full`, `min-w-0`); options that do not fit flow onto another row instead of truncating, and `fluid` makes the options in each row share its full width.
- Touch: under `pointer-coarse` each segment is drawn at least 44px tall, so a group that wraps its options onto several rows still gives every option a full 44px target; each segment is also at least 44px wide, and its touch-target span grows only vertically, so two neighbouring segments never share a hit area.
- No hover-only affordance: selection, focus and disabled states are all visible without hover.

## Performance

- Bundle budget: see `.size-limit.json` entry `toggle-group`.
- Runtime: renders `options.length` buttons; one `ResizeObserver` re-measures the indicator on root and option resizes, disconnected on unmount.

## Examples

- Default
- WithDisabledOption — a group with one disabled option, showing the lock affordance and that arrow navigation skips it. Justified: disabled is per option; the root `disabled` prop disables the whole group the same way.
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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
