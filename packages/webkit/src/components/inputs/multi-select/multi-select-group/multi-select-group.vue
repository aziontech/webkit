<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'MultiSelectGroup',
    inheritAttrs: false
  })

  interface Props {
    /** Heading text rendered above the grouped options. */
    label?: string
  }

  withDefaults(defineProps<Props>(), {
    label: ''
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'multi-select-group'
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
    <!--
      Groups never sit flush: `--spacing-sm` above every group but the first, the
      same rhythm Dropdown puts around its group divider and CommandMenu puts
      between two bare groups.
    -->
    <div
      v-if="label"
      class="flex items-center px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
      :data-testid="`${testId}__label`"
    >
      {{ label }}
    </div>
    <slot />
  </div>
</template>
