<script setup>
  // Data Stream — the Azion Console "Data Stream" module. The app shell (single sidebar +
  // GlobalHeader with the module breadcrumb) comes from AppLayout; this page renders
  // only its content, in the shape every module list takes (the webkit-lists skill):
  // a PAGE HEADING over a CONTROLS HEADER (search + Filter) over a data-driven <Table>
  // in a flush CardBox. As a first-level module list it carries no navigation tabs; the
  // heading names the module and holds its create action, and the controls row below it
  // only narrows the list (../../components/page/PageHeading.vue).
  //
  // A DATA STREAM ships one SOURCE of events (HTTP requests, WAF events, function
  // invocations…) to one ENDPOINT (an S3 bucket, a Kafka topic, an HTTP collector).
  // Both are what people narrow by — which streams feed Datadog, who is still
  // shipping WAF events — so both become fields.
  //
  // Narrowing is the shared FILTER BUTTON (list/FilterButton.vue), beside the search in
  // the controls row: the COLUMNS decide the fields, the button pre-filters `:data`, and
  // the search narrows what is left through the table's own global filter.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
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

  import ProductFirstUse from '../../components/home/ProductFirstUse.vue'
  import AuthorCell from '../../components/list/AuthorCell.vue'
  import ColumnsButton from '../../components/list/ColumnsButton.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import LastModifiedCell from '../../components/list/LastModifiedCell.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../components/page/HeadingAction.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../../lib/behavior/filter-bar'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { createResourcePath, resourceSettingsPath } from '../../lib/data/create-resources'
  import {
    DATA_STREAMS,
    streamEndpointOptions,
    streamSourceOptions
  } from '../../lib/data/data-streams'
  import { productFirstUse } from '../../lib/data/product-empty-states'
  import { useSampleMode } from '../../lib/state/sample-mode'
  import { tenancyRows } from '../../lib/state/tenancy-scope'

  // The sample's EMPTY version: this module before it owns anything. The same block the
  // /empty-states gallery reviews, rendered in the module's own page
  // (../lib/sample-mode.js, ./ui/ProductFirstUse.vue).
  const { accountEmpty } = useSampleMode()
  const firstUse = productFirstUse('data-stream')

  // This page holds its own copy of the seed because it deletes rows; mutating the
  // shared array would leak that into every surface reading it.
  const streams = ref([...DATA_STREAMS])

  // A data stream belongs to one place in the tenancy chain, so the seed is projected
  // through the organization / account / workspace in force (src/lib/tenancy-scope.js).
  const scopedStreams = computed(() => tenancyRows(streams.value, 'data-stream'))

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'sourceLabel', header: 'Source', enableSorting: true, grow: 2 },
    { accessorKey: 'endpointLabel', header: 'Endpoint', enableSorting: true, grow: 2 },
    { accessorKey: 'samplingLabel', header: 'Sampling' },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'author', header: 'Last Editor', enableSorting: true, grow: 2 },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // ── The filter catalog ────────────────────────────────────────────────────
  // Source, Endpoint and Status are the enumerable columns; Sampling is a
  // percentage and Name is free text, covered by the search field.
  const filterFields = [
    {
      id: 'source',
      label: 'Source',
      kind: 'options',
      options: streamSourceOptions,
      match: (stream, values) => values.includes(stream.source)
    },
    {
      id: 'endpoint',
      label: 'Endpoint',
      kind: 'options',
      options: streamEndpointOptions,
      match: (stream, values) => values.includes(stream.endpoint)
    },
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      match: (stream, values) => values.includes(stream.status)
    },
    {
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (stream, values) => matchDate(stream.modifiedAt, values)
    }
  ]

  // Filter state, search value, surviving rows and their pagination — one place,
  // including the rewind that keeps a narrowed list off a page offset it no longer
  // has rows for (src/lib/list-state.js). `loading` is the tenancy reload window.
  const {
    filters,
    search,
    pagination,
    visibleRows: visibleStreams,
    loading: tenancyReloading
  } = useListFilters(filterFields, scopedStreams, { pageSize: 8 })

  // Which columns are switched off, driven by the Columns button beside the filter
  // (../../components/list/ColumnsButton.vue). Only a HIDDEN column is ever recorded, so this
  // never has to be kept in step with the column model above.
  //
  // ID SHIPS OFF. It is the column an operator wants when they are quoting a resource
  // into a support thread or an API call, and almost never while scanning the list —
  // so it starts hidden and is one switch away. That is the whole point of the panel:
  // a column can be available without being in the way by default.
  const columnVisibility = ref({ id: false })

  // Creating: the module's own create page. Its fields come from this resource's
  // POST body in the Azion v4 API (../lib/create-resources.js), so the form asks for
  // what the platform actually takes. The email rides along the way every route in this
  // prototype carries it.
  const route = useRoute()
  const router = useRouter()

  const create = () =>
    router.push({
      path: createResourcePath('data-stream'),
      query: { email: route.query.email || undefined }
    })

  // Deleting is the one row action here with no undo, so the menu click only ARMS it:
  // the row is held until the dialog has been given its name back.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    streams.value = streams.value.filter((item) => item.id !== row.id)
    toast.success(`${row.name} deleted.`)
    pendingDelete.value = null
  }

  const onRowAction = (event, action, row) => {
    // EDIT OPENS THE SETTINGS PAGE. It used to raise "edit is disabled in the demo", which
    // left a reader able to create a data stream and unable to change one. The page is
    // generated from the same fields as the create page (../lib/create-resources.js via
    // ./ResourceSettings.vue), and the row hands over the name it already knows.
    if (action === 'edit') {
      router.push({
        path: resourceSettingsPath('data-stream', row.id),
        query: { name: row.name, email: route.query.email || undefined }
      })
      return
    }
    if (action === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    toast.info(row.name, { description: `${action} is disabled in the demo.` })
  }

  const statusSeverity = (status) =>
    ({ Active: 'success', Inactive: 'secondary' })[status] ?? 'secondary'
</script>

<template>
  <AppLayout
    active="data-stream"
    :breadcrumb="[{ label: 'Data Stream' }]"
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
        title="Data Stream"
        description="Ship edge events to your own observability or storage platform."
        :documentation="firstUse.learnMore.href"
      >
        <template #actions>
          <HeadingAction
            label="Create data stream"
            kind="primary"
            icon="pi pi-plus"
            @click="create"
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
        class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)"
      >
        <!-- ONE band: the controls, the filters and the rows they narrow. -->
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <ControlsHeader v-if="scopedStreams.length">
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search data streams"
              aria-label="Search data streams"
              class="min-w-36 grow basis-(--container-2xs)"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </InputText>
            <FilterButton
              v-model="filters"
              :fields="filterFields"
            />
            <ColumnsButton
              v-model="columnVisibility"
              :columns="columns"
            />
          </ControlsHeader>

          <FilterChips
            v-if="scopedStreams.length"
            v-model="filters"
            :fields="filterFields"
          />

          <!-- Empty = one clear next action; otherwise the borderless Table in a
               flush CardBox, framed edge-to-edge. -->
          <section
            v-if="!scopedStreams.length"
            class="flex min-h-0 flex-1 items-center justify-center"
          >
            <CardBox class="w-full max-w-(--container-2xl)">
              <template #content>
                <EmptyState
                  size="medium"
                  title="No data streams yet"
                  description="Create a stream to ship edge events to your own observability or storage platform."
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
                          class="ai ai-data-stream text-[1rem] leading-none text-(--text-default)"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </template>
                  <template #actions>
                    <Button
                      label="Create data stream"
                      kind="secondary"
                      size="large"
                      icon="pi pi-plus"
                      @click="create"
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
                  v-model:columnVisibility="columnVisibility"
                  :data="visibleStreams"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="8"
                  :border="false"
                  :loading="tenancyReloading"
                >
                  <template #cell-status="{ value }">
                    <Tag
                      :label="value"
                      :severity="statusSeverity(value)"
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

                  <template #cell-lastModified="{ row }">
                    <LastModifiedCell :date="row.modifiedAt" />
                  </template>

                  <template #cell-actions="{ row }">
                    <Dropdown
                      placement="bottom-end"
                      @select="(event, action) => onRowAction(event, action, row)"
                    >
                      <Dropdown.Trigger>
                        <Tooltip text="Actions">
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
                          <template #left
                            ><i
                              class="pi pi-pencil"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                        <Dropdown.Option
                          value="clone"
                          label="Clone"
                        >
                          <template #left
                            ><i
                              class="pi pi-clone"
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
        kind="Data stream"
        :name="pendingDelete?.name ?? ''"
        @confirm="confirmDelete"
      />
    </main>
  </AppLayout>
</template>
