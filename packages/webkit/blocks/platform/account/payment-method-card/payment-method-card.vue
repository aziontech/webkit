<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldText from '@aziontech/webkit/field-text'
  import Alert from '@aziontech/webkit/alert'
  import { reactive, ref } from 'vue'

  const countryOptions = [
    { value: 'Brazil', label: 'Brazil' },
    { value: 'United States', label: 'United States' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Mexico', label: 'Mexico' }
  ]
  const editingCard = ref(false)
  const cardLast4 = ref('8888')
  const blankCard = () => ({ holder: '', country: 'Brazil', number: '', expiry: '', code: '' })
  const cardForm = reactive(blankCard())
  const startEditingCard = () => {
    Object.assign(cardForm, blankCard())
    editingCard.value = true
  }
  const updateCard = () => {
    const digits = cardForm.number.replace(/\D/g, '')
    if (digits.length >= 4) cardLast4.value = digits.slice(-4)
    editingCard.value = false
  }
</script>

<template>
  <Card
    title="Payment Method"
    :padded="false"
  >
    <template #content>
      <div class="flex flex-col gap-(--spacing-lg) px-(--spacing-lg) py-(--spacing-lg)">
        <div
          v-if="!editingCard"
          class="flex min-h-14 flex-wrap items-center gap-(--spacing-md) rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
        >
          <span
            class="flex h-7 w-10 shrink-0 items-center justify-center overflow-clip rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) text-(--text-default)"
            aria-hidden="true"
          >
            <svg
              width="22"
              height="7"
              viewBox="0 0 22 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="block"
              focusable="false"
            >
              <g clip-path="url(#card-brand-visa-clip)">
                <path
                  d="M11.3779 2.22887C11.3653 3.2001 12.2598 3.74205 12.9337 4.0643C13.626 4.3949 13.8585 4.60693 13.8558 4.90261C13.8506 5.35508 13.3036 5.5548 12.7916 5.56255C11.8985 5.57613 11.3792 5.3259 10.9663 5.13665L10.6446 6.61416C11.0588 6.80147 11.8258 6.96483 12.6211 6.972C14.4881 6.972 15.7095 6.06757 15.7162 4.66529C15.7235 2.8856 13.2078 2.7871 13.225 1.99163C13.2309 1.75042 13.4655 1.49302 13.9794 1.42758C14.2337 1.39452 14.9359 1.36922 15.7321 1.729L16.0445 0.299482C15.6164 0.146494 15.0661 0 14.381 0C12.6238 0 11.3878 0.916747 11.3779 2.22887ZM19.047 0.123132C18.7061 0.123132 18.4188 0.318289 18.2906 0.617771L15.6237 6.867H17.4893L17.8606 5.8601H20.1403L20.3557 6.867H22L20.5651 0.123132H19.047ZM19.308 1.9449L19.8464 4.4773H18.3719L19.308 1.9449ZM9.11591 0.123217L7.64534 6.86692H9.42313L10.893 0.123048L9.11591 0.123217ZM6.48596 0.123217L4.63555 4.71328L3.88704 0.810398C3.79921 0.374711 3.45237 0.123132 3.0672 0.123132H0.0423672L0 0.318964C0.620984 0.451204 1.32653 0.664494 1.75398 0.892711C2.01558 1.03212 2.09017 1.15399 2.17611 1.48526L3.59382 6.867H5.4725L8.35278 0.123132L6.48596 0.123217Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="card-brand-visa-clip">
                  <rect
                    width="22"
                    height="7"
                    fill="white"
                  />
                </clipPath>
              </defs>
            </svg>
          </span>
          <p class="min-w-0 flex-1 text-label-md text-(--text-default)">
            Ended with {{ cardLast4 }}
          </p>
          <Button
            label="Change"
            kind="outlined"
            size="small"
            @click="startEditingCard"
          />
        </div>
        <template v-else>
          <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
            <legend class="sr-only">Payment Method</legend>
            <FieldText
              v-model="cardForm.holder"
              label="Cardholder's full name"
              input-id="payment-holder"
              name="cardholderName"
              size="large"
              placeholder="Jane A. Doe"
              autocomplete="cc-name"
            />
            <FieldSelect
              v-model="cardForm.country"
              label="Country/Region"
              :options="countryOptions"
              input-id="payment-country"
              size="large"
            />
            <FieldText
              v-model="cardForm.number"
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
                v-model="cardForm.expiry"
                label="Expiration Date (MM/YY)"
                input-id="payment-expiry"
                name="cardExpiry"
                size="large"
                placeholder="08 / 26"
                autocomplete="cc-exp"
                inputmode="numeric"
              />
              <FieldText
                v-model="cardForm.code"
                label="Security Code (CVC/CVV)"
                input-id="payment-code"
                name="cardSecurityCode"
                size="large"
                placeholder="999"
                autocomplete="cc-csc"
                inputmode="numeric"
              />
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
                kind="outlined"
                size="medium"
                @click="editingCard = false"
              />
            </div>
            <div class="w-full sm:w-fit">
              <Button
                class="w-full"
                label="Update"
                kind="primary"
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
