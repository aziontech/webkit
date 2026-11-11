<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, useAttrs } from 'vue'

  import { TriggerHost } from '../../../utils/trigger-host'
  import { DialogInjectionKey } from './injection-key'

  defineOptions({
    name: 'DialogTrigger',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DialogInjectionKey)

  const aria = computed(() => ({
    'aria-haspopup': 'dialog',
    'aria-expanded': String(Boolean(ctx?.isOpen.value))
  }))

  const activate = () => {
    ctx?.open()
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      activate()
    }
  }

  function onControl(el: globalThis.HTMLElement | null) {
    if (ctx) ctx.triggerRef.value = el
  }

  onBeforeUnmount(() => {
    if (ctx) ctx.triggerRef.value = null
  })
</script>

<template>
  <TriggerHost
    :aria="aria"
    as-button
    :class="attrs.class"
    :data-testid="`${ctx?.testId}__trigger`"
    @click="activate"
    @keydown="onKeydown"
    @control="onControl"
  >
    <slot />
  </TriggerHost>
</template>
