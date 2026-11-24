<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import PaymentBrand from '@aziontech/webkit/payment-brand'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import { useEscapeToCancel } from '@aziontech/webkit/use-escape-to-cancel'
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

  useEscapeToCancel(cancelEditingCard, { enabled: () => editingCard.value && !locked.value })

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
            disabled-reason="You can change the card once the current request finishes."
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
