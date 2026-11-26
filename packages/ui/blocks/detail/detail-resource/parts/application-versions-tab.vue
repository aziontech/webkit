<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import type { TableColumn } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Subheader from '@aziontech/webkit/subheader'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'

  /** One version row of the Versions tab. */
  export interface ApplicationVersionRow {
    /** Stable key. */
    id: string
    /** The version name. */
    name: string
    /** What the version changed. */
    description: string
    /** Active, Ready or Draft. */
    state: string
    /** When it was created, as ISO 8601. */
    createdAt: string
  }

  export interface ApplicationVersionsTabProps {
    /** The versions of the application. */
    versions: ApplicationVersionRow[]
    /** The name of the newest version, marked Latest. */
    latest: string
  }

  defineProps<ApplicationVersionsTabProps>()

  const versionColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Version', principal: true, hideable: false },
    { accessorKey: 'description', header: 'Description', grow: 2 },
    { accessorKey: 'state', header: 'Status', minWidth: 104 },
    { accessorKey: 'createdAt', header: 'Created', minWidth: 96 }
  ]
  const versionSeverity: Record<string, TagSeverity> = {
    Active: 'success',
    Ready: 'neutral',
    Draft: 'warning'
  }
</script>

<template>
  <section
    class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap) pb-(--layout-section-gap)"
  >
    <Subheader
      title="Versions"
      size="small"
    >
      <template #actions>
        <Button
          label="Add Version"
          variant="outline"
          size="medium"
          icon="az az-plus"
        />
      </template>
    </Subheader>
    <Card :padded="false">
      <template #default>
        <DataTable
          :data="versions"
          :columns="versionColumns"
          row-key="id"
          :bordered="false"
          aria-label="Versions"
        >
          <template #cell-createdAt="{ value }">
            <TableCellTime :value="value" />
          </template>
          <template #cell-name="{ value }">
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <span class="truncate font-(family-name:--font-code) text-body-sm">{{ value }}</span>
              <span
                v-if="value === latest"
                class="shrink-0 text-body-sm text-(--text-muted)"
                >Latest</span
              >
            </span>
          </template>
          <template #cell-state="{ value }">
            <Tag
              :label="value"
              :severity="versionSeverity[value]"
              size="small"
            />
          </template>
          <template #empty>
            <EmptyState
              size="medium"
              icon="az az-history"
              title="No versions yet"
              description="Every deploy creates a version of this application."
            />
          </template>
          <template #footer>
            <DataTablePagination :page-size="10" />
          </template>
        </DataTable>
      </template>
    </Card>
  </section>
</template>
