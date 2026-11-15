<script setup>
  import Button from '@aziontech/webkit/button'
  import PageHeader from '@aziontech/webkit/page-header'
</script>

<template>
  <PageHeader
    title="Resources"
    description="View and manage your resources."
  >
    <template #actions>
      <Button
        label="Documentation"
        icon="ai ai-book"
        kind="outlined"
        size="medium"
        href="https://example.com/docs/resources"
        target="_blank"
      />
      <Button
        label="Create Resource"
        icon="ai ai-plus"
        kind="outlined"
        size="medium"
      />
    </template>
  </PageHeader>
</template>
