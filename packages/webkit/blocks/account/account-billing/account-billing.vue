<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import CurrencyAmount from '@aziontech/webkit/currency-amount'
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PaymentBrand from '@aziontech/webkit/payment-brand'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Subheader from '@aziontech/webkit/subheader'
  import { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import {
    type FilteringProperty,
    type PropertyFilterQuery,
    useCollection
  } from '@aziontech/webkit/use-collection'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref, watch } from 'vue'

  import {
    sampleInvoices,
    samplePaymentInformation,
    samplePaymentMethods,
    sampleSubscription,
    sampleUpdatedAt
  } from './sample'

  /** The page's tabs. */
  export type BillingTab = 'bills' | 'payment-methods'

  /** How an invoice was settled. */
  export type BillingInvoiceStatus = 'Paid' | 'Refunded' | 'Overdue'

  /** How often the plan bills. */
  export type BillingCycle = 'Monthly' | 'Yearly'

  /** One row of the invoices table. */
  export interface BillingInvoice {
    /** Invoice ID, the row key and the PDF name. */
    id: string
    /** Sequential invoice number. */
    number: number
    /** Plan billed. */
    plan: string
    /** Billing cycle. */
    cycle: BillingCycle
    /** Seats billed. */
    seats: number
    /** When the invoice was issued. */
    billedAt: Date
    /** Amount charged, in the account currency. */
    amount: number
    /** Brand of the card charged, for its plate. */
    brand: string
    /** The card charged, as brand and last four. */
    paymentMethod: string
    /** How it was settled. */
    status: BillingInvoiceStatus
  }

  /** One card on file. */
  export interface BillingPaymentMethod {
    /** Stable key. */
    id: string
    /** Name on the card. */
    holder: string
    /** Card brand. */
    brand: string
    /** Last four digits. */
    last4: string
    /** Expiration, as month and year. */
    expires: string
    /** Whether invoices are charged to it. */
    default: boolean
  }

  /** The current plan and its next charge. */
  export interface BillingSubscription {
    /** Plan name. */
    plan: string
    /** When the plan started. */
    startedAt: Date
    /** When the next charge runs. */
    nextChargeAt: Date
    /** What the next charge bills. */
    nextChargeAmount: number
  }

  /** Where invoices go and whether the plan renews. */
  export interface BillingPaymentInformation {
    /** Email invoices are sent to. */
    email: string
    /** Whether the plan renews on its own. */
    autoRenewal: boolean
    /** Billing address, on one line. */
    address: string
    /** Tax ID; empty shows the empty-value marker. */
    taxId: string
  }

  export interface BillingProps {
    /** The invoices; filtered, sorted and paged in the browser. Left out, the sample renders. */
    invoices?: BillingInvoice[]
    /** The cards on file. Left out, the sample renders. */
    paymentMethods?: BillingPaymentMethod[]
    /** The current plan. Left out, the sample renders. */
    subscription?: BillingSubscription
    /** Where invoices go. Left out, the sample renders. */
    paymentInformation?: BillingPaymentInformation
    /** When the data was fetched. Left out, the sample time renders. */
    updatedAt?: Date
    /** The filter the invoices open with. */
    defaultQuery?: PropertyFilterQuery
    /** A request is in flight: skeletons and loading rows. */
    loading?: boolean
    /** Why the billing data could not load; a danger alert with Retry replaces the tab. */
    error?: string
  }

  const props = withDefaults(defineProps<BillingProps>(), {
    invoices: undefined,
    paymentMethods: undefined,
    subscription: undefined,
    paymentInformation: undefined,
    updatedAt: undefined,
    defaultQuery: () => ({ tokens: [], operation: 'and' }),
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    'set-default': [event: Event, method: BillingPaymentMethod]
    remove: [event: Event, method: BillingPaymentMethod]
  }>()

  const activeTab = defineModel<BillingTab>('tab', { default: 'bills' })

  const { formatDate: formatLocaleDate } = useLocale()

  const dateFormat = (value: Date | number | string) =>
    formatLocaleDate(value, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    })
  const updatedFormat = (value: Date | number | string) =>
    formatLocaleDate(value, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short'
    })
  const formatDate = (value: Date): string => dateFormat(value)
  const formatAmount = (value: number): string => value.toFixed(2)

  const blocked = computed(() => props.loading || props.error !== '')
  const updatedAt = computed(() => props.updatedAt ?? sampleUpdatedAt)
  const subscription = computed(
    () => props.subscription ?? (blocked.value ? undefined : sampleSubscription)
  )
  const paymentInformation = computed(
    () => props.paymentInformation ?? (blocked.value ? undefined : samplePaymentInformation)
  )
  const invoiceSource = computed<BillingInvoice[]>(
    () => props.invoices ?? (blocked.value ? [] : sampleInvoices)
  )
  const methodSource = computed<BillingPaymentMethod[]>(
    () => props.paymentMethods ?? (blocked.value ? [] : samplePaymentMethods)
  )

  const tabs: { value: BillingTab; label: string }[] = [
    { value: 'bills', label: 'Bills' },
    { value: 'payment-methods', label: 'Payment methods' }
  ]

  const invoiceRows = ref<BillingInvoice[]>([])
  watch(
    invoiceSource,
    (next) => {
      invoiceRows.value = [...next]
    },
    { immediate: true }
  )
  const methodRows = ref<BillingPaymentMethod[]>([])
  watch(
    methodSource,
    (next) => {
      methodRows.value = [...next]
    },
    { immediate: true }
  )

  const defaultMethod = computed(() => methodRows.value.find((method) => method.default))
  const methodLabel = (method: BillingPaymentMethod): string =>
    `${method.brand} •••• ${method.last4}`

  const enterprisePerks = [
    { icon: 'az az-chart-line', label: 'On-demand pricing' },
    { icon: 'az az-arrow-down', label: 'Cut costs with commitments' },
    { icon: 'az az-calendar', label: 'Savings Plan available' },
    { icon: 'az az-headphones', label: 'Advanced support available' }
  ]

  const statusSeverity = (status: BillingInvoiceStatus): TagSeverity =>
    (({ Paid: 'success', Refunded: 'neutral', Overdue: 'danger' }) as const)[status] ?? 'neutral'

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
    { accessorKey: 'number', header: 'No.', label: 'Number', sortable: true, minWidth: 72 },
    {
      accessorKey: 'id',
      header: 'Invoice ID',
      sortable: true,
      principal: true,
      hideable: false,
      minWidth: 140
    },
    { accessorKey: 'plan', header: 'Plan', sortable: true, minWidth: 96 },
    { accessorKey: 'cycle', header: 'Cycle', minWidth: 100 },
    { accessorKey: 'seats', header: 'Seats', sortable: true, minWidth: 80 },
    { accessorKey: 'billedAt', header: 'Billing date', sortable: true, minWidth: 130 },
    { accessorKey: 'amount', header: 'Amount', sortable: true, minWidth: 110 },
    { accessorKey: 'paymentMethod', header: 'Payment method', grow: 2, minWidth: 200 },
    { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 110 },
    actionColumn
  ]

  const { tableProps, propertyFilterProps, preferencesProps, status, matchingItems, clearFilters } =
    useCollection({
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
    actionColumn
  ]

  const pendingRemoval = ref<BillingPaymentMethod | null>(null)
  const removeOpen = ref(false)

  const onMethodAction = (
    event: Event,
    value: DropdownMenuItemValue,
    method: BillingPaymentMethod
  ) => {
    if (value === 'default') {
      methodRows.value = methodRows.value.map((item) => ({
        ...item,
        default: item.id === method.id
      }))
      toast.success(`${methodLabel(method)} is now the default.`, {
        description: 'The next invoice is charged to this card.'
      })
      emit('set-default', event, method)
      return
    }
    if (value === 'remove') {
      pendingRemoval.value = method
      removeOpen.value = true
    }
  }

  const onMethodRemove = (event: KeyboardEvent, method: BillingPaymentMethod) => {
    if (!method.default) onMethodAction(event, 'remove', method)
  }

  const removeMethod = (event: Event) => {
    const method = pendingRemoval.value
    if (!method) return
    methodRows.value = methodRows.value.filter((item) => item.id !== method.id)
    removeOpen.value = false
    toast.success(`${methodLabel(method)} removed.`)
    emit('remove', event, method)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Billing"
        description="Your plan, your invoices and the cards they are charged to."
      >
        <template #actions>
          <span class="text-body-sm text-(--text-muted)"
            >Updated {{ updatedFormat(updatedAt) }}</span
          >
          <Tooltip
            content="Refresh"
            class="shrink-0"
          >
            <IconButton
              icon="az az-refresh"
              variant="outline"
              size="medium"
              :loading="loading"
              aria-label="Refresh billing data"
              @click="emit('refresh', $event)"
            />
          </Tooltip>
          <Button
            label="Documentation"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/billing"
            target="_blank"
          />
        </template>
      </PageHeader>

      <PageTabs v-model="activeTab">
        <Tabs.Trigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </PageTabs>

      <section
        class="@container/bands flex min-w-0 flex-col gap-(--layout-section-gap) pb-(--layout-boundary-end)"
      >
        <Alert
          v-if="error"
          severity="danger"
        >
          {{ error }}
          <template #actions>
            <Button
              label="Retry"
              variant="secondary"
              size="small"
              @click="emit('retry', $event)"
            />
          </template>
        </Alert>

        <template v-else-if="activeTab === 'bills'">
          <div
            class="flex min-w-0 flex-col items-stretch gap-(--layout-group-gap) @4xl/bands:flex-row"
          >
            <div class="flex min-w-0 @4xl/bands:w-[45%]">
              <Card class="w-full">
                <template #header>
                  <div class="flex w-full min-w-0 items-center justify-between gap-(--spacing-md)">
                    <h2 class="text-heading-xs text-(--text-default)">Subscription plan</h2>
                    <Button
                      label="Change plan"
                      variant="outline"
                      size="medium"
                      href="/account/account-billing/plans"
                      :disabled="loading"
                    />
                  </div>
                </template>
                <template #default>
                  <div class="flex min-w-0 flex-col gap-(--spacing-md)">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <Skeleton
                        v-if="loading"
                        width="8rem"
                        height="1.25rem"
                      />
                      <template v-else>
                        <span class="truncate text-label-lg text-(--text-default)">{{
                          subscription?.plan
                        }}</span>
                        <Tag
                          label="Current plan"
                          severity="neutral"
                          size="small"
                        />
                      </template>
                    </div>
                    <KeyValueList
                      variant="split"
                      :loading="loading"
                      aria-label="Subscription details"
                    >
                      <KeyValueList.Item label="Plan start date">
                        <template v-if="subscription">{{
                          formatDate(subscription.startedAt)
                        }}</template>
                      </KeyValueList.Item>
                      <KeyValueList.Item label="Next charge date">
                        <template v-if="subscription">{{
                          formatDate(subscription.nextChargeAt)
                        }}</template>
                      </KeyValueList.Item>
                      <KeyValueList.Item label="Next charge value">
                        <CurrencyAmount
                          v-if="subscription"
                          :value="formatAmount(subscription.nextChargeAmount)"
                          size="small"
                        />
                      </KeyValueList.Item>
                      <KeyValueList.Item label="Payment method">
                        <template v-if="defaultMethod">
                          <PaymentBrand
                            :brand="defaultMethod.brand"
                            size="small"
                            decorative
                          />
                          <span>{{ methodLabel(defaultMethod) }}</span>
                        </template>
                      </KeyValueList.Item>
                    </KeyValueList>
                  </div>
                </template>
                <template #footer>
                  <p class="text-body-xs text-(--text-muted)">
                    Each invoice includes all usage up to the last day of the month.
                  </p>
                </template>
              </Card>
            </div>

            <div class="@container/plan flex min-w-0 flex-1">
              <Card class="w-full">
                <template #header>
                  <h2 class="text-heading-xs text-(--text-default)">Upgrade to Enterprise</h2>
                </template>
                <template #default>
                  <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                    <p class="text-body-sm text-(--text-muted)">
                      Higher limits, commitments that lower the price and a support team for
                      workloads that run at scale.
                    </p>
                    <ul class="grid min-w-0 grid-cols-1 gap-(--spacing-sm) @md/plan:grid-cols-2">
                      <li
                        v-for="perk in enterprisePerks"
                        :key="perk.label"
                        class="flex min-w-0 items-center gap-(--spacing-xs)"
                      >
                        <i
                          :class="perk.icon"
                          class="shrink-0 text-body-sm text-(--text-muted)"
                          aria-hidden="true"
                        />
                        <span class="min-w-0 text-body-sm text-(--text-default)">{{
                          perk.label
                        }}</span>
                      </li>
                    </ul>
                  </div>
                </template>
                <template #footer>
                  <div
                    class="flex w-full min-w-0 flex-wrap items-center justify-between gap-(--spacing-md)"
                  >
                    <a
                      href="https://example.com/pricing"
                      target="_blank"
                      rel="noreferrer"
                      class="text-body-xs text-(--text-link) hover:underline"
                      >Pricing and plans</a
                    >
                    <Button
                      label="Contact sales"
                      variant="primary"
                      size="medium"
                      href="https://example.com/contact-sales"
                      target="_blank"
                      :disabled="loading"
                    />
                  </div>
                </template>
              </Card>
            </div>
          </div>

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
                  <template #cell-id="{ value }">
                    <span
                      class="truncate tabular-nums"
                      dir="ltr"
                      >{{ value }}</span
                    >
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
                </DataTable>
              </template>
            </Card>
          </div>
        </template>

        <template v-else>
          <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
            <Subheader
              title="Payment information"
              description="Where invoices are sent, and whether the plan renews on its own."
              size="small"
            >
              <template #actions>
                <Button
                  label="Update"
                  variant="outline"
                  size="medium"
                  href="/account/account-billing/payment-information"
                  :disabled="loading"
                />
              </template>
            </Subheader>
            <Card>
              <template #default>
                <KeyValueList
                  :columns="4"
                  :loading="loading"
                  aria-label="Payment information"
                >
                  <KeyValueList.Item label="Billing email">
                    <span
                      v-if="paymentInformation?.email"
                      dir="ltr"
                      >{{ paymentInformation.email }}</span
                    >
                  </KeyValueList.Item>
                  <KeyValueList.Item label="Auto-renewal">
                    <StatusIndicator
                      v-if="paymentInformation"
                      :severity="paymentInformation.autoRenewal ? 'success' : 'neutral'"
                      :label="paymentInformation.autoRenewal ? 'On' : 'Off'"
                    />
                  </KeyValueList.Item>
                  <KeyValueList.Item label="Billing address">
                    <template v-if="paymentInformation?.address">{{
                      paymentInformation.address
                    }}</template>
                  </KeyValueList.Item>
                  <KeyValueList.Item label="Tax ID">
                    <template v-if="paymentInformation?.taxId">{{
                      paymentInformation.taxId
                    }}</template>
                  </KeyValueList.Item>
                </KeyValueList>
              </template>
            </Card>
          </div>

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
                  :data="methodRows"
                  :columns="methodColumns"
                  row-key="id"
                  :loading="loading"
                  sortable
                  :bordered="false"
                  aria-label="Payment methods"
                  @row-remove="onMethodRemove"
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
                      @select="(event, value) => onMethodAction(event, value, row)"
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
      </section>
    </div>

    <ConfirmDialog
      v-model:open="removeOpen"
      title="Remove payment method"
      :description="`${pendingRemoval ? methodLabel(pendingRemoval) : ''} is removed from the account. Paid invoices keep showing it.`"
      confirm-label="Remove"
      size="small"
      @confirm="removeMethod"
    />
  </div>
</template>
