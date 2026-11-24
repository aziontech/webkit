import { defineComponent, h, type PropType, type VNode } from 'vue'

import type { SourcesItem } from '../sources/types'
import MarkdownInline from './markdown-inline-cited'
import type { MarkdownList as MarkdownListNode } from './parse-markdown'

const LIST_CLASS =
  'm-0 flex list-disc flex-col gap-(--spacing-xs) ps-(--spacing-lg) data-[ordered]:list-decimal data-[nested]:mt-(--spacing-xs) data-[nested]:not-data-[ordered]:list-[circle]'

function renderList(list: MarkdownListNode, sources: SourcesItem[], nested: boolean): VNode {
  return h(
    list.ordered ? 'ol' : 'ul',
    {
      start: list.ordered && list.start !== 1 ? list.start : undefined,
      'data-ordered': list.ordered || undefined,
      'data-nested': nested || undefined,
      class: LIST_CLASS
    },
    list.items.map((item, index) =>
      h('li', { key: index, class: 'ps-(--spacing-2xs)' }, [
        h(MarkdownInline, { nodes: item.children, sources }),
        item.list ? renderList(item.list, sources, true) : null
      ])
    )
  )
}

export default defineComponent({
  name: 'MarkdownList',
  props: {
    list: { type: Object as PropType<MarkdownListNode>, required: true },
    sources: { type: Array as PropType<SourcesItem[]>, default: () => [] }
  },
  setup(props) {
    return () => renderList(props.list, props.sources, false)
  }
})
