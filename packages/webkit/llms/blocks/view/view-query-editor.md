# ViewQueryEditor (`view/view-query-editor`)

> The query editor page (the app passes the Databases breadcrumb to the layout): the Tables and Editor tabs, each pairing a resizable, collapsible `Sidebar` (288px at rest) with a working pane. On Editor the panel holds the query history and the pane stacks the Run query, Prettify and Templates toolbar, the SQL `CodeEditor`, and the Results band (rows paged in a `DataTable`, or JSON in a copyable `CodeBlock`); on Tables the panel lists the tables as option `Item` rows and the pane holds the selected table with its Data and Definition switch, its rows in a paged, selectable `DataTable`. A database with no tables shows the Create Table empty state, and the Templates button opens the SQL quick templates drawer. Its page-level parts are `PageTabs`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main; CreateDatabase is a focused create page with its own header and no rail, rendered outside it. Its root carries data-layout-fill (every variant but CreateDatabase), so the main stops scrolling and the panel, the rows, the editor and the results scroll on their own.

- Surface: app
- Source: `blocks/view/view-query-editor/view-query-editor.vue` in `@aziontech/webkit`
- MCP: `get_block("view/view-query-editor")`
- Components: [Alert](../../components/alert.md), [AppHeader](../../components/app-header.md), [Avatar](../../components/avatar.md), [Brand](../../components/brand.md), [Breadcrumb](../../components/breadcrumb.md), [Button](../../components/button.md), [Card](../../components/card.md), [CodeBlock](../../components/code-block.md), [CodeEditor](../../components/code-editor.md), [ConfirmDialog](../../components/confirm-dialog.md), [DataTable](../../components/data-table.md), `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), `FieldError`, [FileDropzone](../../components/file-dropzone.md), [FileTokenGroup](../../components/file-token-group.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [Kbd](../../components/kbd.md), [PageHeader](../../components/page-header.md), [PageTabs](../../components/page-tabs.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [SaveBar](../../components/save-bar.md), [Select](../../components/select.md), [SettingsGroup](../../components/settings-group.md), [SettingsRow](../../components/settings-row.md), [Sidebar](../../components/sidebar.md), [Skeleton](../../components/skeleton.md), [Switch](../../components/switch.md), [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md), `use-shortcuts`
- Skills: `webkit-layout`, `webkit-tables`, `webkit-ui-states`

## Asked as

query editor; sql editor; run query; query results; sql query page; query history; sql code editor; código sql; editor de consultas; editor sql; executar consulta; sql database; database tables; database detail; table schema; data grid; sql templates; banco de dados; banco de dados sql; tabelas do banco; create database; criar banco de dados; table rows; linhas da tabela; import csv; import data; csv import; importar csv; importar dados

The workspace of one SQL database. The user comes here to see which tables exist, read and edit a table's rows or its definition, and write and run queries against the data. Two tabs share one layout: a resizable side panel that lists things (tables, or past queries) beside a working pane that shows the one in use.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`. The editor is a workspace: its root carries `data-layout-fill`, so the layout's `main` stops scrolling, the root fills it, and the side panel, the rows, the editor and the results each scroll on their own at every width (`h-dvh` only sizes a standalone preview). CreateDatabase is a focused create page with its own header and no rail, rendered outside it.

## When to use

- A database resource opens on its tables and an editor that runs SQL against them.
- Users switch between browsing data (rows, columns, constraints) and writing queries without leaving the resource.
- Results need both a table view and the raw JSON, with paging over large result sets.

## When not to use

- A first-level list of databases: use `view/view-table`.
- Rows of a resource that are not a SQL table (variables, records): use `detail/detail-dns-zone`.
- Editing a function or configuration as code: use `edit/edit-function`.
- Files and folders of a storage resource: use `view/view-file-browser`.
- Events explored over time: use `view/view-events-explorer`.

## Building blocks

### A. Page tabs — `PageTabs`, `Tabs` (required)

`PageTabs` bound with `v-model` holds two `Tabs.Trigger`s, Tables and Editor. The tabs are the page's top level; each one swaps the side panel and the working pane together.

### B. Tables panel — `Sidebar`, `Tooltip`, `IconButton`, `Input`, `DropdownMenu` (required)

A resizable, collapsible start `Sidebar` named Tables, 288px at rest. Below `md` it starts collapsed (set on mount, so the server render matches) in every state, the empty database included, and when reopened it slides over the pane as an overlay (with a `--spacing-2xl` strip of the pane still showing) instead of pushing it aside, so the pane always keeps the width of the phone; the same holds for the Editor tab's query history. While it is collapsed below `md`, an outlined small Tables `Button` leads the open table's header (an outlined History `Button` leads the Editor toolbar) and reopens it, and picking a table closes it again, so a phone always sees how to switch tables. Its header carries Refresh tables and Create Table `IconButton`s, each named by a `Tooltip`, over a Search tables `Input`. Each table row is an `Item` (`clickable`, `variant="option"`, `aria-pressed` on the open table) that opens it in the pane, beside an `Actions for <table>` `DropdownMenu` with Delete table. While the tables load, `Skeleton` lines hold the list; a search that matches nothing shows a small `EmptyState` with Clear search.

### C. Empty database — `EmptyState`, `Button` (required)

A database with no tables replaces the pane with a `Card` holding an `EmptyState` (No tables yet) and a secondary Create Table `Button`. The side panel says the same thing in its own words; the tabs stay.

### D. Table data — `ToggleGroup`, `Input`, `Button`, `Tooltip`, `IconButton`, `DataTable` (required)

The pane opens with the table name and a `ToggleGroup` switching Data and Definition. Data has a Filter rows `Input`, an outlined Sort `Button`, a Refresh `IconButton` and the primary Insert `Button`, over the rows. The rows are a compact `DataTable` (`row-key="__k"`, `selectable`, `sortable`, `paginated` at 25 rows with 25, 50 and 100 per page) named `Rows of <table>`: one column per table column with a `header-<name>` slot that shows the name, its type muted and a key on the primary key, a `cell-<name>` slot that renders values in the code font and `NULL` in muted italics, and a trailing action column with a Delete row `IconButton` that asks in a small `ConfirmDialog` (`Delete row`, the table named in the sentence) before the row goes. Sorting by a header sorts the loaded rows; selection resets when another table is picked. An empty table fills the `#empty` slot with a small `EmptyState` holding Insert row and Import data from CSV; a filter that matches nothing shows a small `EmptyState` named with the filter text and a Clear filter button. Each Delete row button names its row (`Delete row 3`).

### E. Table definition — `Button`, `Card`, `DataTable`, `Tag` (optional)

Definition shows a Columns heading with an Add column `Button`, over a flush `Card` holding a `DataTable` of the column name, its type as a secondary `Tag`, and its constraints.

### F. Query history — `Sidebar`, `Input`, `DropdownMenu` (required)

On Editor the start `Sidebar` is named Query history, with a Search queries `Input` and one row per past query showing the statement on one line. Each row has a Query actions `DropdownMenu` with Run query and Delete query.

### G. Editor — `Button`, `CodeEditor` (required)

A toolbar with the primary Run query `Button` (`:loading` while it runs) and outlined Prettify and Templates `Button`s, over a `CodeEditor` (`language="sql"`, `path="query.sql"`, 14rem) named SQL editor. The plain editor ships by default; pass `loader` with `() => import('monaco-editor')` to get Monaco with SQL highlighting, themed from the tokens. While a query runs the editor is read-only and Prettify and Templates are disabled. A statement the database rejects puts an error marker on its line (`markers`) as well as the danger `Alert` in Results.

### H. Results — `Input`, `ToggleGroup`, `Tooltip`, `IconButton`, `DataTable`, `CodeBlock`, `Skeleton`, `Alert`, `EmptyState` (required)

A Results band with its own search `Input`, a `ToggleGroup` switching Table and JSON, and Refresh, Download and Columns `IconButton`s named by `Tooltip`s. A SELECT shows its rows in a `DataTable` paged at 50 (10, 25, 50 and 100 per page), and JSON shows them in a copyable `CodeBlock`; any other statement shows a success `Alert` with what ran; a statement the database rejects shows a danger `Alert` with the reason and what to do (`The statement wasn't executed: near "SELEC", a syntax error. Check the statement and run it again.`), and the statement stays in the editor; before anything runs an `EmptyState` reads Ready to execute, and while a query runs `Skeleton` lines hold the band. A visually hidden `role="status"` announces the outcome (`3 rows returned.` or the error).

### I. Templates drawer — `Drawer`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `PanelBody`, `Input`, `Item` (optional)

Templates opens a large right `Drawer` titled SQL quick templates with a one-line description, a Search templates `Input` and one outlined clickable `Item` per snippet (a small `EmptyState` with Clear search when none matches). Choosing a card loads its SQL into the editor and closes the drawer.

### J. Bulk row delete — `Button`, `ConfirmDialog` (optional)

With rows selected, a selection bar opens under the Data toolbar: `2 selected`, Clear selection, and an outlined `Delete 2 rows` `Button` at its end. Sort never moves, so a second tap meant for Sort cannot land on Delete. TableData opens with two rows selected (`defaultSelectedKeys`). Delete N rows asks first in a small `ConfirmDialog` naming the count and the table; confirming removes the rows from the table and emits `delete-rows`; the page sends the request and raises the success toast `2 rows deleted from events.` whose action fits the rows, Undo, which puts them back. Deleting rows is not a deploy: never View deployments, Edit or Redeploy.

### K. Create database page — `Input`, `Button` (optional)

Variant CreateDatabase only; it is its own focused page outside `ConsoleLayout`, with the creation header (`AppHeader` with `Breadcrumb`), and adds `PageHeader`, `SettingsGroup`, `SettingsRow`, `Item`, `FieldDescription`, `Switch` and `SaveBar`, and raises its toasts with `toast`. Being outside `ConsoleLayout` does not make it an app root: it is still a route of the same app, so its toasts ride the app's one region like every other page's.

The page the Databases list's Create opens, taken from the design sample's create database page: a back `IconButton` and the `Databases / Create Database` crumb, a small `PageHeader` (`Create Database`, `A SQL database that applications, functions and APIs can query at the edge.`), a General section with one Name row (6 to 50 letters, numbers and hyphens; it cannot be changed later) and a collapsible Advanced section with the Active `Switch`. The `SaveBar` is `variant="centered"`, the create-page footer: a raised card centred over the bottom of the scroll region, always shown, that says `Unsaved changes` while the form differs from its last saved state and holds Cancel and the primary `Create Database` (`:loading` while it runs; the fieldset is disabled meanwhile). Validation runs on submit: an empty or malformed name turns the field invalid with its reason and focus returns to it. The server's answer follows the state-form-validation rule: a name that already exists comes back on the field (`A database named acme-store already exists. Pick another name.`); a request that never arrived is a danger toast with Retry that keeps the entries. Success is a toast `Database orders-eu created.` with the actions that fit a new, empty database: Open database and Create Table. Provisioning a database is not a deploy, so Edit and Redeploy do not apply.

### L. Import data from CSV — `Drawer`, `Alert`, `DataTable`, `Button` (optional)

Variant ImportCsv only; it adds `FileDropzone`, `FileTokenGroup`, `Select`, `SettingsGroup` and `PanelFooter`, and raises its toasts with `toast`.

An empty table's Data view offers Insert row and Import data from CSV, and accepts a CSV dropped on the empty state; both open a large drawer `Import data into <table>` in three sections. **File**: a `FileDropzone` with Browse files, then the file as a `FileTokenGroup` token (dismiss to pick another); a header with a blank name, a header with no rows or a file that is not `.csv` is an error on the token. **Map columns**: one row per CSV column with its first value as an example, an arrow, and a `Select` of the table's columns (name, type, `required` for NOT NULL ones) plus Skip; columns are matched by name, ignoring case, when the file is read, and everything else starts on Skip. **Check rows**: a polite sentence `4 of 7 rows are ready to insert. 3 rows have errors and will be skipped.`, the errors per line (`Line 4: active “maybe” is not true or false (bool).`; at most 10, then `And N more.`) and the first five valid rows as a `DataTable` named `Import preview` under the table's column names. The footer holds Cancel and the primary `Insert 4 rows`.

Validation runs on Insert, as the state-form-validation rule says: a table column mapped twice, a NOT NULL column with no CSV column, nothing mapped, or every row failing shows a danger `Alert` in the section that has to change, and nothing is inserted. A primary key may stay unmapped (the database assigns it). While inserting, the fieldset is disabled and Insert spins; then the drawer closes, the rows appear in the table and a success toast `4 rows inserted into subscribers.` says how many rows were skipped and offers Undo. Importing rows is not a deploy, so Edit and Redeploy do not apply.

## Data

The block takes its records through props and emits every action; it fetches nothing and runs no SQL. `QueryEditorTable`, `QueryEditorHistoryEntry`, `QueryEditorResult` and `QueryEditorProps` are exported from `view-query-editor.vue`, and `sample.ts` holds the sample tables, history and statement the block renders when `tables`, `history` or `sql` is left out (the tables and history never while `loading` or `error` is set).

| Prop                   | Type                        | What it does                                                                                                        |
| ---------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `tables`               | `QueryEditorTable[]`        | The tables with their columns and rows. Pass `[]` for a database with none.                                         |
| `history`              | `QueryEditorHistoryEntry[]` | Past queries, newest first.                                                                                         |
| `result`               | `QueryEditorResult \| null` | What the last run returned: `rows`, an `error` on a line, or a `message`. Left out, Results reads Ready to execute. |
| `loading`              | `boolean`                   | The tables and rows are loading: `Skeleton` lines hold the side panel and the rows table shows its loading state.   |
| `running`              | `boolean`                   | A query is in flight: Run query spins, the editor locks and `Skeleton` lines hold Results.                          |
| `error`                | `string`                    | Why the selected table's rows failed to load, shown in the danger `Alert` with Retry.                               |
| `defaultTableView`     | `'data' \| 'definition'`    | The view of the selected table the pane opens on.                                                                   |
| `defaultSelectedKeys`  | `string[]`                  | Rows selected when the page opens, by row key.                                                                      |
| `defaultTemplatesOpen` | `boolean`                   | The SQL quick templates drawer starts open.                                                                         |
| `v-model:tab`          | `'tables' \| 'editor'`      | The open tab.                                                                                                       |
| `v-model:table`        | `string \| null`            | The id of the open table; the first table when `null`.                                                              |
| `v-model:sql`          | `string`                    | The statement in the editor.                                                                                        |

| Event              | Payload                    | When                                                                                 |
| ------------------ | -------------------------- | ------------------------------------------------------------------------------------ |
| `run`              | `(event, sql)`             | Run query, Refresh results, or Run query in a history row's menu.                    |
| `refresh-tables`   | `(event)`                  | Refresh tables in the side panel.                                                    |
| `create-table`     | `(event)`                  | Create Table, in the side panel or the empty database.                               |
| `delete-table`     | `(event, table)`           | Delete table in a table's menu, once the table name is typed in its `ConfirmDialog`. |
| `refresh`          | `(event)`                  | Refresh in the Data toolbar.                                                         |
| `retry`            | `(event)`                  | Retry in the rows error alert.                                                       |
| `insert-row`       | `(event, table)`           | Insert, or Insert row on an empty table.                                             |
| `import-csv`       | `(event, table)`           | Import data from CSV on an empty table.                                              |
| `add-column`       | `(event, table)`           | Add column in the Definition view.                                                   |
| `delete-rows`      | `(event, { table, rows })` | A confirmed Delete row or Delete N rows; the rows are already gone from the table.   |
| `delete-query`     | `(event, entry)`           | Delete query in a history row's menu; the entry is already gone.                     |
| `download-results` | `(event, result)`          | Download results.                                                                    |

To go live, render the block from a page that owns the database and the query runner:

```vue
<script setup lang="ts">
  import ViewQueryEditor from './view-query-editor.vue'

  const { tables, pending, error, refresh } = useDatabaseTables()
  const { history, run, running, result } = useQueryRunner()
  const loadError = "Couldn't load the rows. Check your connection and retry."
</script>

<template>
  <ViewQueryEditor
    :tables="tables ?? []"
    :history="history"
    :result="result"
    :loading="pending"
    :running="running"
    :error="error ? loadError : ''"
    @run="(event, sql) => run(sql)"
    @refresh-tables="refresh"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep both tabs on the same layout: side panel to list, working pane to act.
- Let the side panel resize and collapse, and keep its width when the user switches tabs.
- Make the editor read-only and disable its toolbar while a query runs, and show Run query loading.
- Show the outcome of a run in the Results band: the rows, a success `Alert` with what ran, or a danger `Alert` with why it failed.
- Offer JSON beside Table for results, so the raw shape is one click away.
- Delete table asks for the table name (`ConfirmDialog` `confirmation-phrase`, the `edit/edit-delete-dialog` rule) before it emits `delete-table`; row deletes ask in a `ConfirmDialog` first.
- Mark the page root with `data-layout-fill` (every variant but CreateDatabase), so the panes scroll on their own instead of the page.
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so this page body never renders a `Toaster`.

## Don't

- Don't open a separate page for a table or a query; they open in the pane.
- Don't run a query on every keystroke; Run query is the only trigger.
- Don't hide the tabs when the database is empty.
- Don't put a second primary action in a pane; Insert on Data and Run query on Editor are the only ones.
- Don't let the results scroll the page sideways; they scroll inside their band.
- Don't size the root with `calc(100dvh - …)`; `data-layout-fill` fits it to the layout's `main`.

## Copy

- **Tabs:** one noun each, e.g. "Tables", "Editor".
- **Create action:** `Create <Object>`, e.g. "Create Table", the same in the panel and the empty state.
- **Editor toolbar:** verb-first, e.g. "Run query", "Prettify", "Templates".
- **Editor placeholder:** one instruction, e.g. "Write your SQL query here".
- **Search:** names the scope, e.g. "Search tables", "Search queries", "Search templates".
- **Empty states:** title states the fact and the description says what to do, e.g. "No tables yet" with "Create your first table to store your data."; "Ready to execute" with "Execute a query to see the results here."
- **Import:** `Import data from CSV` opens `Import data into <table>`; the submit is `Insert <n> rows`; per-line errors read `Line <n>: <column> “<value>” is not <expected> (<type>).` or `<column> is empty and cannot be.`
- **Row menus:** verb and object, e.g. "Delete table", "Run query", "Delete query".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The layout owns the one `main` landmark; the tabs are a real tab list, so arrow keys move between Tables and Editor.
- Each side `Sidebar` is named (Tables, Query history) with its own collapse, expand and resize labels.
- The `CodeEditor` has the `aria-label` "SQL editor"; its markers are listed in its problems list as text, not by colour.
- Every icon-only button has an `aria-label` that matches its `Tooltip`; the rows table is named `Rows of <table>` and its selection checkboxes come from `DataTable`, named per row.
- On Create Database, the Name error is the input's `aria-describedby` and focus returns to the input after a failed submit.
- `ToggleGroup`s are named ("Table view", "Result view") and each paged table names its own pagination.
- The templates drawer traps focus while open and closes on Escape.
- In the import drawer each mapping `Select` is named `Table column for <CSV column>`, the mapping and the per-line errors are named lists, and the ready count is a polite live region, so changing a mapping announces the new count.
- `⌘ Enter` (`Ctrl Enter` off Apple) runs the query from anywhere on the page, the SQL editor included, where a bare `Enter` stays a new line; it does nothing while a query runs. Run query carries `aria-keyshortcuts` and a `Kbd` keycap.
- Create Database opens with focus in the Name field, and `⌘ Enter` (`Ctrl Enter` off Apple) submits it from any field, the same as Create Database.

## States

- Tables: the Tables tab with the tables listed in the side panel and the selected table's Data view in the pane (the sample, or `tables`).
- Schema: `defaultTableView="definition"`, the Definition view of customers, with the Columns heading, Add column and a card of column name, type and constraints.
- NoTables: `:tables="[]"`, a database with no tables; the side panel says so and the pane shows the Create Table empty state.
- Query: `tab="editor"` with `sql`, `history` and `result`, the Editor tab after a query ran, with the history in the side panel, the statement in the editor and its rows in Results.
- Templates: `tab="editor"` and `defaultTemplatesOpen`, the Editor tab before anything ran, with Results ready to execute and the SQL quick templates drawer open over it.
- Loading: `loading`, the tables list and the selected table's rows are loading; `Skeleton` lines hold the side panel and the rows table shows its loading state.
- TableData: `table="tbl-events"` and `defaultSelectedKeys`, the events table, 137 rows paged 25 at a time, with two rows selected and Delete 2 rows in the selection bar.
- ImportCsv: the empty subscribers table with the import drawer open on a seven-row file: `plan_name` still on Skip (Insert asks to map `plan`), `referrer` skipped, three lines with errors (a non-boolean, an empty required email, a date that does not parse).
- CreateDatabase: the create database page with its Name and Active fields; try `acme-store` for the name conflict and a name starting with `offline` for the failed request.
- Error: `error`, the selected table's rows did not load; the Data view shows a danger `Alert` that names the table and offers Retry.

## Related

- `view/view-table` — the database list this workspace is opened from.
- `edit/edit-delete-dialog` — the dialog behind Delete table.
- `edit/edit-function` — editing code that is not a query.
- `edit/edit-schema` — the Create Table, Add column, Add row, Alter column and Truncate table drawers and dialogs behind this page's buttons.
- `state/state-form-validation` (SectionRejected) — the rule the Create Database name conflict follows.
- `detail/detail-dns-zone` — records of a resource without SQL.
- `DataTable` — the definition and results tables; see `skills/webkit-tables` and `skills/webkit-layout`.

## Variants

- `Tables` — primary (the code below)
- `Schema` — The Definition view of customers: the Columns heading with Add column over a card holding the column name, its type as a Tag, and its constraints.
- `NoTables` — A database with no tables yet: the side panel says so and the working pane shows the Create Table empty state.
- `Query` — The Editor tab after the Select all query ran: the query history in the side panel, the statement in the editor, and its three rows in the Results band, switchable to JSON.
- `Templates` — The Editor tab before anything ran, with the SQL quick templates drawer open over it: a search and one outlined clickable Item per snippet; choosing one loads its SQL into the editor and closes the drawer.
- `Loading` — The tables and the selected table's rows are loading: Skeleton lines hold the side panel and the rows DataTable shows its loading state.
- `Error` — The rows of the selected table failed to load: the Tables tab keeps the side panel and the table toolbar, and the Data view shows a danger Alert that names the table and offers Retry.
- `TableData` — The events table in the Data view: 137 rows in a compact `DataTable` paged 25 at a time, each column header naming its type with a key on the primary key, `NULL` in muted italics, sortable headers and row selection. Two rows are selected, so a selection bar under the toolbar shows 2 selected, Clear selection and Delete 2 rows while Sort stays in place; Delete asks in a `ConfirmDialog`, then removes the rows and emits `delete-rows`.
- `ImportCsv` — An empty table's Import data from CSV (also a CSV dropped on its empty state): a drawer that reads the file (`FileDropzone`, `FileTokenGroup`), maps each CSV column to a table column or Skip in a `Select` (matched by name first), checks every value against its column's type and NOT NULL with the errors listed per line, previews the first rows as they will be inserted, and inserts the valid rows with a spinner, then a toast with Undo that says how many rows were skipped.
- `CreateDatabase` — The Create Database page from the design sample: Name (6 to 50 letters, numbers and hyphens) and an Advanced section with Active, under a centred save bar card with Cancel and Create Database. A taken name comes back on the field, a failed request is a toast with Retry, and success is a toast with Open database and Create Table.

Each variant is the same screen in another state: `get_block("view/view-query-editor", { variant })`, or the file under `blocks/view/view-query-editor/variants/`.

## Code (`Tables`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeBlock from '@aziontech/webkit/code-block'
  import CodeEditor, { type CodeEditorMarker } from '@aziontech/webkit/code-editor'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Sidebar from '@aziontech/webkit/sidebar-root'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { computed, onMounted, ref, watch } from 'vue'

  import { sampleHistory, sampleSql, sampleTables } from './sample'

  /** Which tab the page shows. */
  export type QueryEditorTab = 'tables' | 'editor'

  /** Which view of the selected table the pane shows. */
  export type QueryEditorTableView = 'data' | 'definition'

  /** One column of a table's definition. */
  export interface QueryEditorColumn {
    /** Stable key. */
    id: string
    /** Column name, also the row field it reads. */
    name: string
    /** SQL type, shown beside the name. */
    type: string
    /** Part of the primary key; the header shows a key. */
    primaryKey: boolean
    /** The column rejects NULL. */
    notNull: boolean
  }

  /** One stored row: the stable key and one value per column name. */
  export interface QueryEditorRow {
    /** Stable row key. */
    __k: string
    [column: string]: string | number | null
  }

  /** One table of the database, with its rows. */
  export interface QueryEditorTable {
    /** Stable key. */
    id: string
    /** Table name, listed in the side panel. */
    name: string
    /** The table definition. */
    columns: QueryEditorColumn[]
    /** The rows shown in the Data view. */
    rows: QueryEditorRow[]
  }

  /** One row of a query result: the stable key and one value per result column. */
  export interface QueryEditorResultRow {
    /** Stable row key. */
    __k: number
    [column: string]: string | number | null
  }

  /** What the last query returned: rows, a failure on a line, or a message. */
  export type QueryEditorResult =
    | { type: 'rows'; columns: string[]; rows: QueryEditorResultRow[] }
    | { type: 'error'; line: number; text: string }
    | { type: 'message'; text: string }

  /** One past query in the history panel. */
  export interface QueryEditorHistoryEntry {
    /** Stable key. */
    id: string
    /** The statement that ran. */
    sql: string
  }

  export interface QueryEditorProps {
    /** The database tables with their rows. Left out, the sample renders; pass an empty list for a database with none. */
    tables?: QueryEditorTable[]
    /** Past queries, newest first. Left out, the sample renders. */
    history?: QueryEditorHistoryEntry[]
    /** What the last query returned; left out, Results is ready to execute. */
    result?: QueryEditorResult | null
    /** The tables and the selected table's rows are loading: skeleton lines hold the side panel and the rows table shows its loading state. */
    loading?: boolean
    /** A query is in flight: Run query spins, the editor locks and Results shows skeleton lines. */
    running?: boolean
    /** Why the selected table's rows could not load; a danger alert with Retry replaces the rows. */
    error?: string
    /** The view of the selected table the pane opens on. */
    defaultTableView?: QueryEditorTableView
    /** Rows selected when the page opens, by row key. */
    defaultSelectedKeys?: string[]
    /** The SQL quick templates drawer starts open. */
    defaultTemplatesOpen?: boolean
  }

  interface QueryTemplate {
    title: string
    description: string
    icon: string
    sql: string
  }

  const props = withDefaults(defineProps<QueryEditorProps>(), {
    tables: undefined,
    history: undefined,
    result: undefined,
    loading: false,
    running: false,
    error: '',
    defaultTableView: 'data',
    defaultSelectedKeys: () => [],
    defaultTemplatesOpen: false
  })

  const emit = defineEmits<{
    run: [event: Event, sql: string]
    'refresh-tables': [event: MouseEvent]
    'create-table': [event: MouseEvent]
    'delete-table': [event: Event, table: QueryEditorTable]
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    'insert-row': [event: MouseEvent, table: QueryEditorTable]
    'import-csv': [event: MouseEvent, table: QueryEditorTable]
    'add-column': [event: MouseEvent, table: QueryEditorTable]
    'delete-rows': [event: Event, payload: { table: QueryEditorTable; rows: QueryEditorRow[] }]
    'delete-query': [event: Event, entry: QueryEditorHistoryEntry]
    'download-results': [event: MouseEvent, result: QueryEditorResult]
  }>()

  const activeTab = defineModel<QueryEditorTab>('tab', { default: 'tables' })
  const selectedTableId = defineModel<string | null>('table', { default: null })
  const editorSql = defineModel<string>('sql', { default: sampleSql })

  const tabs = [
    { value: 'tables', label: 'Tables' },
    { value: 'editor', label: 'Editor' }
  ]

  const tableSource = computed<QueryEditorTable[]>(
    () => props.tables ?? (props.loading || props.error ? [] : sampleTables)
  )
  const tableList = ref<QueryEditorTable[]>([])
  watch(
    tableSource,
    (next) => {
      tableList.value = next.map((table) => ({ ...table, rows: [...table.rows] }))
    },
    { immediate: true }
  )
  const tableSearch = ref('')
  const filteredTables = computed(() => {
    const term = tableSearch.value.trim().toLowerCase()
    if (!term) return tableList.value
    return tableList.value.filter((table) => table.name.toLowerCase().includes(term))
  })
  const selectedTable = computed(
    () =>
      tableList.value.find((table) => table.id === selectedTableId.value) ??
      tableList.value[0] ??
      null
  )
  const selectTable = (id: string) => {
    selectedTableId.value = id
    if (narrowViewport()) leftOpen.value = false
  }
  const tablePendingDelete = ref<QueryEditorTable | null>(null)
  const tableDeleteOpen = ref(false)
  const onTableAction = (_event: Event, value: unknown, table: QueryEditorTable) => {
    if (value !== 'delete') return
    tablePendingDelete.value = table
    tableDeleteOpen.value = true
  }
  const confirmTableDelete = (event: MouseEvent) => {
    const table = tablePendingDelete.value
    if (!table) return
    tableDeleteOpen.value = false
    emit('delete-table', event, table)
  }

  const schemaColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Column', principal: true, hideable: false },
    { accessorKey: 'type', header: 'Type', minWidth: 104 },
    { accessorKey: 'constraints', header: 'Constraints', grow: 2 }
  ]
  const schemaRows = computed(() => {
    if (!selectedTable.value) return []
    return selectedTable.value.columns.map((column) => ({
      name: column.name,
      id: column.id,
      type: column.type,
      constraints: [column.primaryKey ? 'PRIMARY KEY' : '', column.notNull ? 'NOT NULL' : '']
        .filter(Boolean)
        .join(', ')
    }))
  })

  const leftWidth = ref(288)
  const narrowViewport = () => Boolean(globalThis.matchMedia?.('(width < 48rem)').matches)
  const leftOpen = ref(true)
  onMounted(() => {
    if (narrowViewport()) leftOpen.value = false
  })

  const tableView = ref<QueryEditorTableView>(props.defaultTableView)
  const tableViewOptions = [
    { label: 'Data', value: 'data' },
    { label: 'Definition', value: 'definition' }
  ]

  const rowFilter = ref('')
  const filterPlaceholder = computed(() => {
    const names = (selectedTable.value?.columns ?? []).map((column) => column.name)
    return names.length ? `Filter by ${names.slice(0, 3).join(', ')}` : 'Filter rows'
  })
  const tableRows = computed(() => selectedTable.value?.rows ?? [])
  const filteredRows = computed(() => {
    const term = rowFilter.value.trim().toLowerCase()
    if (!term) return tableRows.value
    return tableRows.value.filter((row) =>
      Object.entries(row)
        .filter(([key]) => key !== '__k')
        .some(([, value]) =>
          String(value ?? '')
            .toLowerCase()
            .includes(term)
        )
    )
  })
  const selectedKeys = ref<string[]>([...props.defaultSelectedKeys])
  const dataColumns = computed<TableColumn[]>(() => [
    ...(selectedTable.value?.columns ?? []).map((column) => ({
      accessorKey: column.name,
      id: column.name,
      header: column.name,
      sortable: true,
      minWidth: 160
    })),
    { id: '__actions', type: 'action', hideable: false }
  ])
  watch(selectedTableId, () => {
    selectedKeys.value = []
  })
  const editorMarkers = computed<CodeEditorMarker[]>(() =>
    results.value?.type === 'error' && results.value.line
      ? [{ line: results.value.line, severity: 'danger', message: results.value.text }]
      : []
  )
  const isNull = (value: unknown) => value === null || value === undefined || value === ''
  const displayCell = (value: unknown) => (isNull(value) ? 'NULL' : String(value))
  const removeRows = (event: Event, table: QueryEditorTable, keys: Set<string>) => {
    const rows = table.rows.filter((row) => keys.has(row.__k))
    if (!rows.length) return
    table.rows = table.rows.filter((row) => !keys.has(row.__k))
    emit('delete-rows', event, { table, rows })
  }
  const rowsPendingDelete = ref<string[]>([])
  const rowsDeleteOpen = ref(false)
  const rowsDeleteCount = computed(() => rowsPendingDelete.value.length)
  const rowsDeleteNoun = computed(() => (rowsDeleteCount.value === 1 ? 'row' : 'rows'))
  const askDeleteRows = (keys: string[]) => {
    if (!keys.length) return
    rowsPendingDelete.value = keys
    rowsDeleteOpen.value = true
  }
  const deleteRow = (_event: MouseEvent, row: QueryEditorRow) => askDeleteRows([row.__k])
  const deleteSelected = () => askDeleteRows([...selectedKeys.value])
  const confirmRowsDelete = (event: MouseEvent) => {
    const table = tableList.value.find((item) => item.id === selectedTable.value?.id)
    const keys = new Set(rowsPendingDelete.value)
    rowsDeleteOpen.value = false
    if (!table || !keys.size) return
    removeRows(event, table, keys)
    selectedKeys.value = selectedKeys.value.filter((key) => !keys.has(key))
  }

  const historySource = computed<QueryEditorHistoryEntry[]>(
    () => props.history ?? (props.loading || props.error ? [] : sampleHistory)
  )
  const historyList = ref<QueryEditorHistoryEntry[]>([])
  watch(
    historySource,
    (next) => {
      historyList.value = [...next]
    },
    { immediate: true }
  )
  const historySearch = ref('')
  const filteredHistory = computed(() => {
    const term = historySearch.value.trim().toLowerCase()
    if (!term) return historyList.value
    return historyList.value.filter((item) => item.sql.toLowerCase().includes(term))
  })
  const oneLine = (sql: string) => sql.replace(/\s+/g, ' ').trim()

  const running = computed(() => props.running)
  const templatesOpen = ref(props.defaultTemplatesOpen)
  const results = computed<QueryEditorResult | null>(() =>
    props.running ? null : (props.result ?? null)
  )
  const resultColumns = computed<TableColumn[]>(() => {
    if (results.value?.type !== 'rows') return []
    return results.value.columns.map((key, index) => ({
      accessorKey: key,
      header: key,
      principal: index === 0
    }))
  })
  const resultView = ref('table')
  const resultViewOptions = [
    { label: 'Table', value: 'table' },
    { label: 'JSON', value: 'json' }
  ]
  const resultSearch = ref('')
  const resultRows = computed<QueryEditorResultRow[]>(() =>
    results.value?.type === 'rows' ? results.value.rows : []
  )
  const filteredResultRows = computed(() => {
    const term = resultSearch.value.trim().toLowerCase()
    if (!term) return resultRows.value
    return resultRows.value.filter((row) =>
      Object.entries(row)
        .filter(([key]) => key !== '__k')
        .some(([, value]) => String(value).toLowerCase().includes(term))
    )
  })
  const resultJson = computed(() =>
    JSON.stringify(
      resultRows.value.map(({ __k, ...rest }) => rest),
      null,
      2
    )
  )

  const applyTemplate = (sql: string) => {
    editorSql.value = sql
  }
  const loadFromHistory = (item: QueryEditorHistoryEntry) => {
    editorSql.value = item.sql
    activeTab.value = 'editor'
  }
  const deleteHistory = (event: Event, item: QueryEditorHistoryEntry) => {
    historyList.value = historyList.value.filter((entry) => entry.id !== item.id)
    emit('delete-query', event, item)
  }

  const resultStatus = computed(() => {
    if (running.value) return 'Running the query.'
    if (!results.value) return ''
    if (results.value.type !== 'rows') return results.value.text
    const count = results.value.rows.length
    return `${count} ${count === 1 ? 'row' : 'rows'} returned.`
  })

  const runQuery = (event: Event) => {
    const sql = editorSql.value.trim()
    if (!sql || running.value) return
    emit('run', event, sql)
  }
  useShortcuts({
    keys: 'meta+enter',
    label: 'Run query',
    group: 'Page',
    when: () => !running.value,
    handler: (event) => runQuery(event)
  })
  const onHistoryAction = (event: Event, value: unknown, item: QueryEditorHistoryEntry) => {
    if (value === 'run') {
      applyTemplate(item.sql)
      runQuery(event)
      return
    }
    deleteHistory(event, item)
  }
  const downloadResults = (event: MouseEvent) => {
    if (results.value) emit('download-results', event, results.value)
  }

  const templates: QueryTemplate[] = [
    {
      title: 'Create table',
      description: 'Create a basic customers table with auto-increment ID and timestamp',
      icon: 'az az-table',
      sql: `CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`
    },
    {
      title: 'Insert data',
      description: 'Insert sample customer records into the customers table',
      icon: 'az az-circle-plus',
      sql: `INSERT INTO customers (name, email) VALUES
  ('Jane Doe', 'jane.doe@example.com'),
  ('John Smith', 'john.smith@example.com'),
  ('Alex Morgan', 'alex.morgan@example.com');`
    },
    {
      title: 'Select all',
      description: 'Retrieve all records from customers table with limit',
      icon: 'az az-list',
      sql: `SELECT id, name, email, created_at
FROM customers
ORDER BY created_at DESC
LIMIT 100;`
    },
    {
      title: 'Count records',
      description: 'Count total number of records in customers table',
      icon: 'az az-hash',
      sql: 'SELECT COUNT(*) AS total_customers FROM customers;'
    },
    {
      title: 'Related table',
      description: 'Create an orders table that references the customers table',
      icon: 'az az-box',
      sql: `CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers (id),
  total NUMERIC NOT NULL
);`
    },
    {
      title: 'Insert related rows',
      description: 'Insert sample orders for existing customers',
      icon: 'az az-arrow-right-left',
      sql: `INSERT INTO orders (customer_id, total) VALUES
  (1, 42.50),
  (3, 18.00);`
    },
    {
      title: 'Join tables',
      description: 'List every order with the name of the customer who placed it',
      icon: 'az az-search',
      sql: `SELECT orders.id, customers.name, orders.total
FROM orders
JOIN customers ON customers.id = orders.customer_id
ORDER BY orders.id DESC;`
    },
    {
      title: 'Create index',
      description: 'Create an index to speed up lookups of orders by customer',
      icon: 'az az-sitemap',
      sql: `CREATE INDEX IF NOT EXISTS orders_customer_id_idx
ON orders (customer_id);`
    },
    {
      title: 'Top customers',
      description: 'Find the 3 customers with the highest order totals',
      icon: 'az az-arrow-down-wide-narrow',
      sql: `SELECT customers.name, SUM(orders.total) AS total_spent
FROM customers
JOIN orders ON orders.customer_id = customers.id
GROUP BY customers.id
ORDER BY total_spent DESC
LIMIT 3;`
    }
  ]
  const templateQuery = ref('')
  const filteredTemplates = computed(() => {
    const term = templateQuery.value.trim().toLowerCase()
    if (!term) return templates
    return templates.filter(
      (template) =>
        template.title.toLowerCase().includes(term) ||
        template.description.toLowerCase().includes(term)
    )
  })
  watch(templatesOpen, (value) => {
    if (value) templateQuery.value = ''
  })
  const chooseTemplate = (template: QueryTemplate) => {
    applyTemplate(template.sql)
    templatesOpen.value = false
  }
</script>

<template>
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
    <PageTabs v-model="activeTab">
      <Tabs.Trigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :label="tab.label"
      />
    </PageTabs>

    <section
      v-if="activeTab === 'tables'"
      class="animate-page-enter motion-reduce:animate-none relative flex min-h-0 flex-1 overflow-hidden"
    >
      <div
        class="flex min-h-0 [--sidebar-width:var(--container-2xs)] max-md:absolute max-md:inset-y-0 max-md:start-0 max-md:z-10 max-md:max-w-[calc(100%-var(--spacing-2xl))] max-md:bg-(--bg-surface) max-md:shadow-(--shadow-sm) md:contents"
      >
        <Sidebar
          v-model:width="leftWidth"
          v-model:open="leftOpen"
          resizable
          collapsible
          aria-label="Tables"
          collapse-aria-label="Hide the tables panel"
          expand-aria-label="Show the tables panel"
          resize-aria-label="Resize the tables panel"
        >
          <template #header>
            <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-xs)">
              <div class="flex items-center justify-between gap-(--spacing-xs)">
                <span class="text-heading-2xs text-(--text-default)">Tables</span>
                <div class="flex items-center gap-(--spacing-2xs)">
                  <Tooltip content="Refresh tables">
                    <IconButton
                      icon="az az-refresh"
                      variant="outline"
                      size="small"
                      aria-label="Refresh tables"
                      @click="(event: MouseEvent) => emit('refresh-tables', event)"
                    />
                  </Tooltip>
                  <Tooltip content="Create Table">
                    <IconButton
                      icon="az az-plus"
                      variant="outline"
                      size="small"
                      aria-label="Create Table"
                      @click="(event: MouseEvent) => emit('create-table', event)"
                    />
                  </Tooltip>
                </div>
              </div>
              <Input
                v-model="tableSearch"
                size="medium"
                class="w-full"
                placeholder="Search tables"
                aria-label="Search tables"
              >
                <template #leading>
                  <i
                    class="az az-search"
                    aria-hidden="true"
                  />
                </template>
              </Input>
            </div>
          </template>
          <div>
            <div
              v-if="loading"
              class="flex flex-col gap-(--spacing-xs) px-(--spacing-xs) py-(--spacing-sm)"
              aria-busy="true"
              aria-label="Loading tables"
            >
              <Skeleton
                v-for="line in 4"
                :key="line"
                height="1.5rem"
              />
            </div>
            <p
              v-else-if="!tableList.length"
              class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
            >
              No tables created yet
            </p>
            <EmptyState
              v-else-if="!filteredTables.length"
              size="small"
              icon="az az-search"
              :title="`No tables match “${tableSearch}”`"
            >
              <template #actions>
                <Button
                  label="Clear search"
                  variant="outline"
                  size="small"
                  @click="tableSearch = ''"
                />
              </template>
            </EmptyState>
            <div
              v-else
              class="flex flex-col gap-(--spacing-2xs)"
            >
              <div
                v-for="table in filteredTables"
                :key="table.id"
                class="group flex items-center gap-(--spacing-2xs)"
              >
                <Item
                  clickable
                  variant="option"
                  :aria-pressed="selectedTable?.id === table.id"
                  class="min-w-0 flex-1"
                  @click="selectTable(table.id)"
                >
                  <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                    <i
                      class="az az-table shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="min-w-0 truncate text-label-sm">{{ table.name }}</span>
                  </span>
                </Item>
                <DropdownMenu
                  side="bottom"
                  align="end"
                  @select="(event, value) => onTableAction(event, value, table)"
                >
                  <DropdownMenu.Trigger>
                    <Tooltip :content="`Actions for ${table.name}`">
                      <IconButton
                        icon="az az-ellipsis"
                        variant="ghost"
                        size="small"
                        :aria-label="`Actions for ${table.name}`"
                      />
                    </Tooltip>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="delete"
                      label="Delete table"
                    >
                      <template #leading
                        ><i
                          class="az az-trash"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </Sidebar>
      </div>

      <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div
          v-if="!selectedTable"
          class="flex flex-1 items-center justify-center p-(--spacing-md)"
        >
          <EmptyState
            bordered
            size="medium"
            icon="az az-table"
            title="No tables yet"
            description="Create your first table to store your data."
            class="w-full max-w-(--container-2xl)"
          >
            <template #actions>
              <div class="w-full md:w-fit">
                <Button
                  label="Create Table"
                  icon="az az-plus"
                  variant="secondary"
                  size="medium"
                  class="w-full"
                  @click="(event: MouseEvent) => emit('create-table', event)"
                />
              </div>
            </template>
          </EmptyState>
        </div>

        <div
          v-else
          class="flex min-h-0 flex-1 flex-col"
        >
          <div
            class="flex items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
          >
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <div
                v-if="!leftOpen"
                class="flex shrink-0 md:hidden"
              >
                <Button
                  label="Tables"
                  icon="az az-table"
                  variant="outline"
                  size="small"
                  @click="leftOpen = true"
                />
              </div>
              <i
                class="az az-table shrink-0 text-(--text-muted) max-md:hidden"
                aria-hidden="true"
              />
              <span class="truncate text-heading-2xs text-(--text-default)">{{
                selectedTable.name
              }}</span>
            </div>
            <ToggleGroup
              v-model="tableView"
              :options="tableViewOptions"
              aria-label="Table view"
            />
          </div>

          <div
            v-if="tableView === 'data'"
            class="flex min-h-0 flex-1 flex-col"
          >
            <div
              class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
            >
              <div class="flex min-w-0 flex-1 md:max-w-(--container-lg)">
                <Input
                  v-model="rowFilter"
                  size="medium"
                  class="w-full"
                  :placeholder="filterPlaceholder"
                  aria-label="Filter rows"
                >
                  <template #leading>
                    <i
                      class="az az-search"
                      aria-hidden="true"
                    />
                  </template>
                </Input>
              </div>
              <div class="ms-auto flex items-center gap-(--spacing-xs)">
                <Button
                  label="Sort"
                  variant="outline"
                  size="medium"
                  icon="az az-sort"
                />
                <Tooltip content="Refresh">
                  <IconButton
                    icon="az az-refresh"
                    variant="outline"
                    size="medium"
                    aria-label="Refresh"
                    @click="(event: MouseEvent) => emit('refresh', event)"
                  />
                </Tooltip>
                <Button
                  label="Insert"
                  variant="primary"
                  size="medium"
                  icon="az az-plus"
                  @click="(event: MouseEvent) => emit('insert-row', event, selectedTable!)"
                />
              </div>
            </div>

            <div
              v-if="selectedKeys.length && !error"
              class="flex flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs)"
            >
              <span class="text-label-sm text-(--text-default)"
                >{{ selectedKeys.length }} selected</span
              >
              <Button
                label="Clear selection"
                variant="ghost"
                size="small"
                @click="selectedKeys = []"
              />
              <div class="ms-auto flex items-center gap-(--spacing-xs)">
                <Button
                  :label="`Delete ${selectedKeys.length} ${selectedKeys.length === 1 ? 'row' : 'rows'}`"
                  variant="outline"
                  size="small"
                  icon="az az-trash"
                  @click="deleteSelected"
                />
              </div>
            </div>
            <div
              v-if="error"
              class="p-(--spacing-md)"
            >
              <Alert
                severity="danger"
                :label="error"
                action-label="Retry"
                @action="(event: MouseEvent) => emit('retry', event)"
              />
            </div>
            <div
              v-else
              class="min-h-0 flex-1 overflow-auto"
            >
              <DataTable
                v-model:selected-keys="selectedKeys"
                :data="filteredRows"
                :columns="dataColumns"
                row-key="__k"
                selectable
                sortable
                paginated
                :page-size="25"
                :page-size-options="[25, 50, 100]"
                density="compact"
                :loading="loading"
                :bordered="false"
                :aria-label="`Rows of ${selectedTable.name}`"
              >
                <template
                  v-for="column in selectedTable.columns"
                  :key="column.id"
                  #[`header-${column.name}`]
                >
                  <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                    <span class="truncate">{{ column.name }}</span>
                    <span class="shrink-0 text-body-xs text-(--text-muted)">{{ column.type }}</span>
                    <i
                      v-if="column.primaryKey"
                      class="az az-key shrink-0 text-(--primary)"
                      role="img"
                      aria-label="Primary key"
                    />
                  </span>
                </template>
                <template
                  v-for="column in selectedTable.columns"
                  :key="column.id"
                  #[`cell-${column.name}`]="{ value }"
                >
                  <span
                    :data-null="isNull(value) || null"
                    class="truncate font-code text-label-code-sm text-(--text-default) data-null:italic data-null:text-(--text-muted)"
                    >{{ displayCell(value) }}</span
                  >
                </template>
                <template #cell-__actions="{ row }">
                  <Tooltip :content="`Delete row ${row['id'] ?? row.__k}`">
                    <IconButton
                      icon="az az-trash"
                      variant="ghost"
                      size="small"
                      :aria-label="`Delete row ${row['id'] ?? row.__k}`"
                      @click="(event: MouseEvent) => deleteRow(event, row)"
                    />
                  </Tooltip>
                </template>
                <template #empty>
                  <EmptyState
                    key="empty-state-1"
                    v-if="!tableRows.length"
                    size="small"
                    icon="az az-table"
                    title="This table is empty"
                    description="Insert a row, import a CSV file or drop one here."
                  >
                    <template #actions>
                      <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                        <Button
                          label="Insert row"
                          variant="secondary"
                          size="medium"
                          icon="az az-plus"
                          @click="(event: MouseEvent) => emit('insert-row', event, selectedTable!)"
                        />
                        <Button
                          label="Import data from CSV"
                          variant="outline"
                          size="medium"
                          icon="az az-upload"
                          @click="(event: MouseEvent) => emit('import-csv', event, selectedTable!)"
                        />
                      </div>
                    </template>
                  </EmptyState>
                  <EmptyState
                    key="empty-state-2"
                    v-else
                    size="small"
                    icon="az az-search"
                    :title="`No rows match “${rowFilter}”`"
                    description="Change the filter to see the rows."
                  >
                    <template #actions>
                      <Button
                        label="Clear filter"
                        variant="outline"
                        size="small"
                        @click="rowFilter = ''"
                      />
                    </template>
                  </EmptyState>
                </template>
              </DataTable>
            </div>
          </div>

          <div
            v-else
            class="flex min-h-0 flex-1 flex-col gap-(--layout-group-gap) overflow-auto p-(--spacing-md)"
          >
            <div class="flex items-center justify-between gap-(--spacing-sm)">
              <p class="text-heading-2xs text-(--text-default)">Columns</p>
              <Button
                label="Add column"
                variant="outline"
                size="medium"
                icon="az az-plus"
                @click="(event: MouseEvent) => emit('add-column', event, selectedTable!)"
              />
            </div>
            <Card :padded="false">
              <template #default>
                <DataTable
                  :data="schemaRows"
                  :columns="schemaColumns"
                  row-key="id"
                  :bordered="false"
                >
                  <template #cell-name="{ value }">
                    <span class="min-w-0 truncate">{{ value }}</span>
                  </template>
                  <template #cell-type="{ value }">
                    <Tag
                      :label="value"
                      severity="neutral"
                      size="medium"
                    />
                  </template>
                  <template #cell-constraints="{ value }">
                    <span class="text-body-sm text-(--text-muted)">{{ value || '—' }}</span>
                  </template>
                </DataTable>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <section
      v-else
      class="relative flex min-h-0 flex-1 overflow-hidden"
    >
      <div
        class="flex min-h-0 [--sidebar-width:var(--container-2xs)] max-md:absolute max-md:inset-y-0 max-md:start-0 max-md:z-10 max-md:max-w-[calc(100%-var(--spacing-2xl))] max-md:bg-(--bg-surface) max-md:shadow-(--shadow-sm) md:contents"
      >
        <Sidebar
          v-model:width="leftWidth"
          v-model:open="leftOpen"
          resizable
          collapsible
          aria-label="Query history"
          collapse-aria-label="Hide the query history"
          expand-aria-label="Show the query history"
          resize-aria-label="Resize the query history panel"
        >
          <template #header>
            <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-xs)">
              <span class="text-heading-2xs text-(--text-default)">Query history</span>
              <Input
                v-model="historySearch"
                size="medium"
                class="w-full"
                placeholder="Search queries"
                aria-label="Search queries"
              >
                <template #leading>
                  <i
                    class="az az-search"
                    aria-hidden="true"
                  />
                </template>
              </Input>
            </div>
          </template>
          <div>
            <p
              v-if="!filteredHistory.length"
              class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
            >
              No queries yet
            </p>
            <div
              v-else
              class="flex flex-col gap-(--spacing-2xs)"
            >
              <div
                v-for="item in filteredHistory"
                :key="item.id"
                class="flex items-center gap-(--spacing-2xs)"
              >
                <Item
                  clickable
                  variant="option"
                  class="min-w-0 flex-1"
                  :title="oneLine(item.sql)"
                  @click="loadFromHistory(item)"
                >
                  <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                    <span class="min-w-0 truncate font-code text-label-code-sm">{{
                      oneLine(item.sql)
                    }}</span>
                  </span>
                </Item>
                <DropdownMenu
                  side="bottom"
                  align="end"
                  @select="(event, value) => onHistoryAction(event, value, item)"
                >
                  <DropdownMenu.Trigger>
                    <Tooltip :content="`Actions for ${oneLine(item.sql)}`">
                      <IconButton
                        icon="az az-ellipsis"
                        variant="ghost"
                        size="small"
                        :aria-label="`Actions for ${oneLine(item.sql)}`"
                      />
                    </Tooltip>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="run"
                      label="Run query"
                    >
                      <template #leading
                        ><i
                          class="az az-play"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      value="delete"
                      label="Delete query"
                    >
                      <template #leading
                        ><i
                          class="az az-trash"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </Sidebar>
      </div>

      <div class="flex min-w-0 flex-1 flex-col overflow-auto">
        <div
          class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
        >
          <div
            v-if="!leftOpen"
            class="flex shrink-0 md:hidden"
          >
            <Button
              label="History"
              icon="az az-history"
              variant="outline"
              size="medium"
              @click="leftOpen = true"
            />
          </div>
          <Button
            variant="primary"
            size="medium"
            icon="az az-play"
            :loading="running"
            :aria-keyshortcuts="toAriaKeyshortcuts('meta+enter')"
            @click="runQuery"
          >
            Run query
            <Kbd
              meta
              key-name="enter"
              size="small"
              aria-hidden="true"
            />
          </Button>
          <div class="ms-auto flex items-center gap-(--spacing-xs)">
            <Button
              label="Prettify"
              variant="outline"
              size="medium"
              icon="az az-align-left"
              :disabled="running"
            />
            <Button
              label="Templates"
              variant="outline"
              size="medium"
              icon="az az-bolt"
              :disabled="running"
              @click="templatesOpen = true"
            />
          </div>
        </div>

        <CodeEditor
          v-model="editorSql"
          language="sql"
          path="query.sql"
          height="14rem"
          :bordered="false"
          :readonly="running"
          :markers="editorMarkers"
          aria-label="SQL editor"
        />

        <div
          class="flex flex-col border-t-(length:--border-width-default) border-(--border-default)"
        >
          <div
            class="flex flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
          >
            <span class="shrink-0 text-heading-2xs text-(--text-default)"> Results </span>
            <div class="flex ms-(--spacing-sm) min-w-0 flex-1 md:max-w-(--container-sm)">
              <Input
                v-model="resultSearch"
                size="medium"
                class="w-full"
                placeholder="Search"
                aria-label="Search results"
                :disabled="!resultRows.length"
              >
                <template #leading>
                  <i
                    class="az az-search"
                    aria-hidden="true"
                  />
                </template>
              </Input>
            </div>
            <div class="ms-auto flex items-center gap-(--spacing-xs)">
              <ToggleGroup
                v-model="resultView"
                :options="resultViewOptions"
                aria-label="Result view"
              />
              <Tooltip content="Refresh results">
                <IconButton
                  icon="az az-refresh"
                  variant="outline"
                  size="medium"
                  aria-label="Refresh results"
                  :loading="running"
                  @click="runQuery"
                />
              </Tooltip>
              <Tooltip content="Download results">
                <IconButton
                  icon="az az-download"
                  variant="outline"
                  size="medium"
                  aria-label="Download results"
                  :disabled="!resultRows.length"
                  @click="downloadResults"
                />
              </Tooltip>
              <Tooltip content="Toggle columns">
                <IconButton
                  icon="az az-table"
                  variant="outline"
                  size="medium"
                  aria-label="Toggle columns"
                  :disabled="!resultRows.length"
                />
              </Tooltip>
            </div>
          </div>

          <div class="min-h-(--container-3xs)">
            <p
              role="status"
              class="sr-only"
            >
              {{ resultStatus }}
            </p>
            <div
              v-if="running"
              class="flex flex-col gap-(--spacing-sm) p-(--spacing-md)"
              aria-busy="true"
            >
              <Skeleton
                v-for="line in 4"
                :key="line"
                height="2rem"
              />
            </div>
            <DataTable
              v-else-if="resultRows.length && resultView === 'table'"
              :data="filteredResultRows"
              :columns="resultColumns"
              row-key="__k"
              paginated
              :page-size="50"
              :page-size-options="[10, 25, 50, 100]"
              :bordered="false"
            />
            <CodeBlock
              v-else-if="resultRows.length && resultView === 'json'"
              :code="resultJson"
              language="json"
              copy-aria-label="Copy the results as JSON"
              :bordered="false"
            />
            <div
              v-else-if="results && (results.type === 'message' || results.type === 'error')"
              class="p-(--spacing-md)"
            >
              <Alert
                :severity="results.type === 'error' ? 'danger' : 'success'"
                :label="results.text"
              />
            </div>
            <div
              v-else
              class="flex min-h-(--container-3xs) items-center justify-center p-(--spacing-lg)"
            >
              <EmptyState
                title="Ready to execute"
                description="Execute a query to see the results here."
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <Drawer
      v-model:open="templatesOpen"
      size="large"
      side="end"
    >
      <DrawerContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>SQL quick templates</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              Pick a snippet to load it into the editor.
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
          <div class="flex flex-col gap-(--spacing-md)">
            <Input
              v-model="templateQuery"
              size="large"
              class="w-full"
              placeholder="Search templates"
              aria-label="Search templates"
            >
              <template #leading>
                <i
                  class="az az-search"
                  aria-hidden="true"
                />
              </template>
            </Input>

            <div
              v-if="filteredTemplates.length"
              class="grid grid-cols-1 gap-(--spacing-sm) md:grid-cols-2"
            >
              <Item
                v-for="template in filteredTemplates"
                :key="template.title"
                variant="outline"
                clickable
                @click="chooseTemplate(template)"
              >
                <Item.Media>
                  <i
                    :class="template.icon"
                    class="text-(--text-muted)"
                    aria-hidden="true"
                  />
                </Item.Media>
                <Item.Content>
                  <Item.Title>{{ template.title }}</Item.Title>
                  <Item.Description>{{ template.description }}</Item.Description>
                </Item.Content>
              </Item>
            </div>

            <EmptyState
              v-else
              size="small"
              icon="az az-search"
              :title="`No templates match “${templateQuery}”`"
              description="Try another name or statement."
            >
              <template #actions>
                <Button
                  label="Clear search"
                  variant="outline"
                  size="small"
                  @click="templateQuery = ''"
                />
              </template>
            </EmptyState>
          </div>
        </PanelBody>
      </DrawerContent>
    </Drawer>

    <ConfirmDialog
      v-model:open="rowsDeleteOpen"
      :title="rowsDeleteCount === 1 ? 'Delete row' : `Delete ${rowsDeleteCount} rows`"
      :description="`${rowsDeleteCount === 1 ? 'The row is' : `${rowsDeleteCount} rows are`} deleted from ${selectedTable?.name ?? 'the table'}. This can't be undone.`"
      :confirm-label="`Delete ${rowsDeleteNoun}`"
      size="small"
      @confirm="confirmRowsDelete"
    />

    <ConfirmDialog
      v-model:open="tableDeleteOpen"
      title="Delete table"
      :description="`${tablePendingDelete?.name ?? 'The table'} and its ${tablePendingDelete?.rows.length ?? 0} rows are deleted. This can't be undone.`"
      confirm-label="Delete table"
      :confirmation-phrase="tablePendingDelete?.name ?? ''"
      size="medium"
      @confirm="confirmTableDelete"
    />
  </div>
</template>
```

## `sample.ts`

```ts
import type {
  QueryEditorHistoryEntry,
  QueryEditorResult,
  QueryEditorTable
} from './view-query-editor.vue'

export const sampleSql = `CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`

export const sampleSelectSql = `SELECT id, name, email, created_at
FROM customers
ORDER BY created_at DESC
LIMIT 100;`

const customers: QueryEditorTable = {
  id: 'tbl-customers',
  name: 'customers',
  columns: [
    { id: 'col-1', name: 'id', type: 'int8', primaryKey: true, notNull: true },
    { id: 'col-2', name: 'name', type: 'text', primaryKey: false, notNull: true },
    { id: 'col-3', name: 'email', type: 'text', primaryKey: false, notNull: true },
    {
      id: 'col-4',
      name: 'created_at',
      type: 'timestamptz',
      primaryKey: false,
      notNull: false
    }
  ],
  rows: [
    {
      __k: 'row-1',
      id: 1,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      created_at: '2026-07-21 08:15:00'
    },
    {
      __k: 'row-2',
      id: 2,
      name: 'John Smith',
      email: 'john.smith@example.com',
      created_at: '2026-07-21 08:15:01'
    },
    {
      __k: 'row-3',
      id: 3,
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      created_at: null
    }
  ]
}

const orders: QueryEditorTable = {
  id: 'tbl-orders',
  name: 'orders',
  columns: [
    { id: 'col-5', name: 'id', type: 'int8', primaryKey: true, notNull: true },
    { id: 'col-6', name: 'customer_id', type: 'int8', primaryKey: false, notNull: true },
    { id: 'col-7', name: 'total', type: 'numeric', primaryKey: false, notNull: true }
  ],
  rows: [
    { __k: 'row-4', id: 1001, customer_id: 1, total: '42.50' },
    { __k: 'row-5', id: 1002, customer_id: 3, total: '18.00' }
  ]
}

const invoices: QueryEditorTable = {
  id: 'tbl-invoices',
  name: 'invoices',
  columns: [
    { id: 'col-8', name: 'id', type: 'int8', primaryKey: true, notNull: true },
    {
      id: 'col-9',
      name: 'created_at',
      type: 'timestamptz',
      primaryKey: false,
      notNull: false
    }
  ],
  rows: []
}

const eventKinds = ['page_view', 'sign_in', 'checkout', 'search']
const eventPaths = ['/', '/pricing', '/docs/start', '/cart', '/account']

const events: QueryEditorTable = {
  id: 'tbl-events',
  name: 'events',
  columns: [
    { id: 'col-10', name: 'id', type: 'int8', primaryKey: true, notNull: true },
    {
      id: 'col-11',
      name: 'occurred_at',
      type: 'timestamptz',
      primaryKey: false,
      notNull: true
    },
    { id: 'col-12', name: 'kind', type: 'text', primaryKey: false, notNull: true },
    { id: 'col-13', name: 'path', type: 'text', primaryKey: false, notNull: true },
    { id: 'col-14', name: 'status', type: 'int4', primaryKey: false, notNull: true },
    { id: 'col-15', name: 'duration_ms', type: 'int4', primaryKey: false, notNull: false }
  ],
  rows: Array.from({ length: 137 }, (_, index) => {
    const minute = String(index % 60).padStart(2, '0')
    const hour = String(8 + Math.floor(index / 60)).padStart(2, '0')
    return {
      __k: `ev-${index + 1}`,
      id: 5000 + index,
      occurred_at: `2026-11-10 ${hour}:${minute}:00`,
      kind: eventKinds[index % eventKinds.length],
      path: eventPaths[(index * 3) % eventPaths.length],
      status: index % 17 === 0 ? 500 : index % 9 === 0 ? 404 : 200,
      duration_ms: index % 11 === 0 ? null : 40 + ((index * 37) % 400)
    }
  })
}

export const sampleTables: QueryEditorTable[] = [customers, orders, invoices]

export const sampleTablesWithEvents: QueryEditorTable[] = [customers, events, orders, invoices]

export const sampleHistory: QueryEditorHistoryEntry[] = [
  { id: 'q-0', sql: sampleSql },
  {
    id: 'q-1',
    sql: `CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers (id),
  total NUMERIC NOT NULL
);`
  }
]

export const sampleHistoryAfterSelect: QueryEditorHistoryEntry[] = [
  { id: 'q-2', sql: sampleSelectSql },
  ...sampleHistory
]

export const sampleSelectResult: QueryEditorResult = {
  type: 'rows',
  columns: ['id', 'name', 'email', 'created_at'],
  rows: [
    {
      __k: 1,
      id: 1,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      created_at: '2026-07-21 08:15:00'
    },
    {
      __k: 2,
      id: 2,
      name: 'John Smith',
      email: 'john.smith@example.com',
      created_at: '2026-07-21 08:15:01'
    },
    {
      __k: 3,
      id: 3,
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      created_at: '2026-07-21 08:15:02'
    }
  ]
}
```
