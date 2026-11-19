# CreateDeployDrawer (`create/create-deploy-drawer`)

> The drawer a platform deploys from, opened by the outlined Deploy button on a service or a project. Every variant shares one Resources card: a row per resource with its Ready tag, the picked version and a Change version menu, and a Dependencies disclosure with the modules and integrations the service references. On a service the default flow is environment first: the Project card uses an existing project or creates one, the environments come as radio blocks, and Projects impacted lists every project the environment’s shared Deployment Settings deploy to. A deploy started without a pinned version first builds one, so the drawer opens as Build and deployment with a Building row and the other sections faded. A service can also deploy project first, picking the project before the environment. On a project, the drawer carries every resource it serves and warns when its Deployment Settings also deploy elsewhere. The footer counts the version changes and where they go live; while the targets resolve the sections are Skeletons, a load failure is an Alert with Retry, and a project with no environment shows an EmptyState with Add environment, Deploy disabled in all three. Built from `SettingsGroup`, `Drawer`, `PanelHeader`, `PanelBody`, `PanelFooter`, `Card`, `Item`, `Accordion`, `Separator`, `Popover`, `DropdownMenu`, `ToggleGroup`, `RadioGroup` (`variant="card"`), `Input`, `Avatar`, `Tag`, `Spinner`, `Skeleton`, `EmptyState`, `Alert`, `Tooltip` and `Button`.

- Surface: app
- Source: `blocks/create/create-deploy-drawer/create-deploy-drawer.vue` in `@aziontech/webkit`
- MCP: `get_block("create/create-deploy-drawer")`
- Components: [Accordion](../../components/accordion.md), [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Button](../../components/button.md), [Card](../../components/card.md), `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, `DrawerTrigger`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Input](../../components/input.md), [Item](../../components/item.md), [Link](../../components/link.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [Popover](../../components/popover.md), [RadioGroup](../../components/radio-group.md), [Separator](../../components/separator.md), [SettingsGroup](../../components/settings-group.md), [Skeleton](../../components/skeleton.md), [Spinner](../../components/spinner.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md)
- Skills: `webkit-create-surface`, `webkit-navigation`, `webkit-form`, `webkit-ui-states`

## Asked as

deploy drawer; deploy panel; deploy service; choose versions to deploy; dependencies before deploy; release drawer; gaveta de deploy; implantar serviço; escolher versão

The drawer a platform deploys from, opened by Deploy on a service or a project. The user is about to put a version into traffic and needs to confirm exactly what goes out (each resource and dependency at a version), where it goes (a project and one of its environments) and what else it reaches (every project that shares the environment's Deployment Settings). One Deploy at the foot commits all of it.

## When to use

- A service or a project has a ready version and the user deploys it from its page or list.
- The deploy reaches more than the resource itself: dependencies at their own versions, or other projects through shared Deployment Settings.
- A service deploys to a project that may not exist yet; the Project section creates it in place.

## When not to use

- A release of several resources reviewed together: use `create/create-release-impact`. This drawer is the canonical surface for deploying one service or one project.

- Creating or editing an item inside a resource: use `create/create-drawer`.
- The first deploy at the end of a create flow: use `create/create-deploy-template` or `create/create-wizard` (CreateAndDeploy), which stream the create-flow card of `detail/detail-deployment-logs` in the page.
- Reading what a past deploy did: use `detail/detail-deployment-logs` or `detail/detail-version`.
- Binding one resource to another without deploying: use `create/create-resource-picker`.

## Building blocks

### A. Trigger and frame — `Drawer`, `DrawerTrigger`, `Button`, `DrawerContent` (required)

An outlined medium `Button` reading Deploy inside `DrawerTrigger`, on the service or project page. The `Drawer` is `size="large"`, portals over the page with an overlay and holds one `form` with an `aria-label` equal to the title.

### B. Panel header — `PanelHeader`, `DrawerTitle` (required)

`DrawerTitle` reads Deploy, or Build and deployment while a version is being built first. The drawer's own close button sits on the right; no Cancel anywhere.

### C. Sections — `PanelBody`, `SettingsGroup`, `Skeleton`, `Alert`, `Spinner` (required)

`PanelBody` holds one `fieldset` of `SettingsGroup` bands, each with a title and a `hint`: Resources, Project, Environment, Projects impacted on a service; Resources and Environment on a project. The order is the order of the decision: what, where, then what else it reaches. While the deploy targets load, `Skeleton` blocks stand in for Resources and Environment; a failed load is a danger `Alert` with Retry; a build in progress is one row with its version `Tag` and a `Spinner` in place of Resources.

### D. Resources card — `Card`, `Separator`, `Item`, `Tag`, `DropdownMenu`, `Input`, `Avatar`, `Button` (required)

`Card :padded="false"` with one small inline `Item` per resource, split by `Separator`s. Each row shows a small `Tag` reading Ready, or a warning tag when no version is ready, and the picked version. Change version, an outlined small `Button`, opens a `DropdownMenu`: the summary and a search `Input` in its top slot, one `DropdownMenu.Item` per version (the author `Avatar` on the left, the name with an Active `Tag`, the age on the right, the picked one `selected`), and a transparent Load more `Button` in its bottom slot. The menu gives the rows their roles, arrow-key movement, hover and focus, so the block never re-types them. Disable Change version when there is nothing to change to. On a phone the row title wraps (type, name and tag), the domain links truncate before their +N count, and Change version and the project Change menu move under the row instead of drawing over it.

### E. Dependencies — `Accordion`, `Item`, `Tag`, `DropdownMenu` (required)

A small `Accordion` below the resource rows, collapsed, listing the modules and integrations the service references, each with its own version and Change version menu. Dependencies go out with the deploy, so they are shown even when the user does not change them.

### F. Project — `ToggleGroup`, `Item`, `Tag`, `Link`, `Tooltip`, `Popover`, `DropdownMenu` (required on a service)

A full-width `ToggleGroup` in the card header switches between Use existing and Create new. The project is an outlined `Item`: its name, a New `Tag` when it will be created, and its domains grouped by environment, the first one a small `Link` (`target="_blank"`, with its external glyph) under a `Tooltip` that says it opens in a new tab, the rest behind a `+N` `Tag` whose `Popover.Trigger` is named "N more domains" and opens a searchable `Popover` listing each domain as a `Link`. Never hand-roll the anchors. Change opens a `DropdownMenu` of the projects grouped by how they relate to the service.

### G. Environment — `RadioGroup`, `Tag` (required)

Choice cards, a `RadioGroup` with `variant="card"` and one item per environment of the project, each with one sentence on how it serves traffic and a small `Tag` such as Last used. The group carries an `aria-label`.

### H. Projects impacted and commit — `Item`, `Tag`, `Link`, `Tooltip`, `Popover`, `PanelFooter`, `Button` (required on a service)

Every project the chosen environment's shared Deployment Settings deploy to, grouped by environment, the current one tagged Selected, with its domains shown like the Project card. `PanelFooter` holds one primary medium `Button` reading Deploy on the right, of `type="submit"`. On its left, once a version differs from the live one, one muted line counts the changes and names the environment they go live in.

## Data

The block takes the deploy targets through props and emits every action; it fetches and deploys nothing. The record types (`DeployDrawerResource`, `DeployDrawerProjectGroup`, `DeployDrawerEnvironment`, `DeployDrawerImpact`, `DeployDrawerBuild`, `DeployDrawerValues`) and `DeployDrawerProps` are exported from `create-deploy-drawer.vue`, and `sample.ts` holds the sample records the Service drawer renders when they are left out (never while `loading` or `error` is set).

| Prop            | Type                          | What it does                                                                           |
| --------------- | ----------------------------- | -------------------------------------------------------------------------------------- |
| `resources`     | `DeployDrawerResource[]`      | The resources with their Ready versions and the dependencies they reference.           |
| `projectGroups` | `DeployDrawerProjectGroup[]`  | The projects Use existing offers, in groups.                                           |
| `newProject`    | `DeployDrawerProject`         | The project Create new makes.                                                          |
| `environments`  | `DeployDrawerEnvironment[]`   | The environments to go live in, the first selected by default.                         |
| `impacted`      | `DeployDrawerImpact[]`        | The projects the shared Deployment Settings reach, per environment.                    |
| `defaultValues` | `Partial<DeployDrawerValues>` | The versions, project and environment every open resets to.                            |
| `build`         | `DeployDrawerBuild`           | A build in progress: a Building row replaces Resources, the rest is inert, Deploy off. |
| `loading`       | `boolean`                     | The deploy targets are loading; `Skeleton` blocks, Deploy disabled.                    |
| `error`         | `string`                      | Why they failed to load, in a danger `Alert` with Retry; Deploy disabled.              |
| `v-model:open`  | `boolean`                     | Whether the drawer shows; the trigger opens it and Deploy closes it.                   |

| Event    | Payload           | When                                                                                     |
| -------- | ----------------- | ---------------------------------------------------------------------------------------- |
| `submit` | `(event, values)` | Deploy; `values` carry the picked version per resource, the project and the environment. |
| `retry`  | `(event)`         | Retry in the load error.                                                                 |

To go live, render the block from a page that owns the request and the deploy:

```vue
<script setup lang="ts">
  import CreateDeployDrawer, { type DeployDrawerValues } from './create-deploy-drawer.vue'

  const { data, pending, error, refresh } = useDeployTargets(serviceId)
  const { deploy } = useDeploy()
  const loadError = "The deploy targets couldn't be loaded. Check your connection and try again."
</script>

<template>
  <CreateDeployDrawer
    :resources="data?.resources ?? []"
    :project-groups="data?.projectGroups ?? []"
    :new-project="data?.newProject"
    :environments="data?.environments ?? []"
    :impacted="data?.impacted ?? []"
    :default-values="data?.defaults ?? {}"
    :loading="pending"
    :error="error ? loadError : ''"
    @retry="refresh"
    @submit="(_event, values: DeployDrawerValues) => deploy(values)"
  />
</template>
```

Then delete `sample.ts` and its import. The page reports the run through the toast (`state/state-async-submit`).

## Do

- Show every resource and dependency with the version that will go out, even when the user changes nothing.
- Preselect the last used project and environment, and say so with a tag.
- List every project a shared Deployment Setting reaches before the user deploys, not after.
- When no version is pinned, open as Build and deployment with a Building row, keep the other sections faded and `inert`, and disable Deploy until the build lands.
- On a project, warn with an `Alert` above the environments when its Deployment Settings also deploy elsewhere.
- Keep an environment that Strict Deployment Settings lock visible but disabled, with a Strict tag and one sentence naming the settings and the service they keep bound.
- Tag an environment Also deploys (warning) when the chosen environment's shared settings reach it, and say once, in a warning `Alert`, how many environments go live at once.
- Say in an info `Alert` when the deploy replaces another service on the chosen project, naming both.
- When a choice changes what the deploy reaches, reload that section in place: `Skeleton` rows, `aria-busy` on the region and one `role="status"` line; never clear the whole drawer.
- Tag a dependency other services reference as Shared, name them in a `Tooltip`, and say once that a shared dependency deploys at one version.
- Resolve the drawer in place: while the resources and environments load, keep the section titles and render `Skeleton` blocks shaped like the Resources card and the environment cards, with `aria-busy` and one status line, and Deploy disabled.
- When the targets fail to load, replace the sections with one danger `Alert` saying what failed and an outlined Retry; Deploy stays disabled.
- When the project has no environment, show the Environment section as a bordered small `EmptyState` with Add environment, and say in the footer why Deploy is disabled. A Resources card with nothing bound says so in one line instead of disappearing.
- When a dependency has no ready version, disable Deploy and say why in the footer, next to the button it disables.
- After Deploy, follow `state/state-async-submit`: the drawer closes and one toast per run turns from Deploying… into the outcome, with Edit (reopens the drawer with the same choices) and Redeploy.
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so this page body never renders a `Toaster`.

## Don't

- Don't deploy one service from a dialog, or ask for confirmation after Deploy; the drawer is the review. This is the one confirmation rule across the deploy surfaces: the surface that shows what goes live is the review, and nothing confirms it again. A release of several resources is reviewed on a page (`create/create-release-impact`, whose single `ConfirmDialog` states the reach); a dropped folder is reviewed in the Drop confirm of `create/create-deploy-progress-dialog`.
- Don't hide dependencies or impacted projects behind a second step.
- Don't let Change version list hundreds of versions at once; search plus Load more.
- Don't add a second commit such as Save as draft; one Deploy.
- Don't print the shared-settings warning on each impacted row; it belongs once, above them.
- Don't hide a locked environment, or let it be picked and fail at deploy time.
- Don't offer View deployments in the outcome toast; it carries Edit and Redeploy.

## Copy

- **Trigger, title, commit:** "Deploy" on all three; "Build and deployment" as the title only while a build runs first.
- **Section hints:** one sentence on what the section decides, e.g. "The project whose domains serve the service."
- **Version control:** "Change version", named "Change version of <resource>" for assistive technology; search placeholder and `aria-label` "Search versions"; footer "Load 10 more".
- **Project modes:** "Use existing" and "Create new".
- **Environment descriptions:** one sentence on how it serves, e.g. "Live traffic. One version serves the domain, and deploying replaces it."
- **Footer summary:** "1 change goes live in Production." or "3 changes go live in Production."
- **Load failure:** "The deploy targets for project-01 couldn't be loaded. Check your connection and try again." with "Retry".
- **No environment:** "No environment on this project", one sentence on why there is no target, and "Add environment"; footer "Add an environment to deploy."
- **Tags:** one or two words, e.g. "Ready", "Active", "Last used", "Selected", "New".
- **In progress:** the progressive verb with `…`, e.g. "Building…".
- **Run toast:** "Deploying web-app…" with "<version> to <environments>. It keeps running if you leave."; the outcome "web-app is live in Production." or "web-app wasn't deployed." with what failed and that nothing changed; actions "Edit" and "Redeploy".
- **Locks and reach:** "<settings> is Strict, so <service> stays bound to <environment>."; "Also deploys"; "<settings> is shared, so it deploys at one version."
- Follow `skills/webkit-microcopy`: Deploy, never publish or activate; sentence case; no em dash.

## Accessibility

- The drawer traps focus while open and returns it to the Deploy trigger on close.
- The `form` and the `ToggleGroup` carry `aria-label`s; the environment group is named by its `aria-label`.
- The version menu is a `role="menu"` moved with the arrow keys, each version a `menuitem` named by its version, author and age; the current one carries `aria-current`; search inputs have an `aria-label` that matches the placeholder.
- Each impacted environment group has an `aria-label` with its count, e.g. "Projects impacted in Production (3)".
- Faded sections during a build are `inert`, so keyboard users cannot reach controls that do nothing yet.
- A section that reloads carries `aria-busy="true"` with its `Skeleton` rows `aria-hidden`, and a `role="status"` line reads Loading the projects this deployment reaches, or Loading dependencies.
- A locked environment's radio is `disabled`; its reason is the card's description, so it is read with the choice.
- The Shared tag sits in a focusable wrapper so its `Tooltip` opens from the keyboard, and its name already says who else references it.
- A disabled Deploy is described by the footer line that explains why (`aria-describedby`).
- Run progress and outcome reach screen readers through the toast region, so the user hears them from any page.
- Glyphs in rows are decorative and carry `aria-hidden="true"`; tags give the state in words.

## States

- Service: a service deploying environment first (the records passed in, or the sample); Resources, Project with the last used project, Environment and Projects impacted, and the footer counting the one version change that goes live in Production.
- Building: no pinned version (`build` is set); titled Build and deployment with a Building row in place of Resources, the other sections faded and inert, Deploy disabled.
- ServiceProjectFirst: the project-first flow, its own SFC on the sample resources; Resources, the Project card with the last used project and a Change popover, then every environment.
- Project: deploying a project; its service and storage in Resources, Production and Preview, and a warning about other projects that share its storefront settings.
- Environment: a locked Strict environment, an Also deploys tag, the replace and multi-environment `Alert`s, Projects impacted grouped per environment and reloaded on switch; the run ends in a success toast with Edit and Redeploy.
- Loading: the resources and environments resolving (`loading` on the Service drawer; this variant shows the project drawer); `Skeleton` blocks under the Resources and Environment titles, an `aria-busy` region with a status line, Deploy disabled.
- LoadError: the deploy targets failed to load (`error` on the Service drawer, with `retry`; this variant shows the project drawer); a danger `Alert` with Retry, which reloads them as Skeletons, and Deploy disabled.
- NoEnvironment: nothing bound and no environment; a one-line empty Resources card, an `EmptyState` with Add environment, and Deploy disabled with the reason in the footer.
- Dependencies: the open Dependencies disclosure with a Shared dependency, a not-versioned integration and a dependency with no ready version that blocks Deploy; changing the service version reloads the list. The first run fails and its toast offers Edit and Redeploy; Redeploy succeeds.

## Related

- `create/create-drawer` — the drawer that creates items rather than deploying.
- `detail/detail-deployment-logs` — the run a deploy streams once it starts.
- `state/state-async-submit` — the toast and outcome rule every deploy started here follows.
- `detail/detail-deployment-logs` — the logs of a deploy after it ran.
- `detail/detail-version` — what a version contains before it is deployed.
- `create/create-resource-picker` — the Existing or New pattern the Project section follows.
- `SettingsGroup` — the band each section uses; see `skills/webkit-create-surface` for the drawer commit model.

## Variants

- `Service` — primary (the code below)
- `Building` — Deploy without a pinned version: the drawer opens as Build and deployment, a Building row with the new version and its elapsed seconds stands in for the Resources card, and the Project, Environment and Projects impacted sections stay faded and inert, with Deploy disabled, until the build lands.
- `ServiceProjectFirst` — The project-first flow: the same Resources card, a Project card with the last used project, its domain and a Change popover of the projects serving the service, then every environment as a radio block.
- `Project` — Deploy on a project: the Resources card with the service it serves and its dependencies, then its storage, which is not versioned; Production and Preview below, with a warning that shared-storefront also publishes to project-05 and project-09.
- `Environment` — The environment decision at its edges: Staging is locked by Strict Deployment Settings (a disabled choice card with a Strict tag and the reason), Preview is tagged Also deploys because Production's shared settings reach it, an info Alert says the deploy replaces legacy-web on the chosen project and a warning Alert says it goes live in two environments at once. Projects impacted are grouped per environment with a heading and a count, and switching environment reloads them with Skeleton rows, aria-busy and a status line. Deploy closes the drawer and reports through one toast that turns from Deploying… into the outcome with Edit and Redeploy.
- `Dependencies` — The Dependencies disclosure open: each module and integration with its own version and Change version menu, auth-gateway tagged Shared with a Tooltip naming the services that also reference it and one info Alert saying a shared dependency deploys at one version, payments-api not versioned (a note instead of the menu), and geo-redirect with no ready version, which disables Deploy with the reason in the footer. Changing the service version reloads the dependencies with Skeleton rows, aria-busy and a status line; a second resource that references nothing says so. The first run fails and its toast carries Edit and Redeploy; Redeploy succeeds.
- `Loading` — The drawer resolving what it deploys: Skeleton blocks stand in for the Resources card and the two environment choice cards under their real section titles, the region is aria-busy with one status line, and Deploy stays disabled until they land.
- `LoadError` — The deploy targets could not be loaded: a danger Alert says so in place of the sections, with an outlined Retry that reloads them as Skeletons; Deploy stays disabled.
- `NoEnvironment` — A project with nothing bound and no environment: the Resources card says nothing is bound yet, the Environment section is a bordered EmptyState with Add environment, and Deploy is disabled with the reason beside it in the footer.

Each variant is the same screen in another state: `get_block("create/create-deploy-drawer", { variant })`, or the file under `blocks/create/create-deploy-drawer/variants/`.

## Code (`Service`)

```vue
<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Popover from '@aziontech/webkit/popover'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import Separator from '@aziontech/webkit/separator'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

  import {
    sampleDefaultValues,
    sampleEnvironments,
    sampleImpacted,
    sampleNewProject,
    sampleProjectGroups,
    sampleResources
  } from './sample'

  /** One Ready version of a resource. */
  export interface DeployDrawerVersion {
    /** Stable key, the version id. */
    id: string
    /** The version name. */
    name: string
    /** Who built it. */
    author: string
    /** When it was built, already phrased (1 day ago). */
    createdAgo: string
    /** Whether it is the version live now. */
    active?: boolean
  }

  /** A resource the deployment sends live, or one it references. */
  export interface DeployDrawerDependency {
    /** Stable key; picked versions are keyed by it. */
    key: string
    /** The kind of resource (Service, Module, Integration). */
    label: string
    /** The resource name. */
    name: string
    /** The kind glyph, an icon class. */
    icon: string
    /** A note shown instead of the version picker; empty for a pickable resource. */
    note: string
    /** How many Ready versions exist; the list may hold only the most recent. */
    total: number
    /** The most recent Ready versions, newest first. */
    versions: DeployDrawerVersion[]
  }

  /** A top-level resource with the resources it references. */
  export interface DeployDrawerResource extends DeployDrawerDependency {
    /** Whether the project owns it. */
    owner: boolean
    /** The modules and integrations it references. */
    dependencies: DeployDrawerDependency[]
  }

  /** The domains of a project in one environment. */
  export interface DeployDrawerDomainGroup {
    /** The environment they answer in. */
    environment: string
    /** How many domains there are. */
    total: number
    /** The count, already phrased (10 of 22 domains). */
    summary: string
    /** The first domains. */
    domains: string[]
  }

  /** A project the deployment can go live on. */
  export interface DeployDrawerProject {
    /** Stable key; absent for the project Create new makes. */
    id?: string
    /** The project name. */
    name: string
    /** The domain a new project answers on. */
    domain?: string
    /** One line on what the project serves. */
    detail?: string
    /** Its domains per environment. */
    domains?: DeployDrawerDomainGroup[]
  }

  /** A project that already exists. */
  export interface DeployDrawerExistingProject extends DeployDrawerProject {
    /** Stable key. */
    id: string
  }

  /** A group of projects in the project picker. */
  export interface DeployDrawerProjectGroup {
    /** Stable key. */
    key: string
    /** The group heading. */
    label: string
    /** The projects in it. */
    projects: DeployDrawerExistingProject[]
  }

  /** An environment the deployment can go live in. */
  export interface DeployDrawerEnvironment {
    /** The environment name, also its value. */
    name: string
    /** One sentence on what deploying there does. */
    description: string
    /** A short tag beside the name (Last used); empty for none. */
    tag: string
  }

  /** A project the deployment reaches through shared Deployment Settings. */
  export interface DeployDrawerImpactedProject {
    /** Stable key. */
    id: string
    /** The project name. */
    name: string
    /** Whether it is the project picked above. */
    selected?: boolean
    /** Its domains per environment. */
    domains: DeployDrawerDomainGroup[]
  }

  /** The projects reached in one environment. */
  export interface DeployDrawerImpact {
    /** The environment name. */
    environment: string
    /** The projects reached there. */
    projects: DeployDrawerImpactedProject[]
  }

  /** A build in progress before the deployment can go live. */
  export interface DeployDrawerBuild {
    /** The resource being built. */
    name: string
    /** The version being built. */
    version: string
    /** Seconds since the build started. */
    elapsed: number
  }

  /** Whether the deployment uses an existing project or creates one. */
  export type DeployDrawerProjectMode = 'existing' | 'new'

  /** What the form holds, and what submit sends. */
  export interface DeployDrawerValues {
    /** The picked version id per resource key. */
    versions: Record<string, string>
    /** Use an existing project or create one. */
    projectMode: DeployDrawerProjectMode
    /** The existing project picked. */
    projectId: string
    /** The environment it goes live in. */
    environment: string
  }

  export interface DeployDrawerProps {
    /** The resources and their dependencies. Left out, the sample renders. */
    resources?: DeployDrawerResource[]
    /** The projects to pick from, in groups. Left out, the sample renders. */
    projectGroups?: DeployDrawerProjectGroup[]
    /** The project Create new makes. Left out, the sample renders. */
    newProject?: DeployDrawerProject
    /** The environments to go live in. Left out, the sample renders. */
    environments?: DeployDrawerEnvironment[]
    /** The projects reached through shared Deployment Settings. Left out, the sample renders. */
    impacted?: DeployDrawerImpact[]
    /** The values the form opens with; every open resets to them. */
    defaultValues?: Partial<DeployDrawerValues>
    /** A build in progress: it replaces the resources and the rest waits, inert. */
    build?: DeployDrawerBuild
    /** The deploy targets are loading; skeletons stand in for the sections. */
    loading?: boolean
    /** Why the deploy targets could not load; a danger alert with Retry replaces the sections. */
    error?: string
  }

  const props = withDefaults(defineProps<DeployDrawerProps>(), {
    resources: undefined,
    projectGroups: undefined,
    newProject: undefined,
    environments: undefined,
    impacted: undefined,
    defaultValues: undefined,
    build: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: DeployDrawerValues]
    retry: [event: MouseEvent]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  const pending = computed(() => props.loading || props.error !== '')
  const resources = computed<DeployDrawerResource[]>(
    () => props.resources ?? (pending.value ? [] : sampleResources)
  )
  const projectGroups = computed<DeployDrawerProjectGroup[]>(
    () => props.projectGroups ?? (pending.value ? [] : sampleProjectGroups)
  )
  const newProject = computed<DeployDrawerProject>(
    () => props.newProject ?? (pending.value ? { name: '' } : sampleNewProject)
  )
  const environmentChoices = computed<DeployDrawerEnvironment[]>(
    () => props.environments ?? (pending.value ? [] : sampleEnvironments)
  )
  const impacted = computed<DeployDrawerImpact[]>(
    () => props.impacted ?? (pending.value ? [] : sampleImpacted)
  )
  const initial = computed<DeployDrawerValues>(() => ({
    versions: {},
    projectMode: 'existing',
    projectId: '',
    environment: environmentChoices.value[0]?.name ?? '',
    ...(props.defaultValues ?? (props.resources ? {} : sampleDefaultValues))
  }))

  const projectModes = [
    { value: 'existing', label: 'Use existing' },
    { value: 'new', label: 'Create new' }
  ]

  type Dependency = DeployDrawerDependency
  type ProjectView = DeployDrawerProject

  const picks = reactive<Record<string, string>>({ ...initial.value.versions })
  const versionOpen = reactive<Record<string, boolean>>({})
  const projectMode = ref<DeployDrawerProjectMode>(initial.value.projectMode)
  const projectId = ref(initial.value.projectId)
  const environment = ref(initial.value.environment)

  const project = computed<ProjectView>(() =>
    projectMode.value === 'new'
      ? newProject.value
      : (projectGroups.value
          .flatMap((group) => group.projects)
          .find((entry) => entry.id === projectId.value) ??
        projectGroups.value[0]?.projects[0] ?? { name: '' })
  )

  const versionOf = (row: Dependency) =>
    row.versions.find((entry) => entry.id === picks[row.key]) ?? row.versions[0]

  const versionSummary = (row: Dependency) =>
    row.total > row.versions.length
      ? `${row.versions.length} of ${row.total} Ready versions`
      : `${row.total} Ready versions`

  const liveVersionId = (row: Dependency) =>
    (row.versions.find((entry) => entry.active) ?? row.versions[0])?.id ?? ''

  const changeCount = computed(
    () =>
      resources.value
        .flatMap((row) => [row, ...row.dependencies])
        .filter((row) => row.versions.length && versionOf(row).id !== liveVersionId(row)).length
  )

  const changeSummary = computed(
    () =>
      `${changeCount.value} ${changeCount.value === 1 ? 'change goes' : 'changes go'} live in ${environment.value}.`
  )

  const pickVersion = (row: Dependency, id: string) => {
    picks[row.key] = id
    versionOpen[row.key] = false
  }

  const reset = () => {
    const values = initial.value
    Object.keys(picks).forEach((key) => delete picks[key])
    Object.assign(picks, values.versions)
    Object.keys(versionOpen).forEach((key) => delete versionOpen[key])
    projectMode.value = values.projectMode
    projectId.value = values.projectId
    environment.value = values.environment
  }

  watch(open, (isOpen) => {
    if (isOpen) reset()
  })

  const blocked = computed(() => pending.value || !!props.build)

  const title = computed(() => (props.build ? 'Build and deployment' : 'Deploy'))

  const submit = (event: Event) => {
    if (blocked.value) return
    emit('submit', event, {
      versions: Object.fromEntries(
        resources.value
          .flatMap((row) => [row, ...row.dependencies])
          .filter((row) => row.versions.length)
          .map((row) => [row.key, versionOf(row).id])
      ),
      projectMode: projectMode.value,
      projectId: project.value.id ?? '',
      environment: environment.value
    })
    open.value = false
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerTrigger>
      <Button
        label="Deploy"
        variant="outline"
        size="medium"
        icon="az az-cloud-upload"
      />
    </DrawerTrigger>

    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="title"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>{{ title }}</DrawerTitle>
          </div>
        </PanelHeader>

        <PanelBody>
          <div
            v-if="loading"
            class="flex min-w-0 flex-col"
            aria-busy="true"
          >
            <SettingsGroup
              label="Resources"
              hint="The service version this deployment sends live, and the version of every module and integration it references."
            >
              <div aria-hidden="true">
                <Skeleton height="var(--size-40)" />
              </div>
            </SettingsGroup>

            <SettingsGroup
              label="Environment"
              hint="Where the deployment goes live, from the environments this project serves. Each one goes live with the Deployment Settings set on the project."
            >
              <div
                class="flex min-w-0 flex-col gap-(--spacing-xs)"
                aria-hidden="true"
              >
                <Skeleton
                  v-for="row in 2"
                  :key="row"
                  height="var(--size-16)"
                />
              </div>
            </SettingsGroup>

            <span
              class="sr-only"
              role="status"
            >
              Loading the resources and environments for this deployment.
            </span>
          </div>

          <SettingsGroup
            v-else-if="error"
            label="Deploy targets"
          >
            <div class="flex min-w-0 flex-col items-start gap-(--spacing-sm)">
              <Alert
                severity="danger"
                :label="error"
              />
              <Button
                label="Retry"
                variant="outline"
                size="small"
                icon="az az-refresh"
                @click="(event: MouseEvent) => emit('retry', event)"
              />
            </div>
          </SettingsGroup>

          <fieldset
            v-else
            class="m-0 flex min-w-0 flex-col border-0 p-0"
          >
            <legend class="sr-only">{{ title }}</legend>
            <SettingsGroup
              label="Resources"
              hint="The service version this deployment sends live, and the version of every module and integration it references."
            >
              <Item
                v-if="build"
                variant="outline"
                size="small"
                aria-live="polite"
              >
                <Item.Media>
                  <span
                    class="flex size-7 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                  >
                    <i
                      class="az az-server text-body-xs text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                </Item.Media>
                <Item.Content>
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <Item.Title>{{ build.name }}</Item.Title>
                    <Tag
                      :label="build.version"
                      severity="neutral"
                      size="small"
                      class="shrink-0"
                    />
                  </span>
                  <Item.Description>Building…</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <span
                    class="font-(family-name:--font-code) text-label-sm tabular-nums text-(--text-muted)"
                  >
                    {{ build.elapsed }} s
                  </span>
                  <div class="contents text-(--text-default)">
                    <Spinner class="shrink-0" />
                  </div>
                </Item.Actions>
              </Item>
              <Card
                v-else
                :padded="false"
              >
                <template #default>
                  <template
                    v-for="(row, index) in resources"
                    :key="row.key"
                  >
                    <Separator v-if="index" />
                    <Item
                      variant="inline"
                      size="small"
                    >
                      <Item.Media>
                        <span
                          class="flex size-7 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                        >
                          <i
                            :class="row.icon"
                            class="text-body-xs text-(--text-default)"
                            aria-hidden="true"
                          />
                        </span>
                      </Item.Media>
                      <Item.Content>
                        <span class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                          <span class="shrink-0 text-body-sm text-(--text-muted)">
                            {{ row.label }}
                          </span>
                          <Item.Title>{{ row.name }}</Item.Title>
                          <Tag
                            v-if="!row.note"
                            :label="row.versions.length ? 'Ready' : 'No ready version'"
                            :severity="row.versions.length ? 'success' : 'warning'"
                            size="small"
                            class="shrink-0"
                          />
                        </span>
                        <Item.Description>
                          {{ row.note || versionOf(row).name }}
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions
                        v-if="!row.note"
                        class="basis-full sm:basis-auto"
                      >
                        <DropdownMenu
                          v-model:open="versionOpen[row.key]"
                          side="bottom"
                          align="end"
                          @select="(_event, id) => pickVersion(row, String(id))"
                        >
                          <DropdownMenu.Trigger>
                            <Button
                              label="Change version"
                              :aria-label="`Change version of ${row.name}`"
                              variant="outline"
                              size="small"
                              icon="az az-chevron-down"
                              icon-position="trailing"
                              :disabled="!row.versions.length"
                            />
                          </DropdownMenu.Trigger>
                          <template #header>
                            <div
                              class="flex flex-col gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-xs)"
                            >
                              <p class="text-label-sm text-(--text-muted)">
                                {{ versionSummary(row) }}
                              </p>
                              <Input
                                v-if="row.total > row.versions.length"
                                size="medium"
                                placeholder="Search versions"
                                aria-label="Search versions"
                              >
                                <template #leading>
                                  <i
                                    class="az az-search"
                                    aria-hidden="true"
                                  />
                                </template>
                              </Input>
                            </div>
                          </template>
                          <DropdownMenu.Group>
                            <DropdownMenu.Item
                              v-for="entry in row.versions"
                              :key="entry.id"
                              :value="entry.id"
                              :label="entry.name"
                              :selected="entry.id === versionOf(row).id"
                              :aria-label="`${entry.name}${entry.active ? ', active' : ''}, by ${entry.author}, ${entry.createdAgo}`"
                            >
                              <template #leading>
                                <Avatar
                                  :alt="entry.author"
                                  :label="entry.author"
                                  size="small"
                                  variant="square"
                                />
                              </template>
                              <span class="inline-flex min-w-0 items-center gap-(--spacing-xs)">
                                <span class="truncate">{{ entry.name }}</span>
                                <Tag
                                  v-if="entry.active"
                                  label="Active"
                                  severity="success"
                                  size="small"
                                  class="shrink-0"
                                />
                              </span>
                              <template #trailing>
                                <span class="text-body-xs text-(--text-muted)">{{
                                  entry.createdAgo
                                }}</span>
                              </template>
                            </DropdownMenu.Item>
                          </DropdownMenu.Group>
                          <template
                            v-if="row.total > row.versions.length"
                            #bottom
                          >
                            <div
                              class="border-t border-(--border-default) px-(--spacing-2xs) pt-(--spacing-2xs)"
                            >
                              <Button
                                :label="`Load ${Math.min(row.versions.length, row.total - row.versions.length)} more`"
                                variant="ghost"
                                size="small"
                                class="w-full"
                              />
                            </div>
                          </template>
                        </DropdownMenu>
                      </Item.Actions>
                    </Item>
                    <template v-if="row.owner">
                      <Separator />
                      <Accordion
                        type="single"
                        collapsible
                        size="medium"
                      >
                        <Accordion.Item value="dependencies">
                          <Accordion.Trigger>
                            <span class="text-label-sm text-(--text-default)">Dependencies</span>
                          </Accordion.Trigger>
                          <Accordion.Content>
                            <div class="min-w-0">
                              <p
                                v-if="!row.dependencies.length"
                                class="text-body-sm text-(--text-muted)"
                              >
                                {{ row.name }} references no other resources.
                              </p>
                              <Item.Group v-else>
                                <Item
                                  v-for="dependency in row.dependencies"
                                  :key="dependency.key"
                                  variant="inline"
                                  size="small"
                                >
                                  <Item.Media>
                                    <span class="flex size-5 items-center justify-center">
                                      <i
                                        :class="dependency.icon"
                                        class="text-body-xs text-(--text-muted)"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </Item.Media>
                                  <Item.Content>
                                    <span
                                      class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
                                    >
                                      <span class="shrink-0 text-body-sm text-(--text-muted)">
                                        {{ dependency.label }}
                                      </span>
                                      <Item.Title>{{ dependency.name }}</Item.Title>
                                      <Tag
                                        v-if="!dependency.note"
                                        :label="
                                          dependency.versions.length ? 'Ready' : 'No ready version'
                                        "
                                        :severity="
                                          dependency.versions.length ? 'success' : 'warning'
                                        "
                                        size="small"
                                        class="shrink-0"
                                      />
                                    </span>
                                    <Item.Description>
                                      {{ dependency.note || versionOf(dependency).name }}
                                    </Item.Description>
                                  </Item.Content>
                                  <Item.Actions v-if="!dependency.note">
                                    <DropdownMenu
                                      v-model:open="versionOpen[dependency.key]"
                                      side="bottom"
                                      align="end"
                                      @select="(_event, id) => pickVersion(dependency, String(id))"
                                    >
                                      <DropdownMenu.Trigger>
                                        <Button
                                          label="Change version"
                                          :aria-label="`Change version of ${dependency.name}`"
                                          variant="outline"
                                          size="small"
                                          icon="az az-chevron-down"
                                          icon-position="trailing"
                                          :disabled="!dependency.versions.length"
                                        />
                                      </DropdownMenu.Trigger>
                                      <template #header>
                                        <div
                                          class="flex flex-col gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-xs)"
                                        >
                                          <p class="text-label-sm text-(--text-muted)">
                                            {{ versionSummary(dependency) }}
                                          </p>
                                          <Input
                                            v-if="dependency.total > dependency.versions.length"
                                            size="medium"
                                            placeholder="Search versions"
                                            aria-label="Search versions"
                                          >
                                            <template #leading>
                                              <i
                                                class="az az-search"
                                                aria-hidden="true"
                                              />
                                            </template>
                                          </Input>
                                        </div>
                                      </template>
                                      <DropdownMenu.Group>
                                        <DropdownMenu.Item
                                          v-for="entry in dependency.versions"
                                          :key="entry.id"
                                          :value="entry.id"
                                          :label="entry.name"
                                          :selected="entry.id === versionOf(dependency).id"
                                          :aria-label="`${entry.name}${entry.active ? ', active' : ''}, by ${entry.author}, ${entry.createdAgo}`"
                                        >
                                          <template #leading>
                                            <Avatar
                                              :alt="entry.author"
                                              :label="entry.author"
                                              size="small"
                                              variant="square"
                                            />
                                          </template>
                                          <span
                                            class="inline-flex min-w-0 items-center gap-(--spacing-xs)"
                                          >
                                            <span class="truncate">{{ entry.name }}</span>
                                            <Tag
                                              v-if="entry.active"
                                              label="Active"
                                              severity="success"
                                              size="small"
                                              class="shrink-0"
                                            />
                                          </span>
                                          <template #trailing>
                                            <span class="text-body-xs text-(--text-muted)">{{
                                              entry.createdAgo
                                            }}</span>
                                          </template>
                                        </DropdownMenu.Item>
                                      </DropdownMenu.Group>
                                      <template
                                        v-if="dependency.total > dependency.versions.length"
                                        #bottom
                                      >
                                        <div
                                          class="border-t border-(--border-default) px-(--spacing-2xs) pt-(--spacing-2xs)"
                                        >
                                          <Button
                                            :label="`Load ${Math.min(dependency.versions.length, dependency.total - dependency.versions.length)} more`"
                                            variant="ghost"
                                            size="small"
                                            class="w-full"
                                          />
                                        </div>
                                      </template>
                                    </DropdownMenu>
                                  </Item.Actions>
                                </Item>
                              </Item.Group>
                              <span
                                class="sr-only"
                                role="status"
                              />
                            </div>
                          </Accordion.Content>
                        </Accordion.Item>
                      </Accordion>
                    </template>
                  </template>
                </template>
              </Card>
            </SettingsGroup>

            <SettingsGroup
              :inert="!!build || undefined"
              :data-pending="build ? 'true' : undefined"
              label="Project"
              hint="The project whose domains serve the service. Create one to deploy it on a new domain."
            >
              <Card :padded="false">
                <template #header>
                  <ToggleGroup
                    v-model="projectMode"
                    :options="projectModes"
                    size="medium"
                    fluid
                    aria-label="Project"
                    class="w-full"
                  />
                </template>
                <template #default>
                  <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-lg)">
                    <Item
                      variant="outline"
                      size="small"
                    >
                      <Item.Media>
                        <span
                          class="flex size-7 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                        >
                          <i
                            class="az az-box text-body-xs text-(--text-default)"
                            aria-hidden="true"
                          />
                        </span>
                      </Item.Media>
                      <Item.Content>
                        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                          <Item.Title>{{ project.name }}</Item.Title>
                          <Tag
                            v-if="projectMode === 'new'"
                            label="New"
                            severity="success"
                            size="small"
                            class="shrink-0"
                          />
                        </span>
                        <Item.Description v-if="projectMode === 'new'">
                          Gets its domains on the first deploy.
                        </Item.Description>
                        <ul
                          v-else
                          class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-2xs) p-0"
                        >
                          <li
                            v-for="domainGroup in project.domains"
                            :key="domainGroup.environment"
                            class="flex min-w-0 items-center gap-(--spacing-xs)"
                          >
                            <Tag
                              :label="domainGroup.environment"
                              severity="neutral"
                              size="small"
                              class="shrink-0"
                            />
                            <div class="flex min-w-0">
                              <Tooltip
                                :content="`Open ${domainGroup.domains[0]} in a new tab`"
                                class="w-full"
                              >
                                <Link
                                  class="max-w-full"
                                  :href="`https://${domainGroup.domains[0]}`"
                                  target="_blank"
                                  size="small"
                                >
                                  <span class="grid grid-cols-1">
                                    <span class="truncate">{{ domainGroup.domains[0] }}</span>
                                  </span>
                                </Link>
                              </Tooltip>
                            </div>
                            <Popover
                              v-if="domainGroup.total > 1"
                              side="bottom"
                              align="start"
                              size="small"
                            >
                              <Popover.Trigger
                                :aria-label="`${domainGroup.total - 1} more domains`"
                              >
                                <div class="shrink-0 cursor-pointer">
                                  <Tag
                                    :label="`+${domainGroup.total - 1}`"
                                    severity="neutral"
                                    size="small"
                                  />
                                </div>
                              </Popover.Trigger>
                              <Popover.Content>
                                <div
                                  class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
                                >
                                  <p class="text-label-sm text-(--text-muted)">
                                    {{ domainGroup.summary }}
                                  </p>
                                  <Input
                                    v-if="domainGroup.total > 10"
                                    size="medium"
                                    placeholder="Search domains"
                                    aria-label="Search domains"
                                  >
                                    <template #leading>
                                      <i
                                        class="az az-search"
                                        aria-hidden="true"
                                      />
                                    </template>
                                  </Input>
                                </div>

                                <div
                                  class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-2xs)"
                                >
                                  <div
                                    v-for="domain in domainGroup.domains"
                                    :key="domain"
                                    class="flex min-w-0 px-(--spacing-xs) py-(--spacing-2xs)"
                                  >
                                    <Link
                                      :label="domain"
                                      :href="`https://${domain}`"
                                      target="_blank"
                                      size="small"
                                    />
                                  </div>
                                </div>

                                <div
                                  v-if="domainGroup.total > domainGroup.domains.length"
                                  class="border-t border-(--border-default) p-(--spacing-2xs)"
                                >
                                  <Button
                                    :label="`Load ${Math.min(10, domainGroup.total - domainGroup.domains.length)} more`"
                                    variant="ghost"
                                    size="small"
                                    class="w-full"
                                  />
                                </div>

                                <span
                                  class="sr-only"
                                  role="status"
                                >
                                  {{ domainGroup.summary }}
                                </span>
                              </Popover.Content>
                            </Popover>
                          </li>
                        </ul>
                      </Item.Content>
                      <Item.Actions
                        v-if="projectMode === 'existing'"
                        class="basis-full sm:basis-auto"
                      >
                        <DropdownMenu
                          side="bottom"
                          align="end"
                          @select="(_event, id) => (projectId = String(id))"
                        >
                          <DropdownMenu.Trigger>
                            <Button
                              label="Change"
                              variant="outline"
                              size="small"
                              icon="az az-chevron-down"
                              icon-position="trailing"
                            />
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Group
                            v-for="group in projectGroups"
                            :key="group.key"
                            :label="group.label"
                          >
                            <DropdownMenu.Item
                              v-for="entry in group.projects"
                              :key="entry.id"
                              :value="entry.id"
                              :label="entry.name"
                              :selected="entry.id === project.id"
                            >
                              <template #trailing>
                                <span class="truncate text-body-xs text-(--text-muted)">
                                  {{ entry.detail }}
                                </span>
                              </template>
                            </DropdownMenu.Item>
                          </DropdownMenu.Group>
                        </DropdownMenu>
                      </Item.Actions>
                    </Item>
                  </div>
                </template>
              </Card>
            </SettingsGroup>

            <SettingsGroup
              :inert="!!build || undefined"
              :data-pending="build ? 'true' : undefined"
              label="Environment"
              hint="Where the deployment goes live, from the environments this project serves. Each one goes live with the Deployment Settings set on the project."
            >
              <RadioGroup
                v-model="environment"
                variant="card"
                name="service-deploy-environment"
                aria-label="Environment"
              >
                <RadioGroup.Item
                  v-for="entry in environmentChoices"
                  :key="entry.name"
                  :value="entry.name"
                  :description="entry.description"
                >
                  {{ entry.name }}
                  <template
                    v-if="entry.tag"
                    #tag
                  >
                    <Tag
                      :label="entry.tag"
                      severity="info"
                      size="small"
                    />
                  </template>
                </RadioGroup.Item>
              </RadioGroup>
            </SettingsGroup>

            <SettingsGroup
              :inert="!!build || undefined"
              :data-pending="build ? 'true' : undefined"
              label="Projects impacted"
              hint="This environment deploys with shared Deployment Settings, so the deployment reaches every project below, in every environment they are linked to, and the domains they serve."
            >
              <div class="flex min-w-0 flex-col gap-(--spacing-md)">
                <div
                  v-for="group in impacted"
                  :key="group.environment"
                  class="flex min-w-0 flex-col gap-(--spacing-xs)"
                >
                  <ul
                    class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-xs) p-0"
                    :aria-label="`Projects impacted in ${group.environment} (${group.projects.length})`"
                  >
                    <li
                      v-for="target in group.projects"
                      :key="target.id"
                      class="min-w-0"
                    >
                      <Item
                        variant="outline"
                        size="small"
                      >
                        <Item.Media>
                          <span
                            class="flex size-7 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                          >
                            <i
                              class="az az-box text-body-xs text-(--text-default)"
                              aria-hidden="true"
                            />
                          </span>
                        </Item.Media>
                        <Item.Content>
                          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <Item.Title>{{ target.name }}</Item.Title>
                            <Tag
                              v-if="target.selected"
                              label="Selected"
                              severity="neutral"
                              size="small"
                              class="shrink-0"
                            />
                          </span>
                          <ul class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-2xs) p-0">
                            <li
                              v-for="domainGroup in target.domains"
                              :key="domainGroup.environment"
                              class="flex min-w-0 items-center gap-(--spacing-xs)"
                            >
                              <Tag
                                :label="domainGroup.environment"
                                severity="neutral"
                                size="small"
                                class="shrink-0"
                              />
                              <div class="flex min-w-0">
                                <Tooltip
                                  :content="`Open ${domainGroup.domains[0]} in a new tab`"
                                  class="w-full"
                                >
                                  <Link
                                    class="max-w-full"
                                    :href="`https://${domainGroup.domains[0]}`"
                                    target="_blank"
                                    size="small"
                                  >
                                    <span class="grid grid-cols-1">
                                      <span class="truncate">{{ domainGroup.domains[0] }}</span>
                                    </span>
                                  </Link>
                                </Tooltip>
                              </div>
                              <Popover
                                v-if="domainGroup.total > 1"
                                side="bottom"
                                align="start"
                                size="small"
                              >
                                <Popover.Trigger
                                  :aria-label="`${domainGroup.total - 1} more domains`"
                                >
                                  <div class="shrink-0 cursor-pointer">
                                    <Tag
                                      :label="`+${domainGroup.total - 1}`"
                                      severity="neutral"
                                      size="small"
                                    />
                                  </div>
                                </Popover.Trigger>
                                <Popover.Content>
                                  <div
                                    class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
                                  >
                                    <p class="text-label-sm text-(--text-muted)">
                                      {{ domainGroup.summary }}
                                    </p>
                                    <Input
                                      v-if="domainGroup.total > 10"
                                      size="medium"
                                      placeholder="Search domains"
                                      aria-label="Search domains"
                                    >
                                      <template #leading>
                                        <i
                                          class="az az-search"
                                          aria-hidden="true"
                                        />
                                      </template>
                                    </Input>
                                  </div>

                                  <div
                                    class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-2xs)"
                                  >
                                    <div
                                      v-for="domain in domainGroup.domains"
                                      :key="domain"
                                      class="flex min-w-0 px-(--spacing-xs) py-(--spacing-2xs)"
                                    >
                                      <Link
                                        :label="domain"
                                        :href="`https://${domain}`"
                                        target="_blank"
                                        size="small"
                                      />
                                    </div>
                                  </div>

                                  <div
                                    v-if="domainGroup.total > domainGroup.domains.length"
                                    class="border-t border-(--border-default) p-(--spacing-2xs)"
                                  >
                                    <Button
                                      :label="`Load ${Math.min(10, domainGroup.total - domainGroup.domains.length)} more`"
                                      variant="ghost"
                                      size="small"
                                      class="w-full"
                                    />
                                  </div>

                                  <span
                                    class="sr-only"
                                    role="status"
                                  >
                                    {{ domainGroup.summary }}
                                  </span>
                                </Popover.Content>
                              </Popover>
                            </li>
                          </ul>
                        </Item.Content>
                      </Item>
                    </li>
                  </ul>
                </div>
              </div>
            </SettingsGroup>

            <span
              class="sr-only"
              role="status"
            />
          </fieldset>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
            <p
              v-if="changeCount && !build"
              class="flex min-w-0 items-center gap-(--spacing-2xs) text-body-xs text-(--text-muted)"
            >
              <i
                class="az az-circle-info shrink-0"
                aria-hidden="true"
              />
              <span class="truncate">{{ changeSummary }}</span>
            </p>
            <span v-else />
            <Button
              label="Deploy"
              variant="primary"
              size="medium"
              :disabled="blocked"
              type="submit"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
```

## `sample.ts`

```ts
import type {
  DeployDrawerEnvironment,
  DeployDrawerImpact,
  DeployDrawerProject,
  DeployDrawerProjectGroup,
  DeployDrawerResource,
  DeployDrawerValues
} from './create-deploy-drawer.vue'

export const sampleResources: DeployDrawerResource[] = [
  {
    key: 'service',
    label: 'Service',
    name: 'web-app',
    icon: 'az az-server',
    note: '',
    total: 6,
    versions: [
      {
        id: 'AEO25I38',
        name: 'AEO25I38',
        author: 'Sam Lee',
        createdAgo: '1 day ago',
        active: true
      },
      {
        id: 'AG1VVDJP',
        name: 'AG1VVDJP',
        author: 'Priya Patel',
        createdAgo: '3 days ago'
      },
      {
        id: 'AHFPL906',
        name: 'AHFPL906',
        author: 'Chris Taylor',
        createdAgo: '3 days ago'
      },
      { id: 'AITJB4GN', name: 'AITJB4GN', author: 'Riley Carter', createdAgo: '4 days ago' },
      {
        id: 'AK7D0ZX4',
        name: 'AK7D0ZX4',
        author: 'Ethan Brooks',
        createdAgo: '6 days ago'
      }
    ],
    owner: true,
    dependencies: [
      {
        key: 'service@AG1VVDJP:module-auth-gateway',
        label: 'Module',
        name: 'auth-gateway',
        icon: 'az az-code',
        note: '',
        total: 8,
        versions: [
          {
            id: 'APICRFV0',
            name: 'APICRFV0',
            author: 'Sam Lee',
            createdAgo: '2 days ago'
          },
          {
            id: 'AQW6HBBH',
            name: 'AQW6HBBH',
            author: 'Priya Patel',
            createdAgo: '3 days ago'
          },
          {
            id: 'ASA076RY',
            name: 'ASA076RY',
            author: 'Chris Taylor',
            createdAgo: '5 days ago'
          },
          {
            id: 'ATNTX28F',
            name: 'ATNTX28F',
            author: 'Riley Carter',
            createdAgo: '5 days ago'
          },
          {
            id: 'AV1NMXOW',
            name: 'AV1NMXOW',
            author: 'Ethan Brooks',
            createdAgo: '6 days ago'
          }
        ]
      },
      {
        key: 'service@AG1VVDJP:module-geo-redirect',
        label: 'Module',
        name: 'geo-redirect',
        icon: 'az az-code',
        note: '',
        total: 11,
        versions: [
          {
            id: 'AK16MQ4R',
            name: 'AK16MQ4R',
            author: 'John Smith',
            createdAgo: '2 days ago'
          },
          {
            id: 'ALF0CLL8',
            name: 'ALF0CLL8',
            author: 'Sam Lee',
            createdAgo: '4 days ago'
          },
          {
            id: 'AMSU2H1P',
            name: 'AMSU2H1P',
            author: 'Priya Patel',
            createdAgo: '4 days ago'
          },
          {
            id: 'AO6NSCI6',
            name: 'AO6NSCI6',
            author: 'Chris Taylor',
            createdAgo: '6 days ago'
          },
          {
            id: 'APKHI7YN',
            name: 'APKHI7YN',
            author: 'Riley Carter',
            createdAgo: '6 days ago'
          }
        ]
      },
      {
        key: 'service@AG1VVDJP:integration-payments-api',
        label: 'Integration',
        name: 'payments-api',
        icon: 'az az-link',
        note: '',
        total: 11,
        versions: [
          {
            id: 'ASEKWJQF',
            name: 'ASEKWJQF',
            author: 'Riley Carter',
            createdAgo: '21 hours ago'
          },
          {
            id: 'ATSEMF6W',
            name: 'ATSEMF6W',
            author: 'Ethan Brooks',
            createdAgo: '2 days ago'
          },
          {
            id: 'AV68CAND',
            name: 'AV68CAND',
            author: 'Jordan Kim',
            createdAgo: '2 days ago'
          },
          {
            id: 'AWK2263U',
            name: 'AWK2263U',
            author: 'Taylor Reed',
            createdAgo: '3 days ago'
          },
          {
            id: 'AXXVS1KB',
            name: 'AXXVS1KB',
            author: 'John Smith',
            createdAgo: '5 days ago'
          }
        ]
      }
    ]
  }
]

export const sampleNewProject: DeployDrawerProject = {
  name: 'web-app',
  domain: 'web-app.example.com'
}

export const sampleProjectGroups: DeployDrawerProjectGroup[] = [
  {
    key: 'serving',
    label: 'Serving web-app',
    projects: [
      {
        id: '1020655',
        name: 'project-01',
        detail: '2 environments',
        domains: [
          {
            environment: 'Production',
            total: 8,
            summary: '8 domains',
            domains: [
              'project-1.example.com',
              'project-1-alias-1.example.com',
              'project-1-alias-2.example.com',
              'project-1-alias-3.example.com',
              'project-1-alias-4.example.com',
              'project-1-alias-5.example.com',
              'project-1-alias-6.example.com',
              'project-1-alias-7.example.com'
            ]
          }
        ]
      }
    ]
  },
  {
    key: 'flexible',
    label: 'Flexible',
    projects: [
      {
        id: '1031410004',
        name: 'campaign-landing',
        detail: 'Serves black-friday-2025',
        domains: [
          {
            environment: 'Production',
            total: 1,
            summary: '1 domains',
            domains: ['campaign.example.com']
          }
        ]
      },
      {
        id: '1031410005',
        name: 'docs-site',
        detail: 'Serves docs-web · Preview only',
        domains: [
          {
            environment: 'Preview',
            total: 1,
            summary: '1 domains',
            domains: ['*-preview.docs.example.com']
          }
        ]
      },
      {
        id: '1021001',
        name: 'project-03',
        detail: 'Serves analytics-pro',
        domains: [
          {
            environment: 'Production',
            total: 22,
            summary: '10 of 22 domains',
            domains: [
              'project-3.example.com',
              'project-3-alias-1.example.com',
              'project-3-alias-2.example.com',
              'project-3-alias-3.example.com',
              'project-3-alias-4.example.com',
              'project-3-alias-5.example.com',
              'project-3-alias-6.example.com',
              'project-3-alias-7.example.com',
              'project-3-alias-8.example.com',
              'project-3-alias-9.example.com'
            ]
          }
        ]
      },
      {
        id: '1021866',
        name: 'project-08',
        detail: 'Serves ecommerce-v2',
        domains: [
          {
            environment: 'Production',
            total: 57,
            summary: '10 of 57 domains',
            domains: [
              'project-8.example.com',
              'project-8-alias-1.example.com',
              'project-8-alias-2.example.com',
              'project-8-alias-3.example.com',
              'project-8-alias-4.example.com',
              'project-8-alias-5.example.com',
              'project-8-alias-6.example.com',
              'project-8-alias-7.example.com',
              'project-8-alias-8.example.com',
              'project-8-alias-9.example.com'
            ]
          }
        ]
      },
      {
        id: '1022731',
        name: 'project-13',
        detail: 'Serves mobile-app',
        domains: [
          {
            environment: 'Production',
            total: 92,
            summary: '10 of 92 domains',
            domains: [
              'project-13.example.com',
              'project-13-alias-1.example.com',
              'project-13-alias-2.example.com',
              'project-13-alias-3.example.com',
              'project-13-alias-4.example.com',
              'project-13-alias-5.example.com',
              'project-13-alias-6.example.com',
              'project-13-alias-7.example.com',
              'project-13-alias-8.example.com',
              'project-13-alias-9.example.com'
            ]
          }
        ]
      },
      {
        id: '1023596',
        name: 'project-18',
        detail: 'Serves react-dashboard',
        domains: [
          {
            environment: 'Production',
            total: 28,
            summary: '10 of 28 domains',
            domains: [
              'project-18.example.com',
              'project-18-alias-1.example.com',
              'project-18-alias-2.example.com',
              'project-18-alias-3.example.com',
              'project-18-alias-4.example.com',
              'project-18-alias-5.example.com',
              'project-18-alias-6.example.com',
              'project-18-alias-7.example.com',
              'project-18-alias-8.example.com',
              'project-18-alias-9.example.com'
            ]
          }
        ]
      }
    ]
  }
]

export const sampleEnvironments: DeployDrawerEnvironment[] = [
  {
    name: 'Production',
    description: 'Live traffic. One version serves the domain, and deploying replaces it.',
    tag: 'Last used'
  },
  {
    name: 'Preview',
    description:
      'Every other branch. Each version keeps its own URL, so a build can be read before it is live.',
    tag: ''
  }
]

export const sampleImpacted: DeployDrawerImpact[] = [
  {
    environment: 'Production',
    projects: [
      {
        id: '1020655',
        name: 'project-01',
        selected: true,
        domains: [
          {
            environment: 'Production',
            total: 8,
            summary: '8 domains',
            domains: [
              'project-1.example.com',
              'project-1-alias-1.example.com',
              'project-1-alias-2.example.com',
              'project-1-alias-3.example.com',
              'project-1-alias-4.example.com',
              'project-1-alias-5.example.com',
              'project-1-alias-6.example.com',
              'project-1-alias-7.example.com'
            ]
          }
        ]
      },
      {
        id: '1021347',
        name: 'project-05',
        domains: [
          {
            environment: 'Production',
            total: 36,
            summary: '10 of 36 domains',
            domains: [
              'project-5.example.com',
              'project-5-alias-1.example.com',
              'project-5-alias-2.example.com',
              'project-5-alias-3.example.com',
              'project-5-alias-4.example.com',
              'project-5-alias-5.example.com',
              'project-5-alias-6.example.com',
              'project-5-alias-7.example.com',
              'project-5-alias-8.example.com',
              'project-5-alias-9.example.com'
            ]
          }
        ]
      },
      {
        id: '1022039',
        name: 'project-09',
        domains: [
          {
            environment: 'Production',
            total: 64,
            summary: '10 of 64 domains',
            domains: [
              'project-9.example.com',
              'project-9-alias-1.example.com',
              'project-9-alias-2.example.com',
              'project-9-alias-3.example.com',
              'project-9-alias-4.example.com',
              'project-9-alias-5.example.com',
              'project-9-alias-6.example.com',
              'project-9-alias-7.example.com',
              'project-9-alias-8.example.com',
              'project-9-alias-9.example.com'
            ]
          }
        ]
      }
    ]
  }
]

export const sampleDefaultValues: Partial<DeployDrawerValues> = {
  versions: { service: 'AG1VVDJP' },
  projectId: '1020655'
}
```
