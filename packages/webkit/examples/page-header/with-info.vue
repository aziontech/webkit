<script setup>
  import Button from '@aziontech/webkit/button'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import PageHeader from '@aziontech/webkit/page-header'
</script>

<template>
  <PageHeader
    title="Workloads"
    description="Group the domains, applications and firewalls that serve one site."
  >
    <template #meta>
      <ConsoleLayout.ToolsTrigger aria-label="Info about workloads" />
    </template>
    <template #actions>
      <Button
        label="Create Workload"
        icon="az az-plus"
        variant="primary"
        size="medium"
      />
    </template>
  </PageHeader>
</template>
