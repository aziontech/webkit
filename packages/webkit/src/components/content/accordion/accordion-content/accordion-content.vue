<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { AccordionInjectionKey, AccordionItemInjectionKey } from '../injection-key'

  defineOptions({
    name: 'AccordionContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const ctx = inject(AccordionInjectionKey)
  if (!ctx) {
    throw new Error('AccordionContent must be used inside <Accordion>.')
  }

  const itemCtx = inject(AccordionItemInjectionKey)
  if (!itemCtx) {
    throw new Error('AccordionContent must be used inside <Accordion.Item>.')
  }

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-accordion-content'
  )
</script>

<template>
  <div
    v-if="itemCtx.open.value"
    v-bind="$attrs"
    role="region"
    :id="itemCtx.contentId.value"
    :aria-labelledby="itemCtx.triggerId.value"
    :data-testid="testId"
    :data-state="itemCtx.open.value ? 'open' : 'closed'"
    :data-size="ctx.size.value"
    :class="attrs.class"
    class="animate-fade-in text-[var(--text-muted)] motion-reduce:animate-none data-[size=medium]:p-[var(--spacing-md)] data-[size=medium]:text-body-xs data-[size=large]:p-[var(--spacing-xl)] data-[size=large]:text-body-sm"
  >
    <slot />
  </div>
</template>
