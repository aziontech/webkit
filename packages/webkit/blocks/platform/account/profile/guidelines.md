# Profile

The profile page of a signed-in account, and the layout every account settings page follows. The user comes to check or change how the account is identified, billed and signed into: a small page heading over stacked sections, each a flush card of setting rows in the form column, with a save bar that rises once a saved field changes. Billing, credentials, users and teams keep the same column and swap the sections for their own cards or tables.

## When to use

- Account-level settings pages (profile, billing details, security).
- Any settings page with several independent groups of fields saved together.

## When not to use

- A resource's settings tab: use `platform/settings/settings-form`.
- Editing a resource in a focused flow: use `platform/edit/edit-resource`.
- Changing the plan: use `platform/account/change-plan-drawer`.

## Building blocks

### A. Page heading — `PageHeader` (required)

`size="small"`, title and a one-sentence description of what the page manages.

### B. Section — `SettingsSection` (required)

One per group (General, Company information, Address information, Login settings, Source control, Appearance, Danger zone), each with a `hint` and an `anchor`.

### C. Section body — `Card` (required)

Flush (`:padded="false"`); the rows are its only content.

### D. Row list — `Item` (required)

`Item.List` wraps the rows of a card. In Source control each provider is an `Item` with `Item.Media`, `Item.Content` (title, description) and `Item.Actions`.

### E. Setting — `SettingRow` (required)

Title and description at the start, the control at the end. `kind="stacked"` for a wide control (Textarea), `kind="compact"` for a switch or a button.

### F. Text value — `Input` (required)

Large, with an `aria-label` that matches the row title. Client ID is `readonly`. Address rows use `postal-code`, `address-line1` and `address-line2` autocomplete.

### G. Long value — `Textarea` (required)

Billing emails, three rows.

### H. Choice — `Select` (required)

Country, state and city; font family and system appearance. The trigger carries the row's name as `aria-label`.

### I. Toggle — `Switch` (required)

Allow social login, Enforce multi-factor authentication.

### J. Actions — `Button` (required)

Row actions (`Manage`, `Connect` with an external-link icon), the `danger` Delete account, and the save bar's Discard and Save (`:loading` while saving).

### K. Connection state — `Tag` (optional)

`Active` with `success` severity next to a connected provider.

### L. Unsaved changes — `SaveBar` (required)

Rises with a motion-reduced transition once the form differs from the saved copy, and stays while saving: `You have unsaved changes.` with Discard and Save.

### M. Field message — `HelperText` (conditional)

Under Account name and Billing emails after Save: `required` when empty, `invalid` when an address is malformed, linked with `aria-describedby`. Save stops and focus moves to the first field in error.

### N. Toasts — `Toaster` (required)

Mounted once with the page. A save no field owns that fails is `toast.error` with Retry and keeps the changes; a successful save toasts `Profile saved.`

## Do

- Disable the whole fieldset while saving and release it when the request ends, on success and on failure.
- Keep preferences that apply immediately (Appearance) and external connections (Source control) out of Save, and say so in their section hints.
- Put destructive actions in the last section, behind a confirmation (`platform/delete/delete-with-confirmation`).

## Don't

- Don't toast a field-level server rejection; it goes to an `Alert` in the owning section with the row's control invalid.
- Don't render the save bar while nothing changed.
- Don't put helper text in the row title; the description holds it.

## Copy

- **Section hints:** one sentence on what the group affects: `The company that owns the account, as it appears on every invoice.`
- **Row titles:** sentence case nouns, product names capitalized: `Billing emails`, `GitHub`.
- **Save bar:** `You have unsaved changes.` with `Discard` and `Save`.
- **Destructive row:** one verb for the title and the button: `Delete personal account` with `Delete account`. Never `Remove` for a permanent delete.
- **Optional fields:** the description says it: `Optional. Apartment, suite or floor.`
- **Field errors:** `This field is required.`, `Enter valid email addresses, separated by semicolons.`
- **Save failure:** unscoped failures go to `toast.error` with Retry: `The profile wasn't saved.`, described by `The request didn't reach the server. Your changes are kept.`
- **Save success:** `Profile saved.`

## Accessibility

- Each control's `aria-label` matches its visible row title.
- Section anchors let the page be deep-linked; headings form a single outline under the page title.
- The save bar is reachable by keyboard right after the last field and does not cover focused content.

## States

- Default: the profile filled from the account, save bar hidden until a saved field changes. Saving with Account name set to `Offline` walks the failure toast; an empty Account name or a malformed billing address walks the field errors.

## Related

- `platform/settings/settings-form` — the same rows for a resource's settings.
- `platform/delete/delete-with-confirmation` — the Delete account confirmation.
- `shells/console` — the shell this page renders in.
