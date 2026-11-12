# Textarea

> Collects multi-line free-form text from the user. Sibling of `input` in the `inputs` category; renders a fixed-size (`large`) multi-line field with a minimum height of 80px. The resize axis is controlled by the `resizable` prop (defaults to `vertical`). Native textarea attributes (`rows`, `maxlength`, `name`, etc.) flow through via attribute fallthrough.

- Import: `import Textarea from '@aziontech/webkit/textarea'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [textarea.json](https://github.com/aziontech/webkit/blob/main/.specs/textarea.json)

## When to use

- Capture multiple lines of free-form text (descriptions, comments, messages).

## Do

- Give it a sensible default size; avoid auto-growing beyond the viewport.
- Wrap it in a `Field` for the label, description and error.
- Set `monospace` on a value that is code: a pasted zone file, a certificate, a JSON or YAML snippet, a list of IPs. Pair it with `:spellcheck="false"`. Prose (a description, a message) stays in the sans face.
- A value people edit as code with highlighting and line numbers belongs in `CodeEditor`; `monospace` is for a plain paste box.
- Do not restyle a read-only textarea (dashed border, transparent fill): it is the same filled field, made non-editable; the reason belongs in the field's description.

## Don’t

- The value is a single line → use `input`.
- The value is strictly numeric → use `number-input`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [input](input.md) — single-line sibling with the same field API.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | `''` | false | Bound value (v-model). |
| `placeholder` | `string` | `''` | false | Placeholder shown when the field is empty. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `readonly` | `boolean` | `false` | false | Marks the field read-only: the value is visible, focusable and copyable but not editable. Keeps the filled field (surface and solid border) with no hover border and a default cursor (`data-readonly`), the same look as `Input`; distinct from the disabled field. |
| `invalid` | `boolean` | `false` | false | Applies invalid styling and sets `aria-invalid`. Combined with `required`, switches to warning border tone. |
| `required` | `boolean` | `false` | false | Marks the field as required and sets `aria-required`. |
| `resizable` | `'vertical' \| 'horizontal' \| 'both' \| 'none'` | `'vertical'` | false | Which axes the user can drag to resize the field. `none` locks the size; `vertical` keeps the default behavior. |
| `monospace` | `boolean` | `false` | false | Sets the value and placeholder in the monospace code face (`.text-body-code-sm`, which wraps) for pasted zone files, certificates, JSON and lists of IPs (`data-monospace`). Same prop as on `Input`. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:modelValue` | `string` | v-model update. |

## States

- Visual states: `default`, `hover`, `focus`, `filled`, `disabled`, `required` (warning border), `invalid` (danger border), `readonly`
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors the `invalid` prop
- `data-required` mirrors the `required` prop
- `data-readonly` mirrors the `readonly` prop: a read-only textarea keeps the editable field's fill (`var(--bg-surface)`) and solid `var(--border-default)` border, as `Input` does and the design sample draws it; it only drops the hover border and takes a default cursor. The value keeps `var(--text-default)` and the textarea stays focusable. Why the value cannot change is said by the field's description, not by a different chrome.
- `data-monospace` mirrors the `monospace` prop: the value and the placeholder render in `.text-body-code-sm` instead of `.text-body-xs`.
- `data-filled` mirrors whether `modelValue` is non-empty
- `data-resize` on the native `<textarea>` mirrors the `resizable` prop and drives the `resize-*` Tailwind variant

## Accessibility

- Visible focus: on `:focus`, a `ring-2` shadow in `var(--ring-color)` plus a `ring-offset-2` in `var(--bg-canvas)` render around the field; the color transition respects `motion-reduce:transition-none`.
- Keyboard map: `Tab` focuses; typing inserts text; `Enter` inserts a newline; `Shift+Tab` moves focus to the previous element.
- Direction: the `<textarea>` renders `dir="auto"` so a value typed in another script keeps its own direction inside right-to-left UI; a `dir` attribute overrides it.
- ARIA: root is a native `<textarea>`; `aria-invalid` mirrors `invalid`; `aria-required` mirrors `required`; `aria-disabled` mirrors `disabled` when applicable.
- Contrast ≥4.5:1 (text) / ≥3:1 (border + icons), including disabled state.
- `motion-reduce:transition-none` on animated state transitions.
- Touch target: field min-height ≥80px ensures adequate hit area.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none.
- Keyboard: no horizontal arrow-key logic.
- User data: the `<textarea>` renders `dir="auto"`; a `dir` attribute overrides it.

## Examples

### Default

```vue
<script setup>
  import Textarea from '@aziontech/webkit/textarea'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <Textarea
    v-model="value"
    placeholder="Write your message"
  />
</template>
```

### Disabled

```vue
<script setup>
  import Textarea from '@aziontech/webkit/textarea'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <Textarea
    v-model="value"
    placeholder="Placeholder"
    disabled
  />
</template>
```

### Invalid

```vue
<script setup>
  import Textarea from '@aziontech/webkit/textarea'
  import { ref } from 'vue'

  const value = ref('Text Filled')
</script>

<template>
  <Textarea
    v-model="value"
    aria-label="Description"
    invalid
  />
</template>
```
