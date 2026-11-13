import { type Component, defineAsyncComponent, markRaw } from 'vue'

export type SceneLoader = () => Promise<{ default: Component }>

export const sceneAssets = {
  BrandGlobeScene: () => import('./globe/brand-globe-scene.vue'),
  Diagram: () => import('../components/marketing/diagram/diagram.vue'),
  Illustration: () => import('../components/content/illustration/illustration.vue'),
  ProductWidget: () => import('../components/content/product-widget/product-widget.vue'),
  SpinningGlobe: () => import('./globe/spinning-globe.vue')
} satisfies Record<string, SceneLoader>

/** Name of a scene a section draws, as the page data spells it. */
export type SceneName = keyof typeof sceneAssets

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
