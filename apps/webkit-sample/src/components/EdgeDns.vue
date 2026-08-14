<script setup>
  // Edge DNS — the zone list for the Azion Console "Edge DNS" module (Secure
  // area). The app shell (sidebar + GlobalHeader with the module breadcrumb)
  // comes from AppLayout; this page renders only its content: a PageHeading
  // (title + description + the module's primary actions) over a data-driven
  // <Table> of authoritative DNS zones.
  //
  // The header carries two actions: "Copy Nameserver Values" (copies Azion's
  // authoritative nameservers so the user can delegate any domain) and the primary
  // "Zone" create. When there are no zones the whole content region swaps to an
  // EmptyState with the single next action (the /ux-heuristics "empty = one clear
  // action" rule).
  //
  // Narrowing is a FILTER BAR of CHIPS (ui/FilterBar.vue) — the one shape every
  // module list uses, described in the webkit-lists skill. The COLUMNS decide the
  // fields: every enumerable column becomes one field (Author, Status) and the date
  // column becomes relative periods plus a Custom month grid (Last Modified); the
  // free-text columns (Name, ID, Domain) are covered by the search field instead of
  // one field each. The bar pre-filters `:data`; the search field narrows what is
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
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { daysAgo, formatListDate } from '../lib/dates'
  import { NAMESERVERS } from '../lib/edge-dns'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../lib/filter-bar'
  import { useListFilters } from '../lib/list-state'
  import { authorAt } from '../lib/people'
  import { useSampleMode } from '../lib/sample-mode'
  import { tenancyRows } from '../lib/tenancy-scope'
  import { productFirstUse } from '../product-empty-states'
  import AppLayout from './ui/AppLayout.vue'
  import ControlsHeader from './ui/ControlsHeader.vue'
  import DeleteDialog from './ui/DeleteDialog.vue'
  import FilterBar from './ui/FilterBar.vue'
  import LastModifiedCell from './ui/LastModifiedCell.vue'
  import ProductFirstUse from './ui/ProductFirstUse.vue'

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
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true },
    { accessorKey: 'id', header: 'ID', enableSorting: true },
    { accessorKey: 'domain', header: 'Domain', enableSorting: true, grow: 3 },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
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
    loading: tenancyReloading
  } = useListFilters(filterFields, scopedZones)

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
        class="layout-section-start flex min-h-0 min-w-0 flex-1 flex-col gap-[var(--layout-section-gap)]"
      >
        <!-- ONE section — the module's list band: either the controls row over the
             table it narrows (at --layout-group-gap), or the empty state that replaces
             both. `flex-1` is passed down from the parent so that empty state can
             still centre itself in the page. -->
        <section class="flex min-h-0 min-w-0 flex-1 flex-col gap-[var(--layout-group-gap)]">
          <!-- First-level module list: no PageHeading — the module name already IS the
               header breadcrumb crumb (AppLayout). The page opens with its CONTROLS row
               (the search, the module's own actions on the right), then the filter bar;
               the borderless Table follows in a flush CardBox. -->
          <ControlsHeader v-if="scopedZones.length">
            <InputText
              v-model="search"
              size="large"
              placeholder="Search zones..."
              aria-label="Search zones"
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
                label="Copy Nameserver Values"
                kind="outlined"
                size="large"
                icon="pi pi-copy"
                @click="copyNameservers"
              />
              <Button
                label="Zone"
                kind="primary"
                size="large"
                icon="pi pi-plus"
                @click="createZone"
              />
            </template>
          </ControlsHeader>

          <!-- The filter bar takes its own row: it grows as filters are applied, and
               sharing the controls row would make the search field jump width as
               chips come and go. It follows the controls row's own condition — with
               no zones there is nothing to narrow, and the empty state below owns
               the page. -->
          <FilterBar
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
            <CardBox class="w-full max-w-[var(--container-2xl)]">
              <template #content>
                <EmptyState
                  size="medium"
                  title="No zones yet"
                  description="Create your first zone to host a domain on Azion's authoritative DNS."
                  class="flex-1 rounded-[var(--shape-card)] border border-dashed border-[var(--border-default)] bg-[var(--bg-surface-raised)]"
                >
                  <template #icon>
                    <span class="relative flex size-10 items-center justify-center">
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] opacity-5"
                      />
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-[var(--shape-card)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] opacity-10"
                      />
                      <span
                        class="relative flex size-10 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)]"
                      >
                        <i
                          class="ai ai-edge-dns text-[1rem] leading-none text-[var(--text-default)]"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </template>
                  <template #actions>
                    <Button
                      label="Create Zone"
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
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  :data="filteredZones"
                  :loading="tenancyReloading"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="8"
                  :border="false"
                  @row-click="openZone"
                >
                  <template #cell-name="{ value }">
                    <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                      <i
                        class="ai ai-edge-dns shrink-0 text-[1.15em] text-[var(--text-muted)]"
                        aria-hidden="true"
                      />
                      <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
                    </div>
                  </template>

                  <template #cell-id="{ value }">
                    <div class="flex w-full min-w-0 items-center gap-[var(--spacing-xs)]">
                      <!-- An id is data, not code: it keeps the cell's own type and
                           --text-default, so every column of a row reads at one weight
                           (Applications.vue renders its ID column the same way). -->
                      <span class="min-w-0 truncate">{{ value }}</span>
                      <CopyButton
                        kind="outlined"
                        :value="value"
                        aria-label="Copy zone ID"
                        class="ml-auto shrink-0"
                        @click.stop
                      />
                    </div>
                  </template>

                  <!-- Domain cell: link + external arrow, copy button pinned to the
                       cell's right edge so it aligns across rows. -->
                  <template #cell-domain="{ value }">
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

                  <template #cell-lastModified="{ value, row }">
                    <LastModifiedCell
                      :author="row.author"
                      :avatar-src="row.authorAvatar"
                      :date="value"
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
