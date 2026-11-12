<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'FieldContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-content'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="field-content"
    :data-testid="testId"
    class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)"
  >
    <slot />
  </div>
</template>
