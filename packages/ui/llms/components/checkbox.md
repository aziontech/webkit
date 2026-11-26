# Checkbox

> Binary selection control. Supports a single boolean (no `value`), a scalar paired with `value`, and array-based multi-select (adds or removes its `value` in the `modelValue` array) (used by `MultiSelect` and `DataTable` to drive bulk selection). The new `indeterminate` prop renders a third visual state (horizontal bar) and sets the native `indeterminate` property, which exposes the mixed state — used by parents that own a partial-selection summary (e.g. "select all" rows where some children are selected). Aligned with Figma frame `2027:7311`.

- Import: `import Checkbox from '@aziontech/ui/checkbox'`
- Category: input · Surface: app · Structure: monolithic
- API as JSON: [checkbox.json](checkbox.json)

## When to use

- Use a Checkbox per option inside Field.Set for two to five options that all fit on screen; use Checkbox alone for an on/off choice submitted with a form. For a longer list use MultiSelect; for an on/off setting that applies at once use Switch.
- A bare boolean control whose label lives outside it: a table row-selection cell, an option row in a list, a settings matrix.
- Picking several values from a short set: give each box its own `value` and bind them all to one array `v-model`.
- A "select all" control over a partial selection: set `indeterminate` while only some children are checked.

## Do

- Leave `value` unset for a plain true/false model. With `value`, the checkbox adds or removes it in an array model, or sets a scalar model to `value` (checked) and `null` (unchecked).
- Give every checkbox an accessible name: point a `label` element's `for` at the `id` you pass (or wrap it in a `Field`), or pass `aria-label` (attributes land on the inner input).
- `indeterminate` only changes the visual and sets the native `indeterminate` property (exposed as mixed); the parent computes it and decides what a click does.
- Use `readonly` for a value that cannot change in this context and `disabled` for an option that is unavailable.

## Don’t

- A form field that needs its own label, description, or helper text → wrap it in a horizontal `field` (`Field orientation="horizontal"` + `Field.Content`).
- Each option needs a bordered card with a label and description → use a `field` choice card (`Field.Label` wrapping a horizontal `Field`).
- An on/off setting that applies as soon as it flips → use `switch`.
- Only one option of the set may be chosen → use `radio-group`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [field](field.md) — `orientation="horizontal"` puts the checkbox beside its label and description (the default inside forms); a `Field.Label` wrapping that Field turns it into a bordered choice card.
- [switch](switch.md) — on/off toggle for settings that take effect immediately.
- [multi-select](multi-select.md) — renders this checkbox in every option row; use it when the option list is long.
- [data-table](data-table.md) — uses this checkbox for row selection and the select-all header.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `unknown` | `undefined` | false | Identifier for this checkbox in a group: compared against a scalar model, or added to and removed from an array model. Unset, the model is a boolean. |
| `indeterminate` | `boolean` | `false` | false | Renders the indeterminate visual (horizontal bar). Does not affect `modelValue`; the parent owns the tri-state logic. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `readonly` | `boolean` | `false` | false | Marks the field read-only; value is visible but cannot change via interaction. |
| `invalid` | `boolean` | `false` | false | Marks the control invalid: sets `aria-invalid` and the danger border (unchecked). An enclosing `Field`'s `invalid` sets it too. |
| `name` | `string` | `''` | false | HTML name for form submission. |
| `modelValue` | `TModel` | `undefined` | false | Two-way value (`v-model`). |

## v-model

| Model     | Type     | Default     | Emits               | Notes                                                                                                                                                                                                                                                             |
| --------- | -------- | ----------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `TModel` | `undefined` | `update:modelValue` | The bound value via `defineModel`: a boolean when `value` is unset; with `value`, an array (adds or removes `value`; an undefined model counts as an empty array) or a scalar (set to `value` when checked, to `null` when unchecked). Uncontrolled when unbound. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `checked`, `indeterminate`, `disabled`, `readonly`
- `data-state` on the root: `unchecked` | `checked` | `indeterminate`
- `data-checked` mirrors `isChecked` (legacy; kept for backwards compatibility with existing `data-[checked]:` styling)
- `data-indeterminate` mirrors the `indeterminate` prop
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors `invalid` (own prop or the enclosing `Field`); with `aria-invalid` on the control, it paints the danger border while unchecked
- `data-readonly` mirrors the `readonly` prop
- Touch: the native input that receives the click extends past the 18 px box to 24 × 24 px, and to 44 × 44 px on a coarse pointer; the drawn box does not change.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Space` toggles. (The native `<input type="checkbox">` carries the semantics.) When `readonly`, `disabled`, or the parent refuses the change, the native `checked` is put back to the model's state, so assistive tech never announces a state the model does not hold; `readonly` also sets `aria-readonly` and cancels the click.
- ARIA: native `<input type="checkbox">` is the source of truth. No `aria-checked` is set on it: the checked state comes from `checked`, and the mixed state from the `indeterminate` DOM property, which browsers expose as mixed (an `aria-checked` on a native checkbox conflicts with its real state, axe `aria-conditional-attr`). The wrapping `<span>` is decorative.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons + borders), including disabled state.
- `motion-reduce:transition-none` on every transition-bearing class.
- Touch target — the `1.125rem` size is below 40×40 px; consumers should wrap it in a horizontal `Field` (the label extends the target) or expand the parent click area when the control sits on its own.

## Examples

### Default

```vue
<script setup>
  import Checkbox from '@aziontech/ui/checkbox'
  import Field from '@aziontech/ui/field'
  import { ref } from 'vue'

  const checked = ref(false)
</script>

<template>
  <Field orientation="horizontal">
    <Checkbox
      v-model="checked"
      name="email-notifications"
    />
    <Field.Label>Email notifications</Field.Label>
  </Field>
</template>
```

### Indeterminate

```vue
<script setup>
  import Checkbox from '@aziontech/ui/checkbox'
  import Field from '@aziontech/ui/field'
  import { ref } from 'vue'

  const checked = ref(false)
</script>

<template>
  <Field orientation="horizontal">
    <Checkbox
      v-model="checked"
      indeterminate
    />
    <Field.Label>Select all domains</Field.Label>
  </Field>
</template>
```

### Disabled

```vue
<script setup>
  import Checkbox from '@aziontech/ui/checkbox'
  import Field from '@aziontech/ui/field'
  import { ref } from 'vue'

  const backups = ref(true)
  const dedicatedIp = ref(false)
</script>

<template>
  <Field.Group class="max-w-(--container-xs)">
    <Field
      orientation="horizontal"
      disabled
    >
      <Checkbox v-model="backups" />
      <Field.Content>
        <Field.Label>Daily backups</Field.Label>
        <Field.Description>Always on for this plan.</Field.Description>
      </Field.Content>
    </Field>
    <Field
      orientation="horizontal"
      disabled
    >
      <Checkbox v-model="dedicatedIp" />
      <Field.Content>
        <Field.Label>Dedicated IP</Field.Label>
        <Field.Description>Available on the Enterprise plan.</Field.Description>
      </Field.Content>
    </Field>
  </Field.Group>
</template>
```
