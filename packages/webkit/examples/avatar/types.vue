<script setup>
  import Avatar from '@aziontech/webkit/avatar'
</script>

<template>
  <div class="flex flex-wrap items-end gap-6">
    <div class="flex flex-col items-center gap-2">
      <Avatar
        kind="circle"
        label="AB"
        size="medium"
      />
      <span class="text-body-xs text-(--text-muted)">Circle</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <Avatar
        kind="square"
        label="AB"
        size="medium"
      />
      <span class="text-body-xs text-(--text-muted)">Square</span>
    </div>
  </div>
</template>
