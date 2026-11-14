# Source wizard

The wizard that starts a resource from code and deploys it. The user first says which service the project deploys to (an existing one, a new one created inline, or none yet), then picks how the code arrives: import from Git, sync from the CLI or start from a template. The method they pick declares the steps that follow on the rail: Import from Git asks for a repository, the CLI goes straight to configuring, and a template asks for the template, then the repository it is cloned into (or, for an integration template, its settings and a preview of what gets added). The last step names the project, its domain, its build commands, an optional firewall and the advanced modules, and the flow ends on the provisioning log and the success screen. Steps answered by a click carry no Next, so the user moves as fast as they decide.

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

A centred chooser: an icon, the create label as `h1`, one line of instruction, a large search `Input` and up to six service rows, each a small `clickable` `Item` (a native `button`) with `aria-pressed` (which fills the row) and a check on the chosen one. A chosen service past the first six stays visible. Picking a row answers the step and advances. A count line says how many more match, a no-match line replaces the rows, an inline Create Service row starts a new one, and a transparent small `Button` continues without a service. Enter in the search picks the first match, or starts creating one when nothing matches.

### E. Inline create — `Field`, `Input`, `Button` (optional)

The Create Service row swaps the list for a `Field` with a Name `Input`, prefilled from the search and focused, and a transparent Back plus a primary Continue that stays `disabled` until the name has text. Back returns to the list without losing the search.

### F. Method card — `Card`, `Item` (required)

A flush `Card` titled with the question, holding an `Item.List` of three small `clickable` `Item`s (native `button`s): an icon, the method as `Item.Title`, one or two sentences on what it does as `Item.Description`, and a chevron in `Item.Actions`. Clicking a method is the answer and moves on; the chosen method keeps `aria-pressed` when the user comes back.

### G. Git source — `Card`, `EmptyState`, `Select`, `Skeleton`, `Alert` (required for Import from Git)

Before an account is connected, a `Card` titled "Repository" holds a bordered `EmptyState` with a secondary large Connect `Button` that spins with `:loading` while it authorizes; a failed authorization adds a small danger `Alert` under the button, which retries. Once connected, the card turns flush: a toolbar row with an account `Select` (a GitHub glyph in `#iconLeft`, the accounts, and an Add account option that adds one and switches to it) beside a large search `Input`, then a capped, scrolling `Item.List` of the five most recently updated repositories (a transparent Load more adds five at a time), each a small `clickable` `Item` with its framework mark, its name and when it was updated, a chevron, and a check plus `aria-pressed` on the chosen one. While repositories load, five `Skeleton` rows in the row shape replace the list, `aria-hidden` under an `aria-busy` list. A failed load replaces the rows with a danger `Alert` and Retry; an account with no repositories shows a small `EmptyState` with Start from a template; a search with no match shows a small `EmptyState` with Clear search; a visually hidden `role="status"` line reports the count. Picking a repository answers the step and opens Create and deploy with the name prefilled.

### H. Template source — `PropertyFilter`, `Tag` (required for Start from a template)

A flush `Card` titled "Select a template": a `PropertyFilter` (free text plus Type and Use case properties, through `useCollection`) over a capped, scrolling list grouped under sticky headings (Official, Community, Frameworks). Each row is a small `clickable` `Item` with the template mark, title and one sentence; the first three frameworks carry a small info `Tag` "Featured" before the chevron. A filter that matches nothing shows a small `EmptyState` with an outlined Clear filters `Button`. Picking a template answers the step: an integration template goes straight to Review and add, any other to Connect a repository.

### I. Repository — `ToggleGroup`, `InputGroup`, `Switch`, `Tooltip`, `HelperText` (required for a template that clones)

The same Connect `EmptyState` until an account is connected, naming the template it copies. Then a flush `Card`: a fluid large `ToggleGroup` of New repository and Existing repository, the Account `Field` with the same `Select`, and either the Repository name `Field` (an `InputGroup` whose addon is a privacy `Switch` in a `Tooltip`, its `aria-label` stating the current visibility and the action, prefilled with the template name) or the search `Input` over the repository list, with a required `HelperText` under the search when Next is pressed with nothing selected. Next validates; switching modes keeps both answers.

### J. Source read-back — `Card`, `Item`, `Button` (required on the last step)

A flush `Card` with one small `Item` per answer already given: the source (repository, local project or template) and, for a cloned template, the repository it lands in. Each row ends in a transparent small Change `Button` that returns to the step that asked it.

### K. Review and add — `Field`, `Input`, `Tag` (required for an integration template)

The template's own settings in a `Card` titled "Configure <template>", one `Field` per setting with its placeholder and description (the required ones turn into the required message on submit), then a `Card` titled "What gets added": a line saying where the records land, a Records band (the origin and its address, the cache policy when the template adds one) that follows what is typed, and the rule as an `Item` with a secondary "Request phase" `Tag`, its behaviors as small secondary `Tag`s in a list. The primary action names the target: "Add to service-01".

### L. Configure — `Alert`, `Select`, `Accordion`, `Tag` (required on Create and deploy)

A `Card` "Configure your project" with the required Name `Field`, prefilled from the source. A `Card` "Domain" opens on a small info `Alert` about the free platform domain, then an optional Custom domain `Input`; typing one reveals the Environment `Select` (required once a domain is set) and the Certificate `Select`. For a source that builds, a flush `Card` "Build and deploy commands" holds a multiple `Accordion`: each trigger reads the command name, its current value in code type, and an info `Tag` "Edited" once it differs from the default; each panel has the code `Input`, one sentence, and a transparent "Use the default" `Button` while it is edited.

### M. Firewall binding — `SettingRow`, `Switch`, `ToggleGroup`, `HelperText` (optional)

A flush `Card` whose first row is a compact `SettingRow` with a `Switch` that opts in. On, it unfolds (a grid-rows transition, `inert` while closed) into a fluid `ToggleGroup` of Existing firewall and New firewall: Existing lists the firewalls as selectable `Item`s with a check; New shows a Firewall name `Field`, prefilled from the project name, over a Firewall modules list of compact `SettingRow`s, where DDoS Protection is a disabled, always-on `Switch` whose row description ends with "Always on.", so keyboard and screen-reader users read why it is locked (a disabled control takes no focus, so a tooltip on it would never open). A missing answer shows its required message on submit. This is the OptionalBinding variant of `platform/create/resource-picker`.

### N. Advanced — `SettingsSection`, `SettingRow`, `Switch` (optional)

A collapsible `SettingsSection` titled "Advanced" with a hint, closed by default, over a flush `Card` of Modules and Behavior groups: each a small heading over compact `SettingRow`s with a `Switch` at its default.

### O. Footer — `SaveBar`, `Button` (conditional)

`SaveBar kind="fade"` under the form: no border or surface, the step content fades into the canvas above it on the form's own measure. The footer every create wizard shares (`platform/create/multipage-create`, `platform/create/provision-wizard`): transparent Cancel in `#leading` on the left, back to Projects; in `#actions` on the right, outlined Back from step two on, then the primary action only on steps that ask for typed answers: Next on Connect a repository, "Create and deploy" (or "Create Project" for the CLI) on the last step, "Add to <service>" on Review and add. Both are medium. On a step answered by a click, the footer carries Cancel and Back.

## Do

- Open on Where it runs, and let the user create a service inline or continue without one.
- Advance on the click for steps that are a single choice; show Next only where fields are typed.
- Let the rail go back to completed steps, never forward.
- Seed the inline create name from the search text and focus it.
- Describe each method by what the user does and what they get, in one or two sentences.
- Read back every earlier answer on the last step, each with Change.
- Prefill the project name from the repository or template, and the firewall name from the project.
- Mark a build command that differs from its default as Edited, and offer Use the default.
- Keep the firewall off by default and reveal its picker in place when it is turned on.
- Hand off to `platform/create/deployment-flow` on submit and end on `platform/create/deploy-success`.

## Don't

- Don't show a Next button beside a list where clicking a row already answers the step.
- Don't open a dialog or a new page to create the service; create it inline in the chooser.
- Don't list the method's own steps on the rail before a method is chosen.
- Don't hide the chosen service behind the six-row limit.
- Don't make the user scroll past the method card to reach the footer.
- Don't show the repository list before a Git account is connected; show the Connect state instead.
- Don't replace the rows with a spinner while repositories load; show skeleton rows in the row shape.
- Don't render every repository of an account; show the most recent five and Load more.
- Don't let a locked module look editable: disable it and say why in a tooltip.
- Don't open Advanced by default; every field in it already carries its default.

## Copy

- **Title and breadcrumb:** the create label with the entity's capitalization, e.g. "Create Project".
- **Step titles:** short, with "Select" for a choice, e.g. "Where it runs", "Select a method", "Select a source", "Create and deploy".
- **Chooser instruction:** e.g. "Select a service to continue". Search placeholder and `aria-label`: e.g. "Search services".
- **No match:** the fact, e.g. "No service matches “api”." A count line states the rest, e.g. "4 more. Type to narrow the list."
- **Inline create row:** the create label, e.g. "Create Service". The field label: "New service".
- **Skip:** verb first, e.g. "Continue without a service".
- **Method card title:** the question, e.g. "How do you want to start?".
- **Method titles:** verb first, at most four words, e.g. "Import from Git", "Sync with the CLI", "Start from a template".
- **Source step titles:** "Select a repository", "Select a template", then "Connect a repository" and "Review and add".
- **Connect state:** the title "Connect a Git account", what the platform does with the repository, and "Authorize once."; the button names the provider, e.g. "Connect GitHub".
- **Repository row:** the name and "Updated 3 days ago".
- **Template groups:** "Official", "Community", "Frameworks"; the tag "Featured".
- **Repository visibility:** the switch `aria-label` states the current visibility and the action, e.g. "Repository is public. Make it private."
- **Read-back rows:** the answer and one sentence on it, e.g. "Imported from acme/storefront-checkout.", with "Change".
- **Firewall:** "Protect with a firewall"; the modes "Existing firewall" and "New firewall"; the locked row description ends with "Always on."
- **Edited command:** the tag "Edited" and the button "Use the default".
- **Required:** "This field is required." for an empty field; for a missing choice, the two ways out, e.g. "Select a repository, or create a new one."
- **Final action:** names both acts, e.g. "Create and deploy"; an integration names its target, e.g. "Add to service-01".
- Follow `skills/webkit-microcopy`: "Select", never "Choose"; no em dash in the count line; "Back" only for the previous step, never for Cancel.

## Accessibility

- The `Stepper` has an `aria-label`; disabled future steps cannot be focused.
- The `form` is labelled by the `PageHeader` title; a `fieldset` with a visually hidden `legend` names the flow.
- Service and method rows are native `button`s; service rows expose `aria-pressed`; icons, checks and chevrons are `aria-hidden`.
- The search has an `aria-label`; Enter picks the first match or opens the inline create.
- The inline create moves focus to its Name field and returns it to the list on Back.
- Repository, template and firewall rows are native `button`s with `aria-pressed`; the list that is loading is `aria-busy` and its skeleton rows are `aria-hidden`; a `role="status"` line reports the repository count and the no-match.
- Template groups are `section`s labelled by their sticky `h3`.
- Every `Switch` has an `aria-label` equal to its row title; the privacy switch names its current state.
- The collapsed firewall body is `inert`, so its controls leave the tab order until the switch is on.
- Required messages replace the field description, so they stay tied to the control.
- Step transitions, the firewall reveal and the footer's entrance honour reduced motion.

## States

- WhereItRuns: the first step; the centred service chooser with search, the Create Service row and Continue without a service; the footer carries Cancel alone until answered.
- Method: service-01 was chosen; the page heading over the three-method card, with Cancel and Back in the footer.
- GitSource: Import from Git with the account connected; the account select and search over the repository list, and Cancel and Back in the footer, since picking a repository is the answer.
- TemplateSource: Start from a template; the property filter over the templates grouped under Official, Community and Frameworks, the first three frameworks tagged Featured.
- Repository: Next.js Commerce chosen; New repository with the Account select and the name prefilled, the privacy switch on public, and Back plus Next.
- Configure: storefront-checkout imported; the read-back row, Name, Domain, the build and deploy commands, the firewall switch off and Advanced collapsed, with Back plus Create and deploy.
- ConnectFailed: Import from Git, the GitHub authorization failed; the Connect state stays with a danger Alert under Connect GitHub.
- LoadFailed: Import from Git with the account connected, the repositories failed to load; a danger Alert with Retry in place of the list.
- Install: the Origin Proxy integration chosen; its settings, the What gets added preview landing on service-01, and Back plus Add to service-01.

## Related

- `platform/create/deployment-flow` — the provisioning log the last step submits into.
- `platform/create/deploy-success` — the screen the flow ends on.
- `platform/create/multipage-create` — the step wizard for resources without a code source; same Where it runs chooser.
- `platform/create/provision-wizard` — the wizard that provisions a service and binds a project.
- `platform/create/single-page-create` — its Import from Git form is the one-page version of this flow.
- `platform/create/resource-picker` — its OptionalBinding variant is the firewall binding of the last step.
- `Stepper` — the step rail; see `skills/webkit-create-surface`.
