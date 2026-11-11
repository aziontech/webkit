# Checkbox

> Binary selection control. Supports a single boolean (`binary: true`) and array-based multi-select (adds or removes its `value` in the `modelValue` array) (used by `MultiSelect` and `DataTable` to drive bulk selection). The new `indeterminate` prop renders a third visual state (horizontal bar) and sets `aria-checked="mixed"` — used by parents that own a partial-selection summary (e.g. "select all" rows where some children are selected). Aligned with Figma frame `2027:7311`.

- Import: `import Checkbox from '@aziontech/webkit/checkbox'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [checkbox.json](https://github.com/aziontech/webkit/blob/main/.specs/checkbox.json)

## When to use

- A bare boolean control whose label lives outside it: a table row-selection cell, an option row in a list, a settings matrix.
- Picking several values from a short set: give each box its own `value` and bind them all to one array `v-model`.
- A "select all" control over a partial selection: set `indeterminate` while only some children are checked.

## Do

- Set `binary` for a plain true/false value; without it the checkbox adds or removes its `value` in an array `modelValue`.
- Give every checkbox an accessible name: point a `label` element's `for` at `inputId`, or pass `aria-label` (attributes land on the inner input).
- indeterminate` only changes the visual and sets `aria-checked="mixed"`; the parent computes it and decides what a click does.
- Use `readonly` for a value that cannot change in this context and `disabled` for an option that is unavailable.

## Don’t

- A form field that needs its own label, description, or helper text → wrap it in a horizontal `field` (`Field orientation="horizontal"` + `Field.Content`).
- Each option needs a bordered card with a label and description → use a `field` choice card (`Field.Label` wrapping a horizontal `Field`).
- An on/off setting that applies as soon as it flips → use `switch`.
- Only one option of the set may be chosen → use `radio-button`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [field](field.md) — `orientation="horizontal"` puts the checkbox beside its label and description (the default inside forms); a `Field.Label` wrapping that Field turns it into a bordered choice card.
- [switch](switch.md) — on/off toggle for settings that take effect immediately.
- [multi-select](multi-select.md) — renders this checkbox in every option row; use it when the option list is long.
- [table](table.md) — uses this checkbox for row selection and the select-all header.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `unknown` | `undefined` | false | Two-way bound value. Boolean in `binary` mode, scalar when paired with `value`, array when multi-selecting. |
| `value` | `unknown` | `undefined` | false | Identifier for this checkbox in non-binary mode. Compared against `modelValue` (or included in the array). |
| `binary` | `boolean` | `false` | false | When true, the checkbox toggles `modelValue` as a boolean (no `value` pairing). |
| `indeterminate` | `boolean` | `false` | false | Renders the indeterminate visual (horizontal bar). Does not affect `modelValue`; the parent owns the tri-state logic. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `readonly` | `boolean` | `false` | false | Marks the field read-only; value is visible but cannot change via interaction. |
| `inputId` | `string` | `''` | false | Forwarded to the inner `<input id>` for label association. |
| `name` | `string` | `''` | false | HTML name for form submission. |
| `tabindex` | `number` | `0` | false | Forwarded to the inner `<input tabindex>`. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:modelValue` | `unknown` | Fires on activation. Payload is the next boolean (binary mode) or the next array (every other mode). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `checked`, `indeterminate`, `disabled`, `readonly`
- `data-state` on the root: `unchecked` | `checked` | `indeterminate`
- `data-checked` mirrors `isChecked` (legacy; kept for backwards compatibility with existing `data-[checked]:` styling)
- `data-indeterminate` mirrors the `indeterminate` prop
- `data-disabled` mirrors the `disabled` prop
- `data-readonly` mirrors the `readonly` prop
- Touch: the native input that receives the click extends past the 18 px box to 24 × 24 px, and to 44 × 44 px on a coarse pointer; the drawn box does not change.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Space` toggles. (The native `<input type="checkbox">` carries the semantics.)
- ARIA: native `<input type="checkbox">` is the source of truth. `aria-checked` is set to `'mixed'` when `indeterminate` is true (with `indeterminate` DOM property also set on the input). The wrapping `<span>` is decorative.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons + borders), including disabled state.
- `motion-reduce:transition-none` on every transition-bearing class.
- Touch target — the `1.125rem` size is below 40×40 px; consumers should wrap it in a horizontal `Field` (the label extends the target) or expand the parent click area when the control sits on its own.

## Examples

### Default

```vue
<script setup>
  import Checkbox from '@aziontech/webkit/checkbox'
  import { ref } from 'vue'

  const checked = ref(false)
</script>

<template>
  <Checkbox
    v-model="checked"
    binary
    input-id="webkit-checkbox"
    aria-label="Toggle option"
  />
</template>
```

### Indeterminate

```vue
<script setup>
  import Checkbox from '@aziontech/webkit/checkbox'
  import { ref } from 'vue'

  const checked = ref(false)
</script>

<template>
  <Checkbox
    v-model="checked"
    binary
    indeterminate
    input-id="webkit-checkbox-indeterminate"
    aria-label="Toggle option"
  />
</template>
```

### Disabled

```vue
<script setup>
  import Checkbox from '@aziontech/webkit/checkbox'
  import { ref } from 'vue'

  const checked = ref(true)
  const unchecked = ref(false)
</script>

<template>
  <div class="flex items-center gap-(--spacing-4)">
    <Checkbox
      v-model="checked"
      binary
      disabled
      input-id="webkit-checkbox-disabled-on"
      aria-label="Disabled checked"
    />
    <Checkbox
      v-model="unchecked"
      binary
      disabled
      input-id="webkit-checkbox-disabled-off"
      aria-label="Disabled unchecked"
    />
  </div>
</template>
```
