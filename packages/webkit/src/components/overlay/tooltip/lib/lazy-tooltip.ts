import { defineAsyncComponent, defineComponent, h } from 'vue'

const TooltipTrigger = defineComponent({
  inheritAttrs: false,
  setup:
    (_props, { slots }) =>
    () =>
      h('span', { class: 'inline-flex w-fit shrink-0' }, slots['default']?.())
})

export const LazyTooltip = defineAsyncComponent({
  loader: () => import('../tooltip.vue'),
  loadingComponent: TooltipTrigger,
  delay: 0
})
