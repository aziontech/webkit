<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'FieldGroup',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-field-group')
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="field-group"
    :data-testid="testId"
    class="@container/field-group flex w-full flex-col gap-(--spacing-lg) [&>[data-slot=field-group]]:gap-(--spacing-sm)"
  >
    <slot />
  </div>
</template>
