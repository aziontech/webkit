# Single page create

The page a first-level resource is created on when everything it needs fits on one screen. The user arrives from the module's `Create <Object>` button, answers the required fields at the top, leaves the defaulted ones folded under Advanced, and commits from a bar that never scrolls away. The page has its own URL, its own creation header and no sidebar, so it survives a reload and the back button, and leaving it returns to the list.

## When to use

- The resource is one the sidebar routes to (a domain, a service, a purge) and the user came only to create it (`skills/webkit-create-surface`).
- Its fields fit in a few sections without depending on each other's answers step by step.
- An action that takes a form and runs once, whose submit names what it does (Save, Purge, Deploy).
- The settings page of the same resource: it reuses these sections in the same order.

## When not to use

- The fields split into steps that unlock in order, or one answer adds a step: use `platform/create/multipage-create`.
- The resource binds another one and then deploys: use `platform/create/provision-wizard` or `platform/create/source-wizard`.
- The thing is created inside another resource (a record in a zone, a rule in an application): use `platform/create/create-in-drawer`.
- Editing an existing resource where the commit bar should mount only after a change: use `platform/settings/settings-form`.
- Never put a create form in a dialog.

## Building blocks

### A. Creation header — `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar` (required)

`GlobalHeader` with no sidebar: a small outlined `IconButton` back to the module ("Back to Domains"), the `Brand` linking home, a `Breadcrumb` of the module and the page title, and the account `Avatar` on the right. The breadcrumb's last item repeats the create button's label exactly.

### B. Page heading — `PageHeader` (required)

`PageHeader size="small"` at the top of the centred form column (`layout-column-form`), titled with the create label and described in one sentence of what the resource is. Its `title-id` labels the `form`. One section gap separates it from the first band.

### C. Sections — `SettingsSection`, `Card`, `Item` (required)

Each band is a `SettingsSection` with a title and a `hint` (the glyph that reveals guidance on hover or focus) over a flush `Card :padded="false"` whose content is an `Item.List` of rows. Required fields go in the first band, General. The last band is Advanced: `collapsible`, `icon="pi pi-cog"`, closed by default (`v-model:open`), holding only fields the endpoint does not require, that already carry its default and that are not the point of the form.

### D. Field rows — `SettingRow`, `Input`, `HelperText` (required)

A `SettingRow` per field: its title names the field and its description carries the guidance, so the control takes an `aria-label` instead of a separate label. A large `Input` sits right at the fixed cell width. On submit, an empty required field gets `:required` and a `HelperText kind="required"`; a value the endpoint rejects gets `:invalid` and `kind="invalid"`, never both. Editing the field clears its own message. A wide control (textarea, radio choice cards) uses `kind="stacked"` so it takes the full measure below the name.

### E. Switch rows — `Switch` (optional)

On/off settings use `SettingRow kind="compact"` with a `Switch` hard right at its natural size, named by an `aria-label` that matches the row title, e.g. "Enable DNSSEC".

### F. Commit bar — `SaveBar`, `Button` (required)

`SaveBar kind="plain"`, fixed under the scrolling region on the form's measure. Its `#leading` slot holds what sits at the start, when there is something: an outlined Import `Button` and one muted line on the domain form, nothing on the others. Its `#actions` slot holds outlined Cancel and the primary submit, both medium `Button`s. The submit is the form's only `type="submit"`. A long create uses the same bar as a full-bleed sticky footer; the Import from Git form instead ends with one Deploy `Button` at the end of the column.

## Do

- Put every required field in the first band; never inside Advanced, so a failed submit always points at something on screen.
- Validate on submit only, then clear each message as soon as its field is edited.
- Give every control an `aria-label` that repeats its row title.
- Keep Cancel and the submit in the same bar, submit last, and name the submit after what it does (Save, Purge, Deploy).
- Lock the whole `fieldset` and every control with one `submitting` flag while the request is in flight, and put `:loading` on the submit.
- On success, show a toast that names the resource and opens it (`skills/webkit-errors`).

## Don't

- Don't show the sidebar on this page, or open it as a modal over the list.
- Don't print the band's guidance as a paragraph under its title; use the `hint`.
- Don't mark fields required or invalid before the first submit, or show both states on one field.
- Don't make Save deploy, publish or charge as a side effect; creating is not deploying.
- Don't add a validation summary at the top; each message sits at its field.
- Don't squeeze a textarea or radio group into the right-hand cell; stack the row.

## Copy

- **Title and breadcrumb:** the create label, verb first with the entity's capitalization, e.g. "Create Domain". Identical to the button that opened the page.
- **Description:** one sentence on what the resource is, e.g. "A domain holds the DNS records that answer authoritatively for a hostname."
- **Section titles:** the domain, not the widget, e.g. "General", "Target", "Delivery settings", "Advanced".
- **Row descriptions:** a full sentence with a period, saying what the value does, e.g. "Identifies the domain in this list. It is not the hostname."
- **Submit:** one verb, e.g. "Save", "Purge", "Deploy". Cancel is always exactly "Cancel".
- **Required message:** "This field is required."
- **Invalid message:** what to enter, with an example, e.g. "Enter a valid domain name. Example: example.com."
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no parentheses in labels, no "please".

## Accessibility

- One `main` landmark holding one `form`, labelled by the `PageHeader` title through `aria-labelledby`, with `novalidate` so the page's own messages replace the browser's.
- A `fieldset` with a visually hidden `legend` groups the sections.
- Each message is tied to its control with `aria-describedby` and appears only on submit; required and invalid are announced through the control's own state.
- The collapsed Advanced region is `inert` while closed, so keyboard focus never lands in hidden fields.
- The back `IconButton` and the account trigger have `aria-label`s; decorative icons carry `aria-hidden="true"`.
- Focus order follows reading order: header, heading, General, Advanced toggle, then the bar's Import, Cancel and Save.

## States

- Default: the Create Domain page at rest; General holds Name and Domain name, Advanced is collapsed, the bar shows Import, Cancel and Save.
- CreatePurge: a Target band of radio choice cards for Layer and Purge type, an Arguments textarea that follows the type, a warning alert and a bar with Cancel and Purge.
- CreateService: a long create in five groups of rows over a full-bleed sticky `SaveBar` with Cancel and Save.
- RequiredFields: Create Service after Save on the empty form; Name and Address show "This field is required." until edited.
- ImportFromGit: the same job inside the platform shell with standalone field stacks under plain headings, an acknowledgement checkbox and one Deploy button at the end of the column.
- ImportFromGitSubmitted: Import from Git after Deploy on the untouched form; every required field shows its required state and message.

## Related

- `platform/create/multipage-create` — the same job split into steps.
- `platform/create/create-in-drawer` — create inside a resource without leaving it.
- `platform/settings/settings-form` — the edit page that reuses these sections.
- `platform/states/form-validation` — required and invalid states on submit.
- `platform/view/table-view` — the list whose `Create <Object>` button opens this page.
- `SettingRow` — the field row every section is built from; see `skills/webkit-form`.
