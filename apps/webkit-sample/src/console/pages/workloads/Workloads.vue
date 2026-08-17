<script setup>
  // Workloads list — the Azion Console "Workloads" module. The app shell (sidebar +
  // GlobalHeader breadcrumb) comes from AppLayout; this page renders a CONTROLS HEADER
  // (filter + search, "Documentation" / "New Workload" on the right)
  // over a data-driven <Table> whose rows open the workload detail view. As a
  // first-level module list it carries no navigation tabs, and no page heading — the
  // module name already IS the header breadcrumb crumb (see ui/ControlsHeader.vue).
  //
  // Narrowing is a FILTER BAR of CHIPS (ui/FilterBar.vue) — the one shape every
  // module list uses, described in the webkit-lists skill. The COLUMNS decide the
  // fields: every enumerable column becomes one field (Author, Status) and the date
  // column becomes relative periods plus a Custom month grid (Last Modified); the
  // free-text columns (Name, Domains) are covered by the search field instead of one
  // field each. The catalog they live in is `filterFields` below.
  //
  // The bar pre-filters `:data`; the search field narrows what is left, through the
  // table's own global filter. See Applications.vue for why the table's own filter
  // state cannot host these.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { provisionedWorkloads, removeDeployment } from '@shared/lib/provisioning'
  import { WORKLOADS } from '@shared/lib/workloads'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ProductFirstUse from '../../components/home/ProductFirstUse.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import DomainOverflowPopover from '../../components/list/DomainOverflowPopover.vue'
  import FilterBar from '../../components/list/FilterBar.vue'
  import LastModifiedCell from '../../components/list/LastModifiedCell.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../../lib/behavior/filter-bar'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { productFirstUse } from '../../lib/data/product-empty-states'
  import { releaseSeedForWorkload } from '../../lib/data/releases'
  import { useSampleMode } from '../../lib/state/sample-mode'
  import { tenancyRows } from '../../lib/state/tenancy-scope'

  // The sample's EMPTY version: this module before it owns anything. The same block
  // the /empty-states gallery reviews, rendered in the module's own page
  // (../lib/sample-mode.js, ./ui/ProductFirstUse.vue).
  const { accountEmpty } = useSampleMode()
  const firstUse = productFirstUse('workloads')

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

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

  // ── The filter catalog ────────────────────────────────────────────────────
  // One field per enumerable column, in the order the COLUMNS read — which is also
  // the order the chips sit in, permanently. Each field owns its own `match`,
  // because only the page knows how a row answers for it: the person here is
  // `owner`, and the column that shows them is "Last Modified".
  //
  // Authors come from the data, so the field can never offer someone with no rows
  // in the list. Each carries that person's photo, so the filter identifies them
  // the way the Last Modified cell does — by face first, name second.
  const authorOptions = [
    ...new Map(workloads.value.map((workload) => [workload.owner, workload.ownerAvatar]))
  ]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([owner, avatar]) => ({ value: owner, label: owner, avatar }))

  const filterFields = [
    {
      id: 'owner',
      label: 'Author',
      kind: 'options',
      options: authorOptions,
      match: (workload, values) => values.includes(workload.owner)
    },
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [
        { value: 'Live', label: 'Live' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      match: (workload, values) => values.includes(workload.status)
    },
    {
      // `range`: two windows at once would contradict each other, so a pick
      // replaces rather than accumulates (lib/filter-bar.js).
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (workload, values) => matchDate(workload.modifiedAt, values)
    }
  ]

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

  // Filter state, search value, surviving rows and their pagination — all four from
  // one place, including the rewind that keeps a narrowed list off a page offset it
  // no longer has rows for (src/lib/list-state.js). `loading` is the tenancy reload
  // window: switching scope skeletons the table while the new rows arrive.
  const {
    filters,
    search,
    pagination,
    visibleRows: filteredWorkloads,
    loading: tenancyReloading
  } = useListFilters(filterFields, allWorkloads, { pageSize: 10 })

  const createWorkload = () =>
    router.push({ path: '/workloads/new', query: { email: userEmail.value } })

  // The name rides along in the query so the detail view can title itself (and
  // derive its resource chain) without a workload endpoint to read from.
  const openWorkload = (event, row) =>
    router.push({
      path: `/workloads/${row.id}`,
      query: { email: userEmail.value, name: row.name }
    })

  // ── Deploy ────────────────────────────────────────────────────────────────
  // Deploying a workload opens the RELEASE COMPOSER (../ReleaseComposer.vue), not a drawer.
  // A workload publishes with a Deployment setting per environment, so deploying it is a
  // multi-target action whose blast radius (environments · workloads · domains) has to be
  // reviewed before it happens — a review that does not fit in a panel, and that has to be
  // linkable and reloadable.
  //
  // NOTHING THE WORKLOAD ALREADY ANSWERS IS ASKED. The composer opens PINNED to what this
  // workload already deploys: its own Deployment settings, selected, and the application it
  // is already serving. Landing on a screen that asks you to re-pick the target you just
  // clicked from is the friction this removes.
  //
  // The whole context rides the query string, so a reload lands in the same scenario:
  //
  //   several settings  ?deploymentIds=a,b&pickTarget=true — both selected, deselect to skip
  //   one setting       ?deploymentIds=a                   — settled, no picker
  //   none yet          no ids                             — the operator selects the target
  const openDeploy = (row) => {
    const { settingsIds } = releaseSeedForWorkload(row.id)
    router.push({
      path: '/deployments/releases/new',
      query: {
        email: userEmail.value,
        workload: row.name,
        workloadId: row.id,
        ...(settingsIds.length ? { deploymentIds: settingsIds.join(',') } : {}),
        ...(settingsIds.length > 1 ? { pickTarget: 'true' } : {})
      }
    })
  }

  // Deleting a workload takes its domains offline, so it does not happen on the menu
  // click: the row is held here and the confirmation dialog asks for its name back.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    removeDeployment(row.id)
    workloads.value = workloads.value.filter((workload) => workload.id !== row.id)
    toast.success(`${row.name} deleted.`)
    pendingDelete.value = null
  }

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
    <!-- The measure follows the mode: the fluid data measure for the list, Overview's
         focused one for first use. The argument is in Applications.vue. -->
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
        class="my-auto flex w-full flex-col py-[var(--spacing-xl)]"
      >
        <ProductFirstUse :product="firstUse" />
      </div>

      <section
        v-else
        class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]"
      >
        <!-- ONE section: the controls row narrows the table under it, so the two
             sit at --layout-group-gap. -->
        <section class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
          <!-- First-level module list: no PageHeading — the module name already IS the
               header breadcrumb crumb (AppLayout). The page opens with its CONTROLS
               instead — the search, the module's own actions on the right — then the
               filter bar, and the borderless Table follows in a flush CardBox. -->
          <ControlsHeader>
            <!-- Search drives the table's global filter from outside the card, so the
                 field is a plain InputText (`Table.Search` is context-aware and only
                 works inside `<Table>`). It keeps the whole row: the filters moved to
                 their own row below, so nothing here competes for the slack. -->
            <InputText
              v-model="search"
              size="large"
              placeholder="Search workloads"
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

          <!-- The filter bar takes its own row rather than sitting in the controls
               header: it grows as filters are applied (a chip gains a value half, and
               a narrow viewport wraps the row), and sharing a row with the search
               would make the field jump width as filters come and go. -->
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
                  <template #cell-name="{ value }">
                    <!-- The module's own glyph leads its principal column, the way every
                         other module list does (Applications, EdgeDns, SqlDatabase): the
                         row says WHAT it is before it says which one. -->
                    <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                      <i
                        class="ai ai-workloads shrink-0 text-[1.15em] text-[var(--text-muted)]"
                        aria-hidden="true"
                      />
                      <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
                    </div>
                  </template>

                  <template #cell-domain="{ row, value }">
                    <!-- Domain glyph, primary domain link (truncates) + arrow, then the
                         "+N" overflow Popover (./ui/DomainOverflowPopover.vue); copy
                         button pinned to the cell's right edge so it aligns across rows.
                         The glyph sits OUTSIDE the anchor — it names the column's subject,
                         it is not part of what the link opens. -->
                    <div class="flex w-full min-w-0 items-center gap-[var(--spacing-xs)]">
                      <i
                        class="ai ai-domains shrink-0 text-[1.15em] text-[var(--text-muted)]"
                        aria-hidden="true"
                      />
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
                      <DomainOverflowPopover
                        v-if="row.domainCount"
                        :domains="row.domains"
                        :count="row.domainCount"
                      />
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
                        <!-- Deploy leads: it is the one action here that changes what
                             this workload serves, and it is the same interaction every
                             resource offers — the workload arrives already chosen. -->
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
        kind="Workload"
        :name="pendingDelete?.name ?? ''"
        @confirm="confirmDelete"
      />
    </main>
  </AppLayout>
</template>
