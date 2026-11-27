import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { UNSAFE_URLS } from '../../../test/unsafe-urls'
import Embed from './embed.vue'
import { embedSandbox, embedSource } from './lib/sandbox'

const TESTID = 'embed'

const renderFramed = async (options: Parameters<typeof render>[1]) => {
  const view = render(Embed, options)
  await nextTick()
  return view
}

const props = {
  src: 'https://example.com/demo',
  title: 'An interactive demo of an edge function responding to a request'
}

describe('Embed', () => {
  it('renders the frame under the default testid', () => {
    const { getByTestId } = render(Embed, { props })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(Embed, {
      props,
      attrs: { 'data-testid': 'demo-embed' }
    })

    expect(getByTestId('demo-embed')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders a single iframe pointing at the src', async () => {
    const { container } = await renderFramed({ props })
    const frames = container.querySelectorAll('iframe')

    expect(frames).toHaveLength(1)
    expect(frames[0]).toHaveAttribute('src', props.src)
  })

  it('names the embedded document with the title prop', async () => {
    const { getByTitle } = await renderFramed({ props })

    expect(getByTitle(props.title).tagName).toBe('IFRAME')
  })

  it('keeps the title on the iframe rather than on the root', async () => {
    const { getByTestId, container } = await renderFramed({ props })

    expect(container.querySelector('iframe')).toHaveAttribute('title', props.title)
    expect(getByTestId(TESTID)).not.toHaveAttribute('title')
  })

  it('defers the document load until it is needed', async () => {
    const { container } = await renderFramed({ props })

    expect(container.querySelector('iframe')).toHaveAttribute('loading', 'lazy')
  })

  it('defaults the ratio to video', () => {
    const { getByTestId } = render(Embed, { props })

    expect(getByTestId(TESTID)).toHaveAttribute('data-ratio', 'video')
  })

  it.each(['video', 'square', 'wide'] as const)('mirrors the %s ratio on the root', (ratio) => {
    const { getByTestId } = render(Embed, { props: { ...props, ratio } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-ratio', ratio)
  })

  it('forwards a consumer class onto the root', () => {
    const { getByTestId } = render(Embed, {
      props,
      attrs: { class: 'max-w-(--container-4xl)' }
    })

    const root = getByTestId(TESTID)
    expect(root.tagName).toBe('SECTION')
    expect(root.className).toContain('max-w-(--container-4xl)')
  })

  it('sandboxes the frame without top-level navigation', async () => {
    const { container } = await renderFramed({ props })
    const sandbox = container.querySelector('iframe')?.getAttribute('sandbox')?.split(' ') ?? []

    expect(sandbox).toContain('allow-scripts')
    expect(sandbox).not.toContain('allow-top-navigation')
    expect(sandbox).not.toContain('allow-top-navigation-by-user-activation')
  })

  it('frames a foreign page with allow-same-origin once mounted', async () => {
    const { container } = await renderFramed({ props })
    expect(container.querySelector('iframe')?.getAttribute('sandbox')?.split(' ')).toContain(
      'allow-same-origin'
    )
  })

  it('drops allow-same-origin for a page of the embedding origin, so it cannot lift its sandbox', () => {
    const own = embedSandbox('https://app.example.com/demo', 'https://app.example.com').split(' ')
    expect(own).toContain('allow-scripts')
    expect(own).not.toContain('allow-same-origin')
    expect(embedSandbox('https://example.org/demo', 'https://app.example.com')).toContain(
      'allow-same-origin'
    )
  })

  it('frames only https', () => {
    expect(embedSource('https://example.com/demo')).toBe('https://example.com/demo')
    expect(embedSource('http://example.com/demo')).toBeNull()
  })

  it.each([
    ...UNSAFE_URLS,
    'about:blank',
    '/demo',
    '//example.com/demo',
    'ftp://example.com',
    'http://example.com/demo'
  ])('renders the title as text instead of framing %j', (src) => {
    const { container, getByTestId } = render(Embed, { props: { ...props, src } })

    expect(container.querySelector('iframe')).toBeNull()
    expect(getByTestId(`${TESTID}__unavailable`)).toHaveTextContent(props.title)
  })

  it('has no a11y violations', async () => {
    const { container } = render(Embed, { props })

    await expectNoA11yViolations(container)
  })
})
