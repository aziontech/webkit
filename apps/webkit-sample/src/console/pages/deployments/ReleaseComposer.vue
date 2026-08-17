<script setup>
  // Review and deploy — the release composer.
  //
  // ONE SCREEN, three questions, and they are asked in the order a reader can answer
  // them:
  //
  //   WHAT goes out    the deployment topology: one version of the Application, and
  //                    optionally a Firewall and a Custom Page, plus the dependencies
  //                    those three reference. Dependencies are DETECTED from the chosen
  //                    version, never re-asked.
  //   WHERE it lands   the Deployment settings. Those are the STRATEGIES authored in
  //                    ui/DeploymentSettingsDrawer.vue and listed by the Deployments
  //                    module's Settings tab — one store (src/lib/deployment-strategies.js),
  //                    projected by src/lib/releases.js. A setting is reusable, so this is a
  //                    multi-select, and what it BINDS is what the release carries versions
  //                    of.
  //   WHO it reaches   the impact: every environment, Workload and domain the selected
  //                    targets carry. This is what makes the deploy button honest, and
  //                    it is why the screen is a review rather than a form.
  //
  // WHY IT IS A PAGE AND NOT A DRAWER. A release is the one action in the console whose
  // blast radius is bigger than the thing being acted on: deploying one Workload can
  // touch three environments and dozens of domains. That review does not fit a panel, it
  // has to be linkable (a support thread quotes it), and it must survive a reload with
  // its entry context intact — which is why every scenario below is carried in the URL.
  //
  // THREE WAYS IN, plus the module's own, resolved from the query string (first match
  // wins). What separates them is how much is already settled:
  //
  //   from-workload    ?workload=…&deploymentIds=a,b[&pickTarget=true]
  //                    The operator hit Deploy on a workload. NOTHING is asked that the
  //                    workload already answers: its Deployment settings arrive selected
  //                    and the Application is seeded from what that workload is already
  //                    serving (src/lib/releases.js § releaseSeedForWorkload). One setting
  //                    means no picker at all; two means both selected, deselect to skip.
  //                    Landing ready to deploy is the point — the friction of re-picking a
  //                    target the operator did not come to change is what this removes.
  //   from-resource    ?scopedType=application&resourceId=…[&versionId=…]
  //                    The operator hit Deploy on a resource. Only that resource's version
  //                    changes; the other two are kept from the setting's own bindings and
  //                    their cards are read-only. The picker offers the settings that can
  //                    take it: bound to this application, or pinning none.
  //   global           nothing — from the Deployments module. The operator selects the
  //                    targets first, then composes.
  //
  // COPY follows the console microcopy standard, not the current console's strings: no em
  // dash, no ampersand, no parentheses in labels, sentence case, and the settled renames
  // (Deployment topology, not Composition. Include dependencies, not Additional
  // dependencies. Review and deploy, not Build and activate). Nothing here names a layout
  // position, because at 880px the two columns stack and "on the right" becomes false.
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
    BINDING_KEY,
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

  // ── Entry context (all of it from the URL, so a reload lands in the same place) ──
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

  // The picker is not rendered when the entry context settled the target: one setting, and
  // no invitation to change it. A picker holding one locked row asks a question that has no
  // answer.
  const targetSettled = computed(
    () => idsFromQuery.value.length === 1 && !pickTarget.value && !scopedType.value
  )

  // ── The targets ────────────────────────────────────────────────────────────
  // Everything the entry context named starts SELECTED. A Workload bound to three
  // environments is being deployed to three environments; making the operator re-select
  // what they just asked for would be a form, not a review.
  const selectedIds = ref([...idsFromQuery.value])
  const dsSearch = ref('')

  // Restricted to what the entry context named, when it named any: a workload publishes
  // with its own settings, and offering the other nine would invite a deploy into an
  // environment the operator never asked about.
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

  // Grouped by whether this release can land there at all (lib/releases.js). Empty groups
  // never render: a heading over nothing is noise.
  const dsGroups = computed(() => {
    const { groups } = classifyDeploymentSettings({
      settings: searchedSettings.value,
      // The application the release is for: the scoped one, else whatever the topology
      // composes. It decides which settings can take this release at all.
      applicationName:
        scopedType.value === 'application' ? scopedResourceId.value : state.application.resourceId
    })
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

  // An inactive setting cannot apply a deployment, and nothing on this screen can change
  // that: activating it belongs to the Settings tab that owns it, so the row links there.
  const onGroupAction = (key) => {
    if (key !== 'inactive') return
    router.push({ path: '/deployments', query: { email: userEmail.value, tab: 'settings' } })
  }

  // ── The topology ───────────────────────────────────────────────────────────
  // Seeded from what is ALREADY in place, because a release is an edit of what is live, not
  // a blank form. Two sources, in order:
  //
  //   the Deployment setting's own bindings  the firewall and the custom page it binds, and
  //                                          the application when it pins one
  //   what the workload is serving           the application from its current deployment,
  //                                          when the operator came from a workload
  //
  // Versions default to the tracking sentinel: the choice most releases want, and the one
  // that stays correct as new versions land.
  const seedId = computed(() => selectedIds.value[0] || idsFromQuery.value[0] || '')
  const seedSettings = computed(() => (seedId.value ? settingsById(seedId.value) : undefined))

  // The application the workload the operator came from is already serving. This is what
  // makes the workload entry frictionless: nothing to pick, nothing to confirm.
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
      const bound = seedSettings.value?.bindings[BINDING_KEY[type]] || ''
      const scoped = scopedType.value === type

      // Precedence: what the operator came to change, then what the workload already
      // serves, then what the setting binds, and only then a fallback for the one resource
      // a release cannot go out without.
      let resourceId = bound
      if (scoped) resourceId = scopedResourceId.value || bound
      else if (type === 'application') {
        resourceId = pinnedApplication.value || bound || catalogFor(type)[0]?.id || ''
      }

      state[type].resourceId = resourceId
      state[type].versionId =
        scoped && incomingVersionId.value ? incomingVersionId.value : LATEST_READY
      // A firewall or a custom page is included when the setting binds one (they are the
      // strategy's two NULLABLE attributes), or when it is what the operator came to change.
      state[type].enabled = type === 'application' ? true : scoped || Boolean(bound)
    })
  }

  // Dependency rows per parent. Detected rows are locked; the Include block is the
  // operator's own.
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

  // Every run takes a token. Only the LATEST run for a parent may write its answer, so a
  // superseded run (the operator changed the resource, or a retry overtook the first
  // attempt) is dropped instead of leaving a stale error over fresh rows.
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

    // One seeded resource fails its first detection, so the error state and its Retry are
    // states this screen renders rather than states it hopes never happen.
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

  // Re-detect whenever what a card composes changes.
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

  // ── Shared dependencies ────────────────────────────────────────────────────
  // A Connector referenced by both the Application and a Custom Page is ONE deployed
  // Connector: the platform cannot serve two versions of it in one release. So the row
  // says it is shared, and setting its version sets it everywhere it appears.
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
    // Propagate to every other parent referencing the same resource.
    DEPENDENCY_PARENTS.forEach((parent) => {
      if (parent === parentType) return
      ;(deps[parent][depType] ?? []).forEach((entry) => {
        if (entry.resourceId === row.resourceId) entry.versionId = versionId
      })
    })
  }

  // ── Include dependencies ───────────────────────────────────────────────────
  // What a Function reaches at runtime, which no detector can see. Only resources not
  // already in the release are offered: a second row for the same Connector would be two
  // version fields for one deployed thing.
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

  // What the block carries, on the card's header, so a card whose groups are collapsed still
  // says how much is inside it.
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

  // ── The cards the tree renders ─────────────────────────────────────────────
  // Every card renders, including the ones a scoped release does not change: seeing the
  // whole package that will be deployed is the point of a review. What changes is whether
  // a card is a DECISION (editable) or a FACT (read-only, kept from the active release).
  const cards = computed(() =>
    SINGLETON_TYPES.map((type) => {
      const readonly = Boolean(scopedType.value) && scopedType.value !== type
      const resourceId = state[type].resourceId
      const enabled = state[type].enabled && Boolean(resourceId)

      // Why a card is empty, in its own words. "Not included in this release." is only true
      // when the operator turned it off; a read-only card is empty because the setting binds
      // nothing there, or because no setting has been selected to read that from yet. Three
      // different facts, and one sentence for all three would be wrong in two of them.
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

  // The build affordance for a resource with no Ready version. The prototype does not
  // carry the build flows, so it names where the version is built instead of pretending
  // to open it — silence would be worse than a sentence.
  const onBuild = (type, resourceId) => {
    toast.info(`${resourceName(type, resourceId)} has no Ready version.`, {
      description: `Build one in ${resourceLabel(type)} and come back to this release.`
    })
  }

  // ── Impact ─────────────────────────────────────────────────────────────────
  // One lookup, retryable. It gates nothing: a preview that failed is a reason to say so,
  // never a reason to block a deploy.
  // TREE reads the hierarchy, NODES reads the connections. Tree leads because the question
  // a reader arrives with is "how far does this go", which a dense list answers in one
  // glance; the diagram is for tracing one setting's chain.
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

  // Setting → environment → workload → domains. The environment is the one the workload's
  // CURRENT deployment serves in, so the tree reports where a release actually lands rather
  // than a label invented for this screen.
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

  // The radius in one sentence — the line a reader repeats back to themselves before they
  // deploy. It lives in the Impact card's FOOTER: a card's footer is the region for a total,
  // and the sentence is true of both views, so it belongs to neither.
  const countOf = (count, singular, plural) => `${count} ${count === 1 ? singular : plural}`

  const impactSummary = computed(
    () =>
      `Routes ${countOf(impactTotals.value.domainsCount, 'domain', 'domains')} across ` +
      `${countOf(impactTotals.value.workloadsCount, 'workload', 'workloads')} in ` +
      `${countOf(impactTotals.value.settingsCount, 'Deployment setting', 'Deployment settings')}.`
  )

  // Whether there IS a total yet. Two things hang off it, and both are needed:
  //
  //   the slot list  the footer is supplied through a DYNAMIC slot name, so in a state with
  //                  nothing to total the slot is absent rather than empty. CardBox renders
  //                  its footer region whenever the slot exists, so a `v-if` inside the slot
  //                  would leave a bordered band with nothing in it.
  //   the card key   CardBox reads `slots.footer` in a computed, and a component's slots
  //                  object is not reactive — so a slot that appears after mount never
  //                  re-triggers that computed and the region stays unrendered. Keying the
  //                  card to this flag remounts it once when the impact resolves, which is
  //                  the only moment the answer changes.
  const impactHasTotal = computed(() => impactState.value === 'ready')
  const impactFooterSlots = computed(() => (impactHasTotal.value ? ['footer'] : []))

  const impactState = computed(() => {
    if (!selectedIds.value.length) return 'empty'
    return impactLoad.value === 'loading' ? 'loading' : 'ready'
  })

  // ── The deploy gate ────────────────────────────────────────────────────────
  // Every version decision the release carries, in one list, so the gate and the messages
  // read from the same source.
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

  // ONE blocker at a time, in the order the operator has to resolve them. Six competing
  // messages is no message.
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

  // ── Deploying ──────────────────────────────────────────────────────────────
  // This page is the console's ONE deploy surface, so it is also where a DEPLOYMENT is
  // opened. Deploying starts a real run (src/lib/deploy-runs.js) per workload each
  // selected Deployment setting publishes to: the row is in the Deployments module from
  // the first second, Building, `/deployments/:id` streams its pipeline, and the
  // workload's own history carries it. A release that left nothing behind but a toast
  // would be the only deploy in the console with no deployment.
  //
  // The runs also OUTLIVE this page, which is what lets a release into one Deployment
  // setting leave for the list immediately — the deploys keep going, and the list shows
  // them going. Several settings are watched here instead (./ui/DeployProgressDialog.vue),
  // because each activates independently and one failing does not roll the others back;
  // those runs are started with `notify: false`, since a toast per target would say what
  // the dialog is already saying, once per row.
  const confirmOpen = ref(false)
  const starting = ref(false)
  const progressOpen = ref(false)
  const retriedIds = ref([])

  // A WATCHED deploy settles faster than a backgrounded one: the dialog holds the screen
  // until every target has an answer, and the full pipeline is only bearable when the
  // operator has already moved on to something else.
  const WATCHED_TARGET_DURATION_MS = 9_000

  const selectedRecords = computed(() =>
    selectedIds.value.map((id) => settingsById(id)).filter(Boolean)
  )

  // The seeded failure (src/lib/releases.js § DEPLOY_FAILS_ONCE): one target already has a
  // deployment building, so it rejects the first attempt. It makes the failed row, its
  // sentence and Retry failed real, and the retry succeeds.
  const failsFirstAttempt = (settings) =>
    DEPLOY_FAILS_ONCE.has(settings.id) && !retriedIds.value.includes(settings.id)

  // The runs started for each target, held beside the setting they belong to. A setting no
  // workload deploys with starts nothing — that is the dialog's `skipped` row, said out
  // loud rather than passed off as a success.
  const targets = ref([])

  const runCountFor = (records) =>
    records.reduce((total, settings) => total + settings.workloads.length, 0)

  // The application this release deploys, in the shape the deployment record names it.
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

  // The dialog is a VIEW of the runs, not a second simulation of them: a row is deploying
  // for exactly as long as its deployments are, and it fails when one of them does.
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
    // The SAME deployment recovers — the row the operator is watching goes back to
    // Building rather than a second row appearing beside it.
    failed.forEach((target) => {
      target.runs.filter((run) => run.status === 'error').forEach((run) => redeployRun(run.id))
    })
  }

  // ONE target is watched from the list, SEVERAL are watched here. The dialog exists
  // because each Deployment setting activates independently and one failing does not roll
  // the others back — with a single target there is one outcome, so holding the operator
  // on this screen buys nothing the Deployments list does not already show live.
  const confirmDeploy = async () => {
    confirmOpen.value = false
    const records = selectedRecords.value
    const runCount = runCountFor(records)
    // Nothing started is also an outcome the operator has to see, and the list cannot show
    // it — there is no row to show. That case is reported here, as a skipped target.
    const watched = records.length > 1 || runCount === 0

    starting.value = true
    targets.value = records.map((settings) =>
      startTarget(settings, {
        durationMs: watched ? WATCHED_TARGET_DURATION_MS : RESOURCE_DEPLOY_DURATION_MS,
        // A run reports itself only when it is the ONLY thing running: one deployment, one
        // toast that becomes its own result. Beyond that the toasts would say the same
        // sentence three times, so the summary below (or the dialog) carries it instead.
        notify: !watched && runCount === 1
      })
    )

    if (watched) {
      starting.value = false
      progressOpen.value = true
      return
    }

    // The deployments are already Building and outlive this page, so the review has
    // nothing left to hold. The list is where they land.
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

  // Closing the progress dialog lands on the module that lists what just happened, but
  // only when every target succeeded: with a failure on screen, leaving would bury it.
  watch(progressOpen, (open) => {
    if (open) return
    const allDone = progressItems.value.every((item) => item.status === 'done')
    if (allDone && progressItems.value.length) {
      router.push({ path: '/deployments', query: { email: userEmail.value } })
    }
  })

  // ── Copy that depends on the scenario ──────────────────────────────────────
  const seedName = computed(() => seedSettings.value?.name || '')

  // What the entry context settled, said once, before the first control. The workload
  // variant names what was pinned FOR the operator, because a screen that quietly answers
  // things on your behalf has to say which things.
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
    { label: 'New release' }
  ])

  // Re-seeding follows the first target: the release being edited is the one serving
  // THERE, so changing which target leads changes what is being edited.
  watch(seedId, () => seedTopology(), { immediate: true })

  // Detection is NOT kicked off here: seeding the topology above already changes what each
  // card composes, and the per-type watchers run on that. Starting a second round here
  // raced the first, and the loser's error state outlived the winner's answer.
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
    <!-- The page owns its own vertical frame: the review scrolls, the action bar is
         pinned by the flex column rather than by `sticky`, so nothing paints through it
         mid-scroll. -->
    <main class="flex h-full min-h-0 flex-col">
      <section class="min-h-0 flex-1 overflow-auto">
        <!-- FOCUSED measure (`.layout-column-focused`, --container-4xl), not the data one.
             This is a focused flow: one task, composed then committed, and the reader's eye has
             to travel between the release on one side and what it reaches on the other. At the
             data measure (1620px) those two are a head-turn apart on a wide screen, which is
             exactly what the measure doctrine caps a focused flow for. Every band inside it —
             and the commit bar below — sits on the same measure, so the bar's buttons land on
             the content's own right edge. -->
        <div class="layout-column-focused layout-boundary flex min-w-0 flex-col">
          <PageHeading
            title="Review and deploy"
            description="Check the resources this release deploys and everything it reaches, then deploy it."
            size="medium"
          />

          <!-- TWO COLUMNS from `xl`, not `lg`: the split needs the focused measure at its
               full width, and below 1280px the shell's rail leaves the left column too narrow
               to hold a two-up field row. They stack below that, and the copy never names a
               side, because at that width there are no sides. -->
          <section
            class="layout-section-start grid min-w-0 gap-[var(--layout-section-gap)] xl:grid-cols-[minmax(0,1fr)_minmax(var(--container-xs),var(--container-sm))]"
          >
            <div class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
              <!-- WHAT goes out -->
              <CardBox>
                <template #header>
                  <span class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                    <i
                      class="pi pi-sitemap shrink-0 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                    <span class="truncate text-label-md text-[var(--text-default)]">
                      Deployment topology
                    </span>
                  </span>
                </template>

                <template #content>
                  <div class="flex min-w-0 flex-col gap-[var(--spacing-md)]">
                    <!-- Why this release looks the way it does. It comes before the
                         first control, never inside a label. -->
                    <Message
                      v-if="contextNotice"
                      severity="info"
                      size="small"
                      :label="contextNotice"
                    />

                    <!-- Detection failed: what broke, and the one action that fixes it.
                         The deploy gate reads the same fact, so the button is disabled
                         while this is on screen. -->
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

              <!-- WHAT THE DETECTOR CANNOT SEE — its own card, not a second half of the
                   topology's. These rows are not part of the topology: nothing above resolved
                   them, the operator is the one asserting they belong, and only they can be
                   removed. A divider inside one card said "same thing, later"; a card of its
                   own says what is true, which is "different thing".
                   Named "Include dependencies" because they are required for the deploy to
                   work; "additional" reads as optional, which is exactly wrong.
                   `padded="false"` for the same reason the nested Dependencies card is: the
                   accordion rows own their inset and their hover surface runs card-wide. -->
              <CardBox :padded="false">
                <template #header>
                  <span class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                    <i
                      class="pi pi-link shrink-0 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                    <span class="truncate text-label-md text-[var(--text-default)]">
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
                  <!-- Explain, then ask: what these rows are for comes before the control that
                       adds one. Padded by hand, since the card is flush for the rows below. -->
                  <p
                    class="px-[var(--spacing-md)] pt-[var(--spacing-sm)] pb-[var(--spacing-xs)] text-body-sm text-[var(--text-muted)]"
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

              <!-- WHERE it lands. The whole card is gone when the entry context settled the
                   target: a picker holding one locked row asks a question that has no answer,
                   and the notice at the top of the topology already names where this release
                   goes. -->
              <CardBox v-if="!targetSettled">
                <template #header>
                  <span class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                    <i
                      class="ai ai-deploy-pillar shrink-0 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                    <span class="truncate text-label-md text-[var(--text-default)]">
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

            <!-- WHO it reaches. Sticky while the release scrolls, because it is the thing the
                 operator checks against every change they make. It pins at the page's own top
                 inset (`--layout-boundary-start`) rather than at 0, so the pinned card keeps
                 the air it had before it stuck instead of butting against the scroll edge. -->
            <div class="min-w-0 xl:sticky xl:top-[var(--layout-boundary-start)] xl:self-start">
              <CardBox :key="impactHasTotal">
                <template #header>
                  <span class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                    <i
                      class="pi pi-bullseye shrink-0 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                    <span class="truncate text-label-md text-[var(--text-default)]">Impact</span>
                  </span>

                  <!-- The view switch belongs to the card, not to the content it switches: in
                       the header it stays visible and in one place whichever view is on. It is
                       offered only once there is something to draw — a switch over an empty
                       panel is two ways to see nothing.
                       The negative block margin is load-bearing: the control is 38px, taller
                       than the label row every other card header holds, so without it this one
                       header would sit 7px taller than the other six. It gives back its own
                       overflow so `min-h-14` decides the height here as it does everywhere. -->
                  <SegmentedButton
                    v-if="impactState === 'ready'"
                    v-model="impactView"
                    :options="IMPACT_VIEWS"
                    aria-label="Impact view"
                    class="shrink-0 -my-[var(--spacing-xxs)]"
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

                <!-- The total, as the card's closing statement. A Message rather than a line
                     of text: it is the one thing on this screen the operator is consenting
                     to, and `info` is the surface that says "this is what this adds up to"
                     without dressing it as a warning. -->
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

      <!-- The commit bar. The blocker is stated next to the button that is blocked, so a
           disabled control never leaves the reader guessing. -->
      <footer
        class="shrink-0 border-t-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface)]"
      >
        <div
          class="layout-column-focused layout-boundary-inline flex flex-col gap-[var(--spacing-sm)] py-[var(--spacing-md)] md:flex-row md:items-center md:justify-between"
        >
          <p class="text-body-sm text-[var(--text-muted)]">
            Deploying builds this release and puts it into traffic.
          </p>

          <div
            class="flex flex-col gap-[var(--spacing-sm)] md:flex-row md:items-center md:justify-end"
          >
            <p
              v-if="blocker"
              class="flex items-center gap-[var(--spacing-xs)] text-body-sm text-[var(--warning-contrast)]"
            >
              <Spinner
                v-if="detecting"
                class="size-4 shrink-0"
              />
              {{ blocker }}
            </p>
            <div class="flex items-center gap-[var(--spacing-sm)]">
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

    <!-- The confirmation repeats the verb and states the consequence in one sentence, so
         the reader can act on the button alone. -->
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
            <p class="text-body-sm text-[var(--text-default)]">{{ confirmBody }}</p>
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

    <!-- Several targets deploy independently, so the run is watched per target. -->
    <DeployProgressDialog
      v-model:open="progressOpen"
      :items="progressItems"
      @retry="retryFailed"
    />
  </AppLayout>
</template>
