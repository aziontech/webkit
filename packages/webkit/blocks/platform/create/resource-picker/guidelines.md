# Resource picker

The band a create flow uses when the resource being created needs another resource that may already exist. The user either reuses one of theirs or makes a new one on the spot, and answers it in one place: an Existing / New choice, then a searchable, paged list of what exists or the few fields that create a new one. The chosen row is marked, every search and load is announced, and a missing answer is flagged above the list where it is seen first.

## When to use

- A create flow binds a whole resource that the user may reuse or create: the project a service serves, the deployment a release is cut against, the firewall that protects a workload.
- The candidates can run past seven, so the list needs search, paging and a no-match line.
- Creating the bound resource takes one or a few fields that fit in the same card.

## When not to use

- A single field that references an existing resource (a certificate, an environment, a function): use a select row inside the form, as `platform/create/provision-wizard` does for Environment.
- Choosing where a resource runs as a step of its own, with module tags and an inline create row: use the chooser in `platform/create/multipage-create` or `platform/create/source-wizard`.
- Browsing or managing the resources themselves: use `platform/view/table-view`.
- Creating the bound resource needs its own full form: link to its create page (`platform/create/single-page-create`) instead of nesting it here.

## Building blocks

### A. Band card — `Card` (required)

`Card :padded="false"` titled with the bound noun ("Project"), opening with one muted sentence on what the binding does. The card is flush so the list rows run edge to edge; text and controls carry their own padding. It sits in the form column (`layout-column-form`) like any other band.

### B. Existing / New choice — `ToggleGroup` (required when something exists)

A `ToggleGroup` at `size="large"`, `fluid`, with two options, `Existing <noun>` and `New <noun>`, and an `aria-label` that names the question. Existing is the default when at least one resource exists. When none exist the toggle is not rendered and the card opens on New. Switching modes keeps both answers: going to New and back finds the same row still chosen.

### C. New resource fields — `Field`, `Input` (required in New)

New swaps the list for the fields that create the resource, usually one Name `Field` with a large `Input` and a placeholder in the resource's own format. The `Field.Description` carries the allowed characters and becomes the required message once Next is pressed with it empty (`Field :required`). Nothing is judged while the user types.

### D. Search and required message — `Input`, `HelperText` (optional)

A large `Input` with a search icon, placeholder and matching `aria-label`, shown only when the list pages (more than one batch). It matches name and description. A `HelperText kind="required"` sits under the search and above the rows when Next is pressed with nothing chosen, and the wrapper takes `data-field-invalid`.

### E. Resource list — `Item`, `Skeleton` (required in Existing)

`Item.List` of small `Item`s rendered `as-child` on a `button`, one per resource: an icon in `Item.Media`, name in `Item.Title`, a secondary fact in `Item.Description`, and a check in `Item.Actions` on the chosen row. The chosen row takes `data-selected` and `aria-pressed`. While a batch loads, `Skeleton` rows in the same shape follow the visible ones, `aria-hidden`, with staggered widths. A value chosen beyond the first batch is revealed on open, never hidden behind Load more.

### F. Load more — `Button` (optional)

A transparent small full-width `Button` under the list while more matches remain, labelled with the size of the next batch and spinning with `:loading` while it fetches. The list pages five at a time. A no-match line replaces the rows when the search finds nothing, and a visually hidden `role="status"` line reports the count after every search and load.

## Do

- Default to Existing when anything exists, and drop the toggle entirely when nothing does.
- Mark the chosen row three ways: background, trailing check and `aria-pressed`.
- Keep the required message above the rows, under the search, so it is read before the list is scanned.
- Offer the other mode in the no-match line, so an empty search leads to creating one.
- Keep the chosen value when the user switches to New and back.
- Build the band once and pass the noun, icon and options; every flow that binds a resource reads the same (see `skills/webkit-create-surface`).

## Don't

- Don't use radio buttons or a select for a whole resource the user may also create; that is this band.
- Don't show the search for a list that fits in one batch.
- Don't validate the Name while it is being typed, or show required and invalid together.
- Don't render a loading spinner in place of the rows; show skeleton rows in the row shape and keep the visible ones.
- Don't put the create fields in a dialog or a second page; they belong in the same card.

## Copy

- **Card title:** the bound noun, singular, e.g. "Project".
- **Lead:** one sentence on what the binding does, e.g. "What this service serves on each environment, so one service can serve different projects on Production and Preview."
- **Toggle options:** `Existing <noun>` and `New <noun>`, e.g. "Existing project", "New project".
- **Search:** placeholder and `aria-label` name the collection, e.g. "Search projects".
- **Load more:** the verb and the batch size, e.g. "Load 5 more".
- **No match:** the fact, then both ways out, e.g. "No project matches “api”. Create one instead, or clear the search."
- **Required:** what to do, as a sentence, e.g. "Select the project this service serves, or create a new one."
- **Name guidance:** the allowed characters, e.g. "Lowercase letters, numbers, and hyphens."
- Follow `skills/webkit-microcopy`: "Select", never "Pick" or "Choose"; sentence case; no em dash.

## Accessibility

- The `ToggleGroup` has an `aria-label` that states the question, e.g. "Where the project comes from".
- Each row is a native `button` with `aria-pressed` reflecting the selection; the check icon is `aria-hidden`.
- Search has an `aria-label` that matches its placeholder.
- A `role="status"` region announces the count after every search, load and no-match, e.g. "5 of 19 projects".
- Skeleton rows are `aria-hidden`; the Load more `Button` carries `:loading` so its busy state is announced.
- The required message is tied to the search group by `data-field-invalid`, and focus stays where it was when it appears.

## States

- Existing: resources exist; the toggle sits on Existing with a row already chosen in the first batch.
- New: the user switched to New; the list gives way to the Name field with the allowed characters as helper text.
- Loading: Load more was pressed; five skeleton rows follow the visible ones and the button spins.
- Required: Next was pressed with nothing chosen; the required message sits under the search, above the list.

## Related

- `platform/create/provision-wizard` — binds its project with this band on the first step and reuses the list for the deployment.
- `platform/create/multipage-create` — the step wizard whose Where it runs chooser follows the same list rules.
- `platform/states/form-validation` — how required and invalid messages appear on submit.
- `Item` — the selectable row the list is built from; see `skills/webkit-form`.
- `ToggleGroup` — the Existing / New segment; see `skills/webkit-create-surface`.
