<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'AppHeaderBrand',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'app-header-brand')
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
