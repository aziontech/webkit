<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ProductFirstUse from '../../components/home/ProductFirstUse.vue'
  import AuthorCell from '../../components/list/AuthorCell.vue'
  import ColumnsButton from '../../components/list/ColumnsButton.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import DomainOverflowPopover from '../../components/list/DomainOverflowPopover.vue'
  import ExportButton from '../../components/list/ExportButton.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import IdCell from '../../components/list/IdCell.vue'
  import LastModifiedCell from '../../components/list/LastModifiedCell.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../components/page/HeadingAction.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import ResourceLink from '../../components/resource/ResourceLink.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../../lib/behavior/filter-bar'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN } from '../../lib/behavior/table-columns'
  import { productFirstUse } from '../../lib/data/product-empty-states'
  import { provisionedWorkloads, removeDeployment } from '../../lib/data/provisioning'
  import { WORKLOADS } from '../../lib/data/workloads'
  import { useSampleMode } from '../../lib/state/sample-mode'
  import { tenancyRows } from '../../lib/state/tenancy-scope'

  const { accountEmpty } = useSampleMode()
  const firstUse = productFirstUse('workloads')

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const workloads = ref([...WORKLOADS])

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', minWidth: FIT_COLUMN },
    { accessorKey: 'domain', header: 'Domains', grow: 2 },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: TAG_COLUMN },
    { accessorKey: 'owner', header: 'Last Editor', enableSorting: true, minWidth: FIT_COLUMN },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { id: 'actions', kind: 'action', hideable: false }
  ]

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
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (workload, values) => matchDate(workload.modifiedAt, values)
    }
  ]

  const allWorkloads = computed(() => [
    ...provisionedWorkloads.value,
    ...tenancyRows(workloads.value, 'workloads')
  ])

  const showFirstUse = computed(() => accountEmpty.value && allWorkloads.value.length === 0)

  const {
    filters,
    search,
    pagination,
    visibleRows: filteredWorkloads,
    loading,
    refresh
  } = useListFilters(filterFields, allWorkloads, { pageSize: 10 })

  const tableRef = ref(null)

  const columnVisibility = ref({ id: false })

  const createWorkload = () =>
    router.push({ path: '/workloads/new', query: { email: userEmail.value } })

  const openWorkload = (event, row) =>
    router.push({
      path: `/workloads/${row.id}`,
      query: { email: userEmail.value, name: row.name }
    })

  const openDeploy = (row) =>
    router.push({
      path: `/workloads/${row.id}`,
      query: { email: userEmail.value, name: row.name, deploy: '1' }
    })

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
    <main
      class="flex min-h-full flex-col"
      :class="showFirstUse ? 'layout-column-focused' : 'layout-column'"
    >
      <PageHeading
        v-if="!showFirstUse"
        size="medium"
        title="Workloads"
        description="View and manage your workloads."
        :documentation="firstUse.learnMore.href"
      >
        <template #actions>
          <HeadingAction
            label="Create Workload"
            kind="outlined"
            icon="pi pi-plus"
            @click="createWorkload"
          />
        </template>
      </PageHeading>

      <div
        v-if="showFirstUse"
        class="my-auto flex w-full flex-col py-(--spacing-xl)"
      >
        <ProductFirstUse :product="firstUse" />
      </div>

      <section
        v-else
        class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)"
      >
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <ControlsHeader>
            <FilterButton
              v-model="filters"
              :fields="filterFields"
            />
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search workloads"
              aria-label="Search workloads"
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
                filename="workloads.csv"
              />
              <ColumnsButton
                v-model="columnVisibility"
                :columns="columns"
              />
            </template>
          </ControlsHeader>

          <FilterChips
            v-model="filters"
            :fields="filterFields"
          />

          <section class="flex min-h-0 flex-col">
            <CardBox :padded="false">
              <template #content>
                <TableRoot
                  ref="tableRef"
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  v-model:columnVisibility="columnVisibility"
                  :data="filteredWorkloads"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="10"
                  :border="false"
                  :loading="loading"
                  @row-click="openWorkload"
                >
                  <template #cell-name="{ value }">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <i
                        class="ai ai-workloads shrink-0 text-body-lg text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
                    </div>
                  </template>

                  <template #cell-id="{ value }">
                    <IdCell
                      :value="value"
                      resource="workload"
                    />
                  </template>

                  <template #cell-domain="{ row, value }">
                    <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
                      <i
                        class="ai ai-domains shrink-0 text-body-lg text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <ResourceLink
                        :label="value"
                        :href="`https://${value}`"
                      />
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
                  <template #cell-owner="{ row }">
                    <AuthorCell
                      :author="row.owner"
                      :avatar-src="row.ownerAvatar"
                    />
                  </template>

                  <template #cell-lastModified="{ row }">
                    <LastModifiedCell :date="row.modifiedAt" />
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
                </TableRoot>
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
