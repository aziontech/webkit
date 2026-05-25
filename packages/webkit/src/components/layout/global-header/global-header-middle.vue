<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { GlobalHeaderInjectionKey } from './injection-key'

  defineOptions({
    name: 'GlobalHeaderMiddle',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(GlobalHeaderInjectionKey)

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      `${ctx?.testId ?? 'layout-global-header'}__middle`
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-h-0 min-w-0 flex-1 items-center justify-center"
  >
    <slot />
  </div>
</template>
