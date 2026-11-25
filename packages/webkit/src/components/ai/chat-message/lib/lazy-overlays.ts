import { defineAsyncComponent, defineComponent, h } from 'vue'

import IconButton from '../../../action/icon-button/icon-button.vue'

export { LazyTooltip } from '../../../overlay/tooltip/lib/lazy-tooltip'

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

export const LazyCopyButton = defineAsyncComponent({
  loader: () => import('../../../action/copy-button/copy-button.vue'),
  loadingComponent: CopyButtonFace,
  delay: 0
})
