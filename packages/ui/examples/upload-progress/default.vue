<script setup>
  import Button from '@aziontech/webkit/button'
  import UploadProgress from '@aziontech/webkit/upload-progress'
  import { onBeforeUnmount, ref } from 'vue'

  const initial = () => [
    { id: 'logo', name: 'logo.svg', size: 4210, status: 'success' },
    { id: 'app', name: 'app.js', size: 248_320, status: 'running', progress: 64 },
    { id: 'styles', name: 'styles.css', size: 52_100, status: 'running' },
    { id: 'hero', name: 'hero.webp', size: 1_482_000, status: 'pending' }
  ]

  const items = ref(initial())
  let timer = 0

  const tick = () => {
    let started = false
    items.value = items.value.map((item) => {
      if (item.status === 'running') {
        const progress = Math.min(100, (item.progress ?? 0) + 18)
        return progress >= 100 ? { ...item, status: 'success', progress } : { ...item, progress }
      }
      if (item.status === 'pending' && !started) {
        started = true
        return { ...item, status: 'running', progress: 0 }
      }
      return item
    })
    if (items.value.every((item) => item.status !== 'running' && item.status !== 'pending')) {
      clearInterval(timer)
    }
  }

  const start = () => {
    clearInterval(timer)
    items.value = initial()
    timer = setInterval(tick, 600)
  }

  const cancel = (id) => {
    items.value = items.value.map((item) =>
      (id === undefined || item.id === id) &&
      (item.status === 'running' || item.status === 'pending')
        ? { ...item, status: 'canceled' }
        : item
    )
  }

  onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) flex-col items-start gap-(--spacing-sm)">
    <Button
      label="Start upload"
      variant="secondary"
      size="medium"
      icon="az az-upload"
      @click="start"
    />
    <UploadProgress
      :items="items"
      :floating="false"
      @cancel="(_event, id) => cancel(id)"
    />
  </div>
</template>
