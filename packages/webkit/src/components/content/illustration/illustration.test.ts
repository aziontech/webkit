import { composeStories } from '@storybook/vue3'
import { render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/content/illustration/Illustration.stories'
import {
  illustrationPalette,
  normalizeIllustrationColor
} from '../../../assets/illustrations/palette'
import {
  illustrationAssetNames,
  loadIllustrationPlaceholder,
  resolveIllustrationAsset
} from '../../../assets/illustrations/registry'
import { loadIllustrationScene } from '../../../assets/illustrations/scene'
import { expectNoA11yViolations } from '../../../test/axe'
import Illustration from './illustration.vue'

const { Default, Assets, Labeled, Placeholder } = composeStories(stories)

const at = (view: ReturnType<typeof render>) => within(view.container)

const root = (view: ReturnType<typeof render>, testId = 'content-illustration') =>
  at(view).findByTestId(testId)

const urlOf = async (name: string) => (await resolveIllustrationAsset(name)!()).default

const placeholderUrl = async () => (await loadIllustrationPlaceholder()).default

const drawnCount = (el: globalThis.Element) => el.querySelectorAll('*').length

const drawnNodes = (nodes: globalThis.Node[]) =>
  nodes.reduce(
    (count, node) => (node instanceof globalThis.Element ? count + 1 + drawnCount(node) : count),
    0
  )

const countOf = async (url: string) => drawnNodes((await loadIllustrationScene(url)).draw('x'))

const sceneOf = async (name: string) => countOf(await urlOf(name))

const placeholderScene = async () => countOf(await placeholderUrl())

const drawsScene = async (view: ReturnType<typeof render>, expected: number) =>
  waitFor(async () => expect(drawnCount(await root(view))).toBe(expected))

const fills = (el: globalThis.Element, selector: string) =>
  [...el.querySelectorAll(selector)].map((node) => globalThis.getComputedStyle(node).fill)

const themed = (style: string, name: string) =>
  render({
    components: { Illustration },
    template: `<div style="${style}"><Illustration name="${name}" /></div>`
  })

const UNPAINTED = 'mask, clipPath, filter'

describe('Illustration', () => {
  it('renders the story with the derived testid', async () => {
    expect(await root(render(Default()))).toBeTruthy()
  })

  it('lets a consumer-supplied data-testid win over the derived fallback', async () => {
    const view = render(Illustration, {
      props: { name: 'runtime' },
      attrs: { 'data-testid': 'hero-art' }
    })
    expect(await root(view, 'hero-art')).toBeTruthy()
    expect(at(view).queryByTestId('content-illustration')).toBeNull()
  })

  it('forwards consumer attributes and merges the consumer class onto the root', async () => {
    const view = render(Illustration, {
      props: { name: 'runtime' },
      attrs: { class: 'max-w-md', id: 'hero-art' }
    })
    const el = await root(view)
    expect(el.id).toBe('hero-art')
    expect(el.classList.contains('max-w-md')).toBe(true)
    expect(el.classList.contains('w-full')).toBe(true)
  })

  it.each(illustrationAssetNames)('renders the registered scene %s', async (name) => {
    const view = render(Illustration, { props: { name } })
    const scene = await loadIllustrationScene(await urlOf(name))
    await drawsScene(view, drawnNodes(scene.draw('x')))
    const el = await root(view)
    expect(el.tagName).toBe('svg')
    expect(el.getAttribute('viewBox')).toBe(scene.viewBox)
  })

  it.each(illustrationAssetNames)(
    'gives every colour %s draws with a palette entry',
    async (name) => {
      const markup = await (await globalThis.fetch(await urlOf(name))).text()
      const svg = new globalThis.DOMParser().parseFromString(markup, 'image/svg+xml')
      const unlisted = new Set<string>()
      for (const node of svg.querySelectorAll('*')) {
        if (node.closest(UNPAINTED)) continue
        for (const paint of ['fill', 'stroke', 'stop-color']) {
          const value = node.getAttribute(paint)
          if (!value || value === 'none' || value.startsWith('url(')) continue
          const color = normalizeIllustrationColor(value)
          if (!(color in illustrationPalette)) unlisted.add(color)
        }
      }
      expect([...unlisted]).toEqual([])
    }
  )

  it('paints the scene from the illustration roles of the subtree it renders in', async () => {
    const view = themed(
      '--illustration-surface: rgb(1, 2, 3); --illustration-ink: rgb(4, 5, 6)',
      'runtime'
    )
    await drawsScene(view, await sceneOf('runtime'))
    const painted = fills(await root(view), 'path')
    expect(painted).toContain('rgb(1, 2, 3)')
    expect(painted).toContain('rgb(4, 5, 6)')
    expect(painted).not.toContain('rgb(10, 10, 10)')
  })

  it('falls back to the colours the scene was drawn with when no theme is loaded', async () => {
    const view = render(Illustration, { props: { name: 'runtime' } })
    await drawsScene(view, await sceneOf('runtime'))
    expect(fills(await root(view), 'path')).toContain('rgb(10, 10, 10)')
  })

  it('keeps a translucent ground colour as a drop shadow', async () => {
    const view = themed('--illustration-ground: rgb(7, 8, 9)', 'low-latency')
    await drawsScene(view, await sceneOf('low-latency'))
    const shadows = fills(await root(view), '[fill-opacity]')
    expect(shadows).toContain('rgb(0, 0, 0)')
    expect(shadows).not.toContain('rgb(7, 8, 9)')
  })

  it('paints a gradient stop that relies on the default black as ground', async () => {
    const view = themed('--illustration-ground: rgb(7, 8, 9)', 'preview')
    await drawsScene(view, await sceneOf('preview'))
    const stops = [...(await root(view)).querySelectorAll('stop')].map(
      (stop) => globalThis.getComputedStyle(stop).stopColor
    )
    expect(stops).toContain('rgb(7, 8, 9)')
    expect(stops).not.toContain('rgb(0, 0, 0)')
  })

  it('never repaints a mask', async () => {
    const view = themed('--illustration-highlight: rgb(7, 8, 9)', 'runtime')
    await drawsScene(view, await sceneOf('runtime'))
    const masks = fills(await root(view), 'mask, mask *')
    expect(masks.length).toBeGreaterThan(0)
    expect(masks).not.toContain('rgb(7, 8, 9)')
  })

  it('scopes every internal id to its own instance', async () => {
    const view = render({
      components: { Illustration },
      template: '<div><Illustration name="runtime" /><Illustration name="runtime" /></div>'
    })
    const expected = await sceneOf('runtime')
    await waitFor(() => {
      const scenes = at(view).getAllByTestId('content-illustration')
      expect(scenes.map(drawnCount)).toEqual([expected, expected])
    })
    const scenes = at(view).getAllByTestId('content-illustration')
    const ids = scenes.flatMap((scene) => [...scene.querySelectorAll('[id]')].map((n) => n.id))
    expect(ids.length).toBeGreaterThan(0)
    expect(new Set(ids).size).toBe(ids.length)
    for (const scene of scenes) {
      const own = new Set([...scene.querySelectorAll('[id]')].map((n) => n.id))
      for (const node of scene.querySelectorAll('*')) {
        for (const attribute of node.attributes) {
          for (const match of attribute.value.matchAll(/url\(#([^)]+)\)/g)) {
            expect(own.has(match[1])).toBe(true)
          }
        }
      }
    }
  })

  it('reserves the canvas aspect ratio before the SVG loads', async () => {
    const el = await root(render(Illustration, { props: { name: 'runtime' } }))
    expect(el.getAttribute('width')).toBe('592')
    expect(el.getAttribute('height')).toBe('300')
  })

  it('falls back to the placeholder when name is empty', async () => {
    const view = render(Illustration)
    await drawsScene(view, await placeholderScene())
    expect((await root(view)).getAttribute('data-placeholder')).toBe('true')
  })

  it('renders the placeholder story', async () => {
    await drawsScene(render(Placeholder()), await placeholderScene())
  })

  it('warns and falls back to the placeholder for a name that is not registered', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const view = render(Illustration, { props: { name: 'not-a-real-scene' } })
    await drawsScene(view, await placeholderScene())
    expect((await root(view)).getAttribute('data-placeholder')).toBe('true')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('not-a-real-scene'))
    warn.mockRestore()
  })

  it('does not mark a registered scene as placeheld', async () => {
    const el = await root(render(Illustration, { props: { name: 'runtime' } }))
    expect(el.getAttribute('data-placeholder')).toBeNull()
  })

  it('keeps the placeholder decorative even when an ariaLabel is given', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const el = await root(
      render(Illustration, {
        props: { name: 'not-a-real-scene', ariaLabel: 'A scene nobody drew' }
      })
    )
    expect(el.getAttribute('aria-label')).toBeNull()
    expect(el.getAttribute('role')).toBeNull()
    expect(el.getAttribute('aria-hidden')).toBe('true')
    warn.mockRestore()
  })

  it('replaces the placeholder once a registered name resolves', async () => {
    const view = render(Illustration, { props: { name: '' } })
    await drawsScene(view, await placeholderScene())
    await view.rerender({ name: 'runtime' })
    await drawsScene(view, await sceneOf('runtime'))
    expect((await root(view)).getAttribute('data-placeholder')).toBeNull()
  })

  it('swaps the rendered scene when name changes', async () => {
    const view = render(Illustration, { props: { name: 'runtime' } })
    await drawsScene(view, await sceneOf('runtime'))
    await view.rerender({ name: 'preview' })
    await drawsScene(view, await sceneOf('preview'))
  })

  it('is decorative without an ariaLabel', async () => {
    const el = await root(render(Illustration, { props: { name: 'runtime' } }))
    expect(el.getAttribute('role')).toBeNull()
    expect(el.getAttribute('aria-hidden')).toBe('true')
  })

  it('carries the ariaLabel as the accessible name of an image when one is given', async () => {
    const el = await root(render(Labeled()))
    expect(el.getAttribute('role')).toBe('img')
    expect(el.getAttribute('aria-label')).toBe('An MCP server deployed behind the edge firewall')
    expect(el.getAttribute('aria-hidden')).toBeNull()
  })

  it('has no a11y violations when decorative', async () => {
    const view = render(Default())
    await root(view)
    await expectNoA11yViolations(view.container)
  })

  it('has no a11y violations when labeled', async () => {
    const view = render(Labeled())
    await root(view)
    await expectNoA11yViolations(view.container)
  })

  it('has no a11y violations showing the placeholder', async () => {
    const view = render(Placeholder())
    await root(view)
    await expectNoA11yViolations(view.container)
  })

  it('has no a11y violations rendering every registered scene', async () => {
    const view = render(Assets())
    await waitFor(() =>
      expect(at(view).getAllByTestId('content-illustration')).toHaveLength(
        illustrationAssetNames.length
      )
    )
    await expectNoA11yViolations(view.container)
  })
})
