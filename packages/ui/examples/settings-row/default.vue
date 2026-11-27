<script setup>
  import Card from '@aziontech/ui/card'
  import Input from '@aziontech/ui/input'
  import Item from '@aziontech/ui/item'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Textarea from '@aziontech/ui/textarea'
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
