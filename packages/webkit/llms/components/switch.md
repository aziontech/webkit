# Switch

> Control-only pill toggle `Switch` (36×20 px). Two visual types: `default` (plain handle) and `privacy` (handle carries a `pi-lock` / `pi-lock-open` icon mirroring the toggled state). No label or description — wrap it in a horizontal `Field` or a `Field.Label` choice card for labeled layouts, or place it bare where the label already exists outside the control (an ItemGroup row names the field with `Item.Title`). Because the bare form has no wrapper to defer to, the control owns its own `disabled` state.

- Import: `import Switch from '@aziontech/webkit/switch'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [switch.json](https://github.com/aziontech/webkit/blob/main/.specs/switch.json)

## When to use

- An on/off setting that takes effect as soon as it flips (enable a feature, turn a rule on).
- A row that already names the setting outside the control, such as an `item` row whose title is the label.
- A visibility or access toggle: `kind="privacy"` shows a closed lock when off and an open lock when on.

## Do

- The switch renders no text: give it an accessible name with `aria-label`, or `aria-labelledby` pointing at the visible label.
- Set `disabled` on the switch itself; it renders a native disabled button, so it leaves the tab order and ignores clicks and keys.
- focused` moves real focus and forces the ring; use it only to mirror an external focus state, never as decoration.
- Keep `kind="default"` unless the setting is about visibility or access.

## Don’t

- The toggle needs its own label, description, or helper text in a form → wrap it in a horizontal `field` (`Field orientation="horizontal"` + `Field.Content`).
- The toggle should sit in a bordered card with a description → use a `field` choice card (`Field.Label` wrapping a horizontal `Field`).
- A text value that only applies while a feature is on → compose a `Field` with an `InputGroup` (`InputGroup.Input` + an `InputGroup.Addon` holding the switch).
- The choice is submitted with a form instead of applied immediately → use `checkbox`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [field](field.md) — a horizontal `Field` gives the switch its label and description; a `Field.Label` wrapping it is a card-style option.
- [input-group](input-group.md) — a text input with a trailing switch addon that enables it, inside a `Field`.
- [checkbox](checkbox.md) — boolean selection submitted with a form.
- [item](item.md) — list row whose title names a bare switch.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | false | Toggled-on state. Bind with `v-model="value"`. Mirrors the Figma checked/on variant. |
| `kind` | `'default' \| 'privacy'` | `'default'` | false | Visual variant. `privacy` renders a lock icon inside the handle (closed when off, open when on). |
| `focused` | `boolean` | `false` | false | Forces the focused visual state regardless of keyboard focus. Mirrors the Figma `focused` variant. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies the disabled tokens. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Emitted when the user toggles the switch. Paired with `v-model`. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `checked`, `disabled`
- `data-checked` mirrors the `modelValue` prop (toggled-on state)
- `data-focused` mirrors the `focused` prop and applies the same ring tokens as `:focus-visible`
- `data-kind` mirrors the `kind` prop (`default` | `privacy`)
- `data-disabled` mirrors the `disabled` prop; the root is also natively `<button disabled>`, so it leaves the tab order and neither click nor `Space`/`Enter` emits `update:modelValue`. The disabled treatment is the `--bg-disabled` track + `--text-disabled` handle + `cursor-not-allowed` — token surfaces, never an opacity wash. It wins over the checked tokens, so a disabled switch reads locked in both the off and on positions.
- Hover applies an inset `var(--bg-hover)` overlay on both off and on tracks; disabled suppresses that overlay (`data-[disabled]:hover:shadow-none`) while keeping the element hit-testable so `cursor-not-allowed` is what the pointer shows
- Touch: an invisible `::after` extends the hit area of the 36 × 20 px track to 24 px tall, and to 44 × 44 px on a coarse pointer.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`. The same ring is applied when `focused` is `true` (`data-[focused]` mirror).
- Keyboard map: `Tab` focuses; `Space` / `Enter` toggles. When `disabled`, the native `<button disabled>` root is skipped by `Tab` and both keys are inert.
- ARIA: `role="switch"` on the root; `aria-checked` mirrors `data-checked`; `aria-disabled` mirrors `data-disabled`. The lock icon in `kind="privacy"` is decorative — `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target: the control itself is 36×20 — the consumer is responsible for placing it inside a ≥40×40 hit area (typically a horizontal `Field`, whose label extends the target). The component still exposes a clickable root.

## Examples

### Default

```vue
<script setup>
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  const modelValue = ref(false)
</script>

<template>
  <Switch
    v-model="modelValue"
    aria-label="Toggle setting"
  />
</template>
```

### Types

```vue
<script setup>
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  const defaultOff = ref(false)
  const defaultOn = ref(true)
  const privacyOff = ref(false)
  const privacyOn = ref(true)
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-4)">
    <Switch
      v-model="defaultOff"
      kind="default"
      aria-label="Default off"
    />
    <Switch
      v-model="defaultOn"
      kind="default"
      aria-label="Default on"
    />
    <Switch
      v-model="privacyOff"
      kind="privacy"
      aria-label="Privacy off"
    />
    <Switch
      v-model="privacyOn"
      kind="privacy"
      aria-label="Privacy on"
    />
  </div>
</template>
```

### Disabled

```vue
<script setup>
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  const lockedOff = ref(false)
  const lockedOn = ref(true)
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-4)">
    <Switch
      v-model="lockedOff"
      disabled
      aria-label="Locked off"
    />
    <Switch
      v-model="lockedOn"
      disabled
      aria-label="Locked on"
    />
  </div>
</template>
```
