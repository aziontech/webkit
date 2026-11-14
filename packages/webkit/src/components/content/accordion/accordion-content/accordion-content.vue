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

  const cancels = new WeakMap<globalThis.HTMLElement, () => void>()

  const prefersReducedMotion = () =>
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

  const seconds = (list: string) => list.split(',').map((d) => parseFloat(d) || 0)

  const transitionMs = (node: globalThis.HTMLElement) => {
    const style = globalThis.getComputedStyle(node)
    const durations = seconds(style.transitionDuration)
    const delays = seconds(style.transitionDelay)
    return Math.max(0, ...durations.map((d, i) => d + (delays[i % delays.length] ?? 0))) * 1000
  }

  const animateHeight = (
    node: globalThis.HTMLElement,
    from: number,
    to: number,
    done: () => void
  ) => {
    cancels.get(node)?.()
    const duration = prefersReducedMotion() || from === to ? 0 : transitionMs(node)
    if (duration <= 0) {
      node.style.height = ''
      done()
      return
    }
    node.style.height = `${from}px`
    void node.offsetHeight
    node.style.height = `${to}px`
    const onEnd = (event: globalThis.TransitionEvent) => {
      if (event.target === node && event.propertyName === 'height') finish()
    }
    const timer = setTimeout(() => finish(), duration + 50)
    const stop = () => {
      clearTimeout(timer)
      node.removeEventListener('transitionend', onEnd)
      cancels.delete(node)
    }
    const finish = () => {
      stop()
      node.style.height = ''
      done()
    }
    cancels.set(node, stop)
    node.addEventListener('transitionend', onEnd)
  }

  const onEnter = (el: globalThis.Element, done: () => void) => {
    const node = el as globalThis.HTMLElement
    animateHeight(node, 0, node.scrollHeight, done)
  }

  const onLeave = (el: globalThis.Element, done: () => void) => {
    const node = el as globalThis.HTMLElement
    animateHeight(node, node.scrollHeight, 0, done)
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
