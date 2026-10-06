<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import TableRoot from '@aziontech/webkit/table-root'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { formatListDate } from '@shared/lib/dates'
  import { computed, ref, watch } from 'vue'
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
  import { FIT_COLUMN } from '../../lib/behavior/table-columns'
  import { SECRET_MASK, scopeSummary } from '../../lib/behavior/variables-editor'
  import { productFirstUse } from '../../lib/data/product-empty-states'
  import { VARIABLES } from '../../lib/data/variables'
  import { useSampleMode } from '../../lib/state/sample-mode'
  import { tenancyRows } from '../../lib/state/tenancy-scope'
  import AddVariableDrawer from './AddVariableDrawer.vue'

  const { accountEmpty } = useSampleMode()
  const firstUse = productFirstUse('variables')

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')
  const editorName = computed(() => userEmail.value.split('@')[0])

  const variables = ref([...VARIABLES])

  const scopedVariables = computed(() => tenancyRows(variables.value, 'variables', VARIABLES))

  const showFirstUse = computed(() => accountEmpty.value && scopedVariables.value.length === 0)

  const columns = [
    { accessorKey: 'key', header: 'Key', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', minWidth: FIT_COLUMN },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'scope', header: 'Scope', minWidth: FIT_COLUMN },
    { accessorKey: 'lastEditor', header: 'Last Editor', enableSorting: true, minWidth: FIT_COLUMN },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const authorOptions = computed(() =>
    [
      ...new Map(
        variables.value.map((variable) => [variable.lastEditor, variable.lastEditorAvatar])
      )
    ]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([author, avatar]) => ({ value: author, label: author, avatar }))
  )

  const filterFields = [
    {
      id: 'lastEditor',
      label: 'Author',
      kind: 'options',
      get options() {
        return authorOptions.value
      },
      match: (variable, values) => values.includes(variable.lastEditor)
    },
    {
      id: 'type',
      label: 'Type',
      kind: 'options',
      options: [
        { value: 'variable', label: 'Variable' },
        { value: 'secret', label: 'Secret' }
      ],
      match: (variable, values) => values.includes(variable.secret ? 'secret' : 'variable')
    },
    {
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (variable, values) => matchDate(variable.modifiedAt, values)
    }
  ]

  const {
    filters,
    search,
    pagination,
    visibleRows: filteredVariables,
    loading,
    refresh
  } = useListFilters(filterFields, scopedVariables, { pageSize: 10 })

  const tableRef = ref(null)

  const columnVisibility = ref({ id: false })

  const displayValue = (row) => (row.secret ? SECRET_MASK : row.value)

  const drawerOpen = ref(false)
  const existingKeys = computed(() => variables.value.map((variable) => variable.key))

  const openCreate = () => {
    drawerOpen.value = true
  }

  watch(
    () => route.query.create,
    (requested) => {
      if (requested !== 'variable') return
      openCreate()
      router.replace({ path: route.path, query: { ...route.query, create: undefined } })
    },
    { immediate: true }
  )

  const onCreated = (created) => {
    const modifiedAt = new Date()
    variables.value = [
      ...created.map((variable, index) => ({
        ...variable,
        id: `v-${Date.now()}-${index}`,
        lastEditor: editorName.value,
        lastEditorAvatar: '',
        modifiedAt,
        lastModified: formatListDate(modifiedAt)
      })),
      ...variables.value
    ]
  }

  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    variables.value = variables.value.filter((item) => item.id !== row.id)
    toast.success(`${row.key} deleted.`)
    pendingDelete.value = null
  }

  const onRowAction = (event, value, row) => {
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    const copy = {
      edit: `Editing ${row.key}`,
      duplicate: `Duplicating ${row.key}`
    }
    toast.info(copy[value] ?? row.key, { description: `Variable ${row.id}` })
  }
</script>

<template>
  <AppLayout
    active="variables"
    :breadcrumb="[{ label: 'Variables' }]"
  >
    <main
      class="flex min-h-full flex-col"
      :class="showFirstUse ? 'layout-column-focused' : 'layout-column'"
    >
      <PageHeading
        v-if="!showFirstUse"
        size="medium"
        title="Variables"
        description="Configure variable names, values, and settings for use across Azion's products."
        :documentation="firstUse.learnMore.href"
      >
        <template #actions>
          <HeadingAction
            label="Create Variable"
            kind="outlined"
            icon="pi pi-plus"
            @click="openCreate"
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
          <ControlsHeader v-if="scopedVariables.length">
            <FilterButton
              v-model="filters"
              :fields="filterFields"
            />
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search variables"
              aria-label="Search variables"
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
                filename="variables.csv"
              />
              <ColumnsButton
                v-model="columnVisibility"
                :columns="columns"
              />
            </template>
          </ControlsHeader>

          <FilterChips
            v-if="scopedVariables.length"
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
                  :data="filteredVariables"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="10"
                  :border="false"
                  :loading="loading"
                >
                  <template #cell-key="{ value }">
                    <span class="min-w-0 truncate">{{ value }}</span>
                  </template>

                  <template #cell-id="{ value }">
                    <IdCell
                      :value="value"
                      resource="variable"
                    />
                  </template>

                  <template #cell-value="{ row }">
                    <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
                      <span class="min-w-0 truncate">{{ displayValue(row) }}</span>
                      <CopyButton
                        v-if="!row.secret"
                        kind="outlined"
                        :value="row.value"
                        aria-label="Copy value"
                        class="ml-auto shrink-0"
                      />
                    </div>
                  </template>
                  <template #cell-lastEditor="{ row }">
                    <AuthorCell
                      :author="row.lastEditor"
                      :avatar-src="row.lastEditorAvatar"
                    />
                  </template>

                  <template #cell-lastModified="{ value }">
                    <LastModifiedCell :date="value" />
                  </template>

                  <template #cell-scope="{ value }">
                    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <span
                        v-for="item in scopeSummary(value)"
                        :key="item.label"
                        class="truncate whitespace-nowrap"
                      >
                        {{ item.label }}
                        <span
                          v-if="item.detail"
                          class="text-(--text-muted)"
                          >{{ item.detail }}</span
                        >
                      </span>
                    </div>
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
                </TableRoot>
              </template>
            </CardBox>
          </section>
        </section>
      </section>
    </main>

    <AddVariableDrawer
      v-model:open="drawerOpen"
      :existing-keys="existingKeys"
      @created="onCreated"
    />

    <DeleteDialog
      v-model:open="deleteOpen"
      kind="Variable"
      :name="pendingDelete?.key ?? ''"
      description="The selected Variable will be deleted, and anything reading it will stop receiving a value. Check the"
      @confirm="confirmDelete"
    />
  </AppLayout>
</template>
