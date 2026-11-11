# Create in drawer

The right-side drawer that adds or edits something that only exists inside another resource: a domain, a DNS record, an environment, a variable, a rule. The user is working on the resource behind it and must keep it in view, so the form slides over the page instead of replacing it. They fill a few sections, press the one commit button and land back where they were, with the new item in the list.

## When to use

- The item belongs to a resource that is already open (a domain on a workload, a record in a zone, a rule or an origin on a resource), per the surface rule in `skills/webkit-create-surface`.
- Editing that same item from its row menu; the drawer opens on its values and saves them.
- A first-level tuple normally created in bulk, such as variables, the one exception the surface rule allows.
- A select needs another item of the same resource that may not exist yet, such as the origin a new rule sends requests to: the NestedDrawer shape creates it in a second drawer and selects it back.

## When not to use

- A resource the sidebar routes to: create it on a page with `platform/create/single-page-create`, or `platform/create/multipage-create` when it needs several pages.
- A blocking yes or no question, or a destructive guard: use `platform/delete/delete-with-confirmation`.
- Deploying what exists: use `platform/create/deploy-drawer`, which commits a deployment rather than a record.
- Binding a whole resource that may be reused or created in a create flow: use `platform/create/resource-picker`.
- A select that needs a missing first-level resource, such as a service or a function: the stacked drawer would create on the wrong surface. Link to that resource's create page, or bind it with `platform/create/resource-picker`.
- Editing the settings of the resource itself: use `platform/edit/edit-resource`.

## Building blocks

### A. Trigger — `Button` (required)

An outlined medium `Button` where the list lives: under the section on the resource's Settings tab, a heading action, or a row menu entry for edit. Its label is the drawer's title and the footer button, word for word.

### B. Drawer frame — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent` (required)

`Drawer` at `size="medium"` for a form of two or three sections; large for the ItemRows shape. It portals over the page with an overlay and holds one `form` with an `aria-label` equal to the title. State resets each time the drawer opens, never on close, so the content stays in place while it slides out.

### C. Panel header — `PanelHeader`, `DrawerTitle`, `DrawerClose` (required)

`DrawerTitle` with the action and object, a muted one-line description under it, and `DrawerClose` on the right. The close button, the overlay and Escape are the dismissal; there is no Cancel.

### D. Sections — `PanelContent`, `SettingsSection` (required)

`PanelContent` holds one `fieldset` disabled while saving, and inside it one `SettingsSection` per topic, each a title with a `hint` glyph rather than a paragraph. Order them by what the user decides first: here Environment, then Domain.

### E. Environment select — `Label`, `Select`, `HelperText` (required)

A large `Select` with a `Label` and a `HelperText` tied to the trigger by `aria-describedby`. The options are every environment, and the panel ends with a Create Environment option. The helper text says where the item answers, and changes to say when picking an environment the resource does not publish to yet connects it.

### F. Domain source — `Field`, `RadioButton` (required)

Choice cards: one horizontal `Field` per option with a `RadioButton`, a title and a description, grouped under a `Label` by `aria-labelledby`. Use cards when each option needs a sentence; a plain radio list when it does not.

### G. Domain name — `Field`, `InputGroup` (required)

A `Field` with its label and an `InputGroup` whose addon shows the free platform suffix while the free option is chosen. The required message appears in the field description only after submit.

### H. Certificate — `Label`, `Select`, `HelperText` (optional)

Shown only for Bring my own domain. The `Select` preselects a certificate that already covers the address and the `HelperText` says so; once the user picks one, it stops following the address.

### I. Context alert — `Alert` (optional)

One info `Alert` at the end of the last section for a fact that governs the whole form, such as the address the resource always keeps. It explains; it never repeats a field's helper.

### J. Footer — `PanelFooter`, `Button` (required)

`PanelFooter` with one primary medium `Button`, alone on the right, labeled like the trigger, with `:loading` while the save is in flight.

## Do

- Open on a blank form every time, or on the edited item's values, and clear every error on open.
- Lock the `fieldset` and pass `:disabled` to every control from the same flag while saving; release it on success and on failure.
- Validate on submit only: an empty required field gets the amber required prompt after Save is pressed.
- Close the drawer on success and show the new item in the list behind it, with a toast that names it.
- Stack a second, medium drawer for a missing item of the same resource, such as an origin for a rule, and select the new one back into the parent.

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
- Every select trigger points at its `HelperText` with `aria-describedby`, so the consequence is read with the value.
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

## Related

- `platform/view/table-view` — the list a create drawer usually opens over.
- `platform/detail/details-page` — where Add actions on a resource's tabs open this drawer.
- `platform/create/single-page-create` — the page a first-level resource creates on instead.
- `platform/create/deploy-drawer` — the drawer that deploys rather than creates.
- `platform/states/form-validation` — the submit-time validation this drawer follows.
- `SettingsSection` — the band each section is built from; see `skills/webkit-form` for fields and validation.
