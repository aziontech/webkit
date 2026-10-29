<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { DATE_PRESETS, formatDateRange, matchDate } from '@shared/lib/filter-bar'
  import FilterButton from '@shared/ui/filter/FilterButton.vue'
  import FilterChips from '@shared/ui/filter/FilterChips.vue'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ArgumentListCell from '../../components/list/ArgumentListCell.vue'
  import AuthorCell from '../../components/list/AuthorCell.vue'
  import ColumnsButton from '../../components/list/ColumnsButton.vue'
  import ConfirmDialog from '../../components/list/ConfirmDialog.vue'
  import ExportButton from '../../components/list/ExportButton.vue'
  import LastModifiedCell from '../../components/list/LastModifiedCell.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../components/page/HeadingAction.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN_WIDE } from '../../lib/behavior/table-columns'
  import {
    purgeLayerOptions,
    PURGES,
    purgeSummary,
    purgeTypeOptions
  } from '../../lib/data/real-time-purge'
  import { addCreatedResource, createdRowsFor } from '../../lib/state/created-resources'
  import { tenancyRows } from '../../lib/state/tenancy-scope'

  const purges = ref([...createdRowsFor('real-time-purge'), ...PURGES])

  const scopedPurges = computed(() => tenancyRows(purges.value, 'real-time-purge', PURGES))

  const columns = [
    {
      accessorKey: 'argumentsText',
      header: 'Arguments',
      principal: true,
      hideable: false,
      grow: 3
    },
    { accessorKey: 'typeLabel', header: 'Type', enableSorting: true, minWidth: TAG_COLUMN_WIDE },
    { accessorKey: 'layerLabel', header: 'Layer', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'author', header: 'Last Editor', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'lastModified', header: 'Purged', enableSorting: true, minWidth: FIT_COLUMN },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const authorOptions = computed(() =>
    [...new Map(scopedPurges.value.map((purge) => [purge.author, purge.authorAvatar]))]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([author, avatar]) => ({ value: author, label: author, avatar }))
  )

  const filterFields = computed(() => [
    {
      id: 'type',
      label: 'Type',
      kind: 'options',
      options: purgeTypeOptions,
      match: (purge, values) => values.includes(purge.type)
    },
    {
      id: 'layer',
      label: 'Layer',
      kind: 'options',
      options: purgeLayerOptions,
      match: (purge, values) => values.includes(purge.layer)
    },
    {
      id: 'author',
      label: 'Last Editor',
      kind: 'options',
      options: authorOptions.value,
      match: (purge, values) => values.includes(purge.author)
    },
    {
      id: 'purged',
      label: 'Purged',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (purge, values) => matchDate(purge.modifiedAt, values)
    }
  ])

  const {
    filters,
    search,
    pagination,
    visibleRows: visiblePurges,
    loading,
    refresh
  } = useListFilters(filterFields, scopedPurges, { pageSize: 10 })

  const filtering = computed(() =>
    Object.values(filters.value).some((values) => values?.length)
  )

  const tableRef = ref(null)

  const columnVisibility = ref({})

  const route = useRoute()
  const router = useRouter()

  const emailQuery = () => ({ email: route.query.email || undefined })

  const create = (source) =>
    router.push({
      path: '/real-time-purge/new',
      query: { ...emailQuery(), repurge: source?.id }
    })

  const clearFilters = () => {
    filters.value = {}
  }

  const pendingRepurge = ref(null)
  const repurgeOpen = ref(false)

  const repurgeDescription = computed(() => {
    const purge = pendingRepurge.value
    if (!purge) return ''
    return `This purges the same ${purgeSummary(purge.type, purge.arguments.length)} from the ${purge.layerLabel} layer again. Each object is fetched from your origin on its next request.`
  })

  const confirmRepurge = () => {
    const purge = pendingRepurge.value
    if (!purge) return
    const { row } = addCreatedResource('real-time-purge', {
      type: purge.type,
      layer: purge.layer,
      arguments: purge.arguments
    })
    if (row) purges.value = [row, ...purges.value]
    toast.success(`Repurge queued for ${purgeSummary(purge.type, purge.arguments.length)}.`, {
      description: 'Cached copies are evicted from every edge location within seconds.'
    })
    pendingRepurge.value = null
  }

  const onRowAction = (event, action, row) => {
    if (action === 'repurge') {
      pendingRepurge.value = row
      repurgeOpen.value = true
      return
    }
    if (action === 'edit') create(row)
  }
</script>

<template>
  <AppLayout
    active="real-time-purge"
    :breadcrumb="[{ label: 'Real-Time Purge' }]"
  >
    <main class="layout-column flex min-h-full flex-col">
      <PageHeading
        size="medium"
        title="Real-Time Purge"
        description="Evict cached content from every edge location. The history keeps the purges of the last 30 days."
      >
        <template #actions>
          <HeadingAction
            label="Create Purge"
            kind="outlined"
            icon="pi pi-plus"
            @click="create()"
          />
        </template>
      </PageHeading>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <ControlsHeader v-if="scopedPurges.length">
            <FilterButton
              v-model="filters"
              :fields="filterFields"
            />
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search arguments"
              aria-label="Search purges by argument"
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
              <RefreshButton
                :loading="loading"
                @refresh="refresh"
              />
              <ExportButton
                :table="tableRef"
                filename="real-time-purge.csv"
              />
              <ColumnsButton
                v-model="columnVisibility"
                :columns="columns"
              />
            </template>
          </ControlsHeader>

          <FilterChips
            v-if="scopedPurges.length"
            v-model="filters"
            :fields="filterFields"
          />

          <section
            v-if="!scopedPurges.length"
            class="flex min-h-0 flex-1 items-center justify-center"
          >
            <CardBox class="w-full max-w-(--container-2xl)">
              <template #content>
                <EmptyState
                  size="medium"
                  title="No purges yet"
                  description="Purge a URL, a cache key, or a wildcard expression to evict it from every edge location."
                  class="flex-1 rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised)"
                >
                  <template #icon>
                    <span
                      class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)"
                    >
                      <i
                        class="ai ai-real-time-purge text-body-md leading-none text-(--text-default)"
                        aria-hidden="true"
                      />
                    </span>
                  </template>
                  <template #actions>
                    <Button
                      label="Create Purge"
                      kind="secondary"
                      size="large"
                      icon="pi pi-plus"
                      @click="create()"
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
                <TableRoot
                  ref="tableRef"
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  v-model:columnVisibility="columnVisibility"
                  :data="visiblePurges"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="10"
                  :border="false"
                  :loading="loading"
                >
                  <template #cell-argumentsText="{ row }">
                    <ArgumentListCell
                      :items="row.arguments"
                      noun="arguments"
                    />
                  </template>

                  <template #cell-typeLabel="{ value }">
                    <Tag
                      :label="value"
                      severity="secondary"
                      size="medium"
                      rounded
                    />
                  </template>

                  <template #cell-layerLabel="{ value }">
                    <span class="truncate text-body-sm text-(--text-default)">{{ value }}</span>
                  </template>

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
                          value="repurge"
                          label="Repurge"
                        >
                          <template #left
                            ><i
                              class="pi pi-refresh"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                        <Dropdown.Option
                          value="edit"
                          label="Edit and Purge"
                        >
                          <template #left
                            ><i
                              class="pi pi-pencil"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                      </Dropdown.Group>
                    </Dropdown>
                  </template>

                  <template #empty>
                    <EmptyState
                      size="small"
                      :title="filtering ? 'No purges match these filters' : 'No purges match this search'"
                      :description="
                        filtering
                          ? 'Clear the filters to see the whole 30-day history.'
                          : 'Search matches the URLs, cache keys, and wildcard expressions a purge ran on.'
                      "
                    >
                      <template #actions>
                        <Button
                          v-if="filtering"
                          label="Clear filters"
                          kind="outlined"
                          size="medium"
                          @click="clearFilters"
                        />
                      </template>
                    </EmptyState>
                  </template>
                </TableRoot>
              </template>
            </CardBox>
          </section>
        </section>
      </section>

      <ConfirmDialog
        v-model:open="repurgeOpen"
        title="Repurge cached content?"
        :description="repurgeDescription"
        confirm-label="Repurge"
        confirm-kind="primary"
        @confirm="confirmRepurge"
      />
    </main>
  </AppLayout>
</template>
