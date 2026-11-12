# Change plan drawer

The drawer the Billing page opens from its Subscription Plan card. The user wants to compare tiers and move the account to one without leaving Billing: a Monthly or Yearly switch over the Free, Pro and Enterprise pricing cards, each with its features and one action. Continue with Pro stacks the Upgrade to Pro drawer on top (what is included, the charge, the payment method and the billing address, then Upgrade); Contact sales closes the drawer.

## When to use

- Changing the subscription plan from Billing or from an upgrade prompt anywhere in the console.

## When not to use

- Choosing a plan during sign-up: use `platform/account/onboarding-form` (its Plan step).
- Editing only the card on file: use `platform/account/payment-method-card`.
- A public pricing page: use the marketing pricing sections in `shells/website`.

## Building blocks

### A. Trigger and actions — `Button` (required)

`Change plan` (outlined) opens the drawer. In each pricing card one large action: the current plan is disabled, the upgrade is `primary`, the rest `outlined`. In the upgrade drawer: Change, Cancel and Update on the payment method, and the footer's Cancel and Upgrade (`type="submit"`, `:loading` while submitting).

### B. Drawer — `Drawer` (required)

Two drawers, both `side="right"`, `size="large"`. The upgrade drawer opens on top of the plan drawer and, on success, closes both. Each reset to Yearly and to the account's address when reopened.

### C. Drawer layer — `DrawerPortal` (required)

Mounts each drawer at the document root, so the upgrade drawer can stack over the plan drawer.

### D. Drawer backdrop — `DrawerOverlay` (required)

Dims the page behind the open drawer.

### E. Drawer panel — `DrawerContent` (required)

The panel that holds header, body and footer, with an accessible name taken from its title.

### F. Drawer header — `PanelHeader` (required)

Holds the title and the close control at the top of each drawer.

### G. Title — `DrawerTitle` (required)

Names the task: `Change plan`, `Upgrade to Pro`. It labels the drawer for assistive technology.

### H. Close — `DrawerClose` (required)

Always present in the header, so the drawer can be left without scrolling to the footer.

### I. Body — `PanelContent` (required)

The scrolling body of each drawer, between header and footer.

### J. Description — `DrawerDescription` (plan drawer)

Says why the user is here before the cards: `Compare what each tier includes before moving the account onto it.`

### K. Billing period — `ToggleGroup` (required)

`Monthly` or `Yearly`, `aria-label="Billing period"`, defaulting to Yearly. In the plan drawer it reprices the cards; in the upgrade drawer it sits in the Charged card's header and switches the charge rows.

### L. Plan — `CardPricing` (required)

One per tier, `kind="contained"`, aligned, actions at the bottom: price with prefix and suffix, details line, the `Current plan` tag on the current tier, a feature list headed by what it builds on (`All Free features, plus:`).

### M. Divider — `Separator` (required)

Above the pricing links and above the Total row.

### N. Pricing links — `Link` (required)

`Learn more about pricing` and `Compare plans`, small, opening in a new tab.

### O. Sections — `Card` (required)

Flush cards for Charged (rows, then Total), Payment method and Address information.

### P. Field — `Field` (required)

Each control of the card form (cardholder, country, number, expiry, security code) and of the address (country, postal code, state, city, line 2) sits in a `Field` with its `Field.Label`.

### Q. Text value — `Input` (required)

Cardholder, number, expiry, security code and the address lines, with `cc-*` autocomplete, `postal-code`, `address-line1` and `address-line2` on the address, and `inputmode="numeric"` on the card numbers.

### R. Choice — `Select` (required)

Country and state.

### S. Notices — `Alert` (required)

`severity="info"`, `size="small"`, under the card fields: the data goes to a PCI-compliant partner. A declined card adds a `danger` `Alert` at the top of the Payment method card, and the number field takes the invalid state and focus.

### T. Same address — `Checkbox` (required)

`Use the same information as my account`, checked by default; unchecking clears the address fields for a different billing address.

### U. Footer — `PanelFooter` (required)

Cancel and Upgrade, side by side from `md`, full width below.

### V. Card brand — `PaymentBrand` (required)

The plate before the card on file in the Payment method section, named after the brand.

### W. Included features — `FeatureList` (required)

What's included in the upgrade drawer, under its visible heading: one check per feature, with the usage allowance as the label and the overage price as its description. Do not hand-write the list with your own check icons. The pricing cards keep their own icon list, since each icon names the feature.

### Toasts — through `toast`

A failure no section owns (the payment service did not answer) is `toast.error` with Retry, and the drawer stays open with the entries kept; a successful upgrade closes both drawers and toasts `The account was upgraded to Pro.` This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so the page never renders a `Toaster`.

## Do

- Disable every field and secondary action while the upgrade submits, and release the lock when it ends, on success and on failure.
- Show the total and the period it is billed for before the Upgrade button.
- Close both drawers once the upgrade succeeds.

## Don't

- Don't let the current plan's action do anything; it is disabled and labelled `Current plan`.
- Don't ask for the card number again when one is on file; offer Change.
- Don't toast a declined card; it is scoped to the Payment method section.

## Copy

- **Plan actions:** a verb and the destination: `Continue with Pro`, `Contact sales`, `Current plan`.
- **Feature list title:** what the tier adds: `All Pro features, plus:`.
- **Field labels:** 1 to 3 words, sentence case, no parentheses; put formats in the description: `Expiration date` with `Month and year, as MM/YY.`, `Security code` with `3 or 4 digits on the back.`, `Address line 2` with `Optional. Apartment, suite or floor.`
- **Charge rows:** `Next charge`, `Subtotal`, `Yearly discount`, `Total`.
- **Card on file:** `Ending in 8888`.
- **Declined card:** `The card was declined, so the account is still on Free. Check the number or use another card, then select Upgrade again.`
- **Unscoped failure:** a toast with Retry: `The upgrade failed. The account is still on Free.`, described by `The payment service did not answer. Your entries are kept.`
- **Success:** `The account was upgraded to Pro.`

## Accessibility

- Each drawer is a dialog labelled by its title; focus moves into it on open and returns to the trigger on close, including when the stacked drawer closes.
- Each fieldset has a visually hidden legend (`Payment method`, `Address information`).
- After a failed Update or Upgrade, focus moves to the first field in error; after a decline, to the card number.
- The billing period toggle is labelled; a price change is visible text, not color only.

## States

- Default: the plan drawer open on an account that is on Free, Yearly selected. In the upgrade drawer, a new card ending in 0002 is declined and one ending in 0119 makes the payment service fail, so both failure paths can be walked.
- Checkout: the Upgrade to Pro drawer open on its own, as the checkout step: the charge card adds Due today and a note that taxes come from the billing address and the plan renews on the upgrade day; under the address a required `Checkbox` accepts the Terms of Service and the Privacy Policy (each a `Link` in a new tab). Upgrade without it shows `Accept the Terms of Service and the Privacy Policy to upgrade.` on the field and focuses the checkbox; the card and service failures work as in the primary.

## Related

- `platform/account/payment-method-card` — the Payment method card on its own, with its editing state.
- `platform/account/onboarding-form` — the plan choice during sign-up opens the same upgrade drawer.
- `platform/account/profile` — the account settings layout Billing shares.
