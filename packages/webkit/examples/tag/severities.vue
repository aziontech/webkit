<script setup>
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Tag
      label="Inactive"
      severity="neutral"
    />
    <Tag
      label="Admin"
      severity="info"
    />
    <Tag
      label="Active"
      severity="success"
    />
    <Tag
      label="Pending"
      severity="warning"
    />
    <Tag
      label="Blocked"
      severity="danger"
    />
  </div>
</template>
