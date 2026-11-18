# EditSchema (`edit/edit-schema`)

> The schema editing surface of a SQL database table, taken from the design sample's SQL database pages and the Console Kit's alter column and truncate dialogs: a flush `Card` holding the table's definition as a `DataTable` (column, type `Tag`, constraints, a Change type row menu) under a toolbar with the table name, its row count, Add column, the primary Insert row and a Table actions menu (Create Table, Truncate table). Create Table is a large right `Drawer` with the table Name and an `AttributeEditor` of column rows (reorderable by grip, Move up and down or Alt+Arrow; name, type `Select` with a search field and the type's glyph, default value, Primary `Checkbox`), validated on submit for an empty or malformed name, duplicate column names and no named column; the server's name conflict comes back as a danger `Alert` in the General section and on the field, per the state-form-validation rule. Add column is a large drawer with Name, Type, Default value and Primary key and Not null `Switch`es (a primary key forces Not null). Insert row is a large drawer with one `Field` per column, the auto-generated key disabled and NOT NULL columns required. Change type is a `ConfirmDialog` that warns the table is rebuilt and shows the statements that will run in a read-only `CodeEditor`; Truncate table is a `ConfirmDialog` with the statement and the typed table name. Every change runs async and ends in a toast whose actions fit the table (Insert row, Add column, Change again, Insert another), never a deploy action. The Create Table drawer also imports a CSV (`FileDropzone`, `FileTokenGroup` token, columns from the header with guessed types, a five-row preview) and adds foreign keys in a second `AttributeEditor` (column, referenced table and column, On delete). A page body for ConsoleLayout.

- Surface: app
- Source: `blocks/edit/edit-schema/edit-schema.vue` in `@aziontech/webkit`
- MCP: `get_block("edit/edit-schema")`
- Components: [Alert](../../components/alert.md), [AttributeEditor](../../components/attribute-editor.md), [Button](../../components/button.md), [Card](../../components/card.md), [Checkbox](../../components/checkbox.md), [CodeEditor](../../components/code-editor.md), [ConfirmDialog](../../components/confirm-dialog.md), [DataTable](../../components/data-table.md), `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [DropdownMenu](../../components/dropdown-menu.md), [Field](../../components/field.md), `FieldError`, [FileDropzone](../../components/file-dropzone.md), [FileTokenGroup](../../components/file-token-group.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [Select](../../components/select.md), [SettingsSection](../../components/settings-section.md), [Switch](../../components/switch.md), `TableCellActions`, [Tag](../../components/tag.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md)
- Skills: `webkit-form`, `webkit-create-surface`, `webkit-tables`, `webkit-errors`, `webkit-ui-states`

## Asked as

schema editor; create table; add column; insert row; alter column; change column type; truncate table; table schema; database schema; column types; criar tabela; adicionar coluna; inserir linha; alterar coluna; esvaziar tabela; esquema do banco

The table schema of a SQL database: the definition of one table and the drawers and dialogs that change it. A developer creates a table with its columns, adds a column, inserts a row by hand, changes a column's type or empties a table, and stays on the same surface while each change runs. It sits behind the Create Table, Add column, Insert and table menu buttons of `view/view-query-editor`. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header, the ⌘K palette and the `main`.

## When to use

- A SQL database's tables are created and changed from the console rather than only with SQL.
- A table's columns, types and constraints are shown and edited one change at a time.
- A row is added by hand to check a table, without writing an INSERT.

## When not to use

- Running SQL or reading query results: use `view/view-query-editor`.
- Rows of a resource that is not a database (variables, records): use `edit/edit-variables` or `detail/detail-dns-zone`.
- A form that creates a resource in its own page: use `create/create-page`.
- A generic item created inside a resource: use `create/create-drawer`.

## Building blocks

### A. Definition surface — `Card`, `DataTable`, `TableCellActions`, `Tag`, `Button`, `DropdownMenu`, `Tooltip`, `IconButton` (required)

One `Card :padded="false"` around a `DataTable :bordered="false"` named `Columns of <table>`. The toolbar slot holds the table glyph and name, a small secondary `Tag` with the row count, an outlined Add column `Button`, the primary Insert row `Button` and a Table actions `IconButton` (with its `Tooltip`) that opens a `DropdownMenu`: Create Table in the first group, Truncate table alone in the last. The rows are the columns: the name in the code font, the type as a secondary `Tag`, the constraints in muted text (`PRIMARY KEY, NOT NULL, DEFAULT now()`, or `None`), and a per-column `TableCellActions` ("Actions for <column>") with Change type.

### B. Create Table drawer — `Drawer`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `PanelBody`, `SettingsSection`, `Alert`, `Field`, `Input` (required)

A large right `Drawer` whose content is a `form` named Create Table. The `PanelHeader` holds the `DrawerTitle`, one muted sentence (the database and how to reorder) and the drawer's own close button. A `fieldset` disabled while the request runs holds two `SettingsSection`s. General has one `Field` with the table Name in the code font and why it cannot be renamed lightly. A rejection from the server goes above it as a danger `Alert` that says what happened and that the columns are kept, and on the field as its `Field.Error`, per `state/state-form-validation` (SectionRejected).

### C. Column rows — `AttributeEditor`, `Select`, `Checkbox`, `FieldError` (required)

The Columns section is an `AttributeEditor` (`v-model:items`, large, `reorderable`, `min-items` 1) named Columns with Name, Type, Default and Primary columns. The editor owns the grip (pointer drag, Arrow Up and Arrow Down), Move up and Move down, Alt+Arrow keys, Remove column (hidden on the last row), Add column with focus on the new row, and the polite announcements of every add, remove and move. Its cells are `cell-<key>` slots: the name `Input`, a type `Select` whose trigger shows the type's glyph (`#`, `T`, `{}`, `@`, `B`) and whose content has a Search types `Input` over the Data types group (value in the code font and a muted description), a default value `Input` (`NULL` placeholder) and a Primary `Checkbox`. A duplicate name shows under its cell through the editor's `errors`; no named column puts an invalid `FieldError` under the list. About data types links out. New tables start with `id int8` as the primary key and `created_at timestamptz DEFAULT now()`.

### D. CSV import and foreign keys — `FileDropzone`, `FileTokenGroup` (optional)

Two optional sections in the Create Table drawer. Import data from CSV: a `FileDropzone` (one .csv) with a Browse files button over a hidden file input; once read, the file is a `FileTokenGroup` token (Remove clears it), the columns are rebuilt from the header with types guessed from the values (`int8`, `numeric`, `bool`, `timestamptz`, else `text`; `id` becomes the primary key) and stay editable, an empty name takes the file's, and a bordered `DataTable` previews the first five rows under a line that counts columns and rows. A header with an empty name or a non-CSV file is an error on the token and blocks Create. Foreign keys: a second `AttributeEditor` named Foreign keys (no minimum, `No foreign keys.` when empty) with Column (the named columns), References table, References column (enabled once a table is picked) and On delete (No action, Cascade, Set null) cells as `Select`s; the editor owns Remove foreign key and Add foreign key. After Create, an incomplete row shows `Choose the column, the table and the column it references.` under its first empty cell. The success toast counts the imported rows and the keys. The drawer imports into a new table; an existing empty table imports from its own page (M2.10 row).

### E. Add column drawer — `Switch` (required)

A large drawer with the same header and footer recipe. Column has Name (invalid when empty or when the table already has it), Type (the same `Select`) and Default value (empty for NULL, or an expression such as `now()`). Constraints has Primary key and Not null as horizontal `Field`s with a `Switch`; Primary key turns Not null on and locks it.

### F. Insert row drawer — `PanelFooter` (required)

A large drawer with one `Field` per column in table order: the label is the column name in the code font with its type at the end, the description says what an empty value does (`Generated by the database.`, `Empty uses the default, now().`, `Required.`, `Empty stores NULL.`). An integer primary key is disabled and generated. After Insert row is pressed, a NOT NULL column with no value and no default is invalid with `<column> cannot be NULL. Enter a value.` Every drawer's `PanelFooter` holds Cancel and the submit button (`:loading` while it runs).

### G. Change type dialog — `ConfirmDialog`, `CodeEditor` (required)

A large `ConfirmDialog` titled `Change the type of <column>`: a warning `Alert` (the table is rebuilt, every row is copied, it can't be undone, values that don't fit make it fail), the New type `Select` with the current type in its description, and the statements that will run (`BEGIN; CREATE TABLE …_new …; INSERT INTO …; DROP TABLE …; ALTER TABLE … RENAME TO …; COMMIT;`) in a read-only `CodeEditor` with `language="sql"`. The primary Change type is disabled until the type differs.

### H. Truncate table dialog — `ConfirmDialog`, `CodeEditor`, `Input` (required)

A medium `ConfirmDialog` titled `Truncate <table>`, following `edit/edit-delete-dialog`: a warning `Alert`, one sentence with what goes (every row, with the count) and what stays (columns, types, constraints), the `TRUNCATE TABLE <table>;` statement in a read-only `CodeEditor` without line numbers, and a `Field` whose label asks to type the table name. The danger Truncate table button enables only when it matches.

### Outcome toasts — through `toast`

Raised through `toast` with one id, so each change replaces the last toast. Schema changes are not deploys: each success names what changed and offers the next thing to do with the table, never Edit and Redeploy or View deployments. Create Table: `Table events created.` with Insert row and Add column. Add column: `Column phone added to customers.` with Change type. Insert row: `Row inserted into customers.` with Insert another. Change type: `email is now text.` with Change again. Truncate: `customers truncated. 3 rows removed.` with Insert row. The toasts show when `loading` turns off with no `error`. A failed Add column, Insert row, Change type or Truncate is a danger toast with the `error` text and Retry that keeps the form; a refused Create Table is the General `Alert` and the Name field error. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so the page never renders a `Toaster`.

## Data

The block takes its tables through props and emits every change; it runs no SQL and fakes no request. `SchemaEditorTable`, `SchemaEditorProps` and the payload types are exported from `edit-schema.vue`, and `sample.ts` holds the sample database the block renders when `tables` is left out.

| Prop                 | Type                              | What it does                                                                                                                                               |
| -------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tables`             | `SchemaEditorTable[]`             | The database's tables; the selected one fills the definition table, every one feeds the foreign key selects.                                               |
| `database`           | `string`                          | The database name the drawers and messages name.                                                                                                           |
| `loading`            | `boolean`                         | A change is in flight: the open drawer or dialog locks and its submit spins. When it turns off with no `error`, the change is applied and its toast shows. |
| `error`              | `string`                          | Why the change failed: on the Name field and in an `Alert` for Create Table, in a danger toast with Retry for the others.                                  |
| `v-model:dialog`     | `SchemaEditorDialog`              | The open drawer or dialog (`create`, `column`, `row`, `alter`, `truncate` or `none`); defaults to `create`.                                                |
| `v-model:table`      | `string`                          | The selected table's name; empty picks the first table.                                                                                                    |
| `defaultDraft`       | `{ name?, relations? }`           | The Create Table name and foreign keys the drawer opens with.                                                                                              |
| `defaultCsv`         | `SchemaEditorCsv`                 | A CSV file the Create Table drawer opens with, already read.                                                                                               |
| `defaultColumn`      | `Partial<SchemaEditorColumnForm>` | The Add column values the drawer opens with.                                                                                                               |
| `defaultRow`         | `Record<string, string>`          | The Insert row values the drawer opens with.                                                                                                               |
| `defaultAlterColumn` | `string`                          | The column the Change type dialog opens on.                                                                                                                |
| `defaultSubmitted`   | `boolean`                         | The open drawer starts as if submitted, so its validation messages show.                                                                                   |

| Event          | Payload                            | When                                                               |
| -------------- | ---------------------------------- | ------------------------------------------------------------------ |
| `create-table` | `(event, table)`                   | Create Table, valid: name, columns, foreign keys and the CSV rows. |
| `add-column`   | `(event, { table, column })`       | Add column, valid.                                                 |
| `insert-row`   | `(event, { table, values })`       | Insert row, valid; values keyed by column name.                    |
| `change-type`  | `(event, { table, column, type })` | Change type in the dialog.                                         |
| `truncate`     | `(event, table)`                   | Truncate table, once the typed name matches.                       |

To go live, render the block from a page that owns the requests and pass what they return:

```vue
<script setup lang="ts">
  import { ref } from 'vue'

  import EditSchema, { type SchemaEditorDialog, type SchemaEditorNewTable } from './edit-schema.vue'

  const { data, refresh } = useTables('acme-store')
  const { run, pending, error } = useSchemaChange()
  const dialog = ref<SchemaEditorDialog>('none')

  const create = (_event: Event, table: SchemaEditorNewTable) =>
    run.createTable(table).then(refresh)
</script>

<template>
  <EditSchema
    v-model:dialog="dialog"
    database="acme-store"
    :tables="data ?? []"
    :loading="pending"
    :error="error?.message ?? ''"
    @create-table="create"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Validate on submit, then keep each error next to what caused it: the field, the column row or the list.
- Keep the drawer open and its values intact when the server refuses; say so in the section `Alert`.
- Show the SQL a destructive or rebuilding change will run before it runs.
- Ask for the table name before truncating it.
- Build the column and foreign key rows on `AttributeEditor`, so drag, keyboard moves, focus and announcements match every other row editor.
- End every change with a toast whose action continues the work on the same table.

## Don't

- Don't validate column names on every keystroke; wait for the first submit.
- Don't put a deploy action (Edit, Redeploy, View deployments) on a schema change.
- Don't let a primary key be nullable; lock Not null while Primary key is on.
- Don't drop rows on a type change silently; warn that values that don't fit make it fail.
- Don't close the Create Table drawer on a server error.

## Copy

- **Titles:** `Create Table`, `Add column`, `Insert row`, `Change the type of <column>`, `Truncate <table>`.
- **Buttons:** the title's verb and object: `Create Table`, `Add column`, `Insert row`, `Change type`, `Truncate table`; Cancel beside each.
- **Errors:** `This field is required.`, `Start with a letter or an underscore; use letters, numbers and underscores.`, `Another column is also named email.`, `Add at least one named column.`, `customers already has a column named email.`, `email cannot be NULL. Enter a value.`
- **Server rejection:** `The table wasn't created. A table named customers already exists in acme-store. Your columns are kept; pick another name and create it again.`
- **Toasts:** as in building block H.
- Follow `skills/webkit-microcopy`: sentence case except the product's object names (`Create Table`), no em dash, no "please", no exclamation marks.

## Accessibility

- Each drawer's content is a `form` named by its title; the `fieldset` carries a visually hidden `legend` and is disabled while the request runs.
- `Field` wires every label, description and error to its control; column row controls without a visible label are named `Name of column 2`, `Type of column 2`, `Default value of column 2`.
- Column reordering comes from `AttributeEditor`: a real grip `button`, Move up and Move down, and Alt+Arrow keys, so dragging is never the only way (WCAG 2.5.7); each move is announced and focus stays on the moved row.
- Every icon-only button has an `aria-label` that matches its `Tooltip`; the per-column menu trigger names its column.
- The read-only `CodeEditor`s are named (`Statements that will run`) and can be selected and copied.
- Drawers and dialogs trap focus, close on Escape and return focus to the button that opened them.

## States

- CreateTable: `dialog` left at `create`: the Create Table drawer open on a new table, with the default id and created_at columns.
- AddColumn: `dialog="column"` with `defaultColumn` phone as varchar, in the Add column drawer.
- InsertRow: `dialog="row"` with `defaultRow` and `defaultSubmitted`: the Insert row drawer after a submit with email empty, showing the NOT NULL error.
- ChangeType: `dialog="alter"` with `defaultAlterColumn` email: the Change type dialog with the statements that will run.
- TruncateTable: `dialog="truncate"`: the Truncate customers dialog waiting for the typed name.
- ImportCsv: `defaultCsv` and `defaultDraft.relations`: Create Table with subscribers.csv read (six columns, six rows, a quoted comma) and one foreign key, customer_id to customers.id on delete cascade.
- Error: `error` with `defaultDraft.name` customers: Create Table refused by the server because customers already exists; Alert in General and the Name field invalid.

## Related

- `view/view-query-editor` — the database page whose buttons open these drawers and dialogs.
- `create/create-drawer` — the drawer recipe these drawers follow.
- `edit/edit-delete-dialog` — the typed confirmation Truncate table follows.
- `state/state-form-validation` (SectionRejected) — the rule for the server's name conflict.
- `state/state-async-submit` — the long-action rule; schema changes use item actions, not Edit and Redeploy.
- `CodeEditor`, `Select`, `Field` — see `skills/webkit-form` and `skills/webkit-create-surface`.

## Variants

- `CreateTable` — primary (the code below)
- `AddColumn` — The Add column drawer over the customers definition, filled with phone as varchar; Primary key and Not null switches below, with Not null locked on while Primary key is on.
- `InsertRow` — The Insert row drawer for customers after Insert was pressed with email empty: one field per column in table order, id generated and disabled, created_at falling back to now(), and email invalid because it is NOT NULL.
- `ChangeType` — The Change type dialog for email: a warning that the table is rebuilt, the New type select, and the BEGIN … COMMIT statements that will run in a read-only CodeEditor; Change type is disabled until the type differs.
- `TruncateTable` — The Truncate customers dialog: a warning, the row count that goes, the TRUNCATE TABLE statement and a field that must match the table name before the danger button enables.
- `ImportCsv` — Create Table started from a CSV: subscribers.csv as a `FileTokenGroup` token, the columns rebuilt from its header with guessed types, a five-row `DataTable` preview, and a foreign key from customer_id to customers.id with On delete Cascade.
- `Error` — Create Table came back from the server: a table named customers already exists, so a danger Alert in the General section says nothing else was lost and the Name field is invalid with the same reason; the columns stay as they were.

Each variant is the same screen in another state: `get_block("edit/edit-schema", { variant })`, or the file under `blocks/edit/edit-schema/variants/`.

## Code (`CreateTable`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import CodeEditor from '@aziontech/webkit/code-editor'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import type { TableColumn } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import Field from '@aziontech/webkit/field'
  import FieldError from '@aziontech/webkit/field-error'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'

  import { sampleDatabase, sampleTables } from './sample'

  interface ColumnType {
    value: string
    description: string
    glyph: string
  }

  /** One column of an existing table. */
  export interface SchemaEditorColumn {
    /** Column name. */
    name: string
    /** Data type, one of the types the Type select lists. */
    type: string
    /** Part of the primary key. */
    primaryKey: boolean
    /** Rejects NULL. */
    notNull: boolean
    /** Default expression, empty for none. */
    defaultValue: string
  }

  /** One table of the database. */
  export interface SchemaEditorTable {
    /** Table name. */
    name: string
    /** Its columns, in table order. */
    columns: SchemaEditorColumn[]
    /** How many rows it holds. */
    rowCount: number
  }

  /** One foreign key row of the Create Table drawer. */
  export interface SchemaEditorRelation {
    /** Stable key of the row. */
    key: string
    /** The new table's column. */
    column: string
    /** The table it references. */
    table: string
    /** The referenced column. */
    references: string
    /** What happens to the rows when the referenced row is deleted. */
    onDelete: string
  }

  /** A CSV file the Create Table drawer reads. */
  export interface SchemaEditorCsvFile {
    /** File name. */
    name: string
    /** Size in bytes. */
    size: number
    /** MIME type. */
    type: string
  }

  /** A CSV file and its text. */
  export interface SchemaEditorCsv {
    /** The file. */
    file: SchemaEditorCsvFile
    /** Its contents. */
    text: string
  }

  /** The table Create Table sends. */
  export interface SchemaEditorNewTable {
    /** Table name. */
    name: string
    /** Its named columns. */
    columns: SchemaEditorColumn[]
    /** Its foreign keys. */
    relations: SchemaEditorRelation[]
    /** Rows read from the CSV file, keyed by column name. */
    rows: Record<string, string>[]
  }

  /** The values of the Add column drawer. */
  export interface SchemaEditorColumnForm {
    /** Column name. */
    name: string
    /** Data type. */
    type: string
    /** Default expression, empty for NULL. */
    defaultValue: string
    /** Part of the primary key. */
    primaryKey: boolean
    /** Rejects NULL. */
    notNull: boolean
  }

  /** The drawer or dialog that is open, or none. */
  export type SchemaEditorDialog = 'create' | 'column' | 'row' | 'alter' | 'truncate' | 'none'

  export interface SchemaEditorProps {
    /** The database's tables. Left out, the sample renders. */
    tables?: SchemaEditorTable[]
    /** The database name the drawers and messages name. Left out, the sample name. */
    database?: string
    /** A change is in flight: the open drawer or dialog locks and its submit spins. When it turns off with no error, the change is applied and the success toast shows. */
    loading?: boolean
    /** Why the change failed. Create Table shows it on the Name field and in an Alert; the other changes show a danger toast with Retry. */
    error?: string
    /** The Create Table name and foreign keys the drawer opens with. */
    defaultDraft?: { name?: string; relations?: SchemaEditorRelation[] }
    /** A CSV file the Create Table drawer opens with, already read. */
    defaultCsv?: SchemaEditorCsv
    /** The Add column values the drawer opens with. */
    defaultColumn?: Partial<SchemaEditorColumnForm>
    /** The Insert row values the drawer opens with, keyed by column name. */
    defaultRow?: Record<string, string>
    /** The column the Change type dialog opens on. */
    defaultAlterColumn?: string
    /** The open drawer starts as if submitted, so its validation messages show. */
    defaultSubmitted?: boolean
  }

  interface DraftColumn {
    key: string
    name: string
    type: string
    primaryKey: boolean
    defaultValue: string
  }
  interface DraftTable {
    name: string
    columns: DraftColumn[]
    relations: SchemaEditorRelation[]
  }
  type CsvRow = Record<string, string>
  type PendingChange = {
    kind: SchemaEditorDialog
    apply: () => void
    retry: (event: Event) => void
  }

  const props = withDefaults(defineProps<SchemaEditorProps>(), {
    tables: undefined,
    database: '',
    loading: false,
    error: '',
    defaultDraft: () => ({}),
    defaultCsv: undefined,
    defaultColumn: () => ({}),
    defaultRow: undefined,
    defaultAlterColumn: '',
    defaultSubmitted: false
  })

  const emit = defineEmits<{
    'create-table': [event: Event, table: SchemaEditorNewTable]
    'add-column': [event: Event, payload: { table: SchemaEditorTable; column: SchemaEditorColumn }]
    'insert-row': [
      event: Event,
      payload: { table: SchemaEditorTable; values: Record<string, string> }
    ]
    'change-type': [
      event: Event,
      payload: { table: SchemaEditorTable; column: SchemaEditorColumn; type: string }
    ]
    truncate: [event: Event, table: SchemaEditorTable]
  }>()

  const dialog = defineModel<SchemaEditorDialog>('dialog', { default: 'create' })
  const tableName = defineModel<string>('table', { default: '' })

  const database = computed(() => props.database || sampleDatabase)
  const source = computed<SchemaEditorTable[]>(() => props.tables ?? sampleTables)
  const items = ref<SchemaEditorTable[]>([])
  watch(
    source,
    (next) => {
      items.value = next.map((item) => ({ ...item, columns: item.columns.map((c) => ({ ...c })) }))
    },
    { immediate: true }
  )
  const table = computed(
    () => items.value.find((item) => item.name === tableName.value) ?? items.value[0]
  )

  const TYPES: ColumnType[] = [
    { value: 'int2', description: 'Signed two-byte integer', glyph: '#' },
    { value: 'int4', description: 'Signed four-byte integer', glyph: '#' },
    { value: 'int8', description: 'Signed eight-byte integer', glyph: '#' },
    { value: 'float4', description: 'Single precision floating-point number', glyph: '#' },
    { value: 'float8', description: 'Double precision floating-point number', glyph: '#' },
    { value: 'numeric', description: 'Exact number of selectable precision', glyph: '#' },
    { value: 'json', description: 'Textual JSON data', glyph: '{}' },
    { value: 'jsonb', description: 'Binary JSON data, decomposed', glyph: '{}' },
    { value: 'text', description: 'Variable-length character string', glyph: 'T' },
    { value: 'varchar', description: 'Variable-length string with a limit', glyph: 'T' },
    { value: 'uuid', description: 'Universally unique identifier', glyph: '#' },
    { value: 'bool', description: 'Logical boolean, true or false', glyph: 'B' },
    { value: 'date', description: 'Calendar date: year, month, day', glyph: '@' },
    { value: 'timestamp', description: 'Date and time', glyph: '@' },
    { value: 'timestamptz', description: 'Date and time, with time zone', glyph: '@' }
  ]
  const INTEGER_TYPES = ['int2', 'int4', 'int8']
  const glyphOf = (value: string) => TYPES.find((type) => type.value === value)?.glyph ?? '#'
  const filterTypes = (query: string) => {
    const term = query.trim().toLowerCase()
    if (!term) return TYPES
    return TYPES.filter(
      (type) => type.value.includes(term) || type.description.toLowerCase().includes(term)
    )
  }

  const definitionColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Column', principal: true, hideable: false },
    { accessorKey: 'type', header: 'Type', minWidth: 120 },
    { accessorKey: 'constraints', header: 'Constraints', grow: 2 },
    { id: 'actions', type: 'action', hideable: false }
  ]
  const definitionRows = computed(() =>
    (table.value?.columns ?? []).map((column) => ({
      name: column.name,
      id: column.name,
      type: column.type,
      constraints: [
        column.primaryKey ? 'PRIMARY KEY' : '',
        column.notNull ? 'NOT NULL' : '',
        column.defaultValue ? `DEFAULT ${column.defaultValue}` : ''
      ]
        .filter(Boolean)
        .join(', ')
    }))
  )

  const SCHEMA_TOAST = 'schema-editor'
  const TOAST = { id: SCHEMA_TOAST }
  onBeforeUnmount(() => toast.dismiss(SCHEMA_TOAST))

  const submitting = computed(() => props.loading)
  const pending = ref<PendingChange | null>(null)
  const dialogOpen = (kind: SchemaEditorDialog) =>
    computed({
      get: () => dialog.value === kind,
      set: (open: boolean) => {
        if (open) dialog.value = kind
        else if (dialog.value === kind) dialog.value = 'none'
      }
    })
  const createOpen = dialogOpen('create')
  const columnOpen = dialogOpen('column')
  const rowOpen = dialogOpen('row')
  const alterOpen = dialogOpen('alter')
  const truncateOpen = dialogOpen('truncate')

  let uid = 0
  const newColumn = (
    name = '',
    type = 'text',
    primaryKey = false,
    defaultValue = ''
  ): DraftColumn => ({
    key: `c-${(uid += 1)}`,
    name,
    type,
    primaryKey,
    defaultValue
  })
  const blankTable = (): DraftTable => ({
    name: '',
    columns: [
      newColumn('id', 'int8', true),
      newColumn('created_at', 'timestamptz', false, 'now()')
    ],
    relations: []
  })

  const createForm = reactive(blankTable())
  if (props.defaultDraft.name !== undefined) createForm.name = props.defaultDraft.name
  if (props.defaultDraft.relations)
    createForm.relations = props.defaultDraft.relations.map((relation) => ({ ...relation }))
  const createSubmitted = ref(props.defaultSubmitted && dialog.value === 'create')
  const createSubmitting = submitting
  const createServerError = ref(dialog.value === 'create' ? props.error : '')
  const typeQuery = ref('')
  const filteredTypes = computed(() => filterTypes(typeQuery.value))

  const namedColumns = computed(() => createForm.columns.filter((column) => column.name.trim()))
  const duplicateNames = computed(() => {
    const seen = new Map<string, number>()
    for (const column of namedColumns.value) {
      const name = column.name.trim().toLowerCase()
      seen.set(name, (seen.get(name) ?? 0) + 1)
    }
    return new Set([...seen].filter(([, count]) => count > 1).map(([name]) => name))
  })
  const tableNameError = computed(() => {
    if (createServerError.value) return createServerError.value
    if (!createSubmitted.value) return ''
    if (!createForm.name.trim()) return 'This field is required.'
    if (!/^[a-z_][a-z0-9_]*$/i.test(createForm.name.trim())) {
      return 'Start with a letter or an underscore; use letters, numbers and underscores.'
    }
    return ''
  })
  const columnError = (column: DraftColumn) =>
    createSubmitted.value && duplicateNames.value.has(column.name.trim().toLowerCase())
      ? `Another column is also named ${column.name.trim()}.`
      : ''
  const columnsError = computed(() =>
    createSubmitted.value && !namedColumns.value.length ? 'Add at least one named column.' : ''
  )

  watch(createOpen, (open) => {
    if (!open) return
    Object.assign(createForm, blankTable())
    createSubmitted.value = false
    createServerError.value = ''
    clearCsv()
  })

  const columnDefinition = [
    { key: 'name', label: 'Name', required: true },
    { key: 'type', label: 'Type' },
    { key: 'defaultValue', label: 'Default' },
    { key: 'primaryKey', label: 'Primary' }
  ]
  const columnErrors = computed(() =>
    createForm.columns.map((column) => {
      const message = columnError(column)
      return message ? { name: message } : undefined
    })
  )

  const csvInputEl = ref<HTMLInputElement | null>(null)
  const csvFile = ref<SchemaEditorCsvFile | null>(null)
  const csvHeaders = ref<string[]>([])
  const csvRows = ref<CsvRow[]>([])
  const csvError = ref('')
  const splitCsvLine = (line: string) => {
    const cells: string[] = []
    let cell = ''
    let quoted = false
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i]
      if (quoted && char === '"' && line[i + 1] === '"') {
        cell += '"'
        i += 1
      } else if (char === '"') quoted = !quoted
      else if (char === ',' && !quoted) {
        cells.push(cell.trim())
        cell = ''
      } else cell += char
    }
    cells.push(cell.trim())
    return cells
  }
  const inferType = (values: string[]) => {
    const filled = values.filter((value) => value !== '')
    if (!filled.length) return 'text'
    if (filled.every((value) => /^-?\d+$/.test(value))) return 'int8'
    if (filled.every((value) => /^-?\d+(\.\d+)?$/.test(value))) return 'numeric'
    if (filled.every((value) => /^(true|false)$/i.test(value))) return 'bool'
    if (filled.every((value) => /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2})?.*)?$/.test(value)))
      return 'timestamptz'
    return 'text'
  }
  const clearCsv = () => {
    csvFile.value = null
    csvHeaders.value = []
    csvRows.value = []
    csvError.value = ''
  }
  const applyCsv = (file: SchemaEditorCsvFile, text: string) => {
    clearCsv()
    const lines = text.split(/\r?\n/).filter((line) => line.trim())
    const headers = lines.length ? splitCsvLine(lines[0]) : []
    if (!headers.length || headers.some((header) => !header)) {
      csvFile.value = file
      csvError.value = 'The first line must name every column.'
      return
    }
    const rows = lines
      .slice(1)
      .map((line): CsvRow =>
        Object.fromEntries(splitCsvLine(line).map((value, index) => [headers[index], value]))
      )
    csvFile.value = file
    csvHeaders.value = headers
    csvRows.value = rows
    createForm.columns = headers.map((header) =>
      newColumn(
        header,
        inferType(rows.map((row) => row[header] ?? '')),
        header.toLowerCase() === 'id'
      )
    )
    if (!createForm.name.trim()) createForm.name = file.name.replace(/\.csv$/i, '')
  }
  const onCsvFiles = async (files: FileList | File[] | null) => {
    const file = Array.from(files ?? [])[0]
    if (!file) return
    if (!/\.csv$/i.test(file.name)) {
      clearCsv()
      csvFile.value = { name: file.name, size: file.size, type: file.type }
      csvError.value = 'Choose a .csv file.'
      return
    }
    applyCsv({ name: file.name, size: file.size, type: 'text/csv' }, await file.text())
  }
  const onCsvPick = (event: Event) => {
    const input = event.target as HTMLInputElement
    onCsvFiles(input.files)
    input.value = ''
  }
  const csvTokens = computed(() =>
    csvFile.value
      ? [
          {
            file: csvFile.value,
            error: csvError.value || undefined
          }
        ]
      : []
  )
  const csvPreviewColumns = computed(() =>
    csvHeaders.value.map((header): TableColumn => ({ accessorKey: header, header, minWidth: 120 }))
  )
  const csvPreview = computed(() =>
    csvRows.value.slice(0, 5).map((row, index) => ({ __row: `r${index}`, ...row }))
  )

  const ON_DELETE = [
    { value: 'NO ACTION', label: 'No action' },
    { value: 'CASCADE', label: 'Cascade' },
    { value: 'SET NULL', label: 'Set null' }
  ]
  const newRelation = (): SchemaEditorRelation => ({
    key: `fk-${(uid += 1)}`,
    column: '',
    table: '',
    references: '',
    onDelete: 'NO ACTION'
  })
  const referenceColumns = (relation: SchemaEditorRelation) =>
    items.value.find((item) => item.name === relation.table)?.columns ?? []
  const relationDefinition = [
    { key: 'column', label: 'Column', required: true },
    { key: 'table', label: 'References table', required: true },
    { key: 'references', label: 'References column', required: true },
    { key: 'onDelete', label: 'On delete' }
  ]
  const relationErrors = computed(() =>
    createForm.relations.map((relation) => {
      if (!createSubmitted.value) return undefined
      const missing = (['column', 'table', 'references'] as const).find((key) => !relation[key])
      return missing
        ? { [missing]: 'Choose the column, the table and the column it references.' }
        : undefined
    })
  )
  const relationsInvalid = computed(() =>
    createForm.relations.some(
      (relation) => !relation.column || !relation.table || !relation.references
    )
  )

  if (props.defaultCsv) applyCsv(props.defaultCsv.file, props.defaultCsv.text)

  const submitCreate = (event: Event) => {
    createSubmitted.value = true
    createServerError.value = ''
    if (createSubmitting.value) return
    if (
      tableNameError.value ||
      columnsError.value ||
      duplicateNames.value.size ||
      relationsInvalid.value ||
      csvError.value
    )
      return
    const name = createForm.name.trim()
    const columns = namedColumns.value.map((column): SchemaEditorColumn => ({
      name: column.name.trim(),
      type: column.type,
      primaryKey: column.primaryKey,
      notNull: column.primaryKey,
      defaultValue: column.defaultValue.trim()
    }))
    const rows = csvRows.value.map((row) => ({ ...row }))
    const relations = createForm.relations.map((relation) => ({ ...relation }))
    pending.value = {
      kind: 'create',
      retry: submitCreate,
      apply: () => {
        items.value = [
          ...items.value,
          { name, rowCount: rows.length, columns: columns.map((column) => ({ ...column })) }
        ]
        tableName.value = name
        createOpen.value = false
        toast.success(`Table ${name} created.`, {
          ...TOAST,
          description:
            [
              rows.length
                ? `${rows.length} ${rows.length === 1 ? 'row' : 'rows'} imported from CSV.`
                : '',
              relations.length
                ? `${relations.length} foreign ${relations.length === 1 ? 'key' : 'keys'} added.`
                : ''
            ]
              .filter(Boolean)
              .join(' ') || undefined,
          actions: [
            { label: 'Insert row', onClick: () => openRow() },
            { label: 'Add column', onClick: () => openColumn() }
          ]
        })
      }
    }
    toast.dismiss(SCHEMA_TOAST)
    emit('create-table', event, { name, columns, relations, rows })
  }

  const blankColumn = (): SchemaEditorColumnForm => ({
    name: '',
    type: 'text',
    defaultValue: '',
    primaryKey: false,
    notNull: false
  })
  const columnForm = reactive<SchemaEditorColumnForm>({ ...blankColumn(), ...props.defaultColumn })
  const columnSubmitted = ref(props.defaultSubmitted && dialog.value === 'column')
  const columnSubmitting = submitting
  const columnNameError = computed(() => {
    if (!columnSubmitted.value) return ''
    const name = columnForm.name.trim()
    if (!name) return 'This field is required.'
    if (table.value?.columns.some((column) => column.name === name.toLowerCase())) {
      return `${table.value.name} already has a column named ${name}.`
    }
    return ''
  })
  const openColumn = () => {
    columnOpen.value = true
  }
  const submitColumn = (event: Event) => {
    columnSubmitted.value = true
    if (columnSubmitting.value || columnNameError.value || !table.value) return
    const target = table.value
    const column: SchemaEditorColumn = {
      name: columnForm.name.trim(),
      type: columnForm.type,
      primaryKey: columnForm.primaryKey,
      notNull: columnForm.notNull || columnForm.primaryKey,
      defaultValue: columnForm.defaultValue.trim()
    }
    pending.value = {
      kind: 'column',
      retry: submitColumn,
      apply: () => {
        target.columns = [...target.columns, column]
        columnOpen.value = false
        toast.success(`Column ${column.name} added to ${target.name}.`, {
          ...TOAST,
          actions: [{ label: 'Change type', onClick: () => openAlter(column.name) }]
        })
      }
    }
    toast.dismiss(SCHEMA_TOAST)
    emit('add-column', event, { table: target, column: { ...column } })
  }

  const rowForm = reactive<Record<string, string>>({ ...props.defaultRow })
  const rowSubmitted = ref(props.defaultSubmitted && dialog.value === 'row')
  const rowSubmitting = submitting
  const isAuto = (column: SchemaEditorColumn) =>
    column.primaryKey && INTEGER_TYPES.includes(column.type)
  const rowError = (column: SchemaEditorColumn) =>
    rowSubmitted.value &&
    column.notNull &&
    !isAuto(column) &&
    !column.defaultValue &&
    !String(rowForm[column.name] ?? '').trim()
      ? `${column.name} cannot be NULL. Enter a value.`
      : ''
  const rowHint = (column: SchemaEditorColumn) => {
    if (isAuto(column)) return 'Generated by the database.'
    if (column.defaultValue) return `Empty uses the default, ${column.defaultValue}.`
    return column.notNull ? 'Required.' : 'Empty stores NULL.'
  }
  const openRow = () => {
    rowOpen.value = true
  }
  const submitRow = (event: Event) => {
    rowSubmitted.value = true
    if (rowSubmitting.value || !table.value) return
    if (table.value.columns.some((column) => rowError(column))) return
    const target = table.value
    pending.value = {
      kind: 'row',
      retry: submitRow,
      apply: () => {
        target.rowCount += 1
        rowOpen.value = false
        toast.success(`Row inserted into ${target.name}.`, {
          ...TOAST,
          actions: [{ label: 'Insert another', onClick: () => openRow() }]
        })
      }
    }
    toast.dismiss(SCHEMA_TOAST)
    emit('insert-row', event, { table: target, values: { ...rowForm } })
  }

  const alterColumn = ref(dialog.value === 'alter' ? props.defaultAlterColumn : '')
  const alterType = ref('text')
  const alterSubmitting = submitting
  const alterCurrent = computed(() =>
    table.value?.columns.find((column) => column.name === alterColumn.value)
  )
  const alterSql = computed(() => {
    if (!table.value || !alterCurrent.value) return ''
    const name = table.value.name
    const columns = table.value.columns.map((column) =>
      column.name === alterColumn.value
        ? `${column.name} ${alterType.value}`
        : `${column.name} ${column.type}`
    )
    return [
      'BEGIN;',
      `CREATE TABLE ${name}_new (${columns.join(', ')});`,
      `INSERT INTO ${name}_new SELECT * FROM ${name};`,
      `DROP TABLE ${name};`,
      `ALTER TABLE ${name}_new RENAME TO ${name};`,
      'COMMIT;'
    ].join('\n')
  })
  const openAlter = (name: string) => {
    alterColumn.value = name
    alterType.value = table.value?.columns.find((column) => column.name === name)?.type ?? 'text'
    typeQuery.value = ''
    alterOpen.value = true
  }
  const confirmAlter = (event: Event) => {
    if (alterSubmitting.value || !alterCurrent.value || !table.value) return
    const target = table.value
    const column = alterCurrent.value
    const type = alterType.value
    pending.value = {
      kind: 'alter',
      retry: confirmAlter,
      apply: () => {
        column.type = type
        alterOpen.value = false
        toast.success(`${column.name} is now ${type}.`, {
          ...TOAST,
          actions: [{ label: 'Change again', onClick: () => openAlter(column.name) }]
        })
      }
    }
    toast.dismiss(SCHEMA_TOAST)
    emit('change-type', event, { table: target, column: { ...column }, type })
  }

  const truncateConfirm = ref('')
  const truncateSubmitting = submitting
  const canTruncate = computed(() => truncateConfirm.value.trim() === table.value?.name)
  const openTruncate = () => {
    truncateOpen.value = true
  }
  const confirmTruncate = (event: Event) => {
    if (!canTruncate.value || truncateSubmitting.value || !table.value) return
    const target = table.value
    const removed = target.rowCount
    pending.value = {
      kind: 'truncate',
      retry: confirmTruncate,
      apply: () => {
        target.rowCount = 0
        truncateOpen.value = false
        toast.success(
          `${target.name} truncated. ${removed} ${removed === 1 ? 'row' : 'rows'} removed.`,
          {
            ...TOAST,
            actions: [{ label: 'Insert row', onClick: () => openRow() }]
          }
        )
      }
    }
    toast.dismiss(SCHEMA_TOAST)
    emit('truncate', event, target)
  }

  watch(dialog, (next) => {
    if (next === 'column') {
      Object.assign(columnForm, blankColumn())
      columnSubmitted.value = false
      typeQuery.value = ''
    }
    if (next === 'row') {
      for (const key of Object.keys(rowForm)) delete rowForm[key]
      for (const column of table.value?.columns ?? []) rowForm[column.name] = ''
      rowSubmitted.value = false
    }
    if (next === 'truncate') truncateConfirm.value = ''
  })

  const FAILURES: Partial<Record<SchemaEditorDialog, string>> = {
    column: "The column wasn't added.",
    row: "The row wasn't inserted.",
    alter: "The type wasn't changed.",
    truncate: "The table wasn't truncated."
  }
  const showFailure = () => {
    const change = pending.value
    if (!change || !props.error) return
    if (change.kind === 'create') {
      createServerError.value = props.error
      return
    }
    toast.error(FAILURES[change.kind] ?? '', {
      ...TOAST,
      description: props.error,
      action: { label: 'Retry', onClick: (event: MouseEvent) => change.retry(event) }
    })
  }
  watch(
    () => props.loading,
    (now, before) => {
      if (!before || now) return
      if (props.error) {
        showFailure()
        return
      }
      const change = pending.value
      pending.value = null
      change?.apply()
    }
  )
  watch(
    () => props.error,
    (next) => {
      if (next && !props.loading) showFailure()
    }
  )

  const onTableAction = (_event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue) => {
    if (value === 'truncate') openTruncate()
    if (value === 'create') createOpen.value = true
  }
  const onColumnAction = (value: DropdownMenuItemValue, row: { name: string }) => {
    if (value === 'alter') openAlter(row.name)
  }
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
    <Card :padded="false">
      <template #default>
        <DataTable
          :data="definitionRows"
          :columns="definitionColumns"
          row-key="id"
          :bordered="false"
          :aria-label="`Columns of ${table?.name ?? ''}`"
        >
          <template #toolbar>
            <div class="flex w-full flex-wrap items-center gap-(--spacing-xs)">
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  class="az az-table shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate text-heading-2xs text-(--text-default)">{{
                  table?.name
                }}</span>
                <Tag
                  :label="`${table?.rowCount ?? 0} ${table?.rowCount === 1 ? 'row' : 'rows'}`"
                  severity="neutral"
                  size="small"
                />
              </div>
              <div class="ms-auto flex flex-wrap items-center gap-(--spacing-xs)">
                <Button
                  label="Add column"
                  variant="outline"
                  size="medium"
                  icon="az az-plus"
                  @click="openColumn"
                />
                <Button
                  label="Insert row"
                  variant="primary"
                  size="medium"
                  icon="az az-plus"
                  @click="openRow"
                />
                <DropdownMenu
                  side="bottom"
                  align="end"
                  @select="onTableAction"
                >
                  <DropdownMenu.Trigger>
                    <Tooltip content="Table actions">
                      <IconButton
                        icon="az az-ellipsis"
                        variant="outline"
                        size="medium"
                        aria-label="Table actions"
                      />
                    </Tooltip>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="create"
                      label="Create Table"
                    >
                      <template #leading
                        ><i
                          class="az az-plus"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="truncate"
                      label="Truncate table"
                    >
                      <template #leading
                        ><i
                          class="az az-eraser"
                          aria-hidden="true"
                      /></template>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </DropdownMenu>
              </div>
            </div>
          </template>
          <template #cell-name="{ value }">
            <span class="min-w-0 truncate font-code text-label-code-sm">{{ value }}</span>
          </template>
          <template #cell-type="{ value }">
            <Tag
              :label="value"
              severity="neutral"
              size="medium"
            />
          </template>
          <template #cell-constraints="{ value }">
            <span class="text-body-sm text-(--text-muted)">{{ value || 'None' }}</span>
          </template>
          <template #cell-actions="{ row }">
            <TableCellActions
              :name="row.name"
              @select="(_event, value) => onColumnAction(value, row)"
            >
              <DropdownMenu.Group>
                <DropdownMenu.Item
                  value="alter"
                  label="Change type"
                >
                  <template #leading
                    ><i
                      class="az az-pencil"
                      aria-hidden="true"
                  /></template>
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </TableCellActions>
          </template>
        </DataTable>
      </template>
    </Card>

    <Drawer
      v-model:open="createOpen"
      size="large"
      side="end"
    >
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Create Table"
          novalidate
          @submit.prevent="submitCreate"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <DrawerTitle>Create Table</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                Define the table name and its columns in {{ database }}, or start from a CSV file.
                Drag a column's grip, or focus it and use the arrow keys, to reorder.
              </p>
            </div>
          </PanelHeader>

          <PanelBody>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="createSubmitting"
            >
              <legend class="sr-only">Create Table</legend>
              <SettingsSection
                title="General"
                hint="Names the table inside this database."
              >
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
                  <Alert
                    v-if="createServerError"
                    severity="danger"
                    :label="`The table wasn't created. ${createServerError} Your columns are kept; pick another name and create it again.`"
                  />
                  <Field :invalid="!!tableNameError">
                    <Field.Label>Name</Field.Label>
                    <Input
                      v-model="createForm.name"
                      size="large"
                      class="w-full"
                      placeholder="users"
                      autocomplete="off"
                      @update:model-value="createServerError = ''"
                    />
                    <Field.Description
                      >Every query addresses it, so it cannot be changed later without rewriting
                      them.</Field.Description
                    >
                    <Field.Error v-if="tableNameError">{{ tableNameError }}</Field.Error>
                  </Field>
                </div>
              </SettingsSection>

              <SettingsSection
                title="Import data from CSV"
                hint="Optional. The first line names the columns; the types are guessed from the values and can be changed below. Every row is inserted after the table is created."
              >
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
                  <FileDropzone
                    v-if="!csvFile"
                    accept=".csv,text/csv"
                    description="One .csv file, comma-separated, up to 10 MB."
                    @drop="(_event, files) => onCsvFiles(files)"
                  >
                    <Button
                      type="button"
                      label="Browse files"
                      variant="secondary"
                      size="medium"
                      @click="csvInputEl?.click()"
                    />
                  </FileDropzone>
                  <input
                    ref="csvInputEl"
                    type="file"
                    accept=".csv,text/csv"
                    class="hidden"
                    aria-hidden="true"
                    tabindex="-1"
                    @change="onCsvPick"
                  />
                  <FileTokenGroup
                    v-if="csvFile"
                    :items="csvTokens"
                    @remove="clearCsv"
                  />
                  <template v-if="csvRows.length">
                    <p class="m-0 text-body-sm text-(--text-muted)">
                      {{ csvHeaders.length }} columns and {{ csvRows.length }}
                      {{ csvRows.length === 1 ? 'row' : 'rows' }} read. The first
                      {{ csvPreview.length }} below; the columns were filled from the header.
                    </p>
                    <DataTable
                      :data="csvPreview"
                      :columns="csvPreviewColumns"
                      row-key="__row"
                      :bordered="true"
                      aria-label="CSV preview"
                    />
                  </template>
                </div>
              </SettingsSection>

              <SettingsSection
                title="Columns"
                hint="The table's schema, created in this order. A primary key is NOT NULL."
              >
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
                  <div class="flex flex-wrap items-center gap-(--spacing-xs)">
                    <Button
                      type="button"
                      label="About data types"
                      variant="outline"
                      size="small"
                      icon="az az-external-link"
                      href="https://www.azion.com/en/documentation/"
                      target="_blank"
                    />
                  </div>
                  <AttributeEditor
                    v-model:items="createForm.columns"
                    :definition="columnDefinition"
                    :errors="columnErrors"
                    :new-item="newColumn"
                    :min-items="1"
                    :disabled="createSubmitting"
                    reorderable
                    size="large"
                    add-button-label="Add column"
                    remove-button-label="Remove column"
                    aria-label="Columns"
                  >
                    <template #cell-name="{ index, invalid }">
                      <Input
                        v-model="createForm.columns[index].name"
                        size="large"
                        class="w-full"
                        placeholder="column_name"
                        :invalid="invalid"
                      />
                    </template>
                    <template #cell-type="{ index }">
                      <Select
                        v-model="createForm.columns[index].type"
                        size="large"
                        class="w-full"
                      >
                        <Select.Trigger>
                          <template #leading>
                            <span
                              class="shrink-0 font-code text-label-code-sm text-(--text-muted)"
                              aria-hidden="true"
                              >{{ glyphOf(createForm.columns[index].type) }}</span
                            >
                          </template>
                        </Select.Trigger>
                        <Select.Content>
                          <template #search>
                            <Input
                              v-model="typeQuery"
                              size="medium"
                              class="w-full"
                              placeholder="Search types"
                              aria-label="Search types"
                              @keydown.stop
                            />
                          </template>
                          <Select.Group label="Data types">
                            <Select.Item
                              v-for="type in filteredTypes"
                              :key="type.value"
                              :value="type.value"
                            >
                              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                                <span class="font-code text-label-code-sm">{{ type.value }}</span>
                                <span class="truncate text-body-xs text-(--text-muted)">{{
                                  type.description
                                }}</span>
                              </span>
                            </Select.Item>
                          </Select.Group>
                        </Select.Content>
                      </Select>
                    </template>
                    <template #cell-defaultValue="{ index }">
                      <Input
                        v-model="createForm.columns[index].defaultValue"
                        size="large"
                        class="w-full"
                        placeholder="NULL"
                      />
                    </template>
                    <template #cell-primaryKey="{ index }">
                      <Checkbox v-model="createForm.columns[index].primaryKey" />
                    </template>
                  </AttributeEditor>
                  <FieldError v-if="columnsError">{{ columnsError }}</FieldError>
                </div>
              </SettingsSection>

              <SettingsSection
                title="Foreign keys"
                hint="Optional. Tie a column to a row in another table, so a value that does not exist there is refused."
              >
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
                  <AttributeEditor
                    v-model:items="createForm.relations"
                    :definition="relationDefinition"
                    :errors="relationErrors"
                    :new-item="newRelation"
                    :disabled="createSubmitting"
                    size="large"
                    add-button-label="Add foreign key"
                    remove-button-label="Remove foreign key"
                    empty-title="No foreign keys."
                    aria-label="Foreign keys"
                  >
                    <template #cell-column="{ index, invalid }">
                      <Select
                        v-model="createForm.relations[index].column"
                        size="large"
                        class="w-full"
                        placeholder="Column"
                        :invalid="invalid"
                      >
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item
                            v-for="column in namedColumns"
                            :key="column.key"
                            :value="column.name.trim()"
                            >{{ column.name.trim() }}</Select.Item
                          >
                        </Select.Content>
                      </Select>
                    </template>
                    <template #cell-table="{ index, invalid }">
                      <Select
                        v-model="createForm.relations[index].table"
                        size="large"
                        class="w-full"
                        placeholder="Table"
                        :invalid="invalid"
                        @update:model-value="createForm.relations[index].references = ''"
                      >
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item
                            v-for="item in items"
                            :key="item.name"
                            :value="item.name"
                            >{{ item.name }}</Select.Item
                          >
                        </Select.Content>
                      </Select>
                    </template>
                    <template #cell-references="{ item, index, invalid }">
                      <Select
                        v-model="createForm.relations[index].references"
                        size="large"
                        class="w-full"
                        placeholder="Column"
                        :invalid="invalid"
                        :disabled="!item.table"
                      >
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item
                            v-for="column in referenceColumns(item)"
                            :key="column.name"
                            :value="column.name"
                            >{{ column.name }}</Select.Item
                          >
                        </Select.Content>
                      </Select>
                    </template>
                    <template #cell-onDelete="{ index }">
                      <Select
                        v-model="createForm.relations[index].onDelete"
                        size="large"
                        class="w-full"
                      >
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item
                            v-for="option in ON_DELETE"
                            :key="option.value"
                            :value="option.value"
                            >{{ option.label }}</Select.Item
                          >
                        </Select.Content>
                      </Select>
                    </template>
                  </AttributeEditor>
                </div>
              </SettingsSection>
            </fieldset>
          </PanelBody>

          <PanelFooter>
            <div class="flex w-full justify-end gap-(--spacing-xs)">
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                :disabled="createSubmitting"
                @click="createOpen = false"
              />
              <Button
                type="submit"
                label="Create Table"
                variant="primary"
                size="medium"
                :loading="createSubmitting"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </Drawer>

    <Drawer
      v-model:open="columnOpen"
      size="large"
      side="end"
    >
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Add column"
          novalidate
          @submit.prevent="submitColumn"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <DrawerTitle>Add column</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                The column is added at the end of {{ table?.name }}.
              </p>
            </div>
          </PanelHeader>
          <PanelBody>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="columnSubmitting"
            >
              <legend class="sr-only">Add column</legend>
              <SettingsSection
                title="Column"
                hint="Its name, type and the value rows get when they leave it empty."
              >
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-md)">
                  <Field :invalid="!!columnNameError">
                    <Field.Label>Name</Field.Label>
                    <Input
                      v-model="columnForm.name"
                      size="large"
                      class="w-full"
                      placeholder="column_name"
                      autocomplete="off"
                    />
                    <Field.Error v-if="columnNameError">{{ columnNameError }}</Field.Error>
                  </Field>
                  <Field>
                    <Field.Label>Type</Field.Label>
                    <Select
                      v-model="columnForm.type"
                      size="large"
                      class="w-full"
                    >
                      <Select.Trigger>
                        <template #leading>
                          <span
                            class="shrink-0 font-code text-label-code-sm text-(--text-muted)"
                            aria-hidden="true"
                            >{{ glyphOf(columnForm.type) }}</span
                          >
                        </template>
                      </Select.Trigger>
                      <Select.Content>
                        <template #search>
                          <Input
                            v-model="typeQuery"
                            size="medium"
                            class="w-full"
                            placeholder="Search types"
                            aria-label="Search types"
                            @keydown.stop
                          />
                        </template>
                        <Select.Group label="Data types">
                          <Select.Item
                            v-for="type in filteredTypes"
                            :key="type.value"
                            :value="type.value"
                          >
                            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                              <span class="font-code text-label-code-sm">{{ type.value }}</span>
                              <span class="truncate text-body-xs text-(--text-muted)">{{
                                type.description
                              }}</span>
                            </span>
                          </Select.Item>
                        </Select.Group>
                      </Select.Content>
                    </Select>
                  </Field>
                  <Field>
                    <Field.Label>Default value</Field.Label>
                    <Input
                      v-model="columnForm.defaultValue"
                      size="large"
                      class="w-full"
                      placeholder="NULL"
                      autocomplete="off"
                    />
                    <Field.Description
                      >Applies to rows that do not supply a value. Leave it empty for NULL, or use
                      an expression such as now().</Field.Description
                    >
                  </Field>
                </div>
              </SettingsSection>
              <SettingsSection
                title="Constraints"
                hint="A primary key is always NOT NULL, so turning it on also turns on Not null."
              >
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
                  <Field orientation="horizontal">
                    <Field.Content>
                      <Field.Title>Primary key</Field.Title>
                      <Field.Description
                        >Use this column as the table's primary key.</Field.Description
                      >
                    </Field.Content>
                    <Switch
                      v-model="columnForm.primaryKey"
                      aria-label="Primary key"
                    />
                  </Field>
                  <Field orientation="horizontal">
                    <Field.Content>
                      <Field.Title>Not null</Field.Title>
                      <Field.Description>Require a value in every row.</Field.Description>
                    </Field.Content>
                    <Switch
                      :model-value="columnForm.notNull || columnForm.primaryKey"
                      :disabled="columnForm.primaryKey"
                      aria-label="Not null"
                      @update:model-value="(value) => (columnForm.notNull = !!value)"
                    />
                  </Field>
                </div>
              </SettingsSection>
            </fieldset>
          </PanelBody>
          <PanelFooter>
            <div class="flex w-full justify-end gap-(--spacing-xs)">
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                :disabled="columnSubmitting"
                @click="columnOpen = false"
              />
              <Button
                type="submit"
                label="Add column"
                variant="primary"
                size="medium"
                :loading="columnSubmitting"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </Drawer>

    <Drawer
      v-model:open="rowOpen"
      size="large"
      side="end"
    >
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Insert row"
          novalidate
          @submit.prevent="submitRow"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <DrawerTitle>Insert row</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                One field per column of {{ table?.name }}, in the table's own order.
              </p>
            </div>
          </PanelHeader>
          <PanelBody>
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-(--spacing-md) border-0 p-0"
              :disabled="rowSubmitting"
            >
              <legend class="sr-only">Insert row</legend>
              <Field
                v-for="column in table?.columns ?? []"
                :key="column.name"
                :invalid="!!rowError(column)"
                :disabled="isAuto(column)"
              >
                <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                  <Field.Label
                    ><span class="font-code">{{ column.name }}</span></Field.Label
                  >
                  <span class="shrink-0 font-code text-body-xs text-(--text-muted)">{{
                    column.type
                  }}</span>
                </div>
                <Input
                  v-model="rowForm[column.name]"
                  size="large"
                  class="w-full"
                  :placeholder="
                    isAuto(column) ? 'Automatically generated' : column.defaultValue || 'NULL'
                  "
                  autocomplete="off"
                />
                <Field.Description>{{ rowHint(column) }}</Field.Description>
                <Field.Error v-if="rowError(column)">{{ rowError(column) }}</Field.Error>
              </Field>
            </fieldset>
          </PanelBody>
          <PanelFooter>
            <div class="flex w-full justify-end gap-(--spacing-xs)">
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                :disabled="rowSubmitting"
                @click="rowOpen = false"
              />
              <Button
                type="submit"
                label="Insert row"
                variant="primary"
                size="medium"
                :loading="rowSubmitting"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </Drawer>

    <ConfirmDialog
      v-model:open="alterOpen"
      :title="`Change the type of ${alterColumn}`"
      size="medium"
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Alert
          severity="warning"
          label="Changing a type rebuilds the table and copies every row. It can't be undone, and values that don't fit the new type make it fail."
        />
        <Field>
          <Field.Label>New type</Field.Label>
          <Select
            v-model="alterType"
            size="large"
            class="w-full"
          >
            <Select.Trigger>
              <template #leading>
                <span
                  class="shrink-0 font-code text-label-code-sm text-(--text-muted)"
                  aria-hidden="true"
                  >{{ glyphOf(alterType) }}</span
                >
              </template>
            </Select.Trigger>
            <Select.Content>
              <Select.Group label="Data types">
                <Select.Item
                  v-for="type in TYPES"
                  :key="type.value"
                  :value="type.value"
                >
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <span class="font-code text-label-code-sm">{{ type.value }}</span>
                    <span class="truncate text-body-xs text-(--text-muted)">{{
                      type.description
                    }}</span>
                  </span>
                </Select.Item>
              </Select.Group>
            </Select.Content>
          </Select>
          <Field.Description
            >Currently {{ alterCurrent?.type }}. Review the statements that will
            run.</Field.Description
          >
        </Field>
        <CodeEditor
          :model-value="alterSql"
          language="sql"
          readonly
          height="10rem"
          aria-label="Statements that will run"
        />
      </div>
      <template #actions="{ close }">
        <Button
          label="Cancel"
          variant="outline"
          size="medium"
          :disabled="alterSubmitting"
          @click="close"
        />
        <Button
          label="Change type"
          variant="primary"
          size="medium"
          :loading="alterSubmitting"
          :disabled="alterType === alterCurrent?.type"
          @click="confirmAlter"
        />
      </template>
    </ConfirmDialog>

    <ConfirmDialog
      v-model:open="truncateOpen"
      :title="`Truncate ${table?.name ?? ''}`"
      size="medium"
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Alert
          severity="warning"
          label="Once confirmed, this action can't be reversed."
        />
        <p class="m-0 text-body-sm text-(--text-muted)">
          Every row of {{ table?.name }} is removed ({{ table?.rowCount }} now). The columns, their
          types and constraints stay as they are.
        </p>
        <CodeEditor
          :model-value="`TRUNCATE TABLE ${table?.name ?? ''};`"
          language="sql"
          readonly
          height="3rem"
          :show-line-numbers="false"
          aria-label="Statement that will run"
        />
        <Field>
          <Field.Label
            >Type <code class="text-label-code-sm">{{ table?.name }}</code> to confirm.</Field.Label
          >
          <Input
            v-model="truncateConfirm"
            size="large"
            class="w-full"
            autocomplete="off"
            @keydown.enter="confirmTruncate"
          />
        </Field>
      </div>
      <template #actions="{ close }">
        <Button
          label="Cancel"
          variant="outline"
          size="medium"
          :disabled="truncateSubmitting"
          @click="close"
        />
        <Button
          label="Truncate table"
          variant="danger"
          size="medium"
          :loading="truncateSubmitting"
          :disabled="!canTruncate"
          @click="confirmTruncate"
        />
      </template>
    </ConfirmDialog>
  </div>
</template>
```

## `sample.ts`

```ts
import type { SchemaEditorCsv, SchemaEditorRelation, SchemaEditorTable } from './edit-schema.vue'

export const sampleDatabase = 'acme-store'

export const sampleTables: SchemaEditorTable[] = [
  {
    name: 'customers',
    columns: [
      { name: 'id', type: 'int8', primaryKey: true, notNull: true, defaultValue: '' },
      { name: 'name', type: 'text', primaryKey: false, notNull: true, defaultValue: '' },
      { name: 'email', type: 'varchar', primaryKey: false, notNull: true, defaultValue: '' },
      {
        name: 'created_at',
        type: 'timestamptz',
        primaryKey: false,
        notNull: false,
        defaultValue: 'now()'
      }
    ],
    rowCount: 3
  },
  {
    name: 'orders',
    columns: [
      { name: 'id', type: 'int8', primaryKey: true, notNull: true, defaultValue: '' },
      { name: 'customer_id', type: 'int8', primaryKey: false, notNull: true, defaultValue: '' },
      { name: 'total', type: 'numeric', primaryKey: false, notNull: true, defaultValue: '' }
    ],
    rowCount: 2
  }
]

export const sampleCsv: SchemaEditorCsv = {
  file: { name: 'subscribers.csv', size: 412, type: 'text/csv' },
  text: [
    'id,customer_id,email,plan,active,joined_at',
    '1,1,ada@example.com,pro,true,2026-03-02',
    '2,2,lin@example.com,free,true,2026-04-18',
    '3,1,ops@example.com,team,false,2026-05-07',
    '4,3,"kim, j@example.com",pro,true,2026-06-21',
    '5,2,ravi@example.com,free,true,2026-07-30',
    '6,3,sol@example.com,team,true,2026-09-12'
  ].join('\n')
}

export const sampleRelations: SchemaEditorRelation[] = [
  {
    key: 'fk-seed',
    column: 'customer_id',
    table: 'customers',
    references: 'id',
    onDelete: 'CASCADE'
  }
]
```
