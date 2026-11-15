<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { AppHeaderInjectionKey } from './injection-key'

  defineOptions({
    name: 'AppHeaderBrand',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(AppHeaderInjectionKey)

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'layout-app-header'}__brand`
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex shrink-0 items-center [&_svg]:block [&_svg]:h-[18px] [&_svg]:w-auto [&_svg]:max-w-full"
  >
    <slot />
  </div>
</template>
