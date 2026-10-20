<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Message from '@aziontech/webkit/message'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { toast } from '@aziontech/webkit/toast'
  import { consoleDeployRowsFor } from '@shared/lib/azion-deploys'
  import { computed, ref, watch } from 'vue'

  import { deploymentRowsFor } from '../../lib/data/deployment-history'
  import { environmentByName } from '../../lib/data/environments'
  import {
    deployResource,
    pinnedVersions,
    removedResource,
    withDependencies
  } from '../../lib/data/deploy-resources'
  import {
    applicationRecord,
    DEPLOY_FAILS_ONCE,
    DEPLOY_FAILURE_MESSAGE,
    servingApplication,
    settingsById
  } from '../../lib/data/releases'
  import { BIND_TARGET_ORDER, bindTargetFor } from '../../lib/data/topology-bind-targets'
  import { RESOURCE_DEPLOY_DURATION_MS, startResourceDeployRun } from '../../lib/state/deploy-runs'
  import DeployEnvironmentField from '../deployment/DeployEnvironmentField.vue'
  import DeployResources from '../deployment/DeployResources.vue'
  import ResourceDrawer from '../form/ResourceDrawer.vue'
  import Section from '../page/Section.vue'

  const open = defineModel('open', { type: Boolean, default: false })

  interface Props {
    workload: Record<string, unknown>
    environments?: unknown[]
    preselectedEnvironment?: string
    staged?: Record<string, unknown>
    live?: Record<string, unknown>
  }

  const props = withDefaults(defineProps<Props>(), {
    environments: () => [],
    preselectedEnvironment: '',
    staged: () => ({}),
    live: () => ({})
  })

  const emit = defineEmits<{
    deployed: [value: unknown]
    'add-environment': []
  }>()

  const RESOLVE_MS = 500

  const SLOT_TYPES = { firewall: 'firewall', customPage: 'custom_page', connector: 'connector' }

  const HINTS = {
    resources:
      'Everything this workload serves, at the version this deployment publishes, with the version of every dependency they reference.',
    environment:
      'Where the deployment goes live. Each environment publishes with its own Deployment Settings.'
  }

  const resolving = ref(false)
  const loadError = ref('')
  const deploying = ref(false)
  const retried = ref(false)
  const selected = ref('')
  const dependencyPicks = ref({})
  const resourcePicks = ref({})

  const settingFor = (name) =>
    settingsById(props.environments.find((entry) => entry.name === name)?.settingsId) ?? null

  const selectedSetting = computed(() => settingFor(selected.value))

  const otherWorkloads = computed(() =>
    (selectedSetting.value?.workloads ?? [])
      .filter((entry) => String(entry.id) !== String(props.workload.id))
      .map((entry) => entry.name)
  )

  const applicationName = computed(
    () => props.live.application?.name || servingApplication(props.workload.id)
  )

  const kindOf = (entry) =>
    entry?.node?.fields?.find((field) => field.label === 'Type')?.value ?? ''

  const slotResource = (slot) => {
    const target = bindTargetFor(slot)
    const type = SLOT_TYPES[slot]
    const pick = props.staged[slot] ?? null
    const current = props.live[slot] ?? null
    if (!pick && !current) return null

    if (pick?.removed) {
      return removedResource({ key: slot, type, name: current?.name ?? '', icon: target.icon })
    }

    const change = !pick
      ? null
      : current
        ? { label: 'Changed', severity: 'warning' }
        : { label: 'Added', severity: 'success' }

    return deployResource({
      key: slot,
      type,
      name: pick?.name ?? current.name,
      kind: pick ? '' : kindOf(current),
      change
    })
  }

  const resources = computed(() => [
    ...(applicationName.value
      ? [deployResource({ key: 'application', type: 'application', name: applicationName.value })]
      : []),
    ...BIND_TARGET_ORDER.map(slotResource).filter(Boolean)
  ])

  const changes = computed(() => resources.value.filter((resource) => resource.change))

  const groups = computed(() => withDependencies(resources.value, resourcePicks.value))

  const pinned = computed(() =>
    pinnedVersions(groups.value, resourcePicks.value, dependencyPicks.value)
  )

  const changeCount = computed(() => changes.value.length)

  const changeSummary = computed(
    () =>
      `${changeCount.value} ${changeCount.value === 1 ? 'change goes' : 'changes go'} live in ${selected.value}.`
  )

  const hasEnvironment = computed(() => props.environments.length > 0)

  const lastEnvironment = computed(
    () =>
      [
        ...consoleDeployRowsFor(props.workload.id),
        ...deploymentRowsFor(props.workload.id, props.workload.name)
      ][0]?.environment ?? ''
  )

  const environmentChoices = computed(() =>
    props.environments.map((entry) => ({
      name: entry.name,
      description: environmentByName(entry.name)?.description ?? '',
      tag: entry.name === lastEnvironment.value ? 'Last used' : ''
    }))
  )

  const resolve = async () => {
    resolving.value = true
    loadError.value = ''
    try {
      await new Promise((settle) => setTimeout(settle, RESOLVE_MS))
      const preselected = props.environments.some(
        (entry) => entry.name === props.preselectedEnvironment
      )
      selected.value = preselected
        ? props.preselectedEnvironment
        : (props.environments[0]?.name ?? '')
    } catch (error) {
      loadError.value = error?.message ?? "The deploy targets for this workload couldn't be loaded."
    } finally {
      resolving.value = false
    }
  }

  watch(
    open,
    (isOpen) => {
      if (!isOpen) {
        deploying.value = false
        return
      }
      dependencyPicks.value = {}
      resourcePicks.value = {}
      resolve()
    },
    { immediate: true }
  )

  const deploy = async () => {
    if (deploying.value || !selected.value) return

    deploying.value = true
    try {
      const setting = selectedSetting.value
      if (DEPLOY_FAILS_ONCE.has(setting?.id) && !retried.value) {
        retried.value = true
        throw new Error(DEPLOY_FAILURE_MESSAGE)
      }

      const application = applicationRecord(servingApplication(props.workload.id))
      const environment = selected.value

      startResourceDeployRun({
        workload: {
          id: props.workload.id,
          name: props.workload.name,
          domain: props.workload.domain ?? ''
        },
        application,
        strategy: setting ? { id: setting.id, name: setting.name } : null,
        version:
          pinned.value.resources.find((entry) => entry.type === 'application')?.version ?? null,
        resources: pinned.value.resources.filter((entry) => entry.type !== 'application'),
        dependencies: pinned.value.dependencies,
        deploymentName: `${application.name || props.workload.name}-release`,
        environment,
        preset: application.preset,
        durationMs: RESOURCE_DEPLOY_DURATION_MS
      })

      emit('deployed', { environment })
      open.value = false
    } catch (error) {
      toast.error(`Couldn't deploy ${props.workload.name}.`, {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => deploy() }
      })
    } finally {
      deploying.value = false
    }
  }
</script>

<template>
  <ResourceDrawer
    v-model:open="open"
    title="Deploy"
    :description="`Publish ${workload.name}. Review what this release carries and where it lands.`"
    save-label="Deploy"
    :submitting="deploying"
    :save-disabled="resolving || !!loadError || !hasEnvironment"
    @submit="deploy"
  >
    <template #start>
      <span
        v-if="!resolving && !loadError && hasEnvironment && changeCount"
        class="flex min-w-0 items-center gap-(--spacing-xxs) text-body-xs text-(--text-muted)"
      >
        <i
          class="pi pi-info-circle shrink-0"
          aria-hidden="true"
        />
        <span class="truncate">{{ changeSummary }}</span>
      </span>
    </template>

    <template v-if="resolving">
      <Section
        stacked
        :divided="false"
        title="Resources"
        :hint="HINTS.resources"
      >
        <Skeleton
          kind="shape"
          width="100%"
          height="160px"
        />
      </Section>

      <Section
        stacked
        :divided="false"
        title="Environment"
        :hint="HINTS.environment"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
          <Skeleton
            v-for="row in 2"
            :key="row"
            kind="shape"
            width="100%"
            height="72px"
          />
        </div>
      </Section>
    </template>

    <Section
      key="section-1"
      v-else-if="loadError"
      stacked
      :divided="false"
      title="Deploy"
    >
      <div class="flex min-w-0 flex-col items-start gap-(--spacing-sm)">
        <Message
          severity="danger"
          :label="loadError"
        />
        <Button
          label="Retry"
          kind="outlined"
          size="small"
          icon="pi pi-refresh"
          @click="resolve"
        />
      </div>
    </Section>

    <Section
      key="section-2"
      v-else-if="!hasEnvironment"
      stacked
      :divided="false"
      title="Environment"
    >
      <EmptyState
        bordered
        size="small"
        icon="pi pi-link"
        title="No environment on this workload"
        :description="`${workload.name} publishes into nothing yet, so there is no target for a release. Add a domain and the environment it answers in, then deploy.`"
      >
        <template #actions>
          <Button
            label="Add Environment"
            kind="outlined"
            size="small"
            @click="emit('add-environment')"
          />
        </template>
      </EmptyState>
    </Section>

    <template v-else>
      <Section
        stacked
        :divided="false"
        title="Resources"
        :hint="HINTS.resources"
      >
        <DeployResources
          v-model:resource-picks="resourcePicks"
          v-model:dependency-picks="dependencyPicks"
          :resources="groups"
          :disabled="deploying"
          :empty-label="`Nothing is bound to ${workload.name} yet.`"
        />
      </Section>

      <Section
        stacked
        :divided="false"
        title="Environment"
        :hint="HINTS.environment"
      >
        <DeployEnvironmentField
          v-model="selected"
          name="workload-deploy-environment"
          :options="environmentChoices"
          :disabled="deploying"
        />

        <Message
          v-if="selectedSetting?.shared && otherWorkloads.length"
          severity="warning"
          size="small"
          :label="`Deploying with ${selectedSetting.name} also publishes to ${otherWorkloads.join(', ')}.`"
        />
      </Section>
    </template>
  </ResourceDrawer>
</template>
