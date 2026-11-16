# Billing

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

### G. Invoices table — `DataTable`, `Table`, `useCollection` (required)

One `useCollection` over the invoices, newest first, `DataTable` bound with `v-bind="tableProps"` in a flush `Card`. Columns: No., Invoice ID (left to right), Plan, Cycle, Seats, Billing date as a formatted date, Amount as `CurrencyAmount`, Payment method with its plate, Status as `Table.CellStatus` (Paid success, Refunded secondary, Overdue danger), and a download icon button per row named `Download invoice <id>` that links to the PDF.

### H. No invoices and no match — `EmptyState` (conditional)

An account with no invoice yet replaces the table with `No invoices yet` and a link to how billing works. Filters that hide every invoice fill the table's `#empty` slot with `No matching invoices` and Clear filters.

### I. Payment information — `StatusIndicator` (required on the Payment methods tab)

A `SectionHeader` with Update over a `Card` of four-column `KeyValueList`: Billing email, Auto-renewal as a `StatusIndicator` (On or Off, never colour alone), Billing address and Tax ID (empty shows the empty-value marker).

### J. Payment methods — `DropdownMenu`, `ConfirmDialog` (required on the Payment methods tab)

A `SectionHeader` with Add payment method over a flush `Card` and a `DataTable` of cards: Card holder with a small success `Default` tag, Card as the brand plate and the last four, Expiration date, and `Table.CellActions` named after the card with `Set as default` and `Remove` as `DropdownMenu` options, both disabled on the default card. Set as default applies at once with a toast; Remove asks in a `ConfirmDialog` first.

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
