<script setup>
  import Button from '@aziontech/webkit/button'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import { onBeforeUnmount } from 'vue'

  let timer

  const stop = () => {
    clearInterval(timer)
    timer = undefined
  }

  const upload = () => {
    if (timer) return
    let value = 0
    const id = 'site-assets-upload'
    const cancel = {
      label: 'Cancel',
      onClick: () => {
        stop()
        toast.dismiss(id)
      }
    }
    toast.progress('Uploading site-assets.zip', value, {
      id,
      description: '12 of 48 MB',
      action: cancel
    })
    timer = setInterval(() => {
      value += 10
      if (value >= 100) {
        stop()
        toast.success('site-assets.zip uploaded', { id, description: '48 MB' })
        return
      }
      toast.progress('Uploading site-assets.zip', value, {
        id,
        description: `${Math.round((48 * value) / 100)} of 48 MB`,
        action: cancel
      })
    }, 600)
  }

  onBeforeUnmount(stop)
</script>

<template>
  <Toaster position="bottom-end" />
  <Button
    label="Upload file"
    @click="upload"
  />
</template>
