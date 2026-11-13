# Phone Input

> International phone-number control: an `InputGroup` with a searchable dial-code `Select` on the left and a `type="tel"` input on the right that applies the selected country's mask as the user types and accepts exactly the lengths that country allows. Two v-models (`v-model` for the national digits, `v-model:country` for the ISO 3166-1 alpha-2 code) carry the editable state; the one-way `update:phone` event hands the form the full E.164 number and whether it is complete. It carries no label or helper text: wrap it in a `Field` (it replaces the v5 `field-phone-number`), and it picks up `id`, `aria-describedby`, `invalid`, `disabled` and `required` from the Field.

- Import: `import PhoneInput from '@aziontech/webkit/phone-input'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [phone-input.json](https://github.com/aziontech/webkit/blob/main/.specs/phone-input.json)

## When to use

- International phone entry where the user picks a country and types the national number with that country's mask.
- Forms that need the full E.164 number and whether it is complete, without per-country length rules in the form.

## Do

- Put it in a `Field` with a `Field.Label`; the label targets the tel input.
- v-model` holds the national digits only; read `number` from the `update:phone` payload when you need the E.164 value.
- Use `complete` from `update:phone` to decide `invalid` and the `Field.Error` on submit; the control shows no incomplete-number message of its own.
- v-model:country` defaults to `'US'`; seed it with the user's country when you know it.
- searchPlaceholder` and `searchEmptyLabel` default to English; pass translated copy in localized UIs.

## Don’t

- The value may include characters the masks reject (extensions, free-form notes) → use `input`.
- The input needs addons other than the dial code → use `input-group` and compose it yourself.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [field](field.md) — wraps the control with its label, description and error.
- [input-group](input-group.md) — the container this control renders around the dial-code select and the input.
- [select](select.md) — the dial-code picker inside the group.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `countries` | `Country[]` | `(built-in list — see Notes)` | false | Countries offered by the dial-code Select. When omitted, uses the built-in curated list. |
| `placeholder` | `string` | `''` | false | Placeholder of the tel input. Falls back to the selected country's mask when empty. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size forwarded to the InputGroup and the dial-code Select trigger. Heights: small=28px, medium=32px, large=40px. |
| `disabled` | `boolean` | `false` | false | Disables both the dial-code Select and the internal input. |
| `readonly` | `boolean` | `false` | false | Marks the internal input read-only; dial-code Select is also disabled while readonly. |
| `required` | `boolean` | `false` | false | Applies the required border on the InputGroup and sets required on the input. |
| `invalid` | `boolean` | `false` | false | Applies the invalid border on the InputGroup and sets aria-invalid on the input. |
| `name` | `string` | `''` | false | HTML name for the internal input (form + vee-validate integration). |
| `searchPlaceholder` | `string` | `''` | false | Placeholder of the search box that filters the dial-code list. Empty uses the locale catalog (`Search country`). |
| `searchEmptyLabel` | `string` | `''` | false | Shown in the dial-code list when no country matches the search. Empty uses the locale catalog (`No country found.`). |
| `modelValue` | `string` | `''` | false | Two-way value (`v-model`). |
| `country` | `string` | `'US'` | false | Two-way value (`v-model:country`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:phone` | `[value: PhoneNumber]` | One-way snapshot of the number, emitted once on mount and again whenever the digits or the country change. `PhoneNumber` (exported from the component) is `{ country: string; dialCode: string; digits: string; number: string; complete: boolean }`: `number` is the full E.164 number (`dialCode + digits`, e.g. `'+14155550100'`; `''` while empty) and `complete` is true when the digit count is one the selected country allows. Not a v-model — the field never reads it back. |

## v-model

| Model             | Type     | Default | Emits               | Notes                                                                                                                                                                                                                                                                               |
| ----------------- | -------- | ------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`         | `string` | `''`    | `update:modelValue` | National number as **digits only**, without dial code and without mask characters (e.g. `'4155550100'`). Updates on input when the digits change, and when a country switch truncates digits beyond the new country's capacity. Via `defineModel`, so the field also works unbound. |
| `v-model:country` | `string` | `'US'`  | `update:country`    | ISO 3166-1 alpha-2 code of the selected country (e.g. `'US'`, `'GB'`, `'BR'`). Drives the dial code shown in the `Select` and the masks applied to the input. Via `defineModel`, so picking a country works even when the consumer binds only `v-model`.                            |

## States

- Visual states delegated to `InputGroup`: `default`, `hover`, `focus-within`, `invalid`, `required`, `disabled`.
- `invalid`, `disabled` and `required` combine the prop with the enclosing `Field`.
- The dial-code `Select` is disabled whenever the control is `disabled` **or** `readonly`.
- Completeness is reported through `update:phone`, never rendered.
- The flag sprite (`country-flags.png`, about 80 KB) loads with a dynamic `import()` the first time the dial-code list opens; until it arrives each option keeps its flag box blank. The closed field never fetches it.

## Accessibility

- Visible focus: the `InputGroup` focus-within ring.
- Keyboard map: `Tab` moves from the dial-code `Select` to the tel input; inside the `Select`, arrows navigate, typing filters, `Enter` picks and returns focus to the input, `Esc` closes.
- ARIA: the tel input has `type="tel"`, `inputmode="tel"`, `autocomplete="tel-national"`, `aria-invalid`, `aria-required`, and the `id` / `aria-describedby` of the enclosing `Field`; the dial-code trigger has `aria-label="Country dial code"`. The control provides an empty Field context below it so the inner search input never takes the field id.
- Contrast ≥4.5:1 for input and dial-code text.
- Touch target follows the `size` (40px at `large`).
- Direction: the tel input, each option's dial code and the closed trigger's dial code (`SelectTrigger` `value-dir="ltr"`, a `<bdi dir="ltr">`) render left-to-right, so a number and its `+` keep their order on a right-to-left page; the typed number still aligns to the inline start of the page (`rtl:text-end`, which resolves against the input's own `ltr` direction).

## Examples

### Default

```vue
<script setup>
  import Field from '@aziontech/webkit/field'
  import PhoneInput from '@aziontech/webkit/phone-input'
  import { ref } from 'vue'

  const digits = ref('')
  const country = ref('US')
  const phone = ref(null)
</script>

<template>
  <Field
    required
    class="max-w-(--container-xs)"
  >
    <Field.Label>Phone</Field.Label>
    <PhoneInput
      v-model="digits"
      v-model:country="country"
      name="phone"
      @update:phone="phone = $event"
    />
    <Field.Description>We'll use this to send the verification code.</Field.Description>
  </Field>
</template>
```
