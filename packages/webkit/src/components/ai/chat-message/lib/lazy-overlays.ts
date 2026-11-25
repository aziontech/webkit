import { defineAsyncComponent, defineComponent, h } from 'vue'

import IconButton from '../../../action/icon-button/icon-button.vue'

const TooltipTrigger = defineComponent({
  inheritAttrs: false,
  setup:
    (_props, { slots }) =>
    () =>
      h('span', { class: 'inline-flex w-fit shrink-0' }, slots['default']?.())
})

const CopyButtonFace = defineComponent({
  props: {
    value: { type: String, default: '' },
    ariaLabel: { type: String, default: '' },
    size: { type: String, default: '' }
  },
  setup: (props) => () =>
    h('span', { class: 'relative inline-flex' }, [
      h(IconButton, {
        icon: 'az az-copy',
        ariaLabel: props.ariaLabel,
        variant: 'ghost',
        size: 'medium',
        disabled: true
      })
    ])
})

export const LazyTooltip = defineAsyncComponent({
  loader: () => import('../../../overlay/tooltip/tooltip.vue'),
  loadingComponent: TooltipTrigger,
  delay: 0
})

export const LazyCopyButton = defineAsyncComponent({
  loader: () => import('../../../action/copy-button/copy-button.vue'),
  loadingComponent: CopyButtonFace,
  delay: 0
})
