<script setup>
  import PageHeader from '@aziontech/webkit/page-header'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <PageHeader
      title="Start a new project"
      description="Start from a repository or use a framework template."
      size="large"
    />
    <PageHeader
      title="Resources"
      description="View and manage your resources."
    />
    <PageHeader
      title="Settings"
      description="Core configuration for this resource."
      size="small"
    />
  </div>
</template>
