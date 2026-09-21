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
  //  - Settings: General (name + Active), Domains, Advanced Settings and a Danger Zone
  //    holding the delete, committed as ONE page from the shared save bar
  //    (ui/SettingsSaveBar.vue) like every settings surface here. The summary card used to
  //    close its address strip with an overflow menu carrying Clone and Delete; both are
  //    gone — delete is a Danger Zone row, and cloning is a LIST act.
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
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { consoleDeployRowsFor } from '@shared/lib/azion-deploys'
  import { deploymentRowsFor } from '../../lib/data/deployment-history'
  import {
    demoDeployment,
    findDeploymentByWorkload,
    provisionedDeployRow,
    resourceChain
  } from '../../lib/data/provisioning'
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
  import AppLayout from '../../components/shell/AppLayout.vue'
  import AddEnvironmentDrawer from '../../components/workload/AddEnvironmentDrawer.vue'
  import DeployDrawer from '../../components/workload/DeployDrawer.vue'
  import DeploymentFooter from '../../components/workload/DeploymentFooter.vue'
  import TopologyBindControl from '../../components/workload/TopologyBindControl.vue'
  import TopologyBindNode from '../../components/workload/TopologyBindNode.vue'
  import TopologyNodeCard from '../../components/workload/TopologyNodeCard.vue'
  import WorkloadDeploymentSettingsSection from '../../components/workload/WorkloadDeploymentSettingsSection.vue'
  import WorkloadDomainsSection from '../../components/workload/WorkloadDomainsSection.vue'
  import WorkloadMutualAuthSection from '../../components/workload/WorkloadMutualAuthSection.vue'
  import WorkloadProtocolSection from '../../components/workload/WorkloadProtocolSection.vue'
  import WorkloadSummary from '../../components/workload/WorkloadSummary.vue'
  import { useListRefresh } from '../../lib/behavior/list-state'
  import { useTabEnter } from '../../lib/behavior/tab-enter'
  import { createResourcePath } from '../../lib/data/create-resources'
  import { AZION_DEFAULT_ID } from '../../lib/data/deployment-strategies'
  import { deploymentFilterFields } from '../../lib/data/deployments'
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
  import { connectEnvironment, environmentsFor } from '../../lib/state/workload-environments'
  import { bindWorkloadSettings } from '../../lib/state/workload-settings'

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

  // THE FIRST NODE OF THE CHAIN. A request starts at a hostname, not at a workload, so
  // that is where the diagram starts — the same node the platform's own topology opens
  // on (console-kit's `DeploymentTopologySection`). The header names the address traffic
  // actually arrives on (a custom domain once there is one, the generated hostname until
  // then) and counts the rest; the body lists every one of them, copyable, and the full
  // table stays on the Settings tab.
  //
  // It reads the SAVED list (`savedDomains`, below), not the Settings tab's form value:
  // the Overview reports what was committed, the same split the `active` switch has.
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

  // --- Application-level bindings -------------------------------------------
  // One node per bindable slot, in whichever of its four states it is: live, staged to
  // change, staged to be taken away, or open. `deployed` is what a deploy has published
  // (absent = the chain's own node answers); `staged` is what has been picked but not
  // deployed yet.
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

    // WHAT THE READER MAY TAKE AWAY, and it depends on how this workload was made. A
    // connector the CREATE provisioned is the application's origin — that flow chose it,
    // and an application whose origin is gone routes nowhere — so it can be re-pointed
    // but not emptied. A connector bound HERE is this page's own, and a pick that has
    // not been deployed yet is always discardable.
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

  // The diagram, level by level, in the order a request travels it — the same chain the
  // platform's own topology draws (console-kit's `DeploymentTopologySection`), level for
  // level, so a reader moving between the two reads one diagram:
  //
  //   Domains → Workload → Firewall → [Application + Custom Page] → Cache → Connector →
  //   Storage
  //
  // THE FIREWALL IS ITS OWN LEVEL, and it is NOT terminal: traffic reaches the
  // application THROUGH it, so it is a step of the chain whether it holds a resource or
  // is still an open slot.
  //
  // THE CUSTOM PAGE shares the application's column and IS terminal — a connector
  // reaches it and nothing flows onward from it. A provisioned firewall goes through the
  // SAME node as a bound one, so a create that asked for protection fills the slot
  // instead of adding a second firewall beside it.
  //
  // Seven levels do not fit the content column at their 13.5rem floor, so the band
  // scrolls sideways — the CardBox around it carries `overflow-x-auto` for exactly that,
  // and the platform's own topology scrolls for the same reason.
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

  // --- Deployment settings --------------------------------------------------
  // WHAT THIS WORKLOAD DEPLOYS WITH. A Deployment setting IS the strategy a deployment
  // applies (../../lib/data/deployment-strategies.js), so this reads the one store the
  // Deployments module authors into and the release composer deploys from, through the
  // same projection (`deploymentSettings` in ../../lib/data/releases.js). No fixture:
  // a setting created in that drawer appears here, and one deleted there leaves.
  //
  // ONE SETTING PER ENVIRONMENT — a deployment applies exactly one (`strategy` is an
  // object in the request body, not a list), so a release is 1:1 with a setting. A
  // workload having several settings is a workload having several ENVIRONMENTS, each
  // with its own current deployment. `environmentsForWorkload` is that pairing, and the
  // Deploy button above pins the composer to the same ids.
  const environments = computed(() => environmentsFor(workloadId))

  // WHICH ENVIRONMENT THE CARD REPORTS. Production leads (it is index 0 of the pairing),
  // and the card's selector moves it — the same control console-kit puts on this card,
  // for the same reason: everything under it (the live deployment, the setting that
  // published it) is a fact ABOUT an environment, so there has to be one selected.
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

  // NEVER EMPTY. A workload always deploys with a Deployment setting — that is the
  // platform's rule, not this page's presentation choice: Azion Default is applied to
  // anything that binds nothing of its own. So if the setting this workload was paired
  // with has since been deleted from the store, it falls back to that one rather than
  // reporting a workload that deploys with nothing, which cannot exist.
  const workloadSetting = computed(
    () =>
      settingsById(activeEnvironment.value?.settingsId) ?? settingsById(AZION_DEFAULT_ID) ?? null
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
  // The custom domains this page adds are page-local, exactly like `staged` above: the
  // topology's bind slots do not survive a reload either, and one of the two persisting
  // while the other did not would be the confusing half-measure.
  //
  // THIS IS THE SAVED LIST, not the edited one. The Settings tab holds the domains as a
  // form value (`settings.domains`), so adding, editing and removing one are pending
  // edits the page's save bar commits — like every other field on that tab. What the
  // Overview reports is what was COMMITTED, the same split the `active` switch already
  // has below: a checklist that ticked on a typed value would be reporting an edit as a
  // fact.
  const savedDomains = ref([])
  const addDomainOpen = ref(false)

  // The row the drawer is EDITING, or `null` when it is adding. One drawer for both:
  // editing a domain is adding one with the answers already in the fields
  // (../../components/workload/AddEnvironmentDrawer.vue).
  const editingDomain = ref(null)

  // WHICH DOOR THE READER CAME THROUGH. One form adds a domain and the environment it
  // answers in — they are one act — but it is entered from two places that name it
  // differently: the card's environment picker asks for an environment, the Custom domains
  // field and the checklist ask for a domain. The form is the same; only its title and its
  // commit verb follow the entry, so neither reader is answered in someone else's words.
  const addIntent = ref('domain')

  const openAdd = (intent) => {
    editingDomain.value = null
    addIntent.value = intent
    addDomainOpen.value = true
  }

  // The same drawer, opened on a row. The row is passed by VALUE — a live reference would
  // let the form's own reset write through to the table behind it.
  const editSettingsDomain = (id) => {
    const entry = settings.domains.find((domain) => domain.id === id)
    if (!entry) return
    editingDomain.value = { ...entry }
    addIntent.value = 'domain'
    addDomainOpen.value = true
  }

  // The firewall is done EITHER WAY it can be there: bound here on the topology, or
  // provisioned with the chain by a create that asked for protection
  // (../applications/CreateApplication.vue). Reading only what this page bound would show
  // the step as pending on a workload that has had a firewall since the day it was made.
  const boundFirewall = computed(() => deployedResource('firewall')?.name ?? '')

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
      done: savedDomains.value.length > 0,
      // The FACT, not the verdict: a reader coming back to a done step is checking WHICH
      // domain it ended up on.
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

  // The band is a POINTER, not a second place to configure things: every step but the
  // domain is already answerable on this page, so pressing one takes the reader to that
  // control and opens it rather than growing a parallel form beside it. The domain has no
  // control here, so it gets the drawer the create flow already uses for it
  // (../../components/workload/AddEnvironmentDrawer.vue) — one surface for adding a domain,
  // not two that can disagree.
  const topologyRef = ref(null)

  const onChecklistAction = (step) => {
    if (step.id === 'domain') {
      openAdd('domain')
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

  // THE DRAWER STAGES; THE SAVE BAR COMMITS. A domain is a Settings field like the name
  // and the protocols beside it, so the form's commit is the page's commit — one bar, one
  // Save, one set of unsaved changes to discard. The drawer used to write straight into
  // the list, which left the one part of that tab nothing could undo and nothing could
  // see as pending.
  //
  // IT IS AN UPSERT, keyed on the row's own id: the drawer returns the id it was opened
  // with, so an edit replaces IN PLACE (the row does not jump to the bottom of the table
  // the reader was just reading) and an add appends.
  //
  // ADDING FROM THE OVERVIEW LANDS ON SETTINGS. The bar is gated to that tab, so a domain
  // staged from the production checklist or the summary card would otherwise be pending
  // with nothing on screen offering to save it. The page already does this after a deploy
  // (`onDeployed` switches to Deployments) — the reader is taken to the surface where the
  // thing they just did now lives.
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

  // --- Removing a domain ----------------------------------------------------
  // A CONFIRMATION, NOT A TYPE-THE-NAME GUARD (../../components/list/ConfirmDialog.vue).
  // The row is a pending edit until the bar commits, so the page's own Discard is already
  // the undo; DeleteDialog's phrase guard is for destroying something stored, and using it
  // here would be friction that teaches people to click through guards.
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

  // The Dropdown emits the option's VALUE, which is the resource's id — the slot's own
  // options are what turn it back into the name the node shows.
  //
  // A pick is STAGED, not applied: nothing reaches traffic until a deploy carries it.
  // Picking the resource that is already live drops the staged pick instead of staging a
  // no-op.
  const bindResource = (slotKey, id) => {
    const option = bindTargetOptions(slotKey).find((entry) => String(entry.value) === String(id))
    if (!option) return

    const live = deployedResource(slotKey)
    if (live && String(live.id) === String(option.value)) {
      delete staged[slotKey]
      return
    }

    staged[slotKey] = { id: option.value, name: option.label }
    // The slot the user just filled opens, so the node shows what it now holds
    // instead of closing back into the chain the moment it stops being empty.
    openNodes[slotKey] = true
    toast.info(`${option.label} staged on ${workload.value.name}`, {
      description: stagedMessage(slotKey)
    })
  }

  // Removing is two acts, told apart by what is under the node: over a staged pick it
  // discards the pick, over a live resource it stages the removal.
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

  // A slot can also be filled with a resource that does not exist yet, and a firewall, a
  // custom page and a connector are all first-level resources — so the create is the
  // module's own create PAGE, not a drawer grown here (../../lib/behavior/surfaces.js).
  // The workload travels in `?from=` with its name, so Cancel and a finished create both
  // land back on this page rather than on a module list the reader was not in
  // (../../lib/behavior/create-origin.js).
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
  // Every row on THIS page belongs to the workload the page is about, so the shared
  // table's Workload column would repeat one value down the whole list. The module
  // list is the surface that spans workloads and needs it; here it is hidden, through
  // the same column-visibility model the Columns button drives — so it is switched
  // off, not removed, and the two placements still render one table shape.
  const deployColumns = ref({ workloadName: false })

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

  // --- Delete ---------------------------------------------------------------
  // ARMED FROM THE SETTINGS TAB'S DANGER ZONE, and from nowhere else. It used to be a row
  // in an overflow menu on the summary card, which is how the Workloads LIST offers it —
  // right there, because a list is where a reader picks which workload. Inside the
  // workload there is only one, and the act that cannot be taken back is read with the
  // sentence that says what it costs rather than found by opening a menu.
  //
  // The row arms the shared confirmation rather than acting: a workload is the hostname
  // traffic arrives on, and what goes with it is every deployment it has published.
  const deleteOpen = ref(false)

  const requestDelete = () => {
    deleteOpen.value = true
  }

  const confirmDelete = () => {
    toast.success(`${workload.value.name} deleted`)
    router.push({ path: '/workloads', query: { email: userEmail.value } })
  }

  // ── Deploy ────────────────────────────────────────────────────────────────
  // Deploying opens a DRAWER over this page (../../components/workload/DeployDrawer.vue),
  // the surface console-kit's own workload page uses. It used to route to the release
  // composer (../deployments/ReleaseComposer.vue), which is still the composer for a
  // release started from the Deployments module — a first-level act that earns a page.
  // From inside a workload it is not: the thing being judged is the set of picks staged
  // on the topology behind the panel, and a page throws that context away to re-ask what
  // this one already answers. That is the console's own surface rule
  // (../../lib/behavior/surfaces.js § in-resource).
  //
  // A deploy is what makes a binding real, so it is also what empties the staged set.
  // It runs on the drawer's `deployed`, not on its open: a reader who backs out of the
  // panel still has every pick waiting.
  const applyStaged = () => {
    for (const [key, pick] of Object.entries(staged)) {
      deployed[key] = pick.removed ? null : { id: pick.id, name: pick.name }
      delete staged[key]
    }
  }

  const deployOpen = ref(false)

  const liveBindings = computed(() =>
    Object.fromEntries(BIND_TARGET_ORDER.map((key) => [key, deployedResource(key)]))
  )

  const openDeploy = () => {
    deployOpen.value = true
  }

  const onDeployed = () => {
    applyStaged()
    activeTab.value = 'deployments'
  }

  // A tab switch replaces a whole screen, so it arrives like one.
  const scrollRef = ref(null)
  const enterRef = ref(null)
  useTabEnter(enterRef, activeTab, scrollRef)

  const visit = () => toast.info('Opening the workload in a new tab.')

  // --- Settings ------------------------------------------------------------
  // `active` — the API's own field, and the one the Workloads list reads as Live /
  // Inactive. It is a SETTING, not an action: it is edited in the form and committed by
  // the page's save bar with everything else, exactly as an application's Active is
  // (../applications/panels/MainSettings.vue). Which is also why it is in General and not
  // in the Danger Zone below — switching a workload off stops traffic, and it is
  // reversible with the same switch; the Danger Zone is for what cannot be undone.
  const settings = reactive({
    name: workload.value.name,
    active: workload.value.status !== 'Inactive',
    // The custom domains, WITH the certificate each one is served with — the drawer asks
    // for it now, so the row carries it (../../components/workload/AddEnvironmentDrawer.vue).
    // It used to be a separate `certificates` map keyed by domain id, edited by a Select
    // inside the table: one domain's answers held in two places, which is one place too
    // many for them to agree.
    domains: [...savedDomains.value],
    deploymentSettings: {},
    protocols: workloadProtocolDefaults(),
    mtls: workloadMutualAuthDefaults()
  })

  const savingSettings = ref(false)
  // WHAT THE OVERVIEW REPORTS IS WHAT WAS SAVED, not what is typed. The Status fact on the
  // summary card is the workload's state, so it follows the commit — a card that flipped
  // to Inactive while the save bar still said "unsaved" would be reporting an edit as a
  // fact.
  const activeSaved = ref(settings.active)
  const summaryWorkload = computed(() => ({
    ...workload.value,
    status: activeSaved.value ? 'Live' : 'Inactive'
  }))

  const settingsBaseline = ref(JSON.stringify(settings))
  const settingsDirty = computed(() => JSON.stringify(settings) !== settingsBaseline.value)

  // The generated hostname first — it is the address that exists before anything the
  // reader does — then the edits pending on the form, so the table is what the tab holds.
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

      // A DOMAIN BRINGS ITS ENVIRONMENT WITH IT, and the commit is where that happens.
      // The environment joins this workload's list (linked to the Deployment Settings its
      // policy matches — that link is automatic, ../../lib/state/workload-settings.js) and
      // the card SELECTS the last one, so the Overview is already reporting what the new
      // domain publishes with by the time the bar clears.
      //
      // Connecting is idempotent, so re-saving a tab whose domains did not change is a
      // no-op rather than a duplicate.
      for (const domain of settings.domains) {
        const environment = connectEnvironment(workloadId, domain.environment)
        selectedEnvironment.value = environment.name
      }
      savedDomains.value = settings.domains.map((domain) => ({ ...domain }))

      settingsBaseline.value = JSON.stringify(settings)
      activeSaved.value = settings.active
      toast.success(
        settings.active ? 'Workload settings saved.' : 'Workload settings saved. It is now inactive.'
      )
    } finally {
      savingSettings.value = false
    }
  }
  // A page-level commit owes a way out that is not undoing each field by hand.
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

             The label is the one every Deploy in the console carries. It read "New
             Deployment" while a second, smaller deploy form existed to contrast with. -->
        <template #actions>
          <!-- What the deploy would carry, on the control that resolves it. -->
          <Tag
            v-if="stagedCount"
            severity="warning"
            size="small"
            :label="`${stagedCount} ${stagedCount === 1 ? 'change' : 'changes'}`"
          />
          <Button
            label="Deploy"
            kind="primary"
            size="medium"
            icon="pi pi-cloud-upload"
            @click="openDeploy"
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

                   IT GOES IN WITH THE SAVED `active`, not with the record's own status:
                   the Settings tab owns that switch, and the Status fact here is what it
                   committed.

                   Both of the card's actions are the PAGE's: `visit` opens the address,
                   `add-domain` opens the same drawer the checklist's own domain row opens
                   — one surface for adding a domain, not two that can disagree. The card's
                   environment picker raises that same `add-domain`: connecting a domain is
                   how an environment gets onto a workload, so the picker's action row and
                   the Custom domains field are two ways into one form.

                   IT SITS IN THE COLUMN, not in a row beside the checklist. The two were
                   tried side by side at a common height, and the pairing cost more than the
                   vertical space it saved: the summary carries less than the checklist, so
                   it spent a third of its height on nothing, and half a column squeezed the
                   strip into two lines and the fact row into columns too narrow for their
                   own labels. Full width, each says its piece once. -->
              <WorkloadSummary
                v-model:environment="selectedEnvironment"
                :workload="summaryWorkload"
                :custom-domains="savedDomains"
                :environments="environments"
                @visit="visit"
                @add-domain="openAdd('domain')"
                @add-environment="openAdd('environment')"
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
                    :setting="workloadSetting"
                    :workload-id="String(workload.id)"
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
                  class="overflow-x-auto bg-(--bg-surface-raised)"
                >
                  <template #content>
                    <!-- The chain traffic travels, left to right: Domains → Workload →
                         Firewall → [Application + Custom Page] → Connector → Storage
                         (`topologyLevels`). Every node is the same card
                         (ui/TopologyNode.vue): the header names the node and its status,
                         the row under it names the resource and carries its controls,
                         and only the FIELDS sit behind the disclosure — so the diagram
                         reads as one system instead of bespoke boxes, and an unbound
                         slot is that same card, dashed, with the bind control where
                         every other node's controls are. Every node arrives CLOSED
                         (`openNodes`), and a closed node still says what it is and what
                         can be done to it, which is what keeps the chain legible
                         collapsed and the band short on arrival.
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
                        class="min-w-[14rem] flex-1"
                      >
                        <!-- `terminal` marks a node that receives an incoming connector
                             and originates none — the Custom Page, which nothing flows
                             onward from, and the Connector when the chain provisioned
                             nothing after it. -->
                        <Flow.Node
                          v-for="node in level.nodes"
                          :key="node.key"
                          unstyled
                          :terminal="Boolean(node.terminal)"
                          class="w-full"
                        >
                          <!-- Empty node: the slot is open, so the card carries the
                             bind control and nothing else. -->
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
                            <!-- The node's controls, on its identity row beside the name
                               — a bindable slot can be re-pointed and (unless the create
                               provisioned it) emptied; the Domains node adds another
                               address through the drawer the checklist and the Domains
                               field already open. The provisioned chain carries neither. -->
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
                        <!-- ACTIVE — the row an application's Main Settings carries too, in
                             the same band and with the same control, because it is the same
                             field. The description says what switching it off DOES: a
                             workload is an address, so the thing that stops is traffic to
                             it, and its domains stop answering with it. `kind="compact"`
                             for the same reason every switch row in the console takes it —
                             the control is 20px tall and does not need a form row's
                             height. -->
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
                  <WorkloadDomainsSection
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
                  hint="Deployment Settings, protocols and mutual authentication. Most workloads never change these."
                >
                  <!-- The bands inside the disclosure are SECTIONS, the same component
                       and the same anatomy as the ones outside it: title, Hint, flush
                       card. A nested band that titled itself differently read as a
                       fourth kind of heading on a page that already has three. -->
                  <div class="flex min-w-0 flex-col">
                    <Section
                      stacked
                      anchor
                      :divided="false"
                      title="Deployment Settings"
                      hint="Which shared configuration each of this workload's environments publishes with. The link is automatic, by deployment policy."
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

                <!-- Danger Zone — titled like every band above it. What marks it as
                     destructive is the `kind="danger"` Button, not a recoloured title.

                     THIS IS WHERE DELETE LIVES. It was a row in the summary card's overflow
                     menu, and it is the one act on this page that cannot be taken back —
                     found by opening an ellipsis, with nothing beside it saying what goes
                     with the workload. Here it is read as a sentence before it is a button,
                     and it still arms the confirmation rather than acting. -->
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

    <!-- ADD AN ENVIRONMENT / ADD A DOMAIN — ONE form, because it is one act: an
         environment reaches this workload when a domain answers in it
         (../../components/workload/AddEnvironmentDrawer.vue). Three ways in — the card's
         environment picker, its Custom domains field, the production checklist row — and
         `intent` is only which of the two names the reader used on the way. A drawer and
         not a page because it happens INSIDE a resource that already exists; the
         environment that does not exist yet is made in a SECOND drawer over this one,
         without losing what has been typed. -->
    <AddEnvironmentDrawer
      v-model:open="addDomainOpen"
      :intent="addIntent"
      :environments="environments"
      :domain="editingDomain"
      @save="stageDomain"
    />

    <!-- REMOVING A DOMAIN — a confirmation, because the row is gone from the table the
         moment it is answered and the address is what traffic arrives on. It is not the
         type-the-name guard: the removal is a pending edit until the save bar commits it,
         so Discard is already the undo (../../components/list/ConfirmDialog.vue). -->
    <ConfirmDialog
      v-model:open="removeDomainOpen"
      title="Remove domain"
      :description="`${removingDomain?.domain ?? 'This domain'} stops answering for this workload once you save. Traffic already pointed at it gets no response.`"
      confirm-label="Remove Domain"
      @confirm="confirmRemoveDomain"
    />

    <!-- DEPLOY — the drawer console-kit opens from its own workload page
         (../../components/workload/DeployDrawer.vue), not the release composer page.
         Deploying is a step inside a resource that already exists, and what the reader
         has to judge — the picks staged on the topology behind it — is on this page.
         A page would throw that away to re-ask what this one already answers.

         It carries the staged set as its first band, so what the release adds, changes
         or takes away is read before it is sent, and `live` is what lets a pick over a
         bound slot read as a change rather than as an addition. -->
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

    <!-- DELETE, armed from the Settings tab's Danger Zone. The generic line would understate
         it: a workload is the hostname traffic arrives on, so what goes with it is every
         deployment it has ever published. -->
    <DeleteDialog
      v-model:open="deleteOpen"
      kind="Workload"
      :name="workload.name"
      description="The selected workload will be deleted, along with every deployment it has published. Traffic to its domains stops. Check the"
      @confirm="confirmDelete"
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
