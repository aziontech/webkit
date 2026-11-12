<script setup>
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Unsaved changes"
    description="This page has changes that haven't been saved yet. Save them before you leave, or discard them and continue."
  >
    <template #trigger>
      <Button
        label="Switch tab"
        kind="outlined"
        size="medium"
      />
    </template>
    <template #actions="{ close }">
      <Button
        label="Keep editing"
        kind="transparent"
        size="medium"
        @click="close"
      />
      <Button
        label="Discard changes"
        kind="outlined"
        size="medium"
        @click="close"
      />
      <Button
        label="Save changes"
        kind="primary"
        size="medium"
        @click="close"
      />
    </template>
  </ConfirmDialog>
</template>
