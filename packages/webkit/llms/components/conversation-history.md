# Conversation History

> The chat list of an assistant, in a side panel or a `Drawer` on phones: rows grouped by last activity (Today, Yesterday, Previous 7 days, Previous 30 days, Older) or by status (Working, Settled), the open one current, pinned chats on top, an optional Projects section of folders that expand in place, and on top a New chat row, a search field or a toolbar whose Search button opens the app's palette. A row is a title or a rich row (tag, description, age, status); per-row actions (pin, rename, share, lock, move, archive, delete) sit on hover and in a `DropdownMenu`. Choosing a row sets `v-model` to its id.

- Import: `import ConversationHistory from '@aziontech/webkit/conversation-history'`
- Category: ai · Surface: app · Structure: monolithic
- API as JSON: [conversation-history.json](conversation-history.json)

## When to use

- An assistant keeps past conversations and the person returns to one.
- The left rail or a drawer of a chat page.

## Do

- Title each conversation from its first prompt, short.
- Put it beside the conversation on wide screens and in a start-side `Drawer` on phones; close the drawer from `update:modelValue` and `create`.
- Fix `now` on the app's `ConfigProvider` (or here) so groups and ages match on the server and the client.
- The component never changes `items`: apply each action event to the data (flip `pinned`, `archived`, `locked`, set `projectId`, the new `title`).
- Never delete on the first tap: open a `ConfirmDialog` from `remove` / `project-remove`, or remove at once and offer Undo.
- With `showToolbar`, open the app's `Command` palette from `search-open`; a mounted `Command` claims ⌘K, so the Search button does not bind it twice.

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
| `items` | `ConversationHistoryItem[]` | `[]` | false | Conversations, any order; sorted newest first in their group or project. |
| `projects` | `ConversationHistoryProject[]` | `[]` | false | Projects shown in a Projects section above Recents; empty keeps the plain groups. |
| `now` | `string \| number \| Date` | `undefined` | false | Reference time for groups and ages. Empty uses the nearest ConfigProvider now, then the current time. |
| `removable` | `boolean` | `false` | false | Lets each row be deleted (emits `remove`): a Delete button, or Delete in the row menu when `itemActions` is set. |
| `creatable` | `boolean` | `false` | false | Shows New chat (a row, or a toolbar button with `showToolbar`) that emits `create`. |
| `projectCreatable` | `boolean` | `false` | false | Shows New project (in the Projects header, or the toolbar) that emits `project-create`. |
| `searchable` | `boolean` | `false` | false | Shows a search field that hides conversations whose title does not contain the typed text. |
| `showToolbar` | `boolean` | `false` | false | Shows a top toolbar: a Search button that emits `search-open`, then New project and New chat as icon buttons. |
| `itemActions` | `('pin' \| 'rename' \| 'share' \| 'lock' \| 'move' \| 'archive')[]` | `[]` | false | Row actions: a Pin button and a More menu on each row; `move` needs `projects`. |
| `projectActions` | `('pin' \| 'settings' \| 'remove' \| 'chat-create')[]` | `[]` | false | Project row actions: a More menu (pin, settings, remove) and a New chat button (`chat-create`). |
| `groupBy` | `'date' \| 'status'` | `'date'` | false | Groups chats outside projects by last activity, or into Working (`status: 'running'`) and Settled (the rest and archived chats). |
| `showTime` | `boolean` | `false` | false | Shows each chat's age (`10m`, `15h`, `3d`) at the end of its row. |
| `loading` | `boolean` | `false` | false | Shows placeholder rows while the history loads. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list. Empty uses the locale catalog (`Conversation history`). |
| `modelValue` | `string \| null` | `null` | false | Two-way value (`v-model`). |
| `openKeys` | `string[]` | `() => []` | false | Two-way value (`v-model:openKeys`). |
| `projectsOpen` | `boolean` | `true` | false | Two-way value (`v-model:projectsOpen`). |
| `projectSort` | `ConversationHistoryProjectSort` | `'recent'` | false | Two-way value (`v-model:projectSort`). |
| `openSectionKeys` | `string[]` | `—` | false | Two-way value (`v-model:openSectionKeys`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `remove` | `(event: MouseEvent \| KeyboardEvent, id: string)` |  |
| `create` | `(event: MouseEvent)` |  |
| `project-create` | `(event: MouseEvent)` |  |
| `search-open` | `(event: MouseEvent \| KeyboardEvent)` |  |
| `item-pin` | `(event: MouseEvent \| KeyboardEvent, item: ConversationHistoryItem)` |  |
| `item-rename` | `(event: KeyboardEvent \| FocusEvent, payload: { item; title: string })` |  |
| `item-share` | `(event: MouseEvent \| KeyboardEvent, item: ConversationHistoryItem)` |  |
| `item-lock` | `(event: MouseEvent \| KeyboardEvent, item: ConversationHistoryItem)` |  |
| `item-move` | `(event: MouseEvent \| KeyboardEvent, payload: { item; project })` |  |
| `item-archive` | `(event: MouseEvent \| KeyboardEvent, item: ConversationHistoryItem)` |  |
| `project-pin` | `(event: MouseEvent \| KeyboardEvent, project: ConversationHistoryProject)` |  |
| `project-settings-open` | `(event: MouseEvent \| KeyboardEvent, project: ConversationHistoryProject)` |  |
| `project-remove` | `(event: MouseEvent \| KeyboardEvent, project: ConversationHistoryProject)` |  |
| `project-chat-create` | `(event: MouseEvent, project: ConversationHistoryProject)` |  |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `item` | { item: ConversationHistoryItem } | Replaces a chat row's tag, title and description; the row keeps its button and actions. |
| `item-meta` | { item: ConversationHistoryItem } | Replaces the end of a chat row (age, lock, status). |

## v-model

| Model                     | Type                                                    | Default                  | Emits                    | Notes                                                                                                |
| ------------------------- | ------------------------------------------------------- | ------------------------ | ------------------------ | ---------------------------------------------------------------------------------------------------- |
| `v-model`                 | `string \| null`                                        | `null`                   | `update:modelValue`      | Id of the open conversation; its row is `aria-current="page"`.                                       |
| `v-model:openKeys`        | `string[]`                                              | `[]`                     | `update:openKeys`        | Ids of the expanded projects.                                                                        |
| `v-model:projectsOpen`    | `boolean`                                               | `true`                   | `update:projectsOpen`    | Whether the Projects section is expanded.                                                            |
| `v-model:projectSort`     | `'recent' \| 'name'` (`ConversationHistoryProjectSort`) | `'recent'`               | `update:projectSort`     | Project order from the Organize menu: by newest chat (empty projects last) or by name; pinned first. |
| `v-model:openSectionKeys` | `string[]`                                              | `['recents', 'working']` | `update:openSectionKeys` | Expanded sections, of `recents`, `working`, `settled` (`ConversationHistorySection`).                |

## States

- Order from the top: toolbar, New chat row and search, Pinned, Projects, then Recents (by date) or Working and Settled (by status). A group renders only with items; inside a group, newest first. Pinned (`pinned`, not `archived`) leaves its project or group. By date, archived chats show nowhere.
- Sections: Projects, Recents (shown with Projects), Working and Settled are collapsible headers (`data-state="open|closed"`, chevron down when open, toward the inline end when closed); Working and Settled show their count. A collapsed section mounts no rows. Pinned and the date groups are labels.
- Projects: one folder row per project (`az-folder`, `az-folder-open` expanded) whose chats indent under it, or `No chats in this project yet.`; a `projectId` matching no project stays outside. Organize (two or more projects) opens a `DropdownMenu` with Sort by, Recent activity and Name.
- Search: matching projects and sections show expanded with only their matches; the models do not change.
- Rows: the `SidebarMenuItem` menu row, 32 px (44 px on coarse pointers), fill inset 1 px top and bottom (`border-y border-transparent bg-clip-padding`, `forced-colors:border-y-0`) for a 2 px gap between filled rows, no list gap. A row with a `description` is 56 px: title over the description (`text-body-xs`, muted, one line), `var(--spacing-xs)` block padding. Hover and focus fill the row; the active row is `data-active`, the selected surface.
- Row end: the age (`showTime`, narrow units in the active locale, `now` under a minute), a lock glyph (`locked`), a `Spinner` (running) or `az-circle-alert` in `var(--text-danger)` (error).
- Row actions: Pin and More (`itemActions`), or Delete alone (`removable` only), at the inline end; with a fine pointer they show on hover, focus inside the row, the active row and an open menu, on touch always. More opens Pin (P), Rename (R), Share, Lock, Move to project (a sub-menu of the other projects), Archive (A), then Delete in `var(--text-danger)`; labels flip to Unpin, Unlock, Unarchive. Letter hints are `DropdownMenu.Item` `command`s, mounted only while the menu is open.
- Project actions: New chat (`az-square-pen`) and More: Pin project, Project settings, then Delete project in danger.
- Rename: the row becomes an `Input` holding the title; Enter or blur saves a changed, non-empty title, Escape cancels; Enter and Escape return focus to the row.
- Cut-off title: the row's `title` holds the full title only while it is cut off.
- Empty: `No conversations yet.`; no match: `No conversations match “{query}”.`. Loading: `aria-busy` and five skeleton rows.

## Accessibility

- The root is a `nav` named by `ariaLabel`; each group is a `ul` labelled by its heading (`aria-labelledby`).
- A chat is a `button` named by its title (`aria-labelledby`), described by its description and end (`aria-describedby`: age, `Locked`, `Working`, `Failed`); the open one is `aria-current="page"`.
- Section headers and project rows are `button`s with `aria-expanded` and `aria-controls`; the list they open is labelled by them. A header with a count is named `Working 2`.
- Row actions are `IconButton`s named `Pin <title>` / `Unpin <title>`, `More actions for <title>`, `Delete <title>`, `New chat in <project>`; always in the tab order. More and Organize open a `menu` (arrow keys, `Enter`/`Space`, `ArrowRight` opens Move to project, `Esc` closes and returns focus). After Pin, Lock, Archive or Move to project, focus follows the chat to its new place (the row button, marked `data-key`); a chat that no longer shows hands focus to the nearest row, as Delete does.
- The toolbar Search is a `SearchTrigger` (`aria-keyshortcuts`); the search field is a `searchbox` named `Search conversations`; the rename field is named `Rename <title>`.
- Focus after a delete: when the removed row took focus with it, focus moves to the row in its place, else the last, else the list (`tabindex="-1"`).

## Right-to-left

- Layout: logical spacing; actions and the age sit at the inline end; project chats indent from the inline start.
- Icons: only the collapsed chevron (`az-chevron-right`) mirrors, with the stylesheet; the Move to project sub-menu opens toward the inline end.
- Keyboard: `ArrowLeft` opens the sub-menu under `rtl` (the `DropdownMenu` rule).
- User data: titles, descriptions and tags render in `<bdi>` with `dir="auto"`.

## Internationalization

| Key                                     | English source                      | Override prop |
| --------------------------------------- | ----------------------------------- | ------------- |
| `conversationHistory.label`             | `Conversation history`              | `ariaLabel`   |
| `conversationHistory.today`             | `Today`                             | —             |
| `conversationHistory.yesterday`         | `Yesterday`                         | —             |
| `conversationHistory.previous7`         | `Previous 7 days`                   | —             |
| `conversationHistory.previous30`        | `Previous 30 days`                  | —             |
| `conversationHistory.older`             | `Older`                             | —             |
| `conversationHistory.emptyTitle`        | `No conversations yet.`             | —             |
| `conversationHistory.delete`            | `Delete {title}`                    | —             |
| `conversationHistory.newChat`           | `New chat`                          | —             |
| `conversationHistory.search`            | `Search conversations`              | —             |
| `conversationHistory.noMatch`           | `No conversations match “{query}”.` | —             |
| `conversationHistory.projects`          | `Projects`                          | —             |
| `conversationHistory.recents`           | `Recents`                           | —             |
| `conversationHistory.newProject`        | `New project`                       | —             |
| `conversationHistory.organizeProjects`  | `Organize projects`                 | —             |
| `conversationHistory.sortBy`            | `Sort by`                           | —             |
| `conversationHistory.sortRecent`        | `Recent activity`                   | —             |
| `conversationHistory.sortName`          | `Name`                              | —             |
| `conversationHistory.projectEmptyTitle` | `No chats in this project yet.`     | —             |
| `conversationHistory.pinned`            | `Pinned`                            | —             |
| `conversationHistory.working`           | `Working`                           | —             |
| `conversationHistory.settled`           | `Settled`                           | —             |
| `conversationHistory.failed`            | `Failed`                            | —             |
| `conversationHistory.locked`            | `Locked`                            | —             |
| `conversationHistory.justNow`           | `now`                               | —             |
| `conversationHistory.searchChats`       | `Search chats`                      | —             |
| `conversationHistory.pin`               | `Pin`                               | —             |
| `conversationHistory.unpin`             | `Unpin`                             | —             |
| `conversationHistory.pinTitle`          | `Pin {title}`                       | —             |
| `conversationHistory.unpinTitle`        | `Unpin {title}`                     | —             |
| `conversationHistory.moreActions`       | `More actions for {title}`          | —             |
| `conversationHistory.rename`            | `Rename`                            | —             |
| `conversationHistory.renameTitle`       | `Rename {title}`                    | —             |
| `conversationHistory.share`             | `Share`                             | —             |
| `conversationHistory.lock`              | `Lock`                              | —             |
| `conversationHistory.unlock`            | `Unlock`                            | —             |
| `conversationHistory.moveToProject`     | `Move to project`                   | —             |
| `conversationHistory.archive`           | `Archive`                           | —             |
| `conversationHistory.unarchive`         | `Unarchive`                         | —             |
| `conversationHistory.remove`            | `Delete`                            | —             |
| `conversationHistory.pinProject`        | `Pin project`                       | —             |
| `conversationHistory.unpinProject`      | `Unpin project`                     | —             |
| `conversationHistory.projectSettings`   | `Project settings`                  | —             |
| `conversationHistory.removeProject`     | `Delete project`                    | —             |
| `conversationHistory.newChatIn`         | `New chat in {title}`               | —             |

- Groups use calendar days in the browser's time zone; ages use `Intl.NumberFormat` narrow units of the active locale (`10m`, `15h` in English, `10 min` in Portuguese), minutes to years.
- Search compares with `toLocaleLowerCase`, project names sort with `localeCompare`, both in the active locale.

## Responsive

- Container queries: none; it fills the width it is given.
- Narrow: titles and descriptions truncate on one line, with the full title in `title` on hover.
- Touch: rows are 44 px tall on coarse pointers (rich rows stay 56 px); row and project actions are always shown and keep their 40 px touch targets.
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

### Projects

```vue
<script setup>
  import ConversationHistory from '@aziontech/webkit/conversation-history'
  import { ref } from 'vue'

  const now = '2026-11-11T15:00:00'
  const projects = ref([
    { id: 'p1', title: 'storefront' },
    { id: 'p2', title: 'docs-site' },
    { id: 'p3', title: 'Security review' }
  ])
  const items = ref([
    {
      id: 'c1',
      title: 'Why does storefront return 502 errors?',
      updatedAt: '2026-11-11T14:20:00',
      projectId: 'p1'
    },
    {
      id: 'c2',
      title: 'Cache the product images at the edge',
      updatedAt: '2026-11-09T10:00:00',
      projectId: 'p1'
    },
    {
      id: 'c3',
      title: 'Redirect the old docs.example.com links',
      updatedAt: '2026-11-04T16:10:00',
      projectId: 'p2'
    },
    {
      id: 'c4',
      title: 'A WAF rule for login attempts',
      updatedAt: '2026-11-10T18:40:00',
      projectId: 'p3'
    },
    { id: 'c5', title: 'Purge the cache after a deploy', updatedAt: '2026-11-11T09:05:00' },
    { id: 'c6', title: 'Image optimization query parameters', updatedAt: '2026-11-07T11:00:00' },
    { id: 'c7', title: 'Move DNS records to Azion', updatedAt: '2026-10-28T16:30:00' }
  ])
  const active = ref('c1')
  const openKeys = ref(['p1'])
  const projectSort = ref('recent')

  const createProject = () => {
    const id = `p${projects.value.length + 1}`
    projects.value = [...projects.value, { id, title: `New project ${projects.value.length + 1}` }]
    openKeys.value = [...openKeys.value, id]
  }

  const startChat = () => {
    active.value = null
  }
</script>

<template>
  <aside
    class="flex h-96 w-full max-w-(--container-3xs) flex-col overflow-y-auto rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-xs)"
  >
    <ConversationHistory
      v-model="active"
      v-model:open-keys="openKeys"
      v-model:project-sort="projectSort"
      :items="items"
      :projects="projects"
      :now="now"
      creatable
      searchable
      project-creatable
      @create="startChat"
      @project-create="createProject"
    />
  </aside>
</template>
```
