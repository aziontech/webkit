<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { InputGroupContextKey } from './injection-key'

  defineOptions({ name: 'InputGroup', inheritAttrs: false })

  export interface Props {
    /** Renders the error border. When `required` is also `true`, the border uses the warning color instead of danger. Also sets `aria-invalid="true"` on the root. */
    invalid?: boolean
    /** Semantic marker for a required field. Combined with `invalid=true`, switches the border color to warning. Sets `aria-required="true"` on the root. */
    required?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    invalid: false,
    required: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-group')

  provide(InputGroupContextKey, true)
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :data-testid="testId"
    :data-invalid="props.invalid || null"
    :data-required="props.required || null"
    :aria-invalid="props.invalid ? 'true' : undefined"
    :aria-required="props.required ? 'true' : undefined"
    class="relative inline-flex items-center w-full h-8 overflow-hidden rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)] transition-colors duration-150 ease-out motion-reduce:transition-none [&:not(:focus-within):not([data-invalid]):not([data-required])]:hover:border-[var(--border-strong)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ring-color)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-canvas)] data-[invalid]:border-[var(--danger-border)] data-[required]:border-[var(--warning-border)]"
  >
    <slot />
  </div>
</template>
