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
  // Narrowing is a FILTER BAR of CHIPS (ui/FilterBar.vue), not a generic
  // field/operator/value builder. The COLUMNS decide the fields: every enumerable
  // column becomes one field (Author, Infrastructure, Status) and the date column
  // becomes a field of relative periods plus a Custom month grid (Last Modified); the
  // free-text columns
  // (Name, Repository, ID, Domain) are covered by the search field instead of one field
  // each. The catalog those fields live in is `filterFields` below — the page declares
  // them, the bar renders and applies them (see lib/filter-bar.js).
  //
  // This replaced a FILTER POPOVER that held one Select per column behind a single
  // badged IconButton. Collapsing them there fixed the right
  // problem — four selectors plus the search plus the module's action truncated every
  // one of them at a laptop width — but paid for it by putting the applied state
  // inside a closed panel: the badge said "2 filters", never which two, and never on
  // what values. The chips say all three in the row itself, and each carries its own
  // × so one cut can be undone without opening anything. The fields that are NOT
  // applied still show as recessed offers, so the vocabulary of the filter stays
  // visible instead of living behind a trigger the user has to think of pressing.
  //
  // The table's own filter state still could not host these (its `#filters` band only
  // renders once a filter exists, and `author` is not a column at all — it renders
  // inside the Last Modified cell), so the bar's state pre-filters `:data` and the
  // table sees only the rows that survive. The search field narrows further, through
  // the table's own global filter (`v-model:globalFilter`).
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { APPLICATIONS } from '@shared/lib/applications'
  import { provisionedApplications, removeDeployment } from '@shared/lib/provisioning'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ProductFirstUse from '../../components/home/ProductFirstUse.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import DomainCell from '../../components/list/DomainCell.vue'
  import FilterBar from '../../components/list/FilterBar.vue'
  import LastModifiedCell from '../../components/list/LastModifiedCell.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../../lib/behavior/filter-bar'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { environmentSeverity } from '../../lib/data/deployments'
  import { productFirstUse } from '../../lib/data/product-empty-states'
  import { presetIcon, presetLabel } from '../../lib/format/presets'
  import { useSampleMode } from '../../lib/state/sample-mode'
  import { tenancyRows } from '../../lib/state/tenancy-scope'

  // The sample's EMPTY version: this module before it owns anything. The same block
  // the /empty-states gallery reviews, rendered in the module's own page
  // (../lib/sample-mode.js, ./ui/ProductFirstUse.vue).
  const { accountEmpty } = useSampleMode()
  const firstUse = productFirstUse('applications')

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

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

  // ── The filter catalog ────────────────────────────────────────────────────
  // One field per enumerable column, declared in the order the COLUMNS read — which is
  // also the order the chips sit in, permanently: a chip holds its position whether it
  // is applied or not (ui/FilterBar.vue explains what that buys). Each field owns its
  // own `match`, because only the page knows how a row answers for it (`author` is not
  // even a column — it renders inside the Last Modified cell).
  //
  // Author options come from the data itself, so the field can never offer a person
  // who has nothing in the list. Each carries that person's photo, so the filter
  // identifies them the way the Last Modified cell does — by face first, name second.
  const authorOptions = [
    ...new Map(applications.value.map((app) => [app.author, app.authorAvatar]))
  ]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([author, avatar]) => ({ value: author, label: author, avatar }))

  const filterFields = [
    {
      id: 'author',
      label: 'Author',
      kind: 'options',
      options: authorOptions,
      match: (app, values) => values.includes(app.author)
    },
    {
      // Listed in the order the promotion path runs — Production, Staging,
      // Development — rather than alphabetically, which would scramble it.
      id: 'infrastructure',
      label: 'Infrastructure',
      kind: 'options',
      options: [
        { value: 'Production', label: 'Production' },
        { value: 'Staging', label: 'Staging' },
        { value: 'Development', label: 'Development' }
      ],
      match: (app, values) => values.includes(app.infrastructure)
    },
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      match: (app, values) => values.includes(app.status)
    },
    {
      // `range`: two windows at once would contradict each other, so a pick
      // replaces rather than accumulates (lib/filter-bar.js).
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      // A hand-picked range is not in `options`, so the chip cannot look up a label for
      // it — this is what turns `{ start, end }` into "Jun 1 – Jun 17" instead of
      // "[object Object]".
      formatValue: formatDateRange,
      match: (app, values) => matchDate(app.modifiedAt, values)
    }
  ]

  // Applications provisioned by the deploy flow lead the list, newest first — the
  // second link of the chain a deploy creates (src/lib/provisioning.js). The
  // seeded rows below them belong to one scope, so they are projected through the
  // organization / account / workspace in force (src/lib/tenancy-scope.js); what
  // this session provisioned is the operator's own and is never projected away.
  const allApplications = computed(() => [
    ...provisionedApplications.value,
    ...tenancyRows(applications.value, 'applications')
  ])

  // The applied state, the search value, the rows that survive the filters, and the
  // pagination they are paged into — all four from one place, so the page cannot
  // forget the rewind that keeps a narrowed list off an empty page offset
  // (src/lib/list-state.js). The chips ARE the applied count; no badge lives beside
  // them, because the badge the old popover needed existed only to describe state
  // the panel was hiding.
  // `loading` is the tenancy reload window: switching organization, account or
  // workspace skeletons the table while the new scope's applications arrive.
  const {
    filters,
    search,
    pagination,
    visibleRows: filteredApplications,
    loading: tenancyReloading
  } = useListFilters(filterFields, allApplications)

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
  // Deploying an application opens the RELEASE COMPOSER (../ReleaseComposer.vue) SCOPED to
  // this application: only its version changes, and every Deployment setting the release
  // lands on keeps the firewall and the custom page it binds. That scope is the difference
  // between this entry and the workload one — here the resource is settled and the target is
  // the question; from a workload both are already answered.
  //
  // The whole scope rides the query string, so the review is linkable and survives a reload.
  const openDeploy = (row) => {
    router.push({
      path: '/deployments/releases/new',
      query: {
        email: userEmail.value,
        scopedType: 'application',
        // A Deployment setting binds resources by NAME (`strategy.attributes`), so the
        // release is scoped by name too — the same key on both sides, never translated.
        resourceId: row.name
      }
    })
  }

  // Deleting an application is the one row action with no undo, so the menu click only
  // ARMS it: the row is held here and the dialog asks for the name back before removing.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    removeDeployment(row.id)
    applications.value = applications.value.filter((app) => app.id !== row.id)
    toast.success(`${row.name} deleted`)
    pendingDelete.value = null
  }

  // Row action menu — Dropdown emits (event, value); `delete` opens the confirmation.
  const onRowAction = (event, value, row) => {
    if (value === 'deploy') {
      openDeploy(row)
      return
    }
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
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
    <!-- THE MEASURE FOLLOWS THE MODE. A list earns the fluid data measure
         (`layout-column`, 7xl): columns are the content, and taking width away from
         them is taking data away. First use has no columns — it is a lead and three
         rows, which at 7xl becomes a title floating over rows
         2.5× longer than they read well at. So the empty version takes Overview's
         FOCUSED measure (4xl), the same one both halves of /home use, and the two
         first screens of the console stop being two different page widths. -->
    <main
      class="flex min-h-full flex-col"
      :class="accountEmpty ? 'layout-column-focused' : 'layout-column'"
    >
      <!-- The page's parent section. A module list opens straight on it (no
           PageHeading — the module name is the breadcrumb crumb), so the
           `:first-child` rule zeroes its step and the boundary is its top space. -->
      <!-- FIRST USE, IN HOME'S CONTAINER.
           The same box the first access uses on /home (./HomeEmptyState.vue) and the
           /empty-states gallery around it (../ProductEmptyStates.vue): centred in the
           viewport rather than hanging from the top edge. This screen and that one are the
           same KIND of screen — a short block answering "there is nothing here yet" — and a
           short block pinned to the top with a void under it reads as content that failed
           to load. The section step is gone with it: a centred box measures from the middle,
           and a top margin would only pull it off centre.
           CENTRED WITH AUTO MARGINS, not `min-h-full justify-center`. That pair looks
           right and does nothing: `min-height: 100%` resolves against a parent whose own
           height is `auto` (main is `min-h-full`, not `h-full`), so the box stayed at
           content height and `justify-center` then centred the content inside itself — a
           no-op. `my-auto` asks the flex parent to split its free space above and below
           this one item, which is the definition of centred; and when the block is TALLER
           than the viewport the auto margins collapse to 0 instead of clipping its top,
           which is what `flex-1 justify-center` would have done. -->
      <div
        v-if="accountEmpty"
        class="my-auto flex w-full flex-col py-(--spacing-xl)"
      >
        <ProductFirstUse :product="firstUse" />
      </div>

      <section
        v-else
        class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)"
      >
        <!-- ONE section: the controls row narrows the table under it, so the two
             sit at --layout-group-gap. -->
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <!-- First-level module list: no PageHeading — the module name already IS the
               header breadcrumb crumb (AppLayout). The page opens with its CONTROLS
               instead — the filter, then the search, the module's own actions on the
               right — and the borderless Table follows in a flush CardBox, framed
               edge-to-edge. -->
          <ControlsHeader>
            <!-- Search drives the table's global filter from outside the card, so the
                 field is a plain InputText (`Table.Search` is context-aware and only
                 works inside `<Table>`). With narrowing moved to the filter bar on its
                 own row below, the field keeps this row to itself: it absorbs all the
                 slack (`grow`) and shares the band only with the module's action. -->
            <InputText
              v-model="search"
              size="large"
              placeholder="Search"
              aria-label="Search applications"
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
              <Button
                label="New Application"
                kind="primary"
                size="large"
                icon="pi pi-plus"
                @click="createApplication"
              />
            </template>
          </ControlsHeader>

          <!-- The filter bar gets its OWN row, between the controls and the table it
               narrows. It cannot share the controls row: the row of chips grows with
               every filter applied, and anything sharing that row would be squeezed by
               a state the user creates — the exact failure the selectors-in-the-band
               version had. On its own row it wraps downwards into empty space, and it
               sits directly above the table so the chips and the rows they explain
               touch. -->
          <FilterBar
            v-model="filters"
            :fields="filterFields"
          />

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
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
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
                    <!-- Domain link (truncates) + external-redirect arrow; copy button
                         pinned to the cell's right edge so it aligns across rows. Shared
                         with Overview's list, which shows these same rows
                         (./ui/DomainCell.vue). -->
                    <DomainCell :value="value" />
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
                        <!-- Deploy leads the menu: it is the one action here that changes
                             what the edge is serving. It opens the release composer scoped
                             to this application (../ReleaseComposer.vue), so only its
                             version changes and the review of what that reaches happens
                             before anything ships. -->
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

      <DeleteDialog
        v-model:open="deleteOpen"
        kind="Application"
        :name="pendingDelete?.name ?? ''"
        @confirm="confirmDelete"
      />
    </main>
  </AppLayout>
</template>
