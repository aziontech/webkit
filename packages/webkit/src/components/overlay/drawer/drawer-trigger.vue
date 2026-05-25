<script setup lang="ts">
  import { computed, inject, onMounted, ref, useAttrs } from 'vue'

  import { DrawerInjectionKey } from './injection-key'

  defineOptions({
    name: 'DrawerTrigger',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DrawerInjectionKey)
  const triggerEl = ref<HTMLElement | null>(null)

  onMounted(() => {
    if (ctx && triggerEl.value) {
      ctx.triggerRef.value = triggerEl.value
    }
  })

  const activate = () => {
    ctx?.open()
  }

  const rootClasses = computed(() => [attrs.class])
</script>

<template>
  <span
    ref="triggerEl"
    role="button"
    tabindex="0"
    :class="rootClasses"
    :data-testid="`${ctx?.testId}__trigger`"
    @click="activate"
    @keydown.enter.prevent="activate"
    @keydown.space.prevent="activate"
  >
    <slot />
  </span>
</template>
