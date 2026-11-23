<script setup>
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import { reactive } from 'vue'

  const form = reactive({ name: '' })
</script>

<template>
  <Card :padded="false">
    <template #default>
      <Item.List>
        <SettingsRow
          required
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
          <FieldError id="resource-name-message">This field is required.</FieldError>
        </SettingsRow>
      </Item.List>
    </template>
  </Card>
</template>
