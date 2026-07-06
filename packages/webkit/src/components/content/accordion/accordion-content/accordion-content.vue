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
  <Transition
    enter-active-class="animate-accordion-expand motion-reduce:animate-none"
    leave-active-class="animate-accordion-collapse motion-reduce:animate-none"
  >
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
      class="grid grid-rows-[1fr] overflow-hidden text-[var(--text-muted)] data-[size=medium]:text-body-xs data-[size=large]:text-body-sm"
    >
      <div class="min-h-0">
        <slot />
      </div>
    </div>
  </Transition>
</template>
