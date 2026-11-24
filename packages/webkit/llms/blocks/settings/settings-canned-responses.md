# SettingsCannedResponses (`settings/settings-canned-responses`)

> The admin page for the saved replies support agents insert into a ticket (macros, canned responses, saved replies): a `PageHeader` with New response, a `PropertyFilter` that searches title and body and filters by folder and visibility, and a `DataTable` of responses (title with the first line of the reply, folder `Tag`, visibility Personal / Team / Everyone, last used with `TableCellTime`, usage count) with Edit, Duplicate and Delete in `TableCellActions`. A row opens a `Drawer` to edit: title, folder `Combobox` that takes a new folder, visibility `RadioGroup`, the reply in a `MarkdownEditor` with an Insert placeholder `DropdownMenu` that writes `{{ticket.requester.first_name}}` at the caret, and an optional ticket status `Select` applied when the reply is sent. Delete asks in a `ConfirmDialog`. The page owns loading, first-use empty, no match, a load error with Retry, saving and a save error that keeps the values. A page body for ConsoleLayout.

- Surface: app
- Source: `blocks/settings/settings-canned-responses/settings-canned-responses.vue` in `@aziontech/webkit`
- MCP: `get_block("settings/settings-canned-responses")`
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [Combobox](../../components/combobox.md), [ConfigProvider](../../components/config-provider.md), [ConfirmDialog](../../components/confirm-dialog.md), [DataTable](../../components/data-table.md), `DataTablePagination`, `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [MarkdownEditor](../../components/markdown-editor.md), [PageHeader](../../components/page-header.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [PropertyFilter](../../components/property-filter.md), [RadioGroup](../../components/radio-group.md), [Select](../../components/select.md), [Table](../../components/table.md), `TableCellActions`, `TableCellTime`, [Tag](../../components/tag.md), [Tooltip](../../components/tooltip.md), `use-collection`, `use-locale`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-form`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

canned responses; saved replies; macros; support macros; reply templates; response templates; email templates for agents; insert placeholder; template variables; respostas prontas; respostas salvas; macros de atendimento; modelos de resposta; respostas padrão

The admin page for the saved replies support agents insert into a ticket. Zendesk calls them macros, Freshdesk canned responses, Help Scout saved replies. An admin or an agent finds a response by its title or its text, files it in a folder, decides who can insert it, writes the reply in Markdown with placeholders the app fills in for each ticket (the requester's first name, the ticket number, the agent's signature), and can move the ticket to a status when the reply is sent. The list shows which replies the team actually uses. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- Reusable replies, macros or snippets that agents insert into a ticket, a chat or an email.
- Any library of text templates with folders, a visibility scope and placeholders, managed from a list and edited in a drawer.

## When not to use

- Replies the product sends on its own when a rule matches (auto-replies, triggers): start from `edit/edit-rule-builder`.
- One notification email with a fixed set of options: use `settings/settings-form`.
- Answering a ticket: the agent's reply box is `MarkdownEditor` in the ticket view; the ticket list is `view/view-ticket-inbox`.
- Deleting with a typed confirmation, for a response library shared by many teams: open `edit/edit-delete-dialog` instead of the plain confirmation.

## Building blocks

### A. Page heading — `ConfigProvider`, `PageHeader`, `Button` (required)

Title `Canned responses` and one sentence that says what they are. One action, the primary `New response` at `size="medium"`. A `ConfigProvider` around the page sets the sample clock (`now`) so Last used reads the same in every render; with real data it stays unset and the real clock applies.

### B. Search row — `PropertyFilter`, `Tooltip`, `IconButton` (required)

A `PropertyFilter` bound with `v-bind="propertyFilterProps"`: free text searches the title, the reply and the folder; the Folder and Visibility properties filter by value. Refresh is an outlined `IconButton` with a `Tooltip`; it spins while `loading` is set on a list that already has rows. The row is hidden on first use and when the load failed.

### C. Load failure — `Alert` (conditional)

When the list does not load, a danger `Alert` with the message and a Retry action (`action-label`) takes the place of the search row and the table; the heading and New response stay.

### D. First use — `Card`, `EmptyState` (conditional)

An account with no response yet sees a flush `Card` with an `EmptyState`: what canned responses are, why they save time, and `New response`. No search row: there is nothing to search.

### E. Response table — `DataTable`, `DataTablePagination`, `Tag`, `TableCellTime`, `useCollection`, `useLocale` (required)

One `useCollection` over the responses, `DataTable` bound with `v-bind="tableProps"` inside a flush `Card`, sorted by Uses (most used first) and paged by `DataTablePagination`. Columns: Title (the title, then the line of the reply after the greeting as plain text, muted), Folder (a neutral small `Tag`; `No folder` when empty), Visibility (an icon and Personal, Team or Everyone), Last used (`TableCellTime`, relative with the exact time on its tooltip; `Never used`), Uses (end-aligned, formatted with `formatNumber` from `useLocale`), and the row menu. Below the `sm` width the Folder tag, the visibility and the count move under the title. A row click or Enter on a focused row opens Edit.

### F. Row actions — `TableCellActions`, `DropdownMenu` (required)

`TableCellActions` named after the response: Edit and Duplicate, then Delete in its own group. Duplicate emits `duplicate` right away; the server makes the copy (named `Copy of <title>`, so the unique-title rule holds) and the page refreshes the list. Delete, from the menu or the Delete key on a focused row, opens the confirmation.

### G. No match — `EmptyState`, `Button` (required)

The table's `#empty` slot: `No matching responses` with Clear filters, which empties the search and the filter tokens.

### H. Editor drawer — `Drawer`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `PanelBody`, `PanelFooter` (required)

A large `Drawer` on the end side with one `form`, titled `New response` or `Edit response`. A failed save shows a danger `Alert` at the top of the body and keeps every value. While `saving` the fields lock (one `fieldset`), Cancel is disabled and Save response spins; when `saving` returns to false with no `saveError`, the drawer closes. Footer: Cancel and `Save response`.

### I. Fields — `Field`, `Input`, `Combobox`, `RadioGroup`, `Select` (required)

- Title, required and unique in the list (case-insensitive); the error sits under the field and takes focus.
- Folder, a `Combobox` of the existing folders that accepts a typed name as a new folder (`allowCustom`, on by default); empty means no folder.
- Visibility, a `RadioGroup` in a `Field.Set` with a legend: Personal (only you), Team (your team), Everyone (every agent of the account), each with a one-line description.
- Also set the ticket status to, a `Select` of `Don't change the status` and the ticket statuses New, Open, Pending, On hold and Solved; applied when the agent sends the reply.

### J. Reply and placeholders — `MarkdownEditor`, `DropdownMenu`, `Button` (required)

The reply is a `MarkdownEditor` (toolbar, Write and Preview, Markdown value), required. Its `footer` slot holds an outlined `Insert placeholder` button that opens a `DropdownMenu` grouped by Ticket, Requester, Agent and Account; each item shows the label and the token in code type. Picking one writes `{{path}}` at the caret of the reply, or where the selection was, and focus returns to the field after the token. The block reads the caret through the field's `id` when the menu opens, splices the token into the `v-model` value and moves the caret back; with Preview open, `focus()` switches to Write and the token goes at the end. The `@` mention menu is not used here: it inserts `@handle`, not a placeholder.

### K. Delete confirmation — `ConfirmDialog` (required)

A danger `ConfirmDialog` that names the response and says what changes: agents can no longer insert it, replies already sent keep their text, it cannot be undone. Confirm removes the row and emits `remove`; the page that runs the request ends with a toast.

## Data

The block takes its responses through props and emits every action; it fetches nothing and saves nothing. `CannedResponsesResponse`, `CannedResponsesPlaceholder`, `CannedResponsesValues`, `CannedResponsesVisibility`, `CannedResponsesTicketStatus` and `CannedResponsesProps` are exported from `settings-canned-responses.vue`, and `sample.ts` holds the six sample responses, the placeholders and the clock the block renders when `responses`, `placeholders` and `now` are left out (the responses never while `loading` or `error` is set).

| Prop           | Type                           | What it does                                                                                                 |
| -------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `responses`    | `CannedResponsesResponse[]`    | The rows; search, filters, sort and pages run on them in the browser. Pass `[]` for an account with none.    |
| `placeholders` | `CannedResponsesPlaceholder[]` | What Insert placeholder offers: `{ value, label, group }`, `value` being the path between the double braces. |
| `loading`      | `boolean`                      | A request is in flight. With no rows it is the first load; with rows Refresh spins.                          |
| `error`        | `string`                       | Why the load failed, shown in the danger `Alert` with Retry.                                                 |
| `saving`       | `boolean`                      | The save request is in flight; the drawer locks. Back to false with no `saveError`, the drawer closes.       |
| `saveError`    | `string`                       | Why the save failed, shown at the top of the drawer; the values stay.                                        |
| `now`          | `Date`                         | The moment Last used counts from.                                                                            |
| `defaultQuery` | `PropertyFilterQuery`          | Filter tokens applied on mount, for a link that opens the list filtered by a folder.                         |
| `editorOpen`   | `boolean`                      | `v-model:editorOpen`: whether the drawer is open.                                                            |
| `editingKey`   | `string \| null`               | `v-model:editingKey`: the id of the response the drawer edits; `null` for a new one.                         |

| Event       | Payload                                                          | When                                                      |
| ----------- | ---------------------------------------------------------------- | --------------------------------------------------------- |
| `create`    | `(event, { title, folder, visibility, body, status })`           | A new response passed validation and was saved.           |
| `update`    | `(event, response, { title, folder, visibility, body, status })` | An edited response passed validation and was saved.       |
| `duplicate` | `(event, response)`                                              | Duplicate in the row menu.                                |
| `remove`    | `(event, response)`                                              | The delete dialog was confirmed; the row is already gone. |
| `refresh`   | `(event)`                                                        | Refresh.                                                  |
| `retry`     | `(event)`                                                        | Retry in the error alert.                                 |

A folder typed in the Combobox that is not in the list arrives as `values.folder`; the server creates it. To go live, render the block from a page that owns the requests:

```vue
<script setup lang="ts">
  import { toast } from '@aziontech/webkit/toast'
  import { ref } from 'vue'
  import SettingsCannedResponses, {
    type CannedResponsesResponse,
    type CannedResponsesValues
  } from './settings-canned-responses.vue'

  const { data, pending, error, refresh } = useCannedResponses()
  const saving = ref(false)
  const saveError = ref('')
  const loadError = 'The canned responses could not be loaded. Nothing was changed; try again.'
  const updateError =
    "The response wasn't saved. Agents still insert the previous version; save again to apply your changes."
  const createError = "The response wasn't saved. Save again to create it."

  const save = async (request: Promise<unknown>, title: string, failure: string) => {
    saving.value = true
    saveError.value = ''
    try {
      await request
      toast.success(`Response “${title}” saved.`)
      refresh()
    } catch {
      saveError.value = failure
    }
    saving.value = false
  }

  const duplicate = async (_event: Event, response: CannedResponsesResponse) => {
    await duplicateResponse(response.id)
    toast.success(`Copy of “${response.title}” created.`)
    refresh()
  }

  const remove = async (_event: Event, response: CannedResponsesResponse) => {
    try {
      await deleteResponse(response.id)
      toast.success(`Response “${response.title}” deleted.`)
    } catch {
      toast.error(`“${response.title}” wasn't deleted. It is back in the list.`)
    }
    refresh()
  }
</script>

<template>
  <SettingsCannedResponses
    :responses="data ?? []"
    :placeholders="ticketPlaceholders"
    :loading="pending"
    :error="error ? loadError : ''"
    :saving="saving"
    :save-error="saveError"
    :now="new Date()"
    @create="
      (_event, values: CannedResponsesValues) =>
        save(createResponse(values), values.title, createError)
    "
    @update="
      (_event, response: CannedResponsesResponse, values) =>
        save(updateResponse(response.id, values), values.title, updateError)
    "
    @duplicate="duplicate"
    @remove="remove"
    @refresh="refresh"
    @retry="refresh"
  />
</template>
```

Delete removes the row at once; when the request fails, the page says so in a toast and refreshes, and the fresh `responses` array brings the row back. Then delete `sample.ts` and its import.

## Do

- Name a response after the question it answers (`Ask for the request ID`), so an agent finds it by searching.
- Offer the placeholders from a menu that shows what each one stands for; few writers remember the paths.
- Show how often each response is used, so the team can retire the ones nobody sends.
- Keep the typed values when a save fails, and say the previous version still applies.

## Don't

- Don't use the `@` mention menu for placeholders; it inserts a handle, not a placeholder.
- Don't let two responses share a title; agents pick by title.
- Don't make Everyone the default visibility; a new response starts Personal.
- Don't close the drawer before the save succeeds.

## Copy

- **Title:** `Canned responses`; description `Saved replies agents insert into a ticket, with the requester's details filled in.`
- **Actions:** `New response`, `Edit`, `Duplicate`, `Delete`, `Save response`, `Cancel`, `Insert placeholder`, `Retry`, `Clear filters`. Verb first, sentence case.
- **Drawer:** titles `New response`, `Edit response`; one sentence under the title that says where the response is used: `Agents insert it from the reply box of a ticket. Placeholders are filled in for each ticket.`
- **Fields:** `Title`, `Folder`, `Visibility`, `Reply`, `Also set the ticket status to`. Each description says how to fill the field, in one sentence: Title `Agents search for it by title, so name what the reply answers.`; Folder `Pick a folder or type a new name to create one. Leave it empty for no folder.`; Reply `Markdown. A placeholder such as the requester's name is written in double braces.`; status `Applied when the agent sends the reply.`; each visibility option says who can insert it (below). Errors say what to do: `Enter a title.`, `A response with this title already exists. Use another title.`, `Write the reply agents insert.`
- **Visibility:** `Personal` (Only you can insert it.), `Team` (Everyone in your team can insert it.), `Everyone` (Every agent of the account can insert it.).
- **Table:** `No folder`, `Never used`. The Uses column is the number formatted for the locale (`1,200`); the narrow summary picks the plural form with `plural` from `useLocale` (`1 use`, `12 uses`), never a word glued to a number.
- **First use:** `No canned responses yet`, then what they are and what they save. **No match:** `No matching responses`, `No canned response matches this search or these filters.`
- **Errors:** load `The canned responses could not be loaded. Nothing was changed; try again.`; save after an edit `The response wasn't saved. Agents still insert the previous version; save again to apply your changes.`; save of a new response `The response wasn't saved. Save again to create it.`
- **Delete:** title `Delete response`; description `Agents can no longer insert “<title>”. Replies already sent keep their text. You cannot undo this.`; button `Delete response`.
- **Toasts (sent by the page):** `Response “<title>” saved.` after a create or an update, `Copy of “<title>” created.` after Duplicate, `Response “<title>” deleted.` after Delete, and `“<title>” wasn't deleted. It is back in the list.` when a delete fails.
- **Placeholders:** the label says what is filled in (`Requester first name`); the token is code (`{{ticket.requester.first_name}}`) and is never translated.
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- No `main` of its own (the layout's is the only one); the `PageHeader` title is the only `h1`, and the drawer title names the drawer.
- Focus order: New response, the search, Refresh, the table rows (one tab stop: Arrow Up and Down move, Home and End jump, Enter opens Edit, Delete asks to delete), the row menus, the pagination.
- The search and Refresh carry an `aria-label`; each row menu is named `Actions for <title>`.
- The drawer traps focus, opens on its first field and returns focus to the control that opened it. After Save, the first invalid field takes focus and its `Field.Error` is announced (`role="alert"`). A save error is a danger `Alert` at the top of the body.
- Insert placeholder is a menu button; after a pick, focus returns to the reply field with the caret after the token. Each token renders `dir="ltr"` inside a `bdi`, so it reads in order in a right-to-left page.
- The delete dialog names the response; after it closes the focused row's place goes to the next row, as `DataTable` does. The page's toast announces the outcome of save, duplicate and delete; the block itself announces nothing else.
- User data reads in its own direction: the title, the reply excerpt and the folder render with `dir="auto"`, the Title field and the reply field set it too, and the delete dialog wraps the title in Unicode isolates (U+2068, U+2069) because its sentence is a string. Placeholder tokens are `dir="ltr"` in a `bdi`.
- Layout uses logical sides only; at 320 px the controls row wraps, the table keeps Title and the menu with the other values under the title, and the drawer takes the full width.

## States

- Default: six responses in four folders and three visibilities, sorted by use, with search, filters, row menus, the editor drawer, placeholders and delete wired.
- Empty: first use (`responses` is `[]`); the explanation and New response replace the search and the table.
- Loading: the first load (`loading` with no `responses`); the search row and the table's loading rows.
- Error: the list did not load (`error` is set); a danger Alert with Retry replaces the table.
- NoMatch: filters that match nothing (`defaultQuery` with folder Billing and visibility Personal); No matching responses with Clear filters.
- Editing: the drawer open on one response (`editorOpen` with `editingKey`).
- Saving: the drawer locked while the save runs (`saving`).
- SaveError: the save failed (`saveError` is set); the alert at the top of the drawer, values kept.

## Related

- `view/view-ticket-inbox` — the ticket list; its statuses are the ones a response can set.
- `account/account-personal-tokens` — the same list, drawer and confirmation pattern.
- `settings/settings-form` — the other settings pages and their save states.
- `edit/edit-delete-dialog` — the typed confirmation for a library many teams share.

## Variants

- `Default` — primary (the code below)
- `Empty` — First use: no response yet. A flush card explains what canned responses are and offers New response in place of the search and the table.
- `Loading` — The first load: the search row and the table's loading rows, before the empty state can be decided.
- `Error` — The list could not load: a danger Alert with Retry replaces the search and the table.
- `NoMatch` — Filters that match nothing (folder Billing and visibility Personal): the table shows No matching responses with Clear filters.
- `Editing` — The edit drawer open on Ask for the request ID: title, folder, visibility, the reply with Insert placeholder, and the status it sets.
- `Saving` — Save response in flight: the drawer's fields lock and the submit button spins; the drawer closes when the save ends without an error.
- `SaveError` — The save failed: a danger Alert at the top of the drawer says the previous version still applies, and every value stays as typed.

Each variant is the same screen in another state: `get_block("settings/settings-canned-responses", { variant })`, or the file under `blocks/settings/settings-canned-responses/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import { type TableColumn } from '@aziontech/webkit/table'
  import Tooltip from '@aziontech/webkit/tooltip'
  import {
    type FilteringProperty,
    type PropertyFilterQuery,
    useCollection
  } from '@aziontech/webkit/use-collection'
  import { computed, ref, watch } from 'vue'

  import ResponseDrawer from './parts/response-drawer.vue'
  import ResponsesTable, { type CannedResponsesAction } from './parts/responses-table.vue'
  import { sampleNow, samplePlaceholders, sampleResponses } from './sample'

  /** Who can insert a response: its author, the author's team, or every agent of the account. */
  export type CannedResponsesVisibility = 'personal' | 'team' | 'everyone'

  /** A ticket status a response can set when an agent sends it. */
  export type CannedResponsesTicketStatus = 'New' | 'Open' | 'Pending' | 'On hold' | 'Solved'

  /** One saved reply. */
  export interface CannedResponsesResponse {
    /** Stable key. */
    id: string
    /** Name agents search for; unique in the list. */
    title: string
    /** Folder it is filed under; empty when it has none. */
    folder: string
    /** Who can insert it. */
    visibility: CannedResponsesVisibility
    /** The reply in Markdown, with placeholders written in double braces. */
    body: string
    /** The status the ticket moves to when the reply is sent; null leaves it as it is. */
    status: CannedResponsesTicketStatus | null
    /** When an agent last inserted it, or null when it was never used. */
    lastUsedAt: Date | null
    /** How many times agents inserted it. */
    usageCount: number
  }

  /** A value the app fills in when an agent inserts the response. */
  export interface CannedResponsesPlaceholder {
    /** The path written between double braces, such as ticket.requester.name. */
    value: string
    /** What it stands for, shown in the Insert placeholder menu. */
    label: string
    /** Menu group it is listed under, such as Ticket or Requester. */
    group: string
  }

  /** What Save response sends. */
  export interface CannedResponsesValues {
    /** Trimmed title. */
    title: string
    /** Trimmed folder, an existing one or a new one; empty for none. */
    folder: string
    /** Who can insert it. */
    visibility: CannedResponsesVisibility
    /** The Markdown body. */
    body: string
    /** The status to set when the reply is sent, or null to leave it. */
    status: CannedResponsesTicketStatus | null
  }

  export interface CannedResponsesProps {
    /** The responses to list; filtered, sorted and paged in the browser. Left out, the sample renders. */
    responses?: CannedResponsesResponse[]
    /** The placeholders the editor offers. Left out, the sample placeholders render. */
    placeholders?: CannedResponsesPlaceholder[]
    /** A request is in flight: with no responses it is the first load, with responses a refresh. */
    loading?: boolean
    /** Why the responses could not load; a danger alert with Retry replaces the table. */
    error?: string
    /** The save request is in flight; the drawer's fields lock and Save response spins. */
    saving?: boolean
    /** Why the last save failed; a danger alert at the top of the drawer, the values kept. */
    saveError?: string
    /** The moment Last used counts from. Left out, the real clock; the sample uses its own. */
    now?: Date
    /** Filter tokens applied on mount, for a link that opens the list already filtered. */
    defaultQuery?: PropertyFilterQuery
  }

  const props = withDefaults(defineProps<CannedResponsesProps>(), {
    responses: undefined,
    placeholders: undefined,
    loading: false,
    error: '',
    saving: false,
    saveError: '',
    now: undefined,
    defaultQuery: undefined
  })

  const emit = defineEmits<{
    create: [event: Event, values: CannedResponsesValues]
    update: [event: Event, response: CannedResponsesResponse, values: CannedResponsesValues]
    duplicate: [event: MouseEvent | KeyboardEvent, response: CannedResponsesResponse]
    remove: [event: MouseEvent, response: CannedResponsesResponse]
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
  }>()

  const editorOpen = defineModel<boolean>('editorOpen', { default: false })
  const editingKey = defineModel<string | null>('editingKey', { default: null })

  const source = computed<CannedResponsesResponse[]>(
    () => props.responses ?? (props.loading || props.error ? [] : sampleResponses)
  )
  const placeholderList = computed(() => props.placeholders ?? samplePlaceholders)
  const clock = computed(
    () => props.now ?? (props.responses || props.loading || props.error ? undefined : sampleNow)
  )

  const items = ref<CannedResponsesResponse[]>([])
  watch(
    source,
    (next) => {
      items.value = [...next]
    },
    { immediate: true }
  )

  const folders = computed(() =>
    [...new Set(items.value.map((item) => item.folder).filter(Boolean))].sort()
  )

  const visibilityLabels: Record<CannedResponsesVisibility, string> = {
    personal: 'Personal',
    team: 'Team',
    everyone: 'Everyone'
  }

  const columns: TableColumn[] = [
    { accessorKey: 'title', header: 'Title', sortable: true, principal: true, hideable: false },
    { accessorKey: 'folder', header: 'Folder', sortable: true, minWidth: 140 },
    { accessorKey: 'visibility', header: 'Visibility', minWidth: 120 },
    { accessorKey: 'lastUsedAt', header: 'Last used', sortable: true, minWidth: 130 },
    { accessorKey: 'usageCount', header: 'Uses', sortable: true, align: 'end', minWidth: 88 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const properties = computed<FilteringProperty[]>(() => [
    { key: 'folder', label: 'Folder', options: folders.value.map((value) => ({ value })) },
    {
      key: 'visibility',
      label: 'Visibility',
      options: Object.entries(visibilityLabels).map(([value, label]) => ({ value, label }))
    }
  ])

  const { paginationProps, tableProps, propertyFilterProps, status, clearFilters } = useCollection({
    items,
    columns,
    filtering: { fields: ['title', 'body', 'folder'] },
    propertyFiltering: { properties, defaultQuery: props.defaultQuery },
    sorting: { defaultState: [{ id: 'usageCount', desc: true }] },
    pagination: { pageSize: 25, pageSizeOptions: [25, 50, 100] }
  })

  const loadFailed = computed(() => props.error !== '')
  const firstUse = computed(() => !props.loading && !loadFailed.value && status.value === 'empty')
  const refreshing = computed(() => props.loading && items.value.length > 0)

  const editing = computed(() =>
    editingKey.value ? (items.value.find((item) => item.id === editingKey.value) ?? null) : null
  )
  const otherTitles = computed(() =>
    items.value.filter((item) => item.id !== editing.value?.id).map((item) => item.title)
  )

  const openEditor = (key: string | null) => {
    editingKey.value = key
    editorOpen.value = true
  }

  watch(
    () => props.saving,
    (now, before) => {
      if (before && !now && !props.saveError) editorOpen.value = false
    }
  )

  const pending = ref<CannedResponsesResponse | null>(null)
  const removeOpen = ref(false)

  const onAction = (
    event: MouseEvent | KeyboardEvent,
    action: CannedResponsesAction,
    response: CannedResponsesResponse
  ) => {
    if (action === 'edit') openEditor(response.id)
    if (action === 'duplicate') emit('duplicate', event, response)
    if (action === 'remove') {
      pending.value = response
      removeOpen.value = true
    }
  }

  const onSave = (event: Event, values: CannedResponsesValues) => {
    if (editing.value) emit('update', event, editing.value, values)
    else emit('create', event, values)
  }

  const remove = (event: MouseEvent) => {
    const response = pending.value
    if (!response) return
    items.value = items.value.filter((item) => item.id !== response.id)
    removeOpen.value = false
    emit('remove', event, response)
  }
</script>

<template>
  <ConfigProvider :now="clock">
    <div class="layout-boundary">
      <div class="layout-column flex flex-col">
        <PageHeader
          title="Canned responses"
          description="Saved replies agents insert into a ticket, with the requester's details filled in."
        >
          <template #actions>
            <Button
              label="New response"
              icon="az az-plus"
              variant="primary"
              size="medium"
              @click="openEditor(null)"
            />
          </template>
        </PageHeader>

        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
          <header
            v-if="!loadFailed && !firstUse"
            class="flex flex-wrap items-start gap-(--layout-group-gap)"
          >
            <div class="flex min-w-0 grow basis-(--container-2xs)">
              <PropertyFilter
                v-bind="propertyFilterProps"
                placeholder="Search responses"
                aria-label="Search responses"
              />
            </div>
            <Tooltip
              content="Refresh"
              class="shrink-0"
            >
              <IconButton
                icon="az az-refresh"
                variant="outline"
                size="medium"
                :loading="refreshing"
                aria-label="Refresh"
                @click="emit('refresh', $event)"
              />
            </Tooltip>
          </header>

          <Alert
            v-if="loadFailed"
            severity="danger"
            :label="error"
            action-label="Retry"
            @action="(event: MouseEvent) => emit('retry', event)"
          />

          <Card
            key="card-empty"
            v-else-if="firstUse"
            :padded="false"
          >
            <template #default>
              <EmptyState
                size="medium"
                icon="az az-reply"
                title="No canned responses yet"
                description="Save the replies your team sends again and again. An agent inserts one into a ticket in two clicks, with the requester's name and the ticket number filled in."
              >
                <template #actions>
                  <Button
                    label="New response"
                    icon="az az-plus"
                    variant="secondary"
                    size="small"
                    @click="openEditor(null)"
                  />
                </template>
              </EmptyState>
            </template>
          </Card>

          <ResponsesTable
            key="card-table"
            v-else
            :table-props="tableProps"
            :pagination-props="paginationProps"
            :loading="loading"
            :visibility-labels="visibilityLabels"
            @action="onAction"
            @clear="clearFilters"
          />
        </section>
      </div>

      <ResponseDrawer
        v-model:open="editorOpen"
        :response="editing"
        :folders="folders"
        :titles="otherTitles"
        :placeholders="placeholderList"
        :saving="saving"
        :save-error="saveError"
        :visibility-labels="visibilityLabels"
        @save="onSave"
      />

      <ConfirmDialog
        v-model:open="removeOpen"
        title="Delete response"
        :description="`Agents can no longer insert “\u2068${pending?.title ?? ''}\u2069”. Replies already sent keep their text. You cannot undo this.`"
        confirm-label="Delete response"
        size="small"
        @confirm="remove"
      />
    </div>
  </ConfigProvider>
</template>
```

## `sample.ts`

```ts
import type {
  CannedResponsesPlaceholder,
  CannedResponsesResponse
} from './settings-canned-responses.vue'

const DAY = 86_400_000
const referenceTime = Date.UTC(2026, 10, 10, 12)
const daysFrom = (days: number) => new Date(referenceTime + days * DAY)

export const sampleNow = new Date(referenceTime)

const reply = (...paragraphs: string[]) => paragraphs.join('\n\n')

export const sampleResponses: CannedResponsesResponse[] = [
  {
    id: 'cr-welcome',
    title: 'Welcome and first reply',
    folder: 'Getting started',
    visibility: 'everyone',
    body: reply(
      'Hi {{ticket.requester.first_name}},',
      'Thanks for contacting Acme support. We received your request **#{{ticket.id}}** and an agent will reply within one business day.',
      '{{agent.signature}}'
    ),
    status: 'Open',
    lastUsedAt: daysFrom(-0.05),
    usageCount: 412
  },
  {
    id: 'cr-request-id',
    title: 'Ask for the request ID',
    folder: 'Troubleshooting',
    visibility: 'team',
    body: reply(
      'Hi {{ticket.requester.first_name}},',
      'To trace the failing call, send us the value of the `x-request-id` response header and the time it happened, in UTC.',
      '{{agent.signature}}'
    ),
    status: 'Pending',
    lastUsedAt: daysFrom(-0.4),
    usageCount: 188
  },
  {
    id: 'cr-certificate',
    title: 'Certificate is still being issued',
    folder: 'Domains',
    visibility: 'everyone',
    body: reply(
      'Hi {{ticket.requester.first_name}},',
      'The certificate for your domain is still being issued. This usually takes up to 30 minutes after the DNS records point to us.',
      '{{agent.signature}}'
    ),
    status: null,
    lastUsedAt: daysFrom(-2),
    usageCount: 96
  },
  {
    id: 'cr-refund',
    title: 'Refund confirmed',
    folder: 'Billing',
    visibility: 'team',
    body: reply(
      'Hi {{ticket.requester.first_name}},',
      'We refunded the last invoice of {{account.name}}. The amount reaches your card in 5 to 10 business days.',
      '{{agent.signature}}'
    ),
    status: 'Solved',
    lastUsedAt: daysFrom(-6),
    usageCount: 41
  },
  {
    id: 'cr-escalated',
    title: 'Escalated to engineering',
    folder: 'Troubleshooting',
    visibility: 'team',
    body: reply(
      'Hi {{ticket.requester.first_name}},',
      'We passed **{{ticket.subject}}** to our engineering team. We will update this ticket as soon as we hear back.',
      '{{agent.signature}}'
    ),
    status: 'On hold',
    lastUsedAt: daysFrom(-11),
    usageCount: 27
  },
  {
    id: 'cr-sign-off',
    title: 'Short sign-off',
    folder: '',
    visibility: 'personal',
    body: reply('Let me know if there is anything else I can help with.', '{{agent.name}}'),
    status: null,
    lastUsedAt: null,
    usageCount: 0
  }
]

export const samplePlaceholders: CannedResponsesPlaceholder[] = [
  { value: 'ticket.id', label: 'Ticket number', group: 'Ticket' },
  { value: 'ticket.subject', label: 'Ticket subject', group: 'Ticket' },
  { value: 'ticket.status', label: 'Ticket status', group: 'Ticket' },
  { value: 'ticket.requester.name', label: 'Requester name', group: 'Requester' },
  { value: 'ticket.requester.first_name', label: 'Requester first name', group: 'Requester' },
  { value: 'ticket.requester.email', label: 'Requester email', group: 'Requester' },
  { value: 'agent.name', label: 'Agent name', group: 'Agent' },
  { value: 'agent.signature', label: 'Agent signature', group: 'Agent' },
  { value: 'account.name', label: 'Account name', group: 'Account' }
]
```

## `parts/response-drawer.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Combobox from '@aziontech/webkit/combobox'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import MarkdownEditor from '@aziontech/webkit/markdown-editor'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioGroup from '@aziontech/webkit/radio-group-root'
  import Select from '@aziontech/webkit/select'
  import { computed, nextTick, reactive, ref, useId, watch } from 'vue'

  import type {
    CannedResponsesPlaceholder,
    CannedResponsesResponse,
    CannedResponsesTicketStatus,
    CannedResponsesValues,
    CannedResponsesVisibility
  } from '../settings-canned-responses.vue'

  const props = defineProps<{
    response: CannedResponsesResponse | null
    folders: string[]
    titles: string[]
    placeholders: CannedResponsesPlaceholder[]
    saving: boolean
    saveError: string
    visibilityLabels: Record<CannedResponsesVisibility, string>
  }>()

  const emit = defineEmits<{ save: [event: Event, values: CannedResponsesValues] }>()

  const open = defineModel<boolean>('open', { required: true })

  const UNCHANGED = 'unchanged'
  const ids = {
    title: useId(),
    folder: useId(),
    body: useId(),
    status: useId(),
    visibility: useId()
  }

  const statusOptions: { value: CannedResponsesTicketStatus | typeof UNCHANGED; label: string }[] =
    [
      { value: UNCHANGED, label: "Don't change the status" },
      { value: 'New', label: 'New' },
      { value: 'Open', label: 'Open' },
      { value: 'Pending', label: 'Pending' },
      { value: 'On hold', label: 'On hold' },
      { value: 'Solved', label: 'Solved' }
    ]
  const statusLabel = (value: string) =>
    statusOptions.find((option) => option.value === value)?.label ?? ''

  const visibilityHints: Record<CannedResponsesVisibility, string> = {
    personal: 'Only you can insert it.',
    team: 'Everyone in your team can insert it.',
    everyone: 'Every agent of the account can insert it.'
  }
  const visibilityOptions = computed(() =>
    (Object.keys(visibilityHints) as CannedResponsesVisibility[]).map((value) => ({
      value,
      label: props.visibilityLabels[value],
      description: visibilityHints[value]
    }))
  )

  const folderOptions = computed(() => props.folders.map((value) => ({ value })))

  const placeholderGroups = computed(() => {
    const groups = new Map<string, CannedResponsesPlaceholder[]>()
    for (const placeholder of props.placeholders) {
      groups.set(placeholder.group, [...(groups.get(placeholder.group) ?? []), placeholder])
    }
    return [...groups.entries()].map(([label, items]) => ({ label, items }))
  })

  const form = reactive({
    title: '',
    folder: '',
    visibility: 'personal' as CannedResponsesVisibility,
    body: '',
    status: UNCHANGED as string
  })
  const errors = reactive({ title: '', body: '' })
  const editing = computed(() => props.response !== null)

  watch(
    open,
    (now) => {
      if (!now) return
      const response = props.response
      Object.assign(form, {
        title: response?.title ?? '',
        folder: response?.folder ?? '',
        visibility: response?.visibility ?? 'personal',
        body: response?.body ?? '',
        status: response?.status ?? UNCHANGED
      })
      Object.assign(errors, { title: '', body: '' })
    },
    { immediate: true }
  )

  const editorEl = ref<InstanceType<typeof MarkdownEditor> | null>(null)

  const tokenOf = (value: DropdownMenuItemValue) => `{{${value}}}`

  const insertPlaceholder = (_event: Event, value: DropdownMenuItemValue) =>
    editorEl.value?.insert(tokenOf(value))

  const focusById = (id: string) => nextTick(() => document.getElementById(id)?.focus())

  const submit = (event: Event) => {
    if (props.saving) return
    const title = form.title.trim()
    if (!title) errors.title = 'Enter a title.'
    else if (props.titles.some((other) => other.toLowerCase() === title.toLowerCase())) {
      errors.title = 'A response with this title already exists. Use another title.'
    } else errors.title = ''
    errors.body = form.body.trim() ? '' : 'Write the reply agents insert.'
    if (errors.title) return focusById(ids.title)
    if (errors.body) return editorEl.value?.focus()
    emit('save', event, {
      title,
      folder: form.folder.trim(),
      visibility: form.visibility,
      body: form.body,
      status: form.status === UNCHANGED ? null : (form.status as CannedResponsesTicketStatus)
    })
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="editing ? 'Edit response' : 'New response'"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>{{ editing ? 'Edit response' : 'New response' }}</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              Agents insert it from the reply box of a ticket. Placeholders are filled in for each
              ticket.
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
          <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
            <Alert
              v-if="saveError"
              severity="danger"
              :label="saveError"
            />
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
              :disabled="saving"
            >
              <legend class="sr-only">{{ editing ? 'Edit response' : 'New response' }}</legend>
              <Field
                required
                :invalid="!!errors.title"
              >
                <Field.Label :for="ids.title">Title</Field.Label>
                <Input
                  :id="ids.title"
                  v-model="form.title"
                  dir="auto"
                  autocomplete="off"
                  @update:model-value="errors.title = ''"
                />
                <Field.Error v-if="errors.title">{{ errors.title }}</Field.Error>
                <Field.Description v-else
                  >Agents search for it by title, so name what the reply answers.</Field.Description
                >
              </Field>

              <Field>
                <Field.Label :for="ids.folder">Folder</Field.Label>
                <Combobox
                  :id="ids.folder"
                  v-model="form.folder"
                  :options="folderOptions"
                  icon="az az-folder"
                  size="large"
                  clearable
                />
                <Field.Description
                  >Pick a folder or type a new name to create one. Leave it empty for no
                  folder.</Field.Description
                >
              </Field>

              <Field.Set>
                <Field.Legend>Visibility</Field.Legend>
                <RadioGroup
                  v-model="form.visibility"
                  :name="ids.visibility"
                  :options="visibilityOptions"
                />
              </Field.Set>

              <Field
                required
                :invalid="!!errors.body"
              >
                <Field.Label :for="ids.body">Reply</Field.Label>
                <MarkdownEditor
                  :id="ids.body"
                  dir="auto"
                  ref="editorEl"
                  v-model="form.body"
                  :min-rows="8"
                  @update:model-value="errors.body = ''"
                >
                  <template #footer>
                    <DropdownMenu
                      side="top"
                      @select="insertPlaceholder"
                    >
                      <DropdownMenu.Trigger>
                        <Button
                          label="Insert placeholder"
                          icon="az az-code"
                          variant="outline"
                          size="small"
                          type="button"
                        />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Group
                        v-for="group in placeholderGroups"
                        :key="group.label"
                        :label="group.label"
                      >
                        <DropdownMenu.Item
                          v-for="placeholder in group.items"
                          :key="placeholder.value"
                          :value="placeholder.value"
                          :label="placeholder.label"
                        >
                          <template #trailing>
                            <bdi
                              dir="ltr"
                              class="font-mono text-body-xs text-(--text-muted)"
                              >{{ tokenOf(placeholder.value) }}</bdi
                            >
                          </template>
                        </DropdownMenu.Item>
                      </DropdownMenu.Group>
                    </DropdownMenu>
                  </template>
                </MarkdownEditor>
                <Field.Error v-if="errors.body">{{ errors.body }}</Field.Error>
                <Field.Description v-else
                  >Markdown. A placeholder such as the requester's name is written in double
                  braces.</Field.Description
                >
              </Field>

              <Field>
                <Field.Label :for="ids.status">Also set the ticket status to</Field.Label>
                <Select
                  v-model="form.status"
                  size="large"
                  class="w-full"
                  :display-value="statusLabel"
                >
                  <Select.Trigger :id="ids.status" />
                  <Select.Content>
                    <Select.Item
                      v-for="option in statusOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Item>
                  </Select.Content>
                </Select>
                <Field.Description>Applied when the agent sends the reply.</Field.Description>
              </Field>
            </fieldset>
          </div>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
            <Button
              label="Cancel"
              variant="outline"
              size="medium"
              type="button"
              :disabled="saving"
              @click="open = false"
            />
            <Button
              label="Save response"
              variant="primary"
              size="medium"
              type="submit"
              :loading="saving"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
```

## `parts/responses-table.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import { type TableColumn } from '@aziontech/webkit/table'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tag from '@aziontech/webkit/tag'
  import type {
    CollectionPaginationProps,
    CollectionTableProps
  } from '@aziontech/webkit/use-collection'
  import { useLocale } from '@aziontech/webkit/use-locale'

  import type {
    CannedResponsesResponse,
    CannedResponsesVisibility
  } from '../settings-canned-responses.vue'

  /** What a row action does to its response. */
  export type CannedResponsesAction = 'edit' | 'duplicate' | 'remove'

  defineProps<{
    tableProps: CollectionTableProps<CannedResponsesResponse, TableColumn>
    paginationProps: CollectionPaginationProps
    loading: boolean
    visibilityLabels: Record<CannedResponsesVisibility, string>
  }>()

  const emit = defineEmits<{
    action: [
      event: MouseEvent | KeyboardEvent,
      action: CannedResponsesAction,
      response: CannedResponsesResponse
    ]
    clear: []
  }>()

  const visibilityIcons: Record<CannedResponsesVisibility, string> = {
    personal: 'az az-user',
    team: 'az az-users',
    everyone: 'az az-building'
  }

  const { formatNumber, plural } = useLocale()

  const usesOf = (count: number) => plural(count, { one: '{count} use', other: '{count} uses' })

  const plainText = (line: string) =>
    line
      .replace(/^(?:>|[-*]|\d+\.)\s+/, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\*\*|__|`/g, '')

  const excerpt = (body: string) =>
    plainText(
      body
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(1, 2)
        .join(' ')
    )

  const onSelect = (
    event: MouseEvent | KeyboardEvent,
    value: DropdownMenuItemValue,
    response: CannedResponsesResponse
  ) => {
    if (value === 'edit' || value === 'duplicate' || value === 'remove')
      emit('action', event, value, response)
  }

  const onRowClick = (event: MouseEvent | KeyboardEvent, response: CannedResponsesResponse) => {
    const target = event.target instanceof Element ? event.target : null
    if (target?.closest('a, button, input')) return
    emit('action', event, 'edit', response)
  }
</script>

<template>
  <Card :padded="false">
    <template #default>
      <DataTable
        v-bind="tableProps"
        :loading="loading"
        sortable
        :bordered="false"
        aria-label="Canned responses"
        @row-click="onRowClick"
        @row-remove="(event, row) => emit('action', event, 'remove', row)"
      >
        <template #cell-title="{ row }">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <span
              dir="auto"
              class="truncate text-label-sm text-(--text-default)"
              >{{ row.title }}</span
            >
            <span
              v-if="excerpt(row.body)"
              dir="auto"
              class="truncate text-body-xs text-(--text-muted)"
              >{{ excerpt(row.body) }}</span
            >
            <div
              aria-hidden="true"
              data-slot="narrow-summary"
              class="flex flex-wrap items-center gap-(--spacing-xs) sm:hidden"
            >
              <Tag
                v-if="row.folder"
                :label="row.folder"
                dir="auto"
                severity="neutral"
                size="small"
              />
              <span class="text-body-xs text-(--text-muted)">
                {{ visibilityLabels[row.visibility] }} · {{ usesOf(row.usageCount) }}
              </span>
            </div>
          </div>
        </template>
        <template #cell-folder="{ row }">
          <Tag
            v-if="row.folder"
            :label="row.folder"
            dir="auto"
            severity="neutral"
            size="small"
          />
          <span
            v-else
            class="text-body-sm text-(--text-muted)"
            >No folder</span
          >
        </template>
        <template #cell-visibility="{ row }">
          <span
            class="inline-flex items-center gap-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            <i
              :class="visibilityIcons[row.visibility]"
              class="text-(--text-muted)"
              aria-hidden="true"
            />
            {{ visibilityLabels[row.visibility] }}
          </span>
        </template>
        <template #cell-lastUsedAt="{ row }">
          <TableCellTime
            v-if="row.lastUsedAt"
            :value="row.lastUsedAt"
          />
          <span
            v-else
            class="text-body-sm text-(--text-muted)"
            >Never used</span
          >
        </template>
        <template #cell-usageCount="{ row }">
          <span class="text-body-sm text-(--text-default) tabular-nums">{{
            formatNumber(row.usageCount)
          }}</span>
        </template>
        <template #header-actions>
          <span class="sr-only">Actions</span>
        </template>
        <template #cell-actions="{ row }">
          <TableCellActions
            :name="row.title"
            @select="(event, value) => onSelect(event, value, row)"
          >
            <DropdownMenu.Group>
              <DropdownMenu.Item
                value="edit"
                label="Edit"
              />
              <DropdownMenu.Item
                value="duplicate"
                label="Duplicate"
              />
            </DropdownMenu.Group>
            <DropdownMenu.Group>
              <DropdownMenu.Item
                value="remove"
                label="Delete"
              />
            </DropdownMenu.Group>
          </TableCellActions>
        </template>
        <template #empty>
          <EmptyState
            size="small"
            icon="az az-filter-off"
            title="No matching responses"
            description="No canned response matches this search or these filters."
          >
            <template #actions>
              <Button
                label="Clear filters"
                variant="outline"
                size="small"
                @click="emit('clear')"
              />
            </template>
          </EmptyState>
        </template>
        <template #footer>
          <DataTablePagination
            v-bind="paginationProps"
            manual
          />
        </template>
      </DataTable>
    </template>
  </Card>
</template>
```
