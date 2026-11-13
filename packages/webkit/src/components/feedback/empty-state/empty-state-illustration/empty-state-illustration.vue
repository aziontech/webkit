<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'EmptyStateIllustration',
    inheritAttrs: false
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feedback-empty-state__illustration'
  )
</script>

<template>
  <img
    v-bind="$attrs"
    :data-testid="testId"
    src="./empty-state-illustration.svg"
    alt=""
    aria-hidden="true"
    width="193"
    height="120"
    class="block h-auto w-full"
  />
</template>
