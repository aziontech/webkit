import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent as browserUser } from 'vitest/browser'

import { expectNoA11yViolations } from '../../../test/axe'
import ArticleHighlight from './article-highlight.vue'

const TESTID = 'sections-article-highlight'
const WALL = 'Highlight articles'

const items = [
  {
    key: 'portfolio',
    href: '/blog/portfolio',
    image: '/media/portfolio.png',
    highlightImage: '/media/portfolio-highlight.png',
    meta: 'Developers • SEP 25, 2026',
    title: 'How I Shipped My Portfolio',
    description: 'From template to live URL.',
    readTime: '9 min read'
  },
  {
    key: 'latency',
    href: '/blog/latency',
    image: '/media/latency.png',
    meta: 'Serverless • SEP 23, 2026',
    title: 'How Do You Reduce AI Agent Latency?',
    description: 'Where latency builds up.',
    readTime: '8 min read'
  },
  {
    key: 'alternatives',
    href: '/blog/alternatives',
    image: '/media/alternatives.png',
    meta: 'Security • SEP 22, 2026',
    title: 'Best Cloudflare Alternatives',
    description: 'Compare six alternatives.',
    readTime: '13 min read'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(ArticleHighlight, {
    props: { items, actionLabel: 'Read article', ariaLabel: WALL, ...props }
  })

const panelHeadline = (getByRole: ReturnType<typeof band>['getByRole']) =>
  getByRole('heading', { level: 2 }).textContent?.trim()

const highlightOf = (getByTestId: ReturnType<typeof band>['getByTestId']) =>
  getByTestId(TESTID).querySelector('[role="tabpanel"]')!.parentElement as HTMLElement

const leave = async (getByTestId: ReturnType<typeof band>['getByTestId']) => {
  await browserUser.unhover(highlightOf(getByTestId))
  await fireEvent.pointerLeave(highlightOf(getByTestId))
}

describe('ArticleHighlight', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ArticleHighlight, {
      props: { items },
      attrs: { 'data-testid': 'highlight' }
    })

    expect(getByTestId('highlight')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'articles' })

    expect(getByTestId(TESTID).id).toBe('articles')
  })

  it('renders no id when the anchor is empty', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).hasAttribute('id')).toBe(false)
  })

  it('renders one tab per article in a named tablist, the first selected', () => {
    const { getByRole, getAllByRole } = band()

    expect(getByRole('tablist', { name: WALL })).toBeInTheDocument()
    const tabs = getAllByRole('tab')
    expect(tabs).toHaveLength(items.length)
    expect(tabs.map((tab) => tab.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false'])
    expect(tabs.map((tab) => tab.getAttribute('tabindex'))).toEqual(['0', '-1', '-1'])
  })

  it('labels the panel by the selected tab and links it back', () => {
    const { getByRole, getAllByRole } = band()

    const [first] = getAllByRole('tab')
    const panel = getByRole('tabpanel')
    expect(panel.getAttribute('aria-labelledby')).toBe(first?.id)
    expect(first?.getAttribute('aria-controls')).toBe(panel.id)
  })

  it('features the first article with its highlight cover and action', () => {
    const { getByRole } = band()

    expect(panelHeadline(getByRole)).toBe(items[0]?.title)
    const panel = getByRole('tabpanel')
    expect(panel.querySelector('article img')?.getAttribute('src')).toBe(items[0]?.highlightImage)
    expect(getByRole('link', { name: /Read article/ }).getAttribute('href')).toBe(items[0]?.href)
  })

  it('swaps the panel when a tab is clicked', async () => {
    const { getByRole, getAllByRole } = band()

    await userEvent.click(getAllByRole('tab')[1] as HTMLElement)

    expect(panelHeadline(getByRole)).toBe(items[1]?.title)
    expect(getAllByRole('tab')[1]?.getAttribute('aria-selected')).toBe('true')
    const panel = getByRole('tabpanel')
    expect(panel.querySelector('article img')?.getAttribute('src')).toBe(items[1]?.image)
  })

  it('moves the selection and focus with the arrow, Home and End keys', async () => {
    const { getByRole, getAllByRole } = band()

    const tabs = getAllByRole('tab')
    tabs[0]?.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(getAllByRole('tab')[1])
    expect(panelHeadline(getByRole)).toBe(items[1]?.title)

    await userEvent.keyboard('{End}')
    expect(document.activeElement).toBe(getAllByRole('tab')[2])

    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(getAllByRole('tab')[0])

    await userEvent.keyboard('{ArrowLeft}')
    expect(document.activeElement).toBe(getAllByRole('tab')[2])

    await userEvent.keyboard('{Home}')
    expect(document.activeElement).toBe(getAllByRole('tab')[0])
    expect(panelHeadline(getByRole)).toBe(items[0]?.title)
  })

  it('opens on the article bound through v-model, clamps past the ends and writes a click back', async () => {
    const { getByRole, getAllByRole, emitted, rerender } = band({ modelValue: 1 })

    expect(panelHeadline(getByRole)).toBe(items[1]?.title)
    expect(getAllByRole('tab')[1]?.getAttribute('aria-selected')).toBe('true')

    await userEvent.click(getAllByRole('tab')[0] as HTMLElement)
    expect(emitted<[number]>('update:modelValue').at(-1)).toEqual([0])

    await rerender({ modelValue: 99 })
    expect(getAllByRole('tab').at(-1)?.getAttribute('aria-selected')).toBe('true')
  })

  it('runs the wall one column per article, three to five', () => {
    const more = (count: number) =>
      Array.from({ length: count }, (_, index) => ({
        ...items[0],
        key: `extra-${index}`,
        title: `Extra ${index}`
      }))
    const three = band()
    expect(three.getByRole('tablist').getAttribute('data-columns')).toBe('3')
    three.unmount()

    const four = band({ items: [...items, ...more(1)] })
    expect(four.getByRole('tablist').getAttribute('data-columns')).toBe('4')
    four.unmount()

    const five = band({ items: [...items, ...more(2)] })
    expect(five.getByRole('tablist').getAttribute('data-columns')).toBe('5')
    five.unmount()

    const { getByRole } = band({ items: [...items, ...more(4)] })
    expect(getByRole('tablist').getAttribute('data-columns')).toBe('5')
  })

  it('advances on its own with autoplay and draws the progress line', async () => {
    const { getByRole, getByTestId, getAllByRole } = band({ autoplay: true, autoplayInterval: 300 })

    await waitFor(() => expect(getByTestId(`${TESTID}__progress`)).toBeInTheDocument())
    await leave(getByTestId)
    await waitFor(
      () => expect(getAllByRole('tab')[1]?.getAttribute('aria-selected')).toBe('true'),
      {
        timeout: 2000
      }
    )
    await waitFor(() => expect(panelHeadline(getByRole)).toBe(items[1]?.title))
  })

  it('writes each autoplay step back through v-model', async () => {
    const steps: number[] = []
    const { getByTestId } = band({
      autoplay: true,
      autoplayInterval: 200,
      'onUpdate:modelValue': (value: number) => steps.push(value)
    })
    await leave(getByTestId)

    await waitFor(() => expect(steps).toContain(1), { timeout: 2000 })
  })

  it('offers a pause control while autoplay runs that stops and resumes the rotation', async () => {
    const { getByTestId, getAllByRole, findByRole, getByRole } = band({
      autoplay: true,
      autoplayInterval: 200
    })

    const root = highlightOf(getByTestId)
    const control = await findByRole('button', { name: 'Pause rotation' })
    await fireEvent.click(control)
    await leave(getByTestId)
    expect(root).toHaveAttribute('data-paused')
    expect(root.hasAttribute('data-autoplay')).toBe(false)
    const selected = () =>
      getAllByRole('tab').findIndex((tab) => tab.getAttribute('aria-selected') === 'true')
    const held = selected()
    await new Promise((resolve) => setTimeout(resolve, 500))
    expect(selected()).toBe(held)

    await fireEvent.click(getByRole('button', { name: 'Resume rotation' }))
    await waitFor(() => expect(root.hasAttribute('data-autoplay')).toBe(true))
  })

  it('pauses while the pointer is over the band', async () => {
    const { getByTestId, getAllByRole } = band({ autoplay: true, autoplayInterval: 200 })

    const root = highlightOf(getByTestId)
    await leave(getByTestId)
    await waitFor(() => expect(root.hasAttribute('data-autoplay')).toBe(true))
    await fireEvent.pointerEnter(root)
    await waitFor(() => expect(root.hasAttribute('data-autoplay')).toBe(false))
    const selected = () =>
      getAllByRole('tab').findIndex((tab) => tab.getAttribute('aria-selected') === 'true')
    const paused = selected()

    await new Promise((resolve) => setTimeout(resolve, 500))
    expect(selected()).toBe(paused)

    await fireEvent.pointerLeave(root)
    await waitFor(() => expect(root.hasAttribute('data-autoplay')).toBe(true))
  })

  it('does not autoplay by default or with one article', async () => {
    const off = band()
    expect(off.queryByTestId(`${TESTID}__progress`)).toBeNull()
    off.unmount()

    const { queryByTestId } = band({ autoplay: true, items: [items[0]] })
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(queryByTestId(`${TESTID}__progress`)).toBeNull()
  })

  it('marks the slide direction on the panel', async () => {
    const { getAllByRole, getByRole } = band()

    await userEvent.click(getAllByRole('tab')[2]!)
    expect(getByRole('tabpanel').getAttribute('data-direction')).toBe('forward')

    await userEvent.click(getAllByRole('tab')[0]!)
    expect(getByRole('tabpanel').getAttribute('data-direction')).toBe('back')
  })

  it('sets data-fill when fill is on', () => {
    const { getByTestId } = band({ fill: true })

    expect(getByTestId(TESTID).querySelector('[data-fill]')).not.toBeNull()
  })

  it('omits the button when actionLabel is empty', () => {
    const { queryByRole } = band({ actionLabel: '' })

    expect(queryByRole('link', { name: /Read article/ })).toBeNull()
  })

  it('renders only the section when items is empty', () => {
    const { getByTestId, queryByRole } = band({ items: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('tablist')).toBeNull()
  })

  it('has no a11y violations', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  describe('on phones', () => {
    it('keeps the layout sizer from widening the panel', () => {
      const view = render(ArticleHighlight, { props: { items } })
      const sizer = view.container.querySelector('[inert]')

      expect(sizer?.className).toContain('min-w-0')
    })
  })
})
