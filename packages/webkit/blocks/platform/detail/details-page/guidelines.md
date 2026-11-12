# Details page

The second-level page of one resource. The user arrives from a list row or a deploy flow to answer three questions about it: where it lives and whether it is serving, what it is made of, and what to do next. The page names the resource in the breadcrumb, splits its concerns into tabs, and opens the Overview tab on one summary card of facts, followed by whatever the resource needs next: Get started for a resource made from the CLI, the production checklist and topology for a service. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header with the breadcrumb, the ⌘K palette and the `main`.

## When to use

- A user opens one resource, service, policy or deployment from its list or from a deploy flow.
- The resource has more than one concern (overview, versions, build, deployments) that each deserve a tab.
- The user needs the live address, the status and the latest deployment of a resource at a glance, with Visit and the resource actions one click away.

## When not to use

- Many resources of one type to compare and filter: use `platform/view/table-view`.
- Editing one version's settings, source or rules: use `platform/detail/version-detail`.
- Changing a resource's settings in a form: use `platform/edit/edit-resource` or `platform/settings/settings-form`.
- Following a deployment as it streams inside a create flow: use `platform/create/deployment-flow` with `platform/detail/deployment-logs`.
- A key and value list that belongs to the resource: use `platform/detail/record-table`.

## Building blocks

### A. Tab bar — `PageTabs`, `Tabs` (required)

A full-bleed `PageTabs` with one `Tabs.Item` per concern: Overview, Versions, Build, Deployments, first in the body and in a `sticky top-0` wrapper on the canvas fill, so it stays in view while the layout's content region scrolls the tab under it. On a tabbed page the primary action (an outlined Deploy) sits on the tab row at medium size. A deployment page has no tabs.

### B. Summary subject band — `Card`, `Tooltip`, `Button`, `DropdownMenu`, `IconButton` (required)

`Card :padded="false"` opens the tab. Its first band holds the resource glyph and its primary link, the live address that opens in a new tab and is named by a `Tooltip`, then a secondary Visit `Button` and an outlined Resource actions `IconButton` that opens a `DropdownMenu` placed `bottom-end` with Copy URL and, in its own group, Settings.

### C. Summary facts band — `Tag`, `StatusIndicator`, `Avatar`, `Tooltip` (required)

A grid of label and value pairs: Deployment (the ID as a link with a Production `Tag`), Domains, Status as a `StatusIndicator`, Created as a relative time with the author `Avatar`, Source and Framework. Each label is a small muted span over its value; links carry a `Tooltip` that says where they go. A service adds custom domains, environments and its ID with a `CopyButton`; a policy adds its rules and modules.

### D. Summary state band — `Button` (optional)

The last band, on the canvas fill, says what the user can do next in one sentence and ends on an outlined Documentation `Button`, e.g. how to deploy to production for a resource with nothing deployed.

### E. Get started — `SectionHeader`, `ToggleGroup`, `Card`, `CodeBlock` (optional)

For a resource made from the CLI, the `platform/detail/get-started` section follows the summary: a `SectionHeader` with the CLI or GitHub Actions `ToggleGroup`, then three numbered step `Card`s with a `CodeBlock` each.

## Breadcrumb and environment

- The trail is the layout's: the app passes `breadcrumbs` from the route meta (`module › resource name`, e.g. Resources › analytics-app). A page body never renders `Breadcrumb`, `GlobalHeader` or a `<main>`.
- A service ends the trail on its environment. That crumb is a control, so the app composes it in the layout's `breadcrumbs` slot: `Breadcrumb.List` with the module and the service, then a `Select` with `kind="transparent"` and `size="small"` (no `w-full`: it sizes to its value like a crumb), labelled `Switch environment`, with a search `Input`, each environment tagged with its deployment policy and Add Environment at its foot. The environment is part of the route, so picking one navigates and the page reads it. `shells/console` (DetailPage) shows the slot.
- The layout hides its breadcrumbs while compact, so below md the service summary's Deployment Settings band carries its own environment menu.

## Topology tab

- Use `TopologyDiagram` for the path a request takes to the resource (Application and ServiceOverview both do). Binds, changes and removals are staged on the node, counted beside Deploy and listed in the deploy `Drawer`; the run ends in the async-submit toast with Edit and Redeploy. A production-checklist step that binds a slot (Bind Policy, Bind Error Page) scrolls to the topology and expands that node instead of opening a separate form.
- Bind, create and remove act on staged state only. Nothing reaches Production until Deploy, and the deploy drawer lists every staged change before it runs.
- Show the staged count on the tab row next to Deploy, so it stays visible from every tab.
- Report the deploy through the async-submit toast (Edit and Redeploy) and clear the staged marks once it succeeds.
- A node that collects many resources adds to itself through the diagram's `actions` slot: the Domains node of ServiceOverview carries an outlined small `IconButton` (`pi pi-plus`) named Add domain inside a `Tooltip`, picked by `node.key === 'domains'`. Never hand-draw a node card to get the `+`.

## Do

- Keep the content in `layout-column` with its boundary inset, and let the tab bar run full-bleed above it.
- Open the Overview tab on the summary card; every other section of the tab comes after it.
- Name the resource in the breadcrumb, not in a `PageHeader` title above the card.
- Put the one primary page action (Deploy) on the tab row, medium and outlined; keep Visit in the summary.
- Give Versions and Deployments the same controls row and table shape as `platform/view/table-view`, scoped to this resource, with a small section heading.
- On a deployment page, lead with a status banner (success, or danger with Redeploy) and disable Visit until the deployment is live.

## Don't

- Don't put the tab name in the breadcrumb, or repeat the resource name as a large heading.
- Don't add a second primary button to the tab row or the summary card.
- Don't spread the facts across several cards; one summary card holds them in bands.
- Don't hide the live address behind the actions menu; it is the card's primary link.
- Don't render empty facts as blank space; show the action that fills them, e.g. Connect Git repository under Source.

## Copy

- **Breadcrumb:** module, then the resource name as created, e.g. "Resources" › "analytics-app".
- **Tabs:** one or two nouns, e.g. "Overview", "Versions", "Build", "Deployments".
- **Fact labels:** a short noun, sentence case, no colon, e.g. "Deployment", "Domains", "Status", "Created", "Source", "Framework".
- **Created:** relative time and author, e.g. "2 weeks ago by Herbert Júlio".
- **Actions:** a verb, e.g. "Visit", "Deploy", "Redeploy"; menu options "Copy URL", "Settings".
- **Link tooltips:** say where the link goes, e.g. "Open analytics-app-z1x2c3.example.com in a new tab".
- **State band:** one sentence on the next step, e.g. "To deploy to Production, drop your project anywhere on this page, connect Git, or run platform deploy via the CLI."
- **Failure banner:** what failed and what still serves, without an em dash, e.g. "A rule with the same behavior is already bound to this service, so the manifest was refused."
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- The body renders no landmark of its own: the layout's single `main` holds the tab bar and the tab content, and the rail and header are the layout's.
- The tab bar is a tablist; arrow keys move between tabs and the active tab is announced.
- Links that open a new tab add "(opens in a new tab)" in visually hidden text; decorative icons are `aria-hidden`.
- Every icon-only button has an `aria-label` and a `Tooltip` with the same words, e.g. "Resource actions", "Add domain".
- Status uses a `StatusIndicator` with a text label, never color alone.

## States

- ResourceOverview: the Overview tab of a resource made from the CLI, the summary card followed by Get started.
- Resource: the summary card alone, in its resource shape.
- Service: the service summary with its domains, environment menu, ID and the Deployment Settings band.
- Policy: the policy summary with the resource it protects, a Rules shortcut, its status, environment, rule count and modules.
- ResourceVersions: the Versions tab, a small Versions heading with Add Version over the controls row and the versions table.
- ResourceBuild: the Build tab, the Git repository, Build configuration and Deployment bands, with a save bar once a command changes.
- ServiceOverview: a service (its environment crumb is the layout's `breadcrumbs` slot), Deploy on the tab row, the production checklist and the deployment topology on `TopologyDiagram` (policy, error page and origin slots staged until Deploy).
- DeploymentDetail: a deployment that went live, the success banner, the Deployment details card and the Deployment logs card.
- DeploymentFailed: a deployment the rules rejected, the danger banner with Redeploy, Visit disabled and the logs open on the failed step.
- Application: a whole application page body, with working tabs. Overview is the summary card; Versions and Deployments are a small `SectionHeader` over a flush `TableRoot`; Topology draws the request path with `TopologyDiagram` (domain, workload, firewall, application, function instance). Binding or removing the firewall or the function only stages the change: the node turns dashed with a Staged status, a polite status line names it, and the tab row shows the count as a warning `Tag` beside Deploy. Deploy opens a `Drawer` that lists each staged change as from and to, then runs on its own: a loading toast, then the async-submit toast with **Edit** (back to the Topology tab) and **Redeploy**, never View deployments.

## Related

- `platform/view/table-view` — the list a row of which leads here.
- `platform/detail/get-started` — the section that follows the summary for a resource made from the CLI.
- `platform/detail/production-checklist` — the card on a service overview.
- `platform/detail/deployment-logs` — the steps inside the Deployment logs card.
- `platform/detail/version-detail` — where a row of the Versions tab leads.
- `platform/create/deploy-drawer` — the drawer the Deploy action opens.
- `platform/edit/edit-resource` — the service Settings tab.
- `shells/console` — the `ConsoleLayout` this page body renders in; see `skills/webkit-navigation` and `skills/webkit-layout`.
