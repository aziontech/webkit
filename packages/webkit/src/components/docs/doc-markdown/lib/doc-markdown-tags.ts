import { type Component, defineAsyncComponent } from 'vue'

import type { ContentSceneName } from '../../../../assets/content-scenes'
import DocCallout from '../../doc-callout/doc-callout.vue'
import DocCard from '../../doc-card/doc-card.vue'
import DocCardGroup from '../../doc-card-group/doc-card-group.vue'
import DocChangelogEntry from '../../doc-changelog-entry/doc-changelog-entry.vue'
import DocSteps from '../../doc-steps/doc-steps.vue'
import DocStepsStep from '../../doc-steps/doc-steps-step.vue'

const DocAccordionGroup = defineAsyncComponent(
  () => import('../../doc-accordion-group/doc-accordion-group.vue')
)
const DocAccordion = defineAsyncComponent(() => import('../../doc-accordion/doc-accordion.vue'))
export const DocCodeGroup = defineAsyncComponent(
  () => import('../../doc-code-group/doc-code-group.vue')
)
const DocFrame = defineAsyncComponent(() => import('../../doc-frame/doc-frame.vue'))
const DocItem = defineAsyncComponent(() => import('../../doc-item/doc-item.vue'))
const DocPrompt = defineAsyncComponent(() => import('../../doc-prompt/doc-prompt.vue'))
const FlowDiagram = defineAsyncComponent(
  () => import('../../../data/flow-diagram/flow-diagram.vue')
)
const contentTag = (name: ContentSceneName): Component =>
  defineAsyncComponent(() =>
    import('../../../../assets/content-scenes').then((module) => module.contentScenes[name]())
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

export const CONTENT_TAGS = Object.fromEntries(
  [...CONTENT_ROOTS, ...CONTENT_PARTS, 'CarouselNext', 'CarouselPrevious'].map((name) => [
    name,
    contentTag(name as ContentSceneName)
  ])
) as Record<ContentSceneName, Component>

const DocAgentCard = defineAsyncComponent(() => import('../../doc-agent-card/doc-agent-card.vue'))
const DocCallToAction = defineAsyncComponent(
  () => import('../../doc-call-to-action/doc-call-to-action.vue')
)

export const TableRoot = defineAsyncComponent(() => import('../../../data/table/table.vue'))
export const TableHeader = defineAsyncComponent(
  () => import('../../../data/table/table-header/table-header.vue')
)
export const TableBody = defineAsyncComponent(
  () => import('../../../data/table/table-body/table-body.vue')
)
export const TableRow = defineAsyncComponent(
  () => import('../../../data/table/table-row/table-row.vue')
)
export const TableHeadCell = defineAsyncComponent(
  () => import('../../../data/table/table-head-cell/table-head-cell.vue')
)
export const TableCell = defineAsyncComponent(
  () => import('../../../data/table/table-cell/table-cell.vue')
)

export const TabsRoot = defineAsyncComponent(() => import('../../../navigation/tabs/tabs.vue'))
export const TabsList = defineAsyncComponent(() => import('../../../navigation/tabs/tabs-list.vue'))
export const TabsTrigger = defineAsyncComponent(
  () => import('../../../navigation/tabs/tabs-trigger.vue')
)
export const TabsContent = defineAsyncComponent(
  () => import('../../../navigation/tabs/tabs-content.vue')
)

export const CALLOUT_VARIANTS: Record<string, string> = {
  Note: 'note',
  Info: 'info',
  Tip: 'tip',
  Check: 'check',
  Warning: 'warning',
  Danger: 'danger'
}

export const BLOCK_COMPONENTS: Record<string, Component> = {
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

export const CHROME_BLOCKS = new Set<Component>([
  DocCallToAction,
  FlowDiagram,
  ...CONTENT_ROOTS.map((name) => CONTENT_TAGS[name])
])

export const FRAMED_CLASS: Partial<Record<string, string>> = {
  ConsoleMockup:
    'relative block aspect-video w-full overflow-hidden rounded-(--shape-card) border border-(--border-default)',
  NetworkMap:
    'relative block aspect-[2/1] w-full overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas)'
}

export const INLINE_BODY = new Set<Component>([DocCallout, DocItem, DocPrompt])
