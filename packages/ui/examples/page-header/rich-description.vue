<script setup>
  import Button from '@aziontech/webkit/button'
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
      <Button
        variant="link"
        label="file"
      />
      or a
      <Button
        variant="link"
        label="folder"
      />.
    </template>
  </PageHeader>
</template>
