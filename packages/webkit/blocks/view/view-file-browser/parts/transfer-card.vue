<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import UploadProgress from '@aziontech/webkit/upload-progress'
  import { computed, ref } from 'vue'

  import type { FileBrowserTransfer, FileBrowserTransferOperation } from '../view-file-browser.vue'

  const props = defineProps<{
    transferItems: FileBrowserTransfer[]
    transferOperation: FileBrowserTransferOperation
  }>()

  const emit = defineEmits<{
    cancel: [event: MouseEvent, id?: string]
    retry: [event: MouseEvent, id?: string]
    close: [event: MouseEvent]
    'open-folder': [event: MouseEvent, target: string]
  }>()

  const transferExpanded = ref(true)
  const lastTarget = computed(
    () => props.transferItems.find((item) => item.status === 'success')?.target ?? ''
  )
</script>

<template>
  <UploadProgress
    v-model:open="transferExpanded"
    :items="transferItems"
    :operation="transferOperation"
    :cancelable="transferOperation === 'upload'"
    @cancel="(event, id) => emit('cancel', event, id)"
    @retry="(event, id) => emit('retry', event, id)"
    @close="(event) => emit('close', event)"
  >
    <template
      v-if="transferOperation === 'upload'"
      #actions
    >
      <Button
        v-if="transferItems.some((item) => item.status === 'success')"
        label="Open folder"
        variant="secondary"
        size="small"
        @click="(event: MouseEvent) => emit('open-folder', event, lastTarget)"
      />
    </template>
  </UploadProgress>
</template>
