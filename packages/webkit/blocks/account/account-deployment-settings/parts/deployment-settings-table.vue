<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  import type {
    DeploymentSettingsService,
    DeploymentSettingsSetting
  } from '../account-deployment-settings.vue'
  import {
    BINDING_POLICIES,
    bindingLabel,
    deploymentLabel,
    reachLabel,
    settingRows,
    type SettingsRowData
  } from '../deployment-policies'

  export interface DeploymentSettingsTableProps {
    /** Every Deployment Setting of the account. */
    settingList: DeploymentSettingsSetting[]
    /** Every service and its environments. */
    serviceList: DeploymentSettingsService[]
    /** The page data is loading. */
    loading: boolean
    /** The first load is in flight. */
    firstLoad: boolean
  }

  const props = defineProps<DeploymentSettingsTableProps>()

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    action: [event: Event, value: DropdownMenuItemValue, row: SettingsRowData]
  }>()

  const rows = computed<SettingsRowData[]>(() => settingRows(props.settingList, props.serviceList))

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'services', header: 'Services', minWidth: 170 },
    { accessorKey: 'type', header: 'Type', sortable: true, minWidth: 110 },
    { accessorKey: 'bindingPolicy', header: 'Binding policy', sortable: true, minWidth: 140 },
    {
      accessorKey: 'deploymentPolicy',
      header: 'Deployment policy',
      sortable: true,
      minWidth: 160
    },
    { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 110 },
    { accessorKey: 'updatedAt', header: 'Last modified', sortable: true, minWidth: 170 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    {
      key: 'reach',
      label: 'Reach',
      options: [{ value: 'Shared' }, { value: 'Dedicated' }, { value: 'Unused' }]
    },
    {
      key: 'bindingPolicy',
      label: 'Binding policy',
      options: BINDING_POLICIES.map((policy) => ({ value: policy.value, label: policy.label }))
    },
    { key: 'status', label: 'Status', options: [{ value: 'Active' }, { value: 'Inactive' }] }
  ]

  const {
    paginationProps,
    tableProps,
    propertyFilterProps,
    preferencesProps,
    matchingItems,
    clearFilters
  } = useCollection({
    items: rows,
    columns,
    filtering: { fields: ['name', 'description', 'reach', 'status'] },
    propertyFiltering: { properties },
    sorting: { defaultState: [{ desc: true, id: 'updatedAt' }] },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: {
      storageKey: 'deployment-settings',
      defaults: { columns: [{ id: 'type', visible: false }] }
    }
  })

  const settingsTableEl = ref<TableExposed<SettingsRowData> | null>(null)
  const exportCsv = () => settingsTableEl.value?.exportCsv({ filename: 'deployment-settings.csv' })

  const onAction = (event: Event, value: DropdownMenuItemValue, row: SettingsRowData) =>
    emit('action', event, value, row)
</script>

<template>
  <SettingsGroup
    label="Deployment Settings"
    anchor="deployment-settings"
    hint="Every setting this account holds, and the services each one publishes to."
  >
    <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
      <header class="flex flex-wrap items-start gap-(--layout-group-gap)">
        <div class="flex min-w-0 grow basis-(--container-2xs)">
          <PropertyFilter
            v-bind="propertyFilterProps"
            placeholder="Filter Deployment Settings"
            aria-label="Filter Deployment Settings"
          />
        </div>
        <div class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs)">
          <Tooltip
            content="Refresh"
            class="shrink-0"
          >
            <IconButton
              icon="az az-refresh"
              variant="outline"
              size="medium"
              :loading="loading && !firstLoad"
              aria-label="Refresh"
              @click="emit('refresh', $event)"
            />
          </Tooltip>
          <Tooltip
            content="Download CSV"
            class="shrink-0"
          >
            <IconButton
              icon="az az-download"
              variant="outline"
              size="medium"
              :disabled="!matchingItems.length"
              aria-label="Download CSV"
              @click="exportCsv"
            />
          </Tooltip>
          <CollectionPreferences
            v-bind="preferencesProps"
            title="Table preferences"
          />
        </div>
      </header>

      <Card :padded="false">
        <template #default>
          <DataTable
            ref="settingsTableEl"
            v-bind="tableProps"
            :loading="loading"
            sortable
            :bordered="false"
            aria-label="Deployment Settings"
          >
            <template #cell-name="{ row }">
              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                <span class="truncate">{{ row.name }}</span>
                <Tag
                  v-if="row.system"
                  label="System"
                  severity="neutral"
                  size="small"
                  class="shrink-0"
                />
              </span>
            </template>
            <template #cell-services="{ row }">
              <Tooltip
                :content="
                  row.services.length
                    ? row.services.join(' · ')
                    : 'No environment publishes with this setting yet.'
                "
              >
                <span
                  class="flex min-w-0 items-center gap-(--spacing-xs)"
                  tabindex="0"
                >
                  <Tag
                    v-if="row.reach === 'Shared'"
                    label="Shared"
                    severity="warning"
                    size="small"
                    class="shrink-0"
                  />
                  <span
                    class="truncate"
                    :data-unused="row.reach === 'Unused' || null"
                    >{{ reachLabel(row.services.length) }}</span
                  >
                </span>
              </Tooltip>
            </template>
            <template #cell-type="{ value }">
              <Tag
                :label="value"
                severity="info"
                size="small"
              />
            </template>
            <template #cell-bindingPolicy="{ value }">
              <span class="truncate">{{ bindingLabel(value) }}</span>
            </template>
            <template #cell-deploymentPolicy="{ value }">
              <span class="truncate">{{ deploymentLabel(value) }}</span>
            </template>
            <template #cell-status="{ value }">
              <TableCellStatus
                :label="value"
                :severity="value === 'Active' ? 'success' : 'neutral'"
              />
            </template>
            <template #cell-updatedAt="{ row }">
              <TableCellTime
                :value="row.updatedAt"
                :author="row.system ? '' : row.updatedBy"
              />
            </template>
            <template #header-actions>
              <span class="sr-only">Actions</span>
            </template>
            <template #cell-actions="{ row }">
              <TableCellActions
                v-if="!row.system"
                :name="row.name"
                @select="(event, value) => onAction(event, value, row)"
              >
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="edit"
                    label="Edit"
                  />
                  <DropdownMenu.Item
                    value="clone"
                    label="Clone"
                  />
                </DropdownMenu.Group>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="delete"
                    label="Delete"
                  />
                </DropdownMenu.Group>
              </TableCellActions>
            </template>
            <template #empty>
              <EmptyState
                size="small"
                icon="az az-search"
                title="No matching Deployment Settings"
                description="No setting matches these filters."
              >
                <template #actions>
                  <Button
                    label="Clear filters"
                    variant="outline"
                    size="small"
                    @click="clearFilters"
                  />
                </template>
              </EmptyState>
            </template>
            <template #footer>
              <DataTablePagination
                v-bind="paginationProps"
                manual
              />
            </template>
          </DataTable>
        </template>
      </Card>
    </div>
  </SettingsGroup>
</template>
