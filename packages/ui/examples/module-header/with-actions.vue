<script setup>
  import Button from '@aziontech/webkit/button'
  import ModuleHeader from '@aziontech/webkit/module-header'
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
