<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'

  import type { OnboardingFormAddress } from '../account-onboarding-form.vue'
  import { cityOptions, countryOptions, stateOptions } from '../sample'

  const address = defineModel<OnboardingFormAddress & { useAccountInformation: boolean }>(
    'address',
    {
      required: true
    }
  )
</script>

<template>
  <Card
    title="Address information"
    :padded="false"
  >
    <template #default>
      <fieldset
        class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 px-(--spacing-lg) py-(--spacing-lg)"
      >
        <legend class="sr-only">Address information</legend>

        <Field orientation="horizontal">
          <Checkbox
            v-model="address.useAccountInformation"
            name="useAccountInformation"
          />
          <Field.Content>
            <Field.Label>Use the same information as my account</Field.Label>
            <Field.Description
              >Uncheck to bill this organization at a different address.</Field.Description
            >
          </Field.Content>
        </Field>

        <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
          <Field>
            <Field.Label>Country</Field.Label>
            <Select
              v-model="address.country"
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
            <Field.Label>Postal code</Field.Label>
            <Input
              v-model="address.postalCode"
              name="postalCode"
              size="large"
              autocomplete="postal-code"
            />
          </Field>
          <Field>
            <Field.Label>State or region</Field.Label>
            <Select
              v-model="address.state"
              placeholder="Select an option"
              size="large"
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item
                  v-for="option in stateOptions"
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
            <Field.Label>City</Field.Label>
            <Select
              v-model="address.city"
              placeholder="Select an option"
              size="large"
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item
                  v-for="option in cityOptions"
                  :key="String(option.value)"
                  :value="option.value"
                  :disabled="option.disabled"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </Field>
        </div>

        <Field>
          <Field.Label>Address</Field.Label>
          <Input
            v-model="address.line1"
            name="addressLine1"
            size="large"
            autocomplete="address-line1"
          />
        </Field>
        <Field>
          <Field.Label>Address line 2</Field.Label>
          <Input
            v-model="address.line2"
            name="addressLine2"
            size="large"
            autocomplete="address-line2"
          />
          <Field.Description>Optional. Apartment, suite or floor.</Field.Description>
        </Field>
      </fieldset>
    </template>
  </Card>
</template>
