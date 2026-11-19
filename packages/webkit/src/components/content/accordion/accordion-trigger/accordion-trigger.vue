<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { AccordionInjectionKey, AccordionItemInjectionKey } from '../injection-key'

  defineOptions({
    name: 'AccordionTrigger',
    inheritAttrs: false
  })

  export interface AccordionTriggerProps {
    /** Heading level of the wrapping heading element for correct document outline. */
    headingLevel?: 2 | 3 | 4 | 5 | 6
  }

  const props = withDefaults(defineProps<AccordionTriggerProps>(), {
    headingLevel: 3
  })

  defineSlots<{
    default(): unknown
  }>()

  const ctx = inject(AccordionInjectionKey)
  if (!ctx) {
    throw new Error('AccordionTrigger must be used inside <Accordion>.')
  }

  const itemCtx = inject(AccordionItemInjectionKey)
  if (!itemCtx) {
    throw new Error('AccordionTrigger must be used inside <Accordion.Item>.')
  }

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'accordion-trigger')

  const headingTag = computed(() => `h${props.headingLevel}` as const)

  const onClick = () => {
    if (itemCtx.disabled.value) return
    ctx.toggle(itemCtx.value)
  }

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        if (itemCtx.disabled.value) return
        event.preventDefault()
        ctx.toggle(itemCtx.value)
        break
      case 'ArrowDown':
        event.preventDefault()
        ctx.focusSibling(itemCtx.value, 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        ctx.focusSibling(itemCtx.value, -1)
        break
      case 'Home':
        event.preventDefault()
        ctx.focusEdge('first')
        break
      case 'End':
        event.preventDefault()
        ctx.focusEdge('last')
        break
      default:
    }
  }
</script>

<template>
  <component
    :is="headingTag"
    class="flex"
  >
    <button
      v-bind="$attrs"
      type="button"
      :id="itemCtx.triggerId.value"
      :aria-expanded="itemCtx.open.value"
      :aria-controls="itemCtx.contentId.value"
      :aria-disabled="itemCtx.disabled.value || undefined"
      :disabled="itemCtx.disabled.value"
      :data-testid="testId"
      :data-state="itemCtx.open.value ? 'open' : 'closed'"
      :data-size="ctx.size.value"
      :data-icon-position="ctx.iconPosition.value"
      :data-disabled="itemCtx.disabled.value || null"
      :class="attrs.class"
      class="group flex w-full items-center justify-between bg-transparent px-[var(--accordion-inset,var(--spacing-md))] text-start text-(--text-default) outline-none transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) gap-(--spacing-sm) data-[size=medium]:min-h-8 pointer-coarse:min-h-11 data-[size=medium]:text-body-sm data-[size=large]:min-h-10 data-[size=large]:text-body-md data-[icon-position=leading]:flex-row-reverse data-[icon-position=leading]:justify-end data-[icon-position=leading]:gap-(--spacing-xs) data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled)"
      @click="onClick"
      @keydown="onKeydown"
    >
      <span
        class="min-w-0 flex-1 data-[icon-position=leading]:flex-none group-data-[icon-position=leading]:flex-none"
      >
        <slot />
      </span>
      <i
        class="az az-chevron-down w-[1em] shrink-0 text-center text-(--text-muted) transition-transform duration-150 ease-out motion-reduce:transition-none group-data-[state=open]:rotate-180 group-data-[disabled]:text-(--text-disabled)"
        aria-hidden="true"
        :data-testid="`${testId}__chevron`"
      />
    </button>
  </component>
</template>
