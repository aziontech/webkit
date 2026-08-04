<script setup>
  // Applications list — the Azion Console "Applications" module. The app shell
  // (single sidebar + GlobalHeader with the module breadcrumb) comes from AppLayout;
  // this page renders only its content: a CONTROLS HEADER (filter + search, with the
  // column, with the module's own actions on the right) over a data-driven <Table>
  // whose row actions open a Dropdown menu. As a first-level module list it carries no
  // navigation tabs.
  //
  // No page heading: the module name already IS the header breadcrumb crumb, so an <h1>
  // repeating it would only push the table down. What the page opens with is what the
  // user came to do — narrow the list, or add to it (see ui/ControlsHeader.vue).
  //
  // Narrowing is a SELECTOR PER COLUMN, not a generic field/operator/value builder.
  // The COLUMNS decide the fields: every enumerable column gets a multiple Select
  // (Authors, Infrastructure, Status) and the date column gets a plain DATE PICKER
  // (Calendar, `mode="range"` — no presets, no `period`); the free-text columns
  // (Name, Repository, ID, Domain) are covered by the search field instead of one
  // field each.
  //
  // Those four fields now live inside a FILTER POPOVER (ui/FilterPopover.vue) behind
  // one IconButton, instead of standing always-visible in the controls row. Four
  // selectors plus the search plus the module's action left every one of them
  // truncated at a laptop width, and the search — the control people actually reach
  // for — was the first to give up space. The popover gives the row back to the
  // search and makes the set extensible; the trigger's badge (`activeFilterCount`) is
  // what keeps a collapsed filter from being a forgotten one.
  //
  // The table's own filter state still could not host these (its `#filters` band only
  // renders once a filter exists, and `author` is not a column at all — it renders
  // inside the Last Modified cell), so the four refs pre-filter `:data` and the table
  // sees only the rows that survive. The search field narrows further, through the
  // table's own global filter (`v-model:globalFilter`).
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Calendar from '@aziontech/webkit/calendar'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Select from '@aziontech/webkit/select'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { APPLICATIONS } from '../lib/applications'
  import { withinRange } from '../lib/dates'
  import { environmentSeverity } from '../lib/deployments'
  import { filterDisplay } from '../lib/filters'
  import { presetIcon, presetLabel } from '../lib/presets'
  import { provisionedApplications, removeDeployment } from '../lib/provisioning'
  import { useTenancyReload } from '../lib/tenancy-reload'
  import { tenancyRows } from '../lib/tenancy-scope'
  import AppLayout from './ui/AppLayout.vue'
  import ControlsHeader from './ui/ControlsHeader.vue'
  import DeployResourceDrawer from './ui/DeployResourceDrawer.vue'
  import FilterPopover from './ui/FilterPopover.vue'
  import LastModifiedCell from './ui/LastModifiedCell.vue'

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // Switching organization, account or workspace reloads the module: the table
  // shows skeletons while the new scope's applications arrive
  // (src/lib/tenancy-reload.js).
  const { tenancyReloading } = useTenancyReload()

  // The framework preset → glyph + label map lives in src/lib/presets.js, shared
  // with an application's Build tab so the two can never disagree about a preset.

  // The application records that back the table (data-driven mode). The seed lives in
  // src/lib/applications.js because the deployment history names the resource each
  // deployment targeted and LINKS to `/applications/:id`
  // (src/lib/deployment-history.js) — an id kept in a second file is a dead link
  // waiting to happen. This page holds its own copy because it deletes rows.
  const applications = ref([...APPLICATIONS])

  // Column model. `name` is the principal (emphasized) column; the trailing
  // `actions` column (kind: 'action') is auto-pinned to the right edge.
  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true },
    { accessorKey: 'repository', header: 'Repository', grow: 2 },
    { accessorKey: 'id', header: 'ID', enableSorting: true },
    // Domain is shown in full (no truncation) — give it the widest flexible share.
    { accessorKey: 'domainName', header: 'Domain Name', grow: 3 },
    { accessorKey: 'infrastructure', header: 'Infrastructure', enableSorting: true },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // ── Column selectors ──────────────────────────────────────────────────────
  // Authors options come from the data itself, so the selector can never offer a
  // person who has nothing in the list. Each option carries that person's photo,
  // so the filter identifies them the same way the Last Modified cell does — by
  // face first, name second.
  const authorOptions = [
    ...new Map(applications.value.map((app) => [app.author, app.authorAvatar]))
  ]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([author, avatar]) => ({ value: author, label: author, avatar }))

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

  // Every OTHER enumerable column gets its own selector, listed in the order the
  // column reads rather than alphabetically — Production before Staging before
  // Development is the promotion path, and sorting the options would scramble it.
  const infrastructureOptions = [
    { value: 'Production', label: 'Production' },
    { value: 'Staging', label: 'Staging' },
    { value: 'Development', label: 'Development' }
  ]

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ]

  // Free-text search. The field lives in the page's ControlsHeader, above the card,
  // so it is a plain InputText bound to the table's `v-model:globalFilter` — the
  // context-aware `Table.Search` only works inside `<Table>`. The table still owns
  // the matching itself (every visible column, TanStack's global filter), so the
  // behaviour is identical to the toolbar version it replaces.
  const search = ref('')
  const authorFilter = ref([])
  const infrastructureFilter = ref([])
  const statusFilter = ref([])
  const modifiedRange = ref(null)

  // What the popover trigger's badge counts: FIELDS narrowing the list, not selected
  // values — three authors is one filter on Authors, and reading "3" for that would
  // suggest three fields are set. The search is not counted; it is visible in the row
  // and never hidden behind the trigger.
  const activeFilterCount = computed(
    () =>
      Number(authorFilter.value.length > 0) +
      Number(infrastructureFilter.value.length > 0) +
      Number(statusFilter.value.length > 0) +
      Number(Boolean(modifiedRange.value))
  )

  // "Clear all" resets every field the panel renders — and only those: the search sits
  // outside the panel, so wiping it from in here would clear something the user can
  // see and did not ask about.
  const clearFilters = () => {
    authorFilter.value = []
    infrastructureFilter.value = []
    statusFilter.value = []
    modifiedRange.value = null
  }

  // Applications provisioned by the deploy flow lead the list, newest first — the
  // second link of the chain a deploy creates (src/lib/provisioning.js). The
  // seeded rows below them belong to one scope, so they are projected through the
  // organization / account / workspace in force (src/lib/tenancy-scope.js); what
  // this session provisioned is the operator's own and is never projected away.
  const allApplications = computed(() => [
    ...provisionedApplications.value,
    ...tenancyRows(applications.value, 'applications')
  ])

  const filteredApplications = computed(() =>
    allApplications.value.filter((app) => {
      if (authorFilter.value.length && !authorFilter.value.includes(app.author)) return false
      if (
        infrastructureFilter.value.length &&
        !infrastructureFilter.value.includes(app.infrastructure)
      ) {
        return false
      }
      if (statusFilter.value.length && !statusFilter.value.includes(app.status)) return false
      return withinRange(app.modifiedAt, modifiedRange.value)
    })
  )

  // Filtering `:data` from outside the table does not trip TanStack's
  // `autoResetPageIndex`, so narrowing to fewer rows than the current page's
  // offset would render an empty table. Own the pagination state and rewind it.
  // A scope switch narrows the same way (a scope owns a subset of the seed), so a
  // reload starts on the first page too.
  const pagination = ref({ pageIndex: 0, pageSize: 8 })
  watch([authorFilter, infrastructureFilter, statusFilter, modifiedRange, tenancyReloading], () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })

  // Entering the module and choosing "create" opens the dedicated create PAGE
  // (a form route), not a modal — see CreateApplication.vue.
  const createApplication = () =>
    router.push({ path: '/applications/new', query: { email: userEmail.value } })

  // Opening an application enters its resource-detail view (the PageTabs nav-bar
  // pattern), landing on the Main Settings sub-page.
  const openApp = (event, row) =>
    router.push({
      path: `/applications/${row.id}`,
      query: { email: userEmail.value }
    })

  // ── Deploy ────────────────────────────────────────────────────────────────
  // The ONE deploy interaction, opened from a row with the application already
  // chosen (ui/DeployResourceDrawer.vue). The run it starts lives at module scope
  // (src/lib/deploy-runs.js), so this page can be left the moment the drawer closes;
  // the deployment is a row in the Deployments module from that second, Building.
  // Authoring a missing strategy is the drawer's own nested flow (its Deployment
  // Settings Select carries the quick-add), so this page hosts only the deploy drawer.
  const deployOpen = ref(false)
  const deployTarget = ref(null)

  const openDeploy = (row) => {
    deployTarget.value = { kind: 'application', id: row.id, name: row.name }
    deployOpen.value = true
  }

  const onDeployed = (run) => {
    toast.info(`Deployment ${run.deployId} started`, {
      description: 'Follow it in Deployments — it keeps running if you leave.'
    })
  }

  // Row action menu — Dropdown emits (event, value); `delete` removes the row.
  const onRowAction = (event, value, row) => {
    if (value === 'deploy') {
      openDeploy(row)
      return
    }
    if (value === 'delete') {
      removeDeployment(row.id)
      applications.value = applications.value.filter((app) => app.id !== row.id)
      toast.success(`${row.name} deleted`)
      return
    }
    if (value === 'view') {
      openApp(event, row)
      return
    }
    const copy = {
      edit: `Editing ${row.name}`,
      duplicate: `Duplicating ${row.name}`
    }
    toast.info(copy[value] ?? row.name, { description: `Application ID ${row.id}` })
  }
</script>

<template>
  <AppLayout
    active="applications"
    :breadcrumb="[{ label: 'Applications' }]"
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
               right — and the borderless Table follows in a flush CardBox, framed
               edge-to-edge. -->
          <ControlsHeader>
            <!-- The four column selectors, collapsed behind one icon (ui/FilterPopover.vue).
                 They apply as they are picked; the badge on the trigger is what tells the
                 user how many of them are narrowing the table right now. -->
            <FilterPopover
              :count="activeFilterCount"
              description="Narrow applications by author, when they last changed, infrastructure or status."
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

                   The child selectors are what stretches it: Calendar's own trigger is
                   fixed at `--container-3xs` (256px), so in a stacked panel it would sit
                   short beside the full-width Selects. -->
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
                v-model="infrastructureFilter"
                multiple
                size="large"
                placeholder="All Infrastructures"
                :display-value="filterDisplay('All Infrastructures', infrastructureOptions)"
              >
                <Select.Trigger aria-label="Filter by infrastructure" />
                <Select.Content>
                  <Select.Option
                    v-for="option in infrastructureOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>

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
                 popover beside it, the field now keeps the whole row: it absorbs the
                 slack (`grow`) and only has to leave room for one 40px icon. -->
            <InputText
              v-model="search"
              size="large"
              placeholder="Search..."
              aria-label="Search applications"
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
                label="New Application"
                kind="primary"
                size="large"
                icon="pi pi-plus"
                @click="createApplication"
              />
            </template>
          </ControlsHeader>

          <section class="flex min-h-0 flex-col">
            <CardBox :padded="false">
              <template #content>
                <Table
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  :data="filteredApplications"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="8"
                  :border="false"
                  :loading="tenancyReloading"
                  @row-click="openApp"
                >
                  <template #cell-name="{ value, row }">
                    <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                      <i
                        :class="`ai-cor ${presetIcon(row.preset)}`"
                        class="shrink-0 text-[1.15em]"
                        :title="presetLabel(row.preset)"
                        aria-hidden="true"
                      />
                      <!-- Principal column opens the detail view — underline on hover. -->
                      <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
                    </div>
                  </template>

                  <template #cell-repository="{ value }">
                    <!-- One rounded chip for the git repo. The label goes through the
                         default slot with `truncate` so a long repo shrinks with an
                         ellipsis instead of overflowing the Tag (whose justify-center +
                         overflow-hidden would otherwise clip the leading GitHub icon).
                         `max-w-full` keeps the chip inside its cell. -->
                    <Tag
                      severity="secondary"
                      size="medium"
                      icon="pi pi-github"
                      rounded
                      class="max-w-full"
                    >
                      <span class="min-w-0 truncate">{{ value }}</span>
                    </Tag>
                  </template>

                  <template #cell-domainName="{ value }">
                    <!-- Domain link (truncates) + external-redirect arrow; copy button pinned to the cell's right edge so it aligns across rows. -->
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
                      <CopyButton
                        kind="outlined"
                        :value="value"
                        aria-label="Copy domain name"
                        class="ml-auto shrink-0"
                      />
                    </div>
                  </template>

                  <!-- Infrastructure is an enumerable environment, so it reads as a chip
                       like Status does — and through the SAME severity map every
                       deployment surface uses (src/lib/deployments.js), so Production
                       cannot be `info` here and something else next to a deployment. -->
                  <template #cell-infrastructure="{ value }">
                    <Tag
                      :label="value"
                      :severity="environmentSeverity(value)"
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
                        <!-- Deploy leads the menu: it is the one action here that
                             changes what the edge is serving, and it is the SAME
                             interaction every other resource offers (ui/DeployResourceDrawer.vue)
                             — the application arrives already chosen. -->
                        <Dropdown.Option
                          value="deploy"
                          label="Deploy"
                        >
                          <template #left>
                            <i
                              class="pi pi-cloud-upload"
                              aria-hidden="true"
                            />
                          </template>
                        </Dropdown.Option>
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
    </main>

    <!-- The one deploy interaction, with this row's application already chosen. -->
    <DeployResourceDrawer
      v-model:open="deployOpen"
      :resource="deployTarget"
      @deployed="onDeployed"
    />
  </AppLayout>
</template>
