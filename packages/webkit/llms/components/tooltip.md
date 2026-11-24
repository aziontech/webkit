# Tooltip

> Surfaces a short hint anchored to a trigger element when the user hovers, focuses, or long-presses it. Use for icon-only buttons, abbreviations, or any control whose meaning is not obvious from its label alone. **Not** for rich content or interactive children — use `popover` instead.

- Import: `import Tooltip from '@aziontech/webkit/tooltip'`
- Category: overlay · Surface: app · Structure: monolithic
- API as JSON: [tooltip.json](tooltip.json)

## When to use

- Use Tooltip for a one-line plain-text name or hint on a control, shown on hover or focus; it cannot hold links. For rich or interactive content opened by a click use Popover; for a read-only rich preview on hover use HoverCard.
- Naming an icon-only control on hover and focus.
- Revealing the full text of a truncated label, or expanding an abbreviation.
- One short, plain-text hint that the user can do without.

## Do

- Wrap a focusable element. The tooltip opens on the wrapper's `focusin`, and the wrapper itself is not focusable.
- Keep `content` to a few words (about 80 characters at most): a name, a shortcut or an expanded abbreviation. It renders as plain text, with no markup. Never put a paragraph or an explanation in a tooltip; that is a `hint`.
- The tooltip describes its trigger (`aria-describedby`) but does not name it. Icon-only triggers still need their own accessible name.
- Use `disabled` to suppress the tooltip. An empty `content` also blocks opening, but it reads as a bug.
- Keep the default `delay` (200 ms) unless a dense toolbar needs a longer one.
- Bind the open state with `v-model:open`, or `:open` plus an `@update:open` handler typed `(open: boolean) => void`. The payload is always a `boolean`, so the handler needs no cast and no `Boolean(...)`.

## Don’t

- The content has links, buttons or more than one line of structure → use `popover`.
- An explanation, or anything longer than a few words (about 80 characters) → use `hint`, the click-open note beside the label. A tooltip only names a control or expands an abbreviation.
- An info glyph beside a field label or column header → use `hint`.
- A read-only rich preview (a definition, a glossed term in documentation prose) → use `hover-card`.
- Guidance or errors the user needs to complete a field → use `field-error`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [popover](popover.md) — click-opened, interactive, with a header, body and footer.
- [hint](hint.md) — the info glyph that opens a short note on click; use it for explanations, never a tooltip.
- [hover-card](hover-card.md) — read-only rich preview on hover or focus; DocMarkdown's `<Tooltip>` tag renders one.
- [icon-button](icon-button.md) — the most common trigger; it still needs its own `ariaLabel`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `content` | `string` | `—` | true | Plain text shown inside the tooltip. |
| `side` | `'top' \| 'bottom' \| 'start' \| 'end' \| 'auto'` | `'top'` | false | Side of the trigger the tooltip opens on, flipped when it does not fit; `'auto'` picks the side with the most room at open time. |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | false | Alignment along the trigger edge. |
| `sideOffset` | `number` | `8` | false | Pixel gap between the trigger and the tooltip. |
| `delay` | `number` | `200` | false | Hover-open delay in milliseconds. |
| `disabled` | `boolean` | `false` | false | Disables tooltip activation. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |
| `open` | `boolean` | `undefined` | false | Two-way value (`v-model:open`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The trigger element. Tooltip anchors to its bounding box. |

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                                                                                                                                                               |
| -------------- | --------- | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Open state via `defineModel('open')`, the only declaration of `open`, so `@update:open` is typed `(value: boolean) => void` and fires once per open/closed transition (hover, focus, `Esc`). While unbound the tooltip is uncontrolled and starts at `defaultOpen`. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `disabled`
- `data-state` values: `open` | `closed`
- `data-disabled` mirrors the `disabled` prop
- `data-side`: `top` | `bottom` | `start` | `end` — the side the panel landed on after flipping, on the trigger wrapper and the panel
- `data-align`: `start` | `center` | `end` — the alignment the panel landed on
- `start` and `end` follow the text direction: under `dir="rtl"`, `side="start"` opens on the right and `align="start"` lines the panel up with the trigger's right edge
- `data-anchored` on the panel once its opening position has landed — the flag that lets a re-anchor animate while the entrance stays the open animation

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the trigger wrapper.
- Hoverable (WCAG 1.4.13): the panel takes the pointer. Leaving the trigger closes the tooltip after a 100 ms grace, and entering the panel within the grace keeps it open (so text can be read under magnification); leaving the panel closes it after the same grace. Tests: `tooltip.test.ts` › hoverable content.
- Touch: a long-press (500 ms `pointerdown` with `pointerType` `touch`) opens the tooltip; it hides 1.5 s after the finger lifts. A mouse press never opens it.
- Keyboard map: `Tab` onto the trigger opens the tooltip at once (no hover delay); `Escape` closes it and focus stays on the trigger; `Tab` away closes it; the tooltip never takes or traps focus. `Escape` is taken only while the tooltip is open: closing removes the trigger's `aria-describedby` at once, and a page that reads open overlays (`useEscapeToCancel`) counts a tooltip only while a control still points to it, so the next `Escape` reaches the page even while the leave animation runs. A tooltip closed by `Escape` stays closed while the pointer rests on the trigger (a browser fires `mouseenter` when the panel disappears under a still pointer); it opens on hover again only after the pointer leaves the trigger and comes back, and on the next focus as usual. Tests: `tooltip.test.ts` › keyboard map (spec).
- Nested overlays: while open, the tooltip joins the shared overlay layer stack (`useOverlayLayer`) as a transient layer (it never takes focus, so it does not pause a dialog's focus trap). Inside a `Dialog`, `Drawer` or `Popover`, the first `Escape` closes only the tooltip; the next one reaches the host. Tests: `tooltip.test.ts` › inside an open Dialog, Escape closes only the tooltip.
- ARIA: `role="tooltip"` on the panel; the slotted control references the panel via `aria-describedby` (merged into a WebKit `Button` / `IconButton` or native control at render, otherwise forwarded onto the first focusable element in the slot after mount; on the wrapper only when the slot has none). The wrapper itself has no `role` and no tab stop. `aria-hidden="true"` when `data-state="closed"`.
- Contrast ≥4.5:1 — text against surface verified in both light and dark modes.
- `motion-reduce:animate-none` on the panel; reduced-motion users get instant show/hide.
- Touch target ≥40×40 px on the trigger (the consumer's responsibility — flag in docs).
- Teleported content: the teleported `role="tooltip"` panel binds `dir` and `lang` from the nearest `ConfigProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Tooltip from '@aziontech/webkit/tooltip'
</script>

<template>
  <Tooltip
    content="This is a Tooltip"
    side="top"
  >
    <Button
      label="Hover me"
      variant="outline"
      size="medium"
    />
  </Tooltip>
</template>
```

### Placements

```vue
<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-(--spacing-8) p-(--spacing-8)">
    <Tooltip
      content="top side"
      side="top"
    >
      <IconButton
        icon="az az-arrow-up"
        aria-label="top side"
        variant="outline"
        size="medium"
      />
    </Tooltip>
    <Tooltip
      content="end side"
      side="end"
    >
      <IconButton
        icon="az az-arrow-right"
        aria-label="end side"
        variant="outline"
        size="medium"
      />
    </Tooltip>
    <Tooltip
      content="bottom side"
      side="bottom"
    >
      <IconButton
        icon="az az-arrow-down"
        aria-label="bottom side"
        variant="outline"
        size="medium"
      />
    </Tooltip>
    <Tooltip
      content="start side"
      side="start"
    >
      <IconButton
        icon="az az-arrow-left"
        aria-label="start side"
        variant="outline"
        size="medium"
      />
    </Tooltip>
  </div>
</template>
```

### AutoPlacement

```vue
<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
</script>

<template>
  <div class="relative h-[28rem] w-full border border-dashed border-(--border-muted)">
    <p
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-body-sm text-(--text-muted) text-center max-w-md"
    >
      All four triggers use <code>side="auto"</code>.<br />
      Hover or focus a trigger: its tooltip resolves to the side with the most room.
    </p>

    <div class="absolute top-(--spacing-md) left-1/2 -translate-x-1/2">
      <Tooltip
        content="auto side"
        side="auto"
      >
        <IconButton
          icon="az az-arrow-up"
          aria-label="top-edge trigger"
          variant="outline"
          size="medium"
        />
      </Tooltip>
    </div>

    <div class="absolute bottom-(--spacing-md) left-1/2 -translate-x-1/2">
      <Tooltip
        content="auto side"
        side="auto"
      >
        <IconButton
          icon="az az-arrow-down"
          aria-label="bottom-edge trigger"
          variant="outline"
          size="medium"
        />
      </Tooltip>
    </div>

    <div class="absolute start-(--spacing-md) top-1/2 -translate-y-1/2">
      <Tooltip
        content="auto side"
        side="auto"
      >
        <IconButton
          icon="az az-arrow-left"
          aria-label="left-edge trigger"
          variant="outline"
          size="medium"
        />
      </Tooltip>
    </div>

    <div class="absolute end-(--spacing-md) top-1/2 -translate-y-1/2">
      <Tooltip
        content="auto side"
        side="auto"
      >
        <IconButton
          icon="az az-arrow-right"
          aria-label="right-edge trigger"
          variant="outline"
          size="medium"
        />
      </Tooltip>
    </div>
  </div>
</template>
```
