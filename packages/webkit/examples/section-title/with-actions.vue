<script setup>
  import Button from '@aziontech/webkit/button'
  import SectionTitle from '@aziontech/webkit/section-title'
</script>

<template>
  <SectionTitle
    eyebrow="Platform"
    title="Everything runs at the edge"
    description="One platform for applications, security and observability."
  >
    <template #actions>
      <Button label="Start for free" />
      <Button
        kind="outlined"
        label="Docs"
      />
    </template>
  </SectionTitle>
</template>
