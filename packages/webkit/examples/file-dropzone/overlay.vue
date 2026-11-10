<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
</script>

<template>
  <div class="relative w-full max-w-(--container-md)">
    <CardBox title="Project files">
      <template #content>
        <div class="flex min-h-48 flex-col gap-(--spacing-xs)">
          <p class="text-body-sm text-(--text-muted)">
            Drag a file from your computer over this window. The drop target covers this card until
            you drop the file, leave the window or press Escape.
          </p>
        </div>
      </template>
    </CardBox>
    <FileDropzone kind="overlay" />
  </div>
</template>
