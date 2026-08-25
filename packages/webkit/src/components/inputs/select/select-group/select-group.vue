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
    class="flex flex-col items-stretch [&:not(:first-child)]:mt-(--spacing-sm)"
  >
    <!--
      Groups never sit flush: `--spacing-sm` above every group but the first, the
      same rhythm Dropdown puts around its group divider and CommandMenu puts
      between two bare groups. No hairline here — unlike Dropdown, the Figma frame
      for this panel separates groups by space alone.
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
