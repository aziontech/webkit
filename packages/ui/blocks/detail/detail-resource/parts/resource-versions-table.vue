<script setup lang="ts">
  import Avatar from '@aziontech/ui/avatar'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import type { TableColumn, TableExposed } from '@aziontech/ui/data-table'
  import DataTable from '@aziontech/ui/data-table'
  import DataTablePagination from '@aziontech/ui/data-table-pagination'
  import DropdownMenu from '@aziontech/ui/dropdown-menu'
  import IconButton from '@aziontech/ui/icon-button'
  import Input from '@aziontech/ui/input'
  import Tag from '@aziontech/ui/tag'
  import Tooltip from '@aziontech/ui/tooltip'
  import { matchesText } from '@aziontech/ui/use-collection'
  import { useLocale } from '@aziontech/ui/use-locale'
  import { computed, ref } from 'vue'

  import { resourceVersions as versions, resourceVersionStates as versionStates } from '../sample'

  const relativeTime = useLocale().formatRelativeTime
  const ago = (value: Date | string) => (value ? relativeTime(new Date(value)) : '')

  const columns: TableColumn[] = [
    {
      accessorKey: 'name',
      header: 'Version',
      sortable: true,
      principal: true,
      hideable: false
    },
    { accessorKey: 'description', header: 'Description', grow: 2 },
    { accessorKey: 'state', header: 'Status', sortable: true, minWidth: 104 },
    { accessorKey: 'createdAt', header: 'Created', sortable: true, minWidth: 80 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const deployable = ['ready', 'active']
  const latestId = 'ANWDC7RA'

  const search = ref('')
  const page = ref(1)
  const tableEl = ref<TableExposed | null>(null)
  const columnVisibility = ref({})

  const loading = ref(false)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined
  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }
  const matchingVersions = computed(() =>
    versions.filter((row) =>
      matchesText(
        row,
        search.value,
        columns.flatMap((column) => column.accessorKey ?? [])
      )
    )
  )
</script>

<template>
  <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
    <header class="flex items-center gap-(--layout-group-gap)">
      <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
        <div class="flex shrink-0 items-center">
          <Button
            label="Filter"
            variant="outline"
            size="medium"
            icon="az az-filter"
          />
        </div>
        <div class="flex min-w-36 grow basis-(--container-2xs)">
          <Input
            v-model="search"
            size="medium"
            placeholder="Search versions"
            aria-label="Search versions"
            class="w-full"
          >
            <template #leading>
              <i
                class="az az-search"
                aria-hidden="true"
              />
            </template>
          </Input>
        </div>
      </div>
      <div class="flex shrink-0 items-center gap-(--spacing-xs)">
        <Tooltip
          content="Refresh"
          class="shrink-0"
        >
          <IconButton
            icon="az az-refresh"
            variant="outline"
            size="medium"
            :loading="loading"
            aria-label="Refresh"
            @click="refresh"
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
            :disabled="!tableEl"
            aria-label="Download CSV"
            @click="tableEl?.exportCsv({ filename: 'analytics-app-versions.csv' })"
          />
        </Tooltip>
        <Tooltip
          content="Columns"
          class="shrink-0"
        >
          <IconButton
            icon="az az-columns-3"
            variant="outline"
            size="medium"
            aria-label="Columns"
          />
        </Tooltip>
      </div>
    </header>

    <Card :padded="false">
      <template #default>
        <DataTable
          ref="tableEl"
          v-model:columnVisibility="columnVisibility"
          :data="matchingVersions"
          :columns="columns"
          row-key="id"
          sortable
          :bordered="false"
          :loading="loading"
        >
          <template #cell-name="{ value, row }">
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <span
                class="cursor-pointer truncate font-(family-name:--font-code) text-body-sm text-(--text-default) hover:underline"
              >
                {{ value }}
              </span>
              <span
                v-if="row.id === latestId"
                class="shrink-0 text-body-sm text-(--text-muted)"
              >
                Latest
              </span>
            </div>
          </template>

          <template #cell-description="{ value }">
            <span class="truncate text-body-sm text-(--text-muted)">{{ value }}</span>
          </template>

          <template #cell-state="{ value }">
            <Tag
              :label="versionStates[value].label"
              :variant="versionStates[value].variant"
              :severity="versionStates[value].severity"
              size="medium"
            />
          </template>

          <template #cell-createdAt="{ row }">
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <Tooltip :content="row.author">
                <Avatar
                  :alt="row.author"
                  :label="row.author"
                  size="small"
                  variant="square"
                />
              </Tooltip>
              <span class="truncate text-body-sm text-(--text-muted)">{{
                ago(row.createdAt)
              }}</span>
            </div>
          </template>

          <template #cell-actions="{ row }">
            <DropdownMenu
              side="bottom"
              align="end"
            >
              <DropdownMenu.Trigger>
                <Tooltip content="Version actions">
                  <IconButton
                    icon="az az-ellipsis"
                    variant="outline"
                    size="small"
                    aria-label="Version actions"
                  />
                </Tooltip>
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Item
                  value="open"
                  label="Open configuration"
                >
                  <template #leading>
                    <i
                      class="az az-eye"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  value="deploy"
                  label="Deploy"
                  :disabled="!deployable.includes(row.state)"
                >
                  <template #leading>
                    <i
                      class="az az-cloud-upload"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </DropdownMenu>
          </template>
          <template #footer>
            <DataTablePagination
              v-model:page="page"
              :page-size="10"
            />
          </template>
        </DataTable>
      </template>
    </Card>
  </section>
</template>
