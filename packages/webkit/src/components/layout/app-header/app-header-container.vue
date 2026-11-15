<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { AppHeaderInjectionKey } from './injection-key'

  defineOptions({
    name: 'AppHeaderContainer',
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
      `${ctx?.testId ?? 'layout-app-header'}__container`
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-w-0 shrink-0 items-center gap-(--spacing-md)"
  >
    <slot />
  </div>
</template>
