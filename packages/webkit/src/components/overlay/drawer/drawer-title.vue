<script setup lang="ts">
  import { inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { DrawerInjectionKey } from './injection-key'

  defineOptions({
    name: 'DrawerTitle',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DrawerInjectionKey)
</script>

<template>
  <h2
    :id="ctx?.titleId"
    :class="cn('text-heading-sm text-(--text-default)', attrs.class as string | undefined)"
    :data-testid="`${ctx?.testId}__title`"
  >
    <slot />
  </h2>
</template>
