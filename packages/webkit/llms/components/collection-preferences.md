# Collection Preferences

> The preferences panel of a collection, after Cloudscape's collection preferences: a cog button opens a dialog (or a drawer) with the page size, the columns (shown, hidden and ordered; a locked column always shows), wrapped lines, striped rows and density. Changes are a draft until Confirm; Cancel, `Esc` and the close button discard them. It holds no saved state itself: `useCollection` saves the confirmed value in `localStorage` and `preferencesProps` binds the value, the columns and the page sizes in one `v-bind`.

- Import: `import CollectionPreferences from '@aziontech/webkit/collection-preferences'`
- Category: data · Surface: product · Structure: monolithic
- API as JSON: [collection-preferences.json](https://github.com/aziontech/webkit/blob/main/.specs/collection-preferences.json)

## When to use

- A table or card collection whose people choose how many items a page shows and which fields they see.
- Any collection driven by `useCollection`, which saves the result per collection.

## Do

- Lock the column that names the item (`locked: true`): a row without its name is unreadable.
- Show only the sections the collection uses (`sections`): cards have no striped rows.
- Keep the trigger at the end of the controls row, after Refresh and Download.

## Don’t

- A single column-visibility toggle inside a table toolbar → use `table-column-selector`.
- Settings of the resource itself (not of how the list shows it) → use a form page or `dialog`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- use-collection` — saves the preferences; `preferencesProps` is the binding.
- [table](table.md) — takes `density`, `wrapLines`, `striped`, the visible columns and their order.
- [cards](cards.md) — takes the page size and the visible fields.
- [property-filter](property-filter.md) — sits beside it in the controls row.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `preferences` | `CollectionPreferencesValue` | `{}` | false | The saved preferences. Supports v-model:preferences; changes apply on Confirm. |
| `columns` | `CollectionPreferencesColumn[]` | `[]` | false | Columns to show, hide and order. Empty hides the columns section. |
| `pageSizeOptions` | `number[]` | `[]` | false | Page sizes offered. Empty hides the page size section. |
| `sections` | `CollectionPreferencesSection[]` | `['page-size', 'columns', 'wrap-lines', 'striped', 'density']` | false | Sections the panel shows, in this order. |
| `container` | `'dialog' \| 'drawer'` | `'dialog'` | false | Opens in a centered dialog or a side drawer. |
| `title` | `string` | `''` | false | Panel title and trigger label. Empty uses the locale catalog. |
| `disabled` | `boolean` | `false` | false | Disables the trigger. |
| `open` | `boolean` | `false` | false | Two-way value (`v-model:open`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:preferences` | `CollectionPreferencesValue` | Confirm was activated. |
| `confirm` | `CollectionPreferencesValue` | Same value, for a handler that is not a model. |
| `cancel` | `void` | Cancel was activated; the draft is discarded. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `trigger` | { open: () => void } | Replaces the cog button; call `open` to open the panel. |

## v-model

- **`v-model:open`** — `boolean`, default `false`. Whether the panel is open; the trigger, Confirm, Cancel, the close button and `Esc` update it.
- **`v-model:preferences`** — `CollectionPreferencesValue`. Emitted on Confirm with the sections shown.

## States

- Visual states: `closed`, `open`; the trigger reflects `disabled`
- `data-state` on the root: `open` | `closed`
- Move up is disabled on the first column, move down on the last; a locked column's switch is disabled and on

## Accessibility

- Visible focus: owned by the buttons, switches, radios and the toggle group.
- Keyboard map: `Enter`/`Space` on the trigger opens; `Tab` is trapped in the panel; `Esc` closes; focus returns to the trigger on close; after a move, focus stays on the moved column's button.
- ARIA: the trigger has `aria-haspopup="dialog"` and `aria-expanded`; the panel is a dialog named by its title; the page size and the columns are `fieldset`s with a `legend`; each move button is named `Move <column> up|down`; the density group is labelled by its heading.
- Columns reorder with buttons, never by drag only (WCAG 2.5.7).
- Contrast ≥4.5:1 from the semantic text tokens.

## Right-to-left

- Layout: logical utilities only (`ms-auto`, `text-start`); the drawer opens from its own side logic.
- Icons: the up and down arrows are vertical and not mirrored; the cog is not mirrored.
- Keyboard: no arrow-key navigation of its own.
- User data: column labels are plain text; none.

## Internationalization

| Key                                          | English source                               | Override prop |
| -------------------------------------------- | -------------------------------------------- | ------------- |
| `collectionPreferences.title`                | Preferences                                  | `title`       |
| `collectionPreferences.confirm` / `cancel`   | Confirm / Cancel                             | —             |
| `collectionPreferences.pageSize`             | Page size                                    | —             |
| `collectionPreferences.pageSizeOption`       | {count} item / {count} items (plural)        | —             |
| `collectionPreferences.columns`              | Columns                                      | —             |
| `collectionPreferences.columnsDescription`   | Choose which columns show, and their order.  | —             |
| `collectionPreferences.alwaysShown`          | Always shown                                 | —             |
| `collectionPreferences.moveUp` / `moveDown`  | Move {column} up / Move {column} down        | —             |
| `collectionPreferences.wrapLines` (+ `Description`) | Wrap lines / Show the whole text of every cell. | —     |
| `collectionPreferences.striped` (+ `Description`)   | Striped rows / Shade every other row.    | —             |
| `collectionPreferences.density`, `comfortable`, `compact` | Density, Comfortable, Compact       | —             |

- Formatting: page sizes go through the plural rules and number format of the active locale.

## Responsive

- Container queries: `@container/preferences` on the sections and `@container/preferences-actions` on the footer (`@md`: buttons side by side).
- Narrow (≤ 640 px or a narrow container): the dialog becomes a bottom sheet (from `dialog`), the footer buttons stack at full width.
- Touch: radios and column rows are 44 px high on `pointer: coarse`; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; long column labels truncate.

## Examples

### Default

```vue
<script setup>
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import { ref } from 'vue'

  const columns = [
    { id: 'name', label: 'Name', locked: true },
    { id: 'status', label: 'Status' },
    { id: 'region', label: 'Region' },
    { id: 'requests', label: 'Requests' }
  ]

  const preferences = ref({
    pageSize: 25,
    columns: [
      { id: 'name', visible: true },
      { id: 'status', visible: true },
      { id: 'region', visible: false },
      { id: 'requests', visible: true }
    ],
    wrapLines: false,
    striped: false,
    density: 'comfortable'
  })
</script>

<template>
  <CollectionPreferences
    v-model:preferences="preferences"
    :columns="columns"
    :page-size-options="[10, 25, 50, 100]"
  />
</template>
```

### InADrawer

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import { ref } from 'vue'

  const columns = [
    { id: 'name', label: 'Name', locked: true },
    { id: 'domain', label: 'Domain' },
    { id: 'status', label: 'Status' }
  ]

  const preferences = ref({ density: 'compact' })
</script>

<template>
  <CollectionPreferences
    v-model:preferences="preferences"
    :columns="columns"
    :sections="['columns', 'density']"
    container="drawer"
  >
    <template #trigger="{ open }">
      <Button
        label="Table settings"
        icon="pi pi-cog"
        kind="outlined"
        size="medium"
        @click="open"
      />
    </template>
  </CollectionPreferences>
</template>
```
