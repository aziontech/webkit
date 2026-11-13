<script setup>
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import Avatar from '@aziontech/webkit/avatar'
</script>

<template>
  <div class="flex flex-wrap items-end gap-6">
    <div class="flex flex-col items-center gap-2">
      <Avatar
        :src="placeholderImage"
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
