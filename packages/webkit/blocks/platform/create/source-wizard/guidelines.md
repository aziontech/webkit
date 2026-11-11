# Source wizard

The wizard that starts a resource from code and deploys it. The user first says which service the project deploys to (an existing one, a new one created inline, or none yet), then picks how the code arrives: import from Git, sync from the CLI or start from a template. The method they pick declares the steps that follow on the rail, and the flow ends on the provisioning log and the success screen. Steps answered by a click carry no Next, so the user moves as fast as they decide.

## When to use

- A first-level resource whose content is code from somewhere else: a project from a repository, a local folder or a starter template.
- The resource is created and deployed in the same flow, and the user must first say where it runs.
- The remaining steps depend on the source the user picks.

## When not to use

- A resource with no code source, created step by step: use `platform/create/multipage-create`.
- Provisioning a service that binds a project, a domain and a deployment: use `platform/create/provision-wizard`.
- Deploying a ready template from a gallery: use `platform/create/deploy-template`.
- Every field fits on one screen: use `platform/create/single-page-create`, or its Import from Git form for a single-page Git import.
- Choosing among all the things the user can create: use `platform/create/create-hub`.

## Building blocks

### A. Creation header — `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar` (required)

`GlobalHeader` with no sidebar: a back `IconButton`, the `Brand` linking home, a `Breadcrumb` of the module and the create label, and the account `Avatar`. The breadcrumb's last item repeats the create button's label exactly.

### B. Step rail — `Stepper` (required)

A `Stepper` labelled with the create label. Steps reached earlier are `complete` and can be revisited; later steps are `disabled`, so the rail only goes back. Only the current step shows its description. The method chosen on step two declares the remaining steps. On a phone the rail gives way to a "Step 1 of 4" line.

### C. Page heading — `PageHeader` (required after the first step)

`PageHeader size="small"` with the create label and two or three sentences on what the resource is and what the last step does. It labels the `form` through `title-id`. The first step hides it and uses the chooser's own centred heading instead.

### D. Where it runs — `Input`, `Item`, `Button` (required)

A centred chooser: an icon, the create label as `h1`, one line of instruction, a large search `Input` and up to six service rows, each a small `Item` rendered `as-child` on a native `button` with `aria-pressed`, `data-selected` and a check on the chosen one. A chosen service past the first six stays visible. Picking a row answers the step and advances. A count line says how many more match, a no-match line replaces the rows, an inline Create Service row starts a new one, and a transparent small `Button` continues without a service. Enter in the search picks the first match, or starts creating one when nothing matches.

### E. Inline create — `Field`, `Input`, `Button` (optional)

The Create Service row swaps the list for a `Field` with a Name `Input`, prefilled from the search and focused, and a transparent Back plus a primary Continue that stays `disabled` until the name has text. Back returns to the list without losing the search.

### F. Method card — `Card`, `Item` (required)

A flush `Card` titled with the question, holding an `Item.List` of three small `Item`s rendered `as-child` on `button`s: an icon, the method as `Item.Title`, one or two sentences on what it does as `Item.Description`, and a chevron in `Item.Actions`. Clicking a method is the answer and moves on.

### G. Footer — `Button` (conditional)

Mounted only when it has something to offer: outlined Back from step two on, and the primary Next only on steps that ask for typed answers. Both are medium. On a step answered by a click, the footer carries Back alone.

## Do

- Open on Where it runs, and let the user create a service inline or continue without one.
- Advance on the click for steps that are a single choice; show Next only where fields are typed.
- Let the rail go back to completed steps, never forward.
- Seed the inline create name from the search text and focus it.
- Describe each method by what the user does and what they get, in one or two sentences.
- Hand off to `platform/create/deployment-flow` on submit and end on `platform/create/deploy-success`.

## Don't

- Don't show a Next button beside a list where clicking a row already answers the step.
- Don't open a dialog or a new page to create the service; create it inline in the chooser.
- Don't list the method's own steps on the rail before a method is chosen.
- Don't hide the chosen service behind the six-row limit.
- Don't make the user scroll past the method card to reach the footer.

## Copy

- **Title and breadcrumb:** the create label with the entity's capitalization, e.g. "Create Project".
- **Step titles:** short, with "Select" for a choice, e.g. "Where it runs", "Select a method", "Select a source", "Create and deploy".
- **Chooser instruction:** e.g. "Select a service to continue". Search placeholder and `aria-label`: e.g. "Search services".
- **No match:** the fact, e.g. "No service matches “api”." A count line states the rest, e.g. "4 more. Type to narrow the list."
- **Inline create row:** the create label, e.g. "Create Service". The field label: "New service".
- **Skip:** verb first, e.g. "Continue without a service".
- **Method card title:** the question, e.g. "How do you want to start?".
- **Method titles:** verb first, at most four words, e.g. "Import from Git", "Sync with the CLI", "Start from a template".
- **Final action:** names both acts, e.g. "Create and deploy".
- Follow `skills/webkit-microcopy`: "Select", never "Choose"; no em dash in the count line; "Back" only for the previous step, never for Cancel.

## Accessibility

- The `Stepper` has an `aria-label`; disabled future steps cannot be focused.
- The `form` is labelled by the `PageHeader` title; a `fieldset` with a visually hidden `legend` names the flow.
- Service and method rows are native `button`s; service rows expose `aria-pressed`; icons, checks and chevrons are `aria-hidden`.
- The search has an `aria-label`; Enter picks the first match or opens the inline create.
- The inline create moves focus to its Name field and returns it to the list on Back.
- Step transitions and the footer's entrance honour reduced motion.

## States

- WhereItRuns: the first step; the centred service chooser with search, the Create Service row and Continue without a service; no footer until answered.
- Method: service-01 was chosen; the page heading over the three-method card, with only Back in the footer.

## Related

- `platform/create/deployment-flow` — the provisioning log the last step submits into.
- `platform/create/deploy-success` — the screen the flow ends on.
- `platform/create/multipage-create` — the step wizard for resources without a code source; same Where it runs chooser.
- `platform/create/provision-wizard` — the wizard that provisions a service and binds a project.
- `platform/create/single-page-create` — its Import from Git form is the one-page version of this flow.
- `Stepper` — the step rail; see `skills/webkit-create-surface`.
