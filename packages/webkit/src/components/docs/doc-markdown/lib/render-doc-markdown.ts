import { type Component, h, toRaw, type VNodeChild } from 'vue'

import { plainText } from '../../../ai/lib/parse-markdown'
import ItemList from '../../../content/item/item-list.vue'
import RegistrationFrame from '../../../layout/registration-frame/registration-frame.vue'
import Link from '../../../navigation/link/link.vue'
import type { DocCodeGroupSample } from '../../doc-code-group/doc-code-group.vue'
import DocHeading from '../../doc-heading/doc-heading.vue'
import { type DocMarkdownNode, parseDocInline } from '../parse-doc-markdown'
import {
  BLOCK_COMPONENTS,
  CALLOUT_VARIANTS,
  CHROME_BLOCKS,
  CONTENT_TAGS,
  DocCodeGroup,
  FRAMED_CLASS,
  INLINE_BODY,
  TableBody,
  TableCell,
  TableHeadCell,
  TableHeader,
  TableRoot,
  TableRow,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger
} from './doc-markdown-tags'
import { EXTERNAL, inline, renderTokens, text } from './render-doc-inline'

export interface DocMarkdownRenderContext {
  testId: string
  newTab: string
  follow: (event: globalThis.MouseEvent, target: { href: string }) => void
  overrides: Record<string, Component>
}

type Ctx = DocMarkdownRenderContext
type ComponentNode = Extract<DocMarkdownNode, { type: 'component' }>
type CodeNode = Extract<DocMarkdownNode, { type: 'code' }>

const PART_CODE_CLASS =
  'rounded-(--shape-control) bg-(--bg-hover) px-(--spacing-2xs) text-label-code-sm text-(--text-default) inset-ring inset-ring-(--border-default) forced-colors:border'

function toSample(node: CodeNode): DocCodeGroupSample {
  const title = node.meta['title']
  const bare = Object.keys(node.meta).find(
    (key) => node.meta[key] === true && key !== 'lineNumbers'
  )
  return {
    label: (typeof title === 'string' && title) || bare || node.lang || undefined,
    language: node.lang || undefined,
    fileName: typeof title === 'string' ? title : undefined,
    code: node.code
  }
}

function renderTabs(ctx: Ctx, node: ComponentNode, key: number): VNodeChild {
  const panels = node.children
    .filter((child): child is ComponentNode => child.type === 'component' && child.name === 'Tab')
    .map((child, position) => ({
      value: `tab-${position}`,
      title: text(child.props['title']) || `${position + 1}`,
      children: child.children
    }))
  return h(
    TabsRoot,
    { key, 'data-doc-block': '', defaultValue: panels[0]?.value ?? '' },
    {
      default: () => [
        h(TabsList, null, () =>
          panels.map((panel) =>
            h(TabsTrigger, { key: panel.value, value: panel.value, label: panel.title })
          )
        ),
        ...panels.map((panel) =>
          h(TabsContent, { key: panel.value, value: panel.value }, () =>
            renderNodes(ctx, panel.children, false)
          )
        )
      ]
    }
  )
}

function partInline(ctx: Ctx, source: string): VNodeChild[] {
  return parseDocInline(source).map((token): VNodeChild => {
    if (token.type === 'code') return h('code', { class: PART_CODE_CLASS }, token.value)
    if (token.type !== 'link') return renderTokens(ctx, [token])
    return h(Link, {
      label: plainText(token.children),
      href: token.href,
      size: 'small',
      target: EXTERNAL.test(token.href) ? '_blank' : undefined
    })
  })
}

function renderParts(ctx: Ctx, nodes: DocMarkdownNode[]): VNodeChild[] {
  return nodes.flatMap((child, index) => {
    if (child.type === 'paragraph') return [h('span', { key: index }, partInline(ctx, child.text))]
    if (child.type !== 'component') return []
    const part = BLOCK_COMPONENTS[child.name]
    if (!part) return []
    const inner = renderParts(ctx, child.children)
    return [
      h(part, { key: index, ...child.props }, inner.length ? { default: () => inner } : undefined)
    ]
  })
}

function renderBuiltIn(ctx: Ctx, node: ComponentNode, key: number): VNodeChild | undefined {
  if (node.name === 'CodeGroup') {
    const samples = node.children
      .filter((child): child is CodeNode => child.type === 'code')
      .map(toSample)
    return h(DocCodeGroup, { key, samples })
  }
  if (node.name === 'Tabs') return renderTabs(ctx, node, key)
  if (node.name !== 'ItemGroup') return undefined
  return h(
    RegistrationFrame,
    { key, 'data-doc-block': '', 'data-doc-chrome': '', class: 'w-full bg-(--bg-surface)' },
    { default: () => h(ItemList, null, { default: () => renderNodes(ctx, node.children, false) }) }
  )
}

function blockValues(node: ComponentNode, own: boolean): Record<string, unknown> {
  const variant = own ? CALLOUT_VARIANTS[node.name] : undefined
  const values: Record<string, unknown> = variant ? { variant, ...node.props } : { ...node.props }
  if (own && node.name === 'CardGroup' && 'cols' in values) {
    values['columns'] ??= values['cols']
    delete values['cols']
  }
  return values
}

function renderChrome(
  ctx: Ctx,
  node: ComponentNode,
  component: Component,
  values: Record<string, unknown>,
  key: number
): VNodeChild {
  const parts = renderParts(ctx, node.children)
  const slots: Record<string, () => VNodeChild> = parts.length ? { default: () => parts } : {}
  if (node.name === 'Carousel') {
    slots['controls'] = () => [h(CONTENT_TAGS.CarouselPrevious), h(CONTENT_TAGS.CarouselNext)]
  }
  const frame = FRAMED_CLASS[node.name]
  if (frame) {
    return h('div', { key, 'data-doc-block': '', 'data-doc-chrome': '', class: frame }, [
      h(component, values, slots)
    ])
  }
  return h(
    component,
    { key, 'data-doc-block': '', 'data-doc-chrome': '', ...values },
    Object.keys(slots).length ? slots : undefined
  )
}

function renderComponent(ctx: Ctx, node: ComponentNode, key: number): VNodeChild {
  const override = toRaw(ctx.overrides)[node.name]
  const builtIn = override ? undefined : renderBuiltIn(ctx, node, key)
  if (builtIn !== undefined) return builtIn
  const component = override ?? BLOCK_COMPONENTS[node.name]
  if (!component) return null
  const values = blockValues(node, !override)
  const slots: Record<string, () => VNodeChild> = {}
  if (!override && node.name === 'Frame' && typeof values['caption'] === 'string') {
    const caption = values['caption']
    delete values['caption']
    slots['caption'] = () => inline(ctx, caption)
  }
  if (!override && CHROME_BLOCKS.has(component))
    return renderChrome(ctx, node, component, values, key)
  const children = renderNodes(ctx, node.children, !override && INLINE_BODY.has(component))
  if (children.length) slots['default'] = () => children
  return h(component, { key, ...values }, slots)
}

function renderList(ctx: Ctx, node: Extract<DocMarkdownNode, { type: 'list' }>, key: number) {
  return h(
    node.ordered ? 'ol' : 'ul',
    { key },
    node.items.map((item, index) =>
      h('li', { key: index }, [
        ...inline(ctx, item.text),
        ...renderNodes(ctx, item.children, false)
      ])
    )
  )
}

function renderNode(ctx: Ctx, node: DocMarkdownNode, key: number, inBody: boolean): VNodeChild {
  switch (node.type) {
    case 'heading':
      return h(
        DocHeading,
        { key, level: node.depth, anchor: node.id },
        { default: () => inline(ctx, node.text) }
      )
    case 'paragraph':
      return inBody
        ? h('span', { key, class: 'block pt-(--spacing-xs) first:pt-0' }, inline(ctx, node.text))
        : h('p', { key }, inline(ctx, node.text))
    case 'list':
      return renderList(ctx, node, key)
    case 'code':
      return h(DocCodeGroup, {
        key,
        samples: [toSample(node)],
        showLineNumbers: node.meta['lineNumbers'] === true
      })
    case 'table':
      return h(
        TableRoot,
        { key, 'data-doc-block': '', 'data-doc-chrome': '', bordered: true, wrapLines: true },
        () => [
          h(TableHeader, null, () =>
            h(TableRow, null, () =>
              node.head.map((cell, index) =>
                h(TableHeadCell, { key: index, align: node.align[index] }, () =>
                  partInline(ctx, cell)
                )
              )
            )
          ),
          h(TableBody, null, () =>
            node.rows.map((row, rowIndex) =>
              h(TableRow, { key: rowIndex }, () =>
                row.map((cell, index) =>
                  h(TableCell, { key: index, align: node.align[index] }, () =>
                    partInline(ctx, cell)
                  )
                )
              )
            )
          )
        ]
      )
    case 'blockquote':
      return h('blockquote', { key }, renderNodes(ctx, node.children, false))
    case 'divider':
      return h('hr', { key })
    case 'component':
      return renderComponent(ctx, node, key)
  }
}

export function renderNodes(ctx: Ctx, nodes: DocMarkdownNode[], inBody: boolean): VNodeChild[] {
  return nodes.map((node, index) => renderNode(ctx, node, index, inBody))
}
