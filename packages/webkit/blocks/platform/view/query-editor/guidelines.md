# Query editor

The workspace of one SQL database. The user comes here to see which tables exist, read and edit a table's rows or its definition, and write and run queries against the data. Two tabs share one layout: a resizable side panel that lists things (tables, or past queries) beside a working pane that shows the one in use.

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

### A. Console shell — `Sidebar`, `Brand`, `Command`, `Menu`, `Avatar`, `DropdownMenu`, `Tooltip`, `IconButton`, `ThemeSwitcher`, `Button`, `StatusIndicator`, `GlobalHeader`, `Breadcrumb`, `Kbd`, `ButtonHighlight`, `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent` (required)

The platform shell: the resizable, collapsible `Sidebar` with `Brand`, `Menu` and the account footer; the `GlobalHeader` with the Databases `Breadcrumb`, the `Command` palette and its `Kbd` hint, Create and the Agent `ButtonHighlight`; on a phone the same navigation in a right `Drawer`.

### B. Page tabs — `PageTabs`, `Tabs` (required)

`PageTabs` bound with `v-model` holds two `Tabs.Item`s, Tables and Editor. The tabs are the page's top level; each one swaps the side panel and the working pane together.

### C. Tables panel — `Sidebar`, `Tooltip`, `IconButton`, `Input`, `DropdownMenu` (required)

A resizable, collapsible start `Sidebar` named Tables, 288px at rest. Its header carries Refresh tables and Create Table `IconButton`s, each named by a `Tooltip`, over a Search tables `Input`. Each table row opens it in the pane and has a Table actions `DropdownMenu` with Delete table.

### D. Empty database — `Card`, `EmptyState`, `Button` (required)

A database with no tables replaces the pane with a `Card` holding an `EmptyState` (No tables yet) and a secondary Create Table `Button`. The side panel says the same thing in its own words; the tabs stay.

### E. Table data — `ToggleGroup`, `Input`, `Button`, `Tooltip`, `IconButton`, `Checkbox` (required)

The pane opens with the table name and a `ToggleGroup` switching Data and Definition. Data has a Filter rows `Input`, an outlined Sort `Button`, a Refresh `IconButton` and the primary Insert `Button`, over the rows. A header `Checkbox` selects all rows and each row has its own; the primary key column is marked, a Delete row `IconButton` sits on each row, and Previous page and Next page `IconButton`s page the data.

### F. Table definition — `Button`, `Card`, `TableRoot`, `Tag` (optional)

Definition shows a Columns heading with an Add column `Button`, over a flush `Card` holding a `TableRoot` of the column name, its type as a secondary `Tag`, and its constraints.

### G. Query history — `Sidebar`, `Input`, `DropdownMenu` (required)

On Editor the start `Sidebar` is named Query history, with a Search queries `Input` and one row per past query showing the statement on one line. Each row has a Query actions `DropdownMenu` with Run query and Delete query.

### H. Editor — `Button`, `Textarea` (required)

A toolbar with the primary Run query `Button` (`:loading` while it runs) and outlined Prettify and Templates `Button`s, over a monospaced, vertically resizable `Textarea` named SQL editor. While a query runs the editor, Prettify and Templates are disabled.

### I. Results — `Input`, `ToggleGroup`, `Tooltip`, `IconButton`, `TableRoot`, `Alert`, `EmptyState`, `PaginationRoot` (required)

A Results band with its own search `Input`, a `ToggleGroup` switching Table and JSON, and Refresh, Download and Columns `IconButton`s named by `Tooltip`s. A successful run shows a success `Alert` with what ran and the rows in a `TableRoot`; a statement the database rejects shows a danger `Alert` with the reason and what to do (`The statement wasn't executed: near "SELEC", a syntax error. Check the statement and run it again.`), and the statement stays in the editor; before anything runs an `EmptyState` reads Ready to execute. A `PaginationRoot` at 50 rows sits under the band.

### J. Templates drawer — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `DrawerClose`, `PanelContent`, `Input` (optional)

Templates opens a large right `Drawer` titled SQL quick templates with a one-line description, a Search templates `Input` and one card per snippet. Choosing a card loads its SQL into the editor and closes the drawer.

## Do

- Keep both tabs on the same layout: side panel to list, working pane to act.
- Let the side panel resize and collapse, and keep its width when the user switches tabs.
- Disable the editor and its toolbar while a query runs, and show Run query loading.
- Show the outcome of a run in the Results band: the rows, a success `Alert` with what ran, or a danger `Alert` with why it failed.
- Offer JSON beside Table for results, so the raw shape is one click away.
- Confirm Delete table with `platform/delete/delete-with-confirmation`.

## Don't

- Don't open a separate page for a table or a query; they open in the pane.
- Don't run a query on every keystroke; Run query is the only trigger.
- Don't hide the tabs when the database is empty.
- Don't put a second primary action in a pane; Insert on Data and Run query on Editor are the only ones.
- Don't let the results scroll the page sideways; they scroll inside their band.

## Copy

- **Tabs:** one noun each, e.g. "Tables", "Editor".
- **Create action:** `Create <Object>`, e.g. "Create Table", the same in the panel and the empty state.
- **Editor toolbar:** verb-first, e.g. "Run query", "Prettify", "Templates".
- **Editor placeholder:** one instruction, e.g. "Write your SQL query here".
- **Search:** names the scope, e.g. "Search tables", "Search queries", "Search templates".
- **Empty states:** title states the fact and the description says what to do, e.g. "No tables yet" with "Create your first table to store your data."; "Ready to execute" with "Execute a query to see the results here."
- **Row menus:** verb and object, e.g. "Delete table", "Run query", "Delete query".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- One `main` landmark; the tabs are a real tab list, so arrow keys move between Tables and Editor.
- Each side `Sidebar` is named (Tables, Query history) with its own collapse, expand and resize labels.
- The editor `Textarea` has the `aria-label` "SQL editor"; its placeholder is never its only label.
- Every icon-only button has an `aria-label` that matches its `Tooltip`; row checkboxes name their row, and the header checkbox reads "Select all rows".
- `ToggleGroup`s are named ("Table view", "Result view") and the pagination is named "Results pagination".
- The templates drawer traps focus while open and closes on Escape.

## States

- Tables: the Tables tab with the tables listed in the side panel and the selected table's Data view in the pane.
- Schema: the Definition view of customers, with the Columns heading, Add column and a card of column name, type and constraints.
- EmptyDatabase: a database with no tables; the side panel says so and the pane shows the Create Table empty state.
- Query: the Editor tab after a query ran, with the history in the side panel, the statement in the editor and its rows in Results.
- Templates: the Editor tab before anything ran, with Results ready to execute and the SQL quick templates drawer behind the Templates button.

## Related

- `platform/view/table-view` — the database list this workspace is opened from.
- `platform/delete/delete-with-confirmation` — the dialog behind Delete table.
- `platform/edit/code-editor` — editing code that is not a query.
- `platform/detail/record-table` — records of a resource without SQL.
- `TableRoot` — the definition and results tables; see `skills/webkit-tables` and `skills/webkit-layout`.
