# Password Requirements

> Live checklist of password rules shown under a `PasswordInput`: a caption followed by one chip per rule, each chip turning to the success tone with a check as the typed value satisfies it. It replaces the requirements row of the v5 `field-password`; the entry also exports `DEFAULT_PASSWORD_REQUIREMENTS` and the `PasswordRequirement` type so a form validates with the same rules it shows. `DEFAULT_PASSWORD_REQUIREMENTS` is typed `PasswordPatternRequirement[]` (exported too): every built-in rule has a `key` and a `RegExp` `test`, so `rule.test.test(value)` type-checks without narrowing; a custom rule list stays `PasswordRequirement[]`, whose `test` may be a predicate.

- Import: `import PasswordRequirements from '@aziontech/webkit/password-requirements'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [password-requirements.json](https://github.com/aziontech/webkit/blob/main/.specs/password-requirements.json)

## When to use

- A new-password field (sign-up, reset, change password) where the user must meet explicit rules.

## Do

- Bind `value` to the same ref as the `PasswordInput` `v-model`.
- Validate on submit with `DEFAULT_PASSWORD_REQUIREMENTS` (or your own array) so the error and the chips never disagree.
- Pass `requirements` to replace the rule set and `title` to localize the caption.

## Don’t

- A sign-in password field → render `password-input` alone; the rules do not apply to an existing password.
- A free-form strength meter → not provided; compose your own.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [password-input](password-input.md) — the control whose value this checklist evaluates.
- [field](field.md) — place both inside one `Field` so the label and description stay together.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `requirements` | `PasswordRequirement[]` | `DEFAULT_PASSWORD_REQUIREMENTS` | false | Rules rendered as chips, one per entry. Defaults to the built-in rule set; an empty array renders only the caption. |
| `title` | `string` | `''` | false | Caption that opens the row and names the group for assistive tech. Empty uses the locale catalog (`Must contain:`). |
| `value` | `string` | `''` | false | Password every rule is evaluated against; pass the PasswordInput value. |

## States

- Each chip carries `data-validated` when its rule passes.
- The row animates its height as chips wrap.

## Accessibility

- Visible focus: not focusable; the checklist is read-only.
- Keyboard map: _none_.
- ARIA: root `role="group"` named by the caption through `aria-labelledby`; the check icons are `aria-hidden`, so each chip ends with visually hidden state text from the locale catalog (`passwordRequirements.met` / `passwordRequirements.unmet`: `met` / `not met`) and the state is never conveyed by colour and icon alone.
- Direction: the check icon slides in from the inline start (`-translate-x-1`, mirrored under `rtl:`).
- Contrast ≥4.5:1 for chip text in both tones.
- `motion-reduce:transition-none` on every transition.

## Examples

### Default

```vue
<script setup>
  import Field from '@aziontech/webkit/field'
  import PasswordInput from '@aziontech/webkit/password-input'
  import PasswordRequirements from '@aziontech/webkit/password-requirements'
  import { ref } from 'vue'

  const password = ref('')
</script>

<template>
  <Field
    required
    class="max-w-(--container-xs)"
  >
    <Field.Label>Password</Field.Label>
    <PasswordInput
      v-model="password"
      autocomplete="new-password"
    />
    <PasswordRequirements :value="password" />
  </Field>
</template>
```
