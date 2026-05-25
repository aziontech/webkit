<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, provide, ref, watch } from 'vue'

  import { useDialogMotionState } from './composables/use-dialog-motion-state'
  import { DialogInjectionKey, DialogMotionInjectionKey } from './injection-key'
  import { DIALOG_EXIT_MS } from './presets/transitions'

  defineOptions({
    name: 'DialogPortal',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const ctx = inject(DialogInjectionKey)
  const isOpen = computed(() => ctx?.isOpen.value ?? false)
  const { motionState } = useDialogMotionState(isOpen)

  provide(DialogMotionInjectionKey, { motionState })

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
    }, DIALOG_EXIT_MS)
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
