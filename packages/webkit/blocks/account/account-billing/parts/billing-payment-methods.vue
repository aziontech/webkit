<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import PaymentBrand from '@aziontech/webkit/payment-brand'
  import Subheader from '@aziontech/webkit/subheader'
  import { type TableColumn } from '@aziontech/webkit/table'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import Tag from '@aziontech/webkit/tag'

  import type { BillingPaymentMethod } from '../account-billing.vue'
  import { methodLabel } from '../billing-format'

  export interface BillingPaymentMethodsProps {
    /** The cards on file. */
    methods: BillingPaymentMethod[]
    /** A request is in flight. */
    loading: boolean
  }

  defineProps<BillingPaymentMethodsProps>()

  const emit = defineEmits<{
    action: [event: Event, value: DropdownMenuItemValue, method: BillingPaymentMethod]
    'row-remove': [event: KeyboardEvent, method: BillingPaymentMethod]
  }>()

  const methodColumns: TableColumn[] = [
    {
      accessorKey: 'holder',
      header: 'Card holder',
      sortable: true,
      principal: true,
      hideable: false,
      grow: 2
    },
    { accessorKey: 'last4', header: 'Card', grow: 2, minWidth: 200 },
    { accessorKey: 'expires', header: 'Expiration date', minWidth: 140 },
    { id: 'actions', type: 'action', hideable: false }
  ]
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
    <Subheader
      title="Payment methods"
      description="Every card on the account. Invoices are charged to the default one."
      size="small"
    >
      <template #actions>
        <Button
          label="Add payment method"
          icon="az az-plus"
          variant="outline"
          size="medium"
          href="/account/account-billing/payment-methods/new"
          :disabled="loading"
        />
      </template>
    </Subheader>
    <Card :padded="false">
      <template #default>
        <DataTable
          :data="methods"
          :columns="methodColumns"
          row-key="id"
          :loading="loading"
          sortable
          :bordered="false"
          aria-label="Payment methods"
          @row-remove="(event, method) => emit('row-remove', event, method)"
        >
          <template #cell-holder="{ row, value }">
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <span class="truncate">{{ value }}</span>
              <Tag
                v-if="row.default"
                label="Default"
                severity="success"
                size="small"
                class="shrink-0"
              />
            </span>
          </template>
          <template #cell-last4="{ row }">
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <PaymentBrand
                :brand="row.brand"
                size="small"
              />
              <span
                class="truncate tabular-nums"
                dir="ltr"
                >•••• {{ row.last4 }}</span
              >
            </span>
          </template>
          <template #cell-expires="{ value }">
            <span
              class="tabular-nums"
              dir="ltr"
              >{{ value }}</span
            >
          </template>
          <template #header-actions>
            <span class="sr-only">Actions</span>
          </template>
          <template #cell-actions="{ row }">
            <TableCellActions
              :name="methodLabel(row)"
              @select="(event, value) => emit('action', event, value, row)"
            >
              <DropdownMenu.Group>
                <DropdownMenu.Item
                  value="default"
                  label="Set as default"
                  :disabled="row.default"
                />
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <DropdownMenu.Item
                  value="remove"
                  label="Remove"
                  :disabled="row.default"
                />
              </DropdownMenu.Group>
            </TableCellActions>
          </template>
        </DataTable>
      </template>
    </Card>
  </div>
</template>
