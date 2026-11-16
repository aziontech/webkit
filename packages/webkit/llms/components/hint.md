# Hint

> Small info affordance — a muted `ai ai-circle-info` glyph on a focusable button — that reveals one short explanation on hover or focus, through `Tooltip`. It is the standard way to attach a "why does this matter?" note to a field name without spending a line of vertical space on it, and it is what `Field.Label`'s `hint` prop renders.

- Import: `import Hint from '@aziontech/webkit/hint'`
- Category: input · Surface: app · Structure: monolithic
- API as JSON: [hint.json](hint.json)

## When to use

- Use Hint for the info glyph beside a field label or column header that explains it in one sentence. Guidance that must stay visible goes in Field.Description (inside Field) or FieldDescription.
- A field, switch or setting whose name is clear but whose consequence is not (what "Sensitive" does to a stored value).
- A short, self-contained sentence — one that reads fine in a tooltip and is not needed to complete the field.
- Beside a label, a section heading, or a table column header, where a permanent line of helper text would add noise.

## Do

- One sentence, ending in a period. If it needs two, it belongs in `field-description` or a `popover`.
- Never hide required information behind a hint — hover is not discoverable on touch, so treat it as an enhancement.
- The `content` doubles as the button's accessible name, so write it as prose a screen reader can read verbatim.
- Place it immediately after the thing it explains, not at the end of a row.

## Don’t

- Guidance the user needs while typing, or any validation message → use `field-error` (it stays on screen and is wired with `aria-describedby`).
- More than a sentence, links, or formatted content → use `popover`, which is dismissible and can hold real content.
- A plain description of an action already labelled by a control → use `tooltip` directly on that control.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tooltip](tooltip.md) — the overlay `Hint` composes; reach for it when the trigger is an existing control rather than a standalone info glyph.
- `field-description` — persistent guidance under a field; the right choice when the text must always be visible.
- `Field.Label` — renders `Hint` from its own `hint` prop, so a field name and its note stay one component.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `content` | `string` | `''` | true | Guidance text revealed on hover or focus; also the trigger's accessible name. |
| `side` | `'top' \| 'bottom' \| 'start' \| 'end' \| 'auto'` | `'top'` | false | Side of the glyph the tooltip opens on, flipped when it does not fit; `'auto'` picks the side with the most room. `start` and `end` follow the text direction. |

## States

- Visual states: `default`, `hover`, `focus-visible`
- `data-state` values (on the root, owned by `Tooltip`): `open` | `closed`
- `data-side` (on the root, owned by `Tooltip`): `top` | `bottom` | `start` | `end`, the side the tooltip landed on

## Accessibility

- The trigger is a native `<button type="button">`, so it is in the tab order and the tooltip opens on `focus` as well as hover (`Tooltip` opens on `focusin`).
- The glyph is decorative (`aria-hidden="true"`); the button's accessible name is the `content` prop, so the hint is reachable by screen readers that never see the tooltip.
- Keyboard map: `Tab` moves focus to the glyph and opens the tooltip; `Escape` closes it (owned by `Tooltip`); the button has no activation behaviour.
- The button's default action is prevented on click, so a `Hint` rendered inside a `<label>` never toggles the labelled control.
- Contrast ≥4.5:1 between `var(--text-muted)` and `var(--bg-canvas)`; the focus ring uses `var(--ring-color)` at 2px with an offset.
- Touch target: the glyph is drawn at 20×20 px inline with 12 px label text; a `[data-slot=touch-target]` span extends the hit area to 24×24 px (WCAG 2.5.8), and to 44×44 px on a coarse pointer. It is an enhancement, never the only path to the information.

## Examples

### Default

```vue
<script setup>
  import Hint from '@aziontech/webkit/hint'
</script>

<template>
  <Hint content="Values are encrypted at rest and never displayed again after saving." />
</template>
```

### Placements

```vue
<script setup>
  import Hint from '@aziontech/webkit/hint'
</script>

<template>
  <div class="flex items-center gap-(--spacing-lg)">
    <Hint
      content="Anchored above the glyph."
      side="top"
    />
    <Hint
      content="Anchored to the right of the glyph."
      side="end"
    />
    <Hint
      content="Anchored below the glyph."
      side="bottom"
    />
    <Hint
      content="Anchored to the left of the glyph."
      side="start"
    />
  </div>
</template>
```
