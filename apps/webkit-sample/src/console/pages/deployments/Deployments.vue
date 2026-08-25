<script setup>
  // Deployments — the Azion Console "Deployments" module. The app shell (single
  // sidebar + GlobalHeader with the module breadcrumb) comes from AppLayout; this
  // page renders only its content, in the shape every module list takes: a PAGE
  // HEADING over a CONTROLS HEADER (search + Filter) over a data-driven <Table>
  // living in a flush CardBox (../../components/page/PageHeading.vue,
  // ../../components/page/ControlsHeader.vue).
  //
  // Unlike Applications, this module carries TWO sub-pages behind nav tabs —
  // "All Deployments" (every deploy, from any resource) and "Settings" (the
  // STRATEGIES those deploys apply) — so the active tab is held in the URL (`?tab=`)
  // the way WorkloadDetail does it: reloadable and linkable. Those tabs are IN
  // CONTENT, under the heading: the full-bleed PageTabs bar is the bottom edge of the
  // page header and belongs to pages that carry no heading, so a page that names
  // itself puts its nav in the content instead (see the PageTabs doc comment). Each
  // tab brings its OWN controls row, because the two narrow different subjects, and
  // its own create action — in the heading, where the page's action lives — because
  // the two create different things:
  //
  //   Create release              → a real deploy. The same release page every resource
  //     opens (./ReleaseComposer.vue), the console's one deploy surface.
  //   Create Deployment Settings  → the strategy itself
  //     (ui/DeploymentSettingsDrawer.vue): which application, firewall and custom page a
  //     deployment binds, authored once and applied by deployments started anywhere.
  //
  // That split is the platform's own: Azion creates a deployment with one request,
  // `POST /workloads/{id}/deployments`, whose body is `{ name, active, current,
  // strategy }` — the strategy is the reusable half, the rest belongs to one deploy.
  // The Message above the tables is what says so on screen.
  //
  // Narrowing on both tabs is the FILTER BUTTON (list/FilterButton.vue) beside that
  // tab's search — the one shape every module list uses (the webkit-lists
  // skill), never a field/operator/value builder. The COLUMNS decide the fields on
  // each tab; they pre-filter `:data`, and the table sees only the rows that survive.
  //
  // The history tab's catalog is the SHARED one (`deploymentFilterFields` in
  // src/lib/deployments.js) — the same Status / Type / Environment / Author every
  // deployment surface narrows by — asked for `{ deployed: true }`, the window only a
  // cross-resource list needs. Being a first level, this page holds the state and
  // binds it into DeploymentsTable as models.
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import TabView from '@aziontech/webkit/tab-view'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { consoleDeployRows, deployRows } from '@shared/lib/azion-deploys'
  import { DEPLOYMENT_HISTORY } from '@shared/lib/deployment-history'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeploymentSettingsDrawer from '../../components/deployment/DeploymentSettingsDrawer.vue'
  import DeploymentsTable from '../../components/deployment/DeploymentsTable.vue'
  import ProductFirstUse from '../../components/home/ProductFirstUse.vue'
  import AuthorCell from '../../components/list/AuthorCell.vue'
  import ColumnsButton from '../../components/list/ColumnsButton.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import ExportButton from '../../components/list/ExportButton.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import LastModifiedCell from '../../components/list/LastModifiedCell.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../components/page/HeadingAction.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../../lib/behavior/filter-bar'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { useTabEnter } from '../../lib/behavior/tab-enter'
  import { FIT_COLUMN, TAG_COLUMN } from '../../lib/behavior/table-columns'
  import { DEPLOYMENT_COLUMNS } from '../../lib/data/deployment-columns'
  import {
    azionDefaultStrategy,
    bindingLabel,
    bindingPolicyLabel,
    removeStrategy,
    strategyStatusOptions,
    strategyTypeLabel,
    versionPolicyLabel,
    workspaceStrategies
  } from '../../lib/data/deployment-strategies'
  import { deploymentFilterFields } from '../../lib/data/deployments'
  import { productFirstUse } from '../../lib/data/product-empty-states'
  import { useSampleMode } from '../../lib/state/sample-mode'
  import { tenancyRows } from '../../lib/state/tenancy-scope'

  // The sample's EMPTY version: a deployment is the record of having shipped, so an
  // account that has shipped nothing has no history AND no strategies — which is why the
  // empty branch drops the tab bar too, rather than offering two tabs over nothing
  // (../lib/sample-mode.js, ./ui/ProductFirstUse.vue).
  const { accountEmpty } = useSampleMode()
  const firstUse = productFirstUse('deployments')

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // ── Tabs (URL-synced) ──────────────────────────────────────────────────────
  const tabs = [
    { value: 'all', label: 'All Deployments' },
    { value: 'settings', label: 'Settings' }
  ]
  const activeTab = computed({
    get: () => (tabs.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'all'),
    // Only a real tab is written to the URL. The tab bar can emit an empty value
    // while this page is being left behind, and writing that produced a bare
    // `&tab` on the URL of whatever page came next — visible now that a row
    // navigates to the deploy page instead of opening a drawer.
    set: (value) => {
      if (!tabs.some((tab) => tab.value === value)) return
      router.replace({ query: { ...route.query, tab: value } })
    }
  })

  // A TAB SWITCH IS A PAGE CHANGE, so it arrives like one — the same entrance the
  // detail shells give their tabs (../../lib/behavior/tab-enter.js).
  //
  // This page got none. AppLayout replays `animate-page-enter` keyed on `route.path`
  // and deliberately ignores the QUERY, because a filter or a carried email is the
  // same page answering differently and re-entering on every keystroke is noise. But
  // this page's tab IS the query (`?tab=`), so picking Settings swapped the controls
  // row and the entire table in one frame with nothing to say a different subject had
  // arrived — the one navigation in the app that still repainted silently.
  const enterRef = ref(null)
  useTabEnter(enterRef, activeTab)

  // ── All Deployments ────────────────────────────────────────────────────────
  // The statuses, resource types and environments come from src/lib/deployments.js
  // — the same vocabulary the workload's tables and the deployment page read, so a
  // status or a product tag can never mean two things in two places.
  //
  // `deployedAt` is the real instant — the date filter compares it and `date`
  // (the sortable, exportable display string) is derived from it by one
  // formatter, never hand-written per row (see src/lib/dates.js).
  //
  // `resourceId` is the deployed resource's real id: for an application it is the
  // id the Applications list uses, so the resource link lands on that detail page.
  const byNewest = (a, b) => b.deployedAt - a.deployedAt

  // The seeded population, the part a tenancy scope owns.
  const seededDeployments = computed(() =>
    [
      // The deployments whose whole `azion deploy` pipeline is recorded — which step
      // failed, which never ran. Every row opens `/deployments/:id`; these are the
      // ones that arrive there with a real pipeline to show (see `openDeployment`).
      // They are mapped by the module that owns those records
      // (src/lib/azion-deploys.js) and satisfy the same row contract as every row
      // beside them: the table cannot tell them apart.
      ...deployRows(),
      // The seeded history, shared with every workload's own Deployments tab
      // (src/lib/deployment-history.js). A workload page lists the rows whose
      // `workloadId` is its own — the same rows, filtered, never a second fixture.
      ...DEPLOYMENT_HISTORY
    ].sort(byNewest)
  )

  // A deploy started in THIS session — from here, or from any resource page — leads
  // the list and is never projected away: it is the operator's own, and it is still
  // moving (Building → Ready | Error), which is why this is a computed rather than a
  // list seeded once at mount.
  //
  // Switching account reloads the module (src/lib/tenancy-reload.js): both tabs show
  // skeletons while the new tenant's records arrive. A deployment belongs to the
  // account that made it, so the seed is projected through the account in scope
  // (src/lib/tenancy-scope.js).
  const allDeployments = computed(() =>
    [...consoleDeployRows(), ...tenancyRows(seededDeployments.value, 'deployments')].sort(byNewest)
  )

  // The SHARED catalog, asked for the Deployed window — the field only a
  // cross-resource list needs (src/lib/deployments.js). A getter for the Author
  // options: a deploy started in this session adds a person, and the field has to be
  // able to offer them without a reload.
  const deployFields = computed(() =>
    deploymentFilterFields(allDeployments.value, { deployed: true })
  )

  // A first-level page hoists its controls out of the table (see ui/ControlsHeader.vue)
  // and owns their state, binding the two models into DeploymentsTable. The rows are
  // passed unfiltered — the table applies the catalog itself, so the narrowing happens
  // in exactly one place whether the controls are hoisted or not.
  const {
    filters: deployFilters,
    search: deploySearch,
    loading,
    refresh
  } = useListFilters([], allDeployments)

  // The two tables the controls row drives — one per tab. Download CSV calls the DS's
  // own `exportCsv()` through them (../../components/list/ExportButton.vue); the
  // deployments one goes through the shared component, which forwards it.
  const deploymentsTableRef = ref(null)
  const settingsTableRef = ref(null)

  // Which columns are switched off, driven by the Columns button beside the filter
  // (../../components/list/ColumnsButton.vue). Only a HIDDEN column is ever recorded, so this
  // never has to be kept in step with the column model above.
  //
  // ID SHIPS OFF. It is the column an operator wants when they are quoting a resource
  // into a support thread or an API call, and almost never while scanning the list —
  // so it starts hidden and is one switch away. That is the whole point of the panel:
  // a column can be available without being in the way by default.
  const columnVisibility = ref({ id: false })

  // ── Settings (deployment strategies) ───────────────────────────────────────
  // What this tab lists is the `strategy` half of the one request Azion takes for a
  // deployment: which application, firewall and custom page it binds
  // (src/lib/deployment-strategies.js). A strategy is authored once here and applied
  // by deployments started from any resource page — which is the difference between
  // this tab's create action and the history tab's:
  //
  //   Create Deployment Settings  → a STRATEGY, reused across deployments
  //   Create release              → a real DEPLOY, applying one or more of those strategies
  //
  // AZION DEFAULT leads the list and is platform-owned: it binds whatever
  // application is being deployed and nothing else, it cannot be edited or deleted,
  // and it is exempt from the tenancy projection — it belongs to Azion, not to this
  // workspace. Every deploy falls back to it, so the flow can never dead-end on a
  // workspace with no strategies.
  //
  // The COLUMNS still decide this tab's fields, exactly as on the history tab —
  // Status is its one enumerable column, and Last Modified becomes the same relative
  // periods every other list offers. Type is a column but NOT a field: `default` is
  // the only strategy type the platform exposes, and a field with one option narrows
  // nothing.

  // The columns the CLI itself lists a workload's deployments by (`azion list
  // workload-deployment` prints ID · CURRENT · APPLICATION · FIREWALL):
  // what a strategy BINDS is the whole point of it, so the bindings are columns
  // rather than something you open a row to discover. Author and Last Modified are
  // ONE column, as in every other console list — the avatar identifies the person
  // (name on its tooltip) and the timestamp reads relative beside it (see
  // ui/LastModifiedCell.vue).
  const settingColumns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'type', header: 'Type', enableSorting: true, minWidth: TAG_COLUMN },
    { accessorKey: 'firewall', header: 'Firewall', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'customPage', header: 'Custom Page', enableSorting: true, minWidth: FIT_COLUMN },
    // The two routing policies the create drawer asks for. They are columns rather
    // than something a row has to be opened to discover, for the same reason the
    // bindings are: they are what one setting differs from the next by. Off by
    // default all the same — the bindings answer "what does this serve", which is
    // the question the list is scanned for; the policies answer "how", which is
    // read once, when a setting is chosen.
    {
      accessorKey: 'bindingPolicy',
      header: 'Binding policy',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    {
      accessorKey: 'versionPolicy',
      header: 'Version policy',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: TAG_COLUMN },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // The Settings tab's own visibility map. TWO tabs, two column models, two maps: they
  // list different subjects, so a column switched off on the history has no counterpart
  // here and sharing one map would have the two tabs hiding each other's columns by
  // accident (both carry `name`, `status` and `lastModified`).
  // The two policies ship OFF: eight columns plus the actions cell is more than the
  // width holds, and they are the pair a reader turns on deliberately (Columns) when
  // they are comparing how settings route rather than what they bind.
  const settingColumnVisibility = ref({ bindingPolicy: false, versionPolicy: false })

  const settingFilterFields = [
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: strategyStatusOptions,
      match: (setting, values) => values.includes(setting.status)
    },
    {
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      // The platform default has no last-modified instant of its own, so a date
      // window never narrows it away.
      match: (setting, values) => !setting.updatedAt || matchDate(setting.updatedAt, values)
    }
  ]

  // Azion Default leads and is never projected away: it is the platform's strategy,
  // not this workspace's, and it is the fallback every deploy needs. Only the
  // workspace's own strategies go through the tenancy projection.
  const allSettings = computed(() => [
    azionDefaultStrategy,
    ...tenancyRows(workspaceStrategies.value, 'deployment-settings')
  ])

  const {
    filters: settingFilters,
    search: settingSearch,
    visibleRows: filteredSettings
  } = useListFilters(settingFilterFields, allSettings)

  // ── Actions ────────────────────────────────────────────────────────────────
  // The two create actions of this module, and the whole difference between them:
  //
  //   Create release              → a DEPLOY. It binds a version of every resource and
  //     publishes it into one or more Deployment settings, opening a deployment per
  //     workload those settings reach. A page, not a drawer, because it is reviewed
  //     before it happens (./ReleaseComposer.vue) — and the SAME page every other Deploy
  //     in the console opens, only with nothing preselected here.
  //   Create Deployment Settings  → a STRATEGY (ui/DeploymentSettingsDrawer.vue), reused
  //     by deployments started anywhere.
  //
  // There is no second, smaller deploy form beside it. This module used to carry a "New
  // Deployment" drawer as well, so the same act had two shapes — a drawer that asked for
  // a workload and an application, and a page that reviewed what a release reaches — and
  // which one you got depended on where you clicked. One place, for every deployment
  // event.
  //
  // Neither routes to /deploy any more. That page is the Creation Center's template /
  // Git clone flow: it CREATES a chain (workload + application + connector + storage)
  // from a repository, which is a different action from deploying a resource that
  // already exists — and with no `?template=`, it silently opened whichever template
  // happened to be first.
  const settingsOpen = ref(false)
  const newSettings = () => {
    settingsOpen.value = true
  }

  const newRelease = () => {
    router.push({ path: '/deployments/releases/new', query: { email: userEmail.value } })
  }

  // This is the Settings TAB's own create action, and now the only one: a strategy is
  // authored here, on its own, and the release page picks from what this tab holds
  // (its target picker links back here rather than authoring a setting mid-release).
  const onStrategyCreated = (strategy) => {
    toast.success(`${strategy.name} created.`, {
      description: 'Deployments started from any resource can apply it.'
    })
  }

  // Every deployment opens its PAGE, whatever kind of record it is. It used to
  // split: the runs whose pipeline is recorded went to `/deployments/:id` and every
  // other row opened a read-only drawer — so the same click gave two different
  // depths of answer, and the shallower one closed on Escape and could not be linked
  // to or reloaded. A deployment is the thing people quote in a support thread, so it
  // gets a URL. The page resolves both families (lib/azion-deploys.js's
  // `deployPageRecord`) and renders the fields each one actually has.
  //
  // The VERSION id is the key, not `row.id`: it is the column this table shows and
  // the string a person copies, and for a recorded run it is the same value as its
  // own id — so one route covers both.
  const openDeployment = (event, row) =>
    router.push({
      path: `/deployments/${row.versionId}`,
      // The workload rides along for the same reason it does from a workload page: a
      // workload this sample does not seed has a derived history, and a row of it can
      // reach this list through a session deploy.
      query: {
        email: userEmail.value,
        workload: row.workloadId,
        workloadName: row.workloadName
      }
    })

  const onDeploymentAction = (event, value, row) => {
    if (value === 'details') {
      openDeployment(event, row)
      return
    }
    if (value === 'redeploy') {
      toast.info(`Redeploying version ${row.versionId}.`)
      return
    }
    toast.info(`Promoting version ${row.versionId} to Production.`)
  }

  // A Deployment setting is what releases bind to, so deleting one is felt by every
  // resource pinned to it — the menu click only arms the confirmation.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    // Azion Default is platform-owned; the menu does not offer this on its row, so
    // reaching here means the guard in the store is the one doing the work.
    if (removeStrategy(row.id)) toast.success(`${row.name} deleted`)
    pendingDelete.value = null
  }

  const onSettingAction = (event, value, row) => {
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    const copy = {
      edit: `Editing ${row.name}`,
      duplicate: `Duplicating ${row.name}`
    }
    toast.info(copy[value] ?? row.name, {
      description: `${strategyTypeLabel(row.type)} · Firewall: ${bindingLabel(row.firewall)} · Custom Page: ${bindingLabel(row.customPage)}`
    })
  }
</script>

<template>
  <AppLayout
    active="deployments"
    :breadcrumb="[{ label: 'Deployments' }]"
  >
    <!-- THE MEASURE FOLLOWS THE MODE, the shape every module list carries
         (../applications/Applications.vue): the populated list takes the STANDARD page
         container (`layout-column`, 1388px) because its columns ARE the content, and
         first use takes the FOCUSED one (1024px), where a lead and three rows would
         otherwise float at a width they do not read at.
         This page is `padded` again. It used to run `:padded="false"` so the full-bleed
         PageTabs bar could form the bottom edge of the header and only the region below
         it scrolled; with the tabs in-content there is no full-bleed element left, so the
         page takes the boundary from AppLayout and scrolls as one, like every other
         list. -->
    <main
      class="flex min-h-full flex-col"
      :class="accountEmpty ? 'layout-column-focused' : 'layout-column'"
    >
      <!-- THE PAGE HEADING. A first-level resource page names itself: the module name
           over one line saying what the module is, with the module's own action on the
           right. The breadcrumb says WHERE you are; the heading says WHAT this page is.
           `size="medium"` is the first-level list scale (components/page/PageHeading.vue).
           The ACTION rides here rather than on the tab row, and it still changes with the
           active tab — the two tabs create different things — because where a page's
           action sits is a property of the page, not of the tab: one fixed home above the
           content, whichever subject is showing. -->
      <PageHeading
        v-if="!accountEmpty"
        size="medium"
        title="Deployments"
        description="Track every release across your resources, and the settings those releases apply."
        :documentation="firstUse.learnMore.href"
      >
        <template #actions>
          <!-- The ONE way a deployment is created, here and everywhere else: the release
               composer (./ReleaseComposer.vue). From the module it opens with nothing
               settled — no Deployment setting and no scoped resource, so the operator
               selects the targets first and then composes (§ the `global` scenario);
               from a Workload or a resource the same page opens with that context in
               its URL. -->
          <HeadingAction
            key="button-0"
            v-if="activeTab === 'all'"
            label="Create release"
            kind="primary"
            icon="pi pi-cloud-upload"
            @click="newRelease"
          />
          <!-- The Settings tab creates a CONFIGURATION, not a deployment. -->
          <HeadingAction
            key="button-2"
            v-else
            label="Create Deployment Settings"
            kind="primary"
            icon="pi pi-plus"
            @click="newSettings"
          />
        </template>
      </PageHeading>

      <!-- FIRST USE, IN HOME'S CONTAINER: the same centred box every other module's
           empty version uses. A deployment is the record of having shipped, so an account
           that has shipped nothing has no history AND no strategies — which is why this
           branch drops the tabs too, rather than offering two tabs over nothing.
           CENTRED WITH AUTO MARGINS: `my-auto` asks the flex parent to split its free
           space above and below this one item, and collapses to 0 when the block is
           taller than the viewport instead of clipping its top. -->
      <div
        v-if="accountEmpty"
        class="my-auto flex w-full flex-col py-(--spacing-xl)"
      >
        <ProductFirstUse :product="firstUse" />
      </div>

      <!-- The page's parent section. It holds ONE section here: the tabs, the Message,
           the controls row and the table are all parts of the same band. The RHYTHM is
           the shared one — the page stack carries no vertical gap, the parent spaces its
           sections at --layout-section-gap, and each section spaces its own parts at
           --layout-group-gap (theme semantic/layouts § "THE PAGE SHAPE"). -->
      <section
        v-else
        class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)"
      >
        <!-- ONE section, at --layout-group-gap: the tabs choose the subject, the Message
             frames it, the controls row narrows it, the table is what all three are
             about. -->
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <!-- THE TABS, IN CONTENT. This module carries two sub-pages — "All Deployments"
               (every deploy, from any resource) and "Settings" (the STRATEGIES those
               deploys apply) — held in the URL (`?tab=`) so each is reloadable and
               linkable.
               They are a plain TabView here, NOT components/page/PageTabs.vue: that bar
               is the bottom edge of the page header, full-bleed and bordered, and it
               exists for pages that carry no heading because each tab heads itself. This
               page names itself, so the nav sits inside the content under the heading,
               with no border and no full-bleed inset — a different element, not that bar
               with a flag flipped (see the PageTabs doc comment). -->
          <TabView v-model:value="activeTab">
            <TabView.List>
              <TabView.Item
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                :label="tab.label"
              />
            </TabView.List>
          </TabView>

          <!-- Why Settings is a sibling of the history: a strategy is the reusable
               half of a deployment (which application, firewall and custom page it
               binds), so it is authored once and applied by many deployments. Note
               what it is NOT: a deployment belongs to exactly one workload — the
               workload is the path parameter of the request that creates it — so it
               is the STRATEGY that travels, never the deployment. -->
          <Message
            severity="info"
            size="small"
            closable
            label="Deployment Settings are the strategy a deployment applies: the application it binds, and optionally a firewall and a custom page. Author one here and every deployment started from a resource can apply it — Azion Default is the platform's own."
          />

          <!-- EVERYTHING THAT CHANGES WITH THE TAB, in one STABLE wrapper: the two
               controls rows, the two chip rows and the card that holds either table.
               `useTabEnter` replays the page entrance on it (never keyed — a key would
               re-mount the subtree, and the point is to animate the same element the
               swapped content arrives in).
               The bar and the Message stay OUTSIDE it. The bar is what you pressed, so
               animating it would say the navigation itself had changed; the Message
               states what a Deployment setting is, which is true on both tabs and did
               not change because you switched.
               It carries the group gap so the parts inside keep the rhythm they had as
               direct children of the section (theme semantic/layouts § THE PAGE SHAPE). -->
          <div
            ref="enterRef"
            class="flex min-w-0 flex-col gap-(--layout-group-gap)"
          >
            <!-- ── All Deployments controls ── -->
            <ControlsHeader
              v-if="activeTab === 'all'"
              key="controls-header-1"
            >
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
                <!-- THE RIGHT GROUP: the three controls that act on the LISTING rather
                     than narrow it — fetch it again, take it away as a file, choose
                     which columns it shows. Download CSV reaches the table through the
                     shared component that owns it (it forwards `exportCsv`), because
                     the table itself is one level down. -->
                <RefreshButton
                  :loading="loading"
                  @refresh="refresh"
                />
                <ExportButton
                  :table="deploymentsTableRef"
                  filename="deployments.csv"
                />
                <ColumnsButton
                  v-model="columnVisibility"
                  :columns="DEPLOYMENT_COLUMNS"
                />
              </template>
            </ControlsHeader>

            <FilterChips
              v-if="activeTab === 'all'"
              v-model="deployFilters"
              :fields="deployFields"
            />

            <!-- ── Settings controls ── -->
            <ControlsHeader
              v-else
              key="controls-header-2"
            >
              <FilterButton
                v-model="settingFilters"
                :fields="settingFilterFields"
              />
              <InputText
                v-model="settingSearch"
                size="medium"
                placeholder="Search settings"
                aria-label="Search deployment settings"
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
                  :table="settingsTableRef"
                  filename="deployment-settings.csv"
                />
                <ColumnsButton
                  v-model="settingColumnVisibility"
                  :columns="settingColumns"
                />
              </template>
            </ControlsHeader>

            <FilterChips
              key="filter-chips-2"
              v-if="activeTab !== 'all'"
              v-model="settingFilters"
              :fields="settingFilterFields"
            />

            <section class="flex min-h-0 flex-col">
              <CardBox :padded="false">
                <template #content>
                  <!-- ── All Deployments ── -->
                  <!-- The shared deployment table owns the columns and the cells; its
                   controls are hoisted into the page's ControlsHeader and filter row
                   above (`:controls="false"`), with their state bound back in as the
                   two models. It applies the catalog itself, so the narrowing happens
                   in one place whether the controls are hoisted or not. Page size is
                   the component's default, so every deployment table paginates and
                   reads the same. -->
                  <DeploymentsTable
                    v-if="activeTab === 'all'"
                    ref="deploymentsTableRef"
                    v-model:columnVisibility="columnVisibility"
                    v-model:search="deploySearch"
                    v-model:filters="deployFilters"
                    :deployments="allDeployments"
                    :fields="deployFields"
                    :email="userEmail"
                    :controls="false"
                    :loading="loading"
                    @row-click="openDeployment"
                    @action="onDeploymentAction"
                  />

                  <!-- ── Settings ── -->
                  <Table
                    v-else
                    ref="settingsTableRef"
                    v-model:globalFilter="settingSearch"
                    v-model:columnVisibility="settingColumnVisibility"
                    :data="filteredSettings"
                    :columns="settingColumns"
                    row-key="id"
                    enable-sorting
                    paginated
                    :page-size="10"
                    :border="false"
                    :loading="loading"
                  >
                    <!-- The platform's own strategy is marked as such: it is the one
                         row nobody in this workspace authored, and the one row the
                         actions menu offers nothing for. -->
                    <template #cell-name="{ value, row }">
                      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <span class="truncate">{{ value }}</span>
                        <Tag
                          v-if="row.system"
                          label="Azion"
                          severity="secondary"
                          size="medium"
                        />
                      </span>
                    </template>

                    <!-- The strategy TYPE — `default` is the only one the platform
                         exposes today, so the column reads the same down the list and
                         exists to say which kind of strategy this is at all. -->
                    <template #cell-type="{ value }">
                      <Tag
                        :label="strategyTypeLabel(value)"
                        severity="info"
                        size="medium"
                      />
                    </template>

                    <!-- The two nullable bindings, plain text: "Not bound" is the
                         common, unremarkable case and a Tag on every row would give
                         the absence of a firewall the weight of a status. -->
                    <template #cell-firewall="{ value }">
                      <span
                        class="truncate"
                        :class="value ? '' : 'text-(--text-muted)'"
                      >
                        {{ bindingLabel(value) }}
                      </span>
                    </template>

                    <template #cell-customPage="{ value }">
                      <span
                        class="truncate"
                        :class="value ? '' : 'text-(--text-muted)'"
                      >
                        {{ bindingLabel(value) }}
                      </span>
                    </template>

                    <!-- The policies read as their label, never as the stored token:
                         `strict` / `single` are the request body's words, not the
                         reader's. Both rows always have one, so neither cell has a
                         muted "not set" case the bindings above need. -->
                    <template #cell-bindingPolicy="{ value }">
                      <span class="truncate">{{ bindingPolicyLabel(value) }}</span>
                    </template>

                    <template #cell-versionPolicy="{ value }">
                      <span class="truncate">{{ versionPolicyLabel(value) }}</span>
                    </template>

                    <template #cell-status="{ value }">
                      <Tag
                        :label="value"
                        :severity="value === 'Active' ? 'success' : 'secondary'"
                        size="medium"
                      />
                    </template>
                    <!-- WHO and WHEN are two columns now, so each cell says one thing:
                         the face and the name here, the relative time next to it. -->
                    <template #cell-author="{ row }">
                      <AuthorCell
                        :author="row.author"
                        :avatar-src="row.authorAvatar"
                      />
                    </template>

                    <template #cell-lastModified="{ row }">
                      <LastModifiedCell :date="row.updatedAt || ''" />
                    </template>

                    <!-- The platform's strategy has no row actions: it cannot be
                         edited or deleted, and a menu whose every option is disabled
                         is worse than no menu. -->
                    <template #cell-actions="{ row }">
                      <Dropdown
                        v-if="!row.system"
                        placement="bottom-end"
                        @select="(event, value) => onSettingAction(event, value, row)"
                      >
                        <Dropdown.Trigger>
                          <Tooltip text="Row actions">
                            <IconButton
                              icon="pi pi-ellipsis-h"
                              kind="outlined"
                              size="small"
                              aria-label="Row actions"
                            />
                          </Tooltip>
                        </Dropdown.Trigger>
                        <Dropdown.Group>
                          <Dropdown.Option
                            value="edit"
                            label="Edit"
                          >
                            <template #left>
                              <i
                                class="pi pi-pencil"
                                aria-hidden="true"
                              />
                            </template>
                          </Dropdown.Option>
                          <Dropdown.Option
                            value="duplicate"
                            label="Clone"
                          >
                            <template #left>
                              <i
                                class="pi pi-clone"
                                aria-hidden="true"
                              />
                            </template>
                          </Dropdown.Option>
                        </Dropdown.Group>
                        <Dropdown.Group>
                          <Dropdown.Option
                            value="delete"
                            label="Delete"
                          >
                            <template #left>
                              <i
                                class="pi pi-trash"
                                aria-hidden="true"
                              />
                            </template>
                          </Dropdown.Option>
                        </Dropdown.Group>
                      </Dropdown>
                    </template>
                  </Table>
                </template>
              </CardBox>
            </section>
          </div>
        </section>
      </section>
    </main>

    <!-- Create Deployment Settings — the strategy, not a deployment. The Settings tab's
         own action; a second instance stacks over the release page's picker when that
         quick-add lands (two Drawers of the same z paint in mount order, so the child
         is on top without a z override). -->
    <DeploymentSettingsDrawer
      v-model:open="settingsOpen"
      @create="onStrategyCreated"
    />

    <!-- The generic line would read "settings … settings" here, and it would also
         understate the blast radius: what goes with a Deployment setting is every
         release bound to it. -->
    <DeleteDialog
      v-model:open="deleteOpen"
      kind="Deployment setting"
      :name="pendingDelete?.name ?? ''"
      description="The selected Deployment setting will be deleted, along with every release bound to it. Check the"
      @confirm="confirmDelete"
    />
  </AppLayout>
</template>
