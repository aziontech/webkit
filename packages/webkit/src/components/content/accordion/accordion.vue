<script setup lang="ts">
  import { computed, onBeforeUnmount, provide, shallowRef, useAttrs, useId } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { cn } from '../../../utils/cn'
  import {
    type AccordionArrowPosition,
    AccordionInjectionKey,
    type AccordionItemRegistration,
    type AccordionSize,
    type AccordionType,
    type AccordionValue
  } from './injection-key'

  defineOptions({
    name: 'Accordion',
    inheritAttrs: false
  })

  interface Props {
    /** Whether one or multiple items can be open at the same time. */
    type?: AccordionType
    /** Controlled open item(s): a single value string in single mode, an array of values in multiple mode. Use with `v-model:value`. */
    value?: AccordionValue
    /** Initial open item(s) when uncontrolled. */
    defaultValue?: AccordionValue
    /** In single mode, lets the open item collapse so that no item is open. */
    collapsible?: boolean
    /** Size token; affects header height, padding, and typography. Provided to every item via context. */
    size?: AccordionSize
    /** Side of the header the chevron sits on. Provided to every item via context. */
    arrowPosition?: AccordionArrowPosition
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'single',
    value: undefined,
    defaultValue: null,
    collapsible: true,
    size: 'medium',
    arrowPosition: 'right'
  })

  const emit = defineEmits<{
    'update:value': [value: AccordionValue]
    'value-change': [value: AccordionValue]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const valueModel = defineModel<AccordionValue>('value', { default: undefined })

  const attrs = useAttrs()
  const baseId = useId()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-accordion')

  const valueProp = computed(() => valueModel.value ?? props.value)

  const openValue = useControllable<AccordionValue>({
    prop: valueProp,
    defaultProp: props.defaultValue,
    onChange: (next) => {
      valueModel.value = next
      emit('update:value', next)
      emit('value-change', next)
    }
  })

  const isOpen = (value: string): boolean => {
    const current = openValue.value
    if (Array.isArray(current)) return current.includes(value)
    return current === value
  }

  const toggle = (value: string) => {
    if (props.type === 'multiple') {
      const current = Array.isArray(openValue.value) ? [...openValue.value] : []
      const index = current.indexOf(value)
      if (index === -1) current.push(value)
      else current.splice(index, 1)
      openValue.set(current)
      return
    }

    if (openValue.value === value) {
      if (props.collapsible) openValue.set(null)
      return
    }
    openValue.set(value)
  }

  const items = shallowRef<AccordionItemRegistration[]>([])

  const register = (registration: AccordionItemRegistration) => {
    const existing = items.value.filter((item) => item.value !== registration.value)
    items.value = [...existing, registration]
  }

  const unregister = (value: string) => {
    items.value = items.value.filter((item) => item.value !== value)
  }

  const getEnabled = () => items.value.filter((item) => !item.disabled)

  const focusTrigger = (item: AccordionItemRegistration | undefined) => {
    const trigger = item?.el.value?.querySelector<globalThis.HTMLButtonElement>('button')
    trigger?.focus()
  }

  const focusSibling = (value: string, direction: 1 | -1) => {
    const enabled = getEnabled()
    if (!enabled.length) return
    const currentIndex = enabled.findIndex((item) => item.value === value)
    const startIndex = currentIndex === -1 ? 0 : currentIndex
    const nextIndex = (startIndex + direction + enabled.length) % enabled.length
    focusTrigger(enabled[nextIndex])
  }

  const focusEdge = (edge: 'first' | 'last') => {
    const enabled = getEnabled()
    if (!enabled.length) return
    focusTrigger(edge === 'first' ? enabled[0] : enabled[enabled.length - 1])
  }

  const triggerId = (value: string) => `${baseId}-trigger-${value}`
  const contentId = (value: string) => `${baseId}-content-${value}`

  provide(AccordionInjectionKey, {
    value: computed(() => openValue.value),
    toggle,
    isOpen,
    type: computed(() => props.type),
    collapsible: computed(() => props.collapsible),
    size: computed(() => props.size),
    arrowPosition: computed(() => props.arrowPosition),
    register,
    unregister,
    focusSibling,
    focusEdge,
    triggerId,
    contentId
  })

  onBeforeUnmount(() => {
    items.value = []
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    data-orientation="vertical"
    :data-type="type"
    :data-size="size"
    :data-arrow="arrowPosition"
    :class="cn('flex w-full flex-col', attrs.class as string | undefined)"
  >
    <slot />
  </div>
</template>
