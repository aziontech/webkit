# Phone Input

> International phone-number control: an `InputGroup` with a searchable country `Select` on the left (the closed trigger shows the selected country's flag, its name and, at the end, its dial code, like a row of the list) and a `type="tel"` input on the right that applies the selected country's mask as the user types and accepts exactly the lengths that country allows. Two v-models (`v-model` for the national digits, `v-model:country` for the ISO 3166-1 alpha-2 code) carry the editable state; the one-way `phone-change` event hands the form the full E.164 number and whether it is complete. It carries no label or helper text: wrap it in a `Field` (`Field.Label` + `PhoneInput` + `Field.Description`), and it picks up `id`, `aria-describedby`, `invalid`, `disabled` and `required` from the Field.

- Import: `import PhoneInput from '@aziontech/webkit/phone-input'`
- Category: input · Surface: app · Structure: monolithic
- API as JSON: [phone-input.json](phone-input.json)

## When to use

- International phone entry where the user picks a country and types the national number with that country's mask.
- Forms that need the full E.164 number and whether it is complete, without per-country length rules in the form.

## Do

- Put it in a `Field` with a `Field.Label`; the label targets the tel input.
- `v-model` holds the national digits only; read `number` from the `phone-change` payload when you need the E.164 value.
- Use `complete` from `phone-change` to decide `invalid` and the `Field.Error` on submit; the control shows no incomplete-number message of its own.
- The field starts on the United States. Set `default-country` to start on another country (an ISO 3166-1 alpha-2 code from `countries`), or bind `v-model:country` when the form owns the country.
- `searchPlaceholder` and `searchEmptyLabel` default to English; pass translated copy in localized UIs.

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
| `countries` | `PhoneInputCountry[]` | `(built-in list — see Notes)` | false | Countries offered by the dial-code Select. When omitted, uses the built-in curated list. |
| `defaultCountry` | `string` | `'US'` | false | ISO 3166-1 alpha-2 code of the country selected at first, while `v-model:country` is empty. A code missing from `countries` falls back to the first country of the list. |
| `placeholder` | `string` | `''` | false | Placeholder of the tel input. Falls back to the selected country's mask when empty. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size forwarded to the InputGroup and the dial-code Select trigger. Heights: small=28px, medium=32px, large=40px. |
| `disabled` | `boolean` | `false` | false | Disables both the dial-code Select and the internal input. |
| `readonly` | `boolean` | `false` | false | Marks the internal input read-only; dial-code Select is also disabled while readonly. |
| `required` | `boolean` | `false` | false | Applies the required border on the InputGroup and sets required on the input. |
| `invalid` | `boolean` | `false` | false | Applies the invalid border on the InputGroup and sets aria-invalid on the input. |
| `name` | `string` | `''` | false | Form field name. Set, a hidden input submits the full E.164 number (dial code followed by the digits, empty while there are none) under this name; the visible input carries no name, so a native `form` never posts a national number without its country. |
| `searchPlaceholder` | `string` | `''` | false | Placeholder of the search box that filters the dial-code list. Empty uses the locale catalog (`Search country`). |
| `searchEmptyLabel` | `string` | `''` | false | Shown in the dial-code list when no country matches the search. Empty uses the locale catalog (`No country found.`). |
| `modelValue` | `string` | `''` | false | Two-way value (`v-model`). |
| `country` | `string` | `''` | false | Two-way value (`v-model:country`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `phone-change` | `[value: PhoneInputValue]` | One-way snapshot of the number, emitted once on mount and again whenever the digits or the country change. `PhoneInputValue` (exported from the component) is `{ country: string; dialCode: string; digits: string; number: string; complete: boolean }`: `number` is the full E.164 number (`dialCode + digits`, e.g. `'+14155550100'`; `''` while empty) and `complete` is true when the digit count is one the selected country allows. Not a v-model — the field never reads it back. |

## v-model

| Model             | Type     | Default | Emits               | Notes                                                                                                                                                                                                                                                                               |
| ----------------- | -------- | ------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`         | `string` | `''`    | `update:modelValue` | National number as **digits only**, without dial code and without mask characters (e.g. `'4155550100'`). Updates on input when the digits change, and when a country switch truncates digits beyond the new country's capacity. Via `defineModel`, so the field also works unbound. |
| `v-model:country` | `string` | `''` | `update:country` | ISO 3166-1 alpha-2 code of the selected country (e.g. `'US'`, `'GB'`, `'BR'`). While it is empty (`''`) the field shows `defaultCountry`. Drives the flag, name and dial code shown in the `Select` trigger and the masks applied to the input. Via `defineModel`, so picking a country works even when the consumer binds only `v-model`. |

## States

- Visual states delegated to `InputGroup`: `default`, `hover`, `focus-within`, `invalid`, `required`, `disabled`.
- `invalid`, `disabled` and `required` combine the prop with the enclosing `Field`.
- The dial-code `Select` is disabled whenever the control is `disabled` **or** `readonly`.
- The closed trigger mirrors a row of the list: the country's flag in the trigger's `#leading` slot, its name as the value (truncated with an ellipsis when the trigger is narrow), and its dial code in muted text in the trigger's `#trailing` slot at the inline end, which never shrinks. The country part sizes to its content and takes at most 60% of the field, so the number keeps at least 40%.
- Narrow fields: the root is a size container (`@container/phone-input`); below 21rem (336px) the trigger hides the country name (`data-slot="value"`) and shows only the flag and the dial code, so phones from 320 to 430px keep room to type the number. The open list always shows the full names, and the trigger keeps its accessible name.
- Completeness is reported through `phone-change`, never rendered.
- The flag sprite (`country-flags.png`, about 80 KB) loads with a dynamic `import()` after the field mounts in the browser (never on the server), so the closed trigger can show the selected flag; until it arrives the flag boxes stay blank. It is one shared request for every PhoneInput on the page.

## Accessibility

- Visible focus: the `InputGroup` focus-within ring.
- Keyboard map: `Tab` moves from the dial-code `Select` to the tel input; inside the `Select`, arrows navigate, typing filters, `Enter` picks and returns focus to the input, `Esc` closes.
- ARIA: the tel input has `type="tel"`, `inputmode="tel"`, `autocomplete="tel-national"`, `aria-invalid`, `aria-required`, and the `id` / `aria-describedby` of the enclosing `Field`; the dial-code trigger has `aria-label="PhoneInputCountry dial code"`. The control provides an empty Field context below it so the inner search input never takes the field id.
- Contrast ≥4.5:1 for input and dial-code text.
- Touch target follows the `size` (40px at `large`).
- Direction: the tel input, each option's dial code and the closed trigger's dial code (a `dir="ltr"` span in the trigger's `#trailing` slot) render left-to-right, so a number and its `+` keep their order on a right-to-left page; the typed number still aligns to the inline start of the page (`rtl:text-end`, which resolves against the input's own `ltr` direction).

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
      @phone-change="phone = $event"
    />
    <Field.Description>We'll use this to send the verification code.</Field.Description>
  </Field>
</template>
```

### DefaultCountry

```vue
<script setup>
  import Field from '@aziontech/webkit/field'
  import PhoneInput from '@aziontech/webkit/phone-input'
  import { ref } from 'vue'

  const digits = ref('')
</script>

<template>
  <Field class="max-w-(--container-xs)">
    <Field.Label>Phone</Field.Label>
    <PhoneInput
      v-model="digits"
      default-country="GB"
      name="phone"
    />
    <Field.Description
      >Starts on the United Kingdom; the user can still pick another country.</Field.Description
    >
  </Field>
</template>
```
