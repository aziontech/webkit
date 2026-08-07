<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'SelectGroup',
    inheritAttrs: false
  })

  interface Props {
    /** Heading text rendered above the grouped options. */
    label?: string
  }

  withDefaults(defineProps<Props>(), {
    label: undefined
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'select-group')
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :aria-label="label"
    :data-testid="testId"
    :class="attrs.class"
    class="flex flex-col items-stretch"
  >
    <div
      v-if="label"
      class="flex items-center px-(--spacing-xs) py-(--spacing-xxs) text-overline-xs text-(--text-muted) uppercase"
      :data-testid="`${testId}__label`"
    >
      {{ label }}
    </div>
    <slot />
  </div>
</template>
