# CreateReleaseImpact (`create/create-release-impact`)

> The Review and deploy page of a release that carries several resources at once. The left column holds one `Card` per resource: its type and icon, a Required or Read-only `Tag` or an include `Switch` named by a `Tooltip`, the resource and a version `Select` that tracks the latest Ready version or pins one (each with a Current `Tag` and its age), an invalid line and Build a version when nothing is Ready, and a Dependencies box whose `Accordion` groups modules and integrations with counts, a Shared `Tag` with the resources that also reference it and one info `Alert` saying a shared dependency deploys at one version. The right column is the sticky Impact `Card`: a `ToggleGroup` switches a Tree (Deployment Settings, their environments and the projects they publish to, with rails and counts) and a Flow (the same as left-to-right cards), and its footer sums up what the release reaches. A sticky footer holds the hint, Cancel and Deploy release, which asks in a `ConfirmDialog` and then runs as an async action: one toast turns from Deploying release… into the outcome and dismisses itself, and the page shows the outcome `Alert` with Edit and Redeploy. A ChooseSettings step before it picks the Deployment Settings the release deploys with, as grouped `Field` checkbox choice cards with search, Select all and Clear. Built from `Card`, `Tag`, `Switch`, `Tooltip`, `Field`, `Select`, `Checkbox`, `Input`, `Badge`, `Accordion`, `Alert`, `ToggleGroup`, `Skeleton`, `Spinner`, `Button`, `ConfirmDialog`; its toasts go through `toast` into the app's one toast region (ToastPlugin, or one Toaster at the app root), never a Toaster in the page body.

- Surface: app
- Source: `blocks/create/create-release-impact/create-release-impact.vue` in `@aziontech/webkit`
- MCP: `get_block("create/create-release-impact")`
- Components: [Accordion](../../components/accordion.md), [Alert](../../components/alert.md), [Badge](../../components/badge.md), [Button](../../components/button.md), [Card](../../components/card.md), [Checkbox](../../components/checkbox.md), [ConfirmDialog](../../components/confirm-dialog.md), [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), [Input](../../components/input.md), [Kbd](../../components/kbd.md), [OverflowCount](../../components/overflow-count.md), [PageHeader](../../components/page-header.md), [SaveBar](../../components/save-bar.md), [Select](../../components/select.md), [Skeleton](../../components/skeleton.md), [Spinner](../../components/spinner.md), [Switch](../../components/switch.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md), `use-shortcuts`
- Skills: `webkit-create-surface`, `webkit-form`, `webkit-ui-states`, `webkit-errors`

## Asked as

release impact; review and deploy; release composer; what a deploy changes; dependency versions; deployment impact; impacto do release; revisar e implantar; impacto del despliegue

The Review and deploy page of a release that carries several resources at once: a service, the policy in front of it, its storage, its error page and every dependency they reference. The user is about to put all of it into traffic and needs to see, before deploying, which version of each resource goes out, which dependencies go with it, and every Deployment Setting, environment and project the release reaches. One Deploy release at the foot commits it, after one confirmation.

## When to use

- A release spans several resources that deploy together, each at its own version.
- The release reaches projects through shared Deployment Settings, and the user must see how far it goes before it goes.
- Dependencies are detected from the resources and may be shared between them.

## When not to use

- Deploying one service or project from its page: use `create/create-deploy-drawer`, which is the default way to deploy.
- Watching several Deployment Settings activate after a deploy started: use `create/create-deploy-progress-dialog`.
- Reading what a past deploy did: use `detail/detail-deployment-logs`.
- Switching one resource back to an earlier version: use `detail/detail-version` (Revert).

## Building blocks

### A. Page heading — `PageHeader` (required)

The page opens with a large `PageHeader` (its `h1` reads Review and deploy) and one sentence on what the page is for. No breadcrumb of its own; the shell gives it.

### B. Outcome — `Alert`, `Button` (required after a run)

When a run ends, one `Alert` above the columns says how it ended: `severity="danger"` with what was refused and that nothing changed in traffic, or `severity="success"` with what serves now. Both carry **Edit** and **Redeploy** in the `action` slot. The page `Alert` is the persistent outcome; the run's toast auto-dismisses and carries no actions, so the user never meets the same pair twice.

### C. Resource cards — `Card`, `Switch`, `Tag`, `Tooltip` (required)

One flush `Card` per resource (a named `section`, its `header` slot holding the type, the tags and the switch), in the order of the request path (service, policy, storage, error page). The header has the type icon and label and, on the end side, a Required `Tag` (warning), a Read-only `Tag` with a lock when the release keeps the active version, or an include `Switch` named by `aria-label` and explained by a `Tooltip` ("Leave edge-policy out of this release"). A left-out resource collapses to one sentence saying what keeps serving.

### D. Resource and version — `Field`, `Input`, `Select`, `Tag` (required)

Two `Field`s side by side from `sm` up: the resource as a `readonly` `Input` (so its `Field.Label` names a real control) and its version. The version `Select` offers Track latest Ready first (with "resolves at deploy") and a Pin a ready version group, each option with a Current `Tag` and its age. When the version tracks the latest, the `Field.Description` names the version it resolves to now. When nothing is Ready, the `Select` is disabled and `invalid`, `Field.Error` gives the reason, and a transparent Build a version `Button` links to its versions.

### E. Dependencies — `Badge`, `Accordion`, `Alert`, `Tag`, `Tooltip`, `Select` (required when a resource references others)

A box under the resource fields headed Dependencies with a count `Badge`. A `type="multiple"` `Accordion`, open by default, groups them by type (Modules, Integrations) with a count each. Each dependency has its own version `Select` labelled "Version of <name>" for screen readers. A dependency referenced by other resources carries a Shared `Tag` whose `Tooltip` names them, and its group opens with one info `Alert`: a shared dependency deploys at one version.

### F. Impact — `Card`, `ToggleGroup`, `Spinner`, `Skeleton`, `Alert`, `Button` (required)

The right column, sticky from `xl`. The `Card` header has the title Impact and, once ready, a small `ToggleGroup` named Impact view with Tree and Flow.

- **Tree** — a nested list: each Deployment Setting with its domain count, its environments with their project count, and the projects with theirs. Rails are drawn with logical borders, so they mirror under RTL. It is a static read-out, not `Tree`: `Tree` is an interactive `role="tree"` (arrow keys, expand and select), and a tree role with nothing to operate would announce controls that do nothing. Use `Tree` once the impact becomes navigable.
- **Flow** — the same data left to right: the setting as a raised card, an arrow, then one card per environment listing its projects. It is plain lists and cards, not `FlowDiagram`: `FlowDiagram` still carries `aria-required-parent` and `aria-required-children` findings, and this view has nothing to connect beyond one level.
- **Loading** — Computing impact… with a `Spinner` and three `Skeleton` lines; the region is `aria-busy` and a status line announces it.
- **Unavailable** — a warning `Alert` saying the impact is unknown, how many settings are selected, and Retry. Deploying stays possible.
- **Partial** — the list was truncated: a warning `Alert` above the tree.

The `Card` footer sums the reach in one sentence: projects, environments and Deployment Settings.

### G. Footer and commit — `SaveBar`, `Button`, `ConfirmDialog` (required)

`SaveBar variant="docked"` at the bottom of the page: the hint on the start side; on the end side the blocker (if any) with a warning icon, Cancel (outlined, back to the service) and Deploy release (primary, cloud icon). Deploy release opens a `ConfirmDialog` (`variant="primary"`) titled "Deploy this release?" that lists every resource and version and the reach. Confirm closes it and emits `deploy`; the parent sets `deploying`, then `deployed` or `deployError`, and the block shows the run as an async action (`state/state-async-submit`): one toast id turns from `toast.loading` ("Deploying release…", with "It keeps running if you leave.") into `toast.success` or `toast.error`, `duration: 0`, `closable`, with **Edit** and **Redeploy**. Never View deployments. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so the page never renders a `Toaster`.

### Before the review: choosing the Deployment Settings

When the release starts from the settings rather than from a service, a ChooseSettings step comes first, with the same page frame and footer. One sentence says what a Deployment Setting binds and that picking one deploys into everything that uses it. Below it, a large search `Input` counting the settings, and on the end side the number selected with transparent Select all and Clear. The settings are horizontal `Field` choice cards with a `Checkbox`, grouped under a small heading (Your Deployment Settings, Managed): the name with a Shared (warning) or Managed `Tag`, the policy line, up to three environment `Tag`s and an `OverflowCount` chip (+N) that names the rest from the keyboard and to screen readers, and the workloads it affects, a `Skeleton` while that count loads. An inactive setting cannot be picked: it sits in its own group as a dashed note with an Inactive `Tag`, one sentence and a link to activate it. A search with no match shows a small `EmptyState` with Clear search. Continue (primary) stays disabled, with the reason in the footer hint, until one setting is selected.

### H. Shortcut keycap — `Kbd` (optional)

A small `Kbd` (`aria-hidden`) inside the primary button shows its keyboard shortcut (⌘ S to save, ⌘ Enter to submit or run, Ctrl off Apple); the button carries the same keys in `aria-keyshortcuts`.

## Data

The block takes the release and its impact through props and emits every action; it fetches nothing and runs no deploy of its own. `ReleaseImpactResource`, `ReleaseImpactSettings` and `ReleaseImpactProps` (with the version, dependency, environment and project types) are exported from `create-release-impact.vue`, and `sample.ts` holds the sample resources and Deployment Settings the block renders when `resources` or `impact` is left out (the impact sample never renders while `loading` or `error` is set). The switches and version selects edit a local copy of `resources`; `deploy` carries the included resources at the versions picked.

| Prop          | Type                      | What it does                                                                                            |
| ------------- | ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `resources`   | `ReleaseImpactResource[]` | The resource cards; a resource with no `versions` blocks the deploy.                                    |
| `impact`      | `ReleaseImpactSettings[]` | The Deployment Settings the release reaches, with their environments and projects (Tree and Flow).      |
| `loading`     | `boolean`                 | The impact is being computed: the Impact card shows its skeleton and the footer says Computing impact…. |
| `error`       | `string`                  | Why the impact could not be read, shown in the warning alert with Retry. The release can still deploy.  |
| `truncated`   | `boolean`                 | The projects list came back truncated; a warning sits above the tree.                                   |
| `deploying`   | `boolean`                 | The run is in flight: Deploy release spins, the switches lock and the loading toast shows.              |
| `deployed`    | `boolean`                 | The last run deployed: the success toast and `Alert` with Edit and Redeploy.                            |
| `deployError` | `string`                  | Why the last run failed, shown in the danger `Alert` and the error toast.                               |

| Event    | Payload              | When                                                                          |
| -------- | -------------------- | ----------------------------------------------------------------------------- |
| `deploy` | `(event, resources)` | The confirm dialog was accepted, or Redeploy pressed; the included resources. |
| `retry`  | `(event)`            | Retry in the unavailable impact alert.                                        |
| `edit`   | `(event)`            | Edit in the outcome alert; the alert closes and focus moves to Resources.     |

To go live, render the block from a page that owns the release, the impact request and the run:

```vue
<script setup lang="ts">
  import CreateReleaseImpact from './create-release-impact.vue'

  const { release } = useRelease()
  const { data: impact, pending, error, refresh } = useReleaseImpact(release)
  const { run, running, done, failure } = useDeployRelease()
  const impactError =
    'The projects that deploy with these settings could not be read, so the impact is unknown. Retry, or deploy without the preview.'
</script>

<template>
  <CreateReleaseImpact
    :resources="release"
    :impact="impact ?? []"
    :loading="pending"
    :error="error ? impactError : ''"
    :truncated="impact?.truncated"
    :deploying="running"
    :deployed="done"
    :deploy-error="failure ?? ''"
    @retry="refresh"
    @deploy="(event, resources) => run(resources)"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Show every resource and dependency with the version that goes out, including the ones the user did not touch.
- Say what tracking the latest Ready version resolves to now.
- Block Deploy release only for something the user can fix here, and say what it is in the footer.
- Keep Deploy possible when the impact cannot be computed; say the impact is unknown.
- Report the outcome in the page `Alert` with Edit and Redeploy; the toast only announces it and dismisses itself.

## Don't

- Don't hide shared dependencies; changing one changes it everywhere in the release.
- Don't confirm twice: the page is the review, the `ConfirmDialog` is the only step before the run. Deploying one service or one project is `create/create-deploy-drawer`, which confirms nothing after Deploy; this page is only for a release of several resources.
- Don't keep the user on the page while it runs; the run reports wherever they are.
- Don't draw the Flow view with `FlowDiagram` until its list semantics pass axe.

## Copy

- **Title:** "Review and deploy". **Commit:** "Deploy release"; in progress "Deploying…".
- **Confirmation:** "Deploy this release?" and one sentence with the resources, versions and reach.
- **Selecting settings:** title "Select Deployment Settings"; search "Search 6 Deployment Settings"; "2 selected", "Select all", "Clear"; workloads "4 workloads affected" or "No workloads deploy with it yet"; no match "No Deployment Settings match" with "Clear search"; footer "Select at least one Deployment Setting to continue."
- **Versions:** "Track latest Ready", "resolves at deploy", "Pin a ready version", tag "Current".
- **Blockers:** "<name> has no Ready version, so the release cannot be deployed."
- **Outcome:** "Release deployed." / "The release wasn't deployed." with the cause and that nothing changed in traffic.
- Follow `skills/webkit-microcopy`: Deploy, never publish; sentence case; no em dash.

## Accessibility

- Each resource card is a `section` named by its type and resource; the Resources heading takes focus on Edit.
- Every `Select` is labelled through its `Field` (visible for the resource, `sr-only` for dependencies).
- The include `Switch` has an `aria-label`; its `Tooltip` repeats it for pointer users.
- The Shared `Tag` sits in a focusable wrapper so its `Tooltip` opens from the keyboard.
- The Impact region is `aria-busy` while loading and announces it in a `role="status"` line.
- In ChooseSettings each group is a `role="group"` named by its heading, each choice card is a `label` around its `Checkbox`, the selected count is a polite live region, and a loading workloads count is read as text rather than a bare `Skeleton`.
- The `ConfirmDialog` traps focus and returns it to Deploy release.
- `⌘ Enter` (`Ctrl Enter` off Apple) opens the deploy confirmation, the same as Deploy release, and does nothing while the release can't be deployed; the release is only deployed from the confirmation. Deploy release carries `aria-keyshortcuts` and a `Kbd` keycap.

## States

- ChooseSettings: the step before the review; grouped checkbox choice cards with search, Select all and Clear, a loading workloads count, an inactive setting with its activate link, and Continue disabled until one is selected.
- Ready: `resources` all have a version and `impact` is computed; Tree view.
- Loading: `loading` is set while the impact is computed.
- Unavailable: `error` says the impact could not be read; Retry emits `retry`, and a truncated answer sets `truncated`.
- MissingVersion: a resource in `resources` has no `versions`, which blocks the deploy.
- Error: `deployError` says the last run was refused; an error toast announces it, and Edit and Redeploy sit on the page `Alert`.

## Related

- `create/create-deploy-drawer` — deploying one service or project.
- `create/create-deploy-progress-dialog` — several Deployment Settings activating after the deploy.
- `state/state-async-submit` — the toast rule every deploy follows.
- `detail/detail-version` — one version, its history and revert.

## Variants

- `Ready` — primary (the code below)
- `ChooseSettings` — The step before Review and deploy that picks the Deployment Settings the release deploys with: a search over every setting, the count selected with Select all and Clear, then Field checkbox choice cards grouped as Your Deployment Settings and Managed, each with its policy line, a Shared or Managed `Tag`, up to three environment `Tag`s and a +N `Tag` whose `Tooltip` names the rest, and the workloads it affects (a `Skeleton` while that count loads). An inactive setting sits in its own group as a dashed note with the link that activates it, a search with no match offers Clear search, and Continue stays disabled until one setting is selected.
- `Loading` — The impact is being computed: the Impact card shows Computing impact… with a `Spinner` and three `Skeleton` lines, is `aria-busy`, announces it through a status line, hides the view switch and the summary, and the footer says Computing impact… beside Deploy release.
- `Unavailable` — The projects behind the Deployment Settings could not be read: a warning `Alert` says the impact is unknown and that the release can still deploy, the count of settings selected and Retry. Retry emits `retry`; a list that comes back truncated (`truncated`) shows its own warning above the tree.
- `MissingVersion` — edge-policy has no Ready version: its version `Select` is disabled and invalid with the reason under it, Build a version links to its versions, and Deploy release stays disabled with the reason in the footer. Switching edge-policy off the release clears the blocker.
- `Error` — The last run failed: an error toast announces it and the danger `Alert` at the top says edge-policy was refused and nothing changed in traffic, with Edit (back to the resources) and Redeploy. Redeploy emits `deploy` again; the parent sets `deploying` and the toast follows the run.

Each variant is the same screen in another state: `get_block("create/create-release-impact", { variant })`, or the file under `blocks/create/create-release-impact/variants/`.

## Code (`Ready`)

```vue
<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Badge from '@aziontech/webkit/badge'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Kbd from '@aziontech/webkit/kbd'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Spinner from '@aziontech/webkit/spinner'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

  import { sampleImpact, sampleResources } from './sample'

  /** The kind of resource a card or a dependency row deploys. */
  export type ReleaseImpactResourceType =
    'service' | 'policy' | 'storage' | 'errorPage' | 'module' | 'integration'

  /** One version a resource can deploy at. */
  export interface ReleaseImpactVersion {
    /** Version identifier. */
    id: string
    /** The latest Ready version. */
    current?: boolean
    /** How long ago it was built, e.g. 2 hours ago. */
    age: string
  }

  /** A dependency row inside a resource card. */
  export interface ReleaseImpactDependency {
    /** Resource name. */
    name: string
    /** The version it deploys at, or latest to track the latest Ready one. */
    versionId: string
    /** The versions it can deploy at. */
    versions: ReleaseImpactVersion[]
    /** Other services that use the same resource. */
    sharedWith?: string[]
  }

  /** The dependencies of one type under a resource card. */
  export interface ReleaseImpactDependencyGroup {
    /** The dependency type, which names the group. */
    type: ReleaseImpactResourceType
    /** The dependencies. */
    rows: ReleaseImpactDependency[]
  }

  /** One resource the release deploys. */
  export interface ReleaseImpactResource {
    /** The resource type, unique per release. */
    type: ReleaseImpactResourceType
    /** Resource name. */
    name: string
    /** The release cannot leave it out. */
    required?: boolean
    /** A switch can leave it out of the release. */
    canToggle?: boolean
    /** It deploys as it is, with no version to pick. */
    readonly?: boolean
    /** It is part of the release. */
    enabled: boolean
    /** A line shown while it is left out. */
    note?: string
    /** The version it deploys at, or latest to track the latest Ready one; empty when it has none. */
    versionId: string
    /** The versions it can deploy at; empty when it has no Ready version. */
    versions: ReleaseImpactVersion[]
    /** Its dependencies, grouped by type. */
    groups: ReleaseImpactDependencyGroup[]
  }

  /** A project a Deployment Setting deploys. */
  export interface ReleaseImpactProject {
    /** Project identifier. */
    id: string
    /** Project name. */
    name: string
    /** Domains the project serves. */
    domainsCount: number
  }

  /** An environment under a Deployment Setting. */
  export interface ReleaseImpactEnvironment {
    /** Environment identifier. */
    id: string
    /** Environment name, e.g. Production. */
    name: string
    /** The projects that deploy in it. */
    projects: ReleaseImpactProject[]
  }

  /** A Deployment Setting the release reaches. */
  export interface ReleaseImpactSettings {
    /** Setting identifier. */
    id: string
    /** Setting name. */
    name: string
    /** Domains reached through it. */
    domainsCount: number
    /** The environments it deploys to. */
    environments: ReleaseImpactEnvironment[]
  }

  export interface ReleaseImpactProps {
    /** The resources the release deploys; switches and version picks edit a local copy. Left out, the sample renders. */
    resources?: ReleaseImpactResource[]
    /** The Deployment Settings the release reaches, with their environments and projects. Left out, the sample renders. */
    impact?: ReleaseImpactSettings[]
    /** The impact is being computed. */
    loading?: boolean
    /** Why the impact could not be read, shown in the warning alert with Retry. */
    error?: string
    /** The projects list came back truncated, so the impact may be incomplete. */
    truncated?: boolean
    /** The release is deploying. */
    deploying?: boolean
    /** The last run deployed the release. */
    deployed?: boolean
    /** Why the last run failed, shown in the danger alert and the error toast. */
    deployError?: string
  }

  type ImpactState = 'ready' | 'loading' | 'partial' | 'unavailable'
  type Outcome = '' | 'failed' | 'succeeded'

  interface ResourceTypeMeta {
    label: string
    icon: string
  }

  interface VersionedResource {
    versionId: string
    versions: ReleaseImpactVersion[]
  }

  const props = withDefaults(defineProps<ReleaseImpactProps>(), {
    resources: undefined,
    impact: undefined,
    loading: false,
    error: '',
    truncated: false,
    deploying: false,
    deployed: false,
    deployError: ''
  })

  const emit = defineEmits<{
    /** Deploy release was confirmed, or Redeploy pressed; carries the included resources at their versions. */
    deploy: [event: MouseEvent, resources: ReleaseImpactResource[]]
    /** Retry in the unavailable impact alert. */
    retry: [event: MouseEvent]
    /** Edit in the outcome alert; focus moves to the resources. */
    edit: [event: MouseEvent]
  }>()

  const RUN_TOAST = 'release-impact-run'
  const LATEST = 'latest'

  const runToast = (description: string) => ({ id: RUN_TOAST, description })

  const resourceTypes: Record<ReleaseImpactResourceType, ResourceTypeMeta> = {
    service: { label: 'Service', icon: 'az az-server' },
    policy: { label: 'Policy', icon: 'az az-shield' },
    storage: { label: 'Storage', icon: 'az az-inbox' },
    errorPage: { label: 'Error page', icon: 'az az-file' },
    module: { label: 'Modules', icon: 'az az-code' },
    integration: { label: 'Integrations', icon: 'az az-link' }
  }

  const impactViews = [
    { label: 'Tree', value: 'tree' },
    { label: 'Flow', value: 'flow' }
  ]

  const cloneResource = (card: ReleaseImpactResource): ReleaseImpactResource => ({
    ...card,
    versions: card.versions.map((version) => ({ ...version })),
    groups: card.groups.map((group) => ({
      ...group,
      rows: group.rows.map((row) => ({
        ...row,
        versions: row.versions.map((version) => ({ ...version }))
      }))
    }))
  })

  const cards = ref<ReleaseImpactResource[]>([])
  watch(
    () => props.resources ?? sampleResources,
    (next) => {
      cards.value = next.map(cloneResource)
    },
    { immediate: true }
  )

  const impactTree = computed<ReleaseImpactSettings[]>(
    () => props.impact ?? (props.loading || props.error ? [] : sampleImpact)
  )

  const impactState = computed<ImpactState>(() => {
    if (props.loading) return 'loading'
    if (props.error) return 'unavailable'
    return props.truncated ? 'partial' : 'ready'
  })
  const impactView = ref('tree')
  const confirmOpen = ref(false)
  const dismissed = ref(false)
  const resourcesHeadingEl = ref<HTMLElement | null>(null)

  const deploying = computed(() => props.deploying)
  const outcome = computed<Outcome>(() => {
    if (dismissed.value || props.deploying) return ''
    if (props.deployError) return 'failed'
    return props.deployed ? 'succeeded' : ''
  })

  const plural = (count: number, one: string, other: string) =>
    `${count} ${count === 1 ? one : other}`

  const versionLabel = (card: VersionedResource, id: unknown) => {
    if (id === LATEST) return 'Track latest Ready'
    return card.versions.find((version) => version.id === id)?.id ?? String(id)
  }

  const resolvedVersion = (card: ReleaseImpactResource) =>
    card.versionId === LATEST
      ? (card.versions.find((version) => version.current)?.id ?? '')
      : card.versionId

  const dependencyCount = (card: ReleaseImpactResource) =>
    card.groups.reduce((total, group) => total + group.rows.length, 0)

  const included = computed(() => cards.value.filter((card) => card.enabled))

  const missing = computed(() =>
    included.value.filter((card) => !card.readonly && !card.versions.length)
  )

  const projects = computed(() =>
    impactTree.value.flatMap((settings) =>
      settings.environments.flatMap((environment) => environment.projects)
    )
  )

  const environments = computed(() =>
    impactTree.value.flatMap((settings) =>
      settings.environments.map((environment) => environment.name)
    )
  )

  const impactSummary = computed(
    () =>
      `This release reaches ${plural(projects.value.length, 'project', 'projects')} in ${plural(environments.value.length, 'environment', 'environments')} through ${plural(impactTree.value.length, 'Deployment Setting', 'Deployment Settings')}.`
  )

  const blocker = computed(() => {
    if (missing.value.length)
      return `${missing.value[0].name} has no Ready version, so the release cannot be deployed.`
    if (impactState.value === 'loading') return 'Computing impact…'
    return ''
  })

  const canDeploy = computed(() => !deploying.value && !missing.value.length)

  const releaseLine = computed(() =>
    included.value
      .filter((card) => !card.readonly)
      .map((card) => `${card.name} ${resolvedVersion(card)}`)
      .join(', ')
  )

  const confirmBody = computed(
    () =>
      `${releaseLine.value} go into traffic on ${plural(projects.value.length, 'project', 'projects')} in ${environments.value.join(' and ')}. Resources left out keep the version they serve now.`
  )

  const unavailableMessage = computed(() =>
    impactState.value === 'partial'
      ? 'The projects list was truncated, so these numbers may be incomplete. You can still deploy.'
      : props.error
  )

  const edit = async (event: MouseEvent) => {
    toast.dismiss(RUN_TOAST)
    dismissed.value = true
    emit('edit', event)
    await nextTick()
    resourcesHeadingEl.value?.focus()
  }

  const deploy = (event: MouseEvent) => {
    emit('deploy', event, included.value.map(cloneResource))
  }

  const confirmDeploy = (event: MouseEvent) => {
    confirmOpen.value = false
    deploy(event)
  }

  useShortcuts({
    keys: 'meta+enter',
    label: 'Deploy release',
    group: 'Page',
    when: () => canDeploy.value && !confirmOpen.value,
    handler: () => {
      confirmOpen.value = true
    }
  })

  watch(
    () => [props.deploying, props.deployed, props.deployError],
    () => {
      dismissed.value = false
    }
  )

  watch(
    () => props.deploying,
    (running) => {
      if (!running) return
      toast.loading(
        'Deploying release…',
        runToast(`${releaseLine.value}. It keeps running if you leave.`)
      )
    },
    { immediate: true }
  )

  watch(
    outcome,
    (next) => {
      if (next === 'failed')
        toast.error("The release wasn't deployed.", runToast(props.deployError))
      else if (next === 'succeeded')
        toast.success(
          'Release deployed.',
          runToast(
            `${releaseLine.value} serve ${plural(projects.value.length, 'project', 'projects')} now.`
          )
        )
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    toast.dismiss(RUN_TOAST)
  })
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-(--bg-canvas)">
    <main class="flex min-h-0 flex-1 flex-col">
      <div
        class="layout-column-focused layout-boundary flex min-w-0 flex-1 flex-col gap-(--layout-section-gap)"
      >
        <PageHeader
          title="Review and deploy"
          description="Check the resources this release deploys and everything it reaches, then deploy it."
          size="large"
        />

        <Alert
          key="alert-1"
          v-if="outcome === 'failed'"
          severity="danger"
          :label="`The release wasn't deployed. ${deployError} Nothing changed in traffic.`"
        >
          <template #actions>
            <div class="flex shrink-0 items-center gap-(--spacing-xs)">
              <Button
                label="Edit"
                variant="outline"
                size="small"
                @click="edit"
              />
              <Button
                label="Redeploy"
                variant="outline"
                size="small"
                icon="az az-refresh"
                @click="deploy"
              />
            </div>
          </template>
        </Alert>
        <Alert
          key="alert-2"
          v-else-if="outcome === 'succeeded'"
          severity="success"
          :label="`Release deployed. ${releaseLine} serve ${plural(projects.length, 'project', 'projects')} now.`"
        >
          <template #actions>
            <div class="flex shrink-0 items-center gap-(--spacing-xs)">
              <Button
                label="Edit"
                variant="outline"
                size="small"
                @click="edit"
              />
              <Button
                label="Redeploy"
                variant="outline"
                size="small"
                icon="az az-refresh"
                @click="deploy"
              />
            </div>
          </template>
        </Alert>

        <div
          class="grid min-w-0 items-start gap-(--layout-section-gap) xl:grid-cols-[minmax(0,1fr)_minmax(var(--container-xs),var(--container-sm))]"
        >
          <section
            aria-labelledby="release-impact-resources"
            class="flex min-w-0 flex-col gap-(--layout-group-gap)"
          >
            <h2
              id="release-impact-resources"
              ref="resourcesHeadingEl"
              tabindex="-1"
              class="text-heading-xs text-(--text-default) focus-visible:outline-none"
            >
              Resources
            </h2>

            <Card
              v-for="card in cards"
              :key="card.type"
              :padded="false"
              :aria-label="`${resourceTypes[card.type].label} ${card.name}`"
              :data-included="card.enabled || null"
            >
              <template #header>
                <div class="flex min-w-0 flex-1 items-center justify-between gap-(--spacing-xs)">
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      :class="resourceTypes[card.type].icon"
                      class="shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate text-label-md text-(--text-default)">
                      {{ resourceTypes[card.type].label }}
                    </span>
                  </span>
                  <span class="flex shrink-0 items-center gap-(--spacing-xs)">
                    <Tag
                      key="tag-1"
                      v-if="card.readonly"
                      label="Read-only"
                      severity="neutral"
                      icon="az az-lock"
                      size="small"
                    />
                    <Tag
                      key="tag-2"
                      v-else-if="card.required"
                      label="Required"
                      severity="warning"
                      size="small"
                    />
                    <Tooltip
                      v-if="card.canToggle"
                      :content="
                        card.enabled
                          ? `Leave ${card.name} out of this release`
                          : `Include ${card.name} in this release`
                      "
                    >
                      <Switch
                        v-model="card.enabled"
                        :disabled="deploying"
                        :aria-label="`Include ${card.name} in this release`"
                      />
                    </Tooltip>
                  </span>
                </div>
              </template>
              <template #default>
                <p
                  v-if="!card.enabled"
                  class="p-(--spacing-md) text-body-sm text-(--text-muted)"
                >
                  {{ card.note }}
                </p>

                <div
                  v-else
                  class="flex min-w-0 flex-col gap-(--spacing-md) p-(--spacing-md)"
                >
                  <p
                    v-if="card.readonly"
                    class="text-body-sm text-(--text-muted)"
                  >
                    Kept from the active release.
                  </p>

                  <div class="grid min-w-0 gap-(--spacing-sm) sm:grid-cols-2">
                    <Field>
                      <Field.Label>Resource</Field.Label>
                      <Input
                        :model-value="card.name"
                        size="medium"
                        readonly
                      />
                    </Field>

                    <Field :invalid="!card.versions.length">
                      <Field.Label>Version</Field.Label>
                      <Select
                        v-model="card.versionId"
                        size="medium"
                        placeholder="Select a version"
                        :disabled="deploying || card.readonly || !card.versions.length"
                        :invalid="!card.versions.length"
                        :display-value="(value) => versionLabel(card, value)"
                      >
                        <Select.Trigger class="w-full" />
                        <Select.Content>
                          <Select.Item
                            :value="LATEST"
                            icon="az az-sync"
                          >
                            Track latest Ready
                            <template #tag>
                              <span class="shrink-0 text-body-xs text-(--text-muted)">
                                resolves at deploy
                              </span>
                            </template>
                          </Select.Item>
                          <Select.Group label="Pin a ready version">
                            <Select.Item
                              v-for="version in card.versions"
                              :key="version.id"
                              :value="version.id"
                            >
                              {{ version.id }}
                              <template #tag>
                                <span class="flex shrink-0 items-center gap-(--spacing-xs)">
                                  <Tag
                                    v-if="version.current"
                                    label="Current"
                                    severity="success"
                                    size="small"
                                  />
                                  <span class="text-body-xs text-(--text-muted)">
                                    {{ version.age }}
                                  </span>
                                </span>
                              </template>
                            </Select.Item>
                          </Select.Group>
                        </Select.Content>
                      </Select>
                      <Field.Error v-if="!card.versions.length">
                        {{ card.name }} has no Ready version, so it cannot be deployed.
                      </Field.Error>
                      <Field.Description v-else-if="card.versionId === LATEST">
                        Resolves to {{ resolvedVersion(card) }} when the release deploys.
                      </Field.Description>
                    </Field>
                  </div>

                  <Button
                    v-if="!card.versions.length"
                    class="self-start"
                    label="Build a version"
                    variant="ghost"
                    size="small"
                    icon="az az-external-link"
                    href="/services/edge-policy/versions"
                  />

                  <div
                    v-if="card.groups.length"
                    class="flex min-w-0 flex-col rounded-(--shape-card) border border-(--border-default)"
                  >
                    <div
                      class="flex min-w-0 items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
                    >
                      <h3 class="truncate text-label-md text-(--text-default)">Dependencies</h3>
                      <Badge
                        :label="String(dependencyCount(card))"
                        variant="secondary"
                        size="small"
                      />
                    </div>
                    <Accordion
                      type="multiple"
                      size="medium"
                      :default-value="card.groups.map((group) => group.type)"
                    >
                      <Accordion.Item
                        v-for="group in card.groups"
                        :key="group.type"
                        :value="group.type"
                      >
                        <Accordion.Trigger>
                          <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                            <i
                              :class="resourceTypes[group.type].icon"
                              class="shrink-0 text-(--text-muted)"
                              aria-hidden="true"
                            />
                            <span class="truncate text-label-md text-(--text-default)">
                              {{ resourceTypes[group.type].label }}
                            </span>
                            <Badge
                              :label="String(group.rows.length)"
                              variant="secondary"
                              size="small"
                            />
                          </span>
                        </Accordion.Trigger>
                        <Accordion.Content>
                          <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                            <Alert
                              v-if="group.rows.some((row) => row.sharedWith?.length)"
                              severity="info"
                              size="small"
                              label="A shared dependency deploys at one version. Changing it here changes it under every resource in this release that references it."
                            />
                            <div
                              v-for="row in group.rows"
                              :key="row.name"
                              class="flex min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-muted) p-(--spacing-sm)"
                            >
                              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                                <span class="truncate text-label-sm text-(--text-default)">
                                  {{ row.name }}
                                </span>
                                <Tooltip
                                  v-if="row.sharedWith?.length"
                                  :content="`Also referenced by ${row.sharedWith.join(' and ')}.`"
                                >
                                  <span
                                    tabindex="0"
                                    class="inline-flex shrink-0 rounded-(--shape-control) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                                  >
                                    <Tag
                                      label="Shared"
                                      severity="info"
                                      icon="az az-link"
                                      size="small"
                                    />
                                  </span>
                                </Tooltip>
                              </div>
                              <Select
                                v-model="row.versionId"
                                size="medium"
                                :disabled="deploying"
                                :display-value="(value) => versionLabel(row, value)"
                              >
                                <Select.Trigger
                                  class="w-full"
                                  :aria-label="`Version of ${row.name}`"
                                />
                                <Select.Content>
                                  <Select.Item
                                    :value="LATEST"
                                    icon="az az-sync"
                                  >
                                    Track latest Ready
                                  </Select.Item>
                                  <Select.Group label="Pin a ready version">
                                    <Select.Item
                                      v-for="version in row.versions"
                                      :key="version.id"
                                      :value="version.id"
                                    >
                                      {{ version.id }}
                                      <template #tag>
                                        <span class="flex shrink-0 items-center gap-(--spacing-xs)">
                                          <Tag
                                            v-if="version.current"
                                            label="Current"
                                            severity="success"
                                            size="small"
                                          />
                                          <span class="text-body-xs text-(--text-muted)">
                                            {{ version.age }}
                                          </span>
                                        </span>
                                      </template>
                                    </Select.Item>
                                  </Select.Group>
                                </Select.Content>
                              </Select>
                            </div>
                          </div>
                        </Accordion.Content>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </div>
              </template>
            </Card>
          </section>

          <div class="min-w-0 xl:sticky xl:top-(--layout-boundary-start)">
            <Card>
              <template #header>
                <div class="flex min-w-0 flex-1 items-center justify-between gap-(--spacing-xs)">
                  <h2 class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="az az-bullseye shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate text-label-md text-(--text-default)">Impact</span>
                  </h2>
                  <ToggleGroup
                    v-if="impactState === 'ready' || impactState === 'partial'"
                    v-model="impactView"
                    :options="impactViews"
                    aria-label="Impact view"
                    size="small"
                    class="shrink-0"
                  />
                </div>
              </template>
              <template #default>
                <div
                  :aria-busy="impactState === 'loading' || undefined"
                  class="flex min-w-0 flex-col gap-(--spacing-sm)"
                >
                  <div
                    v-if="impactState === 'loading'"
                    class="flex min-w-0 flex-col gap-(--spacing-sm)"
                  >
                    <span class="flex items-center gap-(--spacing-xs)">
                      <span class="flex size-4 shrink-0 text-(--text-muted)">
                        <Spinner class="w-full" />
                      </span>
                      <span class="text-body-sm text-(--text-muted)">Computing impact…</span>
                    </span>
                    <Skeleton height="var(--size-4)" />
                    <Skeleton
                      height="var(--size-4)"
                      width="80%"
                    />
                    <Skeleton
                      height="var(--size-4)"
                      width="60%"
                    />
                  </div>

                  <div
                    v-else-if="impactState === 'unavailable'"
                    class="flex min-w-0 flex-col items-start gap-(--spacing-sm)"
                  >
                    <Alert
                      severity="warning"
                      size="small"
                      :label="unavailableMessage"
                    />
                    <span class="text-body-xs text-(--text-muted)">
                      {{ plural(impactTree.length, 'Deployment Setting', 'Deployment Settings') }}
                      selected
                    </span>
                    <Button
                      label="Retry"
                      variant="outline"
                      size="small"
                      icon="az az-refresh"
                      @click="emit('retry', $event)"
                    />
                  </div>

                  <template v-else>
                    <Alert
                      v-if="impactState === 'partial'"
                      severity="warning"
                      size="small"
                      :label="unavailableMessage"
                    />

                    <ul
                      v-if="impactView === 'tree'"
                      aria-label="Deployment Settings this release reaches"
                      class="m-0 flex min-w-0 list-none flex-col p-0 [--tree-indent:calc(var(--spacing-sm)*2)] [--tree-rail:var(--spacing-sm)]"
                    >
                      <li
                        v-for="settings in impactTree"
                        :key="settings.id"
                        class="flex min-w-0 flex-col"
                      >
                        <span
                          class="flex min-h-8 min-w-0 items-center justify-between gap-(--spacing-xs)"
                        >
                          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <i
                              class="az az-sliders-horizontal shrink-0 text-(--text-muted)"
                              aria-hidden="true"
                            />
                            <span class="truncate text-label-md text-(--text-default)">
                              {{ settings.name }}
                            </span>
                          </span>
                          <span class="shrink-0 text-body-xs tabular-nums text-(--text-muted)">
                            {{ plural(settings.domainsCount, 'domain', 'domains') }}
                          </span>
                        </span>
                        <p
                          v-if="!settings.environments.length"
                          class="ps-(--tree-indent) text-body-xs text-(--text-muted)"
                        >
                          No projects deploy with these settings yet.
                        </p>
                        <ul
                          v-else
                          class="m-0 flex min-w-0 list-none flex-col p-0 ps-(--tree-indent)"
                        >
                          <li
                            v-for="environment in settings.environments"
                            :key="environment.id"
                            class="relative flex min-w-0 flex-col before:absolute before:top-0 before:-start-(--tree-rail) before:h-4 before:w-(--tree-rail) before:rounded-es-(--shape-control) before:border-b before:border-s before:border-(--border-default) before:content-[''] after:absolute after:top-4 after:bottom-0 after:-start-(--tree-rail) after:border-s after:border-(--border-default) after:content-[''] last:after:hidden"
                          >
                            <span
                              class="flex min-h-8 min-w-0 items-center justify-between gap-(--spacing-xs)"
                            >
                              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                                <i
                                  class="az az-sitemap shrink-0 text-(--text-muted)"
                                  aria-hidden="true"
                                />
                                <span class="truncate text-label-md text-(--text-default)">
                                  {{ environment.name }}
                                </span>
                              </span>
                              <span class="shrink-0 text-body-xs tabular-nums text-(--text-muted)">
                                {{ plural(environment.projects.length, 'project', 'projects') }}
                              </span>
                            </span>
                            <ul class="m-0 flex min-w-0 list-none flex-col p-0 ps-(--tree-indent)">
                              <li
                                v-for="project in environment.projects"
                                :key="project.id"
                                class="relative flex min-w-0 before:absolute before:top-0 before:-start-(--tree-rail) before:h-4 before:w-(--tree-rail) before:rounded-es-(--shape-control) before:border-b before:border-s before:border-(--border-default) before:content-[''] after:absolute after:top-4 after:bottom-0 after:-start-(--tree-rail) after:border-s after:border-(--border-default) after:content-[''] last:after:hidden"
                              >
                                <span
                                  class="flex min-h-8 min-w-0 flex-1 items-center justify-between gap-(--spacing-xs)"
                                >
                                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                                    <i
                                      class="az az-folder shrink-0 text-(--text-muted)"
                                      aria-hidden="true"
                                    />
                                    <span class="truncate text-body-sm text-(--text-default)">
                                      {{ project.name }}
                                    </span>
                                  </span>
                                  <span
                                    class="shrink-0 text-body-xs tabular-nums text-(--text-muted)"
                                  >
                                    {{ plural(project.domainsCount, 'domain', 'domains') }}
                                  </span>
                                </span>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>

                    <ul
                      v-else
                      aria-label="Deployment Settings this release reaches"
                      class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-md) p-0"
                    >
                      <li
                        v-for="settings in impactTree"
                        :key="settings.id"
                        class="flex min-w-0 flex-col items-stretch gap-(--spacing-xs) sm:flex-row sm:items-center"
                      >
                        <span
                          class="flex min-w-0 shrink-0 flex-col gap-(--spacing-2xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs) sm:w-(--size-40)"
                        >
                          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <i
                              class="az az-sliders-horizontal shrink-0 text-(--text-muted)"
                              aria-hidden="true"
                            />
                            <span class="truncate text-label-md text-(--text-default)">
                              {{ settings.name }}
                            </span>
                          </span>
                          <span class="text-body-xs tabular-nums text-(--text-muted)">
                            {{ plural(settings.domainsCount, 'domain', 'domains') }}
                          </span>
                        </span>
                        <i
                          class="az az-arrow-right hidden shrink-0 text-body-xs text-(--text-muted) sm:block"
                          aria-hidden="true"
                        />
                        <span
                          v-if="!settings.environments.length"
                          class="flex rounded-(--shape-card) border border-dashed border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs) text-body-xs text-(--text-muted)"
                        >
                          No projects yet
                        </span>
                        <ul
                          v-else
                          :aria-label="`Environments of ${settings.name}`"
                          class="m-0 flex min-w-0 flex-1 list-none flex-col gap-(--spacing-xs) p-0"
                        >
                          <li
                            v-for="environment in settings.environments"
                            :key="environment.id"
                            class="flex min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
                          >
                            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                              <i
                                class="az az-sitemap shrink-0 text-(--text-muted)"
                                aria-hidden="true"
                              />
                              <span class="truncate text-label-md text-(--text-default)">
                                {{ environment.name }}
                              </span>
                              <Tag
                                :label="plural(environment.projects.length, 'project', 'projects')"
                                severity="neutral"
                                size="small"
                              />
                            </span>
                            <span
                              v-for="project in environment.projects"
                              :key="project.id"
                              class="flex min-w-0 items-center gap-(--spacing-xs)"
                            >
                              <i
                                class="az az-folder shrink-0 text-(--text-muted)"
                                aria-hidden="true"
                              />
                              <span class="truncate text-body-sm text-(--text-muted)">
                                {{ project.name }}
                              </span>
                            </span>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </template>
                  <span
                    class="sr-only"
                    role="status"
                  >
                    {{ impactState === 'loading' ? 'Computing impact' : '' }}
                  </span>
                </div>
              </template>
              <template
                v-if="impactState === 'ready' || impactState === 'partial'"
                #footer
              >
                <p class="text-body-sm text-(--text-muted)">{{ impactSummary }}</p>
              </template>
            </Card>
          </div>
        </div>
      </div>

      <SaveBar variant="docked">
        <template #leading>
          <p class="text-body-sm text-(--text-muted)">
            Deploying puts every included resource into traffic at the version shown.
          </p>
        </template>
        <template #actions>
          <p
            v-if="blocker"
            class="flex items-center gap-(--spacing-xs) text-body-sm text-(--warning-foreground)"
          >
            <i
              class="az az-triangle-alert shrink-0"
              aria-hidden="true"
            />
            {{ blocker }}
          </p>
          <div class="w-full md:w-fit">
            <Button
              class="w-full"
              label="Cancel"
              variant="outline"
              size="medium"
              href="/services/web-app"
              :disabled="deploying"
            />
          </div>
          <ConfirmDialog
            v-model:open="confirmOpen"
            title="Deploy this release?"
            :description="confirmBody"
            confirm-label="Deploy release"
            variant="primary"
            size="small"
            :disabled="!canDeploy"
            @confirm="confirmDeploy"
          >
            <template #trigger>
              <div class="w-full md:w-fit">
                <Button
                  class="w-full"
                  variant="primary"
                  size="medium"
                  icon="az az-cloud-upload"
                  :disabled="!canDeploy"
                  :loading="deploying"
                  :aria-keyshortcuts="toAriaKeyshortcuts('meta+enter')"
                >
                  {{ deploying ? 'Deploying…' : 'Deploy release' }}
                  <Kbd
                    v-if="!deploying"
                    meta
                    key-name="enter"
                    size="small"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </template>
          </ConfirmDialog>
        </template>
      </SaveBar>
    </main>
  </div>
</template>
```

## `sample.ts`

```ts
import type { ReleaseImpactResource, ReleaseImpactSettings } from './create-release-impact.vue'

export const sampleResources: ReleaseImpactResource[] = [
  {
    type: 'service',
    name: 'web-app',
    required: true,
    enabled: true,
    versionId: 'AG1VVDJP',
    versions: [
      { id: 'AG1VVDJP', current: true, age: '2 hours ago' },
      { id: 'AF3K2L9Q', age: '1 day ago' },
      { id: 'AD7M1X4R', age: '4 days ago' }
    ],
    groups: [
      {
        type: 'module',
        rows: [
          {
            name: 'auth-gateway',
            versionId: 'AB2C9D1E',
            versions: [
              { id: 'AB2C9D1E', current: true, age: '3 days ago' },
              { id: 'AA8F3G2H', age: '2 weeks ago' }
            ],
            sharedWith: ['checkout', 'admin-panel']
          },
          {
            name: 'geo-redirect',
            versionId: 'latest',
            versions: [{ id: 'AC4J6K8L', current: true, age: '5 days ago' }]
          }
        ]
      },
      {
        type: 'integration',
        rows: [
          {
            name: 'payments-api',
            versionId: 'AE5N7P9Q',
            versions: [{ id: 'AE5N7P9Q', current: true, age: '1 week ago' }]
          }
        ]
      }
    ]
  },
  {
    type: 'policy',
    name: 'edge-policy',
    canToggle: true,
    enabled: true,
    versionId: 'latest',
    versions: [
      { id: 'AH3R5T7V', current: true, age: '6 hours ago' },
      { id: 'AG9W1X3Y', age: '3 days ago' }
    ],
    groups: []
  },
  {
    type: 'storage',
    name: 'web-app-assets',
    readonly: true,
    enabled: true,
    versionId: 'AJ2B4D6F',
    versions: [{ id: 'AJ2B4D6F', current: true, age: '2 weeks ago' }],
    groups: []
  },
  {
    type: 'errorPage',
    name: 'web-app-errors',
    canToggle: true,
    enabled: false,
    note: 'Left out of this release. The error page serving now keeps serving.',
    versionId: 'latest',
    versions: [{ id: 'AK8M2P4R', current: true, age: '1 month ago' }],
    groups: []
  }
]

export const sampleImpact: ReleaseImpactSettings[] = [
  {
    id: 'production-settings',
    name: 'production-settings',
    domainsCount: 6,
    environments: [
      {
        id: 'production',
        name: 'Production',
        projects: [
          { id: 'web-app', name: 'web-app', domainsCount: 2 },
          { id: 'storefront', name: 'storefront', domainsCount: 3 }
        ]
      },
      {
        id: 'preview',
        name: 'Preview',
        projects: [{ id: 'web-app-preview', name: 'web-app-preview', domainsCount: 1 }]
      }
    ]
  },
  {
    id: 'staging-settings',
    name: 'staging-settings',
    domainsCount: 0,
    environments: []
  }
]
```
