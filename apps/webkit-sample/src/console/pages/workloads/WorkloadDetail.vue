<script setup>
  // Workload detail — the resource-detail view for a single workload. Its identity
  // (name) is the breadcrumb; below the header a full-bleed PageTabs bar (Overview /
  // Deployments / Settings) drives the active sub-page, with the active tab held in
  // the URL (`?tab=`) so it survives reload and is linkable.
  //
  //  - Overview: three bands with the same anatomy — a PageHeading (`size="small"`, so
  //    the title keeps the heading-xs / `--text-default` weight it had as a card
  //    header) over a flush CardBox, at the group gap. "Active Deployment" (the
  //    deployment's facts), "Deployment topology" (a Flow diagram of the four
  //    resources a deploy provisions — Workload → Application → Connector → Storage,
  //    src/lib/provisioning.js) and "Version History". The topology used to live
  //    inside the Active Deployment card, in an Accordion; it is a band of its own now,
  //    so the chain reads as a peer of the deployment rather than a detail of it.
  //  - Deployments: the same history, unscoped by the Overview's framing.
  //  - Settings: a General ItemGroup + a danger delete row, committed as ONE page from
  //    the shared save bar (ui/SettingsSaveBar.vue) like every settings surface here.
  //
  // Every band's CONTROLS sit OUT of its card — inside a card header they read as the
  // card's chrome rather than as the thing that drives it. Where above the card they
  // land depends on WHAT they are:
  //
  //   Active Deployment — the Environment Select rides the heading row as that band's
  //     action (title left, control right, one line). It is a control, not a filter: it
  //     picks which deployment the card reports (each environment is its own domain
  //     and its own record) rather than narrowing anything, so it wears no filter
  //     button and earns no row of its own.
  //   Version History / Deployments — narrowing, so it takes the row every list in the
  //     console opens with (ui/ControlsHeader.vue): the search, then a filter bar of
  //     chips (ui/FilterBar.vue) over the shared deployment catalog, hoisted out of the
  //     table's `#toolbar` under the heading — `:controls="false"`, and this page owns
  //     the state and binds it back in as models. Same catalog as the module list, so
  //     only the place changes and the two can never drift.
  //
  // Both tables are the shared DeploymentsTable — the one table shape the
  // Deployments module also uses, so a deployment reads identically whether it is
  // listed here or in the module list. A row (in either table) opens that
  // deployment's PAGE, which is the only surface a deployment is read on.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Flow from '@aziontech/webkit/flow'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { consoleDeployRowsFor } from '@shared/lib/azion-deploys'
  import { deploymentRowsFor } from '@shared/lib/deployment-history'
  import {
    demoDeployment,
    findDeploymentByWorkload,
    provisionedDeployRow,
    resourceChain
  } from '@shared/lib/provisioning'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeploymentsTable from '../../components/deployment/DeploymentsTable.vue'
  import FieldRow from '../../components/form/FieldRow.vue'
  import SettingsSaveBar from '../../components/form/SettingsSaveBar.vue'
  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import FilterBar from '../../components/list/FilterBar.vue'
  import LastModifiedCell from '../../components/list/LastModifiedCell.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import PageTabs from '../../components/page/PageTabs.vue'
  import Section from '../../components/page/Section.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import TopologyBindNode from '../../components/workload/TopologyBindNode.vue'
  import TopologyNodeCard from '../../components/workload/TopologyNodeCard.vue'
  import { useTabEnter } from '../../lib/behavior/tab-enter'
  import {
    deploymentFilterFields,
    environmentOptions,
    statusMeta
  } from '../../lib/data/deployments'
  import { releaseSeedForWorkload } from '../../lib/data/releases'

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
    // Only a real tab is written to the URL — the same guard the Deployments module
    // carries. The tab bar can emit an empty value while this page is being left
    // behind, and writing that put a bare `&tab` on the URL of whatever came next:
    // visible on every deployment link now that a row navigates to a page.
    set: (value) => {
      if (!tabs.some((tab) => tab.value === value)) return
      router.replace({ query: { ...route.query, tab: value } })
    }
  })

  // --- Active deployment (Overview) ----------------------------------------
  // Environment PICKS which deployment the Active Deployment band reports — each one
  // is its own domain and its own record — so it is a Select, not a filter: it never
  // narrows a list and it can never be unset. It renders in the band's controls row
  // above the card (out of the card's header, where it read as chrome), on the right.
  const activeEnvironment = ref('Production')
  const environmentLabel = (value) =>
    environmentOptions.find((option) => option.value === value)?.label ?? value

  // Each environment resolves to its own domain on the same workload: the rehearsal
  // environments are the Production host under their own label. Every option the
  // selector offers is mapped — an environment that fell through to the Production
  // domain would have the card report the LIVE host under a rehearsal label.
  const domainsByEnvironment = computed(() => ({
    Production: workload.value.domain,
    Preview: `preview-${workload.value.domain}`,
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
      description: 'Not bound. Requests reach the application uninspected.',
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
  //
  // Every slot is `terminal`, bound or not. A binding is not a link in the chain: the
  // workload's relationship to each slot is a platform default, so a connector reaches
  // it, but nothing flows onward from a binding to the Connector. Binding one fills the
  // card; it does not promote the slot into a step. Only the Application carries the
  // chain forward out of this level.
  const applicationLevel = computed(() => {
    const application = topology.value.find((node) => node.key === 'application')
    return [
      application,
      ...BINDABLE.map((slot) => {
        const boundName = bindings[slot.key]
        if (!boundName) return { ...slot, empty: true, terminal: true }
        return {
          key: slot.key,
          kind: slot.kind,
          icon: slot.icon,
          name: boundName,
          status: 'Active',
          href: '',
          terminal: true,
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

  // --- Which nodes are open -------------------------------------------------
  // Every node of the topology is a disclosure (ui/TopologyNode.vue), and the page
  // — not the card — decides which ones start open: NONE of them do. Closed, a node
  // still names its kind, its status and its resource, so the chain arrives as what
  // it IS — Workload → Application → Connector → Storage — and the fields are one
  // click away. That is also what keeps the Deployment Topology band short on arrival:
  // every node open would put a ~380px wall of key/value pairs between the
  // deployment's facts and its version history. Nodes are independent, so opening one
  // never closes another.
  const openNodes = reactive({})

  const bindResource = (slotKey, value) => {
    const slot = BINDABLE.find((item) => item.key === slotKey)
    bindings[slotKey] = value
    // The slot the user just filled opens, so the node shows what it now holds
    // instead of closing back into the chain the moment it stops being empty.
    openNodes[slotKey] = true
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
  // This workload's deployments come from the ONE deployment history every surface
  // reads (src/lib/deployment-history.js), filtered to this workload. That is the
  // whole relationship between this table and the Deployments module's: the module
  // lists every deployment, this lists the ones whose `workloadId` is this workload,
  // and they are the SAME ROWS — same version ids, statuses, resources, authors and
  // timestamps. Each page used to seed its own fixture, and both started at version
  // `1293183210`, so one id named two contradictory deployments and a workload had no
  // row in common with the module that listed it.
  //
  // A deployment targets exactly ONE resource (the model src/lib/deployments.js
  // states), and the history names that resource under the field every deployment
  // reads it as — so a row no longer claims all three of the workload's resources.
  const historicDeployments = computed(() =>
    deploymentRowsFor(workloadId, route.query.name || workload.value.name)
  )

  // A workload created by the deploy flow leads its own history: the version that
  // provisioned it is the current deployment, and the seeded history moves behind it.
  // The row shape comes from the provisioning store itself (`provisionedDeployRow`),
  // which is also what `/deployments/:versionId` resolves that version to — the row
  // and the page it opens are one record, not two hand-built ones.
  const provisionedDeployment = computed(() => {
    const provisioned = findDeploymentByWorkload(workloadId)
    return provisioned ? provisionedDeployRow(provisioned) : null
  })

  // Deploys started from the console this session — from this page's own New
  // Deployment, from the Applications module, from anywhere — are the same records the
  // Deployments module lists, filtered to this workload (src/lib/azion-deploys.js).
  // They lead the history: they are the newest, and one of them may be the deployment
  // now serving traffic.
  const consoleDeployments = computed(() => consoleDeployRowsFor(workloadId))

  const deployments = computed(() => {
    const rows = [
      ...consoleDeployments.value,
      ...(provisionedDeployment.value ? [provisionedDeployment.value] : []),
      ...historicDeployments.value
    ]

    // Exactly ONE deployment per workload serves traffic. The list is newest-first, so
    // the first row that claims `current` keeps it and every row behind it loses the
    // flag — which is what a release going live actually does to the deployment that
    // held it until now.
    let claimed = false
    return rows.map((deployment) => {
      if (!deployment.current) return deployment
      if (claimed) return { ...deployment, current: false }
      claimed = true
      return deployment
    })
  })

  // The current (active) deployment drives the Active Deployment card.
  const activeDeployment = computed(
    () => deployments.value.find((deployment) => deployment.current) ?? deployments.value[0]
  )

  // --- Deployment table controls -------------------------------------------
  // The controls that narrow the deployment tables sit OUT of the card, in the band's
  // own controls row above it — the placement every list in the console uses
  // (ui/ControlsHeader.vue), so a deployment table is narrowed the same way here as in
  // the Deployments module. DeploymentsTable therefore renders no toolbar of its own
  // (`:controls="false"`) and this page holds the state, binding it back in as the two
  // models; the CATALOG still comes from one file (src/lib/deployments.js), so the two
  // placements cannot drift.
  //
  // No Deployed window here: this list is one workload's own history, short enough
  // that a date field would be a chip nobody opens (the module list, which spans every
  // deployment ever made, asks for it).
  //
  // ONE set of state for both tabs: the Overview's Version History and the Deployments
  // tab list the same deployments, so narrowing them is one decision rather than two,
  // and it carries when the user moves between the tabs. Only one of them is rendered
  // at a time, so the two tables never fight over the models.
  const deployFields = computed(() => deploymentFilterFields(deployments.value))
  const deploySearch = ref('')
  const deployFilters = ref({})

  // --- Opening a deployment -------------------------------------------------
  // Its PAGE (`/deployments/:versionId`), the same destination the module list uses.
  // It used to be a read-only drawer here, which meant a deployment read one way from
  // this page and another way from the module — and the drawer's version of it could
  // not be linked to or reloaded. One deployment, one surface.
  // The workload rides along: a workload this sample does not seed has a DERIVED
  // history (lib/deployment-history.js), so its version ids only mean something
  // relative to it — without that, a reload of the deployment's URL would find
  // nothing. For a seeded workload it is redundant and harmless.
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

  // --- Header actions ------------------------------------------------------
  // ── Deploy ────────────────────────────────────────────────────────────────
  // Deploying opens the RELEASE COMPOSER (../ReleaseComposer.vue) PINNED to what this
  // workload already deploys: its own Deployment settings, selected, and the application it
  // is already serving, so nothing this page already knows is asked again. It is a page, not
  // a drawer: what a release reaches (environments · workloads · domains) is reviewed before
  // it is deployed, and that review has to be linkable and survive a reload, which is why
  // the entry context rides the query string.
  const newDeployment = () => {
    const { settingsIds } = releaseSeedForWorkload(workloadId)
    router.push({
      path: '/deployments/releases/new',
      query: {
        email: userEmail.value,
        workload: workload.value.name,
        workloadId,
        ...(settingsIds.length ? { deploymentIds: settingsIds.join(',') } : {}),
        ...(settingsIds.length > 1 ? { pickTarget: 'true' } : {})
      }
    })
  }

  // A tab switch replaces a whole screen, so it arrives like one.
  const scrollRef = ref(null)
  const enterRef = ref(null)
  useTabEnter(enterRef, activeTab, scrollRef)

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
  // A page-level commit owes a way out that is not undoing each field by hand.
  const discardSettings = () => {
    Object.assign(settings, JSON.parse(settingsBaseline.value))
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
      <PageTabs
        v-model:value="activeTab"
        :tabs="tabs"
      >
        <!-- Action hierarchy: ONE primary, and it is the thing this page is for —
             deploying. "Deploy" changes what the workload serves; "Visit" only opens
             what it already serves in another tab, so it is the secondary affordance
             and takes `outlined`, and it sits on the LEFT so the primary keeps the
             outer edge (the last thing on the row, where the eye lands and the pointer
             travels). It was the other way round: the destination was painted primary
             and the deploy read as the lesser of the two.

             The label is the one every Deploy in the console carries, because it opens
             the one screen every Deploy opens (../ReleaseComposer.vue). It read "New
             Deployment" while a second, smaller deploy form existed to contrast with. -->
        <template #actions>
          <Button
            label="Visit"
            kind="outlined"
            size="medium"
            icon="pi pi-arrow-up-right"
            @click="visit"
          />
          <Button
            label="Deploy"
            kind="primary"
            size="medium"
            icon="pi pi-cloud-upload"
            @click="newDeployment"
          />
        </template>
      </PageTabs>

      <section
        ref="scrollRef"
        class="min-h-0 flex-1 overflow-auto"
      >
        <!-- A STABLE wrapper: `useTabEnter` replays the page entrance on it when
             the tab changes, and sends the region back to the top. -->
        <div ref="enterRef">
          <!-- ── Overview ── -->
          <div
            v-if="activeTab === 'overview'"
            class="layout-column layout-boundary flex min-w-0 flex-col"
          >
            <!-- The tab's parent section: it spaces the sections inside it at
                 --layout-section-gap. -->
            <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
              <!-- Active Deployment — the same anatomy as Version History below: a
                   small PageHeading, then the band's controls, then a flush CardBox,
                   each at the group gap. The Environment Select is this band's CONTROL,
                   so it sits in that controls row (out of the card) rather than in a
                   card header: it narrows what the card shows — the version, the
                   status, the domain the topology starts from — so it belongs above the
                   surface it narrows, which is where every other list in the console
                   puts the fields that drive it (see ui/ControlsHeader.vue). -->
              <div class="flex flex-col gap-(--layout-group-gap)">
                <!-- The Environment Select rides the HEADING row as that band's action,
                     out of the card. It is a control, not a filter — it picks which
                     deployment the card reports (each environment is its own domain and
                     its own record) rather than narrowing anything — so it wears no
                     filter button and needs no row of its own: one line, title left,
                     control right. -->
                <PageHeading
                  title="Active Deployment"
                  size="small"
                >
                  <template #actions>
                    <!-- MIN-width, not width: Select's own root already carries
                         `w-full`, and Tailwind emits `.w-full` AFTER any width utility
                         built on a container token, so a width passed in here loses on
                         source order and the field just sizes to its content. `min-w-*`
                         is a different property, so it is the one lever a consumer
                         actually has — `w-full` then resolves against it. -->
                    <Select
                      v-model="activeEnvironment"
                      size="large"
                      class="min-w-(--container-2xs)"
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
                </PageHeading>
                <CardBox :padded="false">
                  <template #content>
                    <!-- The deployment's four facts. The topology used to sit under this
                         grid inside a collapsible; it is its own band now, so this card
                         is the fact grid and nothing else. -->
                    <div
                      class="p-(--spacing-md) grid grid-cols-2 gap-(--spacing-sm) lg:grid-cols-4"
                    >
                      <div class="flex flex-col gap-(--spacing-xxs)">
                        <span class="text-label-sm text-(--text-muted)">Version ID</span>
                        <div class="flex items-center gap-(--spacing-xs)">
                          <span class="text-body-sm text-(--text-default)">{{
                            activeDeployment.versionId
                          }}</span>
                          <CopyButton
                            kind="outlined"
                            :value="activeDeployment.versionId"
                            aria-label="Copy version ID"
                          />
                        </div>
                      </div>
                      <div class="flex flex-col gap-(--spacing-xxs)">
                        <span class="text-label-sm text-(--text-muted)">Environment</span>
                        <div class="flex items-center gap-(--spacing-xs)">
                          <span class="text-body-sm text-(--text-default)">{{
                            activeEnvironment
                          }}</span>
                          <Tag
                            label="Current"
                            severity="info"
                            size="small"
                          />
                        </div>
                      </div>
                      <!-- Status reads horizontally: the StatusIndicator already carries
                           its own label, so stacking a caption above it spends a second
                           line on one short word. -->
                      <div class="flex flex-col items-start gap-(--spacing-xs) self-start">
                        <span class="text-label-sm text-(--text-muted)">Status</span>
                        <StatusIndicator
                          :severity="statusMeta(activeDeployment.status).severity"
                          :loading="statusMeta(activeDeployment.status).loading"
                          :label="activeDeployment.status"
                        />
                      </div>
                      <div class="flex items-start justify-between gap-(--spacing-xs)">
                        <div class="flex flex-col gap-(--spacing-xxs)">
                          <span class="text-label-sm text-(--text-muted)">Deployed</span>
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
                  </template>
                </CardBox>
              </div>

              <!-- Deployment Topology — its own band, with the same anatomy as the two
                   around it: a small PageHeading over a flush CardBox at the group gap.
                   It used to be an Accordion tucked under the Active Deployment fact
                   grid, which cost it twice: a whole subsystem read as a DETAIL of that
                   card, and the accordion trigger had to grow its own heading-xxs title
                   to name it, competing with the PageHeading above. As a band it is named
                   once, by the same component every other band uses, and it sits at the
                   section gap as the peer of Active Deployment and Version History. No
                   accordion: the bands around it do not fold, and a section that names
                   itself does not need a second control to reveal it. -->
              <div class="flex flex-col gap-(--layout-group-gap)">
                <PageHeading
                  title="Deployment topology"
                  size="small"
                />
                <!-- `--bg-surface-raised` instead of CardBox's default `--bg-surface`:
                     the node cards inside are themselves `--bg-surface` and now carry a
                     `shadow-sm`, so the band needs to sit one step behind them for the
                     chain to read as cards ON a surface rather than cards IN a box.
                     CardBox merges a consumer class through `cn`, so the bg override
                     wins over its default. -->
                <CardBox
                  :padded="false"
                  class="bg-(--bg-surface-raised)"
                >
                  <template #content>
                    <!-- The chain a deploy provisions, left to right:
                         Workload → Application → Connector → Storage, with the
                         Application level also carrying its bindable resources
                         (Firewall, Custom Page) stacked in the same column via
                         Flow.Parallel. Every node is the same card and every card is a
                         DISCLOSURE (ui/TopologyNode.vue): the header names the node
                         (kind + status + the resource's own name) and the fields sit
                         behind it, so the diagram reads as one system instead of bespoke
                         boxes — an unbound slot is that same card, dashed, holding the
                         CTA that fills it. Every node arrives CLOSED (`openNodes`), and a
                         closed node still says what it is, which is what keeps the chain
                         legible collapsed and the band short on arrival.
                         `align="start"` tops the levels against each other, so opening
                         one node never nudges the others. Flow's own track is `w-fit`;
                         `[&>div]:w-full` stretches it to the card, and each level takes
                         an equal share of it (`flex-1`) so every node card is w-full
                         inside its level instead of a fixed 256px box. Flow carries its
                         own `--spacing-md` padding, which is why the CardBox stays
                         `:padded="false"`. -->
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
                        <!-- `terminal` marks the two BINDING slots (Firewall, Custom
                             Page). They are not links in the provisioned chain: the
                             workload's relationship to each slot is a platform default,
                             so a connector reaches them, but nothing flows onward from a
                             binding to the Connector. Flow's `terminal` says exactly
                             that — the node receives an incoming connector and
                             originates none — so the chain runs Workload → Application →
                             Connector → Storage while the bindings hang off it as
                             leaves. It applies bound OR unbound: binding one fills the
                             card, it does not turn the slot into a step. -->
                        <Flow.Node
                          v-for="node in level.nodes"
                          :key="node.key"
                          unstyled
                          :terminal="Boolean(node.terminal)"
                          class="w-full"
                        >
                          <!-- Empty node: the slot is open, so the card is the bind
                             CTA. -->
                          <TopologyBindNode
                            v-if="node.empty"
                            v-model:open="openNodes[node.key]"
                            :kind="node.kind"
                            :icon="node.icon"
                            :description="node.description"
                            :cta-label="node.ctaLabel"
                            :options="node.options"
                            @bind="(event, value) => bindResource(node.key, value)"
                          />
                          <TopologyNodeCard
                            v-else
                            v-model:open="openNodes[node.key]"
                            :node="node"
                            :email="userEmail"
                          >
                            <!-- Only the two bindable slots can be emptied again; the
                               provisioned chain cannot. Unbinding sits in the node's
                               BODY, not its header: the header is one full-width
                               disclosure button, and a nested button is invalid — and a
                               destructive control one stray click from firing is the
                               last thing a collapsed row should carry. -->
                            <template
                              v-if="node.key in bindings"
                              #actions
                            >
                              <Button
                                :label="`Unbind ${node.kind}`"
                                kind="text"
                                size="small"
                                icon="pi pi-times"
                                @click="unbindResource(node.key)"
                              />
                            </template>
                          </TopologyNodeCard>
                        </Flow.Node>
                      </Flow.Parallel>
                    </Flow>
                  </template>
                </CardBox>
              </div>

              <!-- Version History — the section this band's shape comes from: the
                   title above the flush card, not inside it. -->
              <div class="flex flex-col gap-(--layout-group-gap)">
                <PageHeading
                  title="Version History"
                  size="small"
                />
                <!-- The table's own fields, hoisted out of its toolbar into the band's
                     controls row. Same component, same panel, same badge — only the
                     PLACE changes, and this page owns the state it drives. -->
                <ControlsHeader>
                  <InputText
                    v-model="deploySearch"
                    size="large"
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
                </ControlsHeader>
                <FilterBar
                  v-model="deployFilters"
                  :fields="deployFields"
                />
                <CardBox :padded="false">
                  <template #content>
                    <DeploymentsTable
                      v-model:search="deploySearch"
                      v-model:filters="deployFilters"
                      :deployments="deployments"
                      :fields="deployFields"
                      :email="userEmail"
                      :controls="false"
                      @row-click="openDeployment"
                      @action="onRowAction"
                    />
                  </template>
                </CardBox>
              </div>
            </section>
          </div>

          <!-- ── Deployments ── -->
          <div
            v-else-if="activeTab === 'deployments'"
            class="layout-column layout-boundary flex min-w-0 flex-col"
          >
            <!-- The tab's parent section: it spaces the sections inside it at
                 --layout-section-gap. -->
            <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
              <!-- No section heading: the tab bar already names this band "Deployments",
                   so the band opens with its CONTROLS instead — the same shape a
                   first-level module list takes, where the breadcrumb does the naming
                   (see ui/ControlsHeader.vue). -->
              <div class="flex flex-col gap-(--layout-group-gap)">
                <ControlsHeader>
                  <InputText
                    v-model="deploySearch"
                    size="large"
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
                </ControlsHeader>
                <FilterBar
                  v-model="deployFilters"
                  :fields="deployFields"
                />
                <CardBox :padded="false">
                  <template #content>
                    <DeploymentsTable
                      v-model:search="deploySearch"
                      v-model:filters="deployFilters"
                      :deployments="deployments"
                      :fields="deployFields"
                      :email="userEmail"
                      :controls="false"
                      @row-click="openDeployment"
                      @action="onRowAction"
                    />
                  </template>
                </CardBox>
              </div>
            </section>
          </div>

          <!-- ── Settings ── -->
          <!-- The FORM measure, not the data one the two tabs above take: this band is
               a single stacked column of label-plus-control rows, so past ~1200px the
               extra width lands inside the controls and leaves each label a head-turn
               from the field it names. Per layout.css the unit that picks a measure is
               the BAND, not the file — the same split Main Settings and Build make
               inside ApplicationDetail. -->
          <div
            v-else
            class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeading
              title="Settings"
              description="Manage this workload's configuration."
              size="small"
            />

            <!-- The tab's bands, in the console's settings anatomy: a Section (title +
                 Hint) over a flush card of rows, exactly what the create page that made
                 this workload is built from. -->
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
                  hint="How this workload is identified across the console and in its deployments."
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
                      </Item.List>
                    </template>
                  </CardBox>
                </Section>

                <!-- Danger Zone — titled like every band above it. What marks it as
                     destructive is the `kind="danger"` Button, not a recoloured title. -->
                <Section
                  stacked
                  anchor
                  :divided="false"
                  title="Danger Zone"
                  hint="Irreversible. Read the row before you click it."
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
                            @click="deleteWorkload"
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

    <!-- The Settings tab commits page-level, through the shared bar every settings
         surface in the console uses (ui/SettingsSaveBar.vue). Gated on the tab so it cannot
         follow the reader to Overview or Deployments. -->
    <SettingsSaveBar
      v-if="activeTab === 'settings'"
      :dirty="settingsDirty"
      :saving="savingSettings"
      @save="saveSettings"
      @discard="discardSettings"
    />

    <!-- The bar carries the leave guard, and the bar is gated on the tab — so on Overview
         or Deployments a pending settings edit would have nothing holding the exit. The
         guard is mounted directly for exactly those tabs: the pair is mutually exclusive,
         so one guard is live at all times and never two. The BAR stays tab-gated (that is
         a deliberate decision, see its comment above); what must not be tab-gated is the
         protection, because the edit is still pending wherever the reader wandered to. -->
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
