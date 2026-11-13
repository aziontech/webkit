<script setup>
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Textarea from '@aziontech/webkit/textarea'
  import { reactive } from 'vue'

  const form = reactive({ companyName: '', taxId: '', billingEmails: 'jane.doe@example.com' })
</script>

<template>
  <Card :padded="false">
    <template #content>
      <Item.List>
        <SettingRow
          title="Company Name"
          description="The legal entity that owns this account."
        >
          <Input
            v-model="form.companyName"
            size="large"
            class="w-full"
            aria-label="Company Name"
          />
        </SettingRow>
        <SettingRow
          title="Tax ID"
          description="The tax identification number of the entity that owns this account."
        >
          <Input
            v-model="form.taxId"
            size="large"
            class="w-full"
            aria-label="Tax ID"
          />
        </SettingRow>
        <SettingRow
          title="Billing emails"
          description="Billing is forwarded to every address listed here. Separate each one with a semicolon ( ; )."
          kind="stacked"
        >
          <Textarea
            v-model="form.billingEmails"
            class="w-full"
            :rows="3"
            aria-label="Billing emails"
          />
        </SettingRow>
      </Item.List>
    </template>
  </Card>
</template>
