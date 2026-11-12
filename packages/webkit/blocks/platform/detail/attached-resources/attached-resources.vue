<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import Table from '@aziontech/webkit/table'
  import type { TableColumn } from '@aziontech/webkit/table-root'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  const domains = [
    {
      id: 'generated',
      domain: 'web-app-7f3a.example.net',
      environment: 'Production',
      policy: 'Single',
      certificate: 'Managed',
      generated: true
    },
    {
      id: 'shop',
      domain: 'shop.example.com',
      environment: 'Production',
      policy: 'Single',
      certificate: 'Managed',
      generated: false
    },
    {
      id: 'preview',
      domain: 'preview.example.com',
      environment: 'Stage',
      policy: 'Versioned',
      certificate: '*.example.com',
      generated: false
    }
  ]

  const columns: TableColumn[] = [
    { accessorKey: 'domain', header: 'Domain', principal: true, grow: 2 },
    { accessorKey: 'environment', header: 'Environment' },
    { accessorKey: 'policy', header: 'Policy' },
    { accessorKey: 'certificate', header: 'Certificate' },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const countLabel = computed(
    () => `${domains.length} ${domains.length === 1 ? 'domain' : 'domains'}`
  )
</script>

<template>
  <Card :padded="false">
    <template #content>
      <div class="flex min-w-0 flex-col">
        <TableRoot
          :data="domains"
          :columns="columns"
          row-key="id"
          :bordered="false"
        >
          <template #cell-environment="{ value }">
            <Tag
              v-if="value"
              severity="secondary"
              size="medium"
              rounded
              icon="ai ai-layers"
              :label="value"
            />
          </template>
          <template #cell-policy="{ row, value }">
            <template v-if="row.environment">{{ value }}</template>
          </template>
          <template #cell-certificate="{ value }">
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <i
                class="pi pi-verified shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="min-w-0 truncate">{{ value }}</span>
            </span>
          </template>
          <template #cell-actions="{ row }">
            <Table.CellActions
              v-if="!row.generated"
              :name="row.domain"
            >
              <DropdownMenuGroup>
                <DropdownMenuOption
                  value="edit"
                  label="Edit"
                >
                  <template #left
                    ><i
                      class="pi pi-pencil"
                      aria-hidden="true"
                  /></template>
                </DropdownMenuOption>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuOption
                  value="delete"
                  label="Delete"
                >
                  <template #left
                    ><i
                      class="pi pi-trash"
                      aria-hidden="true"
                  /></template>
                </DropdownMenuOption>
              </DropdownMenuGroup>
            </Table.CellActions>
          </template>
        </TableRoot>

        <div
          class="flex flex-wrap items-center justify-between gap-(--spacing-xs) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-sm)"
        >
          <span class="text-body-xs text-(--text-muted)">{{ countLabel }}</span>
          <Button
            type="button"
            label="Add Domain"
            kind="outlined"
            size="medium"
            icon="pi pi-plus"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
