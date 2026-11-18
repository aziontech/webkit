<script setup lang="ts">
  import {
    type Component,
    computed,
    defineAsyncComponent,
    h,
    toRaw,
    useAttrs,
    type VNodeChild
  } from 'vue'

  import type { ContentSceneName } from '../../../assets/content-scenes'
  import { useAppNavigation } from '../../../composables/use-app-navigation'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { plainText } from '../../ai/lib/parse-markdown'
  import ItemList from '../../content/item/item-list.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import Link from '../../navigation/link/link.vue'
  import HoverCard from '../../overlay/hover-card/hover-card.vue'
  import HoverCardContent from '../../overlay/hover-card/hover-card-content/hover-card-content.vue'
  import HoverCardTrigger from '../../overlay/hover-card/hover-card-trigger/hover-card-trigger.vue'
  import DocCallout from '../doc-callout/doc-callout.vue'
  import DocCard from '../doc-card/doc-card.vue'
  import DocCardGroup from '../doc-card-group/doc-card-group.vue'
  import DocChangelogEntry from '../doc-changelog-entry/doc-changelog-entry.vue'
  import type { DocCodeGroupSample } from '../doc-code-group/doc-code-group.vue'
  import DocHeading from '../doc-heading/doc-heading.vue'
  import DocSteps from '../doc-steps/doc-steps.vue'
  import DocStepsStep from '../doc-steps/doc-steps-step.vue'
  import {
    type DocMarkdownAttributes,
    type DocMarkdownInline,
    type DocMarkdownNode,
    parseDocInline,
    readDocMarkdown
  } from './parse-doc-markdown'

  defineOptions({ name: 'DocMarkdown', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      /** The page source: optional frontmatter, then Markdown with MDX component tags. */
      source?: string
      /** Replaces the component a block tag mounts, or adds a block tag, keyed by tag name. The tag's attributes become props. */
      components?: Record<string, Component>
    }>(),
    {
      source: '',
      components: () => ({})
    }
  )

  const attrs = useAttrs()
  const { t } = useTranslate({ common: en.common })
  const { follow } = useAppNavigation()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'doc-markdown')

  const DocAccordionGroup = defineAsyncComponent(
    () => import('../doc-accordion-group/doc-accordion-group.vue')
  )
  const DocAccordion = defineAsyncComponent(() => import('../doc-accordion/doc-accordion.vue'))
  const DocCodeGroup = defineAsyncComponent(() => import('../doc-code-group/doc-code-group.vue'))
  const DocFrame = defineAsyncComponent(() => import('../doc-frame/doc-frame.vue'))
  const DocItem = defineAsyncComponent(() => import('../doc-item/doc-item.vue'))
  const DocPrompt = defineAsyncComponent(() => import('../doc-prompt/doc-prompt.vue'))
  const FlowDiagram = defineAsyncComponent(() => import('../../data/flow-diagram/flow-diagram.vue'))
  const contentTag = (name: ContentSceneName): Component =>
    defineAsyncComponent(() =>
      import('../../../assets/content-scenes').then((module) => module.contentScenes[name]())
    )

  const CONTENT_ROOTS: ContentSceneName[] = [
    'BarList',
    'Carousel',
    'Chart',
    'ConsoleMockup',
    'Diagram',
    'DonutChart',
    'Embed',
    'Faq',
    'GaugeChart',
    'Illustration',
    'IntegrationCard',
    'KeyValueList',
    'MapChart',
    'NetworkMap',
    'PlanFeatureList',
    'PricingCard',
    'Quote',
    'SparkChart',
    'StatTile',
    'StatTileGroup',
    'Stats',
    'ThirdPartyLogo',
    'Tracker'
  ]

  const CONTENT_PARTS: ContentSceneName[] = [
    'CarouselItem',
    'ChartArea',
    'ChartAxis',
    'ChartBar',
    'ChartCrosshair',
    'ChartGrid',
    'ChartLegend',
    'ChartLine',
    'ChartReference',
    'ChartScatter',
    'ChartTooltip',
    'KeyValueListGroup',
    'KeyValueListItem'
  ]

  const CONTENT_TAGS = Object.fromEntries(
    [...CONTENT_ROOTS, ...CONTENT_PARTS, 'CarouselNext', 'CarouselPrevious'].map((name) => [
      name,
      contentTag(name as ContentSceneName)
    ])
  ) as Record<ContentSceneName, Component>

  const DocAgentCard = defineAsyncComponent(() => import('../doc-agent-card/doc-agent-card.vue'))
  const DocCallToAction = defineAsyncComponent(
    () => import('../doc-call-to-action/doc-call-to-action.vue')
  )

  const TableRoot = defineAsyncComponent(() => import('../../data/table/table.vue'))
  const TableHeader = defineAsyncComponent(
    () => import('../../data/table/table-header/table-header.vue')
  )
  const TableBody = defineAsyncComponent(() => import('../../data/table/table-body/table-body.vue'))
  const TableRow = defineAsyncComponent(() => import('../../data/table/table-row/table-row.vue'))
  const TableHeadCell = defineAsyncComponent(
    () => import('../../data/table/table-head-cell/table-head-cell.vue')
  )
  const TableCell = defineAsyncComponent(() => import('../../data/table/table-cell/table-cell.vue'))

  const TabsRoot = defineAsyncComponent(() => import('../../navigation/tabs/tabs.vue'))
  const TabsList = defineAsyncComponent(() => import('../../navigation/tabs/tabs-list.vue'))
  const TabsTrigger = defineAsyncComponent(() => import('../../navigation/tabs/tabs-trigger.vue'))
  const TabsContent = defineAsyncComponent(() => import('../../navigation/tabs/tabs-content.vue'))

  const CALLOUT_VARIANTS: Record<string, string> = {
    Note: 'note',
    Info: 'info',
    Tip: 'tip',
    Check: 'check',
    Warning: 'warning',
    Danger: 'danger'
  }

  const BLOCK_COMPONENTS: Record<string, Component> = {
    ...CONTENT_TAGS,
    Note: DocCallout,
    Info: DocCallout,
    Tip: DocCallout,
    Check: DocCallout,
    Warning: DocCallout,
    Danger: DocCallout,
    Steps: DocSteps,
    Step: DocStepsStep,
    CardGroup: DocCardGroup,
    Columns: DocCardGroup,
    Card: DocCard,
    Item: DocItem,
    AccordionGroup: DocAccordionGroup,
    Accordion: DocAccordion,
    Frame: DocFrame,
    Prompt: DocPrompt,
    Update: DocChangelogEntry,
    AgentCard: DocAgentCard,
    CallToAction: DocCallToAction,
    FlowDiagram
  }

  const CHROME_BLOCKS = new Set<Component>([
    DocCallToAction,
    FlowDiagram,
    ...CONTENT_ROOTS.map((name) => CONTENT_TAGS[name])
  ])

  const FRAMED_CLASS: Partial<Record<string, string>> = {
    ConsoleMockup:
      'relative block aspect-video w-full overflow-hidden rounded-(--shape-card) border border-(--border-default)',
    NetworkMap:
      'relative block aspect-[2/1] w-full overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas)'
  }

  const INLINE_BODY = new Set<Component>([DocCallout, DocItem, DocPrompt])

  const TOOLTIP_TERM_CLASS =
    'm-0 cursor-help rounded-(--shape-flat) border-0 bg-transparent p-0 text-start text-(--text-default) underline decoration-dotted decoration-(--border-strong) underline-offset-4 transition-colors duration-150 ease-out hover:decoration-(--text-default) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none'

  const text = (value: unknown): string => (typeof value === 'string' ? value : '')

  const renderTooltip = (attributes: DocMarkdownAttributes, children: VNodeChild[]): VNodeChild => {
    const title = text(attributes['title'])
    const tip = text(attributes['tip'])
    const href = text(attributes['href'])
    const linkLabel = text(attributes['linkLabel'])
    return h(HoverCard, { 'data-testid': `${testId.value}__tooltip`, openDelay: 150 }, () => [
      h(HoverCardTrigger, null, () =>
        h('button', { type: 'button', 'data-doc-chrome': '', class: TOOLTIP_TERM_CLASS }, children)
      ),
      h(HoverCardContent, { 'data-doc-chrome': '', class: 'gap-(--spacing-2xs)' }, () => [
        title ? h('span', { class: 'text-body-sm text-(--text-default)' }, title) : null,
        tip ? h('span', { class: 'text-pretty text-body-sm text-(--text-muted)' }, tip) : null,
        href && linkLabel
          ? h(Link, {
              label: linkLabel,
              href,
              size: 'small',
              icon: 'az az-chevron-right',
              class: 'self-start'
            })
          : null
      ])
    ])
  }

  const parsed = computed(() => readDocMarkdown(props.source, Object.keys(props.components)))

  const EXTERNAL = /^https?:/i

  const renderLink = (href: string, children: VNodeChild[]): VNodeChild => {
    const external = EXTERNAL.test(href)
    return h(
      'a',
      {
        href,
        target: external ? '_blank' : undefined,
        rel: external ? 'noreferrer' : undefined,
        onClick: external ? undefined : (event: globalThis.MouseEvent) => follow(event, { href })
      },
      external ? [...children, h('span', { class: 'sr-only' }, ` ${t('common.newTab')}`)] : children
    )
  }

  const renderTokens = (tokens: DocMarkdownInline[]): VNodeChild[] =>
    tokens.map((token): VNodeChild => {
      switch (token.type) {
        case 'text':
          return token.value
        case 'break':
          return ' '
        case 'code':
          return h('code', token.value)
        case 'strong':
          return h('strong', renderTokens(token.children))
        case 'em':
          return h('em', renderTokens(token.children))
        case 'link':
          return renderLink(token.href, renderTokens(token.children))
        case 'citation':
          return `[${token.index}]`
        case 'component': {
          if (token.name !== 'Tooltip') return null
          return renderTooltip(token.props, renderTokens(token.children))
        }
      }
    })

  const inline = (text: string): VNodeChild[] => renderTokens(parseDocInline(text))

  const sampleLabel = (meta: DocMarkdownAttributes, lang: string): string | undefined => {
    if (typeof meta['title'] === 'string' && meta['title']) return meta['title']
    const bare = Object.keys(meta).find((key) => meta[key] === true && key !== 'lineNumbers')
    return bare || lang || undefined
  }

  const toSample = (node: Extract<DocMarkdownNode, { type: 'code' }>): DocCodeGroupSample => ({
    label: sampleLabel(node.meta, node.lang),
    language: node.lang || undefined,
    fileName: typeof node.meta['title'] === 'string' ? node.meta['title'] : undefined,
    code: node.code
  })

  const renderTabs = (
    node: Extract<DocMarkdownNode, { type: 'component' }>,
    key: number
  ): VNodeChild => {
    const panels = node.children
      .filter(
        (child): child is Extract<DocMarkdownNode, { type: 'component' }> =>
          child.type === 'component' && child.name === 'Tab'
      )
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
              renderNodes(panel.children, false)
            )
          )
        ]
      }
    )
  }

  const PART_CODE_CLASS =
    'rounded-(--shape-control) bg-(--bg-hover) px-(--spacing-2xs) text-label-code-sm text-(--text-default) inset-ring inset-ring-(--border-default) forced-colors:border'

  const partInline = (text: string): VNodeChild[] =>
    parseDocInline(text).map((token): VNodeChild => {
      if (token.type === 'code') return h('code', { class: PART_CODE_CLASS }, token.value)
      if (token.type === 'link') {
        const external = EXTERNAL.test(token.href)
        return h(Link, {
          label: plainText(token.children),
          href: token.href,
          size: 'small',
          target: external ? '_blank' : undefined
        })
      }
      return renderTokens([token])
    })

  const renderParts = (nodes: DocMarkdownNode[]): VNodeChild[] =>
    nodes.flatMap((child, index) => {
      if (child.type === 'paragraph') return [h('span', { key: index }, partInline(child.text))]
      if (child.type !== 'component') return []
      const part = BLOCK_COMPONENTS[child.name]
      if (!part) return []
      const inner = renderParts(child.children)
      return [
        h(part, { key: index, ...child.props }, inner.length ? { default: () => inner } : undefined)
      ]
    })

  const renderComponent = (
    node: Extract<DocMarkdownNode, { type: 'component' }>,
    key: number
  ): VNodeChild => {
    const override = toRaw(props.components)[node.name]
    if (!override && node.name === 'CodeGroup') {
      const samples = node.children
        .filter(
          (child): child is Extract<DocMarkdownNode, { type: 'code' }> => child.type === 'code'
        )
        .map(toSample)
      return h(DocCodeGroup, { key, samples })
    }
    if (!override && node.name === 'Tabs') return renderTabs(node, key)
    if (!override && node.name === 'ItemGroup') {
      return h(
        RegistrationFrame,
        { key, 'data-doc-block': '', 'data-doc-chrome': '', class: 'w-full bg-(--bg-surface)' },
        { default: () => h(ItemList, null, { default: () => renderNodes(node.children, false) }) }
      )
    }
    const component = override ?? BLOCK_COMPONENTS[node.name]
    if (!component) return null
    const variant = !override ? CALLOUT_VARIANTS[node.name] : undefined
    const values: Record<string, unknown> = variant ? { variant, ...node.props } : { ...node.props }
    if (!override && node.name === 'CardGroup' && 'cols' in values) {
      values['columns'] ??= values['cols']
      delete values['cols']
    }
    const slots: Record<string, () => VNodeChild> = {}
    if (!override && node.name === 'Frame' && typeof values['caption'] === 'string') {
      const caption = values['caption']
      delete values['caption']
      slots['caption'] = () => inline(caption)
    }
    if (!override && CHROME_BLOCKS.has(component)) {
      const parts = renderParts(node.children)
      const chromeSlots: Record<string, () => VNodeChild> = parts.length
        ? { default: () => parts }
        : {}
      if (node.name === 'Carousel') {
        chromeSlots['controls'] = () => [
          h(CONTENT_TAGS.CarouselPrevious),
          h(CONTENT_TAGS.CarouselNext)
        ]
      }
      const frame = FRAMED_CLASS[node.name]
      if (frame) {
        return h('div', { key, 'data-doc-block': '', 'data-doc-chrome': '', class: frame }, [
          h(component, values, chromeSlots)
        ])
      }
      return h(
        component,
        { key, 'data-doc-block': '', 'data-doc-chrome': '', ...values },
        Object.keys(chromeSlots).length ? chromeSlots : undefined
      )
    }
    const children = renderNodes(node.children, !override && INLINE_BODY.has(component))
    if (children.length) slots['default'] = () => children
    return h(component, { key, ...values }, slots)
  }

  const renderNode = (node: DocMarkdownNode, key: number, inBody: boolean): VNodeChild => {
    switch (node.type) {
      case 'heading':
        return h(
          DocHeading,
          { key, level: node.depth, anchor: node.id },
          { default: () => inline(node.text) }
        )
      case 'paragraph':
        return inBody
          ? h('span', { key, class: 'block pt-(--spacing-xs) first:pt-0' }, inline(node.text))
          : h('p', { key }, inline(node.text))
      case 'list':
        return h(
          node.ordered ? 'ol' : 'ul',
          { key },
          node.items.map((item, index) =>
            h('li', { key: index }, [...inline(item.text), ...renderNodes(item.children, false)])
          )
        )
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
                  h(TableHeadCell, { key: index, align: node.align[index] }, () => partInline(cell))
                )
              )
            ),
            h(TableBody, null, () =>
              node.rows.map((row, rowIndex) =>
                h(TableRow, { key: rowIndex }, () =>
                  row.map((cell, index) =>
                    h(TableCell, { key: index, align: node.align[index] }, () => partInline(cell))
                  )
                )
              )
            )
          ]
        )
      case 'blockquote':
        return h('blockquote', { key }, renderNodes(node.children, false))
      case 'divider':
        return h('hr', { key })
      case 'component':
        return renderComponent(node, key)
    }
  }

  const renderNodes = (nodes: DocMarkdownNode[], inBody: boolean): VNodeChild[] =>
    nodes.map((node, index) => renderNode(node, index, inBody))

  const Body = () => renderNodes(parsed.value.nodes, false)
</script>

<script lang="ts">
  export {
    type DocMarkdownHeading,
    type DocMarkdownParsed,
    parseDocMarkdown
  } from './parse-doc-markdown'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="w-full min-w-0"
  >
    <Body />
  </div>
</template>
