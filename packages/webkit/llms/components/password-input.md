# Password Input

> Single-line password input for forms. Renders a bordered field with a built-in visibility toggle button on the trailing edge that flips the native `type` between `password` and `text`. Shares the visual language of `Input` (same heights, borders, focus ring, disabled treatment). The component is the field only — labels, helper text, and strength meters live in the wrapping form-field layer. Aligned with Figma frame `3714:10788` (Webkit / PasswordInput). The token mapping was originally inferred from the `input` sibling because the Figma MCP was unreachable during spec authoring; it has since been **reconciled against the frame** as rendered inside the password field frame (`2027:3212`), which corrected the trailing padding to `var(--spacing-xs)` and the visibility toggle to the 28 px (`small`) `IconButton`. One frame value is deliberately not adopted: the border width stays at the shared 1 px rather than the frame's `var(--border-width-default)` (0.8 px), because this component's contract is to share `Input`'s borders and `Input` is still on 1 px — moving one without the other would break that stated invariant. Adopting it is a coordinated follow-up across every bordered input.

- Import: `import PasswordInput from '@aziontech/webkit/password-input'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [password-input.json](https://github.com/aziontech/webkit/blob/main/.specs/password-input.json)

## When to use

- A bare password field whose label and errors are laid out separately (an inline re-authentication prompt, a custom form row).
- Any secret the user may need to check while typing (passwords, tokens); the built-in toggle reveals it as plain text.

## Do

- Set `autocomplete="new-password"` on sign-up and password-change forms; keep the default `current-password` on login.
- Leave `toggleable` on; turn it off only when you need the `iconRight` slot, which is ignored while the toggle is shown.
- The field is a fixed 40px tall with no `size` prop; align it with `size="large"` siblings in the same row.
- Give it an accessible name: a `label` whose `for` matches an `id` passed to the input, or `aria-label`.
- Set `monospace` on a secret that is code-like: an API token, a client secret, a signing key. Pair it with `autocomplete="off"` and `:spellcheck="false"`, so a revealed token reads character by character (`0`/`O`, `l`/`1`).
- Do not set `monospace` on a person's own password: they typed it and never read it back character by character.

## Don’t

- A password field with a label, helper or error text, or a requirements row → wrap it in a `field` (with `password-requirements` for the rules row).
- The value is not secret → use `input`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [field](field.md) — wraps this input with its label and description; it hands the input its id, `aria-describedby` and state.
- [password-requirements](password-requirements.md) — the live checklist of password rules rendered under this input.
- [input](input.md) — plain-text field with the same borders, focus ring, and disabled treatment.
- [input](input.md) — plain single-line text input.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `''` | false | Placeholder shown when the field is empty. |
| `maxLength` | `number \| undefined` | `undefined` | false | Native `maxlength` — maximum number of characters allowed. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. The toggle button inherits the disabled state. |
| `readonly` | `boolean` | `false` | false | Marks the field read-only; value is visible but not editable. Toggle button stays operable. |
| `required` | `boolean` | `false` | false | Marks the field as required; sets native `required` and `aria-required`. Visual indicator (asterisk) is owned by the wrapping form-field, not by this component. |
| `invalid` | `boolean` | `false` | false | Applies the invalid border + ring tokens and sets `aria-invalid`. |
| `toggleable` | `boolean` | `true` | false | When true, renders the visibility toggle button on the trailing edge of the field. When false, the field behaves as a plain password input with no toggle and the `iconRight` slot becomes available. |
| `autocomplete` | `'current-password' \| 'new-password' \| 'off'` | `'current-password'` | false | Native `autocomplete` hint for password managers. Use `new-password` for sign-up and password-change flows. |
| `monospace` | `boolean` | `false` | false | Sets the value and placeholder in the monospace code face (`.text-label-code-sm`) for API tokens, client secrets and keys (`data-monospace`). Same prop as on `Input`. |
| `modelValue` | `string` | `''` | false | Two-way value (`v-model`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `iconLeft` | — | Leading icon rendered inside the field, before the input. Hidden from assistive tech (`aria-hidden="true"`). |
| `iconRight` | — | Trailing icon rendered inside the field, after the input. **Only honored when `toggleable=false`** — the visibility toggle occupies this slot when enabled. Hidden from assistive tech (`aria-hidden="true"`). |

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                     |
| --------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------- |
| `v-model` | `string` | `''`    | `update:modelValue` | The field value via `defineModel`; updates on every native `input` event. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `filled`, `disabled`, `invalid`
- Single fixed height: 40px (large only)
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors the `invalid` prop
- `data-required` mirrors the `required` prop; drives the warning-border treatment
- `data-has-icon-left` mirrors `$slots.iconLeft` presence
- `data-has-icon-right` mirrors `$slots.iconRight` presence (only relevant when `toggleable=false`)
- `data-toggleable` mirrors the `toggleable` prop
- `data-monospace` mirrors the `monospace` prop: the value (masked or revealed) and the placeholder render in `.text-label-code-sm` instead of `.text-label-sm`.
- `data-visible` on the root mirrors the internal visibility state (`true` when the password is revealed as plain text)
- `filled` is detected via the native `:not(:placeholder-shown)` selector — no JS state

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` — applied via `focus-within` on the field wrapper so the ring covers the whole control including icon slots and the visibility toggle.
- Keyboard map: `Tab` focuses the input, then the visibility toggle button (when `toggleable=true`); `Enter` / `Space` on the toggle flips visibility; standard text-editing keys apply to the input.
- Direction: the `<input>` renders `dir="auto"` so a value typed in another script keeps its own direction inside right-to-left UI; a `dir` attribute overrides it.
- ARIA: the visibility toggle is a `<button type="button">` with `aria-pressed` reflecting the current visible state and an `aria-label` that switches between "Show password" and "Hide password"; `aria-invalid` is bound to the `invalid` prop; `aria-required` to the `required` prop; decorative icon slots and the eye glyph are `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including disabled state.
- `motion-reduce:transition-none` on every transition-bearing class.
- Touch target: the input fills the field's single fixed 40 px height. The visibility toggle is the 28×28 px `small` `IconButton` the Figma frame specifies — above WCAG 2.2 SC 2.5.8 Target Size (Minimum) at 24×24 px, and centred in the 40 px row so the practical vertical reach is the full field height. It is below the 44×44 px of SC 2.5.5 (AAA), which this AA-scoped spec does not claim.
- The toggle button never submits the surrounding form (`type="button"`).

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the visibility toggle does not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: the `<input>` renders `dir="auto"`; a `dir` attribute overrides it.

## Examples

### Default

```vue
<script setup>
  import PasswordInput from '@aziontech/webkit/password-input'
  import { ref } from 'vue'

  const password = ref('')
</script>

<template>
  <PasswordInput
    v-model="password"
    placeholder="Enter your password"
    autocomplete="current-password"
  />
</template>
```

### Toggle

```vue
<script setup>
  import PasswordInput from '@aziontech/webkit/password-input'
  import { ref } from 'vue'

  const withToggle = ref('')
  const withoutToggle = ref('')
</script>

<template>
  <div class="flex flex-col items-stretch gap-4 w-[280px]">
    <PasswordInput
      v-model="withToggle"
      :toggleable="true"
      placeholder="Toggleable (default)"
    />
    <PasswordInput
      v-model="withoutToggle"
      :toggleable="false"
      placeholder="No toggle"
    />
  </div>
</template>
```

### IconLeft

```vue
<script setup>
  import PasswordInput from '@aziontech/webkit/password-input'
  import { ref } from 'vue'

  const password = ref('')
</script>

<template>
  <div class="flex flex-col items-stretch gap-4 w-[280px]">
    <PasswordInput
      v-model="password"
      placeholder="Enter your password"
    >
      <template #iconLeft>
        <i class="pi pi-lock" />
      </template>
    </PasswordInput>
  </div>
</template>
```
