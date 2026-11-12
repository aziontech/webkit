# Input

> Single-line text input for forms and inline editing. Renders a bordered field with optional leading/trailing icon slots. Visual states (hover, focus, filled) are driven by native CSS pseudo-classes, not props. The component is the field only — labels, helper text, and error messages live in the wrapping form-field layer. Aligned with Figma frame `562:6774` (Webkit / Input).

- Import: `import Input from '@aziontech/webkit/input'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [input.json](https://github.com/aziontech/webkit/blob/main/.specs/input.json)

## When to use

- Capture a single line of free-form text (names, titles, search terms).

## Do

- Prefer the `field-*` wrapper when you need a label, helper text, or validation message.
- Set an appropriate `type`/`inputmode` for the content (email, url, …).
- Set `monospace` on a field whose value is code-like: a CLI command, an ID, a token, a hash, a path. Pair it with `:spellcheck="false"`.
- A read-only command or ID the user copies: `readonly` + `monospace` inside an `InputGroup` with a `CopyButton`, and a description saying why it cannot change.
- Do not set `monospace` on prose values (names, titles, e-mails, domains typed by the user).
- Do not restyle a read-only field (dashed border, transparent fill): it is the same filled field, made non-editable; the reason belongs in the field's description.

## Don’t

- The value spans multiple lines → use `textarea`.
- The value is strictly numeric → use `number-input`.
- The user must choose from a fixed set → use `select` / `multi-select`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [textarea](textarea.md) — multi-line free text.
- [number-input](number-input.md) — numeric input with stepper semantics.
- [field](field.md) — wraps this input with label, description and error; the input reads its id, `aria-describedby` and state from it.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | `''` | false | Two-way bound value of the field. |
| `placeholder` | `string` | `''` | false | Placeholder shown when the field is empty. |
| `type` | `'text' \| 'email' \| 'number'` | `'text'` | false | Native input type. Restricted to single-line variants the field treats identically. |
| `maxLength` | `number \| undefined` | `undefined` | false | Native `maxlength` — maximum number of characters allowed. |
| `autocomplete` | `string \| undefined` | `undefined` | false | Native `autocomplete` token on the `<input>` (e.g. `email`, `username`, `off`). Omitted when unset. |
| `spellcheck` | `boolean \| undefined` | `undefined` | false | Native `spellcheck` on the `<input>`. Set `false` for slugs, IDs and domains. Omitted when unset: the default is an explicit `undefined`, because Vue would otherwise cast an absent boolean to `false` and render `spellcheck="false"` on every field. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token; affects height only — padding and typography are constant. Heights: small=28px, medium=32px, large=40px. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `readonly` | `boolean` | `false` | false | Marks the field read-only: value is visible, focusable and copyable but not editable. Keeps the filled field (surface and solid border) with no hover border and a default cursor (`data-readonly`); distinct from the disabled field. |
| `required` | `boolean` | `false` | false | Marks the field as required; sets native `required` and `aria-required`. Visual indicator (asterisk) is owned by the wrapping form-field, not by this component. |
| `invalid` | `boolean` | `false` | false | Applies the invalid border + ring tokens and sets `aria-invalid`. |
| `monospace` | `boolean` | `false` | false | Sets the value and placeholder in the monospace code face (`.text-label-code-sm`) for CLI commands, IDs, tokens and hashes (`data-monospace`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:modelValue` | `string` | Emitted on native `input` event with the new value. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `iconLeft` |  | Hidden from assistive tech (`aria-hidden="true"`). |
| `iconRight` |  | Hidden from assistive tech (`aria-hidden="true"`). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `filled`, `disabled`, `readonly`, `invalid`
- Password managers: the `<input>` carries `data-1p-ignore`, `data-lpignore`, `data-bwignore` and `data-form-type="other"` unless it is a credential or identity field — `autocomplete` set to any token but `off`, or `type="email"`. A read-only field always carries them. This keeps 1Password, LastPass, Bitwarden and Dashlane from offering a sign-in on ordinary fields (names, IDs, searches) while login fields stay fillable. A consumer attr (e.g. `data-1p-ignore="false"`) wins.
- `data-readonly` mirrors the `readonly` prop: a read-only field keeps the editable field's fill (`var(--bg-surface)`) and solid `var(--border-default)` border, as the design sample draws it; it only drops the hover border and takes a default cursor. The value keeps `var(--text-default)` (readable and copyable, unlike `disabled`) and the field stays focusable. Why the value cannot change is said by the field's description, not by a different chrome.
- `data-monospace` mirrors the `monospace` prop: the value and the placeholder render in `.text-label-code-sm` instead of `.text-label-sm`.
- `data-size` mirrors the `size` prop
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors the `invalid` prop
- `data-required` mirrors the `required` prop; drives the warning-border treatment
- `data-has-icon-left` / `data-has-icon-right` mirror slot presence (driven by `$slots.iconLeft` / `$slots.iconRight`), read at render time: an icon slot passed behind a `v-if` adds or removes its icon box when the condition changes, never leaving an empty box behind
- `filled` is detected via the native `:not(:placeholder-shown)` selector — no JS state

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2`, with the offset color resolving `var(--input-ring-offset, var(--bg-canvas))` — applied via `focus-within` on the field wrapper so the ring covers the whole control including icon slots. A host that places the field on a surface other than the canvas (a raised popover, a drawer) declares `--input-ring-offset` on any ancestor; custom properties inherit, so one declaration retunes the ring gap of every field inside it (this is how `calendar`'s fields panel matches its raised popover).
- Keyboard map: `Tab` focuses the input; standard text-editing keys apply.
- Direction: the `<input>` renders `dir="auto"` so a value typed in another script keeps its own direction inside right-to-left UI; a `dir` attribute overrides it.
- ARIA: `aria-invalid` is bound to the `invalid` prop; `aria-required` to the `required` prop; icon slots are `aria-hidden="true"` (decorative).
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including disabled state.
- `motion-reduce:transition-none` on every transition-bearing class.
- Touch target ≥40×40 px on `size="large"`; smaller sizes are intended for dense layouts where the wrapping label area extends the hit zone.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the icon slots are the consumer's and do not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: the `<input>` renders `dir="auto"`; a `dir` attribute overrides it.

## Examples

### Default

```vue
<script setup>
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <Input
    v-model="value"
    placeholder="Type something"
  />
</template>
```

### Sizes

```vue
<script setup>
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const small = ref('')
  const medium = ref('')
  const large = ref('')
</script>

<template>
  <div class="flex flex-col items-stretch gap-4 w-[280px]">
    <Input
      v-model="small"
      size="small"
      placeholder="Small (28px)"
    />
    <Input
      v-model="medium"
      size="medium"
      placeholder="Medium (32px)"
    />
    <Input
      v-model="large"
      size="large"
      placeholder="Large (40px)"
    />
  </div>
</template>
```

### Icons

```vue
<script setup>
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const leading = ref('')
  const trailing = ref('')
  const both = ref('')
</script>

<template>
  <div class="flex flex-col items-stretch gap-4 w-[280px]">
    <Input
      v-model="leading"
      placeholder="Leading icon"
    >
      <template #iconLeft>
        <i class="pi pi-globe" />
      </template>
    </Input>
    <Input
      v-model="trailing"
      placeholder="Trailing icon"
    >
      <template #iconRight>
        <i class="pi pi-search" />
      </template>
    </Input>
    <Input
      v-model="both"
      placeholder="Both icons"
    >
      <template #iconLeft>
        <i class="pi pi-globe" />
      </template>
      <template #iconRight>
        <i class="pi pi-search" />
      </template>
    </Input>
  </div>
</template>
```
