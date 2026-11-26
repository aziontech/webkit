<script setup lang="ts">
  import { computed, h, inject, useAttrs } from 'vue'

  import { SelectInjectionKey } from '../injection-key'
  import SelectTriggerButton from '../parts/select-trigger-button.vue'

  defineOptions({
    name: 'SelectTrigger',
    inheritAttrs: false
  })

  export interface SelectTriggerProps {
    /**
     * Base direction of the shown value, isolated from the trigger's own direction. Omitted, it follows
     * the value's first strong character (`<bdi>`); pass `ltr` for values such as dial codes (`+1`) that
     * have none.
     */
    valueDir?: 'ltr' | 'rtl' | 'auto'
  }
  const props = defineProps<SelectTriggerProps>()

  const slots = defineSlots<{
    /** Leading adornment before the value (an icon, a flag). */
    leading(): unknown
    /** Trailing adornment after the value, before the chevron (a dial code, a count). It never shrinks. */
    trailing(): unknown
  }>()

  const ctx = inject(SelectInjectionKey)
  if (!ctx) {
    throw new Error('SelectTrigger must be used inside <Select>.')
  }

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'select-trigger')

  const GHOST_CLASS =
    'data-[variant=ghost]:w-auto data-[variant=ghost]:max-w-full data-[variant=ghost]:gap-(--spacing-2xs) data-[variant=ghost]:border-0 data-[variant=ghost]:bg-transparent ' +
    'data-[variant=ghost]:px-(--spacing-xs) data-[variant=ghost]:text-label-md data-[variant=ghost]:focus-visible:ring-offset-0 data-[variant=ghost]:hover:bg-(--bg-mask) ' +
    'data-[variant=ghost]:data-[state=open]:bg-(--bg-mask) data-[variant=ghost]:data-[disabled]:bg-transparent data-[variant=ghost]:data-[disabled]:hover:bg-transparent'

  const trigger = () =>
    h(
      SelectTriggerButton,
      {
        ...attrs,
        ...props,
        ctx,
        testId: testId.value,
        isolated: true,
        'data-variant': ctx.variant.value,
        class: [GHOST_CLASS, attrs.class]
      },
      slots
    )
</script>

<template>
  <component :is="trigger()" />
</template>
