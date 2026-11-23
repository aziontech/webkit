import { type Component, defineComponent, h, type PropType, type VNodeChild } from 'vue'

import type { SourcesItem } from '../sources/types'
import type { MarkdownInline as MarkdownInlineNode } from './parse-markdown'

const EXTERNAL = /^https?:/i

const CODE_CLASS =
  'rounded-(--shape-control) bg-(--bg-surface-raised) px-1 py-px text-label-code-sm text-(--text-default)'
const LINK_CLASS =
  'text-(--text-link) underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)'

type ContainerNode = Extract<MarkdownInlineNode, { children: MarkdownInlineNode[] }>
type LeafNode = Exclude<MarkdownInlineNode, ContainerNode>

function renderContainer(
  node: ContainerNode,
  sources: SourcesItem[],
  citation?: Component
): VNodeChild {
  const children = renderNodes(node.children, sources, citation)
  switch (node.type) {
    case 'strong':
      return h('strong', { class: 'font-semibold' }, children)
    case 'em':
      return h('em', children)
    case 'link':
      return h(
        'a',
        {
          href: node.href,
          target: EXTERNAL.test(node.href) ? '_blank' : undefined,
          rel: EXTERNAL.test(node.href) ? 'noopener noreferrer' : undefined,
          class: LINK_CLASS
        },
        children
      )
  }
}

function renderLeaf(node: LeafNode, sources: SourcesItem[], citation?: Component): VNodeChild {
  switch (node.type) {
    case 'text':
      return node.value
    case 'break':
      return h('br')
    case 'code':
      return h('code', { dir: 'ltr', class: CODE_CLASS }, node.value)
    case 'citation':
      return citation
        ? h(citation, { indexes: node.indexes, sources })
        : `[${node.indexes.join('][')}]`
  }
}

const CLOSING = /^\s+(?=[.,;:!?)\]])/
const WORD_START = /^[\p{L}\p{N}]/u
const OPEN_END = /[\s([{"'“‘]$/

function citationSpacing(nodes: MarkdownInlineNode[]): MarkdownInlineNode[] {
  if (!nodes.some((node) => node.type === 'citation')) return nodes
  const out: MarkdownInlineNode[] = []
  nodes.forEach((node, index) => {
    const before = nodes[index - 1]
    const after = nodes[index + 1]
    if (node.type === 'citation') {
      if (before?.type === 'citation') out.push({ type: 'text', value: ' ' })
      out.push(node)
      return
    }
    if (node.type !== 'text') {
      out.push(node)
      return
    }
    let value = node.value
    if (before?.type === 'citation') {
      value = value.replace(CLOSING, '')
      if (WORD_START.test(value)) value = ` ${value}`
    }
    if (after?.type === 'citation' && !OPEN_END.test(value)) value = `${value} `
    out.push({ type: 'text', value })
  })
  return out
}

function renderNodes(
  nodes: MarkdownInlineNode[],
  sources: SourcesItem[],
  citation?: Component
): VNodeChild[] {
  return citationSpacing(nodes).map((node) =>
    'children' in node
      ? renderContainer(node, sources, citation)
      : renderLeaf(node, sources, citation)
  )
}

export function createMarkdownInline(citation?: Component) {
  return defineComponent({
    name: 'MarkdownInline',
    props: {
      nodes: { type: Array as PropType<MarkdownInlineNode[]>, required: true },
      sources: { type: Array as PropType<SourcesItem[]>, default: () => [] }
    },
    setup(props) {
      return () => renderNodes(props.nodes, props.sources, citation)
    }
  })
}

export default createMarkdownInline()
