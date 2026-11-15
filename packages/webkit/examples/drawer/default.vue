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
    side="right"
    size="medium"
  >
    <Drawer.Trigger>
      <Button
        label="Open drawer"
        kind="primary"
      />
    </Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Header class="w-full">
        <Drawer.Title>Drawer Title</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <Drawer.Description>
          Side panel content. Uses the same Panel header, body, and footer regions as Dialog.
        </Drawer.Description>
      </Drawer.Body>
      <Drawer.Footer>
        <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
          <Button
            label="Cancel"
            kind="outlined"
            @click="open = false"
          />
          <Button
            label="Save"
            kind="primary"
          />
        </div>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer>
</template>
