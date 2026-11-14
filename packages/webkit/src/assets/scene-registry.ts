import { type Component, defineAsyncComponent, markRaw } from 'vue'

export type SceneLoader = () => Promise<{ default: Component }>

export const sceneAssets = {
  BrandGlobeScene: () => import('./globe/brand-globe-scene.vue'),
  ConsoleApplicationScene: () =>
    import('./scenes/console-application/console-application-scene.vue'),
  ConsoleTraceScene: () => import('./scenes/console-trace/console-trace-scene.vue'),
  FunctionsHeroCanvas: () => import('./scenes/runtime-api/runtime-api-scene.vue'),
  Diagram: () => import('../components/marketing/diagram/diagram.vue'),
  Illustration: () => import('../components/content/illustration/illustration.vue'),
  ProductWidget: () => import('../components/content/product-widget/product-widget.vue'),
  RuntimeApiCloud: () => import('./scenes/runtime-api/runtime-api-cloud.vue'),
  SpinningGlobe: () => import('./globe/spinning-globe.vue')
} satisfies Record<string, SceneLoader>

/** Name of a scene a section draws, as the page data spells it. */
export type SceneName = keyof typeof sceneAssets

/** A live scene a section draws in a media cell, named by the page data. */
export type SceneRef = {
  /** Registry name of the scene. */
  component: SceneName
  /** Props bound onto the scene, such as the `name` of a `ProductWidget`; the section's own state props win on a clash. */
  props?: Record<string, unknown>
}

const resolved = new Map<string, Component>()

const Nothing: Component = { name: 'SceneUnavailable', render: () => null }

const dev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true

export function isSceneName(name: string): name is SceneName {
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
        if (dev) console.warn(`[webkit] scene "${name}" could not load.`, error)
        fail()
      }
    })
  )
  resolved.set(name, component)
  return component
}
