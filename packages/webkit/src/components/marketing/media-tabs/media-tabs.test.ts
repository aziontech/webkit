import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import MediaTabs, { type MediaTabsItem } from './media-tabs.vue'

const TESTID = 'marketing-media-tabs'

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

const ITEMS: MediaTabsItem[] = [
  {
    title: 'Run AI models close to users',
    description: 'Execute models across hundreds of locations with median latency under 30 ms.',
    src: PIXEL,
    alt: 'Inference running at the locations closest to each user'
  },
  {
    title: 'Keep every inference accounted for',
    description: 'Meter tokens, latency and cost per model as the traffic happens.',
    src: PIXEL,
    alt: 'Token and latency counters updating as requests arrive'
  },
  {
    title: 'Ship a model the way you ship code',
    description: 'One command puts a new revision in every location at once.',
    src: PIXEL,
    alt: 'A model revision rolling out across the platform'
  }
]

const INTERVAL = 5000

function rowsOf(container: HTMLElement): globalThis.HTMLLIElement[] {
  const list = container.querySelector('ul')
  return list ? ([...list.children] as globalThis.HTMLLIElement[]) : []
}

function activeTitles(container: HTMLElement): string[] {
  return rowsOf(container)
    .filter((row) => row.getAttribute('data-active') !== null)
    .map((row) => row.querySelector('button')?.textContent?.trim() ?? '')
}

afterEach(() => {
  vi.useRealTimers()
})

describe('MediaTabs', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = render(MediaTabs, { props: { items: ITEMS } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(MediaTabs, {
      props: { items: ITEMS },
      attrs: { 'data-testid': 'platform-claims' }
    })

    expect(getByTestId('platform-claims')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders one row button per item, carrying its title', () => {
    const { getAllByRole } = render(MediaTabs, {
      props: { items: ITEMS, autoPlay: false }
    })
    const buttons = getAllByRole('button')

    expect(buttons).toHaveLength(ITEMS.length)
    expect(buttons.map((button) => button.textContent?.trim())).toEqual(
      ITEMS.map((item) => item.title)
    )
  })

  it('renders every description as text', () => {
    const { getByText } = render(MediaTabs, {
      props: { items: ITEMS, autoPlay: false }
    })

    for (const item of ITEMS) {
      expect(getByText(item.description)).toBeInTheDocument()
    }
  })

  it('opens on the first tab', () => {
    const { container, getAllByRole } = render(MediaTabs, {
      props: { items: ITEMS, autoPlay: false }
    })

    expect(activeTitles(container)).toEqual([ITEMS[0].title])
    expect(getAllByRole('button')[0].getAttribute('aria-current')).toBe('true')
    expect(getAllByRole('button')[1].getAttribute('aria-current')).toBeNull()
  })

  it('carries the size and selectOn tokens as data attributes', () => {
    const { getByTestId } = render(MediaTabs, {
      props: { items: ITEMS, autoPlay: false, size: 'large', selectOn: 'click' }
    })
    const root = getByTestId(TESTID)

    expect(root.getAttribute('data-size')).toBe('large')
    expect(root.getAttribute('data-select-on')).toBe('click')
  })

  it('moves the active tab to the one a reader clicks', async () => {
    const { container, getAllByRole } = render(MediaTabs, {
      props: { items: ITEMS, autoPlay: false }
    })

    await fireEvent.click(getAllByRole('button')[2])

    expect(activeTitles(container)).toEqual([ITEMS[2].title])
    expect(getAllByRole('button')[2].getAttribute('aria-current')).toBe('true')
    expect(getAllByRole('button')[0].getAttribute('aria-current')).toBeNull()
  })

  it('emits tab-change with (event, index) — the DOM event first', async () => {
    const { getAllByRole, emitted } = render(MediaTabs, {
      props: { items: ITEMS, autoPlay: false }
    })

    await fireEvent.click(getAllByRole('button')[1])

    const calls = emitted()['tab-change'] as unknown[][]
    expect(calls).toHaveLength(1)
    expect(calls[0][0]).toBeInstanceOf(Event)
    expect(calls[0][1]).toBe(1)
  })

  it('does not emit tab-change when the clicked tab is already the active one', async () => {
    const { getAllByRole, emitted } = render(MediaTabs, {
      props: { items: ITEMS, autoPlay: false }
    })

    await fireEvent.click(getAllByRole('button')[0])

    expect(emitted()['tab-change']).toBeUndefined()
  })

  it('moves the selection on hover when selectOn is hover', async () => {
    const { container, emitted } = render(MediaTabs, {
      props: { items: ITEMS, autoPlay: false, selectOn: 'hover' }
    })

    await fireEvent.pointerEnter(rowsOf(container)[2])

    expect(activeTitles(container)).toEqual([ITEMS[2].title])
    expect(emitted()['tab-change']).toHaveLength(1)
  })

  it('leaves the selection alone on hover when selectOn is click', async () => {
    const { container, emitted } = render(MediaTabs, {
      props: { items: ITEMS, autoPlay: false, selectOn: 'click' }
    })

    await fireEvent.pointerEnter(rowsOf(container)[2])

    expect(activeTitles(container)).toEqual([ITEMS[0].title])
    expect(emitted()['tab-change']).toBeUndefined()
  })

  it('still selects on click when selectOn is click', async () => {
    const { container, getAllByRole } = render(MediaTabs, {
      props: { items: ITEMS, autoPlay: false, selectOn: 'click' }
    })

    await fireEvent.click(getAllByRole('button')[1])

    expect(activeTitles(container)).toEqual([ITEMS[1].title])
  })

  it('marks a running band with data-autoplay', () => {
    const { getByTestId } = render(MediaTabs, { props: { items: ITEMS } })

    expect(getByTestId(TESTID).getAttribute('data-autoplay')).not.toBeNull()
  })

  it('advances to the next tab once the interval elapses', async () => {
    vi.useFakeTimers()
    const { container } = render(MediaTabs, {
      props: { items: ITEMS, autoPlayInterval: INTERVAL }
    })

    expect(activeTitles(container)).toEqual([ITEMS[0].title])

    vi.advanceTimersByTime(INTERVAL)
    await nextTick()

    expect(activeTitles(container)).toEqual([ITEMS[1].title])
  })

  it('wraps from the last tab back to the first', async () => {
    vi.useFakeTimers()
    const { container } = render(MediaTabs, {
      props: { items: ITEMS, autoPlayInterval: INTERVAL }
    })

    vi.advanceTimersByTime(INTERVAL * ITEMS.length)
    await nextTick()

    expect(activeTitles(container)).toEqual([ITEMS[0].title])
  })

  it('never moves on its own when autoPlay is off', async () => {
    vi.useFakeTimers()
    const { container, getByTestId } = render(MediaTabs, {
      props: { items: ITEMS, autoPlay: false, autoPlayInterval: INTERVAL }
    })

    expect(getByTestId(TESTID).getAttribute('data-autoplay')).toBeNull()

    vi.advanceTimersByTime(INTERVAL * 3)
    await nextTick()

    expect(activeTitles(container)).toEqual([ITEMS[0].title])
  })

  it('stops autoplay for good once a reader clicks a tab', async () => {
    vi.useFakeTimers()
    const { container, getAllByRole, getByTestId } = render(MediaTabs, {
      props: { items: ITEMS, autoPlayInterval: INTERVAL }
    })

    await fireEvent.click(getAllByRole('button')[1])

    expect(getByTestId(TESTID).getAttribute('data-autoplay')).toBeNull()

    vi.advanceTimersByTime(INTERVAL * 3)
    await nextTick()

    expect(activeTitles(container)).toEqual([ITEMS[1].title])
  })

  it('pauses autoplay while the pointer rests on the band, and resumes on leave', async () => {
    vi.useFakeTimers()
    const { getByTestId } = render(MediaTabs, {
      props: { items: ITEMS, autoPlayInterval: INTERVAL }
    })
    const root = getByTestId(TESTID)

    await fireEvent.pointerEnter(root)
    expect(root.getAttribute('data-autoplay')).toBeNull()

    await fireEvent.pointerLeave(root)
    expect(root.getAttribute('data-autoplay')).not.toBeNull()
  })

  it('draws the autoplay hairline over the active row only', () => {
    const { container } = render(MediaTabs, { props: { items: ITEMS } })
    const hairlines = container.querySelectorAll('li > span[aria-hidden="true"]')

    expect(hairlines).toHaveLength(1)
  })

  it('draws no hairline when showProgress is off', () => {
    const { container } = render(MediaTabs, {
      props: { items: ITEMS, showProgress: false }
    })

    expect(container.querySelector('li > span[aria-hidden="true"]')).toBeNull()
  })

  it('renders nothing when there are no items', () => {
    const { container, getByTestId } = render(MediaTabs, { props: { items: [] } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(container.querySelector('button')).toBeNull()
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('ul')).toBeNull()
  })

  it('names every medium after its tab and hides the inactive ones', () => {
    const { container } = render(MediaTabs, {
      props: { items: ITEMS, autoPlay: false }
    })
    const images = [...container.querySelectorAll('img')]
    const hidden = [...container.querySelectorAll('[aria-hidden="true"] img')]

    expect(images.length).toBeGreaterThan(0)
    for (const image of images) {
      expect(ITEMS.map((item) => item.alt)).toContain(image.getAttribute('alt'))
    }
    expect(hidden).toHaveLength(ITEMS.length - 1)
  })

  it('hands the media slot its item, index and active flag', () => {
    const { container } = render(MediaTabs, {
      props: { items: ITEMS, autoPlay: false },
      slots: {
        media: `<p data-testid="scene" :data-active="params.active">{{ params.index }}:{{ params.item.title }}</p>`
      }
    })
    const scenes = [...container.querySelectorAll('[data-testid="scene"]')]

    expect(scenes.length).toBeGreaterThan(0)
    expect(scenes.map((scene) => scene.textContent)).toContain(`0:${ITEMS[0].title}`)
    expect(scenes.map((scene) => scene.textContent)).toContain(`2:${ITEMS[2].title}`)
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = render(MediaTabs, {
      props: { items: ITEMS, autoPlay: false }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations while autoplay is running', async () => {
    const { container } = render(MediaTabs, { props: { items: ITEMS } })

    await expectNoA11yViolations(container)
  })
})
