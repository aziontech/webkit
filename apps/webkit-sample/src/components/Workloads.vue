<script setup>
  // Workloads list — the Azion Console "Workloads" module. The app shell (sidebar +
  // GlobalHeader breadcrumb) comes from AppLayout; this page renders a CONTROLS HEADER
  // (filter + search, "Documentation" / "New Workload" on the right)
  // over a data-driven <Table> whose rows open the workload detail view. As a
  // first-level module list it carries no navigation tabs, and no page heading — the
  // module name already IS the header breadcrumb crumb (see ui/ControlsHeader.vue).
  //
  // Narrowing is a SELECTOR PER COLUMN (the same model as Applications), and the
  // COLUMNS decide the fields: every enumerable column gets a multiple Select
  // (Authors, Status) and the date column gets a plain DATE PICKER (Calendar,
  // `mode="range"` — no presets, no `period`); the free-text columns (Name, Domains)
  // are covered by the search field instead of one field each. They live inside the
  // FILTER POPOVER behind one IconButton (ui/FilterPopover.vue) — the module list
  // pattern — so the controls row is filter + search, and the trigger's badge says how
  // many fields are set. They pre-filter `:data`; the search field narrows what is
  // left, through the table's own global filter. See Applications.vue for why the
  // table's own filter state cannot host them.
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Calendar from '@aziontech/webkit/calendar'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Popover from '@aziontech/webkit/popover'
  import Select from '@aziontech/webkit/select'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { withinRange } from '../lib/dates'
  import { filterDisplay } from '../lib/filters'
  import { provisionedWorkloads, removeDeployment } from '../lib/provisioning'
  import { useTenancyReload } from '../lib/tenancy-reload'
  import { tenancyRows } from '../lib/tenancy-scope'
  import { WORKLOADS } from '../lib/workloads'
  import AppLayout from './ui/AppLayout.vue'
  import ControlsHeader from './ui/ControlsHeader.vue'
  import FilterPopover from './ui/FilterPopover.vue'
  import LastModifiedCell from './ui/LastModifiedCell.vue'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // Switching organization, account or workspace reloads the module: the table
  // shows skeletons while the new scope's workloads arrive
  // (src/lib/tenancy-reload.js).
  const { tenancyReloading } = useTenancyReload()

  // The workload records that back the table (data-driven mode). The seed lives in
  // src/lib/workloads.js because the deployment history is keyed by these ids and
  // reads these names (src/lib/deployment-history.js); this page holds its own copy
  // because it deletes rows, and mutating the shared array would leak that into every
  // surface reading it.
  const workloads = ref([...WORKLOADS])

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true },
    { accessorKey: 'domain', header: 'Domains', grow: 2 },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // ── Column selectors ──────────────────────────────────────────────────────
  // Authors come from the data, so the selector can never offer someone with no
  // rows in the list. (The column is "Last Modified"; the person renders inside
  // that cell as `owner`.)
  // Each option carries that person's photo, so the filter identifies them the
  // same way the Last Modified cell does — by face first, name second.
  const authorOptions = [
    ...new Map(workloads.value.map((workload) => [workload.owner, workload.ownerAvatar]))
  ]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([owner, avatar]) => ({ value: owner, label: owner, avatar }))

  // The roster is long enough that scanning it beats reading it: the panel gets
  // its own search field (Select.Content's `#search` slot), narrowing the options
  // by name. Cleared on close so the panel never reopens pre-filtered.
  const authorQuery = ref('')
  const authorOpen = ref(false)
  watch(authorOpen, (open) => {
    if (!open) authorQuery.value = ''
  })
  const visibleAuthorOptions = computed(() => {
    const query = authorQuery.value.trim().toLowerCase()
    if (!query) return authorOptions
    return authorOptions.filter((option) => option.label.toLowerCase().includes(query))
  })

  const statusOptions = [
    { value: 'Live', label: 'Live' },
    { value: 'Inactive', label: 'Inactive' }
  ]

  // Free-text search. The field lives in the page's ControlsHeader, above the card,
  // so it is a plain InputText bound to the table's `v-model:globalFilter` — the
  // context-aware `Table.Search` only works inside `<Table>`. The table still owns the
  // matching (every visible column, TanStack's global filter), so the behaviour is
  // identical to the toolbar version it replaces.
  const search = ref('')
  const authorFilter = ref([])
  const statusFilter = ref([])
  const modifiedRange = ref(null)

  // The badge on the filter trigger counts FIELDS that are narrowing the list, not
  // selected values — two authors is still one filter on Authors. The search is not
  // counted: it stays visible in the row, so it is never a hidden filter.
  const activeFilterCount = computed(
    () =>
      Number(authorFilter.value.length > 0) +
      Number(statusFilter.value.length > 0) +
      Number(Boolean(modifiedRange.value))
  )

  // "Clear all" resets the fields the panel renders, and only those — the search sits
  // outside it.
  const clearFilters = () => {
    authorFilter.value = []
    statusFilter.value = []
    modifiedRange.value = null
  }

  // Workloads provisioned by the deploy flow lead the list, newest first, so a
  // just-deployed workload is the first thing on the page (src/lib/provisioning.js).
  // The seeded rows below them belong to one scope, so they are projected through
  // the organization / account / workspace in force (src/lib/tenancy-scope.js);
  // what this session provisioned is the operator's own and is never projected
  // away.
  const allWorkloads = computed(() => [
    ...provisionedWorkloads.value,
    ...tenancyRows(workloads.value, 'workloads')
  ])

  const filteredWorkloads = computed(() =>
    allWorkloads.value.filter((workload) => {
      if (authorFilter.value.length && !authorFilter.value.includes(workload.owner)) return false
      if (statusFilter.value.length && !statusFilter.value.includes(workload.status)) return false
      return withinRange(workload.modifiedAt, modifiedRange.value)
    })
  )

  // External `:data` filtering does not trip TanStack's `autoResetPageIndex`, so
  // own the pagination state and rewind to the first page when a filter changes —
  // or when a tenancy-scope switch narrows the list the same way.
  const pagination = ref({ pageIndex: 0, pageSize: 10 })
  watch([authorFilter, statusFilter, modifiedRange, tenancyReloading], () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })

  const createWorkload = () =>
    router.push({ path: '/workloads/new', query: { email: userEmail.value } })

  // The name rides along in the query so the detail view can title itself (and
  // derive its resource chain) without a workload endpoint to read from.
  const openWorkload = (event, row) =>
    router.push({
      path: `/workloads/${row.id}`,
      query: { email: userEmail.value, name: row.name }
    })

  const onRowAction = (event, value, row) => {
    if (value === 'delete') {
      removeDeployment(row.id)
      workloads.value = workloads.value.filter((workload) => workload.id !== row.id)
      toast.success(`${row.name} deleted`)
      return
    }
    if (value === 'view') {
      openWorkload(event, row)
      return
    }
    toast.info(value === 'duplicate' ? `Duplicating ${row.name}` : row.name, {
      description: `Workload ID ${row.id}`
    })
  }
</script>

<template>
  <AppLayout
    active="workloads"
    :breadcrumb="[{ label: 'Workloads' }]"
  >
    <main class="layout-column flex min-h-full flex-col">
      <!-- The page's parent section. A module list opens straight on it (no
           PageHeading — the module name is the breadcrumb crumb), so the
           `:first-child` rule zeroes its step and the boundary is its top space. -->
      <section class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]">
        <!-- ONE section: the controls row narrows the table under it, so the two
             sit at --layout-group-gap. -->
        <section class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
          <!-- First-level module list: no PageHeading — the module name already IS the
               header breadcrumb crumb (AppLayout). The page opens with its CONTROLS
               instead — the filter, then the search, the module's own actions on the
               right — and the borderless Table follows in a flush CardBox. -->
          <ControlsHeader>
            <!-- The column selectors, collapsed behind one icon (ui/FilterPopover.vue) —
                 the same filter the other module lists carry. They apply as they are
                 picked; the badge on the trigger reports how many are set. -->
            <FilterPopover
              :count="activeFilterCount"
              description="Narrow workloads by author, when they last changed, or status."
              @clear="clearFilters"
            >
              <Select
                v-model="authorFilter"
                v-model:open="authorOpen"
                multiple
                size="large"
                placeholder="All Authors"
                :display-value="filterDisplay('All Authors', authorOptions)"
              >
                <Select.Trigger aria-label="Filter by author" />
                <Select.Content>
                  <!-- `#search` renders above the scrolling list, so the field stays
                       put while the options move. `@keydown.stop` keeps the panel's
                       Arrow/Home/End handler from pulling focus onto an option while
                       the user is still typing. -->
                  <template #search>
                    <InputText
                      v-model="authorQuery"
                      size="large"
                      class="w-full"
                      placeholder="Search authors..."
                      aria-label="Search authors"
                      @keydown.stop
                    >
                      <template #iconLeft>
                        <i
                          class="pi pi-search"
                          aria-hidden="true"
                        />
                      </template>
                    </InputText>
                  </template>
                  <Select.Option
                    v-for="option in visibleAuthorOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    <template #left>
                      <Avatar
                        :src="option.avatar || undefined"
                        :alt="option.label"
                        :label="option.label"
                        size="small"
                        kind="square"
                      />
                    </template>
                    {{ option.label }}
                  </Select.Option>
                  <!-- A search that matches nothing must say so; an empty panel
                       reads as a broken filter. -->
                  <p
                    v-if="!visibleAuthorOptions.length"
                    class="px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-body-sm text-[var(--text-muted)]"
                  >
                    No author matches “{{ authorQuery }}”.
                  </p>
                </Select.Content>
              </Select>

              <!-- Last Modified is a plain DATE PICKER: one field, one panel, a month
                   grid. No `:presets` (that splits the trigger into a preset dropdown +
                   the range, two controls for one filter, and hides the shortcuts in a
                   second popover) and no `period` (that swaps the whole thing for the
                   relative-span parser). `clearable` is live in this single-part branch,
                   so resetting is one click on the field; `:show-fields="false"` drops the
                   Start/End text inputs, which restate what the grid already says.

                   The child selectors stretch it to the panel: Calendar's own trigger is
                   fixed at `--container-3xs` (256px), which would sit short beside the
                   full-width Selects stacked above and below it. -->
              <Calendar
                v-model="modifiedRange"
                mode="range"
                size="large"
                clearable
                :show-fields="false"
                placeholder="Last Modified"
                class="w-full [&>span]:w-full [&>span>span]:w-full"
              />

              <Select
                v-model="statusFilter"
                multiple
                size="large"
                placeholder="All Statuses"
                :display-value="filterDisplay('All Statuses', statusOptions)"
              >
                <Select.Trigger aria-label="Filter by status" />
                <Select.Content>
                  <Select.Option
                    v-for="option in statusOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </FilterPopover>

            <!-- Search drives the table's global filter from outside the card, so the
                 field is a plain InputText (`Table.Search` is context-aware and only
                 works inside `<Table>`). With the selectors collapsed into the filter
                 popover beside it, the field keeps the whole row: it absorbs the slack
                 (`grow`) and only has to leave room for one 40px icon. -->
            <InputText
              v-model="search"
              size="large"
              placeholder="Search workloads..."
              aria-label="Search workloads"
              class="min-w-36 grow basis-[var(--container-2xs)]"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </InputText>

            <template #actions>
              <Button
                label="New Workload"
                kind="primary"
                size="large"
                icon="pi pi-plus"
                @click="createWorkload"
              />
            </template>
          </ControlsHeader>

          <section class="flex min-h-0 flex-col">
            <CardBox :padded="false">
              <template #content>
                <Table
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  :data="filteredWorkloads"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="10"
                  :border="false"
                  :loading="tenancyReloading"
                  @row-click="openWorkload"
                >
                  <template #cell-domain="{ row, value }">
                    <!-- Primary domain link (truncates) + arrow, then "+N" overflow Popover; copy button pinned to the cell's right edge so it aligns across rows. -->
                    <div class="flex w-full min-w-0 items-center gap-[var(--spacing-xs)]">
                      <a
                        :href="`https://${value}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex min-w-0 items-center gap-[var(--spacing-xxs)] hover:underline"
                        @click.stop
                      >
                        <span class="truncate">{{ value }}</span>
                        <i
                          class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]"
                          aria-hidden="true"
                        />
                      </a>
                      <Popover
                        v-if="row.domainCount"
                        placement="bottom-start"
                        width="medium"
                      >
                        <Popover.Trigger @click.stop>
                          <Tag
                            :label="`+${row.domainCount}`"
                            severity="secondary"
                            size="small"
                            class="shrink-0 cursor-pointer"
                          />
                        </Popover.Trigger>

                        <Popover.Content @click.stop>
                          <div
                            class="flex max-h-[var(--container-xs)] flex-col overflow-auto p-[var(--spacing-xxs)]"
                          >
                            <p
                              class="px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-overline-sm text-[var(--text-muted)]"
                            >
                              {{ row.domains.length }} domains
                            </p>
                            <span
                              v-for="domain in row.domains"
                              :key="domain"
                              class="truncate px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-body-sm text-[var(--text-default)]"
                            >
                              {{ domain }}
                            </span>
                          </div>
                        </Popover.Content>
                      </Popover>
                      <CopyButton
                        kind="outlined"
                        :value="value"
                        aria-label="Copy domain name"
                        class="ml-auto shrink-0"
                      />
                    </div>
                  </template>

                  <template #cell-status="{ value }">
                    <Tag
                      :label="value"
                      :severity="value === 'Live' ? 'success' : 'secondary'"
                      size="medium"
                    />
                  </template>

                  <template #cell-lastModified="{ row }">
                    <LastModifiedCell
                      :author="row.owner"
                      :avatar-src="row.ownerAvatar"
                      :date="row.modifiedAt"
                    />
                  </template>

                  <template #cell-actions="{ row }">
                    <Dropdown
                      placement="bottom-end"
                      @select="(event, value) => onRowAction(event, value, row)"
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
                          value="view"
                          label="View details"
                        >
                          <template #left>
                            <i
                              class="pi pi-eye"
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
    </main>
  </AppLayout>
</template>
