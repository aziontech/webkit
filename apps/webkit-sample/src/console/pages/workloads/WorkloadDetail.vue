<script setup>
  // Workload detail — the resource-detail view for a single workload. Its identity
  // (name) is the breadcrumb; below the header a full-bleed PageTabs bar (Overview /
  // Deployments / Settings) drives the active sub-page, with the active tab held in
  // the URL (`?tab=`) so it survives reload and is linkable.
  //
  //  - Overview: the workload's own summary block, then two bands with the same anatomy
  //    — a PageHeading (`size="small"`, so the title keeps the heading-xs /
  //    `--text-default` weight it had as a card header) over a flush CardBox, at the
  //    group gap: "Deployment topology" (a Flow diagram of the resources a deploy
  //    provisions — Workload → Application → Connector → Storage, src/lib/provisioning.js)
  //    and "Version History".
  //  - Deployments: the same history, unscoped by the Overview's framing.
  //  - Settings: a General ItemGroup + a danger delete row, committed as ONE page from
  //    the shared save bar (ui/SettingsSaveBar.vue) like every settings surface here.
  //
  // AN "ACTIVE DEPLOYMENT" BAND USED TO OPEN THE OVERVIEW — a fact grid (version id,
  // environment, status, deployed by/when) with an Environment Select on its heading row.
  // It is gone: the version and its status are a row in Version History directly below,
  // which is where a deployment is read, and the band restated the top of that table as a
  // second card. Its Environment Select went with it — the only thing it actually moved
  // was which host the page reported, and the workload has one address again.
  //
  // Every band's CONTROLS sit OUT of its card — inside a card header they read as the
  // card's chrome rather than as the thing that drives it:
  //
  //   Version History / Deployments — narrowing, so it takes the row every list in the
  //     console opens with (../../components/page/ControlsHeader.vue): the search, then
  //     the Filter button (list/FilterButton.vue) over the shared deployment catalog, hoisted out of the
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
  import Flow from '@aziontech/webkit/flow'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
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
  import ExportButton from '../../components/list/ExportButton.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import PageTabs from '../../components/page/PageTabs.vue'
  import ProductionChecklist from '../../components/page/ProductionChecklist.vue'
  import Section from '../../components/page/Section.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import AddDomainDrawer from '../../components/workload/AddDomainDrawer.vue'
  import DeploymentFooter from '../../components/workload/DeploymentFooter.vue'
  import TopologyBindNode from '../../components/workload/TopologyBindNode.vue'
  import TopologyNodeCard from '../../components/workload/TopologyNodeCard.vue'
  import WorkloadSummary from '../../components/workload/WorkloadSummary.vue'
  import { useListRefresh } from '../../lib/behavior/list-state'
  import { useTabEnter } from '../../lib/behavior/tab-enter'
  import { CUSTOM_PAGES } from '../../lib/data/custom-pages'
  import { deploymentFilterFields } from '../../lib/data/deployments'
  import { existingFirewallOptions } from '../../lib/data/firewalls'
  import {
    currentDeploymentFor,
    releaseSeedForWorkload,
    settingsById,
    settingsIdsForWorkload
  } from '../../lib/data/releases'

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

  // --- Deployment topology --------------------------------------------------
  // The four provisioned resources, in creation order, as Flow nodes.
  //
  // The chain is read straight off the record. It used to be spread over a re-pointed
  // workload, because an Environment Select on the Active Deployment band swapped the
  // host between Production / Stage / Preview — that band is gone, and with it the only
  // control that ever moved this page off Production. The workload's own `environment`
  // and `domain` are what the chain reports now.
  const topology = computed(() => resourceChain(record.value))

  // --- Application-level bindings -------------------------------------------
  // A deployment binds an Application and, optionally, a Firewall and a Custom
  // Page. Those two are provisioned by nothing, so they are absent from
  // `resourceChain()` — but leaving them out of the diagram hides the decision.
  // They render at the Application's own level (a Flow.Parallel column) as EMPTY
  // nodes: the slot stays visible, with the CTA that fills it.
  //
  // WHAT A SLOT OFFERS IS THE MODULE'S OWN LIST — the seeded firewalls
  // (../../lib/data/firewalls.js) and custom pages (../../lib/data/custom-pages.js),
  // not names invented here. That is what lets a bound slot LINK: `module` + the id
  // the option carries is the `/<module>/:id/settings` page the module list edits that
  // row with, so binding here and editing there name one resource. Invented options
  // could only ever link to a resource that is in no list.
  const BINDABLE = [
    {
      key: 'firewall',
      kind: 'Firewall',
      icon: 'ai ai-edge-firewall',
      description: 'Not bound. Requests reach the application uninspected.',
      ctaLabel: 'Bind Firewall',
      module: 'firewall',
      // The five most recently touched, which is the order `existingFirewallOptions()`
      // sorts for and the count a create offers — fourteen of them in a ~230px node
      // column is a picker, not a slot.
      options: existingFirewallOptions()
        .slice(0, 5)
        .map((option) => ({ value: option.id, label: option.label }))
    },
    {
      key: 'customPage',
      kind: 'Custom Page',
      icon: 'ai ai-custom-pages',
      description: "Not bound — 4xx/5xx fall back to Azion's default page.",
      ctaLabel: 'Bind Custom Page',
      module: 'custom-pages',
      options: CUSTOM_PAGES.map((page) => ({ value: page.id, label: page.name }))
    }
  ]

  // What each slot currently holds — `{ id, name }`, because the node shows the name
  // and links by the id. `null` keeps the empty node on the canvas.
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
        const bound = bindings[slot.key]
        if (!bound) return { ...slot, empty: true, terminal: true }
        return {
          key: slot.key,
          kind: slot.kind,
          icon: slot.icon,
          name: bound.name,
          status: 'Active',
          // A FILLED SLOT IS A REAL RESOURCE, so it goes where its module reads it —
          // the same `/<module>/:id/settings` page the module list's Edit opens. A
          // bound slot with no way out was the one node of the chain that named
          // something and then refused to show it.
          href: `/${slot.module}/${bound.id}/settings`,
          terminal: true,
          fields: [
            // ID first, like every provisioned node above: it is what the link resolves.
            { label: 'ID', value: bound.id },
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

  // --- Deployment settings --------------------------------------------------
  // WHAT THIS WORKLOAD DEPLOYS WITH. A Deployment setting IS the strategy a deployment
  // applies (../../lib/data/deployment-strategies.js), so this reads the one store the
  // Deployments module authors into and the release composer deploys from, through the
  // same projection (`deploymentSettings` in ../../lib/data/releases.js). No fixture:
  // a setting created in that drawer appears here, and one deleted there leaves.
  //
  // A workload can publish into more than one — every third one does, one per environment
  // — so this is a list, and `settingsIdsForWorkload` is the same pairing the Deploy button
  // above pins the composer to.
  const workloadSettings = computed(() =>
    settingsIdsForWorkload(workloadId)
      .map((id) => settingsById(id))
      .filter(Boolean)
  )

  // WHAT IS LIVE ON THIS WORKLOAD — the row its history marks `current`
  // (@shared/lib/deployment-history.js, via the same lookup the release seed uses). It is
  // the deployment the settings above published, so both go on one card, and it is where
  // the version, its status and "deployed 24s ago by …" now live: the Active Deployment
  // band that used to carry them is gone.
  const currentDeployment = computed(() => currentDeploymentFor(workloadId) ?? null)

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

  // --- Ship to production ---------------------------------------------------
  // WHAT IS STILL BETWEEN THIS WORKLOAD AND PRODUCTION, counted in one band at the top
  // of the Overview (../../components/page/ProductionChecklist.vue). A create can only
  // ask what it needs to create the thing; these three are the rest, and leaving them to
  // be discovered is how a workload ends up live on a generated hostname with nothing in
  // front of it.
  //
  // EVERY STEP IS DERIVED FROM THE STATE THIS PAGE ALREADY RENDERS — the domains list,
  // the two bindable slots of the topology, the firewall the chain was provisioned with.
  // Nothing is stored as "done": a step is done because the thing exists, so undoing the
  // work puts the step back, which a click-counter never would.
  //
  // The custom domains this page adds are page-local, exactly like `bindings` above: the
  // topology's bind slots do not survive a reload either, and one of the two persisting
  // while the other did not would be the confusing half-measure.
  const customDomains = ref([])
  const addDomainOpen = ref(false)

  // The firewall is done EITHER WAY it can be there: bound here on the topology, or
  // provisioned with the chain by a create that asked for protection
  // (../applications/CreateApplication.vue). Reading only `bindings` would show the step
  // as pending on a workload that has had a firewall since the day it was made.
  const boundFirewall = computed(() => bindings.firewall?.name || record.value.firewall?.name || '')

  // Each step reads on TWO surfaces, and carries what each of them needs
  // (../../components/page/ProductionChecklist.vue): the band on the page shows only the
  // `icon` and the `title`, so the title is the act; the drawer behind the band's expand
  // control adds the `description` — one paragraph on what skipping it costs — and an
  // `actionLabel`, the verb of that card's own button. The label matches the control the
  // step actually leads to ("Bind Firewall" is what the topology's own node says), so the
  // brief and the thing it opens agree on what the reader is about to do.
  const productionSteps = computed(() => [
    {
      id: 'domain',
      icon: 'pi pi-globe',
      title: 'Add a custom domain',
      description:
        'Serve this workload on a domain of your own, with a free HTTPS certificate, instead of the generated Azion hostname.',
      actionLabel: 'Add Domain',
      done: customDomains.value.length > 0,
      // The FACT, not the verdict: a reader coming back to a done step is checking WHICH
      // domain it ended up on.
      doneNote: `Serving ${customDomains.value.map((entry) => entry.domain).join(', ')}.`
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
      done: Boolean(bindings.customPage),
      doneNote: `Serving ${bindings.customPage?.name ?? ''}.`
    }
  ])

  // The band is a POINTER, not a second place to configure things: every step but the
  // domain is already answerable on this page, so pressing one takes the reader to that
  // control and opens it rather than growing a parallel form beside it. The domain has no
  // control here, so it gets the drawer the create flow already uses for it
  // (../../components/workload/AddDomainDrawer.vue) — one surface for adding a domain,
  // not two that can disagree.
  const topologyRef = ref(null)

  const onChecklistAction = (step) => {
    if (step.id === 'domain') {
      addDomainOpen.value = true
      return
    }
    // The topology's own bind node for that slot, opened where it lives. A bound slot
    // opens too — the reader pressed Review to see what is in it.
    openNodes[step.id] = true
    // Smooth, unless the reader asked for less motion — a scripted scroll is motion like
    // any other, and it is the one kind a `motion-reduce:` class cannot reach.
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    topologyRef.value?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
  }

  const addDomain = (domain) => {
    customDomains.value = [...customDomains.value, domain]
    toast.success(`${domain.domain} added to ${workload.value.name}.`, {
      description: 'Point your DNS at the workload to finish the handover.'
    })
  }

  // The Dropdown emits the option's VALUE, which is the resource's id — the slot's own
  // options are what turn it back into the name the node shows.
  const bindResource = (slotKey, id) => {
    const slot = BINDABLE.find((item) => item.key === slotKey)
    const option = slot?.options.find((entry) => entry.value === id)
    if (!option) return
    bindings[slotKey] = { id: option.value, name: option.label }
    // The slot the user just filled opens, so the node shows what it now holds
    // instead of closing back into the chain the moment it stops being empty.
    openNodes[slotKey] = true
    toast.success(`${option.label} bound to ${workload.value.name}`, {
      description: `${slot.kind} now applies to this deployment.`
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
  // that a date field would be a field nobody opens (the module list, which spans every
  // deployment ever made, asks for it).
  //
  // ONE set of state for both tabs: the Overview's Version History and the Deployments
  // tab list the same deployments, so narrowing them is one decision rather than two,
  // and it carries when the user moves between the tabs. Only one of them is rendered
  // at a time, so the two tables never fight over the models.
  const deployFields = computed(() => deploymentFilterFields(deployments.value))
  const deploySearch = ref('')
  const deployFilters = ref({})

  // What the controls row's Refresh button does, and the flag the deployment table
  // binds for its skeleton rows — one flag over both causes, a scope switch and a
  // manual refresh (../../lib/behavior/list-state.js).
  const { loading, refresh } = useListRefresh()

  // The tables the two controls rows drive. Two refs rather than one shared name: the
  // tabs are `v-if`/`v-else-if` branches, and a single ref would depend on Vue's
  // mount/unmount order at the moment of the switch. Download CSV goes through the
  // shared component, which forwards `exportCsv` to the DS table inside it.
  const versionsTableRef = ref(null)
  const deploymentsTableRef = ref(null)

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
        <!-- ONE action, and it is the thing this page is for — deploying. "Visit" used
             to sit beside it as the outlined secondary; it moved onto the workload's own
             card (../../components/workload/WorkloadSummary.vue), because it opens the
             ADDRESS, and the address is what that card is. What is left here is the one
             act that changes what the workload serves.

             The label is the one every Deploy in the console carries, because it opens
             the one screen every Deploy opens (../ReleaseComposer.vue). It read "New
             Deployment" while a second, smaller deploy form existed to contrast with. -->
        <template #actions>
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
              <!-- THE WORKLOAD ITSELF — first, and unconditionally. Everything else on
                   this page reports something ABOUT the workload (what is left to do, what
                   it is made of, what it has shipped); this is the workload
                   (../../components/workload/WorkloadSummary.vue). The page used to open
                   without ever naming the hostname, which is the one fact a reader comes
                   to a workload for.

                   The workload goes in as it is. This used to take a re-pointed
                   `activeDomain` so the address followed the Active Deployment band's
                   Environment Select; that band is gone, so there is one host again.

                   Both of the card's actions are the PAGE's: `visit` opens the address,
                   `add-domain` opens the same drawer the checklist's own domain row opens
                   — one surface for adding a domain, not two that can disagree.

                   IT SITS IN THE COLUMN, not in a row beside the checklist. The two were
                   tried side by side at a common height, and the pairing cost more than the
                   vertical space it saved: the summary carries less than the checklist, so
                   it spent a third of its height on nothing, and half a column squeezed the
                   strip into two lines and the fact row into columns too narrow for their
                   own labels. Full width, each says its piece once. -->
              <WorkloadSummary
                :workload="workload"
                :custom-domains="customDomains"
                @visit="visit"
                @add-domain="addDomainOpen = true"
              >
                <!-- WHAT IS RUNNING ON IT, as the card's footer rather than a card of its
                     own further down. A deployment is not a peer of the workload — it is
                     the workload's current state — so the card that says what this
                     workload IS ends by saying what is live on it, and the Deployment
                     settings that published it nest one level inside that
                     (../../components/workload/DeploymentFooter.vue).

                     It was an "Active Deployment" band at the top of this tab, then a card
                     beside the topology. Both asked the reader to hold two objects where
                     there is one. -->
                <template #footer>
                  <DeploymentFooter
                    :deployment="currentDeployment"
                    :settings="workloadSettings"
                    :email="userEmail"
                  />
                </template>
              </WorkloadSummary>

              <!-- SHIP TO PRODUCTION — what this page is FOR on the day the workload is
                   made: the create provisioned a live chain on a generated hostname, and
                   these are the three gates between that and production. It sits above the
                   topology because it is about what the workload is NOT yet; everything
                   below reports what it already is.
                   The band itself is a glance — a count and one labelled line per step —
                   and the sentence arguing for each one lives behind the expand control on
                   its header (../../components/page/ProductionChecklist.vue). The
                   `description` below is that drawer's lead line; the band has no room for
                   it, which is the reason for the split. -->
              <ProductionChecklist
                :steps="productionSteps"
                description="The create put this workload live on a generated hostname. These are the gates between that and production."
                @action="onChecklistAction"
              />

              <!-- Deployment Topology — its own band, with the same anatomy as the two
                   around it: a small PageHeading over a flush CardBox at the group gap.
                   It used to be an Accordion tucked under the Active Deployment band's
                   fact grid, which cost it twice: a whole subsystem read as a DETAIL of
                   that card, and the accordion trigger had to grow its own heading-xxs
                   title to name it, competing with the PageHeading above. As a band it is
                   named once, by the same component every other band uses, and it sits at
                   the section gap as the peer of Version History. No
                   accordion: the bands around it do not fold, and a section that names
                   itself does not need a second control to reveal it. -->
              <div
                ref="topologyRef"
                class="flex flex-col gap-(--layout-group-gap)"
              >
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
                    <!-- The two controls that act on the LISTING rather than narrow it.
                         Download CSV reaches the table through the shared component
                         that owns it (it forwards `exportCsv`), since the table itself
                         is one level down. No Columns button on this level: the shared
                         table's column set is the same everywhere and the page does not
                         hoist a picker for it. -->
                    <RefreshButton
                      :loading="loading"
                      @refresh="refresh"
                    />
                    <ExportButton
                      :table="versionsTableRef"
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
                      ref="versionsTableRef"
                      v-model:search="deploySearch"
                      v-model:filters="deployFilters"
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
                    <!-- The two controls that act on the LISTING rather than narrow it.
                         Download CSV reaches the table through the shared component
                         that owns it (it forwards `exportCsv`), since the table itself
                         is one level down. No Columns button on this level: the shared
                         table's column set is the same everywhere and the page does not
                         hoist a picker for it. -->
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

    <!-- ADD A CUSTOM DOMAIN — the same drawer the create flow uses for it
         (../../components/workload/AddDomainDrawer.vue), not a second form asking the
         same question in different words. A drawer and not a page because adding a domain
         happens INSIDE a resource that already exists. -->
    <AddDomainDrawer
      v-model:open="addDomainOpen"
      @save="addDomain"
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
