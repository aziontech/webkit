<script setup>
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingRow from '@aziontech/webkit/setting-row'
  import { reactive } from 'vue'

  const form = reactive({ name: 'edgeflow-origin', address: 'https://origin.edgeflow.com/api/v2/' })
</script>

<template>
  <div class="w-full max-w-(--container-xs)">
    <Card :padded="false">
      <template #content>
        <Item.List>
          <SettingRow
            title="Name"
            description="Give a unique and descriptive name to identify the origin."
          >
            <Input
              v-model="form.name"
              size="large"
              class="w-full"
              aria-label="Name"
            />
          </SettingRow>
          <SettingRow
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
          </SettingRow>
        </Item.List>
      </template>
    </Card>
  </div>
</template>
