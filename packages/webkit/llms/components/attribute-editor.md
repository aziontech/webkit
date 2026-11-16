# Attribute Editor

> An editable list of rows with the same fields, after Cloudscape's attribute editor: key and value pairs (environment variables, headers, metadata) or any set of columns given by a `definition`. It owns the row anatomy every hand-built editor repeats: a label per cell, one control per cell, a per-cell error under the field, Add and Remove, an item limit, the empty text, focus after add and remove, and a polite announcement of each change. A grouped mode lays rows out as AND groups joined by OR, the shape of rule criteria. With `reorderable`, rows (and groups) carry a grip and Move up / Move down buttons, so the order itself is part of the value, as in rule criteria evaluated top to bottom. It edits an array and validates nothing itself: the consumer passes `errors`.

- Import: `import AttributeEditor from '@aziontech/webkit/attribute-editor'`
- Category: input · Surface: app · Structure: monolithic
- API as JSON: [attribute-editor.json](attribute-editor.json)

## When to use

- Use AttributeEditor for a short list of same-field rows the person adds and removes inside a form (environment variables, headers). For key/value tags on a resource use TagEditor; to edit many cells of many records in place, spreadsheet-style, use DataGrid; for read-and-act lists use Table.
- Users add, edit and remove a variable number of pairs or tuples: environment variables, request headers, query arguments, labels, metadata.
- Rule criteria: conditions inside a group must all match (and), groups are alternatives (or).
- A bulk form where each row has the same two to four fields and a row-level error can occur.
- An ordered list of rows where the order matters (criteria evaluated top to bottom, header precedence): turn on `reorderable`.

## Do

- Keep two to four columns; more columns belong in a drawer per row.
- Pass `errors` only after the first Save (rule of the form-validation block), then keep them live while the user fixes the rows.
- Use `minItems: 1` when the form needs at least one row, so the last row keeps its fields and loses its Remove.
- Set `limit` when the backend has one; the component says how many rows are left and disables Add at the limit.
- Replace a cell's control through `cell-<key>` (a `Select` for an operator, a `Switch` for secret) instead of drawing rows by hand; use `row` only when the row needs a layout of its own.
- Type the rows with your own interface (`ref<Header[]>`): `value` in `cell-<key>` and `item` in every slot then carry the field types, so a `Select` or `Switch` binds `value` without `as string` / `as boolean`.
- Name the editor (`ariaLabel`) after what the rows are: "Environment variables", "Request headers".
- Turn on `reorderable` only when the order changes behavior; an unordered list (environment variables) stays without grips.

## Don’t

- Key and value tags with limits, reserved prefixes and removal of saved tags → use `tag-editor`, which is built on this component.
- A fixed set of named settings on one resource → use `field` controls in a form.
- Many records the user browses, filters and acts on → use `data-table` with row actions.
- Many cells of many records edited in place, spreadsheet-style → use `data-grid`.
- An ordered list of actions whose argument fields change per type → compose it by hand as in the behaviors of the `edit/rule-builder` block.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tag-editor](tag-editor.md) — key and value tags with limits and validation, on top of AttributeEditor.
- [field](field.md) — every cell is a `Field` with its label, control and error.
- [input](input.md) — the default control of a cell; any control can replace it through `cell-<key>`.
- [button](button.md), `icon-button` — Add and Remove.
- [separator](separator.md) — the "or" between groups in grouped mode.
- `edit/rule-builder` (block) — its criteria are this component in grouped mode (AND rows inside a group, OR between groups), with a `Combobox` variable cell.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `definition` | `AttributeEditorColumn[]` | `[]` | false | Columns of every row: key of the item field, label, placeholder, required. |
| `errors` | `AttributeEditorErrors` | `[]` | false | Error per cell, aligned with the rows (nested per group in grouped mode). Empty shows none. |
| `addButtonLabel` | `string` | `''` | false | Label of the Add button. Empty uses the locale catalog. |
| `removeButtonLabel` | `string` | `''` | false | Accessible name of the Remove button, followed by the row number. Empty uses the locale catalog. |
| `addGroupLabel` | `string` | `''` | false | Label of the Add group button in grouped mode. Empty uses the locale catalog. |
| `emptyTitle` | `string` | `''` | false | Text shown when there are no rows. Empty uses the locale catalog. |
| `limit` | `number` | `undefined` | false | Most rows allowed (per group in grouped mode); Add is disabled at the limit and the rows left are announced. |
| `groupLimit` | `number` | `undefined` | false | Most groups allowed in grouped mode. |
| `minItems` | `number` | `0` | false | Fewest rows kept; rows at the minimum lose their Remove button. |
| `newItem` | `() => TItem` | `undefined` | false | Builds a new row. Unset creates an item with an empty string per column key. |
| `itemRemovable` | `(item: TItem) => boolean` | `undefined` | false | Hides Remove on the rows it returns false for. Unset makes every row removable. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size of the default controls and the Remove button, on the 28 / 32 / 40 rhythm. |
| `disabled` | `boolean` | `false` | false | Disables every control, Add and Remove. |
| `addDisabled` | `boolean` | `false` | false | Disables Add only, for example until the last row is filled in. |
| `reorderable` | `boolean` | `false` | false | Shows a grip and Move up / Move down on every row (and every group in grouped mode) when there is more than one; rows move by dragging the grip, with the buttons, with Arrow Up / Arrow Down on the grip or Alt+Arrow Up / Alt+Arrow Down anywhere in the row. The new order goes out through v-model. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list of rows. |
| `items` | `TItem[]` | `() => []` | false | Two-way value (`v-model:items`). |
| `groups` | `TItem[][] \| undefined` | `undefined` | false | Two-way value (`v-model:groups`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `add` | `(event: MouseEvent, detail: { index: number; groupIndex?: number })` | After a row is added; `groupIndex` only in grouped mode. |
| `remove` | `(event: MouseEvent \| KeyboardEvent, detail: { index: number; item: TItem; groupIndex?: number })` | After a row is removed. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `row` | { item, index, groupIndex, errors, update, remove, removable, removeLabel, move } | Replaces the whole row; the column header and the reorder controls are not drawn. `remove` takes the activating event (`@click="remove"`); `move(event, offset)` moves the row when `reorderable` is on. |
| `row-actions` | { item, index, groupIndex, remove, removable, removeLabel } | Replaces the Remove button at the end of a default row (for example Remove / Undo that marks a row instead of deleting it). `remove` takes the activating event. |
| `empty` | — | Replaces the empty text. |
| `actions` | — | Extra buttons after Add (for example Upload or Paste .env). |
| `info` | — | Extra help text under the buttons, after the limit text. |
| `limit` | { count, limit, left } | Replaces the limit text in list mode (for example "You can add 3 more tags."). |

## v-model

| Model            | Type                     | Default     | Emits           | Notes                                                                                                                                                                         |
| ---------------- | ------------------------ | ----------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:items`  | `TItem[]`                | `[]`        | `update:items`  | Rows in list mode, via `defineModel('items')`. A row added, removed, edited or moved goes out as the new array; unbound, the editor keeps its own rows.                       |
| `v-model:groups` | `TItem[][] \| undefined` | `undefined` | `update:groups` | Rows in grouped mode, via `defineModel('groups')`: every inner array is an AND group, groups are joined by OR. Setting it (even to `[]`) switches the editor to grouped mode. |

## States

- Visual states: `default`, `empty`, `at limit` (Add disabled), `invalid` (per cell), `disabled`
- `data-size` mirrors `size`; `data-disabled` mirrors `disabled`; `data-mode` is `list` or `grouped`
- Each row carries `data-row` with its index (and `data-group` in grouped mode)
- With `reorderable`: the row or group being dragged carries `data-dragging` (dimmed, dashed `var(--accent)` outline) and the one under the pointer carries `data-drop` (`before` or `after`, a 2 px `var(--accent)` line on that edge); Move up is disabled on the first row of a group and Move down on the last; every reorder control is disabled with `disabled`

## Accessibility

- Visible focus: every control and button keeps its own ring.
- Keyboard map: Tab moves through the cells of a row, its reorder controls, its Remove, then the next row; Add moves focus to the first control of the new row; Remove moves focus to the same position in the next row, else the previous row, else Add. With `reorderable`: Arrow Up / Arrow Down on a grip, or Alt+Arrow Up / Alt+Arrow Down on any control of a row, move the row one position inside its group (on a group's grip, the group); focus follows the moved row (the same control, or its grip when that control is now disabled). Drag and drop is a pointer shortcut only; every move is reachable by keyboard and by the buttons.
- ARIA: the rows are a `list` named by `ariaLabel`; each cell is a `Field` whose label is programmatically tied to its control (visually hidden on wide containers, where one header row shows the labels and is `aria-hidden`); an error is a `FieldError` referenced by `aria-describedby` and sets `aria-invalid`; each Remove is named "Remove item n" (or `removeButtonLabel` n); each grip is a button named "Reorder item n" ("Reorder group n") and described by the hint "Drag, or press Arrow Up or Arrow Down to move."; Move up / Move down are named "Move item n up" / "Move item n down" ("Move group n up" / "down"); groups are `group`s named "Group n"; a polite `status` region announces "Item n added", "Item n removed" and "Item n moved to position m." ("Group n moved to position m.").
- Contrast ≥4.5:1 from the semantic text tokens, including the disabled state.
- Touch target: Remove follows `size` (40 px at `large`); the stacked layout keeps it at the row's end.

## Right-to-left

- Layout: logical utilities only; the Remove column sits at the inline end.
- Icons: the trash, plus, grip and chevron glyphs are not mirrored (up and down do not flip).
- Keyboard: only Arrow Up / Arrow Down move rows (vertical, the same in both directions); no left or right handling.
- User data: values stay in their controls, which set no direction of their own.

## Internationalization

| Key                             | English source                                 | Override prop       |
| ------------------------------- | ---------------------------------------------- | ------------------- |
| `attributeEditor.add`           | Add new item                                   | `addButtonLabel`    |
| `attributeEditor.remove`        | Remove item                                    | `removeButtonLabel` |
| `attributeEditor.rowAction`     | {label} {index}                                | —                   |
| `attributeEditor.addGroup`      | Add OR group                                   | `addGroupLabel`     |
| `attributeEditor.emptyTitle`    | No items yet.                                  | `emptyTitle`        |
| `attributeEditor.remaining`     | You can add {count} more item(s) (plural)      | —                   |
| `attributeEditor.limitReached`  | You have reached the limit of {limit} items.   | —                   |
| `attributeEditor.added`         | Item {index} added.                            | —                   |
| `attributeEditor.removed`       | Item {index} removed.                          | —                   |
| `attributeEditor.group`         | Group {index}                                  | —                   |
| `attributeEditor.and` / `or`    | and / or                                       | —                   |
| `attributeEditor.reorder`       | Reorder item {index}                           | —                   |
| `attributeEditor.reorderHint`   | Drag, or press Arrow Up or Arrow Down to move. | —                   |
| `attributeEditor.moveUp`        | Move item {index} up                           | —                   |
| `attributeEditor.moveDown`      | Move item {index} down                         | —                   |
| `attributeEditor.moved`         | Item {from} moved to position {to}.            | —                   |
| `attributeEditor.reorderGroup`  | Reorder group {index}                          | —                   |
| `attributeEditor.moveGroupUp`   | Move group {index} up                          | —                   |
| `attributeEditor.moveGroupDown` | Move group {index} down                        | —                   |
| `attributeEditor.groupMoved`    | Group {from} moved to position {to}.           | —                   |

- Formatting: the rows left go through the plural rules of the active locale.

## Responsive

- Container queries: `@container/attribute-editor` on the root; at `@md` (472 px) the cells sit in one grid row under a shared header, below it every cell stacks with its own visible label and rows are divided by a line.
- Narrow (≤ 640 px or a narrow container): stacked cells, Remove at the end of the row.
- Touch: buttons follow `size`; nothing depends on hover (the Remove and Move tooltips repeat their accessible names). Dragging needs a pointer; on touch the Move up / Move down buttons reorder.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import { computed, ref } from 'vue'

  const definition = [
    { key: 'key', label: 'Key', placeholder: 'MY_VARIABLE', required: true },
    { key: 'value', label: 'Value', placeholder: 'my-value' }
  ]

  const items = ref([
    { key: 'API_BASE_URL', value: 'https://api.example.com' },
    { key: 'max uploads', value: '25' }
  ])

  const errors = computed(() =>
    items.value.map((item) => {
      if (!item.key.trim()) return { key: 'Key is required.' }
      if (!/^[A-Z0-9_]+$/.test(item.key))
        return { key: 'Use only uppercase letters, numbers, and underscores.' }
      return undefined
    })
  )
</script>

<template>
  <AttributeEditor
    v-model:items="items"
    :definition="definition"
    :errors="errors"
    :limit="10"
    :min-items="1"
    add-button-label="Add variable"
    remove-button-label="Remove variable"
    aria-label="Environment variables"
  />
</template>
```

### Groups

```vue
<script setup>
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Select from '@aziontech/webkit/select'
  import { ref } from 'vue'

  const definition = [
    { key: 'variable', label: 'Variable' },
    { key: 'operator', label: 'Operator' },
    { key: 'argument', label: 'Argument', placeholder: '/api/' }
  ]

  const operators = [
    { value: 'is-equal', label: 'is equal' },
    { value: 'starts-with', label: 'starts with' },
    { value: 'matches', label: 'matches' }
  ]

  const groups = ref([
    [
      { variable: '${uri}', operator: 'starts-with', argument: '/api/' },
      { variable: '${request_method}', operator: 'is-equal', argument: 'POST' }
    ],
    [{ variable: '${host}', operator: 'is-equal', argument: 'admin.example.com' }]
  ])

  const newItem = () => ({ variable: '${uri}', operator: 'is-equal', argument: '' })
</script>

<template>
  <AttributeEditor
    v-model:groups="groups"
    :definition="definition"
    :new-item="newItem"
    :limit="10"
    :group-limit="5"
    :min-items="1"
    add-button-label="Add condition"
    add-group-label="Add OR group"
    remove-button-label="Remove condition"
    aria-label="Criteria"
  >
    <template #cell-operator="{ value, update }">
      <Select
        :model-value="value"
        size="medium"
        @update:model-value="update"
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Item
            v-for="operator in operators"
            :key="operator.value"
            :value="operator.value"
            >{{ operator.label }}</Select.Item
          >
        </Select.Content>
      </Select>
    </template>
  </AttributeEditor>
</template>
```

### CustomCells

```vue
<script setup>
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  const definition = [
    { key: 'name', label: 'Header', placeholder: 'X-Request-Id' },
    { key: 'action', label: 'Action' },
    { key: 'enabled', label: 'Enabled' }
  ]

  const actions = [
    { value: 'set', label: 'Set' },
    { value: 'append', label: 'Append' },
    { value: 'remove', label: 'Remove' }
  ]

  const items = ref([
    { name: 'Cache-Control', action: 'set', enabled: true },
    { name: 'X-Frame-Options', action: 'set', enabled: false }
  ])

  const newItem = () => ({ name: '', action: 'set', enabled: true })
</script>

<template>
  <AttributeEditor
    v-model:items="items"
    :definition="definition"
    :new-item="newItem"
    add-button-label="Add header"
    remove-button-label="Remove header"
    aria-label="Response headers"
  >
    <template #cell-action="{ value, update }">
      <Select
        :model-value="value"
        size="medium"
        @update:model-value="update"
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Item
            v-for="action in actions"
            :key="action.value"
            :value="action.value"
            >{{ action.label }}</Select.Item
          >
        </Select.Content>
      </Select>
    </template>
    <template #cell-enabled="{ value, update }">
      <div class="flex h-8 items-center">
        <Switch
          :model-value="Boolean(value)"
          @update:model-value="update"
        />
      </div>
    </template>
  </AttributeEditor>
</template>
```
