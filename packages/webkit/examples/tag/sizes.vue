<script setup>
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <Tag
        label="Label"
        severity="primary"
        size="medium"
      />
      <Tag
        label="Label"
        severity="primary"
        size="medium"
        rounded
      />
      <Tag
        label="Label"
        severity="primary"
        size="medium"
        icon="pi pi-box"
      />
      <Tag
        label="Label"
        severity="primary"
        size="medium"
        icon="pi pi-box"
        rounded
      />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Tag
        label="Label"
        severity="primary"
        size="small"
      />
      <Tag
        label="Label"
        severity="primary"
        size="small"
        rounded
      />
      <Tag
        label="Label"
        severity="primary"
        size="small"
        icon="pi pi-box"
      />
      <Tag
        label="Label"
        severity="primary"
        size="small"
        icon="pi pi-box"
        rounded
      />
    </div>
  </div>
</template>
