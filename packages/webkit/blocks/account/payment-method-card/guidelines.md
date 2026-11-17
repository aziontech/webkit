# Payment method card

The Payment method card of the Upgrade to Pro drawer. The user needs to confirm which card will be charged and, if needed, replace it without leaving the upgrade: the card on file shows as one row (brand plate, last four digits, Change), and Change swaps the row for the card form until Cancel or Update. The drawer disables it while the upgrade submits.

## When to use

- Use payment-method-card inside a checkout or billing drawer to replace the card on file; it is a card, not a page.
- Inside a checkout or upgrade drawer where a card on file may need replacing.
- Wherever a card on file is replaced in place. On Billing, Add payment method in the Payment methods tab leads to this form (the Editing state).

## When not to use

- The whole plan change: use `account/change-plan-drawer`, which contains this card.
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

Country or region. It starts empty on a blank card (selects start empty); the person selects it.

### F. Notices — `Alert` (required)

The PCI notice, `severity="info"`, `size="small"`, under the fields. A declined card (the `error` prop) adds a `danger` `Alert` at the top of the form with the message.

### G. Card brand — `PaymentBrand` (required)

The plate before `Ending in 8888`, `brand` as the payment API returns it. It is named after the brand (`Visa`) because the row text says only the last four digits.

## Data

The block takes the card on file through props and emits the new card; it fetches nothing and never sends card data itself. `PaymentMethodCardCard`, `PaymentMethodCardValues` and `PaymentMethodCardProps` are exported from `payment-method-card.vue`, and `sample.ts` holds the sample card the block renders when `card` is left out.

| Prop       | Type                          | What it does                                                                                  |
| ---------- | ----------------------------- | --------------------------------------------------------------------------------------------- |
| `card`     | `PaymentMethodCardCard`       | The card on file: `brand` for `PaymentBrand` and the `last4` digits.                          |
| `editing`  | `boolean` (`v-model:editing`) | The form is open. Change sets it; Cancel clears it; set it to `false` once the card is saved. |
| `disabled` | `boolean`                     | Disables Change and the form, for example while the hosting drawer submits.                   |
| `loading`  | `boolean`                     | The new card is being saved: Update spins and the form is locked.                             |
| `error`    | `string`                      | Why the card was not changed (a decline), in a danger `Alert` at the top of the form.         |

| Event    | Payload                                              | When                                        |
| -------- | ---------------------------------------------------- | ------------------------------------------- |
| `submit` | `(event, { holder, country, number, expiry, code })` | Update, once every field passes validation. |

To go live, hand the values to the payment partner's SDK and pass the result back:

```vue
<script setup lang="ts">
  import PaymentMethodCard, { type PaymentMethodCardValues } from './payment-method-card.vue'

  const editing = ref(false)
  const { card, saving, error, save } = usePaymentMethod()
  const declined =
    'The card was declined, so the payment method was not changed. Check the number or use another card.'

  const onSubmit = async (event: Event, values: PaymentMethodCardValues) => {
    if (await save(values)) editing.value = false
  }
</script>

<template>
  <PaymentMethodCard
    v-model:editing="editing"
    :card="card"
    :loading="saving"
    :error="error ? declined : ''"
    @submit="onSubmit"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Show only the last four digits of the card on file.
- Reset the form to blank on every Change; never prefill card data.
- Validate on Update: required fields carry the Required marker from the start; on a failed Update, empty fields and malformed numbers take the red invalid state with a message that says what to enter.

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

- Default: the card on file (`card`) as one row with Change.
- Editing: after Change (`editing`), the card form over the PCI notice, with Cancel and Update. Update validates every field, focuses the first one in error and emits `submit`; `error` shows the decline.
- Disabled: while the upgrade submits (`disabled`), the Change action is disabled.

## Related

- `account/change-plan-drawer` — the upgrade drawer that hosts this card.
- `state/form-validation` — how the card form's client and server errors render.
