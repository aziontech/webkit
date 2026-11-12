<script setup>
  import PageHeader from '@aziontech/webkit/page-header'
</script>

<template>
  <PageHeader
    title="Start a new project"
    size="large"
  >
    <template #description>
      Start from a repository or use a framework template. You can also drag and drop your project,
      or choose a
      <button
        type="button"
        class="text-link cursor-pointer"
      >
        file
      </button>
      or a
      <button
        type="button"
        class="text-link cursor-pointer"
      >
        folder</button
      >.
    </template>
  </PageHeader>
</template>
