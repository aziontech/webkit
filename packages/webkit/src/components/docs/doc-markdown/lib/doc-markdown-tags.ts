import { type Component, defineAsyncComponent } from 'vue'

import type { ContentSceneName } from '../../../../assets/content-scenes'
import DocCallout from '../../doc-callout/doc-callout.vue'
import DocCard from '../../doc-card/doc-card.vue'
import DocCardGroup from '../../doc-card-group/doc-card-group.vue'
import DocChangelogEntry from '../../doc-changelog-entry/doc-changelog-entry.vue'
import DocSteps from '../../doc-steps/doc-steps.vue'
import DocStepsStep from '../../doc-steps/doc-steps-step.vue'

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

export const CALLOUT_VARIANTS: Record<string, string> = {
  Note: 'note',
  Info: 'info',
  Tip: 'tip',
  Check: 'check',
  Warning: 'warning',
  Danger: 'danger'
}

export const FRAMED_CLASS: Partial<Record<string, string>> = {
  ConsoleMockup:
    'relative block aspect-video w-full overflow-hidden rounded-(--shape-card) border border-(--border-default)',
  NetworkMap:
    'relative block aspect-[2/1] w-full overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas)'
}

const contentTag = (name: ContentSceneName): Component =>
  defineAsyncComponent(() =>
    import('../../../../assets/content-scenes').then((module) => module.contentScenes[name]())
  )

function createContentTags() {
  return Object.fromEntries(
    [...CONTENT_ROOTS, ...CONTENT_PARTS, 'CarouselNext', 'CarouselPrevious'].map((name) => [
      name,
      contentTag(name as ContentSceneName)
    ])
  ) as Record<ContentSceneName, Component>
}

function createDocTags() {
  const DocAccordionGroup = defineAsyncComponent(
    () => import('../../doc-accordion-group/doc-accordion-group.vue')
  )
  const DocAccordion = defineAsyncComponent(() => import('../../doc-accordion/doc-accordion.vue'))
  const DocFrame = defineAsyncComponent(() => import('../../doc-frame/doc-frame.vue'))
  const DocItem = defineAsyncComponent(() => import('../../doc-item/doc-item.vue'))
  const DocPrompt = defineAsyncComponent(() => import('../../doc-prompt/doc-prompt.vue'))
  const FlowDiagram = defineAsyncComponent(
    () => import('../../../data/flow-diagram/flow-diagram.vue')
  )
  const DocAgentCard = defineAsyncComponent(() => import('../../doc-agent-card/doc-agent-card.vue'))
  const DocCallToAction = defineAsyncComponent(
    () => import('../../doc-call-to-action/doc-call-to-action.vue')
  )
  const blocks: Record<string, Component> = {
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
  return {
    blocks,
    chrome: [DocCallToAction, FlowDiagram],
    inlineBody: new Set<Component>([DocCallout, DocItem, DocPrompt])
  }
}

function createLayoutTags() {
  return {
    DocCodeGroup: defineAsyncComponent(() => import('../../doc-code-group/doc-code-group.vue')),
    TableRoot: defineAsyncComponent(() => import('../../../data/table/table.vue')),
    TableHeader: defineAsyncComponent(
      () => import('../../../data/table/table-header/table-header.vue')
    ),
    TableBody: defineAsyncComponent(() => import('../../../data/table/table-body/table-body.vue')),
    TableRow: defineAsyncComponent(() => import('../../../data/table/table-row/table-row.vue')),
    TableHeadCell: defineAsyncComponent(
      () => import('../../../data/table/table-head-cell/table-head-cell.vue')
    ),
    TableCell: defineAsyncComponent(() => import('../../../data/table/table-cell/table-cell.vue')),
    TabsRoot: defineAsyncComponent(() => import('../../../navigation/tabs/tabs.vue')),
    TabsList: defineAsyncComponent(() => import('../../../navigation/tabs/tabs-list.vue')),
    TabsTrigger: defineAsyncComponent(() => import('../../../navigation/tabs/tabs-trigger.vue')),
    TabsContent: defineAsyncComponent(() => import('../../../navigation/tabs/tabs-content.vue'))
  }
}

export function createDocMarkdownTags() {
  const content = createContentTags()
  const doc = createDocTags()
  const blocks: Record<string, Component> = { ...content, ...doc.blocks }
  return {
    ...createLayoutTags(),
    content,
    blocks,
    chrome: new Set<Component>([...doc.chrome, ...CONTENT_ROOTS.map((name) => content[name])]),
    inlineBody: doc.inlineBody
  }
}

export type DocMarkdownTags = ReturnType<typeof createDocMarkdownTags>
