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

  const onEnter = (el: globalThis.Element, done: () => void) => {
    const node = el as globalThis.HTMLElement
    if (prefersReducedMotion()) {
      done()
      return
    }
    const target = node.scrollHeight
    node.style.height = '0px'
    node.style.transition = 'height 150ms ease-out'
    void node.offsetHeight
    node.style.height = `${target}px`
    const finish = () => {
      node.style.height = ''
      node.style.transition = ''
      done()
    }
    node.addEventListener('transitionend', finish, { once: true })
  }

  const onLeave = (el: globalThis.Element, done: () => void) => {
    const node = el as globalThis.HTMLElement
    if (prefersReducedMotion()) {
      done()
      return
    }
    node.style.height = `${node.scrollHeight}px`
    node.style.transition = 'height 150ms ease-out'
    void node.offsetHeight
    node.style.height = '0px'
    const finish = () => {
      node.style.transition = ''
      done()
    }
    node.addEventListener('transitionend', finish, { once: true })
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
      class="overflow-hidden text-[var(--text-muted)] data-[size=medium]:text-body-xs data-[size=large]:text-body-sm"
    >
      <slot />
    </div>
  </Transition>
</template>
