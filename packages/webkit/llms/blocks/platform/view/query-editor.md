# QueryEditor (`platform/view/query-editor`)

> The query editor page placed in the platform shell: the Databases breadcrumb, then the Tables and Editor tabs, each pairing a resizable, collapsible `Sidebar` (288px at rest) with a working pane. On Editor the panel holds the query history and the pane stacks the Run query, Prettify and Templates toolbar, the SQL `CodeEditor`, and the Results band over its pagination; on Tables the panel lists the tables and the pane holds the selected table with its Data and Definition switch, its rows in a paged, selectable `TableRoot`. A database with no tables shows the Create Table empty state, and the Templates button opens the SQL quick templates drawer. Its page-level parts are `PageTabs`.

- Surface: product
- Source: `blocks/platform/view/query-editor/query-editor.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/view/query-editor")`
- Components: [Alert](../../../components/alert.md), [Avatar](../../../components/avatar.md), [Brand](../../../components/brand.md), [Breadcrumb](../../../components/breadcrumb.md), [Button](../../../components/button.md), [ButtonHighlight](../../../components/button-highlight.md), [Card](../../../components/card.md), [CodeEditor](../../../components/code-editor.md), [Command](../../../components/command.md), [Drawer](../../../components/drawer.md), `DrawerClose`, `DrawerContent`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, [DropdownMenu](../../../components/dropdown-menu.md), [EmptyState](../../../components/empty-state.md), [FileDropzone](../../../components/file-dropzone.md), [FileTokenGroup](../../../components/file-token-group.md), [GlobalHeader](../../../components/global-header.md), [HelperText](../../../components/helper-text.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [Menu](../../../components/menu.md), [PageHeader](../../../components/page-header.md), [PageTabs](../../../components/page-tabs.md), `PaginationRoot`, `PanelContent`, `PanelFooter`, `PanelHeader`, [SaveBar](../../../components/save-bar.md), [SearchTrigger](../../../components/search-trigger.md), [Select](../../../components/select.md), [SettingRow](../../../components/setting-row.md), [SettingsSection](../../../components/settings-section.md), [Sidebar](../../../components/sidebar.md), [StatusIndicator](../../../components/status-indicator.md), [Switch](../../../components/switch.md), `TableRoot`, [Tabs](../../../components/tabs.md), [Tag](../../../components/tag.md), [ThemeSwitcher](../../../components/theme-switcher.md), [Toast](../../../components/toast.md), [ToggleGroup](../../../components/toggle-group.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-layout`, `webkit-tables`, `webkit-ui-states`

## Asked as

query editor; sql editor; run query; query results; sql query page; query history; sql code editor; código sql; editor de consultas; editor sql; executar consulta; sql database; database tables; database detail; table schema; data grid; sql templates; banco de dados; banco de dados sql; tabelas do banco; create database; criar banco de dados; table rows; linhas da tabela; import csv; import data; csv import; importar csv; importar dados

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

### A. Console shell — `Sidebar`, `Brand`, `Command`, `Menu`, `Avatar`, `DropdownMenu`, `Tooltip`, `IconButton`, `ThemeSwitcher`, `Button`, `StatusIndicator`, `GlobalHeader`, `Breadcrumb`, `SearchTrigger`, `ButtonHighlight`, `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent` (required)

The platform shell: the resizable, collapsible `Sidebar` with `Brand`, `Menu` and the account footer; the `GlobalHeader` with the Databases `Breadcrumb`, the `SearchTrigger` (⌘K / Ctrl K) that opens the `Command` palette, Create and the Agent `ButtonHighlight`; on a phone the same navigation in a right `Drawer`.

### B. Page tabs — `PageTabs`, `Tabs` (required)

`PageTabs` bound with `v-model` holds two `Tabs.Item`s, Tables and Editor. The tabs are the page's top level; each one swaps the side panel and the working pane together.

### C. Tables panel — `Sidebar`, `Tooltip`, `IconButton`, `Input`, `DropdownMenu` (required)

A resizable, collapsible start `Sidebar` named Tables, 288px at rest. Below `md` it starts collapsed (set on mount, so the server render matches), so the pane keeps the width of the phone; the same holds for the Editor tab's query history. Its header carries Refresh tables and Create Table `IconButton`s, each named by a `Tooltip`, over a Search tables `Input`. Each table row opens it in the pane and has a Table actions `DropdownMenu` with Delete table.

### D. Empty database — `Card`, `EmptyState`, `Button` (required)

A database with no tables replaces the pane with a `Card` holding an `EmptyState` (No tables yet) and a secondary Create Table `Button`. The side panel says the same thing in its own words; the tabs stay.

### E. Table data — `ToggleGroup`, `Input`, `Button`, `Tooltip`, `IconButton`, `TableRoot` (required)

The pane opens with the table name and a `ToggleGroup` switching Data and Definition. Data has a Filter rows `Input`, an outlined Sort `Button`, a Refresh `IconButton` and the primary Insert `Button`, over the rows. The rows are a compact `TableRoot` (`row-key="__k"`, `enable-row-selection`, `enable-sorting`, `paginated` at 25 rows with 25, 50 and 100 per page) named `Rows of <table>`: one column per table column with a `header-<name>` slot that shows the name, its type muted and a key on the primary key, a `cell-<name>` slot that renders values in the code font and `NULL` in muted italics, and a trailing action column with a Delete row `IconButton`. Sorting by a header sorts the loaded rows; selection resets when another table is picked. An empty table fills the `#empty` slot with Insert row and Import data from CSV; a filter that matches nothing says so with the filter text.

### F. Table definition — `Button`, `Card`, `TableRoot`, `Tag` (optional)

Definition shows a Columns heading with an Add column `Button`, over a flush `Card` holding a `TableRoot` of the column name, its type as a secondary `Tag`, and its constraints.

### G. Query history — `Sidebar`, `Input`, `DropdownMenu` (required)

On Editor the start `Sidebar` is named Query history, with a Search queries `Input` and one row per past query showing the statement on one line. Each row has a Query actions `DropdownMenu` with Run query and Delete query.

### H. Editor — `Button`, `CodeEditor` (required)

A toolbar with the primary Run query `Button` (`:loading` while it runs) and outlined Prettify and Templates `Button`s, over a `CodeEditor` (`language="sql"`, `path="query.sql"`, 14rem) named SQL editor. The plain editor ships by default; pass `loader` with `() => import('monaco-editor')` to get Monaco with SQL highlighting, themed from the tokens. While a query runs the editor is read-only and Prettify and Templates are disabled. A statement the database rejects puts an error marker on its line (`markers`) as well as the danger `Alert` in Results.

### I. Results — `Input`, `ToggleGroup`, `Tooltip`, `IconButton`, `TableRoot`, `Alert`, `EmptyState`, `PaginationRoot` (required)

A Results band with its own search `Input`, a `ToggleGroup` switching Table and JSON, and Refresh, Download and Columns `IconButton`s named by `Tooltip`s. A successful run shows a success `Alert` with what ran and the rows in a `TableRoot`; a statement the database rejects shows a danger `Alert` with the reason and what to do (`The statement wasn't executed: near "SELEC", a syntax error. Check the statement and run it again.`), and the statement stays in the editor; before anything runs an `EmptyState` reads Ready to execute. A `PaginationRoot` at 50 rows sits under the band.

### J. Templates drawer — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `DrawerClose`, `PanelContent`, `Input` (optional)

Templates opens a large right `Drawer` titled SQL quick templates with a one-line description, a Search templates `Input` and one card per snippet. Choosing a card loads its SQL into the editor and closes the drawer.

### K. Bulk row delete — `Button` (optional)

Variant TableData only; it adds the `Toaster` with `toast`.

With rows selected, a danger `Delete 2 rows` `Button` joins the Data toolbar (`:loading` while it runs). Deleting rows is not a deploy: the outcome is a success toast `2 rows deleted from events.` whose action fits the rows, Undo, which puts them back. Never View deployments, Edit or Redeploy.

### L. Create database page — `GlobalHeader`, `Breadcrumb`, `Input`, `Button` (optional)

Variant CreateDatabase only; it is its own page and adds `PageHeader`, `SettingsSection`, `SettingRow`, `Item`, `HelperText`, `Switch`, `SaveBar` and the `Toaster` with `toast`.

The page the Databases list's Create opens, taken from the design sample's create database page: a back `IconButton` and the `Databases / Create Database` crumb, a small `PageHeader` (`Create Database`, `A SQL database that applications, functions and APIs can query at the edge.`), a General section with one Name row (6 to 50 letters, numbers and hyphens; it cannot be changed later) and a collapsible Advanced section with the Active `Switch`. The `SaveBar` says `Unsaved changes` while the form differs from its last saved state and holds Cancel and the primary `Create Database` (`:loading` while it runs; the fieldset is disabled meanwhile). Validation runs on submit: an empty or malformed name turns the field invalid with its reason and focus returns to it. The server's answer follows the form-error rule: a name that already exists comes back on the field (`A database named acme-store already exists. Pick another name.`); a request that never arrived is a danger toast with Retry that keeps the entries. Success is a toast `Database orders-eu created.` with the actions that fit a new, empty database: Open database and Create Table. Provisioning a database is not a deploy, so Edit and Redeploy do not apply.

### M. Import data from CSV — `Drawer`, `Alert`, `TableRoot`, `Button` (optional)

Variant ImportCsv only; it adds `FileDropzone`, `FileTokenGroup`, `Select`, `SettingsSection`, `PanelFooter` and the `Toaster` with `toast`.

An empty table's Data view offers Insert row and Import data from CSV, and accepts a CSV dropped on the empty state; both open a large drawer `Import data into <table>` in three sections. **File**: a `FileDropzone` with Browse files, then the file as a `FileTokenGroup` token (dismiss to pick another); a header with a blank name, a header with no rows or a file that is not `.csv` is an error on the token. **Map columns**: one row per CSV column with its first value as an example, an arrow, and a `Select` of the table's columns (name, type, `required` for NOT NULL ones) plus Skip; columns are matched by name, ignoring case, when the file is read, and everything else starts on Skip. **Check rows**: a polite sentence `4 of 7 rows are ready to insert. 3 rows have errors and will be skipped.`, the errors per line (`Line 4: active “maybe” is not true or false (bool).`; at most 10, then `And N more.`) and the first five valid rows as a `TableRoot` named `Import preview` under the table's column names. The footer holds Cancel and the primary `Insert 4 rows`.

Validation runs on Insert, as the form-error rule says: a table column mapped twice, a NOT NULL column with no CSV column, nothing mapped, or every row failing shows a danger `Alert` in the section that has to change, and nothing is inserted. A primary key may stay unmapped (the database assigns it). While inserting, the fieldset is disabled and Insert spins; then the drawer closes, the rows appear in the table and a success toast `4 rows inserted into subscribers.` says how many rows were skipped and offers Undo. Importing rows is not a deploy, so Edit and Redeploy do not apply.

### N. Search palette — `Command` (required)

The ⌘K palette the header search opens: `Command.Input`, one group of pages, and `Command.Empty` for no match. It owns the ⌘K / Ctrl K shortcut while mounted.

## Do

- Keep both tabs on the same layout: side panel to list, working pane to act.
- Let the side panel resize and collapse, and keep its width when the user switches tabs.
- Make the editor read-only and disable its toolbar while a query runs, and show Run query loading.
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
- **Import:** `Import data from CSV` opens `Import data into <table>`; the submit is `Insert <n> rows`; per-line errors read `Line <n>: <column> “<value>” is not <expected> (<type>).` or `<column> is empty and cannot be.`
- **Row menus:** verb and object, e.g. "Delete table", "Run query", "Delete query".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- One `main` landmark; the tabs are a real tab list, so arrow keys move between Tables and Editor.
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

## Variants

- `Tables` — primary (the code below)
- `Schema` — The Definition view of customers: the Columns heading with Add column over a card holding the column name, its type as a Tag, and its constraints.
- `EmptyDatabase` — A database with no tables yet: the side panel says so and the working pane shows the Create Table empty state.
- `Query` — The Editor tab after the Select all query ran: the query history in the side panel, the statement in the editor, and its three rows in the Results band, switchable to JSON.
- `Templates` — The Editor tab before anything ran, with the Results band ready to execute; the Templates button opens the SQL quick templates drawer, and choosing a card loads its SQL into the editor.
- `Failed` — The rows of the selected table failed to load: the Tables tab keeps the side panel and the table toolbar, and the Data view shows a danger Alert that names the table and offers Retry.
- `TableData` — The events table in the Data view: 137 rows in a compact `TableRoot` paged 25 at a time, each column header naming its type with a key on the primary key, `NULL` in muted italics, sortable headers and row selection. Two rows are selected, so Delete 2 rows joins the toolbar; it ends in a toast with Undo.
- `ImportCsv` — An empty table's Import data from CSV (also a CSV dropped on its empty state): a drawer that reads the file (`FileDropzone`, `FileTokenGroup`), maps each CSV column to a table column or Skip in a `Select` (matched by name first), checks every value against its column's type and NOT NULL with the errors listed per line, previews the first rows as they will be inserted, and inserts the valid rows with a spinner, then a toast with Undo that says how many rows were skipped.
- `CreateDatabase` — The Create Database page from the design sample: Name (6 to 50 letters, numbers and hyphens) and an Advanced section with Active, over a save bar with Cancel and Create Database. A taken name comes back on the field, a failed request is a toast with Retry, and success is a toast with Open database and Create Table.

Each variant is the same screen in another state: `get_pattern("platform/view/query-editor", { variant })`, or the file under `blocks/platform/view/query-editor/variants/`.

## Code (`Tables`)

```vue
<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import CodeEditor from '@aziontech/webkit/code-editor'
  import Command from '@aziontech/webkit/command'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Menu from '@aziontech/webkit/menu'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PaginationRoot from '@aziontech/webkit/pagination-root'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onMounted, ref, watch } from 'vue'

  const navGroups = [
    {
      items: [
        { id: 'home', label: 'Home', icon: 'pi pi-home', path: '/home' },
        { id: 'projects', label: 'Projects', icon: 'pi pi-folder', path: '/projects' },
        {
          id: 'deployments',
          label: 'Deployments',
          icon: 'pi pi-cloud-upload',
          path: '/deployments'
        }
      ]
    },
    {
      label: 'Build',
      items: [
        { id: 'resources', label: 'Resources', icon: 'pi pi-box', path: '/resources' },
        { id: 'services', label: 'Services', icon: 'pi pi-server', path: '/services' },
        { id: 'variables', label: 'Variables', icon: 'pi pi-sliders-h', path: '/variables' },
        { id: 'integrations', label: 'Integrations', icon: 'pi pi-link', path: '/integrations' },
        { id: 'templates', label: 'Templates', icon: 'pi pi-clone', path: '/templates' }
      ]
    },
    {
      label: 'Security',
      items: [
        { id: 'domains', label: 'Domains', icon: 'pi pi-globe', path: '/domains' },
        { id: 'policies', label: 'Policies', icon: 'pi pi-shield', path: '/policies' },
        { id: 'rule-sets', label: 'Rule sets', icon: 'pi pi-list', path: '/rule-sets' },
        { id: 'keys', label: 'Keys', icon: 'pi pi-key', path: '/keys' }
      ]
    },
    {
      label: 'Data',
      items: [
        {
          id: 'databases',
          label: 'Databases',
          icon: 'pi pi-database',
          path: '/databases',
          tagValue: 'Preview'
        },
        { id: 'storage', label: 'Storage', icon: 'pi pi-inbox', path: '/storage' }
      ]
    },
    {
      label: 'Observability',
      items: [
        { id: 'logs', label: 'Logs', icon: 'pi pi-file', path: '/logs' },
        {
          id: 'metrics-module',
          label: 'Metrics',
          icon: 'pi pi-chart-bar',
          kind: 'drill',
          href: '/metrics',
          groups: [
            {
              items: [{ id: 'metrics', label: 'Overview', path: '/metrics' }]
            },
            {
              label: 'Build',
              items: [
                {
                  id: 'metrics-resources',
                  label: 'Resources',
                  path: '/metrics',
                  query: { dashboard: 'resources' }
                },
                {
                  id: 'metrics-services',
                  label: 'Services',
                  path: '/metrics',
                  query: { dashboard: 'services' }
                },
                {
                  id: 'metrics-cache',
                  label: 'Cache',
                  path: '/metrics',
                  query: { dashboard: 'cache' }
                }
              ]
            },
            {
              label: 'Security',
              items: [
                {
                  id: 'metrics-domains',
                  label: 'Domains',
                  path: '/metrics',
                  query: { dashboard: 'domains' }
                },
                {
                  id: 'metrics-policies',
                  label: 'Policies',
                  path: '/metrics',
                  query: { dashboard: 'policies' }
                },
                {
                  id: 'metrics-rule-sets',
                  label: 'Rule sets',
                  path: '/metrics',
                  query: { dashboard: 'rule-sets' }
                }
              ]
            },
            {
              label: 'Data',
              items: [
                {
                  id: 'metrics-databases',
                  label: 'Databases',
                  path: '/metrics',
                  query: { dashboard: 'databases' }
                },
                {
                  id: 'metrics-storage',
                  label: 'Storage',
                  path: '/metrics',
                  query: { dashboard: 'storage' }
                }
              ]
            }
          ]
        },
        { id: 'events', label: 'Events', icon: 'pi pi-bolt', path: '/events' }
      ]
    },
    {
      label: 'More',
      items: [
        { id: 'catalog', label: 'Catalog', icon: 'pi pi-th-large', path: '/catalog' },
        {
          id: 'settings',
          label: 'Settings',
          icon: 'pi pi-cog',
          kind: 'drill',
          groups: [
            {
              label: 'Settings',
              items: [
                { id: 'settings-general', label: 'General', path: '/account' },
                {
                  id: 'settings-build-deployment',
                  label: 'Build and deployment',
                  path: '/account/build-deployment'
                },
                {
                  id: 'settings-environments',
                  label: 'Environments',
                  path: '/account/environments'
                },
                { id: 'settings-users', label: 'Users management', path: '/account/users' },
                { id: 'settings-teams', label: 'Teams and permissions', path: '/account/teams' }
              ]
            },
            {
              label: 'Access',
              items: [
                { id: 'settings-tokens', label: 'Personal tokens', path: '/personal-tokens' },
                { id: 'settings-credentials', label: 'Credentials', path: '/account/credentials' },
                { id: 'settings-security-mfa', label: 'Multi-factor auth' },
                { id: 'settings-security-sessions', label: 'Active sessions' },
                { id: 'settings-activity', label: 'Activity history', path: '/account/activity' }
              ]
            },
            {
              label: 'Billing',
              items: [
                { id: 'settings-billing', label: 'Billing and plan', path: '/account/billing' },
                { id: 'settings-invoices', label: 'Invoices' }
              ]
            }
          ]
        }
      ]
    }
  ]

  const recentRows = [
    {
      key: 'resources/1020655',
      name: 'resource-01',
      icon: 'pi pi-box',
      typeLabel: 'Resource',
      navId: 'resources'
    },
    {
      key: 'domains/domain-1020655',
      name: 'app.example.com',
      icon: 'pi pi-globe',
      typeLabel: 'Domain',
      navId: 'domains'
    },
    {
      key: 'databases/feature-flags',
      name: 'feature-flags',
      icon: 'pi pi-database',
      typeLabel: 'Database',
      navId: 'databases'
    }
  ]

  const accountCommands = [
    { id: 'settings', label: 'Account settings', icon: 'pi pi-cog' },
    { id: 'personal-tokens', label: 'Personal tokens', icon: 'pi pi-key' },
    { id: 'docs', label: 'Docs', icon: 'pi pi-book' },
    { id: 'logout', label: 'Log out', icon: 'pi pi-sign-out' }
  ]

  const breadcrumb = [{ label: 'Databases', href: '/databases' }, { label: 'acme-store' }]

  const activeId = ref('databases')
  const navOpen = ref(false)
  const paletteOpen = ref(false)
  const paletteQuery = ref('')
  const theme = ref('system')
  const railWidth = ref(null)
  const railCollapsed = ref(false)

  watch(paletteOpen, () => {
    paletteQuery.value = ''
  })

  const leaves = (items) =>
    items.flatMap((item) =>
      item.groups
        ? leaves(item.groups.flatMap((group) => group.items))
        : item.children
          ? leaves(item.children)
          : [item]
    )

  const paletteGroups = navGroups.flatMap((group, groupIndex) => {
    const blocks = []
    let run = []
    const flush = () => {
      if (run.length) {
        blocks.push({
          key: `area-${groupIndex}-${blocks.length}`,
          heading: group.label ?? '',
          items: leaves(run)
        })
      }
      run = []
    }
    for (const item of group.items) {
      if (item.groups || item.children) {
        flush()
        blocks.push({ key: item.id, heading: item.label, items: leaves([item]) })
      } else run.push(item)
    }
    flush()
    return blocks
  })

  const resolvedTheme = computed(() =>
    theme.value === 'system'
      ? globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme.value
  )

  const actionCommands = computed(() => [
    { id: 'create', label: 'Create Resource', icon: 'pi pi-plus-circle' },
    {
      id: 'theme',
      label: resolvedTheme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
      icon: resolvedTheme.value === 'dark' ? 'pi pi-sun' : 'pi pi-moon'
    },
    {
      id: 'sidebar',
      label: railCollapsed.value ? 'Expand sidebar' : 'Collapse sidebar',
      icon: railCollapsed.value ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left'
    }
  ])

  const onNavigate = (event, node) => {
    activeId.value = node.id
  }

  const onMobileNavigate = (event, node) => {
    onNavigate(event, node)
    navOpen.value = false
  }

  const onPaletteSelect = (event, value) => {
    const [scope, id] = String(value).split(':')
    if (scope === 'nav') activeId.value = id
    if (scope === 'res') {
      activeId.value = recentRows.find((row) => row.key === id)?.navId ?? activeId.value
    }
    if (id === 'theme') theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'
    if (id === 'sidebar') railCollapsed.value = !railCollapsed.value
  }

  const tabs = [
    { value: 'tables', label: 'Tables' },
    { value: 'editor', label: 'Editor' }
  ]
  const activeTab = ref('tables')

  const tables = ref([
    {
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
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          created_at: '2026-07-21 08:15:00'
        },
        {
          __k: 'row-2',
          id: 2,
          name: 'Alan Turing',
          email: 'alan@example.com',
          created_at: '2026-07-21 08:15:01'
        },
        {
          __k: 'row-3',
          id: 3,
          name: 'Grace Hopper',
          email: 'grace@example.com',
          created_at: null
        }
      ]
    },
    {
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
    },
    {
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
  ])
  const tableSearch = ref('')
  const selectedTableId = ref(null)
  const filteredTables = computed(() => {
    const term = tableSearch.value.trim().toLowerCase()
    if (!term) return tables.value
    return tables.value.filter((table) => table.name.toLowerCase().includes(term))
  })
  const selectedTable = computed(
    () =>
      tables.value.find((table) => table.id === selectedTableId.value) ?? tables.value[0] ?? null
  )
  const selectTable = (id) => {
    selectedTableId.value = id
  }

  const schemaColumns = [
    { accessorKey: 'name', header: 'Column', principal: true, hideable: false },
    { accessorKey: 'type', header: 'Type', minWidth: 104 },
    { accessorKey: 'constraints', header: 'Constraints', grow: 2 }
  ]
  const schemaRows = computed(() => {
    if (!selectedTable.value) return []
    return selectedTable.value.columns.map((column) => ({
      id: column.id,
      name: column.name,
      type: column.type,
      constraints: [column.primaryKey ? 'PRIMARY KEY' : '', column.notNull ? 'NOT NULL' : '']
        .filter(Boolean)
        .join(', ')
    }))
  })

  const leftWidth = ref(288)
  const leftCollapsed = ref(false)
  onMounted(() => {
    if (globalThis.matchMedia?.('(width < 48rem)').matches) leftCollapsed.value = true
  })

  const tableView = ref('data')
  const tableViewOptions = [
    { label: 'Data', value: 'data' },
    { label: 'Definition', value: 'definition' }
  ]

  const rowFilter = ref('')
  const filterPlaceholder = computed(() => {
    const names = (selectedTable.value?.columns ?? []).map((column) => column.name)
    return names.length
      ? `Filter by ${names.slice(0, 3).join(', ')} or ask AI`
      : 'Filter rows or ask AI'
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
  const rowSelection = ref({})
  const dataColumns = computed(() => [
    ...(selectedTable.value?.columns ?? []).map((column) => ({
      id: column.name,
      accessorKey: column.name,
      header: column.name,
      enableSorting: true,
      minWidth: 160
    })),
    { id: '__actions', kind: 'action', hideable: false }
  ])
  watch(selectedTableId, () => {
    rowSelection.value = {}
  })
  const editorMarkers = computed(() =>
    results.value?.type === 'error' && results.value.line
      ? [{ line: results.value.line, severity: 'error', message: results.value.text }]
      : []
  )
  const isNull = (value) => value === null || value === undefined || value === ''
  const displayCell = (value) => (isNull(value) ? 'NULL' : String(value))
  const deleteRow = (row) => {
    const table = tables.value.find((item) => item.id === selectedTable.value?.id)
    if (!table) return
    table.rows = table.rows.filter((item) => item.__k !== row.__k)
  }

  const editorSql = ref(`CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`)
  const history = ref([
    {
      id: 'q-0',
      sql: `CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`
    },
    {
      id: 'q-1',
      sql: `CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers (id),
  total NUMERIC NOT NULL
);`
    }
  ])
  const historySearch = ref('')
  const filteredHistory = computed(() => {
    const term = historySearch.value.trim().toLowerCase()
    if (!term) return history.value
    return history.value.filter((item) => item.sql.toLowerCase().includes(term))
  })
  const oneLine = (sql) => sql.replace(/\s+/g, ' ').trim()

  const running = ref(false)
  const templatesOpen = ref(false)
  const selectResult = {
    type: 'rows',
    columns: ['id', 'name', 'email', 'created_at'],
    rows: [
      {
        __k: 1,
        id: 1,
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        created_at: '2026-07-21 08:15:00'
      },
      {
        __k: 2,
        id: 2,
        name: 'Alan Turing',
        email: 'alan@example.com',
        created_at: '2026-07-21 08:15:01'
      },
      {
        __k: 3,
        id: 3,
        name: 'Grace Hopper',
        email: 'grace@example.com',
        created_at: '2026-07-21 08:15:02'
      }
    ]
  }
  const results = ref(null)
  const resultColumns = computed(() => {
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
  const resultRows = computed(() => (results.value?.type === 'rows' ? results.value.rows : []))
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

  const applyTemplate = (sql) => {
    editorSql.value = sql
  }
  const loadFromHistory = (item) => {
    editorSql.value = item.sql
    activeTab.value = 'editor'
  }
  const deleteHistory = (event, item) => {
    history.value = history.value.filter((entry) => entry.id !== item.id)
  }
  const SQL_VERBS = [
    'SELECT',
    'INSERT',
    'UPDATE',
    'DELETE',
    'CREATE',
    'ALTER',
    'DROP',
    'WITH',
    'PRAGMA'
  ]

  const runQuery = () => {
    const sql = editorSql.value.trim()
    if (!sql || running.value) return
    running.value = true
    results.value = null
    setTimeout(() => {
      if (history.value[0]?.sql !== sql) {
        history.value = [{ id: `q-${history.value.length + 1}`, sql }, ...history.value]
      }
      const verb = sql.split(/\s+/)[0].toUpperCase()
      const text =
        verb === 'CREATE'
          ? 'Table created.'
          : verb === 'INSERT'
            ? 'Rows inserted.'
            : 'Statement executed.'
      results.value = !SQL_VERBS.includes(verb)
        ? {
            type: 'error',
            line: 1,
            text: `The statement wasn't executed: near "${verb}", a syntax error. Check the statement and run it again.`
          }
        : verb === 'SELECT'
          ? structuredClone(selectResult)
          : { type: 'message', text }
      running.value = false
    }, 700)
  }

  const templates = [
    {
      id: 'create-table',
      title: 'Create table',
      description: 'Create a basic customers table with auto-increment ID and timestamp',
      icon: 'pi pi-table',
      sql: `CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`
    },
    {
      id: 'insert-data',
      title: 'Insert data',
      description: 'Insert sample customer records into the customers table',
      icon: 'pi pi-plus-circle',
      sql: `INSERT INTO customers (name, email) VALUES
  ('Ada Lovelace', 'ada@example.com'),
  ('Alan Turing', 'alan@example.com'),
  ('Grace Hopper', 'grace@example.com');`
    },
    {
      id: 'select-all',
      title: 'Select all',
      description: 'Retrieve all records from customers table with limit',
      icon: 'pi pi-list',
      sql: `SELECT id, name, email, created_at
FROM customers
ORDER BY created_at DESC
LIMIT 100;`
    },
    {
      id: 'count-records',
      title: 'Count records',
      description: 'Count total number of records in customers table',
      icon: 'pi pi-hashtag',
      sql: 'SELECT COUNT(*) AS total_customers FROM customers;'
    },
    {
      id: 'related-table',
      title: 'Related table',
      description: 'Create an orders table that references the customers table',
      icon: 'pi pi-box',
      sql: `CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers (id),
  total NUMERIC NOT NULL
);`
    },
    {
      id: 'insert-related',
      title: 'Insert related rows',
      description: 'Insert sample orders for existing customers',
      icon: 'pi pi-arrow-right-arrow-left',
      sql: `INSERT INTO orders (customer_id, total) VALUES
  (1, 42.50),
  (3, 18.00);`
    },
    {
      id: 'join-tables',
      title: 'Join tables',
      description: 'List every order with the name of the customer who placed it',
      icon: 'pi pi-search',
      sql: `SELECT orders.id, customers.name, orders.total
FROM orders
JOIN customers ON customers.id = orders.customer_id
ORDER BY orders.id DESC;`
    },
    {
      id: 'create-index',
      title: 'Create index',
      description: 'Create an index to speed up lookups of orders by customer',
      icon: 'pi pi-sitemap',
      sql: `CREATE INDEX IF NOT EXISTS orders_customer_id_idx
ON orders (customer_id);`
    },
    {
      id: 'top-customers',
      title: 'Top customers',
      description: 'Find the 3 customers with the highest order totals',
      icon: 'pi pi-sort-amount-down',
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
  const chooseTemplate = (template) => {
    applyTemplate(template.sql)
    templatesOpen.value = false
  }
</script>

<template>
  <div class="relative flex h-dvh overflow-hidden bg-(--bg-canvas)">
    <div class="hidden h-full [--sidebar-width:var(--container-2xs)] md:flex">
      <Sidebar
        v-model:width="railWidth"
        v-model:collapsed="railCollapsed"
        resizable
        collapsible
        aria-label="Main navigation"
        collapse-aria-label="Collapse sidebar"
        expand-aria-label="Expand sidebar"
        resize-aria-label="Resize sidebar"
      >
        <template #header>
          <div class="-m-(--spacing-md) flex flex-col">
            <div
              class="flex h-14 shrink-0 items-center border-b border-(--border-default) px-(--spacing-md)"
            >
              <a
                href="/home"
                aria-label="Azion home"
                class="flex h-6 w-fit items-center rounded-(--shape-button) px-(--spacing-xs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
              >
                <Brand
                  kind="default"
                  size="small"
                />
              </a>
            </div>

            <Command
              v-model:open="paletteOpen"
              @select="onPaletteSelect"
            >
              <Command.Input
                placeholder="Search resources, pages and commands"
                @update:model-value="(value) => (paletteQuery = String(value ?? ''))"
              />
              <Command.List>
                <Command.Group
                  v-if="!paletteQuery"
                  key="recents"
                  heading="Recents"
                >
                  <Command.Item
                    v-for="row in recentRows"
                    :key="row.key"
                    :value="'res:' + row.key"
                  >
                    <template #prefix>
                      <i
                        :class="row.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ row.name }}
                    <template #suffix>
                      <span class="text-label-sm text-(--text-muted)">{{ row.typeLabel }}</span>
                    </template>
                  </Command.Item>
                </Command.Group>

                <Command.Separator
                  v-if="!paletteQuery"
                  key="recents-rule"
                />

                <Command.Group
                  v-for="group in paletteGroups"
                  :key="group.key"
                  :heading="group.heading"
                >
                  <Command.Item
                    v-for="item in group.items"
                    :key="item.id"
                    :value="'nav:' + item.id"
                  >
                    <template
                      v-if="item.icon"
                      #prefix
                    >
                      <i
                        :class="item.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ item.label }}
                  </Command.Item>
                </Command.Group>

                <Command.Separator key="commands-rule" />

                <Command.Group heading="Actions">
                  <Command.Item
                    v-for="command in actionCommands"
                    :key="command.id"
                    :value="'cmd:' + command.id"
                  >
                    <template #prefix>
                      <i
                        :class="command.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ command.label }}
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Account">
                  <Command.Item
                    v-for="command in accountCommands"
                    :key="command.id"
                    :value="'cmd:' + command.id"
                  >
                    <template #prefix>
                      <i
                        :class="command.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ command.label }}
                  </Command.Item>
                </Command.Group>

                <Command.Empty>No resource, page or command matches your search.</Command.Empty>
              </Command.List>
            </Command>
          </div>
        </template>

        <div class="-mt-(--spacing-xxs) pt-(--layout-boundary-start)">
          <Menu
            :groups="navGroups"
            :active-id="activeId"
            role="presentation"
            @navigate="onNavigate"
          >
            <Menu.Back />
          </Menu>
        </div>

        <template #footer>
          <div class="flex items-center gap-(--spacing-xs)">
            <Avatar
              label="alex@example.com"
              size="small"
              kind="square"
            />
            <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)">alex</span>
            <DropdownMenu placement="top-end">
              <DropdownMenu.Trigger>
                <Tooltip text="Account menu">
                  <IconButton
                    icon="pi pi-ellipsis-v"
                    aria-label="Account menu"
                    kind="outlined"
                    size="small"
                  />
                </Tooltip>
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <template #top>
                  <div class="flex min-w-0 flex-col">
                    <span class="truncate text-label-md text-(--text-default)">alex</span>
                    <span class="truncate text-body-xs text-(--text-muted)">alex@example.com</span>
                  </div>
                </template>
                <DropdownMenu.Option
                  value="settings"
                  label="Account settings"
                >
                  <template #right>
                    <i
                      class="pi pi-cog"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="personal-tokens"
                  label="Personal tokens"
                >
                  <template #right>
                    <i
                      class="pi pi-key"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <div
                  class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)"
                >
                  <span class="flex-1 truncate text-start text-label-sm text-(--text-default)"
                    >Theme</span
                  >
                  <ThemeSwitcher
                    v-model="theme"
                    aria-label="Theme"
                  />
                </div>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="home"
                  label="Home page"
                >
                  <template #right>
                    <i
                      class="pi pi-home"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="changelog"
                  label="Changelog"
                >
                  <template #right>
                    <i
                      class="pi pi-pencil"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="feedback"
                  label="Feedback"
                >
                  <template #right>
                    <i
                      class="pi pi-comment"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="docs"
                  label="Docs"
                >
                  <template #right>
                    <i
                      class="pi pi-book"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="logout"
                  label="Log out"
                >
                  <template #right>
                    <i
                      class="pi pi-sign-out"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-xxs) py-(--spacing-xxs)">
                  <Button
                    label="Upgrade to Pro"
                    kind="secondary"
                    size="medium"
                    class="w-full"
                  />
                  <div class="flex justify-center px-(--spacing-xs)">
                    <StatusIndicator
                      severity="success"
                      label="All systems normal"
                    />
                  </div>
                </div>
              </DropdownMenu.Group>
            </DropdownMenu>
          </div>
        </template>
      </Sidebar>
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <div class="@container">
        <GlobalHeader aria-label="Console">
          <GlobalHeader.Left>
            <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
              <span class="contents md:hidden">
                <Tooltip
                  text="Open navigation"
                  placement="bottom"
                >
                  <IconButton
                    icon="pi pi-bars"
                    aria-label="Open navigation"
                    kind="outlined"
                    size="medium"
                    @click="navOpen = true"
                  />
                </Tooltip>
              </span>

              <a
                href="/home"
                aria-label="Azion home"
                class="flex h-6 w-fit shrink-0 items-center rounded-(--shape-button) px-(--spacing-xxs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none md:hidden"
              >
                <Brand
                  kind="default"
                  size="small"
                />
              </a>

              <div class="-ms-(--spacing-xs) hidden w-fit min-w-0 shrink md:flex">
                <Breadcrumb
                  :items="breadcrumb"
                  class="w-full"
                />
              </div>
            </div>
          </GlobalHeader.Left>
          <GlobalHeader.Middle />
          <GlobalHeader.Right>
            <SearchTrigger
              collapsible
              @open="paletteOpen = true"
            />

            <span class="contents md:hidden">
              <Tooltip
                text="Create"
                placement="bottom"
              >
                <IconButton
                  icon="pi pi-plus-circle"
                  kind="primary"
                  size="medium"
                  aria-label="Create"
                />
              </Tooltip>
              <Tooltip
                text="Agent"
                placement="bottom"
              >
                <IconButton
                  icon="ai ai-ask-azion"
                  kind="outlined"
                  size="medium"
                  aria-label="Agent"
                />
              </Tooltip>
            </span>
            <span class="hidden md:contents">
              <Button
                label="Create"
                kind="primary"
                size="medium"
                icon="pi pi-plus-circle"
              />
              <ButtonHighlight
                label="Agent"
                size="medium"
                icon="ai ai-ask-azion"
              />
            </span>

            <button
              type="button"
              aria-label="Account settings"
              class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
            >
              <Avatar
                label="alex@example.com"
                size="medium"
                kind="square"
              />
            </button>
          </GlobalHeader.Right>
        </GlobalHeader>
      </div>

      <div class="min-h-0 flex-1 overflow-auto animate-page-enter motion-reduce:animate-none">
        <main class="flex h-full min-h-0 flex-col">
          <PageTabs v-model="activeTab">
            <Tabs.Item
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
            <div class="contents [--sidebar-width:var(--container-2xs)]">
              <Sidebar
                v-model:width="leftWidth"
                v-model:collapsed="leftCollapsed"
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
                      <span class="text-heading-xxs text-(--text-default)">Tables</span>
                      <div class="flex items-center gap-(--spacing-xxs)">
                        <Tooltip text="Refresh tables">
                          <IconButton
                            icon="pi pi-refresh"
                            kind="outlined"
                            size="small"
                            aria-label="Refresh tables"
                          />
                        </Tooltip>
                        <Tooltip text="Create Table">
                          <IconButton
                            icon="pi pi-plus"
                            kind="outlined"
                            size="small"
                            aria-label="Create Table"
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
                      <template #iconLeft>
                        <i
                          class="pi pi-search"
                          aria-hidden="true"
                        />
                      </template>
                    </Input>
                  </div>
                </template>
                <div>
                  <p
                    v-if="!tables.length"
                    class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
                  >
                    No tables created yet
                  </p>
                  <p
                    v-else-if="!filteredTables.length"
                    class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
                  >
                    No tables match "{{ tableSearch }}".
                  </p>
                  <div
                    v-else
                    class="flex flex-col gap-(--spacing-xxs)"
                  >
                    <div
                      v-for="table in filteredTables"
                      :key="table.id"
                      class="group flex items-center gap-(--spacing-xxs)"
                    >
                      <button
                        type="button"
                        :data-selected="
                          selectedTable && selectedTable.id === table.id ? true : null
                        "
                        class="flex min-w-0 flex-1 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-start text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-selected:bg-(--bg-hover) motion-reduce:transition-none"
                        @click="selectTable(table.id)"
                      >
                        <i
                          class="pi pi-table shrink-0 text-(--text-muted)"
                          aria-hidden="true"
                        />
                        <span class="min-w-0 truncate">{{ table.name }}</span>
                      </button>
                      <DropdownMenu placement="bottom-end">
                        <DropdownMenu.Trigger>
                          <Tooltip text="Table actions">
                            <IconButton
                              icon="pi pi-ellipsis-h"
                              kind="transparent"
                              size="small"
                              aria-label="Table actions"
                            />
                          </Tooltip>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Group>
                          <DropdownMenu.Option
                            value="delete"
                            label="Delete table"
                          >
                            <template #left
                              ><i
                                class="pi pi-trash"
                                aria-hidden="true"
                            /></template>
                          </DropdownMenu.Option>
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
                <Card class="w-full max-w-(--container-2xl)">
                  <template #content>
                    <div
                      class="flex flex-1 rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised)"
                    >
                      <EmptyState
                        size="medium"
                        title="No tables yet"
                        description="Create your first table to store your data."
                        class="w-full"
                      >
                        <template #icon>
                          <span class="relative flex size-10 items-center justify-center">
                            <span
                              aria-hidden="true"
                              class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-(--radius-xl) border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                            />
                            <span
                              aria-hidden="true"
                              class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                            />
                            <span
                              class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)"
                            >
                              <i
                                class="pi pi-table text-body-md leading-none text-(--text-default)"
                                aria-hidden="true"
                              />
                            </span>
                          </span>
                        </template>
                        <template #actions>
                          <div class="w-full md:w-fit">
                            <Button
                              label="Create Table"
                              icon="pi pi-plus"
                              kind="secondary"
                              size="medium"
                              class="w-full"
                            />
                          </div>
                        </template>
                      </EmptyState>
                    </div>
                  </template>
                </Card>
              </div>

              <div
                v-else
                class="flex min-h-0 flex-1 flex-col"
              >
                <div
                  class="flex items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
                >
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="pi pi-table shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate text-heading-xxs text-(--text-default)">{{
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
                        <template #iconLeft>
                          <i
                            class="pi pi-search"
                            aria-hidden="true"
                          />
                        </template>
                      </Input>
                    </div>
                    <div class="ms-auto flex items-center gap-(--spacing-xs)">
                      <Button
                        label="Sort"
                        kind="outlined"
                        size="medium"
                        icon="pi pi-sort-alt"
                      />
                      <Tooltip text="Refresh">
                        <IconButton
                          icon="pi pi-refresh"
                          kind="outlined"
                          size="medium"
                          aria-label="Refresh"
                        />
                      </Tooltip>
                      <Button
                        label="Insert"
                        kind="primary"
                        size="medium"
                        icon="pi pi-plus"
                      />
                    </div>
                  </div>

                  <div class="min-h-0 flex-1 overflow-auto">
                    <TableRoot
                      v-model:row-selection="rowSelection"
                      :data="filteredRows"
                      :columns="dataColumns"
                      row-key="__k"
                      enable-row-selection
                      enable-sorting
                      paginated
                      :page-size="25"
                      :rows-per-page-options="[25, 50, 100]"
                      density="compact"
                      :bordered="false"
                      :aria-label="`Rows of ${selectedTable.name}`"
                    >
                      <template
                        v-for="column in selectedTable.columns"
                        :key="column.id"
                        #[`header-${column.name}`]
                      >
                        <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                          <span class="truncate">{{ column.name }}</span>
                          <span class="shrink-0 text-body-xs text-(--text-muted)">{{
                            column.type
                          }}</span>
                          <i
                            v-if="column.primaryKey"
                            class="pi pi-key shrink-0 text-(--primary)"
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
                          class="truncate font-code text-label-code-sm"
                          :class="
                            isNull(value) ? 'italic text-(--text-muted)' : 'text-(--text-default)'
                          "
                          >{{ displayCell(value) }}</span
                        >
                      </template>
                      <template #cell-__actions="{ row }">
                        <Tooltip text="Delete row">
                          <IconButton
                            icon="pi pi-trash"
                            kind="transparent"
                            size="small"
                            aria-label="Delete row"
                            @click="deleteRow(row)"
                          />
                        </Tooltip>
                      </template>
                      <template #empty>
                        <div
                          v-if="!tableRows.length"
                          class="flex flex-col items-center justify-center gap-(--spacing-sm) p-(--spacing-xxl) text-center"
                        >
                          <p class="text-body-sm text-(--text-default)">This table is empty</p>
                          <div
                            class="flex flex-wrap items-center justify-center gap-(--spacing-xs)"
                          >
                            <Button
                              label="Insert row"
                              kind="secondary"
                              size="medium"
                              icon="pi pi-plus"
                            />
                            <Button
                              label="Import data from CSV"
                              kind="outlined"
                              size="medium"
                              icon="pi pi-upload"
                            />
                          </div>
                          <p class="text-body-xs text-(--text-muted)">
                            or drag and drop a CSV file here
                          </p>
                        </div>
                        <p
                          v-else
                          class="p-(--spacing-xxl) text-center text-body-sm text-(--text-muted)"
                        >
                          No rows match "{{ rowFilter }}".
                        </p>
                      </template>
                    </TableRoot>
                  </div>
                </div>

                <div
                  v-else
                  class="flex min-h-0 flex-1 flex-col gap-(--layout-group-gap) overflow-auto p-(--spacing-md)"
                >
                  <div class="flex items-center justify-between gap-(--spacing-sm)">
                    <p class="text-heading-xxs text-(--text-default)">Columns</p>
                    <Button
                      label="Add column"
                      kind="outlined"
                      size="medium"
                      icon="pi pi-plus"
                    />
                  </div>
                  <Card :padded="false">
                    <template #content>
                      <TableRoot
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
                            severity="secondary"
                            size="medium"
                          />
                        </template>
                        <template #cell-constraints="{ value }">
                          <span class="text-body-sm text-(--text-muted)">{{ value || '—' }}</span>
                        </template>
                      </TableRoot>
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
            <div class="contents [--sidebar-width:var(--container-2xs)]">
              <Sidebar
                v-model:width="leftWidth"
                v-model:collapsed="leftCollapsed"
                resizable
                collapsible
                aria-label="Query history"
                collapse-aria-label="Hide the query history"
                expand-aria-label="Show the query history"
                resize-aria-label="Resize the query history panel"
              >
                <template #header>
                  <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-xs)">
                    <span class="text-heading-xxs text-(--text-default)">Query history</span>
                    <Input
                      v-model="historySearch"
                      size="medium"
                      class="w-full"
                      placeholder="Search queries"
                      aria-label="Search queries"
                    >
                      <template #iconLeft>
                        <i
                          class="pi pi-search"
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
                    class="flex flex-col gap-(--spacing-xxs)"
                  >
                    <div
                      v-for="item in filteredHistory"
                      :key="item.id"
                      class="flex items-center gap-(--spacing-xxs)"
                    >
                      <button
                        type="button"
                        class="min-w-0 flex-1 truncate rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-start font-code text-label-code-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                        :title="oneLine(item.sql)"
                        @click="loadFromHistory(item)"
                      >
                        {{ oneLine(item.sql) }}
                      </button>
                      <DropdownMenu
                        placement="bottom-end"
                        @select="
                          (event, value) =>
                            value === 'run'
                              ? (applyTemplate(item.sql), runQuery())
                              : deleteHistory(event, item)
                        "
                      >
                        <DropdownMenu.Trigger>
                          <Tooltip text="Query actions">
                            <IconButton
                              icon="pi pi-ellipsis-h"
                              kind="transparent"
                              size="small"
                              aria-label="Query actions"
                            />
                          </Tooltip>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Group>
                          <DropdownMenu.Option
                            value="run"
                            label="Run query"
                          >
                            <template #left
                              ><i
                                class="pi pi-play"
                                aria-hidden="true"
                            /></template>
                          </DropdownMenu.Option>
                          <DropdownMenu.Option
                            value="delete"
                            label="Delete query"
                          >
                            <template #left
                              ><i
                                class="pi pi-trash"
                                aria-hidden="true"
                            /></template>
                          </DropdownMenu.Option>
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
                <Button
                  label="Run query"
                  kind="primary"
                  size="medium"
                  icon="pi pi-play"
                  :loading="running"
                  @click="runQuery"
                />
                <div class="ms-auto flex items-center gap-(--spacing-xs)">
                  <Button
                    label="Prettify"
                    kind="outlined"
                    size="medium"
                    icon="pi pi-align-left"
                    :disabled="running"
                  />
                  <Button
                    label="Templates"
                    kind="outlined"
                    size="medium"
                    icon="pi pi-bolt"
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
                  <span class="shrink-0 text-heading-xxs text-(--text-default)"> Results </span>
                  <div class="flex ms-(--spacing-sm) min-w-0 flex-1 md:max-w-(--container-sm)">
                    <Input
                      v-model="resultSearch"
                      size="medium"
                      class="w-full"
                      placeholder="Search"
                      aria-label="Search results"
                      :disabled="!resultRows.length"
                    >
                      <template #iconLeft>
                        <i
                          class="pi pi-search"
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
                    <Tooltip text="Refresh">
                      <IconButton
                        icon="pi pi-refresh"
                        kind="outlined"
                        size="medium"
                        aria-label="Refresh results"
                        :loading="running"
                        @click="runQuery"
                      />
                    </Tooltip>
                    <Tooltip text="Download">
                      <IconButton
                        icon="pi pi-download"
                        kind="outlined"
                        size="medium"
                        aria-label="Download results"
                        :disabled="!resultRows.length"
                      />
                    </Tooltip>
                    <Tooltip text="Columns">
                      <IconButton
                        icon="pi pi-table"
                        kind="outlined"
                        size="medium"
                        aria-label="Toggle columns"
                        :disabled="!resultRows.length"
                      />
                    </Tooltip>
                    <Button
                      label="Insert"
                      kind="primary"
                      size="medium"
                      icon="pi pi-plus"
                      :disabled="true"
                    />
                  </div>
                </div>

                <div class="min-h-(--container-3xs)">
                  <TableRoot
                    v-if="resultRows.length && resultView === 'table'"
                    :data="filteredResultRows"
                    :columns="resultColumns"
                    row-key="__k"
                    :bordered="false"
                  />
                  <pre
                    v-else-if="resultRows.length && resultView === 'json'"
                    class="overflow-auto p-(--spacing-md) font-code text-label-code-sm text-(--text-default)"
                    >{{ resultJson }}</pre>
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

                <div class="border-t border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)">
                  <PaginationRoot
                    :total="filteredResultRows.length"
                    :page-size="50"
                    :page-size-options="[10, 25, 50, 100]"
                    aria-label="Results pagination"
                  />
                </div>
              </div>
            </div>
          </section>
        </main>

        <Drawer
          v-model:open="templatesOpen"
          size="large"
          side="right"
        >
          <DrawerPortal>
            <DrawerOverlay />
            <DrawerContent>
              <PanelHeader class="w-full">
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                  <DrawerTitle>SQL quick templates</DrawerTitle>
                  <p class="text-body-sm text-(--text-muted)">
                    Pick a snippet to load it into the editor.
                  </p>
                </div>
                <DrawerClose />
              </PanelHeader>

              <PanelContent>
                <div class="flex flex-col gap-(--spacing-md)">
                  <Input
                    v-model="templateQuery"
                    size="large"
                    class="w-full"
                    placeholder="Search templates"
                    aria-label="Search templates"
                  >
                    <template #iconLeft>
                      <i
                        class="pi pi-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>

                  <div
                    v-if="filteredTemplates.length"
                    class="grid grid-cols-1 gap-(--spacing-sm) md:grid-cols-2"
                  >
                    <button
                      v-for="template in filteredTemplates"
                      :key="template.id"
                      type="button"
                      class="flex flex-col gap-(--spacing-xxs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md) text-start transition-colors duration-fast-02 ease-productive-entrance hover:border-(--border-primary) hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
                      @click="chooseTemplate(template)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">
                        <i
                          :class="template.icon"
                          class="text-(--text-muted)"
                          aria-hidden="true"
                        />
                        <span class="text-label-md text-(--text-default)">{{
                          template.title
                        }}</span>
                      </span>
                      <span class="text-body-xs text-(--text-muted)">{{
                        template.description
                      }}</span>
                    </button>
                  </div>

                  <p
                    v-else
                    class="py-(--spacing-lg) text-center text-body-sm text-(--text-muted)"
                  >
                    No templates match "{{ templateQuery }}".
                  </p>
                </div>
              </PanelContent>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
      </div>
    </div>

    <Drawer
      v-model:open="navOpen"
      side="right"
      size="small"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent aria-label="Navigation">
          <Sidebar aria-label="Main navigation">
            <template #header>
              <div class="-m-(--spacing-md) flex flex-col">
                <div
                  class="flex h-14 shrink-0 items-center border-b border-(--border-default) px-(--spacing-md)"
                >
                  <a
                    href="/home"
                    aria-label="Azion home"
                    class="flex h-6 w-fit items-center rounded-(--shape-button) px-(--spacing-xs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                  >
                    <Brand
                      kind="default"
                      size="small"
                    />
                  </a>
                </div>
              </div>
            </template>

            <div class="-mt-(--spacing-xxs) pt-(--layout-boundary-start)">
              <Menu
                :groups="navGroups"
                :active-id="activeId"
                role="presentation"
                @navigate="onMobileNavigate"
              >
                <Menu.Back />
              </Menu>
            </div>

            <template #footer>
              <div class="flex items-center gap-(--spacing-xs)">
                <Avatar
                  label="alex@example.com"
                  size="small"
                  kind="square"
                />
                <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)"
                  >alex</span
                >
                <DropdownMenu placement="top-end">
                  <DropdownMenu.Trigger>
                    <Tooltip text="Account menu">
                      <IconButton
                        icon="pi pi-ellipsis-v"
                        aria-label="Account menu"
                        kind="outlined"
                        size="small"
                      />
                    </Tooltip>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <template #top>
                      <div class="flex min-w-0 flex-col">
                        <span class="truncate text-label-md text-(--text-default)">alex</span>
                        <span class="truncate text-body-xs text-(--text-muted)"
                          >alex@example.com</span
                        >
                      </div>
                    </template>
                    <DropdownMenu.Option
                      value="settings"
                      label="Account settings"
                    >
                      <template #right>
                        <i
                          class="pi pi-cog"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="personal-tokens"
                      label="Personal tokens"
                    >
                      <template #right>
                        <i
                          class="pi pi-key"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <div
                      class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)"
                    >
                      <span class="flex-1 truncate text-start text-label-sm text-(--text-default)"
                        >Theme</span
                      >
                      <ThemeSwitcher
                        v-model="theme"
                        aria-label="Theme"
                      />
                    </div>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <DropdownMenu.Option
                      value="home"
                      label="Home page"
                    >
                      <template #right>
                        <i
                          class="pi pi-home"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="changelog"
                      label="Changelog"
                    >
                      <template #right>
                        <i
                          class="pi pi-pencil"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="feedback"
                      label="Feedback"
                    >
                      <template #right>
                        <i
                          class="pi pi-comment"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="docs"
                      label="Docs"
                    >
                      <template #right>
                        <i
                          class="pi pi-book"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <DropdownMenu.Option
                      value="logout"
                      label="Log out"
                    >
                      <template #right>
                        <i
                          class="pi pi-sign-out"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <div
                      class="flex flex-col gap-(--spacing-sm) px-(--spacing-xxs) py-(--spacing-xxs)"
                    >
                      <Button
                        label="Upgrade to Pro"
                        kind="secondary"
                        size="medium"
                        class="w-full"
                      />
                      <div class="flex justify-center px-(--spacing-xs)">
                        <StatusIndicator
                          severity="success"
                          label="All systems normal"
                        />
                      </div>
                    </div>
                  </DropdownMenu.Group>
                </DropdownMenu>
              </div>
            </template>
          </Sidebar>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
```
