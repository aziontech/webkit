<script setup lang="ts">
  import { computed, useAttrs, useId, useSlots } from 'vue'

  defineOptions({
    name: 'Separator',
    inheritAttrs: false
  })

  type SeparatorOrientation = 'horizontal' | 'vertical'

  export interface SeparatorProps {
    /** Layout axis of the separator line. */
    orientation?: SeparatorOrientation
    /** Fallback centered text shown when the default slot is empty. */
    label?: string
    /** Purely visual line: renders role none instead of separator when there is no label. */
    decorative?: boolean
  }

  const props = withDefaults(defineProps<SeparatorProps>(), {
    orientation: 'horizontal',
    label: '',
    decorative: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'layout-separator')

  const labelId = useId()

  const hasContent = () => Boolean(slots['default']) || props.label.length > 0
</script>

<template>
  <div
    v-bind="$attrs"
    :role="decorative && !hasContent() ? 'none' : 'separator'"
    :aria-orientation="decorative && !hasContent() ? undefined : orientation"
    :aria-labelledby="hasContent() ? labelId : undefined"
    :data-testid="testId"
    :data-orientation="orientation"
    :data-labelled="hasContent() || null"
    class="flex shrink-0 items-center justify-center text-overline-sm text-(--text-muted) data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:h-full data-[orientation=vertical]:flex-col data-[labelled]:gap-(--spacing-xs) before:content-[''] before:flex-1 before:self-center before:border-(--border-default) after:content-[''] after:flex-1 after:self-center after:border-(--border-default) data-[orientation=horizontal]:before:border-t data-[orientation=horizontal]:after:border-t data-[orientation=vertical]:before:border-s data-[orientation=vertical]:after:border-s"
  >
    <span
      v-if="hasContent()"
      :id="labelId"
      :data-testid="`${testId}__label`"
    >
      <slot v-if="slots['default']" />
      <template v-else>{{ label }}</template>
    </span>
  </div>
</template>
