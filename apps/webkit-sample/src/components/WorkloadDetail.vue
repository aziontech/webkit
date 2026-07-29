<script setup>
  // Workload detail — the resource-detail view for a single workload. Its identity
  // (name) is the breadcrumb; below the header a full-bleed TabView (Overview /
  // Deployments / Settings) drives the active sub-page, with the active tab held in
  // the URL (`?tab=`) so it survives reload and is linkable.
  //
  //  - Overview: an "Active Deployment" CardBox whose deployment topology is a Flow
  //    diagram of the four resources a deploy provisions — Workload → Application →
  //    Connector → Storage (src/lib/provisioning.js) — inside an Accordion, and a
  //    "Version History" table.
  //  - Deployments: the same history, unscoped by the Overview's framing.
  //  - Settings: a General ItemGroup with an independent Save + a danger delete row.
  //
  // Both tables are the shared DeploymentsTable — the one table shape the
  // Deployments module also uses, so a deployment reads identically whether it is
  // listed here or in the module list. A row (in either table) opens the read-only
  // WorkloadDeploymentDrawer.
  import Accordion from '@aziontech/webkit/accordion'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Flow from '@aziontech/webkit/flow'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import TabView from '@aziontech/webkit/tab-view'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { formatListDate, hoursAgo } from '../lib/dates'
  import { environmentOptions, statusMeta } from '../lib/deployments'
  import { authorAt, emailOf } from '../lib/people'
  import { demoDeployment, findDeploymentByWorkload, resourceChain } from '../lib/provisioning'
  import AppLayout from './ui/AppLayout.vue'
  import DeploymentsTable from './ui/DeploymentsTable.vue'
  import LastModifiedCell from './ui/LastModifiedCell.vue'
  import PageHeading from './ui/PageHeading.vue'
  import TopologyBindNode from './ui/TopologyBindNode.vue'
  import TopologyNodeCard from './ui/TopologyNodeCard.vue'
  import WorkloadDeploymentDrawer from './ui/WorkloadDeploymentDrawer.vue'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // The workload's resource chain. A workload created by the deploy flow is in the
  // provisioning registry (Workload → Application → Connector → Storage); a mock
  // row from the Workloads list is not, so its chain is derived from the id + the
  // name the list link carries. Either way the page has the same four resources.
  const workloadId = String(route.params.id || '1082318')
  const record = computed(
    () =>
      findDeploymentByWorkload(workloadId) ??
      demoDeployment(workloadId, route.query.name || 'Workload Name')
  )
  const workload = computed(() => record.value.workload)

  // --- Tabs (URL-synced) ---------------------------------------------------
  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'settings', label: 'Settings' }
  ]
  const activeTab = computed({
    get: () => (tabs.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'overview'),
    set: (value) => router.replace({ query: { ...route.query, tab: value } })
  })

  // --- Active deployment (Overview) ----------------------------------------
  const activeEnvironment = ref('Production')
  const environmentLabel = (value) =>
    environmentOptions.find((option) => option.value === value)?.label ?? value

  // Each environment resolves to its own domain on the same workload; Stage is the
  // Production host under a stage label.
  const domainsByEnvironment = computed(() => ({
    Production: workload.value.domain,
    Stage: `stage-${workload.value.domain}`
  }))
  const activeDomain = computed(
    () => domainsByEnvironment.value[activeEnvironment.value] ?? workload.value.domain
  )

  // --- Deployment topology --------------------------------------------------
  // The four provisioned resources, in creation order, as Flow nodes. The workload
  // node follows the environment Select, so switching Production/Stage re-points
  // the domain the chain starts from.
  const topology = computed(() =>
    resourceChain({
      ...record.value,
      workload: {
        ...workload.value,
        domain: activeDomain.value,
        url: `https://${activeDomain.value}`,
        environment: activeEnvironment.value
      }
    })
  )

  // --- Application-level bindings -------------------------------------------
  // A deployment binds an Application and, optionally, a Firewall and a Custom
  // Page. Those two are provisioned by nothing, so they are absent from
  // `resourceChain()` — but leaving them out of the diagram hides the decision.
  // They render at the Application's own level (a Flow.Parallel column) as EMPTY
  // nodes: the slot stays visible, with the CTA that fills it.
  const BINDABLE = [
    {
      key: 'firewall',
      kind: 'Firewall',
      icon: 'ai ai-edge-firewall',
      description: 'Not bound — requests reach the application uninspected.',
      ctaLabel: 'Bind Firewall',
      options: [
        { value: 'Default Firewall', label: 'Default Firewall' },
        { value: 'edge-firewall', label: 'edge-firewall' },
        { value: 'waf-strict', label: 'waf-strict' }
      ]
    },
    {
      key: 'customPage',
      kind: 'Custom Page',
      icon: 'ai ai-custom-pages',
      description: "Not bound — 4xx/5xx fall back to Azion's default page.",
      ctaLabel: 'Bind Custom Page',
      options: [
        { value: 'Default Custom Page', label: 'Default Custom Page' },
        { value: 'maintenance-page', label: 'maintenance-page' },
        { value: 'branded-errors', label: 'branded-errors' }
      ]
    }
  ]

  // What each slot currently holds; `null` keeps the empty node on the canvas.
  const bindings = reactive({ firewall: null, customPage: null })

  // The Application level of the chain: the Application node itself, plus one
  // node per bindable slot — a filled card once bound, the empty node until then.
  const applicationLevel = computed(() => {
    const application = topology.value.find((node) => node.key === 'application')
    return [
      application,
      ...BINDABLE.map((slot) => {
        const boundName = bindings[slot.key]
        if (!boundName) return { ...slot, empty: true }
        return {
          key: slot.key,
          kind: slot.kind,
          icon: slot.icon,
          name: boundName,
          status: 'Active',
          href: '',
          fields: [
            { label: 'Version', value: 'Latest' },
            { label: 'Bound to', value: application?.name ?? '' }
          ]
        }
      })
    ].filter(Boolean)
  })

  // The rest of the chain keeps its own single-node levels, so the diagram is one
  // list of levels: Workload → [Application + bindings] → Connector → Storage.
  const topologyLevels = computed(() =>
    topology.value.map((node) =>
      node.key === 'application'
        ? { key: 'application', nodes: applicationLevel.value }
        : { key: node.key, nodes: [node] }
    )
  )

  const bindResource = (slotKey, value) => {
    const slot = BINDABLE.find((item) => item.key === slotKey)
    bindings[slotKey] = value
    toast.success(`${value} bound to ${workload.value.name}`, {
      description: `${slot?.kind ?? 'Resource'} now applies to this deployment.`
    })
  }

  const unbindResource = (slotKey) => {
    const slot = BINDABLE.find((item) => item.key === slotKey)
    bindings[slotKey] = null
    toast.info(`${slot?.kind ?? 'Resource'} unbound`)
  }

  // --- Deployments ---------------------------------------------------------
  // A deployment targets exactly ONE resource (the model the Deployments module
  // states), so each row records which of the workload's three bindable resources
  // it deployed; `deploymentTargets` resolves that key to the real resource, and
  // only the Application has a page to link to.
  //
  // `deployedAt` is the real instant — the display string is derived from it by
  // one formatter, never hand-written per row (see src/lib/dates.js on why a
  // display string must not be parsed back).
  const historicDeployments = [
    {
      id: 'd1',
      versionId: '1293183210',
      environment: 'Production',
      current: true,
      status: 'Building',
      duration: '',
      deployedAt: hoursAgo(1),
      target: 'application'
    },
    {
      id: 'd2',
      versionId: '1293183211',
      environment: 'Production',
      current: false,
      status: 'Ready',
      duration: '99s',
      deployedAt: hoursAgo(2),
      target: 'application'
    },
    {
      id: 'd3',
      versionId: '1293183212',
      environment: 'Production',
      current: false,
      status: 'Building',
      duration: '',
      deployedAt: hoursAgo(4),
      target: 'firewall'
    },
    {
      id: 'd4',
      versionId: '1293183213',
      environment: 'Stage',
      current: false,
      status: 'Error',
      duration: '',
      deployedAt: hoursAgo(7),
      target: 'application'
    },
    {
      id: 'd5',
      versionId: '1293183214',
      environment: 'Stage',
      current: false,
      status: 'Queued',
      duration: '',
      deployedAt: hoursAgo(11),
      target: 'custom-page'
    },
    {
      id: 'd6',
      versionId: '1293183215',
      environment: 'Production',
      current: false,
      status: 'Ready',
      duration: '99s',
      deployedAt: hoursAgo(20),
      target: 'application'
    },
    {
      id: 'd7',
      versionId: '1293183216',
      environment: 'Production',
      current: false,
      status: 'Building',
      duration: '',
      deployedAt: hoursAgo(26),
      target: 'firewall'
    },
    {
      id: 'd8',
      versionId: '1293183217',
      environment: 'Stage',
      current: false,
      status: 'Draft',
      duration: '',
      deployedAt: hoursAgo(31),
      target: 'custom-page'
    },
    {
      id: 'd9',
      versionId: '1293183218',
      environment: 'Stage',
      current: false,
      status: 'Queued',
      duration: '',
      deployedAt: hoursAgo(38),
      target: 'application'
    }
  ]

  // The three resources this workload's deployments can target, named from the
  // provisioned chain (and from whatever is currently bound in the topology) so
  // the table never shows a placeholder where a real name exists.
  const deploymentTargets = computed(() => {
    const { application } = record.value
    return {
      application: {
        resourceType: 'application',
        resourceName: application.name,
        resourceId: application.id
      },
      firewall: {
        resourceType: 'firewall',
        resourceName: bindings.firewall ?? `${application.name}-firewall`,
        resourceId: ''
      },
      'custom-page': {
        resourceType: 'custom-page',
        resourceName: bindings.customPage ?? `${application.name}-error-pages`,
        resourceId: ''
      }
    }
  })

  // A workload created by the deploy flow leads its own history: the version that
  // provisioned it is the current deployment, and the mock history moves behind it.
  const provisionedDeployment = computed(() => {
    const provisioned = findDeploymentByWorkload(workloadId)
    if (!provisioned) return null
    return {
      id: `deployment-${provisioned.versionId}`,
      versionId: provisioned.versionId,
      environment: 'Production',
      current: true,
      status: 'Ready',
      duration: '42s',
      deployedAt: provisioned.createdAt,
      date: formatListDate(provisioned.createdAt),
      resourceType: 'application',
      resourceName: provisioned.application.name,
      resourceId: provisioned.application.id,
      application: provisioned.application.name,
      firewall: provisioned.connector.name,
      customPage: 'Application',
      author: provisioned.author.name,
      authorEmail: emailOf(provisioned.author.name),
      authorAvatar: provisioned.author.avatar
    }
  })

  const deployments = computed(() => {
    const targets = deploymentTargets.value
    // The deploying user comes from the shared team roster (src/lib/people.js),
    // assigned round-robin per row; the address is derived from the name, and is
    // what the table's Authors selector keys each person by.
    const rows = historicDeployments.map((deployment, index) => {
      const person = authorAt(index)
      return {
        ...deployment,
        ...targets[deployment.target],
        date: formatListDate(deployment.deployedAt),
        author: person.name,
        authorEmail: emailOf(person.name),
        authorAvatar: person.avatar,
        // The details drawer reads each resource under its own field name; a
        // workload deployment carries all three because all three are bound to it.
        application: targets.application.resourceName,
        firewall: targets.firewall.resourceName,
        customPage: targets['custom-page'].resourceName
      }
    })
    if (!provisionedDeployment.value) return rows
    return [
      provisionedDeployment.value,
      ...rows.map((deployment) => ({ ...deployment, current: false }))
    ]
  })

  // The current (active) deployment drives the Active Deployment card.
  const activeDeployment = computed(
    () => deployments.value.find((deployment) => deployment.current) ?? deployments.value[0]
  )

  // --- Deployment details drawer -------------------------------------------
  const drawerOpen = ref(false)
  const selectedDeployment = ref(null)
  const openDeployment = (event, row) => {
    selectedDeployment.value = row
    drawerOpen.value = true
  }
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

  // --- Header actions ------------------------------------------------------
  const newDeployment = () => router.push({ path: '/deploy', query: { email: userEmail.value } })
  const visit = () => toast.info('Opening the workload in a new tab.')

  // --- Settings ------------------------------------------------------------
  const settings = reactive({ name: workload.value.name })
  const savingSettings = ref(false)
  const settingsBaseline = ref(JSON.stringify(settings))
  const settingsDirty = computed(() => JSON.stringify(settings) !== settingsBaseline.value)
  const saveSettings = async () => {
    if (savingSettings.value) return
    savingSettings.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      settingsBaseline.value = JSON.stringify(settings)
      toast.success('Workload settings saved.')
    } finally {
      savingSettings.value = false
    }
  }
  const deleteWorkload = () => {
    toast.warning('Delete workload is disabled in the demo.')
  }
</script>

<template>
  <AppLayout
    active="workloads"
    :padded="false"
    :breadcrumb="[{ label: 'Workloads', href: '/workloads' }, { label: workload.name }]"
  >
    <main class="flex h-full flex-col">
      <!-- Nav pattern (ApplicationDetail): no page heading — the workload name is the
           breadcrumb. The tabs are a full-bleed bar with a bottom border; the page's
           primary actions trail on the same row, aligned right. -->
      <div class="border-b border-[var(--border-default)] px-[var(--spacing-md)]">
        <div class="flex items-center gap-[var(--spacing-sm)] py-[var(--spacing-sm)]">
          <TabView
            v-model:value="activeTab"
            class="min-w-0 flex-1"
          >
            <TabView.List>
              <TabView.Item
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                :label="tab.label"
              />
            </TabView.List>
          </TabView>
          <div class="flex shrink-0 items-center gap-[var(--spacing-xs)]">
            <Button
              label="Documentation"
              kind="outlined"
              size="medium"
              icon="pi pi-book"
              target="_blank"
              href="https://www.azion.com/en/documentation/"
            />
            <Button
              label="New Deployment"
              kind="secondary"
              size="medium"
              icon="pi pi-cloud-upload"
              @click="newDeployment"
            />
            <Button
              label="Visit"
              kind="primary"
              size="medium"
              icon="pi pi-arrow-up-right"
              @click="visit"
            />
          </div>
        </div>
      </div>

      <section class="min-h-0 flex-1 overflow-auto">
        <!-- ── Overview ── -->
        <div
          v-if="activeTab === 'overview'"
          class="layout-column layout-boundary flex min-w-0 flex-col gap-[var(--layout-section-gap)]"
        >
          <!-- Active Deployment -->
          <CardBox :padded="false">
            <template #header>
              <p class="text-heading-xs w-full text-[var(--text-default)]">Active Deployment</p>
              <Select
                v-model="activeEnvironment"
                size="medium"
                class="w-[var(--container-xs)]"
                :display-value="environmentLabel"
              >
                <Select.Trigger aria-label="Environment" />
                <Select.Content>
                  <Select.Option
                    v-for="option in environmentOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </template>

            <template #content>
              <div class="flex flex-col">
                <!-- Meta row -->
                <div
                  class="p-[var(--spacing-md)] grid grid-cols-2 gap-[var(--spacing-sm)] lg:grid-cols-4"
                >
                  <div class="flex flex-col gap-[var(--spacing-xxs)]">
                    <span class="text-label-sm text-[var(--text-muted)]">Version ID</span>
                    <div class="flex items-center gap-[var(--spacing-xs)]">
                      <span class="text-body-sm text-[var(--text-default)]">{{
                        activeDeployment.versionId
                      }}</span>
                      <CopyButton
                        kind="outlined"
                        :value="activeDeployment.versionId"
                        aria-label="Copy version ID"
                      />
                    </div>
                  </div>
                  <div class="flex flex-col gap-[var(--spacing-xxs)]">
                    <span class="text-label-sm text-[var(--text-muted)]">Environment</span>
                    <div class="flex items-center gap-[var(--spacing-xs)]">
                      <span class="text-body-sm text-[var(--text-default)]">{{
                        activeEnvironment
                      }}</span>
                      <Tag
                        label="Current"
                        severity="info"
                        size="small"
                      />
                    </div>
                  </div>
                  <!-- Status reads horizontally: the StatusIndicator already
                       carries its own label, so stacking a caption above it
                       spends a second line on one short word. -->
                  <div class="flex flex-col items-start gap-[var(--spacing-xs)] self-start">
                    <span class="text-label-sm text-[var(--text-muted)]">Status</span>
                    <StatusIndicator
                      :severity="statusMeta(activeDeployment.status).severity"
                      :loading="statusMeta(activeDeployment.status).loading"
                      :label="activeDeployment.status"
                    />
                  </div>
                  <div class="flex items-start justify-between gap-[var(--spacing-xs)]">
                    <div class="flex flex-col gap-[var(--spacing-xxs)]">
                      <span class="text-label-sm text-[var(--text-muted)]">Deployed</span>
                      <LastModifiedCell
                        :author="activeDeployment.author"
                        :avatar-src="activeDeployment.authorAvatar"
                        :date="activeDeployment.deployedAt"
                      />
                    </div>
                    <IconButton
                      icon="pi pi-ellipsis-v"
                      kind="transparent"
                      size="small"
                      aria-label="Active deployment actions"
                    />
                  </div>
                </div>

                <!-- Deployment topology: a Flow diagram inside an Accordion. -->
                <Accordion
                  type="single"
                  collapsible
                  default-value="topology"
                >
                  <Accordion.Item value="topology">
                    <Accordion.Trigger>
                      <span class="text-label-sm text-[var(--text-muted)]"
                        >Deployment topology</span
                      >
                    </Accordion.Trigger>
                    <Accordion.Content>
                      <!-- The chain a deploy provisions, left to right:
                           Workload → Application → Connector → Storage, with the
                           Application level also carrying its bindable resources
                           (Firewall, Custom Page) stacked in the same column via
                           Flow.Parallel. Every node is the same card (header:
                           kind + status; body: name + that resource's fields),
                           so the diagram reads as one system instead of bespoke
                           boxes — an unbound slot is that same card, dashed,
                           holding the CTA that fills it.
                           `align="center"` centers the levels against each other.
                           Flow's own track is `w-fit`; `[&>div]:w-full` stretches
                           it to the card, and each level takes an equal share of
                           it (`flex-1`) so every node card is w-full inside its
                           level instead of a fixed 256px box. -->
                      <Flow
                        align="start"
                        class="[&>div]:w-full"
                      >
                        <Flow.Parallel
                          v-for="level in topologyLevels"
                          :key="level.key"
                          align="start"
                          class="min-w-0 flex-1"
                        >
                          <Flow.Node
                            v-for="node in level.nodes"
                            :key="node.key"
                            unstyled
                            class="w-full"
                          >
                            <!-- Empty node: the slot is open, so the card is the
                                 bind CTA. -->
                            <TopologyBindNode
                              v-if="node.empty"
                              :kind="node.kind"
                              :icon="node.icon"
                              :description="node.description"
                              :cta-label="node.ctaLabel"
                              :options="node.options"
                              @bind="(event, value) => bindResource(node.key, value)"
                            />
                            <TopologyNodeCard
                              v-else
                              :node="node"
                              :email="userEmail"
                            >
                              <!-- Only the two bindable slots can be emptied
                                   again; the provisioned chain cannot. -->
                              <template
                                v-if="node.key in bindings"
                                #header-action
                              >
                                <Tooltip :text="`Unbind ${node.kind}`">
                                  <IconButton
                                    icon="pi pi-times"
                                    kind="transparent"
                                    size="small"
                                    :aria-label="`Unbind ${node.kind}`"
                                    @click="unbindResource(node.key)"
                                  />
                                </Tooltip>
                              </template>
                            </TopologyNodeCard>
                          </Flow.Node>
                        </Flow.Parallel>
                      </Flow>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </div>
            </template>
          </CardBox>

          <!-- Version History -->
          <div class="flex flex-col gap-[var(--layout-group-gap)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Version History
            </p>
            <CardBox :padded="false">
              <template #content>
                <DeploymentsTable
                  :deployments="deployments"
                  :email="userEmail"
                  export-filename="version-history.csv"
                  @row-click="openDeployment"
                  @action="onRowAction"
                />
              </template>
            </CardBox>
          </div>
        </div>

        <!-- ── Deployments ── -->
        <div
          v-else-if="activeTab === 'deployments'"
          class="layout-column layout-boundary flex min-w-0 flex-col gap-[var(--layout-section-gap)]"
        >
          <CardBox :padded="false">
            <template #content>
              <DeploymentsTable
                :deployments="deployments"
                :email="userEmail"
                export-filename="deployments.csv"
                @row-click="openDeployment"
                @action="onRowAction"
              />
            </template>
          </CardBox>
        </div>

        <!-- ── Settings ── -->
        <div
          v-else
          class="layout-column layout-boundary flex min-w-0 flex-col gap-[var(--layout-section-gap)]"
        >
          <PageHeading
            title="Settings"
            description="Manage this workload's configuration."
            size="small"
          />

          <form
            class="flex flex-col gap-[var(--layout-group-gap)]"
            aria-label="General settings"
            novalidate
            @submit.prevent="saveSettings"
          >
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              General
            </p>
            <CardBox :padded="false">
              <template #content>
                <fieldset
                  class="m-0 flex min-w-0 flex-col border-0 p-0"
                  :disabled="savingSettings"
                >
                  <legend class="sr-only">General</legend>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Name</Item.Title>
                        <Item.Description>
                          A unique and descriptive name to identify the workload.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <InputText
                          v-model="settings.name"
                          size="large"
                          :disabled="savingSettings"
                          class="w-full max-w-[var(--container-sm)]"
                          aria-label="Name"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </fieldset>
              </template>
              <template #footer>
                <div class="flex w-full items-center justify-end gap-[var(--spacing-sm)]">
                  <Button
                    label="Save"
                    kind="secondary"
                    size="medium"
                    :loading="savingSettings"
                    :disabled="!settingsDirty"
                    @click="saveSettings"
                  />
                </div>
              </template>
            </CardBox>
          </form>

          <!-- Danger zone -->
          <div class="flex flex-col gap-[var(--layout-group-gap)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Danger Zone
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Delete this workload</Item.Title>
                      <Item.Description>
                        Once deleted, the workload and its deployments cannot be recovered.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Button
                        label="Delete Workload"
                        kind="danger"
                        size="medium"
                        icon="pi pi-trash"
                        @click="deleteWorkload"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </div>
        </div>
      </section>
    </main>

    <!-- Read-only deployment details drawer, opened from either table. -->
    <WorkloadDeploymentDrawer
      v-model:open="drawerOpen"
      :deployment="selectedDeployment"
    />
  </AppLayout>
</template>
