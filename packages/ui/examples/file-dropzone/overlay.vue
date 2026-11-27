<script setup>
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import FileDropzone from '@aziontech/ui/file-dropzone'
  import { useFilePicker } from '@aziontech/ui/use-file-picker'
  import { ref } from 'vue'

  const picker = useFilePicker({ multiple: true })
  const files = ref([])
  const add = (picked) => {
    files.value = [...files.value, ...picked.map((file) => file.name)]
  }
  const upload = async () => add(await picker.open())
</script>

<template>
  <div class="relative w-full max-w-(--container-md)">
    <Card title="Project files">
      <template #default>
        <div class="flex min-h-48 flex-col items-start gap-(--spacing-sm)">
          <p class="text-body-sm text-(--text-muted)">
            Use Upload, or drag files from your computer over this card. The drop target covers the
            card until you drop the files, leave the window or press Escape.
          </p>
          <Button
            label="Upload"
            icon="az az-upload"
            variant="secondary"
            size="medium"
            @click="upload"
          />
          <p class="text-body-sm text-(--text-default)">
            Files: {{ files.length ? files.join(', ') : 'none yet' }}
          </p>
        </div>
      </template>
    </Card>
    <FileDropzone
      variant="overlay"
      @drop="(event, dropped) => add(dropped)"
    />
  </div>
</template>
