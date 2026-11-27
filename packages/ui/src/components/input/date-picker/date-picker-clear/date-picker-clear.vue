<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import Button from '../../../action/button/button.vue'
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
  <Button
    v-bind="$attrs"
    variant="ghost"
    size="small"
    :disabled="disabled"
    :data-testid="testId"
    @click="onClick"
  >
    <slot />
  </Button>
</template>
