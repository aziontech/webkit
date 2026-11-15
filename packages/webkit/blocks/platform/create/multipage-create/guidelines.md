# Multipage create

The page a first-level resource is created on one step at a time. It is the `Wizard` component in a creation page: the user first says where the resource runs, then answers each step's fields in order, and only reaches the create action on the last step. The Wizard's rail shows how far they are and lets them return to any step already passed; if the host they chose lacks a module the resource needs, a step is inserted that offers to turn it on, so nothing is created that would silently never be read. The same frame creates a resource that must be bound and deployed in one act (CreateAndDeploy).

## When to use

- Use multipage-create when a first-level resource is created in ordered steps (a later answer changes what is asked); it is the Wizard component in a creation page.
- A first-level resource whose fields fall into groups that make sense one at a time (general, then type, then entries) and where a later group depends on an earlier answer.
- The resource must first bind to a host (a policy, an application) and that choice can change what is asked next.
- A resource that is useless until it is bound to another and deployed, such as a service that serves a project on a domain: use the CreateAndDeploy variant, whose last action creates and deploys.
- A code resource whose editor needs a whole step to itself.

## When not to use

- Everything fits on one screen without order: use `platform/create/single-page-create`.
- The resource is created inside another one: use `platform/create/create-in-drawer`.
- A new project from a code source (Git, a template, an upload): start at `platform/create/create-hub` and deploy with `platform/create/deploy-template`.
- Binding an existing or new resource inside a form step: use `platform/create/resource-picker`.
- Deploying an existing package from inside a resource: use `platform/create/deploy-drawer`.

## Building blocks

### A. Creation header — `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar` (required)

The `top-bars/creation-bar` header, with no sidebar: a back `IconButton` to the module, the `Brand` linking home, a `Breadcrumb` of the module and the create label, and the account `Avatar`. The breadcrumb's last item repeats the create button's label exactly.

### B. Page heading — `PageHeader` (required)

`PageHeader size="small"` over the wizard, on the create measure (`layout-form-create`): the create label as the page's `h1` and one or two sentences on what the resource is and what the last step does. It stays the same on every step.

### C. Wizard — `Wizard`, `Wizard.Step` (required)

One `Wizard` labelled with the create label, `v-model` bound to the step index, `submit-label` set to the create label and `loading` bound to the create request. Each step is a `Wizard.Step` with a short noun title and a one-sentence description; the Wizard draws the rail (completed steps reachable, later ones locked), the step heading (`h2`), the "Step 2 of 4" line on a narrow box, and the footer: Cancel on the start side, Previous and Next on the end side, Next becoming the create action on the last step. A conditional step is a `Wizard.Step` with `v-if`; the Wizard numbers steps in the order they render. Validation runs in the `next` handler, which calls `preventDefault()` to keep the user on a failed step.

### D. Where it runs — `Input`, `Item`, `Tag`, `HelperText`, `Button` (required)

The first step: a large search `Input` and up to six host rows. Each row is a small `clickable` `Item` (a native `button`) with `aria-pressed`, which fills the chosen row; a host missing the module the resource needs carries a small warning `Tag`. Picking a row answers the step and moves on. A chosen host past the first six is kept visible. A count line tells how many more match, a no-match line replaces the rows, and two transparent small `Button`s offer to create a host or continue without one. Next with no answer stays and shows a `HelperText` asking for one.

### E. Module step — `Card`, `Alert`, `Field`, `Switch` (conditional)

Inserted only when the chosen host has the needed module off. A flush `Card` holds a small warning `Alert` that states the consequence, a horizontal `Field` choice card whose `Switch` turns the module on when the resource is created, and one muted line on what leaving it off means. Leaving it off is allowed.

### F. Field steps — `Card`, `Item`, `SettingRow`, `Input`, `HelperText` (required)

Each step's fields are `SettingRow`s in an `Item.List` inside a flush `Card`, the same anatomy as a single page create. A large `Input` takes an `aria-label` matching the row title. Next validates only the current step: an empty required field gets `:required` and a `HelperText` with the message, cleared as soon as the field is edited.

### G. Choice cards — `RadioGroup` (optional)

A choice that changes what follows, such as the list type, is a `SettingRow kind="stacked"` holding a `RadioGroup` with `kind="card"`, each option a `RadioGroup.Item` with its label and `description`. Use it for three to five options that need a sentence each.

### H. Long entry — `Textarea`, `HelperText` (optional)

A stacked row with a five-row `Textarea` whose label, placeholder and guidance follow the choice above it. Its required message is a `HelperText` tied by `aria-describedby`.

### I. Review — `SectionHeader`, `Alert`, `Card`, `Item`, `Tag`, `Button` (required)

The last step, read-only: three bands under small `SectionHeader`s (Where it runs, What gets created, What can reference it), each with Edit back to its step; see Review step below.

### J. Create and deploy — `Card`, `Field`, `Input`, `Item`, `RadioGroup` (CreateAndDeploy)

Two steps, Project then Domain and deployment, with the last action reading "Create and deploy".

- **Project.** The `platform/create/resource-picker` band, copied from that block (the source of truth for the paged picker; change it there first): a flush `Card` titled Project, a lead sentence, a large fluid `ToggleGroup` of Existing project and New project, then either a searchable `Item` list paged five at a time with `Skeleton` rows and a Load more `Button`, or a Name `Field`. In New mode the project is configured in place: a Cache Settings `Card` whose policy `Switch`es open their fields, and an Add an origin `SettingRow` whose `Switch` opens a `RadioGroup kind="card"` of origin types and the type's fields. Each opened field is required only while its switch is on.
- **Domain and deployment.** A read-back `Item` of the bound project with a transparent Change `Button` back to step one (the answer is kept); a Domain `Card` with a `ToggleGroup` of Free platform domain and Your own domain and a preview line of the address traffic arrives on; Environment as a `RadioGroup kind="card"` and Certificate as a `Select`; a Deployment `Card` with Create one or Use existing (the paged picker again); and a collapsed `SettingsSection` titled Advanced holding only fields that have defaults.
- **After submit.** Create and deploy shows its loading state; the consumer then hands the column to `platform/detail/deployment-logs` (InCreateFlow) and ends on `platform/create/deploy-success`.

## Do

- Ask where the resource runs first, and insert the module step only when the chosen host needs it.
- Validate one step at a time in the `next` handler, and show the message under the field that failed.
- Keep Cancel apart from Previous and Next, on the opposite side; the Wizard footer does this.
- Keep the create action on the last step only; every step before it says Next.
- Keep the chosen host visible in the chooser even when it falls outside the first six.
- Label the final action with every act it performs: "Create and deploy" when it also deploys.
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so this page body never renders a `Toaster`.

## Don't

- Don't build the rail, the step heading or the footer by hand; the `Wizard` owns them.
- Don't let the user skip ahead to steps not reached yet.
- Don't block the create when a module is off; warn, offer the switch and let the user go on.
- Don't repeat the step title as a second heading inside the card.
- Don't validate fields of later steps, or judge a field while it is being typed.
- Don't put a required field inside Advanced, or show both the existing list and the new fields at once.

## Copy

- **Title, breadcrumb and last submit:** the create label with the entity's capitalization, e.g. "Create Access List"; "Create and deploy" when the last step also deploys.
- **Step titles:** short nouns, e.g. "Where it runs", "General", "List settings", "Project", "Domain and deployment".
- **Step descriptions:** one sentence with a period, e.g. "Select the policy whose rules match it. It needs IP filtering on."
- **Chooser:** the search placeholder and `aria-label` name what is searched, e.g. "Search policies"; Next with no answer says "Select a policy, or continue without one."
- **Module tag:** the missing module and its state, e.g. "IP filtering off".
- **Module alert:** the consequence in one sentence, e.g. "acme-staging has IP filtering off, so no rule reads this list until the module is on."
- **Escape routes:** verb first, e.g. "Create a policy", "Continue without a policy".
- **Required message:** "This field is required.", or what to do, e.g. "Select the project this service serves, or create a new one."
- Follow `skills/webkit-microcopy`: "Select", never "Choose"; no em dash; no "simply".

## Accessibility

- The `Wizard` takes an `aria-label` naming the flow; locked rail steps cannot be focused or activated, and focus moves to the new step's heading on every step change.
- The page has one `h1` (the `PageHeader`); each step heading is an `h2` drawn by the Wizard.
- Host rows are native `button`s with `aria-pressed`; the chooser's search has an `aria-label` and Enter selects the first match.
- Choice cards are a `RadioGroup` named with `aria-label`; each `RadioGroup.Item` is labelled by its card.
- Required messages are tied to their control with `aria-describedby`; focus stays on the step after a failed Next.
- Step transitions honour reduced motion.

## States

- WhereItRuns: the first step; the chooser of policies with search, module tags and the two escape routes.
- ModuleOff: acme-staging was chosen with IP filtering off, so the IP filtering step shows the warning, the switch card and the note.
- ListSettings: the settings step; Type as radio choice cards and the List textarea, with Previous and Next (Review follows). Next with an empty list stays and shows the message.
- Review: the last step, read-only, with the create action in the footer. Where it runs is one `Alert` whose severity says whether anything will read the resource; What gets created pairs each value with the property it is sent as and shows long lists as their first five `Tag`s and a count; What can reference it names the consumers. Each band that maps to a step has an outlined Edit (`aria-label` names the band) that jumps back to that step. Create re-validates every step and, on a failure, opens the first step with an error.
- CreateAndDeploy: Create Service on its Project step with the paged project list; Next is gated on the project, and step two ends on Create and deploy with its loading state.

## Review step

- Add a Review step when the create has three or more steps or binds the resource to something; skip it for a one-step create.
- Show values as they will be sent, with the property name under each, and never show secrets in clear.
- Put Edit on each band, and on a value whose step differs from its band's (Name, on General); after the edit, Next walks forward through the later steps, already filled, back to Review.
- Say plainly when nothing will read the resource yet (unbound, or a module off) with a warning `Alert`, not a disabled create.

## Related

- `Wizard` — the component this block is built on; see `skills/webkit-form`.
- `platform/create/single-page-create` — the same job when the fields fit one screen.
- `platform/create/create-hub` and `platform/create/deploy-template` — a new project from Git, a template or an upload.
- `platform/create/resource-picker` — the Existing or New band CreateAndDeploy binds its project with.
- `platform/detail/deployment-logs` — the build log Create and deploy hands the column to (InCreateFlow).
- `platform/create/deploy-success` — the screen a create-and-deploy ends on.
- `platform/edit/function-editor` — the editor a code resource can use as one step.
- `platform/states/form-validation` — required and invalid states on Next.
