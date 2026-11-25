# DetailResource (`detail/detail-resource`)

> The Overview tab of a resource detail page: the full-bleed tab bar, sticky while the layout scrolls, then the column that opens on the resource summary card. The resource overview follows it with Get started for a resource made from the CLI, and the same page plots its Versions tab (the versions table) and its Build tab (repository, build configuration and token bands); the service overview follows the summary with the production checklist and the deployment topology. The summary card on its own, in its resource, service and policy shapes, is the Resource, Service and Policy variants: a subject band with the primary link and the actions, a band of labelled facts, and a state band on the canvas fill. A deployment's own page (success, failure, queued) is the `detail/detail-deployment-logs` block and one function run is the `detail/detail-invocations` block. The FirstDeploy variant draws the summary cards before and during the first deploy, ResourceBuildConnected the Build tab with a connected repository, and ApplicationBuild the application page with a Build tab and the project drop target. The Application variant is a whole application page with Overview, Versions, Deployments and a Topology tab built on `FlowDiagram`, whose staged binds deploy through a `Drawer` and the Edit and Redeploy toast. The version page of a resource is the `detail/detail-version` block and the deploy drawers opened from these pages are the `create/create-deploy-drawer` block. The Deployments tab of a resource and of a service is the TableView controls row over a deployments table, scoped to the resource (the resource tab adds a small Deployments heading with Documentation and an outlined Deploy action); the service Settings tab is a variant of `edit/edit-resource`. Built from `PageHeader`, `PageTabs`, `Subheader`, `SettingsGroup`, `SettingsRow`, `SaveBar`, `Tabs`, `DataTable`, `EmptyState`, `PasswordInput`, `Card`, `DropdownMenu`, `Popover`, `Accordion`, `FlowDiagram`, `Item`, `Drawer`, `Alert`, `CodeBlock` and `ToggleGroup`; the summary card variants add `Button`, `IconButton`, `Tag`, `StatusIndicator`, `Avatar`, `CopyButton` and `Tooltip`. A page body for ConsoleLayout: the layout owns the rail, the header with the breadcrumb (a service's environment crumb is its `breadcrumbs` slot) and the main.

- Surface: app
- Source: `blocks/detail/detail-resource/detail-resource.vue` in `@aziontech/webkit`
- MCP: `get_block("detail/detail-resource")`
- Components: [Accordion](../../components/accordion.md), [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Button](../../components/button.md), [Card](../../components/card.md), [CodeBlock](../../components/code-block.md), [ConfigProvider](../../components/config-provider.md), [ConfirmDialog](../../components/confirm-dialog.md), [ConsoleLayout](../../components/console-layout.md), [CopyButton](../../components/copy-button.md), [DataTable](../../components/data-table.md), `DataTablePagination`, `DrawerContent`, `DrawerDescription`, [Drawer](../../components/drawer.md), `DrawerTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), `FlowDiagramBind`, [FlowDiagram](../../components/flow-diagram.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [Item](../../components/item.md), [Kbd](../../components/kbd.md), [Link](../../components/link.md), [PageHeader](../../components/page-header.md), [PageTabs](../../components/page-tabs.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [PasswordInput](../../components/password-input.md), [Popover](../../components/popover.md), [SaveBar](../../components/save-bar.md), [Select](../../components/select.md), [SettingsGroup](../../components/settings-group.md), [SettingsRow](../../components/settings-row.md), [StatusIndicator](../../components/status-indicator.md), [Subheader](../../components/subheader.md), `TableCellLink`, `TableCellTime`, [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md), `use-collection`, `use-locale`, `use-unsaved-changes`
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

### B. Summary subject band — `Card`, `TableCellLink`, `Button`, `DropdownMenu`, `IconButton` (required)

`Card :padded="false"` opens the tab. Its first band holds the resource glyph and its primary link, the live address as a `TableCellLink`, which opens it in a new tab and names it in its tooltip, then a secondary Visit `Button` that opens the same address in a new tab (`href`, `target="_blank"`) and an outlined Resource actions `IconButton` that opens a `DropdownMenu` placed `bottom-end` with Copy URL and, in its own group, Settings.

### C. Summary facts band — `Link`, `Tag`, `StatusIndicator`, `Avatar`, `Tooltip` (required)

A grid of label and value pairs, one column below `sm` so no value runs into the next: Deployment (the ID as a small `Link` with a Production `Tag`), Domains, Status as a `StatusIndicator`, Created as a relative time with the author `Avatar`, Source and Framework. Each label is a small muted span over its value; links are `TableCellLink`s, whose tooltip says where they go. A service adds custom domains (with a transparent small `IconButton`, Add a custom domain, inside a `Tooltip`), environments and its ID with a `CopyButton`; a policy adds its rules and modules.

### D. Summary state band — `Button` (optional)

The last band, on the canvas fill, says what the user can do next in one sentence and ends on an outlined Documentation `Button`, e.g. how to deploy to production for a resource with nothing deployed.

### E. Get started — `Subheader`, `ToggleGroup`, `Card`, `CodeBlock` (optional)

For a resource made from the CLI, the `detail/detail-get-started` section follows the summary: a `Subheader` with the CLI or GitHub Actions `ToggleGroup`, then three numbered step `Card`s with a `CodeBlock` each.

## Breadcrumb and environment

- The trail is in the layout's header: `breadcrumbs` from the route meta (`module › resource name`, e.g. Resources › analytics-app), or the page's own `ConsoleLayout.Breadcrumb`. A page body never renders `Breadcrumb`, `AppHeader` or a `<main>`.
- A service ends the trail on its environment. That crumb is a control, so the page sets the trail itself: `ConsoleLayout.Breadcrumb` with the module and the service as `items` and, in its default slot, a `Select` with `variant="ghost"` and `size="small"` (no `w-full`: it sizes to its value like a crumb), labelled `Switch environment`, with a search `Input`, each environment tagged with its deployment policy and Add Environment at its foot. The environment is part of the route, so picking one navigates and the page reads it. ServiceOverview and `shell/shell-console` (DetailPage) show it.
- The layout hides its breadcrumbs while compact, so below md the service summary's Deployment Settings band carries its own environment menu.

## Topology tab

- Use `FlowDiagram` (`nodes` + `edges`, with `FlowDiagramBind` in its `actions` slot) for the path a request takes to the resource (Application and ServiceOverview both do). A pick from a node's bind menu is pending on the node until its Apply control confirms it (Cancel or Escape drops it); only the confirmed `bind`, a change or a removal is staged on the node, counted beside Deploy and listed in the deploy `Drawer`; the run ends in the state-async-submit toast with Edit and Redeploy. A detail-production-checklist step that binds a slot (Bind Policy, Bind Error Page) scrolls to the topology and expands that node instead of opening a separate form.
- Bind, create and remove act on staged state only. Nothing reaches Production until Deploy, and the deploy drawer lists every staged change before it runs.
- Show the staged count on the tab row next to Deploy, so it stays visible from every tab.
- Report the deploy through the state-async-submit toast (Edit and Redeploy) and clear the staged marks once it succeeds.
- A node that collects many resources adds to itself through the diagram's `actions` slot: the Domains node of ServiceOverview carries an outlined small `IconButton` (`az az-plus`) named Add domain inside a `Tooltip`, picked by `node.key === 'domains'`. Never hand-draw a node card to get the `+`.

## Data

The primary (ResourceOverview) takes the resource through a prop, owns the open tab as a model and emits its actions; it fetches nothing. `ResourceDetailResource`, `ResourceDetailTab` and `ResourceDetailProps` are exported from `detail-resource.vue`, and `sample.ts` holds the sample resource the block renders when `resource` is left out. The other variants are whole screens of their own (a service, a policy, an application with working tabs); their records are in `sample.ts` too.

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
- The page names itself with a visually hidden `h1` of the resource name (the layout's breadcrumb shows it), so the tab panels' headings sit under it.
- The tab bar is a tablist; arrow keys move between tabs and the active tab is announced.
- Links that open a new tab add "(opens in a new tab)" in visually hidden text; decorative icons are `aria-hidden`.
- Every icon-only button has an `aria-label` and a `Tooltip` with the same words, e.g. "Resource actions", "Add domain".
- Status uses a `StatusIndicator` with a text label, never color alone.
- In the build variants (Application build, Resource build, Resource build connected), `⌘ S` (`Ctrl S` off Apple) saves while the `SaveBar` shows unsaved changes, the same as Save; with no changes it does nothing. Save carries `aria-keyshortcuts` and a `Kbd` keycap.

## States

Grouped by the resource type the page shows. A deployment's own page is `detail/detail-deployment-logs` (DeploymentDetail, DeploymentError, DeploymentQueued) and one function invocation is `detail/detail-invocations`.

### Resource

- ResourceOverview: the Overview tab of a resource made from the CLI (`resource`, `tab` is `overview`), the summary card followed by Get started; any other `tab` shows the Open link to its own route.
- Resource: the summary card alone, in its resource shape.
- NoDeployment: the same page for a resource never deployed (`deploymentId: ''`): the summary reads Not deployed yet in place of the address, with None, None and Not deployed as muted values and no Visit.
- FirstDeploy: the summary cards before and during the first deploy. A resource never deployed shows Not deployed yet in place of the address, None, Not deployed and Not yet as muted values, Connect Git repository and Project upload under Source, and no Visit; a service on its first deploy reads Deploying · Build with a loading `StatusIndicator`, and one that serves nothing reads Inactive.
- ResourceVersions: the Versions tab, a small Versions heading with Add Version over the controls row and the versions table.
- ResourceBuild: the Build tab, the Git repository, Build configuration and Deployment bands, with a save bar once a command changes.
- ResourceBuildConnected: the Build tab of a resource with a connected repository, its link and a danger Disconnect, the Production branch and Preview branch rows, the Build configuration and Deployment bands, and the save bar once a value changes.

### Service

- Service: the service summary with its domains, environment menu, ID and the Deployment Settings band.
- ServiceOverview: a service (its environment crumb is the page's `ConsoleLayout.Breadcrumb`), Deploy on the tab row, the production checklist and the deployment topology on `FlowDiagram` (policy, error page and origin slots staged until Deploy).

### Policy

- Policy: the policy summary with the resource it protects, a Rules shortcut, its status, environment, rule count and modules.

### Application

- Application: a whole application page body, with working tabs. Overview is the summary card; Versions and Deployments are a small `Subheader` over a flush `DataTable`; Topology draws the request path with `FlowDiagram` (domain, workload, firewall, application, function instance). Binding or removing the firewall or the function only stages the change: the node turns dashed with a Staged status, a polite status line names it, and the tab row shows the count as a warning `Tag` beside Deploy. Deploy opens a `Drawer` that lists each staged change as from and to, then runs on its own: a loading toast, then the state-async-submit toast with **Edit** (back to the Topology tab) and **Redeploy**, never View deployments.
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
- `ServiceOverview` — A service (its environment crumb is a transparent small select the page sets with `ConsoleLayout.Breadcrumb`): the outlined Deploy action sits on the tab row, the summary carries its Deployment Settings band (its own environment menu shows only below md, where the layout hides the breadcrumb), the production checklist expands into a drawer, and the deployment topology is a `FlowDiagram` from domains to storage, whose Domains node adds a domain from its `actions` slot: Policy, Error Page and Origin are bindable slots whose changes are staged, counted beside Deploy and listed in the deploy drawer, ending in the toast with Edit and Redeploy.
- `Application` — An application page body with working tabs: Overview (the summary card with the live address, Visit and actions, the deployment, status, active version, framework, source and creation facts, and a band that sends settings changes to the active version), Versions and Deployments (a small `Subheader` over a `DataTable` each), and Topology, where `FlowDiagram` draws domain, workload, firewall, application and function instance. Binding or removing a firewall or function is staged: the tab row counts the changes in a warning `Tag`, Deploy opens a `Drawer` listing them, and the run reports through the state-async-submit toast with Edit (back to Topology) and Redeploy.
- `NoDeployment` — The Overview of a resource that was created but never deployed: the summary reads Not deployed yet in place of the address, None for Deployment and Domains, Not deployed as its status and no Visit, the state band names the three ways to deploy (drop the project, connect Git, or the CLI), and Get started follows.
- `FirstDeploy` — The summary cards before and during the first deploy: a resource never deployed (Not deployed yet in place of the address, None for Deployment and Domains, Not deployed as its status, Not yet as its creation, Connect Git repository and Project upload under Source, and the state band naming the three ways to deploy), then two service cards whose Status reads Deploying · Build with a loading `StatusIndicator`, and Inactive.
- `ResourceBuildConnected` — The Build tab of a resource with a connected repository: the Git repository band holds the repository link with a danger Disconnect and the Production branch and Preview branch rows, then the Build configuration and Deployment bands. Editing a branch or a command raises the save bar.
- `ApplicationBuild` — An application page body with the Overview, Versions, Build and Deployments tabs and no topology: the Overview summary says every push to the production branch deploys and that a project can be dropped on the page; dragging files over the page raises the dashed state-project-intake drop target, and dropping them (or Deploy on the tab row) opens a deploy `Drawer` that names the source and runs through the state-async-submit toast with Edit and Redeploy. The Build tab edits the connected repository branches and the build commands behind a save bar, and leaving it with unsaved changes asks first in a `ConfirmDialog` (`useUnsavedChanges`).

Each variant is the same screen in another state: `get_block("detail/detail-resource", { variant })`, or the file under `blocks/detail/detail-resource/variants/`.

## Code (`ResourceOverview`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed } from 'vue'

  import ResourceGetStarted from './parts/resource-get-started.vue'
  import ResourceSummaryCard from './parts/resource-summary-card.vue'
  import ResourceTabBar from './parts/resource-tab-bar.vue'
  import TabRouteEmpty from './parts/tab-route-empty.vue'
  import { resourceTabs, sampleResource } from './sample'

  /** A tab of the resource page. */
  export type ResourceDetailTab = 'overview' | 'versions' | 'build' | 'deployments'

  /** The resource the page shows. */
  export interface ResourceDetailResource {
    /** Slug name, used in the tab routes and the CLI link command. */
    name: string
    /** The live address, without the scheme; Visit and both address links open it. */
    domain: string
    /** The deployment that serves the address, linked to its page; empty when it was never deployed, which shows the Not deployed yet state. */
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

  const { formatRelativeTime } = useLocale()
  const created = computed(
    () => `${formatRelativeTime(resource.value.createdAt)} by ${resource.value.createdBy}`
  )

  const tabLabel = computed(
    () => resourceTabs.find((tab) => tab.value === activeTab.value)?.label ?? ''
  )
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <h1 class="sr-only">{{ resource.name }}</h1>
    <ResourceTabBar
      v-model="activeTab"
      :tabs="resourceTabs"
    />

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
              <ResourceSummaryCard
                :resource="resource"
                :created="created"
                @action="(event, value) => emit('resource-action', event, value)"
              >
                <template #source>
                  <Button
                    variant="link"
                    label="Connect Git repository"
                    @click="(event: MouseEvent) => emit('connect-repository', event)"
                  />
                </template>
                <p
                  class="min-w-0 flex-1 basis-(--container-2xs) text-pretty text-body-sm text-(--text-muted)"
                >
                  To deploy to Production,
                  <span class="hidden pointer-fine:inline"
                    >drop your project anywhere on this page,
                  </span>
                  connect Git, or run
                  <code class="font-(family-name:--font-code) text-body-sm text-(--text-default)"
                    >platform deploy</code
                  >
                  via the CLI.
                </p>
              </ResourceSummaryCard>

              <ResourceGetStarted :name="resource.name" />
            </section>
          </div>
        </div>
      </section>
    </div>
    <div
      v-else
      class="relative flex min-h-0 flex-1 flex-col"
    >
      <TabRouteEmpty
        :label="tabLabel"
        :href="`/resources/${resource.name}/${activeTab}`"
      />
    </div>
  </div>
</template>
```

## `sample.ts`

```ts
import type { FlowDiagramEdgeData, FlowDiagramNodeData } from '@aziontech/webkit/flow-diagram-root'
import type { StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
import type { TagSeverity, TagVariant } from '@aziontech/webkit/tag'

import type { ResourceDetailResource, ResourceDetailTab } from './detail-resource.vue'
import type { ApplicationDeploymentRow } from './parts/application-deployments-tab.vue'
import type { ApplicationVersionRow } from './parts/application-versions-tab.vue'
import type { ProductionStep } from './parts/production-progress-tag.vue'
import type { TopologyTarget } from './use-topology-staging'

const referenceTime = Date.UTC(2026, 10, 10, 12)

export const sampleNow = new Date(referenceTime).toISOString()

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

export const webAppResource: ResourceDetailResource = {
  name: 'web-app',
  domain: 'web-app-y6u7i8.example.com',
  deploymentId: '1213284258',
  environment: 'Production',
  status: 'Ready',
  statusSeverity: 'success',
  createdAt: new Date(referenceTime - 28 * 86_400_000),
  createdBy: 'Riley Carter',
  framework: 'Nuxt',
  frameworkIcon: 'az-color az-nuxt'
}

export const neverDeployedResource: ResourceDetailResource = {
  name: 'docs-site',
  domain: 'docs-site-q4w5e6.example.com',
  deploymentId: '',
  environment: 'Production',
  status: 'Not deployed',
  statusSeverity: 'neutral',
  createdAt: new Date(referenceTime - 2 * 3_600_000),
  createdBy: 'Jane Doe',
  framework: 'Astro',
  frameworkIcon: 'az-color az-astro'
}

export const buildToken = 'azn_build_example_k3p9qa7f2m8x4w1c6v5b'

export const resourceTabs: { value: ResourceDetailTab; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'versions', label: 'Versions' },
  { value: 'build', label: 'Build' },
  { value: 'deployments', label: 'Deployments' }
]

export const policyModules = [
  'Rate limiting',
  'Request inspection',
  'IP filtering',
  'Bot detection'
]

export const serviceDomains = [
  'service-01.example.com',
  'service-01-alias-1.example.com',
  'service-01-alias-2.example.com',
  'service-01-alias-3.example.com',
  'service-01-alias-4.example.com',
  'service-01-alias-5.example.com',
  'service-01-alias-6.example.com',
  'service-01-alias-7.example.com'
]

export const serviceEnvironments = [
  { name: 'Production', policy: 'Single' },
  { name: 'Preview', policy: 'Versioned' }
]

/** A service card of the first deploy. */
export interface FirstDeployService {
  /** The service ID. */
  id: string
  /** The generated domain. */
  domain: string
  /** The deploy step in flight; empty when none runs. */
  deployStep: string
  /** The service serves traffic. */
  live: boolean
  /** Who created it. */
  createdBy: string
  /** When it was created, already formatted. */
  createdAt: string
}

export const firstDeployServices: FirstDeployService[] = [
  {
    id: '1020731',
    domain: 'store-front-k3p9qa.example.com',
    deployStep: 'Build',
    live: false,
    createdBy: 'Jane Doe',
    createdAt: 'Nov 12'
  },
  {
    id: '1020655',
    domain: 'docs-site-w2x7mb.example.com',
    deployStep: '',
    live: false,
    createdBy: 'Sam Lee',
    createdAt: 'Sep 22'
  }
]

export const productionSteps: ProductionStep[] = [
  {
    id: 'domain',
    icon: 'az az-globe',
    title: 'Add a custom domain',
    description:
      'Serve this service on a domain of your own, with a free HTTPS certificate, instead of the generated hostname.',
    actionLabel: 'Add Domain',
    done: false
  },
  {
    id: 'policy',
    icon: 'az az-shield',
    title: 'Enable a security policy',
    description:
      'Bind a policy so requests are inspected before they reach the resource. Rate limiting, request inspection, and IP filtering.',
    actionLabel: 'Bind Policy',
    done: false
  },
  {
    id: 'errorPage',
    icon: 'az az-file',
    title: 'Set custom error pages',
    description: 'Answer 4xx and 5xx with your own page instead of the default response.',
    actionLabel: 'Bind Error Page',
    done: false
  }
]

export const serviceTargets: Record<string, TopologyTarget> = {
  policy: {
    kind: 'Policy',
    icon: 'az az-shield',
    options: [
      { value: 'payments-api', label: 'payments-api' },
      { value: 'api-hardening', label: 'api-hardening' },
      { value: 'partner-gateway', label: 'partner-gateway' },
      { value: 'production-policy', label: 'production-policy' },
      { value: 'canary-policy', label: 'canary-policy' }
    ],
    unbound: 'Requests reach the resource without inspection.'
  },
  errorPage: {
    kind: 'Error Page',
    icon: 'az az-file',
    options: [
      { value: 'Branded 404', label: 'Branded 404' },
      { value: 'Maintenance window', label: 'Maintenance window' },
      { value: 'Server error', label: 'Server error' },
      { value: 'Blocked by policy', label: 'Blocked by policy' },
      { value: 'Rate limited', label: 'Rate limited' }
    ],
    unbound: 'Errors answer with the default page.'
  },
  origin: {
    kind: 'Origin',
    icon: 'az az-link',
    options: [
      { value: 'web-app-storage', label: 'web-app-storage' },
      { value: 'api-primary', label: 'api-primary' },
      { value: 'assets-storage', label: 'assets-storage' },
      { value: 'api-failover', label: 'api-failover' },
      { value: 'uploads', label: 'uploads' }
    ],
    removable: false,
    bound:
      'Provisioned with this service. It is the resource’s origin, so it can be re-pointed but not removed.',
    fields: [
      { label: 'ID', value: '1599818521' },
      { label: 'Type', value: 'Storage' },
      { label: 'Address', value: 'web-app-assets' }
    ]
  }
}

export const serviceTopology: Record<string, FlowDiagramNodeData> = {
  domains: {
    id: 'domains',
    eyebrow: 'Domains',
    icon: 'az az-globe',
    title: 'service-01.example.com',
    status: '1 domain',
    severity: 'neutral',
    fields: [
      {
        label: 'Generated domain',
        value: 'service-01.example.com',
        copyable: true,
        href: 'https://service-01.example.com'
      }
    ]
  },
  service: {
    id: 'service',
    eyebrow: 'Service',
    icon: 'az az-server',
    title: 'service-01',
    status: 'Live',
    severity: 'success',
    href: '/services/1020655',
    fields: [
      { label: 'ID', value: '1020655' },
      {
        label: 'Domain',
        value: 'service-01.example.com',
        copyable: true,
        href: 'https://service-01.example.com'
      },
      { label: 'Environment', value: 'Production' }
    ]
  },
  resource: {
    id: 'resource',
    eyebrow: 'Resource',
    icon: 'az az-box',
    title: 'web-app',
    status: 'Active',
    severity: 'success',
    href: '/resources/1170472732',
    fields: [
      { label: 'ID', value: '1170472732' },
      { label: 'Repository', value: 'acme/web-app' },
      { label: 'Branch', value: 'main' }
    ]
  },
  storage: {
    id: 'storage',
    eyebrow: 'Storage',
    icon: 'az az-inbox',
    title: 'web-app-assets',
    status: 'Public',
    severity: 'info',
    href: '/storage/web-app-assets',
    fields: [
      { label: 'Access', value: 'Public' },
      { label: 'Files', value: '24' },
      { label: 'Size', value: '1.2 MB' }
    ]
  }
}

export const serviceEdges: FlowDiagramEdgeData[] = [
  { from: 'domains', to: 'service' },
  { from: 'service', to: 'policy' },
  { from: 'policy', to: 'resource' },
  { from: 'policy', to: 'errorPage' },
  { from: 'resource', to: 'origin' },
  { from: 'origin', to: 'storage' }
]

export const application = {
  name: 'storefront-app',
  host: 'storefront-app-k3m9.example.com',
  deployment: '4182093317',
  version: 'BX7Q2LMA'
}

export const applicationFacts = [
  { label: 'Active version', value: application.version, code: true },
  { label: 'Framework', value: 'Vite' },
  { label: 'Source', value: 'acme/storefront (main)' },
  { label: 'Created', value: '', createdAt: '2026-10-27T12:00:00Z', author: 'Mara Lin' }
]

export const applicationVersions: ApplicationVersionRow[] = [
  {
    id: 'BX7Q2LMA',
    name: 'BX7Q2LMA',
    description: 'Cache product images for 7 days',
    state: 'Active',
    createdAt: '2026-11-10T09:00:00Z'
  },
  {
    id: 'BW1K8RTE',
    name: 'BW1K8RTE',
    description: 'Add rule "Redirect old checkout"',
    state: 'Ready',
    createdAt: '2026-11-09T12:00:00Z'
  },
  {
    id: 'BV4N6PXD',
    name: 'BV4N6PXD',
    description: 'Bypass cache for /api/*',
    state: 'Ready',
    createdAt: '2026-11-06T12:00:00Z'
  }
]

export const applicationDeployments: ApplicationDeploymentRow[] = [
  {
    id: '4182093317',
    version: 'BX7Q2LMA',
    environment: 'Production',
    status: 'Live',
    createdAt: '2026-11-10T09:00:00Z'
  },
  {
    id: '4181877250',
    version: 'BW1K8RTE',
    environment: 'Preview',
    status: 'Live',
    createdAt: '2026-11-09T12:00:00Z'
  },
  {
    id: '4180412906',
    version: 'BW1K8RTE',
    environment: 'Production',
    status: 'Failed',
    createdAt: '2026-11-09T12:00:00Z'
  }
]

export const applicationDeploymentSeverity: Record<string, StatusIndicatorSeverity> = {
  Live: 'success',
  Failed: 'danger',
  Building: 'info'
}

export const applicationTargets: Record<string, TopologyTarget> = {
  firewall: {
    kind: 'Firewall',
    icon: 'az az-shield',
    options: [
      { value: 'edge-guard', label: 'edge-guard' },
      { value: 'strict-waf', label: 'strict-waf' }
    ],
    unbound: 'Requests reach the application without inspection.'
  },
  function: {
    kind: 'Function instance',
    icon: 'az az-code',
    options: [
      { value: 'geo-redirect', label: 'geo-redirect' },
      { value: 'ab-split', label: 'ab-split' }
    ],
    unbound: 'No function runs before the cache.'
  }
}

export const applicationTopology: Record<string, FlowDiagramNodeData> = {
  domain: {
    id: 'domain',
    eyebrow: 'Domain',
    icon: 'az az-globe',
    title: 'shop.example.com',
    status: 'Live',
    severity: 'success'
  },
  workload: {
    id: 'workload',
    eyebrow: 'Workload',
    icon: 'az az-sitemap',
    title: 'storefront',
    status: 'Active',
    severity: 'success'
  },
  application: {
    id: 'application',
    eyebrow: 'Application',
    icon: 'az az-box',
    title: 'storefront-app',
    status: 'Active',
    severity: 'success'
  }
}

export const applicationEdges: FlowDiagramEdgeData[] = [
  { from: 'domain', to: 'workload' },
  { from: 'workload', to: 'firewall' },
  { from: 'firewall', to: 'application' },
  { from: 'application', to: 'function' }
]

export const buildApplication = {
  name: 'storefront-app',
  host: 'storefront-app-k3m9.example.com',
  deployment: '4182093317',
  version: 'BX7Q2LMA',
  repository: 'acme/storefront'
}

export const buildApplicationVersions: ApplicationVersionRow[] = [
  {
    id: 'BX7Q2LMA',
    name: 'BX7Q2LMA',
    description: 'Cache product images for 7 days',
    state: 'Active',
    createdAt: '2026-11-10T09:00:00Z'
  },
  {
    id: 'BW1K8RTE',
    name: 'BW1K8RTE',
    description: 'Redirect the old checkout path',
    state: 'Ready',
    createdAt: '2026-11-09T12:00:00Z'
  },
  {
    id: 'BV4N6PXD',
    name: 'BV4N6PXD',
    description: 'Bypass cache for /api/*',
    state: 'Ready',
    createdAt: '2026-11-06T12:00:00Z'
  }
]

export const buildApplicationDeployments: ApplicationDeploymentRow[] = [
  {
    id: '4182093317',
    version: 'BX7Q2LMA',
    environment: 'Production',
    status: 'Ready',
    createdAt: '2026-11-10T09:00:00Z'
  },
  {
    id: '4181877250',
    version: 'BW1K8RTE',
    environment: 'Preview',
    status: 'Ready',
    createdAt: '2026-11-09T12:00:00Z'
  },
  {
    id: '4180412906',
    version: 'BW1K8RTE',
    environment: 'Production',
    status: 'Error',
    createdAt: '2026-11-09T12:00:00Z'
  }
]

export const buildDeploymentSeverity: Record<string, StatusIndicatorSeverity> = {
  Ready: 'success',
  Error: 'danger',
  Building: 'info'
}

/** One row of the resource Versions tab. */
export interface ResourceVersionRow {
  /** Stable key. */
  id: string
  /** The code-set name. */
  name: string
  /** A key of the version states. */
  state: string
  /** What the version changed. */
  description: string
  /** Who built it. */
  author: string
  /** When it was built, as ISO 8601. */
  createdAt: string
}

export const resourceVersions: ResourceVersionRow[] = [
  {
    id: 'ANWDC7RA',
    name: 'ANWDC7RA',
    state: 'active',
    description: 'Reorder rules',
    author: 'Chris Taylor',
    createdAt: '2026-11-05T17:37:18.145Z'
  },
  {
    id: 'APA7237R',
    name: 'APA7237R',
    state: 'ready',
    description: 'Add rule "Security headers"',
    author: 'Riley Carter',
    createdAt: '2026-11-03T14:37:18.145Z'
  },
  {
    id: 'AQO0RYO8',
    name: 'AQO0RYO8',
    state: 'ready',
    description: 'Bypass cache for /api/*',
    author: 'Ethan Brooks',
    createdAt: '2026-11-02T14:37:18.145Z'
  },
  {
    id: 'AS1UHU4P',
    name: 'AS1UHU4P',
    state: 'ready',
    description: 'Add rule "Redirect /blog to docs"',
    author: 'Jordan Kim',
    createdAt: '2026-11-01T14:37:18.145Z'
  },
  {
    id: 'ATFO7PL6',
    name: 'ATFO7PL6',
    state: 'ready',
    description: 'Add function "image-resize"',
    author: 'Taylor Reed',
    createdAt: '2026-10-31T14:37:18.145Z'
  },
  {
    id: 'AUTHXL1N',
    name: 'AUTHXL1N',
    state: 'ready',
    description: 'Reorder rules',
    author: 'John Smith',
    createdAt: '2026-10-30T14:37:18.145Z'
  },
  {
    id: 'AW7BNGI4',
    name: 'AW7BNGI4',
    state: 'ready',
    description: 'Add rule "Security headers"',
    author: 'Sam Lee',
    createdAt: '2026-10-29T14:37:18.145Z'
  },
  {
    id: 'AXL5DBYL',
    name: 'AXL5DBYL',
    state: 'ready',
    description: 'Bypass cache for /api/*',
    author: 'Priya Patel',
    createdAt: '2026-10-28T14:37:18.145Z'
  },
  {
    id: 'AYYZ37F2',
    name: 'AYYZ37F2',
    state: 'ready',
    description: 'Add rule "Redirect /blog to docs"',
    author: 'Chris Taylor',
    createdAt: '2026-10-27T14:37:18.145Z'
  },
  {
    id: 'A1CST2VJ',
    name: 'A1CST2VJ',
    state: 'ready',
    description: 'Add function "image-resize"',
    author: 'Riley Carter',
    createdAt: '2026-10-26T14:37:18.145Z'
  },
  {
    id: 'A2QMIYC0',
    name: 'A2QMIYC0',
    state: 'ready',
    description: 'Reorder rules',
    author: 'Ethan Brooks',
    createdAt: '2026-10-24T14:37:18.145Z'
  },
  {
    id: 'A44G8TSH',
    name: 'A44G8TSH',
    state: 'ready',
    description: 'Add rule "Security headers"',
    author: 'Jordan Kim',
    createdAt: '2026-10-24T14:37:18.145Z'
  },
  {
    id: 'A5I9YP8Y',
    name: 'A5I9YP8Y',
    state: 'archived',
    description: 'Bypass cache for /api/*',
    author: 'Taylor Reed',
    createdAt: '2026-10-22T14:37:18.145Z'
  }
]

export const resourceVersionStates: Record<
  string,
  { label: string; severity?: TagSeverity; variant?: TagVariant }
> = {
  active: { label: 'Deployed', variant: 'primary' },
  ready: { label: 'Ready', severity: 'success' },
  archived: { label: 'Archived', severity: 'neutral' }
}
```

## `use-topology-staging.ts`

```ts
import type {
  FlowDiagramBindOption,
  FlowDiagramNodeData,
  FlowDiagramNodeField
} from '@aziontech/webkit/flow-diagram-root'
import { toast } from '@aziontech/webkit/toast'
import { computed, type ComputedRef, onScopeDispose, reactive, readonly, type Ref, ref } from 'vue'

/** A slot of the topology that a resource can be bound to. */
export interface TopologyTarget {
  /** The kind of resource the slot takes, such as Firewall. */
  kind: string
  /** The kind glyph class. */
  icon: string
  /** The resources the slot can bind. */
  options: FlowDiagramBindOption[]
  /** What the node says while nothing is bound. */
  unbound?: string
  /** What the node says about the deployed binding. */
  bound?: string
  /** False when the binding can be changed but not removed. */
  removable?: boolean
  /** The facts of the deployed binding. */
  fields?: FlowDiagramNodeField[]
}

/** One staged change, as the deploy drawer lists it. */
export interface TopologyStagedChange {
  /** The slot key. */
  key: string
  /** The kind of resource. */
  kind: string
  /** The deployed binding, or Not bound. */
  from: string
  /** The staged binding, or Removed. */
  to: string
}

export interface UseTopologyStagingOptions {
  /** The bindable slots, by key. */
  targets: Record<string, TopologyTarget>
  /** What is bound in Production, by slot key; empty when nothing is. */
  bound: Record<string, string>
  /** The name of what is deployed, used in the toasts. */
  name: string
  /** The id of the toast that follows the deployment. */
  toastId: string
  /** Dismisses the toast when the page is left. */
  dismissOnLeave?: boolean
  /** Takes the person back to the topology from the Edit action of the toast. */
  onEdit: () => void
}

export interface UseTopologyStagingReturn {
  /** How many changes wait for the next deploy. */
  stagedCount: ComputedRef<number>
  /** The staged changes, as the deploy drawer lists them. */
  stagedChanges: ComputedRef<TopologyStagedChange[]>
  /** The last thing that was staged, announced under the diagram. */
  stagedNote: Readonly<Ref<string>>
  /** A deployment is in flight. */
  deploying: Readonly<Ref<boolean>>
  /** The diagram node of one slot, with its staged or deployed binding. */
  slotNode: (key: string) => FlowDiagramNodeData
  /** Stages a binding on a slot. */
  bind: (key: string, value: string) => void
  /** Stages the removal of a binding, or drops a staged one. */
  unbind: (key: string) => void
  /** Announces the create flow of a slot. */
  createTarget: (key: string) => void
  /** Deploys the staged changes to Production. */
  deploy: () => void
}

function topologySlotNode(
  key: string,
  target: TopologyTarget,
  pick: string | undefined,
  deployedValue: string | undefined
): FlowDiagramNodeData {
  const removing = pick === ''
  const value = pick === undefined ? deployedValue : pick
  const base = {
    id: key,
    eyebrow: target.kind,
    icon: target.icon,
    bindable: true,
    bindOptions: target.options,
    removable: target.removable !== false
  }
  if (!value) {
    return {
      ...base,
      status: removing ? 'Staged' : '',
      severity: removing ? 'warning' : 'neutral',
      dashed: true,
      message: removing ? `Deploy to remove this ${target.kind.toLowerCase()}.` : target.unbound
    }
  }
  return {
    ...base,
    title: value,
    boundValue: value,
    status: pick === undefined ? 'Active' : 'Staged',
    severity: pick === undefined ? 'success' : 'warning',
    dashed: pick !== undefined,
    message:
      pick === undefined
        ? target.bound || ''
        : `Deploy to apply this ${target.kind.toLowerCase()}.`,
    fields: pick === undefined ? target.fields : undefined
  }
}

function announceLive(
  options: UseTopologyStagingOptions,
  changes: number,
  onEdit: () => void,
  onRedeploy: () => void
): void {
  toast.success(`${options.name} is live.`, {
    id: options.toastId,
    description: changes
      ? `${changes} topology ${changes === 1 ? 'change' : 'changes'} now serve Production.`
      : 'Production serves the active version.',
    duration: 0,
    closable: true,
    actions: [
      { label: 'Edit', onClick: onEdit },
      { label: 'Redeploy', onClick: onRedeploy }
    ]
  })
}

function applyStaged(deployed: Record<string, string>, staged: Record<string, string>): void {
  for (const [key, value] of Object.entries(staged)) {
    deployed[key] = value
    delete staged[key]
  }
}

function stagingEdits(
  targets: Record<string, TopologyTarget>,
  deployed: Record<string, string>,
  staged: Record<string, string>,
  stagedNote: Ref<string>
): Pick<UseTopologyStagingReturn, 'bind' | 'unbind' | 'createTarget'> {
  const bind = (key: string, value: string) => {
    if (value === deployed[key]) delete staged[key]
    else staged[key] = value
    stagedNote.value = `${value} staged on ${targets[key].kind.toLowerCase()}.`
  }
  const unbind = (key: string) => {
    if (staged[key] !== undefined && staged[key] !== '') delete staged[key]
    else if (deployed[key]) staged[key] = ''
    stagedNote.value = `${targets[key].kind} staged for removal.`
  }
  const createTarget = (key: string) => {
    stagedNote.value = `Opens the create flow for a new ${targets[key].kind.toLowerCase()}.`
  }
  return { bind, unbind, createTarget }
}

export function useTopologyStaging(options: UseTopologyStagingOptions): UseTopologyStagingReturn {
  const { targets } = options
  const deployed = reactive<Record<string, string>>({ ...options.bound })
  const staged = reactive<Record<string, string>>({})
  const stagedCount = computed(() => Object.keys(staged).length)
  const stagedNote = ref('')
  const deploying = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  const slotNode = (key: string): FlowDiagramNodeData =>
    topologySlotNode(key, targets[key], staged[key], deployed[key])

  const stagedChanges = computed(() =>
    Object.entries(staged).map(([key, value]) => ({
      key,
      kind: targets[key].kind,
      from: deployed[key] || 'Not bound',
      to: value || 'Removed'
    }))
  )

  const { bind, unbind, createTarget } = stagingEdits(targets, deployed, staged, stagedNote)

  const editStaged = () => {
    toast.dismiss(options.toastId)
    options.onEdit()
  }

  const deploy = () => {
    deploying.value = true
    const changes = stagedChanges.value.length
    toast.loading(`Deploying ${options.name}…`, {
      id: options.toastId,
      description: 'It keeps running if you leave this page.'
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      applyStaged(deployed, staged)
      deploying.value = false
      stagedNote.value = ''
      announceLive(options, changes, editStaged, deploy)
    }, 1500)
  }

  onScopeDispose(() => {
    clearTimeout(timer)
    if (options.dismissOnLeave) toast.dismiss(options.toastId)
  })

  return {
    stagedCount,
    stagedChanges,
    stagedNote: readonly(stagedNote),
    deploying: readonly(deploying),
    slotNode,
    bind,
    unbind,
    createTarget,
    deploy
  }
}
```

## `parts/application-deployments-tab.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import type { TableColumn } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import EmptyState from '@aziontech/webkit/empty-state'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Subheader from '@aziontech/webkit/subheader'
  import TableCellTime from '@aziontech/webkit/table-cell-time'

  /** One deployment row of the Deployments tab. */
  export interface ApplicationDeploymentRow {
    /** The deployment id. */
    id: string
    /** The version it deployed. */
    version: string
    /** The environment it went to. */
    environment: string
    /** The status label, a key of the severity map. */
    status: string
    /** When it ran, as ISO 8601. */
    createdAt: string
  }

  export interface ApplicationDeploymentsTabProps {
    /** The deployments of the application. */
    deployments: ApplicationDeploymentRow[]
    /** The status color, by status label. */
    severity: Record<string, StatusIndicatorSeverity>
  }

  defineProps<ApplicationDeploymentsTabProps>()

  const deploymentColumns: TableColumn[] = [
    { accessorKey: 'id', header: 'Deployment', principal: true, hideable: false },
    { accessorKey: 'version', header: 'Version' },
    { accessorKey: 'environment', header: 'Environment' },
    { accessorKey: 'status', header: 'Status', minWidth: 104 },
    { accessorKey: 'createdAt', header: 'Created', minWidth: 96 }
  ]
</script>

<template>
  <section
    class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap) pb-(--layout-section-gap)"
  >
    <Subheader
      title="Deployments"
      size="small"
    />
    <Card :padded="false">
      <template #default>
        <DataTable
          :data="deployments"
          :columns="deploymentColumns"
          row-key="id"
          :bordered="false"
          aria-label="Deployments"
        >
          <template #cell-createdAt="{ value }">
            <TableCellTime :value="value" />
          </template>
          <template #cell-status="{ value }">
            <StatusIndicator
              :severity="severity[value]"
              :label="value"
            />
          </template>
          <template #empty>
            <EmptyState
              size="medium"
              icon="az az-cloud-upload"
              title="No deployments yet"
              description="Deploy this application and each run lands here."
            />
          </template>
          <template #footer>
            <DataTablePagination :page-size="10" />
          </template>
        </DataTable>
      </template>
    </Card>
  </section>
</template>
```

## `parts/application-versions-tab.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import type { TableColumn } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Subheader from '@aziontech/webkit/subheader'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'

  /** One version row of the Versions tab. */
  export interface ApplicationVersionRow {
    /** Stable key. */
    id: string
    /** The version name. */
    name: string
    /** What the version changed. */
    description: string
    /** Active, Ready or Draft. */
    state: string
    /** When it was created, as ISO 8601. */
    createdAt: string
  }

  export interface ApplicationVersionsTabProps {
    /** The versions of the application. */
    versions: ApplicationVersionRow[]
    /** The name of the newest version, marked Latest. */
    latest: string
  }

  defineProps<ApplicationVersionsTabProps>()

  const versionColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Version', principal: true, hideable: false },
    { accessorKey: 'description', header: 'Description', grow: 2 },
    { accessorKey: 'state', header: 'Status', minWidth: 104 },
    { accessorKey: 'createdAt', header: 'Created', minWidth: 96 }
  ]
  const versionSeverity: Record<string, TagSeverity> = {
    Active: 'success',
    Ready: 'neutral',
    Draft: 'warning'
  }
</script>

<template>
  <section
    class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap) pb-(--layout-section-gap)"
  >
    <Subheader
      title="Versions"
      size="small"
    >
      <template #actions>
        <Button
          label="Add Version"
          variant="outline"
          size="medium"
          icon="az az-plus"
        />
      </template>
    </Subheader>
    <Card :padded="false">
      <template #default>
        <DataTable
          :data="versions"
          :columns="versionColumns"
          row-key="id"
          :bordered="false"
          aria-label="Versions"
        >
          <template #cell-createdAt="{ value }">
            <TableCellTime :value="value" />
          </template>
          <template #cell-name="{ value }">
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <span class="truncate font-(family-name:--font-code) text-body-sm">{{ value }}</span>
              <span
                v-if="value === latest"
                class="shrink-0 text-body-sm text-(--text-muted)"
                >Latest</span
              >
            </span>
          </template>
          <template #cell-state="{ value }">
            <Tag
              :label="value"
              :severity="versionSeverity[value]"
              size="small"
            />
          </template>
          <template #empty>
            <EmptyState
              size="medium"
              icon="az az-history"
              title="No versions yet"
              description="Every deploy creates a version of this application."
            />
          </template>
          <template #footer>
            <DataTablePagination :page-size="10" />
          </template>
        </DataTable>
      </template>
    </Card>
  </section>
</template>
```

## `parts/resource-get-started.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Link from '@aziontech/webkit/link'
  import Subheader from '@aziontech/webkit/subheader'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, ref } from 'vue'

  export interface ResourceGetStartedProps {
    /** The resource slug the CLI links to. */
    name: string
  }

  const props = defineProps<ResourceGetStartedProps>()

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
  --name ${props.name}`
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
  <div class="@container flex min-w-0 flex-col gap-(--spacing-md)">
    <Subheader title="Get started">
      <template #description>
        Two ways to build and deploy this resource. Select one and follow the steps, or read the
        <Link
          href="https://example.com/docs/cli"
          target="_blank"
          inline
          >CLI docs</Link
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
</template>
```

## `parts/resource-summary-card.vue`

```ts
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Card from '@aziontech/webkit/card'
  import { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import Link from '@aziontech/webkit/link'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import type { ResourceDetailResource } from '../detail-resource.vue'
  import SummaryFact from './summary-fact.vue'
  import SummaryFacts from './summary-facts.vue'
  import SummaryStateBand from './summary-state-band.vue'
  import SummarySubjectBand from './summary-subject-band.vue'

  export interface ResourceSummaryCardProps {
    /** The resource the card sums up. */
    resource: ResourceDetailResource
    /** When and by whom it was created, already formatted. */
    created: string
  }

  const props = defineProps<ResourceSummaryCardProps>()

  const emit = defineEmits<{
    action: [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
  }>()

  defineSlots<{
    source(): unknown
    default(): unknown
  }>()

  const address = computed(() => `https://${props.resource.domain}`)
  const deployed = computed(() => props.resource.deploymentId !== '')

  const menu = [
    [{ value: 'copy-url', label: 'Copy URL', icon: 'az az-copy' }],
    [{ value: 'settings', label: 'Settings', icon: 'az az-settings' }]
  ]
</script>

<template>
  <Card :padded="false">
    <template #default>
      <SummarySubjectBand
        icon="az az-globe"
        :label="deployed ? resource.domain : ''"
        :href="deployed ? address : ''"
        :visit="deployed ? address : ''"
        actions-label="Resource actions"
        :menu="menu"
        @select="(event, value) => emit('action', event, value)"
      >
        <template
          v-if="!deployed"
          #subject
        >
          <span class="truncate text-body-sm text-(--text-muted)">Not deployed yet</span>
        </template>
      </SummarySubjectBand>

      <SummaryFacts>
        <SummaryFact
          label="Deployment"
          empty="None"
          class="lg:col-span-2"
        >
          <template v-if="deployed">
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
          </template>
        </SummaryFact>

        <SummaryFact
          label="Domains"
          empty="None"
          class="lg:col-span-2"
        >
          <div
            v-if="deployed"
            class="flex min-w-0"
          >
            <TableCellLink
              :label="resource.domain"
              :href="address"
            />
          </div>
        </SummaryFact>

        <SummaryFact
          label="Status"
          empty="Not deployed"
          value-class=""
          class="lg:col-span-2"
        >
          <StatusIndicator
            v-if="deployed"
            :severity="resource.statusSeverity"
            :label="resource.status"
          />
        </SummaryFact>

        <SummaryFact
          label="Created"
          class="lg:col-span-2"
        >
          <span
            dir="auto"
            data-testid="resource-detail__created"
            class="truncate text-body-sm text-(--text-default)"
          >
            {{ created }}
          </span>
          <Avatar
            :alt="resource.createdBy"
            :label="resource.createdBy"
            size="small"
            variant="square"
            class="shrink-0"
          />
        </SummaryFact>

        <SummaryFact
          label="Source"
          value-class="gap-(--spacing-sm)"
          class="lg:col-span-2"
        >
          <slot name="source" />
        </SummaryFact>

        <SummaryFact
          label="Framework"
          class="lg:col-span-2"
        >
          <i
            :class="resource.frameworkIcon"
            class="shrink-0 text-body-lg"
            aria-hidden="true"
          />
          <span class="truncate text-body-sm text-(--text-default)">
            {{ resource.framework }}
          </span>
        </SummaryFact>
      </SummaryFacts>

      <SummaryStateBand docs="https://example.com/docs/cli">
        <slot />
      </SummaryStateBand>
    </template>
  </Card>
</template>
```

## `parts/resource-tab-bar.vue`

```ts
<script setup lang="ts">
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Tabs from '@aziontech/webkit/tabs'

  defineProps<{
    /** The tabs, in order. */
    tabs: { value: string; label: string }[]
    /** The tab that holds unsaved changes; empty when none does. */
    dirtyTab?: string
  }>()

  const model = defineModel<string>({ required: true })

  defineSlots<{ actions?(): unknown }>()
</script>

<template>
  <div class="sticky top-0 z-1 bg-(--bg-canvas)">
    <PageTabs v-model="model">
      <Tabs.Trigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :label="tab.label"
        :dirty="Boolean(dirtyTab) && tab.value === dirtyTab"
      />
      <template
        v-if="$slots.actions"
        #actions
      >
        <slot name="actions" />
      </template>
    </PageTabs>
  </div>
</template>
```

## `parts/summary-fact.vue`

```ts
<script setup lang="ts">
  export interface SummaryFactProps {
    /** The muted label over the value. */
    label?: string
    /** The utilities the value row adds, such as its gap. */
    valueClass?: string
    /** The muted text shown when no value is given, such as None. */
    empty?: string
  }

  withDefaults(defineProps<SummaryFactProps>(), {
    label: '',
    valueClass: 'gap-(--spacing-xs)',
    empty: ''
  })

  defineSlots<{
    default?(): unknown
    label?(): unknown
  }>()
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
    <slot name="label">
      <span class="text-label-sm text-(--text-muted)">{{ label }}</span>
    </slot>
    <div
      class="flex min-h-7 min-w-0 items-center"
      :class="valueClass"
    >
      <slot>
        <span class="truncate text-body-sm text-(--text-muted)">{{ empty }}</span>
      </slot>
    </div>
  </div>
</template>
```

## `parts/summary-facts.vue`

```ts
<script setup lang="ts">
  export interface SummaryFactsProps {
    /** The grid columns from sm up. */
    columns?: string
  }

  withDefaults(defineProps<SummaryFactsProps>(), {
    columns: 'sm:grid-cols-3 lg:grid-cols-6'
  })

  defineSlots<{ default(): unknown }>()
</script>

<template>
  <div
    class="@container/band border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) grid grid-cols-1 gap-(--spacing-sm)"
    :class="columns"
  >
    <slot />
  </div>
</template>
```

## `parts/summary-state-band.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'

  export interface SummaryStateBandProps {
    /** The documentation the band links to. */
    docs: string
  }

  defineProps<SummaryStateBandProps>()

  defineSlots<{ default(): unknown }>()

  const STATE_BAND_CLASS =
    '@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) ' +
    'py-(--spacing-xs)'
</script>

<template>
  <div :class="STATE_BAND_CLASS">
    <slot />

    <div class="w-full shrink-0 @lg/band:ms-auto @lg/band:w-fit">
      <Button
        class="w-full"
        label="Documentation"
        aria-label="Documentation (opens in a new tab)"
        variant="outline"
        size="medium"
        icon="az az-book"
        :href="docs"
        target="_blank"
      />
    </div>
  </div>
</template>
```

## `parts/summary-subject-band.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import Tooltip from '@aziontech/webkit/tooltip'

  /** One item of the actions menu. */
  export interface SummaryMenuItem {
    /** The value the menu emits. */
    value: string
    /** The item label. */
    label: string
    /** The leading glyph class. */
    icon: string
  }

  export interface SummarySubjectBandProps {
    /** The glyph before the subject. */
    icon: string
    /** The primary link label. */
    label?: string
    /** Where the primary link goes. */
    href?: string
    /** Where the primary link goes, named in its tooltip. */
    destination?: string
    /** The address Visit opens in a new tab; empty draws no Visit. */
    visit?: string
    /** Why Visit is unavailable yet; set, Visit stays in place but disabled with this reason. */
    visitDisabledReason?: string
    /** The accessible name and tooltip of the actions menu. */
    actionsLabel: string
    /** The groups of the actions menu. */
    menu: SummaryMenuItem[][]
    /** Whether the items of the actions menu carry their glyph. */
    showMenuIcons?: boolean
    /** Whether the band is a container query container. */
    container?: boolean
  }

  withDefaults(defineProps<SummarySubjectBandProps>(), {
    label: '',
    href: '',
    destination: '',
    visit: '',
    visitDisabledReason: '',
    showMenuIcons: true,
    container: true
  })

  const emit = defineEmits<{
    select: [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
  }>()

  defineSlots<{
    subject?(): unknown
    'subject-trailing'?(): unknown
    actions?(): unknown
  }>()
</script>

<template>
  <div
    :class="container && '@container/band'"
    class="flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)"
  >
    <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)">
      <i
        :class="icon"
        class="shrink-0 text-body-lg text-(--text-muted)"
        aria-hidden="true"
      />
      <slot name="subject">
        <div class="flex min-w-0">
          <TableCellLink
            :label="label"
            :href="href"
            :destination="destination"
          />
        </div>
      </slot>
      <slot name="subject-trailing" />
    </div>

    <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
      <Button
        v-if="visit"
        label="Visit"
        :aria-label="visitDisabledReason ? 'Visit' : 'Visit (opens in a new tab)'"
        :href="visitDisabledReason ? '' : visit"
        :target="visitDisabledReason ? '_self' : '_blank'"
        :disabled="Boolean(visitDisabledReason)"
        :disabled-reason="visitDisabledReason"
        variant="secondary"
        size="medium"
        icon="az az-external-link"
      />
      <slot name="actions" />
      <DropdownMenu
        side="bottom"
        align="end"
        @select="(event, value) => emit('select', event, value)"
      >
        <DropdownMenu.Trigger>
          <Tooltip :content="actionsLabel">
            <IconButton
              icon="az az-ellipsis"
              variant="outline"
              size="medium"
              :aria-label="actionsLabel"
            />
          </Tooltip>
        </DropdownMenu.Trigger>
        <DropdownMenu.Group
          v-for="(group, index) in menu"
          :key="index"
        >
          <DropdownMenu.Item
            v-for="item in group"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          >
            <template
              v-if="showMenuIcons"
              #leading
            >
              <i
                :class="item.icon"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu>
    </div>
  </div>
</template>
```

## `parts/tab-route-empty.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'

  export interface TabRouteEmptyProps {
    /** The tab label. */
    label: string
    /** The route the tab opens on. */
    href: string
  }

  defineProps<TabRouteEmptyProps>()
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <div class="layout-section-start">
      <EmptyState
        size="medium"
        icon="az az-external-link"
        :title="label"
        :description="`${label} opens on its own page.`"
      >
        <template #actions>
          <Button
            :label="`Open ${label}`"
            variant="outline"
            size="small"
            :href="href"
          />
        </template>
      </EmptyState>
    </div>
  </div>
</template>
```
