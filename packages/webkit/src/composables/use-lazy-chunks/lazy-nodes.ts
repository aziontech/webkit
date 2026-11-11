import {
  Comment,
  defineComponent,
  Fragment,
  h,
  isVNode,
  type VNode,
  type VNodeArrayChildren
} from 'vue'

import { useLazyChunks } from './index'

function flatten(children: VNodeArrayChildren, out: VNode[] = []): VNode[] {
  for (const child of children) {
    if (Array.isArray(child)) flatten(child, out)
    else if (isVNode(child) && child.type !== Comment) {
      if (child.type === Fragment && Array.isArray(child.children)) {
        flatten(child.children as VNodeArrayChildren, out)
      } else out.push(child)
    }
  }
  return out
}

export default defineComponent({
  name: 'LazyNodes',
  props: {
    rowHeight: { type: Number, required: true },
    threshold: { type: Number, default: 300 },
    chunkSize: { type: Number, default: 100 }
  },
  setup(props, { slots, expose }) {
    const { split, observe, revealAll } = useLazyChunks({
      rowHeight: props.rowHeight,
      threshold: props.threshold,
      chunkSize: props.chunkSize
    })
    let chunked = false
    expose({ revealAll, hasHidden: () => chunked })
    return () => {
      const chunks = split(flatten(slots['default']?.() ?? []))
      chunked = chunks.some((chunk) => !chunk.mounted)
      return chunks.flatMap((chunk) =>
        chunk.mounted
          ? chunk.items
          : [
              h('div', {
                key: `lazy-chunk-${chunk.index}`,
                ref: (el: unknown) => observe(el, chunk.index),
                'data-chunk': chunk.index,
                'aria-hidden': 'true',
                style: { height: `${chunk.estimatedHeight}px`, flexShrink: 0 }
              })
            ]
      )
    }
  }
})
