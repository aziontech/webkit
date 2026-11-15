<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { AppHeaderInjectionKey } from './injection-key'

  defineOptions({
    name: 'AppHeaderEnd',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(AppHeaderInjectionKey)

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'layout-app-header'}__end`
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex shrink-0 items-center justify-end gap-(--spacing-sm)"
  >
    <slot />
  </div>
</template>
