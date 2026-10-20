<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import Popover from '@aziontech/webkit/popover'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { deployResource, pinnedVersions, withDependencies } from '../../lib/data/deploy-resources'
  import { applicationDeploymentRows } from '../../lib/data/deployment-history'
  import { environments } from '../../lib/data/environments'
  import {
    applicationVersion,
    buildApplicationVersion,
    markVersionDeployed,
    newVersionId,
    recordApplicationBuild,
    versionChoices
  } from '../../lib/data/releases'
  import { domainForWorkload } from '../../lib/data/workload-provisioning'
  import { workloadById } from '../../lib/data/workloads'
  import { startResourceDeployRun } from '../../lib/state/deploy-runs'
  import ResourceDrawer from '../form/ResourceDrawer.vue'
  import Section from '../page/Section.vue'
  import DeployEnvironmentField from './DeployEnvironmentField.vue'
  import DeployResources from './DeployResources.vue'

  interface Props {
    application: Record<string, unknown>
    source?: string
    preferredWorkload?: { id: string; name: string } | null
    preferredEnvironment?: string
    pinnedVersionId?: string
    buildVersionId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    source: '',
    preferredWorkload: null,
    preferredEnvironment: '',
    pinnedVersionId: '',
    buildVersionId: ''
  })

  const emit = defineEmits<{
    deployed: [value: Record<string, unknown>]
  }>()

  const open = defineModel('open', { type: Boolean, default: false })

  const BUILD_MS = 6000
  const TICK_MS = 1000

  const HINTS = {
    resources:
      'The application version this deployment publishes, and the version of every function and connector it references.',
    workload:
      'The workload whose domains serve the application. Create one to publish it on a new domain.',
    environment:
      'Where the deployment goes live. Each environment publishes with its own Deployment Settings.'
  }

  const WORKLOAD_MODES = [
    { value: 'existing', label: 'Use existing' },
    { value: 'new', label: 'Create new' }
  ]

  const building = ref(false)
  const elapsed = ref(0)
  const builtId = ref('')
  const pendingName = ref('')
  const versionId = ref('')
  const dependencyPicks = ref({})
  const workloadMode = ref('existing')
  const workloadId = ref('')
  const workloadOpen = ref(false)
  const environment = ref('')

  let buildTimer = 0
  let tickTimer = 0

  const appName = computed(() => String(props.application?.name ?? ''))

  const versions = computed(() =>
    versionChoices('application', appName.value).map((entry) => ({
      ...entry,
      fresh: entry.id === builtId.value
    }))
  )

  const version = computed(
    () => versions.value.find((entry) => entry.id === versionId.value) ?? versions.value[0] ?? null
  )

  const history = computed(() =>
    applicationDeploymentRows(String(props.application?.id ?? ''), appName.value)
  )

  const boundWorkloads = computed(() => {
    const seen = new Set()
    const preferred = props.preferredWorkload
      ? [
          {
            workloadId: props.preferredWorkload.id,
            workloadName: props.preferredWorkload.name,
            environment: ''
          }
        ]
      : []
    return [...preferred, ...history.value]
      .filter((row) => {
        if (!row.workloadId || seen.has(row.workloadId)) return false
        seen.add(row.workloadId)
        return true
      })
      .map((row) => ({
        id: row.workloadId,
        name: row.workloadName,
        domain: workloadById(row.workloadId)?.domain ?? domainForWorkload(row.workloadName),
        environment: row.environment
      }))
  })

  const lastUsed = computed(() => boundWorkloads.value[0] ?? null)

  const existingWorkload = computed(
    () =>
      boundWorkloads.value.find((entry) => entry.id === workloadId.value) ?? lastUsed.value ?? null
  )

  const isLastUsed = computed(
    () =>
      workloadMode.value === 'existing' &&
      Boolean(lastUsed.value?.environment) &&
      existingWorkload.value?.id === lastUsed.value.id
  )

  const newWorkload = computed(() => ({
    id: '',
    name: appName.value,
    domain: domainForWorkload(appName.value)
  }))

  const workload = computed(() =>
    workloadMode.value === 'new' ? newWorkload.value : existingWorkload.value
  )

  const modeOptions = computed(() =>
    WORKLOAD_MODES.map((mode) => ({
      ...mode,
      disabled: mode.value === 'existing' && !boundWorkloads.value.length
    }))
  )

  const environmentOptions = computed(() => environments.value)

  const environmentChoices = computed(() =>
    environmentOptions.value.map((entry) => ({
      name: entry.name,
      description: entry.description,
      tag: entry.name === lastEnvironment.value ? 'Last used' : ''
    }))
  )

  const lastEnvironment = computed(() => {
    const rows =
      workloadMode.value === 'existing' && workload.value
        ? history.value.filter((row) => row.workloadId === workload.value.id)
        : history.value
    return rows[0]?.environment ?? ''
  })

  const resourcePicks = computed({
    get: () => ({ application: version.value?.id ?? '' }),
    set: (picks) => {
      versionId.value = picks.application ?? ''
    }
  })

  const groups = computed(() =>
    withDependencies(
      appName.value
        ? [
            deployResource({
              key: 'application',
              type: 'application',
              name: appName.value,
              versions: versions.value
            })
          ]
        : [],
      resourcePicks.value
    )
  )

  const pinned = computed(() =>
    pinnedVersions(groups.value, resourcePicks.value, dependencyPicks.value)
  )

  const canDeploy = computed(
    () => !building.value && Boolean(version.value && workload.value && environment.value)
  )

  const clearTimers = () => {
    clearTimeout(buildTimer)
    clearInterval(tickTimer)
  }

  const finishBuild = (existingId = '') => {
    clearTimers()
    building.value = false
    const builtVersionId =
      existingId ||
      recordApplicationBuild(
        appName.value,
        props.source ? `Built from ${props.source}` : 'New build',
        pendingName.value || undefined
      ).id
    builtId.value = builtVersionId
    versionId.value = builtVersionId
  }

  const startBuild = () => {
    clearTimers()
    building.value = true
    elapsed.value = 0
    tickTimer = setInterval(() => {
      elapsed.value += 1
    }, TICK_MS)
    if (props.buildVersionId) {
      const draftId = props.buildVersionId
      pendingName.value = applicationVersion(appName.value, draftId)?.name ?? ''
      buildApplicationVersion(appName.value, draftId, BUILD_MS).then(() => {
        if (building.value) finishBuild(draftId)
      })
      return
    }
    pendingName.value = newVersionId(appName.value)
    buildTimer = setTimeout(() => finishBuild(), BUILD_MS)
  }

  const reset = () => {
    dependencyPicks.value = {}
    workloadOpen.value = false
    workloadMode.value = boundWorkloads.value.length ? 'existing' : 'new'
    workloadId.value = lastUsed.value?.id ?? ''
    const remembered = environmentOptions.value.find(
      (entry) => entry.name === lastUsed.value?.environment
    )
    const preferred = environmentOptions.value.find(
      (entry) => entry.name === props.preferredEnvironment
    )
    environment.value =
      preferred?.name ?? remembered?.name ?? environmentOptions.value[0]?.name ?? ''
    versionId.value = ''
  }

  watch(
    open,
    (isOpen) => {
      if (!isOpen) {
        clearTimers()
        building.value = false
        return
      }
      reset()
      if (props.pinnedVersionId) {
        versionId.value = props.pinnedVersionId
        return
      }
      startBuild()
    },
    { immediate: true }
  )

  onScopeDispose(clearTimers)

  const pickWorkload = (id) => {
    workloadId.value = id
    workloadOpen.value = false
  }

  const deploy = () => {
    if (!canDeploy.value) return

    const target =
      workloadMode.value === 'new'
        ? { ...newWorkload.value, id: `new-${Date.now()}` }
        : workload.value

    markVersionDeployed(appName.value, version.value.id)

    startResourceDeployRun({
      workload: { id: target.id, name: target.name, domain: target.domain },
      application: { id: props.application.id, name: appName.value },
      version: { id: version.value.id, name: version.value.name },
      dependencies: pinned.value.dependencies,
      deploymentName: `${appName.value}-${version.value.name}`,
      environment: environment.value,
      preset: String(props.application.preset || 'javascript')
    })

    emit('deployed', {
      versionId: version.value.id,
      workload: target,
      created: workloadMode.value === 'new',
      environment: environment.value
    })
    open.value = false
  }
</script>

<template>
  <ResourceDrawer
    v-model:open="open"
    :title="pinnedVersionId ? 'Deploy' : 'Build and Deployment'"
    save-label="Deploy"
    :save-disabled="!canDeploy"
    @submit="deploy"
  >
    <Section
      stacked
      :divided="false"
      title="Resources"
      :hint="HINTS.resources"
    >
      <Item
        v-if="building"
        kind="outline"
        size="small"
        aria-live="polite"
        data-testid="application-deploy-dialog__build"
      >
        <Item.Media>
          <span
            class="flex size-7 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
          >
            <i
              class="ai ai-edge-application text-body-xs text-(--text-default)"
              aria-hidden="true"
            />
          </span>
        </Item.Media>
        <Item.Content>
          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
            <Item.Title class="truncate">{{ appName }}</Item.Title>
            <Tag
              :label="pendingName"
              severity="secondary"
              size="small"
              class="shrink-0"
            />
          </span>
          <Item.Description>Building…</Item.Description>
        </Item.Content>
        <Item.Actions class="gap-(--spacing-xs)">
          <span
            class="font-(family-name:--font-code) text-label-sm tabular-nums text-(--text-muted)"
          >
            {{ elapsed }} s
          </span>
          <Spinner class="size-6 shrink-0 text-(--text-default)" />
        </Item.Actions>
      </Item>

      <DeployResources
        v-else
        v-model:resource-picks="resourcePicks"
        v-model:dependency-picks="dependencyPicks"
        :resources="groups"
      />
    </Section>

    <Section
      stacked
      :divided="false"
      title="Workload"
      :hint="HINTS.workload"
      :inert="building"
      :data-pending="building || null"
      class="transition-opacity duration-moderate-01 ease-productive-entrance data-pending:opacity-32 motion-reduce:transition-none"
    >
      <CardBox :padded="false">
        <template #header>
          <SegmentedButton
            v-model="workloadMode"
            :options="modeOptions"
            size="medium"
            fluid
            aria-label="Workload"
            class="w-full"
          />
        </template>
        <template #content>
          <div class="p-(--spacing-lg)">
            <Item
              v-if="workload"
              kind="outline"
              size="small"
            >
              <Item.Media>
                <span
                  class="flex size-7 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                >
                  <i
                    class="ai ai-workloads text-body-xs text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
              </Item.Media>
              <Item.Content>
                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <Item.Title class="truncate">{{ workload.name }}</Item.Title>
                  <Tag
                    v-if="isLastUsed"
                    label="Last used"
                    severity="info"
                    size="small"
                    class="shrink-0"
                  />
                </span>
                <Item.Description v-if="workload.domain">{{ workload.domain }}</Item.Description>
              </Item.Content>
              <Item.Actions v-if="workloadMode === 'existing'">
                <Popover
                  v-model:open="workloadOpen"
                  placement="bottom-end"
                  width="small"
                >
                  <Popover.Trigger>
                    <Button
                      label="Change"
                      kind="outlined"
                      size="small"
                      icon="pi pi-chevron-down"
                      icon-position="trailing"
                    />
                  </Popover.Trigger>
                  <Popover.Content>
                    <div class="flex min-w-0 flex-col p-(--spacing-xxs)">
                      <p
                        class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
                      >
                        Workloads serving {{ appName }}
                      </p>
                      <div class="max-h-72 overflow-y-auto overscroll-contain">
                        <button
                          v-for="(entry, index) in boundWorkloads"
                          :key="entry.id"
                          type="button"
                          :aria-current="entry.id === workload.id || undefined"
                          class="flex w-full min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                          @click="pickWorkload(entry.id)"
                        >
                          <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
                            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                              <span class="truncate text-body-sm text-(--text-default)">
                                {{ entry.name }}
                              </span>
                              <Tag
                                v-if="index === 0 && entry.environment"
                                label="Last used"
                                severity="info"
                                size="small"
                                class="shrink-0"
                              />
                            </span>
                            <span
                              v-if="entry.environment"
                              class="truncate text-body-xs text-(--text-muted)"
                            >
                              {{ entry.environment }}
                            </span>
                          </span>
                          <i
                            v-if="entry.id === workload.id"
                            class="pi pi-check shrink-0 text-body-xs text-(--text-default)"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </div>
                  </Popover.Content>
                </Popover>
              </Item.Actions>
            </Item>
          </div>
        </template>
      </CardBox>
    </Section>

    <Section
      stacked
      :divided="false"
      title="Environment"
      :hint="HINTS.environment"
      :inert="building"
      :data-pending="building || null"
      class="transition-opacity duration-moderate-01 ease-productive-entrance data-pending:opacity-32 motion-reduce:transition-none"
    >
      <DeployEnvironmentField
        v-model="environment"
        name="application-deploy-environment"
        :options="environmentChoices"
      />
    </Section>
  </ResourceDrawer>
</template>
