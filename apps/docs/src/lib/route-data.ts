import blockLoaders from 'virtual:docs-block-loaders'
import componentLoaders from 'virtual:docs-component-loaders'
import exampleLoaders from 'virtual:docs-example-loaders'
import frameStyles from 'virtual:docs-frame-styles'
import { type Component, shallowReactive } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

import type { ComponentDoc } from './types'

const REPO = '../../../../'

const markdownLoaders = () => import('./markdown-loaders')

const cache = shallowReactive(new Map<string, unknown>())

export function cached<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined
}

async function remember<T>(key: string, loader: (() => Promise<T>) | undefined): Promise<void> {
  if (!loader || cache.has(key)) return
  cache.set(key, await loader())
}

export const keys = {
  component: (name: string) => `component:${name}`,
  example: (dir: string, file: string) => `example:${dir}/${file}`,
  exampleSource: (dir: string, file: string) => `example-source:${dir}/${file}`,
  block: (dir: string, file: string) => `block:${dir}/${file}`,
  blockSource: (dir: string, file: string) => `block-source:${dir}/${file}`,
  blockManifest: (dir: string) => `block-manifest:${dir}`,
  blockGuidelines: (dir: string) => `block-guidelines:${dir}`,
  markdown: (path: string) => `markdown:${path}`,
  frameStyles: (group: string) => `frame-styles:${group}`
}

async function findBlockLazy(id: string) {
  const { default: index } = await import('virtual:docs-index')
  return index.blocks.find((block) => block.id === id)
}

async function preloadComponent(name: string) {
  const loader = (componentLoaders as Record<string, () => Promise<{ default: ComponentDoc }>>)[
    name
  ]
  if (!loader) return
  await remember(keys.component(name), async () => (await loader()).default)
  const doc = cached<ComponentDoc>(keys.component(name))
  if (!doc?.exampleDir) return
  const dir = doc.exampleDir
  const files = await exampleLoaders[dir]?.()
  if (!files) return
  await Promise.all(
    doc.examples.flatMap((example) => [
      remember(keys.example(dir, example.file), files.components[example.file]),
      remember(keys.exampleSource(dir, example.file), files.sources[example.file]),
      ...(example.json
        ? [remember(keys.exampleSource(dir, example.json), files.sources[example.json])]
        : [])
    ])
  )
}

export async function loadExample(dir: string, file: string): Promise<Component | undefined> {
  const files = await exampleLoaders[dir]?.()
  return files?.components[file]?.()
}

export async function preloadExample(dir: string, example: string) {
  const file = `${example}.vue`
  const files = await exampleLoaders[dir]?.()
  await Promise.all([
    remember(keys.example(dir, file), files?.components[file]),
    remember(keys.frameStyles(`examples/${dir}`), frameStyles[`examples/${dir}`])
  ])
}

async function preloadBlock(id: string, withCode = true) {
  const block = await findBlockLazy(id)
  if (!block) return
  const files = await blockLoaders[block.dir]?.()
  if (!files) return
  await Promise.all([
    ...block.states.map((state) =>
      remember(keys.block(block.dir, state.file), files.components[state.file])
    ),
    ...(withCode
      ? [
          ...block.states.map((state) =>
            remember(keys.blockSource(block.dir, state.file), files.sources[state.file])
          ),
          remember(keys.blockManifest(block.dir), files.manifest),
          remember(keys.blockGuidelines(block.dir), files.guidelines)
        ]
      : [remember(keys.frameStyles(`blocks/${block.dir}`), frameStyles[`blocks/${block.dir}`])])
  ])
}

async function preloadMarkdown(path: string) {
  const { foundationDocs } = await markdownLoaders()
  await remember(keys.markdown(path), foundationDocs[REPO + path])
}

export async function preloadRoute(route: RouteLocationNormalized) {
  const param = (name: string) => {
    const value = route.params[name]
    return (Array.isArray(value) ? value.join('/') : (value ?? '')).replace(/\/+$/, '')
  }
  if (route.name === 'component') await preloadComponent(param('name'))
  else if (route.name === 'block') await preloadBlock(param('id'))
  else if (route.name === 'block-frame') await preloadBlock(param('id'), false)
  else if (route.name === 'example-frame') {
    const segments = param('path').split('/').filter(Boolean)
    if (segments.length > 1)
      await preloadExample(segments.slice(0, -1).join('/'), segments.at(-1) as string)
  } else if (route.name === 'foundation') {
    const { FOUNDATIONS } = await import('./foundations')
    const page = FOUNDATIONS.find((item) => item.slug === param('slug'))
    if (page?.markdown) await preloadMarkdown(page.markdown)
  }
}
