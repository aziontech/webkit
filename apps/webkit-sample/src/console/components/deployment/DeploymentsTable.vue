<script setup lang="ts">
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

  import { applyFilters } from '../../lib/behavior/filter-bar'
  import { useListRefresh } from '../../lib/behavior/list-state'
  import { DEPLOYMENT_COLUMNS } from '../../lib/data/deployment-columns'
  import { environmentSeverity, statusMeta } from '../../lib/data/deployments'
  import AuthorCell from '../list/AuthorCell.vue'
  import FilterButton from '../list/FilterButton.vue'
  import FilterChips from '../list/FilterChips.vue'
  import IdCell from '../list/IdCell.vue'
  import LastModifiedCell from '../list/LastModifiedCell.vue'
  import ResourceLink from '../resource/ResourceLink.vue'

  interface Props {
    deployments?: unknown[]
    fields?: unknown[]
    pageSize?: number
    searchPlaceholder?: string
    email?: string
    controls?: boolean
    loading?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    deployments: () => [],
    fields: () => [],
    pageSize: 10,
    searchPlaceholder: 'Search...',
    email: '',
    controls: true,
    loading: false
  })

  const emit = defineEmits<{
    'row-click': []
    action: []
  }>()

  const { loading: listLoading, refresh } = useListRefresh()
  const loading = computed(() => props.loading || listLoading.value)

  const tableRef = ref(null)

  const columns = DEPLOYMENT_COLUMNS

  const search = defineModel('search', { type: String, default: '' })
  const filters = defineModel('filters', { type: Object, default: () => ({}) })
  const columnVisibility = defineModel('columnVisibility', { type: Object, default: () => ({}) })
  const pagination = ref({ pageIndex: 0, pageSize: props.pageSize })

  const visibleDeployments = computed(() =>
    applyFilters(props.deployments, props.fields, filters.value)
  )

  watch(visibleDeployments, () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })

  defineExpose({
    exportCsv: (options) => tableRef.value?.exportCsv(options),
    refresh
  })
</script>

<template>
  <Table
    ref="tableRef"
    v-model:pagination="pagination"
    v-model:globalFilter="search"
    v-model:columnVisibility="columnVisibility"
    :data="visibleDeployments"
    :columns="columns"
    row-key="id"
    enable-sorting
    paginated
    :page-size="pageSize"
    :border="false"
    :loading="loading"
    export-filename="deployments.csv"
    @row-click="(event, row) => emit('row-click', event, row)"
    @refresh="refresh"
  >
    <template
      v-if="controls"
      #toolbar
    >
      <div class="flex w-full flex-col gap-(--layout-group-gap)">
        <div class="flex w-full items-center gap-(--layout-group-gap)">
          <FilterButton
            v-model="filters"
            :fields="fields"
          />
          <InputText
            v-model="search"
            size="medium"
            :placeholder="searchPlaceholder"
            :aria-label="searchPlaceholder"
            class="min-w-36 grow basis-(--container-2xs)"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
          <div class="flex shrink-0 items-center gap-(--spacing-xs)">
            <Table.RefreshButton />
            <Table.Export />
          </div>
        </div>
        <FilterChips
          v-model="filters"
          :fields="fields"
        />
      </div>
    </template>

    <template #cell-versionId="{ value, row }">
      <div class="flex min-w-0 items-start gap-(--spacing-xxs)">
        <span class="truncate tabular-nums text-body-sm text-(--text-default)">{{ value }}</span>
        <Tag
          v-if="row.current"
          label="Current"
          severity="info"
          size="small"
          icon="pi pi-arrow-circle-up"
        />
      </div>
    </template>

    <template #cell-id="{ value }">
      <IdCell
        :value="value"
        resource="deployment"
      />
    </template>

    <template #cell-status="{ row }">
      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
        <StatusIndicator
          :severity="statusMeta(row.status).severity"
          :loading="statusMeta(row.status).loading"
          :label="row.status"
        />
        <span
          v-if="row.duration"
          class="shrink-0 text-body-xs text-(--text-muted)"
        >
          {{ row.duration }}
        </span>
      </div>
    </template>

    <template #cell-workloadName="{ value, row }">
      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
        <i
          class="ai ai-workloads shrink-0 text-(--text-default)"
          aria-hidden="true"
        />
        <ResourceLink
          :label="value"
          :to="row.workloadId ? { path: `/workloads/${row.workloadId}`, query: { email } } : null"
          module="Workloads"
        />
      </div>
    </template>

    <template #cell-environment="{ value }">
      <Tag
        :label="value"
        :severity="environmentSeverity(value)"
        size="medium"
        rounded
      />
    </template>

    <template #cell-author="{ row }">
      <AuthorCell
        :author="row.author"
        :avatar-src="row.authorAvatar"
      />
    </template>

    <template #cell-date="{ row }">
      <LastModifiedCell :date="row.deployedAt" />
    </template>

    <template #cell-actions="{ row }">
      <Dropdown
        placement="bottom-end"
        @select="(event, value) => emit('action', event, value, row)"
      >
        <Dropdown.Trigger>
          <Tooltip text="Deployment actions">
            <IconButton
              icon="pi pi-ellipsis-h"
              kind="outlined"
              size="small"
              aria-label="Deployment actions"
            />
          </Tooltip>
        </Dropdown.Trigger>
        <Dropdown.Group>
          <Dropdown.Option
            value="details"
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
            value="redeploy"
            label="Redeploy"
          >
            <template #left>
              <i
                class="pi pi-refresh"
                aria-hidden="true"
              />
            </template>
          </Dropdown.Option>
          <Dropdown.Option
            value="promote"
            label="Promote to production"
          >
            <template #left>
              <i
                class="pi pi-arrow-circle-up"
                aria-hidden="true"
              />
            </template>
          </Dropdown.Option>
        </Dropdown.Group>
      </Dropdown>
    </template>
  </Table>
</template>
