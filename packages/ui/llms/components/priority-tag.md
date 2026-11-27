# Priority Tag

> Use PriorityTag only for the priority of a ticket, task or request on the urgent → low scale, or for "no priority"; the severity of a finding or alert is a SeverityTag, and the state of a ticket is a StatusIndicator or a Tag. PriorityTag labels a work item with how soon it should be handled: urgent, high, medium, low or none. The level reads from a three-bar signal glyph (the filled bars count the level), from a distinct alert mark for urgent, from three flat dots for none, and from the label, so no level depends on colour alone. Its accessible name always says the axis ("Priority: High"), which is why it is its own component and not a SeverityTag (decision SUP-05).

- Import: `import PriorityTag from '@aziontech/ui/priority-tag'`
- Category: content · Surface: app · Structure: monolithic
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- API as JSON: [priority-tag.json](priority-tag.json)

## When to use

- Show how urgent a support ticket, task, issue or request is, in a ticket list row, a table cell, a board card or a ticket detail header.
- Rank work on the fixed urgent, high, medium, low scale used by help desks and issue trackers, with "no priority" for items nobody has triaged yet.

## Do

- Keep the default label (the level name from the locale catalog, translated under `ConfigProvider`); override `label` only when the product glossary names a level differently (`Normal` for medium).
- Show `none` for an untriaged item instead of leaving the cell empty, so the column reads the same on every row.
- Use one PriorityTag per row, in its own column, so the glyphs line up and the scale reads down the column.
- Do not add a toned `tag` beside it for the same level; the glyph and the label already carry it.

## Don’t

- The value is how severe a finding, alert, incident or vulnerability is → use `severity-tag`.
- The value is the state of the ticket (open, pending, solved) → use `status-indicator` or `tag`.
- The user picks or changes the priority (a priority field or filter) → use `select` or `chip`; show the chosen value with this tag elsewhere.
- The value is a count on an icon or avatar → use `badge`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [severity-tag](severity-tag.md) — the same frame and bar glyph for the critical → info findings scale; its accessible name is the level alone.
- [tag](tag.md) — a toned status or category label with no order between values.
- [status-indicator](status-indicator.md) — the live state of a resource or ticket.
- [chip](chip.md) — an interactive or removable token, for priority filters.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `priority` | `'urgent' \| 'high' \| 'medium' \| 'low' \| 'none'` | `'none'` | false | Priority level (exported as `PriorityTagPriority`); sets the glyph (alert mark, filled bars or dots) and the default label. |
| `label` | `string` | `''` | false | Text of the tag. Empty uses the locale catalog (`Urgent`, `High`, `Medium`, `Low`, `No priority`). |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Size token; `medium` is 24px tall, `small` is 20px. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Replaces the visible label text; the hidden `Priority:` prefix remains. |

## States

- Visual states: `default` (static, non-interactive)
- `data-priority` mirrors the `priority` prop: `urgent` | `high` | `medium` | `low` | `none`
- `data-size` mirrors the `size` prop: `small` | `medium`
- Glyph per level: urgent the `az-circle-alert` mark; high 3 filled bars of 3; medium 2; low 1; none three flat dots
- `none` ("No priority", three dots) is the empty, untriaged value: the tag never renders blank
- Loading, error, disabled, readonly and invalid do not apply: the tag is static and non-interactive (a loading row shows a `skeleton` in its place)

## Accessibility

- Visible focus: not focusable; the tag is static text and takes no `tabindex`.
- Keyboard map: none; the tag has no interaction.
- ARIA: the glyph is `aria-hidden="true"`; a visually hidden prefix (`sr-only`, locale key `priorityTag.prefix`, `Priority:`) sits before the label, so the text a screen reader reads is "Priority: High". No `role` or `aria-label` on the root (a generic element takes no name); the hidden prefix stays when the default slot replaces the label.
- Contrast: label `var(--text-default)` on `var(--bg-canvas)` ≥4.5:1; filled bars `var(--text-default)` and the urgent mark `var(--danger-mark)` meet the mark and icon targets (Lc 30 / Lc 45, WCAG ≥3:1) in both themes; only documented token pairs (`rules/azion-ui-tokens.md` § Contrast).
- Never colour only: every level differs by glyph shape and by text.
- No motion, so no `motion-reduce:*` fallback is needed.
- Touch target: not applicable; the tag is not interactive.

## Right-to-left

- Layout: logical utilities only (`px-`, `gap-`); the glyph sits at the inline start and moves to the right under `dir="rtl"`.
- Icons: the bars are a flex row in the inline direction, so they rise from the inline start and mirror under `dir="rtl"` (rising right to left), the same as SeverityTag; nothing extra is set. `az-circle-alert` is not directional and is not in `DIRECTIONAL_ICONS`.
- Keyboard: none.
- User data: none (a custom `label` is short product text; no `<bdi>` needed).

## Internationalization

| Key                  | English source | Override prop          |
| -------------------- | -------------- | ---------------------- |
| `priorityTag.prefix` | `Priority:`    | —                      |
| `priorityTag.urgent` | `Urgent`       | `label` / default slot |
| `priorityTag.high`   | `High`         | `label` / default slot |
| `priorityTag.medium` | `Medium`       | `label` / default slot |
| `priorityTag.low`    | `Low`          | `label` / default slot |
| `priorityTag.none`   | `No priority`  | `label` / default slot |

- Formatting: none
- The accessible name is the prefix followed by the label (`Priority: High`). Translators get the prefix alone, with its colon (`Prioridade:`, `Prioridad:`); a language whose order is "level then axis" is a follow-up that would move to one placeholder key.

## Responsive

- Container queries: none: fixed size.
- Narrow (≤ 640 px or a narrow container): the tag never wraps (`whitespace-nowrap`); the cell around it truncates or wraps rows.
- Touch: not interactive, no target.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; the tag is at most about 110 px wide in English.

## Examples

### Default

```vue
<script setup>
  import PriorityTag from '@aziontech/ui/priority-tag'
</script>

<template>
  <PriorityTag
    priority="high"
    size="medium"
  />
</template>
```

### Priorities

```vue
<script setup>
  import PriorityTag from '@aziontech/ui/priority-tag'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-md)">
    <PriorityTag priority="urgent" />
    <PriorityTag priority="high" />
    <PriorityTag priority="medium" />
    <PriorityTag priority="low" />
    <PriorityTag priority="none" />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import PriorityTag from '@aziontech/ui/priority-tag'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-md)">
    <PriorityTag
      priority="urgent"
      size="small"
    />
    <PriorityTag
      priority="urgent"
      size="medium"
    />
  </div>
</template>
```
