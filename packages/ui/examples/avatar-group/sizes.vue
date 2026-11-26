<script setup>
  import AvatarGroup from '@aziontech/ui/avatar-group'

  const owners = [
    { name: 'Jane Doe' },
    { name: 'John Smith' },
    { name: 'Alex Morgan' },
    { name: 'Sam Lee' }
  ]
</script>

<template>
  <div class="flex flex-col items-start gap-(--spacing-md)">
    <AvatarGroup
      :items="owners"
      :max="3"
      size="small"
      aria-label="Owners, small"
    />
    <AvatarGroup
      :items="owners"
      :max="3"
      size="medium"
      aria-label="Owners, medium"
    />
    <AvatarGroup
      :items="owners"
      :max="3"
      size="large"
      aria-label="Owners, large"
    />
  </div>
</template>
