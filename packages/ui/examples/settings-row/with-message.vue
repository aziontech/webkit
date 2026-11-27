<script setup>
  import Card from '@aziontech/ui/card'
  import FieldError from '@aziontech/ui/field-error'
  import Input from '@aziontech/ui/input'
  import Item from '@aziontech/ui/item'
  import SettingsRow from '@aziontech/ui/settings-row'
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
            placeholder="For example, office-ranges"
            autocomplete="off"
            required
            invalid
            aria-describedby="resource-name-message"
          />
          <FieldError id="resource-name-message">This field is required.</FieldError>
        </SettingsRow>
      </Item.List>
    </template>
  </Card>
</template>
