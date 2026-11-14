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

  const prefersReducedMotion = () =>
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

  const animates = (node: globalThis.HTMLElement) =>
    !prefersReducedMotion() &&
    globalThis
      .getComputedStyle(node)
      .transitionDuration.split(',')
      .some((d) => parseFloat(d) > 0)

  const settle = (node: globalThis.HTMLElement, from: string, to: string, done: () => void) => {
    node.style.height = from
    void node.offsetHeight
    if (!animates(node)) {
      node.style.height = ''
      done()
      return
    }
    node.addEventListener(
      'transitionend',
      () => {
        node.style.height = ''
        done()
      },
      { once: true }
    )
    node.style.height = to
  }

  const onEnter = (el: globalThis.Element, done: () => void) => {
    const node = el as globalThis.HTMLElement
    settle(node, '0', `${node.scrollHeight}px`, done)
  }

  const onLeave = (el: globalThis.Element, done: () => void) => {
    const node = el as globalThis.HTMLElement
    settle(node, `${node.scrollHeight}px`, '0', done)
  }
</script>

<template>
  <Transition
    :css="false"
    @enter="onEnter"
    @leave="onLeave"
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
      class="overflow-hidden transition-[height] duration-150 ease-out motion-reduce:transition-none text-(--text-muted) data-[size=medium]:text-body-xs data-[size=large]:text-body-sm"
    >
      <slot />
    </div>
  </Transition>
</template>
