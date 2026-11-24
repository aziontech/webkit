# Conversation History

> The list of past conversations with an assistant, in a side panel on wide screens or a `Drawer` on phones: plain rows of titles grouped by when they were last active (Today, Yesterday, Previous 7 days, Previous 30 days, Older), the open one marked current, an optional Delete per row, and at the top an optional New chat row and a search field that filters the titles. Choosing a row sets `v-model` to its id; the owner loads that conversation into `Conversation`.

- Import: `import ConversationHistory from '@aziontech/webkit/conversation-history'`
- Category: ai · Surface: app · Structure: monolithic
- API as JSON: [conversation-history.json](conversation-history.json)

## When to use

- An assistant keeps past conversations and the person returns to one.
- The left rail or a drawer of a chat page.

## Do

- Title each conversation from its first prompt, short; the full title shows on hover through `title`.
- Put it in a side panel beside the conversation on wide screens and in a `Drawer` (`side="start"`) opened from a menu button on phones; close the drawer from `update:modelValue` and `create` so the chosen conversation shows at once (the Default example).
- Turn on `creatable` when the page has no other New chat control, and `searchable` once the list is long enough to scroll.
- Fix the reference time so the groups match on the server and the client: set `now` on the app's `ConfigProvider` once (every time-relative component below reads it), or pass `now` here to override it for this list.
- Never delete on the first tap: open a `ConfirmDialog` from the `remove` handler and remove the item from `@confirm` (the Default example), or remove it at once and offer Undo in a toast.

## Don’t

- Messages of the open conversation → `Conversation`.
- Navigation between product areas → `Sidebar` or `NavigationMenu`.
- A searchable table of records → `TableRoot`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [conversation](conversation.md) — shows the conversation the history selects.
- [drawer](drawer.md) — holds the history on narrow screens.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `{ id: string; title: string; updatedAt: string \| number \| Date }[]` | `[]` | false | Conversations, any order; they are sorted newest first inside their group. |
| `now` | `string \| number \| Date` | `undefined` | false | Reference time for the groups. Empty uses the nearest `ConfigProvider`'s `now`, then the current time; set either when the list is rendered on the server. |
| `removable` | `boolean` | `false` | false | Shows a Delete button on each row that emits `remove`. |
| `creatable` | `boolean` | `false` | false | Shows a New chat row at the top that emits `create`. |
| `searchable` | `boolean` | `false` | false | Shows a search field at the top that hides conversations whose title does not contain the typed text. |
| `loading` | `boolean` | `false` | false | Shows placeholder rows while the history loads. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list. Empty uses the locale catalog (`Conversation history`). |
| `modelValue` | `string \| null` | `null` | false | Two-way value (`v-model`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `remove` | `(event: MouseEvent, id: string)` |  |
| `create` | `(event: MouseEvent)` |  |

## v-model

| Model     | Type             | Default | Emits               | Notes                                                          |
| --------- | ---------------- | ------- | ------------------- | -------------------------------------------------------------- |
| `v-model` | `string \| null` | `null`  | `update:modelValue` | Id of the open conversation; its row is `aria-current="page"`. |

## States

- Groups render only when they have items; inside a group, newest first.
- Active row: `data-active` and `aria-current="page"`, the selected surface.
- Empty: a title, `No conversations yet.`, over one muted line that says chats appear here after the first question; compact enough for a sidebar.
- No match: while the search field holds text that no title contains, one muted line, `No conversations match “{query}”.`; New chat and the search field stay.
- Loading: `aria-busy="true"` and five skeleton rows; no group headings.

## Accessibility

- The root is a `nav` named by `ariaLabel`; each group is a `ul` labelled by its visible heading (`aria-labelledby`).
- Each conversation is a `button` with its title as the name; the open one carries `aria-current="page"`.
- Delete is an `IconButton` named `Delete <title>` on every row. On touch it is always shown; with a fine pointer it fades in on hover, on keyboard focus inside the row and on the open row, and it is always in the tab order, so it is reachable by keyboard, pointer and touch.
- New chat is a `button` named `New chat`, first in the list. The search field is an `Input` with `role="searchbox"` (and `enterkeyhint="search"`) named `Search conversations`; filtering announces nothing, the rows change in place.
- Keyboard: `Tab` moves through rows and their Delete; `Enter`/`Space` open a conversation.
- Focus after a delete: when the owner removes the item whose Delete was pressed and focus was lost with it (on `body`, or on the closed `ConfirmDialog`), focus moves to the conversation that took its place, else the last one, else the list itself (`tabindex="-1"`). Tests: `conversation-history.test.ts` › moves focus to the next row after a delete.
- Loading sets `aria-busy` on the list.

## Right-to-left

- Layout: logical spacing; Delete sits at the inline end of the row.
- Icons: the trash, pen and search glyphs are not mirrored.
- Keyboard: none beyond `Tab`.
- User data: titles render in `<bdi>` with `dir="auto"`.

## Internationalization

| Key                                    | English source                                                          | Override prop |
| -------------------------------------- | ----------------------------------------------------------------------- | ------------- |
| `conversationHistory.label`            | `Conversation history`                                                  | `ariaLabel`   |
| `conversationHistory.today`            | `Today`                                                                 | —             |
| `conversationHistory.yesterday`        | `Yesterday`                                                             | —             |
| `conversationHistory.previous7`        | `Previous 7 days`                                                       | —             |
| `conversationHistory.previous30`       | `Previous 30 days`                                                      | —             |
| `conversationHistory.older`            | `Older`                                                                 | —             |
| `conversationHistory.emptyTitle`       | `No conversations yet.`                                                 | —             |
| `conversationHistory.emptyDescription` | `Your chats with the assistant appear here after you ask it something.` | —             |
| `conversationHistory.delete`           | `Delete {title}`                                                        | —             |
| `conversationHistory.newChat`          | `New chat`                                                              | —             |
| `conversationHistory.search`           | `Search conversations`                                                  | —             |
| `conversationHistory.noMatch`          | `No conversations match “{query}”.`                                     | —             |

- Groups use calendar days in the browser's time zone, not 24-hour windows.
- Search compares titles case-insensitively with `toLocaleLowerCase` in the active locale.

## Responsive

- Container queries: none; it fills the width it is given.
- Narrow: titles truncate on one line with the full title in `title`.
- Touch: rows are 44 px tall on coarse pointers (36 px with a fine pointer), titles one step larger, so the row and its Delete button share one 44 px band; Delete keeps its 40 px touch target and is always shown.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import ConversationHistory from '@aziontech/webkit/conversation-history'
  import Drawer from '@aziontech/webkit/drawer'
  import IconButton from '@aziontech/webkit/icon-button'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

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
  const historyOpen = ref(false)
  const narrow = ref(false)

  let narrowQuery = null
  const onNarrowChange = () => {
    narrow.value = !!narrowQuery?.matches
  }
  onMounted(() => {
    narrowQuery = globalThis.matchMedia?.('(max-width: 767px)') ?? null
    onNarrowChange()
    narrowQuery?.addEventListener('change', onNarrowChange)
  })
  onBeforeUnmount(() => narrowQuery?.removeEventListener('change', onNarrowChange))

  watch(active, () => {
    historyOpen.value = false
  })

  const activeTitle = computed(
    () => items.value.find((item) => item.id === active.value)?.title ?? 'New chat'
  )

  const startChat = () => {
    active.value = null
    historyOpen.value = false
  }

  const pendingId = ref(null)
  const confirmOpen = ref(false)
  const pendingTitle = computed(
    () => items.value.find((item) => item.id === pendingId.value)?.title ?? ''
  )

  const remove = (event, id) => {
    pendingId.value = id
    confirmOpen.value = true
  }

  const confirmRemove = () => {
    const id = pendingId.value
    items.value = items.value.filter((item) => item.id !== id)
    if (active.value === id) active.value = null
    confirmOpen.value = false
  }
</script>

<template>
  <div
    class="flex h-96 w-full overflow-hidden rounded-(--shape-card) border border-(--border-default)"
  >
    <aside
      v-if="!narrow"
      class="flex w-(--container-3xs) shrink-0 flex-col overflow-y-auto border-e border-(--border-default) bg-(--bg-surface) p-(--spacing-xs)"
    >
      <ConversationHistory
        v-model="active"
        :items="items"
        :now="now"
        creatable
        searchable
        removable
        @create="startChat"
        @remove="remove"
      />
    </aside>
    <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xs) p-(--spacing-sm)">
      <div class="flex items-center gap-(--spacing-xs)">
        <IconButton
          v-if="narrow"
          icon="az az-menu"
          aria-label="Open conversation history"
          variant="ghost"
          @click="historyOpen = true"
        />
        <p class="m-0 truncate text-label-md text-(--text-default)">{{ activeTitle }}</p>
      </div>
    </div>
    <Drawer
      v-if="narrow"
      v-model:open="historyOpen"
      side="start"
      size="small"
    >
      <Drawer.Content>
        <Drawer.Header class="w-full">
          <Drawer.Title>Conversation history</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <ConversationHistory
            v-model="active"
            :items="items"
            :now="now"
            creatable
            searchable
            removable
            @create="startChat"
            @remove="remove"
          />
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
    <ConfirmDialog
      v-model:open="confirmOpen"
      title="Delete conversation"
      :description="`${pendingTitle} and its messages are deleted. This can't be undone.`"
      confirm-label="Delete conversation"
      size="small"
      @confirm="confirmRemove"
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
      aria-label="Conversation history, loading"
    />
    <ConversationHistory
      :items="[]"
      aria-label="Conversation history, empty"
    />
  </div>
</template>
```
