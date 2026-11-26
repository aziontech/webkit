<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'

  import { type ProfileAccountForm, profilePlaces as places } from '../sample'

  defineProps<{ saving: boolean }>()
  const form = defineModel<ProfileAccountForm>('form', { required: true })
</script>

<template>
  <SettingsGroup
    label="Address information"
    hint="Where the account owner is registered, for invoices and tax purposes."
    anchor="address-information"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow title="Postal code">
            <Input
              v-model="form.postalCode"
              size="large"
              class="w-full"
              autocomplete="postal-code"
              aria-label="Postal code"
              :disabled="saving"
            />
          </SettingsRow>
          <SettingsRow
            v-for="place in places"
            :key="place.key"
            :title="place.label"
          >
            <Select
              v-model="form[place.key]"
              size="large"
              :display-value="
                (value) => place.options.find((option) => option.value === value)?.label ?? ''
              "
            >
              <Select.Trigger
                class="w-full"
                :aria-label="place.label"
              />
              <Select.Content>
                <Select.Item
                  v-for="option in place.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </SettingsRow>
          <SettingsRow title="Address">
            <Input
              v-model="form.address"
              size="large"
              class="w-full"
              autocomplete="address-line1"
              aria-label="Address"
              :disabled="saving"
            />
          </SettingsRow>
          <SettingsRow
            title="Address line 2"
            description="Optional. Apartment, suite or floor."
          >
            <Input
              v-model="form.apartment"
              size="large"
              class="w-full"
              autocomplete="address-line2"
              aria-label="Address line 2"
              placeholder="1st floor"
              :disabled="saving"
            />
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
