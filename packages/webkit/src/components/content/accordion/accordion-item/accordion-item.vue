<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, onMounted, provide, ref, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { AccordionInjectionKey, AccordionItemInjectionKey } from '../injection-key'

  defineOptions({
    name: 'AccordionItem',
    inheritAttrs: false
  })

  interface Props {
    /** Unique identifier used by the open-state model. */
    value: string
    /** Prevents this item from toggling. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const ctx = inject(AccordionInjectionKey)
  if (!ctx) {
    throw new Error('AccordionItem must be used inside <Accordion>.')
  }

  const attrs = useAttrs()
  const root = ref<globalThis.HTMLElement | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-accordion-item'
  )

  const open = computed(() => ctx.isOpen(props.value))
  const disabled = computed(() => props.disabled)
  const triggerId = computed(() => ctx.triggerId(props.value))
  const contentId = computed(() => ctx.contentId(props.value))

  provide(AccordionItemInjectionKey, {
    value: props.value,
    disabled,
    open,
    triggerId,
    contentId
  })

  onMounted(() => {
    ctx.register({ value: props.value, disabled: props.disabled, el: root })
  })

  onBeforeUnmount(() => {
    ctx.unregister(props.value)
  })
</script>

<template>
  <div
    ref="root"
    v-bind="$attrs"
    :data-testid="testId"
    :data-state="open ? 'open' : 'closed'"
    :data-disabled="disabled || null"
    :class="
      cn(
        'flex flex-col border-b border-[var(--border-muted)] data-[state=open]:border-b-0',
        attrs.class as string | undefined
      )
    "
  >
    <slot />
  </div>
</template>
