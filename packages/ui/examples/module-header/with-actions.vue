<script setup>
  import Button from '@aziontech/ui/button'
  import ModuleHeader from '@aziontech/ui/module-header'
</script>

<template>
  <ModuleHeader
    eyebrow="Platform"
    title="Everything runs at the edge"
    description="One platform for applications, security and observability."
  >
    <template #actions>
      <Button label="Start for free" />
      <Button
        variant="outline"
        label="Docs"
      />
    </template>
  </ModuleHeader>
</template>
