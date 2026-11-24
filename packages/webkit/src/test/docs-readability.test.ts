import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import DocCallout from '../components/docs/doc-callout/doc-callout.vue'
import DocFrame from '../components/docs/doc-frame/doc-frame.vue'
import DocLayout from '../components/docs/doc-layout/doc-layout.vue'
import DocProse from '../components/docs/doc-prose/doc-prose.vue'

const LONG = 'Purge removes a cached object from every location before its time to live runs out. '

describe('docs readability (styled)', () => {
  it('styles a plain link in a DocFrame caption apart from the caption text', () => {
    const { getByTestId, getByRole } = render(() =>
      h(
        DocFrame,
        { src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', alt: 'Empty' },
        {
          caption: () => [
            'See the ',
            h('a', { href: 'https://example.com/docs' }, 'CLI reference'),
            '.'
          ]
        }
      )
    )
    const caption = getComputedStyle(getByTestId('doc-frame__caption'))
    const link = getComputedStyle(getByRole('link', { name: 'CLI reference' }))
    expect(link.textDecorationLine).toContain('underline')
    expect(link.color).not.toBe(caption.color)
  })

  it('sets DocCallout copy in the body style with no tightened tracking', () => {
    const { getByTestId } = render(() =>
      h(DocCallout, { variant: 'note' }, () => 'Warm-up is per location, not global.')
    )
    const copy = getByTestId('doc-callout').querySelector<HTMLElement>('[data-code-copy]')!
    const style = getComputedStyle(copy)
    expect(['normal', '0px']).toContain(style.letterSpacing)
    expect(Number.parseFloat(style.fontSize)).toBeGreaterThanOrEqual(14)
  })

  it('caps running text at a reading measure and leaves blocks full width', () => {
    const { container } = render(() =>
      h('div', { style: 'width: 1200px' }, [
        h(DocProse, null, () => [
          h('p', LONG.repeat(6)),
          h('pre', { 'data-doc-block': '' }, [h('code', 'azion deploy')])
        ])
      ])
    )
    const paragraph = container.querySelector('p')!.getBoundingClientRect()
    const block = container.querySelector('pre')!.getBoundingClientRect()
    expect(paragraph.width).toBeLessThanOrEqual(644 + 1)
    expect(block.width).toBeGreaterThan(paragraph.width)
  })
  it.each([
    [320, 'none'],
    [1280, 'inline']
  ])('at %ipx the DocLayout header shows the Docs badge only when it fits', (width, display) => {
    const { container } = render(() =>
      h('div', { style: `width: ${width}px` }, [
        h(DocLayout, {
          navigation: [{ label: 'Docs', items: [{ id: 'a', label: 'A', href: '/a' }] }]
        })
      ])
    )
    const badge = container.querySelector<HTMLElement>('[data-testid="app-header-brand__label"]')!
    expect(getComputedStyle(badge).display === 'none').toBe(display === 'none')
  })
})
