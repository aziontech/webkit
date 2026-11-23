# Hover Card

> Rich preview that appears beside a link or name when the pointer rests on it or keyboard focus reaches it, and goes away when both leave. The root `HoverCard` owns the open state, the open and close delays and positioning (the shared `usePlacement`, the same engine as `Popover`); `HoverCard.Trigger` wraps the element being previewed; `HoverCard.Content` is the floating card. It sits between `Tooltip` (one line of plain text) and `Popover` (opened by a click, holds interactive content): the card shows a few lines of supplementary context, such as a person, a resource or a commit, without asking for a click.

- Import: `import HoverCardRoot from '@aziontech/webkit/hover-card-root'`
- Compound import (dot notation, not tree-shakeable): `import HoverCard from '@aziontech/webkit/hover-card'`
- Category: overlay · Surface: app · Structure: composition
- API as JSON: [hover-card.json](hover-card.json)

## When to use

- Use HoverCard for a read-only rich preview (a definition, a user card, a link preview) shown on hover or focus; interactive content is a Popover and a one-line hint is a Tooltip.
- Previewing what a link points to before following it: a user handle in an audit log, a resource name in a table, a commit hash.
- Showing a summary (status, owner, last update) that the destination page also shows.

## Do

- Wrap a link or a button: the trigger must be focusable on its own so keyboard users get the card too.
- Keep the card to a heading line, two or three facts and at most one secondary link; it is a preview, not a page.
- Keep the default delays (500 ms to open, 300 ms to close) so the card does not flash while the pointer crosses a list; shorten `openDelay` only for a single, deliberate target.
- The pointer can move from the trigger onto the card without closing it, so a link inside the card is reachable; `Esc` closes it.

## Don’t

- A one-line label or hint for an icon → use `tooltip`.
- Content the user must act on (buttons, forms) or must be able to reach by touch → use `popover`.
- The only place a piece of information appears. Hover and focus are not available everywhere; the card must repeat what the destination already shows.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tooltip](tooltip.md) — plain-text hint, same hover-and-focus model, no rich content.
- [popover](popover.md) — click-opened panel with focus management for interactive content; same positioning.
- [avatar](avatar.md), `tag` — typical content of a card.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `side` | ``HoverCardSide \| 'auto'` (`'top' \| 'bottom' \| 'start' \| 'end'`)` | `'bottom'` | false | Side of the trigger the card opens on, flipped when it does not fit; `'auto'` picks the side with the most room at open time. |
| `align` | ``HoverCardAlign` (`'start' \| 'center' \| 'end'`)` | `'center'` | false | Alignment along the trigger edge. |
| `sideOffset` | `number` | `8` | false | Pixel gap between the trigger and the card. |
| `openDelay` | `number` | `500` | false | Milliseconds the pointer or focus must stay on the trigger before the card opens. |
| `closeDelay` | `number` | `300` | false | Milliseconds after the pointer or focus leaves the trigger and the card before the card closes. |
| `disabled` | `boolean` | `false` | false | Never opens the card. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state while `v-model:open` is unbound. |
| `open` | `boolean` | `undefined` | false | Two-way value (`v-model:open`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Place one `<HoverCard.Trigger>` and one `<HoverCard.Content>`. |

## Sub-component imports

- `@aziontech/webkit/hover-card-trigger`
- `@aziontech/webkit/hover-card-content`

## Sub-components

- `hover-card-trigger/hover-card-trigger.vue` — wraps the previewed element in an `inline-flex` span that carries `data-testid` (`hover-card-trigger`) and `data-state`, and is the positioning anchor. It has no role and no tab stop of its own. It schedules the open on `pointerenter` (mouse and pen only; a touch tap follows the link) and on `focusin`, and the close on `pointerleave` and `focusout` (unless focus moves into the card). While the card is open and holds a focusable element, `Tab` on the trigger moves focus to the first one instead of leaving. While the card is open, the first focusable element in the slot gets `aria-describedby` pointing at the card, so screen readers read the card text after the link's name.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` with scope `{ isOpen: boolean }` — the previewed element.
- `hover-card-content/hover-card-content.vue` — the floating card. Teleported to `body`, rendered only while open, positioned by the root, `data-testid` `hover-card-content`, `data-state`, `data-side`, `data-align`. Entering it with the pointer cancels a pending close and leaving it schedules one, so the pointer can travel from the trigger to the card; focus entering it does the same and focus leaving it to anything but the trigger schedules the close. `Tab` past its last focusable element moves to the element after the trigger in the page, `Shift+Tab` from its first returns to the trigger. It has no role: it is description text for the trigger, not a dialog, and takes focus only when it holds a link or another focusable element.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — the card content.

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                     |
| -------------- | --------- | ----------- | ------------- | --------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Open state via `defineModel('open')`. While unbound the card is uncontrolled and starts at `defaultOpen`. |

## States

- `data-state` (root, trigger, content): `open` | `closed`.
- `data-disabled` on the root mirrors `disabled`; the card never opens.
- `data-side` / `data-align` on the content mirror the resolved side and alignment after flipping.
- `loading`, `empty`, `error`, `readonly`, `invalid`: not states of this component; a preview that loads data shows a `Skeleton` inside `HoverCard.Content`, owned by the consumer.

## Accessibility

- Content on hover or focus (WCAG 1.4.13): dismissible (`Esc` closes it without moving focus from the trigger, and returns focus to the trigger from inside the card), hoverable (the pointer can move onto the card; `closeDelay` and the card's own pointer handlers keep it open), persistent (it stays until pointer and focus leave or `Esc`).
- Keyboard map: `Tab` onto the trigger's link opens the card after `openDelay`; while it is open, `Tab` moves into the card when the card holds a link (or any focusable element), walks its links, and the `Tab` after the last one continues to the element after the trigger; `Shift+Tab` from the first returns to the trigger. A card with nothing focusable is skipped and `Tab` away closes it after `closeDelay`. `Esc` closes it; from inside the card focus returns to the trigger. Tests: `hover-card.test.ts` › keyboard.
- ARIA: while open, the trigger's focusable element carries `aria-describedby` pointing at the card; the card has no role and no `aria-modal`. The trigger wrapper adds no role or tab stop.
- Visible focus: the focus ring belongs to the consumer's link or button.
- Contrast ≥4.5:1 for card text on `--bg-surface-raised`.
- `motion-reduce:animate-none` on `animate-popup-scale-*`.
- Teleported card: binds `dir` and `lang` from the nearest `ConfigProvider` (`usePortalLocale`).

## Right-to-left

- Layout: logical utilities only; the card binds `dir` from `ConfigProvider`.
- Icons: none.
- Keyboard: no arrow keys.
- User data: consumer content; wrap names and domains in `<bdi>` inside the card.
- Placement: `side="start"` / `"end"` and `align="start"` / `"end"` follow the text direction, as in `Popover`: under `rtl`, `start` is the right side and the right edge.

## Internationalization

No built-in strings: the card shows only consumer content.

- Formatting: none (dates or counts inside the card are formatted by the consumer with `Intl`).

## Responsive

- Container queries: none; the card is between `--container-3xs` and `--container-xs` wide.
- Narrow (≤ 640 px or a narrow container): `usePlacement` flips to the side with room and shifts the card inside the viewport; a long card scrolls inside a height cap.
- Touch: hover is not available on touch, so a tap follows the trigger's link and the card does not open; the destination page carries the same information (see When NOT to use). Keyboard focus opens the card.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import HoverCard from '@aziontech/webkit/hover-card'
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <p class="text-body-sm text-(--text-default)">
    Deployed by
    <HoverCard>
      <HoverCard.Trigger>
        <Link
          href="https://example.com/people/jane-doe"
          label="Jane Doe"
          size="small"
        />
      </HoverCard.Trigger>
      <HoverCard.Content>
        <div class="flex items-center gap-(--spacing-sm)">
          <Avatar label="Jane Doe" />
          <div class="flex flex-col">
            <span class="text-label-md text-(--text-default)">Jane Doe</span>
            <span class="text-body-sm text-(--text-muted)">jane.doe@example.com</span>
          </div>
        </div>
        <p class="text-body-sm text-(--text-default)">
          Owner of production and staging. Joined Acme in March 2024.
        </p>
      </HoverCard.Content>
    </HoverCard>
    two hours ago.
  </p>
</template>
```

### ResourcePreview

```vue
<script setup>
  import HoverCard from '@aziontech/webkit/hover-card'
  import Link from '@aziontech/webkit/link'
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <div class="flex w-full max-w-(--container-sm) flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">Application</span>
    <HoverCard
      side="bottom"
      align="start"
    >
      <HoverCard.Trigger>
        <Link
          href="https://example.com/applications/acme-store"
          label="acme-store"
          size="small"
        />
      </HoverCard.Trigger>
      <HoverCard.Content>
        <div class="flex items-center justify-between gap-(--spacing-sm)">
          <span class="text-label-md text-(--text-default)">acme-store</span>
          <Tag
            label="Active"
            severity="success"
            size="small"
          />
        </div>
        <dl class="grid grid-cols-2 gap-(--spacing-xs) text-body-sm">
          <dt class="text-(--text-muted)">Region</dt>
          <dd class="text-(--text-default)">United States</dd>
          <dt class="text-(--text-muted)">Last deploy</dt>
          <dd class="text-(--text-default)">2026-11-12 14:30 UTC</dd>
          <dt class="text-(--text-muted)">Domain</dt>
          <dd class="text-(--text-default)"><bdi>app.example.com</bdi></dd>
        </dl>
      </HoverCard.Content>
    </HoverCard>
  </div>
</template>
```

### Disabled

```vue
<script setup>
  import HoverCard from '@aziontech/webkit/hover-card'
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <p class="text-body-sm text-(--text-default)">
    Deployed by
    <HoverCard disabled>
      <HoverCard.Trigger>
        <Link
          href="https://example.com/people/jane-doe"
          label="Jane Doe"
          size="small"
        />
      </HoverCard.Trigger>
      <HoverCard.Content>
        <p class="text-body-sm text-(--text-default)">Owner of production.</p>
      </HoverCard.Content>
    </HoverCard>
    two hours ago.
  </p>
</template>
```
