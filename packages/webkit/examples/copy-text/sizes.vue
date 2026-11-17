<script setup>
  import CopyText from '@aziontech/webkit/copy-text'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-md)">
    <CopyText
      value="p-(--spacing-2xl)"
      size="small"
    />
    <CopyText
      value="p-(--spacing-2xl)"
      size="medium"
    />
  </div>
</template>
