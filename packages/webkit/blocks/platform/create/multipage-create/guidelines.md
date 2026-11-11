# Multipage create

The page a first-level resource is created on one step at a time. The user first says where the resource runs, then answers each step's fields in order, and only reaches the create action on the last step. A rail on the left shows how far they are and lets them return to any step already reached; if the host they chose lacks a module the resource needs, a step is inserted that offers to turn it on, so nothing is created that would silently never be read.

## When to use

- A first-level resource whose fields fall into groups that make sense one at a time (general, then type, then entries) and where a later group depends on an earlier answer.
- The resource must first bind to a host (a policy, an application) and that choice can change what is asked next.
- A code resource whose editor needs a whole step to itself.

## When not to use

- Everything fits on one screen without order: use `platform/create/single-page-create`.
- The resource is created inside another one: use `platform/create/create-in-drawer`.
- The flow provisions a service, binds a project and deploys: use `platform/create/provision-wizard`.
- The flow starts from a code source (Git, CLI, template): use `platform/create/source-wizard`.
- Binding an existing or new resource inside a form step: use `platform/create/resource-picker`.

## Building blocks

### A. Creation header — `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar` (required)

`GlobalHeader` with no sidebar: a back `IconButton` to the module, the `Brand` linking home, a `Breadcrumb` of the module and the create label, and the account `Avatar`. The breadcrumb's last item repeats the create button's label exactly.

### B. Step rail — `Stepper` (required)

A `Stepper` in an aside on the left, `v-model` bound to the current step and labelled with the create label. Each `Stepper.Step` has a title, a `state` (`complete`, `upcoming` or `error`) and is `disabled` until it has been reached. Only the current step shows its description. A step whose fields failed validation turns to `error` so the rail points at it. On a phone the rail gives way to a "Step 2 of 4" line over the heading.

### C. Step heading — `PageHeader` (required)

`PageHeader size="small"` titled with the step's name and described with the step's sentence. The Where it runs step has no `PageHeader`; it carries its own centred heading instead.

### D. Where it runs — `Input`, `Item`, `Tag`, `Button` (required)

A centred chooser: an icon, the create label as the page's `h1`, one line of instruction, a large search `Input` and up to six host rows. Each row is a small `Item` rendered `as-child` on a native `button` with `aria-pressed` and `data-selected`; a host missing the module the resource needs carries a small warning `Tag`. A chosen host past the first six is kept visible. Picking a row advances to the next step, so this step has no Next. A count line tells how many more match, a no-match line replaces the rows, and two transparent small `Button`s offer to create a host or continue without one.

### E. Module step — `Card`, `Alert`, `Field`, `Switch` (conditional)

Inserted only when the chosen host has the needed module off. A flush `Card` holds a small warning `Alert` that states the consequence, a horizontal `Field` choice card whose `Switch` turns the module on when the resource is created, and one muted line on what leaving it off means. Leaving it off is allowed.

### F. Field steps — `Card`, `Item`, `SettingRow`, `Input`, `HelperText` (required)

Each step's fields are `SettingRow`s in an `Item.List` inside a flush `Card`, the same anatomy as a single page create. A large `Input` takes an `aria-label` matching the row title. Next validates only the current step: an empty required field gets `:required` and a `HelperText` with the message, cleared as soon as the field is edited.

### G. Choice cards — `Field`, `RadioButton` (optional)

A choice that changes what follows, such as the list type, is a `SettingRow kind="stacked"` holding a `fieldset` of wide horizontal `Field` cards, each a `RadioButton` with `Field.Title` and `Field.Description`. Use it for three to five options that need a sentence each.

### H. Long entry — `Textarea`, `HelperText` (optional)

A stacked row with a five-row `Textarea` whose label, placeholder and guidance follow the choice above it. Its required message is a `HelperText` tied by `aria-describedby`.

### I. Footer — `SaveBar` (required)

`SaveBar kind="plain"` fixed under the form, on the create measure (a wrapper sets `--layout-measure-form` to `--layout-measure-form-create`, since the bar takes no classes of its own): transparent Cancel in its `#leading` slot, on the left; outlined Back (hidden on the first step) and the primary submit in `#actions`, on the right, all medium `Button`s. The submit reads Next and becomes the create label on the last step. It is the form's only `type="submit"`, so Enter advances.

## Do

- Ask where the resource runs first, and insert the module step only when the chosen host needs it.
- Validate one step at a time on Next, and mark a failed step `error` on the rail.
- Unlock a step on the rail only once it has been reached, and let the user jump back to any unlocked step.
- Keep Cancel apart from Back and Next, on the opposite side.
- Keep the create action on the last step only; every step before it says Next.
- Keep the chosen host visible in the chooser even when it falls outside the first six.

## Don't

- Don't let the rail skip ahead to steps not reached yet.
- Don't put a Next button on a step answered by a click; picking the host is the answer.
- Don't block the create when a module is off; warn, offer the switch and let the user go on.
- Don't repeat the step title as a second heading inside the card.
- Don't validate fields of later steps, or judge a field while it is being typed.
- Don't use more than one step for fields that only make sense together.

## Copy

- **Title, breadcrumb and last submit:** the create label with the entity's capitalization, e.g. "Create Access List".
- **Step titles:** short nouns, e.g. "Where it runs", "General", "List settings".
- **Step descriptions:** one sentence with a period, e.g. "Select the policy whose rules match it. It needs IP filtering on."
- **Chooser:** instruction with "Select", e.g. "Select a policy to continue"; the search placeholder and `aria-label` name what is searched, e.g. "Search policies".
- **Module tag:** the missing module and its state, e.g. "IP filtering off".
- **Module alert:** the consequence in one sentence, e.g. "acme-staging has IP filtering off, so no rule reads this list until the module is on."
- **Escape routes:** verb first, e.g. "Create a policy", "Continue without a policy".
- **Required message:** "This field is required."
- Follow `skills/webkit-microcopy`: "Select", never "Choose"; no em dash; no "simply".

## Accessibility

- The `Stepper` has an `aria-label` naming the flow; disabled steps cannot be focused or activated.
- The `form` takes the current step's title as its `aria-label`; a `fieldset` with a visually hidden `legend` repeats it.
- Host rows are native `button`s with `aria-pressed`; the chooser's search has an `aria-label` and Enter selects the first match.
- Choice cards sit in a `fieldset` with a `legend`; each `RadioButton` is labelled by its card.
- Required messages are tied to their control with `aria-describedby`; focus stays on the step after a failed Next.
- Step transitions honour reduced motion.

## States

- WhereItRuns: the first step; the centred chooser of policies with search, module tags and the two escape routes.
- ModuleOff: acme-staging was chosen with IP filtering off, so the IP filtering step shows the warning, the switch card and the note.
- ListSettings: the last step; Type as radio choice cards and the List textarea, with Back and the create action in the footer. An empty list marks the step red on the rail.

## Related

- `platform/create/single-page-create` — the same job when the fields fit one screen.
- `platform/create/source-wizard` — a step wizard that starts from a code source and deploys.
- `platform/create/provision-wizard` — a two-step wizard that binds a project and deploys.
- `platform/edit/code-editor` — the editor a code resource can use as one step.
- `platform/states/form-validation` — required and invalid states on Next.
- `Stepper` — the step rail; see `skills/webkit-form`.
