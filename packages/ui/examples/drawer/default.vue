<script setup>
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Drawer
    v-model:open="open"
    dismissible
    side="end"
    size="large"
  >
    <Drawer.Trigger>
      <Button
        label="Edit cache settings"
        variant="primary"
      />
    </Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Header class="w-full">
        <Drawer.Title>Cache settings</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <Drawer.Description>
          Choose how long edge nodes keep a copy of each response before they ask the origin again.
        </Drawer.Description>
      </Drawer.Body>
      <Drawer.Footer>
        <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
          <Button
            label="Cancel"
            variant="outline"
            @click="open = false"
          />
          <Button
            label="Save"
            variant="primary"
            @click="open = false"
          />
        </div>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer>
</template>
