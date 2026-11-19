# AccountPaymentMethodCard (`account/account-payment-method-card`)

> The Payment method card of the Upgrade to Pro drawer: the card on file as one bordered row with the Visa plate, the last four digits and a Change action, which swaps the row for the card form until Cancel or Update. The drawer disables it while the upgrade is submitting. Built from `Card`, `Field` with `Input` and `Select`, `Alert`, `Button` and `PaymentBrand` (the monochrome card-brand plate in theme tokens).

- Surface: app
- Source: `blocks/account/account-payment-method-card/account-payment-method-card.vue` in `@aziontech/webkit`
- MCP: `get_block("account/account-payment-method-card")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [Field](../../components/field.md), [Input](../../components/input.md), [PaymentBrand](../../components/payment-brand.md), [Select](../../components/select.md)
- Skills: `webkit-form`, `webkit-errors`

## Asked as

payment method; credit card form; card on file; change card; update payment method; card details; método de pagamento; cartão de crédito; dados do cartão; payment method card; update card; alterar cartão

The Payment method card of the Upgrade to Pro drawer. The user needs to confirm which card will be charged and, if needed, replace it without leaving the upgrade: the card on file shows as one row (brand plate, last four digits, Change), and Change swaps the row for the card form until Cancel or Update. The drawer disables it while the upgrade submits.

## When to use

- Use account-payment-method-card inside a checkout or billing drawer to replace the card on file; it is a card, not a page.
- Inside a checkout or upgrade drawer where a card on file may need replacing.
- Wherever a card on file is replaced in place. On Billing, Add payment method in the Payment methods tab leads to this form (the Editing state).

## When not to use

- The whole plan change: use `account/account-change-plan-drawer`, which contains this card.
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

The block takes the card on file through props and emits the new card; it fetches nothing and never sends card data itself. `PaymentMethodCardCard`, `PaymentMethodCardValues` and `PaymentMethodCardProps` are exported from `account-payment-method-card.vue`, and `sample.ts` holds the sample card the block renders when `card` is left out.

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
  import AccountPaymentMethodCard, {
    type PaymentMethodCardValues
  } from './account-payment-method-card.vue'

  const editing = ref(false)
  const { card, saving, error, save } = usePaymentMethod()
  const declined =
    'The card was declined, so the payment method was not changed. Check the number or use another card.'

  const onSubmit = async (event: Event, values: PaymentMethodCardValues) => {
    if (await save(values)) editing.value = false
  }
</script>

<template>
  <AccountPaymentMethodCard
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

- `account/account-change-plan-drawer` — the upgrade drawer that hosts this card.
- `state/state-form-validation` — how the card form's client and server errors render.

## Variants

- `Default` — primary (the code below)
- `Editing` — After Change: cardholder, country, number, expiry and security code over the PCI notice, with Cancel and Update stacked below sm.
- `Disabled` — While the upgrade submits, the Change action is disabled.

Each variant is the same screen in another state: `get_block("account/account-payment-method-card", { variant })`, or the file under `blocks/account/account-payment-method-card/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import PaymentBrand from '@aziontech/webkit/payment-brand'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import { computed, nextTick, reactive, watch } from 'vue'

  import { sampleCard } from './sample'

  /** The card on file, as the payment API returns it. */
  export interface PaymentMethodCardCard {
    /** Card brand id, drawn by PaymentBrand (visa, mastercard, amex...). */
    brand: string
    /** The last four digits of the card number. */
    last4: string
  }

  /** What Update sends: the new card as the person typed it. */
  export interface PaymentMethodCardValues {
    /** Cardholder name. */
    holder: string
    /** Country or region; undefined until the person picks one. */
    country: string | undefined
    /** Card number, digits only. */
    number: string
    /** Expiration date as MM/YY. */
    expiry: string
    /** Security code. */
    code: string
  }

  export interface PaymentMethodCardProps {
    /** The card on file. Left out, the sample renders. */
    card?: PaymentMethodCardCard
    /** Disables Change and the form, for example while the hosting drawer submits. */
    disabled?: boolean
    /** The new card is being saved: Update spins and the form is locked. */
    loading?: boolean
    /** Why the card was not changed (a decline), shown in a danger alert at the top of the form. */
    error?: string
  }

  const props = withDefaults(defineProps<PaymentMethodCardProps>(), {
    card: undefined,
    disabled: false,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: PaymentMethodCardValues]
  }>()

  const editingCard = defineModel<boolean>('editing', { default: false })

  const countryOptions: SelectOptionItem[] = [
    { value: 'Brazil', label: 'Brazil' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Germany', label: 'Germany' },
    { value: 'Japan', label: 'Japan' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'United States', label: 'United States' }
  ]
  const cardFieldIds: Record<string, string> = {
    holder: 'card-holder',
    number: 'card-number',
    expiry: 'card-expiry',
    code: 'card-code'
  }
  const cardOnFile = computed<PaymentMethodCardCard>(() => props.card ?? sampleCard)
  const locked = computed(() => props.disabled || props.loading)
  const blankCard = () => ({
    holder: '',
    country: undefined as string | undefined,
    number: '',
    expiry: '',
    code: ''
  })
  const cardForm = reactive(blankCard())
  const cardErrors = reactive<Record<string, string>>({
    holder: '',
    number: '',
    expiry: '',
    code: ''
  })

  const focusById = (id: string) => nextTick(() => document.getElementById(id)?.focus())

  const clearCardErrors = () => {
    Object.assign(cardErrors, { holder: '', number: '', expiry: '', code: '' })
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
  }

  watch(editingCard, (editing, wasEditing) => {
    if (!editing && wasEditing) focusById('card-change')
  })

  const updateCard = (event: Event) => {
    if (!validateCard()) return
    emit('submit', event, {
      holder: cardForm.holder.trim(),
      country: cardForm.country,
      number: cardForm.number.replace(/\D/g, ''),
      expiry: cardForm.expiry.trim(),
      code: cardForm.code.trim()
    })
  }

  const fieldState = (field: 'holder' | 'number' | 'expiry' | 'code') => ({
    required: true,
    invalid: !!cardErrors[field]
  })
</script>

<template>
  <Card
    title="Payment method"
    :padded="false"
  >
    <template #default>
      <div class="flex flex-col gap-(--spacing-lg) px-(--spacing-lg) py-(--spacing-lg)">
        <div
          v-if="!editingCard"
          class="flex min-h-14 flex-wrap items-center gap-(--spacing-md) rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
        >
          <PaymentBrand :brand="cardOnFile.brand" />
          <p class="min-w-0 flex-1 text-label-md text-(--text-default)">
            Ending in {{ cardOnFile.last4 }}
          </p>
          <Button
            id="card-change"
            label="Change"
            variant="outline"
            size="small"
            :disabled="disabled"
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
            v-if="error"
            severity="danger"
            size="small"
            :label="error"
          />
          <fieldset
            class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
            :disabled="locked"
          >
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
                placeholder="Select an option"
                size="large"
              >
                <Select.Trigger id="card-country" />
                <Select.Content>
                  <Select.Item
                    v-for="option in countryOptions"
                    :key="String(option.value)"
                    :value="option.value"
                    :disabled="option.disabled"
                  >
                    {{ option.label }}
                  </Select.Item>
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
                variant="outline"
                size="medium"
                :disabled="locked"
                @click="cancelEditingCard"
              />
            </div>
            <div class="w-full sm:w-fit">
              <Button
                class="w-full"
                type="submit"
                label="Update"
                variant="primary"
                size="medium"
                :disabled="disabled"
                :loading="loading"
              />
            </div>
          </div>
        </form>
      </div>
    </template>
  </Card>
</template>
```

## `sample.ts`

```ts
import type { PaymentMethodCardCard } from './account-payment-method-card.vue'

export const sampleCard: PaymentMethodCardCard = { brand: 'visa', last4: '8888' }
```
