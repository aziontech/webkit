<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, ref, watch } from 'vue'

  import { DrawerInjectionKey } from './injection-key'
  import { DRAWER_EXIT_MS } from './presets/transitions'

  defineOptions({
    name: 'DrawerPortal'
  })

  defineSlots<{
    default(): unknown
  }>()

  const ctx = inject(DrawerInjectionKey)
  const isOpen = computed(() => ctx?.isOpen.value ?? false)
  const isPresent = ref(isOpen.value)
  let exitTimer: ReturnType<typeof setTimeout> | undefined

  watch(isOpen, (open) => {
    if (exitTimer) {
      clearTimeout(exitTimer)
      exitTimer = undefined
    }

    if (open) {
      isPresent.value = true
      return
    }

    if (!isPresent.value) return

    exitTimer = setTimeout(() => {
      isPresent.value = false
      exitTimer = undefined
    }, DRAWER_EXIT_MS)
  })

  onBeforeUnmount(() => {
    if (exitTimer) clearTimeout(exitTimer)
  })
</script>

<template>
  <Teleport
    v-if="isPresent"
    to="body"
  >
    <slot />
  </Teleport>
</template>
