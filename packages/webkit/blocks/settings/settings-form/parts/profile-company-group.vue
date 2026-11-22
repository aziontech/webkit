<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Textarea from '@aziontech/webkit/textarea'

  import type { ProfileAccountErrors, ProfileAccountForm } from '../sample'

  defineProps<{ saving: boolean }>()
  const form = defineModel<ProfileAccountForm>('form', { required: true })
  const errors = defineModel<ProfileAccountErrors>('errors', { required: true })
</script>

<template>
  <SettingsGroup
    label="Company information"
    hint="The company that owns the account, as it appears on every invoice."
    anchor="company-information"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="Company name"
            description="The legal entity that owns this account."
          >
            <Input
              v-model="form.companyName"
              size="large"
              class="w-full"
              aria-label="Company name"
              autocomplete="organization"
              :disabled="saving"
            />
          </SettingsRow>
          <SettingsRow
            title="Tax ID"
            description="The tax ID of the person or company that owns this account."
          >
            <Input
              v-model="form.taxId"
              size="large"
              class="w-full"
              aria-label="Tax ID"
              :disabled="saving"
            />
          </SettingsRow>
          <SettingsRow
            title="Billing emails"
            description="Invoices go to every address listed here. Separate addresses with a semicolon."
            variant="stacked"
          >
            <div class="flex w-full flex-col gap-(--spacing-xs)">
              <Textarea
                id="profile-billingEmails"
                v-model="form.billingEmails"
                class="w-full"
                :rows="3"
                aria-label="Billing emails"
                required
                :invalid="!!errors.billingEmails"
                :aria-describedby="errors.billingEmails ? 'profile-billingEmails-error' : undefined"
                :disabled="saving"
                @update:model-value="errors.billingEmails = ''"
              />
              <FieldError
                v-if="errors.billingEmails"
                id="profile-billingEmails-error"
                >{{ errors.billingEmails }}</FieldError
              >
            </div>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
