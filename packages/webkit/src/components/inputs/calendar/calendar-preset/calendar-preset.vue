<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { CalendarInjectionKey, type CalendarRange } from '../injection-key'

  defineOptions({
    name: 'CalendarPreset',
    inheritAttrs: false
  })

  const props = defineProps<{
    /** Date (single mode) or range applied to the calendar selection when clicked. */
    value: Date | CalendarRange
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(CalendarInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__preset` : 'input-calendar__preset')
  )

  const disabled = computed<boolean>(() => ctx?.disabled.value ?? false)

  const sameDay = (a: Date | null | undefined, b: Date | null | undefined): boolean => {
    if (!a || !b) {
      return false
    }

    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    )
  }

  // Context-aware: reflects a selected state when its value matches the draft selection.
  const selected = computed<boolean>(() => {
    const current = ctx?.draft.value ?? null
    const target = props.value

    if (target instanceof Date) {
      return current instanceof Date && sameDay(current, target)
    }

    if (current && !(current instanceof Date)) {
      return sameDay(current.start, target.start) && sameDay(current.end, target.end)
    }

    return false
  })

  const onClick = () => {
    if (disabled.value) {
      return
    }

    ctx?.selectValue(props.value)
  }
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    :disabled="disabled"
    :data-testid="testId"
    :data-selected="selected || null"
    :data-disabled="disabled || null"
    class="text-body-sm inline-flex w-full items-center whitespace-nowrap rounded-[var(--shape-elements)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-left text-[var(--text-default)] transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface-raised)] data-[selected]:bg-[var(--secondary-selected)] data-[selected]:text-[var(--secondary-contrast)] data-[disabled]:cursor-not-allowed data-[disabled]:text-[var(--text-disabled)] motion-reduce:transition-none"
    @click="onClick"
  >
    <slot />
  </button>
</template>
