# Pagination Button

> PaginationButton is one segment of the pagination's numbers strip: a 28px-tall native `button` that renders a page number or a Previous / Next chevron, or — for `kind="more"` — an inert, decorative overflow ellipsis (`span`, `aria-hidden`), selected by `kind`. It is the part `pagination` renders in data-driven mode and the one consumers compose by hand in composition mode, where it is reached as `Pagination.Button` (or imported standalone from `@aziontech/webkit/pagination-button`). It owns the segment's surface, current-page (`selected`) and `disabled` treatment, but not the strip's frame, border or the page state, which belong to the `pagination` root and the consumer.

- Import: `import PaginationButton from '@aziontech/webkit/pagination-button'`
- Category: data · Surface: product · Structure: monolithic
- API as JSON: [pagination-button.json](https://github.com/aziontech/webkit/blob/main/.specs/pagination-button.json)

## When to use

- Compose a custom page strip inside `pagination`'s default slot (composition mode), one button per Previous, page number, overflow and Next.
- Render the current page of a hand-wired pagination with `selected`, and the unavailable Previous / Next ends with `disabled`.

## Do

- Place it only inside `pagination`'s default slot: the strip's border and frame come from the root, and the outer radius is applied through `first:` / `last:`, so only the first and last buttons of the strip round their corners.
- Pass `aria-label` on every `previous` and `next` button: those kinds render an `aria-hidden` icon only and have no accessible name otherwise. `more` is decorative and hidden from assistive tech, so it takes no `aria-label`.
- Put the page number in the default slot of `kind="number"` only; the other kinds ignore the slot.
- Set `selected` on exactly one number button (it sets `aria-current="page"`), and `disabled` on Previous at the first page and Next at the last.
- In composition mode you own every click: listen to `click` and update the page yourself; a `disabled` button never emits it.

## Don’t

- You know the item count → pass `total` to `pagination` and bind `v-model:page`; it renders and wires every PaginationButton itself.
- The rows live in a data-driven `table` → set `paginated` on the table instead.
- The control is a previous / next link between documentation pages → use `doc-pagination`.
- It is a standalone action outside a pagination strip → use `button` or `icon-button`; this button has no radius or frame of its own except at the strip's ends.
- It is a "Load more" control at the end of a list → use `button`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [pagination](pagination.md) — the root that frames the strip and, in data-driven mode, renders these buttons; re-exports this component as `Pagination.Button`.
- pagination-info` — the page-info text that sits beside the strip.
- pagination-page-size` — the rows-per-page selector placed in the pagination's `controls` slot.
- [icon-button](icon-button.md) — a standalone icon-only action with its own frame and radius.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `'previous' \| 'next' \| 'number' \| 'more'` | `'number'` | false | Button role within the pagination. |
| `selected` | `boolean` | `false` | false | Marks the current page (filled surface + aria-current). |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `click` | `MouseEvent` | Fires on activation. Not emitted while `disabled` (the native `disabled` attribute also blocks it), and never for `kind="more"`. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The page number. Rendered only when `kind` is `number`. |

## States

- Visual states: `default`, `hover`, `active`, `focus-visible`, `selected`, `disabled`.
- Root: a native `button` with `type="button"`, or a `span` with `aria-hidden="true"` when `kind` is `more` (inert: not focusable, no hover / active layer, no `selected` / `disabled` treatment, never emits `click`); attributes (including `aria-label` and `class`) are forwarded to it (`inheritAttrs: false` + `v-bind="$attrs"`).
- `data-kind` mirrors `kind` (`previous` | `next` | `number` | `more`). `previous` renders `pi pi-chevron-left`, `next` renders `pi pi-chevron-right`, `more` renders `pi pi-ellipsis-h`; only `number` renders the default slot. `number` and `more` carry `var(--bg-surface)`; `previous` and `next` have no surface of their own.
- `hover` and `active` are two stacked pseudo-element layers (`before:` hover, `after:` active) and are mutually exclusive: pressing hides the hover layer and shows the active layer alone.
- `data-selected` is present when `selected` is set; it adds `var(--bg-selected)` and a `var(--border-default)` border, and sets `aria-current="page"`.
- `data-disabled` is present when `disabled` is set; the button also gets the native `disabled` attribute and `aria-disabled="true"`, mutes the foreground to `var(--text-disabled)`, shows `cursor-not-allowed`, hides both state layers and keeps the kind's own surface.
- Test ids: `<pagination testId>__button` when rendered inside a `pagination` (`data-pagination__button` by default), `data-pagination__button` outside one; a consumer `data-testid` wins.

## Accessibility

- Visible focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: native button — `Tab` focuses; `Enter` / `Space` activates; a `disabled` button is skipped by `Tab`; the `more` ellipsis is a `span` and never receives focus.
- ARIA: `aria-current="page"` when `selected`; `disabled` attribute and `aria-disabled="true"` when `disabled`; the chevron icons are `aria-hidden="true"`, so `previous` and `next` take their accessible name from a consumer `aria-label` (data-driven `pagination` sets one on both); the `more` ellipsis root is `aria-hidden="true"` and decorative, so it needs no name.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons): `var(--text-default)` on `var(--bg-surface)` / `var(--bg-selected)`; disabled uses `var(--text-disabled)`.
- `motion-reduce:transition-none`, `motion-reduce:before:transition-none` and `motion-reduce:after:transition-none` on the state transitions.
- Touch target: 28×28, a justified deviation — the buttons are butted into the compact pagination strip that sits in a table footer, with no room to pad the hit area (see `pagination`).

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the previous/next chevrons mirror (`rtl:-scale-x-100`).
- Keyboard: arrow keys are handled by `pagination`, swapped under `dir="rtl"`.
- User data: none.

## Usage

```vue
<script setup>
  import Pagination from '@aziontech/webkit/pagination'
  import PaginationButton from '@aziontech/webkit/pagination-button'
</script>

<template>
  <Pagination>
    <PaginationButton
      kind="previous"
      aria-label="Previous page"
      disabled
    />
    <PaginationButton
      kind="number"
      selected
      >1</PaginationButton
    >
    <PaginationButton kind="number">2</PaginationButton>
    <PaginationButton kind="more" />
    <PaginationButton
      kind="next"
      aria-label="Next page"
    />
  </Pagination>
</template>
```
