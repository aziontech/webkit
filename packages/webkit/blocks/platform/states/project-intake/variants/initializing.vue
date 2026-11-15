<script setup lang="ts">
  import UploadProgress, { type UploadProgressItem } from '@aziontech/webkit/upload-progress'
  import { computed, ref } from 'vue'

  const MAX_ROWS = 50

  const files = ref<UploadProgressItem[]>([
    { id: 'package.json', name: 'package.json', size: 1229, status: 'done' },
    { id: 'app.config.js', name: 'app.config.js', size: 640, status: 'done' },
    { id: 'src/index.ts', name: 'src/index.ts', size: 3482, status: 'running', progress: 60 },
    { id: 'src/routes/api.ts', name: 'src/routes/api.ts', size: 2150, status: 'queued' },
    { id: 'public/index.html', name: 'public/index.html', size: 860, status: 'queued' }
  ])

  const doneCount = computed(() => files.value.filter((file) => file.status === 'done').length)
  const shownFiles = computed(() =>
    files.value.length <= MAX_ROWS
      ? files.value
      : files.value.filter((file) => file.status !== 'done').slice(0, MAX_ROWS)
  )
  const totalSize = computed(() => files.value.reduce((sum, file) => sum + (file.size ?? 0), 0))

  const retry = (_event?: MouseEvent, id?: string) => {
    files.value = files.value.map((file) =>
      file.status === 'error' && (!id || file.id === id)
        ? { ...file, status: 'running', error: undefined }
        : file
    )
  }

  const cancel = (_event: MouseEvent, id?: string) => {
    files.value = files.value.map((file) =>
      (file.status === 'queued' || file.status === 'running') && (!id || file.id === id)
        ? { ...file, status: 'canceled' }
        : file
    )
  }
</script>

<template>
  <div class="relative h-dvh [contain:layout]">
    <div
      class="animate-fade-in motion-reduce:animate-none fixed inset-0 z-(--z-control-overlay) flex flex-col items-center justify-center gap-(--spacing-lg) bg-(--bg-canvas) p-(--spacing-xl)"
    >
      <header class="flex flex-col items-center gap-(--spacing-2xs) text-center">
        <h1 class="text-heading-sm text-(--text-default)">Initializing</h1>
        <p class="text-body-sm text-(--text-muted)">
          Setting up your deployment. {{ doneCount }} of {{ files.length }} files.
        </p>
      </header>

      <UploadProgress
        :items="shownFiles"
        :floating="false"
        class="w-full max-w-(--container-md)"
        @retry="retry"
        @cancel="cancel"
      />

      <p class="text-body-xs text-(--text-muted)">
        {{ files.length }} files, {{ (totalSize / 1000).toFixed(2) }} KB
      </p>
    </div>
  </div>
</template>
