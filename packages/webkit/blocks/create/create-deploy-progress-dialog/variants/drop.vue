<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  import CreateDeployProgressDialog, {
    type DeployProgressDialogItem
  } from '../create-deploy-progress-dialog.vue'
  import DropConfirmDialog from '../parts/drop-confirm-dialog.vue'
  import { sampleDropItems } from '../sample'

  const STEP_MS = 1400

  const items = ref<DeployProgressDialogItem[]>(sampleDropItems.map((item) => ({ ...item })))
  const open = ref(false)
  const dropOpen = ref(false)

  let stepTimer: ReturnType<typeof setTimeout> | undefined

  const step = () => {
    const active = items.value.findIndex((item) => item.status === 'deploying')
    const next = items.value.findIndex((item) => item.status === 'queued')
    items.value = items.value.map((item, index) => {
      if (index === active) return { ...item, status: 'done', message: '' }
      if (index === next) return { ...item, status: 'deploying' }
      return item
    })
    if (next >= 0) stepTimer = setTimeout(step, STEP_MS)
  }

  const run = () => {
    clearTimeout(stepTimer)
    step()
  }

  const requeue = (keys: Set<string>) => {
    items.value = items.value.map((item) =>
      keys.has(item.id) ? { ...item, status: 'queued', message: '' } : item
    )
    run()
  }

  const onRetry = (_event: MouseEvent, failed: DeployProgressDialogItem[]) =>
    requeue(new Set(failed.map((item) => item.id)))

  const onRedeploy = () => requeue(new Set(items.value.map((item) => item.id)))

  const deployDropped = () => {
    dropOpen.value = false
    open.value = true
    run()
  }

  onMounted(() => {
    dropOpen.value = true
  })

  onBeforeUnmount(() => clearTimeout(stepTimer))
</script>

<template>
  <CreateDeployProgressDialog
    v-model:open="open"
    :items="items"
    @retry="onRetry"
    @redeploy="onRedeploy"
  >
    <template #actions>
      <Button
        label="Deploy a folder"
        variant="outline"
        size="medium"
        icon="az az-upload"
        @click="dropOpen = true"
      />
    </template>
  </CreateDeployProgressDialog>

  <DropConfirmDialog
    v-model:open="dropOpen"
    :count="items.length"
    @deploy="deployDropped"
  />
</template>
