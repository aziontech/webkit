# Listing Table

> A titled preview of a longer listing: a few linked rows in columns, and one outlined button into the full list. It is a page section — the site places it from a `{ _id: 'listing-table', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `table` and, below `sm`, `item`. Each row is one link named by its first column; the whole row is clickable with the pointer and the first column's link is the keyboard and screen-reader path. Below `sm` the same rows become a list of items, the first column as the title and the second as the description, with the button going full width.

- Import: `import ListingTable from '@aziontech/webkit/listing-table'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [listing-table.json](https://github.com/aziontech/webkit/blob/main/.specs/listing-table.json)

## When to use

- To preview the latest entries of a listing (open roles, releases, events) with a way into the full list.

## Do

- Keep three columns at most; the first names the row and the second describes it on phones.
- Give the wide columns `grow: 2` and align a short trailing column to `end`.
- Keep the preview to a handful of rows and point `primaryAction` at the full listing.

## Don’t

- For a filterable or paginated listing → use `listing-browser`.
- For a comparison of plans or features → use the pricing matrix.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [table](table.md) — the composition table the wide layout renders.
- [listing-browser](listing-browser.md) — the full listing this band links into.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the left-aligned section title as its `h2`; the band renders no header when empty. |
| `columns` | `ListingTableColumn[]` | `[]` | false | The columns left to right; each is `{ key, label, grow?, align? }` where `key` picks the row value, `grow` is the flex weight (1, 2 or 3) and `align` is `start` or `end`. The first column names the row and the second describes it on phones. |
| `rows` | `ListingTableRow[]` | `[]` | false | The linked rows, in order; each is `{ href, values }` where `values` maps a column key to its text. |
| `primaryAction` | `ListingTableAction` | `undefined` | false | Outlined button into the full listing, in the table footer; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. |

## States

- Visual states: `default`, `hover` (row fill)
- Empty: when `rows` or `columns` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set; the footer button only when `primaryAction` is set
- Below `sm` the table is hidden and the rows render as an item list

## Accessibility

- Visible focus: owned by the row links and the composed `button`.
- Keyboard map: `Tab` reaches each row's link and then the button; `Enter` follows it.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the table keeps its native column headers; the phone list is the same rows as list items.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): row titles `var(--text-default)`, values `var(--text-muted)`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the button carries its own fallback.
- Touch target ≥40×40 px — each phone row is a whole-item link; the button is large.

## Examples

### Default

```vue
<script setup>
  import ListingTable from '@aziontech/webkit/listing-table'
</script>

<template>
  <ListingTable
    title="Latest roles"
    :columns="[
      { key: 'role', label: 'Role', grow: 2 },
      { key: 'team', label: 'Team and location', grow: 2 },
      { key: 'type', label: 'Work type', align: 'end' }
    ]"
    :rows="[
      {
        href: '/careers/senior-platform-engineer',
        values: {
          role: 'Senior Platform Engineer',
          team: 'Delivery Engineering · Porto Alegre',
          type: 'Hybrid · Full-time'
        }
      },
      {
        href: '/careers/senior-quality-automation-engineer',
        values: {
          role: 'Senior Quality Automation Engineer',
          team: 'Delivery Engineering · Porto Alegre',
          type: 'Hybrid · Full-time'
        }
      },
      {
        href: '/careers/software-engineer-go',
        values: {
          role: 'Software Engineer (Go)',
          team: 'Engineering · Porto Alegre',
          type: 'Hybrid · Full-time'
        }
      },
      {
        href: '/careers/software-engineer-rust',
        values: {
          role: 'Software Engineer (Rust and/or C/C++)',
          team: 'Platform Engineering · Porto Alegre / São Paulo',
          type: 'Hybrid · Full-time'
        }
      },
      {
        href: '/careers/senior-infrastructure-analyst',
        values: {
          role: 'Senior Infrastructure Analyst',
          team: 'SRE · Porto Alegre / São Paulo',
          type: 'Hybrid · Full-time'
        }
      },
      {
        href: '/careers/software-engineer-frontend',
        values: {
          role: 'Software Engineer (Frontend)',
          team: 'UX Engineering · Porto Alegre',
          type: 'Hybrid · Full-time'
        }
      }
    ]"
    :primary-action="{ label: 'See all 23 roles', href: '/careers/jobs', trailing: true }"
  />
</template>
```
