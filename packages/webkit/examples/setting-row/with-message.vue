<script setup>
  import Card from '@aziontech/webkit/card'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingRow from '@aziontech/webkit/setting-row'
  import { reactive } from 'vue'

  const form = reactive({ name: '' })
</script>

<template>
  <Card :padded="false">
    <template #content>
      <Item.List>
        <SettingRow
          title="Name"
          description="Give a unique and descriptive name to identify the resource."
        >
          <Input
            v-model="form.name"
            size="large"
            class="w-full"
            aria-label="Name"
            placeholder="office-ranges"
            autocomplete="off"
            required
            aria-describedby="resource-name-message"
          />
          <HelperText
            id="resource-name-message"
            kind="required"
            label="This field is required."
          />
        </SettingRow>
      </Item.List>
    </template>
  </Card>
</template>
