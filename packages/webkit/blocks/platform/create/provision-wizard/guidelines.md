# Provision wizard

The two-step wizard that provisions a resource bound to another and puts it into traffic. The user first binds the project the service serves, reusing one from a paged list or creating it right there with its cache and origin, then sets the domain traffic arrives on, the environment and certificate, and the deployment the first release is cut against. The address is previewed as they type, the defaults sit under Advanced, and the last button says it both creates and deploys, so the cost of pressing it is never a surprise.

## When to use

- A first-level resource that is useless until it is bound to another resource and deployed, such as a service that serves a project on a domain.
- The bound resource may already exist or be created in the same flow, and its essentials fit on the first step.
- The user expects one act to end with traffic arriving, and the button can say so.

## When not to use

- A resource that is only created, not deployed: use `platform/create/single-page-create` or `platform/create/multipage-create`; Save must not deploy.
- The project comes from a code source picked in the flow (Git, CLI, template): use `platform/create/source-wizard`.
- Deploying an existing package from inside a resource: use `platform/create/deploy-drawer`.
- Only the existing or new picker is needed inside another form: use `platform/create/resource-picker`.

## Building blocks

### A. Creation header — `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar` (required)

`GlobalHeader` with no sidebar: an outlined small `IconButton` back to the module ("Back to Services"), the `Brand` linking home, a `Breadcrumb` of the module and the create label, and the account `Avatar`.

### B. Step rail — `Stepper` (required)

A `Stepper` labelled with the create label and two steps, Project and Domain and deployment. The rail only goes back: completed steps can be revisited, the next one is `disabled` until Next validates the current step. Only the current step shows its description.

### C. Page heading — `PageHeader` (required)

`PageHeader size="small"` over the form column with the create label and one or two sentences on what the resource is and what the last step provisions. It stays the same on both steps.

### D. Project band — `Card`, `ToggleGroup`, `Field`, `Input`, `HelperText`, `Item`, `Skeleton`, `Button` (required)

The `platform/create/resource-picker` band: a flush `Card` titled Project, a lead sentence, a large fluid `ToggleGroup` of Existing project and New project, then either a searchable `Item` list paged five at a time with `Skeleton` rows and a Load more `Button`, or a Name `Field` with an `Input`. The required message is a `HelperText kind="required"` under the search, above the rows.

### E. New project configuration — `Card`, `Item`, `Switch`, `Field`, `Input`, `SettingRow`, `RadioCards`, `HelperText`, `Select` (conditional)

In New mode the project is configured in place. A Cache Settings `Card` lists each policy as an `Item` with a `Switch` in `Item.Actions`; turning one on opens its `Field`s under it. An Add an origin `SettingRow kind="compact"` with a `Switch` opens the origin: `RadioCards` for its type with a `HelperText` explaining the choice, then the type's own fields as a `Field` with an `Input`, or with a `Select` for a fixed list. Each opened field is required only while its switch is on.

### F. Project read-back — `Card`, `Item`, `Button` (required on step two)

Step two opens with a flush `Card` holding one `Item` that reads the bound project back: its name, one sentence on what will be served, and a transparent small Change `Button` that returns to step one with the answer kept.

### G. Domain — `Card`, `ToggleGroup`, `Field`, `Input` (required)

A `Card` titled Domain with a `ToggleGroup` of Free platform domain and Your own domain. The free domain asks for a prefix `Input` with the platform suffix shown inside it; your own domain asks for the hostname and the service name. Below, a preview line names the address traffic arrives on (`https://` plus the domain) and the name the service is created as, updating as the user types.

### H. Environment and certificate — `Card`, `Field`, `RadioCards`, `Hint`, `HelperText`, `Select` (required)

A padded `Card` with Environment as `RadioCards` (Production, Preview, each with a sentence) and Certificate as a `Select`, Environment headed by a `kind="label"` `Field.Legend` with a `Hint`, Certificate by a `Field.Label` with a `hint`. A `HelperText` under the radio cards says what the selected environment means.

### I. Deployment — `Card`, `ToggleGroup`, `Item`, `Input`, `Skeleton`, `Button` (required)

A `Card` titled Deployment with a `ToggleGroup` of Create one and Use existing. Create one shows the deployment that will be made, as an `Item`; Use existing reuses the paged picker list with its own search `Input`, `Skeleton` rows and Load more `Button`.

### J. Advanced — `SettingsSection`, `Card`, `Select`, `Field`, `SettingRow`, `Switch` (optional)

A `SettingsSection` titled Advanced, `collapsible`, `icon="pi pi-cog"`, closed by default, with a `hint` saying every field carries the endpoint's default. It holds the minimum TLS version (`Field` and `Select`), the error page (`Field` and `Select`, "Not bound" by default) and `SettingRow kind="compact"` switches for Allow the platform domain and Active. Nothing required lives here.

### K. Footer — `SaveBar`, `Button` (required)

`SaveBar kind="fade"`, a footer with no border or surface that fades in over the canvas on the form's own measure: outlined Back in `#leading` from step two on, and in `#actions` the primary submit, Next on step one and Create and deploy on step two. Both are medium; the submit is the form's only `type="submit"`.

## Do

- Bind the project first, with Existing as the default whenever one exists.
- Validate the current step on Next, and only open fields that their switch turned on.
- Preview the address and the resource name as the user types, so the result is known before the commit.
- Keep the answer from step one when the user presses Change and comes back.
- Label the final action with both acts, since it creates and deploys.
- Submit into `platform/create/deployment-flow` and end on `platform/create/deploy-success`.

## Don't

- Don't call the final button Save or Create when it also deploys; the label must name the deploy.
- Don't put a required field inside Advanced, or open Advanced to show an error.
- Don't let the rail jump forward past a step that has not validated.
- Don't make the user leave the wizard to create the project or the deployment.
- Don't show both the existing list and the new fields at once; the toggle decides.

## Copy

- **Title and breadcrumb:** the create label with the entity's capitalization, e.g. "Create Service".
- **Description:** what the resource is and what the last step does, e.g. "A service is the public entry point: what it serves, and the domain traffic arrives on. The last step provisions both."
- **Step titles:** nouns, e.g. "Project", "Domain and deployment".
- **Toggle options:** short and parallel, e.g. "Existing project" and "New project"; "Free platform domain" and "Your own domain"; "Create one" and "Use existing".
- **Preview:** a label and a value, e.g. "Traffic arrives on" over "https://my-first-app.example.com"; empty, it tells what to type, e.g. "Type a prefix to see the domain."
- **Required messages:** what to do, as a sentence, e.g. "Select the project this service serves, or create a new one.", "Enter the prefix for the platform domain.", "This field is required."
- **Read-back action:** "Change".
- **Final action:** "Create and deploy". Back is "Back".
- Follow `skills/webkit-microcopy`: no parentheses in labels (move asides to the description), "Select", never "Pick"; no em dash.

## Accessibility

- The `Stepper` has an `aria-label`; the disabled next step cannot be focused.
- Every `ToggleGroup` has an `aria-label` that states its question, e.g. "Where the domain comes from".
- Picker rows are native `button`s with `aria-pressed`, and each picker has a `role="status"` count line and `aria-hidden` skeleton rows.
- Switches carry an `aria-label` matching their row or policy title; the `Select` triggers carry the field name.
- The platform suffix inside the prefix `Input` is `aria-hidden`; the preview line repeats the full address as text.
- The collapsed Advanced region is `inert` while closed.

## States

- Project: step one with Existing project chosen and the paged project list; Next validates the binding.
- NewProject: New project chosen; the Name field replaces the list, with the Cache Settings switches and the Add an origin switch each opening its fields.
- DomainAndDeployment: step two with web-app bound; the read-back row with Change, the Domain card on a free platform domain, Environment and certificate, Deployment, collapsed Advanced, and Back plus Create and deploy.

## Related

- `platform/create/resource-picker` — the Existing or New band this wizard binds its project with.
- `platform/create/deployment-flow` — the provisioning log Create and deploy runs.
- `platform/create/deploy-success` — the screen the flow ends on.
- `platform/create/source-wizard` — the wizard that starts from a code source instead.
- `platform/states/async-submit` — the lock and loading state while the submit is in flight.
- `SettingsSection` — the collapsible Advanced band; see `skills/webkit-create-surface`.
