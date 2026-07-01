<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  defineOptions({ name: 'InputGroup', inheritAttrs: false })

  export interface Props {
    /** Renders the error border and sets aria-invalid on the root. */
    invalid?: boolean
    /** Renders the required (warning) border and sets aria-required on the root. */
    required?: boolean
    /** Renders the disabled visual (muted fill, not-allowed cursor, no focus ring) and sets aria-disabled on the root. Does not propagate to the middle input — the consumer must set the input disabled attribute themselves. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    invalid: false,
    required: false,
    disabled: false
  })

  defineSlots<{
    left(): unknown
    default(): unknown
    right(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-group')
  const hasLeft = computed(() => Boolean(slots['left']))
  const hasRight = computed(() => Boolean(slots['right']))
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :data-testid="testId"
    :data-invalid="props.invalid || null"
    :data-required="props.required || null"
    :data-disabled="props.disabled || null"
    :aria-invalid="props.invalid ? 'true' : undefined"
    :aria-required="props.required ? 'true' : undefined"
    :aria-disabled="props.disabled ? 'true' : undefined"
    class="relative inline-flex items-center w-full h-8 overflow-hidden rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)] transition-colors duration-150 ease-out motion-reduce:transition-none [&:not(:focus-within):not([data-invalid]):not([data-required]):not([data-disabled])]:hover:border-[var(--border-strong)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ring-color)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-canvas)] data-[invalid]:border-[var(--danger-border)] data-[required]:border-[var(--warning-border)] data-[disabled]:bg-[var(--bg-disabled)] data-[disabled]:text-[var(--text-disabled)] data-[disabled]:cursor-not-allowed data-[disabled]:focus-within:ring-0 data-[disabled]:focus-within:ring-offset-0"
  >
    <div
      v-if="hasLeft"
      data-testid="input-group-slot-left"
      class="flex items-center self-stretch shrink-0 bg-[var(--bg-canvas)] px-[var(--spacing-md)] text-label-sm text-[color:var(--text-muted)] border-r border-[color:var(--border-default)]"
    >
      <slot name="left" />
    </div>
    <slot />
    <div
      v-if="hasRight"
      data-testid="input-group-slot-right"
      class="flex items-center self-stretch shrink-0 bg-[var(--bg-canvas)] px-[var(--spacing-md)] text-label-sm text-[color:var(--text-muted)] border-l border-[color:var(--border-default)]"
    >
      <slot name="right" />
    </div>
  </div>
</template>
