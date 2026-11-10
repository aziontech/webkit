<script setup>
  import Button from '@aziontech/webkit/button'
  import SaveBar from '@aziontech/webkit/save-bar'
  import { ref } from 'vue'

  const saving = ref(false)

  const save = () => {
    saving.value = true
    setTimeout(() => {
      saving.value = false
    }, 1200)
  }
</script>

<template>
  <div class="relative flex h-64 flex-col overflow-auto">
    <div class="layout-boundary-inline flex-1 py-(--spacing-lg) text-body-sm text-(--text-muted)">
      The settings form scrolls under the bar.
    </div>
    <SaveBar>
      You have unsaved changes.
      <template #actions>
        <Button
          type="button"
          label="Discard"
          kind="outlined"
          size="medium"
          :disabled="saving"
        />
        <Button
          label="Save"
          kind="primary"
          size="medium"
          :loading="saving"
          @click="save"
        />
      </template>
    </SaveBar>
  </div>
</template>
