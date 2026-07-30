<script setup>
  // Deployments — the Azion Console "Deployments" module. The app shell (single
  // sidebar + GlobalHeader with the module breadcrumb) comes from AppLayout; this
  // page renders only its content, following the Applications.vue list pattern:
  // a PageHeading (title + description + primary actions) over a data-driven
  // <Table> living in a flush CardBox.
  //
  // Unlike Applications, this module carries TWO sub-pages behind nav tabs —
  // "All Deployments" (the deployment history) and "Settings" (the reusable
  // deployment configurations) — so the active tab is held in the URL (`?tab=`)
  // the way WorkloadDetail does it: reloadable and linkable. The Message above
  // the card is what explains why Settings is a sibling of the history at all
  // (a configuration is shared across workloads, not owned by one).
  //
  // Narrowing on both tabs is a SELECTOR PER COLUMN (Applications.vue's model),
  // never a field/operator/value builder: the selectors are always visible,
  // pre-filter `:data`, and the table sees only the rows that survive. The
  // history tab's Status / Environment / Authors selectors come with the shared
  // DeploymentsTable — the one table shape every deployment surface uses — and
  // this page adds the one only a cross-resource list needs, a date range
  // (Calendar).
  import Button from '@aziontech/webkit/button'
  import Calendar from '@aziontech/webkit/calendar'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import Message from '@aziontech/webkit/message'
  import Select from '@aziontech/webkit/select'
  import TabView from '@aziontech/webkit/tab-view'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { daysAgo, formatListDate, withinRange } from '../lib/dates'
  import { resourceMeta } from '../lib/deployments'
  import { filterDisplay } from '../lib/filters'
  import { authorAt, emailOf } from '../lib/people'
  import AppLayout from './ui/AppLayout.vue'
  import DeploymentsTable from './ui/DeploymentsTable.vue'
  import PageHeading from './ui/PageHeading.vue'
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
    set: (value) => router.replace({ query: { ...route.query, tab: value } })
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
      {
        id: 'd1',
        versionId: '1293183210',
        environment: 'Production',
        current: false,
        status: 'Ready',
        duration: '99s',
        deployedAt: daysAgo(0),
        resourceType: 'application',
        resourceName: 'webkit-sample-vue',
        resourceId: '1784552864'
      },
      {
        id: 'd2',
        versionId: '1293183211',
        environment: 'Production',
        current: true,
        status: 'Building',
        duration: '',
        deployedAt: daysAgo(1),
        resourceType: 'firewall',
        resourceName: 'edge-firewall-prod',
        resourceId: 'fw-1042'
      },
      {
        id: 'd3',
        versionId: '1293183212',
        environment: 'Production',
        current: false,
        status: 'Building',
        duration: '',
        deployedAt: daysAgo(2),
        resourceType: 'custom-page',
        resourceName: 'maintenance-page',
        resourceId: 'cp-2210'
      },
      {
        id: 'd4',
        versionId: '1293183213',
        environment: 'Stage',
        current: false,
        status: 'Error',
        duration: '',
        deployedAt: daysAgo(3),
        resourceType: 'application',
        resourceName: 'react-dashboard',
        resourceId: '9823746510'
      },
      {
        id: 'd5',
        versionId: '1293183214',
        environment: 'Stage',
        current: false,
        status: 'Queued',
        duration: '',
        deployedAt: daysAgo(4),
        resourceType: 'firewall',
        resourceName: 'edge-firewall-stage',
        resourceId: 'fw-1043'
      },
      {
        id: 'd6',
        versionId: '1293183215',
        environment: 'Production',
        current: false,
        status: 'Ready',
        duration: '99s',
        deployedAt: daysAgo(6),
        resourceType: 'application',
        resourceName: 'analytics-pro',
        resourceId: '7658392017'
      },
      {
        id: 'd7',
        versionId: '1293183216',
        environment: 'Production',
        current: false,
        status: 'Building',
        duration: '',
        deployedAt: daysAgo(9),
        resourceType: 'custom-page',
        resourceName: 'not-found-page',
        resourceId: 'cp-2211'
      },
      {
        id: 'd8',
        versionId: '1293183217',
        environment: 'Stage',
        current: false,
        status: 'Error',
        duration: '',
        deployedAt: daysAgo(13),
        resourceType: 'application',
        resourceName: 'ecommerce-v2',
        resourceId: '4532109876'
      },
      {
        id: 'd9',
        versionId: '1293183218',
        environment: 'Stage',
        current: false,
        status: 'Queued',
        duration: '',
        deployedAt: daysAgo(18),
        resourceType: 'firewall',
        resourceName: 'waf-edge-firewall',
        resourceId: 'fw-1044'
      },
      {
        id: 'd10',
        versionId: '1293183219',
        environment: 'Production',
        current: false,
        status: 'Ready',
        duration: '72s',
        deployedAt: daysAgo(24),
        resourceType: 'application',
        resourceName: 'marketing-site',
        resourceId: '9988776655'
      },
      {
        id: 'd11',
        versionId: '1293183220',
        environment: 'Stage',
        current: false,
        status: 'Draft',
        duration: '',
        deployedAt: daysAgo(41),
        resourceType: 'custom-page',
        resourceName: 'rate-limit-page',
        resourceId: 'cp-2212'
      },
      {
        id: 'd12',
        versionId: '1293183221',
        environment: 'Production',
        current: false,
        status: 'Ready',
        duration: '58s',
        deployedAt: daysAgo(67),
        resourceType: 'application',
        resourceName: 'docs-portal',
        resourceId: '6677889900'
      },
      {
        id: 'd13',
        versionId: '1293183222',
        environment: 'Production',
        current: false,
        status: 'Error',
        duration: '',
        deployedAt: daysAgo(94),
        resourceType: 'firewall',
        resourceName: 'edge-firewall-legacy',
        resourceId: 'fw-1045'
      },
      {
        id: 'd14',
        versionId: '1293183223',
        environment: 'Stage',
        current: false,
        status: 'Ready',
        duration: '41s',
        deployedAt: daysAgo(130),
        resourceType: 'application',
        resourceName: 'auth-service',
        resourceId: '8899001122'
      }
      // The deploying user comes from the shared team roster (src/lib/people.js),
      // assigned round-robin per row; the address is derived from the name.
    ].map((deployment, index) => {
      const person = authorAt(index)
      return {
        ...deployment,
        author: person.name,
        authorEmail: emailOf(person.name),
        authorAvatar: person.avatar,
        date: formatListDate(deployment.deployedAt)
      }
    })
  )

  // Status, Environment and Authors live on the shared table; the date range is
  // this page's own, so it pre-filters the rows the table is handed.
  const deployedRange = ref(null)

  const filteredDeployments = computed(() =>
    deployments.value.filter((deployment) => withinRange(deployment.deployedAt, deployedRange.value))
  )

  // "Clear filters" in the table's options menu can only reach the selectors the
  // table owns, so it hands this one back here through `@clear`.
  const clearSelectors = () => {
    deployedRange.value = null
  }

  // ── Settings (deployment configurations) ───────────────────────────────────
  // A configuration is authored once and applied to many workloads, which is what
  // the Message above the card states. `Single Version` publishes one live URL;
  // `Versioned URL` keeps every version addressable.
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
        authorEmail: emailOf(person.name),
        authorAvatar: person.avatar,
        lastModified: formatListDate(setting.updatedAt)
      }
    })
  )

  const settingColumns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
    { accessorKey: 'authorEmail', header: 'Author', grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // Narrowing here is a selector too — one per column, the same model the
  // deployment table follows — plus the table's own search.
  const settingSearch = ref('')
  const settingStatusFilter = ref([])
  const filteredSettings = computed(() =>
    deploymentSettings.value.filter(
      (setting) =>
        !settingStatusFilter.value.length || settingStatusFilter.value.includes(setting.status)
    )
  )
  const clearSettingFilters = () => {
    settingSearch.value = ''
    settingStatusFilter.value = []
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

  // The toolbar's trailing "..." menu. `Table.Export` renders only its trigger
  // slot, so wrapping the Dropdown in it is what hands the menu the table's own
  // CSV export (visible columns + filtered rows) without a second button.
  const onToolbarAction = (value, exportCsv, clearFilters) => {
    if (value === 'export') {
      exportCsv()
      return
    }
    clearFilters()
    toast.info('Filters cleared.')
  }
</script>

<template>
  <AppLayout
    active="deployments"
    :breadcrumb="[{ label: 'Deployments' }]"
  >
    <main class="layout-column layout-list h-full">
      <!-- First-level module list: the module name lives in the header breadcrumb
           (AppLayout), the PageHeading sits OUT of the card and carries the
           primary actions, and the tabs below it switch sub-page. -->
      <PageHeading
        size="large"
        title="Deployments"
        description="View and manage your deployment history."
      >
        <template #actions>
          <Button
            label="Documentation"
            kind="outlined"
            size="medium"
            icon="pi pi-book"
            href="https://www.azion.com/en/documentation/"
            target="_blank"
          />
          <Button
            label="New Deployment"
            kind="primary"
            size="medium"
            icon="pi pi-plus"
            @click="newDeploy"
          />
        </template>
      </PageHeading>

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

      <!-- Why Settings is a sibling of the history: a configuration is shared,
           not owned by the workload that happens to use it. -->
      <Message
        severity="info"
        label="Deployment Settings are reusable across Workloads. Create and manage deployment configurations once, then apply them to multiple workloads and environments."
      />

      <section class="flex min-h-0 flex-col">
        <CardBox :padded="false">
          <template #content>
            <!-- ── All Deployments ── -->
            <!-- The shared deployment table owns the columns, the cells, the
                 search and the Status / Environment / Authors selectors; this
                 page only adds the one it pre-filters `:data` with. Page size and
                 placeholder are the component's defaults, so every deployment
                 table paginates and reads the same. -->
            <DeploymentsTable
              v-if="activeTab === 'all'"
              :deployments="filteredDeployments"
              :email="userEmail"
              export-filename="deployments.csv"
              @row-click="openDeployment"
              @action="onDeploymentAction"
              @clear="clearSelectors"
            >
              <template #selectors>
                <!-- Status, Environment and Authors are the shared table's own
                     selectors; this module adds the one only its cross-resource
                     list needs — a date range. Every field is `large`, so the row
                     stays one 40px band alongside the table's own controls.

                     One control, deliberately WITHOUT :presets: presets split the
                     trigger into a preset dropdown + the range itself (two fields
                     on the row), and this toolbar already carries three selectors.
                     Without them `clearable` is live — it renders the X on the
                     trigger in the single-part branch — so resetting the range
                     stays a one-click affordance. -->
                <Calendar
                  v-model="deployedRange"
                  mode="range"
                  size="large"
                  clearable
                  placeholder="Select a Date"
                  class="shrink-0"
                />
              </template>
            </DeploymentsTable>

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
              export-filename="deployment-settings.csv"
            >
              <template #toolbar>
                <div class="flex w-full flex-wrap items-center gap-[var(--spacing-xs)]">
                  <Table.Search
                    size="large"
                    placeholder="Search settings..."
                    class="min-w-0 grow basis-full 2xl:basis-0"
                  />

                  <!-- The same selector-per-column model the deployment table
                       follows, so both tabs of this module narrow the same way. -->
                  <div class="w-[var(--container-3xs)] shrink-0">
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
                  </div>

                  <!-- The create action lives in the toolbar (not the PageHeading):
                       it creates a configuration, which is this tab's subject, not
                       the module's. -->
                  <Button
                    label="New Settings"
                    kind="outlined"
                    icon="pi pi-plus"
                    class="shrink-0"
                    @click="newSettings"
                  />

                  <Table.Export>
                    <template #trigger="{ export: exportCsv }">
                      <Dropdown
                        placement="bottom-end"
                        class="shrink-0"
                        @select="
                          (event, value) => onToolbarAction(value, exportCsv, clearSettingFilters)
                        "
                      >
                        <Dropdown.Trigger>
                          <Tooltip text="Table options">
                            <IconButton
                              icon="pi pi-ellipsis-h"
                              kind="outlined"
                              aria-label="Table options"
                            />
                          </Tooltip>
                        </Dropdown.Trigger>
                        <Dropdown.Group>
                          <Dropdown.Option
                            value="export"
                            label="Export CSV"
                          >
                            <template #left>
                              <i
                                class="pi pi-download"
                                aria-hidden="true"
                              />
                            </template>
                          </Dropdown.Option>
                          <Dropdown.Option
                            value="clear"
                            label="Clear filters"
                          >
                            <template #left>
                              <i
                                class="pi pi-filter-slash"
                                aria-hidden="true"
                              />
                            </template>
                          </Dropdown.Option>
                        </Dropdown.Group>
                      </Dropdown>
                    </template>
                  </Table.Export>
                </div>
              </template>

              <template #cell-name="{ value, row }">
                <div class="flex min-w-0 items-start gap-[var(--spacing-xxs)]">
                  <span class="truncate text-body-sm text-[var(--text-default)]">{{ value }}</span>
                  <!-- How the configuration publishes: one live URL, or one URL
                       per version. -->
                  <Tag
                    :label="row.kind"
                    severity="info"
                    size="small"
                  />
                </div>
              </template>

              <template #cell-status="{ value }">
                <Tag
                  :label="value"
                  :severity="value === 'Active' ? 'success' : 'secondary'"
                  size="medium"
                />
              </template>

              <template #cell-authorEmail="{ value, row }">
                <div class="flex w-full min-w-0 items-center justify-end gap-[var(--spacing-xs)]">
                  <span class="truncate text-body-sm text-[var(--text-muted)]">{{ value }}</span>
                  <!-- The tooltip carries the name AND the full address, so a
                       very long email that ellipsizes is still readable. -->
                  <Tooltip :text="`${row.author} · ${value}`">
                    <Avatar
                      :src="row.authorAvatar || undefined"
                      :alt="row.author"
                      :label="row.author"
                      size="small"
                      kind="square"
                    />
                  </Tooltip>
                </div>
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
    </main>

    <!-- Read-only deployment details, opened from a row or its actions menu. -->
    <WorkloadDeploymentDrawer
      v-model:open="drawerOpen"
      :deployment="selectedDeployment"
    />
  </AppLayout>
</template>
