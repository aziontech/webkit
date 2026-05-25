<script setup lang="ts">
  import { computed, inject, onMounted, ref, useAttrs } from 'vue'

  import { DropdownMenuInjectionKey } from './injection-key'

  defineOptions({
    name: 'DropdownMenuTrigger',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DropdownMenuInjectionKey)
  const triggerEl = ref<HTMLElement | null>(null)

  onMounted(() => {
    if (ctx && triggerEl.value) {
      ctx.triggerRef.value = triggerEl.value
    }
  })

  const isOpen = computed(() => ctx?.isOpen.value ?? false)

  const toggle = () => {
    if (!ctx) return

    if (isOpen.value) {
      ctx.close()
    } else {
      ctx.open()
    }
  }

  const rootClasses = computed(() => [attrs.class])
</script>

<template>
  <span
    ref="triggerEl"
    role="button"
    tabindex="0"
    :class="rootClasses"
    :aria-haspopup="true"
    :aria-expanded="isOpen"
    :aria-controls="ctx?.menuId"
    :data-testid="`${ctx?.testId}__trigger`"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
  >
    <slot />
  </span>
</template>
