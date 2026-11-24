# Conversation History

> The list of past conversations with an assistant, in a side panel on wide screens or a `Drawer` on phones: plain rows of titles grouped by when they were last active (Today, Yesterday, Previous 7 days, Previous 30 days, Older), the open one marked current, an optional Delete per row, and at the top an optional New chat row and a search field that filters the titles. With `projects` the panel organises chats like a chat sidebar: a Projects section (a collapsible header with an Organize menu that sorts the projects and an optional New project button, then one folder row per project that expands in place to show its chats) above a Recents section that holds the chats outside any project, still in their date groups. Choosing a row sets `v-model` to its id; the owner loads that conversation into `Conversation`.

- Import: `import ConversationHistory from '@aziontech/webkit/conversation-history'`
- Category: ai · Surface: app · Structure: monolithic
- API as JSON: [conversation-history.json](conversation-history.json)

## When to use

- An assistant keeps past conversations and the person returns to one.
- The left rail or a drawer of a chat page.

## Do

- Title each conversation from its first prompt, short; a title cut off by the panel width shows in full on hover through `title`.
- Put it in a side panel beside the conversation on wide screens and in a `Drawer` (`side="start"`) opened from a menu button on phones; close the drawer from `update:modelValue` and `create` so the chosen conversation shows at once (the Default example).
- Turn on `creatable` when the page has no other New chat control, and `searchable` once the list is long enough to scroll.
- Pass `projects` once people can file chats into projects; set `projectId` on each chat that belongs to one. Turn on `projectCreatable` and open the owner's own create-project dialog from `project-create`. Keep `v-model:openKeys`, `v-model:projectsOpen` and `v-model:projectSort` in the app's preferences when the panel should reopen the way the person left it.
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
| `items` | `{ id: string; title: string; updatedAt: string \| number \| Date; projectId?: string }[]` | `[]` | false | Conversations, any order; they are sorted newest first inside their group or project. A `projectId` that matches a project puts the chat under it instead of in Recents. |
| `projects` | `{ id: string; title: string }[]` | `[]` | false | Projects shown in a Projects section above Recents; empty keeps the plain date groups. |
| `now` | `string \| number \| Date` | `undefined` | false | Reference time for the groups. Empty uses the nearest `ConfigProvider`'s `now`, then the current time; set either when the list is rendered on the server. |
| `removable` | `boolean` | `false` | false | Shows a Delete button on each row that emits `remove`. |
| `creatable` | `boolean` | `false` | false | Shows a New chat row at the top that emits `create`. |
| `projectCreatable` | `boolean` | `false` | false | Shows a New project button in the Projects header that emits `project-create`; the section shows even with no projects yet. |
| `searchable` | `boolean` | `false` | false | Shows a search field at the top that hides conversations whose title does not contain the typed text. |
| `loading` | `boolean` | `false` | false | Shows placeholder rows while the history loads. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list. Empty uses the locale catalog (`Conversation history`). |
| `modelValue` | `string \| null` | `null` | false | Two-way value (`v-model`). |
| `openKeys` | `string[]` | `() => []` | false | Two-way value (`v-model:openKeys`). |
| `projectsOpen` | `boolean` | `true` | false | Two-way value (`v-model:projectsOpen`). |
| `projectSort` | `ConversationHistoryProjectSort` | `'recent'` | false | Two-way value (`v-model:projectSort`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `remove` | `(event: MouseEvent, id: string)` |  |
| `create` | `(event: MouseEvent)` |  |
| `project-create` | `(event: MouseEvent)` |  |

## v-model

| Model                  | Type                                                    | Default    | Emits                 | Notes                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------- | ---------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`              | `string \| null`                                        | `null`     | `update:modelValue`   | Id of the open conversation; its row is `aria-current="page"`, in a project or in Recents.                                                                            |
| `v-model:openKeys`     | `string[]`                                              | `[]`       | `update:openKeys`     | Ids of the expanded projects.                                                                                                                                         |
| `v-model:projectsOpen` | `boolean`                                               | `true`     | `update:projectsOpen` | Whether the Projects section is expanded (its header chevron).                                                                                                        |
| `v-model:projectSort`  | `'recent' \| 'name'` (`ConversationHistoryProjectSort`) | `'recent'` | `update:projectSort`  | Order of the projects, set from the Organize menu: by their newest conversation (projects without chats keep the given order, last), or by name in the active locale. |

## States

- Groups render only when they have items; inside a group, newest first.
- Projects (with `projects` or `projectCreatable`): a Projects header (`data-state="open|closed"`, chevron down when open, toward the inline end when closed), then one row per project with a folder glyph (`az-folder`, `az-folder-open` while expanded). An expanded project lists its chats indented under it, newest first, or one muted line `No chats in this project yet.`. A Recents label then heads the date groups of the chats outside any project; with no such chat it is not shown. A `projectId` that matches no project leaves the chat in Recents.
- Organize: an `IconButton` (`az-sliders-horizontal`) shown with two or more projects opens a `DropdownMenu` with a Sort by group of two radio items, Recent activity and Name; the checked one is `v-model:projectSort`.
- Search across projects: while the search field holds text, the Projects section and every project with a matching chat show expanded with only their matches, projects without a match are hidden, and Recents keeps only its matches; `v-model:openKeys` and `v-model:projectsOpen` are not changed, so clearing the search restores the previous layout.
- Rows: every row (New chat, the Projects header, project rows, chats in a project, chats in Recents and the date groups) is the menu row of `SidebarMenuItem`: 32 px tall (44 px on coarse pointers), the fill inset 1 px from the top and bottom edge (`border-y border-transparent bg-clip-padding`, `forced-colors:border-y-0`) so two filled rows keep a 2 px gap, and no gap between the rows of a list.
- Hover and keyboard focus: the row fills with the hover surface; the Projects header also turns its label to the default text colour.
- Active row: `data-active` and `aria-current="page"`, the selected surface.
- Cut-off title: a chat or project title too long for the row truncates on one line; when the pointer enters a row whose title is cut off, the row's `title` holds the full title, and a row whose title fits has no `title`.
- Empty: one muted line, `No conversations yet.`; the Projects section still shows above it when it has projects or `projectCreatable`.
- No match: while the search field holds text that no title contains, one muted line, `No conversations match “{query}”.`; New chat and the search field stay.
- Loading: `aria-busy="true"` and five skeleton rows; no group headings.

## Accessibility

- The root is a `nav` named by `ariaLabel`; each group is a `ul` labelled by its visible heading (`aria-labelledby`).
- Each conversation is a `button` with its title as the name; the open one carries `aria-current="page"`. A row's `title` is set only while its visible title is cut off, so it never repeats a name the row already shows.
- Delete is an `IconButton` named `Delete <title>` on every row. On touch it is always shown; with a fine pointer it fades in on hover, on keyboard focus inside the row and on the open row, and it is always in the tab order, so it is reachable by keyboard, pointer and touch.
- The Projects header is a `button` named `Projects` with `aria-expanded` and `aria-controls` on the project list, which is a `ul` labelled by it. Each project is a `button` named by its title with `aria-expanded` and `aria-controls`; its chats are a `ul` labelled by that button. Recents is a visible label; the date groups under it keep their own labelled lists.
- Organize is an `IconButton` named `Organize projects` that opens a `menu` (`DropdownMenu`: arrow keys move, `Enter`/`Space` check, `Esc` closes and returns focus); Sort by is a `group` of two `menuitemradio`s with `aria-checked`. New project is an `IconButton` named `New project`.
- New chat is a `button` named `New chat`, first in the list. The search field is an `Input` with `role="searchbox"` (and `enterkeyhint="search"`) named `Search conversations`; filtering announces nothing, the rows change in place.
- Keyboard: `Tab` moves through the section header, Organize, New project, project rows, rows and their Delete; `Enter`/`Space` open a conversation or expand and collapse a project or the Projects section.
- Focus after a delete: when the owner removes the item whose Delete was pressed and focus was lost with it (on `body`, or on the closed `ConfirmDialog`), focus moves to the conversation that took its place, else the last one, else the list itself (`tabindex="-1"`). Tests: `conversation-history.test.ts` › moves focus to the next row after a delete.
- Loading sets `aria-busy` on the list.

## Right-to-left

- Layout: logical spacing; Delete sits at the inline end of the row.
- Icons: the trash, pen, search, folder, plus and sliders glyphs are not mirrored; the collapsed section chevron (`az-chevron-right`) mirrors with the stylesheet, so it points to the inline end; project chats indent from the inline start.
- Keyboard: none beyond `Tab`.
- User data: conversation and project titles render in `<bdi>` with `dir="auto"`.

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

- Groups use calendar days in the browser's time zone, not 24-hour windows.
- Search compares titles case-insensitively with `toLocaleLowerCase` in the active locale.
- Sorting projects by name uses `localeCompare` in the active locale.

## Responsive

- Container queries: none; it fills the width it is given.
- Narrow: titles truncate on one line; a cut-off title shows in full in `title` on hover.
- Touch: every row is 44 px tall on coarse pointers (32 px with a fine pointer), the menu row of `SidebarMenuItem`; Delete sits at the row's inline end inside that 44 px band, keeps its 40 px touch target and is always shown. Organize and New project keep the `IconButton` touch target.
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
