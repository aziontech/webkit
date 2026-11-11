# Doc Page Header

> The masthead of a documentation page: where the reader is (the breadcrumb), what the page is (the title), what they can do with it (a Copy Page control that hands the page to an AI tool — or, through the `actions` slot, the consumer's own menu; the trail is likewise slottable, for an application whose crumbs route rather than navigate), the deck that says what they will have by the end, and when the content last changed. It closes on a rule spanning the column, which is what gives every `h2` below it something to be subordinate to.

- Import: `import DocPageHeader from '@aziontech/webkit/doc-page-header'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-page-header.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-page-header.json)

## When to use

- At the top of any documentation or changelog page, above `DocProse`.

## Do

- Give every `metaActions` entry a `tip`: two or three words name a control, and only a sentence says what it does.
- Give an entry an `href` when it has a destination, so it is a real link — then prevent the default in `meta-action` if the app routes in-page.
- Let `lastUpdated` come from the page's own frontmatter. It is the author's claim that the content changed, not the file's mtime.
- Put the current page last in `breadcrumb`; it is marked as current for you.
- Use `title` and `details` for a page ABOUT something (a tool, a product): its mark and maker are a title, and its facts belong between the deck and the meta line.

## Don’t

- For an application screen's title — that is `PageHeading`, which carries console actions rather than a Copy Page control.
- For a section heading inside a page — the content's own `h2` does that, and the masthead's `h1` is chrome.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- DocProse` — the body below it. The masthead's `h1` is chrome, so authored content starts at `h2`.
- DocOnThisPage` — the rail beside the body, which lists those `h2`s.
- Button` / `Tooltip` / `Separator` — the meta line's entries: a quiet `text` button (an anchor when the entry has an `href`), the sentence its label has no room for, and the rule between two of them.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | The page title. |
| `description` | `string` | `''` | false | The deck under the title. |
| `breadcrumb` | `DocCrumb[]` | `[]` | false | Ancestor trail, current page last. |
| `lastUpdated` | `string` | `''` | false | When the page's content last changed. ISO date, or a ready-made string. |
| `metaActions` | `DocPageAction[]` | `[]` | false | The controls on the meta line, in reading order. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `meta-action` | `(event: MouseEvent, item: DocPageAction)` | Fired when a meta-line control is activated; `item` is the entry that was picked. Event first, per `event-payloads.md`. A link's default navigation is the consumer's to keep or to prevent. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `breadcrumb` | — | The trail; replaces the built-in `Breadcrumb` fed by the `breadcrumb` prop. |
| `title` | — | The page's name; replaces the built-in `h1`, for a title that is more than a string. |
| `actions` | — | A control on the title's line. Empty by default; the meta line carries the page's actions. |
| `details` | — | Rows between the deck and the meta line — a page's own facts, tags or references. |

## States

- Visual states: `default`. The masthead holds no interactive state of its own; each meta-line entry owns its own hover, focus and tooltip.
- Each region renders only when it has content: no breadcrumb, deck, or meta line appears empty. An unfilled slot with a `v-if`-ed fallback renders no element, so a masthead with no trail pays no gap for the region; an empty `metaActions` with no date renders no meta line at all.
- `data-undated` on the meta line when there is no date: the line then starts with a `text` button, whose label sits one spacing step inside its own box, so the row is pulled left by exactly that padding to keep the ink on the column.
- The rules between entries render from `md` up only. Below that the line wraps per entry, and a rule at the end of a wrapped line has nothing after it.
- Below `sm` a passed `actions` control leaves the title's line and stacks under it at its natural width; from `sm` up the two share one row.

## Accessibility

- Visible focus: inherited from `Breadcrumb`, `Button` and `Tooltip`; the masthead adds no focusable element of its own.
- Keyboard map: `Tab` reaches the breadcrumb links and then each meta-line entry in reading order; a `tip` opens on focus, not on hover alone, so a definition is never pointer-only. The separators are `aria-hidden` — three announced separators on the way to three controls is noise.
- ARIA: the root is a `header`. The title is the page's single `h1`, so authored content must start at `h2`. The "last updated" glyph is decorative (`aria-hidden`) because the words "Last updated" sit beside it, and the date is wrapped in `<time datetime>` so the machine-readable value survives formatting.
- The ISO date is parsed and rendered in **UTC** on purpose: read as local time, a bare `2026-06-30` becomes the 29th for every reader west of Greenwich.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- Touch target: each meta-line entry is a standard `small` button (28px) with its own hover surface; nothing else is interactive.

## Examples

### Default

```vue
<script setup>
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
</script>

<template>
  <DocPageHeader
    title="Deploy an application"
    description="Go from a template to a live edge application in a few clicks."
    :breadcrumb="[{ label: 'Docs', href: '/docs' }, { label: 'Deploy an application' }]"
    last-updated="2026-06-30"
    :meta-actions="[
      {
        value: 'copy',
        label: 'Copy as Markdown',
        icon: 'pi pi-copy',
        tip: 'Copy this page as Markdown, ready to paste into an assistant.'
      },
      {
        value: 'markdown',
        label: 'View as Markdown',
        icon: 'pi pi-eye',
        tip: 'Open this page as plain Markdown in a new tab.'
      },
      {
        value: 'agent-setup',
        label: 'Agent setup',
        icon: 'pi pi-microchip-ai',
        href: '/docs/agent-setup',
        tip: 'Set up your coding agent to build on Azion.'
      }
    ]"
  />
</template>
```

### Actions

```vue
<script setup>
  import DocPageHeader from '@aziontech/webkit/doc-page-header'

  const onMetaAction = (action) => action
</script>

<template>
  <DocPageHeader
    title="Deploy an application"
    description="Three entries, three shapes: a button that acts on the page, an in-app link, and a link that leaves the documentation."
    last-updated="2026-06-30"
    :meta-actions="[
      {
        value: 'copy',
        label: 'Copy as Markdown',
        icon: 'pi pi-copy',
        tip: 'Copy this page as Markdown, ready to paste into an assistant.'
      },
      {
        value: 'agent-setup',
        label: 'Agent setup',
        icon: 'pi pi-microchip-ai',
        href: '/docs/agent-setup',
        tip: 'Set up your coding agent to build on Azion.'
      },
      {
        value: 'source',
        label: 'Edit this page',
        icon: 'pi pi-pencil',
        href: 'https://github.com/aziontech/azion-docs',
        target: '_blank',
        tip: 'Open this page in the repository and propose a change.'
      }
    ]"
    @meta-action="onMetaAction"
  />
</template>
```

### Regions

```vue
<script setup>
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <DocPageHeader
      title="No breadcrumb"
      description="The trail is optional; the masthead closes up rather than leaving a gap."
      last-updated="2026-06-30"
    />
    <DocPageHeader
      title="No deck"
      :breadcrumb="[{ label: 'Docs', href: '/docs' }, { label: 'No deck' }]"
      last-updated="Updated this morning"
    />
    <DocPageHeader
      title="No date"
      description="Without a date the belt starts the line, and the line is pulled left by one step so the first label lands on the column the title and deck start on."
      :meta-actions="[
        {
          value: 'copy',
          label: 'Copy as Markdown',
          icon: 'pi pi-copy',
          tip: 'Copy this page as Markdown, ready to paste into an assistant.'
        },
        {
          value: 'markdown',
          label: 'View as Markdown',
          icon: 'pi pi-eye',
          tip: 'Open this page as plain Markdown in a new tab.'
        }
      ]"
    />
    <DocPageHeader
      title="Nothing to do with it"
      description="No date and no entries: the meta line renders no element at all."
    />
  </div>
</template>
```
