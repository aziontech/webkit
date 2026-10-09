<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Flow from '@aziontech/webkit/flow'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Message from '@aziontech/webkit/message'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { consoleDeployRowsFor } from '@shared/lib/azion-deploys'
  import { computed, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeploymentsTable from '../../components/deployment/DeploymentsTable.vue'
  import FieldRow from '../../components/form/FieldRow.vue'
  import SettingsSaveBar from '../../components/form/SettingsSaveBar.vue'
  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import ConfirmDialog from '../../components/list/ConfirmDialog.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import ExportButton from '../../components/list/ExportButton.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import PageTabs from '../../components/page/PageTabs.vue'
  import ProductionChecklist from '../../components/page/ProductionChecklist.vue'
  import Section from '../../components/page/Section.vue'
  import AddDomainDrawer from '../../components/resource/AddDomainDrawer.vue'
  import DomainsSection from '../../components/resource/DomainsSection.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import DeployDrawer from '../../components/workload/DeployDrawer.vue'
  import DeploymentFooter from '../../components/workload/DeploymentFooter.vue'
  import TopologyBindControl from '../../components/workload/TopologyBindControl.vue'
  import TopologyBindNode from '../../components/workload/TopologyBindNode.vue'
  import TopologyNodeCard from '../../components/workload/TopologyNodeCard.vue'
  import WorkloadDeploymentSettingsSection from '../../components/workload/WorkloadDeploymentSettingsSection.vue'
  import WorkloadMutualAuthSection from '../../components/workload/WorkloadMutualAuthSection.vue'
  import WorkloadProtocolSection from '../../components/workload/WorkloadProtocolSection.vue'
  import WorkloadSummary from '../../components/workload/WorkloadSummary.vue'
  import { focusSection } from '../../lib/behavior/anchor-nav'
  import { useListRefresh } from '../../lib/behavior/list-state'
  import { useTabEnter } from '../../lib/behavior/tab-enter'
  import { bindingRecord, resourceForSlot } from '../../lib/data/create-bindings'
  import { applicationById } from '../../lib/data/applications'
  import { createResourcePath } from '../../lib/data/create-resources'
  import { deploymentRowsFor } from '../../lib/data/deployment-history'
  import { AZION_DEFAULT_ID } from '../../lib/data/deployment-strategies'
  import { deploymentFilterFields } from '../../lib/data/deployments'
  import {
    demoDeployment,
    findDeploymentByWorkload,
    provisionedDeployRow,
    resourceChain
  } from '../../lib/data/provisioning'
  import { settingsById } from '../../lib/data/releases'
  import {
    BIND_TARGET_ORDER,
    bindTargetFor,
    bindTargetOptions,
    removalMessage,
    stagedMessage
  } from '../../lib/data/topology-bind-targets'
  import {
    workloadMutualAuthDefaults,
    workloadProtocolDefaults
  } from '../../lib/data/workload-protocols'
  import {
    deployInFlight,
    deployStepTitle,
    liveConsoleDeploy
  } from '../../lib/state/workload-deploys'
  import { connectEnvironment, environmentsFor } from '../../lib/state/workload-environments'
  import { bindWorkloadSettings } from '../../lib/state/workload-settings'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const workloadId = String(route.params.id || '1082318')
  const record = computed(
    () =>
      findDeploymentByWorkload(workloadId) ??
      demoDeployment(workloadId, route.query.name || 'Workload Name')
  )
  const workload = computed(() => record.value.workload)

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'settings', label: 'Settings' }
  ]
  const activeTab = computed({
    get: () => (tabs.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'overview'),
    set: (value) => {
      if (!tabs.some((tab) => tab.value === value)) return
      router.replace({ query: { ...route.query, tab: value } })
    }
  })

  const openSettings = () => {
    activeTab.value = 'settings'
  }

  const manageDomains = () => {
    openSettings()
    focusSection('domains')
  }

  const inFlight = computed(() => deployInFlight(workloadId))

  const liveDeploy = computed(() => liveConsoleDeploy(workloadId))

  const deployStep = computed(() => (inFlight.value ? deployStepTitle(inFlight.value) : ''))

  const withApplication = (node, application) => {
    if (!application || application.name === node.name) return node
    const app = applicationById(application.id)
    return {
      ...node,
      name: application.name,
      href: `/applications/${application.id}`,
      reference: application.id,
      fields: [
        { label: 'ID', value: application.id },
        { label: 'Repository', value: app?.repository ?? '' },
        { label: 'Branch', value: app?.branch ?? '' }
      ]
    }
  }

  const servedApplication = (node) => withApplication(node, liveDeploy.value?.application)

  const applicationNode = (node) => {
    const served = servedApplication(node)
    const incoming = inFlight.value?.application
    if (!incoming) return served
    if (incoming.name === served.name) return { ...served, status: 'Deploying' }
    return {
      ...withApplication(served, incoming),
      status: 'Deploying',
      dashed: true,
      message: `Replaces ${served.name} once the deploy finishes.`
    }
  }

  const topology = computed(() =>
    resourceChain(record.value).map((node) =>
      node.key === 'application' ? applicationNode(node) : node
    )
  )

  const replacedApplication = computed(() => {
    const incoming = inFlight.value?.application?.name
    const served = servedApplication(
      resourceChain(record.value).find((node) => node.key === 'application') ?? { name: '' }
    ).name
    return incoming && served && incoming !== served ? served : ''
  })

  const deployBanner = computed(() => {
    const run = inFlight.value
    if (!run) return ''
    const version = run.version?.name ? ` ${run.version.name}` : ''
    const lead = `Deploying ${run.application.name}${version} to ${run.environment} · ${deployStep.value}.`
    return replacedApplication.value
      ? `${lead} It replaces ${replacedApplication.value} on this workload once it finishes.`
      : lead
  })

  const openInFlight = () =>
    router.push({
      path: `/deployments/${inFlight.value.id}`,
      query: { email: userEmail.value, workload: workloadId, workloadName: workload.value.name }
    })

  const domainsNode = computed(() => {
    const domains = [
      { domain: workload.value.domain, generated: true },
      ...savedDomains.value.map((entry) => ({ domain: entry.domain, generated: false }))
    ]
    const primary = domains.find((entry) => !entry.generated) ?? domains[0]

    return {
      key: 'domains',
      kind: 'Domains',
      icon: 'ai ai-domains',
      name: primary.domain,
      status: `${domains.length} ${domains.length === 1 ? 'domain' : 'domains'}`,
      add: true,
      fields: domains.map((entry) => ({
        label: entry.generated ? 'Azion domain' : 'Custom domain',
        value: entry.domain,
        copy: true,
        url: `https://${entry.domain}`
      }))
    }
  })

  const deployed = reactive({})
  const staged = reactive({})

  const stagedCount = computed(() => Object.keys(staged).length)

  const chainNode = (key) => topology.value.find((node) => node.key === key)

  const deployedResource = (key) => {
    if (key in deployed) return deployed[key]
    const node = chainNode(key)
    return node ? { id: node.reference, name: node.name, node } : null
  }

  const slotNode = (key) => {
    const target = bindTargetFor(key)
    const live = deployedResource(key)
    const pick = staged[key]
    const removing = Boolean(pick?.removed)
    const resource = pick ? (removing ? null : pick) : live
    const options = bindTargetOptions(key)

    const message = removing
      ? removalMessage(key)
      : pick
        ? stagedMessage(key)
        : resource
          ? ''
          : target.unboundMessage

    if (!resource) {
      return {
        key,
        empty: true,
        target,
        removable: true,
        options,
        status: pick ? 'Staged' : 'Not bound',
        severity: pick ? 'warning' : 'neutral',
        message
      }
    }

    const chain = live?.node

    const removable = key !== 'connector' || Boolean(pick) || !chain

    return {
      key,
      target,
      removable,
      options,
      kind: target.kind,
      icon: target.icon,
      name: resource.name,
      status: pick ? 'Staged' : (chain?.status ?? 'Active'),
      dashed: Boolean(pick),
      boundId: resource.id,
      message: message || (removable ? '' : target.keptMessage),
      href: pick ? '' : (chain?.href ?? `/${target.module}/${resource.id}/settings`),
      fields: pick
        ? []
        : (chain?.fields ?? [
            { label: 'ID', value: resource.id },
            { label: 'Bound to', value: chainNode('application')?.name ?? '' }
          ])
    }
  }

  const slots = computed(() =>
    Object.fromEntries(BIND_TARGET_ORDER.map((key) => [key, slotNode(key)]))
  )

  const topologyLevels = computed(() => {
    const chain = topology.value
    const placed = new Set(['workload', 'firewall', 'application', 'connector'])
    const rest = chain.filter((node) => !placed.has(node.key))
    const policies = rest.filter((node) => node.key.startsWith('cache-policy-'))
    const storage = rest.filter((node) => !node.key.startsWith('cache-policy-'))
    const workloadNode = chain.find((node) => node.key === 'workload')
    const applicationNode = chain.find((node) => node.key === 'application')

    return [
      workloadNode && { key: 'domains', nodes: [domainsNode.value] },
      workloadNode && { key: 'workload', nodes: [workloadNode] },
      { key: 'firewall', nodes: [slots.value.firewall] },
      applicationNode && {
        key: 'application',
        nodes: [applicationNode, { ...slots.value.customPage, terminal: true }]
      },
      policies.length && { key: 'cache', nodes: policies },
      { key: 'connector', nodes: [{ ...slots.value.connector, terminal: storage.length === 0 }] },
      storage.length && {
        key: 'storage',
        nodes: storage.map((node) => ({ ...node, terminal: true }))
      }
    ].filter(Boolean)
  })

  const environments = computed(() => environmentsFor(workloadId))

  const selectedEnvironment = ref(environments.value[0]?.name ?? 'Production')

  watch(environments, (list) => {
    if (list.some((environment) => environment.name === selectedEnvironment.value)) return
    selectedEnvironment.value = list[0]?.name ?? 'Production'
  })

  const activeEnvironment = computed(
    () =>
      environments.value.find((environment) => environment.name === selectedEnvironment.value) ??
      environments.value[0] ??
      null
  )

  const workloadSetting = computed(
    () =>
      settingsById(activeEnvironment.value?.settingsId) ?? settingsById(AZION_DEFAULT_ID) ?? null
  )

  const openNodes = reactive({})

  const savedDomains = ref([])
  const addDomainOpen = ref(false)

  const editingDomain = ref(null)

  const addIntent = ref('domain')

  const openAdd = (intent) => {
    editingDomain.value = null
    addIntent.value = intent
    addDomainOpen.value = true
  }

  const editSettingsDomain = (id) => {
    const entry = settings.domains.find((domain) => domain.id === id)
    if (!entry) return
    editingDomain.value = { ...entry }
    addIntent.value = 'domain'
    addDomainOpen.value = true
  }

  const boundFirewall = computed(() => deployedResource('firewall')?.name ?? '')

  const productionSteps = computed(() => [
    {
      id: 'domain',
      icon: 'pi pi-globe',
      title: 'Add a custom domain',
      description:
        'Serve this workload on a domain of your own, with a free HTTPS certificate, instead of the generated Azion hostname.',
      actionLabel: 'Add Domain',
      done: savedDomains.value.length > 0,
      doneNote: `Serving ${savedDomains.value.map((entry) => entry.domain).join(', ')}.`
    },
    {
      id: 'firewall',
      icon: 'pi pi-shield',
      title: 'Enable firewall protection',
      description:
        'Bind a firewall so requests are inspected before they reach the application. Rate limiting, WAF rules, and network lists.',
      actionLabel: 'Bind Firewall',
      done: Boolean(boundFirewall.value),
      doneNote: `Protected by ${boundFirewall.value}.`
    },
    {
      id: 'customPage',
      icon: 'pi pi-file',
      title: 'Set custom error pages',
      description: "Answer 4xx and 5xx with your own page instead of Azion's default response.",
      actionLabel: 'Bind Custom Page',
      done: Boolean(deployedResource('customPage')),
      doneNote: `Serving ${deployedResource('customPage')?.name ?? ''}.`
    }
  ])

  const topologyRef = ref(null)

  const onChecklistAction = (step) => {
    if (step.id === 'domain') {
      openAdd('domain')
      return
    }
    openNodes[step.id] = true
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    topologyRef.value?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
  }

  const stageDomain = (entry) => {
    const existing = settings.domains.some((domain) => domain.id === entry.id)
    settings.domains = existing
      ? settings.domains.map((domain) => (domain.id === entry.id ? entry : domain))
      : [...settings.domains, entry]

    editingDomain.value = null
    const landed = activeTab.value === 'settings'
    activeTab.value = 'settings'

    toast.success(
      existing ? `${entry.domain} updated.` : `${entry.domain} added to ${workload.value.name}.`,
      {
        description: landed
          ? `It answers in ${entry.environment}. Save the workload's settings to apply it.`
          : `It answers in ${entry.environment}. Review it under Settings and save to apply it.`
      }
    )
  }

  const removingDomainId = ref('')
  const removeDomainOpen = ref(false)

  const removingDomain = computed(() =>
    settings.domains.find((domain) => domain.id === removingDomainId.value)
  )

  const removeSettingsDomain = (id) => {
    removingDomainId.value = id
    removeDomainOpen.value = true
  }

  const confirmRemoveDomain = () => {
    settings.domains = settings.domains.filter((domain) => domain.id !== removingDomainId.value)
    removingDomainId.value = ''
  }

  const bindResource = (slotKey, id) => {
    const option = bindTargetOptions(slotKey).find((entry) => String(entry.value) === String(id))
    if (!option) return

    const live = deployedResource(slotKey)
    if (live && String(live.id) === String(option.value)) {
      delete staged[slotKey]
      return
    }

    staged[slotKey] = { id: option.value, name: option.label }
    openNodes[slotKey] = true
    toast.info(`${option.label} staged on ${workload.value.name}`, {
      description: stagedMessage(slotKey)
    })
  }

  const unbindResource = (slotKey) => {
    const target = bindTargetFor(slotKey)
    const pick = staged[slotKey]

    if (!slots.value[slotKey]?.removable) return

    if (pick && !pick.removed) {
      delete staged[slotKey]
      toast.info(`${target.kind} pick discarded.`)
      return
    }

    if (!deployedResource(slotKey)) return

    staged[slotKey] = { removed: true }
    openNodes[slotKey] = true
    toast.info(`${target.kind} staged for removal.`, { description: removalMessage(slotKey) })
  }

  const createBindable = (slotKey) => {
    const target = bindTargetFor(slotKey)
    if (!target) return
    router.push({
      path: createResourcePath(target.module),
      query: {
        email: route.query.email || undefined,
        from: route.path,
        fromLabel: workload.value.name
      }
    })
  }

  const historicDeployments = computed(() =>
    deploymentRowsFor(workloadId, route.query.name || workload.value.name)
  )

  const provisionedDeployment = computed(() => {
    const provisioned = findDeploymentByWorkload(workloadId)
    return provisioned ? provisionedDeployRow(provisioned) : null
  })

  const consoleDeployments = computed(() => consoleDeployRowsFor(workloadId))

  const deployments = computed(() => {
    const rows = [
      ...consoleDeployments.value,
      ...(provisionedDeployment.value ? [provisionedDeployment.value] : []),
      ...historicDeployments.value
    ]

    let claimed = false
    return rows.map((deployment) => {
      if (!deployment.current) return deployment
      if (claimed) return { ...deployment, current: false }
      claimed = true
      return deployment
    })
  })

  const deployFields = computed(() => deploymentFilterFields(deployments.value))
  const deploySearch = ref('')
  const deployFilters = ref({})
  const deployColumns = ref({ workloadName: false })

  const { loading, refresh } = useListRefresh()

  const deploymentsTableRef = ref(null)

  const openDeployment = (event, row) =>
    router.push({
      path: `/deployments/${row.versionId}`,
      query: {
        email: userEmail.value,
        workload: row.workloadId,
        workloadName: row.workloadName
      }
    })
  const onRowAction = (event, value, row) => {
    if (value === 'details') {
      openDeployment(event, row)
      return
    }
    if (value === 'redeploy') {
      toast.info(`Redeploying version ${row.versionId}.`)
      return
    }
    toast.info(`Promoting version ${row.versionId}.`)
  }

  const deleteOpen = ref(false)

  const requestDelete = () => {
    deleteOpen.value = true
  }

  const confirmDelete = () => {
    toast.success(`${workload.value.name} deleted`)
    router.push({ path: '/workloads', query: { email: userEmail.value } })
  }

  const applyStaged = () => {
    for (const [key, pick] of Object.entries(staged)) {
      deployed[key] = pick.removed ? null : { id: pick.id, name: pick.name }
      delete staged[key]
    }
  }

  const deployOpen = ref(false)

  const liveBindings = computed(() =>
    Object.fromEntries(
      ['application', ...BIND_TARGET_ORDER].map((key) => [key, deployedResource(key)])
    )
  )

  const openDeploy = () => {
    deployOpen.value = true
  }

  const receiveHandoff = () => {
    const slot = String(route.query.bind ?? '')
    const resource = resourceForSlot(slot)
    const record = resource ? bindingRecord(resource, String(route.query.record ?? '')) : null
    if (!record) return
    staged[slot] = { id: record.id, name: record.name }
    openNodes[slot] = true
    const query = { ...route.query }
    delete query.bind
    delete query.record
    router.replace({ query })
    deployOpen.value = true
  }
  receiveHandoff()

  const receiveDeploy = () => {
    if (route.query.deploy !== '1') return
    const query = { ...route.query }
    delete query.deploy
    router.replace({ query })
    deployOpen.value = true
  }
  receiveDeploy()

  const onDeployed = () => {
    applyStaged()
    activeTab.value = 'deployments'
  }

  const scrollRef = ref(null)
  const enterRef = ref(null)
  useTabEnter(enterRef, activeTab, scrollRef)

  const visit = () => toast.info('Opening the workload in a new tab.')

  const settings = reactive({
    name: workload.value.name,
    active: workload.value.status !== 'Inactive',
    domains: [...savedDomains.value],
    deploymentSettings: {},
    protocols: workloadProtocolDefaults(),
    mtls: workloadMutualAuthDefaults()
  })

  const savingSettings = ref(false)
  const activeSaved = ref(settings.active)
  const summaryWorkload = computed(() => ({
    ...workload.value,
    status: activeSaved.value ? 'Live' : 'Inactive'
  }))

  const settingsBaseline = ref(JSON.stringify(settings))
  const settingsDirty = computed(() => JSON.stringify(settings) !== settingsBaseline.value)

  const settingsDomains = computed(() => [
    {
      id: 'generated',
      domain: workload.value.domain,
      environment: workload.value.environment,
      certificate: '',
      generated: true
    },
    ...settings.domains.map((entry) => ({ ...entry, generated: false }))
  ])

  const manageDeploymentSettings = () =>
    router.push({ path: '/account/build-deployment', query: { email: userEmail.value } })

  const saveSettings = async () => {
    if (savingSettings.value) return
    savingSettings.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      for (const [environment, settingsId] of Object.entries(settings.deploymentSettings)) {
        bindWorkloadSettings(workloadId, environment, settingsId)
      }

      for (const domain of settings.domains) {
        const environment = connectEnvironment(workloadId, domain.environment)
        selectedEnvironment.value = environment.name
      }
      savedDomains.value = settings.domains.map((domain) => ({ ...domain }))

      settingsBaseline.value = JSON.stringify(settings)
      activeSaved.value = settings.active
      toast.success(
        settings.active
          ? 'Workload settings saved.'
          : 'Workload settings saved. It is now inactive.'
      )
    } finally {
      savingSettings.value = false
    }
  }
  const discardSettings = () => {
    Object.assign(settings, JSON.parse(settingsBaseline.value))
  }
</script>

<template>
  <AppLayout
    active="workloads"
    :padded="false"
    :breadcrumb="[{ label: 'Workloads', href: '/workloads' }, { label: workload.name }]"
  >
    <main class="flex h-full flex-col">
      <PageTabs
        v-model:value="activeTab"
        :tabs="tabs"
      >
        <template #actions>
          <Tag
            v-if="stagedCount"
            severity="warning"
            size="small"
            :label="`${stagedCount} ${stagedCount === 1 ? 'change' : 'changes'}`"
          />
          <Button
            label="Deploy"
            kind="outlined"
            size="medium"
            icon="pi pi-cloud-upload"
            :loading="Boolean(inFlight)"
            @click="openDeploy"
          />
        </template>
      </PageTabs>

      <section
        ref="scrollRef"
        class="min-h-0 flex-1 overflow-auto"
      >
        <div ref="enterRef">
          <div
            v-if="activeTab === 'overview'"
            class="layout-column layout-boundary flex min-w-0 flex-col"
          >
            <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
              <Message
                v-if="deployBanner"
                severity="info"
                :label="deployBanner"
                action-label="View Deployment"
                aria-live="polite"
                @action="openInFlight"
              />

              <WorkloadSummary
                v-model:environment="selectedEnvironment"
                :workload="summaryWorkload"
                :deploy-step="deployStep"
                :custom-domains="savedDomains"
                :environments="environments"
                @visit="visit"
                @add-domain="openAdd('domain')"
                @add-environment="openAdd('environment')"
                @manage-domains="manageDomains"
                @settings="openSettings"
              >
                <template #footer>
                  <DeploymentFooter
                    :setting="workloadSetting"
                    :workload-id="String(workload.id)"
                    :email="userEmail"
                  />
                </template>
              </WorkloadSummary>

              <ProductionChecklist
                :steps="productionSteps"
                description="The create put this workload live on a generated hostname. These are the gates between that and production."
                @action="onChecklistAction"
              />

              <div
                ref="topologyRef"
                class="flex flex-col gap-(--layout-group-gap)"
              >
                <PageHeading
                  title="Deployment topology"
                  size="small"
                />
                <CardBox
                  :padded="false"
                  class="overflow-x-auto bg-(--bg-surface-raised)"
                >
                  <template #content>
                    <Flow
                      align="start"
                      class="[&>div]:w-full"
                    >
                      <Flow.Parallel
                        v-for="level in topologyLevels"
                        :key="level.key"
                        align="start"
                        class="min-w-(--size-56) flex-1"
                      >
                        <Flow.Node
                          v-for="node in level.nodes"
                          :key="node.key"
                          unstyled
                          :terminal="Boolean(node.terminal)"
                          class="w-full"
                        >
                          <TopologyBindNode
                            v-if="node.empty"
                            v-model:open="openNodes[node.key]"
                            :target="node.target"
                            :options="node.options"
                            :status="node.status"
                            :severity="node.severity"
                            :message="node.message"
                            @bind="bindResource(node.key, $event)"
                            @create="createBindable(node.key)"
                          />
                          <TopologyNodeCard
                            v-else
                            v-model:open="openNodes[node.key]"
                            :node="node"
                            :email="userEmail"
                          >
                            <template
                              v-if="node.target || node.add"
                              #actions
                            >
                              <TopologyBindControl
                                v-if="node.target"
                                :target="node.target"
                                :options="node.options"
                                :bound-id="node.boundId"
                                :removable="node.removable"
                                @bind="bindResource(node.key, $event)"
                                @remove="unbindResource(node.key)"
                                @create="createBindable(node.key)"
                              />
                              <Tooltip
                                v-else
                                text="Add Domain"
                              >
                                <IconButton
                                  icon="pi pi-plus"
                                  kind="outlined"
                                  size="small"
                                  aria-label="Add Domain"
                                  @click="openAdd('domain')"
                                />
                              </Tooltip>
                            </template>
                          </TopologyNodeCard>
                        </Flow.Node>
                      </Flow.Parallel>
                    </Flow>
                  </template>
                </CardBox>
              </div>
            </section>
          </div>

          <div
            v-else-if="activeTab === 'deployments'"
            class="layout-column layout-boundary flex min-w-0 flex-col"
          >
            <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
              <div class="flex flex-col gap-(--layout-group-gap)">
                <ControlsHeader>
                  <FilterButton
                    v-model="deployFilters"
                    :fields="deployFields"
                  />
                  <InputText
                    v-model="deploySearch"
                    size="medium"
                    placeholder="Search deployments"
                    aria-label="Search deployments"
                    class="min-w-36 grow basis-(--container-2xs)"
                  >
                    <template #iconLeft>
                      <i
                        class="pi pi-search"
                        aria-hidden="true"
                      />
                    </template>
                  </InputText>
                  <template #actions>
                    <RefreshButton
                      :loading="loading"
                      @refresh="refresh"
                    />
                    <ExportButton
                      :table="deploymentsTableRef"
                      filename="deployments.csv"
                    />
                  </template>
                </ControlsHeader>

                <FilterChips
                  v-model="deployFilters"
                  :fields="deployFields"
                />
                <CardBox :padded="false">
                  <template #content>
                    <DeploymentsTable
                      ref="deploymentsTableRef"
                      v-model:search="deploySearch"
                      v-model:filters="deployFilters"
                      v-model:column-visibility="deployColumns"
                      :deployments="deployments"
                      :fields="deployFields"
                      :email="userEmail"
                      :controls="false"
                      :loading="loading"
                      @row-click="openDeployment"
                      @action="onRowAction"
                    />
                  </template>
                </CardBox>
              </div>
            </section>
          </div>

          <div
            v-else
            class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeading
              title="Settings"
              description="Manage this workload's configuration."
              size="small"
            />

            <form
              class="mt-(--layout-section-gap) flex min-w-0 flex-col"
              aria-label="Workload settings"
              novalidate
              @submit.prevent="saveSettings"
            >
              <fieldset
                class="m-0 flex min-w-0 flex-col border-0 p-0"
                :disabled="savingSettings"
              >
                <legend class="sr-only">Workload settings</legend>

                <Section
                  stacked
                  anchor
                  :divided="false"
                  title="General"
                  hint="How this workload is identified across the console, and whether it answers at all."
                >
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <FieldRow
                          title="Name"
                          description="A unique and descriptive name to identify the workload."
                        >
                          <InputText
                            v-model="settings.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            :disabled="savingSettings"
                          />
                        </FieldRow>
                        <FieldRow
                          kind="compact"
                          title="Active"
                          description="When disabled, the workload stops answering and traffic to its domains is refused. Its deployments are kept."
                        >
                          <Switch
                            v-model="settings.active"
                            aria-label="Active"
                            :disabled="savingSettings"
                          />
                        </FieldRow>
                      </Item.List>
                    </template>
                  </CardBox>
                </Section>

                <Section
                  stacked
                  anchor
                  :divided="false"
                  title="Domains"
                  hint="The addresses this workload answers on, the environment each one answers in, and the certificate it is served with."
                >
                  <DomainsSection
                    :domains="settingsDomains"
                    :disabled="savingSettings"
                    @add="openAdd('domain')"
                    @edit="editSettingsDomain"
                    @remove="removeSettingsDomain"
                  />
                </Section>

                <Section
                  stacked
                  anchor
                  collapsible
                  :divided="false"
                  title="Advanced Settings"
                  hint="Deployment Settings, protocols and mutual authentication, which most workloads never change."
                >
                  <div class="flex min-w-0 flex-col">
                    <Section
                      stacked
                      anchor
                      :divided="false"
                      title="Deployment Settings"
                      hint="Which shared configuration each of this workload's environments publishes with, linked automatically by deployment policy."
                    >
                      <WorkloadDeploymentSettingsSection
                        v-model="settings.deploymentSettings"
                        :workload-id="workloadId"
                        :environments="environments"
                        :disabled="savingSettings"
                        @manage="manageDeploymentSettings"
                      />
                    </Section>

                    <Section
                      stacked
                      anchor
                      :divided="false"
                      title="Protocol Settings"
                      hint="Which protocols and ports this workload answers on, and the TLS floor it accepts."
                    >
                      <WorkloadProtocolSection
                        v-model="settings.protocols"
                        :disabled="savingSettings"
                      />
                    </Section>

                    <Section
                      stacked
                      anchor
                      :divided="false"
                      title="Mutual Authentication"
                      hint="Require the client to present a certificate the workload can verify, as well as presenting its own."
                    >
                      <WorkloadMutualAuthSection
                        v-model="settings.mtls"
                        :use-https="settings.protocols.useHttps"
                        :disabled="savingSettings"
                      />
                    </Section>
                  </div>
                </Section>

                <Section
                  stacked
                  anchor
                  :divided="false"
                  title="Danger Zone"
                  hint="Actions that cannot be undone."
                >
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <FieldRow
                          kind="compact"
                          title="Delete this workload"
                          description="Once deleted, the workload and its deployments cannot be recovered."
                        >
                          <Button
                            type="button"
                            label="Delete Workload"
                            kind="danger"
                            size="medium"
                            icon="pi pi-trash"
                            @click="requestDelete"
                          />
                        </FieldRow>
                      </Item.List>
                    </template>
                  </CardBox>
                </Section>
              </fieldset>
            </form>
          </div>
        </div>
      </section>
    </main>

    <SettingsSaveBar
      v-if="activeTab === 'settings'"
      :dirty="settingsDirty"
      :saving="savingSettings"
      @save="saveSettings"
      @discard="discardSettings"
    />

    <AddDomainDrawer
      v-model:open="addDomainOpen"
      :intent="addIntent"
      :environments="environments"
      :domain="editingDomain"
      @save="stageDomain"
    />

    <ConfirmDialog
      v-model:open="removeDomainOpen"
      title="Remove domain"
      :description="`${removingDomain?.domain ?? 'This domain'} stops answering for this workload once you save. Traffic already pointed at it gets no response.`"
      confirm-label="Remove Domain"
      @confirm="confirmRemoveDomain"
    />

    <DeployDrawer
      v-model:open="deployOpen"
      :workload="workload"
      :environments="environments"
      :preselected-environment="selectedEnvironment"
      :staged="staged"
      :live="liveBindings"
      @deployed="onDeployed"
      @add-environment="openAdd('environment')"
    />

    <DeleteDialog
      v-model:open="deleteOpen"
      kind="Workload"
      :name="workload.name"
      description="The selected workload will be deleted, along with every deployment it has published. Traffic to its domains stops. Check the"
      @confirm="confirmDelete"
    />

    <UnsavedChangesGuard
      v-if="activeTab !== 'settings'"
      savable
      :dirty="settingsDirty"
      :saving="savingSettings"
      @save="saveSettings"
      @discard="discardSettings"
    />
  </AppLayout>
</template>
