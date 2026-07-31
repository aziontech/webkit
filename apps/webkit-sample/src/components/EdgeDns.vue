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
  // Narrowing is a SELECTOR PER COLUMN (the same model as Applications and
  // Workloads), and the COLUMNS decide the fields: every enumerable column gets a
  // multiple Select (Authors, Status) and the date column gets a plain DATE PICKER
  // (Calendar, `mode="range"`); the free-text columns (Name, ID, Domain) are covered
  // by the search field instead of one field each. They live inside the FILTER
  // POPOVER behind one IconButton (ui/FilterPopover.vue) — the module list pattern —
  // so the controls row is filter + search, and the trigger's badge says how many
  // fields are set. They pre-filter `:data`; the search field narrows what is left,
  // through the table's own global filter. This replaces the field/operator/value
  // builder that used to sit in the table's own toolbar (`Table.Filter` /
  // `Table.AppliedFilters`), which could not be hoisted out of the card: both read
  // the table's filter state through `inject`.
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Calendar from '@aziontech/webkit/calendar'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Select from '@aziontech/webkit/select'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { daysAgo, formatListDate, withinRange } from '../lib/dates'
  import { NAMESERVERS } from '../lib/edge-dns'
  import { filterDisplay } from '../lib/filters'
  import { authorAt } from '../lib/people'
  import { useTenancyReload } from '../lib/tenancy-reload'
  import { tenancyRows } from '../lib/tenancy-scope'
  import AppLayout from './ui/AppLayout.vue'
  import ControlsHeader from './ui/ControlsHeader.vue'
  import FilterPopover from './ui/FilterPopover.vue'
  import LastModifiedCell from './ui/LastModifiedCell.vue'

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
  const { tenancyReloading } = useTenancyReload()
  const scopedZones = computed(() => tenancyRows(zones.value, 'edge-dns'))

  // Free-text search. The field lives in the page's ControlsHeader, above the card, so it
  // is a plain InputText bound to the table's `v-model:globalFilter` — the context-aware
  // `Table.Search` only works inside `<Table>`. The table still owns the matching (every
  // visible column, TanStack's global filter), so the behaviour is identical to the
  // toolbar version it replaces.
  const search = ref('')

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true },
    { accessorKey: 'id', header: 'ID', enableSorting: true },
    { accessorKey: 'domain', header: 'Domain', enableSorting: true, grow: 3 },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // ── Column selectors ──────────────────────────────────────────────────────
  // Authors come from the data, so the selector can never offer someone with no
  // zones in the list. (The column is "Last Modified"; the person renders inside
  // that cell as `author`.) Each option carries that person's photo, so the filter
  // identifies them the same way the cell does — by face first, name second.
  const authorOptions = [...new Map(zones.value.map((zone) => [zone.author, zone.authorAvatar]))]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([author, avatar]) => ({ value: author, label: author, avatar }))

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ]

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

  // The selectors pre-filter `:data`; the search field then narrows what is left
  // through the table's own global filter.
  const filteredZones = computed(() =>
    scopedZones.value.filter((zone) => {
      if (authorFilter.value.length && !authorFilter.value.includes(zone.author)) return false
      if (statusFilter.value.length && !statusFilter.value.includes(zone.status)) return false
      return withinRange(zone.modifiedAt, modifiedRange.value)
    })
  )

  // External `:data` filtering does not trip TanStack's `autoResetPageIndex`, so
  // own the pagination state and rewind to the first page when a filter changes —
  // or when a tenancy-scope switch narrows the list the same way.
  const pagination = ref({ pageIndex: 0, pageSize: 8 })
  watch([authorFilter, statusFilter, modifiedRange, tenancyReloading], () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })

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

  const onRowAction = (event, value, row) => {
    if (value === 'open') {
      openZone(event, row)
      return
    }
    if (value === 'delete') {
      zones.value = zones.value.filter((zone) => zone.id !== row.id)
      toast.success(`Zone "${row.name}" deleted.`)
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
    <main class="layout-column flex min-h-full flex-col">
      <!-- The page's parent section. A module list opens straight on it (no
           PageHeading — the module name is the breadcrumb crumb), so the
           `:first-child` rule zeroes its step and the boundary is its top space. -->
      <section
        class="layout-section-start flex min-h-0 min-w-0 flex-1 flex-col gap-[var(--layout-section-gap)]"
      >
        <!-- ONE section — the module's list band: either the controls row over the
             table it narrows (at --layout-group-gap), or the empty state that replaces
             both. `flex-1` is passed down from the parent so that empty state can
             still centre itself in the page. -->
        <section class="flex min-h-0 min-w-0 flex-1 flex-col gap-[var(--layout-group-gap)]">
          <!-- First-level module list: no PageHeading — the module name already IS the
               header breadcrumb crumb (AppLayout). The page opens with its CONTROLS row
               (the filter, then the search, the module's own actions on the right); the
               borderless Table follows in a flush CardBox. -->
          <ControlsHeader v-if="scopedZones.length">
            <!-- The column selectors, collapsed behind one icon (ui/FilterPopover.vue) —
                 the same filter the other module lists carry. They apply as they are
                 picked; the badge on the trigger reports how many are set. -->
            <FilterPopover
              :count="activeFilterCount"
              description="Narrow zones by author, when they last changed, or status."
              @clear="clearFilters"
            >
              <Select
                v-model="authorFilter"
                multiple
                size="large"
                placeholder="All Authors"
                :display-value="filterDisplay('All Authors', authorOptions)"
              >
                <Select.Trigger aria-label="Filter by author" />
                <Select.Content>
                  <Select.Option
                    v-for="option in authorOptions"
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
                </Select.Content>
              </Select>

              <!-- Last Modified is a plain DATE PICKER: one field, one panel, a month
                   grid. No `:presets` (that splits the trigger into a preset dropdown +
                   the range, two controls for one filter) and no `period` (that swaps the
                   whole thing for the relative-span parser). `clearable` is live in this
                   single-part branch, so resetting is one click on the field;
                   `:show-fields="false"` drops the Start/End text inputs, which restate
                   what the grid already says.

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
    </main>
  </AppLayout>
</template>
