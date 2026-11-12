# Schema editor

The table schema of a SQL database: the definition of one table and the drawers and dialogs that change it. A developer creates a table with its columns, adds a column, inserts a row by hand, changes a column's type or empties a table, and stays on the same surface while each change runs. It sits behind the Create Table, Add column, Insert and table menu buttons of `platform/view/query-editor`. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header, the ⌘K palette and the `main`.

## When to use

- A SQL database's tables are created and changed from the console rather than only with SQL.
- A table's columns, types and constraints are shown and edited one change at a time.
- A row is added by hand to check a table, without writing an INSERT.

## When not to use

- Running SQL or reading query results: use `platform/view/query-editor`.
- Rows of a resource that is not a database (variables, records): use `platform/edit/attribute-editor` or `platform/detail/record-table`.
- A form that creates a resource in its own page: use `platform/create/single-page-create`.
- A generic item created inside a resource: use `platform/create/create-in-drawer`.

## Building blocks

### A. Definition surface — `Card`, `TableRoot`, `Table`, `Tag`, `Button`, `DropdownMenu`, `Tooltip`, `IconButton` (required)

One `Card :padded="false"` around a `TableRoot :bordered="false"` named `Columns of <table>`. The toolbar slot holds the table glyph and name, a small secondary `Tag` with the row count, an outlined Add column `Button`, the primary Insert row `Button` and a Table actions `IconButton` (with its `Tooltip`) that opens a `DropdownMenu`: Create Table in the first group, Truncate table alone in the last. The rows are the columns: the name in the code font, the type as a secondary `Tag`, the constraints in muted text (`PRIMARY KEY, NOT NULL, DEFAULT now()`, or `None`), and a per-column `Table.CellActions` ("Actions for <column>") with Change type.

### B. Create Table drawer — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `DrawerClose`, `PanelContent`, `SettingsSection`, `Alert`, `Field`, `Input` (required)

A large right `Drawer` whose content is a `form` named Create Table. The `PanelHeader` holds the `DrawerTitle`, one muted sentence (the database and how to reorder) and `DrawerClose`. A `fieldset` disabled while the request runs holds two `SettingsSection`s. General has one `Field` with the table Name in the code font and why it cannot be renamed lightly. A rejection from the server goes above it as a danger `Alert` that says what happened and that the columns are kept, and on the field as its `Field.Error`, per `platform/states/form-error`.

### C. Column rows — `Select`, `Checkbox`, `HelperText` (required)

The Columns section is a list named Columns, one bordered row per column: a grip `button` that drags the row with the pointer (the dragged row fades with a dashed accent outline, the target shows a 2 px accent line on the side it lands, Escape cancels) or moves it with ArrowUp and ArrowDown, keeps focus on it and announces each move in a polite status line (`Moved email to position 2 of 4.`), the name `Input`, a type `Select` whose trigger shows the type's glyph (`#`, `T`, `{}`, `@`, `B`) and whose content has a Search types `Input` over the Data types group (value in the code font and a muted description), a default value `Input` (`NULL` placeholder), a Primary `Checkbox` with its visible label, and a Remove column `IconButton` (disabled on the last row). A duplicate name puts an invalid `HelperText` under its row; no named column puts one under the list. A full-width outlined Add column `Button` appends a row and focuses its name. About data types links out. New tables start with `id int8` as the primary key and `created_at timestamptz DEFAULT now()`.

### D. CSV import and foreign keys — `FileDropzone`, `FileTokenGroup` (optional)

Two optional sections in the Create Table drawer. Import data from CSV: a `FileDropzone` (one .csv) with a Browse files button over a hidden file input; once read, the file is a `FileTokenGroup` token (Remove clears it), the columns are rebuilt from the header with types guessed from the values (`int8`, `numeric`, `bool`, `timestamptz`, else `text`; `id` becomes the primary key) and stay editable, an empty name takes the file's, and a bordered `TableRoot` previews the first five rows under a line that counts columns and rows. A header with an empty name or a non-CSV file is an error on the token and blocks Create. Foreign keys: one bordered row per key, Column (the named columns), `references`, Table and its Column (enabled once a table is picked), and On delete (No action, Cascade, Set null), with Remove; Add foreign key appends one. After Create, an incomplete row shows `Choose the column, the table and the column it references.` The success toast counts the imported rows and the keys. The drawer imports into a new table; an existing empty table imports from its own page (M2.10 row).

### E. Add column drawer — `Switch` (required)

A medium drawer with the same header and footer recipe. Column has Name (invalid when empty or when the table already has it), Type (the same `Select`) and Default value (empty for NULL, or an expression such as `now()`). Constraints has Primary key and Not null as horizontal `Field`s with a `Switch`; Primary key turns Not null on and locks it.

### F. Insert row drawer — `PanelFooter` (required)

A medium drawer with one `Field` per column in table order: the label is the column name in the code font with its type at the end, the description says what an empty value does (`Generated by the database.`, `Empty uses the default, now().`, `Required.`, `Empty stores NULL.`). An integer primary key is disabled and generated. After Insert row is pressed, a NOT NULL column with no value and no default is invalid with `<column> cannot be NULL. Enter a value.` Every drawer's `PanelFooter` holds Cancel and the submit button (`:loading` while it runs).

### G. Change type dialog — `ConfirmDialog`, `CodeEditor` (required)

A large `ConfirmDialog` titled `Change the type of <column>`: a warning `Alert` (the table is rebuilt, every row is copied, it can't be undone, values that don't fit make it fail), the New type `Select` with the current type in its description, and the statements that will run (`BEGIN; CREATE TABLE …_new …; INSERT INTO …; DROP TABLE …; ALTER TABLE … RENAME TO …; COMMIT;`) in a read-only `CodeEditor` with `language="sql"`. The primary Change type is disabled until the type differs.

### H. Truncate table dialog — `ConfirmDialog`, `CodeEditor`, `Input` (required)

A medium `ConfirmDialog` titled `Truncate <table>`, following `platform/delete/delete-with-confirmation`: a warning `Alert`, one sentence with what goes (every row, with the count) and what stays (columns, types, constraints), the `TRUNCATE TABLE <table>;` statement in a read-only `CodeEditor` without line numbers, and a `Field` whose label asks to type the table name. The danger Truncate table button enables only when it matches.

### Outcome toasts — through `toast`

Raised through `toast` with one id, so each change replaces the last toast. Schema changes are not deploys: each success names what changed and offers the next thing to do with the table, never Edit and Redeploy or View deployments. Create Table: `Table events created.` with Insert row and Add column. Add column: `Column phone added to customers.` with Change type. Insert row: `Row inserted into customers.` with Insert another. Change type: `email is now text.` with Change again. Truncate: `customers truncated. 3 rows removed.` with Insert row. A request that never reached the database is a danger toast with Retry that keeps the form. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so the page never renders a `Toaster`.

## Do

- Validate on submit, then keep each error next to what caused it: the field, the column row or the list.
- Keep the drawer open and its values intact when the server refuses; say so in the section `Alert`.
- Show the SQL a destructive or rebuilding change will run before it runs.
- Ask for the table name before truncating it.
- Let the grip reorder columns by drag and from the keyboard, announce each move, and keep focus on the moved row.
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
- The grip is a real `button` named `Reorder <column>, position <n> of <total>. Drag, or use the up and down arrow keys.` with `aria-keyshortcuts`; dragging is never the only way (WCAG 2.5.7), moves are announced in a polite status line, and reordering keeps focus on the moved grip.
- Every icon-only button has an `aria-label` that matches its `Tooltip`; the per-column menu trigger names its column.
- The read-only `CodeEditor`s are named (`Statements that will run`) and can be selected and copied.
- Drawers and dialogs trap focus, close on Escape and return focus to the button that opened them.

## States

- CreateTable: the Create Table drawer open on a new table, with the default id and created_at columns.
- AddColumn: the Add column drawer with phone as varchar.
- InsertRow: the Insert row drawer after a submit with email empty, showing the NOT NULL error.
- ChangeType: the Change type dialog for email with the statements that will run.
- TruncateTable: the Truncate customers dialog waiting for the typed name.
- ImportCsv: Create Table with subscribers.csv read (six columns, six rows, a quoted comma) and one foreign key, customer_id to customers.id on delete cascade.
- Failed: Create Table refused by the server because customers already exists; Alert in General and the Name field invalid.

## Related

- `platform/view/query-editor` — the database page whose buttons open these drawers and dialogs.
- `platform/create/create-in-drawer` — the drawer recipe these drawers follow.
- `platform/delete/delete-with-confirmation` — the typed confirmation Truncate table follows.
- `platform/states/form-error` — the rule for the server's name conflict.
- `platform/states/async-submit` — the long-action rule; schema changes use item actions, not Edit and Redeploy.
- `CodeEditor`, `Select`, `Field` — see `skills/webkit-form` and `skills/webkit-create-surface`.
