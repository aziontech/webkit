<script setup lang="ts">
  import CopyButton from '@aziontech/ui/copy-button'
  import FilePreview from '@aziontech/ui/file-preview'
</script>

<template>
  <FilePreview
    class="max-w-(--container-md)"
    file-name="site-assets.zip"
    mime-type="application/zip"
    :bytes="4404019"
  >
    <template #actions>
      <CopyButton
        value="https://storage.example.com/site-assets.zip"
        aria-label="Copy link"
      />
    </template>
  </FilePreview>
</template>
