<script setup>
  import Badge from '@aziontech/webkit/badge'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import Message from '@aziontech/webkit/message'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Spinner from '@aziontech/webkit/spinner'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onMounted, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeploymentSettingsPicker from '../../components/deployment/DeploymentSettingsPicker.vue'
  import DeployProgressDialog from '../../components/deployment/DeployProgressDialog.vue'
  import ImpactPanel from '../../components/deployment/ImpactPanel.vue'
  import ReleaseDependenciesSection from '../../components/deployment/ReleaseDependenciesSection.vue'
  import ReleaseTopologyTree from '../../components/deployment/ReleaseTopologyTree.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import {
    applicationRecord,
    catalogFor,
    classifyDeploymentSettings,
    dependenciesOf,
    DEPLOY_FAILS_ONCE,
    DEPLOY_FAILURE_MESSAGE,
    deploymentSettings,
    DETECTION_FAILS_ONCE,
    DS_GROUPS,
    hasDeployableVersion,
    INCLUDED_PARENT,
    LATEST_READY,
    OPTIONAL_SINGLETON_TYPES,
    OWNED_DEPENDENCIES,
    resourceLabel,
    resourceName,
    resourceNoun,
    servingApplication,
    settingsById,
    SINGLETON_TYPES
  } from '../../lib/data/releases'
  import {
    redeployRun,
    RESOURCE_DEPLOY_DURATION_MS,
    startResourceDeployRun
  } from '../../lib/state/deploy-runs'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const idsFromQuery = computed(() => {
    const raw = route.query.deploymentIds
    if (!raw) return []
    return (Array.isArray(raw) ? raw : String(raw).split(','))
      .map((id) => id.trim())
      .filter((id) => settingsById(id))
  })
  const pickTarget = computed(() => route.query.pickTarget === 'true')
  const scopedType = computed(() =>
    SINGLETON_TYPES.includes(route.query.scopedType) ? route.query.scopedType : ''
  )
  const scopedResourceId = computed(() => route.query.resourceId || '')
  const incomingVersionId = computed(() => route.query.versionId || '')
  const workloadId = computed(() => route.query.workloadId || '')
  const workloadName = computed(() => route.query.workload || '')

  const scenario = computed(() => {
    if (workloadName.value && idsFromQuery.value.length) return 'from-workload'
    if (scopedType.value) return 'from-resource'
    if (idsFromQuery.value.length === 1) return 'from-deployment'
    return 'global'
  })

  const targetSettled = computed(
    () => idsFromQuery.value.length === 1 && !pickTarget.value && !scopedType.value
  )

  const selectedIds = ref([...idsFromQuery.value])
  const dsSearch = ref('')

  const candidateSettings = computed(() =>
    idsFromQuery.value.length
      ? deploymentSettings.value.filter((settings) => idsFromQuery.value.includes(settings.id))
      : deploymentSettings.value
  )

  const searchedSettings = computed(() => {
    const query = dsSearch.value.trim().toLowerCase()
    if (!query) return candidateSettings.value
    return candidateSettings.value.filter((settings) => settings.name.toLowerCase().includes(query))
  })

  const dsGroups = computed(() => {
    const { groups } = classifyDeploymentSettings({ settings: searchedSettings.value })
    return DS_GROUPS.filter((group) => groups[group.key].length).map((group) => ({
      ...group,
      items: groups[group.key]
    }))
  })

  const selectableIds = computed(() =>
    dsGroups.value
      .filter((group) => group.selectable)
      .flatMap((group) => group.items.map((settings) => settings.id))
  )

  const toggleSettings = (id) => {
    selectedIds.value = selectedIds.value.includes(id)
      ? selectedIds.value.filter((entry) => entry !== id)
      : [...selectedIds.value, id]
  }

  const selectAllSettings = () => {
    selectedIds.value = [...selectableIds.value]
  }

  const clearSettings = () => {
    selectedIds.value = []
  }

  const onGroupAction = (key) => {
    if (key !== 'inactive') return
    router.push({ path: '/account/build-deployment', query: { email: userEmail.value } })
  }

  const seedId = computed(() => selectedIds.value[0] || idsFromQuery.value[0] || '')
  const seedSettings = computed(() => (seedId.value ? settingsById(seedId.value) : undefined))

  const pinnedApplication = computed(() =>
    workloadId.value ? servingApplication(workloadId.value) : ''
  )

  const state = reactive({
    application: { resourceId: '', versionId: LATEST_READY, enabled: true },
    firewall: { resourceId: '', versionId: LATEST_READY, enabled: false },
    custom_page: { resourceId: '', versionId: LATEST_READY, enabled: false }
  })

  const seedTopology = () => {
    SINGLETON_TYPES.forEach((type) => {
      const scoped = scopedType.value === type

      let resourceId = ''
      if (scoped) resourceId = scopedResourceId.value
      else if (type === 'application') {
        resourceId = pinnedApplication.value || catalogFor(type)[0]?.id || ''
      }

      state[type].resourceId = resourceId
      state[type].versionId =
        scoped && incomingVersionId.value ? incomingVersionId.value : LATEST_READY
      state[type].enabled = type === 'application' ? true : scoped
    })
  }

  const deps = reactive({
    application: { function: [], connector: [] },
    firewall: { function: [], network_list: [], waf: [] },
    custom_page: { connector: [] },
    [INCLUDED_PARENT]: { connector: [], network_list: [] }
  })

  const detection = reactive({
    application: { detecting: false, failed: false, attempts: 0 },
    firewall: { detecting: false, failed: false, attempts: 0 },
    custom_page: { detecting: false, failed: false, attempts: 0 }
  })

  const DETECTING_LABEL = {
    application: 'Detecting the Functions and Connectors this Application references…',
    firewall: 'Detecting the Functions, Network Lists and WAF this Firewall references…',
    custom_page: 'Detecting the Connectors this Custom Page references…'
  }

  const clearDependencies = (parentType) => {
    OWNED_DEPENDENCIES[parentType].forEach((type) => {
      deps[parentType][type] = []
    })
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const runToken = { application: 0, firewall: 0, custom_page: 0 }

  const detect = async (parentType) => {
    const token = (runToken[parentType] += 1)
    const card = state[parentType]
    if (!card.enabled || !card.resourceId) {
      clearDependencies(parentType)
      detection[parentType].detecting = false
      detection[parentType].failed = false
      return
    }

    const resourceId = card.resourceId
    detection[parentType].detecting = true
    detection[parentType].failed = false
    clearDependencies(parentType)

    await sleep(650)
    if (runToken[parentType] !== token || state[parentType].resourceId !== resourceId) return

    detection[parentType].attempts += 1
    detection[parentType].detecting = false

    if (DETECTION_FAILS_ONCE.has(resourceId) && detection[parentType].attempts === 1) {
      detection[parentType].failed = true
      return
    }

    const found = dependenciesOf(parentType, resourceId)
    Object.entries(found).forEach(([type, ids]) => {
      deps[parentType][type] = ids.map((id) => ({
        resourceId: id,
        versionId: LATEST_READY,
        locked: true
      }))
    })
  }

  const retryDetection = (parentType) => {
    detect(parentType)
  }

  SINGLETON_TYPES.forEach((type) => {
    watch(
      () => `${state[type].enabled ? '1' : '0'}:${state[type].resourceId}`,
      () => detect(type)
    )
  })

  const failedDetections = computed(() =>
    SINGLETON_TYPES.filter((type) => state[type].enabled && detection[type].failed)
  )
  const detecting = computed(() =>
    SINGLETON_TYPES.some((type) => state[type].enabled && detection[type].detecting)
  )

  const DEPENDENCY_PARENTS = [...SINGLETON_TYPES, INCLUDED_PARENT]

  const parentLabel = (parentType) =>
    parentType === INCLUDED_PARENT ? 'included dependencies' : resourceLabel(parentType)

  const sharedParentsOf = (depType, resourceId, excludeParent) =>
    DEPENDENCY_PARENTS.filter((parent) => {
      if (parent === excludeParent) return false
      if (parent !== INCLUDED_PARENT && !state[parent]?.enabled) return false
      return (deps[parent][depType] ?? []).some((row) => row.resourceId === resourceId)
    }).map(parentLabel)

  const groupsFor = (parentType) =>
    OWNED_DEPENDENCIES[parentType].map((type) => ({
      type,
      rows: deps[parentType][type].map((row) => ({
        ...row,
        sharedWith: sharedParentsOf(type, row.resourceId, parentType)
      }))
    }))

  const setDependencyVersion = (parentType, depType, index, versionId) => {
    const row = deps[parentType][depType][index]
    if (!row) return
    row.versionId = versionId
    DEPENDENCY_PARENTS.forEach((parent) => {
      if (parent === parentType) return
      ;(deps[parent][depType] ?? []).forEach((entry) => {
        if (entry.resourceId === row.resourceId) entry.versionId = versionId
      })
    })
  }

  const usedIds = (depType) =>
    DEPENDENCY_PARENTS.flatMap((parent) =>
      (deps[parent][depType] ?? []).map((row) => row.resourceId)
    )

  const includedGroups = computed(() =>
    OWNED_DEPENDENCIES[INCLUDED_PARENT].map((type) => ({
      type,
      rows: deps[INCLUDED_PARENT][type].map((row) => ({
        ...row,
        sharedWith: sharedParentsOf(type, row.resourceId, INCLUDED_PARENT)
      })),
      addOptions: catalogFor(type)
        .filter((resource) => !usedIds(type).includes(resource.id))
        .map((resource) => ({ value: resource.id, label: resource.name }))
    }))
  )

  const includedCount = computed(() =>
    includedGroups.value.reduce((total, group) => total + group.rows.length, 0)
  )

  const addIncluded = (depType, resourceId) => {
    if (!resourceId) return
    if (usedIds(depType).includes(resourceId)) {
      toast.warning('Already in this release.', {
        description: `Set the version of ${resourceName(depType, resourceId)} where it already appears.`
      })
      return
    }
    deps[INCLUDED_PARENT][depType].push({
      resourceId,
      versionId: LATEST_READY,
      locked: false
    })
  }

  const setIncludedResource = (depType, index, resourceId) => {
    const row = deps[INCLUDED_PARENT][depType][index]
    if (!row) return
    if (usedIds(depType).includes(resourceId)) {
      toast.warning('Already in this release.', {
        description: `Set the version of ${resourceName(depType, resourceId)} where it already appears.`
      })
      return
    }
    row.resourceId = resourceId
    row.versionId = LATEST_READY
  }

  const removeIncluded = (depType, index) => {
    deps[INCLUDED_PARENT][depType].splice(index, 1)
  }

  const cards = computed(() =>
    SINGLETON_TYPES.map((type) => {
      const readonly = Boolean(scopedType.value) && scopedType.value !== type
      const resourceId = state[type].resourceId
      const enabled = state[type].enabled && Boolean(resourceId)

      let note = ''
      if (!enabled) {
        if (!readonly) note = 'Not included in this release.'
        else if (!selectedIds.value.length) {
          note = 'Select a Deployment setting to see what it binds.'
        } else {
          note = `The selected Deployment settings bind no ${resourceNoun(type)}.`
        }
      }

      return {
        type,
        resourceId,
        versionId: state[type].versionId,
        enabled,
        required: type === 'application',
        readonly,
        canToggle: OPTIONAL_SINGLETON_TYPES.includes(type) && !readonly,
        note,
        groups: groupsFor(type),
        detecting: detection[type].detecting,
        detectingLabel: DETECTING_LABEL[type]
      }
    })
  )

  const setResource = (type, resourceId) => {
    state[type].resourceId = resourceId
    state[type].versionId = LATEST_READY
  }
  const setVersion = (type, versionId) => {
    state[type].versionId = versionId
  }
  const toggleType = (type, enabled) => {
    state[type].enabled = enabled
  }

  const onBuild = (type, resourceId) => {
    toast.info(`${resourceName(type, resourceId)} has no Ready version.`, {
      description: `Build one in ${resourceLabel(type)} and come back to this release.`
    })
  }

  const IMPACT_VIEWS = [
    { value: 'tree', label: 'Tree' },
    { value: 'nodes', label: 'Nodes' }
  ]
  const impactView = ref('tree')

  const impactLoad = ref('loading')
  const loadImpact = async () => {
    impactLoad.value = 'loading'
    await sleep(700)
    impactLoad.value = 'ready'
  }

  const impactTree = computed(() =>
    selectedIds.value
      .map((id) => settingsById(id))
      .filter(Boolean)
      .map((settings) => ({
        id: settings.id,
        name: settings.name,
        domainsCount: settings.domainsCount,
        environments: settings.environmentNames.map((environmentName) => {
          const workloads = settings.workloads.filter(
            (workload) => workload.environment === environmentName
          )
          return {
            id: `${settings.id}-${environmentName}`,
            name: environmentName,
            workloadsCount: workloads.length,
            workloads: workloads.map((workload) => ({
              id: `${settings.id}-${workload.id}`,
              name: workload.name,
              domainsCount: workload.domains.length
            }))
          }
        })
      }))
  )

  const impactTotals = computed(() => {
    const environments = impactTree.value.flatMap((settings) => settings.environments)
    const workloads = environments.flatMap((environment) => environment.workloads)
    return {
      settingsCount: impactTree.value.length,
      workloadsCount: workloads.length,
      domainsCount: workloads.reduce((total, workload) => total + workload.domainsCount, 0)
    }
  })

  const countOf = (count, singular, plural) => `${count} ${count === 1 ? singular : plural}`

  const impactSummary = computed(
    () =>
      `Routes ${countOf(impactTotals.value.domainsCount, 'domain', 'domains')} across ` +
      `${countOf(impactTotals.value.workloadsCount, 'workload', 'workloads')} in ` +
      `${countOf(impactTotals.value.settingsCount, 'Deployment setting', 'Deployment settings')}.`
  )

  const impactHasTotal = computed(() => impactState.value === 'ready')
  const impactFooterSlots = computed(() => (impactHasTotal.value ? ['footer'] : []))

  const impactState = computed(() => {
    if (!selectedIds.value.length) return 'empty'
    return impactLoad.value === 'loading' ? 'loading' : 'ready'
  })

  const composedRows = computed(() => {
    const rows = []
    SINGLETON_TYPES.forEach((type) => {
      if (!state[type].enabled || !state[type].resourceId) return
      rows.push({ type, resourceId: state[type].resourceId, versionId: state[type].versionId })
    })
    DEPENDENCY_PARENTS.forEach((parent) => {
      if (parent !== INCLUDED_PARENT && !state[parent]?.enabled) return
      Object.entries(deps[parent]).forEach(([type, list]) => {
        list.forEach((row) => {
          if (row.resourceId)
            rows.push({ type, resourceId: row.resourceId, versionId: row.versionId })
        })
      })
    })
    return rows
  })

  const withoutReadyVersion = computed(() =>
    composedRows.value.filter((row) => !hasDeployableVersion(row.type, row.resourceId))
  )
  const withoutVersion = computed(() => composedRows.value.filter((row) => !row.versionId))

  const canDeploy = computed(
    () =>
      selectedIds.value.length > 0 &&
      Boolean(state.application.resourceId) &&
      state.application.enabled &&
      !detecting.value &&
      !failedDetections.value.length &&
      !withoutReadyVersion.value.length &&
      !withoutVersion.value.length
  )

  const blocker = computed(() => {
    if (!selectedIds.value.length) {
      return 'Select at least one Deployment setting to deploy into.'
    }
    if (!state.application.enabled || !state.application.resourceId) {
      return 'Select the Application this release deploys.'
    }
    if (failedDetections.value.length) {
      return `Dependency detection failed for ${resourceLabel(failedDetections.value[0])}. Retry before deploying.`
    }
    if (detecting.value) return 'Detecting dependencies…'
    if (withoutReadyVersion.value.length) {
      const row = withoutReadyVersion.value[0]
      return `${resourceName(row.type, row.resourceId)} has no Ready version. Build one to deploy.`
    }
    if (withoutVersion.value.length) {
      return 'Select a version for every resource in this release.'
    }
    return ''
  })

  const confirmOpen = ref(false)
  const starting = ref(false)
  const progressOpen = ref(false)
  const retriedIds = ref([])

  const WATCHED_TARGET_DURATION_MS = 9_000

  const selectedRecords = computed(() =>
    selectedIds.value.map((id) => settingsById(id)).filter(Boolean)
  )

  const failsFirstAttempt = (settings) =>
    DEPLOY_FAILS_ONCE.has(settings.id) && !retriedIds.value.includes(settings.id)

  const targets = ref([])

  const runCountFor = (records) =>
    records.reduce((total, settings) => total + settings.workloads.length, 0)

  const deployedApplication = computed(() => applicationRecord(state.application.resourceId))

  const startTarget = (settings, { durationMs, notify }) => ({
    settings,
    runs: settings.workloads.map((workload) =>
      startResourceDeployRun({
        workload: { id: workload.id, name: workload.name, domain: workload.domains[0] ?? '' },
        application: deployedApplication.value,
        strategy: { id: settings.id, name: settings.name },
        deploymentName: `${deployedApplication.value.name}-release`,
        environment: workload.environment,
        preset: deployedApplication.value.preset,
        outcome: failsFirstAttempt(settings) ? 'error' : 'success',
        durationMs,
        notify
      })
    )
  })

  const statusOf = (target) => {
    if (!target.runs.length) return 'skipped'
    if (target.runs.some((run) => run.status === 'running')) return 'deploying'
    if (target.runs.some((run) => run.status === 'error')) return 'failed'
    return 'done'
  }

  const messageFor = (target, status) => {
    if (status === 'failed') return DEPLOY_FAILURE_MESSAGE
    if (status === 'skipped') return 'No workload deploys with this Deployment setting yet.'
    return ''
  }

  const progressItems = computed(() =>
    targets.value.map((target) => {
      const status = statusOf(target)
      return {
        id: target.settings.id,
        name: target.settings.name,
        status,
        message: messageFor(target, status),
        environments: target.settings.environmentNames.join(', ') || 'No workloads bound yet'
      }
    })
  )

  const deploying = computed(
    () => starting.value || targets.value.some((target) => statusOf(target) === 'deploying')
  )

  const retryFailed = () => {
    const failed = targets.value.filter((target) => statusOf(target) === 'failed')
    retriedIds.value = [...retriedIds.value, ...failed.map((target) => target.settings.id)]
    failed.forEach((target) => {
      target.runs.filter((run) => run.status === 'error').forEach((run) => redeployRun(run.id))
    })
  }

  const confirmDeploy = async () => {
    confirmOpen.value = false
    const records = selectedRecords.value
    const runCount = runCountFor(records)
    const watched = records.length > 1 || runCount === 0

    starting.value = true
    targets.value = records.map((settings) =>
      startTarget(settings, {
        durationMs: watched ? WATCHED_TARGET_DURATION_MS : RESOURCE_DEPLOY_DURATION_MS,
        notify: !watched && runCount === 1
      })
    )

    if (watched) {
      starting.value = false
      progressOpen.value = true
      return
    }

    if (runCount > 1) {
      toast.info(`Deploying into ${records[0].name}.`, {
        description: `${runCount} deployments are building. They keep running if you leave.`
      })
    }
    await sleep(600)
    starting.value = false
    router.push({ path: '/deployments', query: { email: userEmail.value } })
  }

  const cancel = () => {
    router.push({ path: '/deployments', query: { email: userEmail.value } })
  }

  watch(progressOpen, (open) => {
    if (open) return
    const allDone = progressItems.value.every((item) => item.status === 'done')
    if (allDone && progressItems.value.length) {
      router.push({ path: '/deployments', query: { email: userEmail.value } })
    }
  })

  const seedName = computed(() => seedSettings.value?.name || '')

  const contextNotice = computed(() => {
    if (scenario.value === 'from-workload') {
      const target = workloadName.value || 'This workload'
      const serving = pinnedApplication.value
      const count = idsFromQuery.value.length
      const where =
        count === 1
          ? `deploys with ${seedName.value}`
          : `deploys with ${count} Deployment settings, one per environment, and the release goes live on each one that stays selected`
      return serving
        ? `${target} ${where}. It is already serving ${serving}, so that application and the resources the setting binds are filled in below.`
        : `${target} ${where}.`
    }
    if (scenario.value === 'from-deployment') {
      return `This release applies to ${seedName.value}. It reaches every environment and workload that deploys with that Deployment setting.`
    }
    if (scenario.value === 'from-resource') {
      return `Only the ${resourceLabel(scopedType.value)} version changes. Every selected Deployment setting keeps the resources it binds.`
    }
    return ''
  })

  const confirmBody = computed(() => {
    const targets = impactTotals.value.settingsCount
    const targetsLine = `${targets} ${targets === 1 ? 'Deployment setting' : 'Deployment settings'}`
    if (impactState.value !== 'ready') {
      return `This release goes live on ${targetsLine}. The release serving now stays available for rollback.`
    }
    return `This release goes live on ${targetsLine} and routes ${impactTotals.value.domainsCount} domains across ${impactTotals.value.workloadsCount} Workloads. The release serving now stays available for rollback.`
  })

  const breadcrumb = computed(() => [
    { label: 'Deployments', href: '/deployments' },
    ...(seedName.value ? [{ label: seedName.value, href: '/deployments' }] : []),
    { label: 'Create Release' }
  ])

  watch(seedId, () => seedTopology(), { immediate: true })

  onMounted(() => {
    loadImpact()
  })
</script>

<template>
  <AppLayout
    active="deployments"
    :padded="false"
    :breadcrumb="breadcrumb"
  >
    <main class="flex h-full min-h-0 flex-col">
      <section class="min-h-0 flex-1 overflow-auto">
        <div class="layout-column-focused layout-boundary flex min-w-0 flex-col">
          <PageHeading
            title="Review and deploy"
            description="Check the resources this release deploys and everything it reaches, then deploy it."
            size="medium"
          />

          <section
            class="layout-section-start grid min-w-0 gap-(--layout-section-gap) xl:grid-cols-[minmax(0,1fr)_minmax(var(--container-xs),var(--container-sm))]"
          >
            <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
              <CardBox>
                <template #header>
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="pi pi-sitemap shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate text-label-md text-(--text-default)">
                      Deployment topology
                    </span>
                  </span>
                </template>

                <template #content>
                  <div class="flex min-w-0 flex-col gap-(--spacing-md)">
                    <Message
                      v-if="contextNotice"
                      severity="info"
                      size="small"
                      :label="contextNotice"
                    />

                    <Message
                      v-for="type in failedDetections"
                      :key="type"
                      severity="danger"
                      size="small"
                      :label="`The dependencies of this ${resourceLabel(type)} version could not be read. Retry to detect them.`"
                      action-label="Retry"
                      @action="retryDetection(type)"
                    />

                    <ReleaseTopologyTree
                      :cards="cards"
                      :disabled="deploying"
                      @update-resource="setResource"
                      @update-version="setVersion"
                      @toggle="toggleType"
                      @update-dependency-version="setDependencyVersion"
                      @build="onBuild"
                    />
                  </div>
                </template>
              </CardBox>

              <CardBox :padded="false">
                <template #header>
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="pi pi-link shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate text-label-md text-(--text-default)">
                      Include dependencies
                    </span>
                  </span>
                  <Badge
                    :label="String(includedCount)"
                    severity="warning"
                    size="medium"
                  />
                </template>

                <template #content>
                  <p
                    class="px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-xs) text-body-sm text-(--text-muted)"
                  >
                    Add connectors or network lists that a Function reaches at runtime, which
                    detection cannot find.
                  </p>

                  <ReleaseDependenciesSection
                    :groups="includedGroups"
                    allow-add
                    :disabled="deploying"
                    @update-version="
                      (type, index, versionId) =>
                        setDependencyVersion(INCLUDED_PARENT, type, index, versionId)
                    "
                    @set-resource="setIncludedResource"
                    @add="addIncluded"
                    @remove="removeIncluded"
                    @build="onBuild"
                  />
                </template>
              </CardBox>

              <CardBox v-if="!targetSettled">
                <template #header>
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="ai ai-deploy-pillar shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate text-label-md text-(--text-default)">
                      Deployment settings
                    </span>
                  </span>
                </template>

                <template #content>
                  <DeploymentSettingsPicker
                    v-model:search="dsSearch"
                    :groups="dsGroups"
                    :selected="selectedIds"
                    :total="candidateSettings.length"
                    :impact-loading="impactState === 'loading'"
                    :disabled="deploying"
                    @toggle="toggleSettings"
                    @select-all="selectAllSettings"
                    @clear="clearSettings"
                    @group-action="onGroupAction"
                  />
                </template>
              </CardBox>
            </div>

            <div class="min-w-0 xl:sticky xl:top-(--layout-boundary-start) xl:self-start">
              <CardBox :key="impactHasTotal">
                <template #header>
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="pi pi-bullseye shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate text-label-md text-(--text-default)">Impact</span>
                  </span>

                  <SegmentedButton
                    v-if="impactState === 'ready'"
                    v-model="impactView"
                    :options="IMPACT_VIEWS"
                    aria-label="Impact view"
                    class="shrink-0 -my-(--spacing-xxs)"
                  />
                </template>
                <template #content>
                  <ImpactPanel
                    v-model:view="impactView"
                    :state="impactState"
                    :tree="impactTree"
                    :settings-count="selectedIds.length"
                    @retry="loadImpact"
                  />
                </template>

                <template
                  v-for="name in impactFooterSlots"
                  :key="name"
                  #[name]
                >
                  <Message
                    severity="info"
                    size="small"
                    class="w-full"
                    :label="impactSummary"
                  />
                </template>
              </CardBox>
            </div>
          </section>
        </div>
      </section>

      <footer
        class="shrink-0 border-t-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface)"
      >
        <div
          class="layout-column-focused layout-boundary-inline flex flex-col gap-(--spacing-sm) py-(--spacing-md) md:flex-row md:items-center md:justify-between"
        >
          <p class="text-body-sm text-(--text-muted)">
            Deploying builds this release and puts it into traffic.
          </p>

          <div class="flex flex-col gap-(--spacing-sm) md:flex-row md:items-center md:justify-end">
            <p
              v-if="blocker"
              class="flex items-center gap-(--spacing-xs) text-body-sm text-(--warning-contrast)"
            >
              <Spinner
                v-if="detecting"
                class="size-4 shrink-0"
              />
              {{ blocker }}
            </p>
            <div class="flex items-center gap-(--spacing-sm)">
              <Button
                class="w-full md:w-auto"
                type="button"
                label="Cancel"
                kind="outlined"
                size="medium"
                :disabled="deploying"
                @click="cancel"
              />
              <Button
                class="w-full md:w-auto"
                :label="deploying ? 'Deploying…' : 'Deploy release'"
                kind="primary"
                size="medium"
                icon="pi pi-cloud-upload"
                :disabled="!canDeploy"
                :loading="deploying"
                @click="confirmOpen = true"
              />
            </div>
          </div>
        </div>
      </footer>
    </main>

    <Dialog
      v-model:open="confirmOpen"
      size="small"
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader class="w-full">
            <DialogTitle>Deploy this release?</DialogTitle>
            <DialogClose />
          </PanelHeader>
          <PanelContent>
            <p class="text-body-sm text-(--text-default)">{{ confirmBody }}</p>
          </PanelContent>
          <PanelFooter class="flex-col md:flex-row md:justify-end">
            <Button
              class="w-full md:w-auto"
              type="button"
              label="Cancel"
              kind="outlined"
              size="medium"
              @click="confirmOpen = false"
            />
            <Button
              class="w-full md:w-auto"
              label="Deploy release"
              kind="primary"
              size="medium"
              icon="pi pi-cloud-upload"
              @click="confirmDeploy"
            />
          </PanelFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>

    <DeployProgressDialog
      v-model:open="progressOpen"
      :items="progressItems"
      @retry="retryFailed"
    />
  </AppLayout>
</template>
