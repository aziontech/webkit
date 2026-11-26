<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import PanelFooter from '@aziontech/webkit/panel-footer'

  defineProps<{ submitLabel: string; submitting: boolean }>()

  const emit = defineEmits<{
    cancel: []
  }>()
</script>

<template>
  <PanelFooter>
    <div class="flex w-full justify-end gap-(--spacing-xs)">
      <Button
        type="button"
        label="Cancel"
        variant="outline"
        size="medium"
        :disabled="submitting"
        @click="emit('cancel')"
      />
      <Button
        type="submit"
        :label="submitLabel"
        variant="primary"
        size="medium"
        :loading="submitting"
      />
    </div>
  </PanelFooter>
</template>
