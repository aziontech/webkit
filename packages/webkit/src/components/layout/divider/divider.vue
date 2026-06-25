<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  defineOptions({
    name: 'Divider',
    inheritAttrs: false
  })

  type DividerOrientation = 'horizontal' | 'vertical'

  interface Props {
    /** Layout axis of the separator line. */
    orientation?: DividerOrientation
    /** Fallback centered text shown when the default slot is empty. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    orientation: 'horizontal',
    label: ''
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'layout-divider')

  const hasContent = computed<boolean>(() => Boolean(slots.default) || props.label.length > 0)
</script>

<template>
  <div
    v-bind="$attrs"
    role="separator"
    :aria-orientation="orientation"
    :data-testid="testId"
    :data-orientation="orientation"
    :data-labelled="hasContent || null"
    class="flex shrink-0 items-center justify-center text-label-sm text-[var(--text-muted)] data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:h-full data-[orientation=vertical]:flex-col data-[labelled]:gap-[var(--spacing-sm)] before:content-[''] before:flex-1 before:self-center before:border-[var(--border-default)] after:content-[''] after:flex-1 after:self-center after:border-[var(--border-default)] data-[orientation=horizontal]:before:border-t data-[orientation=horizontal]:after:border-t data-[orientation=vertical]:before:border-l data-[orientation=vertical]:after:border-l"
  >
    <span
      v-if="hasContent"
      :data-testid="`${testId}__label`"
    >
      <slot v-if="slots.default" />
      <template v-else>{{ label }}</template>
    </span>
  </div>
</template>
