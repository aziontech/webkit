<script setup lang="ts">
  import Item from '@aziontech/webkit/item'
  import Message from '@aziontech/webkit/message'
  import Tag from '@aziontech/webkit/tag'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { deployResource, pinnedVersions, withDependencies } from '../../lib/data/deploy-resources'
  import { applicationDeploymentRows } from '../../lib/data/deployment-history'
  import {
    AZION_DEFAULT_ID,
    environmentSuffix,
    strategyById
  } from '../../lib/data/deployment-strategies'
  import {
    DEFAULT_ENVIRONMENTS,
    environments,
    policyForEnvironment
  } from '../../lib/data/environments'
  import {
    applicationVersion,
    buildApplicationVersion,
    environmentBindings,
    environmentLocked,
    markVersionDeployed,
    newVersionId,
    recordApplicationBuild,
    servingApplication,
    versionChoices
  } from '../../lib/data/releases'
  import { domainForWorkload } from '../../lib/data/workload-provisioning'
  import { workloadById } from '../../lib/data/workloads'
  import { startResourceDeployRun } from '../../lib/state/deploy-runs'
  import { workloadDomainsIn } from '../../lib/state/workload-domains'
  import {
    allWorkloads,
    linkEnvironment,
    reachLabel,
    workloadsOnSettings
  } from '../../lib/state/workload-settings'
  import ResourceDrawer from '../form/ResourceDrawer.vue'
  import Section from '../page/Section.vue'
  import DeployBuildRow from './DeployBuildRow.vue'
  import DeployEnvironmentField from './DeployEnvironmentField.vue'
  import DeployItemSkeleton from './DeployItemSkeleton.vue'
  import DeployResources from './DeployResources.vue'
  import DeployWorkloadDomains from './DeployWorkloadDomains.vue'
  import DeployWorkloadField from './DeployWorkloadField.vue'

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
  const RELOAD_MS = 600
  const NEW_SETTINGS_ID = 'new-workload-settings'

  const HINTS = {
    resources:
      'The application version this deployment publishes, and the version of every function and connector it references.',
    workload:
      'The workload whose domains serve the application. Create one to publish it on a new domain.',
    environment:
      'Where the deployment goes live, from the environments this workload serves. Each one publishes with the Deployment Settings set on the workload.',
    workloads:
      'This environment publishes with shared Deployment Settings, so the deployment reaches every workload below, in every environment they are linked to, and the domains they serve.'
  }

  const building = ref(false)
  const elapsed = ref(0)
  const builtId = ref('')
  const pendingName = ref('')
  const versionId = ref('')
  const dependencyPicks = ref({})
  const environment = ref('')
  const workloadMode = ref<'existing' | 'new'>('existing')
  const workloadId = ref('')
  const reloading = ref(false)

  let buildTimer = 0
  let tickTimer = 0
  let reloadTimer = 0

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

  const withBindings = (entry) => {
    const bindings = environmentBindings(entry.id)
    return {
      ...entry,
      bindings,
      environments: bindings.map((binding) => binding.name),
      open: bindings
        .filter((binding) => !environmentLocked(binding, appName.value))
        .map((binding) => binding.name)
    }
  }

  const servingWorkloads = computed(() => {
    const seen = new Set()
    const preferredServes = props.preferredWorkload
      ? servingApplication(props.preferredWorkload.id)
      : ''
    const preferred =
      props.preferredWorkload && (!preferredServes || preferredServes === appName.value)
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
      .map((row) =>
        withBindings({
          id: String(row.workloadId),
          name: row.workloadName,
          domain: workloadById(row.workloadId)?.domain ?? domainForWorkload(row.workloadName)
        })
      )
  })

  const otherWorkloads = computed(() => {
    const serving = new Set(servingWorkloads.value.map((entry) => entry.id))
    return allWorkloads.value
      .filter((record) => !serving.has(String(record.id)))
      .map((record) => ({
        id: String(record.id),
        name: record.name,
        domain: record.domain ?? domainForWorkload(record.name),
        serves: servingApplication(record.id)
      }))
      .filter((entry) => entry.serves && entry.serves !== appName.value)
      .map(withBindings)
      .sort((a, b) => a.name.localeCompare(b.name))
  })

  const reusableWorkloads = computed(() =>
    otherWorkloads.value.filter((entry) => entry.open.length)
  )

  const boundWorkloads = computed(() => [...servingWorkloads.value, ...reusableWorkloads.value])

  const existingWorkload = computed(
    () =>
      boundWorkloads.value.find((entry) => entry.id === workloadId.value) ??
      boundWorkloads.value[0] ??
      null
  )

  const newWorkload = computed(() => ({
    id: '',
    name: appName.value,
    domain: domainForWorkload(appName.value)
  }))

  const creating = computed(() => workloadMode.value === 'new')

  const chosenWorkload = computed(() =>
    creating.value ? newWorkload.value : existingWorkload.value
  )

  const lastEnvironment = computed(() => {
    const rows =
      !creating.value && existingWorkload.value
        ? history.value.filter((row) => String(row.workloadId) === existingWorkload.value.id)
        : history.value
    return rows[0]?.environment ?? ''
  })

  const workloadEnvironments = computed(() => {
    if (creating.value || !existingWorkload.value) return DEFAULT_ENVIRONMENTS.value
    const served = existingWorkload.value.environments
    return environments.value.filter((entry) => served.includes(entry.name))
  })

  const bindingIn = (name) =>
    creating.value
      ? null
      : (existingWorkload.value?.bindings?.find((binding) => binding.name === name) ?? null)

  const lockIn = (name) => {
    const binding = bindingIn(name)
    return binding && environmentLocked(binding, appName.value) ? binding : null
  }

  const environmentChoices = computed(() =>
    workloadEnvironments.value.map((entry) => {
      const lock = lockIn(entry.name)
      if (lock)
        return {
          name: entry.name,
          description: `${lock.settingsName} is Strict, so ${lock.application} stays bound to this environment.`,
          tag: 'Strict',
          tagSeverity: 'secondary',
          disabled: true
        }
      return {
        name: entry.name,
        description: entry.description,
        ...environmentTag(entry.name)
      }
    })
  )

  const anchorWorkloadId = computed(() =>
    creating.value ? '' : (existingWorkload.value?.id ?? '')
  )

  const newSettingsFor = (name) => ({
    id: NEW_SETTINGS_ID,
    name: `${newWorkload.value.name}${environmentSuffix(name)}`,
    deploymentPolicy: policyForEnvironment(name),
    fresh: true
  })

  const settingsId = computed(() => {
    if (!environment.value) return ''
    if (creating.value) return NEW_SETTINGS_ID
    if (anchorWorkloadId.value)
      return linkEnvironment(anchorWorkloadId.value, environment.value).settingsId
    return AZION_DEFAULT_ID
  })

  const settings = computed(() =>
    settingsId.value === NEW_SETTINGS_ID
      ? newSettingsFor(environment.value)
      : (strategyById(settingsId.value) ?? null)
  )

  const isChosen = (workload) =>
    creating.value ? Boolean(workload.fresh) : workload.id === chosenWorkload.value?.id

  const reachedByEnvironment = computed(() => {
    if (!settings.value) return []
    return [...environments.value]
      .sort((a, b) => Number(b.name === environment.value) - Number(a.name === environment.value))
      .map((entry) => {
        const linked = workloadsOnSettings(settings.value.id, entry.name).map((workload) => ({
          id: String(workload.id),
          name: workload.name,
          domain: workloadById(workload.id)?.domain ?? domainForWorkload(workload.name),
          fresh: false
        }))
        const chosen = chosenWorkload.value
        const withChosen =
          entry.name === environment.value &&
          chosen &&
          !linked.some((workload) => workload.id === chosen.id && !creating.value)
            ? [{ ...chosen, fresh: creating.value }, ...linked]
            : linked
        return {
          environment: entry.name,
          workloads: withChosen.sort((a, b) => Number(isChosen(b)) - Number(isChosen(a)))
        }
      })
      .filter((group) => group.environment === environment.value || group.workloads.length)
  })

  const deployEnvironments = computed(() =>
    reachedByEnvironment.value
      .filter((group) => group.workloads.length)
      .map((group) => group.environment)
  )

  const spansEnvironments = computed(() => deployEnvironments.value.length > 1)

  const targets = computed(() =>
    reachedByEnvironment.value.flatMap((group) =>
      group.workloads.map((workload) => ({ environment: group.environment, workload }))
    )
  )

  const shared = computed(() => targets.value.length > 1)

  const replaced = computed(() => {
    const bound = bindingIn(environment.value)?.application ?? ''
    return bound && bound !== appName.value ? bound : ''
  })

  const chosenEnvironments = computed(() =>
    reachedByEnvironment.value
      .filter((group) =>
        group.workloads.some((workload) => workload.id === existingWorkload.value?.id)
      )
      .map((group) => group.environment)
  )

  const chosenDomains = computed(() =>
    creating.value || !existingWorkload.value
      ? []
      : workloadDomainsIn(
          existingWorkload.value.id,
          chosenEnvironments.value.length ? chosenEnvironments.value : [environment.value],
          existingWorkload.value.name
        )
  )

  const environmentTag = (name) => {
    if (name !== environment.value && deployEnvironments.value.includes(name))
      return { tag: 'Also deploys', tagSeverity: 'warning' }
    return { tag: name === lastEnvironment.value ? 'Last used' : '' }
  }

  const listFormat = (names) =>
    names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : (names[0] ?? '')

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
    () =>
      !building.value &&
      !reloading.value &&
      !lockIn(environment.value) &&
      Boolean(version.value && environment.value && settings.value && targets.value.length)
  )

  const clearTimers = () => {
    clearTimeout(buildTimer)
    clearInterval(tickTimer)
    clearTimeout(reloadTimer)
    reloading.value = false
  }

  const reload = () => {
    clearTimeout(reloadTimer)
    reloading.value = true
    reloadTimer = setTimeout(() => {
      reloading.value = false
    }, RELOAD_MS)
  }

  const servedEnvironment = (...names) => {
    const open = workloadEnvironments.value
      .map((entry) => entry.name)
      .filter((name) => !lockIn(name))
    return names.find((name) => open.includes(name)) ?? open[0] ?? ''
  }

  const finishBuild = (existingId = '') => {
    clearTimeout(buildTimer)
    clearInterval(tickTimer)
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
    clearTimeout(buildTimer)
    clearInterval(tickTimer)
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
    const preferred = boundWorkloads.value.find(
      (entry) => entry.id === String(props.preferredWorkload?.id ?? '')
    )
    workloadMode.value = preferred || servingWorkloads.value.length ? 'existing' : 'new'
    workloadId.value = preferred?.id ?? boundWorkloads.value[0]?.id ?? ''
    environment.value = servedEnvironment(props.preferredEnvironment, lastEnvironment.value)
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

  const switchWorkload = () => {
    environment.value = servedEnvironment(lastEnvironment.value, environment.value)
    reload()
  }

  const pickWorkloadMode = (mode) => {
    if (mode === workloadMode.value) return
    workloadMode.value = mode
    switchWorkload()
  }

  const pickWorkload = (id) => {
    if (id === existingWorkload.value?.id) return
    workloadId.value = id
    switchWorkload()
  }

  const pickEnvironment = (name) => {
    if (name === environment.value) return
    environment.value = name
    reload()
  }

  const deploy = () => {
    if (!canDeploy.value) return

    markVersionDeployed(appName.value, version.value.id)

    const createdId = `new-${Date.now()}`

    targets.value.forEach((target) =>
      startResourceDeployRun({
        workload: target.workload.fresh ? { ...target.workload, id: createdId } : target.workload,
        application: { id: props.application.id, name: appName.value },
        strategy: settings.value,
        version: { id: version.value.id, name: version.value.name },
        dependencies: pinned.value.dependencies,
        deploymentName: `${appName.value}-${version.value.name}`,
        environment: target.environment,
        preset: String(props.application.preset || 'javascript')
      })
    )

    emit('deployed', {
      versionId: version.value.id,
      environments: deployEnvironments.value,
      settingsId: settings.value.id,
      created: creating.value,
      targets: targets.value
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
      <DeployBuildRow
        v-if="building"
        :name="appName"
        :version="pendingName"
        :elapsed="elapsed"
        data-testid="application-deploy-dialog__build"
      />

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
      <DeployWorkloadField
        :mode="workloadMode"
        :model-value="existingWorkload?.id ?? ''"
        :workloads="boundWorkloads"
        :new-workload="newWorkload"
        :application-name="appName"
        :domains="chosenDomains"
        @update:mode="pickWorkloadMode"
        @update:model-value="pickWorkload"
      />
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
        :model-value="environment"
        name="application-deploy-environment"
        :options="environmentChoices"
        @update:model-value="pickEnvironment"
      />

      <Message
        v-if="replaced"
        severity="info"
        size="small"
        :label="`${existingWorkload.name} serves ${replaced} in ${environment}. Its Deployment Settings are Flexible, so this deployment replaces ${replaced} with ${appName} there.`"
      />

      <Message
        v-if="!reloading && spansEnvironments"
        severity="warning"
        size="small"
        :label="`${environment} publishes with ${settings.name}, which is also linked in ${listFormat(deployEnvironments.filter((name) => name !== environment))}, so this deployment goes live in ${deployEnvironments.length} environments at once.`"
      />
    </Section>

    <Section
      v-if="shared"
      stacked
      :divided="false"
      title="Workloads Impacted"
      :hint="HINTS.workloads"
      :inert="building"
      :data-pending="building || null"
      :aria-busy="reloading || undefined"
      class="transition-opacity duration-moderate-01 ease-productive-entrance data-pending:opacity-32 motion-reduce:transition-none"
    >
      <div
        v-if="reloading"
        class="flex min-w-0 flex-col gap-(--spacing-xs)"
      >
        <DeployItemSkeleton
          v-for="row in targets.length"
          :key="row"
        />
      </div>

      <div
        v-else
        class="flex min-w-0 flex-col gap-(--spacing-md)"
      >
        <div
          v-for="group in reachedByEnvironment"
          v-show="group.workloads.length"
          :key="group.environment"
          class="flex min-w-0 flex-col gap-(--spacing-xs)"
        >
          <p
            v-if="spansEnvironments"
            class="flex items-center gap-(--spacing-xs) text-label-sm text-(--text-muted)"
          >
            <i
              class="pi pi-sitemap text-body-xs"
              aria-hidden="true"
            />
            <span>{{ group.environment }} · {{ reachLabel(group.workloads.length) }}</span>
          </p>
          <ul
            class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-xs) p-0"
            :aria-label="`Workloads impacted in ${group.environment} (${group.workloads.length})`"
          >
            <li
              v-for="workload in group.workloads"
              :key="workload.id"
              class="min-w-0"
            >
              <Item
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
                      v-if="isChosen(workload)"
                      :label="workload.fresh ? 'New' : 'Selected'"
                      :severity="workload.fresh ? 'success' : 'secondary'"
                      size="small"
                      class="shrink-0"
                    />
                  </span>
                  <Item.Description v-if="workload.fresh">
                    Gets its Azion domains on the first deploy.
                  </Item.Description>
                  <DeployWorkloadDomains
                    v-else
                    :domains="workloadDomainsIn(workload.id, [group.environment], workload.name)"
                  />
                </Item.Content>
              </Item>
            </li>
          </ul>
        </div>
      </div>
    </Section>

    <span
      class="sr-only"
      role="status"
    >
      {{ reloading ? 'Loading the workloads this deployment reaches' : '' }}
    </span>
  </ResourceDrawer>
</template>
