# Query editor

The workspace of one SQL database. The user comes here to see which tables exist, read and edit a table's rows or its definition, and write and run queries against the data. Two tabs share one layout: a resizable side panel that lists things (tables, or past queries) beside a working pane that shows the one in use.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`. The editor is a workspace: its root carries `data-layout-fill`, so the layout's `main` stops scrolling, the root fills it, and the side panel, the rows, the editor and the results each scroll on their own at every width (`h-dvh` only sizes a standalone preview). CreateDatabase is a focused create page with its own header and no rail, rendered outside it.

## When to use

- A database resource opens on its tables and an editor that runs SQL against them.
- Users switch between browsing data (rows, columns, constraints) and writing queries without leaving the resource.
- Results need both a table view and the raw JSON, with paging over large result sets.

## When not to use

- A first-level list of databases: use `platform/view/table-view`.
- Rows of a resource that are not a SQL table (variables, records): use `platform/detail/record-table`.
- Editing a function or configuration as code: use `platform/edit/code-editor`.
- Files and folders of a storage resource: use `platform/view/file-browser`.
- Events explored over time: use `platform/view/split-view`.

## Building blocks

### A. Page tabs — `PageTabs`, `Tabs` (required)

`PageTabs` bound with `v-model` holds two `Tabs.Item`s, Tables and Editor. The tabs are the page's top level; each one swaps the side panel and the working pane together.

### B. Tables panel — `Sidebar`, `Tooltip`, `IconButton`, `Input`, `DropdownMenu` (required)

A resizable, collapsible start `Sidebar` named Tables, 288px at rest. Below `md` it starts collapsed (set on mount, so the server render matches), so the pane keeps the width of the phone; the same holds for the Editor tab's query history. Its header carries Refresh tables and Create Table `IconButton`s, each named by a `Tooltip`, over a Search tables `Input`. Each table row opens it in the pane and has a Table actions `DropdownMenu` with Delete table.

### C. Empty database — `Card`, `EmptyState`, `Button` (required)

A database with no tables replaces the pane with a `Card` holding an `EmptyState` (No tables yet) and a secondary Create Table `Button`. The side panel says the same thing in its own words; the tabs stay.

### D. Table data — `ToggleGroup`, `Input`, `Button`, `Tooltip`, `IconButton`, `TableRoot` (required)

The pane opens with the table name and a `ToggleGroup` switching Data and Definition. Data has a Filter rows `Input`, an outlined Sort `Button`, a Refresh `IconButton` and the primary Insert `Button`, over the rows. The rows are a compact `TableRoot` (`row-key="__k"`, `enable-row-selection`, `enable-sorting`, `paginated` at 25 rows with 25, 50 and 100 per page) named `Rows of <table>`: one column per table column with a `header-<name>` slot that shows the name, its type muted and a key on the primary key, a `cell-<name>` slot that renders values in the code font and `NULL` in muted italics, and a trailing action column with a Delete row `IconButton`. Sorting by a header sorts the loaded rows; selection resets when another table is picked. An empty table fills the `#empty` slot with Insert row and Import data from CSV; a filter that matches nothing says so with the filter text.

### E. Table definition — `Button`, `Card`, `TableRoot`, `Tag` (optional)

Definition shows a Columns heading with an Add column `Button`, over a flush `Card` holding a `TableRoot` of the column name, its type as a secondary `Tag`, and its constraints.

### F. Query history — `Sidebar`, `Input`, `DropdownMenu` (required)

On Editor the start `Sidebar` is named Query history, with a Search queries `Input` and one row per past query showing the statement on one line. Each row has a Query actions `DropdownMenu` with Run query and Delete query.

### G. Editor — `Button`, `CodeEditor` (required)

A toolbar with the primary Run query `Button` (`:loading` while it runs) and outlined Prettify and Templates `Button`s, over a `CodeEditor` (`language="sql"`, `path="query.sql"`, 14rem) named SQL editor. The plain editor ships by default; pass `loader` with `() => import('monaco-editor')` to get Monaco with SQL highlighting, themed from the tokens. While a query runs the editor is read-only and Prettify and Templates are disabled. A statement the database rejects puts an error marker on its line (`markers`) as well as the danger `Alert` in Results.

### H. Results — `Input`, `ToggleGroup`, `Tooltip`, `IconButton`, `TableRoot`, `Alert`, `EmptyState`, `PaginationRoot` (required)

A Results band with its own search `Input`, a `ToggleGroup` switching Table and JSON, and Refresh, Download and Columns `IconButton`s named by `Tooltip`s. A successful run shows a success `Alert` with what ran and the rows in a `TableRoot`; a statement the database rejects shows a danger `Alert` with the reason and what to do (`The statement wasn't executed: near "SELEC", a syntax error. Check the statement and run it again.`), and the statement stays in the editor; before anything runs an `EmptyState` reads Ready to execute. A `PaginationRoot` at 50 rows sits under the band.

### I. Templates drawer — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `DrawerClose`, `PanelContent`, `Input` (optional)

Templates opens a large right `Drawer` titled SQL quick templates with a one-line description, a Search templates `Input` and one card per snippet. Choosing a card loads its SQL into the editor and closes the drawer.

### J. Bulk row delete — `Button` (optional)

Variant TableData only; it raises its toast with `toast`.

With rows selected, a danger `Delete 2 rows` `Button` joins the Data toolbar (`:loading` while it runs). Deleting rows is not a deploy: the outcome is a success toast `2 rows deleted from events.` whose action fits the rows, Undo, which puts them back. Never View deployments, Edit or Redeploy.

### K. Create database page — `Input`, `Button` (optional)

Variant CreateDatabase only; it is its own focused page outside `ConsoleLayout`, with the creation header (`GlobalHeader` with `Breadcrumb`), and adds `PageHeader`, `SettingsSection`, `SettingRow`, `Item`, `HelperText`, `Switch` and `SaveBar`, and raises its toasts with `toast`. Being outside `ConsoleLayout` does not make it an app root: it is still a route of the same app, so its toasts ride the app's one region like every other page's.

The page the Databases list's Create opens, taken from the design sample's create database page: a back `IconButton` and the `Databases / Create Database` crumb, a small `PageHeader` (`Create Database`, `A SQL database that applications, functions and APIs can query at the edge.`), a General section with one Name row (6 to 50 letters, numbers and hyphens; it cannot be changed later) and a collapsible Advanced section with the Active `Switch`. The `SaveBar` is `kind="centered"`, the create-page footer: a raised card centred over the bottom of the scroll region, always shown, that says `Unsaved changes` while the form differs from its last saved state and holds Cancel and the primary `Create Database` (`:loading` while it runs; the fieldset is disabled meanwhile). Validation runs on submit: an empty or malformed name turns the field invalid with its reason and focus returns to it. The server's answer follows the form-error rule: a name that already exists comes back on the field (`A database named acme-store already exists. Pick another name.`); a request that never arrived is a danger toast with Retry that keeps the entries. Success is a toast `Database orders-eu created.` with the actions that fit a new, empty database: Open database and Create Table. Provisioning a database is not a deploy, so Edit and Redeploy do not apply.

### L. Import data from CSV — `Drawer`, `Alert`, `TableRoot`, `Button` (optional)

Variant ImportCsv only; it adds `FileDropzone`, `FileTokenGroup`, `Select`, `SettingsSection` and `PanelFooter`, and raises its toasts with `toast`.

An empty table's Data view offers Insert row and Import data from CSV, and accepts a CSV dropped on the empty state; both open a large drawer `Import data into <table>` in three sections. **File**: a `FileDropzone` with Browse files, then the file as a `FileTokenGroup` token (dismiss to pick another); a header with a blank name, a header with no rows or a file that is not `.csv` is an error on the token. **Map columns**: one row per CSV column with its first value as an example, an arrow, and a `Select` of the table's columns (name, type, `required` for NOT NULL ones) plus Skip; columns are matched by name, ignoring case, when the file is read, and everything else starts on Skip. **Check rows**: a polite sentence `4 of 7 rows are ready to insert. 3 rows have errors and will be skipped.`, the errors per line (`Line 4: active “maybe” is not true or false (bool).`; at most 10, then `And N more.`) and the first five valid rows as a `TableRoot` named `Import preview` under the table's column names. The footer holds Cancel and the primary `Insert 4 rows`.

Validation runs on Insert, as the form-error rule says: a table column mapped twice, a NOT NULL column with no CSV column, nothing mapped, or every row failing shows a danger `Alert` in the section that has to change, and nothing is inserted. A primary key may stay unmapped (the database assigns it). While inserting, the fieldset is disabled and Insert spins; then the drawer closes, the rows appear in the table and a success toast `4 rows inserted into subscribers.` says how many rows were skipped and offers Undo. Importing rows is not a deploy, so Edit and Redeploy do not apply.

## Do

- Keep both tabs on the same layout: side panel to list, working pane to act.
- Let the side panel resize and collapse, and keep its width when the user switches tabs.
- Make the editor read-only and disable its toolbar while a query runs, and show Run query loading.
- Show the outcome of a run in the Results band: the rows, a success `Alert` with what ran, or a danger `Alert` with why it failed.
- Offer JSON beside Table for results, so the raw shape is one click away.
- Confirm Delete table with `platform/delete/delete-with-confirmation`.
- Mark the page root with `data-layout-fill` (every variant but CreateDatabase), so the panes scroll on their own instead of the page.
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so this page body never renders a `Toaster`.

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
- Every icon-only button has an `aria-label` that matches its `Tooltip`; the rows table is named `Rows of <table>` and its selection checkboxes come from `TableRoot`, named per row.
- On Create Database, the Name error is the input's `aria-describedby` and focus returns to the input after a failed submit.
- `ToggleGroup`s are named ("Table view", "Result view") and the pagination is named "Results pagination".
- The templates drawer traps focus while open and closes on Escape.
- In the import drawer each mapping `Select` is named `Table column for <CSV column>`, the mapping and the per-line errors are named lists, and the ready count is a polite live region, so changing a mapping announces the new count.

## States

- Tables: the Tables tab with the tables listed in the side panel and the selected table's Data view in the pane.
- Schema: the Definition view of customers, with the Columns heading, Add column and a card of column name, type and constraints.
- EmptyDatabase: a database with no tables; the side panel says so and the pane shows the Create Table empty state.
- Query: the Editor tab after a query ran, with the history in the side panel, the statement in the editor and its rows in Results.
- Templates: the Editor tab before anything ran, with Results ready to execute and the SQL quick templates drawer behind the Templates button.
- TableData: the events table, 137 rows paged 25 at a time, with two rows selected and Delete 2 rows in the toolbar.
- ImportCsv: the empty subscribers table with the import drawer open on a seven-row file: `plan_name` still on Skip (Insert asks to map `plan`), `referrer` skipped, three lines with errors (a non-boolean, an empty required email, a date that does not parse).
- CreateDatabase: the create database page with its Name and Active fields; try `acme-store` for the name conflict and a name starting with `offline` for the failed request.
- Failed: the selected table's rows did not load; the Data view shows a danger `Alert` that names the table and offers Retry.

## Related

- `platform/view/table-view` — the database list this workspace is opened from.
- `platform/delete/delete-with-confirmation` — the dialog behind Delete table.
- `platform/edit/code-editor` — editing code that is not a query.
- `platform/edit/schema-editor` — the Create Table, Add column, Add row, Alter column and Truncate table drawers and dialogs behind this page's buttons.
- `platform/states/form-error` — the rule the Create Database name conflict follows.
- `platform/detail/record-table` — records of a resource without SQL.
- `TableRoot` — the definition and results tables; see `skills/webkit-tables` and `skills/webkit-layout`.
