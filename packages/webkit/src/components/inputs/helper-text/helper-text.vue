<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  export type HelperTextKind = 'helper' | 'invalid' | 'required' | 'disabled'

  defineOptions({
    name: 'HelperText',
    inheritAttrs: false
  })

  interface Props {
    /** Fallback text when the default slot is empty. */
    value?: string
    /** Visual variant; `disabled` also prepends a pi pi-lock icon. */
    kind?: HelperTextKind
  }

  withDefaults(defineProps<Props>(), {
    value: undefined,
    kind: 'helper'
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
    :data-kind="kind"
    :class="attrs.class"
    class="inline-flex items-center text-label-sm data-[kind=helper]:text-[var(--text-muted)] data-[kind=disabled]:text-[var(--text-muted)] data-[kind=invalid]:text-[var(--danger-contrast)] data-[kind=required]:text-[var(--warning-contrast)] data-[kind=disabled]:gap-[var(--spacing-xxs)]"
  >
    <i
      v-if="kind === 'disabled'"
      class="pi pi-lock flex shrink-0 items-center"
      aria-hidden="true"
      :data-testid="`${testId}__icon`"
    />
    <span :data-testid="`${testId}__text`">
      <slot v-if="$slots['default']" />
      <template v-else-if="value">{{ value }}</template>
    </span>
  </p>
</template>
