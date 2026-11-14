# Radio Group

> RadioGroup picks exactly one value from a short list of labelled options shown at once. The root is a `radiogroup` that owns the value (`v-model`), the shared form `name`, the group `disabled` / `required` / `invalid` state and the layout axis, and hands them to every `RadioGroup.Item` through `provide`/`inject`; each item draws the `RadioButton` circle beside its label. Because the items are native radios that share one `name`, the group is a single tab stop and the arrow keys move the selection, as the APG radio group pattern asks, with no wiring by the consumer. It differs from `RadioButton`, a bare circle the consumer groups by hand, and from `RadioCards`, which shows each option as a card with an icon and a description.

- Import: `import RadioGroupRoot from '@aziontech/webkit/radio-group-root'`
- Compound import (dot notation, not tree-shakeable): `import RadioGroup from '@aziontech/webkit/radio-group'`
- Category: inputs · Surface: product · Structure: composition
- API as JSON: [radio-group.json](https://github.com/aziontech/webkit/blob/main/.specs/radio-group.json)

## When to use

- A required choice of one option among two to seven, where every option should stay visible (billing cycle, region, notification channel).
- A settings form that posts with a native `form` or `FormData`: the selected value submits under `name`.
- A choice inside a `Field` that needs the group label, description and error wired to it.

## Do

- Name the group: put it in a `Field.Set` with a `Field.Legend`, give the `Field` a `Field.Title`, or set `aria-label` on the root.
- Keep labels short and parallel, and order options by likelihood or by a natural sequence.
- Preselect a sensible option when one exists; leave it empty only when the person must choose deliberately, and then set `required`.
- Use `orientation="horizontal"` only for two or three short options; longer lists read better stacked.
- Set `name` whenever the form posts natively; without it the radios share a generated name that is still submitted.

## Don’t

- Options that need an icon, a description and a card surface → use `RadioCards`.
- More than about seven options, or options loaded on demand → use `Select`.
- A single on/off setting → use `Switch` or `Checkbox`.
- Several options that may all be on at once → use `Checkbox` items in a `Field.Set`.
- A compact segmented control that switches a view → use `ToggleGroup`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [radio-button](radio-button.md) — the circle each item renders; use it alone only when the layout around the circle is fully custom.
- [radio-cards](radio-cards.md) — one choice shown as cards with an icon, a description and an optional tag.
- [toggle-group](toggle-group.md) — a segmented button group for switching views or filters.
- [field](field.md) — wraps the group with its title, description and error; `Field.Set` with `Field.Legend` names it natively.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `string` | `''` | false | Form field name shared by every radio; the selected value submits under it. Empty uses a generated name so the radios still group. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | false | Layout axis: options stacked, or in a wrapping row. Arrow keys move the selection on both axes either way. |
| `disabled` | `boolean` | `false` | false | Disables every option and applies the disabled tokens. |
| `required` | `boolean` | `false` | false | Requires a selection: sets `aria-required` on the group and `required` on the radios, so a native form blocks an empty submit. |
| `invalid` | `boolean` | `false` | false | Marks the group invalid: sets `aria-invalid` on the group and on every radio. |
| `modelValue` | `string \| undefined` | `undefined` | false | Two-way value (`v-model`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The `RadioGroup.Item`s. |

## Sub-component imports

- `@aziontech/webkit/radio-group-item`

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

## v-model

| Model     | Type                  | Default     | Emits               | Notes                                                                                                                               |
| --------- | --------------------- | ----------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `string \| undefined` | `undefined` | `update:modelValue` | Selected value via `defineModel` on the root. Unbound, the group keeps its own selection, starting empty. Emits the item's `value`. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `checked`, `disabled`, `invalid`
- Root: `role="radiogroup"`; `data-orientation` (`vertical` | `horizontal`); `data-disabled`, `data-required` and `data-invalid` mirror the group state (the `Field` state included).
- Item: `data-checked` while selected, `data-disabled` while the item or the group is disabled.
- The circle, its hover, focus ring, checked and disabled looks are the `RadioButton`'s.
- Not states of this component: `loading`, `empty`, `error` (the `Field.Error` carries the message) and `readonly` (a fixed choice is plain text, not a disabled group).

## Accessibility

- Visible focus: the `RadioButton` ring (`ring-2 ring-(--ring-color) ring-offset-1`) on the focused radio.
- Keyboard map (APG radio group, native radios sharing one `name`): `Tab` enters the group on the checked radio, or the first one when none is checked, and the next `Tab` leaves it; `ArrowDown` / `ArrowRight` select the next enabled option and `ArrowUp` / `ArrowLeft` the previous one, wrapping at the ends and skipping disabled options; `Space` selects the focused option.
- ARIA: root `role="radiogroup"` with `aria-labelledby` (the `Field.Title` ids) or the consumer's `aria-label`, `aria-describedby` (the `Field.Description` / `Field.Error` ids), `aria-required` and `aria-invalid`; each option is a native `type="radio"` input named by its wrapping `label`. No `aria-checked` on the native radios: the checked state is native.
- Contrast ≥4.5:1 for the label text, ≥3:1 for the circle, including the disabled state.
- Touch target: the whole label is clickable, and the native input extends to 44 × 44 px on a coarse pointer.

## Right-to-left

- Layout: logical utilities only (`gap-*`, flex rows that follow `dir`); the circle sits at the inline start of each label.
- Icons: none.
- Keyboard: native radios — the browser moves the selection with the arrow keys and follows `dir="rtl"` for `ArrowLeft` / `ArrowRight`.
- User data: labels are slot content; wrap domains or ids in `bdi` at the call site when needed.

## Internationalization

No built-in strings: every visible text comes from the item slots and the consumer's `aria-label`.

- Formatting: none

## Responsive

- Container queries: none.
- Narrow (≤ 640 px or a narrow container): a horizontal group wraps onto more rows; labels wrap within their option.
- Touch: the label is the target; the input grows to 44 px on `pointer: coarse`.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import RadioGroup from '@aziontech/webkit/radio-group'
  import { ref } from 'vue'

  const cycle = ref('monthly')
</script>

<template>
  <RadioGroup
    v-model="cycle"
    name="billing-cycle"
    aria-label="Billing cycle"
  >
    <RadioGroup.Item value="monthly">Monthly</RadioGroup.Item>
    <RadioGroup.Item value="yearly">Yearly, two months free</RadioGroup.Item>
    <RadioGroup.Item
      value="contract"
      disabled
    >
      Annual contract
    </RadioGroup.Item>
  </RadioGroup>
</template>
```

### Horizontal

```vue
<script setup>
  import RadioGroup from '@aziontech/webkit/radio-group'
  import { ref } from 'vue'

  const protocol = ref('https')
</script>

<template>
  <RadioGroup
    v-model="protocol"
    name="protocol"
    orientation="horizontal"
    aria-label="Protocol"
  >
    <RadioGroup.Item value="http">HTTP</RadioGroup.Item>
    <RadioGroup.Item value="https">HTTPS</RadioGroup.Item>
    <RadioGroup.Item value="both">Both</RadioGroup.Item>
  </RadioGroup>
</template>
```

### Disabled

```vue
<script setup>
  import RadioGroup from '@aziontech/webkit/radio-group'
  import { ref } from 'vue'

  const plan = ref('pro')
</script>

<template>
  <RadioGroup
    v-model="plan"
    name="plan"
    disabled
    aria-label="Plan"
  >
    <RadioGroup.Item value="free">Free</RadioGroup.Item>
    <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
    <RadioGroup.Item value="enterprise">Enterprise</RadioGroup.Item>
  </RadioGroup>
</template>
```
