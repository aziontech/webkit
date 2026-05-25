import { defineComponent, h } from 'vue'

import { cn } from '../../../utils/cn'
import { mergeAsChildSlot } from './merge-as-child'

export default defineComponent({
  name: 'ItemRoot',
  inheritAttrs: false,
  props: {
    asChild: {
      type: Boolean,
      default: false
    },
    as: {
      type: String,
      default: 'div'
    }
  },
  setup(props, { attrs, slots }) {
    return () => {
      const defaultSlot = slots.default?.()
      const mergedAttrs = {
        ...attrs,
        class: cn(attrs.class as string | undefined)
      }

      if (!props.asChild) {
        return h(props.as, mergedAttrs, defaultSlot)
      }

      return mergeAsChildSlot(mergedAttrs, () => defaultSlot ?? [])
    }
  }
})
