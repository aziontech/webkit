# Billing

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

`PageTabs` with one `Tabs.Item` per tab: `Bills` and `Payment methods`. Only the active tab's content renders; the heading and the load state are shared.

### C. Load failure — `Alert` (conditional)

When the billing data fails to load, a danger `Alert` with Retry takes the tab's place and says that nothing was charged or changed.

### D. Subscription plan — `Card`, `Skeleton`, `Tag`, `KeyValuePairs`, `Currency`, `PaymentBrand` (required)

A `Card` whose header holds the `Subscription plan` heading and the outlined `Change plan`, which opens `platform/account/change-plan-drawer` (the copyable SFC links to the plans route so it stands alone). The body shows the plan name with a small secondary `Current plan` `Tag` (a `Skeleton` while loading), then split `KeyValuePairs` with Plan start date, Next charge date, Next charge value as `Currency`, and the default card as a decorative `PaymentBrand` plate and its brand and last four. The footer says what an invoice includes. On wide containers it takes about half the row.

### E. Upgrade card — `Card` (required)

`Upgrade to Enterprise` beside the plan card: one sentence on what the tier adds, four perks with icons, a link to pricing and a primary `Contact sales`, the one primary action on the page (the tier is sold by the sales team). Show the next tier only; hide the card on the top tier.

### F. Invoices controls — `SectionHeader`, `PropertyFilter`, `CollectionPreferences` (required)

A small `SectionHeader` `Invoices` over the table-view controls row: `PropertyFilter` bound with `v-bind="propertyFilterProps"` (Invoice ID free text, Plan, Cycle and Status with options), then Refresh (`Refresh invoices`) and Download CSV as outlined icon buttons in tooltips, then `CollectionPreferences` (page size 10, 25 or 50; columns), saved under `storageKey`.

### G. Invoices table — `DataTable`, `Table`, `useCollection` (required)

One `useCollection` over the invoices, newest first, `DataTable` bound with `v-bind="tableProps"` in a flush `Card`. Columns: No., Invoice ID (left to right), Plan, Cycle, Seats, Billing date as a formatted date, Amount as `Currency`, Payment method with its plate, Status as `Table.CellStatus` (Paid success, Refunded secondary, Overdue danger), and a download icon button per row named `Download invoice <id>` that links to the PDF.

### H. No invoices and no match — `EmptyState` (conditional)

An account with no invoice yet replaces the table with `No invoices yet` and a link to how billing works. Filters that hide every invoice fill the table's `#empty` slot with `No matching invoices` and Clear filters.

### I. Payment information — `StatusIndicator` (required on the Payment methods tab)

A `SectionHeader` with Update over a `Card` of four-column `KeyValuePairs`: Billing email, Auto-renewal as a `StatusIndicator` (On or Off, never colour alone), Billing address and Tax ID (empty shows the empty-value marker).

### J. Payment methods — `DropdownMenu`, `ConfirmDialog` (required on the Payment methods tab)

A `SectionHeader` with Add payment method over a flush `Card` and a `DataTable` of cards: Card holder with a small success `Default` tag, Card as the brand plate and the last four, Expiration date, and `Table.CellActions` named after the card with `Set as default` and `Remove` as `DropdownMenu` options, both disabled on the default card. Set as default applies at once with a toast; Remove asks in a `ConfirmDialog` first.

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

- Default: the Bills tab with the Pro plan, the Enterprise upgrade card and twelve monthly invoices, with filter, refresh, export, preferences, sorting and paging wired.
- Loading: the first load; skeletons in the plan card and the invoices table's loading rows.
- Failed: the billing data did not load; a danger Alert with Retry.
- NoInvoices: no invoice yet; a flush empty state says when the first one appears.
- NoMatch: a filter that matches no invoice; No matching invoices with Clear filters.
- PaymentMethods: the Payment methods tab with payment information and three cards.

## Related

- `platform/account/change-plan-drawer` — the plan comparison Change plan opens.
- `platform/account/payment-method-card` — the card form for adding or changing a card.
- `platform/view/table-view` — the list pattern the invoices follow.
- `platform/account/activity-history` — where billing changes are audited.
