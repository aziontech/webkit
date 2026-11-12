# Chip

> A Chip is a compact, pill-shaped token that labels a discrete value the user has applied — most often a filter on a data view. Unlike `tag` (a read-only status/category badge with severity color coding), a Chip carries no severity and exposes an optional trailing remove control: when `removable` is set, it renders a real `<button>` that emits `remove`, so the consumer can drop the value from a collection. This is the token consumed by the data table's `#filters` slot (`<Chip :label="f.label" removable @remove="dropFilter(f)" />`): each active filter becomes one removable Chip, and dismissing it removes that filter. Reach for a Chip when a value is user-applied and dismissible; reach for `tag` when it is a static status or category indicator. `kind` covers the three jobs a chip does in a filter surface, so a consumer never restyles the component to get one of them: - **`filled`** — a value that IS applied. The shared surface and border plus `--shadow-sm`: the loudest of the three, because it is state. - **`outlined`** — a value the user COULD apply. Same surface and border, no shadow: it recedes to an offer without becoming disabled, so a filter vocabulary can stay on screen instead of hiding inside a menu. - **`dashed`** — the control that CREATES a chip ("Add filter"). A dashed outline is the standing convention for "add another one of these", which is what separates the thing that makes filters from the things that are filters. **Selected is a mode, not a kind.** `selectable` turns the chip into a toggle: activating it flips the `selected` model (`v-model:selected`), and the state stays after the click until the chip is activated again. It is independent of `kind` — `filled` marks an applied filter and never means "selected", so a selectable chip of any kind paints its selected state the same way (`--bg-selected` fill, `--border-selected` outline) and announces it as `aria-pressed`. Reach for `selectable` when a set of chips is a row of toggles (quick filters, facets); keep `clickable` when activation opens or does something without holding a state. **Presence is the consumer's, not the chip's.** `remove` fires the moment the control is activated; the chip does not animate itself away or unmount itself. A chip that hid itself on remove could only ever serve the one case where removing it also destroys it — a filter bar where a removed value stays on screen as an `outlined` offer was impossible, because the instance stayed invisible forever. Exit motion, if wanted, belongs to whatever owns the list (a `TransitionGroup` around the group).

- Import: `import Chip from '@aziontech/webkit/chip'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [chip.json](https://github.com/aziontech/webkit/blob/main/.specs/chip.json)

## When to use

- Represent a selectable or removable token — active filters, multi-select values, entered keywords.
- Represent a value that is _available_ but not applied (`kind="outlined"`), so the set of things a view can be narrowed by stays visible.
- Represent the "add another" affordance for such a set (`kind="dashed"`).
- Represent a row of toggles that each hold an on/off state (`selectable` + `v-model:selected`).
- The element is interactive (clickable / dismissible).

## Do

- When removable, expose an accessible remove control with a clear label.
- Group related chips in a `chip-group` rather than ad-hoc layout.

## Don’t

- It is a static count or one-glance status → use `badge`.
- It is a static descriptive label/category with no interaction → use `tag`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [badge](badge.md) — static count/short-value indicator.
- [tag](tag.md) — static labelled status/category chip.
- [tooltip](tooltip.md) — composed by the remove control to name what it removes.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | Fallback text when the default slot is empty. |
| `kind` | `'filled' \| 'outlined' \| 'dashed'` | `'filled'` | false | Visual variant. Filled is an applied value, outlined an available one, dashed the control that adds one. |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Size token; `small` is a fixed 24px, `medium` a fixed 32px. |
| `removable` | `boolean` | `false` | false | When true, renders a trailing remove button that emits `remove`. |
| `clickable` | `boolean` | `false` | false | When true, the chip body becomes interactive (`role="button"`, focusable) and emits `click` on activation (click / Enter / Space). |
| `selectable` | `boolean` | `false` | false | When true, the chip becomes a toggle: activating it flips the `selected` model and emits `click`. |
| `disabled` | `boolean` | `false` | false | Suppresses activation, toggling and removal. |
| `selected` | `boolean` | `false` | false | Two-way value (`v-model:selected`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `remove` | `(event: MouseEvent, label: string)` | Fires when `removable` is true and the remove button is activated (click / Enter / Space), **immediately** — the chip does not hide or unmount itself first, so the consumer decides whether the chip disappears, stays, or becomes an `outlined` offer. `label` is the chip's `label` prop, identifying which chip was removed. |
| `click` | `(event: MouseEvent \| KeyboardEvent, label: string)` | Fires only when `clickable` or `selectable` is true, `disabled` is false, and the chip body is activated — by pointer, or `Enter` / `Space` while the root is focused. `label` identifies which chip was clicked. When `selectable`, the `selected` model is already flipped when `click` fires. The trailing remove button stops propagation, so activating it emits `remove` only, never `click`. `update:selected` comes from `v-model:selected` (see above). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Chip content; falls back to `label` when empty. |

## v-model

| Model              | Type      | Default | Emits             | Notes                                                                                                                                                     |
| ------------------ | --------- | ------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:selected` | `boolean` | `false` | `update:selected` | Whether a selectable chip is toggled on. Flipped on every activation while `selectable` and not `disabled`; ignored otherwise. Uncontrolled when unbound. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`
- `data-kind` mirrors the `kind` prop (`filled` | `outlined` | `dashed`)
- `data-size` mirrors the `size` prop (`small` | `medium`)
- `data-removable` is present when the `removable` prop is true
- `data-clickable` is present when the chip is interactive (`clickable` or `selectable`) and not `disabled`
- `data-selected` is present when `selectable` is true and the `selected` model is true
- `data-disabled` is present when the `disabled` prop is true
- When `selectable`, the chip is interactive exactly like `clickable`, and additionally carries `aria-pressed="true|false"` mirroring `selected`. Selected paints the `--bg-selected` fill and the `--border-selected` outline on top of whichever `kind` the chip has; `kind` keeps its own meaning (elevation, dash), so a `filled` chip is an applied value whether or not it is selected. Hover and active keep their `--border-strong` affordance over the selected outline.
- When `disabled`, the root is not focusable, activation, toggling and removal are suppressed, the text drops to `--text-disabled` with `cursor-not-allowed`, and the remove button is a disabled `<button>`. An interactive chip keeps `role="button"` and adds `aria-disabled="true"`.
- When `clickable`, the root is an interactive `role="button"` with `tabindex="0"`: it shows `cursor-pointer`, a `::before` ghost-layer darkening overlay (`--bg-hover`) on `hover` and `active`, a `--border-strong` border on `active` (the pressed state, per Figma), and a visible focus ring on `focus-visible`. When not clickable, the root stays a non-interactive container.
- The remove button (when `removable`) is always independently focusable and shows its own focus ring on `focus-visible`. It carries a **`tooltip`** naming what it removes, shown on hover and on keyboard focus — in a row of chips four identical `×` controls sit side by side, and the field name is what tells them apart.
- All three kinds share the same `--bg-surface` fill and `--border-default` border at rest, so a row of chips reads as one family; the kinds differ only in **elevation** (and, for `dashed`, the dash). When `clickable`, hover raises the border to `--border-strong` — the same rest→hover pair `input` and `select-trigger` use. That pair is what makes the outline read as interactive at all: `--border-default` is 8% black, the _same value_ as `--border-muted` in the light theme, so a static border of either token is indistinguishable. `filled` adds `--shadow-sm`; `outlined` drops it, which is what makes an applied value louder than an available one without changing the surface or the outline it is drawn with. `dashed` is `outlined` with a dashed border.
- **Fill is not the applied/available distinction.** It was, nominally — `filled` specified `--bg-surface-raised` and the other two were transparent — and it worked in neither theme: `--bg-surface-raised` resolves to the _same value_ as `--bg-surface` in the light theme, so the contrast it was meant to carry existed only in dark, and the utility was authored with a stray space inside the paren shorthand, which terminates the Tailwind candidate so it compiled to no CSS at all. Every `filled` chip was transparent in both themes. One shared surface is what makes a chip read as a raised object against `--bg-canvas`; `--shadow-sm` then carries the state on its own, which is what it was already doing.
- The remove control's glyph sits at `--text-muted` at rest and rises to `--text-default` on hover: at rest it is punctuation after a label, and on hover it is the thing being aimed at. It stays above the 3:1 non-text contrast minimum in both themes (3.95:1 light, 5.02:1 dark).

## Accessibility

- Visible focus: both the clickable root (when `clickable`) and the remove button use `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Keyboard map: when `clickable` or `selectable` (and not `disabled`), the root is focusable (`tabindex="0"`) and `Enter` / `Space` **dispatch a real DOM click** on the root (`preventDefault`ed first, so `Space` does not scroll), which in turn emits `click` (and, when `selectable`, toggles `selected`). Dispatching rather than emitting directly is what lets a chip serve as an overlay trigger — `Popover.Trigger` and friends open on the DOM click that bubbles out of their child, so a chip that only emitted a Vue event would work with the mouse and do nothing from the keyboard. When `removable`, `Tab` reaches the remove button and `Enter` / `Space` activate it and emit `remove`. Keystrokes that originate on the remove button do not bubble to the root activation (the handler ignores events whose `target` is not the root itself). When a chip is both interactive and `removable`, the button role, `tabindex`, `aria-pressed` and the `Enter` / `Space` handler move from the root to an inner body element (`data-chip-body`, testid `<testid>__body`) that holds the label, and the remove button sits beside it, not inside it: a `role="button"` with a `<button>` inside is `nested-interactive`, and screen readers flatten the inner control away. The root keeps the click handler and draws the focus ring when the body is focused (`has-[[data-chip-body]:focus-visible]`). Tab order is body, then remove button.
- ARIA: when neither `clickable` nor `selectable`, the root is a non-interactive `<span>` container; when either is set, it is `role="button"` with `tabindex="0"`. A `selectable` chip is a toggle button: `aria-pressed="true|false"` mirrors the `selected` model and flips on every activation, so the state is announced, not only painted. When `disabled`, an interactive root drops `tabindex` and carries `aria-disabled="true"`; the remove control is a native disabled `<button>`. The remove control is a real `<button type="button">`; the `pi pi-times` glyph is `aria-hidden="true"`. Its `aria-label` and its tooltip text are **the same derived string** — `Remove <label>` when `label` is set, `Remove` otherwise — so what is shown and what is announced cannot drift.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the remove icon.
- `motion-reduce:transition-none` on every transition the chip declares (kind/border colour, remove-button colour). The chip declares no dismiss animation at all, so there is nothing to suppress there.
- Touch target: the remove control is **24×24 px at `medium`** — the WCAG 2.5.8 (AA) minimum — and 16×16 px at `small`, a justified deviation for the compact 24px token where the surrounding chip remains the visible affordance. The earlier build drew the control at 14×14 px at every size, which met neither.

## Examples

### Default

```vue
<script setup>
  import Chip from '@aziontech/webkit/chip'
</script>

<template>
  <Chip
    label="Label"
    kind="filled"
    size="medium"
  />
</template>
```

### Types

```vue
<script setup>
  import Chip from '@aziontech/webkit/chip'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Chip
      label="Production"
      kind="filled"
      size="medium"
      removable
    />
    <Chip
      label="Status"
      kind="outlined"
      size="medium"
      clickable
    />
    <Chip
      label="Add filter"
      kind="dashed"
      size="medium"
      clickable
    />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import Chip from '@aziontech/webkit/chip'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Chip
      label="Small"
      size="small"
    />
    <Chip
      label="Medium"
      size="medium"
    />
  </div>
</template>
```
