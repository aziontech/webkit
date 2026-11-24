<script setup>
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <Tag
        label="Medium"
        variant="primary"
        size="medium"
      />
      <Tag
        label="Medium pill"
        variant="primary"
        size="medium"
        rounded
      />
      <Tag
        label="Medium icon"
        variant="primary"
        icon="az az-tag"
        size="medium"
      />
      <Tag
        label="Medium icon pill"
        variant="primary"
        icon="az az-tag"
        size="medium"
        rounded
      />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Tag
        label="Small"
        variant="primary"
        size="small"
      />
      <Tag
        label="Small pill"
        variant="primary"
        size="small"
        rounded
      />
      <Tag
        label="Small icon"
        variant="primary"
        icon="az az-tag"
        size="small"
      />
      <Tag
        label="Small icon pill"
        variant="primary"
        icon="az az-tag"
        size="small"
        rounded
      />
    </div>
  </div>
</template>
