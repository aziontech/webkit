# Create in drawer

The right-side drawer that adds or edits something that only exists inside another resource: a domain, a DNS record, an environment, a variable, a rule. The user is working on the resource behind it and must keep it in view, so the form slides over the page instead of replacing it. They fill a few sections, press the one commit button and land back where they were, with the new item in the list. The drawer opens over a console page: ItemRows and NestedDrawer draw that page as a page body for `ConsoleLayout` (the layout owns the rail, the header and the `main`).

## When to use

- The item belongs to a resource that is already open (a domain on a workload, a record in a zone, a rule or an origin on a resource), per the surface rule in `skills/webkit-create-surface`.
- Editing that same item from its row menu; the drawer opens on its values and saves them.
- A first-level tuple normally created in bulk, such as variables, the one exception the surface rule allows.
- A select needs another item of the same resource that may not exist yet, such as the origin a new rule sends requests to: the NestedDrawer shape creates it in a second drawer and selects it back.
- A form needs a resource that does not exist yet, first-level ones included, such as the digital certificate of a workload being created: offer `Create certificate` in the field, and the drawer holds that resource's own create form (`large` over a page, `medium` over a drawer) and selects it back. The reader never leaves the form to create it.

## When not to use

- A resource the sidebar routes to: create it on a page with `create/create-page`, or `create/create-wizard` when it needs several pages.
- A blocking yes or no question, or a destructive guard: use `edit/delete-dialog`.
- Deploying what exists: use `create/deploy-drawer`, which commits a deployment rather than a record.
- Binding a whole resource that may be reused or created in a create flow: use `create/resource-picker`.
- A missing resource whose creation takes several steps, such as a project imported from a repository: open its create page in a new tab and give the field a `Refresh` option.
- Editing the settings of the resource itself: use `edit/edit-resource`.

## Building blocks

### A. Trigger — `Button` (required)

An outlined medium `Button` where the list lives: under the section on the resource's Settings tab, a heading action, or a row menu entry for edit. Its label is the drawer's title and the footer button, word for word.

### B. Drawer frame — `Drawer`, `DrawerContent` (required)

`Drawer` at `size="large"`, the standard drawer, for every shape; only the nested child steps down to `medium`. It portals over the page with an overlay and holds one `form` with an `aria-label` equal to the title. State resets each time the drawer opens, never on close, so the content stays in place while it slides out.

### C. Panel header — `PanelHeader`, `DrawerTitle` (required)

`DrawerTitle` with the action and object, a muted one-line description under it, and the drawer's own close button on the right. The close button, the overlay and Escape are the dismissal; there is no Cancel.

### D. Sections — `PanelBody`, `SettingsSection` (required)

`PanelBody` holds one `fieldset` disabled while saving, and inside it one `SettingsSection` per topic, each a title with a `hint` glyph rather than a paragraph. Order them by what the user decides first: here Environment, then Domain.

### E. Environment select — `Field`, `Select` (required)

A large `Select` in a required `Field` with its `Field.Label` and a `Field.Description` that the `Field` ties to the trigger by `aria-describedby`; after a failed submit a `Field.Error` takes its place and the `Field` turns `invalid`. The options are every environment, and the panel ends with a Create Environment option. The helper text says where the item answers, and changes to say when picking an environment the resource does not publish to yet connects it.

### F. Domain source — `Field`, `RadioGroup` (required)

Choice cards: a `RadioGroup` with `kind="card"`, one item per option with a title and a description, grouped in a `fieldset` under a `kind="label"` `Field.Legend`. Use cards when each option needs a sentence; a plain radio list when it does not.

### G. Domain name — `Field`, `InputGroup` (required)

A `Field` with its label and an `InputGroup` whose addon shows the free platform suffix while the free option is chosen. The field is `required` from the start (the Required marker shows on the label); after an empty submit the `Field` turns `invalid` and a `Field.Error` (`role="alert"`) says so. Every variant renders field errors the same way: `Field.Error` under the control, never a `Field.Description` swapped to an error.

### H. Certificate — `Field`, `Select`, `HelperText` (optional)

Shown only for Bring my own domain. The `Select` preselects a certificate that already covers the address and the `HelperText` says so; once the user picks one, it stops following the address.

### I. Context alert — `Alert` (optional)

One info `Alert` at the end of the last section for a fact that governs the whole form, such as the address the resource always keeps. It explains; it never repeats a field's helper.

### J. Footer — `PanelFooter`, `Button` (required)

`PanelFooter` with one primary medium `Button`, alone on the right, labeled like the trigger, with `:loading` while the save is in flight.

### K. Certificate import — `SettingsSection`, `Field`, `Button`, `PanelFooter` (optional)

In the Certificate state the drawer imports a TLS certificate. A `ToggleGroup` picks Server certificate (certificate and private key) or Trusted CA (certificate only), and the section hint follows it. The certificate is a required `Field` with a code-font `Textarea` for the PEM text and an outlined Upload file `Button` beside its label that reads a .pem, .crt or .cer file into the same field and announces the file it loaded. As soon as the text holds a certificate, a details panel reads it in the browser: Issued to, Issued by, Valid from and Expires in a two-column `KeyValueList`, the expiry carrying a `StatusIndicator` (success with the days left, warning within 30 days with a line saying to renew it, danger once expired), and a note when intermediate certificates follow. Text that is not a PEM certificate, an expired certificate and a missing or malformed private key are errors under their fields, shown only after Save, with focus on the first. The private key's description says it is stored encrypted and never shown again. Save closes the drawer and raises a success toast with the expiry date.

## Do

- Open on a blank form every time, or on the edited item's values, and clear every error on open.
- Lock the `fieldset` and pass `:disabled` to every control from the same flag while saving; release it on success and on failure.
- Validate on submit only: an empty required field gets the amber required prompt after Save is pressed.
- Close the drawer on success and show the new item in the list behind it, with a toast that names it (every variant does).
- On a failed save keep the drawer open with the values, release the fieldset and show a danger `Alert` with Retry above the footer (SaveError).
- Stack a second, medium drawer for a missing item of the same resource, such as an origin for a rule, and select the new one back into the parent.
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/console` does), so this page body never renders a `Toaster`.

## Don't

- Don't create in a dialog, or open a page for an item that lives inside a resource.
- Don't add Cancel next to the commit button.
- Don't flag fields while the user is still typing, or show required and invalid on one field at once.
- Don't hide a required field inside a collapsed section.
- Don't reset the form on close; the content would jump while the drawer slides out.
- Don't deploy or publish as a side effect of Save.

## Copy

- **Trigger, title, commit:** one string, `Add <Product Module>` inside a resource, e.g. "Add Domain"; editing keeps the verb the row menu used.
- **Description:** one or two muted sentences with a period under the title, e.g. "A domain is what puts an environment on this resource. Say where it answers, and name the address."
- **Section hints:** one sentence on what the section decides, e.g. "Where the domain answers."
- **Options:** labels name the choice, descriptions one sentence, e.g. "Use your own DNS and point it to this resource."
- **Helper text:** states the consequence of the current value, e.g. "Production publishes with the Deployment Settings set to Single."
- **Required:** "This field is required."
- **Create option:** `Create <Object>` at the foot of the select, e.g. "Create Environment".
- Follow `skills/webkit-microcopy` and `skills/webkit-errors`: sentence case, no em dash, no "please", select rather than pick.

## Accessibility

- The drawer traps focus while open, moves it to the first field on open and returns it to the trigger on close.
- The `form` has an `aria-label` that matches the title; `DrawerTitle` names the dialog.
- Every select trigger is described by its `Field.Description` (or its `Field.Error`) through the `Field`, so the consequence is read with the value.
- Required fields carry the Required marker from the start; an error is a `Field.Error` with `role="alert"` and the control is `aria-invalid`.
- The choice cards are a radio group named by the Domain source label; each card's title and description are the radio's name and description.
- The loading button keeps its label and announces the busy state; the disabled `fieldset` keeps keyboard users out of the form while saving.
- Escape, the close button and the overlay all dismiss; none of them submit.

## States

- Default: Add Domain opened from the resource's Settings tab, blank, on the free domain option.
- AddEnvironment: the same form opened from the environment menu, titled and saved as Add Environment.
- EditDomain: opened from a domain row menu on www.example.com, with the Certificate select showing the covering wildcard.
- AddRecord: the DNS zone record form; Name and Value are flagged as required only after an empty Add Record.
- ItemRows: Add Origin on the Origins page of the storefront resource, a large drawer whose sections are `Item` rows in flush cards, saved together by one Add Origin.
- NestedDrawer: Add Rule on the storefront resource's Rules Engine, with an Origin select whose Create Origin option opens a second, medium drawer and selects the new origin back.
- DeploymentSettings: the drawer that creates a Deployment Setting, with General and Routing and policy sections.
- Certificate: Create Certificate opened with shop.example.com pasted as a server certificate: the details panel reads Issued to shop.example.com, Issued by Example Test CA and the expiry with the days left; the private key is empty, so Save flags it.
- CreateEnvironment: Create Environment with General, Settings, Protection and Branch tracking sections; the IP allowlist and Branch tracking switches each reveal their fields, a duplicate name or an invalid address is flagged only after Create Environment. Opened from Add Domain's Environment select it stacks at medium size above that drawer and selects the new environment back.
- SaveError: Add Domain after a failed save: the drawer stays open with acme-store and Production kept, the fieldset released, and a danger Alert with Retry above the footer.
- FunctionInstance: Add Function Instance (or Edit from a row) with a Function `Select`, a Name, and the arguments as a `SchemaForm` of the chosen function's schema with a Fields or JSON `ToggleGroup`; the JSON `CodeEditor` marks a parse error, and required arguments are flagged only after submit.

## Related

- `view/table-view` — the list a create drawer usually opens over.
- `detail/resource-detail` — where Add actions on a resource's tabs open this drawer.
- `create/create-page` — the page a first-level resource creates on instead.
- `create/deploy-drawer` — the drawer that deploys rather than creates.
- `state/form-validation` — the submit-time validation this drawer follows.
- `SettingsSection` — the band each section is built from; see `skills/webkit-form` for fields and validation.
