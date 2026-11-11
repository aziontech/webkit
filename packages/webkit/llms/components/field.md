# Field

> One composable form field that wraps **any** control — `Input`, `Textarea`, `Select`, `MultiSelect`, `NumberInput`, `PasswordInput`, `PhoneInput`, `InputGroup`, `Checkbox`, `RadioButton`, `Switch`, `Slider` — with its label, description and error. The root `Field` owns the field state (`invalid`, `disabled`, `required`) and the ids, and shares them through `provide`/`inject`: the control picks up its `id`, `aria-describedby`, `aria-invalid`, `disabled` and `required` from the Field, `Field.Label` points its `for` at the control and shows the Required marker, and `Field.Description` / `Field.Error` register themselves so the control is described by them. Grouping parts (`Field.Set`, `Field.Legend`, `Field.Group`, `Field.Content`, `Field.Title`, `Field.Separator`) build fieldsets, choice cards and settings rows. It replaces the v5 `field-*` family (`field-text`, `field-select`, `field-checkbox-block`, …), one wrapper per control, with a single anatomy.

- Import: `import FieldRoot from '@aziontech/webkit/field-root'`
- Compound import (dot notation, not tree-shakeable): `import Field from '@aziontech/webkit/field'`
- Category: inputs · Surface: product · Structure: composition
- API as JSON: [field.json](https://github.com/aziontech/webkit/blob/main/.specs/field.json)

## When to use

- Any labelled form control: a text input, a select, a textarea, a password, a phone number, a slider.
- A checkbox, radio or switch with its label beside it (`orientation="horizontal"`).
- A selectable choice card: `Field.Label` wrapping a horizontal `Field` (replaces the v5 `*-block` variants).
- A group of related controls under one caption (`Field.Set` + `Field.Legend`), or a form section (`Field.Group`).

## Do

- Put the state on the `Field`, not on the control: `<Field invalid>` sets `aria-invalid` on the control and the invalid tone on `Field.Description`.
- Let the Field own the ids. Pass an explicit `id` on the control and `for` on `Field.Label` only when another part of the page needs the id (focusing the first invalid field, an error summary link).
- Render `Field.Description` for guidance and `Field.Error` for a validation message; both are announced through `aria-describedby`. `Field.Error` has `role="alert"`, so render it only when there is an error.
- Choice cards: `<Field.Label><Field orientation="horizontal">control + Field.Content</Field></Field.Label>`. Never nest a choice card inside another `Field`; group cards with `Field.Set`.
- Use `orientation="responsive"` for settings rows that stack in a narrow container and sit side by side in a wide one; it follows the nearest container (a `Field.Group`, a Card, a dialog or drawer body).

## Don’t

- A control with no visible label inside a toolbar or a table cell → render the control alone with an `aria-label`.
- A group of mutually exclusive cards with icons → use `radio-cards`.
- A static key/value read-out → use `key-value-pairs`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [label](label.md) — the standalone label; `Field.Label` adds the `for` wiring and the Required marker from the Field.
- [helper-text](helper-text.md) — the tone-aware helper line that `Field.Description` and `Field.Error` render.
- [input-group](input-group.md) — wraps an input with addons; put it inside a `Field` and use `InputGroup.Input` as the control.
- [phone-input](phone-input.md), `password-requirements` — the controls that replaced `field-phone-number` and the requirements row of `field-password`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `orientation` | `'vertical' \| 'horizontal' \| 'responsive'` | `'vertical'` | false | Layout axis: label above the control, beside it, or beside it once the enclosing container (a FieldGroup, Card, drawer or dialog body) is wide enough. |
| `invalid` | `boolean` | `false` | false | Marks the field invalid: the control sets aria-invalid and FieldDescription switches to the invalid tone. |
| `disabled` | `boolean` | `false` | false | Disables the wrapped control and dims the field. |
| `required` | `boolean` | `false` | false | Shows the Required marker on FieldLabel and sets required on the wrapped control. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Field.Label`, the control, `Field.Description`, `Field.Error` (or `Field.Content` beside the control in a horizontal field). |

## Sub-component imports

- `@aziontech/webkit/field-label`
- `@aziontech/webkit/field-description`
- `@aziontech/webkit/field-error`
- `@aziontech/webkit/field-group`
- `@aziontech/webkit/field-set`
- `@aziontech/webkit/field-legend`
- `@aziontech/webkit/field-content`
- `@aziontech/webkit/field-title`
- `@aziontech/webkit/field-separator`

## Sub-components

The root `Field` provides `fieldContextKey` (`injection-key.ts`): a generated `controlId`, the reactive `invalid` / `disabled` / `required` flags, `describedBy` (the ids of the mounted `Field.Description` and `Field.Error` parts), `labelledBy` (the ids of the mounted `Field.Title` parts) and `register`. Controls read it through the shared `useFieldControl` composable (`src/composables/use-field-control`); an explicit prop or attribute on the control always wins over the Field. Composite controls (`Select`, `MultiSelect`, `PhoneInput`) consume the context on their root and provide `null` below it, so their inner search inputs never take the field id. Every part works outside a `Field` too (it then reads no state). Member names mirror the anatomy; there is no `Trigger`/`Content` pair because the field has no open/closed state.

- `field-label/field-label.vue` — `<label>` whose `for` defaults to the Field's `controlId`; appends the Required marker (`*` + "(Required)") when the Field is `required`, and a `Hint` glyph when `hint` is set. When it wraps a `Field` it becomes a selectable card (border, padding, hover, focus ring, selected tokens when the control inside is `data-checked`).
  - Props: `hint` (`string`, default `''`) — short explanation revealed by a `Hint` glyph.
  - Events: _none_.
  - Slots: `default` — label text, or a horizontal `Field` for a choice card.
- `field-description/field-description.vue` — guidance line rendered through `HelperText`; registers its id with the Field. Tone follows the Field: `disabled` (lock icon) > `invalid` (only when no `Field.Error` is mounted) > `required` > `helper`.
  - Props: _none_. Events: _none_. Slots: `default`.
- `field-error/field-error.vue` — validation message rendered through `HelperText kind="invalid"` with `role="alert"`; registers its id with the Field.
  - Props: _none_. Events: _none_. Slots: `default`.
- `field-group/field-group.vue` — vertical stack of fields; it is a `@container/field-group`, one of the containers `orientation="responsive"` can follow.
  - Props: _none_. Events: _none_. Slots: `default`.
- `field-set/field-set.vue` — native `<fieldset>` without browser chrome, for a group of related fields or choices.
  - Props: _none_. Events: _none_. Slots: `default`.
- `field-legend/field-legend.vue` — native `<legend>` captioning a `Field.Set`.
  - Props: `kind` (`'legend' \| 'label'`, default `'legend'`) — `legend` titles a section, `label` matches a `Field.Label` for a group of choices.
  - Events: _none_. Slots: `default`.
- `field-content/field-content.vue` — column that holds the label/title and descriptions beside a control in a horizontal Field.
  - Props: _none_. Events: _none_. Slots: `default`.
- `field-title/field-title.vue` — title inside a choice card; registers its id with the Field so the card's `Checkbox`, `RadioButton` or `Switch` is named by it through `aria-labelledby` (the wrapping `Field.Label` makes the whole card the click target).
  - Props: _none_. Events: _none_. Slots: `default`.
- `field-separator/field-separator.vue` — horizontal rule between fields, with optional centred text.
  - Props: _none_. Events: _none_. Slots: `default` — optional text.

## States

- Visual states: `default`, `disabled`, `invalid`, `required`
- `data-orientation`: `vertical` | `horizontal` | `responsive`
- `data-invalid`, `data-disabled`, `data-required` mirror the props on the root
- `data-slot` identifies every part (`field`, `field-label`, `field-description`, `field-error`, `field-group`, `field-set`, `field-legend`, `field-content`, `field-title`, `field-separator`)
- Responsive: `orientation="responsive"` queries the nearest container (`@md:`), not only `Field.Group`: inside a Card, a drawer or dialog body (`@container/panel`), a settings section or a `Field.Group` it stacks the label above the control in a narrow box and puts them side by side from `@md`. With no container ancestor it stays vertical.

## Accessibility

- Visible focus: the control keeps its own ring; a choice card shows `has-[:focus-visible]:ring-2 ring-(--ring-color) ring-offset-1 ring-offset-(--bg-canvas)` around the whole card.
- Keyboard map: the Field adds no keys; `Tab` reaches the control, and clicking `Field.Label` focuses or toggles it.
- ARIA: root `role="group"`; `Field.Label` `for` → control `id`; control `aria-describedby` → every mounted `Field.Description` and `Field.Error` id; control `aria-invalid` when the Field is `invalid`; `required` / `aria-required` when it is `required`; `Field.Error` `role="alert"`; `Field.Set` is a native `fieldset` named by its `legend`; the Required marker's `*` is `aria-hidden` and the word "(Required)" is read.
- Contrast ≥4.5:1 for label, description and error text in every tone, including disabled.
- `motion-reduce:transition-none` on the choice card transition.
- Touch target: the whole choice card is the target; a horizontal Field's label extends the control's target.

## Examples

### Default

```vue
<script setup>
  import { ref } from 'vue'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'

  const email = ref('')
</script>

<template>
  <Field class="max-w-(--container-xs)">
    <Field.Label>Email</Field.Label>
    <Input
      v-model="email"
      type="email"
      autocomplete="email"
      placeholder="you@example.com"
    />
    <Field.Description>We'll never share your email.</Field.Description>
  </Field>
</template>
```

### DescriptionAndError

```vue
<script setup>
  import { computed, ref } from 'vue'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'

  const slug = ref('My Project')
  const invalid = computed(() => !/^[a-z0-9-]+$/.test(slug.value))
</script>

<template>
  <Field
    required
    :invalid="invalid"
    class="max-w-(--container-xs)"
  >
    <Field.Label>Project slug</Field.Label>
    <Input
      v-model="slug"
      :spellcheck="false"
      autocomplete="off"
    />
    <Field.Description>Used in the project URL.</Field.Description>
    <Field.Error v-if="invalid">Use lowercase letters, numbers and hyphens only.</Field.Error>
  </Field>
</template>
```

### Horizontal

```vue
<script setup>
  import { ref } from 'vue'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import Switch from '@aziontech/webkit/switch'

  const terms = ref(false)
  const notifications = ref(true)
</script>

<template>
  <Field.Group class="max-w-(--container-xs)">
    <Field orientation="horizontal">
      <Checkbox
        v-model="terms"
        binary
        name="terms"
      />
      <Field.Content>
        <Field.Label>Accept the terms of service</Field.Label>
        <Field.Description>You can withdraw consent at any time.</Field.Description>
      </Field.Content>
    </Field>
    <Field orientation="horizontal">
      <Switch v-model="notifications" />
      <Field.Content>
        <Field.Label>Email notifications</Field.Label>
        <Field.Description>Deploy results and billing alerts.</Field.Description>
      </Field.Content>
    </Field>
  </Field.Group>
</template>
```
