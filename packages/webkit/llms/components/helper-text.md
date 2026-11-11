# Helper Text

> Auxiliary text rendered below a form input to communicate guidance (`helper`), validation errors (`invalid`), required-field reminders (`required`), or a locked/disabled state (`disabled`). Each variant changes only color (and, for `disabled`, prepends a lock icon) so the visual weight stays consistent with the field above it.

- Import: `import HelperText from '@aziontech/webkit/helper-text'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [helper-text.json](https://github.com/aziontech/webkit/blob/main/.specs/helper-text.json)

## When to use

- Guidance under a bare input you compose yourself (format hints, limits).
- A validation error (`kind="invalid"`), a required reminder (`kind="required"`), or a locked-field notice (`kind="disabled"`) under a field.

## Do

- Give it an `id` and point the input's `aria-describedby` at it so screen readers read it with the field.
- Pick `kind` from the field state: `invalid` for errors, `required` for a missing required value, `disabled` when the field is locked.
- Keep it to one short line; `kind="disabled"` already prepends the lock icon, so do not add another.

## Don’t

- A standard form field → use `field`, whose `Field.Description` / `Field.Error` render this helper and wire it to the control.
- The field name or required marker above the input → use `label`.
- Feedback about a whole form or page rather than one field → use `message`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [label](label.md) — sits above the input; HelperText sits below it.
- [field](field.md) — `Field.Description` switches the helper `kind` from the Field's `disabled`, `invalid` and `required` state.
- message` — banner-level feedback with severity and an optional action.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | Fallback text when the default slot is empty. |
| `kind` | `'helper' \| 'invalid' \| 'required' \| 'disabled'` | `'helper'` | false | Visual variant; `disabled` also prepends a `pi pi-lock` icon. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Helper text; falls back to `label` prop when empty. |

## States

- Visual states: `helper`, `invalid`, `required`, `disabled`
- `data-kind` mirrors the `kind` prop

## Accessibility

- Root is a `<p>` element so the text is part of the document flow; consumers wire the input with `aria-describedby="<helper-id>"` to expose the helper text to assistive tech.
- Keyboard map: not focusable (descriptive text); the lock icon for `kind="disabled"` is decorative and marked `aria-hidden="true"`.
- ARIA: when `kind="invalid"`, consumers should also set `aria-invalid="true"` on the associated input; the helper text content carries the human-readable error.
- Contrast ≥4.5:1 between each `kind` color and `var(--bg-canvas)` (verified by Storybook a11y addon).
- `motion-reduce:transition-none motion-reduce:transform-none` not applicable (no motion).
- Touch target: text is non-interactive; not subject to the 40×40 px rule.

## Examples

### Default

```vue
<script setup>
  import HelperText from '@aziontech/webkit/helper-text'
</script>

<template>
  <HelperText
    kind="helper"
    label="Helper Text"
  />
</template>
```

### Types

```vue
<script setup>
  import HelperText from '@aziontech/webkit/helper-text'
</script>

<template>
  <div class="flex flex-col gap-2">
    <HelperText
      kind="helper"
      label="Helper Text"
    />
    <HelperText
      kind="invalid"
      label="Text Error"
    />
    <HelperText
      kind="required"
      label="Text Error"
    />
    <HelperText
      kind="disabled"
      label="Helper Text"
    />
  </div>
</template>
```
