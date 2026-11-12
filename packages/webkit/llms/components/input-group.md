# Input Group

> Composition container that joins an input primitive with any number of adjacent controls (buttons, selects, static addons) into a single visual field — the webkit analogue of PrimeVue's `InputGroup`. The root only orchestrates: it draws the outer border, the `focus-within` ring, and applies inline Tailwind child-selectors so the first child rounds only on the left, the last only on the right, and internal borders collapse between siblings. Everything else is a **child**: the middle input is a raw `<input>` in the root's `default` slot; sibling controls (`<Button>`, `<Select>`, `<Input>`, or an `<InputGroup.Addon>` for static text like `https://` / `.com` / `R$`) are dropped in directly alongside it. This is a breaking change from v3: the `#left` and `#right` named slots are gone — their static-text role moves to `<InputGroup.Addon>`, and their interactive role is served by placing the real component (`Button`, `Select`) as a direct child. Consumers therefore never wrap `Button`/`Select` in an inner `<div>` — the root's child selectors do that job.

- Import: `import InputGroupRoot from '@aziontech/webkit/input-group-root'`
- Compound import (dot notation, not tree-shakeable): `import InputGroup from '@aziontech/webkit/input-group'`
- Category: inputs · Surface: product · Structure: composition
- API as JSON: [input-group.json](https://github.com/aziontech/webkit/blob/main/.specs/input-group.json)

## When to use

- A text input that needs static prefix or suffix content inside the same border (`https://`, `.com`, a currency symbol).
- An input joined to a control: a search field with a trailing `button`, an amount with a leading currency `select`.

## Do

- Put static text and icons in `InputGroup.Addon`; place real controls (`button`, `select`) as direct children with no wrapper `div`.
- Set the same `size` on the group and on its child controls so heights line up.
- disabled`, `invalid`, and `required` style the group only; also set them on every child control they should affect. Inside a `Field`, put them on the `Field` instead: the root and `InputGroup.Input` both read them.
- Use `InputGroup.Input` for the middle input: it is borderless, picks up the enclosing `Field`'s wiring, and spares the long raw-`<input>` class string.
- The root is `role="group"`; label the inner input itself, or give the group an `aria-label`.

## Don’t

- A phone number with a dial code → use `phone-input`.
- A single input with only a decorative icon → use `input` and its `iconLeft` / `iconRight` slots.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [field](field.md) — wrap the group in a `Field` for a label and description/error; `InputGroup.Input` takes the field's id, `aria-describedby` and state, and the root takes `invalid` / `disabled` / `required` from it.
- [phone-input](phone-input.md) — input group with a dial-code select and a per-country mask.
- [input](input.md) — the single-field primitive with icon slots.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token; affects the root's height and inner addon padding. Heights: small=28px, medium=32px, large=40px. Matches the sibling input primitives (`Input`, `Select`) — set the same `size` on child controls to keep them visually aligned. |
| `invalid` | `boolean` | `false` | false | Renders the error border and sets `aria-invalid="true"` on the root. |
| `required` | `boolean` | `false` | false | Renders the required (warning) border. `aria-required` is not allowed on `role="group"`, so the required state belongs on the input (`InputGroup.Input` reads it from the Field). |
| `disabled` | `boolean` | `false` | false | Renders the disabled visual (muted fill, not-allowed cursor, no focus-within ring) and sets `aria-disabled="true"` on the root. Does not propagate to the child controls — each child is responsible for its own `disabled` attribute (inside a `Field`, the Field's `disabled` reaches both the root and `InputGroup.Input`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | On the **root**: the full row of children in visual order — any mix of `<InputGroup.Addon>`, `<Button>`, `<Select>`, `<Input>`, raw `<input>`. Order in the template is the order rendered left-to-right. On **`<InputGroup.Addon>`**: the addon content — text (`https://`, `.com`, `R$`), a PrimeIcons `<i>`, or any small inline node; kept short by convention (long content breaks the fixed row height). |

## Sub-component imports

- `@aziontech/webkit/input-group-addon`
- `@aziontech/webkit/input-group-input`

## Sub-components

Folder layout:

```
packages/webkit/src/components/inputs/input-group/
├── input-group.vue                      # root
├── input-group-addon/
│   └── input-group-addon.vue            # <InputGroup.Addon>
├── input-group-input/
│   └── input-group-input.vue            # <InputGroup.Input>
└── index.ts                             # compound wire-up (Object.assign)
```

Public members of the compound:

| Member               | Attached name           | Standalone export                     | Purpose                                                                                                                                                                                                                                                                                                                  |
| -------------------- | ----------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Root                 | — (the compound itself) | `@aziontech/webkit/input-group-root`  | The container. Orchestrates borders, seams, focus ring, and states.                                                                                                                                                                                                                                                      |
| `<InputGroup.Addon>` | `Addon`                 | `@aziontech/webkit/input-group-addon` | Static-content island (icon, text like `https://`, `.com`, `R$`) rendered with the darker `--bg-canvas` fill and muted text.                                                                                                                                                                                             |
| `<InputGroup.Input>` | `Input`                 | `@aziontech/webkit/input-group-input` | Borderless middle `<input>`. Props: `modelValue` (`''`), `placeholder` (`''`), `autocomplete`, `disabled`, `readonly`, `required`, `invalid` (all `false`); emits `update:modelValue`. Reads `id`, `aria-describedby`, `invalid`, `disabled` and `required` from an enclosing `Field` (an explicit prop/attribute wins). |

The root reads `invalid`, `disabled` and `required` from an enclosing `Field` too, OR-ed with its own props, so a `Field`'s state styles the whole group.

## States

- Visual states on root: `default`, `hover`, `focus-within`, `invalid`, `required`, `disabled`
- `data-size` mirrors the `size` prop and drives the root height (`small`=`h-7`, `medium`=`h-8`, `large`=`h-10`)
- Only one focus indicator is visible when a descendant is focused: the group draws the single `focus-within` ring on its root, and the inner input primitives' own focus rings are suppressed via `[&_*]:focus-visible:!ring-0 [&_*]:focus-within:!ring-0` so `Button`, `Select.Trigger`, `Input` wrappers, and raw `<input>` share the group's ring instead of stacking their own on top
- `data-invalid` mirrors the `invalid` prop; sets `aria-invalid="true"`
- `data-required` mirrors the `required` prop (no `aria-required` on the group root)
- `data-disabled` mirrors the `disabled` prop; sets `aria-disabled="true"`
- Border semantics mirror `input` (independent, not compound):
  - `data-invalid` → `var(--danger-border)`
  - `data-required` → `var(--warning-border)`
- Hover (only when not focus-within, not invalid, not required, not disabled): `border-(--border-strong)`
- Focus-within: 2-ring at `var(--ring-color)` with `var(--bg-canvas)` offset (suppressed when `data-disabled`)
- Disabled: `bg-(--bg-disabled)`, `text-(--text-disabled)`, `cursor-not-allowed`, hover ignored, focus-within ring suppressed
- Child seams (applied by the root via Tailwind child selectors):
  - `[&>*:first-child]:rounded-l-(--shape-elements)` and `[&>*:not(:first-child)]:rounded-l-none`
  - `[&>*:last-child]:rounded-r-(--shape-elements)` and `[&>*:not(:last-child)]:rounded-r-none`
  - `[&>*:not(:last-child)]:border-r-(color:--border-default) [&>*:not(:last-child)]:border-r` — a single vertical seam between adjacent children, drawn on the left child so child components keep their own left border intact
  - Child components' own outer borders remain — the root's outer border sits on top, so double lines are avoided by the child selector removing the _inner-facing_ border only

## Accessibility

- Visible focus: the root shows a `focus-within` ring (`ring-2 ring-(--ring-color) ring-offset-2 ring-offset-(--bg-canvas)`) whenever any descendant (any child control or the middle input) has focus. The middle input renders `focus:ring-0 outline-none` so the group's ring is the only visible focus indicator. Suppressed when `data-disabled` is present. Child components (`Button`, `Select`) retain their own focus behavior internally but the group's ring is visually authoritative.
- Keyboard map: `Tab` moves through the children in DOM order. No custom keybindings on the group.
- ARIA: root uses `role="group"`; `aria-invalid` reflects the prop; `required` is styling only on the root. Each child keeps its own `aria-*` — the group does not duplicate.
- `<InputGroup.Addon>` is decorative-by-default; when its content is not conveyed elsewhere the consumer should annotate it (`aria-hidden="true"` for pure decoration, or a visible-only label the middle input references via `aria-describedby`).
- Contrast ≥4.5:1 for addon text against `var(--bg-canvas)`; ≥3:1 for the border in every state.
- Motion: color transitions on state changes are `duration-150 ease-out` and pair with `motion-reduce:transition-none`.
- Touch target ≥32×32 px for interactive children (matches root height `h-8`).

## Examples

### Default

```vue
<script setup>
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
</script>

<template>
  <InputGroupRoot>
    <input
      placeholder="domain"
      class="flex-1 min-w-0 h-full bg-(--bg-surface) border-0 outline-none focus:ring-0 px-(--spacing-md) text-label-sm text-(--text-default) placeholder:text-(--text-muted)"
    />
  </InputGroupRoot>
</template>
```

### Sizes

```vue
<script setup>
  import InputGroup from '@aziontech/webkit/input-group'
</script>

<template>
  <div class="flex flex-col gap-4">
    <InputGroup size="small">
      <InputGroup.Addon>https://</InputGroup.Addon>
      <input
        placeholder="domain"
        class="flex-1 min-w-0 h-full bg-(--bg-surface) border-0 outline-none focus:ring-0 px-(--spacing-md) text-label-sm text-(--text-default) placeholder:text-(--text-muted)"
      />
      <InputGroup.Addon>.com</InputGroup.Addon>
    </InputGroup>
    <InputGroup size="medium">
      <InputGroup.Addon>https://</InputGroup.Addon>
      <input
        placeholder="domain"
        class="flex-1 min-w-0 h-full bg-(--bg-surface) border-0 outline-none focus:ring-0 px-(--spacing-md) text-label-sm text-(--text-default) placeholder:text-(--text-muted)"
      />
      <InputGroup.Addon>.com</InputGroup.Addon>
    </InputGroup>
    <InputGroup size="large">
      <InputGroup.Addon>https://</InputGroup.Addon>
      <input
        placeholder="domain"
        class="flex-1 min-w-0 h-full bg-(--bg-surface) border-0 outline-none focus:ring-0 px-(--spacing-md) text-label-sm text-(--text-default) placeholder:text-(--text-muted)"
      />
      <InputGroup.Addon>.com</InputGroup.Addon>
    </InputGroup>
  </div>
</template>
```

### WithAddonLeft

```vue
<script setup>
  import InputGroup from '@aziontech/webkit/input-group'
</script>

<template>
  <InputGroup>
    <InputGroup.Addon>https://</InputGroup.Addon>
    <input
      placeholder="domain"
      class="flex-1 min-w-0 h-full bg-(--bg-surface) border-0 outline-none focus:ring-0 px-(--spacing-md) text-label-sm text-(--text-default) placeholder:text-(--text-muted)"
    />
  </InputGroup>
</template>
```
