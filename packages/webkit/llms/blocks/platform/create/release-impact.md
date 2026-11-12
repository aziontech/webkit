# ReleaseImpact (`platform/create/release-impact`)

> The Review and deploy page of a release that carries several resources at once. The left column holds one card per resource: its type and icon, a Required or Read-only `Tag` or an include `Switch` named by a `Tooltip`, the resource and a version `Select` that tracks the latest Ready version or pins one (each with a Current `Tag` and its age), an invalid line and Build a version when nothing is Ready, and a Dependencies box whose `Accordion` groups modules and integrations with counts, a Shared `Tag` with the resources that also reference it and one info `Alert` saying a shared dependency deploys at one version. The right column is the sticky Impact `Card`: a `ToggleGroup` switches a Tree (Deployment Settings, their environments and the projects they publish to, with rails and counts) and a Flow (the same as left-to-right cards), and its footer sums up what the release reaches. A sticky footer holds the hint, Cancel and Deploy release, which asks in a `ConfirmDialog` and then runs as an async action: one toast turns from Deploying release… into the outcome with Edit and Redeploy, and the page shows the outcome `Alert` with the same two actions. Built from `Card`, `Tag`, `Switch`, `Tooltip`, `Field`, `Select`, `Badge`, `Accordion`, `Alert`, `ToggleGroup`, `Skeleton`, `Spinner`, `Button`, `ConfirmDialog` and `Toaster`.

- Surface: product
- Source: `blocks/platform/create/release-impact/release-impact.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/create/release-impact")`
- Components: [Accordion](../../../components/accordion.md), [Alert](../../../components/alert.md), [Badge](../../../components/badge.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [ConfirmDialog](../../../components/confirm-dialog.md), [Field](../../../components/field.md), [Select](../../../components/select.md), [Skeleton](../../../components/skeleton.md), [Spinner](../../../components/spinner.md), [Switch](../../../components/switch.md), [Tag](../../../components/tag.md), [Toast](../../../components/toast.md), [ToggleGroup](../../../components/toggle-group.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-create-surface`, `webkit-form`, `webkit-ui-states`, `webkit-errors`

## Asked as

release impact; review and deploy; release composer; what a deploy changes; dependency versions; deployment impact; impacto do release; revisar e implantar; impacto del despliegue

The Review and deploy page of a release that carries several resources at once: a service, the policy in front of it, its storage, its error page and every dependency they reference. The user is about to put all of it into traffic and needs to see, before deploying, which version of each resource goes out, which dependencies go with it, and every Deployment Setting, environment and project the release reaches. One Deploy release at the foot commits it, after one confirmation.

## When to use

- A release spans several resources that deploy together, each at its own version.
- The release reaches projects through shared Deployment Settings, and the user must see how far it goes before it goes.
- Dependencies are detected from the resources and may be shared between them.

## When not to use

- Deploying one service or project from its page: use `platform/create/deploy-drawer`, which is the default way to deploy.
- Watching several Deployment Settings activate after a deploy started: use `platform/create/deploy-progress-dialog`.
- Reading what a past deploy did: use `platform/detail/deployment-logs`.
- Switching one resource back to an earlier version: use `platform/detail/version-detail` (Revert).

## Building blocks

The page opens with an `h1` reading Review and deploy and one sentence on what the page is for. No breadcrumb of its own; the shell gives it.

### A. Outcome — `Alert`, `Button` (required after a run)

When a run ends, one `Alert` above the columns says how it ended: `severity="danger"` with what was refused and that nothing changed in traffic, or `severity="success"` with what serves now. Both carry **Edit** and **Redeploy** in the `action` slot, the same two actions as the toast.

### B. Resource cards — `Switch`, `Tag`, `Tooltip` (required)

One bordered card per resource, in the order of the request path (service, policy, storage, error page). The header has the type icon and label and, on the end side, a Required `Tag` (warning), a Read-only `Tag` with a lock when the release keeps the active version, or an include `Switch` named by `aria-label` and explained by a `Tooltip` ("Leave edge-policy out of this release"). A left-out resource collapses to one sentence saying what keeps serving.

### C. Resource and version — `Field`, `Select`, `Tag` (required)

Two `Field`s side by side from `sm` up: the resource (read-only box) and its version. The version `Select` offers Track latest Ready first (with "resolves at deploy") and a Pin a ready version group, each option with a Current `Tag` and its age. When the version tracks the latest, the `Field.Description` names the version it resolves to now. When nothing is Ready, the `Select` is disabled and `invalid`, `Field.Error` gives the reason, and a transparent Build a version `Button` links to its versions.

### D. Dependencies — `Badge`, `Accordion`, `Alert`, `Tag`, `Tooltip`, `Select` (required when a resource references others)

A box under the resource fields headed Dependencies with a count `Badge`. A `type="multiple"` `Accordion`, open by default, groups them by type (Modules, Integrations) with a count each. Each dependency has its own version `Select` labelled "Version of <name>" for screen readers. A dependency referenced by other resources carries a Shared `Tag` whose `Tooltip` names them, and its group opens with one info `Alert`: a shared dependency deploys at one version.

### E. Impact — `Card`, `ToggleGroup`, `Spinner`, `Skeleton`, `Alert`, `Button` (required)

The right column, sticky from `xl`. The `Card` header has the title Impact and, once ready, a small `ToggleGroup` named Impact view with Tree and Flow.

- **Tree** — a nested list: each Deployment Setting with its domain count, its environments with their project count, and the projects with theirs. Rails are drawn with logical borders, so they mirror under RTL.
- **Flow** — the same data left to right: the setting as a raised card, an arrow, then one card per environment listing its projects. It is plain lists and cards, not `Flow`: `Flow` still carries `aria-required-parent` and `aria-required-children` findings, and this view has nothing to connect beyond one level.
- **Loading** — Computing impact… with a `Spinner` and three `Skeleton` lines; the region is `aria-busy` and a status line announces it.
- **Unavailable** — a warning `Alert` saying the impact is unknown, how many settings are selected, and Retry. Deploying stays possible.
- **Partial** — the list was truncated: a warning `Alert` above the tree.

The `Card` footer sums the reach in one sentence: projects, environments and Deployment Settings.

### F. Footer and commit — `Button`, `ConfirmDialog`, `Toaster` (required)

A sticky bar: the hint on the start side; on the end side the blocker (if any) with a warning icon, Cancel (outlined, back to the service) and Deploy release (primary, cloud icon). Deploy release opens a `ConfirmDialog` (`kind="primary"`) titled "Deploy this release?" that lists every resource and version and the reach. Confirm closes it and starts the run as an async action (`platform/states/async-submit`): one toast id turns from `toast.loading` ("Deploying release…", with "It keeps running if you leave.") into `toast.success` or `toast.error`, `duration: 0`, `closable`, with **Edit** and **Redeploy**. Never View deployments.

## Do

- Show every resource and dependency with the version that goes out, including the ones the user did not touch.
- Say what tracking the latest Ready version resolves to now.
- Block Deploy release only for something the user can fix here, and say what it is in the footer.
- Keep Deploy possible when the impact cannot be computed; say the impact is unknown.
- Report the outcome through the toast and the page `Alert`, both with Edit and Redeploy.

## Don't

- Don't hide shared dependencies; changing one changes it everywhere in the release.
- Don't confirm twice: the page is the review, the `ConfirmDialog` is the only step before the run.
- Don't keep the user on the page while it runs; the run reports wherever they are.
- Don't draw the Flow view with `Flow` until its list semantics pass axe.

## Copy

- **Title:** "Review and deploy". **Commit:** "Deploy release"; in progress "Deploying…".
- **Confirmation:** "Deploy this release?" and one sentence with the resources, versions and reach.
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
- The `ConfirmDialog` traps focus and returns it to Deploy release.

## States

- Ready: every resource with a version, the impact computed, Tree view.
- Loading: the impact being computed.
- Unavailable: the impact could not be read; Retry lands on a truncated list.
- MissingVersion: a resource without a Ready version blocks the deploy.
- Failed: the last run was refused; Edit and Redeploy on the toast and the page `Alert`.

## Related

- `platform/create/deploy-drawer` — deploying one service or project.
- `platform/create/deploy-progress-dialog` — several Deployment Settings activating after the deploy.
- `platform/states/async-submit` — the toast rule every deploy follows.
- `platform/detail/version-detail` — one version, its history and revert.

## Variants

- `Ready` — primary (the code below)
- `Loading` — The impact is being computed: the Impact card shows Computing impact… with a `Spinner` and three `Skeleton` lines, is `aria-busy`, announces it through a status line, hides the view switch and the summary, and the footer says Computing impact… beside Deploy release.
- `Unavailable` — The projects behind the Deployment Settings could not be read: a warning `Alert` says the impact is unknown and that the release can still deploy, the count of settings selected and Retry. Retry computes again and lands on a truncated list, shown with its own warning above the tree.
- `MissingVersion` — edge-policy has no Ready version: its version `Select` is disabled and invalid with the reason under it, Build a version links to its versions, and Deploy release stays disabled with the reason in the footer. Switching edge-policy off the release clears the blocker.
- `Failed` — The last run failed: the error toast and the danger `Alert` at the top say edge-policy was refused and nothing changed in traffic, each with Edit (back to the resources) and Redeploy. Redeploy runs again through the same toast and succeeds.

Each variant is the same screen in another state: `get_pattern("platform/create/release-impact", { variant })`, or the file under `blocks/platform/create/release-impact/variants/`.

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
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Spinner from '@aziontech/webkit/spinner'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

  type ImpactState = 'ready' | 'loading' | 'partial' | 'unavailable'
  type Outcome = '' | 'failed' | 'succeeded'
  type ResourceType = 'service' | 'policy' | 'storage' | 'errorPage' | 'module' | 'integration'

  interface Scenario {
    impact: ImpactState
    missingVersion: boolean
    failFirstRun: boolean
  }

  interface ResourceTypeMeta {
    label: string
    icon: string
  }

  interface ResourceVersion {
    id: string
    current?: boolean
    age: string
  }

  interface VersionedResource {
    versionId: string
    versions: ResourceVersion[]
  }

  interface DependencyRow extends VersionedResource {
    name: string
    sharedWith?: string[]
  }

  interface DependencyGroup {
    type: ResourceType
    rows: DependencyRow[]
  }

  interface ResourceCard extends VersionedResource {
    type: ResourceType
    name: string
    required?: boolean
    canToggle?: boolean
    readonly?: boolean
    enabled: boolean
    note?: string
    groups: DependencyGroup[]
  }

  const SCENARIO: Scenario = {
    impact: 'ready',
    missingVersion: false,
    failFirstRun: false
  }

  const RUN_TOAST = 'release-impact-run'
  const RUN_MS = 3000
  const IMPACT_MS = 1200
  const LATEST = 'latest'

  const resourceTypes: Record<ResourceType, ResourceTypeMeta> = {
    service: { label: 'Service', icon: 'pi pi-server' },
    policy: { label: 'Policy', icon: 'pi pi-shield' },
    storage: { label: 'Storage', icon: 'pi pi-inbox' },
    errorPage: { label: 'Error page', icon: 'pi pi-file' },
    module: { label: 'Modules', icon: 'pi pi-code' },
    integration: { label: 'Integrations', icon: 'pi pi-link' }
  }

  const cards = reactive<ResourceCard[]>([
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
              versionId: LATEST,
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
      versionId: SCENARIO.missingVersion ? '' : LATEST,
      versions: SCENARIO.missingVersion
        ? []
        : [
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
      versionId: LATEST,
      versions: [{ id: 'AK8M2P4R', current: true, age: '1 month ago' }],
      groups: []
    }
  ])

  const impactTree = [
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

  const impactViews = [
    { label: 'Tree', value: 'tree' },
    { label: 'Flow', value: 'flow' }
  ]

  const impactState = ref<ImpactState>(SCENARIO.impact)
  const impactView = ref('tree')
  const confirmOpen = ref(false)
  const deploying = ref(false)
  const outcome = ref<Outcome>('')
  const failNext = ref(SCENARIO.failFirstRun)
  const resourcesHeading = ref<HTMLElement | null>(null)

  let impactTimer = 0
  let runTimer = 0

  const plural = (count: number, one: string, other: string) =>
    `${count} ${count === 1 ? one : other}`

  const versionLabel = (card: VersionedResource, id: unknown) => {
    if (id === LATEST) return 'Track latest Ready'
    return card.versions.find((version) => version.id === id)?.id ?? String(id)
  }

  const resolvedVersion = (card: ResourceCard) =>
    card.versionId === LATEST
      ? (card.versions.find((version) => version.current)?.id ?? '')
      : card.versionId

  const dependencyCount = (card: ResourceCard) =>
    card.groups.reduce((total, group) => total + group.rows.length, 0)

  const included = computed(() => cards.filter((card) => card.enabled))

  const missing = computed(() =>
    included.value.filter((card) => !card.readonly && !card.versions.length)
  )

  const projects = computed(() =>
    impactTree.flatMap((settings) =>
      settings.environments.flatMap((environment) => environment.projects)
    )
  )

  const environments = computed(() =>
    impactTree.flatMap((settings) => settings.environments.map((environment) => environment.name))
  )

  const impactSummary = computed(
    () =>
      `This release reaches ${plural(projects.value.length, 'project', 'projects')} in ${plural(environments.value.length, 'environment', 'environments')} through ${plural(impactTree.length, 'Deployment Setting', 'Deployment Settings')}.`
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
      : 'The projects that deploy with these settings could not be read, so the impact is unknown. Retry, or deploy without the preview.'
  )

  const loadImpact = () => {
    clearTimeout(impactTimer)
    impactState.value = 'loading'
    impactTimer = setTimeout(() => {
      impactState.value = SCENARIO.impact === 'unavailable' ? 'partial' : 'ready'
    }, IMPACT_MS)
  }

  const edit = async () => {
    toast.dismiss(RUN_TOAST)
    outcome.value = ''
    await nextTick()
    resourcesHeading.value?.focus()
  }

  const finishRun = () => {
    deploying.value = false
    const actions = [
      { label: 'Edit', onClick: edit },
      { label: 'Redeploy', onClick: startRun }
    ]
    if (failNext.value) {
      failNext.value = false
      outcome.value = 'failed'
      toast.error("The release wasn't deployed.", {
        id: RUN_TOAST,
        description:
          'edge-policy was refused: a rule points at an integration that does not exist.',
        duration: 0,
        closable: true,
        actions
      })
      return
    }
    outcome.value = 'succeeded'
    toast.success('Release deployed.', {
      id: RUN_TOAST,
      description: `${releaseLine.value} serve ${plural(projects.value.length, 'project', 'projects')} now.`,
      duration: 0,
      closable: true,
      actions
    })
  }

  const startRun = () => {
    clearTimeout(runTimer)
    deploying.value = true
    outcome.value = ''
    toast.loading('Deploying release…', {
      id: RUN_TOAST,
      description: `${releaseLine.value}. It keeps running if you leave.`
    })
    runTimer = setTimeout(finishRun, RUN_MS)
  }

  const confirmDeploy = () => {
    confirmOpen.value = false
    startRun()
  }

  onMounted(() => {
    if (SCENARIO.failFirstRun) finishRun()
  })

  onBeforeUnmount(() => {
    clearTimeout(impactTimer)
    clearTimeout(runTimer)
    toast.dismiss(RUN_TOAST)
  })
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-(--bg-canvas)">
    <main class="flex min-h-0 flex-1 flex-col">
      <div
        class="layout-column-focused layout-boundary flex min-w-0 flex-1 flex-col gap-(--layout-section-gap)"
      >
        <header class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <h1 class="text-balance text-heading-lg text-(--text-default)">Review and deploy</h1>
          <p class="text-body-md text-(--text-muted)">
            Check the resources this release deploys and everything it reaches, then deploy it.
          </p>
        </header>

        <Alert
          key="alert-1"
          v-if="outcome === 'failed'"
          severity="danger"
          label="The release wasn't deployed. edge-policy was refused: a rule points at an integration that does not exist. Nothing changed in traffic."
        >
          <template #action>
            <div class="flex shrink-0 items-center gap-(--spacing-xs)">
              <Button
                label="Edit"
                kind="outlined"
                size="small"
                @click="edit"
              />
              <Button
                label="Redeploy"
                kind="outlined"
                size="small"
                icon="pi pi-refresh"
                @click="startRun"
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
          <template #action>
            <div class="flex shrink-0 items-center gap-(--spacing-xs)">
              <Button
                label="Edit"
                kind="outlined"
                size="small"
                @click="edit"
              />
              <Button
                label="Redeploy"
                kind="outlined"
                size="small"
                icon="pi pi-refresh"
                @click="startRun"
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
              ref="resourcesHeading"
              tabindex="-1"
              class="text-heading-xs text-(--text-default) focus-visible:outline-none"
            >
              Resources
            </h2>

            <section
              v-for="card in cards"
              :key="card.type"
              :aria-label="`${resourceTypes[card.type].label} ${card.name}`"
              :data-included="card.enabled || null"
              class="flex min-w-0 flex-col rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
            >
              <header
                class="flex min-h-14 min-w-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
              >
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
                    severity="secondary"
                    icon="pi pi-lock"
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
                    :text="
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
              </header>

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
                    <div
                      class="flex min-h-9 min-w-0 items-center justify-between gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised) px-(--spacing-sm)"
                    >
                      <span class="truncate text-body-sm text-(--text-default)">
                        {{ card.name }}
                      </span>
                      <i
                        v-if="card.readonly"
                        class="pi pi-lock shrink-0 text-(--text-muted)"
                        aria-hidden="true"
                      />
                    </div>
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
                        <Select.Option
                          :value="LATEST"
                          icon="pi pi-sync"
                        >
                          Track latest Ready
                          <template #tag>
                            <span class="shrink-0 text-body-xs text-(--text-muted)">
                              resolves at deploy
                            </span>
                          </template>
                        </Select.Option>
                        <Select.Group label="Pin a ready version">
                          <Select.Option
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
                          </Select.Option>
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
                  kind="transparent"
                  size="small"
                  icon="pi pi-external-link"
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
                      severity="secondary"
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
                            severity="secondary"
                            size="small"
                          />
                        </span>
                      </Accordion.Trigger>
                      <Accordion.Content>
                        <div
                          class="flex min-w-0 flex-col gap-(--spacing-sm) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-md)"
                        >
                          <Alert
                            v-if="group.rows.some((row) => row.sharedWith?.length)"
                            severity="info"
                            size="small"
                            label="A shared dependency deploys at one version. Changing it here changes it under every resource in this release that references it."
                          />
                          <div
                            v-for="row in group.rows"
                            :key="row.name"
                            class="flex min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-muted) p-(--spacing-sm)"
                          >
                            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                              <span class="truncate text-label-sm text-(--text-default)">
                                {{ row.name }}
                              </span>
                              <Tooltip
                                v-if="row.sharedWith?.length"
                                :text="`Also referenced by ${row.sharedWith.join(' and ')}.`"
                              >
                                <span
                                  tabindex="0"
                                  class="inline-flex shrink-0 rounded-(--shape-elements) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                                >
                                  <Tag
                                    label="Shared"
                                    severity="info"
                                    icon="pi pi-link"
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
                                <Select.Option
                                  :value="LATEST"
                                  icon="pi pi-sync"
                                >
                                  Track latest Ready
                                </Select.Option>
                                <Select.Group label="Pin a ready version">
                                  <Select.Option
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
                                  </Select.Option>
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
            </section>
          </section>

          <div class="min-w-0 xl:sticky xl:top-(--layout-boundary-start)">
            <Card>
              <template #header>
                <div class="flex min-w-0 flex-1 items-center justify-between gap-(--spacing-xs)">
                  <h2 class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="pi pi-bullseye shrink-0 text-(--text-muted)"
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
              <template #content>
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
                      kind="outlined"
                      size="small"
                      icon="pi pi-refresh"
                      @click="loadImpact"
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
                              class="pi pi-sliders-h shrink-0 text-(--text-muted)"
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
                            class="relative flex min-w-0 flex-col before:absolute before:top-0 before:-start-(--tree-rail) before:h-4 before:w-(--tree-rail) before:rounded-es-(--shape-elements) before:border-b before:border-s before:border-(--border-default) before:content-[''] after:absolute after:top-4 after:bottom-0 after:-start-(--tree-rail) after:border-s after:border-(--border-default) after:content-[''] last:after:hidden"
                          >
                            <span
                              class="flex min-h-8 min-w-0 items-center justify-between gap-(--spacing-xs)"
                            >
                              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                                <i
                                  class="pi pi-sitemap shrink-0 text-(--text-muted)"
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
                                class="relative flex min-w-0 before:absolute before:top-0 before:-start-(--tree-rail) before:h-4 before:w-(--tree-rail) before:rounded-es-(--shape-elements) before:border-b before:border-s before:border-(--border-default) before:content-[''] after:absolute after:top-4 after:bottom-0 after:-start-(--tree-rail) after:border-s after:border-(--border-default) after:content-[''] last:after:hidden"
                              >
                                <span
                                  class="flex min-h-8 min-w-0 flex-1 items-center justify-between gap-(--spacing-xs)"
                                >
                                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                                    <i
                                      class="pi pi-folder shrink-0 text-(--text-muted)"
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
                          class="flex min-w-0 shrink-0 flex-col gap-(--spacing-xxs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs) sm:w-(--size-40)"
                        >
                          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <i
                              class="pi pi-sliders-h shrink-0 text-(--text-muted)"
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
                          class="pi pi-arrow-right hidden shrink-0 text-body-xs text-(--text-muted) sm:block"
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
                                class="pi pi-sitemap shrink-0 text-(--text-muted)"
                                aria-hidden="true"
                              />
                              <span class="truncate text-label-md text-(--text-default)">
                                {{ environment.name }}
                              </span>
                              <Tag
                                :label="plural(environment.projects.length, 'project', 'projects')"
                                severity="secondary"
                                size="small"
                              />
                            </span>
                            <span
                              v-for="project in environment.projects"
                              :key="project.id"
                              class="flex min-w-0 items-center gap-(--spacing-xs)"
                            >
                              <i
                                class="pi pi-folder shrink-0 text-(--text-muted)"
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

      <footer class="sticky bottom-0 shrink-0 border-t border-(--border-muted) bg-(--bg-surface)">
        <div
          class="layout-column-focused layout-boundary-inline flex flex-col gap-(--spacing-sm) py-(--spacing-md) md:flex-row md:items-center md:justify-between"
        >
          <p class="text-body-sm text-(--text-muted)">
            Deploying puts every included resource into traffic at the version shown.
          </p>
          <div class="flex flex-col gap-(--spacing-sm) md:flex-row md:items-center md:justify-end">
            <p
              v-if="blocker"
              class="flex items-center gap-(--spacing-xs) text-body-sm text-(--warning-contrast)"
            >
              <i
                class="pi pi-exclamation-triangle shrink-0"
                aria-hidden="true"
              />
              {{ blocker }}
            </p>
            <div class="flex flex-col gap-(--spacing-sm) md:flex-row md:items-center">
              <div class="w-full md:w-fit">
                <Button
                  class="w-full"
                  label="Cancel"
                  kind="outlined"
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
                kind="primary"
                size="small"
                :disabled="!canDeploy"
                @confirm="confirmDeploy"
              >
                <template #trigger>
                  <div class="w-full md:w-fit">
                    <Button
                      class="w-full"
                      :label="deploying ? 'Deploying…' : 'Deploy release'"
                      kind="primary"
                      size="medium"
                      icon="pi pi-cloud-upload"
                      :disabled="!canDeploy"
                      :loading="deploying"
                    />
                  </div>
                </template>
              </ConfirmDialog>
            </div>
          </div>
        </div>
      </footer>
    </main>
    <Toaster position="bottom-right" />
  </div>
</template>
```
