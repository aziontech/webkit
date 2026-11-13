# Radio Button

> Atomic exclusive-choice control only — the circular radio input from Figma (no label, description, or helper). Wrap it in a horizontal `Field`, or a `Field.Label` choice card, for labeled layouts.

- Import: `import RadioButton from '@aziontech/webkit/radio-button'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [radio-button.json](https://github.com/aziontech/webkit/blob/main/.specs/radio-button.json)

## When to use

- One choice from a small set of mutually exclusive options whose labels are laid out separately (a table row, a custom option row).
- A custom radio layout that the horizontal `Field` and the `Field.Label` choice card do not cover.

## Do

- Bind every radio in a group to the same `v-model` and give them the same `name`; each one emits its own `value` when selected.
- value` and `modelValue` are strings; map numeric or object ids to strings before binding.
- Give each radio an accessible name: point a `label` element's `for` at `inputId`, or pass `aria-label`.
- Wrap the group in a `fieldset` with a `legend` so the question itself is announced.

## Don’t

- A radio option in a form that needs its own label, description, or helper text → wrap it in a horizontal `field` (`Field orientation="horizontal"` + `Field.Content`).
- Options that need visual weight, such as plans or tiers → use a `field` choice card (`Field.Label` wrapping a horizontal `Field`), or `radio-cards` for a horizontal grid of cards.
- More than one option may be selected → use `checkbox`.
- The options are many or loaded from data → use `select`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [field](field.md) — a horizontal `Field` puts the radio beside its label and description (the default inside forms); a `Field.Label` wrapping it is a card-style option with a selected border and background. Group the options in `Field.Set` + `Field.Legend`.
- [radio-cards](radio-cards.md) — horizontal grid of selectable cards with its own model.
- [checkbox](checkbox.md) — the multi-pick counterpart.
- [select](select.md) — single choice from a dropdown when the options do not fit inline.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | `undefined` | false | Option value for this radio instance. |
| `name` | `string` | `undefined` | false | HTML name shared across a mutually exclusive group. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `inputId` | `string` | `undefined` | false | id for the native input; links label to control. |
| `modelValue` | `string \| undefined` | `undefined` | false | Two-way value (`v-model`). |

## v-model

| Model     | Type     | Default     | Emits               | Notes                                                                                                         |
| --------- | -------- | ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------- |
| `v-model` | `string` | `undefined` | `update:modelValue` | Selected value via `defineModel`; set to this radio's `value` when it is selected. Uncontrolled when unbound. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-disabled` mirrors the `disabled` prop
- `data-checked` mirrors selected state
- Touch: the native input that receives the click extends past the 20 px circle to 24 × 24 px, and to 44 × 44 px on a coarse pointer; the drawn circle does not change.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses native input; `Space` selects within group.
- ARIA: native `type="radio"` input with `aria-checked`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Examples

### Default

```vue
<script setup>
  import RadioButton from '@aziontech/webkit/radio-button'
  import { ref } from 'vue'

  const selected = ref('')
</script>

<template>
  <RadioButton
    v-model="selected"
    name="webkit-radio"
    value="a"
    input-id="webkit-radio-a"
    aria-label="Option A"
  />
</template>
```

### Disabled

```vue
<script setup>
  import RadioButton from '@aziontech/webkit/radio-button'
  import { ref } from 'vue'

  const selected = ref('a')
</script>

<template>
  <fieldset class="flex items-center gap-(--spacing-4) border-0 p-0 m-0">
    <RadioButton
      v-model="selected"
      name="webkit-radio-disabled"
      value="a"
      disabled
      input-id="webkit-radio-disabled-a"
      aria-label="Disabled selected"
    />
    <RadioButton
      v-model="selected"
      name="webkit-radio-disabled"
      value="b"
      disabled
      input-id="webkit-radio-disabled-b"
      aria-label="Disabled unselected"
    />
  </fieldset>
</template>
```
