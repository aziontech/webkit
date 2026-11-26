<script setup>
  import AvatarGroup from '@aziontech/webkit/avatar-group'

  const viewers = [
    { name: 'Jane Doe' },
    { name: 'John Smith' },
    { name: 'Alex Morgan' },
    { name: 'Sam Lee' },
    { name: 'Priya Patel' },
    { name: 'Maria Lee' }
  ]
</script>

<template>
  <div class="flex w-12 justify-center">
    <AvatarGroup
      :items="viewers"
      :max="4"
      size="small"
      orientation="vertical"
      aria-label="Viewing now"
    />
  </div>
</template>
