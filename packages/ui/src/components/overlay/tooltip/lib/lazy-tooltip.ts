import { computed, defineComponent, h, ref } from 'vue'

import { defineClientLazy } from '../../../../utils/client-lazy'
import type { TooltipContentState } from '../parts/tooltip-content.vue'
import type { TooltipProps } from '../tooltip.vue'
import { TOOLTIP_TRIGGER_CLASS } from './trigger-class'

type LazyTooltipProps = Omit<TooltipProps, 'defaultOpen'>

const LazyTooltipContent = defineClientLazy(() => import('../parts/tooltip-content.vue'), {
  render: () => null
})

export const LazyTooltip = defineComponent(
  (props: LazyTooltipProps, { attrs, slots }) => {
    const triggerEl = ref<HTMLElement | null>(null)
    const getTrigger = () => triggerEl.value
    const side = computed(() => props.side ?? 'top')
    const align = computed(() => props.align ?? 'center')
    const state = ref<TooltipContentState>({
      open: false,
      side: side.value === 'auto' ? 'top' : side.value,
      align: align.value
    })
    const testId = computed(() => {
      const id = attrs['data-testid']
      return typeof id === 'string' ? id : 'tooltip'
    })

    return () => [
      h(
        'span',
        {
          ...attrs,
          ref: triggerEl,
          class: [TOOLTIP_TRIGGER_CLASS, attrs['class']],
          'data-testid': testId.value,
          'data-state': state.value.open ? 'open' : 'closed',
          'data-disabled': props.disabled || null,
          'data-side': state.value.side,
          'data-align': state.value.align
        },
        slots['default']?.()
      ),
      h(LazyTooltipContent, {
        trigger: getTrigger,
        testId: testId.value,
        content: props.content,
        side: side.value,
        align: align.value,
        sideOffset: props.sideOffset ?? 8,
        delay: props.delay ?? 200,
        disabled: props.disabled ?? false,
        onState: (next: TooltipContentState) => {
          state.value = next
        }
      })
    ]
  },
  {
    name: 'LazyTooltip',
    inheritAttrs: false,
    props: ['content', 'side', 'align', 'sideOffset', 'delay', 'disabled']
  }
)
