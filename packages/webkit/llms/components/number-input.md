# Number Input

> Numeric input field with optional increment/decrement spinner buttons. Use when the value is strictly numeric (counts, quantities, ports, thresholds, currency without formatting). Distinct from `input` because it enforces numeric type, supports `min`/`max`/`step`, and renders chevron-up/chevron-down controls on the trailing edge.

- Import: `import NumberInput from '@aziontech/webkit/number-input'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [number-input.json](https://github.com/aziontech/webkit/blob/main/.specs/number-input.json)

## When to use

- Capture a strictly numeric value (counts, quantities, ports, prices).

## Do

- Set `min` / `max` / `step` to constrain input rather than validating after the fact.
- Use `inputmode="numeric"` semantics for mobile keyboards.

## Don’t

- The value is free text → use `input`.
- The user picks from a fixed set of numbers → use `select`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [input](input.md) — free-text sibling with the same field API.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `number` | `0` | false | v-model value (always numeric; cleared input falls back to `min ?? 0`). |
| `placeholder` | `string` | `''` | false | Text shown when the input is empty. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token; affects height, padding, and typography. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `readonly` | `boolean` | `false` | false | Marks the field as read-only; spinner buttons are inert. |
| `invalid` | `boolean` | `false` | false | Applies the invalid border/ring tokens. |
| `required` | `boolean` | `false` | false | Marks the field as required for assistive tech. |
| `min` | `number \| undefined` | `undefined` | false | Minimum allowed value; spinner stops at this bound. |
| `max` | `number \| undefined` | `undefined` | false | Maximum allowed value; spinner stops at this bound. |
| `step` | `number` | `1` | false | Increment used by the spinner buttons and arrow keys. |
| `showButtons` | `boolean` | `true` | false | Renders the chevron-up/chevron-down spinner controls. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:modelValue` | `number` | Emitted on every value change (typing or spinner). |
| `change` | `number` | Emitted when the user commits the value (blur or Enter). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `prefix` | — | Content rendered before the input (e.g. `$`). |
| `suffix` | — | Content rendered after the input, before the spinner buttons (e.g. `%`). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `disabled`, `invalid`, `filled`
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors the `invalid` prop
- `data-size` mirrors the `size` prop

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses the input; `ArrowUp`/`ArrowDown` increment/decrement by `step`; `Home`/`End` jump to `min`/`max` when defined; `Enter` commits and emits `change`.
- Direction: the `<input>` renders `dir="auto"` (digits resolve to left-to-right inside right-to-left UI); a `dir` attribute overrides it.
- ARIA: `role="spinbutton"` on the input (native `<input type="number">` provides this); `aria-valuenow`, `aria-valuemin`, `aria-valuemax` mirror the props; `aria-invalid` mirrors `invalid`; `aria-required` mirrors `required`; spinner buttons have `aria-label` ("Increment" / "Decrement") and `tabindex="-1"` so keyboard users use arrow keys.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none` on animated state changes.
- Touch target ≥40×40 px on the large size; spinner buttons remain ≥24×24 px on `small`/`medium` per Figma — justified because arrow keys provide the primary interaction.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the stepper buttons point up and down and do not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: the `<input>` renders `dir="auto"`; a `dir` attribute overrides it.

## Examples

### Default

```vue
<script setup>
  import NumberInput from '@aziontech/webkit/number-input'
  import { ref } from 'vue'

  const value = ref(1)
</script>

<template>
  <div class="w-[20rem]">
    <NumberInput
      v-model="value"
      :min="0"
      :max="100"
      :step="1"
      placeholder="Quantity"
    />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import NumberInput from '@aziontech/webkit/number-input'
  import { ref } from 'vue'

  const small = ref(1)
  const medium = ref(10)
  const large = ref(100)
</script>

<template>
  <div class="flex w-[20rem] flex-col gap-(--spacing-md)">
    <NumberInput
      v-model="small"
      size="small"
      aria-label="Quantity, small"
      :min="0"
      :max="9"
      :step="1"
    />
    <NumberInput
      v-model="medium"
      size="medium"
      aria-label="Quantity, medium"
      :min="0"
      :max="99"
      :step="5"
    />
    <NumberInput
      v-model="large"
      size="large"
      aria-label="Quantity, large"
      :min="0"
      :max="1000"
      :step="50"
    />
  </div>
</template>
```

### Disabled

```vue
<script setup>
  import NumberInput from '@aziontech/webkit/number-input'
  import { ref } from 'vue'

  const value = ref(42)
</script>

<template>
  <div class="w-[20rem]">
    <NumberInput
      v-model="value"
      aria-label="Quantity"
      disabled
    />
  </div>
</template>
```
