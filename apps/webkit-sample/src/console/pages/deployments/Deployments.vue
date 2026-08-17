<script setup>
  // Deployments — the Azion Console "Deployments" module. The app shell (single
  // sidebar + GlobalHeader with the module breadcrumb) comes from AppLayout; this
  // page renders only its content, following the Applications.vue list pattern: a
  // CONTROLS HEADER (filter + search, the tab's own actions on the right) over a
  // data-driven <Table> living in a flush CardBox. No page heading — the module name
  // already IS the header breadcrumb crumb (see ui/ControlsHeader.vue).
  //
  // Unlike Applications, this module carries TWO sub-pages behind nav tabs —
  // "All Deployments" (every deploy, from any resource) and "Settings" (the
  // STRATEGIES those deploys apply) — so the active tab is held in the URL (`?tab=`)
  // the way WorkloadDetail does it: reloadable and linkable. Each tab brings its OWN
  // controls row, because the two narrow different subjects, and its own create
  // action, because the two create different things:
  //
  //   New release    → a real deploy. The same release page every resource opens
  //     (./ReleaseComposer.vue), the console's one deploy surface.
  //   New Settings   → the strategy itself (ui/DeploymentSettingsDrawer.vue): which
  //     application, firewall and custom page a deployment binds, authored once and
  //     applied by deployments started anywhere.
  //
  // That split is the platform's own: Azion creates a deployment with one request,
  // `POST /workloads/{id}/deployments`, whose body is `{ name, active, current,
  // strategy }` — the strategy is the reusable half, the rest belongs to one deploy.
  // The Message above the tables is what says so on screen.
  //
  // Narrowing on both tabs is a FILTER BAR of CHIPS (ui/FilterBar.vue) in its own row
  // under the controls — the one shape every module list uses (the webkit-lists
  // skill), never a field/operator/value builder. The COLUMNS decide the fields on
  // each tab; they pre-filter `:data`, and the table sees only the rows that survive.
  //
  // The history tab's catalog is the SHARED one (`deploymentFilterFields` in
  // src/lib/deployments.js) — the same Status / Type / Environment / Author every
  // deployment surface narrows by — asked for `{ deployed: true }`, the window only a
  // cross-resource list needs. Being a first level, this page holds the state and
  // binds it into DeploymentsTable as models.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
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
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import FilterBar from '../../components/list/FilterBar.vue'
  import LastModifiedCell from '../../components/list/LastModifiedCell.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import PageTabs from '../../components/page/PageTabs.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../../lib/behavior/filter-bar'
  import { useListFilters } from '../../lib/behavior/list-state'
  import {
    azionDefaultStrategy,
    bindingLabel,
    removeStrategy,
    strategyStatusOptions,
    strategyTypeLabel,
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
    loading: tenancyReloading
  } = useListFilters([], allDeployments)

  // ── Settings (deployment strategies) ───────────────────────────────────────
  // What this tab lists is the `strategy` half of the one request Azion takes for a
  // deployment: which application, firewall and custom page it binds
  // (src/lib/deployment-strategies.js). A strategy is authored once here and applied
  // by deployments started from any resource page — which is the difference between
  // this tab's create action and the history tab's:
  //
  //   New Settings   → a STRATEGY, reused across deployments
  //   New release    → a real DEPLOY, applying one or more of those strategies
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
  // workload-deployment` prints ID · CURRENT · EDGE APPLICATION · EDGE FIREWALL):
  // what a strategy BINDS is the whole point of it, so the bindings are columns
  // rather than something you open a row to discover. Author and Last Modified are
  // ONE column, as in every other console list — the avatar identifies the person
  // (name on its tooltip) and the timestamp reads relative beside it (see
  // ui/LastModifiedCell.vue).
  const settingColumns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true },
    { accessorKey: 'type', header: 'Type', enableSorting: true },
    { accessorKey: 'firewall', header: 'Firewall', enableSorting: true },
    { accessorKey: 'customPage', header: 'Custom Page', enableSorting: true },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

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
  //   New release  → a DEPLOY. It binds a version of every resource and publishes it
  //     into one or more Deployment settings, opening a deployment per workload those
  //     settings reach. A page, not a drawer, because it is reviewed before it happens
  //     (./ReleaseComposer.vue) — and the SAME page every other Deploy in the console
  //     opens, only with nothing preselected here.
  //   New Settings → a STRATEGY (ui/DeploymentSettingsDrawer.vue), reused by
  //     deployments started anywhere.
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
    :padded="false"
    :breadcrumb="[{ label: 'Deployments' }]"
  >
    <main class="flex h-full flex-col">
      <!-- First-level module list: no PageHeading — the module name already IS the
           header breadcrumb crumb (AppLayout). The NAV BAR leads (the same full-bleed
           PageTabs the detail pages use, since these two tabs are second-level nav —
           each is its own page in one route), and each tab's own ACTIONS ride on it,
           right-aligned: they act on the tab's subject, so they change with the tab
           while their position never does. Below it, the tab's CONTROLS row (search +
           selectors), then the table. -->
      <!-- FIRST USE, IN HOME'S CONTAINER: the same centred box every other module's
           empty version uses, at the FOCUSED measure (the list's own measure is the data
           one, 1620px, which a lead and three rows would float in). `:padded="false"`
           means this page carries its own boundary, so the container brings
           `layout-boundary` with it. -->
      <!-- The scroll region is a flex COLUMN here, unlike the populated branch's block
           one: `my-auto` on the box inside it can only centre when its parent has free
           space to distribute, and a block parent has none to give. -->
      <section
        v-if="accountEmpty"
        class="flex min-h-0 flex-1 flex-col overflow-auto"
      >
        <div
          class="layout-column-focused layout-boundary my-auto flex w-full flex-col py-[var(--spacing-xl)]"
        >
          <ProductFirstUse :product="firstUse" />
        </div>
      </section>

      <PageTabs
        v-else
        v-model:value="activeTab"
        :tabs="tabs"
      >
        <template #actions>
          <!-- The ONE way a deployment is created, here and everywhere else: the release
               composer (../ReleaseComposer.vue). From the module it opens with nothing
               settled — no Deployment setting and no scoped resource, so the operator
               selects the targets first and then composes (§ the `global` scenario);
               from a Workload or a resource the same page opens with that context in
               its URL. -->
          <Button
            key="button-0"
            v-if="activeTab === 'all'"
            label="New release"
            kind="primary"
            size="medium"
            icon="pi pi-cloud-upload"
            @click="newRelease"
          />
          <!-- The Settings tab creates a CONFIGURATION, not a deployment. -->
          <Button
            key="button-2"
            v-else
            label="New Settings"
            kind="primary"
            size="medium"
            icon="pi pi-plus"
            @click="newSettings"
          />
        </template>
      </PageTabs>

      <!-- Only this region scrolls, below the fixed bar; the page's own boundary and
           MEASURE sit on the block inside it, the shape every `:padded="false"` page
           carries (`.layout-column` — the DATA measure, 1620px). That block lands at
           the same inset and the same content width as a `padded` module list, because
           the measure classes widen their cap by the boundary they contain — see
           src/styles/layout.css § "THE BOUNDARY IS NOT PART OF THE MEASURE". Until
           that rule existed this list read 48px narrower than Workloads at the same
           viewport, the one module list in the console at its own width.

           This tab used to run full-bleed, on the argument that the Deployments
           tables are the module's widest (repo, domain, environment, author, two
           timestamps) and should take every pixel the viewport has. That bought a
           handful of pixels past 1620px and cost the thing the measure exists to
           protect: on an ultrawide, a row's actions ended up a head-turn from the
           version that identifies it — and it made this one list sit at a width no
           other list in the console uses.

           The RHYTHM is the shared one: the page stack carries no vertical gap, the
           parent section below the boundary spaces its sections at
           --layout-section-gap, and each section spaces its own parts at
           --layout-group-gap. Here the page is ONE section — the Message, whichever
           tab's controls row is showing, and the table are all parts of one band, so
           they sit at the group step with nothing at the section step. -->
      <section
        v-if="!accountEmpty"
        class="min-h-0 flex-1 overflow-auto"
      >
        <div class="layout-column layout-boundary flex min-w-0 flex-col">
          <!-- The page's parent section. It holds ONE section here: the Message, the
               controls row and the table are all parts of the same band. -->
          <section
            class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]"
          >
            <!-- ONE section, at --layout-group-gap: the Message frames the list, the
                 controls row narrows it, the table is what both are about. -->
            <section class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
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

              <!-- ── All Deployments controls ── -->
              <ControlsHeader
                v-if="activeTab === 'all'"
                key="controls-header-1"
              >
                <InputText
                  v-model="deploySearch"
                  size="large"
                  placeholder="Search deployments"
                  aria-label="Search deployments"
                  class="min-w-36 grow basis-[var(--container-2xs)]"
                >
                  <template #iconLeft>
                    <i
                      class="pi pi-search"
                      aria-hidden="true"
                    />
                  </template>
                </InputText>
              </ControlsHeader>

              <!-- ── Settings controls ── -->
              <ControlsHeader
                v-else
                key="controls-header-2"
              >
                <InputText
                  v-model="settingSearch"
                  size="large"
                  placeholder="Search settings"
                  aria-label="Search deployment settings"
                  class="min-w-36 grow basis-[var(--container-2xs)]"
                >
                  <template #iconLeft>
                    <i
                      class="pi pi-search"
                      aria-hidden="true"
                    />
                  </template>
                </InputText>
              </ControlsHeader>

              <!-- The filter bar takes its own row on whichever tab is open, so both
                   tabs of this module narrow the same way and by the same gesture. The
                   history tab reads the shared deployment catalog; Settings reads its
                   own two fields. -->
              <FilterBar
                v-if="activeTab === 'all'"
                key="filter-bar-1"
                v-model="deployFilters"
                :fields="deployFields"
              />
              <FilterBar
                v-else
                key="filter-bar-2"
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
                      v-model:search="deploySearch"
                      v-model:filters="deployFilters"
                      :deployments="allDeployments"
                      :fields="deployFields"
                      :email="userEmail"
                      :controls="false"
                      @row-click="openDeployment"
                      @action="onDeploymentAction"
                    />

                    <!-- ── Settings ── -->
                    <Table
                      v-else
                      v-model:globalFilter="settingSearch"
                      :data="filteredSettings"
                      :columns="settingColumns"
                      row-key="id"
                      enable-sorting
                      paginated
                      :page-size="10"
                      :border="false"
                      :loading="tenancyReloading"
                    >
                      <!-- The platform's own strategy is marked as such: it is the one
                           row nobody in this workspace authored, and the one row the
                           actions menu offers nothing for. -->
                      <template #cell-name="{ value, row }">
                        <span class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
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
                          :class="value ? '' : 'text-[var(--text-muted)]'"
                        >
                          {{ bindingLabel(value) }}
                        </span>
                      </template>

                      <template #cell-customPage="{ value }">
                        <span
                          class="truncate"
                          :class="value ? '' : 'text-[var(--text-muted)]'"
                        >
                          {{ bindingLabel(value) }}
                        </span>
                      </template>

                      <template #cell-status="{ value }">
                        <Tag
                          :label="value"
                          :severity="value === 'Active' ? 'success' : 'secondary'"
                          size="medium"
                        />
                      </template>

                      <template #cell-lastModified="{ row }">
                        <LastModifiedCell
                          :author="row.author"
                          :avatar-src="row.authorAvatar"
                          :date="row.updatedAt || ''"
                        />
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
            </section>
          </section>
        </div>
      </section>
    </main>

    <!-- New Settings — the strategy, not a deployment. The Settings tab's own action;
         the release page's picker opens its own nested instance for the quick-add. -->
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
