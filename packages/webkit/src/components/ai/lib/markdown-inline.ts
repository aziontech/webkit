import { defineComponent, h, type PropType, type VNodeChild } from 'vue'

import Citation from '../citation/citation.vue'
import type { AiSource } from '../sources/types'
import { sourceAnchor } from '../sources/types'
import type { MarkdownInline as MarkdownInlineNode } from './parse-markdown'

const EXTERNAL = /^https?:/i

function renderNodes(
  nodes: MarkdownInlineNode[],
  sources: AiSource[],
  anchor: string
): VNodeChild[] {
  return nodes.map((node) => {
    switch (node.type) {
      case 'text':
        return node.value
      case 'break':
        return h('br')
      case 'strong':
        return h('strong', { class: 'font-semibold' }, renderNodes(node.children, sources, anchor))
      case 'em':
        return h('em', renderNodes(node.children, sources, anchor))
      case 'code':
        return h(
          'code',
          {
            dir: 'ltr',
            class:
              'rounded-(--shape-elements) bg-(--bg-surface-raised) px-1 py-px text-label-code text-(--text-default)'
          },
          node.value
        )
      case 'link':
        return h(
          'a',
          {
            href: node.href,
            target: EXTERNAL.test(node.href) ? '_blank' : undefined,
            rel: EXTERNAL.test(node.href) ? 'noopener noreferrer' : undefined,
            class:
              'text-(--text-link) underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)'
          },
          renderNodes(node.children, sources, anchor)
        )
      case 'citation': {
        const source = sources[node.index - 1]
        return h(Citation, {
          index: node.index,
          title: source?.title ?? '',
          href: anchor && source ? `#${sourceAnchor(anchor, node.index)}` : ''
        })
      }
    }
  })
}

export default defineComponent({
  name: 'MarkdownInline',
  props: {
    nodes: { type: Array as PropType<MarkdownInlineNode[]>, required: true },
    sources: { type: Array as PropType<AiSource[]>, default: () => [] },
    anchor: { type: String, default: '' }
  },
  setup(props) {
    return () => renderNodes(props.nodes, props.sources, props.anchor)
  }
})
