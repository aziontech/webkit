<script setup>
  // Edge DNS — the zone list for the Azion Console "Edge DNS" module (Secure
  // area). The app shell (sidebar + GlobalHeader with the module breadcrumb)
  // comes from AppLayout; this page renders only its content: a PageHeading
  // (title + description + the module's primary actions) over a data-driven
  // <Table> of authoritative DNS zones.
  //
  // The header carries two actions: "Copy nameserver values" (copies Azion's
  // authoritative nameservers so the user can delegate any domain) and the primary
  // "Zone" create. When there are no zones the whole content region swaps to an
  // EmptyState with the single next action (the /ux-heuristics "empty = one clear
  // action" rule).
  //
  // Narrowing is the FILTER BUTTON (list/FilterButton.vue) — the one shape every
  // module list uses, described in the webkit-lists skill. The COLUMNS decide the
  // fields: every enumerable column becomes one field (Author, Status) and the date
  // column becomes relative periods plus a Custom month grid (Last Modified); the
  // free-text columns (Name, ID, Domain) are covered by the search field instead of
  // one field each. The button pre-filters `:data`; the search field narrows what is
  // left, through the table's own global filter.
  //
  // This replaced, in two steps, the field/operator/value builder that used to sit
  // in the table's own toolbar (`Table.Filter` / `Table.AppliedFilters`): it could
  // not be hoisted out of the card (both read the table's filter state through
  // `inject`), and its operator column offered `is one of` on every row — a control
  // with one option.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { daysAgo, formatListDate } from '@shared/lib/dates'
  import { authorAt } from '@shared/lib/people'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ProductFirstUse from '../../components/home/ProductFirstUse.vue'
  import AuthorCell from '../../components/list/AuthorCell.vue'
  import ColumnsButton from '../../components/list/ColumnsButton.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import ExportButton from '../../components/list/ExportButton.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import IdCell from '../../components/list/IdCell.vue'
  import LastModifiedCell from '../../components/list/LastModifiedCell.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../components/page/HeadingAction.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../../lib/behavior/filter-bar'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN } from '../../lib/behavior/table-columns'
  import { NAMESERVERS } from '../../lib/data/edge-dns'
  import { productFirstUse } from '../../lib/data/product-empty-states'
  import { useSampleMode } from '../../lib/state/sample-mode'
  import { tenancyRows } from '../../lib/state/tenancy-scope'

  // The sample's EMPTY version: this module before it owns anything. The same block the
  // /empty-states gallery reviews, rendered in the module's own page
  // (../lib/sample-mode.js, ./ui/ProductFirstUse.vue).
  const { accountEmpty } = useSampleMode()
  const firstUse = productFirstUse('edge-dns')

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // The zones that back the table (data-driven mode). The Last Modified avatar
  // comes from the shared team roster (src/lib/people.js), assigned round-robin.
  //
  // `modifiedAt` is the real instant — the Last Modified filter compares it — and
  // `lastModified` (the sortable display string) is derived from it by one
  // formatter, never hand-written per row: parsing a display string back into a
  // Date is engine-dependent, so a filter built on it would compare garbage on
  // some browsers (src/lib/dates.js).
  const zones = ref(
    [
      {
        id: '6442',
        name: 'test',
        domain: 'edgeflow.com',
        status: 'Active',
        dnssec: false,
        modifiedAt: daysAgo(10)
      },
      {
        id: '6463',
        name: 'Azion Design',
        domain: 'azion.design',
        status: 'Active',
        dnssec: true,
        modifiedAt: daysAgo(18)
      }
    ].map((zone, index) => {
      const person = authorAt(index)
      return {
        ...zone,
        lastModified: formatListDate(zone.modifiedAt),
        author: person.name,
        authorAvatar: person.avatar
      }
    })
  )

  // Switching organization, account or workspace reloads the module: the table
  // shows skeletons while the new scope's zones arrive (src/lib/tenancy-reload.js),
  // and the zones themselves are that scope's — a DNS zone belongs to one place in
  // the tenancy chain (src/lib/tenancy-scope.js).
  const scopedZones = computed(() => tenancyRows(zones.value, 'edge-dns'))

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'domain', header: 'Domain', enableSorting: true, grow: 3 },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: TAG_COLUMN },
    { accessorKey: 'author', header: 'Last Editor', enableSorting: true, minWidth: FIT_COLUMN },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // ── The filter catalog ────────────────────────────────────────────────────
  // One field per enumerable column, in the order the COLUMNS read. Authors come
  // from the data, so the field can never offer someone with no zones in the list.
  // (The column is "Last Modified"; the person renders inside that cell as
  // `author`.) Each carries that person's photo, so the filter identifies them the
  // way the cell does — by face first, name second.
  const authorOptions = [...new Map(zones.value.map((zone) => [zone.author, zone.authorAvatar]))]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([author, avatar]) => ({ value: author, label: author, avatar }))

  const filterFields = [
    {
      id: 'author',
      label: 'Author',
      kind: 'options',
      options: authorOptions,
      match: (zone, values) => values.includes(zone.author)
    },
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      match: (zone, values) => values.includes(zone.status)
    },
    {
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (zone, values) => matchDate(zone.modifiedAt, values)
    }
  ]

  // Filter state, search value, surviving rows and their pagination — one place,
  // including the rewind (src/lib/list-state.js). `loading` is the tenancy reload
  // window.
  const {
    filters,
    search,
    pagination,
    visibleRows: filteredZones,
    loading,
    refresh
  } = useListFilters(filterFields, scopedZones)

  // The table the controls row drives. Download CSV calls the DS's own `exportCsv()`
  // through it (../../components/list/ExportButton.vue), so the file honours the
  // visible columns and the filtered rows instead of re-serialising them here.
  const tableRef = ref(null)

  // Which columns are switched off, driven by the Columns button beside the filter
  // (../../components/list/ColumnsButton.vue). Only a HIDDEN column is ever recorded, so this
  // never has to be kept in step with the column model above.
  //
  // ID SHIPS OFF. It is the column an operator wants when they are quoting a resource
  // into a support thread or an API call, and almost never while scanning the list —
  // so it starts hidden and is one switch away. That is the whole point of the panel:
  // a column can be available without being in the way by default.
  const columnVisibility = ref({ id: false })

  // Copy Azion's authoritative nameservers so the user can delegate a domain
  // without opening a zone first.
  const copyNameservers = async () => {
    try {
      await navigator.clipboard.writeText(NAMESERVERS.join('\n'))
      toast.success('Nameserver values copied.', {
        description: 'Add them in your domain provider to delegate the domain.'
      })
    } catch (error) {
      toast.error('Could not copy the nameservers.', {
        description: error?.message ?? "Copy them manually from a zone's settings."
      })
    }
  }

  // Entering the module and choosing "create" opens the dedicated create PAGE (a
  // focused creation shell at /edge-dns/new), not a modal — see CreateZone.vue.
  const createZone = () => router.push({ path: '/edge-dns/new', query: { email: userEmail.value } })

  // Opening a zone enters its detail view (Main Settings / Records tabs), carrying
  // its name + domain so the header and Records drawer read them without a
  // round-trip.
  const openZone = (event, row) =>
    router.push({
      path: `/edge-dns/${row.id}`,
      query: { email: userEmail.value, name: row.name, domain: row.domain }
    })

  // Deleting is the one row action with no undo, so the menu click only ARMS it: the
  // row waits here until the dialog has been given its name back.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    zones.value = zones.value.filter((zone) => zone.id !== row.id)
    toast.success(`Zone "${row.name}" deleted.`)
    pendingDelete.value = null
  }

  const onRowAction = (event, value, row) => {
    if (value === 'open') {
      openZone(event, row)
      return
    }
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    toast.info(`Editing ${row.name}`, { description: `Zone ID ${row.id}` })
  }
</script>

<template>
  <AppLayout
    active="edge-dns"
    :breadcrumb="[{ label: 'Edge DNS' }]"
  >
    <main
      class="flex min-h-full flex-col"
      :class="accountEmpty ? 'layout-column-focused' : 'layout-column'"
    >
      <!-- THE PAGE HEADING. A first-level resource page names itself: the module name
           over one line saying what the module is, with the module's own action on the
           right. The breadcrumb says WHERE you are; the heading says WHAT this page is,
           and it gives that action one fixed home above the list instead of a control
           that rides the row narrowing it.
           The action stays here over an EMPTY list as well: where a page's action sits is
           a property of the page, not of how many rows it has. The empty state's own
           button is the in-content door — a `secondary` inside the card — not this same
           control moving.
           `size="medium"` is the first-level list scale (components/page/PageHeading.vue):
           the title names the collection, and the table under it is what the page is for.
           The parent section below is no longer `:first-child`, so `.layout-section-start`
           opens it at the boundary step — the list sits tight under the heading (theme
           semantic/layouts § "THE PAGE SHAPE"). -->
      <PageHeading
        v-if="!accountEmpty"
        size="medium"
        title="Edge DNS"
        description="Host authoritative DNS zones and serve authoritative DNS responses used to resolve domain names."
        :documentation="firstUse.learnMore.href"
      >
        <template #actions>
          <HeadingAction
            label="Copy nameserver values"
            kind="outlined"
            icon="pi pi-copy"
            @click="copyNameservers"
          />
          <HeadingAction
            label="Create zone"
            kind="primary"
            icon="pi pi-plus"
            @click="createZone"
          />
        </template>
      </PageHeading>

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
        class="layout-section-start flex min-h-0 min-w-0 flex-1 flex-col gap-(--layout-section-gap)"
      >
        <!-- ONE section — the module's list band: either the controls row over the
             table it narrows (at --layout-group-gap), or the empty state that replaces
             both. `flex-1` is passed down from the parent so that empty state can
             still centre itself in the page. -->
        <section class="flex min-h-0 min-w-0 flex-1 flex-col gap-(--layout-group-gap)">
          <!-- The CONTROLS row, under the heading: the narrowing, on a list the page can
               already show — search on the left, nothing on the right, because the
               module's action sits in the heading above.
               Rendered only when there are rows: a search field with nothing to search is
               noise. -->
          <ControlsHeader v-if="scopedZones.length">
            <FilterButton
              v-model="filters"
              :fields="filterFields"
            />
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search zones"
              aria-label="Search zones"
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
                   than narrow it — fetch it again, take it away as a file, choose which
                   columns it shows. All glyphs, all `medium`, so the row shares one
                   32px height with the field and the Filter button opposite. -->
              <RefreshButton
                :loading="loading"
                @refresh="refresh"
              />
              <ExportButton
                :table="tableRef"
                filename="dns-zones.csv"
              />
              <ColumnsButton
                v-model="columnVisibility"
                :columns="columns"
              />
            </template>
          </ControlsHeader>

          <FilterChips
            v-if="scopedZones.length"
            v-model="filters"
            :fields="filterFields"
          />

          <!-- Empty = one clear next action; otherwise the borderless Table in a
               flush CardBox, framed edge-to-edge. -->
          <section
            v-if="!scopedZones.length"
            class="flex min-h-0 flex-1 items-center justify-center"
          >
            <CardBox class="w-full max-w-(--container-2xl)">
              <template #content>
                <EmptyState
                  size="medium"
                  title="No zones yet"
                  description="Create your first zone to host a domain on Azion's authoritative DNS."
                  class="flex-1 rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised)"
                >
                  <template #icon>
                    <span class="relative flex size-10 items-center justify-center">
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                      />
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                      />
                      <span
                        class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)"
                      >
                        <i
                          class="ai ai-edge-dns text-[1rem] leading-none text-(--text-default)"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </template>
                  <template #actions>
                    <Button
                      label="Create zone"
                      kind="secondary"
                      size="large"
                      icon="pi pi-plus"
                      @click="createZone"
                    />
                  </template>
                </EmptyState>
              </template>
            </CardBox>
          </section>

          <section
            v-else
            class="flex min-h-0 flex-col"
          >
            <CardBox :padded="false">
              <template #content>
                <Table
                  ref="tableRef"
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  v-model:columnVisibility="columnVisibility"
                  :data="filteredZones"
                  :loading="loading"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="8"
                  :border="false"
                  @row-click="openZone"
                >
                  <template #cell-name="{ value }">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <i
                        class="ai ai-edge-dns shrink-0 text-[1.15em] text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
                    </div>
                  </template>

                  <template #cell-id="{ value }">
                    <IdCell
                      :value="value"
                      resource="zone"
                    />
                  </template>

                  <!-- Domain cell: link + external arrow, copy button pinned to the
                       cell's right edge so it aligns across rows. -->
                  <template #cell-domain="{ value }">
                    <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
                      <a
                        :href="`https://${value}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex min-w-0 items-center gap-(--spacing-xxs) hover:underline"
                        @click.stop
                      >
                        <span class="truncate">{{ value }}</span>
                        <i
                          class="pi pi-arrow-up-right shrink-0 text-(--text-muted)"
                          aria-hidden="true"
                        />
                      </a>
                      <CopyButton
                        kind="outlined"
                        :value="value"
                        aria-label="Copy domain name"
                        class="ml-auto shrink-0"
                        @click.stop
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
                  <!-- WHO and WHEN are two columns now, so each cell says one thing:
                       the face and the name here, the relative time next to it. -->
                  <template #cell-author="{ row }">
                    <AuthorCell
                      :author="row.author"
                      :avatar-src="row.authorAvatar"
                    />
                  </template>

                  <template #cell-lastModified="{ value }">
                    <LastModifiedCell :date="value" />
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
                          value="open"
                          label="Open"
                        >
                          <template #left
                            ><i
                              class="pi pi-arrow-up-right"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                        <Dropdown.Option
                          value="edit"
                          label="Edit"
                        >
                          <template #left
                            ><i
                              class="pi pi-pencil"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                      </Dropdown.Group>

                      <Dropdown.Group>
                        <Dropdown.Option
                          value="delete"
                          label="Delete"
                        >
                          <template #left
                            ><i
                              class="pi pi-trash"
                              aria-hidden="true"
                          /></template>
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
        kind="Zone"
        :name="pendingDelete?.name ?? ''"
        @confirm="confirmDelete"
      />
    </main>
  </AppLayout>
</template>
