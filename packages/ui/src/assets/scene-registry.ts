import { type Component, defineAsyncComponent, markRaw } from 'vue'

import type { ContentSceneName } from './content-scenes'

export type SceneLoader = () => Promise<{ default: Component }>

const loadContentScenes = () => import('./content-scenes')

const contentScene =
  (name: ContentSceneName): SceneLoader =>
  () =>
    loadContentScenes().then((module) => module.contentScenes[name]())

export const sceneAssets = {
  BrandGlobeScene: () => import('./globe/brand-globe-scene.vue'),
  ConsoleApplicationScene: () =>
    import('./scenes/console-application/console-application-scene.vue'),
  ConsoleTraceScene: () => import('./scenes/console-trace/console-trace-scene.vue'),
  FunctionsHeroCanvas: () => import('./scenes/runtime-api/runtime-api-scene.vue'),
  Diagram: () => import('../components/marketing/diagram/diagram.vue'),
  FlowDiagram: () => import('../components/data/flow-diagram/flow-diagram.vue'),
  Illustration: () => import('../components/content/illustration/illustration.vue'),
  ConsoleMockup: () => import('../components/content/console-mockup/console-mockup.vue'),
  Accordion: contentScene('Accordion'),
  AccordionContent: contentScene('AccordionContent'),
  AccordionItem: contentScene('AccordionItem'),
  AccordionTrigger: contentScene('AccordionTrigger'),
  BarList: contentScene('BarList'),
  Card: contentScene('Card'),
  Chart: contentScene('Chart'),
  ChartArea: contentScene('ChartArea'),
  ChartAxis: contentScene('ChartAxis'),
  ChartBar: contentScene('ChartBar'),
  ChartCrosshair: contentScene('ChartCrosshair'),
  ChartGrid: contentScene('ChartGrid'),
  ChartLegend: contentScene('ChartLegend'),
  ChartLine: contentScene('ChartLine'),
  ChartReference: contentScene('ChartReference'),
  ChartScatter: contentScene('ChartScatter'),
  ChartTooltip: contentScene('ChartTooltip'),
  CodeBlock: contentScene('CodeBlock'),
  DonutChart: contentScene('DonutChart'),
  Embed: contentScene('Embed'),
  GaugeChart: contentScene('GaugeChart'),
  IntegrationCard: contentScene('IntegrationCard'),
  KeyValueList: contentScene('KeyValueList'),
  KeyValueListGroup: contentScene('KeyValueListGroup'),
  KeyValueListItem: contentScene('KeyValueListItem'),
  MapChart: contentScene('MapChart'),
  PlanFeatureList: contentScene('PlanFeatureList'),
  SparkChart: contentScene('SparkChart'),
  StatTile: contentScene('StatTile'),
  StatTileGroup: contentScene('StatTileGroup'),
  StatusIndicator: contentScene('StatusIndicator'),
  Tracker: contentScene('Tracker'),
  RuntimeApiCloud: () => import('./scenes/runtime-api/runtime-api-cloud.vue'),
  SpinningGlobe: () => import('./globe/spinning-globe.vue')
} satisfies Record<string, SceneLoader>

/** Name of a scene a section draws, as the page data spells it. */
export type SceneName = keyof typeof sceneAssets

const backdropScenes: readonly SceneName[] = [
  'BrandGlobeScene',
  'ConsoleApplicationScene',
  'ConsoleMockup',
  'ConsoleTraceScene',
  'Diagram',
  'FunctionsHeroCanvas',
  'Illustration',
  'RuntimeApiCloud',
  'SpinningGlobe'
]

export function isBackdropScene(name: string): boolean {
  return (backdropScenes as readonly string[]).includes(name)
}

/** A live scene a section draws in a media cell, named by the page data. */
export type SceneRef = {
  /** Registry name of the scene. */
  component: SceneName
  /** Props bound onto the scene, such as the `name` of a `ConsoleMockup`; the section's own state props win on a clash. */
  props?: Record<string, unknown>
  /** Scenes or plain text drawn in the scene's default slot, in order, such as the marks of a `Chart`, the tiles of a `StatTileGroup` or the value of a `KeyValueListItem`. */
  children?: (SceneRef | string)[]
}

const resolved = new Map<string, Component>()

const Nothing: Component = { name: 'SceneUnavailable', render: () => null }

const dev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true

function isSceneName(name: string): name is SceneName {
  return Object.prototype.hasOwnProperty.call(sceneAssets, name)
}

export function resolveScene(name: string): Component | null {
  if (!isSceneName(name)) return null
  const cached = resolved.get(name)
  if (cached) return cached
  const component = markRaw(
    defineAsyncComponent({
      loader: sceneAssets[name] as SceneLoader,
      timeout: 10000,
      errorComponent: Nothing,
      onError: (error, _retry, fail) => {
        if (dev) console.warn(`[azion-ui] scene "${name}" could not load.`, error)
        fail()
      }
    })
  )
  resolved.set(name, component)
  return component
}
