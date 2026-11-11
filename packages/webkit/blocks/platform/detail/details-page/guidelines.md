# Details page

The second-level page of one resource. The user arrives from a list row or a deploy flow to answer three questions about it: where it lives and whether it is serving, what it is made of, and what to do next. The page names the resource in the breadcrumb, splits its concerns into tabs, and opens the Overview tab on one summary card of facts, followed by whatever the resource needs next: Get started for a resource made from the CLI, the production checklist and topology for a service.

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

### A. Console shell — `Sidebar`, `Brand`, `Command`, `Menu`, `Avatar`, `DropdownMenu`, `Tooltip`, `IconButton`, `ThemeSwitcher`, `Button`, `StatusIndicator`, `GlobalHeader`, `Breadcrumb`, `Kbd`, `ButtonHighlight`, `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent` (required)

The persistent console shell from `skills/webkit-navigation`: the collapsible `Sidebar` with the brand, the `Command` palette and the module `Menu`, the account menu and theme switch in its footer, and one `GlobalHeader` with the `Breadcrumb`, Search with its `Kbd` hint, Create, Agent and the account avatar. Below md the sidebar moves into a left `Drawer`. The breadcrumb reads `module › resource name`, e.g. Resources › analytics-app, and never names a tab; the service overview ends it on its environment picker.

### B. Tab bar — `PageTabs`, `Tabs` (required)

A full-bleed `PageTabs` with one `Tabs.Item` per concern: Overview, Versions, Build, Deployments. On a tabbed page the primary action (an outlined Deploy) sits on the tab row at medium size. A deployment page has no tabs.

### C. Summary subject band — `Card`, `Tooltip`, `Button`, `DropdownMenu`, `IconButton` (required)

`Card :padded="false"` opens the tab. Its first band holds the resource glyph and its primary link, the live address that opens in a new tab and is named by a `Tooltip`, then a secondary Visit `Button` and an outlined Resource actions `IconButton` that opens a `DropdownMenu` placed `bottom-end` with Copy URL and, in its own group, Settings.

### D. Summary facts band — `Tag`, `StatusIndicator`, `Avatar`, `Tooltip` (required)

A grid of label and value pairs: Deployment (the ID as a link with a Production `Tag`), Domains, Status as a `StatusIndicator`, Created as a relative time with the author `Avatar`, Source and Framework. Each label is a small muted span over its value; links carry a `Tooltip` that says where they go. A service adds custom domains, environments and its ID with a `CopyButton`; a policy adds its rules and modules.

### E. Summary state band — `Button` (optional)

The last band, on the canvas fill, says what the user can do next in one sentence and ends on an outlined Documentation `Button`, e.g. how to deploy to production for a resource with nothing deployed.

### F. Get started — `SectionHeader`, `ToggleGroup`, `Card`, `CodeBlock` (optional)

For a resource made from the CLI, the `platform/detail/get-started` section follows the summary: a `SectionHeader` with the CLI or GitHub Actions `ToggleGroup`, then three numbered step `Card`s with a `CodeBlock` each.

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
- Don't render empty facts as blank space; show the action that fills them, e.g. Connect Git Repository under Source.

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

- One `main` landmark holds the tab bar and the tab content; the sidebar is a `nav` named "Main navigation" and the header is named "Console".
- The tab bar is a tablist; arrow keys move between tabs and the active tab is announced.
- Links that open a new tab add "(opens in a new tab)" in visually hidden text; decorative icons are `aria-hidden`.
- Every icon-only button has an `aria-label` and a `Tooltip` with the same words, e.g. "Resource actions", "Account menu".
- Status uses a `StatusIndicator` with a text label, never color alone.
- Below md the navigation drawer is named "Navigation" and returns focus to the Open navigation button when it closes.

## States

- ResourceOverview: the Overview tab of a resource made from the CLI, the summary card followed by Get started.
- Resource: the summary card alone, in its resource shape.
- Service: the service summary with its domains, environment menu, ID and the Deployment Settings band.
- Policy: the policy summary with the resource it protects, a Rules shortcut, its status, environment, rule count and modules.
- ResourceVersions: the Versions tab, a small Versions heading with New Version over the controls row and the versions table.
- ResourceBuild: the Build tab, the Git repository, Build configuration and Deployment bands, with a save bar once a command changes.
- ServiceOverview: a service, with the environment picker in the breadcrumb, Deploy on the tab row, the production checklist and the deployment topology.
- DeploymentDetail: a deployment that went live, the success banner, the Deployment Details card and the Deployment Logs card.
- DeploymentFailed: a deployment the rules rejected, the danger banner with Redeploy, Visit disabled and the logs open on the failed step.

## Related

- `platform/view/table-view` — the list a row of which leads here.
- `platform/detail/get-started` — the section that follows the summary for a resource made from the CLI.
- `platform/detail/production-checklist` — the card on a service overview.
- `platform/detail/deployment-logs` — the steps inside the Deployment Logs card.
- `platform/detail/version-detail` — where a row of the Versions tab leads.
- `platform/create/deploy-drawer` — the drawer the Deploy action opens.
- `platform/edit/edit-resource` — the service Settings tab.
- `shells/console` — the shell this page sits in; see `skills/webkit-navigation` and `skills/webkit-layout`.
