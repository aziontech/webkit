# Payment method card

The Payment Method card of the Upgrade to Pro drawer. The user needs to confirm which card will be charged and, if needed, replace it without leaving the upgrade: the card on file shows as one row (brand plate, last four digits, Change), and Change swaps the row for the card form until Cancel or Update. The drawer disables it while the upgrade submits.

## When to use

- Inside a checkout or upgrade drawer where a card on file may need replacing.
- On Billing, as the payment method section.

## When not to use

- The whole plan change: use `platform/account/change-plan-drawer`, which contains this card.
- A first card entry during sign-up with no card on file: render the form directly (the Editing state) without the Change row.

## Building blocks

### A. Section — `Card` (required)

`title="Payment Method"`, flush; the row or the form lives in its content.

### B. Actions — `Button` (required)

`Change` (outlined, small) on the row; `Cancel` (outlined) and `Update` (primary) under the form, stacked below `sm`. All disabled while the parent submits.

### C. Fields — `Field` (required)

One per value, each with its `Field.Label`, inside a `fieldset` with a hidden legend.

### D. Text inputs — `Input` (required)

Cardholder (`cc-name`), number (`cc-number`), expiry (`cc-exp`) and security code (`cc-csc`), the last three with `inputmode="numeric"`.

### E. Country — `Select` (required)

Country or region, defaulting to the account's country.

### F. PCI notice — `Alert` (required)

`severity="info"`, `size="small"`, under the fields.

## Do

- Show only the last four digits of the card on file.
- Reset the form to blank on every Change; never prefill card data.
- Validate on Update: empty fields take the amber required state, malformed numbers the red invalid state with the reason.

## Don't

- Don't render the brand plate as a raster image; it is an inline mark in theme tokens.
- Don't toast a card error; a declined or invalid card is an `Alert` in this card plus the field's invalid state.

## Copy

- **Row:** `Ended with 8888`. **Actions:** `Change`, `Cancel`, `Update`.
- **Labels:** 1 to 3 words, sentence case, no parentheses: `Security code`, with `3 or 4 digits on the back.` as the description.
- **Notice:** one sentence: `Sensitive data is handled by a PCI-compliant payment partner.`

## Accessibility

- The brand plate is `aria-hidden`; the row text carries the information.
- Autocomplete tokens let password managers and browsers fill the card.
- When Change opens the form, move focus to the first field; on Cancel or Update, back to Change.

## States

- Default: the card on file as one row with Change.
- Editing: after Change, the card form over the PCI notice, with Cancel and Update.
- Disabled: while the upgrade submits, the Change action is disabled.

## Related

- `platform/account/change-plan-drawer` — the upgrade drawer that hosts this card.
- `platform/states/form-validation` — how the card form's client and server errors render.

Known gap: field labels use title case and parentheses (`Expiration Date (MM/YY)`, `Security Code (CVC/CVV)`), against `skills/webkit-microcopy`.
