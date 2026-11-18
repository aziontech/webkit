# DetailResource (`detail/detail-resource`)

> The Overview tab of a resource detail page: the full-bleed tab bar, sticky while the layout scrolls, then the column that opens on the resource summary card. The resource overview follows it with Get started for a resource made from the CLI, and the same page plots its Versions tab (the versions table) and its Build tab (repository, build configuration and token bands); the service overview follows the summary with the production checklist and the deployment topology. The summary card on its own, in its resource, service and policy shapes, is the Resource, Service and Policy variants: a subject band with the primary link and the actions, a band of labelled facts, and a state band on the canvas fill. A deployment's own page (success, failure, queued) is the DeploymentLogs template and one function run is the Invocations template. The FirstDeploy variant draws the summary cards before and during the first deploy, ResourceBuildConnected the Build tab with a connected repository, and ApplicationBuild the application page with a Build tab and the project drop target. The Application variant is a whole application page with Overview, Versions, Deployments and a Topology tab built on `TopologyDiagram`, whose staged binds deploy through a `Drawer` and the Edit and Redeploy toast. The version page of a resource is the VersionDetail template and the deploy drawers opened from these pages are the DeployDrawer template (Templates/Platform/Create/DeployDrawer). The Deployments tab of a resource and of a service is the TableView controls row over a deployments table, scoped to the resource (the resource tab adds a small Deployments heading with Documentation and an outlined Deploy action); the service Settings tab is a variant of Templates/Platform/Edit/EditResource. Built from `PageHeader`, `PageTabs`, `Subheader`, `SettingsGroup`, `SettingsRow`, `SaveBar`, `Tabs`, `DataTable`, `EmptyState`, `InputGroupRoot`, `Card`, `DropdownMenu`, `Popover`, `Accordion`, `TopologyDiagram`, `Item`, `Drawer`, `Alert`, `CodeBlock` and `ToggleGroup`; the summary card variants add `Button`, `IconButton`, `Tag`, `StatusIndicator`, `Avatar`, `CopyButton` and `Tooltip`. A page body for ConsoleLayout: the layout owns the rail, the header with the breadcrumb (a service's environment crumb is its `breadcrumbs` slot) and the main.

- Surface: app
- Source: `blocks/detail/detail-resource/detail-resource.vue` in `@aziontech/webkit`
- MCP: `get_block("detail/detail-resource")`
- Components: [Accordion](../../components/accordion.md), [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Button](../../components/button.md), [Card](../../components/card.md), [CodeBlock](../../components/code-block.md), [ConfirmDialog](../../components/confirm-dialog.md), [ConsoleLayout](../../components/console-layout.md), [CopyButton](../../components/copy-button.md), [DataTable](../../components/data-table.md), `DrawerContent`, `DrawerDescription`, [Drawer](../../components/drawer.md), `DrawerTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), `InputGroupRoot`, [Item](../../components/item.md), [Link](../../components/link.md), [PageHeader](../../components/page-header.md), [PageTabs](../../components/page-tabs.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [Popover](../../components/popover.md), [SaveBar](../../components/save-bar.md), [Select](../../components/select.md), [SettingsGroup](../../components/settings-group.md), [SettingsRow](../../components/settings-row.md), [StatusIndicator](../../components/status-indicator.md), [Subheader](../../components/subheader.md), [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md), [TopologyDiagram](../../components/topology-diagram.md), `use-locale`, `use-unsaved-changes`
- Skills: `webkit-layout`, `webkit-navigation`, `webkit-ui-states`

## Asked as

overview page; resource overview; detail page; summary page; application overview; página de visão geral; detalhe do recurso; página de resumo; details page with tabs; versions tab; build tab; detalhe com abas; resource summary; summary card; overview card; resource facts; status card; resumo do recurso; cartão de resumo; visão geral; details page; resource details; página de detalhes; application detail; application tabs; topology tab; deployment topology; detalhe da aplicação; topologia; first deploy; not deployed; connected repository; primeiro deploy; resource overview tabs; service details; policy details

The second-level page of one resource. The user arrives from a list row or a deploy flow to answer three questions about it: where it lives and whether it is serving, what it is made of, and what to do next. The page names the resource in the breadcrumb, splits its concerns into tabs, and opens the Overview tab on one summary card of facts, followed by whatever the resource needs next: Get started for a resource made from the CLI, the production checklist and topology for a service. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header with the breadcrumb, the ⌘K palette and the `main`.

## When to use

- Use detail-resource for the tabbed overview of one resource, service, policy or application.
- A user opens one resource, service, policy or application from its list or from a deploy flow.
- The resource has more than one concern (overview, versions, build, deployments) that each deserve a tab.
- The user needs the live address, the status and the latest deployment of a resource at a glance, with Visit and the resource actions one click away.

## When not to use

- Many resources of one type to compare and filter: use `view/view-table`.
- Editing one version's settings, source or rules: use `detail/detail-version`.
- Changing a resource's settings in a form: use `edit/edit-resource` or `settings/settings-form`.
- One deployment, as it streams in a create flow or on its own page (live, failed, queued): use `detail/detail-deployment-logs`.
- One function run end to end (summary, trace, logs): use `detail/detail-invocations`.
- A key and value list that belongs to the resource: use `detail/detail-dns-zone`.

## Building blocks

### A. Tab bar — `PageTabs`, `Tabs`, `EmptyState` (required)

A full-bleed `PageTabs` with one `Tabs.Trigger` per concern: Overview, Versions, Build, Deployments, first in the body and in a `sticky top-0` wrapper on the canvas fill, so it stays in view while the layout's content region scrolls the tab under it. On a tabbed page the primary action (an outlined Deploy) sits on the tab row at medium size. Each tab is its own route: a variant renders the open tab's panel (Application renders all of its panels), and a tab whose panel lives on another route shows an `EmptyState` with an Open link to it, so no tab is dead.

### B. Summary subject band — `Card`, `Tooltip`, `Button`, `DropdownMenu`, `IconButton` (required)

`Card :padded="false"` opens the tab. Its first band holds the resource glyph and its primary link, the live address that opens in a new tab and is named by a `Tooltip`, then a secondary Visit `Button` that opens the same address in a new tab (`href`, `target="_blank"`) and an outlined Resource actions `IconButton` that opens a `DropdownMenu` placed `bottom-end` with Copy URL and, in its own group, Settings.

### C. Summary facts band — `Link`, `Tag`, `StatusIndicator`, `Avatar`, `Tooltip` (required)

A grid of label and value pairs, one column below `sm` so no value runs into the next: Deployment (the ID as a small `Link` with a Production `Tag`), Domains, Status as a `StatusIndicator`, Created as a relative time with the author `Avatar`, Source and Framework. Each label is a small muted span over its value; links carry a `Tooltip` that says where they go. A service adds custom domains (with a transparent small `IconButton`, Add a custom domain, inside a `Tooltip`), environments and its ID with a `CopyButton`; a policy adds its rules and modules.

### D. Summary state band — `Button` (optional)

The last band, on the canvas fill, says what the user can do next in one sentence and ends on an outlined Documentation `Button`, e.g. how to deploy to production for a resource with nothing deployed.

### E. Get started — `Subheader`, `ToggleGroup`, `Card`, `CodeBlock` (optional)

For a resource made from the CLI, the `detail/detail-get-started` section follows the summary: a `Subheader` with the CLI or GitHub Actions `ToggleGroup`, then three numbered step `Card`s with a `CodeBlock` each.

## Breadcrumb and environment

- The trail is in the layout's header: `breadcrumbs` from the route meta (`module › resource name`, e.g. Resources › analytics-app), or the page's own `ConsoleLayout.Breadcrumb`. A page body never renders `Breadcrumb`, `AppHeader` or a `<main>`.
- A service ends the trail on its environment. That crumb is a control, so the page sets the trail itself: `ConsoleLayout.Breadcrumb` with the module and the service as `items` and, in its default slot, a `Select` with `variant="ghost"` and `size="small"` (no `w-full`: it sizes to its value like a crumb), labelled `Switch environment`, with a search `Input`, each environment tagged with its deployment policy and Add Environment at its foot. The environment is part of the route, so picking one navigates and the page reads it. ServiceOverview and `shell/shell-console` (DetailPage) show it.
- The layout hides its breadcrumbs while compact, so below md the service summary's Deployment Settings band carries its own environment menu.

## Topology tab

- Use `TopologyDiagram` for the path a request takes to the resource (Application and ServiceOverview both do). A pick from a node's bind menu is pending on the node until its Apply control confirms it (Cancel or Escape drops it); only the confirmed `bind`, a change or a removal is staged on the node, counted beside Deploy and listed in the deploy `Drawer`; the run ends in the state-async-submit toast with Edit and Redeploy. A detail-production-checklist step that binds a slot (Bind Policy, Bind Error Page) scrolls to the topology and expands that node instead of opening a separate form.
- Bind, create and remove act on staged state only. Nothing reaches Production until Deploy, and the deploy drawer lists every staged change before it runs.
- Show the staged count on the tab row next to Deploy, so it stays visible from every tab.
- Report the deploy through the state-async-submit toast (Edit and Redeploy) and clear the staged marks once it succeeds.
- A node that collects many resources adds to itself through the diagram's `actions` slot: the Domains node of ServiceOverview carries an outlined small `IconButton` (`az az-plus`) named Add domain inside a `Tooltip`, picked by `node.key === 'domains'`. Never hand-draw a node card to get the `+`.

## Data

The primary (ResourceOverview) takes the resource through a prop, owns the open tab as a model and emits its actions; it fetches nothing. `ResourceDetailResource`, `ResourceDetailTab` and `ResourceDetailProps` are exported from `detail-resource.vue`, and `sample.ts` holds the sample resource the block renders when `resource` is left out. The other variants are whole screens of their own (a service, a policy, an application with working tabs) and keep their own records.

| Prop / model  | Type                     | What it does                                                                                                     |
| ------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `resource`    | `ResourceDetailResource` | The summary: address, deployment and environment, status, creation, framework; its `name` builds the tab routes. |
| `v-model:tab` | `ResourceDetailTab`      | The open tab (`overview` by default); a route-driven page binds it to the route.                                 |

| Event                | Payload          | When                                                        |
| -------------------- | ---------------- | ----------------------------------------------------------- |
| `resource-action`    | `(event, value)` | Copy URL (`copy-url`) or Settings (`settings`) in the menu. |
| `connect-repository` | `(event)`        | Connect Git repository under Source.                        |

To go live, render the block from a page that owns the request and the route:

```vue
<script setup lang="ts">
  import DetailResource, { type ResourceDetailTab } from './detail-resource.vue'

  const route = useRoute()
  const router = useRouter()
  const { data } = useResource(route.params.id)
  const tab = computed({
    get: () => (route.params.tab ?? 'overview') as ResourceDetailTab,
    set: (next) => router.push(`/resources/${route.params.id}/${next}`)
  })
</script>

<template>
  <DetailResource
    v-if="data"
    v-model:tab="tab"
    :resource="data"
    @connect-repository="router.push(`/resources/${route.params.id}/build`)"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep the content in `layout-column` with its boundary inset, and let the tab bar run full-bleed above it.
- Open the Overview tab on the summary card; every other section of the tab comes after it.
- Name the resource in the breadcrumb, not in a `PageHeader` title above the card.
- Put the one primary page action (Deploy) on the tab row, medium and outlined; keep Visit in the summary.
- Give Versions and Deployments the same table shape as `view/view-table`, scoped to this resource, with a small section heading, pages of 10 and an `EmptyState` for none yet.
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so this page body never renders a `Toaster`.

## Don't

- Don't put the tab name in the breadcrumb, or repeat the resource name as a large heading.
- Don't add a second primary button to the tab row or the summary card.
- Don't spread the facts across several cards; one summary card holds them in bands.
- Don't hide the live address behind the actions menu; it is the card's primary link.
- Don't render empty facts as blank space; show the action that fills them, e.g. Connect Git repository under Source, or a muted word (None, Not deployed) when nothing can fill them yet.
- Don't show Visit for a resource that has no address yet.

## Copy

- **Breadcrumb:** module, then the resource name as created, e.g. "Resources" › "analytics-app".
- **Tabs:** one or two nouns, e.g. "Overview", "Versions", "Build", "Deployments".
- **Fact labels:** a short noun, sentence case, no colon, e.g. "Deployment", "Domains", "Status", "Created", "Source", "Framework".
- **Created:** relative time and author, e.g. "2 weeks ago by John Smith".
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

Grouped by the resource type the page shows. A deployment's own page is `detail/detail-deployment-logs` (DeploymentDetail, DeploymentError, DeploymentQueued) and one function invocation is `detail/detail-invocations`.

### Resource

- ResourceOverview: the Overview tab of a resource made from the CLI (`resource`, `tab` is `overview`), the summary card followed by Get started; any other `tab` shows the Open link to its own route.
- Resource: the summary card alone, in its resource shape.
- FirstDeploy: the summary cards before and during the first deploy. A resource never deployed shows Not deployed yet in place of the address, None, Not deployed and Not yet as muted values, Connect Git repository and Project upload under Source, and no Visit; a service on its first deploy reads Deploying · Build with a loading `StatusIndicator`, and one that serves nothing reads Inactive.
- ResourceVersions: the Versions tab, a small Versions heading with Add Version over the controls row and the versions table.
- ResourceBuild: the Build tab, the Git repository, Build configuration and Deployment bands, with a save bar once a command changes.
- ResourceBuildConnected: the Build tab of a resource with a connected repository, its link and a danger Disconnect, the Production branch and Preview branch rows, the Build configuration and Deployment bands, and the save bar once a value changes.

### Service

- Service: the service summary with its domains, environment menu, ID and the Deployment Settings band.
- ServiceOverview: a service (its environment crumb is the page's `ConsoleLayout.Breadcrumb`), Deploy on the tab row, the production checklist and the deployment topology on `TopologyDiagram` (policy, error page and origin slots staged until Deploy).

### Policy

- Policy: the policy summary with the resource it protects, a Rules shortcut, its status, environment, rule count and modules.

### Application

- Application: a whole application page body, with working tabs. Overview is the summary card; Versions and Deployments are a small `Subheader` over a flush `DataTable`; Topology draws the request path with `TopologyDiagram` (domain, workload, firewall, application, function instance). Binding or removing the firewall or the function only stages the change: the node turns dashed with a Staged status, a polite status line names it, and the tab row shows the count as a warning `Tag` beside Deploy. Deploy opens a `Drawer` that lists each staged change as from and to, then runs on its own: a loading toast, then the state-async-submit toast with **Edit** (back to the Topology tab) and **Redeploy**, never View deployments.
- ApplicationBuild: an application page body with Overview, Versions, Build and Deployments. Dragging files over the page raises the dashed drop target of `state/state-project-intake`; dropping them or Deploy opens a deploy `Drawer` naming the source, and the run reports through the state-async-submit toast with Edit and Redeploy. Leaving the Build tab with unsaved changes asks first in a `ConfirmDialog`.

## Related

- `view/view-table` — the list a row of which leads here.
- `detail/detail-get-started` — the section that follows the summary for a resource made from the CLI.
- `detail/detail-production-checklist` — the card on a service overview.
- `detail/detail-deployment-logs` — a deployment's own page, and the steps a create flow streams.
- `detail/detail-version` — where a row of the Versions tab leads.
- `create/create-deploy-drawer` — the drawer the Deploy action opens.
- `state/state-project-intake` — the drop target an application page raises while files hover over it.
- `detail/detail-invocations` — the page an invocation summary opens, with its request path, trace and logs; it owns the invocation summary card.
- `edit/edit-resource` — the service Settings tab.
- `shell/shell-console` — the `ConsoleLayout` this page body renders in; see `skills/webkit-navigation` and `skills/webkit-layout`.

## Variants

- `ResourceOverview` — primary (the code below)
- `Resource` — The summary card that opens a resource Overview tab: a subject band with the primary link and the actions, a band of labelled facts, and a state band on the canvas fill. It comes in three shapes — a resource, a service with its domains and environments, and a policy — each with its own facts and copy. Built from `Card`, `Button`, `IconButton`, `DropdownMenu`, `Popover`, `Tag`, `StatusIndicator`, `Avatar`, `CopyButton`, `Accordion`, `Alert` and `Tooltip`.
- `Service` — The service summary: the domain with its aliases in the overflow popover, the environment menu (shown below md only; from md up the breadcrumb carries the environment) and actions, the custom domains, status, service ID and creation, and the shared Deployment Settings band that expands into its policies.
- `Policy` — The policy summary: the resource it protects, a Rules shortcut and actions, then status, environment, rule count, last edit and the enabled modules, and what the policy inspects.
- `ResourceVersions` — The Versions tab of the same resource: the small Versions heading with Add Version, the controls row (Filter, search, Refresh, Download CSV, Columns) and the paginated versions table, each row with its code-set name and Latest mark, the comment, the state Tag, who built it and when, and the Open configuration or Deploy actions.
- `ResourceBuild` — The Build tab of a resource made from the CLI: the small Build heading with an outlined Deploy, the Git repository band holding the Connect Git repository card, the Build configuration band with the read-only framework preset and the build and deploy commands, and the Deployment band with the API token. Editing a command raises the save bar.
- `ServiceOverview` — A service (its environment crumb is a transparent small select the page sets with `ConsoleLayout.Breadcrumb`): the outlined Deploy action sits on the tab row, the summary carries its Deployment Settings band (its own environment menu shows only below md, where the layout hides the breadcrumb), the production checklist expands into a drawer, and the deployment topology is a `TopologyDiagram` from domains to storage, whose Domains node adds a domain from its `actions` slot: Policy, Error Page and Origin are bindable slots whose changes are staged, counted beside Deploy and listed in the deploy drawer, ending in the toast with Edit and Redeploy.
- `Application` — An application page body with working tabs: Overview (the summary card with the live address, Visit and actions, the deployment, status, active version, framework, source and creation facts, and a band that sends settings changes to the active version), Versions and Deployments (a small `Subheader` over a `DataTable` each), and Topology, where `TopologyDiagram` draws domain, workload, firewall, application and function instance. Binding or removing a firewall or function is staged: the tab row counts the changes in a warning `Tag`, Deploy opens a `Drawer` listing them, and the run reports through the state-async-submit toast with Edit (back to Topology) and Redeploy.
- `FirstDeploy` — The summary cards before and during the first deploy: a resource never deployed (Not deployed yet in place of the address, None for Deployment and Domains, Not deployed as its status, Not yet as its creation, Connect Git repository and Project upload under Source, and the state band naming the three ways to deploy), then two service cards whose Status reads Deploying · Build with a loading `StatusIndicator`, and Inactive.
- `ResourceBuildConnected` — The Build tab of a resource with a connected repository: the Git repository band holds the repository link with a danger Disconnect and the Production branch and Preview branch rows, then the Build configuration and Deployment bands. Editing a branch or a command raises the save bar.
- `ApplicationBuild` — An application page body with the Overview, Versions, Build and Deployments tabs and no topology: the Overview summary says every push to the production branch deploys and that a project can be dropped on the page; dragging files over the page raises the dashed state-project-intake drop target, and dropping them (or Deploy on the tab row) opens a deploy `Drawer` that names the source and runs through the state-async-submit toast with Edit and Redeploy. The Build tab edits the connected repository branches and the build commands behind a save bar, and leaving it with unsaved changes asks first in a `ConfirmDialog` (`useUnsavedChanges`).

Each variant is the same screen in another state: `get_block("detail/detail-resource", { variant })`, or the file under `blocks/detail/detail-resource/variants/`.

## Code (`ResourceOverview`)

```vue
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeBlock from '@aziontech/webkit/code-block'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Link from '@aziontech/webkit/link'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Subheader from '@aziontech/webkit/subheader'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  import { sampleResource } from './sample'

  /** A tab of the resource page. */
  export type ResourceDetailTab = 'overview' | 'versions' | 'build' | 'deployments'

  /** The resource the page shows. */
  export interface ResourceDetailResource {
    /** Slug name, used in the tab routes and the CLI link command. */
    name: string
    /** The live address, without the scheme; Visit and both address links open it. */
    domain: string
    /** The deployment that serves the address, linked to its page. */
    deploymentId: string
    /** The environment of that deployment, shown as a tag. */
    environment: string
    /** The status label. */
    status: string
    /** The status color. */
    statusSeverity: StatusIndicatorSeverity
    /** When the resource was created, shown as a relative time. */
    createdAt: Date
    /** Who created it, shown with an avatar. */
    createdBy: string
    /** The framework preset label. */
    framework: string
    /** The framework icon class, a colored icon such as az-color az-nextjs. */
    frameworkIcon: string
  }

  export interface ResourceDetailProps {
    /** The resource the page shows. Left out, the sample renders. */
    resource?: ResourceDetailResource
  }

  const props = withDefaults(defineProps<ResourceDetailProps>(), {
    resource: undefined
  })

  const emit = defineEmits<{
    'resource-action': [
      event: globalThis.MouseEvent | globalThis.KeyboardEvent,
      value: DropdownMenuItemValue
    ]
    'connect-repository': [event: MouseEvent]
  }>()

  const activeTab = defineModel<ResourceDetailTab>('tab', { default: 'overview' })

  const resource = computed<ResourceDetailResource>(() => props.resource ?? sampleResource)
  const address = computed(() => `https://${resource.value.domain}`)

  const { formatRelativeTime } = useLocale()
  const created = computed(
    () => `${formatRelativeTime(resource.value.createdAt)} by ${resource.value.createdBy}`
  )

  const tabs: { value: ResourceDetailTab; label: string }[] = [
    { value: 'overview', label: 'Overview' },
    { value: 'versions', label: 'Versions' },
    { value: 'build', label: 'Build' },
    { value: 'deployments', label: 'Deployments' }
  ]

  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')

  const PATHS = [
    { label: 'CLI', value: 'cli' },
    { label: 'GitHub Actions', value: 'actions' }
  ]

  const cliSteps = computed(() => [
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
  --name ${resource.value.name}`
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
  ])

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
  const steps = computed(() => (path.value === 'actions' ? ACTIONS_STEPS : cliSteps.value))
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Trigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </PageTabs>
    </div>

    <div
      v-if="activeTab === 'overview'"
      class="relative flex min-h-0 flex-1 flex-col"
    >
      <section class="min-h-0 flex-1">
        <div class="flex min-h-full flex-col">
          <div class="layout-column layout-boundary flex min-w-0 flex-col">
            <section
              class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap) pb-(--layout-section-gap)"
            >
              <Card :padded="false">
                <template #default>
                  <div
                    class="@container/band flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)"
                  >
                    <div
                      class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)"
                    >
                      <i
                        class="az az-globe shrink-0 text-body-lg text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <div class="flex min-w-0">
                        <Tooltip
                          :content="`Open ${resource.domain} in a new tab`"
                          class="w-full"
                        >
                          <a
                            :href="address"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-link
                            class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                          >
                            <span class="truncate underline-offset-2 group-hover/link:underline">{{
                              resource.domain
                            }}</span>
                            <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                            <i
                              class="az az-external-link shrink-0 text-body-xs leading-none"
                              aria-hidden="true"
                            />
                          </a>
                        </Tooltip>
                      </div>
                    </div>

                    <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
                      <Button
                        label="Visit"
                        :href="address"
                        target="_blank"
                        variant="secondary"
                        size="medium"
                        icon="az az-external-link"
                      />

                      <DropdownMenu
                        side="bottom"
                        align="end"
                        @select="(event, value) => emit('resource-action', event, value)"
                      >
                        <DropdownMenu.Trigger>
                          <Tooltip content="Resource actions">
                            <IconButton
                              icon="az az-ellipsis"
                              variant="outline"
                              size="medium"
                              aria-label="Resource actions"
                            />
                          </Tooltip>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Group>
                          <DropdownMenu.Item
                            value="copy-url"
                            label="Copy URL"
                          >
                            <template #leading>
                              <i
                                class="az az-copy"
                                aria-hidden="true"
                              />
                            </template>
                          </DropdownMenu.Item>
                        </DropdownMenu.Group>

                        <DropdownMenu.Group>
                          <DropdownMenu.Item
                            value="settings"
                            label="Settings"
                          >
                            <template #leading>
                              <i
                                class="az az-settings"
                                aria-hidden="true"
                              />
                            </template>
                          </DropdownMenu.Item>
                        </DropdownMenu.Group>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div
                    class="@container/band border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) grid grid-cols-1 gap-(--spacing-sm) sm:grid-cols-3 lg:grid-cols-6"
                  >
                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
                      <span class="text-label-sm text-(--text-muted)">Deployment</span>
                      <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                        <div class="flex min-w-0">
                          <Tooltip
                            :content="`Open ${resource.deploymentId} in Deployments`"
                            class="w-full"
                          >
                            <Link
                              :label="resource.deploymentId"
                              :href="`/deployments/${resource.deploymentId}`"
                              size="small"
                            />
                          </Tooltip>
                        </div>
                        <Tag
                          :label="resource.environment"
                          severity="neutral"
                          size="small"
                          class="shrink-0"
                        />
                      </div>
                    </div>

                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
                      <span class="text-label-sm text-(--text-muted)">Domains</span>
                      <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                        <div class="flex min-w-0">
                          <Tooltip
                            :content="`Open ${resource.domain} in a new tab`"
                            class="w-full"
                          >
                            <a
                              :href="address"
                              target="_blank"
                              rel="noopener noreferrer"
                              data-link
                              class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                            >
                              <span
                                class="truncate underline-offset-2 group-hover/link:underline"
                                >{{ resource.domain }}</span
                              >
                              <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                              <i
                                class="az az-external-link shrink-0 text-body-xs leading-none"
                                aria-hidden="true"
                              />
                            </a>
                          </Tooltip>
                        </div>
                      </div>
                    </div>

                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
                      <span class="text-label-sm text-(--text-muted)">Status</span>
                      <div class="flex min-h-7 min-w-0 items-center">
                        <StatusIndicator
                          :severity="resource.statusSeverity"
                          :label="resource.status"
                        />
                      </div>
                    </div>

                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
                      <span class="text-label-sm text-(--text-muted)">Created</span>
                      <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                        <span class="truncate text-body-sm text-(--text-default)">
                          {{ created }}
                        </span>
                        <Avatar
                          :alt="resource.createdBy"
                          :label="resource.createdBy"
                          size="small"
                          variant="square"
                          class="shrink-0"
                        />
                      </div>
                    </div>

                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
                      <span class="text-label-sm text-(--text-muted)">Source</span>
                      <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-sm)">
                        <Button
                          variant="link"
                          label="Connect Git repository"
                          @click="(event: MouseEvent) => emit('connect-repository', event)"
                        />
                      </div>
                    </div>

                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
                      <span class="text-label-sm text-(--text-muted)">Framework</span>
                      <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                        <i
                          :class="resource.frameworkIcon"
                          class="shrink-0 text-body-lg"
                          aria-hidden="true"
                        />
                        <span class="truncate text-body-sm text-(--text-default)">
                          {{ resource.framework }}
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
                      To deploy to Production, drop your project anywhere on this page, connect Git,
                      or run
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
                        variant="outline"
                        size="medium"
                        icon="az az-book"
                        href="https://example.com/docs/cli"
                        target="_blank"
                      />
                    </div>
                  </div>
                </template>
              </Card>

              <div class="@container flex min-w-0 flex-col gap-(--spacing-md)">
                <Subheader title="Get started">
                  <template #description>
                    Two ways to build and deploy this resource. Select one and follow the steps, or
                    read the
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
                </Subheader>

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
                        <template #default>
                          <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-lg)">
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
                            <div class="mt-(--spacing-2xs) min-w-0">
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
    <div
      v-else
      class="relative flex min-h-0 flex-1 flex-col"
    >
      <div class="layout-column layout-boundary flex min-w-0 flex-col">
        <div class="layout-section-start">
          <EmptyState
            size="medium"
            icon="az az-external-link"
            :title="tabLabel"
            :description="`${tabLabel} opens on its own page.`"
          >
            <template #actions>
              <Button
                :label="`Open ${tabLabel}`"
                variant="outline"
                size="small"
                :href="`/resources/${resource.name}/${activeTab}`"
              />
            </template>
          </EmptyState>
        </div>
      </div>
    </div>
  </div>
</template>
```

## `sample.ts`

```ts
import type { ResourceDetailResource } from './detail-resource.vue'

const referenceTime = Date.UTC(2026, 10, 10, 12)

export const sampleResource: ResourceDetailResource = {
  name: 'analytics-app',
  domain: 'analytics-app-z1x2c3.example.com',
  deploymentId: '1213275262',
  environment: 'Production',
  status: 'Ready',
  statusSeverity: 'success',
  createdAt: new Date(referenceTime - 14 * 86_400_000),
  createdBy: 'John Smith',
  framework: 'Next.js',
  frameworkIcon: 'az-color az-nextjs'
}
```
