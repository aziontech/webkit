<script setup>
  import Tag from '@aziontech/ui/tag'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <Tag
        label="Medium"
        severity="neutral"
        size="medium"
      />
      <Tag
        label="Medium icon"
        severity="neutral"
        icon="az az-tag"
        size="medium"
      />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Tag
        label="Small"
        severity="neutral"
        size="small"
      />
      <Tag
        label="Small icon"
        severity="neutral"
        icon="az az-tag"
        size="small"
      />
    </div>
  </div>
</template>
