<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, provide, ref, watch } from 'vue'

  import { usePortalLocale } from '../../../composables/use-locale/use-translate'
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

  const portalLocale = usePortalLocale()

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
    <div
      class="contents"
      :dir="portalLocale.dir"
      :lang="portalLocale.lang"
    >
      <slot />
    </div>
  </Teleport>
</template>
