<script setup>
  import Button from '@aziontech/webkit/button'
  import Kbd from '@aziontech/webkit/kbd'
  import SaveBar from '@aziontech/webkit/save-bar'
  import { ref } from 'vue'

  const saving = ref(false)

  const save = () => {
    if (saving.value) return
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
    <SaveBar @save="save">
      You have unsaved changes.
      <template #actions>
        <Button
          type="button"
          label="Discard"
          variant="outline"
          size="medium"
          :disabled="saving"
        />
        <Button
          variant="primary"
          size="medium"
          aria-keyshortcuts="Meta+S Control+S"
          :loading="saving"
          @click="save"
        >
          Save
          <Kbd
            meta
            size="small"
            aria-hidden="true"
            class="pointer-coarse:hidden"
            >S</Kbd
          >
        </Button>
      </template>
    </SaveBar>
  </div>
</template>
