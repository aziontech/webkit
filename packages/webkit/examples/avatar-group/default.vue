<script setup>
  import AvatarGroup from '@aziontech/webkit/avatar-group'

  const team = [
    { name: 'Jane Doe' },
    { name: 'John Smith' },
    { name: 'Alex Morgan' },
    { name: 'Sam Lee' },
    { name: 'Priya Patel' }
  ]
</script>

<template>
  <AvatarGroup
    :items="team"
    :max="3"
    aria-label="Team members"
  />
</template>
