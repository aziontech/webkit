import componentLoaders from 'virtual:docs-component-loaders'
import index from 'virtual:docs-index'
import { type Component, shallowReactive } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

import type { ComponentDoc, Highlighted, MarkdownDoc } from './types'

const EXAMPLES = '../../../../packages/webkit/examples/'
const BLOCKS = '../../../../packages/webkit/blocks/'
const REPO = '../../../../'

const exampleComponents = import.meta.glob<Component>(
  '../../../../packages/webkit/examples/**/*.vue',
  {
    import: 'default'
  }
)
const exampleSources = import.meta.glob<Highlighted>(
  '../../../../packages/webkit/examples/**/*.vue',
  { query: '?highlight', import: 'default' }
)
const blockComponents = import.meta.glob<Component>('../../../../packages/webkit/blocks/**/*.vue', {
  import: 'default'
})
const blockSources = import.meta.glob<Highlighted>('../../../../packages/webkit/blocks/**/*.vue', {
  query: '?highlight',
  import: 'default'
})
const blockManifests = import.meta.glob<Record<string, unknown>>(
  '../../../../packages/webkit/blocks/**/block.json',
  { import: 'default' }
)
const blockGuidelines = import.meta.glob<MarkdownDoc>(
  '../../../../packages/webkit/blocks/**/guidelines.md',
  { query: '?markdown', import: 'default' }
)
const foundationDocs = import.meta.glob<MarkdownDoc>(
  ['../../../../rules/*.md', '../../../../packages/webkit/README.md'],
  { query: '?markdown', import: 'default' }
)

export { index }

export const cache = shallowReactive(new Map<string, unknown>())

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
  markdown: (path: string) => `markdown:${path}`
}

export function findBlock(id: string) {
  return index.blocks.find((block) => block.id === id)
}

export async function preloadComponent(name: string) {
  const loader = (componentLoaders as Record<string, () => Promise<{ default: ComponentDoc }>>)[
    name
  ]
  if (!loader) return
  await remember(keys.component(name), async () => (await loader()).default)
  const doc = cached<ComponentDoc>(keys.component(name))
  if (!doc?.exampleDir) return
  const dir = doc.exampleDir
  await Promise.all(
    doc.examples.flatMap((example) => [
      remember(
        keys.example(dir, example.file),
        exampleComponents[`${EXAMPLES}${dir}/${example.file}`]
      ),
      remember(
        keys.exampleSource(dir, example.file),
        exampleSources[`${EXAMPLES}${dir}/${example.file}`]
      )
    ])
  )
}

export async function preloadExample(dir: string, example: string) {
  const file = `${example}.vue`
  await remember(keys.example(dir, file), exampleComponents[`${EXAMPLES}${dir}/${file}`])
}

export async function preloadBlock(id: string, withCode = true) {
  const block = findBlock(id)
  if (!block) return
  const base = `${BLOCKS}${block.dir}/`
  await Promise.all([
    ...block.states.map((state) =>
      remember(keys.block(block.dir, state.file), blockComponents[base + state.file])
    ),
    ...(withCode
      ? [
          ...block.states.map((state) =>
            remember(keys.blockSource(block.dir, state.file), blockSources[base + state.file])
          ),
          remember(keys.blockManifest(block.dir), blockManifests[`${base}block.json`]),
          remember(keys.blockGuidelines(block.dir), blockGuidelines[`${base}guidelines.md`])
        ]
      : [])
  ])
}

export async function preloadMarkdown(path: string) {
  await remember(keys.markdown(path), foundationDocs[REPO + path])
}

export async function preloadRoute(route: RouteLocationNormalized) {
  const param = (name: string) => {
    const value = route.params[name]
    return (Array.isArray(value) ? value.join('/') : (value ?? '')).replace(/\/+$/, '')
  }
  if (route.name === 'component') await preloadComponent(param('name'))
  else if (route.name === 'block') await preloadBlock(param('id'))
  else if (route.name === 'frame') await preloadBlock(param('id'), false)
  else if (route.name === 'example-frame') await preloadExample(param('dir'), param('example'))
  else if (route.name === 'foundation') {
    const { FOUNDATIONS } = await import('./foundations')
    const page = FOUNDATIONS.find((item) => item.slug === param('slug'))
    if (page?.markdown) await preloadMarkdown(page.markdown)
  }
}
