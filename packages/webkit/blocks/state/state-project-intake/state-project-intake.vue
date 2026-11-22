<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import UploadProgress, { type UploadProgressItem } from '@aziontech/webkit/upload-progress'
  import { useFilePicker } from '@aziontech/webkit/use-file-picker'
  import { computed, ref, watch } from 'vue'

  /** One file of the upload, with its state and progress. */
  export type ProjectIntakeUpload = UploadProgressItem

  export interface ProjectIntakeProps {
    /** The files being uploaded; set, the Initializing overlay replaces the drop target. */
    uploads?: ProjectIntakeUpload[]
    /** The drop target's heading. */
    title?: string
    /** What the drop target accepts. */
    description?: string
  }

  const props = withDefaults(defineProps<ProjectIntakeProps>(), {
    uploads: undefined,
    title: 'Drop your project to deploy it',
    description: 'A project folder, or the files inside one. We detect what it is built with.'
  })

  const emit = defineEmits<{
    select: [event: Event, files: File[]]
    retry: [event: MouseEvent, id: string | undefined]
    cancel: [event: MouseEvent, id: string | undefined]
  }>()

  const MAX_ROWS = 50

  const folderPicker = useFilePicker({ directory: true, multiple: true })
  const received = ref(0)
  const files = ref<ProjectIntakeUpload[]>([])

  watch(
    () => props.uploads,
    (next) => {
      files.value = next ? [...next] : []
    },
    { immediate: true }
  )

  const doneCount = computed(() => files.value.filter((file) => file.status === 'success').length)
  const failedCount = computed(() => files.value.filter((file) => file.status === 'error').length)
  const shownFiles = computed(() =>
    files.value.length <= MAX_ROWS
      ? files.value
      : files.value.filter((file) => file.status !== 'success').slice(0, MAX_ROWS)
  )
  const totalSize = computed(() => files.value.reduce((sum, file) => sum + (file.size ?? 0), 0))

  const chooseFolder = async (event: MouseEvent) => {
    const chosen = await folderPicker.open()
    if (!chosen.length) return
    received.value = chosen.length
    emit('select', event, chosen)
  }

  const onDrop = (event: DragEvent, dropped: File[]) => {
    received.value = dropped.length
    emit('select', event, dropped)
  }

  const retry = (event: MouseEvent, id?: string) => {
    files.value = files.value.map((file) =>
      file.status === 'error' && (!id || file.id === id)
        ? { ...file, status: 'running', error: undefined }
        : file
    )
    emit('retry', event, id)
  }

  const cancel = (event: MouseEvent, id?: string) => {
    files.value = files.value.map((file) =>
      (file.status === 'pending' || file.status === 'running') && (!id || file.id === id)
        ? { ...file, status: 'canceled' }
        : file
    )
    emit('cancel', event, id)
  }
</script>

<template>
  <div
    v-if="uploads"
    class="relative h-dvh [contain:layout]"
  >
    <div
      class="animate-fade-in motion-reduce:animate-none fixed inset-0 z-(--z-control-overlay) flex flex-col items-center justify-center gap-(--spacing-lg) bg-(--bg-canvas) p-(--spacing-xl)"
    >
      <header class="flex flex-col items-center gap-(--spacing-2xs) text-center">
        <h1 class="text-heading-sm text-(--text-default)">Initializing</h1>
        <p class="text-body-sm text-(--text-muted)">
          Setting up your deployment. {{ doneCount }} of {{ files.length }} files.
        </p>
      </header>

      <Alert
        v-if="failedCount"
        severity="danger"
        size="small"
        class="w-full max-w-(--container-md)"
        :label="`${failedCount} file could not be uploaded. Retry it, or remove it from the folder and drop the project again.`"
        action-label="Retry"
        @action="(event: MouseEvent) => retry(event)"
      />

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
  <div
    v-else
    class="layout-boundary flex min-h-full flex-1 flex-col"
  >
    <FileDropzone
      directories
      :title="title"
      :description="description"
      class="flex-1"
      @drop="onDrop"
    >
      <Button
        label="Choose a folder"
        variant="outline"
        size="medium"
        icon="az az-folder-open"
        @click="chooseFolder"
      />
    </FileDropzone>
    <p
      class="sr-only"
      role="status"
    >
      {{ received ? `${received} files received.` : '' }}
    </p>
  </div>
</template>
