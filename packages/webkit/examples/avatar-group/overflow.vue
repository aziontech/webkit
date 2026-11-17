<script setup>
  import AvatarGroup from '@aziontech/webkit/avatar-group'

  const first = ['Jane', 'John', 'Alex', 'Sam', 'Priya', 'Maria', 'Chen', 'Omar']
  const last = ['Doe', 'Smith', 'Morgan', 'Lee', 'Patel']
  const team = first.flatMap((given) => last.map((family) => ({ name: `${given} ${family}` })))
</script>

<template>
  <AvatarGroup
    :items="team"
    :max="4"
    aria-label="Acme Inc. team"
  />
</template>
