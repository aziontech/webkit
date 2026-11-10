<script setup>
  import Card from '@aziontech/webkit/card'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import { reactive } from 'vue'

  const form = reactive({ name: '' })
</script>

<template>
  <Card :padded="false">
    <template #content>
      <Item.List>
        <Item size="small">
          <Item.Content>
            <Item.Title>Name</Item.Title>
            <Item.Description
              >Give a unique and descriptive name to identify the resource.</Item.Description
            >
          </Item.Content>
          <div class="flex max-w-(--container-3xs) flex-1 justify-end">
            <Item.Actions class="w-full">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
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
              </div>
            </Item.Actions>
          </div>
        </Item>
      </Item.List>
    </template>
  </Card>
</template>
