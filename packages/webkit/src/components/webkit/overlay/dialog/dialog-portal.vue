<script setup lang="ts">
  import { computed, inject } from 'vue'

  import { DialogInjectionKey } from './injection-key'

  defineOptions({
    name: 'DialogPortal',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const ctx = inject(DialogInjectionKey)
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
