<script setup>
  import Card from '@aziontech/ui/card'
  import Input from '@aziontech/ui/input'
  import Item from '@aziontech/ui/item'
  import SettingsRow from '@aziontech/ui/settings-row'
  import { reactive } from 'vue'

  const form = reactive({
    name: 'production-origin',
    address: 'https://origin.example.com/api/v2/'
  })
</script>

<template>
  <div class="w-full max-w-(--container-lg)">
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="Name"
            description="Give a unique and descriptive name to identify the origin."
          >
            <Input
              v-model="form.name"
              size="large"
              class="w-full"
              aria-label="Name"
            />
          </SettingsRow>
          <SettingsRow
            title="Address"
            description="The URL the edge fetches content from when the cache misses."
            stackable
          >
            <Input
              v-model="form.address"
              size="large"
              class="w-full"
              aria-label="Address"
            />
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </div>
</template>
