<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldText from '@aziontech/webkit/field-text'
  import Message from '@aziontech/webkit/message'
  import { reactive, ref } from 'vue'

  import CardBrandMark from './CardBrandMark.vue'

  interface Props {
    disabled?: boolean
  }

  withDefaults(defineProps<Props>(), {
    disabled: false
  })

  const card = reactive({ last4: '8888' })

  const editing = ref(false)

  const countryOptions = [
    { value: 'Brazil', label: 'Brazil' },
    { value: 'United States', label: 'United States' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Mexico', label: 'Mexico' }
  ]

  const blankForm = () => ({
    holder: '',
    country: 'Brazil',
    number: '',
    expiry: '',
    code: ''
  })

  const form = reactive(blankForm())

  const startEditing = () => {
    Object.assign(form, blankForm())
    editing.value = true
  }

  const cancelEditing = () => {
    editing.value = false
  }

  const update = () => {
    const digits = form.number.replace(/\D/g, '')
    if (digits.length >= 4) card.last4 = digits.slice(-4)
    editing.value = false
  }
</script>

<template>
  <CardBox
    title="Payment Method"
    :padded="false"
  >
    <template #content>
      <div
        class="flex flex-col gap-(--spacing-lg) px-(--spacing-lg) py-(--spacing-lg)"
      >
        <div
          v-if="!editing"
          class="flex min-h-14 flex-wrap items-center gap-(--spacing-md) rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
        >
          <CardBrandMark />
          <p class="min-w-0 flex-1 text-label-md text-(--text-default)">
            Ended with {{ card.last4 }}
          </p>
          <Button
            label="Change"
            kind="outlined"
            size="small"
            :disabled="disabled"
            @click="startEditing"
          />
        </div>

        <template v-else>
          <fieldset
            class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
            :disabled="disabled"
          >
            <legend class="sr-only">Payment Method</legend>

            <FieldText
              v-model="form.holder"
              label="Cardholder's full name"
              input-id="payment-holder"
              name="cardholderName"
              size="large"
              placeholder="Jane A. Doe"
              autocomplete="cc-name"
            />

            <FieldSelect
              v-model="form.country"
              label="Country/Region"
              :options="countryOptions"
              input-id="payment-country"
              size="large"
            />

            <FieldText
              v-model="form.number"
              label="Credit card number"
              input-id="payment-number"
              name="cardNumber"
              size="large"
              placeholder="1234 5678 9012 3456"
              autocomplete="cc-number"
              inputmode="numeric"
            />

            <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
              <FieldText
                v-model="form.expiry"
                label="Expiration Date (MM/YY)"
                input-id="payment-expiry"
                name="cardExpiry"
                size="large"
                placeholder="08 / 26"
                autocomplete="cc-exp"
                inputmode="numeric"
              />
              <FieldText
                v-model="form.code"
                label="Security Code (CVC/CVV)"
                input-id="payment-code"
                name="cardSecurityCode"
                size="large"
                placeholder="999"
                autocomplete="cc-csc"
                inputmode="numeric"
              />
            </div>

            <Message
              severity="info"
              size="small"
              label="Sensitive data is handled by a PCI-compliant payment partner."
            />
          </fieldset>

          <div class="flex flex-col gap-(--spacing-sm) sm:flex-row sm:justify-end">
            <Button
              class="w-full sm:w-auto"
              label="Cancel"
              kind="outlined"
              size="medium"
              :disabled="disabled"
              @click="cancelEditing"
            />
            <Button
              class="w-full sm:w-auto"
              label="Update"
              kind="primary"
              size="medium"
              :disabled="disabled"
              @click="update"
            />
          </div>
        </template>
      </div>
    </template>
  </CardBox>
</template>
