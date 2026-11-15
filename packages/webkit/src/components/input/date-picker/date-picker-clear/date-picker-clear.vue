<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { DatePickerInjectionKey } from '../injection-key'

  defineOptions({
    name: 'DatePickerClear',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DatePickerInjectionKey, null)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'date-picker-clear'
  )

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
    class="text-body-sm inline-flex items-center justify-center whitespace-nowrap rounded-(--shape-control) px-(--spacing-xs) py-(--spacing-2xs) text-(--text-default) transition-colors duration-150 ease-out hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface-raised) data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled) motion-reduce:transition-none"
    @click="onClick"
  >
    <slot />
  </button>
</template>
