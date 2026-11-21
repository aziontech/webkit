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
  import { useLocale } from '@aziontech/webkit/use-locale'
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
    /** When it was built, as an ISO 8601 string. */
    builtAt: string
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

  const relativeTime = useLocale().formatRelativeTime
  const ago = (value: Date | string) => (value ? relativeTime(new Date(value)) : '')
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
                                    {{ ago(version.builtAt) }}
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
                                            {{ ago(version.builtAt) }}
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
                  <span
                    v-if="!deploying"
                    class="max-lg:hidden"
                    aria-hidden="true"
                  >
                    <Kbd
                      meta
                      key-name="enter"
                      size="small"
                    />
                  </span>
                </Button>
              </div>
            </template>
          </ConfirmDialog>
        </template>
      </SaveBar>
    </main>
  </div>
</template>
