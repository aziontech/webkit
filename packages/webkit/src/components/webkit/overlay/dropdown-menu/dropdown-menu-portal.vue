<script setup lang="ts">
  defineOptions({
    name: 'DropdownMenuPortal',
    inheritAttrs: false
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
