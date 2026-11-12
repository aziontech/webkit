# Conversation History

> The list of past conversations with an assistant, in a side panel or drawer: titles grouped by when they were last active (Today, Yesterday, Previous 7 days, Previous 30 days, Older), the open one marked current, and an optional Delete per row. Choosing a row sets `v-model` to its id; the owner loads that conversation into `Conversation`.

- Import: `import ConversationHistory from '@aziontech/webkit/conversation-history'`
- Category: ai · Surface: product · Structure: monolithic
- API as JSON: [conversation-history.json](https://github.com/aziontech/webkit/blob/main/.specs/conversation-history.json)

## When to use

- An assistant keeps past conversations and the person returns to one.
- The left rail or a drawer of a chat page.

## Do

- Title each conversation from its first prompt, short; the full title shows on hover through `title`.
- Pass `now` from the server render (or a fixed reference) so the groups match on the server and the client.
- Confirm deletes of anything older than today with a `ConfirmDialog` in the `remove` handler.

## Don’t

- Messages of the open conversation → `Conversation`.
- Navigation between product areas → `SidebarNav` or `NavigationMenu`.
- A searchable table of records → `TableRoot`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [conversation](conversation.md) — shows the conversation the history selects.
- [drawer](drawer.md) — holds the history on narrow screens.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `{ id: string; title: string; updatedAt: string \ \| number \ \| Date }[]` | `[]` | false | Conversations, any order; they are sorted newest first inside their group. |
| `now` | `string \ \| number \ \| Date` | `undefined` | false | Reference time for the groups. Empty uses the current time; pass a fixed value when the list is rendered on the server. |
| `removable` | `boolean` | `false` | false | Shows a Delete button on each row that emits `remove`. |
| `loading` | `boolean` | `false` | false | Shows placeholder rows while the history loads. |
| `label` | `string` | `''` | false | Accessible name of the list. Empty uses the locale catalog (`Conversation history`). |
| `modelValue` | `string \| null` | `null` | false | Two-way value (`v-model`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `remove` | `string` |  |

## v-model

| Model     | Type       | Default | Emits  | Notes               |
| --------- | ---------- | ------- | ------ | ------------------- |
| `v-model` | `string \\ | null`   | `null` | `update:modelValue` | Id of the open conversation; its row is `aria-current="page"`. |

## States

- Groups render only when they have items; inside a group, newest first.
- Active row: `data-active` and `aria-current="page"`, the selected surface.
- Empty: one muted line, `No conversations yet.`
- Loading: `aria-busy="true"` and five skeleton rows; no group headings.

## Accessibility

- The root is a `nav` named by `label`; each group is a `ul` labelled by its visible heading (`aria-labelledby`).
- Each conversation is a `button` with its title as the name; the open one carries `aria-current="page"`.
- Delete is an `IconButton` named `Delete <title>`, shown on every row (not hover-only), so it is reachable by keyboard and touch.
- Keyboard: `Tab` moves through rows and their Delete; `Enter`/`Space` open a conversation.
- Loading sets `aria-busy` on the list.

## Right-to-left

- Layout: logical spacing; Delete sits at the inline end of the row.
- Icons: the trash glyph is not mirrored.
- Keyboard: none beyond `Tab`.
- User data: titles render in `<bdi>` with `dir="auto"`.

## Internationalization

| Key                              | English source          | Override prop |
| -------------------------------- | ----------------------- | ------------- |
| `conversationHistory.label`      | `Conversation history`  | `label`       |
| `conversationHistory.today`      | `Today`                 | —             |
| `conversationHistory.yesterday`  | `Yesterday`             | —             |
| `conversationHistory.previous7`  | `Previous 7 days`       | —             |
| `conversationHistory.previous30` | `Previous 30 days`      | —             |
| `conversationHistory.older`      | `Older`                 | —             |
| `conversationHistory.empty`      | `No conversations yet.` | —             |
| `conversationHistory.remove`     | `Delete {title}`        | —             |

- Groups use calendar days in the browser's time zone, not 24-hour windows.

## Responsive

- Container queries: none; it fills the width it is given.
- Narrow: titles truncate on one line with the full title in `title`.
- Touch: rows are 32 px tall with the Delete button's 40 px touch target.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import ConversationHistory from '@aziontech/webkit/conversation-history'
  import { ref } from 'vue'

  const now = '2026-11-11T15:00:00'
  const items = ref([
    { id: 'c1', title: 'Purge the cache after a deploy', updatedAt: '2026-11-11T14:20:00' },
    { id: 'c2', title: 'Why is my function returning 502?', updatedAt: '2026-11-11T09:05:00' },
    { id: 'c3', title: 'Set up a WAF rule for login attempts', updatedAt: '2026-11-10T18:40:00' },
    { id: 'c4', title: 'Image optimization query parameters', updatedAt: '2026-11-07T11:00:00' },
    {
      id: 'c5',
      title: 'Migrate DNS records from another provider',
      updatedAt: '2026-10-28T16:30:00'
    },
    { id: 'c6', title: 'Edge storage pricing', updatedAt: '2026-08-02T10:00:00' }
  ])
  const active = ref('c2')

  const remove = (id) => {
    items.value = items.value.filter((item) => item.id !== id)
    if (active.value === id) active.value = null
  }
</script>

<template>
  <div class="w-full max-w-(--container-3xs)">
    <ConversationHistory
      v-model="active"
      :items="items"
      :now="now"
      removable
      @remove="remove"
    />
  </div>
</template>
```

### States

```vue
<script setup>
  import ConversationHistory from '@aziontech/webkit/conversation-history'
</script>

<template>
  <div class="grid w-full gap-(--spacing-xl) sm:grid-cols-2">
    <ConversationHistory
      loading
      label="Conversation history, loading"
    />
    <ConversationHistory
      :items="[]"
      label="Conversation history, empty"
    />
  </div>
</template>
```
