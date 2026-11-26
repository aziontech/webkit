<script setup>
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Textarea from '@aziontech/webkit/textarea'
  import { reactive } from 'vue'

  const form = reactive({ companyName: '', taxId: '', billingEmails: '' })
</script>

<template>
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
          />
        </SettingsRow>
        <SettingsRow
          title="Tax ID"
          description="The tax identification number of the entity that owns this account."
        >
          <Input
            v-model="form.taxId"
            size="large"
            class="w-full"
            aria-label="Tax ID"
          />
        </SettingsRow>
        <SettingsRow
          title="Billing emails"
          description="Billing is forwarded to every address listed here. Separate each one with a semicolon ( ; )."
          variant="stacked"
        >
          <Textarea
            v-model="form.billingEmails"
            class="w-full"
            :rows="3"
            aria-label="Billing emails"
          />
        </SettingsRow>
      </Item.List>
    </template>
  </Card>
</template>
