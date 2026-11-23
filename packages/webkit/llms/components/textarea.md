# Textarea

> Collects multi-line free-form text from the user. Sibling of `input` in the `input` category; renders a fixed-size (`large`) multi-line field with a minimum height of 80px. The resize axis is controlled by the `resize` prop (defaults to `vertical`). With `autoResize` the field instead grows with its content between `minRows` and `maxRows` lines. Native textarea attributes (`rows`, `maxlength`, `name`, etc.) flow through via attribute fallthrough.

- Import: `import Textarea from '@aziontech/webkit/textarea'`
- Category: input · Surface: app · Structure: monolithic
- API as JSON: [textarea.json](textarea.json)

## When to use

- Capture multiple lines of free-form text (descriptions, comments, messages).

## Do

- Give it a sensible default size; avoid auto-growing beyond the viewport.
- Set `autoResize` on a field whose length varies a lot (a prompt, a comment, a commit message): it starts at `minRows` lines and grows as the person types. Always set `maxRows` with it, so a long paste scrolls inside the field instead of pushing the page down.
- `autoResize` turns the drag handle off; pick one or the other, never both.
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
| `placeholder` | `string` | `''` | false | Placeholder shown when the field is empty. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `readonly` | `boolean` | `false` | false | Marks the field read-only: the value is visible, focusable and copyable but not editable. Keeps the filled field (surface and solid border) with no hover border and a default cursor (`data-readonly`), the same look as `Input`; distinct from the disabled field. |
| `invalid` | `boolean` | `false` | false | Applies invalid styling and sets `aria-invalid`. |
| `required` | `boolean` | `false` | false | Marks the field as required and sets `aria-required`. |
| `resize` | `'vertical' \| 'horizontal' \| 'both' \| 'none'` | `'vertical'` | false | Which axes the user can drag to resize the field, named after the CSS `resize` property (`TextareaResize`, exported). `none` locks the size; `vertical` keeps the default behavior. |
| `monospace` | `boolean` | `false` | false | Sets the value and placeholder in the monospace code face (`.text-body-code-sm`) with `wrap="off"`: each line stays whole and the field scrolls sideways, so a record or a key never breaks across lines for pasted zone files, certificates, JSON and lists of IPs (`data-monospace`). Same prop as on `Input`. |
| `autoResize` | `boolean` | `false` | false | Grows the field with its content instead of a fixed height (`data-auto-resize`): CSS `field-sizing: content`, with a measured height where the browser lacks it. Turns the drag handle off. |
| `minRows` | `number` | `1` | false | Lines the field shows when empty while `autoResize` is on. Ignored without `autoResize`. |
| `maxRows` | `number` | `0` | false | Lines the field grows to before it scrolls while `autoResize` is on (`data-max-rows`); `0` sets no limit. Ignored without `autoResize`. |
| `modelValue` | `string` | `''` | false | Two-way value (`v-model`). |

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                     |
| --------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------- |
| `v-model` | `string` | `''`    | `update:modelValue` | The field value via `defineModel`; updates on every native `input` event. |

## States

- Visual states: `default`, `hover`, `focus`, `filled`, `disabled`, `required` (no visual change: the wrapping `Field.Label` carries the Required marker), `invalid` (danger border), `readonly`
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors the `invalid` prop
- `data-required` mirrors the `required` prop
- `data-readonly` mirrors the `readonly` prop: a read-only textarea keeps the editable field's fill (`var(--bg-surface)`) and solid `var(--border-default)` border, as `Input` does and the design sample draws it; it only drops the hover border and takes a default cursor. The value keeps `var(--text-default)` and the textarea stays focusable. Why the value cannot change is said by the field's description, not by a different chrome.
- `data-monospace` mirrors the `monospace` prop: the value and the placeholder render in `.text-body-code-sm` instead of `.text-body-xs`.
- `data-filled` mirrors whether `modelValue` is non-empty
- `data-resize` on the native `<textarea>` mirrors the `resize` prop and drives the `resize-*` Tailwind variant; with `autoResize` it is `none`, since the content sets the height
- `data-auto-resize` mirrors the `autoResize` prop: the field takes `field-sizing: content` and a minimum height of `minRows` lines (`--textarea-min-rows`) in place of the fixed 80 px; in a browser without `field-sizing` the component sets the height from `scrollHeight` on mount and on every value change
- `data-max-rows` is set to `maxRows` when `autoResize` is on and `maxRows` is above 0: the field stops growing at that many lines (`--textarea-max-rows`) and scrolls its content

## Accessibility

- Visible focus: on `:focus`, a `ring-2` shadow in `var(--ring-color)` plus a `ring-offset-2` in `var(--bg-canvas)` render around the field; the color transition respects `motion-reduce:transition-none`.
- Keyboard map: `Tab` focuses; typing inserts text; `Enter` inserts a newline; `Shift+Tab` moves focus to the previous element.
- Direction: the `<textarea>` renders `dir="auto"` so a value typed in another script keeps its own direction inside right-to-left UI; a `dir` attribute overrides it.
- ARIA: root is a native `<textarea>`; `aria-invalid` mirrors `invalid`; `aria-required` mirrors `required`; `aria-disabled` mirrors `disabled` when applicable.
- Contrast ≥4.5:1 (text) / ≥3:1 (border + icons), including disabled state.
- `motion-reduce:transition-none` on animated state transitions.
- Touch target: field min-height ≥80px ensures adequate hit area; with `autoResize` and `minRows: 1` the field is one line plus padding (≥ 32 px), above the 24 px minimum.
- `autoResize` changes only the height: the field keeps its native role, and a capped field scrolls with the keyboard like any textarea.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none.
- Keyboard: no horizontal arrow-key logic.
- User data: the `<textarea>` renders `dir="auto"`; a `dir` attribute overrides it.

## Internationalization

No built-in strings: the placeholder comes from the `placeholder` prop.

- Formatting: none

## Responsive

- Container queries: none; the field is `width: 100%` of its container.
- Narrow (≤ 640 px or a narrow container): the text wraps (a `monospace` field keeps each line whole and scrolls sideways); with `autoResize` a narrower field grows taller, since the height follows the wrapped lines.
- Touch: the field is the target (≥ 32 px with `autoResize` and one row, 80 px otherwise); no hover-only affordance.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; a `resizable="horizontal"` or `"both"` field can be dragged wider by the person.
- Touch: on coarse pointers (`pointer-coarse:`) the typed text steps up to 16 px (`text-body-md`; `text-label-code-lg` in the code face), so iOS Safari does not zoom the page when the field takes focus; fine pointers keep the dense size.

## Examples

### Default

```vue
<script setup>
  import Field from '@aziontech/webkit/field'
  import Textarea from '@aziontech/webkit/textarea'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <Field class="w-full max-w-(--container-xs)">
    <Field.Label>Message</Field.Label>
    <Textarea
      v-model="value"
      placeholder="Write your message"
    />
  </Field>
</template>
```

### Disabled

```vue
<script setup>
  import Field from '@aziontech/webkit/field'
  import Textarea from '@aziontech/webkit/textarea'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <Field
    disabled
    class="w-full max-w-(--container-xs)"
  >
    <Field.Label>Message</Field.Label>
    <Textarea
      v-model="value"
      placeholder="Write your message"
      disabled
    />
  </Field>
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
