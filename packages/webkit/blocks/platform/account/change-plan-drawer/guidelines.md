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

`Change Plan` (outlined) opens the drawer. In each pricing card one large action: the current plan is disabled, the upgrade is `primary`, the rest `outlined`. In the upgrade drawer: Change, Cancel and Update on the payment method, and the footer's Cancel and Upgrade (`type="submit"`, `:loading` while submitting).

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

`Learn more about Pricing` and `Compare Plans`, small, opening in a new tab.

### O. Sections — `Card` (required)

Flush cards for Charged (rows, then Total), Payment Method and Address information.

### P. Field — `Field` (required)

Each control of the card form (cardholder, country, number, expiry, security code) and of the address (country, postal code, state, city, line 2) sits in a `Field` with its `Field.Label`.

### Q. Text value — `Input` (required)

Cardholder, number, expiry, security code and the address lines, with `cc-*` autocomplete and `inputmode="numeric"` on the card numbers.

### R. Choice — `Select` (required)

Country and state.

### S. Payment notice — `Alert` (required)

`severity="info"`, `size="small"`, under the card fields: the data goes to a PCI-compliant partner.

### T. Same address — `Checkbox` (required)

`Use the same information as my account`, checked by default; unchecking clears the address fields for a different billing address.

### U. Footer — `PanelFooter` (required)

Cancel and Upgrade, side by side from `md`, full width below.

## Do

- Disable every field and secondary action while the upgrade submits, and release the lock when it ends, on success and on failure.
- Show the total and the period it is billed for before the Upgrade button.
- Close both drawers once the upgrade succeeds.

## Don't

- Don't let the current plan's action do anything; it is disabled and labelled `Current plan`.
- Don't ask for the card number again when one is on file; offer Change.
- Don't toast a declined card; it is scoped to the Payment Method section.

## Copy

- **Plan actions:** a verb and the destination: `Continue with Pro`, `Contact sales`, `Current plan`.
- **Feature list title:** what the tier adds: `All Pro features, plus:`.
- **Field labels:** 1 to 3 words, no parentheses; put formats in the description: `Expiration date` with `MM/YY.`
- **Upgrade failure:** what happened and what to do: `The card was declined. Update the payment method and try Upgrade again.`

## Accessibility

- Each drawer is a dialog labelled by its title; focus moves into it on open and returns to the trigger on close, including when the stacked drawer closes.
- Each fieldset has a visually hidden legend (`Payment Method`, `Address information`).
- The billing period toggle is labelled; a price change is visible text, not color only.

## States

- Default: the plan drawer open on an account that is on Free, Yearly selected.

## Related

- `platform/account/payment-method-card` — the Payment Method card on its own, with its editing state.
- `platform/account/onboarding-form` — the plan choice during sign-up opens the same upgrade drawer.
- `platform/account/profile` — the account settings layout Billing shares.

Known gap: a failed upgrade has no path in the SFC; per `skills/webkit-errors` a declined card goes to an `Alert` in the Payment Method card with the field invalid, and an unscoped failure to `toast.error` with Retry.
Known gap: field labels use title case and parentheses (`Expiration Date (MM/YY)`, `Security Code (CVC/CVV)`), against `skills/webkit-microcopy`.
