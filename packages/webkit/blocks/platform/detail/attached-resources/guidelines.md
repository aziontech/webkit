# Attached resources

A short list of the things one resource is attached to, shown in place inside its Settings tab. Here they are its domains: the user sees every address the resource answers on, which environment, deployment policy and certificate each one uses, and can edit, delete or add one without leaving the settings page.

## When to use

- A section of a resource's Settings tab lists related records owned by that resource (domains, attached origins, bound certificates) and the list is short enough to read without search or paging.
- Each related record has two to four attributes worth scanning side by side, and one or two row actions.
- The user adds a related record from inside the resource, so the action reads `Add <Module>`.

## When not to use

- The related records are many and need search, filters or columns: use the records table in `platform/detail/record-table`.
- A first-level list of one resource type reached from the sidebar: use `platform/view/table-view`.
- Pairs of keys and values the user types in place: use `platform/edit/attribute-editor`.
- Choosing one existing resource inside a form: use `platform/create/resource-picker`.

## Building blocks

### A. Container — `Card` (required)

`Card :padded="false"` holds the table and the footer as one surface, so the table runs edge to edge and the footer rule meets the card border. It sits as the body of a `SettingsSection` band of the Settings tab, under that section's heading.

### B. Attached table — `TableRoot` (required)

A data-driven `TableRoot :bordered="false"` given `:data`, `:columns` and `row-key`, one row per attached record, each cell rendered through a `#cell-<accessorKey>` slot. The first column is `principal` and carries the record's name (the domain). The last column is `kind: 'action'` with no header text. No sorting, search or paging: if the list needs them, it is a record table instead.

### C. Environment chip — `Tag` (optional)

One chip per row, following `skills/webkit-tables`: Environment is a `Tag` with `severity="secondary"`, `size="medium"`, `rounded` and the layers glyph. Policy is plain text and Certificate is the verified glyph beside plain text, so the row keeps one chip. A record without an environment leaves its Environment and Policy cells empty instead of printing a placeholder.

### D. Row actions — `Table.CellActions`, `DropdownMenuGroup`, `DropdownMenuOption` (required)

`Table.CellActions`, named after the record ("Actions for shop.example.com"), opens a menu placed `bottom-end`: Edit in the first group, Delete alone in the last. A record the platform generated (the default domain) has no menu, because it cannot be edited or deleted.

### E. Footer — `Button` (required)

Below a top rule, a muted count on the left ("3 domains") and an outlined medium `Add <Module>` `Button` with a plus icon on the right. The row wraps on narrow cards.

## Do

- Keep the card unpadded and the table borderless, so there is one border around the whole list.
- Keep one chip per row: the Environment `Tag` (secondary, medium, rounded); every other attribute is plain text, with a glyph where it helps.
- Leave a cell empty when the attribute does not apply to that record.
- Hide the row menu on records the user cannot change, rather than showing disabled options.
- Count the records in the footer with the right singular or plural noun.
- Follow `skills/webkit-tables` for column kinds and the action column.

## Don't

- Don't add search, filters or pagination; switch to `platform/detail/record-table` when the list needs them.
- Don't use a primary or large button for Add; the page's Save belongs to the settings form.
- Don't put Delete in the same group as Edit, or use a destructive color in the menu trigger.
- Don't write a dash or "None" in cells that do not apply.
- Don't wrap the table in a second card or give it its own border.

## Copy

- **Column headers:** short nouns without punctuation, e.g. "Domain", "Environment", "Policy", "Certificate".
- **Add action:** `Add <Module>` with the entity's capitalization, e.g. "Add Domain"; never "Create" inside a resource.
- **Count:** a number and the noun, singular or plural, e.g. "1 domain", "3 domains".
- **Row menu:** single verbs, e.g. "Edit", "Delete"; the trigger tooltip reads "Row actions".
- **Attribute values:** the value as the product names it, e.g. "Production", "Managed".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The row menu trigger's `aria-label` names the record, e.g. "Actions for shop.example.com", so a screen reader user knows which row it acts on.
- Menu option icons carry `aria-hidden="true"`; the option label is the accessible name.
- The action column has no visible header; its cells hold only the labeled trigger.
- The menu is reachable by keyboard, opens on Enter or Space and returns focus to its trigger on close.
- The count is plain text, read after the table, before the Add button.

## States

- Default: three domains, one generated by the platform with no row menu, two the user added with Edit and Delete, and the footer counting them beside Add Domain.

## Related

- `platform/edit/edit-resource` — the Settings tab whose Domains section renders this card.
- `platform/detail/record-table` — the full records table for longer related lists.
- `platform/delete/delete-with-confirmation` — the dialog behind the row menu's Delete.
- `TableRoot` — the table this card wraps; see `skills/webkit-tables`.
