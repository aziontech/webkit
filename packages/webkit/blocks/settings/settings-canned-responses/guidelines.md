# Canned responses

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

A large `Drawer` on the end side with one `form`, titled `New response` or `Edit response`. A failed save shows a danger `Alert` at the top of the body and keeps every value. While `saving` the fields lock (one `fieldset`), Save response spins, and Cancel, the close button and Escape are disabled (`:closable` and `:dismissible` follow `saving`), so the request cannot be left half-way; when `saving` returns to false with no `saveError`, the drawer closes. Footer: Cancel and `Save response`.

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
