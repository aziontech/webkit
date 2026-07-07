<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { CalendarInjectionKey } from '../injection-key'

  defineOptions({
    name: 'CalendarClear',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(CalendarInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__clear` : 'input-calendar__clear')
  )

  // Context-aware: disabled while the calendar is disabled or nothing is selected.
  const disabled = computed<boolean>(
    () => (ctx?.disabled.value ?? false) || !(ctx?.hasSelection.value ?? false)
  )

  const onClick = () => {
    if (disabled.value) {
      return
    }

    ctx?.clear()
  }
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    :disabled="disabled"
    :data-testid="testId"
    :data-disabled="disabled || null"
    class="text-body-sm inline-flex items-center justify-center whitespace-nowrap rounded-[var(--shape-elements)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-[var(--text-default)] transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface-raised)] data-[disabled]:cursor-not-allowed data-[disabled]:text-[var(--text-disabled)] motion-reduce:transition-none"
    @click="onClick"
  >
    <slot />
  </button>
</template>
