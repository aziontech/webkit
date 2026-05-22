<script setup lang="ts">
  defineOptions({
    name: 'DropdownMenuPortal'
  })

  defineSlots<{
    default(): unknown
  }>()
</script>

<template>
  <Teleport to="body">
    <slot />
  </Teleport>
</template>
