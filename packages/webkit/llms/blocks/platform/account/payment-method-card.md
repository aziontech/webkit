# PaymentMethodCard (`platform/account/payment-method-card`)

> The Payment method card of the Upgrade to Pro drawer: the card on file as one bordered row with the Visa plate, the last four digits and a Change action, which swaps the row for the card form until Cancel or Update. The drawer disables it while the upgrade is submitting. Built from `Card`, `Field` with `Input` and `Select`, `Alert`, `Button` and `PaymentBrand` (the monochrome card-brand plate in theme tokens).

- Surface: product
- Source: `blocks/platform/account/payment-method-card/payment-method-card.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/account/payment-method-card")`
- Components: [Alert](../../../components/alert.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [Field](../../../components/field.md), [Input](../../../components/input.md), [PaymentBrand](../../../components/payment-brand.md), [Select](../../../components/select.md)
- Skills: `webkit-form`, `webkit-errors`

## Asked as

payment method; credit card form; card on file; change card; update payment method; card details; método de pagamento; cartão de crédito; dados do cartão; billing; billing page; invoices; bills; subscription plan; payment methods; credit cards; current plan; plan and billing; cobrança; faturas; faturamento; métodos de pagamento; plano de assinatura

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

## Variants

- `Default` — primary (the code below)
- `Editing` — After Change: cardholder, country, number, expiry and security code over the PCI notice, with Cancel and Update stacked below sm.
- `Disabled` — While the upgrade submits, the Change action is disabled.

Each variant is the same screen in another state: `get_pattern("platform/account/payment-method-card", { variant })`, or the file under `blocks/platform/account/payment-method-card/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import PaymentBrand from '@aziontech/webkit/payment-brand'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Alert from '@aziontech/webkit/alert'
  import { nextTick, reactive, ref } from 'vue'

  const countryOptions: SelectOptionItem[] = [
    { value: 'Brazil', label: 'Brazil' },
    { value: 'United States', label: 'United States' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Mexico', label: 'Mexico' }
  ]
  const cardFieldIds: Record<string, string> = {
    holder: 'card-holder',
    number: 'card-number',
    expiry: 'card-expiry',
    code: 'card-code'
  }
  const editingCard = ref(false)
  const cardLast4 = ref('8888')
  const blankCard = () => ({ holder: '', country: 'Brazil', number: '', expiry: '', code: '' })
  const cardForm = reactive(blankCard())
  const cardErrors = reactive<Record<string, string>>({
    holder: '',
    number: '',
    expiry: '',
    code: ''
  })
  const cardDeclined = ref(false)

  const focusById = (id: string) => nextTick(() => document.getElementById(id)?.focus())

  const clearCardErrors = () => {
    Object.assign(cardErrors, { holder: '', number: '', expiry: '', code: '' })
    cardDeclined.value = false
  }

  const validateCard = () => {
    const digits = cardForm.number.replace(/\D/g, '')
    const code = cardForm.code.trim()
    cardErrors.holder = cardForm.holder.trim() ? '' : 'This field is required.'
    cardErrors.number = !digits
      ? 'This field is required.'
      : digits.length >= 12 && digits.length <= 19
        ? ''
        : 'Enter the 12 to 19 digits on the front of the card.'
    cardErrors.expiry = !cardForm.expiry.trim()
      ? 'This field is required.'
      : /^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(cardForm.expiry.trim())
        ? ''
        : 'Enter the month and year as MM/YY.'
    cardErrors.code = !code
      ? 'This field is required.'
      : /^\d{3,4}$/.test(code)
        ? ''
        : 'Enter the 3 or 4 digits on the back of the card.'
    const first = Object.keys(cardFieldIds).find((field) => cardErrors[field])
    if (first) focusById(cardFieldIds[first])
    return !first
  }

  const startEditingCard = () => {
    Object.assign(cardForm, blankCard())
    clearCardErrors()
    editingCard.value = true
    focusById(cardFieldIds.holder)
  }

  const cancelEditingCard = () => {
    clearCardErrors()
    editingCard.value = false
    focusById('card-change')
  }

  const updateCard = () => {
    cardDeclined.value = false
    if (!validateCard()) return
    const digits = cardForm.number.replace(/\D/g, '')
    if (digits.endsWith('0002')) {
      cardDeclined.value = true
      cardErrors.number = 'The issuer declined this card.'
      focusById(cardFieldIds.number)
      return
    }
    cardLast4.value = digits.slice(-4)
    editingCard.value = false
    focusById('card-change')
  }

  const fieldState = (field: 'holder' | 'number' | 'expiry' | 'code') => ({
    required: !!cardErrors[field] && !String(cardForm[field]).trim(),
    invalid: !!cardErrors[field] && !!String(cardForm[field]).trim()
  })
</script>

<template>
  <Card
    title="Payment method"
    :padded="false"
  >
    <template #content>
      <div class="flex flex-col gap-(--spacing-lg) px-(--spacing-lg) py-(--spacing-lg)">
        <div
          v-if="!editingCard"
          class="flex min-h-14 flex-wrap items-center gap-(--spacing-md) rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
        >
          <PaymentBrand brand="visa" />
          <p class="min-w-0 flex-1 text-label-md text-(--text-default)">
            Ending in {{ cardLast4 }}
          </p>
          <Button
            id="card-change"
            label="Change"
            kind="outlined"
            size="small"
            @click="startEditingCard"
          />
        </div>
        <form
          v-else
          class="flex flex-col gap-(--spacing-lg)"
          aria-label="Change payment method"
          novalidate
          @submit.prevent="updateCard"
        >
          <Alert
            v-if="cardDeclined"
            severity="danger"
            size="small"
            label="The card was declined, so the payment method was not changed. Check the number or use another card."
          />
          <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
            <legend class="sr-only">Payment method</legend>
            <Field v-bind="fieldState('holder')">
              <Field.Label :for="cardFieldIds.holder">Cardholder name</Field.Label>
              <Input
                :id="cardFieldIds.holder"
                v-model="cardForm.holder"
                name="cardholderName"
                size="large"
                placeholder="Jane A. Doe"
                autocomplete="cc-name"
                @update:model-value="cardErrors.holder = ''"
              />
              <Field.Description v-if="cardErrors.holder">{{
                cardErrors.holder
              }}</Field.Description>
            </Field>
            <Field>
              <Field.Label for="card-country">Country or region</Field.Label>
              <Select
                v-model="cardForm.country"
                size="large"
              >
                <Select.Trigger id="card-country" />
                <Select.Content>
                  <Select.Option
                    v-for="option in countryOptions"
                    :key="String(option.value)"
                    :value="option.value"
                    :disabled="option.disabled"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </Field>
            <Field v-bind="fieldState('number')">
              <Field.Label :for="cardFieldIds.number">Card number</Field.Label>
              <Input
                :id="cardFieldIds.number"
                v-model="cardForm.number"
                name="cardNumber"
                size="large"
                placeholder="1234 5678 9012 3456"
                autocomplete="cc-number"
                inputmode="numeric"
                @update:model-value="cardErrors.number = ''"
              />
              <Field.Description v-if="cardErrors.number">{{
                cardErrors.number
              }}</Field.Description>
            </Field>
            <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
              <Field v-bind="fieldState('expiry')">
                <Field.Label :for="cardFieldIds.expiry">Expiration date</Field.Label>
                <Input
                  :id="cardFieldIds.expiry"
                  v-model="cardForm.expiry"
                  name="cardExpiry"
                  size="large"
                  placeholder="MM / YY"
                  autocomplete="cc-exp"
                  inputmode="numeric"
                  @update:model-value="cardErrors.expiry = ''"
                />
                <Field.Description>{{
                  cardErrors.expiry || 'Month and year, as MM/YY.'
                }}</Field.Description>
              </Field>
              <Field v-bind="fieldState('code')">
                <Field.Label :for="cardFieldIds.code">Security code</Field.Label>
                <Input
                  :id="cardFieldIds.code"
                  v-model="cardForm.code"
                  name="cardSecurityCode"
                  size="large"
                  placeholder="123"
                  autocomplete="cc-csc"
                  inputmode="numeric"
                  @update:model-value="cardErrors.code = ''"
                />
                <Field.Description>{{
                  cardErrors.code || '3 or 4 digits on the back.'
                }}</Field.Description>
              </Field>
            </div>
            <Alert
              severity="info"
              size="small"
              label="Sensitive data is handled by a PCI-compliant payment partner."
            />
          </fieldset>
          <div class="flex flex-col gap-(--spacing-sm) sm:flex-row sm:justify-end">
            <div class="w-full sm:w-fit">
              <Button
                class="w-full"
                type="button"
                label="Cancel"
                kind="outlined"
                size="medium"
                @click="cancelEditingCard"
              />
            </div>
            <div class="w-full sm:w-fit">
              <Button
                class="w-full"
                type="submit"
                label="Update"
                kind="primary"
                size="medium"
              />
            </div>
          </div>
        </form>
      </div>
    </template>
  </Card>
</template>
```
