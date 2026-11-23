import { defineComponent, h, type PropType, type VNodeChild } from 'vue'

import { useTranslate } from '../../../composables/use-translate'
import * as en from '../../../locales/en'
import Citation from '../citation/citation.vue'
import type { SourcesItem } from '../sources/types'
import { sourceAnchor } from '../sources/types'
import type { MarkdownInline as MarkdownInlineNode } from './parse-markdown'

const EXTERNAL = /^https?:/i

const CODE_CLASS =
  'rounded-(--shape-control) bg-(--bg-surface-raised) px-1 py-px text-label-code-sm text-(--text-default)'
const EXTERNAL_ICON_CLASS =
  'az az-external-link ms-0.5 inline-block text-body-xs leading-none no-underline'
const LINK_CLASS =
  'text-(--text-link) underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)'

type ContainerNode = Extract<MarkdownInlineNode, { children: MarkdownInlineNode[] }>
type LeafNode = Exclude<MarkdownInlineNode, ContainerNode>

interface RenderContext {
  sources: SourcesItem[]
  anchor: string
  newTab: string
}

function renderLink(href: string, children: VNodeChild[], newTab: string): VNodeChild {
  if (!EXTERNAL.test(href)) return h('a', { href, class: LINK_CLASS }, children)
  return h('a', { href, target: '_blank', rel: 'noopener noreferrer', class: LINK_CLASS }, [
    ...children,
    ' ',
    h('span', { class: 'sr-only' }, newTab),
    h('i', { class: EXTERNAL_ICON_CLASS, 'aria-hidden': 'true' })
  ])
}

function renderContainer(node: ContainerNode, context: RenderContext): VNodeChild {
  const children = renderNodes(node.children, context)
  switch (node.type) {
    case 'strong':
      return h('strong', { class: 'font-semibold' }, children)
    case 'em':
      return h('em', children)
    case 'link':
      return renderLink(node.href, children, context.newTab)
  }
}

function renderLeaf(node: LeafNode, { sources, anchor }: RenderContext): VNodeChild {
  switch (node.type) {
    case 'text':
      return node.value
    case 'break':
      return h('br')
    case 'code':
      return h('code', { dir: 'ltr', class: CODE_CLASS }, node.value)
    case 'citation': {
      const source = sources[node.index - 1]
      return h(Citation, {
        index: node.index,
        title: source?.title ?? '',
        href: anchor && source ? `#${sourceAnchor(anchor, node.index)}` : ''
      })
    }
  }
}

function renderNodes(nodes: MarkdownInlineNode[], context: RenderContext): VNodeChild[] {
  return nodes.map((node) =>
    'children' in node ? renderContainer(node, context) : renderLeaf(node, context)
  )
}

export default defineComponent({
  name: 'MarkdownInline',
  props: {
    nodes: { type: Array as PropType<MarkdownInlineNode[]>, required: true },
    sources: { type: Array as PropType<SourcesItem[]>, default: () => [] },
    anchor: { type: String, default: '' }
  },
  setup(props) {
    const { t } = useTranslate({ common: en.common })
    return () =>
      renderNodes(props.nodes, {
        sources: props.sources,
        anchor: props.anchor,
        newTab: t('common.newTab')
      })
  }
})
