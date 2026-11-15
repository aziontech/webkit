<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { AppHeaderInjectionKey } from './injection-key'

  defineOptions({
    name: 'AppHeaderCenter',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(AppHeaderInjectionKey)

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      `${ctx?.testId ?? 'layout-app-header'}__center`
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
