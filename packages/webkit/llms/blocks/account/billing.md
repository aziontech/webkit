# Billing (`account/billing`)

> The Billing page of the account settings: a `PageHeader` with the last update, Refresh and Documentation over `PageTabs` (Bills, Payment methods). Bills puts a Subscription plan `Card` (plan with a Current plan `Tag`, Change plan, and `KeyValueList` for plan start, next charge date and value as `CurrencyAmount`, and the default card with its `PaymentBrand`) beside an Upgrade to Enterprise `Card`, then Invoices on one `useCollection`: a controls row (`PropertyFilter`, Refresh, Download CSV, `CollectionPreferences`) over a `DataTable` with No., Invoice ID, Plan, Cycle, Seats, Billing date, Amount, Payment method, Status as `TableCellStatus` and a download `IconButton` per invoice. Payment methods shows Payment information as `KeyValueList` (billing email, auto-renewal as `StatusIndicator`, address, tax ID) with Update, and a `DataTable` of cards (holder with a Default `Tag`, brand and last four, expiry, `TableCellActions` with Set as default and Remove behind a `ConfirmDialog`). Outcomes go through `toast`. A page body for ConsoleLayout, rendered in its default slot.

- Surface: app
- Source: `blocks/account/billing/billing.vue` in `@aziontech/webkit`
- MCP: `get_block("account/billing")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [CollectionPreferences](../../components/collection-preferences.md), [ConfirmDialog](../../components/confirm-dialog.md), [CurrencyAmount](../../components/currency-amount.md), [DataTable](../../components/data-table.md), [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [IconButton](../../components/icon-button.md), [KeyValueList](../../components/key-value-list.md), [PageHeader](../../components/page-header.md), [PageTabs](../../components/page-tabs.md), [PaymentBrand](../../components/payment-brand.md), [PropertyFilter](../../components/property-filter.md), [SectionHeader](../../components/section-header.md), [Skeleton](../../components/skeleton.md), [StatusIndicator](../../components/status-indicator.md), [Table](../../components/table.md), `TableCellActions`, `TableCellStatus`, [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), `use-collection`, `use-locale`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-ui-states`, `webkit-navigation`, `webkit-microcopy`

## Asked as

billing; billing page; invoices; invoice history; download invoice; subscription plan; current plan; payment methods; default card; billing email; faturamento; faturas; histórico de faturas; plano de assinatura; métodos de pagamento; cobrança

What the account pays, what it paid and which card it is charged to. An admin checks the current plan and the next charge, moves to another plan, finds and downloads an invoice, and keeps the cards on file current: which one is the default, which ones to remove. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- The billing page of an account or organisation: plan, invoice history and payment methods.
- Downloading or exporting past invoices.
- Choosing the card invoices are charged to.

## When not to use

- Comparing plans and upgrading: use `account/change-plan-drawer`, which this page opens from Change plan.
- Entering a new card: use `account/payment-method-card`.
- Usage charts and quotas: use a `dashboard` block.

## Building blocks

### A. Page heading — `PageHeader`, `Tooltip`, `IconButton`, `Button` (required)

Title `Billing` and one sentence on what the page holds. Actions: the time of the last update as muted text (a fixed, formatted date in UTC, never the clock at render), Refresh as an outlined icon button in a tooltip, named `Refresh billing data`, which shows its loading state, and Documentation.

### B. Tabs — `PageTabs`, `Tabs` (required)

`PageTabs` with one `Tabs.Trigger` per tab: `Bills` and `Payment methods`. Only the active tab's content renders; the heading and the load state are shared.

### C. Load failure — `Alert` (conditional)

When the billing data fails to load, a danger `Alert` with Retry takes the tab's place and says that nothing was charged or changed.

### D. Subscription plan — `Card`, `Skeleton`, `Tag`, `KeyValueList`, `CurrencyAmount`, `PaymentBrand` (required)

A `Card` whose header holds the `Subscription plan` heading and the outlined `Change plan`, which opens `account/change-plan-drawer` (the copyable SFC links to the plans route so it stands alone). The body shows the plan name with a small secondary `Current plan` `Tag` (a `Skeleton` while loading), then split `KeyValueList` with Plan start date, Next charge date, Next charge value as `CurrencyAmount`, and the default card as a decorative `PaymentBrand` plate and its brand and last four. The footer says what an invoice includes. On wide containers it takes about half the row.

### E. Upgrade card — `Card` (required)

`Upgrade to Enterprise` beside the plan card: one sentence on what the tier adds, four perks with icons, a link to pricing and a primary `Contact sales`, the one primary action on the page (the tier is sold by the sales team). Show the next tier only; hide the card on the top tier.

### F. Invoices controls — `SectionHeader`, `PropertyFilter`, `CollectionPreferences` (required)

A small `SectionHeader` `Invoices` over the table-view controls row: `PropertyFilter` bound with `v-bind="propertyFilterProps"` (Invoice ID free text, Plan, Cycle and Status with options), then Refresh (`Refresh invoices`) and Download CSV as outlined icon buttons in tooltips, then `CollectionPreferences` (page size 10, 25 or 50; columns), saved under `storageKey`.

### G. Invoices table — `DataTable`, `TableCellActions`, `TableCellStatus`, `useCollection` (required)

One `useCollection` over the invoices, newest first, `DataTable` bound with `v-bind="tableProps"` in a flush `Card`. Columns: No., Invoice ID (left to right), Plan, Cycle, Seats, Billing date as a formatted date, Amount as `CurrencyAmount`, Payment method with its plate, Status as `TableCellStatus` (Paid success, Refunded secondary, Overdue danger), and a download icon button per row named `Download invoice <id>` that links to the PDF.

### H. No invoices and no match — `EmptyState` (conditional)

An account with no invoice yet replaces the table with `No invoices yet` and a link to how billing works. Filters that hide every invoice fill the table's `#empty` slot with `No matching invoices` and Clear filters.

### I. Payment information — `StatusIndicator` (required on the Payment methods tab)

A `SectionHeader` with Update over a `Card` of four-column `KeyValueList`: Billing email, Auto-renewal as a `StatusIndicator` (On or Off, never colour alone), Billing address and Tax ID (empty shows the empty-value marker).

### J. Payment methods — `DropdownMenu`, `ConfirmDialog` (required on the Payment methods tab)

A `SectionHeader` with Add payment method over a flush `Card` and a `DataTable` of cards: Card holder with a small success `Default` tag, Card as the brand plate and the last four, Expiration date, and `TableCellActions` named after the card with `Set as default` and `Remove` as `DropdownMenu` options, both disabled on the default card. Set as default applies at once with a toast; Remove asks in a `ConfirmDialog` first.

### Outcomes — through `toast`

Set as default and Remove end in a success toast that names the card. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root), so the page never renders a `Toaster`.

## Data

The block takes its records through props and emits every action; it fetches nothing. `BillingProps`, `BillingInvoice`, `BillingPaymentMethod`, `BillingSubscription` and `BillingPaymentInformation` are exported from `billing.vue`, and `sample.ts` holds the sample plan, invoices, cards and payment information the block renders when a prop is left out (and never while `loading` or `error` is set).

| Prop                 | Type                         | What it does                                                                                         |
| -------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| `invoices`           | `BillingInvoice[]`           | The invoices; the filter, the sort and the pages run on them in the browser. `[]` shows No invoices. |
| `paymentMethods`     | `BillingPaymentMethod[]`     | The cards on file; the one with `default` is charged and named in the plan card.                     |
| `subscription`       | `BillingSubscription`        | The plan name, its start date and the next charge's date and amount.                                 |
| `paymentInformation` | `BillingPaymentInformation`  | Billing email, auto-renewal, billing address and Tax ID.                                             |
| `updatedAt`          | `Date`                       | When the data was fetched, shown beside Refresh.                                                     |
| `defaultQuery`       | `PropertyFilterQuery`        | The filter the invoices open with.                                                                   |
| `tab`                | `BillingTab` (`v-model:tab`) | The active tab, `bills` or `payment-methods`.                                                        |
| `loading`            | `boolean`                    | A request is in flight: skeletons in the plan card and the tables' loading rows.                     |
| `error`              | `string`                     | Why the billing data failed to load, shown in the danger `Alert` with Retry that replaces the tab.   |

| Event         | Payload           | When                                                                                  |
| ------------- | ----------------- | ------------------------------------------------------------------------------------- |
| `refresh`     | `(event)`         | Refresh, in the heading or the invoices controls.                                     |
| `retry`       | `(event)`         | Retry in the error alert.                                                             |
| `set-default` | `(event, method)` | Set as default in a card's menu; the table and the plan card already show the change. |
| `remove`      | `(event, method)` | The remove dialog was confirmed; the card is already gone from the table.             |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import Billing from './billing.vue'

  const { data, pending, error, refresh } = useBilling()
  const loadError =
    'Your billing data could not be loaded. Nothing was charged or changed; try again.'
</script>

<template>
  <Billing
    :invoices="data?.invoices ?? []"
    :payment-methods="data?.paymentMethods ?? []"
    :subscription="data?.subscription"
    :payment-information="data?.paymentInformation"
    :updated-at="data?.fetchedAt"
    :loading="pending"
    :error="error ? loadError : ''"
    @refresh="refresh"
    @retry="refresh"
    @set-default="(event, method) => setDefaultCard(method.id)"
    @remove="(event, method) => removeCard(method.id)"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Show the next charge date and value next to the plan, in the account's currency.
- Name the card by brand and last four everywhere: the plan card, the invoices and the methods table.
- Keep the default card from being removed; ask for another default first by disabling Remove on it.
- Keep the filter first, the export last but one and preferences last in the controls row.

## Don't

- Don't show a full card number or the card's security code.
- Don't stamp the last update with the clock at render; show the time the data was fetched.
- Don't treat an account with no invoices yet as an error.

## Copy

- **Title:** `Billing`. **Tabs:** `Bills`, `Payment methods`.
- **Plan card:** `Subscription plan`, `Current plan`, `Change plan`; facts `Plan start date`, `Next charge date`, `Next charge value`, `Payment method`.
- **Invoices:** `Filter invoices`; statuses `Paid`, `Refunded`, `Overdue`; empty `No invoices yet`, `Your first invoice appears here when the first billing cycle closes.`; no match `No matching invoices`, `Clear filters`.
- **Payment methods:** `Set as default`, `Remove`; confirm `Remove payment method`; toasts `Mastercard •••• 1702 is now the default.`, `Visa •••• 4431 removed.`
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- No `main` of its own; the `PageHeader` title is the only `h1`, the cards and bands use `h2`.
- The tabs follow the tablist keyboard model from `Tabs`; both tables are named (`Invoices`, `Payment methods`).
- Icon buttons have names that match their tooltips; each download names its invoice and each row menu names its card.
- The `PaymentBrand` plate is decorative wherever the brand is written next to it, and named in the methods table.
- Invoice IDs, card digits and the billing email keep left-to-right direction inside a right-to-left page.

## States

- Default: the Bills tab (`tab` is `bills`) with the Pro plan, the Enterprise upgrade card and twelve monthly invoices, with filter, refresh, export, preferences, sorting and paging wired.
- Loading: the first load (`loading`); skeletons in the plan card and the invoices table's loading rows.
- Error: the billing data did not load (`error` is set); a danger Alert with the message and Retry.
- NoInvoices: no invoice yet (`invoices` is `[]`); a flush empty state says when the first one appears.
- NoMatch: a filter that matches no invoice (`defaultQuery` is Status = Overdue); No matching invoices with Clear filters.
- PaymentMethods: the Payment methods tab (`tab` is `payment-methods`) with payment information and three cards.

## Related

- `account/change-plan-drawer` — the plan comparison Change plan opens.
- `account/payment-method-card` — the card form for adding or changing a card.
- `view/table-view` — the list pattern the invoices follow.
- `account/activity-history` — where billing changes are audited.

## Variants

- `Default` — primary (the code below)
- `Loading` — The first load: the plan name and every value as skeletons, Change plan and Contact sales disabled, and the invoices table's loading rows.
- `Error` — The billing data did not load: a danger Alert with Retry replaces the tab's content; Retry loads it.
- `NoInvoices` — A new account before its first billing cycle closes: the plan cards, then a flush EmptyState that says when the first invoice appears.
- `NoMatch` — A Status = Overdue filter that matches no invoice: the table's empty slot says so and offers Clear filters.
- `PaymentMethods` — The Payment methods tab: Payment information with Update, then the cards with the default one tagged; Set as default and Remove (after confirmation) are wired.

Each variant is the same screen in another state: `get_block("account/billing", { variant })`, or the file under `blocks/account/billing/variants/`.

## Code (`Default`)

```vue
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
  import SectionHeader from '@aziontech/webkit/section-header'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
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
    { icon: 'ai ai-chart-line', label: 'On-demand pricing' },
    { icon: 'ai ai-arrow-down', label: 'Cut costs with commitments' },
    { icon: 'ai ai-calendar', label: 'Savings Plan available' },
    { icon: 'ai ai-headphones', label: 'Advanced support available' }
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
              icon="ai ai-refresh"
              variant="outline"
              size="medium"
              :loading="loading"
              aria-label="Refresh billing data"
              @click="emit('refresh', $event)"
            />
          </Tooltip>
          <Button
            label="Documentation"
            icon="ai ai-book"
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
                      href="/account/billing/plans"
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
            <SectionHeader
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
                    icon="ai ai-refresh"
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
                    icon="ai ai-download"
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
                  icon="ai ai-file"
                  title="No invoices yet"
                  description="Your first invoice appears here when the first billing cycle closes."
                >
                  <template #actions>
                    <Button
                      label="How billing works"
                      variant="outline"
                      size="small"
                      icon="ai ai-external-link"
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
                        icon="ai ai-file-pdf"
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
                      icon="ai ai-search"
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
            <SectionHeader
              title="Payment information"
              description="Where invoices are sent, and whether the plan renews on its own."
              size="small"
            >
              <template #actions>
                <Button
                  label="Update"
                  variant="outline"
                  size="medium"
                  href="/account/billing/payment-information"
                  :disabled="loading"
                />
              </template>
            </SectionHeader>
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
            <SectionHeader
              title="Payment methods"
              description="Every card on the account. Invoices are charged to the default one."
              size="small"
            >
              <template #actions>
                <Button
                  label="Add payment method"
                  icon="ai ai-plus"
                  variant="outline"
                  size="medium"
                  href="/account/billing/payment-methods/new"
                  :disabled="loading"
                />
              </template>
            </SectionHeader>
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
```

## `sample.ts`

```ts
import type {
  BillingInvoice,
  BillingPaymentInformation,
  BillingPaymentMethod,
  BillingSubscription
} from './billing.vue'

export const sampleUpdatedAt = new Date(Date.UTC(2026, 10, 10, 12))

export const sampleSubscription: BillingSubscription = {
  plan: 'Pro',
  startedAt: new Date(Date.UTC(2023, 0, 25)),
  nextChargeAt: new Date(Date.UTC(2026, 11, 1)),
  nextChargeAmount: 184.2
}

export const samplePaymentInformation: BillingPaymentInformation = {
  email: 'billing@example.com',
  autoRenewal: true,
  address: '100 Market Street, Suite 400, San Francisco, CA 94105',
  taxId: ''
}

export const samplePaymentMethods: BillingPaymentMethod[] = [
  {
    id: 'pm-1',
    holder: 'Jane Doe',
    brand: 'Mastercard',
    last4: '1702',
    expires: '02 / 2027',
    default: true
  },
  {
    id: 'pm-2',
    holder: 'Acme Inc.',
    brand: 'Visa',
    last4: '4431',
    expires: '11 / 2026',
    default: false
  },
  {
    id: 'pm-3',
    holder: 'John Smith',
    brand: 'American Express',
    last4: '9008',
    expires: '05 / 2028',
    default: false
  }
]

const usage = [
  184.2, 171.95, 168.4, 159.1, 162.75, 148.3, 139.9, 131.25, 126.6, 118.4, 104.15, 96.8
]
const seatsByMonth = [8, 8, 7, 7, 7, 6, 6, 6, 5, 5, 4, 4]

export const sampleInvoices: BillingInvoice[] = usage.map((amount, index) => ({
  id: `INV-A${12401 - index}`,
  number: 132 - index,
  plan: 'Pro',
  cycle: 'Monthly',
  seats: seatsByMonth[index],
  billedAt: new Date(Date.UTC(2026, 10 - index, 1)),
  amount,
  brand: 'Mastercard',
  paymentMethod: 'Mastercard •••• 1702',
  status: index === 3 ? 'Refunded' : 'Paid'
}))
```
