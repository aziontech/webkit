<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  export type HelperTextType = 'helper' | 'invalid' | 'required' | 'disabled'

  defineOptions({
    name: 'HelperText',
    inheritAttrs: false
  })

  interface Props {
    /** Fallback text when the default slot is empty. */
    label?: string
    /** Visual variant; `disabled` also prepends a ai ai-lock icon. */
    type?: HelperTextType
  }
  export type HelperTextProps = Props

  withDefaults(defineProps<Props>(), {
    label: '',
    type: 'helper'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-helper-text')
</script>

<template>
  <p
    v-bind="$attrs"
    :data-testid="testId"
    :data-type="type"
    :class="attrs.class"
    class="inline-flex items-center text-label-sm data-[type=helper]:text-(--text-muted) data-[type=disabled]:text-(--text-muted) data-[type=invalid]:text-(--danger-foreground) data-[type=required]:text-(--warning-foreground) data-[type=disabled]:gap-(--spacing-2xs)"
  >
    <i
      v-if="type === 'disabled'"
      class="ai ai-lock flex shrink-0 items-center"
      aria-hidden="true"
      :data-testid="`${testId}__icon`"
    />
    <span :data-testid="`${testId}__text`">
      <slot v-if="$slots['default']" />
      <template v-else-if="label">{{ label }}</template>
    </span>
  </p>
</template>
