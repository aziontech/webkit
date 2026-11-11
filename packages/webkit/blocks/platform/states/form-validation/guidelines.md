# Form validation

Every state a submit can land in, on one create form. The user's job is to create a resource and, when something stops the save, to know exactly which control to touch and that nothing they typed was lost. The primary is a short Create Variable page (heading, four fields straight on the canvas, Cancel and Create); the variants walk it through validation, the in-flight lock, an unscoped failure, a conflict, success and loading, and then a long Create Service page where another user deletes the linked origin while the form is open, the case where a server rejection is scoped to one section.

## When to use

- As the reference for the submit states of any create or edit form: what happens on Create with gaps, while the request is in flight, and on each kind of answer.
- A short create form with a handful of fields and no sections (a variable, a key, a token).
- A long sectioned form whose save can be rejected because a linked resource changed under the user (the InSync to Reloaded variants).

## When not to use

- A sectioned create page with many settings and a sticky save bar: build it from `platform/create/single-page-create` and apply these states to it.
- A create that runs for tens of seconds and can be left (build, deploy, import): use `platform/states/async-submit`.
- Settings of an existing object saved section by section: use `platform/settings/settings-form`.
- Signed-out screens: use `platform/auth`, where nothing toasts.
- A create launched from a list without leaving it: use `platform/create/create-in-drawer`.

## Building blocks

### A. Page heading — `PageHeader` (required)

`size="small"`, the create title and one sentence on what the object is for, with `title-id` so the `<form>` is labelled by it. No actions in the header: the form's actions sit at the end of the column.

### B. Loading rows — `Skeleton` (loading only)

While the form's data loads (the options a select offers, the record an edit form opens with), four pairs of bands stand in for label and control inside a `role="status"` region with an accessible name. Create stays disabled until the fields arrive.

### C. Field — `Field` (required)

Each control sits in a `Field` with `Field.Label` (bound by `for`) and `Field.Description`. The description carries the guidance until a submit finds a problem, then swaps to the message, so each field speaks in one place. The field takes `required` when the value is empty and `invalid` when it is filled but wrong (malformed, too long, or already taken on the server). All fields take `disabled` while the request is in flight.

### D. Text value — `Input` (required)

Key and Value. A placeholder may show the expected shape (`API_TOKEN`); the rule itself lives in the description.

### E. Choice — `Select` (required)

Environment, with `placeholder="Select an environment"`, `Select.Trigger` carrying the id the label points at, and `Select.Option` per value. Empty on submit takes `required`.

### F. Long text — `Textarea` (optional)

Description. Optionality is said in the description (`Optional. Up to 200 characters.`), never in the label; over the limit takes `invalid`.

### G. Actions — `Button` (required)

`Cancel` (`kind="outlined"`, resets the form) then `Create` (`kind="primary"`, `type="submit"`) at the end of the column. Create shows `loading` while submitting and is `disabled` while loading; Cancel is disabled while busy. Below `md` both stack at full width.

### H. Result notices — `Toaster` (required)

One `Toaster` mounted with the form, `position="bottom-right"`. It shows the result of a save that no field owns: `toast.error` with **Retry** when the request failed and no field is to blame (row 3 of `skills/webkit-errors`), `toast.success` naming the new object when the save went through. Both use one `id`, and the previous result is dismissed when a new submit starts, so attempts never stack.

## Do

- Validate on submit, not on every keystroke; after the first submit, a field's message updates as the user fixes it.
- Move focus to the first field in error after a submit, after the lock is released.
- Lock the whole scope while the request is in flight: Create shows `loading`, every field and Cancel are disabled, `aria-busy` is on the form. Release it on success and failure alike.
- Keep every entry after a failed or rejected save, and say so in the copy.
- Clear the form after a success, so the next entry starts clean, and name the new object in the toast.
- On a long form, put a section-scoped server rejection in a danger `Alert` under that section's heading, carrying the recovery action (`Reload origins`), and set the field it names to `invalid` with its reason (`This origin no longer exists.`). Both surfaces, never one.
- On a long form, scroll the rejected section into view and focus the field, honouring `prefers-reduced-motion`.

## Don't

- Don't show a validation summary at the top; each field carries its own message.
- Don't toast a rejection a field owns (a key already in use, a deleted origin). The toast dismisses itself and points nowhere.
- Don't use the amber `required` prompt for a value the server rejected; the value is present, so it is `invalid`.
- Don't disable Create to signal missing values; let submit run and show the messages.
- Don't auto-dismiss an `Alert` that names a required action; it stays until the user recovers (the Reloaded state closes it).
- Known gap: the Conflict variant marks Key `invalid` with `A variable named API_TOKEN already exists.` but shows no `Alert`; on this one-section form the field message stands in for it, while `skills/webkit-errors` row 2 asks for an `Alert` in the owning section as well.
- Known gap: the Rejected variant does not scroll to the Origin section or move focus to the Origin select after the save is rejected, and its message splices two sentences with an em dash, against `skills/webkit-microcopy`.

## Copy

- **Page heading:** `Create` plus the entity, matching the page it lists: `Create Variable`. Lead: one sentence on what it is for: `Add a key-value pair your services read at runtime.`
- **Field labels:** one to three words, no colon, no parentheses: `Key`, `Value`, `Environment`, `Description`.
- **Field descriptions:** a constraint or purpose, one sentence with a period: `Uppercase letters, digits and underscores, for example API_TOKEN.`, `Optional. Up to 200 characters.`
- **Required message:** names the field: `Key is required.`; for a select, the action: `Select an environment.`
- **Invalid message:** what is wrong and the rule: `Use uppercase letters, digits and underscores, starting with a letter.`
- **Conflict message:** the fact, on the field: `A variable named API_TOKEN already exists.`
- **Error toast:** what did not happen, then what was kept: title `The variable wasn't created.`, description `The request didn't reach the server. Your entries are kept.`, action `Retry`.
- **Success toast:** past tense, names the object and where it applies: `API_TOKEN was created.` / `It is available in Production.`
- **Section rejection Alert:** what happened, why, what was not lost and what to do, as separate sentences: `Origin "web-origin-prod" no longer exists. Another user deleted it while you were filling in this form, so the service wasn't created. Nothing else was lost: reload the origin list and select another one.` Action: `Reload origins`.
- **Actions:** `Cancel`, `Create`, `Retry`.

## Accessibility

- The `<form>` is labelled by the heading (`aria-labelledby`), uses `novalidate`, and sets `aria-busy` while loading or submitting.
- Every control has a `Field.Label` bound by `for`; the description and message are wired to the control by `Field`.
- The loading region is `role="status"` with an accessible name (`Loading the form`).
- Focus moves to the first field in error, only after the lock is released, since a disabled control cannot take focus.
- Toasts are announced by the `Toaster`; the error toast keeps its Retry reachable by keyboard.
- A section `Alert` sits in reading order before the fields it governs.

## States

- Default: the empty Create Variable form, idle.
- ValidationErrors: Create pressed with gaps; empty Value and Environment take `required`, the malformed Key takes `invalid`, each with its own message, and focus moves to Key.
- Submitting: the request is in flight; Create shows `loading`, the fields and Cancel are disabled.
- ServerError: the request failed and no field owns it; an error toast with Retry, the lock released, every entry kept.
- Conflict: the key is already in use; the error lands on Key and nowhere else.
- Saved: the save went through; a success toast names the variable and where it is available, and the form is cleared.
- Loading: the form data is still arriving; `Skeleton` rows hold the layout and Create is disabled.
- InSync: the long Create Service form while the linked origin still exists, with the dashed panel that plays the other user.
- Rejected: the origin was deleted and Save pressed; the danger `Alert` opens under the Origin heading with Reload origins, and the Origin select reads This origin no longer exists.
- Reloading: Reload origins in flight; its button loads, the select gives way to a `Skeleton`, Save is disabled.
- Reloaded: the list is back without the deleted origin; the `Alert` closes and the select is cleared and flagged `required` with Select an origin to continue.

## Related

- `platform/states/async-submit` — the long-running counterpart: the outcome reports back wherever the user is.
- `platform/create/single-page-create` — the sectioned create page the InSync to Reloaded variants are built on.
- `platform/auth` — the signed-out version, where every outcome lands in one card `Alert` and nothing toasts.
- `platform/settings/settings-form` — the same field states on an existing object.
- `Field` — the label, description and state triad every field here uses.
