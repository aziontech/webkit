<script setup>
  // Deployments — the Azion Console "Deployments" module. The app shell (single
  // sidebar + GlobalHeader with the module breadcrumb) comes from AppLayout; this
  // page renders only its content, following the Applications.vue list pattern: a
  // CONTROLS HEADER (filter + search, the tab's own actions on the right) over a
  // data-driven <Table> living in a flush CardBox. No page heading — the module name
  // already IS the header breadcrumb crumb (see ui/ControlsHeader.vue).
  //
  // Unlike Applications, this module carries TWO sub-pages behind nav tabs —
  // "All Deployments" (the deployment history) and "Settings" (the reusable
  // deployment configurations) — so the active tab is held in the URL (`?tab=`)
  // the way WorkloadDetail does it: reloadable and linkable. Each tab brings its OWN
  // controls row, because the two narrow different subjects and their create actions
  // differ. The Message above them is what explains why Settings is a sibling of the
  // history at all (a configuration is shared across workloads, not owned by one).
  //
  // Narrowing on both tabs is a SELECTOR PER COLUMN (Applications.vue's model),
  // never a field/operator/value builder: the COLUMNS decide the fields — every
  // enumerable column gets a multiple Select and the date column gets a plain DATE
  // PICKER (no presets, no `period`) — they pre-filter `:data`, and the table sees only
  // the rows that survive. Both tabs put those fields in the FILTER POPOVER behind one
  // IconButton (ui/FilterPopover.vue), so the controls row is filter + search on
  // whichever tab is open. The history tab's Status / Type / Environment / Authors come
  // from the shared ui/DeploymentTableControls.vue — the same file the internal-level
  // tables render inside their own toolbar, popover included — and this page adds the
  // one only a cross-resource list needs, the Deployed range (Calendar), through its
  // `#selectors` slot. Being a first level, it holds that state itself and binds it
  // into DeploymentsTable as models.
  import Button from '@aziontech/webkit/button'
  import Calendar from '@aziontech/webkit/calendar'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import Select from '@aziontech/webkit/select'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { deployById, deployRows } from '../lib/azion-deploys'
  import { daysAgo, formatListDate, withinRange } from '../lib/dates'
  import { DEPLOYMENT_HISTORY } from '../lib/deployment-history'
  import { resourceMeta } from '../lib/deployments'
  import { filterDisplay } from '../lib/filters'
  import { authorAt } from '../lib/people'
  import { useTenancyReload } from '../lib/tenancy-reload'
  import { tenancyRows } from '../lib/tenancy-scope'
  import AppLayout from './ui/AppLayout.vue'
  import ControlsHeader from './ui/ControlsHeader.vue'
  import DeploymentsTable from './ui/DeploymentsTable.vue'
  import DeploymentTableControls from './ui/DeploymentTableControls.vue'
  import FilterPopover from './ui/FilterPopover.vue'
  import LastModifiedCell from './ui/LastModifiedCell.vue'
  import PageTabs from './ui/PageTabs.vue'
  import WorkloadDeploymentDrawer from './ui/WorkloadDeploymentDrawer.vue'

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
  // — the same vocabulary the workload's tables and the details drawer read, so a
  // status or a product tag can never mean two things in two places.
  //
  // `deployedAt` is the real instant — the date filter compares it and `date`
  // (the sortable, exportable display string) is derived from it by one
  // formatter, never hand-written per row (see src/lib/dates.js).
  //
  // `resourceId` is the deployed resource's real id: for an application it is the
  // id the Applications list uses, so the resource link lands on that detail page.
  const deployments = ref(
    [
      // The deployments that have a PAGE behind them: their whole `azion deploy`
      // pipeline is recorded — which step failed, which never ran — so a row of
      // theirs opens `/deployments/:id` instead of the details drawer (see
      // `openDeployment`). They are mapped by the module that owns those records
      // (src/lib/azion-deploys.js) and satisfy the same row contract as every row
      // beside them: the table cannot tell them apart.
      ...deployRows(),
      // The seeded history, shared with every workload's own Deployments tab
      // (src/lib/deployment-history.js). A workload page lists the rows whose
      // `workloadId` is its own — the same rows, filtered, never a second fixture.
      ...DEPLOYMENT_HISTORY
    ].sort((a, b) => b.deployedAt - a.deployedAt)
  )

  // Every selector on this tab is owned HERE, because a first-level page hoists its
  // controls out of the table (see ui/ControlsHeader.vue): the five the shared
  // DeploymentsTable normally holds are bound into it as models, and the date range —
  // which only a cross-resource list needs — pre-filters the rows it is handed.
  const deploySearch = ref('')
  const deployStatusFilter = ref([])
  const deployTypeFilter = ref([])
  const deployEnvironmentFilter = ref([])
  const deployAuthorFilter = ref([])
  const deployedRange = ref(null)

  // Switching account reloads the module (src/lib/tenancy-reload.js): both tabs show
  // skeletons while the new tenant's records arrive. A deployment belongs to the
  // account that made it, so the seed is projected through the account in scope; a
  // container deploy started in THIS session is the operator's own and always shows
  // (src/lib/tenancy-scope.js).
  const { tenancyReloading } = useTenancyReload()

  const filteredDeployments = computed(() =>
    tenancyRows(deployments.value, 'deployments').filter((deployment) =>
      withinRange(deployment.deployedAt, deployedRange.value)
    )
  )

  // "Clear all" (the filter panel's footer) resets every field the panel holds — the
  // four the shared controls own AND the page's own Deployed range, since a reset that
  // left one of them set would be lying. It leaves the search alone: that field sits
  // outside the panel, in plain view, so clearing it from in here would undo something
  // the user can see and did not ask about.
  const clearDeployFilters = () => {
    deployStatusFilter.value = []
    deployTypeFilter.value = []
    deployEnvironmentFilter.value = []
    deployAuthorFilter.value = []
    deployedRange.value = null
    toast.info('Filters cleared.')
  }

  // ── Settings (deployment configurations) ───────────────────────────────────
  // A configuration is authored once and applied to many workloads, which is what
  // the Message above the card states. `Single Version` publishes one live URL;
  // `Versioned URL` keeps every version addressable.
  //
  // The COLUMNS decide this tab's fields too, exactly as on the history tab: Type and
  // Status are its enumerable columns, so each gets a multiple Select, and Last
  // Modified gets the same plain date picker.
  const settingKindOptions = [
    { value: 'Single Version', label: 'Single Version' },
    { value: 'Versioned URL', label: 'Versioned URL' }
  ]

  const settingStatusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ]

  const deploymentSettings = ref(
    [
      {
        id: 's1',
        name: 'magalu-storefront',
        kind: 'Single Version',
        status: 'Active',
        updatedAt: daysAgo(3)
      },
      {
        id: 's2',
        name: 'azion-storefront',
        kind: 'Single Version',
        status: 'Active',
        updatedAt: daysAgo(11)
      },
      {
        id: 's3',
        name: 'azion-storefront-legacy',
        kind: 'Single Version',
        status: 'Inactive',
        updatedAt: daysAgo(29)
      },
      {
        id: 's4',
        name: 'docs-preview',
        kind: 'Versioned URL',
        status: 'Inactive',
        updatedAt: daysAgo(46)
      },
      {
        id: 's5',
        name: 'analytics-canary',
        kind: 'Versioned URL',
        status: 'Active',
        updatedAt: daysAgo(58)
      },
      {
        id: 's6',
        name: 'auth-service-prod',
        kind: 'Single Version',
        status: 'Active',
        updatedAt: daysAgo(73)
      },
      {
        id: 's7',
        name: 'marketing-site-prod',
        kind: 'Single Version',
        status: 'Active',
        updatedAt: daysAgo(88)
      },
      {
        id: 's8',
        name: 'status-page-stage',
        kind: 'Versioned URL',
        status: 'Inactive',
        updatedAt: daysAgo(120)
      },
      {
        id: 's9',
        name: 'internal-tools-dev',
        kind: 'Single Version',
        status: 'Active',
        updatedAt: daysAgo(151)
      },
      {
        id: 's10',
        name: 'blog-platform-stage',
        kind: 'Single Version',
        status: 'Active',
        updatedAt: daysAgo(183)
      }
    ].map((setting, index) => {
      const person = authorAt(index)
      return {
        ...setting,
        author: person.name,
        authorAvatar: person.avatar,
        lastModified: formatListDate(setting.updatedAt)
      }
    })
  )

  // Author and Last Modified are ONE column, the same as every other console list:
  // the avatar identifies the person (name on its tooltip) and the timestamp reads
  // relative beside it, so a separate Author column would only repeat what this one
  // already says (see ui/LastModifiedCell.vue).
  const settingColumns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true },
    { accessorKey: 'kind', header: 'Type', enableSorting: true },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // Narrowing here is a selector too — one per column, the same model the
  // deployment table follows — plus the table's own search.
  const settingSearch = ref('')
  const settingKindFilter = ref([])
  const settingStatusFilter = ref([])
  const settingModifiedRange = ref(null)
  const filteredSettings = computed(() =>
    tenancyRows(deploymentSettings.value, 'deployment-settings').filter((setting) => {
      if (settingKindFilter.value.length && !settingKindFilter.value.includes(setting.kind)) {
        return false
      }
      if (settingStatusFilter.value.length && !settingStatusFilter.value.includes(setting.status)) {
        return false
      }
      return withinRange(setting.updatedAt, settingModifiedRange.value)
    })
  )

  // What the filter trigger's badge counts: FIELDS that are narrowing the table, not
  // selected values. The search is left out — it stays visible in the row, so it is
  // never a hidden filter, which is also why "Clear all" no longer wipes it.
  const activeSettingFilterCount = computed(
    () =>
      Number(settingKindFilter.value.length > 0) +
      Number(settingStatusFilter.value.length > 0) +
      Number(Boolean(settingModifiedRange.value))
  )

  const clearSettingFilters = () => {
    settingKindFilter.value = []
    settingStatusFilter.value = []
    settingModifiedRange.value = null
    toast.info('Filters cleared.')
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  const newDeploy = () => router.push({ path: '/deploy', query: { email: userEmail.value } })
  const newSettings = () =>
    toast.info('New deployment settings', {
      description: 'Creating a deployment configuration is out of scope for this demo.'
    })

  // A deployment row opens the read-only details drawer — the same one the
  // workload detail page uses, so a deployment reads identically from either
  // entry point.
  const drawerOpen = ref(false)
  const selectedDeployment = ref(null)
  const openDeployment = (event, row) => {
    // A deployment whose pipeline is recorded has its own page: the six steps of
    // its `azion deploy`, the step that broke and the ones that never ran are
    // things you link to, reload and come back to — so they live at a URL rather
    // than in a drawer that closes with the Escape key. Everything else reads in
    // the drawer, which is all a row-shaped deployment needs.
    if (deployById(row.id)) {
      router.push({ path: `/deployments/${row.id}`, query: { email: userEmail.value } })
      return
    }

    // The drawer reads each resource under its own field name; a deployment here
    // targets one resource, so only that field is set and the drawer renders the
    // single block (a workload deployment still carries all three).
    selectedDeployment.value = {
      ...row,
      [resourceMeta(row.resourceType).drawerField]: row.resourceName
    }
    drawerOpen.value = true
  }

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

  const onSettingAction = (event, value, row) => {
    if (value === 'delete') {
      deploymentSettings.value = deploymentSettings.value.filter((setting) => setting.id !== row.id)
      toast.success(`${row.name} deleted`)
      return
    }
    const copy = {
      edit: `Editing ${row.name}`,
      duplicate: `Duplicating ${row.name}`
    }
    toast.info(copy[value] ?? row.name, { description: `${row.kind} · ${row.status}` })
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
      <PageTabs
        v-model:value="activeTab"
        :tabs="tabs"
      >
        <template #actions>
          <Button
            key="button-1"
            v-if="activeTab === 'all'"
            label="New Deployment"
            kind="primary"
            size="medium"
            icon="pi pi-plus"
            @click="newDeploy"
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
           MEASURE sit on the block inside it, exactly as every other first-level
           module list carries them (`.layout-column` — the DATA measure, 1620px).

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
      <section class="min-h-0 flex-1 overflow-auto">
        <div class="layout-column layout-boundary flex min-w-0 flex-col">
          <!-- The page's parent section. It holds ONE section here: the Message, the
               controls row and the table are all parts of the same band. -->
          <section class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]">
            <!-- ONE section, at --layout-group-gap: the Message frames the list, the
                 controls row narrows it, the table is what both are about. -->
            <section class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
              <!-- Why Settings is a sibling of the history: a configuration is shared,
                   not owned by the workload that happens to use it. -->
              <Message
                severity="info"
                size="small"
                closable
                label="Deployment Settings are reusable across Workloads. Create and manage deployment configurations once, then apply them to multiple workloads and environments."
              />

              <!-- ── All Deployments controls ── -->
              <ControlsHeader
                key="controls-header-1"
                v-if="activeTab === 'all'"

              >
                <DeploymentTableControls
                  v-model:search="deploySearch"
                  v-model:status-filter="deployStatusFilter"
                  v-model:type-filter="deployTypeFilter"
                  v-model:environment-filter="deployEnvironmentFilter"
                  v-model:author-filter="deployAuthorFilter"
                  :deployments="filteredDeployments"
                  :extra-count="deployedRange ? 1 : 0"
                  @clear="clearDeployFilters"
                >
                  <template #selectors>
                    <!-- Status, Type, Environment and Authors are the shared table's own
                   selectors — one per enumerable column; this module adds the one only its
                   cross-resource list needs, the Deployed date. It renders last in the
                   filter panel's stack, and `:extra-count` above is how the panel's badge
                   knows it is set (the shared controls cannot see a field the page owns).

                   A plain DATE PICKER, the same field Applications and Workloads carry:
                   no `:presets` (that splits the trigger into a preset dropdown + the
                   range, two controls for one filter) and no `period` (that swaps it for
                   the relative-span parser). `clearable` is live in this single-part
                   branch, so resetting is one click; `:show-fields="false"` drops the
                   Start/End inputs, which restate what the grid already says. The child
                   selectors stretch the trigger, which is otherwise fixed at
                   `--container-3xs`, to the width of the Selects stacked above it. -->
                    <Calendar
                      v-model="deployedRange"
                      mode="range"
                      size="large"
                      clearable
                      :show-fields="false"
                      placeholder="Deployed"
                      class="w-full [&>span]:w-full [&>span>span]:w-full"
                    />
                  </template>
                </DeploymentTableControls>
              </ControlsHeader>

              <!-- ── Settings controls ── -->
              <ControlsHeader
                key="controls-header-2"
                v-else

              >
                <!-- The same filter the deployment tab (and every other module list)
                     carries: the column selectors stacked in a popover behind one icon,
                     so both tabs of this module narrow the same way — a Select per
                     enumerable column (Type, Status) and the plain date picker for Last
                     Modified. -->
                <FilterPopover
                  :count="activeSettingFilterCount"
                  description="Narrow deployment settings by type, status or when they last changed."
                  @clear="clearSettingFilters"
                >
                  <Select
                    v-model="settingKindFilter"
                    multiple
                    size="large"
                    placeholder="Type"
                    :display-value="filterDisplay('Type', settingKindOptions)"
                  >
                    <Select.Trigger aria-label="Filter by type" />
                    <Select.Content>
                      <Select.Option
                        v-for="option in settingKindOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Content>
                  </Select>

                  <Select
                    v-model="settingStatusFilter"
                    multiple
                    size="large"
                    placeholder="Status"
                    :display-value="filterDisplay('Status', settingStatusOptions)"
                  >
                    <Select.Trigger aria-label="Filter by status" />
                    <Select.Content>
                      <Select.Option
                        v-for="option in settingStatusOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Content>
                  </Select>

                  <!-- The child selectors stretch the trigger — fixed at
                       `--container-3xs` on its own — to the width of the Selects above. -->
                  <Calendar
                    v-model="settingModifiedRange"
                    mode="range"
                    size="large"
                    clearable
                    :show-fields="false"
                    placeholder="Last Modified"
                    class="w-full [&>span]:w-full [&>span>span]:w-full"
                  />
                </FilterPopover>

                <InputText
                  v-model="settingSearch"
                  size="large"
                  placeholder="Search settings..."
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

              <section class="flex min-h-0 flex-col">
                <CardBox :padded="false">
                  <template #content>
                    <!-- ── All Deployments ── -->
                    <!-- The shared deployment table owns the columns and the cells; its
                     controls are hoisted into the page's ControlsHeader above
                     (`:controls="false"`), with their state bound back in as models. Page
                     size is the component's default, so every deployment table paginates
                     and reads the same. -->
                    <DeploymentsTable
                      v-if="activeTab === 'all'"
                      v-model:search="deploySearch"
                      v-model:status-filter="deployStatusFilter"
                      v-model:type-filter="deployTypeFilter"
                      v-model:environment-filter="deployEnvironmentFilter"
                      v-model:author-filter="deployAuthorFilter"
                      :deployments="filteredDeployments"
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
                      <template #cell-name="{ value }">
                        <span class="truncate">{{ value }}</span>
                      </template>

                      <!-- How the configuration publishes: one live URL, or one URL per
                           version. Its own column rather than a chip crammed beside the
                           name — an enumerable dimension is sortable and scans down the
                           column, the way Applications reads Infrastructure / Status. -->
                      <template #cell-kind="{ value }">
                        <Tag
                          :label="value"
                          severity="info"
                          size="medium"
                        />
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
                          :date="row.updatedAt"
                        />
                      </template>

                      <template #cell-actions="{ row }">
                        <Dropdown
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

    <!-- Read-only deployment details, opened from a row or its actions menu. -->
    <WorkloadDeploymentDrawer
      v-model:open="drawerOpen"
      :deployment="selectedDeployment"
    />
  </AppLayout>
</template>
