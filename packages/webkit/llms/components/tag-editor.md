# Tag Editor

> Key and value tags of one resource, after Cloudscape's tag editor, built on `AttributeEditor`. It adds what tags need on top of the rows: key and value suggestions while typing, a tag limit (50 by default) that ignores tags marked for removal, the built-in key checks (required when the row has a value, unique, length, allowed characters, no reserved `azion:` prefix), and a removal that only marks a saved tag, with Undo, until the form is saved.

- Import: `import TagEditor from '@aziontech/webkit/tag-editor'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [tag-editor.json](https://github.com/aziontech/webkit/blob/main/.specs/tag-editor.json)

## When to use

- The Tags section of a create or settings form of any resource.
- Labels used for cost allocation, ownership or search, where keys repeat across resources and suggestions help keep them consistent.

## Do

- Mark saved tags with `existing: true`: their key is read-only, and Remove marks them `markedForRemoval` (Undo puts them back) so the save request knows what to delete.
- Call the exposed `validate()` on Save; it also flags empty keys, which are not flagged while typing.
- Feed `keySuggestions` with the keys already used in the account so tags stay consistent.
- Pass server errors per row through `errors`; they replace the built-in message of that cell.
- Keep the default `limit` unless the backend has another one.

## Don’t

- Environment variables, headers or any pairs without tag rules → use `attribute-editor`.
- Showing tags read-only → use `tag` (or `key-value-pairs`).
- Picking from a fixed list of labels → use `multi-select`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [attribute-editor](attribute-editor.md) — the rows, Add, Remove, limit text, focus and announcements underneath.
- [input](input.md) — key and value controls; suggestions come from a native `datalist`.
- [tag](tag.md) — how the saved tags read outside the editor.
- platform/states/form-error` — the rule for server errors passed through `errors`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `tags` | `TagEditorTag[]` | `[]` | false | Tags being edited. Saved tags carry `existing`; Remove marks them `markedForRemoval` until Undo. Supports v-model:tags. |
| `keySuggestions` | `string[]` | `[]` | false | Keys offered while typing a key, for example the keys already used in the account. |
| `valueSuggestions` | `Record<string, string[]>` | `{}` | false | Values offered per key while typing a value. |
| `limit` | `number` | `50` | false | Most tags allowed; tags marked for removal do not count. |
| `keyMaxLength` | `number` | `128` | false | Longest key allowed, in characters. |
| `valueMaxLength` | `number` | `256` | false | Longest value allowed, in characters. |
| `reservedPrefix` | `string` | `'azion:'` | false | Prefix reserved for the platform; keys may not start with it. Empty allows every prefix. |
| `errors` | `TagEditorErrors` | `[]` | false | Server errors per row, aligned with `tags`; shown in place of the built-in checks. |
| `disabled` | `boolean` | `false` | false | Disables every control. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list of tags. Empty uses the locale catalog. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:tags` | `TagEditorTag[]` | A tag was added, edited, removed, marked for removal or restored. |

## States

- Visual states: `default`, `empty`, `at limit` (Add disabled), `invalid` (per cell), `marked for removal` (controls disabled, a muted note, Undo), `disabled`
- Saved tags (`existing`) render the key read-only.

## Accessibility

- Visible focus: every control keeps its own ring.
- Keyboard map: as `attribute-editor`; suggestions open with the browser's native `datalist` keys (ArrowDown, Enter, Escape).
- ARIA: rows, labels, errors and announcements come from `attribute-editor`; Undo is named "Undo removal of tag n"; a marked tag keeps a visible note ("This tag will be removed when you save.").
- Contrast ≥4.5:1 from the semantic text tokens.
- Touch target: Remove and Undo are 32 px buttons (`medium`).

## Right-to-left

- Layout: inherited from `attribute-editor` (logical utilities only).
- Icons: the trash glyph is not mirrored.
- Keyboard: no arrow-key handling of its own.
- User data: keys and values keep the direction of their own text.

## Internationalization

| Key                          | English source                                         | Override prop                    |
| ---------------------------- | ------------------------------------------------------ | -------------------------------- |
| `tagEditor.label`            | Tags                                                   | `ariaLabel`                      |
| `tagEditor.key` / `value`    | Key / Value                                            | —                                |
| `tagEditor.keyPlaceholder`   | Enter key                                              | —                                |
| `tagEditor.valuePlaceholder` | Enter value                                            | —                                |
| `tagEditor.add`              | Add new tag                                            | —                                |
| `tagEditor.remove`           | Remove tag                                             | —                                |
| `tagEditor.undo`             | Undo                                                   | —                                |
| `tagEditor.undoLabel`        | Undo removal of tag {index}                            | —                                |
| `tagEditor.markedForRemoval` | This tag will be removed when you save.                | —                                |
| `tagEditor.empty`            | No tags associated with the resource.                  | —                                |
| `tagEditor.remaining`        | You can add {count} more tag(s) (plural)               | —                                |
| `tagEditor.limitReached`     | You have reached the limit of {limit} tags.            | —                                |
| `tagEditor.keyRequired`      | Enter a key.                                           | —                                |
| `tagEditor.keyDuplicate`     | This key is already used by another tag.               | —                                |
| `tagEditor.keyReserved`      | Keys cannot start with "{prefix}".                     | `reservedPrefix`                 |
| `tagEditor.keyInvalid`       | Use letters, numbers, spaces and + - = . _ : / @ only. | —                                |
| `tagEditor.tooLong`          | Use {max} characters or fewer.                         | `keyMaxLength`, `valueMaxLength` |

- Formatting: the tags left go through the plural rules of the active locale. Allowed key characters include letters of every script (`\p{L}`).

## Responsive

- Container queries: inherited from `attribute-editor` (cells side by side from `@md`, stacked below).
- Narrow (≤ 640 px or a narrow container): stacked key and value with their own labels.
- Touch: nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import TagEditor from '@aziontech/webkit/tag-editor'
  import { ref } from 'vue'

  const tags = ref([
    { key: 'team', value: 'payments', existing: true },
    { key: 'cost-center', value: 'cc-1042', existing: true },
    { key: 'environment', value: 'staging' }
  ])

  const keySuggestions = ['team', 'cost-center', 'environment', 'owner', 'project']
  const valueSuggestions = { environment: ['production', 'staging', 'preview'] }
</script>

<template>
  <TagEditor
    v-model:tags="tags"
    :key-suggestions="keySuggestions"
    :value-suggestions="valueSuggestions"
    aria-label="Resource tags"
  />
</template>
```

### Validation

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import TagEditor from '@aziontech/webkit/tag-editor'
  import { ref } from 'vue'

  const tags = ref([
    { key: 'owner', value: 'platform-team', existing: true, markedForRemoval: true },
    { key: 'azion:managed', value: 'true' },
    { key: 'region', value: 'sa-east' },
    { key: 'region', value: 'us-east' }
  ])

  const editor = ref(null)
  const valid = ref(true)
  const save = () => {
    valid.value = editor.value?.validate() ?? false
  }
</script>

<template>
  <form
    class="flex flex-col gap-(--spacing-md)"
    novalidate
    @submit.prevent="save"
  >
    <TagEditor
      ref="editor"
      v-model:tags="tags"
      :limit="5"
      aria-label="Resource tags"
    />
    <div>
      <Button
        type="submit"
        label="Save tags"
        kind="primary"
        size="medium"
      />
    </div>
  </form>
</template>
```
