<script setup>
  import Avatar from '@aziontech/webkit/avatar'
</script>

<template>
  <div class="flex flex-wrap items-end gap-6">
    <div class="flex flex-col items-center gap-2">
      <Avatar
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face"
        alt="Portrait of a user"
        size="large"
      />
      <span class="text-body-xs text-(--text-muted)">Image</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <Avatar
        label="JD"
        size="large"
      />
      <span class="text-body-xs text-(--text-muted)">Initials</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <Avatar
        icon="pi pi-user"
        size="large"
      />
      <span class="text-body-xs text-(--text-muted)">Icon</span>
    </div>
  </div>
</template>
