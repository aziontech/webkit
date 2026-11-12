# DetailsPage (`platform/detail/details-page`)

> The Overview tab of a resource detail page: the platform shell with the resource breadcrumb, the full-bleed tab bar, then the column that opens on the resource summary card. The resource overview follows it with Get started for a resource made from the CLI, and the same page plots its Versions tab (the versions table) and its Build tab (repository, build configuration and token bands); the service overview ends its breadcrumb on the environment picker and follows the summary with the production checklist and the deployment topology. The summary card on its own, in its resource, service and policy shapes, is the Resource, Service and Policy variants: a subject band with the primary link and the actions, a band of labelled facts, and a state band on the canvas fill. The deployment page sits in the same shell without tabs: a status banner, the Deployment details card with its Deployment Settings band, and the Deployment logs card whose header carries the duration or the status and the Phased or Complete switch over the DeploymentLogs steps. The Application variant is a whole application page on the `AppLayout` shell with Overview, Versions, Deployments and a Topology tab built on `TopologyDiagram`, whose staged binds deploy through a `Drawer` and the Edit and Redeploy toast. The version page of a resource is the VersionDetail template and the deploy drawers opened from these pages are the DeployDrawer template (Templates/Platform/Create/DeployDrawer). The Deployments tab of a resource and of a service is the TableView controls row over a deployments table, scoped to the resource (the resource tab adds a small Deployments heading with Documentation and an outlined Deploy action); the service Settings tab is a variant of Templates/Platform/Edit/EditResource. Built from `PageHeader`, `PageTabs`, `SectionHeader`, `SettingsSection`, `SettingRow`, `SaveBar`, the platform shell, `Select`, `Tabs`, `TableRoot`, `EmptyState`, `InputGroupRoot`, `Card`, `DropdownMenu`, `Popover`, `Accordion`, `TopologyDiagram`, `Item`, `Drawer`, `Alert`, `LogView`, `CodeBlock` and `ToggleGroup`; the summary card variants add `Button`, `IconButton`, `Tag`, `StatusIndicator`, `Avatar`, `CopyButton` and `Tooltip`.

- Surface: product
- Source: `blocks/platform/detail/details-page/details-page.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/detail/details-page")`
- Components: [Accordion](../../../components/accordion.md), [Alert](../../../components/alert.md), [AppLayout](../../../components/app-layout.md), [Avatar](../../../components/avatar.md), [Brand](../../../components/brand.md), [Breadcrumb](../../../components/breadcrumb.md), [Button](../../../components/button.md), [ButtonHighlight](../../../components/button-highlight.md), [Card](../../../components/card.md), [CodeBlock](../../../components/code-block.md), [Command](../../../components/command.md), [CopyButton](../../../components/copy-button.md), [Drawer](../../../components/drawer.md), `DrawerClose`, `DrawerContent`, `DrawerDescription`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, [DropdownMenu](../../../components/dropdown-menu.md), [EmptyState](../../../components/empty-state.md), [GlobalHeader](../../../components/global-header.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), `InputGroupRoot`, [Item](../../../components/item.md), [Link](../../../components/link.md), [LogView](../../../components/log-view.md), `LogViewContent`, [Menu](../../../components/menu.md), [PageHeader](../../../components/page-header.md), [PageTabs](../../../components/page-tabs.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [Popover](../../../components/popover.md), [SaveBar](../../../components/save-bar.md), [SearchTrigger](../../../components/search-trigger.md), [SectionHeader](../../../components/section-header.md), [Select](../../../components/select.md), [SettingRow](../../../components/setting-row.md), [SettingsSection](../../../components/settings-section.md), [Sidebar](../../../components/sidebar.md), [StatusIndicator](../../../components/status-indicator.md), `TableRoot`, [Tabs](../../../components/tabs.md), [Tag](../../../components/tag.md), [ThemeSwitcher](../../../components/theme-switcher.md), [Toast](../../../components/toast.md), [ToggleGroup](../../../components/toggle-group.md), [Tooltip](../../../components/tooltip.md), [TopologyDiagram](../../../components/topology-diagram.md)
- Skills: `webkit-layout`, `webkit-navigation`, `webkit-ui-states`

## Asked as

overview page; resource overview; detail page; summary page; deployment detail; application overview; deployment failed; página de visão geral; detalhe do recurso; página de resumo; details page with tabs; versions tab; build tab; detalhe com abas; resource summary; summary card; overview card; resource facts; status card; resumo do recurso; cartão de resumo; visão geral; details page; resource details; página de detalhes; application detail; application tabs; topology tab; deployment topology; detalhe da aplicação; topologia

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

### A. Console shell — `Sidebar`, `Brand`, `Command`, `Menu`, `Avatar`, `DropdownMenu`, `Tooltip`, `IconButton`, `ThemeSwitcher`, `Button`, `StatusIndicator`, `GlobalHeader`, `Breadcrumb`, `SearchTrigger`, `ButtonHighlight`, `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent` (required)

The persistent console shell from `skills/webkit-navigation`: the collapsible `Sidebar` with the brand, the `Command` palette and the module `Menu`, the account menu and theme switch in its footer, and one `GlobalHeader` with the `Breadcrumb`, `SearchTrigger` (⌘K / Ctrl K), Create, Agent and the account avatar. Below md the sidebar moves into a left `Drawer`. The breadcrumb reads `module › resource name`, e.g. Resources › analytics-app, and never names a tab; the service overview ends it on its environment picker.

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

### G. Search palette — `Command` (required)

The ⌘K palette the header search opens: `Command.Input`, one group of pages, and `Command.Empty` for no match. It owns the ⌘K / Ctrl K shortcut while mounted.

## Topology tab

- Use `TopologyDiagram` for the path a request takes to the resource (Application and ServiceOverview both do). Binds, changes and removals are staged on the node, counted beside Deploy and listed in the deploy `Drawer`; the run ends in the async-submit toast with Edit and Redeploy. A production-checklist step that binds a slot (Bind Policy, Bind Error Page) scrolls to the topology and expands that node instead of opening a separate form.
- Bind, create and remove act on staged state only. Nothing reaches Production until Deploy, and the deploy drawer lists every staged change before it runs.
- Show the staged count on the tab row next to Deploy, so it stays visible from every tab.
- Report the deploy through the async-submit toast (Edit and Redeploy) and clear the staged marks once it succeeds.

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
- ResourceVersions: the Versions tab, a small Versions heading with Add Version over the controls row and the versions table.
- ResourceBuild: the Build tab, the Git repository, Build configuration and Deployment bands, with a save bar once a command changes.
- ServiceOverview: a service, with the environment picker in the breadcrumb, Deploy on the tab row, the production checklist and the deployment topology on `TopologyDiagram` (policy, error page and origin slots staged until Deploy).
- DeploymentDetail: a deployment that went live, the success banner, the Deployment details card and the Deployment logs card.
- DeploymentFailed: a deployment the rules rejected, the danger banner with Redeploy, Visit disabled and the logs open on the failed step.
- Application: a whole application page on the `AppLayout` console shell (rail in `#navigation`, header with the Applications › name breadcrumb in `#header`), with working tabs. Overview is the summary card; Versions and Deployments are a small `SectionHeader` over a flush `TableRoot`; Topology draws the request path with `TopologyDiagram` (domain, workload, firewall, application, function instance). Binding or removing the firewall or the function only stages the change: the node turns dashed with a Staged status, a polite status line names it, and the tab row shows the count as a warning `Tag` beside Deploy. Deploy opens a `Drawer` that lists each staged change as from and to, then runs on its own: a loading toast, then the async-submit toast with **Edit** (back to the Topology tab) and **Redeploy**, never View deployments.

## Related

- `platform/view/table-view` — the list a row of which leads here.
- `platform/detail/get-started` — the section that follows the summary for a resource made from the CLI.
- `platform/detail/production-checklist` — the card on a service overview.
- `platform/detail/deployment-logs` — the steps inside the Deployment logs card.
- `platform/detail/version-detail` — where a row of the Versions tab leads.
- `platform/create/deploy-drawer` — the drawer the Deploy action opens.
- `platform/edit/edit-resource` — the service Settings tab.
- `shells/console` — the shell this page sits in; see `skills/webkit-navigation` and `skills/webkit-layout`.

## Variants

- `ResourceOverview` — primary (the code below)
- `Resource` — The summary card that opens a resource Overview tab: a subject band with the primary link and the actions, a band of labelled facts, and a state band on the canvas fill. It comes in three shapes — a resource, a service with its domains and environments, and a policy — each with its own facts and copy. Built from `Card`, `Button`, `IconButton`, `DropdownMenu`, `Popover`, `Tag`, `StatusIndicator`, `Avatar`, `CopyButton`, `Accordion`, `Alert` and `Tooltip`.
- `Service` — The service summary: the domain with its aliases in the overflow popover, the environment menu (shown below md only; from md up the breadcrumb carries the environment) and actions, the custom domains, status, service ID and creation, and the shared Deployment Settings band that expands into its policies.
- `Policy` — The policy summary: the resource it protects, a Rules shortcut and actions, then status, environment, rule count, last edit and the enabled modules, and what the policy inspects.
- `ResourceVersions` — The Versions tab of the same resource: the small Versions heading with Add Version, the controls row (Filter, search, Refresh, Download CSV, Columns) and the paginated versions table, each row with its code-set name and Latest mark, the comment, the state Tag, who built it and when, and the Open configuration or Deploy actions.
- `ResourceBuild` — The Build tab of a resource made from the CLI: the small Build heading with an outlined Deploy, the Git repository band holding the Connect your repository card, the Build configuration band with the read-only framework preset and the build and deploy commands, and the Deployment band with the API token. Editing a command raises the save bar.
- `ServiceOverview` — A service: the breadcrumb ends on its environment picker, the outlined Deploy action sits on the tab row, the summary carries its Deployment Settings band (its own environment menu shows only below md, where the breadcrumb is hidden), the production checklist expands into a drawer, and the deployment topology is a `TopologyDiagram` from domains to storage: Policy, Error Page and Origin are bindable slots whose changes are staged, counted beside Deploy and listed in the deploy drawer, ending in the toast with Edit and Redeploy.
- `DeploymentDetail` — A deployment that went live: the success banner, the Deployment details card with every fact and its Deployment Settings band for Default, and the Deployment logs card with the run duration and the Phased or Complete switch over the phased steps.
- `DeploymentFailed` — A deployment the rules rejected: the danger banner with Redeploy, Visit disabled until the deployment is live, and the Deployment logs card with the Error status, open on the failed step with the rest skipped.
- `Application` — An application on the `AppLayout` console shell with working tabs: Overview (the summary card with the live address, Visit and actions, the deployment, status, active version, framework, source and creation facts, and a band that sends settings changes to the active version), Versions and Deployments (a small `SectionHeader` over a `TableRoot` each), and Topology, where `TopologyDiagram` draws domain, workload, firewall, application and function instance. Binding or removing a firewall or function is staged: the tab row counts the changes in a warning `Tag`, Deploy opens a `Drawer` listing them, and the run reports through the async-submit toast with Edit (back to Topology) and Redeploy.

Each variant is the same screen in another state: `get_pattern("platform/detail/details-page", { variant })`, or the file under `blocks/platform/detail/details-page/variants/`.

## Code (`ResourceOverview`)

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Command from '@aziontech/webkit/command'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Menu from '@aziontech/webkit/menu'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import SectionHeader from '@aziontech/webkit/section-header'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

  const navGroups = [
    {
      items: [
        { id: 'home', label: 'Home', icon: 'pi pi-home', path: '/home' },
        { id: 'projects', label: 'Projects', icon: 'pi pi-folder', path: '/projects' },
        {
          id: 'deployments',
          label: 'Deployments',
          icon: 'pi pi-cloud-upload',
          path: '/deployments'
        }
      ]
    },
    {
      label: 'Build',
      items: [
        { id: 'resources', label: 'Resources', icon: 'pi pi-box', path: '/resources' },
        { id: 'services', label: 'Services', icon: 'pi pi-server', path: '/services' },
        { id: 'variables', label: 'Variables', icon: 'pi pi-sliders-h', path: '/variables' },
        { id: 'integrations', label: 'Integrations', icon: 'pi pi-link', path: '/integrations' },
        { id: 'templates', label: 'Templates', icon: 'pi pi-clone', path: '/templates' }
      ]
    },
    {
      label: 'Security',
      items: [
        { id: 'domains', label: 'Domains', icon: 'pi pi-globe', path: '/domains' },
        { id: 'policies', label: 'Policies', icon: 'pi pi-shield', path: '/policies' },
        { id: 'rule-sets', label: 'Rule sets', icon: 'pi pi-list', path: '/rule-sets' },
        { id: 'keys', label: 'Keys', icon: 'pi pi-key', path: '/keys' }
      ]
    },
    {
      label: 'Data',
      items: [
        {
          id: 'databases',
          label: 'Databases',
          icon: 'pi pi-database',
          path: '/databases',
          tagValue: 'Preview'
        },
        { id: 'storage', label: 'Storage', icon: 'pi pi-inbox', path: '/storage' }
      ]
    },
    {
      label: 'Observability',
      items: [
        { id: 'logs', label: 'Logs', icon: 'pi pi-file', path: '/logs' },
        {
          id: 'metrics-module',
          label: 'Metrics',
          icon: 'pi pi-chart-bar',
          kind: 'drill',
          href: '/metrics',
          groups: [
            {
              items: [{ id: 'metrics', label: 'Overview', path: '/metrics' }]
            },
            {
              label: 'Build',
              items: [
                {
                  id: 'metrics-resources',
                  label: 'Resources',
                  path: '/metrics',
                  query: { dashboard: 'resources' }
                },
                {
                  id: 'metrics-services',
                  label: 'Services',
                  path: '/metrics',
                  query: { dashboard: 'services' }
                },
                {
                  id: 'metrics-cache',
                  label: 'Cache',
                  path: '/metrics',
                  query: { dashboard: 'cache' }
                }
              ]
            },
            {
              label: 'Security',
              items: [
                {
                  id: 'metrics-domains',
                  label: 'Domains',
                  path: '/metrics',
                  query: { dashboard: 'domains' }
                },
                {
                  id: 'metrics-policies',
                  label: 'Policies',
                  path: '/metrics',
                  query: { dashboard: 'policies' }
                },
                {
                  id: 'metrics-rule-sets',
                  label: 'Rule sets',
                  path: '/metrics',
                  query: { dashboard: 'rule-sets' }
                }
              ]
            },
            {
              label: 'Data',
              items: [
                {
                  id: 'metrics-databases',
                  label: 'Databases',
                  path: '/metrics',
                  query: { dashboard: 'databases' }
                },
                {
                  id: 'metrics-storage',
                  label: 'Storage',
                  path: '/metrics',
                  query: { dashboard: 'storage' }
                }
              ]
            }
          ]
        },
        { id: 'events', label: 'Events', icon: 'pi pi-bolt', path: '/events' }
      ]
    },
    {
      label: 'More',
      items: [
        { id: 'catalog', label: 'Catalog', icon: 'pi pi-th-large', path: '/catalog' },
        {
          id: 'settings',
          label: 'Settings',
          icon: 'pi pi-cog',
          kind: 'drill',
          groups: [
            {
              label: 'Settings',
              items: [
                { id: 'settings-general', label: 'General', path: '/account' },
                {
                  id: 'settings-build-deployment',
                  label: 'Build and deployment',
                  path: '/account/build-deployment'
                },
                {
                  id: 'settings-environments',
                  label: 'Environments',
                  path: '/account/environments'
                },
                { id: 'settings-users', label: 'Users management', path: '/account/users' },
                { id: 'settings-teams', label: 'Teams and permissions', path: '/account/teams' }
              ]
            },
            {
              label: 'Access',
              items: [
                { id: 'settings-tokens', label: 'Personal tokens', path: '/personal-tokens' },
                { id: 'settings-credentials', label: 'Credentials', path: '/account/credentials' },
                { id: 'settings-security-mfa', label: 'Multi-factor auth' },
                { id: 'settings-security-sessions', label: 'Active sessions' },
                { id: 'settings-activity', label: 'Activity history', path: '/account/activity' }
              ]
            },
            {
              label: 'Billing',
              items: [
                { id: 'settings-billing', label: 'Billing and plan', path: '/account/billing' },
                { id: 'settings-invoices', label: 'Invoices' }
              ]
            }
          ]
        }
      ]
    }
  ]

  const recentRows = [
    {
      key: 'resources/1020655',
      name: 'resource-01',
      icon: 'pi pi-box',
      typeLabel: 'Resource',
      navId: 'resources'
    },
    {
      key: 'domains/domain-1020655',
      name: 'app.example.com',
      icon: 'pi pi-globe',
      typeLabel: 'Domain',
      navId: 'domains'
    },
    {
      key: 'databases/feature-flags',
      name: 'feature-flags',
      icon: 'pi pi-database',
      typeLabel: 'Database',
      navId: 'databases'
    }
  ]

  const accountCommands = [
    { id: 'settings', label: 'Account settings', icon: 'pi pi-cog' },
    { id: 'personal-tokens', label: 'Personal tokens', icon: 'pi pi-key' },
    { id: 'docs', label: 'Docs', icon: 'pi pi-book' },
    { id: 'logout', label: 'Log out', icon: 'pi pi-sign-out' }
  ]

  const breadcrumb = [{ label: 'Resources', href: '/resources' }, { label: 'analytics-app' }]
  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'versions', label: 'Versions' },
    { value: 'build', label: 'Build' },
    { value: 'deployments', label: 'Deployments' }
  ]

  const activeId = ref('resources')
  const navOpen = ref(false)
  const paletteOpen = ref(false)
  const paletteQuery = ref('')
  const theme = ref('system')
  const railWidth = ref(null)
  const railCollapsed = ref(false)
  const activeTab = ref('overview')

  watch(paletteOpen, () => {
    paletteQuery.value = ''
  })

  const leaves = (items) =>
    items.flatMap((item) =>
      item.groups
        ? leaves(item.groups.flatMap((group) => group.items))
        : item.children
          ? leaves(item.children)
          : [item]
    )

  const paletteGroups = navGroups.flatMap((group, groupIndex) => {
    const blocks = []
    let run = []
    const flush = () => {
      if (run.length) {
        blocks.push({
          key: `area-${groupIndex}-${blocks.length}`,
          heading: group.label ?? '',
          items: leaves(run)
        })
      }
      run = []
    }
    for (const item of group.items) {
      if (item.groups || item.children) {
        flush()
        blocks.push({ key: item.id, heading: item.label, items: leaves([item]) })
      } else run.push(item)
    }
    flush()
    return blocks
  })

  const resolvedTheme = computed(() =>
    theme.value === 'system'
      ? globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme.value
  )

  const actionCommands = computed(() => [
    { id: 'create', label: 'Create Resource', icon: 'pi pi-plus-circle' },
    {
      id: 'theme',
      label: resolvedTheme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
      icon: resolvedTheme.value === 'dark' ? 'pi pi-sun' : 'pi pi-moon'
    },
    {
      id: 'sidebar',
      label: railCollapsed.value ? 'Expand sidebar' : 'Collapse sidebar',
      icon: railCollapsed.value ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left'
    }
  ])

  const onNavigate = (event, node) => {
    activeId.value = node.id
  }

  const onMobileNavigate = (event, node) => {
    onNavigate(event, node)
    navOpen.value = false
  }

  const onPaletteSelect = (event, value) => {
    const [scope, id] = String(value).split(':')
    if (scope === 'nav') activeId.value = id
    if (scope === 'res') {
      activeId.value = recentRows.find((row) => row.key === id)?.navId ?? activeId.value
    }
    if (id === 'theme') theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'
    if (id === 'sidebar') railCollapsed.value = !railCollapsed.value
  }

  const PATHS = [
    { label: 'CLI', value: 'cli' },
    { label: 'GitHub Actions', value: 'actions' }
  ]

  const CLI_STEPS = [
    {
      title: 'Install the CLI',
      description:
        'Install it globally. It builds with your framework preset and ships the build in one step.',
      tabs: [
        {
          label: 'npm',
          value: 'npm',
          language: 'bash',
          code: 'npm install -g platform-cli'
        },
        {
          label: 'yarn',
          value: 'yarn',
          language: 'bash',
          code: 'yarn global add platform-cli'
        },
        { label: 'pnpm', value: 'pnpm', language: 'bash', code: 'pnpm add -g platform-cli' },
        {
          label: 'brew',
          value: 'brew',
          language: 'bash',
          code: 'brew install platform-cli'
        }
      ]
    },
    {
      title: 'Link your project',
      description:
        'Authenticate, then link the local project to this resource so every deploy lands on it.',
      tabs: [
        {
          label: 'Link',
          value: 'link',
          language: 'bash',
          code: `platform login
platform link \\
  --name analytics-app`
        }
      ]
    },
    {
      title: 'Deploy and visit your site',
      description:
        'Build and ship. The CLI prints the domain when it finishes, and sync reconciles platform.json with what the console shows.',
      tabs: [
        {
          label: 'Deploy',
          value: 'deploy',
          language: 'bash',
          code: `platform deploy --auto --local
platform sync`
        }
      ]
    }
  ]

  const ACTIONS_STEPS = [
    {
      title: 'Store your personal token',
      description:
        'Create a personal token in Account settings and keep it as the repository secret the workflow authenticates with.',
      tabs: [
        {
          label: 'Secret',
          value: 'secret',
          language: 'bash',
          code: `gh secret set \\
  PLATFORM_TOKEN`
        }
      ]
    },
    {
      title: 'Add the deploy workflow',
      description:
        'One job that installs the CLI and deploys the build. Every push to the production branch runs it.',
      tabs: [
        {
          label: 'deploy.yml',
          value: 'workflow',
          fileName: '.github/workflows/deploy.yml',
          language: 'yaml',
          code: `on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g platform-cli
      - run: platform login --token \${{ secrets.PLATFORM_TOKEN }}
      - run: platform deploy --auto --local`
        }
      ]
    },
    {
      title: 'Push to deploy',
      description:
        'Every push to the production branch builds and ships. The deployment lands on the Overview tab as it runs.',
      tabs: [{ label: 'Push', value: 'push', language: 'bash', code: 'git push origin main' }]
    }
  ]

  const path = ref('cli')
  const steps = computed(() => (path.value === 'actions' ? ACTIONS_STEPS : CLI_STEPS))
</script>

<template>
  <div class="relative flex h-dvh overflow-hidden bg-(--bg-canvas)">
    <div class="hidden h-full [--sidebar-width:var(--container-2xs)] md:flex">
      <Sidebar
        v-model:width="railWidth"
        v-model:collapsed="railCollapsed"
        resizable
        collapsible
        aria-label="Main navigation"
        collapse-aria-label="Collapse sidebar"
        expand-aria-label="Expand sidebar"
        resize-aria-label="Resize sidebar"
      >
        <template #header>
          <div class="-m-(--spacing-md) flex flex-col">
            <div
              class="flex h-14 shrink-0 items-center border-b border-(--border-default) px-(--spacing-md)"
            >
              <a
                href="/home"
                aria-label="Azion home"
                class="flex h-6 w-fit items-center rounded-(--shape-button) px-(--spacing-xs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
              >
                <Brand
                  kind="default"
                  size="small"
                />
              </a>
            </div>

            <Command
              v-model:open="paletteOpen"
              @select="onPaletteSelect"
            >
              <Command.Input
                placeholder="Search resources, pages and commands"
                @update:model-value="(value) => (paletteQuery = String(value ?? ''))"
              />
              <Command.List>
                <Command.Group
                  v-if="!paletteQuery"
                  key="recents"
                  heading="Recents"
                >
                  <Command.Item
                    v-for="row in recentRows"
                    :key="row.key"
                    :value="'res:' + row.key"
                  >
                    <template #prefix>
                      <i
                        :class="row.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ row.name }}
                    <template #suffix>
                      <span class="text-label-sm text-(--text-muted)">{{ row.typeLabel }}</span>
                    </template>
                  </Command.Item>
                </Command.Group>

                <Command.Separator
                  v-if="!paletteQuery"
                  key="recents-rule"
                />

                <Command.Group
                  v-for="group in paletteGroups"
                  :key="group.key"
                  :heading="group.heading"
                >
                  <Command.Item
                    v-for="item in group.items"
                    :key="item.id"
                    :value="'nav:' + item.id"
                  >
                    <template
                      v-if="item.icon"
                      #prefix
                    >
                      <i
                        :class="item.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ item.label }}
                  </Command.Item>
                </Command.Group>

                <Command.Separator key="commands-rule" />

                <Command.Group heading="Actions">
                  <Command.Item
                    v-for="command in actionCommands"
                    :key="command.id"
                    :value="'cmd:' + command.id"
                  >
                    <template #prefix>
                      <i
                        :class="command.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ command.label }}
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Account">
                  <Command.Item
                    v-for="command in accountCommands"
                    :key="command.id"
                    :value="'cmd:' + command.id"
                  >
                    <template #prefix>
                      <i
                        :class="command.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ command.label }}
                  </Command.Item>
                </Command.Group>

                <Command.Empty>No resource, page or command matches your search.</Command.Empty>
              </Command.List>
            </Command>
          </div>
        </template>

        <div class="-mt-(--spacing-xxs) pt-(--layout-boundary-start)">
          <Menu
            :groups="navGroups"
            :active-id="activeId"
            role="presentation"
            @navigate="onNavigate"
          >
            <Menu.Back />
          </Menu>
        </div>

        <template #footer>
          <div class="flex items-center gap-(--spacing-xs)">
            <Avatar
              label="alex@example.com"
              size="small"
              kind="square"
            />
            <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)">alex</span>
            <DropdownMenu placement="top-end">
              <DropdownMenu.Trigger>
                <Tooltip text="Account menu">
                  <IconButton
                    icon="pi pi-ellipsis-v"
                    aria-label="Account menu"
                    kind="outlined"
                    size="small"
                  />
                </Tooltip>
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <template #top>
                  <div class="flex min-w-0 flex-col">
                    <span class="truncate text-label-md text-(--text-default)">alex</span>
                    <span class="truncate text-body-xs text-(--text-muted)">alex@example.com</span>
                  </div>
                </template>
                <DropdownMenu.Option
                  value="settings"
                  label="Account settings"
                >
                  <template #right>
                    <i
                      class="pi pi-cog"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="personal-tokens"
                  label="Personal tokens"
                >
                  <template #right>
                    <i
                      class="pi pi-key"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <div
                  class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)"
                >
                  <span class="flex-1 truncate text-start text-label-sm text-(--text-default)"
                    >Theme</span
                  >
                  <ThemeSwitcher
                    v-model="theme"
                    aria-label="Theme"
                  />
                </div>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="home"
                  label="Home page"
                >
                  <template #right>
                    <i
                      class="pi pi-home"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="changelog"
                  label="Changelog"
                >
                  <template #right>
                    <i
                      class="pi pi-pencil"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="feedback"
                  label="Feedback"
                >
                  <template #right>
                    <i
                      class="pi pi-comment"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="docs"
                  label="Docs"
                >
                  <template #right>
                    <i
                      class="pi pi-book"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="logout"
                  label="Log out"
                >
                  <template #right>
                    <i
                      class="pi pi-sign-out"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-xxs) py-(--spacing-xxs)">
                  <Button
                    label="Upgrade to Pro"
                    kind="secondary"
                    size="medium"
                    class="w-full"
                  />
                  <div class="flex justify-center px-(--spacing-xs)">
                    <StatusIndicator
                      severity="success"
                      label="All systems normal"
                    />
                  </div>
                </div>
              </DropdownMenu.Group>
            </DropdownMenu>
          </div>
        </template>
      </Sidebar>
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <div class="@container">
        <GlobalHeader aria-label="Console">
          <GlobalHeader.Left>
            <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
              <span class="contents md:hidden">
                <Tooltip
                  text="Open navigation"
                  placement="bottom"
                >
                  <IconButton
                    icon="pi pi-bars"
                    aria-label="Open navigation"
                    kind="outlined"
                    size="medium"
                    @click="navOpen = true"
                  />
                </Tooltip>
              </span>

              <a
                href="/home"
                aria-label="Azion home"
                class="flex h-6 w-fit shrink-0 items-center rounded-(--shape-button) px-(--spacing-xxs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none md:hidden"
              >
                <Brand
                  kind="default"
                  size="small"
                />
              </a>

              <div class="-ms-(--spacing-xs) hidden w-fit min-w-0 shrink md:flex">
                <Breadcrumb
                  :items="breadcrumb"
                  class="w-full"
                />
              </div>
            </div>
          </GlobalHeader.Left>
          <GlobalHeader.Middle />
          <GlobalHeader.Right>
            <SearchTrigger
              collapsible
              @open="paletteOpen = true"
            />

            <span class="contents md:hidden">
              <Tooltip
                text="Create"
                placement="bottom"
              >
                <IconButton
                  icon="pi pi-plus-circle"
                  kind="primary"
                  size="medium"
                  aria-label="Create"
                />
              </Tooltip>
              <Tooltip
                text="Agent"
                placement="bottom"
              >
                <IconButton
                  icon="ai ai-ask-azion"
                  kind="outlined"
                  size="medium"
                  aria-label="Agent"
                />
              </Tooltip>
            </span>
            <span class="hidden md:contents">
              <Button
                label="Create"
                kind="primary"
                size="medium"
                icon="pi pi-plus-circle"
              />
              <ButtonHighlight
                label="Agent"
                size="medium"
                icon="ai ai-ask-azion"
              />
            </span>

            <button
              type="button"
              aria-label="Account settings"
              class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
            >
              <Avatar
                label="alex@example.com"
                size="medium"
                kind="square"
              />
            </button>
          </GlobalHeader.Right>
        </GlobalHeader>
      </div>

      <div class="min-h-0 flex-1 overflow-auto animate-page-enter motion-reduce:animate-none">
        <main class="flex h-full flex-col">
          <PageTabs v-model="activeTab">
            <Tabs.Item
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
              :label="tab.label"
            />
          </PageTabs>

          <div class="relative flex min-h-0 flex-1 flex-col">
            <section class="min-h-0 flex-1 overflow-auto">
              <div class="flex min-h-full flex-col">
                <div class="layout-column layout-boundary flex min-w-0 flex-col">
                  <section
                    class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap) pb-(--layout-section-gap)"
                  >
                    <Card :padded="false">
                      <template #content>
                        <div
                          class="@container/band flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)"
                        >
                          <div
                            class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)"
                          >
                            <i
                              class="pi pi-globe shrink-0 text-body-lg text-(--text-muted)"
                              aria-hidden="true"
                            />
                            <div class="flex min-w-0">
                              <Tooltip
                                text="Open analytics-app-z1x2c3.example.com in a new tab"
                                class="w-full"
                              >
                                <a
                                  href="https://analytics-app-z1x2c3.example.com"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  data-link
                                  class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                                >
                                  <span
                                    class="truncate underline-offset-2 group-hover/link:underline"
                                    >analytics-app-z1x2c3.example.com</span
                                  >
                                  <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                                  <i
                                    class="pi pi-external-link shrink-0 text-body-xs leading-none"
                                    aria-hidden="true"
                                  />
                                </a>
                              </Tooltip>
                            </div>
                          </div>

                          <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
                            <Button
                              label="Visit"
                              kind="secondary"
                              size="medium"
                              icon="pi pi-external-link"
                            />

                            <DropdownMenu placement="bottom-end">
                              <DropdownMenu.Trigger>
                                <Tooltip text="Resource actions">
                                  <IconButton
                                    icon="pi pi-ellipsis-h"
                                    kind="outlined"
                                    size="medium"
                                    aria-label="Resource actions"
                                  />
                                </Tooltip>
                              </DropdownMenu.Trigger>

                              <DropdownMenu.Group>
                                <DropdownMenu.Option
                                  value="copy-url"
                                  label="Copy URL"
                                >
                                  <template #left>
                                    <i
                                      class="pi pi-copy"
                                      aria-hidden="true"
                                    />
                                  </template>
                                </DropdownMenu.Option>
                              </DropdownMenu.Group>

                              <DropdownMenu.Group>
                                <DropdownMenu.Option
                                  value="settings"
                                  label="Settings"
                                >
                                  <template #left>
                                    <i
                                      class="pi pi-cog"
                                      aria-hidden="true"
                                    />
                                  </template>
                                </DropdownMenu.Option>
                              </DropdownMenu.Group>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div
                          class="@container/band border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) grid grid-cols-2 gap-(--spacing-sm) sm:grid-cols-3 lg:grid-cols-6"
                        >
                          <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
                            <span class="text-label-sm text-(--text-muted)">Deployment</span>
                            <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                              <div class="flex min-w-0">
                                <Tooltip
                                  text="Open 1213275262 in Deployments"
                                  class="w-full"
                                >
                                  <a
                                    href="/deployments/1213275262"
                                    data-link
                                    class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                                  >
                                    <span
                                      class="truncate underline-offset-2 group-hover/link:underline"
                                      >1213275262</span
                                    >
                                    <i
                                      class="pi pi-external-link shrink-0 text-body-xs leading-none"
                                      aria-hidden="true"
                                    />
                                  </a>
                                </Tooltip>
                              </div>
                              <Tag
                                label="Production"
                                severity="secondary"
                                size="small"
                                class="shrink-0"
                              />
                            </div>
                          </div>

                          <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
                            <span class="text-label-sm text-(--text-muted)">Domains</span>
                            <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                              <div class="flex min-w-0">
                                <Tooltip
                                  text="Open analytics-app-z1x2c3.example.com in a new tab"
                                  class="w-full"
                                >
                                  <a
                                    href="https://analytics-app-z1x2c3.example.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-link
                                    class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                                  >
                                    <span
                                      class="truncate underline-offset-2 group-hover/link:underline"
                                      >analytics-app-z1x2c3.example.com</span
                                    >
                                    <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                                    <i
                                      class="pi pi-external-link shrink-0 text-body-xs leading-none"
                                      aria-hidden="true"
                                    />
                                  </a>
                                </Tooltip>
                              </div>
                            </div>
                          </div>

                          <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
                            <span class="text-label-sm text-(--text-muted)">Status</span>
                            <div class="flex min-h-7 min-w-0 items-center">
                              <StatusIndicator
                                severity="success"
                                label="Ready"
                              />
                            </div>
                          </div>

                          <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
                            <span class="text-label-sm text-(--text-muted)">Created</span>
                            <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                              <span class="truncate text-body-sm text-(--text-default)">
                                2 weeks ago by Herbert Júlio
                              </span>
                              <Avatar
                                alt="Herbert Júlio"
                                label="Herbert Júlio"
                                size="small"
                                kind="square"
                                class="shrink-0"
                              />
                            </div>
                          </div>

                          <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
                            <span class="text-label-sm text-(--text-muted)">Source</span>
                            <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-sm)">
                              <button
                                type="button"
                                class="inline-flex min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) text-body-sm text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) underline hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                              >
                                <span class="truncate">Connect Git repository</span>
                              </button>
                            </div>
                          </div>

                          <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
                            <span class="text-label-sm text-(--text-muted)">Framework</span>
                            <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                              <i
                                class="ai-cor ai-next shrink-0 text-body-lg"
                                aria-hidden="true"
                              />
                              <span class="truncate text-body-sm text-(--text-default)">
                                Next.js
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          class="@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-xs)"
                        >
                          <p
                            class="min-w-0 flex-1 basis-(--container-2xs) text-pretty text-body-sm text-(--text-muted)"
                          >
                            To deploy to Production, drop your project anywhere on this page,
                            connect Git, or run
                            <code
                              class="font-(family-name:--font-code) text-body-sm text-(--text-default)"
                              >platform deploy</code
                            >
                            via the CLI.
                          </p>

                          <div class="w-full shrink-0 @lg/band:ms-auto @lg/band:w-fit">
                            <Button
                              class="w-full"
                              label="Documentation"
                              kind="outlined"
                              size="medium"
                              icon="pi pi-book"
                              href="https://example.com/docs/cli"
                              target="_blank"
                            />
                          </div>
                        </div>
                      </template>
                    </Card>

                    <div class="@container flex min-w-0 flex-col gap-(--spacing-md)">
                      <SectionHeader title="Get started">
                        <template #description>
                          Two ways to build and deploy this resource. Select one and follow the
                          steps, or read the
                          <a
                            href="https://example.com/docs/cli"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) underline hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                            >CLI docs</a
                          >.
                        </template>
                        <template #actions>
                          <ToggleGroup
                            v-model="path"
                            :options="PATHS"
                            size="large"
                            aria-label="Deploy with"
                          />
                        </template>
                      </SectionHeader>

                      <div class="grid min-w-0 gap-(--spacing-lg) @4xl:grid-cols-3">
                        <div
                          v-for="(step, index) in steps"
                          :key="step.title"
                          class="relative flex min-w-0"
                        >
                          <span
                            v-if="index > 0"
                            aria-hidden="true"
                            class="absolute end-full top-9 hidden w-(--spacing-lg) border-t border-dashed border-(--border-default) @4xl:block"
                          />
                          <div class="flex min-w-0 flex-1">
                            <Card
                              :padded="false"
                              class="w-full"
                            >
                              <template #content>
                                <div
                                  class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-lg)"
                                >
                                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                                    <span
                                      class="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--bg-surface-overlay) text-label-sm text-(--text-default)"
                                    >
                                      {{ index + 1 }}
                                    </span>
                                    <h3 class="min-w-0 text-heading-xs text-(--text-default)">
                                      {{ step.title }}
                                    </h3>
                                  </div>
                                  <p class="text-pretty text-body-sm text-(--text-muted)">
                                    {{ step.description }}
                                  </p>
                                  <div class="mt-(--spacing-xxs) min-w-0">
                                    <CodeBlock
                                      :tabs="step.tabs"
                                      :show-line-numbers="false"
                                      :copy-aria-label="`Copy the commands for ${step.title}`"
                                      class="w-full"
                                    />
                                  </div>
                                </div>
                              </template>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>

    <Drawer
      v-model:open="navOpen"
      side="right"
      size="small"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent aria-label="Navigation">
          <Sidebar aria-label="Main navigation">
            <template #header>
              <div class="-m-(--spacing-md) flex flex-col">
                <div
                  class="flex h-14 shrink-0 items-center border-b border-(--border-default) px-(--spacing-md)"
                >
                  <a
                    href="/home"
                    aria-label="Azion home"
                    class="flex h-6 w-fit items-center rounded-(--shape-button) px-(--spacing-xs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                  >
                    <Brand
                      kind="default"
                      size="small"
                    />
                  </a>
                </div>
              </div>
            </template>

            <div class="-mt-(--spacing-xxs) pt-(--layout-boundary-start)">
              <Menu
                :groups="navGroups"
                :active-id="activeId"
                role="presentation"
                @navigate="onMobileNavigate"
              >
                <Menu.Back />
              </Menu>
            </div>

            <template #footer>
              <div class="flex items-center gap-(--spacing-xs)">
                <Avatar
                  label="alex@example.com"
                  size="small"
                  kind="square"
                />
                <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)"
                  >alex</span
                >
                <DropdownMenu placement="top-end">
                  <DropdownMenu.Trigger>
                    <Tooltip text="Account menu">
                      <IconButton
                        icon="pi pi-ellipsis-v"
                        aria-label="Account menu"
                        kind="outlined"
                        size="small"
                      />
                    </Tooltip>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <template #top>
                      <div class="flex min-w-0 flex-col">
                        <span class="truncate text-label-md text-(--text-default)">alex</span>
                        <span class="truncate text-body-xs text-(--text-muted)"
                          >alex@example.com</span
                        >
                      </div>
                    </template>
                    <DropdownMenu.Option
                      value="settings"
                      label="Account settings"
                    >
                      <template #right>
                        <i
                          class="pi pi-cog"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="personal-tokens"
                      label="Personal tokens"
                    >
                      <template #right>
                        <i
                          class="pi pi-key"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <div
                      class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)"
                    >
                      <span class="flex-1 truncate text-start text-label-sm text-(--text-default)"
                        >Theme</span
                      >
                      <ThemeSwitcher
                        v-model="theme"
                        aria-label="Theme"
                      />
                    </div>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <DropdownMenu.Option
                      value="home"
                      label="Home page"
                    >
                      <template #right>
                        <i
                          class="pi pi-home"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="changelog"
                      label="Changelog"
                    >
                      <template #right>
                        <i
                          class="pi pi-pencil"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="feedback"
                      label="Feedback"
                    >
                      <template #right>
                        <i
                          class="pi pi-comment"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                    <DropdownMenu.Option
                      value="docs"
                      label="Docs"
                    >
                      <template #right>
                        <i
                          class="pi pi-book"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <DropdownMenu.Option
                      value="logout"
                      label="Log out"
                    >
                      <template #right>
                        <i
                          class="pi pi-sign-out"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                  </DropdownMenu.Group>
                  <DropdownMenu.Group>
                    <div
                      class="flex flex-col gap-(--spacing-sm) px-(--spacing-xxs) py-(--spacing-xxs)"
                    >
                      <Button
                        label="Upgrade to Pro"
                        kind="secondary"
                        size="medium"
                        class="w-full"
                      />
                      <div class="flex justify-center px-(--spacing-xs)">
                        <StatusIndicator
                          severity="success"
                          label="All systems normal"
                        />
                      </div>
                    </div>
                  </DropdownMenu.Group>
                </DropdownMenu>
              </div>
            </template>
          </Sidebar>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
```
