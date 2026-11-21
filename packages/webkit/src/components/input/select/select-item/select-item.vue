<script setup lang="ts">
  import { computed, h, inject, useAttrs } from 'vue'

  import { SelectInjectionKey } from '../injection-key'
  import SelectItemRow from '../parts/select-item-row.vue'

  defineOptions({
    name: 'SelectItem',
    inheritAttrs: false
  })

  export interface SelectItemProps {
    /** Stable value that identifies this option in the selection. */
    value: unknown
    /** Azion icon class for the leading decorative icon. */
    icon?: string
    /** Disables this single option; does not affect the parent select. */
    disabled?: boolean
  }
  const props = withDefaults(defineProps<SelectItemProps>(), {
    icon: '',
    disabled: false
  })

  const slots = defineSlots<{
    default(): unknown
    leading(): unknown
    tag(): unknown
  }>()

  const ctx = inject(SelectInjectionKey)
  if (!ctx) {
    throw new Error('SelectItem must be used inside <Select>.')
  }

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'select-item')

  const row = () => h(SelectItemRow, { ...attrs, ...props, ctx, testId: testId.value }, slots)
</script>

<template>
  <component :is="row()" />
</template>
