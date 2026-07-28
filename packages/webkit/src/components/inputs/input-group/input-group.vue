<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'InputGroup', inheritAttrs: false })

  export type InputGroupSize = 'small' | 'medium' | 'large'

  export interface Props {
    /** Size token; affects the root's height and inner addon padding. Heights: small=28px, medium=32px, large=40px. Matches the sibling input primitives — set the same size on child controls to keep them visually aligned. */
    size?: InputGroupSize
    /** Renders the error border and sets aria-invalid on the root. */
    invalid?: boolean
    /** Renders the required (warning) border and sets aria-required on the root. */
    required?: boolean
    /** Renders the disabled visual (muted fill, not-allowed cursor, no focus ring) and sets aria-disabled on the root. Does not propagate to child controls — each child is responsible for its own disabled attribute. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 'medium',
    invalid: false,
    required: false,
    disabled: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-group')
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :data-testid="testId"
    :data-size="props.size"
    :data-invalid="props.invalid || null"
    :data-required="props.required || null"
    :data-disabled="props.disabled || null"
    :aria-invalid="props.invalid ? 'true' : undefined"
    :aria-required="props.required ? 'true' : undefined"
    :aria-disabled="props.disabled ? 'true' : undefined"
    class="relative inline-flex items-center w-full overflow-hidden rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)] transition-colors duration-150 ease-out motion-reduce:transition-none data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 [&:not(:focus-within):not([data-invalid]):not([data-required]):not([data-disabled])]:hover:border-[var(--border-strong)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ring-color)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-canvas)] data-[invalid]:border-[var(--danger-border)] data-[required]:border-[var(--warning-border)] data-[disabled]:bg-[var(--bg-disabled)] data-[disabled]:text-[var(--text-disabled)] data-[disabled]:cursor-not-allowed data-[disabled]:focus-within:ring-0 data-[disabled]:focus-within:ring-offset-0 [&_*]:focus-visible:!ring-0 [&_*]:focus-visible:!ring-offset-0 [&_*]:focus-within:!ring-0 [&_*]:focus-within:!ring-offset-0 [&_input]:!outline-none [&_button]:!border-transparent [&_button]:!rounded-none [&_a]:!border-transparent [&_a]:!rounded-none [&_[role=combobox]]:!border-transparent [&_[role=combobox]]:!rounded-none [&_[data-mode]]:!w-auto [&>*:not(:last-child)]:!border-r [&>*:not(:last-child)]:!border-r-[color:var(--border-default)] [&>*:first-child]:rounded-l-[var(--shape-elements)] [&>*:not(:first-child)]:rounded-l-none [&>*:last-child]:rounded-r-[var(--shape-elements)] [&>*:not(:last-child)]:rounded-r-none"
  >
    <slot />
  </div>
</template>
