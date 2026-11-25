import { computed, defineComponent, h, type PropType, ref } from 'vue'

import { defineClientLazy } from '../../../../utils/client-lazy'
import type { TooltipContentState } from '../parts/tooltip-content.vue'
import type { TooltipAlign, TooltipSide } from '../tooltip.vue'
import { TOOLTIP_TRIGGER_CLASS } from './trigger-class'

const LazyTooltipContent = defineClientLazy(() => import('../parts/tooltip-content.vue'), {
  render: () => null
})

export const LazyTooltip = defineComponent({
  name: 'LazyTooltip',
  inheritAttrs: false,
  props: {
    content: { type: String, required: true },
    side: { type: String as PropType<TooltipSide | 'auto'>, default: 'top' },
    align: { type: String as PropType<TooltipAlign>, default: 'center' },
    sideOffset: { type: Number, default: 8 },
    delay: { type: Number, default: 200 },
    disabled: { type: Boolean, default: false }
  },
  setup(props, { attrs, slots }) {
    const triggerEl = ref<HTMLElement | null>(null)
    const state = ref<TooltipContentState>({
      open: false,
      side: props.side === 'auto' ? 'top' : props.side,
      align: props.align
    })
    const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'tooltip')

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
        trigger: triggerEl.value,
        testId: testId.value,
        content: props.content,
        side: props.side,
        align: props.align,
        sideOffset: props.sideOffset,
        delay: props.delay,
        disabled: props.disabled,
        onState: (next: TooltipContentState) => {
          state.value = next
        }
      })
    ]
  }
})
