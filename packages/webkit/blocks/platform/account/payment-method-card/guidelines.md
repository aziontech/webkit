# Payment method card

The Payment method card of the Upgrade to Pro drawer. The user needs to confirm which card will be charged and, if needed, replace it without leaving the upgrade: the card on file shows as one row (brand plate, last four digits, Change), and Change swaps the row for the card form until Cancel or Update. The drawer disables it while the upgrade submits.

## When to use

- Inside a checkout or upgrade drawer where a card on file may need replacing.
- On Billing, as the payment method section.

## When not to use

- The whole plan change: use `platform/account/change-plan-drawer`, which contains this card.
- A first card entry during sign-up with no card on file: render the form directly (the Editing state) without the Change row.

## Building blocks

### A. Section — `Card` (required)

`title="Payment method"`, flush; the row or the form lives in its content.

### B. Actions — `Button` (required)

`Change` (outlined, small) on the row; `Cancel` (outlined) and `Update` (primary) under the form, stacked below `sm`. All disabled while the parent submits.

### C. Fields — `Field` (required)

One per value, each with its `Field.Label` linked by `for` to the control, inside a `fieldset` with a hidden legend. `Field.Description` carries the format guidance (`Month and year, as MM/YY.`, `3 or 4 digits on the back.`) and swaps it for the error after Update.

### D. Text inputs — `Input` (required)

Cardholder (`cc-name`), number (`cc-number`), expiry (`cc-exp`) and security code (`cc-csc`), the last three with `inputmode="numeric"`.

### E. Country — `Select` (required)

Country or region, defaulting to the account's country.

### F. Notices — `Alert` (required)

The PCI notice, `severity="info"`, `size="small"`, under the fields. A declined card adds a `danger` `Alert` at the top of the form, and the number field takes the invalid state with `The issuer declined this card.`

### G. Card brand — `PaymentBrand` (required)

The plate before `Ending in 8888`, `brand` as the payment API returns it. It is named after the brand (`Visa`) because the row text says only the last four digits.

## Do

- Show only the last four digits of the card on file.
- Reset the form to blank on every Change; never prefill card data.
- Validate on Update: empty fields take the amber required state, malformed numbers the red invalid state with the reason.

## Don't

- Don't draw the brand plate by hand or as a raster image; `PaymentBrand` draws it in theme tokens.
- Don't toast a card error; a declined or invalid card is an `Alert` in this card plus the field's invalid state.

## Copy

- **Row:** `Ending in 8888`. **Actions:** `Change`, `Cancel`, `Update`.
- **Labels:** 1 to 3 words, sentence case, no parentheses: `Cardholder name`, `Country or region`, `Card number`, `Expiration date`, `Security code`. The format goes in the description: `Month and year, as MM/YY.`, `3 or 4 digits on the back.`
- **Field errors:** what is wrong and what to do: `This field is required.`, `Enter the month and year as MM/YY.`, `Enter the 3 or 4 digits on the back of the card.`
- **Decline:** `The card was declined, so the payment method was not changed. Check the number or use another card.`
- **Notice:** one sentence: `Sensitive data is handled by a PCI-compliant payment partner.`

## Accessibility

- The brand plate is an image named after the brand, so the row reads `Visa, Ending in 8888`; set `decorative` on it only when the row text already names the brand.
- Autocomplete tokens let password managers and browsers fill the card.
- When Change opens the form, move focus to the first field; on Cancel or Update, back to Change.

## States

- Default: the card on file as one row with Change.
- Editing: after Change, the card form over the PCI notice, with Cancel and Update. Update validates every field, focuses the first one in error, and a number ending in 0002 shows the decline.
- Disabled: while the upgrade submits, the Change action is disabled.

## Related

- `platform/account/change-plan-drawer` — the upgrade drawer that hosts this card.
- `platform/states/form-validation` — how the card form's client and server errors render.
