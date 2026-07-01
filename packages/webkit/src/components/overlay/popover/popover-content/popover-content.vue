<script setup lang="ts">
  import { usePopoverContext } from '../injection-key'

  defineOptions({
    name: 'PopoverContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const ctx = usePopoverContext()
</script>

<template>
  <Teleport
    v-if="ctx.isOpen.value && ctx.panelBodyRef.value"
    :to="ctx.panelBodyRef.value"
  >
    <slot />
  </Teleport>
</template>
