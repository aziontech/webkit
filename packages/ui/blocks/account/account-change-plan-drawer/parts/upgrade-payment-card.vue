<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
  import PaymentBrand from '@aziontech/ui/payment-brand'
  import Select, { type SelectOptionItem } from '@aziontech/ui/select'

  import type { ChangePlanDrawerCard } from '../account-change-plan-drawer.vue'
  import { type CardField, cardFieldIds } from '../change-plan-card'

  export interface UpgradePaymentCardProps {
    /** The country choices. */
    countryOptions: SelectOptionItem[]
    /** A new card is being typed. */
    editing: boolean
    /** Last four digits of the card on file. */
    cardOnFile: string
    /** The card was declined. */
    declined: boolean
    /** The upgrade request is in flight. */
    submitting: boolean
  }

  defineProps<UpgradePaymentCardProps>()

  const cardForm = defineModel<ChangePlanDrawerCard>('form', { required: true })
  const cardErrors = defineModel<Record<CardField, string>>('errors', { required: true })

  const emit = defineEmits<{
    start: []
    cancel: []
    update: []
  }>()

  const fieldState = (field: CardField) => ({
    required: true,
    invalid: !!cardErrors.value[field]
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
          v-if="!editing"
          class="flex min-h-14 flex-wrap items-center gap-(--spacing-md) rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
        >
          <PaymentBrand brand="visa" />
          <p class="min-w-0 flex-1 text-label-md text-(--text-default)">
            Ending in {{ cardOnFile }}
          </p>
          <Button
            id="card-change"
            label="Change"
            variant="outline"
            size="small"
            :disabled="submitting"
            @click="emit('start')"
          />
        </div>
        <template v-else>
          <Alert
            v-if="declined"
            severity="danger"
            size="small"
            label="The card was declined, so the account is still on Free. Check the number or use another card, then select Upgrade again."
          />
          <fieldset
            class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
            :disabled="submitting"
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
            <div class="grid grid-cols-1 gap-(--spacing-lg) @md:grid-cols-2">
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
          <div class="flex flex-col gap-(--spacing-sm) @md:flex-row @md:justify-end">
            <div class="w-full @md:w-fit">
              <Button
                class="w-full"
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                :disabled="submitting"
                @click="emit('cancel')"
              />
            </div>
            <div class="w-full @md:w-fit">
              <Button
                class="w-full"
                type="button"
                label="Update"
                variant="primary"
                size="medium"
                :disabled="submitting"
                @click="emit('update')"
              />
            </div>
          </div>
        </template>
      </div>
    </template>
  </Card>
</template>
