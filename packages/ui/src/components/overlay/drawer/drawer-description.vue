<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, onMounted, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { DrawerInjectionKey } from './injection-key'

  defineOptions({
    name: 'DrawerDescription',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DrawerInjectionKey)
  const testId = computed(() => String(attrs['data-testid'] ?? 'drawer-description'))

  onMounted(() => ctx?.registerDescription())
  onBeforeUnmount(() => ctx?.unregisterDescription())
</script>

<template>
  <p
    :id="ctx?.descriptionId"
    :class="cn('text-body-sm text-(--text-muted)', attrs.class as string | undefined)"
    :data-testid="testId"
  >
    <slot />
  </p>
</template>
