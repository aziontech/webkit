<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import DialogContent from '@aziontech/ui/dialog-content'
  import DialogDescription from '@aziontech/ui/dialog-description'
  import Dialog from '@aziontech/ui/dialog-root'
  import DialogTitle from '@aziontech/ui/dialog-title'
  import FileDropzone from '@aziontech/ui/file-dropzone'
  import FileTokenGroup, { type FileTokenGroupItem } from '@aziontech/ui/file-token-group'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import { useFilePicker } from '@aziontech/ui/use-file-picker'
  import { computed, ref, watch } from 'vue'

  import { UPLOAD_LIMIT } from '../lib/file-rows'

  type PickedFile = FileTokenGroupItem & { file: File }

  defineProps<{
    uploadMode: 'files' | 'folder'
    path: string
    rootName: string
  }>()

  const emit = defineEmits<{
    upload: [event: MouseEvent, files: File[]]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  const picked = ref<PickedFile[]>([])
  const filePicker = useFilePicker({ multiple: true })
  const folderPicker = useFilePicker({ directory: true })

  const toPicked = (file: File): PickedFile => ({
    file,
    error: file.size > UPLOAD_LIMIT ? 'Larger than 300 MB, the limit per file' : undefined,
    warning: file.size === 0 ? 'This file is empty' : undefined
  })
  const pickable = computed(() => picked.value.filter((item) => !item.error))
  const addPicked = (files: FileList | File[]) => {
    picked.value = [...picked.value, ...Array.from(files).map(toPicked)]
  }
  const pickFrom = async (picker: typeof filePicker) => addPicked(await picker.open())
  const removePicked = (index: number) => {
    picked.value = picked.value.filter((_, position) => position !== index)
  }

  watch(open, (now) => {
    if (now) picked.value = []
  })

  const startUpload = (event: MouseEvent) => {
    if (!pickable.value.length) return
    emit(
      'upload',
      event,
      pickable.value.map((item) => item.file)
    )
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    size="medium"
  >
    <DialogContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <DialogTitle>{{
            uploadMode === 'folder' ? 'Upload folder' : 'Upload files'
          }}</DialogTitle>
          <DialogDescription>
            {{ uploadMode === 'folder' ? 'The folder and its subfolders go' : 'Files go' }} to
            {{ path || rootName }}. A file with the same path is replaced.
          </DialogDescription>
        </div>
      </PanelHeader>
      <PanelBody>
        <div class="flex flex-col gap-(--spacing-md)">
          <FileDropzone
            :directories="uploadMode === 'folder'"
            :title="uploadMode === 'folder' ? 'Drop a folder to upload' : undefined"
            description="Up to 300 MB per file."
            @drop="(_event, files) => addPicked(files)"
          >
            <Button
              key="button-1"
              v-if="uploadMode === 'folder'"
              label="Browse folder"
              variant="secondary"
              size="medium"
              icon="az az-folder-open"
              @click="pickFrom(folderPicker)"
            />
            <Button
              key="button-2"
              v-else
              label="Browse files"
              variant="secondary"
              size="medium"
              @click="pickFrom(filePicker)"
            />
          </FileDropzone>
          <FileTokenGroup
            v-if="picked.length"
            :items="picked"
            :limit="5"
            aria-label="Files to upload"
            @remove="(_event, { index }) => removePicked(index)"
          />
        </div>
      </PanelBody>
      <PanelFooter>
        <div class="flex w-full justify-end gap-(--spacing-xs)">
          <Button
            label="Cancel"
            variant="outline"
            size="medium"
            @click="open = false"
          />
          <Button
            :label="pickable.length > 1 ? `Upload ${pickable.length} files` : 'Upload file'"
            variant="primary"
            size="medium"
            icon="az az-upload"
            :disabled="!pickable.length"
            @click="startUpload"
          />
        </div>
      </PanelFooter>
    </DialogContent>
  </Dialog>
</template>
