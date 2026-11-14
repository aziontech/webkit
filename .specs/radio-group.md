---
name: radio-group
category: inputs
structure: composition
status: implemented
spec_version: 1
template: 2
checksum: f12b23b0a4caef294fa45e3cd7a5db0d8b1d3919a7e75e7e1b2e95975c8ca513
created: 2026-11-14
last_updated: 2026-11-14
---

# Radio Group — Component Spec

## Purpose

RadioGroup picks exactly one value from a short list of labelled options shown at once. The root is a `radiogroup` that owns the value (`v-model`), the shared form `name`, the group `disabled` / `required` / `invalid` state and the layout axis, and hands them to every `RadioGroup.Item` through `provide`/`inject`; each item draws the `RadioButton` circle beside its label. Because the items are native radios that share one `name`, the group is a single tab stop and the arrow keys move the selection, as the APG radio group pattern asks, with no wiring by the consumer. It differs from `RadioButton`, a bare circle the consumer groups by hand, and from `RadioCards`, which shows each option as a card with an icon and a description.

## When to use

- A required choice of one option among two to seven, where every option should stay visible (billing cycle, region, notification channel).
- A settings form that posts with a native `form` or `FormData`: the selected value submits under `name`.
- A choice inside a `Field` that needs the group label, description and error wired to it.

## When NOT to use

- Options that need an icon, a description and a card surface → use `RadioCards`.
- More than about seven options, or options loaded on demand → use `Select`.
- A single on/off setting → use `Switch` or `Checkbox`.
- Several options that may all be on at once → use `Checkbox` items in a `Field.Set`.
- A compact segmented control that switches a view → use `ToggleGroup`.

## Related

- `radio-button` — the circle each item renders; use it alone only when the layout around the circle is fully custom.
- `radio-cards` — one choice shown as cards with an icon, a description and an optional tag.
- `toggle-group` — a segmented button group for switching views or filters.
- `field` — wraps the group with its title, description and error; `Field.Set` with `Field.Legend` names it natively.

## Best practices

- Name the group: put it in a `Field.Set` with a `Field.Legend`, give the `Field` a `Field.Title`, or set `aria-label` on the root.
- Keep labels short and parallel, and order options by likelihood or by a natural sequence.
- Preselect a sensible option when one exists; leave it empty only when the person must choose deliberately, and then set `required`.
- Use `orientation="horizontal"` only for two or three short options; longer lists read better stacked.
- Set `name` whenever the form posts natively; without it the radios share a generated name that is still submitted.

## Usage

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import RadioGroup from '@aziontech/webkit/radio-group'

  const cycle = ref('monthly')
</script>

<template>
  <RadioGroup
    v-model="cycle"
    name="billing-cycle"
    aria-label="Billing cycle"
  >
    <RadioGroup.Item value="monthly">Monthly</RadioGroup.Item>
    <RadioGroup.Item value="yearly">Yearly</RadioGroup.Item>
    <RadioGroup.Item
      value="custom"
      disabled
    >
      Custom contract
    </RadioGroup.Item>
  </RadioGroup>
</template>
```

Tree-shaking alternative — the standalone root and the item from their own entries:

```vue
<script setup lang="ts">
  import RadioGroup from '@aziontech/webkit/radio-group-root'
  import RadioGroupItem from '@aziontech/webkit/radio-group-item'
</script>
```

## Sub-components

- `radio-group-item/radio-group-item.vue` — one option: a `label` that wraps the `RadioButton` circle and the option text from its default slot. It reads the group's value, `name`, `disabled`, `required` and `invalid` from the injected context, so it takes no `v-model` and no `name` of its own; selecting it writes its `value` to the group. Props: `value: string` (required, no default) — the value written to the group when this option is selected; `disabled?: boolean` (default `false`) — disables this option only. Slot: `default` — the option label; clicking it selects the option. Test id: `<root testid>__item`, its circle `<root testid>__item-control`. It throws when rendered outside a `RadioGroup`.

Layout:

```
packages/webkit/src/components/inputs/radio-group/
├── radio-group.vue
├── index.ts
├── injection-key.ts
└── radio-group-item/
    └── radio-group-item.vue
```

`index.ts` attaches the item to the root as `RadioGroup.Item`. Exports: `./radio-group` → `index.ts`, `./radio-group-root` → `radio-group.vue`, `./radio-group-item` → `radio-group-item/radio-group-item.vue`.

## Props

| Prop          | Type                         | Default      | Required | JSDoc                                                                                                                              |
| ------------- | ---------------------------- | ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | `string`                     | `''`         | false    | Form field name shared by every radio; the selected value submits under it. Empty uses a generated name so the radios still group. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | false    | Layout axis: options stacked, or in a wrapping row. Arrow keys move the selection on both axes either way.                         |
| `disabled`    | `boolean`                    | `false`      | false    | Disables every option and applies the disabled tokens.                                                                             |
| `required`    | `boolean`                    | `false`      | false    | Requires a selection: sets `aria-required` on the group and `required` on the radios, so a native form blocks an empty submit.     |
| `invalid`     | `boolean`                    | `false`      | false    | Marks the group invalid: sets `aria-invalid` on the group and on every radio.                                                      |

## v-model

| Model     | Type                  | Default     | Emits               | Notes                                                                                                                               |
| --------- | --------------------- | ----------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `string \| undefined` | `undefined` | `update:modelValue` | Selected value via `defineModel` on the root. Unbound, the group keeps its own selection, starting empty. Emits the item's `value`. |

## Events

_none_

## Slots

| Slot      | Scope | Notes                   |
| --------- | ----- | ----------------------- |
| `default` | —     | The `RadioGroup.Item`s. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `checked`, `disabled`, `invalid`
- Root: `role="radiogroup"`; `data-orientation` (`vertical` | `horizontal`); `data-disabled`, `data-required` and `data-invalid` mirror the group state (the `Field` state included).
- Item: `data-checked` while selected, `data-disabled` while the item or the group is disabled.
- The circle, its hover, focus ring, checked and disabled looks are the `RadioButton`'s.
- Not states of this component: `loading`, `empty`, `error` (the `Field.Error` carries the message) and `readonly` (a fixed choice is plain text, not a disabled group).

## Motion & Animations

| Trigger                 | Animation / Transition  | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
| ----------------------- | ----------------------- | ------------------------------------------------- | ----------------------- |
| hover / focus / checked | the `RadioButton`'s own | inline (matches catalog)                          | the `RadioButton`'s     |

The root and the item add no motion of their own.

## Tokens

| Region                        | Token (DESIGN.md)      |
| ----------------------------- | ---------------------- |
| item label                    | `.text-label-sm`       |
| item label color              | `var(--text-default)`  |
| item label color (disabled)   | `var(--text-disabled)` |
| gap between circle and label  | `var(--spacing-xs)`    |
| gap between options (stacked) | `var(--spacing-sm)`    |
| gap between options (row)     | `var(--spacing-md)`    |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the `RadioButton` ring (`ring-2 ring-(--ring-color) ring-offset-1`) on the focused radio.
- Keyboard map (APG radio group, native radios sharing one `name`): `Tab` enters the group on the checked radio, or the first one when none is checked, and the next `Tab` leaves it; `ArrowDown` / `ArrowRight` select the next enabled option and `ArrowUp` / `ArrowLeft` the previous one, wrapping at the ends and skipping disabled options; `Space` selects the focused option.
- ARIA: root `role="radiogroup"` with `aria-labelledby` (the `Field.Title` ids) or the consumer's `aria-label`, `aria-describedby` (the `Field.Description` / `Field.Error` ids), `aria-required` and `aria-invalid`; each option is a native `type="radio"` input named by its wrapping `label`. No `aria-checked` on the native radios: the checked state is native.
- Contrast ≥4.5:1 for the label text, ≥3:1 for the circle, including the disabled state.
- Touch target: the whole label is clickable, and the native input extends to 44 × 44 px on a coarse pointer.

## Internationalization

No built-in strings: every visible text comes from the item slots and the consumer's `aria-label`.

- Formatting: none

## Right-to-left

- Layout: logical utilities only (`gap-*`, flex rows that follow `dir`); the circle sits at the inline start of each label.
- Icons: none.
- Keyboard: native radios — the browser moves the selection with the arrow keys and follows `dir="rtl"` for `ArrowLeft` / `ArrowRight`.
- User data: labels are slot content; wrap domains or ids in `bdi` at the call site when needed.

## Responsive

- Container queries: none.
- Narrow (≤ 640 px or a narrow container): a horizontal group wraps onto more rows; labels wrap within their option.
- Touch: the label is the target; the input grows to 44 px on `pointer: coarse`.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: `radio-group-root` within 1.5 KB gzip; the item, which draws the `RadioButton`, ships with the compound and its own entry.
- Runtime budget: none: a handful of native inputs.
- Heavy parts: none.

## Examples

- Default — a stacked group bound with `v-model`, one option disabled.
- Horizontal — `orientation="horizontal"` with three short options. Justified: the axis changes the layout of the whole group.
- Disabled — the whole group disabled.
- InField — the group inside `Field.Set` with a `Field.Legend`, a description and `required`. Justified: shows the Field wiring (group name, description, required) that is the reason the component exists.

## Constraints — DO NOT

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
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
