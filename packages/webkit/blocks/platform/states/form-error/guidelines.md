# Form error

The form-error pattern, taken from the design sample (`/forms/error-validation`): what a long create form does when the server rejects the save because of one section. The user's job is to create a service; another user deletes the origin it links to while the form is open, so the save comes back with an error the Origin section owns. The page takes the user to that section, says what happened and that nothing else was lost, offers the one action that recovers (Reload origins), and marks the field with its own reason. This is the standard for every server rejection that a section or a field owns.

This block is a focused create page with its own creation header and no rail: render it outside `ConsoleLayout` (`shells/console`).

## When to use

- A long, sectioned create or edit form whose save can be rejected because of one section: a linked resource deleted or changed by someone else, a value the server refuses for that section only.
- As the reference for where a field-scoped or section-scoped server error renders, and how the user recovers without retyping anything.

## When not to use

- The submit states of a short form (required, invalid, in flight, a conflict on a one-section form, an unscoped failure, success): use `platform/states/form-validation`.
- A long-running action that reports back later (build, deploy): use `platform/states/async-submit`.
- A failure no field or section owns (network, timeout, 500): an error toast with Retry, as in `platform/states/form-validation` ServerError.
- Signed-out screens: use `platform/auth`, where every outcome lands in one card `Alert`.

## Building blocks

### A. Creation header — `GlobalHeader` (required)

The full-width header of a creation page: back, brand and location on the start side, the account on the end side. Same frame as `headers/creation-header`.

### B. Back — `IconButton` (required)

`pi-chevron-left`, `kind="outlined"`, with `aria-label="Back to Forms"`.

### C. Product mark — `Brand` (required)

Inside a link to Home.

### D. Location — `Breadcrumb` (required)

Where the form sits, ending in the page.

### E. Account — `Avatar` (required)

The signed-in user, inside a labelled button.

### F. Simulation — `Tag` (simulation only)

In the dashed `aside` labelled `Scenario simulation`: `Server in sync` (`success`) or `Deleted server-side: web-origin-prod` (`danger`). The panel is a story device that plays the other user; a real page has no such control.

### G. Actions — `Button` (required)

Simulation controls (`User 2 deletes the linked origin`, `Reset scenario`), the recovery action on the section `Alert` (`Reload origins`, `kind="secondary"`, `loading` while it runs), and the footer's `Cancel` and `Save`.

### H. Section heading — `SectionHeader` (required)

Over every group. The Origin heading carries an id so the save can scroll it into view; the section `Alert` opens right under it.

### I. Group surface — `Card` (required)

`:padded="false"` around each section's rows.

### J. Rows — `Item` (required)

`Item.List` inside each `Card`, one row per setting.

### K. Setting row — `SettingRow` (required)

Title and description on the start side, the control on the end side.

### L. Text values — `Input` (required)

Name and Host header, each with an `aria-label` and its error wired by `aria-describedby`.

### M. Ports — `MultiSelect` (required)

HTTP ports, with `MultiSelect.Trigger` carrying the id the error points at.

### N. Linked resource — `Select` (required)

The Origin. It takes `invalid` when the server says the chosen origin no longer exists, and `required` once the list is reloaded without it.

### O. Choice cards — `Field` (required)

Protocol usage, a `fieldset` of `Field`s each wrapping a `RadioButton` with a label and a description.

### P. Choice — `RadioButton` (required)

One per protocol option.

### Q. Toggles — `Switch` (required)

The feature rows.

### R. Numbers — `NumberInput` (required)

The cache TTLs, `min="0"`.

### S. Field reason — `HelperText` (required)

Under the control, one line: `kind="invalid"` for a value the server refused (`This origin no longer exists.`), `kind="required"` for an empty one (`Select an origin to continue.`).

### T. Section notice — `Alert` (rejection only)

One danger `Alert` under the section heading that owns the error, with the recovery action in its `action` slot. It opens with an expand transition (`motion-reduce:transition-none`) and closes once the user recovers or changes the value.

### U. Loading — `Skeleton` (reloading only)

Stands in for the Origin select while the list reloads, with an accessible name (`Loading origins`).

### V. Footer — `SaveBar` (required)

Sticky at the end of the page, raised with `z-10`: `Cancel` and `Save`. Save shows `loading` while the request is in flight and is disabled while the list reloads.

## Do

- Put a section-scoped server rejection in a danger `Alert` under that section's heading, and set the field it names to `invalid` with its own one-line reason. Both surfaces, never one.
- Say in the `Alert`, as separate sentences, what happened, why, that nothing else was lost, and what to do: `Origin "web-origin-prod" no longer exists. Another user deleted it while you were filling in this form, so the service wasn't created. Nothing else was lost: reload the origin list and select another one.`
- Put the recovery on the `Alert` itself (`Reload origins`), not in the footer and not in a toast.
- Scroll the section into view and move focus to the field, after the lock is released; an instant scroll when `prefers-reduced-motion` is set.
- Keep every entry. Only the field the server refused changes, and only after the user recovers.
- While the recovery runs, show its `loading`, replace the field by a `Skeleton` and disable Save.
- After the recovery, close the `Alert`, clear the stale value and flag the field `required` with what to do next.

## Don't

- Don't toast a rejection a section or field owns: the toast leaves, and it points nowhere.
- Don't show a validation summary at the top of the page.
- Don't clear the form or send the user back to the start.
- Don't use the amber `required` state for a value the server refused; the value is there, so it is `invalid`.
- Don't auto-dismiss the `Alert`; it stays until the user recovers.
- Don't open more than one `Alert` for one rejection.

## Copy

- **Section Alert:** the fact, the cause, what was not lost, what to do: `Origin "web-origin-prod" no longer exists. Another user deleted it while you were filling in this form, so the service wasn't created. Nothing else was lost: reload the origin list and select another one.`
- **Recovery action:** verb plus the thing reloaded: `Reload origins`.
- **Field reason (refused):** `This origin no longer exists.`
- **Field reason (after reload):** `Select an origin to continue.`
- **Required messages:** `Name is required.`, `Host header is required.`, `Select an origin.`, `Select at least one HTTP port.`
- **Simulation panel:** a colon, never a dash: `Simulation: the other user`.
- **Actions:** `Cancel`, `Save`, `Reload origins`.

## Accessibility

- The `<form>` has an accessible name and `novalidate`; while the request is in flight the fields sit in a disabled `fieldset`.
- The `Alert` sits in reading order before the fields it governs; its action is a real button reachable by keyboard.
- Focus moves to the refused field after the save, with `preventScroll` so the scroll to the section heading is the only movement.
- The field's reason is wired to the control with `aria-describedby`.
- The `Skeleton` has an accessible name while the list reloads.
- The `Alert`'s expand and the page entrance honour `prefers-reduced-motion`.

## States

- InSync: the form filled in and linked to an origin that still exists; the simulation panel reads Server in sync.
- Rejected: User 2 deleted the origin and Save was pressed; the page scrolls to Origin, the danger `Alert` opens under its heading with Reload origins, and focus lands on the Origin select, which reads This origin no longer exists.
- Reloading: Reload origins in flight; its button loads, the select gives way to a `Skeleton`, Save is disabled.
- Reloaded: the list is back without the deleted origin; the `Alert` closes, the select is cleared and flagged required with Select an origin to continue.

## Related

- `platform/states/form-validation` — the submit states of a short form, including a conflict on a one-section form and an unscoped failure.
- `platform/states/async-submit` — the long-running counterpart, where the outcome reports back wherever the user is.
- `platform/create/single-page-create` — the sectioned create page this one is built on.
- `skills/webkit-errors` — where every error renders, row by row.
