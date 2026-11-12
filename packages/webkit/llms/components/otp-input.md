# Otp Input

> The field for a one-time code: the six digits an authenticator app shows, or a code sent by email or SMS. It looks like a row of boxes, one character each, but it is **one real text input** laid over the boxes, so the browser's one-time-code autofill (`autocomplete="one-time-code"`), password managers, paste and screen readers all see a single field. Typing fills the next box (auto-advance), Backspace empties the last one, and a pasted code (`123 456`, `123-456`, with a line break) keeps only its valid characters and fills every box. When the last box fills it emits `complete`, so the screen can submit without a button press. It replaces the Console Kit's six `InputText`s with hand-written focus moves (`mfa-setup-block`, `mfa-authenticate-block`).

- Import: `import OtpInput from '@aziontech/webkit/otp-input'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [otp-input.json](https://github.com/aziontech/webkit/blob/main/.specs/otp-input.json)

## When to use

- Multi-factor authentication: set-up confirmation and sign-in challenge.
- Verifying an email address or a phone number with a short code.
- Any short, fixed-length code the user copies from somewhere else.

## Do

- Label it with what the code is and where it comes from: `Authentication code`, and a description `The 6-digit code from your authenticator app.
- Submit on `complete` only when the code is the last thing to fill; keep a Verify button for keyboard users and for a failed attempt.
- After a rejected code, mark it `invalid`, clear it, and keep focus in it.
- Use `group="3"` for codes people read aloud or copy from a phone; it draws a separator between groups and does not change the value.

## Don’t

- A password or a secret of free length → use `PasswordInput`.
- A long token or API key → use `Input` with a copy affordance.
- A number with a range → use `NumberInput`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [field](field.md) — wrap it in a `Field` for the label, the description and the error; the label names the input.
- [password-input](password-input.md) — the other credential input of the auth screens.
- [input](input.md) — the plain text field it shares tokens with.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `length` | `number` | `6` | false | How many characters the code has; one box each. |
| `mode` | `'numeric' \| 'alphanumeric'` | `'numeric'` | false | numeric` keeps digits and opens the number keypad; `alphanumeric` keeps letters and digits, upper case. |
| `group` | `number` | `0` | false | Draw a separator after every `group` boxes (`3` gives `123 – 456`). `0` draws none. |
| `disabled` | `boolean` | `false` | false | Disables the field while a code is being checked. |
| `invalid` | `boolean` | `false` | false | Danger borders on every box and `aria-invalid`; set after a rejected code. |
| `required` | `boolean` | `false` | false | Native `required` and `aria-required`. |
| `autofocus` | `boolean` | `false` | false | Focus the field on mount, for a screen whose only task is the code. |
| `modelValue` | `string` | `''` | false | Two-way value (`v-model`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `complete` | `string` |  |

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                     |
| --------- | -------- | ------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `v-model` | `string` | `''`    | `update:modelValue` | The code typed so far, via `defineModel`, already filtered by `mode` and cut to `length`. |

## States

- `data-state` on each box: `empty` | `filled`; `data-active` on the box the next character goes to while the field has focus (the last box when the code is full).
- `data-invalid`, `data-disabled` on the root.
- Separators render between groups when `group` > 0.

## Accessibility

- One `input` carries the value, the name (from the `Field` label, an `aria-label`, or the catalog's `One-time code` when nothing else names it), `aria-describedby` from the `Field`, `aria-invalid`, `aria-required`, `maxlength`, `autocomplete="one-time-code"`, `inputmode` (`numeric` or `text`) and `enterkeyhint="done"`. The boxes and separators are `aria-hidden`; a screen reader reads the input's value as typed.
- Keyboard: type to fill, Backspace to clear the last character, Tab leaves the field in one stop; the caret stays at the end, so Arrow and Home keys do not move it into the middle of the code.
- Focus: the active box takes the focus ring; the whole field takes one focus stop.
- Contrast: characters `--text-default` on `--bg-surface`, borders `--border-default` (3:1 non-text) in both themes.

## Right-to-left

- Layout: the box row is `dir="ltr"`: a code reads left to right in every locale, like a phone number, so the first character stays on the left under `dir="rtl"`.
- Icons: none.
- Keyboard: unchanged.
- User data: the value is ASCII letters and digits.

## Internationalization

| Key              | English source  | Override prop        |
| ---------------- | --------------- | -------------------- |
| `otpInput.label` | `One-time code` | `aria-label` (attrs) |

- Characters are not localized: digits stay ASCII so the code matches what the app shows.

## Responsive

- Container queries: none.
- Narrow: boxes are 40 px with an 8 px gap and shrink to 24 px when the row is narrower than that, so eight boxes plus a separator fit in 320 px (checked in `apps/visual`, `geometry otp input grouped`).
- Touch: the whole row is the input's hit area.
- Reflow: no horizontal scroll at 320 px for `length` up to 8 with a separator.

## Examples

### Default

```vue
<script setup>
  import Field from '@aziontech/webkit/field'
  import OtpInput from '@aziontech/webkit/otp-input'
  import { ref } from 'vue'

  const code = ref('')
  const entered = ref('')
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <Field>
      <Field.Label>Authentication code</Field.Label>
      <OtpInput
        v-model="code"
        name="code"
        @complete="(value) => (entered = value)"
      />
      <Field.Description>The 6-digit code from your authenticator app.</Field.Description>
    </Field>
    <p
      class="text-body-sm text-(--text-muted)"
      role="status"
    >
      {{ entered ? `Code ${entered} entered.` : '' }}
    </p>
  </div>
</template>
```

### Grouped

```vue
<script setup>
  import Field from '@aziontech/webkit/field'
  import OtpInput from '@aziontech/webkit/otp-input'
  import { ref } from 'vue'

  const code = ref('')
  const recovery = ref('')
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <Field>
      <Field.Label>Verification code</Field.Label>
      <OtpInput
        v-model="code"
        :group="3"
      />
      <Field.Description>We sent a 6-digit code to the email on the account.</Field.Description>
    </Field>
    <Field>
      <Field.Label>Recovery code</Field.Label>
      <OtpInput
        v-model="recovery"
        mode="alphanumeric"
        :length="8"
        :group="4"
      />
      <Field.Description
        >One of the 8-character codes you saved when you set up MFA.</Field.Description
      >
    </Field>
  </div>
</template>
```

### States

```vue
<script setup>
  import Field from '@aziontech/webkit/field'
  import OtpInput from '@aziontech/webkit/otp-input'
  import { ref } from 'vue'

  const rejected = ref('')
  const checking = ref('482913')
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <Field invalid>
      <Field.Label>Authentication code</Field.Label>
      <OtpInput v-model="rejected" />
      <Field.Description
        >That code is not valid. Enter the current code from your app.</Field.Description
      >
    </Field>
    <Field disabled>
      <Field.Label>Authentication code</Field.Label>
      <OtpInput v-model="checking" />
      <Field.Description>Checking the code.</Field.Description>
    </Field>
  </div>
</template>
```
