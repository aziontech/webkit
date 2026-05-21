<script setup lang="ts">
  import { computed, inject } from 'vue'

  import { DrawerInjectionKey } from './injection-key'

  defineOptions({
    name: 'DrawerPortal'
  })

  defineSlots<{
    default(): unknown
  }>()

  const ctx = inject(DrawerInjectionKey)
  const isOpen = computed(() => ctx?.isOpen.value ?? false)
</script>

<template>
  <Teleport
    v-if="isOpen"
    to="body"
  >
    <slot />
  </Teleport>
</template>
