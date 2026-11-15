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
  export type SelectGroupProps = Props

  withDefaults(defineProps<Props>(), {
    label: ''
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-select-group'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :aria-label="label || undefined"
    :data-testid="testId"
    :class="attrs.class"
    class="flex flex-col items-stretch [&:not(:first-child)]:mt-(--spacing-sm)"
  >
    <div
      v-if="label"
      class="flex items-center px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
      :data-testid="`${testId}__label`"
    >
      {{ label }}
    </div>
    <slot />
  </div>
</template>
