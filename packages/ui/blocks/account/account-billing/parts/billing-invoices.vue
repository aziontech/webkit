<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import CurrencyAmount from '@aziontech/webkit/currency-amount'
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PaymentBrand from '@aziontech/webkit/payment-brand'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Subheader from '@aziontech/webkit/subheader'
  import { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import Tooltip from '@aziontech/webkit/tooltip'
  import {
    type FilteringProperty,
    type PropertyFilterQuery,
    useCollection
  } from '@aziontech/webkit/use-collection'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { ref, watch } from 'vue'

  import type { BillingInvoice } from '../account-billing.vue'
  import { formatAmount, statusSeverity } from '../billing-format'

  export interface BillingInvoicesProps {
    /** The invoices; filtered, sorted and paged in the browser. */
    invoices: BillingInvoice[]
    /** The filter the invoices open with. */
    defaultQuery: PropertyFilterQuery
    /** A request is in flight. */
    loading: boolean
  }

  const props = defineProps<BillingInvoicesProps>()

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
  }>()

  const { formatDate: formatLocaleDate } = useLocale()
  const formatDate = (value: Date): string =>
    formatLocaleDate(value, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

  const invoiceRows = ref<BillingInvoice[]>([])
  watch(
    () => props.invoices,
    (next) => {
      invoiceRows.value = [...next]
    },
    { immediate: true }
  )

  const properties: FilteringProperty[] = [
    { key: 'id', label: 'Invoice ID' },
    { key: 'plan', label: 'Plan', options: [{ value: 'Pro' }, { value: 'Free' }] },
    { key: 'cycle', label: 'Cycle', options: [{ value: 'Monthly' }, { value: 'Yearly' }] },
    {
      key: 'status',
      label: 'Status',
      options: [{ value: 'Paid' }, { value: 'Refunded' }, { value: 'Overdue' }]
    }
  ]

  const actionColumn: TableColumn = { id: 'actions', type: 'action', hideable: false }

  const columns: TableColumn[] = [
    {
      accessorKey: 'id',
      header: 'Invoice ID',
      sortable: true,
      principal: true,
      hideable: false,
      minWidth: 140
    },
    { accessorKey: 'amount', header: 'Amount', sortable: true, minWidth: 110 },
    { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 110 },
    { accessorKey: 'plan', header: 'Plan', sortable: true, minWidth: 96 },
    { accessorKey: 'cycle', header: 'Cycle', minWidth: 100 },
    { accessorKey: 'seats', header: 'Seats', sortable: true, minWidth: 80 },
    { accessorKey: 'billedAt', header: 'Billing date', sortable: true, minWidth: 130 },
    { accessorKey: 'paymentMethod', header: 'Payment method', grow: 2, minWidth: 200 },
    { accessorKey: 'number', header: 'No.', label: 'Number', sortable: true, minWidth: 72 },
    actionColumn
  ]

  const {
    paginationProps,
    tableProps,
    propertyFilterProps,
    preferencesProps,
    status,
    matchingItems,
    clearFilters
  } = useCollection({
    items: invoiceRows,
    columns,
    filtering: { fields: ['id', 'plan', 'cycle', 'status'] },
    propertyFiltering: { properties, defaultQuery: props.defaultQuery },
    sorting: { defaultState: [{ id: 'billedAt', desc: true }] },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: { storageKey: 'billing-invoices' }
  })

  const invoicesTableEl = ref<TableExposed<BillingInvoice> | null>(null)
  const exportCsv = () => invoicesTableEl.value?.exportCsv({ filename: 'invoices.csv' })
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
    <Subheader
      title="Invoices"
      description="Every invoice on the account, with what it charged and to which card."
      size="small"
    />
    <header class="flex flex-wrap items-start gap-(--layout-group-gap)">
      <div class="flex min-w-0 grow basis-(--container-2xs)">
        <PropertyFilter
          v-bind="propertyFilterProps"
          placeholder="Filter invoices"
          aria-label="Filter invoices"
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
            :loading="loading"
            aria-label="Refresh invoices"
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

    <Card
      v-if="!loading && status === 'empty'"
      key="invoices-empty"
      :padded="false"
    >
      <template #default>
        <EmptyState
          size="medium"
          icon="az az-file"
          title="No invoices yet"
          description="Your first invoice appears here when the first billing cycle closes."
        >
          <template #actions>
            <Button
              label="How billing works"
              aria-label="How billing works (opens in a new tab)"
              variant="outline"
              size="small"
              icon="az az-external-link"
              href="https://example.com/docs/billing"
              target="_blank"
            />
          </template>
        </EmptyState>
      </template>
    </Card>

    <Card
      v-else
      key="invoices-table"
      :padded="false"
    >
      <template #default>
        <DataTable
          ref="invoicesTableEl"
          v-bind="tableProps"
          :loading="loading"
          sortable
          :bordered="false"
          aria-label="Invoices"
        >
          <template #cell-number="{ value }">
            <span class="tabular-nums text-(--text-muted)">{{ value }}</span>
          </template>
          <template #cell-id="{ row, value }">
            <div class="flex min-w-0 flex-col">
              <span
                class="truncate tabular-nums"
                dir="ltr"
                >{{ value }}</span
              >
              <div
                v-if="row.status !== 'Paid'"
                aria-hidden="true"
                data-slot="narrow-summary"
                class="mt-(--spacing-2xs) sm:hidden"
              >
                <TableCellStatus
                  :label="row.status"
                  :severity="statusSeverity(row.status)"
                />
              </div>
            </div>
          </template>
          <template #cell-seats="{ value }">
            <span class="tabular-nums">{{ value }}</span>
          </template>
          <template #cell-billedAt="{ value }">
            <span class="tabular-nums">{{ formatDate(value) }}</span>
          </template>
          <template #cell-amount="{ value }">
            <CurrencyAmount
              :value="formatAmount(value)"
              size="small"
            />
          </template>
          <template #cell-paymentMethod="{ row, value }">
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <PaymentBrand
                :brand="row.brand"
                size="small"
                decorative
              />
              <span class="truncate">{{ value }}</span>
            </span>
          </template>
          <template #cell-status="{ value }">
            <TableCellStatus
              :label="value"
              :severity="statusSeverity(value)"
            />
          </template>
          <template #header-actions>
            <span class="sr-only">Actions</span>
          </template>
          <template #cell-actions="{ row }">
            <Tooltip content="Download invoice">
              <IconButton
                icon="az az-file-pdf"
                variant="outline"
                size="small"
                :href="`https://example.com/invoices/${row.id}.pdf`"
                download
                :aria-label="`Download invoice ${row.id}`"
              />
            </Tooltip>
          </template>
          <template #empty>
            <EmptyState
              size="small"
              icon="az az-search"
              title="No matching invoices"
              description="No invoice matches these filters."
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
</template>
