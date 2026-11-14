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
- Give each radio an accessible name: point a `label` element's `for` at its `id`, wrap it in a `Field`, or pass `aria-label`.
- Wrap the group in a `fieldset` with a `legend` so the question itself is announced.

## Don’t

- A radio option in a form that needs its own label, description, or helper text → wrap it in a horizontal `field` (`Field orientation="horizontal"` + `Field.Content`).
- Options that need visual weight, such as plans or tiers → use a `field` choice card (`Field.Label` wrapping a horizontal `Field`), or `radio-cards` for a horizontal grid of cards.
- More than one option may be selected → use `checkbox`.
- The options are many or loaded from data → use `select`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [radio-group](radio-group.md) — the group for a list of labelled options: it shares the `v-model`, the `name` and the Field state with every `RadioGroup.Item`, each of which draws this circle. Reach for a bare RadioButton only when the layout around the circle is fully custom.
- [field](field.md) — inside a `Field`, the input takes the field's id, description, `invalid` (`aria-invalid`), `required` and `disabled`. A horizontal `Field` puts the radio beside its label and description (the default inside forms); a `Field.Label` wrapping it is a card-style option with a selected border and background. Group the options in `Field.Set` + `Field.Legend`.
- [radio-cards](radio-cards.md) — horizontal grid of selectable cards with its own model.
- [checkbox](checkbox.md) — the multi-pick counterpart.
- [select](select.md) — single choice from a dropdown when the options do not fit inline.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | `''` | false | Option value for this radio instance. |
| `name` | `string` | `''` | false | HTML name shared across a mutually exclusive group; empty renders no `name`. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `invalid` | `boolean` | `false` | false | Marks the control invalid: sets `aria-invalid` and the danger border (unchecked). An enclosing `Field`'s `invalid` sets it too. |
| `inputId` | `string` | `''` | false | @deprecated since 6.0 — pass id (or let the enclosing Field set it). Removed in 7.0.` Wins over `id` while it is set. |
| `modelValue` | `string \| undefined` | `undefined` | false | Two-way value (`v-model`). |

## v-model

| Model     | Type     | Default     | Emits               | Notes                                                                                                         |
| --------- | -------- | ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------- |
| `v-model` | `string` | `undefined` | `update:modelValue` | Selected value via `defineModel`; set to this radio's `value` when it is selected. Uncontrolled when unbound. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors `invalid` (own prop or the enclosing `Field`); with `aria-invalid` on the control, it paints the danger border while unchecked
- `data-checked` mirrors selected state
- Consumer `class` lands on the drawn circle as a plain class (no tailwind-merge): the utilities are one flat class on the root, so the entry stays near the checkbox budget.
- Touch: the native input that receives the click extends past the 20 px circle to 24 × 24 px, and to 44 × 44 px on a coarse pointer; the drawn circle does not change.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses the native input; `Space` selects it; with a shared `name`, the arrow keys move the selection within the group.
- ARIA: native `type="radio"` input; the checked state is native, so it carries no `aria-checked`. Several radios that share one `name` are one tab stop and move with the arrow keys; `RadioGroup` wires that, plus the group name and the Field state, for you.
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
    id="webkit-radio-a"
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
      id="webkit-radio-disabled-a"
      aria-label="Disabled selected"
    />
    <RadioButton
      v-model="selected"
      name="webkit-radio-disabled"
      value="b"
      disabled
      id="webkit-radio-disabled-b"
      aria-label="Disabled unselected"
    />
  </fieldset>
</template>
```
