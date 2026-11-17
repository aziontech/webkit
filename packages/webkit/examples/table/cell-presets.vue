<script setup>
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTags from '@aziontech/webkit/table-cell-tags'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'

  const HOUR = 3_600_000
  const NOW = Date.UTC(2026, 10, 10, 12)

  const statusSeverity = (status) =>
    ({ Active: 'success', Failed: 'danger', Pending: 'warning' })[status] ?? 'neutral'

  const rows = [
    {
      id: '1726504',
      name: 'storefront',
      repository: 'example/storefront',
      status: 'Active',
      domains: ['shop.example.com', 'www.shop.example.com', 'm.shop.example.com'],
      tags: ['production', 'checkout', 'payments', 'europe'],
      updatedAt: new Date(NOW - 2 * HOUR),
      updatedBy: 'jane.doe@example.com'
    },
    {
      id: '1726511',
      name: 'image-optimizer',
      repository: 'example/image-optimizer',
      status: 'Pending',
      domains: ['img.example.com'],
      tags: ['media'],
      updatedAt: new Date(NOW - 26 * HOUR),
      updatedBy: 'jonas.weber@example.com'
    },
    {
      id: '1726530',
      name: 'docs-portal',
      repository: '',
      status: 'Failed',
      domains: ['docs.example.com', 'help.example.com'],
      tags: [],
      updatedAt: new Date(NOW - 9 * 24 * HOUR),
      updatedBy: 'john.smith@example.com'
    }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true },
    { accessorKey: 'id', header: 'ID', minWidth: 140 },
    { accessorKey: 'repository', header: 'Repository', grow: 2 },
    { accessorKey: 'status', header: 'Status', minWidth: 96 },
    { accessorKey: 'domains', header: 'Domain', grow: 2 },
    { accessorKey: 'tags', header: 'Tags', grow: 2 },
    { accessorKey: 'updatedAt', header: 'Last modified', minWidth: 160 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const onAction = (_event, _value, _row) => {}
</script>

<template>
  <WebkitProvider :now="NOW">
    <DataTable
      :data="rows"
      :columns="columns"
      row-key="id"
      aria-label="Workloads"
    >
      <template #cell-name="{ row }">
        <TableCellLink
          :label="row.name"
          :to="`/workloads/${row.id}`"
          destination="Workloads"
        />
      </template>
      <template #cell-id="{ value }">
        <TableCellId
          :value="value"
          resource="workload"
        />
      </template>
      <template #cell-repository="{ value }">
        <TableCellLink
          v-if="value"
          icon="az az-github"
          :label="value"
          :href="`https://github.com/${value}`"
        />
        <span
          v-else
          class="text-body-sm text-(--text-muted)"
          >—</span
        >
      </template>
      <template #cell-status="{ value }">
        <TableCellStatus
          :label="value"
          :severity="statusSeverity(value)"
        />
      </template>
      <template #cell-domains="{ row }">
        <TableCellLink
          :label="row.domains[0]"
          :href="`https://${row.domains[0]}`"
          :more="row.domains.slice(1).map((label) => ({ label, href: `https://${label}` }))"
          :noun="{ one: 'domain', other: 'domains' }"
          copyable
        />
      </template>
      <template #cell-tags="{ value }">
        <TableCellTags :items="value" />
      </template>
      <template #cell-updatedAt="{ row }">
        <TableCellTime
          :value="row.updatedAt"
          :author="row.updatedBy"
        />
      </template>
      <template #header-actions>
        <span class="sr-only">Actions</span>
      </template>
      <template #cell-actions="{ row }">
        <TableCellActions
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
    </DataTable>
  </WebkitProvider>
</template>
