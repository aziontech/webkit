# Number Input

> Numeric input field with optional increment/decrement spinner buttons. Use when the value is strictly numeric (counts, quantities, ports, thresholds, currency without formatting). Distinct from `input` because it enforces numeric type, supports `min`/`max`/`step`, and renders chevron-up/chevron-down controls on the trailing edge.

- Import: `import NumberInput from '@aziontech/webkit/number-input'`
- Category: input · Surface: app · Structure: monolithic
- API as JSON: [number-input.json](number-input.json)

## When to use

- Capture a strictly numeric value (counts, quantities, ports, prices).

## Do

- Set `min` / `max` / `step` to constrain input rather than validating after the fact.
- Use `inputmode="numeric"` semantics for mobile keyboards.
- Set `nullable` on an optional field (a port, a limit) so a cleared field stays unset (`null`) instead of falling back to `min ?? 0`.

## Don’t

- The value is free text → use `input`.
- The user picks from a fixed set of numbers → use `select`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [input](input.md) — free-text sibling with the same field API.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
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
| `nullable` | `boolean` | `false` | false | Lets a cleared field emit null instead of falling back to min or 0. |
| `modelValue` | `NumberInputValue<TNullable>` | `0 as NumberInputValue<TNullable>` | false | Two-way value (`v-model`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `change` | `number` | Emitted when the user commits the value (blur or Enter). With `nullable` the payload is `null` when the field is committed empty. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `leading` | — | Content rendered before the input (e.g. `$`). Both slots: `aria-hidden`. |
| `trailing` | — | Content rendered after the input, before the spinner buttons (e.g. `%`). |

## v-model

| Model     | Type                                        | Default | Emits               | Notes                                                                                                                                                                                                                                                                                                                                                                              |
| --------- | ------------------------------------------- | ------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `number` (`number \| null` with `nullable`) | `0`     | `update:modelValue` | The value via `defineModel`, clamped to `min`/`max`; updates on typing and on the spinner. A cleared field falls back to `min ?? 0`; with `nullable` it emits `null` and shows the placeholder, and the spinner on a `null` value starts at `min ?? 0` (clamped). The component is generic over `nullable`, so the model and `change` are typed `number` unless `nullable` is set. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `disabled`, `readonly`, `invalid`, `filled`, `empty` (a `nullable` field whose value is `null` shows the placeholder)
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors the `invalid` prop
- `data-readonly` mirrors the `readonly` prop (no hover border, default cursor, as on `Input`)
- `data-size` mirrors the `size` prop
- The frame, its states, adornments and touch target are the private frame `Input` renders

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2` on `var(--input-ring-offset, var(--bg-canvas))`, as on `Input`
- Keyboard map: `Tab` focuses the input; `ArrowUp`/`ArrowDown` increment/decrement by `step`; `Home`/`End` jump to `min`/`max` when defined; `Enter` commits and emits `change`.
- Direction: the `<input>` renders `dir="auto"` (digits resolve to left-to-right inside right-to-left UI); a `dir` attribute overrides it.
- ARIA: `role="spinbutton"` on the input (native `<input type="number">` provides this); `aria-valuenow`, `aria-valuemin`, `aria-valuemax` mirror the props; `aria-invalid` mirrors `invalid`; `aria-required` mirrors `required`; spinner buttons have `aria-label` ("Increment" / "Decrement") and `tabindex="-1"` so keyboard users use arrow keys.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none` on animated state changes.
- Touch target: on a coarse pointer the two steppers sit side by side in an 80 px column (about 40 px each), and each carries an invisible `aria-hidden` child (`data-slot="touch-target"`) shown only under `pointer-coarse:` that extends its hit area to 44 px tall (the frame stops clipping on a coarse pointer so the hit area is not cut). On a fine pointer the steppers stay stacked at the drawn size; arrow keys are the primary interaction. The field also has `Input`'s touch target; a press on the frame focuses the input.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the stepper buttons point up and down and do not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: the `<input>` renders `dir="auto"`; a `dir` attribute overrides it.

## Responsive

- Touch: on coarse pointers (`pointer-coarse:`) the typed text steps up to 16 px (`text-body-md`; `text-label-code-lg` in the code face), so iOS Safari does not zoom the page when the field takes focus; fine pointers keep the dense size.

## Examples

### Default

```vue
<script setup>
  import Field from '@aziontech/webkit/field'
  import NumberInput from '@aziontech/webkit/number-input'
  import { ref } from 'vue'

  const value = ref(1)
</script>

<template>
  <Field class="w-full max-w-(--container-xs)">
    <Field.Label>Quantity</Field.Label>
    <NumberInput
      v-model="value"
      :min="0"
      :max="100"
      :step="1"
    />
    <Field.Description>From 0 to 100.</Field.Description>
  </Field>
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
  <div class="flex w-full max-w-80 flex-col gap-(--spacing-md)">
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
  <div class="w-full max-w-80">
    <NumberInput
      v-model="value"
      aria-label="Quantity"
      disabled
    />
  </div>
</template>
```
