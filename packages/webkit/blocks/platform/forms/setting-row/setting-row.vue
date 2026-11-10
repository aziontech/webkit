<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Textarea from '@aziontech/webkit/textarea'
  import { reactive } from 'vue'

  const form = reactive({ companyName: '', companyId: '', billingEmails: 'jane.doe@example.com' })
</script>

<template>
  <CardBox :padded="false">
    <template #content>
      <Item.List>
        <Item size="small">
          <Item.Content>
            <Item.Title>Company Name</Item.Title>
            <Item.Description>The legal entity that owns this account.</Item.Description>
          </Item.Content>
          <div class="flex max-w-(--container-3xs) flex-1 justify-end">
            <Item.Actions class="w-full">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <InputText
                  v-model="form.companyName"
                  size="large"
                  class="w-full"
                  aria-label="Company Name"
                  placeholder="Company S.A."
                />
              </div>
            </Item.Actions>
          </div>
        </Item>
        <Item size="small">
          <Item.Content>
            <Item.Title>Company ID</Item.Title>
            <Item.Description
              >Personal or company ID number that identifies account ownership.</Item.Description
            >
          </Item.Content>
          <div class="flex max-w-(--container-3xs) flex-1 justify-end">
            <Item.Actions class="w-full">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <InputText
                  v-model="form.companyId"
                  size="large"
                  class="w-full"
                  aria-label="Company ID"
                  placeholder="00.000.000/0001-00"
                />
              </div>
            </Item.Actions>
          </div>
        </Item>
        <Item size="small">
          <div class="flex w-full flex-col items-stretch gap-(--spacing-sm)">
            <Item.Content>
              <Item.Title>Billing emails</Item.Title>
              <Item.Description
                >Billing is forwarded to every address listed here. Separate each one with a
                semicolon ( ; ).</Item.Description
              >
            </Item.Content>
            <Item.Actions class="w-full">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Textarea
                  v-model="form.billingEmails"
                  class="w-full"
                  :rows="3"
                  aria-label="Billing emails"
                />
              </div>
            </Item.Actions>
          </div>
        </Item>
      </Item.List>
    </template>
  </CardBox>
</template>
