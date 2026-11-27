<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
  import PaymentBrand from '@aziontech/ui/payment-brand'
  import Select from '@aziontech/ui/select'

  import { blankCard } from './onboarding-form.onboarding-form-data'
  import { countryOptions } from './onboarding-form.sample'

  /** The card on file and the card being typed. */
  export interface OnboardingFormCard {
    /** Last four digits of the card on file. */
    last4: string
    /** Name on the new card. */
    holder: string
    /** Country of the new card. */
    country: string | undefined
    /** Number of the new card. */
    number: string
    /** Expiry of the new card. */
    expiry: string
    /** Security code of the new card. */
    code: string
  }

  const card = defineModel<OnboardingFormCard>('card', { required: true })
  const editing = defineModel<boolean>('editing', { required: true })

  const startEditing = () => {
    Object.assign(card.value, blankCard)
    editing.value = true
  }

  const updateCard = () => {
    const digits = card.value.number.replace(/\D/g, '')
    if (digits.length >= 4) card.value.last4 = digits.slice(-4)
    editing.value = false
  }

  const SAVED_CARD_CLASS =
    'flex min-h-14 flex-wrap items-center gap-(--spacing-md) rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)'
</script>

<template>
  <Card
    title="Payment method"
    :padded="false"
  >
    <template #default>
      <div class="flex flex-col gap-(--spacing-lg) px-(--spacing-lg) py-(--spacing-lg)">
        <div
          v-if="!editing"
          :class="SAVED_CARD_CLASS"
        >
          <PaymentBrand brand="visa" />
          <p class="min-w-0 flex-1 text-label-md text-(--text-default)">
            Ending in {{ card.last4 }}
          </p>
          <Button
            label="Change"
            variant="outline"
            size="small"
            @click="startEditing"
          />
        </div>

        <template v-else>
          <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
            <legend class="sr-only">Payment method</legend>

            <Field>
              <Field.Label>Cardholder name</Field.Label>
              <Input
                v-model="card.holder"
                name="cardholderName"
                size="large"
                placeholder="Jane A. Doe"
                autocomplete="cc-name"
              />
            </Field>

            <Field>
              <Field.Label>Country or region</Field.Label>
              <Select
                v-model="card.country"
                placeholder="Select an option"
                size="large"
              >
                <Select.Trigger />
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

            <Field>
              <Field.Label>Card number</Field.Label>
              <Input
                v-model="card.number"
                name="cardNumber"
                size="large"
                placeholder="1234 5678 9012 3456"
                autocomplete="cc-number"
                inputmode="numeric"
              />
            </Field>

            <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
              <Field>
                <Field.Label>Expiration date</Field.Label>
                <Input
                  v-model="card.expiry"
                  name="cardExpiry"
                  size="large"
                  placeholder="MM / YY"
                  autocomplete="cc-exp"
                  inputmode="numeric"
                />
                <Field.Description>Month and year, as MM/YY.</Field.Description>
              </Field>
              <Field>
                <Field.Label>Security code</Field.Label>
                <Input
                  v-model="card.code"
                  name="cardSecurityCode"
                  size="large"
                  placeholder="123"
                  autocomplete="cc-csc"
                  inputmode="numeric"
                />
                <Field.Description>3 or 4 digits on the back.</Field.Description>
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
                label="Cancel"
                variant="outline"
                size="medium"
                @click="editing = false"
              />
            </div>
            <div class="w-full sm:w-fit">
              <Button
                class="w-full"
                label="Update"
                variant="primary"
                size="medium"
                @click="updateCard"
              />
            </div>
          </div>
        </template>
      </div>
    </template>
  </Card>
</template>
