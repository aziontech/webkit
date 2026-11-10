<script setup>
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Textarea from '@aziontech/webkit/textarea'
  import { reactive } from 'vue'

  const form = reactive({ companyName: '', companyId: '', billingEmails: 'jane.doe@example.com' })
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
            placeholder="Company S.A."
          />
        </SettingRow>
        <SettingRow
          title="Company ID"
          description="Personal or company ID number that identifies account ownership."
        >
          <Input
            v-model="form.companyId"
            size="large"
            class="w-full"
            aria-label="Company ID"
            placeholder="00.000.000/0001-00"
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
