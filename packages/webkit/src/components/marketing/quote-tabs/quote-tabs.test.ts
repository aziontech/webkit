import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import QuoteTabs, { type QuoteTabsItem } from './quote-tabs.vue'

const TESTID = 'marketing-quote-tabs'

const COLOUR_LOGO =
  'data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 10%22%3E%3Crect width=%2240%22 height=%2210%22 fill=%22%230086ff%22/%3E%3C/svg%3E'

const ITEMS: QuoteTabsItem[] = [
  {
    logo: COLOUR_LOGO,
    clientName: 'Magalu',
    text: 'Magalu guarantees high availability for hundreds of global-scale applications.',
    name: 'Allan Monteiro',
    jobTitle: 'CISO & Head of Technology at Magalu'
  },
  {
    mark: 'dafiti',
    text: 'Dafiti modernized its digital architecture to deliver faster experiences.',
    name: 'Dafiti',
    jobTitle: 'Retail'
  },
  {
    mark: 'herospark',
    clientName: 'Hero Spark Labs',
    shape: 'compact',
    text: 'HeroSpark serves every creator page from the edge.',
    name: 'Ana Souza',
    jobTitle: 'CTO at HeroSpark'
  },
  {
    clientName: 'Acme',
    text: 'Acme ships faster.',
    name: 'Joe Doe',
    jobTitle: 'CEO at Acme'
  }
]

const LIVE_TRANSITION = { stubs: { transition: false } }

const INTERVAL = 5000

function settle(): Promise<void> {
  return new Promise((resolve) => globalThis.setTimeout(resolve, 400))
}

function tabsOf(container: Element): globalThis.HTMLButtonElement[] {
  return [...container.querySelectorAll<globalThis.HTMLButtonElement>('[role="tab"]')]
}

function panelOf(container: Element): globalThis.HTMLElement {
  const panel = container.querySelector<globalThis.HTMLElement>('[role="tabpanel"]')
  expect(panel).not.toBeNull()
  return panel as globalThis.HTMLElement
}

function textOf(quotes: Iterable<Element>): string[] {
  return [...quotes].map((quote) => quote.textContent?.trim() ?? '')
}

function quotationsOf(container: Element): string[] {
  return textOf(
    [...panelOf(container).querySelectorAll('blockquote')].filter(
      (quote) => quote.closest('[aria-hidden="true"]') === null
    )
  )
}

function sizerQuotationsOf(container: Element): string[] {
  const sizer = panelOf(container).querySelector(`[data-testid="${TESTID}__sizer"]`)
  expect(sizer).not.toBeNull()
  return textOf(sizer?.querySelectorAll('blockquote') ?? [])
}

function layersOf(container: Element): globalThis.HTMLElement[] {
  return [
    ...panelOf(container).querySelectorAll<globalThis.HTMLElement>(
      `[data-testid="${TESTID}__quote"]`
    )
  ]
}

function layerOf(container: Element): globalThis.HTMLElement {
  const exposed = layersOf(container).filter((layer) => !layer.hasAttribute('aria-hidden'))
  expect(exposed).toHaveLength(1)
  return exposed[0]
}

function selectedIndex(container: Element): number {
  return tabsOf(container).findIndex((tab) => tab.getAttribute('aria-selected') === 'true')
}

async function press(container: Element, key: string, expected: number): Promise<void> {
  await fireEvent.keyDown(tabsOf(container)[selectedIndex(container)], { key })
  await waitFor(() => expect(globalThis.document.activeElement).toBe(tabsOf(container)[expected]))
}

function progressOf(container: Element): globalThis.HTMLElement | null {
  return panelOf(container).querySelector<globalThis.HTMLElement>(
    `[data-testid="${TESTID}__progress"]`
  )
}

afterEach(() => {
  vi.useRealTimers()
})

describe('QuoteTabs', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = render(QuoteTabs, { props: { items: ITEMS } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(QuoteTabs, {
      props: { items: ITEMS },
      attrs: { 'data-testid': 'client-stories' }
    })

    expect(getByTestId('client-stories')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders nothing when there are no items', () => {
    const { container, queryByTestId } = render(QuoteTabs, { props: { items: [] } })

    expect(queryByTestId(TESTID)).toBeNull()
    expect(container.querySelector('[role="tablist"]')).toBeNull()
  })

  it('makes the wall the named tablist, one tab per client named by its client', () => {
    const { container, getByRole, getAllByRole } = render(QuoteTabs, {
      props: { items: ITEMS, ariaLabel: 'Client stories' }
    })
    const wall = getByRole('tablist', { name: 'Client stories' })

    expect(wall.compareDocumentPosition(panelOf(container))).toBe(
      globalThis.Node.DOCUMENT_POSITION_PRECEDING
    )
    expect(getAllByRole('tab').map((tab) => tab.getAttribute('aria-label'))).toEqual([
      'Magalu',
      'Dafiti',
      'Hero Spark Labs',
      'Acme'
    ])
    expect(container.querySelectorAll(`[data-testid="${TESTID}__tab"]`)).toHaveLength(ITEMS.length)
    expect(selectedIndex(container)).toBe(0)
  })

  it('keeps only the selected card in the tab order', () => {
    const { container } = render(QuoteTabs, { props: { items: ITEMS, modelValue: 1 } })

    expect(tabsOf(container).map((tab) => tab.getAttribute('tabindex'))).toEqual([
      '-1',
      '0',
      '-1',
      '-1'
    ])
  })

  it('wires the cards and the panel to each other', () => {
    const { container, getByTestId } = render(QuoteTabs, { props: { items: ITEMS } })
    const panel = panelOf(container)

    expect(getByTestId(`${TESTID}__panel`)).toBe(panel)
    expect(panel).toHaveAttribute('tabindex', '0')
    expect(panel.id).not.toBe('')
    expect(panel).toHaveAttribute('aria-labelledby', tabsOf(container)[0].id)
    for (const tab of tabsOf(container)) {
      expect(tab).toHaveAttribute('aria-controls', panel.id)
    }
  })

  it('exposes only the selected quotation in the panel', () => {
    const { container } = render(QuoteTabs, { props: { items: ITEMS } })

    expect(quotationsOf(container)).toEqual([ITEMS[0].text])
    expect(layerOf(container).querySelector('figcaption')?.textContent).toContain('Allan Monteiro')
  })

  it('holds every quotation once in a hidden, inert sizer so the panel keeps one height', async () => {
    const { container } = render(QuoteTabs, { props: { items: ITEMS } })
    const sizer = panelOf(container).querySelector(`[data-testid="${TESTID}__sizer"]`)

    expect(sizer).toHaveAttribute('aria-hidden', 'true')
    expect(sizer).toHaveAttribute('inert')
    expect(sizerQuotationsOf(container)).toEqual(ITEMS.map((item) => item.text))
    expect(sizer?.querySelector('[data-testid="marketing-quote"]')).toBeNull()

    await fireEvent.click(tabsOf(container)[3])

    expect(sizerQuotationsOf(container)).toEqual(ITEMS.map((item) => item.text))
    expect(quotationsOf(container)).toEqual([ITEMS[3].text])
  })

  it('draws the panel as a frame with only its bottom seam and all four corner marks', () => {
    const { container } = render(QuoteTabs, { props: { items: ITEMS } })

    expect(panelOf(container)).toHaveAttribute('data-testid', `${TESTID}__panel`)
    expect(panelOf(container)).toHaveAttribute('data-borders', 'bottom')
    expect(panelOf(container)).toHaveAttribute(
      'data-marks',
      'top-left top-right bottom-left bottom-right'
    )
  })

  it('selects a card on click, emits its index and swaps the quotation', async () => {
    const { container, emitted } = render(QuoteTabs, {
      props: { items: ITEMS },
      global: LIVE_TRANSITION
    })

    await fireEvent.click(tabsOf(container)[2])
    await settle()

    expect(emitted()['update:modelValue']).toEqual([[2]])
    expect(selectedIndex(container)).toBe(2)
    expect(quotationsOf(container)).toEqual([ITEMS[2].text])
    expect(panelOf(container)).toHaveAttribute('aria-labelledby', tabsOf(container)[2].id)
  })

  it('hides the leaving quotation from assistive tech and brings the next one in after it', async () => {
    const { container } = render(QuoteTabs, {
      props: { items: ITEMS },
      global: LIVE_TRANSITION
    })

    await fireEvent.click(tabsOf(container)[1])

    const leaving = layersOf(container).filter(
      (layer) => layer.getAttribute('aria-hidden') === 'true'
    )
    const staying = layersOf(container).filter(
      (layer) => layer.getAttribute('aria-hidden') !== 'true'
    )
    expect(staying).toHaveLength(0)
    expect(leaving).toHaveLength(1)
    expect(leaving[0].querySelector('blockquote')?.textContent?.trim()).toBe(ITEMS[0].text)

    await settle()

    expect(layersOf(container)).toHaveLength(1)
    expect(quotationsOf(container)).toEqual([ITEMS[1].text])
  })

  it('follows a bound modelValue', async () => {
    const { container, rerender } = render(QuoteTabs, {
      props: { items: ITEMS, modelValue: 1 },
      global: LIVE_TRANSITION
    })

    expect(quotationsOf(container)).toEqual([ITEMS[1].text])

    await rerender({ items: ITEMS, modelValue: 0 })
    await settle()

    expect(quotationsOf(container)).toEqual([ITEMS[0].text])
    expect(panelOf(container)).toHaveAttribute('data-direction', 'back')
  })

  it('clamps a modelValue past the end to the last card', () => {
    const { container } = render(QuoteTabs, { props: { items: ITEMS, modelValue: 9 } })

    expect(selectedIndex(container)).toBe(ITEMS.length - 1)
    expect(quotationsOf(container)).toEqual([ITEMS[3].text])
  })

  it('moves the selection and focus with the arrow keys, wrapping at either end', async () => {
    const { container, emitted } = render(QuoteTabs, { props: { items: ITEMS } })
    tabsOf(container)[0].focus()

    await press(container, 'ArrowRight', 1)
    await press(container, 'ArrowLeft', 0)
    await press(container, 'ArrowLeft', 3)
    await press(container, 'ArrowRight', 0)

    expect(emitted()['update:modelValue']).toEqual([[1], [0], [3], [0]])
  })

  it('jumps to the first and last card with Home and End', async () => {
    const { container } = render(QuoteTabs, { props: { items: ITEMS, modelValue: 1 } })

    await press(container, 'End', 3)
    await settle()
    expect(quotationsOf(container)).toEqual([ITEMS[3].text])

    await press(container, 'Home', 0)
    await settle()
    expect(quotationsOf(container)).toEqual([ITEMS[0].text])
  })

  it('travels forward after moving right and back after moving left', async () => {
    const { container } = render(QuoteTabs, { props: { items: ITEMS } })
    const panel = panelOf(container)

    await press(container, 'ArrowRight', 1)
    expect(panel).toHaveAttribute('data-direction', 'forward')

    await press(container, 'ArrowLeft', 0)
    expect(panel).toHaveAttribute('data-direction', 'back')

    await press(container, 'ArrowLeft', 3)
    expect(panel).toHaveAttribute('data-direction', 'back')

    await press(container, 'ArrowRight', 0)
    expect(panel).toHaveAttribute('data-direction', 'forward')

    await fireEvent.click(tabsOf(container)[2])
    expect(panel).toHaveAttribute('data-direction', 'forward')

    await press(container, 'Home', 0)
    expect(panel).toHaveAttribute('data-direction', 'back')
  })

  it('never links or reveals a story label in the band', () => {
    const { container, queryAllByRole, queryByText } = render(QuoteTabs, {
      props: { items: ITEMS }
    })

    expect(queryAllByRole('link')).toHaveLength(0)
    expect(container.querySelector('a')).toBeNull()
    expect(queryByText(/read story/i)).toBeNull()
  })

  it('keeps every card artwork decorative', async () => {
    const { container } = render(QuoteTabs, { props: { items: ITEMS } })

    await waitFor(() => {
      expect(tabsOf(container)[1].querySelector('svg[data-mark="dafiti"]')).not.toBeNull()
    })
    const [logoCard, markCard, compactCard, nameCard] = tabsOf(container)

    expect(logoCard.querySelector('img')).toHaveAttribute('src', COLOUR_LOGO)
    expect(logoCard.querySelector('img')).toHaveAttribute('alt', '')
    expect(markCard.querySelector('svg[data-mark="dafiti"]')).toHaveAttribute('aria-hidden', 'true')
    await waitFor(() => {
      expect(compactCard.querySelector('svg[data-mark="herospark"]')).toHaveAttribute(
        'data-shape',
        'compact'
      )
    })
    expect(nameCard.querySelector('[aria-hidden="true"]')?.textContent?.trim()).toBe('Acme')
  })

  it('draws a colour logo in the panel as an image named by the client', () => {
    const { container } = render(QuoteTabs, { props: { items: ITEMS } })
    const image = layerOf(container).querySelector('img')

    expect(image).toHaveAttribute('src', COLOUR_LOGO)
    expect(image).toHaveAttribute('alt', 'Magalu')
  })

  it('draws a registered mark in the panel in one ink, hidden from assistive tech', async () => {
    const { container } = render(QuoteTabs, { props: { items: ITEMS, modelValue: 1 } })

    await waitFor(() => {
      expect(layerOf(container).querySelector('svg[data-mark="dafiti"]')).toHaveAttribute(
        'aria-hidden',
        'true'
      )
    })
    expect(layerOf(container).querySelector('img:not([aria-hidden])')).toBeNull()
  })

  it('writes the client name as the mark on a card and in the panel without artwork', () => {
    const { container } = render(QuoteTabs, { props: { items: ITEMS, modelValue: 3 } })
    const card = tabsOf(container)[3]

    expect(card.querySelector('img, svg')).toBeNull()
    expect(card).toHaveAttribute('aria-label', 'Acme')
    expect(layerOf(container).querySelector('[aria-hidden="true"]')?.textContent?.trim()).toBe(
      'Acme'
    )
  })

  it('exposes the actions slot once, in the featured quotation, across a switch', async () => {
    const { container, getAllByRole } = render(QuoteTabs, {
      props: { items: ITEMS },
      slots: { actions: () => h('a', { href: '/customers' }, 'All success stories') }
    })

    expect(getAllByRole('link', { name: 'All success stories' })).toHaveLength(1)
    expect(layerOf(container).querySelector('a[href="/customers"]')).not.toBeNull()

    const sizer = panelOf(container).querySelector(`[data-testid="${TESTID}__sizer"]`)
    expect(sizer?.querySelectorAll('a[href="/customers"]')).toHaveLength(ITEMS.length)

    await fireEvent.click(tabsOf(container)[2])
    await settle()

    expect(getAllByRole('link', { name: 'All success stories' })).toHaveLength(1)
    expect(layerOf(container).querySelector('a[href="/customers"]')).not.toBeNull()
    expect(quotationsOf(container)).toEqual([ITEMS[2].text])
  })

  it('draws no actions area when the actions slot is empty', () => {
    const { container: bare } = render(QuoteTabs, { props: { items: ITEMS } })
    const { container: filled } = render(QuoteTabs, {
      props: { items: ITEMS },
      slots: { actions: () => h('a', { href: '/customers' }, 'All success stories') }
    })
    const bareFigure = layerOf(bare).querySelector('figure')
    const filledFigure = layerOf(filled).querySelector('figure')

    expect(filledFigure?.children.length).toBe((bareFigure?.children.length ?? 0) + 1)
    expect(bare.querySelector('a')).toBeNull()
  })

  it('marks a running band with data-autoplay and draws a decorative hairline in the panel', () => {
    const { container, getByTestId } = render(QuoteTabs, { props: { items: ITEMS } })

    expect(getByTestId(TESTID).getAttribute('data-autoplay')).not.toBeNull()
    expect(progressOf(container)).not.toBeNull()
    expect(progressOf(container)).toHaveAttribute('aria-hidden', 'true')
  })

  it('advances to the next client once the interval elapses', async () => {
    vi.useFakeTimers()
    const { container, emitted } = render(QuoteTabs, {
      props: { items: ITEMS, autoPlayInterval: INTERVAL }
    })

    vi.advanceTimersByTime(INTERVAL / 2)
    await nextTick()

    expect(selectedIndex(container)).toBe(0)
    expect(progressOf(container)?.style.width).toBe('50%')

    vi.advanceTimersByTime(INTERVAL / 2)
    await nextTick()

    expect(selectedIndex(container)).toBe(1)
    expect(emitted()['update:modelValue']).toEqual([[1]])
    expect(progressOf(container)?.style.width).toBe('0%')
  })

  it('wraps from the last client to the first, travelling forward', async () => {
    vi.useFakeTimers()
    const { container } = render(QuoteTabs, {
      props: { items: ITEMS, autoPlayInterval: INTERVAL }
    })

    vi.advanceTimersByTime(INTERVAL * ITEMS.length)
    await nextTick()

    expect(selectedIndex(container)).toBe(0)
    expect(panelOf(container)).toHaveAttribute('data-direction', 'forward')
  })

  it('never moves on its own and draws no hairline when autoPlay is off', async () => {
    vi.useFakeTimers()
    const { container, getByTestId } = render(QuoteTabs, {
      props: { items: ITEMS, autoPlay: false, autoPlayInterval: INTERVAL }
    })

    expect(getByTestId(TESTID).getAttribute('data-autoplay')).toBeNull()
    expect(progressOf(container)).toBeNull()

    vi.advanceTimersByTime(INTERVAL * 3)
    await nextTick()

    expect(selectedIndex(container)).toBe(0)
  })

  it('draws no hairline when showProgress is off, while the band still advances', async () => {
    vi.useFakeTimers()
    const { container } = render(QuoteTabs, {
      props: { items: ITEMS, showProgress: false, autoPlayInterval: INTERVAL }
    })

    expect(progressOf(container)).toBeNull()

    vi.advanceTimersByTime(INTERVAL)
    await nextTick()

    expect(selectedIndex(container)).toBe(1)
  })

  it('pauses while the pointer rests on the band, and resumes on leave', async () => {
    vi.useFakeTimers()
    const { container, getByTestId } = render(QuoteTabs, {
      props: { items: ITEMS, autoPlayInterval: INTERVAL }
    })
    const root = getByTestId(TESTID)

    await fireEvent.pointerEnter(root)
    expect(root.getAttribute('data-autoplay')).toBeNull()

    vi.advanceTimersByTime(INTERVAL * 2)
    await nextTick()
    expect(selectedIndex(container)).toBe(0)

    await fireEvent.pointerLeave(root)
    expect(root.getAttribute('data-autoplay')).not.toBeNull()
  })

  it('restarts the count on a click and keeps running with the pointer on the band', async () => {
    vi.useFakeTimers()
    const { container, getByTestId } = render(QuoteTabs, {
      props: { items: ITEMS, autoPlayInterval: INTERVAL }
    })
    const root = getByTestId(TESTID)

    vi.advanceTimersByTime(INTERVAL / 2)
    await fireEvent.pointerEnter(root)
    await fireEvent.click(tabsOf(container)[2])

    expect(root.getAttribute('data-autoplay')).not.toBeNull()
    expect(progressOf(container)?.style.width).toBe('0%')

    vi.advanceTimersByTime(INTERVAL)
    await nextTick()

    expect(selectedIndex(container)).toBe(3)
  })

  it('has no a11y violations', async () => {
    const { container } = render(QuoteTabs, {
      props: { items: ITEMS, ariaLabel: 'Client stories' },
      slots: { actions: () => h('a', { href: '/customers' }, 'All success stories') }
    })

    await waitFor(() => {
      expect(tabsOf(container)[1].querySelector('svg[data-mark="dafiti"]')).not.toBeNull()
    })
    await expectNoA11yViolations(container)
  })
})
