<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { FlowInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FlowNode',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Marks the step as disabled; adjacent connectors render at reduced opacity. */
      disabled?: boolean
      /** Drops the default node box so the slot content defines the node's appearance. */
      unstyled?: boolean
    }>(),
    {
      disabled: false,
      unstyled: false
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
      'relative z-[1] text-label-md text-[var(--text-default)] data-[styled]:inline-flex data-[styled]:min-h-10 data-[styled]:items-center data-[styled]:justify-center data-[styled]:whitespace-nowrap data-[styled]:rounded-[var(--shape-button)] data-[styled]:border data-[styled]:border-[var(--border-default)] data-[styled]:bg-[var(--bg-surface-raised)] data-[styled]:px-[var(--spacing-md)] data-[styled]:py-[var(--spacing-sm)] data-[disabled]:text-[var(--text-disabled)] data-[disabled]:opacity-60',
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
    :data-styled="props.unstyled ? null : ''"
    :aria-disabled="disabled || undefined"
    :data-testid="testId"
    :class="rootClasses"
  >
    <slot />
  </div>
</template>
