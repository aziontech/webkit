<script setup lang="ts">
  import type { DatePickerSize } from '../injection-key'

  defineOptions({
    name: 'DatePickerTrigger',
    inheritAttrs: false
  })

  interface DatePickerTriggerProps {
    /** Root data-testid; the button and its value derive their ids from it. */
    testId: string
    /** Size token of the trigger. */
    size?: DatePickerSize
    /** Disables the trigger. */
    disabled?: boolean
    /** Whether the popover is open. */
    open?: boolean
    /** Shows the value in the muted placeholder colour, for a trigger with no value. */
    showPlaceholder?: boolean
    /** Leading icon class. */
    icon?: string
    /** Shows the chevron that turns while the popover is open. */
    showChevron?: boolean
  }

  withDefaults(defineProps<DatePickerTriggerProps>(), {
    size: 'medium',
    disabled: false,
    open: false,
    showPlaceholder: false,
    icon: 'az az-calendar',
    showChevron: true
  })

  defineSlots<{
    default(): unknown
  }>()

  const TRIGGER_CLASS =
    'relative text-label-sm inline-flex min-w-0 flex-1 items-center gap-(--spacing-xs) px-(--spacing-sm) py-(--spacing-2xs) text-(--text-default) transition-colors duration-150 ease-out ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) disabled:cursor-not-allowed disabled:text-(--text-disabled) ' +
    'data-[empty]:text-(--text-muted) ' +
    'motion-reduce:transition-none'

  const CHEVRON_CLASS =
    'az az-chevron-down shrink-0 text-[length:inherit] leading-none text-(--text-muted) transition-transform duration-150 ease-out ' +
    'data-[state=open]:rotate-180 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    :disabled="disabled"
    :data-size="size"
    :data-empty="showPlaceholder || null"
    :data-testid="`${testId}__trigger`"
    aria-haspopup="dialog"
    :aria-expanded="open"
    :class="TRIGGER_CLASS"
  >
    <span
      aria-hidden="true"
      data-slot="touch-target"
      class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
    />
    <i
      :class="icon"
      class="shrink-0 text-[length:inherit] leading-none text-(--text-muted)"
      aria-hidden="true"
    />
    <span
      :data-testid="`${testId}__value`"
      class="min-w-0 flex-1 text-start tabular-nums [overflow-wrap:anywhere]"
      ><slot
    /></span>
    <i
      v-if="showChevron"
      :data-state="open ? 'open' : 'closed'"
      :class="CHEVRON_CLASS"
      aria-hidden="true"
    />
  </button>
</template>
