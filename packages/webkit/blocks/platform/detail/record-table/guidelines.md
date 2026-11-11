# Record table

The detail page of a resource that owns a long list of records, here a DNS zone. The user arrives from the zones index to do one of two jobs: adjust the zone itself (name, nameservers, DNSSEC, status) and save, or find, add, edit and delete the records the zone answers with. A tab bar splits the two jobs so the settings form and the records table never share a scroll.

## When to use

- A resource has its own settings and also owns many child records that need search, filters, sorting and paging (DNS records, firewall entries, list items).
- Users copy values out of the resource into another system (nameservers, DNSSEC digests) and need a copy control next to each value.
- Child records are added from inside the resource, so the action reads `Add <Module>`.

## When not to use

- The child list is short and needs no search or filters: use `platform/detail/attached-resources` inside a settings section.
- A first-level list reached from the sidebar: use `platform/view/table-view`.
- A resource whose detail page is an overview with several tabs and no dominant record list: use `platform/detail/details-page`.
- Settings only, with no child records: use `platform/edit/edit-resource`.

## Building blocks

### A. Tab bar — `PageTabs`, `Tabs` (required)

A full-bleed `PageTabs` with one `Tabs.Item` per tab, Main settings first and Records second. Each tab panel scrolls on its own under the bar. See `skills/webkit-navigation`.

### B. Settings sections — `SettingsSection`, `Card`, `ItemList`, `SettingRow`, `Input`, `HelperText` (required)

Main settings is a form in the form column with four `SettingsSection` bands: General, Configure your nameserver, DNSSEC and Status. Each band wraps a flush `Card :padded="false"` around an `ItemList` of `SettingRow`s, each with a title and a one-sentence description. Name and Domain Name are large `Input`s; their required `HelperText` appears only after Save is pressed with them empty and clears as soon as the user types. See `skills/webkit-form`.

### C. Copyable values — `InputGroupRoot`, `Input`, `CopyButton` (required)

Values the user copies elsewhere (the three nameservers, and the key tag, algorithm, digest type and digest) are read-only large `Input`s inside an `InputGroupRoot` that ends with a transparent `CopyButton`. A helper line under the nameservers says where to paste them.

### D. Toggles — `Switch` (required)

Enable DNSSEC and Active are compact `SettingRow`s whose control is a `Switch`. The DNSSEC key rows appear only while DNSSEC is on.

### E. Save bar — `SaveBar`, `Button` (required)

A docked `SaveBar` slides up at the bottom of the form on the first edit, with the unsaved-changes label, an outlined Discard and a primary Save, both medium. While saving, the fieldset is disabled, Save shows its loading state and Discard is disabled. The bar leaves when Save lands or Discard restores the record.

### F. Records heading — `PageHeader`, `Button` (required)

The Records tab opens with a small `PageHeader` titled Records with a one-sentence description, and two outlined medium actions: Documentation and Add Record. Inside a resource no action is primary and the create verb is Add.

### G. Filter popover — `PopoverRoot`, `PopoverTrigger`, `PopoverContent`, `Button`, `Badge`, `IconButton`, `CalendarRoot`, `Input`, `Avatar` (optional)

The outlined Filter `Button` opens one popover with the Type and Policy fields; a `Badge` on the trigger counts applied fields. Filters narrow `:data` and rewind pagination to the first page. It is the same recipe as `platform/view/table-view`.

### H. Toolbar and columns — `Input`, `Tooltip`, `IconButton`, `PopoverRoot`, `PopoverTrigger`, `PopoverContent`, `Switch`, `Button` (optional)

A medium search `Input` bound to `v-model:globalFilter`, then outlined `IconButton`s for Refresh, Download CSV and Columns, each named by a `Tooltip`. The Columns popover holds one `Switch` per hideable column and a Show all columns `Button`. ID is hidden by default; Name cannot be hidden.

### I. Applied filters — `Chip`, `Avatar` (optional)

One wrapping row of filled medium `Chip`s, one per applied field, in field order. Each chip reopens its field and can be removed.

### J. Records table — `Card`, `TableRoot`, `CopyButton`, `Tag` (required)

`Card :padded="false"` around `TableRoot :bordered="false"` with `row-key="id"`, sorting, `paginated` at 8 rows and `:loading`. Name is `principal`. Type is a secondary `Tag`. ID and Value end with an outlined `CopyButton` that stays pinned at the cell end while the text truncates. Weight and Description show a dash glyph when empty.

### K. Row actions — `DropdownMenuRoot`, `DropdownMenuTrigger`, `DropdownMenuGroup`, `DropdownMenuOption`, `Tooltip`, `IconButton` (required)

An outlined small ellipsis `IconButton` named Row actions opens a menu placed `bottom-end` with Edit in the first group and Delete alone in the last.

## Do

- Keep settings and records on separate tabs, each with its own scroll.
- Show required errors only after a failed save, and clear each one when its field changes.
- Make every copyable value read-only and pair it with a `CopyButton` whose label names the value.
- Raise the save bar only when something changed, and keep it until Save lands or Discard restores the record.
- Reuse the table view controls row and table recipe in the Records tab so filters, search and columns behave the same as on index pages.
- Rewind pagination to the first page when filters or search change.

## Don't

- Don't put a primary or large Create button in the Records heading; it is `Add Record`, outlined.
- Don't validate on first render or on blur; the form is quiet until Save.
- Don't make nameservers or digests editable text the user could change by accident.
- Don't save Main settings from a button inside each section; one save bar covers the whole form.
- Don't let the records table scroll the page sideways.

## Copy

- **Tabs:** short nouns, e.g. "Main settings", "Records".
- **Section titles:** a noun or a short instruction, e.g. "General", "Configure your nameserver".
- **Row descriptions:** one sentence that ends with a period, e.g. "Give a unique and descriptive name to identify your zone."
- **Required error:** "This field is required."
- **Save bar:** the label states the fact, e.g. "You have unsaved changes."; buttons "Discard" and "Save".
- **Records heading:** title "Records", description one sentence, e.g. "The authoritative records this zone answers with."; actions "Documentation" and "Add Record".
- **Copy buttons:** name the value, e.g. "Copy nameserver 1", "Copy record value".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The form is labeled "Zone settings" and its fieldset has a visually hidden legend with the same words.
- Each `Input` has an `aria-label` matching its row title; an `Input` with an error points to its `HelperText` through `aria-describedby`.
- Every icon-only control has an `aria-label` and a `Tooltip` with the same words; decorative icons carry `aria-hidden="true"`, and so does the filter `Badge`.
- Search has an `aria-label` that matches its placeholder, "Search records".
- Focus order follows reading order: tabs, form fields, save bar; or heading actions, Filter, search, toolbar, chips, table, pagination.
- Tab panel entrances respect reduced motion.

## States

- MainSettings: the Main settings tab with General, nameservers, DNSSEC and Status; the save bar appears on the first edit.
- Records: the Records tab with the zone's one A record, the ID column hidden by default.
- ImportZoneFile: Import zone file, beside Add Record, opens a large `Drawer`. The file comes from a `FileDropzone` (one `.zone`, `.txt` or `.db` file; a rejected or empty file shows an invalid `HelperText` under it) or is pasted into a `Textarea`. Every line is previewed in a `TableRoot`: line number, name relative to the origin, type, value and a Ready, Skipped or Error `Tag`, with the reason under the value. The counts sit in a polite status line, errors add a danger `Alert` above the preview, and Import N records (disabled at zero) adds only the ready lines, then a toast says how many were imported and how many lines were left out.

## Importing a zone file

- Parse on the client as the text changes and preview every line before anything is written; never import on drop.
- Name the line number on every row, so the user can fix the file.
- Skip with a reason what the zone manages itself (SOA, apex NS) and types it does not support; mark as errors only values that are wrong.
- Import what is ready even when some lines fail, and say in the toast how many were left out.

## Related

- `platform/view/table-view` — the index this page is opened from, and the source of the controls row recipe.
- `platform/edit/edit-resource` — the settings form and save bar pattern used by Main settings.
- `platform/detail/attached-resources` — a short related list inside a settings section.
- `platform/delete/delete-with-confirmation` — the dialog behind the row menu's Delete.
- `SaveBar` — the unsaved-changes band; see `skills/webkit-form`.
