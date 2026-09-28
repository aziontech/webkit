import { composeStories } from '@storybook/vue3'
import { render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/content/illustration/Illustration.stories'
import {
  illustrationAssetNames,
  loadIllustrationPlaceholder,
  resolveIllustrationAsset
} from '../../../assets/illustrations/registry'
import { expectNoA11yViolations } from '../../../test/axe'
import Illustration from './illustration.vue'

const { Default, Assets, Labeled, Placeholder } = composeStories(stories)

// Queries are scoped to each render's own container: testing-library's `getByTestId`
// searches the whole document, so two renders in one test would collide.
const at = (view: ReturnType<typeof render>) => within(view.container)

// The scene resolves through a dynamic import, so the root lands a tick after mount.
const root = (view: ReturnType<typeof render>, testId = 'content-illustration') =>
  at(view).findByTestId(testId)

/** The URL a registered scene resolves to, for comparing against a rendered `src`. */
const urlOf = async (name: string) => (await resolveIllustrationAsset(name)!()).default

/** The URL the fallback frame resolves to. */
const placeholderUrl = async () => (await loadIllustrationPlaceholder()).default

describe('Illustration', () => {
  // ---- Render ----------------------------------------------------------------

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
    expect(el.className).toContain('max-w-md')
    expect(el.className).toContain('w-full')
  })

  // ---- name ------------------------------------------------------------------

  it.each(illustrationAssetNames)('renders the registered scene %s', async (name) => {
    const view = render(Illustration, { props: { name } })
    const el = await root(view)
    expect(el.tagName).toBe('IMG')
    expect(el.getAttribute('src')).toBe(await urlOf(name))
  })

  it('reserves the canvas aspect ratio before the SVG loads', async () => {
    const el = await root(render(Illustration, { props: { name: 'runtime' } }))
    expect(el.getAttribute('width')).toBe('592')
    expect(el.getAttribute('height')).toBe('300')
  })

  // ---- Placeholder fallback --------------------------------------------------

  it('falls back to the placeholder when name is empty', async () => {
    const el = await root(render(Illustration))
    expect(el.getAttribute('src')).toBe(await placeholderUrl())
    expect(el.getAttribute('data-placeholder')).toBe('true')
  })

  it('renders the placeholder story', async () => {
    const el = await root(render(Placeholder()))
    expect(el.getAttribute('src')).toBe(await placeholderUrl())
  })

  it('warns and falls back to the placeholder for a name that is not registered', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const el = await root(render(Illustration, { props: { name: 'not-a-real-scene' } }))
    expect(el.getAttribute('src')).toBe(await placeholderUrl())
    expect(el.getAttribute('data-placeholder')).toBe('true')
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
    expect(el.getAttribute('alt')).toBe('')
    expect(el.getAttribute('aria-hidden')).toBe('true')
    warn.mockRestore()
  })

  it('replaces the placeholder once a registered name resolves', async () => {
    const view = render(Illustration, { props: { name: '' } })
    expect((await root(view)).getAttribute('src')).toBe(await placeholderUrl())
    await view.rerender({ name: 'runtime' })
    const runtimeUrl = await urlOf('runtime')
    await waitFor(async () => {
      expect((await root(view)).getAttribute('src')).toBe(runtimeUrl)
    })
    expect((await root(view)).getAttribute('data-placeholder')).toBeNull()
  })

  it('swaps the rendered scene when name changes', async () => {
    const view = render(Illustration, { props: { name: 'runtime' } })
    expect((await root(view)).getAttribute('src')).toBe(await urlOf('runtime'))
    await view.rerender({ name: 'preview' })
    const previewUrl = await urlOf('preview')
    await waitFor(async () => {
      expect((await root(view)).getAttribute('src')).toBe(previewUrl)
    })
  })

  // ---- ARIA ------------------------------------------------------------------

  it('is decorative without an ariaLabel', async () => {
    const el = await root(render(Illustration, { props: { name: 'runtime' } }))
    expect(el.getAttribute('alt')).toBe('')
    expect(el.getAttribute('aria-hidden')).toBe('true')
  })

  it('carries the ariaLabel as the image alt when one is given', async () => {
    const el = await root(render(Labeled()))
    expect(el.getAttribute('alt')).toBe('An MCP server deployed behind the edge firewall')
    expect(el.getAttribute('aria-hidden')).toBeNull()
  })

  // ---- a11y ------------------------------------------------------------------

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
