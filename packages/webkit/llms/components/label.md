# Label

> Form-field label that pairs descriptive text with an optional required indicator and an optional hint. Renders a native `<label>` element so consumers can associate it with any input via the standard `for` attribute. Use it above (or beside) any input control in the `inputs` category to communicate the field name and whether it must be filled. The required indicator is rendered inline as `* (Required)` — the `*` in the primary orange followed by the parenthesized word "(Required)" in muted text — replacing the older `Tag` badge for a lighter typographic signal. Setting `hint` appends a `Hint` glyph after the text, so a field name and its one-sentence explanation stay one component instead of a hand-built row.

- Import: `import Label from '@aziontech/webkit/label'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [label.json](https://github.com/aziontech/webkit/blob/main/.specs/label.json)

## When to use

- Naming a bare input when you compose a field layout yourself.
- Marking a field as required with the inline `* (Required)` indicator.
- Attaching a one-sentence explanation to a field name with `hint`.

## Do

- Always set `for` to the input's id (`inputId` on the bare inputs) so clicking the label focuses the control.
- required` is visual only; also set `required` on the input so it carries `aria-required`.
- Keep `hint` to one short sentence; it is revealed in a tooltip on hover or focus.
- Pass the text through `label` or the default slot, not both; the slot wins.

## Don’t

- A standard text, password, select, or textarea field → use `field`, whose `Field.Label` targets the control and shows the Required marker for you.
- Guidance, error, or required messages under the input → use `helper-text`.
- An info glyph with no field name next to it → use `hint`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [helper-text](helper-text.md) — the line under the input; pairs with the label above it.
- [hint](hint.md) — the glyph the `hint` prop renders; use it alone when there is no label.
- [field](field.md) — composes label, any control, and description/error with the wiring done.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | Fallback text when the default slot is empty. |
| `required` | `boolean` | `false` | false | Appends an inline required indicator (`<span aria-hidden>*</span> (Required)`) next to the label text. The `*` uses `var(--primary)`; "(Required)" inherits `var(--text-muted)`. |
| `hint` | `string` | `''` | false | Short explanation appended as a `Hint` glyph that reveals it on hover or focus. Empty renders no glyph. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Label text; falls back to `label` prop when empty. |

## States

- Visual states: `default`, `required`, `hinted`
- `data-required` mirrors the `required` prop
- `data-hinted` is set when `hint` is non-empty (the `Hint` glyph is rendered)

## Accessibility

- Root is a native `<label>` element; consumers pass `for="<input-id>"` via attrs to associate it with the corresponding control.
- Keyboard map: the label itself is not focusable (native `<label>` semantics); clicking it focuses the associated input via native browser behavior. When `hint` is set, the `Hint` glyph inside it is the one focusable stop — it swallows its own click (`.prevent`), so activating the hint never toggles the labelled control.
- With `hint` set, the hint sentence is the glyph's accessible name and therefore joins the associated control's accessible name — deliberate, since a hover-only tooltip would otherwise be invisible to a screen reader. Keep hints to one sentence for that reason.
- ARIA: the required indicator is inline text (`* (Required)`). The `*` character is decorative and marked `aria-hidden="true"` so screen readers announce only "(Required)" together with the label text. Consumers that wire the input with `aria-required="true"` keep the programmatic state in sync.
- Contrast ≥4.5:1 between `var(--text-default)` and `var(--bg-canvas)`; the warning tag inherits its own contrast guarantees.
- `motion-reduce:transition-none motion-reduce:transform-none` not applicable (no motion).
- Touch target: label itself is non-interactive; the associated input owns the ≥40×40 px target.

## Examples

### Default

```vue
<script setup>
  import Input from '@aziontech/webkit/input'
  import Label from '@aziontech/webkit/label'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) flex-col gap-(--spacing-xs)">
    <Label
      for="label-default-field"
      label="Label"
    />
    <Input
      id="label-default-field"
      v-model="value"
    />
  </div>
</template>
```

### Required

```vue
<script setup>
  import Input from '@aziontech/webkit/input'
  import Label from '@aziontech/webkit/label'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) flex-col gap-(--spacing-xs)">
    <Label
      for="label-required-field"
      label="Label"
      required
    />
    <Input
      id="label-required-field"
      v-model="value"
    />
  </div>
</template>
```

### Hinted

```vue
<script setup>
  import Input from '@aziontech/webkit/input'
  import Label from '@aziontech/webkit/label'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) flex-col gap-(--spacing-xs)">
    <Label
      for="label-hinted-secret"
      label="Sensitive"
      hint="Values are encrypted at rest and never displayed again after saving."
    />
    <Input
      id="label-hinted-secret"
      v-model="value"
    />
  </div>
</template>
```
