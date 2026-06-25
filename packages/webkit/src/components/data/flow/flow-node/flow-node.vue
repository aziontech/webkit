<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { FlowInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FlowNode',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Marks the step as disabled; adjacent connectors render at reduced opacity. */
      disabled?: boolean
    }>(),
    {
      disabled: false
    }
  )

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(FlowInjectionKey)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'data-flow'}__node`
  )

  const rootClasses = computed(() =>
    cn(
      'relative z-[1] inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-[var(--shape-button)] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-label-md text-[var(--text-default)] data-[disabled]:text-[var(--text-disabled)] data-[disabled]:opacity-60',
      attrs.class as string | undefined
    )
  )
</script>

<template>
  <div
    role="listitem"
    data-flow-kind="node"
    :data-flow-disabled="disabled ? 'true' : null"
    :data-disabled="disabled || null"
    :aria-disabled="disabled || undefined"
    :data-testid="testId"
    :class="rootClasses"
  >
    <slot />
  </div>
</template>
