<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import Hint from '@aziontech/webkit/hint'
  import Link from '@aziontech/webkit/link'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'

  import { sampleSummaryZones, type SummaryZone } from '../sample'

  const zones = sampleSummaryZones

  const zoneColumns: TableColumn[] = [
    { id: 'name', accessorKey: 'name', header: 'Zone name', principal: true, hideable: false },
    { id: 'domain', accessorKey: 'domain', header: 'Domain', grow: 2 },
    { id: 'status', accessorKey: 'status', header: 'Status', minWidth: 112 },
    { id: 'lastModified', accessorKey: 'modifiedAt', header: 'Last modified', minWidth: 184 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const onZoneAction = (value: string | number, row: SummaryZone) => {
    const labels: Record<string, string> = {
      view: 'Opening',
      edit: 'Editing',
      delete: 'Deleting'
    }
    toast.info(`${labels[String(value)] ?? 'Opening'} ${row.name}.`, {
      description: `Zone ID ${row.id}`
    })
  }
</script>

<template>
  <section
    aria-labelledby="summary-resources"
    class="flex min-w-0 flex-col gap-(--layout-group-gap)"
  >
    <div class="flex items-center gap-(--spacing-xs)">
      <h2
        id="summary-resources"
        class="text-heading-xs text-(--text-default)"
      >
        Resources
      </h2>
      <Hint content="The DNS zones you changed most recently." />
    </div>

    <Card :padded="false">
      <template #default>
        <DataTable
          :data="zones"
          :columns="zoneColumns"
          row-key="id"
          density="compact"
          :bordered="false"
        >
          <template #cell-domain="{ row }">
            <TableCellLink
              :label="row.domain"
              :href="`https://${row.domain}`"
              copyable
            />
          </template>
          <template #cell-status="{ value }">
            <Tag
              :label="value"
              :severity="value === 'Active' ? 'success' : 'neutral'"
              size="small"
            />
          </template>
          <template #cell-lastModified="{ row }">
            <TableCellTime
              :value="row.modifiedAt"
              :author="row.author"
            />
          </template>
          <template #cell-actions="{ row }">
            <TableCellActions
              :name="row.name"
              @select="(_event, value) => onZoneAction(value, row)"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  value="view"
                  label="View details"
                />
                <DropdownMenuItem
                  value="edit"
                  label="Edit"
                />
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  value="delete"
                  label="Delete"
                />
              </DropdownMenuGroup>
            </TableCellActions>
          </template>
        </DataTable>
      </template>
      <template #footer>
        <Link
          label="View all DNS zones"
          size="medium"
          href="#"
        />
      </template>
    </Card>
  </section>
</template>
