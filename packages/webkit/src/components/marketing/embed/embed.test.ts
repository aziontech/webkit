import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import Embed from './embed.vue'

const TESTID = 'marketing-embed'

const props = {
  src: 'about:blank',
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

  it('renders a single iframe pointing at the src', () => {
    const { container } = render(Embed, { props })
    const frames = container.querySelectorAll('iframe')

    expect(frames).toHaveLength(1)
    expect(frames[0]).toHaveAttribute('src', props.src)
  })

  it('names the embedded document with the title prop', () => {
    const { getByTitle } = render(Embed, { props })

    expect(getByTitle(props.title).tagName).toBe('IFRAME')
  })

  it('keeps the title on the iframe rather than on the root', () => {
    const { getByTestId, container } = render(Embed, { props })

    expect(container.querySelector('iframe')).toHaveAttribute('title', props.title)
    expect(getByTestId(TESTID)).not.toHaveAttribute('title')
  })

  it('defers the document load until it is needed', () => {
    const { container } = render(Embed, { props })

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

  it('has no a11y violations', async () => {
    const { container } = render(Embed, { props })

    await expectNoA11yViolations(container)
  })
})
