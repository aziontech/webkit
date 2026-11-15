<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { AppHeaderInjectionKey } from './injection-key'

  defineOptions({
    name: 'AppHeaderStart',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(AppHeaderInjectionKey)

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'layout-app-header'}__start`
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-w-0 shrink items-center justify-end gap-(--spacing-xs)"
  >
    <slot />
  </div>
</template>
