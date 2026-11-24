# CreateDeployDrawer (`create/create-deploy-drawer`)

> The drawer a platform deploys from, opened by the outlined Deploy button on a service or a project. Every variant shares one Resources card: a row per resource with its Ready tag, the picked version and a Change version menu, and a Dependencies disclosure with the modules and integrations the service references. On a service the default flow is environment first: the Project card uses an existing project or creates one, the environments come as radio blocks, and Projects impacted lists every project the environment’s shared Deployment Settings deploy to. A deploy started without a pinned version first builds one, so the drawer opens as Build and deployment with a Building row and the other sections faded. A service can also deploy project first, picking the project before the environment. On a project, the drawer carries every resource it serves and warns when its Deployment Settings also deploy elsewhere. The footer counts the version changes and where they go live; while the targets resolve the sections are Skeletons, a load failure is an Alert with Retry, and a project with no environment shows an EmptyState with Add environment, Deploy disabled in all three. Built from `SettingsGroup`, `Drawer`, `PanelHeader`, `PanelBody`, `PanelFooter`, `Card`, `Item`, `Accordion`, `Separator`, `Popover`, `DropdownMenu`, `ToggleGroup`, `RadioGroup` (`variant="card"`), `Input`, `Avatar`, `Tag`, `Spinner`, `Skeleton`, `EmptyState`, `Alert`, `Tooltip` and `Button`.

- Surface: app
- Source: `blocks/create/create-deploy-drawer/create-deploy-drawer.vue` in `@aziontech/webkit`
- MCP: `get_block("create/create-deploy-drawer")`
- Components: [Accordion](../../components/accordion.md), [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Button](../../components/button.md), [Card](../../components/card.md), `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, `DrawerTrigger`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Input](../../components/input.md), [Item](../../components/item.md), [Kbd](../../components/kbd.md), [Link](../../components/link.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [Popover](../../components/popover.md), [RadioGroup](../../components/radio-group.md), [Separator](../../components/separator.md), [SettingsGroup](../../components/settings-group.md), [Skeleton](../../components/skeleton.md), [Spinner](../../components/spinner.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md), `use-shortcuts`
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

### I. Shortcut keycap — `Kbd` (optional)

A small `Kbd` (`aria-hidden`) inside the primary button shows its keyboard shortcut (⌘ S to save, ⌘ Enter to submit or run, Ctrl off Apple); the button carries the same keys in `aria-keyshortcuts`.

## Data

The block takes the deploy targets through props and emits every action; it fetches and deploys nothing. The record types (`DeployDrawerResource`, `DeployDrawerProjectGroup`, `DeployDrawerEnvironment`, `DeployDrawerImpact`, `DeployDrawerBuild`, `DeployDrawerValues`) and `DeployDrawerProps` are exported from `create-deploy-drawer.vue`, and `sample.ts` holds the sample records the Service drawer renders when they are left out (never while `loading` or `error` is set).

| Prop                      | Type                          | What it does                                                                                |
| ------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
| `resources`               | `DeployDrawerResource[]`      | The resources with their Ready versions and the dependencies they reference.                |
| `projectGroups`           | `DeployDrawerProjectGroup[]`  | The projects Use existing offers, in groups.                                                |
| `newProject`              | `DeployDrawerProject`         | The project Create new makes.                                                               |
| `environments`            | `DeployDrawerEnvironment[]`   | The environments to go live in, the first selected by default.                              |
| `impacted`                | `DeployDrawerImpact[]`        | The projects the shared Deployment Settings reach, per environment.                         |
| `defaultValues`           | `Partial<DeployDrawerValues>` | The versions, project and environment every open resets to.                                 |
| `build`                   | `DeployDrawerBuild`           | A build in progress: a Building row replaces Resources, the rest is inert, Deploy off.      |
| `loading`                 | `boolean`                     | The deploy targets are loading; `Skeleton` blocks, Deploy disabled.                         |
| `error`                   | `string`                      | Why they failed to load, in a danger `Alert` with Retry; Deploy disabled.                   |
| `v-model:open`            | `boolean`                     | Whether the drawer shows; the trigger opens it and Deploy closes it.                        |
| `dependenciesOpen`        | `boolean`                     | Opens every Dependencies disclosure when the drawer opens.                                  |
| `dependenciesLoadingKeys` | `string[]`                    | Resources whose dependencies are reloading: `Skeleton` rows, a status line, Deploy waits.   |
| `impactedLoading`         | `boolean`                     | Projects impacted are reloading: `Skeleton` rows, `aria-busy`, a status line, Deploy waits. |
| `blocker`                 | `string`                      | Why Deploy cannot run, said in the footer and tied to Deploy by `aria-describedby`.         |
| `v-model:versions`        | `Record<string, string>`      | The picked version per resource key; every open resets it to `defaultValues`.               |
| `v-model:environment`     | `string`                      | The chosen environment; every open resets it to `defaultValues`.                            |

| Event    | Payload           | When                                                                                     |
| -------- | ----------------- | ---------------------------------------------------------------------------------------- |
| `submit` | `(event, values)` | Deploy; `values` carry the picked version per resource, the project and the environment. |
| `retry`  | `(event)`         | Retry in the load error.                                                                 |

The `environment-alerts` slot renders under the environment choices with `{ environment, project }`, for alerts about what the chosen environment changes. A dependency with `sharedWith` carries a Shared `Tag` in a `Tooltip` naming the other services, and one info `Alert` above the list says it deploys at one version; Projects impacted shows only when there are projects, with an environment heading and a count per group once they span more than one environment.

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
- Opening the drawer moves focus to its first control.
- **⌘ Enter deploys (`Ctrl Enter` off Apple)** through the form's submit, the same path as Deploy. It stays inert while Deploy is disabled (loading, load error, a build running, no environment); Deploy carries `aria-keyshortcuts` and an `aria-hidden` `Kbd`, and the `?` dialog lists it under Drawer.
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
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import { computed, ref, useId, watch } from 'vue'

  import BuildItem from './parts/build-item.vue'
  import DeployDrawerFrame from './parts/deploy-drawer-frame.vue'
  import DeployLoading from './parts/deploy-loading.vue'
  import DeployResourcesCard from './parts/deploy-resources-card.vue'
  import EnvironmentChoices from './parts/environment-choices.vue'
  import ImpactedProjects from './parts/impacted-projects.vue'
  import ProjectCard from './parts/project-card.vue'
  import {
    sampleDefaultValues,
    sampleEnvironments,
    sampleImpacted,
    sampleNewProject,
    sampleProjectGroups,
    sampleResources
  } from './sample'
  import type {
    DeployDrawerBuild,
    DeployDrawerDependency,
    DeployDrawerEnvironment,
    DeployDrawerImpact,
    DeployDrawerProject,
    DeployDrawerProjectGroup,
    DeployDrawerProjectMode,
    DeployDrawerResource,
    DeployDrawerValues,
    DeployDrawerVersion
  } from './types'

  export type {
    DeployDrawerBuild,
    DeployDrawerDependency,
    DeployDrawerDomainGroup,
    DeployDrawerEnvironment,
    DeployDrawerExistingProject,
    DeployDrawerImpact,
    DeployDrawerImpactedProject,
    DeployDrawerProject,
    DeployDrawerProjectGroup,
    DeployDrawerProjectMode,
    DeployDrawerResource,
    DeployDrawerValues,
    DeployDrawerVersion
  } from './types'

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
    /** Opens every Dependencies disclosure when the drawer opens. */
    dependenciesOpen?: boolean
    /** Keys of the resources whose dependencies are reloading; skeleton rows stand in and Deploy waits. */
    dependenciesLoadingKeys?: string[]
    /** The projects impacted are reloading; skeleton rows stand in and Deploy waits. */
    impactedLoading?: boolean
    /** Why Deploy cannot run, said in the footer; empty leaves Deploy to the other states. */
    blocker?: string
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
    error: '',
    dependenciesOpen: false,
    dependenciesLoadingKeys: () => [],
    impactedLoading: false,
    blocker: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: DeployDrawerValues]
    retry: [event: MouseEvent]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  /** The picked version id per resource key; every open resets it to defaultValues. */
  const picks = defineModel<Record<string, string>>('versions', { default: () => ({}) })

  /** The environment it goes live in; every open resets it to defaultValues. */
  const environment = defineModel<string>('environment', { default: '' })

  defineSlots<{
    /** Alerts under the environment choices, for what the chosen environment changes. */
    'environment-alerts'(props: { environment: string; project: DeployDrawerProject }): unknown
  }>()

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

  type Dependency = DeployDrawerDependency
  type ProjectView = DeployDrawerProject

  picks.value = { ...initial.value.versions }
  environment.value = initial.value.environment
  const projectMode = ref<DeployDrawerProjectMode>(initial.value.projectMode)
  const projectId = ref(initial.value.projectId)

  const project = computed<ProjectView>(() =>
    projectMode.value === 'new'
      ? newProject.value
      : (projectGroups.value
          .flatMap((group) => group.projects)
          .find((entry) => entry.id === projectId.value) ??
        projectGroups.value[0]?.projects[0] ?? { name: '' })
  )

  const versionOf = (row: Dependency): DeployDrawerVersion | undefined =>
    row.versions.find((entry) => entry.id === picks.value[row.key]) ?? row.versions[0]

  const liveVersionId = (row: Dependency) =>
    (row.versions.find((entry) => entry.active) ?? row.versions[0])?.id ?? ''

  const changeCount = computed(
    () =>
      resources.value
        .flatMap((row) => [row, ...row.dependencies])
        .filter((row) => row.versions.length && versionOf(row)?.id !== liveVersionId(row)).length
  )

  const changeSummary = computed(
    () =>
      `${changeCount.value} ${changeCount.value === 1 ? 'change goes' : 'changes go'} live in ${environment.value}.`
  )

  const blockerId = useId()

  const reset = () => {
    const values = initial.value
    picks.value = { ...values.versions }
    projectMode.value = values.projectMode
    projectId.value = values.projectId
    environment.value = values.environment
  }

  watch(open, (isOpen) => {
    if (isOpen) reset()
  })

  const blocked = computed(
    () =>
      pending.value ||
      !!props.build ||
      !!props.blocker ||
      props.impactedLoading ||
      props.dependenciesLoadingKeys.length > 0
  )

  const title = computed(() => (props.build ? 'Build and deployment' : 'Deploy'))

  const submit = (event: Event) => {
    if (blocked.value) return
    emit('submit', event, {
      versions: Object.fromEntries(
        resources.value
          .flatMap((row) => [row, ...row.dependencies])
          .filter((row) => row.versions.length)
          .map((row) => [row.key, versionOf(row)?.id ?? ''])
      ),
      projectMode: projectMode.value,
      projectId: project.value.id ?? '',
      environment: environment.value
    })
    open.value = false
  }
</script>

<template>
  <DeployDrawerFrame
    v-model:open="open"
    :title="title"
    :blocked="blocked"
    :reason-id="blocker ? blockerId : ''"
    @submit="submit"
  >
    <DeployLoading v-if="loading" />

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
        <BuildItem
          v-if="build"
          :build="build"
        />
        <DeployResourcesCard
          v-else
          v-model:picks="picks"
          :resources="resources"
          :dependencies-open="dependenciesOpen"
          :dependencies-loading-keys="dependenciesLoadingKeys"
        />
      </SettingsGroup>

      <SettingsGroup
        :inert="!!build || undefined"
        :data-pending="build ? 'true' : undefined"
        label="Project"
        hint="The project whose domains serve the service. Create one to deploy it on a new domain."
      >
        <ProjectCard
          v-model:project-mode="projectMode"
          v-model:project-id="projectId"
          :project="project"
          :project-groups="projectGroups"
        />
      </SettingsGroup>

      <SettingsGroup
        :inert="!!build || undefined"
        :data-pending="build ? 'true' : undefined"
        label="Environment"
        hint="Where the deployment goes live, from the environments this project serves. Each one goes live with the Deployment Settings set on the project."
      >
        <EnvironmentChoices
          v-model="environment"
          :environments="environmentChoices"
          name="service-deploy-environment"
        />

        <slot
          name="environment-alerts"
          :environment="environment"
          :project="project"
        />
      </SettingsGroup>

      <SettingsGroup
        v-if="impacted.length"
        :inert="!!build || undefined"
        :data-pending="build ? 'true' : undefined"
        label="Projects impacted"
        hint="This environment deploys with shared Deployment Settings, so the deployment reaches every project below, in every environment they are linked to, and the domains they serve."
      >
        <ImpactedProjects
          :impacted="impacted"
          :loading="impactedLoading"
        />
      </SettingsGroup>

      <span
        class="sr-only"
        role="status"
      >
        {{ impactedLoading ? 'Loading the projects this deployment reaches' : '' }}
      </span>
    </fieldset>
    <template #footer-start>
      <p
        v-if="blocker"
        :id="blockerId"
        class="flex min-w-0 items-start gap-(--spacing-xs) text-body-sm text-(--warning-foreground)"
      >
        <i
          class="az az-triangle-alert mt-0.5 shrink-0 text-body-xs"
          aria-hidden="true"
        />
        <span>{{ blocker }}</span>
      </p>
      <p
        v-else-if="changeCount && !build"
        class="flex min-w-0 items-center gap-(--spacing-2xs) text-body-xs text-(--text-muted)"
      >
        <i
          class="az az-circle-info shrink-0"
          aria-hidden="true"
        />
        <span class="truncate">{{ changeSummary }}</span>
      </p>
      <span v-else />
    </template>
  </DeployDrawerFrame>
</template>
```

## `sample.ts`

```ts
import type {
  DeployDrawerDependency,
  DeployDrawerDomainGroup,
  DeployDrawerEnvironment,
  DeployDrawerImpact,
  DeployDrawerProject,
  DeployDrawerProjectGroup,
  DeployDrawerResource,
  DeployDrawerValues,
  DeployDrawerVersion
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

export interface DeployDrawerEnvironmentEntry {
  name: string
  description: string
  lock?: string
}

export interface DeployDrawerReach {
  settings: string
  replaced: string
  groups: DeployDrawerImpact[]
}

const domainGroup = (slug: string, environment: string, total: number): DeployDrawerDomainGroup => {
  const shown = Math.min(total, 10)
  return {
    environment,
    total,
    summary:
      total > shown
        ? `${shown} of ${total} domains`
        : `${total} ${total === 1 ? 'domain' : 'domains'}`,
    domains: Array.from({ length: shown }, (_, index) =>
      index ? `${slug}-alias-${index}.example.com` : `${slug}.example.com`
    )
  }
}

export const sampleEnvironmentEntries: DeployDrawerEnvironmentEntry[] = [
  {
    name: 'Production',
    description: 'Live traffic. One version serves the domain, and deploying replaces it.'
  },
  {
    name: 'Staging',
    description: 'A copy of production for the last checks before a deploy.',
    lock: 'storefront-strict is Strict, so checkout-api stays bound to Staging.'
  },
  {
    name: 'Preview',
    description:
      'Every other branch. Each version keeps its own URL, so a build can be read before it is live.'
  }
]

export const sampleLastUsedEnvironment = 'Production'

export const sampleEnvironmentReach: Record<string, DeployDrawerReach> = {
  Production: {
    settings: 'shared-storefront',
    replaced: 'legacy-web',
    groups: [
      {
        environment: 'Production',
        projects: [
          {
            id: '1020655',
            name: 'project-01',
            selected: true,
            domains: [domainGroup('project-1', 'Production', 8)]
          },
          {
            id: '1021347',
            name: 'project-05',
            domains: [domainGroup('project-5', 'Production', 36)]
          },
          {
            id: '1022039',
            name: 'project-09',
            domains: [domainGroup('project-9', 'Production', 64)]
          }
        ]
      },
      {
        environment: 'Preview',
        projects: [
          {
            id: '1021347',
            name: 'project-05',
            domains: [domainGroup('preview-project-5', 'Preview', 1)]
          }
        ]
      }
    ]
  },
  Staging: { settings: 'storefront-strict', replaced: '', groups: [] },
  Preview: {
    settings: 'web-app-preview',
    replaced: '',
    groups: [
      {
        environment: 'Preview',
        projects: [
          {
            id: '1020655',
            name: 'project-01',
            selected: true,
            domains: [domainGroup('preview-project-1', 'Preview', 1)]
          }
        ]
      }
    ]
  }
}

const version = (
  id: string,
  author: string,
  createdAgo: string,
  active = false
): DeployDrawerVersion => ({
  id,
  name: id,
  author,
  createdAgo,
  active
})

const authGateway = (prefix: string): DeployDrawerDependency => ({
  key: `${prefix}:module-auth-gateway`,
  label: 'Module',
  name: 'auth-gateway',
  icon: 'az az-code',
  note: '',
  sharedWith: ['checkout-api', 'account-api'],
  total: 8,
  versions: [
    version('APICRFV0', 'Sam Lee', '2 days ago', true),
    version('AQW6HBBH', 'Priya Patel', '3 days ago'),
    version('ASA076RY', 'Chris Taylor', '5 days ago')
  ]
})

const paymentsApi = (prefix: string): DeployDrawerDependency => ({
  key: `${prefix}:integration-payments-api`,
  label: 'Integration',
  name: 'payments-api',
  icon: 'az az-link',
  note: 'Not versioned. Deploys with its current settings.',
  sharedWith: [],
  total: 0,
  versions: []
})

const geoRedirect = (prefix: string, ready: boolean): DeployDrawerDependency => ({
  key: `${prefix}:module-geo-redirect`,
  label: 'Module',
  name: 'geo-redirect',
  icon: 'az az-code',
  note: '',
  sharedWith: [],
  total: ready ? 11 : 0,
  versions: ready
    ? [
        version('AK16MQ4R', 'John Smith', '2 days ago', true),
        version('ALF0CLL8', 'Sam Lee', '4 days ago'),
        version('AMSU2H1P', 'Priya Patel', '4 days ago')
      ]
    : []
})

const sampleDependenciesByVersion = (id: string): DeployDrawerDependency[] => {
  const prefix = `service@${id}`
  return [authGateway(prefix), geoRedirect(prefix, id !== 'AG1VVDJP'), paymentsApi(prefix)]
}

const dependencyResources: Omit<DeployDrawerResource, 'dependencies'>[] = [
  {
    key: 'service',
    label: 'Service',
    name: 'web-app',
    icon: 'az az-server',
    note: '',
    total: 6,
    versions: [
      version('AEO25I38', 'Sam Lee', '1 day ago', true),
      version('AG1VVDJP', 'Priya Patel', '3 days ago'),
      version('AHFPL906', 'Chris Taylor', '3 days ago'),
      version('AITJB4GN', 'Riley Carter', '4 days ago'),
      version('AK7D0ZX4', 'Ethan Brooks', '6 days ago')
    ],
    owner: true
  },
  {
    key: 'config',
    label: 'Resource',
    name: 'web-app-config',
    icon: 'az az-box',
    note: '',
    total: 2,
    versions: [
      version('AB3K9QX2', 'Riley Carter', '2 days ago', true),
      version('AC71ZT0M', 'Jordan Kim', '8 days ago')
    ],
    owner: true
  }
]

export const sampleDependencyResources = (serviceVersion: string): DeployDrawerResource[] =>
  dependencyResources.map((row) => ({
    ...row,
    dependencies: row.key === 'service' ? sampleDependenciesByVersion(serviceVersion) : []
  }))

export const sampleProjectResources: DeployDrawerResource[] = [
  {
    key: 'service',
    label: 'Service',
    name: 'project-01-web',
    icon: 'az az-server',
    note: '',
    total: 12,
    versions: [
      {
        id: 'AWPT11GA',
        name: 'AWPT11GA',
        author: 'Taylor Reed',
        createdAgo: '21 hours ago',
        active: true
      },
      {
        id: 'AY3MQWWR',
        name: 'AY3MQWWR',
        author: 'John Smith',
        createdAgo: '2 days ago'
      },
      {
        id: 'AZHGGSD8',
        name: 'AZHGGSD8',
        author: 'Sam Lee',
        createdAgo: '4 days ago'
      },
      {
        id: 'A1VA6NTP',
        name: 'A1VA6NTP',
        author: 'Priya Patel',
        createdAgo: '4 days ago'
      },
      {
        id: 'A393WJA6',
        name: 'A393WJA6',
        author: 'Chris Taylor',
        createdAgo: '6 days ago'
      }
    ],
    owner: true,
    dependencies: [
      {
        key: 'service@AWPT11GA:module-image-optimizer',
        label: 'Module',
        name: 'image-optimizer',
        icon: 'az az-code',
        note: '',
        total: 6,
        versions: [
          {
            id: 'ATNSEE8Y',
            name: 'ATNSEE8Y',
            author: 'Taylor Reed',
            createdAgo: '2 days ago'
          },
          {
            id: 'AV1M49PF',
            name: 'AV1M49PF',
            author: 'John Smith',
            createdAgo: '3 days ago'
          },
          {
            id: 'AWFFU55W',
            name: 'AWFFU55W',
            author: 'Sam Lee',
            createdAgo: '4 days ago'
          },
          {
            id: 'AXT9K0MD',
            name: 'AXT9K0MD',
            author: 'Priya Patel',
            createdAgo: '6 days ago'
          },
          {
            id: 'AZ739W2U',
            name: 'AZ739W2U',
            author: 'Chris Taylor',
            createdAgo: '6 days ago'
          }
        ]
      },
      {
        key: 'service@AWPT11GA:integration-search-index',
        label: 'Integration',
        name: 'search-index',
        icon: 'az az-link',
        note: '',
        total: 3,
        versions: [
          {
            id: 'AHMVCHSJ',
            name: 'AHMVCHSJ',
            author: 'John Smith',
            createdAgo: '2 days ago'
          },
          {
            id: 'AJ0P2D90',
            name: 'AJ0P2D90',
            author: 'Sam Lee',
            createdAgo: '4 days ago'
          },
          {
            id: 'AKEIS8PH',
            name: 'AKEIS8PH',
            author: 'Priya Patel',
            createdAgo: '4 days ago'
          }
        ]
      }
    ]
  },
  {
    key: 'storage',
    label: 'Storage',
    name: 'project-01-storage',
    icon: 'az az-database',
    note: 'Not versioned',
    total: 0,
    versions: [],
    owner: false,
    dependencies: []
  }
]

/** An environment of the Project variant, with the Deployment Settings it goes live with. */
export interface DeployDrawerProjectEnvironment extends DeployDrawerEnvironment {
  /** The Deployment Settings and the projects that share them. */
  setting: { name: string; shared: boolean; projects: string[] }
}

export const sampleProjectEnvironments: DeployDrawerProjectEnvironment[] = [
  {
    name: 'Production',
    description: 'Live traffic. One version serves the domain, and deploying replaces it.',
    tag: 'Last used',
    setting: { name: 'shared-storefront', shared: true, projects: ['project-05', 'project-09'] }
  },
  {
    name: 'Preview',
    description:
      'Every other branch. Each version keeps its own URL, so a build can be read before it is live.',
    tag: '',
    setting: { name: 'project-01-preview', shared: false, projects: [] }
  }
]

/** A project the service is already bound to. */
export interface DeployDrawerBoundProject extends DeployDrawerProject {
  /** Stable key. */
  id: string
  /** The environment it last deployed to; empty for none. */
  environment: string
}

export const sampleBoundProjects: DeployDrawerBoundProject[] = [
  {
    id: '1020655',
    name: 'project-01',
    domain: 'project-1.example.com',
    environment: 'Production'
  }
]

export const sampleServiceEnvironments: DeployDrawerEnvironment[] = [
  ...sampleEnvironments,
  {
    name: 'Stage',
    description: 'A rehearsal before Production. Each version keeps its own URL.',
    tag: ''
  }
]
```

## `lib/list-format.ts`

```ts
export function listFormat(names: string[]): string {
  return names.length > 1
    ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`
    : (names[0] ?? '')
}
```

## `parts/build-item.vue`

```ts
<script setup lang="ts">
  import Item from '@aziontech/webkit/item'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'

  import type { DeployDrawerBuild } from '../types'

  export interface BuildItemProps {
    /** The build in progress. */
    build: DeployDrawerBuild
  }

  defineProps<BuildItemProps>()
</script>

<template>
  <Item
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
        class="whitespace-nowrap font-(family-name:--font-code) text-label-sm tabular-nums text-(--text-muted)"
        data-testid="build-item__elapsed"
      >
        {{ build.elapsed }} s
      </span>
      <span class="flex size-4 shrink-0 text-(--text-default)">
        <Spinner class="w-full" />
      </span>
    </Item.Actions>
  </Item>
</template>
```

## `parts/deploy-loading.vue`

```ts
<script setup lang="ts">
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Skeleton from '@aziontech/webkit/skeleton'
</script>

<template>
  <div
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
</template>
```

## `parts/deploy-resources-card.vue`

```ts
<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Separator from '@aziontech/webkit/separator'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { reactive } from 'vue'

  import { listFormat } from '../lib/list-format'
  import type { DeployDrawerDependency, DeployDrawerResource } from '../types'
  import VersionPicker from './version-picker.vue'

  export interface DeployResourcesCardProps {
    /** The resources the deployment sends live, each with the resources it references. */
    resources: DeployDrawerResource[]
    /** Opens every Dependencies disclosure. */
    dependenciesOpen?: boolean
    /** Keys of the resources whose dependencies are reloading; skeleton rows stand in. */
    dependenciesLoadingKeys?: string[]
  }

  const props = withDefaults(defineProps<DeployResourcesCardProps>(), {
    dependenciesOpen: false,
    dependenciesLoadingKeys: () => []
  })

  /** The picked version id per resource key; a resource with no pick shows its first version. */
  const picks = defineModel<Record<string, string>>('picks', { default: () => ({}) })

  const versionOpen = reactive<Record<string, boolean>>({})

  const versionOf = (row: DeployDrawerDependency) =>
    row.versions.find((entry) => entry.id === picks.value[row.key]) ?? row.versions[0]

  const pickVersion = (row: DeployDrawerDependency, id: string) => {
    picks.value = { ...picks.value, [row.key]: id }
    versionOpen[row.key] = false
  }

  const sharedDependency = (row: DeployDrawerResource) =>
    row.dependencies.find((dependency) => dependency.sharedWith?.length)

  const sharedDependencyLabel = (row: DeployDrawerResource) => {
    const shared = sharedDependency(row)
    return (
      `${shared?.name} is shared, so it deploys at one version. ` +
      `Changing it here changes it for ${listFormat(shared?.sharedWith ?? [])} too.`
    )
  }

  const dependenciesLoading = (row: DeployDrawerResource) =>
    props.dependenciesLoadingKeys.includes(row.key)
</script>

<template>
  <Card :padded="false">
    <template #default>
      <template
        v-for="(row, index) in resources"
        :key="row.key"
      >
        <Separator v-if="index" />
        <Item
          size="small"
          data-testid="deploy-resources-card__row"
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
              {{ row.note || versionOf(row)?.name }}
            </Item.Description>
          </Item.Content>
          <Item.Actions
            v-if="!row.note"
            class="basis-full sm:basis-auto"
          >
            <VersionPicker
              v-model:open="versionOpen[row.key]"
              :row="row"
              :selected-id="versionOf(row)?.id"
              @pick="(id: string) => pickVersion(row, id)"
            />
          </Item.Actions>
        </Item>
        <template v-if="row.owner">
          <Separator />
          <Accordion
            type="single"
            collapsible
            size="medium"
            :default-value="dependenciesOpen ? 'dependencies' : undefined"
          >
            <Accordion.Item value="dependencies">
              <Accordion.Trigger>
                <span class="text-label-sm text-(--text-default)">Dependencies</span>
              </Accordion.Trigger>
              <Accordion.Content>
                <div class="min-w-0">
                  <div
                    v-if="dependenciesLoading(row)"
                    aria-busy="true"
                    class="flex flex-col gap-(--spacing-sm)"
                  >
                    <div
                      v-for="line in row.dependencies.length"
                      :key="line"
                      aria-hidden="true"
                      class="flex min-w-0 items-center gap-(--spacing-sm)"
                    >
                      <Skeleton
                        variant="circle"
                        width="var(--size-4)"
                        height="var(--size-4)"
                      />
                      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xs)">
                        <Skeleton
                          width="40%"
                          height="var(--size-3)"
                        />
                        <Skeleton
                          width="70%"
                          height="var(--size-3)"
                        />
                      </div>
                      <Skeleton
                        width="var(--size-24)"
                        height="var(--size-7)"
                      />
                    </div>
                  </div>
                  <p
                    v-else-if="!row.dependencies.length"
                    class="text-body-sm text-(--text-muted)"
                  >
                    {{ row.name }} references no other resources.
                  </p>
                  <div
                    v-else
                    class="flex flex-col gap-(--spacing-sm)"
                  >
                    <Alert
                      v-if="sharedDependency(row)"
                      severity="info"
                      size="small"
                      :label="sharedDependencyLabel(row)"
                    />
                    <Item.Group>
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
                          <span class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                            <span class="shrink-0 text-body-sm text-(--text-muted)">
                              {{ dependency.label }}
                            </span>
                            <Item.Title>{{ dependency.name }}</Item.Title>
                            <Tooltip
                              v-if="dependency.sharedWith?.length"
                              :content="`Also referenced by ${listFormat(dependency.sharedWith ?? [])}.`"
                            >
                              <span
                                tabindex="0"
                                class="inline-flex shrink-0 rounded-(--shape-button) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                                :aria-label="`Shared, also referenced by ${listFormat(dependency.sharedWith ?? [])}`"
                              >
                                <Tag
                                  label="Shared"
                                  severity="info"
                                  size="small"
                                  icon="az az-link"
                                />
                              </span>
                            </Tooltip>
                            <Tag
                              v-if="!dependency.note"
                              :label="dependency.versions.length ? 'Ready' : 'No ready version'"
                              :severity="dependency.versions.length ? 'success' : 'warning'"
                              size="small"
                              class="shrink-0"
                            />
                          </span>
                          <Item.Description>
                            {{
                              dependency.note ||
                              versionOf(dependency)?.name ||
                              'Build a version to deploy it.'
                            }}
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions v-if="!dependency.note">
                          <VersionPicker
                            v-model:open="versionOpen[dependency.key]"
                            :row="dependency"
                            :selected-id="versionOf(dependency)?.id"
                            @pick="(id: string) => pickVersion(dependency, id)"
                          />
                        </Item.Actions>
                      </Item>
                    </Item.Group>
                  </div>
                  <span
                    class="sr-only"
                    role="status"
                  >
                    {{ dependenciesLoading(row) ? 'Loading dependencies' : '' }}
                  </span>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </template>
      </template>
    </template>
  </Card>
</template>
```

## `parts/domain-group-item.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Input from '@aziontech/webkit/input'
  import Link from '@aziontech/webkit/link'
  import Popover from '@aziontech/webkit/popover'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { DeployDrawerDomainGroup } from '../types'

  export interface DomainGroupItemProps {
    /** The domains of a project in one environment. */
    group: DeployDrawerDomainGroup
  }

  defineProps<DomainGroupItemProps>()
</script>

<template>
  <li class="flex min-w-0 items-center gap-(--spacing-xs)">
    <Tag
      :label="group.environment"
      severity="neutral"
      size="small"
      class="shrink-0"
    />
    <div class="flex min-w-0">
      <Tooltip
        :content="`Open ${group.domains[0]} in a new tab`"
        class="w-full"
      >
        <Link
          class="max-w-full"
          :href="`https://${group.domains[0]}`"
          target="_blank"
          size="small"
        >
          <span class="grid grid-cols-1">
            <span
              class="truncate"
              dir="ltr"
              data-testid="domain-group-item__domain"
              >{{ group.domains[0] }}</span
            >
          </span>
        </Link>
      </Tooltip>
    </div>
    <Popover
      v-if="group.total > 1"
      side="bottom"
      align="start"
      size="small"
    >
      <Popover.Trigger :aria-label="`${group.total - 1} more domains`">
        <div class="relative shrink-0 cursor-pointer">
          <span
            aria-hidden="true"
            data-slot="touch-target"
            class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
          />
          <Tag
            :label="`+${group.total - 1}`"
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
            {{ group.summary }}
          </p>
          <Input
            v-if="group.total > 10"
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

        <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-2xs)">
          <div
            v-for="domain in group.domains"
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
          v-if="group.total > group.domains.length"
          class="border-t border-(--border-default) p-(--spacing-2xs)"
        >
          <Button
            :label="`Load ${Math.min(10, group.total - group.domains.length)} more`"
            variant="ghost"
            size="small"
            class="w-full"
          />
        </div>

        <span
          class="sr-only"
          role="status"
        >
          {{ group.summary }}
        </span>
      </Popover.Content>
    </Popover>
  </li>
</template>
```

## `parts/environment-choices.vue`

```ts
<script setup lang="ts">
  import RadioGroup from '@aziontech/webkit/radio-group'
  import Tag from '@aziontech/webkit/tag'

  import type { DeployDrawerEnvironment } from '../types'

  export interface EnvironmentChoicesProps {
    /** The environments to go live in. */
    environments: DeployDrawerEnvironment[]
    /** The name of the radio group. */
    name: string
  }

  defineProps<EnvironmentChoicesProps>()

  /** The environment it goes live in. */
  const environment = defineModel<string>({ required: true })
</script>

<template>
  <RadioGroup
    v-model="environment"
    variant="card"
    :name="name"
    aria-label="Environment"
  >
    <RadioGroup.Item
      v-for="entry in environments"
      :key="entry.name"
      :value="entry.name"
      :description="entry.description"
      :disabled="entry.disabled"
    >
      {{ entry.name }}
      <template
        v-if="entry.tag"
        #tag
      >
        <Tag
          :label="entry.tag"
          :severity="entry.tagSeverity ?? 'info'"
          size="small"
        />
      </template>
    </RadioGroup.Item>
  </RadioGroup>
</template>
```

## `parts/impacted-projects.vue`

```ts
<script setup lang="ts">
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import type { DeployDrawerImpact } from '../types'
  import DomainGroupItem from './domain-group-item.vue'
  import ProjectMedia from './project-media.vue'

  export interface ImpactedProjectsProps {
    /** The projects reached through shared Deployment Settings, per environment. */
    impacted: DeployDrawerImpact[]
    /** The projects are reloading; skeleton rows stand in. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<ImpactedProjectsProps>(), { loading: false })

  const impactedCount = computed(() =>
    props.impacted.reduce((total, group) => total + group.projects.length, 0)
  )

  const projectsLabel = (count: number) => `${count} ${count === 1 ? 'project' : 'projects'}`
</script>

<template>
  <div
    v-if="loading"
    aria-busy="true"
    class="flex min-w-0 flex-col gap-(--spacing-xs)"
  >
    <div
      v-for="row in impactedCount"
      :key="row"
      aria-hidden="true"
      class="flex min-w-0 items-center gap-(--spacing-sm) rounded-(--shape-control) border border-(--border-default) p-(--spacing-sm)"
    >
      <Skeleton
        width="var(--size-7)"
        height="var(--size-7)"
      />
      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xs)">
        <Skeleton
          width="40%"
          height="var(--size-3)"
        />
        <Skeleton
          width="70%"
          height="var(--size-3)"
        />
      </div>
    </div>
  </div>
  <div
    v-else
    class="flex min-w-0 flex-col gap-(--spacing-md)"
  >
    <div
      v-for="group in impacted"
      :key="group.environment"
      class="flex min-w-0 flex-col gap-(--spacing-xs)"
    >
      <p
        v-if="impacted.length > 1"
        class="flex items-center gap-(--spacing-xs) text-label-sm text-(--text-muted)"
      >
        <i
          class="az az-sitemap text-body-xs"
          aria-hidden="true"
        />
        <span>{{ group.environment }} · {{ projectsLabel(group.projects.length) }}</span>
      </p>
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
            <ProjectMedia />
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
                <DomainGroupItem
                  v-for="domainGroup in target.domains"
                  :key="domainGroup.environment"
                  :group="domainGroup"
                />
              </ul>
            </Item.Content>
          </Item>
        </li>
      </ul>
    </div>
  </div>
</template>
```

## `parts/project-card.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'

  import type {
    DeployDrawerProject,
    DeployDrawerProjectGroup,
    DeployDrawerProjectMode
  } from '../types'
  import DomainGroupItem from './domain-group-item.vue'
  import ProjectMedia from './project-media.vue'

  export interface ProjectCardProps {
    /** The project the deployment goes live on. */
    project: DeployDrawerProject
    /** The projects to pick from, in groups. */
    projectGroups: DeployDrawerProjectGroup[]
  }

  defineProps<ProjectCardProps>()

  /** Use an existing project or create one. */
  const projectMode = defineModel<DeployDrawerProjectMode>('projectMode', { required: true })

  /** The existing project picked. */
  const projectId = defineModel<string>('projectId', { required: true })

  const projectModes = [
    { value: 'existing', label: 'Use existing' },
    { value: 'new', label: 'Create new' }
  ]
</script>

<template>
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
          <ProjectMedia />
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
              <DomainGroupItem
                v-for="domainGroup in project.domains"
                :key="domainGroup.environment"
                :group="domainGroup"
              />
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
</template>
```

## `parts/version-picker.vue`

```ts
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Input from '@aziontech/webkit/input'
  import Tag from '@aziontech/webkit/tag'

  import type { DeployDrawerDependency } from '../types'

  export interface VersionPickerProps {
    /** The resource whose Ready versions the menu lists. */
    row: DeployDrawerDependency
    /** The version picked now, marked selected. */
    selectedId?: string
  }

  withDefaults(defineProps<VersionPickerProps>(), { selectedId: '' })

  const emit = defineEmits<{
    pick: [id: string]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  const versionSummary = (row: DeployDrawerDependency) =>
    row.total > row.versions.length
      ? `${row.versions.length} of ${row.total} Ready versions`
      : `${row.total} Ready versions`
</script>

<template>
  <DropdownMenu
    v-model:open="open"
    side="bottom"
    align="end"
    @select="(_event, id) => emit('pick', String(id))"
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
      <div class="flex flex-col gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-xs)">
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
        :selected="entry.id === selectedId"
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
          <span class="text-body-xs text-(--text-muted)">{{ entry.createdAgo }}</span>
        </template>
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <template
      v-if="row.total > row.versions.length"
      #bottom
    >
      <div class="border-t border-(--border-default) px-(--spacing-2xs) pt-(--spacing-2xs)">
        <Button
          :label="`Load ${Math.min(row.versions.length, row.total - row.versions.length)} more`"
          variant="ghost"
          size="small"
          class="w-full"
        />
      </div>
    </template>
  </DropdownMenu>
</template>
```

## `types.ts`

```ts
import type { TagSeverity } from '@aziontech/webkit/tag'

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
  /** Other services that reference it; set, it carries a Shared tag and deploys at one version for all of them. */
  sharedWith?: string[]
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
  /** The color of the tag; info when left out. */
  tagSeverity?: TagSeverity
  /** Locked: the choice card shows but cannot be picked. */
  disabled?: boolean
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
```
