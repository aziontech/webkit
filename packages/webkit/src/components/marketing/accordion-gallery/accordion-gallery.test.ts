import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import AccordionGallery, { type AccordionGalleryItem } from './accordion-gallery.vue'

const TESTID = 'marketing-accordion-gallery'

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

const ITEMS: AccordionGalleryItem[] = [
  {
    title: 'Build',
    points: ['Import a repository', 'Pick a preset'],
    backgroundImage: PIXEL
  },
  {
    title: 'Deploy',
    points: ['One command', 'Every location at once'],
    backgroundImage: PIXEL
  },
  {
    title: 'Observe',
    points: ['Logs as they happen'],
    backgroundImage: PIXEL
  }
]

const INTERVAL = 5000

function stepsOf(container: HTMLElement): globalThis.HTMLLIElement[] {
  const list = container.querySelector('ul')
  return list ? ([...list.children] as globalThis.HTMLLIElement[]) : []
}

function activeTitles(container: HTMLElement): string[] {
  return stepsOf(container)
    .filter((step) => step.getAttribute('data-active') !== null)
    .map((step) => step.querySelector('button')?.textContent?.trim() ?? '')
}

afterEach(() => {
  vi.useRealTimers()
})

describe('AccordionGallery', () => {
  it('renders the gallery under the default testid', () => {
    const { getByTestId } = render(AccordionGallery, { props: { items: ITEMS } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(AccordionGallery, {
      props: { items: ITEMS },
      attrs: { 'data-testid': 'platform-steps' }
    })

    expect(getByTestId('platform-steps')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders one step button per item, carrying its title', () => {
    const { getAllByRole } = render(AccordionGallery, {
      props: { items: ITEMS, autoPlay: false }
    })
    const buttons = getAllByRole('button')

    expect(buttons).toHaveLength(ITEMS.length)
    expect(buttons.map((button) => button.textContent?.trim())).toEqual([
      'Build',
      'Deploy',
      'Observe'
    ])
  })

  it('renders every point of every step as text', () => {
    const { getByText } = render(AccordionGallery, {
      props: { items: ITEMS, autoPlay: false }
    })

    for (const item of ITEMS) {
      for (const point of item.points) {
        expect(getByText(point)).toBeInTheDocument()
      }
    }
  })

  it('opens on the first step', () => {
    const { container, getAllByRole } = render(AccordionGallery, {
      props: { items: ITEMS, autoPlay: false }
    })

    expect(activeTitles(container)).toEqual(['Build'])
    expect(getAllByRole('button')[0].getAttribute('aria-current')).toBe('true')
    expect(getAllByRole('button')[1].getAttribute('aria-current')).toBeNull()
  })

  it('moves the active step to the one a reader selects', async () => {
    const { container, getAllByRole } = render(AccordionGallery, {
      props: { items: ITEMS, autoPlay: false }
    })

    await fireEvent.click(getAllByRole('button')[2])

    expect(activeTitles(container)).toEqual(['Observe'])
    expect(getAllByRole('button')[2].getAttribute('aria-current')).toBe('true')
    expect(getAllByRole('button')[0].getAttribute('aria-current')).toBeNull()
  })

  it('emits step-change with (event, index) — the DOM event first', async () => {
    const { getAllByRole, emitted } = render(AccordionGallery, {
      props: { items: ITEMS, autoPlay: false }
    })

    await fireEvent.click(getAllByRole('button')[1])

    const calls = emitted()['step-change'] as unknown[][]
    expect(calls).toHaveLength(1)
    // event-payloads.md: the DOM event is always first, the subject second.
    expect(calls[0][0]).toBeInstanceOf(MouseEvent)
    expect(calls[0][1]).toBe(1)
  })

  it('does not emit step-change when the selected step is already the active one', async () => {
    const { getAllByRole, emitted } = render(AccordionGallery, {
      props: { items: ITEMS, autoPlay: false }
    })

    await fireEvent.click(getAllByRole('button')[0])

    expect(emitted()['step-change']).toBeUndefined()
  })

  it('marks a running gallery with data-autoplay', () => {
    const { getByTestId } = render(AccordionGallery, { props: { items: ITEMS } })

    expect(getByTestId(TESTID).getAttribute('data-autoplay')).not.toBeNull()
  })

  it('advances to the next step once the interval elapses', async () => {
    vi.useFakeTimers()
    const { container } = render(AccordionGallery, {
      props: { items: ITEMS, autoPlayInterval: INTERVAL }
    })

    expect(activeTitles(container)).toEqual(['Build'])

    vi.advanceTimersByTime(INTERVAL)
    await nextTick()

    expect(activeTitles(container)).toEqual(['Deploy'])
  })

  it('wraps from the last step back to the first', async () => {
    vi.useFakeTimers()
    const { container } = render(AccordionGallery, {
      props: { items: ITEMS, autoPlayInterval: INTERVAL }
    })

    vi.advanceTimersByTime(INTERVAL * ITEMS.length)
    await nextTick()

    expect(activeTitles(container)).toEqual(['Build'])
  })

  it('never moves on its own when autoPlay is off', async () => {
    vi.useFakeTimers()
    const { container, getByTestId } = render(AccordionGallery, {
      props: { items: ITEMS, autoPlay: false, autoPlayInterval: INTERVAL }
    })

    expect(getByTestId(TESTID).getAttribute('data-autoplay')).toBeNull()

    vi.advanceTimersByTime(INTERVAL * 3)
    await nextTick()

    expect(activeTitles(container)).toEqual(['Build'])
  })

  it('stops autoplay for good once a reader selects a step', async () => {
    vi.useFakeTimers()
    const { container, getAllByRole, getByTestId } = render(AccordionGallery, {
      props: { items: ITEMS, autoPlayInterval: INTERVAL }
    })

    await fireEvent.click(getAllByRole('button')[1])

    expect(getByTestId(TESTID).getAttribute('data-autoplay')).toBeNull()

    vi.advanceTimersByTime(INTERVAL * 3)
    await nextTick()

    expect(activeTitles(container)).toEqual(['Deploy'])
  })

  it('draws the autoplay progress bar over the active step', () => {
    const { container } = render(AccordionGallery, { props: { items: ITEMS } })

    expect(container.querySelectorAll('[role="progressbar"]')).toHaveLength(1)
  })

  it('draws no progress bar when showProgress is off', () => {
    const { container } = render(AccordionGallery, {
      props: { items: ITEMS, showProgress: false }
    })

    expect(container.querySelector('[role="progressbar"]')).toBeNull()
  })

  it('renders nothing when there are no items', () => {
    const { container, getByTestId } = render(AccordionGallery, { props: { items: [] } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(container.querySelector('button')).toBeNull()
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('ul')).toBeNull()
  })

  it('names every image after its step and hides the inactive ones', () => {
    const { container } = render(AccordionGallery, {
      props: { items: ITEMS, autoPlay: false }
    })
    const images = [...container.querySelectorAll('img')]
    const hidden = images.filter((image) => image.getAttribute('aria-hidden') === 'true')

    expect(images.length).toBeGreaterThan(0)
    for (const image of images) {
      expect(ITEMS.map((item) => item.title)).toContain(image.getAttribute('alt'))
    }
    expect(hidden).toHaveLength(ITEMS.length - 1)
  })

  it('has no a11y violations with a full gallery', async () => {
    const { container } = render(AccordionGallery, {
      props: { items: ITEMS, autoPlay: false }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations while autoplay is running', async () => {
    const { container } = render(AccordionGallery, { props: { items: ITEMS } })

    await expectNoA11yViolations(container)
  })
})
