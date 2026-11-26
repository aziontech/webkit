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
        icon="az az-book"
        variant="outline"
        size="medium"
        href="https://example.com/docs/resources"
        target="_blank"
      />
      <Button
        label="Create resource"
        icon="az az-plus"
        variant="primary"
        size="medium"
      />
    </template>
  </PageHeader>
</template>
