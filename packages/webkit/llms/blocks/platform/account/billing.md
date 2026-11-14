# Billing (`platform/account/billing`)

> The Billing page of the account settings: a `PageHeader` with the last update, Refresh and Documentation over `PageTabs` (Bills, Payment Methods). Bills puts a Subscription plan `Card` (plan with a Current plan `Tag`, Change plan, and `KeyValuePairs` for plan start, next charge date and value as `Currency`, and the default card with its `PaymentBrand`) beside an Upgrade to Enterprise `Card`, then Invoices on one `useCollection`: a controls row (`PropertyFilter`, Refresh, Download CSV, `CollectionPreferences`) over a `Table` with No., Invoice ID, Plan, Cycle, Seats, Billing date, Amount, Payment method, Status as `Table.CellStatus` and a download `IconButton` per invoice. Payment Methods shows Payment information as `KeyValuePairs` (billing email, auto-renewal as `StatusIndicator`, address, tax ID) with Update, and a `Table` of cards (holder with a Default `Tag`, brand and last four, expiry, `Table.CellActions` with Set as default and Remove behind a `ConfirmDialog`). Outcomes go through `toast`. A page body for ConsoleLayout, rendered in its default slot.

- Surface: product
- Source: `blocks/platform/account/billing/billing.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/account/billing")`
- Components: [Alert](../../../components/alert.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [CollectionPreferences](../../../components/collection-preferences.md), [ConfirmDialog](../../../components/confirm-dialog.md), [Currency](../../../components/currency.md), [DropdownMenu](../../../components/dropdown-menu.md), [EmptyState](../../../components/empty-state.md), [IconButton](../../../components/icon-button.md), [KeyValuePairs](../../../components/key-value-pairs.md), [PageHeader](../../../components/page-header.md), [PageTabs](../../../components/page-tabs.md), [PaymentBrand](../../../components/payment-brand.md), [PropertyFilter](../../../components/property-filter.md), [SectionHeader](../../../components/section-header.md), [Skeleton](../../../components/skeleton.md), [StatusIndicator](../../../components/status-indicator.md), [Table](../../../components/table.md), [Tabs](../../../components/tabs.md), [Tag](../../../components/tag.md), [Toast](../../../components/toast.md), [Tooltip](../../../components/tooltip.md), `use-collection`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-ui-states`, `webkit-navigation`, `webkit-microcopy`

## Asked as

billing; billing page; invoices; invoice history; download invoice; subscription plan; current plan; payment methods; default card; billing email; faturamento; faturas; histórico de faturas; plano de assinatura; métodos de pagamento; cobrança

What the account pays, what it paid and which card it is charged to. An admin checks the current plan and the next charge, moves to another plan, finds and downloads an invoice, and keeps the cards on file current: which one is the default, which ones to remove. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- The billing page of an account or organisation: plan, invoice history and payment methods.
- Downloading or exporting past invoices.
- Choosing the card invoices are charged to.

## When not to use

- Comparing plans and upgrading: use `platform/account/change-plan-drawer`, which this page opens from Change plan.
- Entering a new card: use `platform/account/payment-method-card`.
- Usage charts and quotas: use a `platform/dashboard` block.

## Building blocks

### A. Page heading — `PageHeader`, `Tooltip`, `IconButton`, `Button` (required)

Title `Billing` and one sentence on what the page holds. Actions: the time of the last update as muted text (a fixed, formatted date in UTC, never the clock at render), Refresh as an outlined icon button in a tooltip, named `Refresh billing data`, which shows its loading state, and Documentation.

### B. Tabs — `PageTabs`, `Tabs` (required)

`PageTabs` with one `Tabs.Item` per tab: `Bills` and `Payment Methods`. Only the active tab's content renders; the heading and the load state are shared.

### C. Load failure — `Alert` (conditional)

When the billing data fails to load, a danger `Alert` with Retry takes the tab's place and says that nothing was charged or changed.

### D. Subscription plan — `Card`, `Skeleton`, `Tag`, `KeyValuePairs`, `Currency`, `PaymentBrand` (required)

A `Card` whose header holds the `Subscription plan` heading and the outlined `Change plan`, which opens `platform/account/change-plan-drawer` (the copyable SFC links to the plans route so it stands alone). The body shows the plan name with a small secondary `Current plan` `Tag` (a `Skeleton` while loading), then split `KeyValuePairs` with Plan start date, Next charge date, Next charge value as `Currency`, and the default card as a decorative `PaymentBrand` plate and its brand and last four. The footer says what an invoice includes. On wide containers it takes about half the row.

### E. Upgrade card — `Card` (required)

`Upgrade to Enterprise` beside the plan card: one sentence on what the tier adds, four perks with icons, a link to pricing and a primary `Contact sales`, the one primary action on the page (the tier is sold by the sales team). Show the next tier only; hide the card on the top tier.

### F. Invoices controls — `SectionHeader`, `PropertyFilter`, `CollectionPreferences` (required)

A small `SectionHeader` `Invoices` over the table-view controls row: `PropertyFilter` bound with `v-bind="propertyFilterProps"` (Invoice ID free text, Plan, Cycle and Status with options), then Refresh (`Refresh invoices`) and Download CSV as outlined icon buttons in tooltips, then `CollectionPreferences` (page size 10, 25 or 50; columns), saved under `storageKey`.

### G. Invoices table — `Table`, `useCollection` (required)

One `useCollection` over the invoices, newest first, `Table` bound with `v-bind="tableProps"` in a flush `Card`. Columns: No., Invoice ID (left to right), Plan, Cycle, Seats, Billing date as a formatted date, Amount as `Currency`, Payment method with its plate, Status as `Table.CellStatus` (Paid success, Refunded secondary, Overdue danger), and a download icon button per row named `Download invoice <id>` that links to the PDF.

### H. No invoices and no match — `EmptyState` (conditional)

An account with no invoice yet replaces the table with `No invoices yet` and a link to how billing works. Filters that hide every invoice fill the table's `#empty` slot with `No matching invoices` and Clear filters.

### I. Payment information — `StatusIndicator` (required on Payment Methods)

A `SectionHeader` with Update over a `Card` of four-column `KeyValuePairs`: Billing email, Auto-renewal as a `StatusIndicator` (On or Off, never colour alone), Billing address and Tax ID (empty shows the empty-value marker).

### J. Payment methods — `DropdownMenu`, `ConfirmDialog` (required on Payment Methods)

A `SectionHeader` with Add payment method over a flush `Card` and a `Table` of cards: Card holder with a small success `Default` tag, Card as the brand plate and the last four, Expiration date, and `Table.CellActions` named after the card with `Set as default` and `Remove` as `DropdownMenu` options, both disabled on the default card. Set as default applies at once with a toast; Remove asks in a `ConfirmDialog` first.

### Outcomes — through `toast`

Set as default and Remove end in a success toast that names the card. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root), so the page never renders a `Toaster`.

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

- **Title:** `Billing`. **Tabs:** `Bills`, `Payment Methods`.
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

- Default: the Bills tab with the Pro plan, the Enterprise upgrade card and twelve monthly invoices, with filter, refresh, export, preferences, sorting and paging wired.
- Loading: the first load; skeletons in the plan card and the invoices table's loading rows.
- Failed: the billing data did not load; a danger Alert with Retry.
- NoInvoices: no invoice yet; a flush empty state says when the first one appears.
- NoMatch: a filter that matches no invoice; No matching invoices with Clear filters.
- PaymentMethods: the Payment Methods tab with payment information and three cards.

## Related

- `platform/account/change-plan-drawer` — the plan comparison Change plan opens.
- `platform/account/payment-method-card` — the card form for adding or changing a card.
- `platform/view/table-view` — the list pattern the invoices follow.
- `platform/account/activity-history` — where billing changes are audited.

## Variants

- `Default` — primary (the code below)
- `Loading` — The first load: the plan name and every value as skeletons, Change plan and Contact sales disabled, and the invoices table's loading rows.
- `Failed` — The billing data did not load: a danger Alert with Retry replaces the tab's content; Retry loads it.
- `NoInvoices` — A new account before its first billing cycle closes: the plan cards, then a flush EmptyState that says when the first invoice appears.
- `NoMatch` — A Status = Overdue filter that matches no invoice: the table's empty slot says so and offers Clear filters.
- `PaymentMethods` — The Payment Methods tab: Payment information with Update, then the cards with the default one tagged; Set as default and Remove (after confirmation) are wired.

Each variant is the same screen in another state: `get_pattern("platform/account/billing", { variant })`, or the file under `blocks/platform/account/billing/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Currency from '@aziontech/webkit/currency'
  import DropdownMenu, { type DropdownMenuOptionValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PaymentBrand from '@aziontech/webkit/payment-brand'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import SectionHeader from '@aziontech/webkit/section-header'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Table, { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import {
    type FilteringProperty,
    type PropertyFilterQuery,
    useCollection
  } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  type BillingTab = 'bills' | 'payment-methods'
  type InvoiceStatus = 'Paid' | 'Refunded' | 'Overdue'

  interface Invoice {
    id: string
    number: number
    plan: string
    cycle: 'Monthly' | 'Yearly'
    seats: number
    billedAt: Date
    amount: number
    brand: string
    paymentMethod: string
    status: InvoiceStatus
  }

  interface PaymentMethod {
    id: string
    holder: string
    brand: string
    last4: string
    expires: string
    default: boolean
  }

  const INITIAL_TAB: BillingTab = 'bills'
  const INITIAL_QUERY: PropertyFilterQuery = { tokens: [], operation: 'and' }
  const START_LOADING = false
  const START_FAILED = false
  const WITH_INVOICES = true

  const UPDATED_AT = new Date(Date.UTC(2026, 10, 10, 12))
  const dateFormat = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  })
  const updatedFormat = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short'
  })
  const formatDate = (value: Date): string => dateFormat.format(value)
  const formatAmount = (value: number): string => value.toFixed(2)

  const seedMethods: PaymentMethod[] = [
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
  const seedInvoices: Invoice[] = usage.map((amount, index) => ({
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

  const activeTab = ref<string>(INITIAL_TAB)
  const tabs: { value: BillingTab; label: string }[] = [
    { value: 'bills', label: 'Bills' },
    { value: 'payment-methods', label: 'Payment Methods' }
  ]

  const loading = ref(START_LOADING)
  const loadFailed = ref(START_FAILED)
  const invoices = ref<Invoice[]>(WITH_INVOICES ? seedInvoices : [])
  const paymentMethods = ref<PaymentMethod[]>(seedMethods)

  const load = () => {
    if (loading.value) return
    loadFailed.value = false
    loading.value = true
    setTimeout(() => {
      invoices.value = WITH_INVOICES ? seedInvoices : []
      loading.value = false
    }, 700)
  }

  const defaultMethod = computed(() => paymentMethods.value.find((method) => method.default))
  const methodLabel = (method: PaymentMethod): string => `${method.brand} •••• ${method.last4}`

  const enterprisePerks = [
    { icon: 'pi pi-chart-line', label: 'On-demand pricing' },
    { icon: 'pi pi-arrow-down', label: 'Cut costs with commitments' },
    { icon: 'pi pi-calendar', label: 'Savings Plan available' },
    { icon: 'pi pi-headphones', label: 'Advanced support available' }
  ]

  const statusSeverity = (status: InvoiceStatus): TagSeverity =>
    (({ Paid: 'success', Refunded: 'secondary', Overdue: 'danger' }) as const)[status] ??
    'secondary'

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

  const columns: TableColumn[] = [
    { accessorKey: 'number', header: 'No.', label: 'Number', enableSorting: true, minWidth: 72 },
    {
      accessorKey: 'id',
      header: 'Invoice ID',
      enableSorting: true,
      principal: true,
      hideable: false,
      minWidth: 140
    },
    { accessorKey: 'plan', header: 'Plan', enableSorting: true, minWidth: 96 },
    { accessorKey: 'cycle', header: 'Cycle', minWidth: 100 },
    { accessorKey: 'seats', header: 'Seats', enableSorting: true, minWidth: 80 },
    { accessorKey: 'billedAt', header: 'Billing date', enableSorting: true, minWidth: 130 },
    { accessorKey: 'amount', header: 'Amount', enableSorting: true, minWidth: 110 },
    { accessorKey: 'paymentMethod', header: 'Payment method', grow: 2, minWidth: 200 },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: 110 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const { tableProps, propertyFilterProps, preferencesProps, status, matchingItems, clearFilters } =
    useCollection({
      items: invoices,
      columns,
      filtering: { fields: ['id', 'plan', 'cycle', 'status'] },
      propertyFiltering: { properties, defaultQuery: INITIAL_QUERY },
      sorting: { defaultState: [{ id: 'billedAt', desc: true }] },
      pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
      preferences: { storageKey: 'billing-invoices' }
    })

  const invoicesTable = ref<TableExposed<Invoice> | null>(null)
  const exportCsv = () => invoicesTable.value?.exportCsv({ filename: 'invoices.csv' })

  const methodColumns: TableColumn[] = [
    {
      accessorKey: 'holder',
      header: 'Card holder',
      enableSorting: true,
      principal: true,
      hideable: false,
      grow: 2
    },
    { accessorKey: 'last4', header: 'Card', grow: 2, minWidth: 200 },
    { accessorKey: 'expires', header: 'Expiration date', minWidth: 140 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const pendingRemoval = ref<PaymentMethod | null>(null)
  const removeOpen = ref(false)

  const onMethodAction = (value: DropdownMenuOptionValue, method: PaymentMethod) => {
    if (value === 'default') {
      paymentMethods.value = paymentMethods.value.map((item) => ({
        ...item,
        default: item.id === method.id
      }))
      toast.success(`${methodLabel(method)} is now the default.`, {
        description: 'The next invoice is charged to this card.'
      })
      return
    }
    if (value === 'remove') {
      pendingRemoval.value = method
      removeOpen.value = true
    }
  }

  const removeMethod = () => {
    const method = pendingRemoval.value
    if (!method) return
    paymentMethods.value = paymentMethods.value.filter((item) => item.id !== method.id)
    removeOpen.value = false
    toast.success(`${methodLabel(method)} removed.`)
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
            >Updated {{ updatedFormat.format(UPDATED_AT) }}</span
          >
          <Tooltip
            text="Refresh"
            class="shrink-0"
          >
            <IconButton
              icon="pi pi-refresh"
              kind="outlined"
              size="medium"
              :loading="loading"
              aria-label="Refresh billing data"
              @click="load"
            />
          </Tooltip>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/billing"
            target="_blank"
          />
        </template>
      </PageHeader>

      <PageTabs v-model="activeTab">
        <Tabs.Item
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
          v-if="loadFailed"
          severity="danger"
        >
          Your billing data could not be loaded. Nothing was charged or changed; try again.
          <template #action>
            <Button
              label="Retry"
              kind="secondary"
              size="small"
              @click="load"
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
                      kind="outlined"
                      size="medium"
                      href="/account/billing/plans"
                      :disabled="loading"
                    />
                  </div>
                </template>
                <template #content>
                  <div class="flex min-w-0 flex-col gap-(--spacing-md)">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <Skeleton
                        v-if="loading"
                        width="8rem"
                        height="1.25rem"
                      />
                      <template v-else>
                        <span class="truncate text-label-lg text-(--text-default)">Pro</span>
                        <Tag
                          label="Current plan"
                          severity="secondary"
                          size="small"
                        />
                      </template>
                    </div>
                    <KeyValuePairs
                      kind="split"
                      :loading="loading"
                      aria-label="Subscription details"
                    >
                      <KeyValuePairs.Item label="Plan start date">Jan 25, 2023</KeyValuePairs.Item>
                      <KeyValuePairs.Item label="Next charge date">Dec 1, 2026</KeyValuePairs.Item>
                      <KeyValuePairs.Item label="Next charge value">
                        <Currency
                          value="184.20"
                          size="small"
                        />
                      </KeyValuePairs.Item>
                      <KeyValuePairs.Item label="Payment method">
                        <template v-if="defaultMethod">
                          <PaymentBrand
                            :brand="defaultMethod.brand"
                            size="small"
                            decorative
                          />
                          <span>{{ methodLabel(defaultMethod) }}</span>
                        </template>
                      </KeyValuePairs.Item>
                    </KeyValuePairs>
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
                <template #content>
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
                      kind="primary"
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
                  text="Refresh"
                  class="shrink-0"
                >
                  <IconButton
                    icon="pi pi-refresh"
                    kind="outlined"
                    size="medium"
                    :loading="loading"
                    aria-label="Refresh invoices"
                    @click="load"
                  />
                </Tooltip>
                <Tooltip
                  text="Download CSV"
                  class="shrink-0"
                >
                  <IconButton
                    icon="pi pi-download"
                    kind="outlined"
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
              <template #content>
                <EmptyState
                  size="medium"
                  icon="pi pi-file"
                  title="No invoices yet"
                  description="Your first invoice appears here when the first billing cycle closes."
                >
                  <template #actions>
                    <Button
                      label="How billing works"
                      kind="outlined"
                      size="small"
                      icon="pi pi-external-link"
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
              <template #content>
                <Table
                  ref="invoicesTable"
                  v-bind="tableProps"
                  :loading="loading"
                  enable-sorting
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
                    <Currency
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
                    <Table.CellStatus
                      :label="value"
                      :severity="statusSeverity(value)"
                    />
                  </template>
                  <template #header-actions>
                    <span class="sr-only">Actions</span>
                  </template>
                  <template #cell-actions="{ row }">
                    <Tooltip text="Download invoice">
                      <IconButton
                        icon="pi pi-file-pdf"
                        kind="outlined"
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
                      icon="pi pi-search"
                      title="No matching invoices"
                      description="No invoice matches these filters."
                    >
                      <template #actions>
                        <Button
                          label="Clear filters"
                          kind="outlined"
                          size="small"
                          @click="clearFilters"
                        />
                      </template>
                    </EmptyState>
                  </template>
                </Table>
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
                  kind="outlined"
                  size="medium"
                  href="/account/billing/payment-information"
                  :disabled="loading"
                />
              </template>
            </SectionHeader>
            <Card>
              <template #content>
                <KeyValuePairs
                  :columns="4"
                  :loading="loading"
                  aria-label="Payment information"
                >
                  <KeyValuePairs.Item label="Billing email">
                    <span dir="ltr">billing@example.com</span>
                  </KeyValuePairs.Item>
                  <KeyValuePairs.Item label="Auto-renewal">
                    <StatusIndicator
                      severity="success"
                      label="On"
                    />
                  </KeyValuePairs.Item>
                  <KeyValuePairs.Item label="Billing address"
                    >100 Market Street, Suite 400, San Francisco, CA 94105</KeyValuePairs.Item
                  >
                  <KeyValuePairs.Item label="Tax ID" />
                </KeyValuePairs>
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
                  icon="pi pi-plus"
                  kind="outlined"
                  size="medium"
                  href="/account/billing/payment-methods/new"
                  :disabled="loading"
                />
              </template>
            </SectionHeader>
            <Card :padded="false">
              <template #content>
                <Table
                  :data="paymentMethods"
                  :columns="methodColumns"
                  row-key="id"
                  :loading="loading"
                  enable-sorting
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
                    <Table.CellActions
                      :name="methodLabel(row)"
                      @select="(_event, value) => onMethodAction(value, row)"
                    >
                      <DropdownMenu.Group>
                        <DropdownMenu.Option
                          value="default"
                          label="Set as default"
                          :disabled="row.default"
                        />
                      </DropdownMenu.Group>
                      <DropdownMenu.Group>
                        <DropdownMenu.Option
                          value="remove"
                          label="Remove"
                          :disabled="row.default"
                        />
                      </DropdownMenu.Group>
                    </Table.CellActions>
                  </template>
                </Table>
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
      @confirm="removeMethod"
    />
  </div>
</template>
```
