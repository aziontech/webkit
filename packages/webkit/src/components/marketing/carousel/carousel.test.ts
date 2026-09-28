import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import CarouselItem from './carousel-item/carousel-item.vue'
import CarouselNext from './carousel-next/carousel-next.vue'
import CarouselPrevious from './carousel-previous/carousel-previous.vue'
import Carousel from './index'

const TESTID = 'marketing-carousel'
const ITEM_TESTID = 'marketing-carousel-item'
const PREVIOUS_TESTID = 'marketing-carousel-previous'
const NEXT_TESTID = 'marketing-carousel-next'

const slides = ['First slide', 'Second slide', 'Third slide', 'Fourth slide', 'Fifth slide']

// Flat tags on purpose: dot-notation does not resolve in a runtime template.
const host = (props: Record<string, unknown> = {}) =>
  defineComponent({
    components: { Carousel, CarouselItem, CarouselNext, CarouselPrevious },
    setup: () => ({ props, slides }),
    template: `
      <Carousel v-bind="props">
        <template #controls>
          <CarouselPrevious />
          <CarouselNext />
        </template>
        <CarouselItem
          v-for="slide in slides"
          :key="slide"
          style="width: 300px; flex: 0 0 auto"
        >
          <p>{{ slide }}</p>
        </CarouselItem>
      </Carousel>
    `
  })

// No Tailwind runs in this env, so the track's own utilities emit nothing and the
// list never overflows. These inline styles create the real horizontal overflow the
// component relies on, so scrollLeft below is genuine browser scroll state.
function makeTrackOverflow(container: Element): globalThis.HTMLUListElement {
  const track = container.querySelector('ul') as globalThis.HTMLUListElement
  track.style.cssText = 'display: flex; overflow-x: auto; width: 200px'
  return track
}

const button = (element: globalThis.HTMLElement) => element as globalThis.HTMLButtonElement

describe('Carousel (composition)', () => {
  it('renders the carousel under the default testid', () => {
    const { getByTestId } = render(host())

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(host({ 'data-testid': 'customer-stories' }))

    expect(getByTestId('customer-stories')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('describes itself as a carousel to assistive technology', () => {
    const { getByTestId } = render(host())

    expect(getByTestId(TESTID).getAttribute('aria-roledescription')).toBe('carousel')
  })

  it('names the carousel when ariaLabel is set', () => {
    const { getByRole } = render(host({ ariaLabel: 'Customer stories' }))

    expect(getByRole('region', { name: 'Customer stories' })).toBeInTheDocument()
  })

  it('leaves the carousel unnamed when ariaLabel is unset', () => {
    const { getByTestId } = render(host())

    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
  })

  it('attaches every public sub-component to the compound root', () => {
    expect(Carousel.Item).toBe(CarouselItem)
    expect(Carousel.Previous).toBe(CarouselPrevious)
    expect(Carousel.Next).toBe(CarouselNext)
  })

  it('renders one list item per slide, with its content in reading order', () => {
    const { getAllByTestId } = render(host())

    const rendered = getAllByTestId(ITEM_TESTID)
    expect(rendered).toHaveLength(slides.length)
    expect(rendered.map((item) => item.tagName)).toEqual(slides.map(() => 'LI'))
    expect(rendered.map((item) => item.querySelector('p')?.textContent)).toEqual(slides)
  })

  it('makes the track keyboard-reachable', () => {
    const { container } = render(host())

    expect(container.querySelector('ul')?.getAttribute('tabindex')).toBe('0')
  })

  it('names both step controls', () => {
    const { getByTestId } = render(host())

    expect(getByTestId(PREVIOUS_TESTID).getAttribute('aria-label')).toBe('Previous slide')
    expect(getByTestId(NEXT_TESTID).getAttribute('aria-label')).toBe('Next slide')
  })

  it('disables the previous control at the start of the track', async () => {
    const { container, getByTestId } = render(host())
    makeTrackOverflow(container)

    await vi.waitFor(() => {
      expect(button(getByTestId(NEXT_TESTID)).disabled).toBe(false)
    })
    expect(button(getByTestId(PREVIOUS_TESTID)).disabled).toBe(true)
  })

  it('marks the root scrollable once the track overflows its row', async () => {
    const { container, getByTestId } = render(host())
    makeTrackOverflow(container)

    await vi.waitFor(() => {
      expect(getByTestId(TESTID).getAttribute('data-scrollable')).toBe('true')
    })
  })

  it('marks the track scrollable so it takes the grab cursor', async () => {
    const { container } = render(host())
    const track = makeTrackOverflow(container)

    await vi.waitFor(() => {
      expect(track.getAttribute('data-scrollable')).toBe('true')
    })
  })

  it('leaves a track that fits its row undraggable', async () => {
    const { container } = render(host())
    const track = container.querySelector('ul') as globalThis.HTMLUListElement

    await fireEvent.pointerDown(track, { pointerType: 'mouse', button: 0, clientX: 300 })
    await fireEvent.pointerMove(globalThis.window, { pointerType: 'mouse', clientX: 200 })

    expect(track).not.toHaveAttribute('data-dragging')
    expect(track.scrollLeft).toBe(0)
  })

  it('drags the track with the mouse and marks it while the drag lasts', async () => {
    const { container } = render(host())
    const track = makeTrackOverflow(container)

    await vi.waitFor(() => {
      expect(track.getAttribute('data-scrollable')).toBe('true')
    })

    await fireEvent.pointerDown(track, { pointerType: 'mouse', button: 0, clientX: 300 })
    expect(track).toHaveAttribute('data-dragging')

    await fireEvent.pointerMove(globalThis.window, { pointerType: 'mouse', clientX: 180 })
    expect(track.scrollLeft).toBe(120)

    await fireEvent.pointerUp(globalThis.window, { pointerType: 'mouse', clientX: 180 })
    expect(track).not.toHaveAttribute('data-dragging')
  })

  it('leaves touch to the browser, whose own scrolling carries momentum', async () => {
    const { container } = render(host())
    const track = makeTrackOverflow(container)

    await vi.waitFor(() => {
      expect(track.getAttribute('data-scrollable')).toBe('true')
    })

    await fireEvent.pointerDown(track, { pointerType: 'touch', button: 0, clientX: 300 })

    expect(track).not.toHaveAttribute('data-dragging')
  })

  it('swallows the click a drag ends on, so a slide link is not followed', async () => {
    const { container } = render(host())
    const track = makeTrackOverflow(container)

    await vi.waitFor(() => {
      expect(track.getAttribute('data-scrollable')).toBe('true')
    })

    const slide = container.querySelector('li p') as globalThis.HTMLElement
    const activated = vi.fn()
    slide.addEventListener('click', activated)

    await fireEvent.pointerDown(track, { pointerType: 'mouse', button: 0, clientX: 300 })
    await fireEvent.pointerMove(globalThis.window, { pointerType: 'mouse', clientX: 180 })
    await fireEvent.pointerUp(globalThis.window, { pointerType: 'mouse', clientX: 180 })
    await fireEvent.click(slide)

    expect(activated).not.toHaveBeenCalled()
  })

  it('lets a press that did not travel through to the slide', async () => {
    const { container } = render(host())
    const track = makeTrackOverflow(container)

    await vi.waitFor(() => {
      expect(track.getAttribute('data-scrollable')).toBe('true')
    })

    const slide = container.querySelector('li p') as globalThis.HTMLElement
    const activated = vi.fn()
    slide.addEventListener('click', activated)

    await fireEvent.pointerDown(track, { pointerType: 'mouse', button: 0, clientX: 300 })
    await fireEvent.pointerMove(globalThis.window, { pointerType: 'mouse', clientX: 301 })
    await fireEvent.pointerUp(globalThis.window, { pointerType: 'mouse', clientX: 301 })
    await fireEvent.click(slide)

    expect(activated).toHaveBeenCalledTimes(1)
  })

  it('steps the track forward when the next control is pressed', async () => {
    const { container, getByTestId } = render(host())
    const track = makeTrackOverflow(container)

    await vi.waitFor(() => {
      expect(button(getByTestId(NEXT_TESTID)).disabled).toBe(false)
    })
    expect(track.scrollLeft).toBe(0)

    await fireEvent.click(getByTestId(NEXT_TESTID))

    await vi.waitFor(() => {
      expect(track.scrollLeft).toBeGreaterThan(0)
    })
  })

  it('enables the previous control once the track has been stepped', async () => {
    const { container, getByTestId } = render(host())
    makeTrackOverflow(container)

    await vi.waitFor(() => {
      expect(button(getByTestId(NEXT_TESTID)).disabled).toBe(false)
    })
    await fireEvent.click(getByTestId(NEXT_TESTID))

    await vi.waitFor(() => {
      expect(button(getByTestId(PREVIOUS_TESTID)).disabled).toBe(false)
    })
  })

  it('steps the track back when the previous control is pressed', async () => {
    const { container, getByTestId } = render(host())
    const track = makeTrackOverflow(container)

    await vi.waitFor(() => {
      expect(button(getByTestId(NEXT_TESTID)).disabled).toBe(false)
    })
    await fireEvent.click(getByTestId(NEXT_TESTID))

    let stepped = 0
    await vi.waitFor(() => {
      expect(button(getByTestId(PREVIOUS_TESTID)).disabled).toBe(false)
      stepped = track.scrollLeft
      expect(stepped).toBeGreaterThan(0)
    })

    await fireEvent.click(getByTestId(PREVIOUS_TESTID))

    await vi.waitFor(() => {
      expect(track.scrollLeft).toBeLessThan(stepped)
    })
  })

  it('throws a clear error when a control is used outside a carousel', () => {
    expect(() => render(CarouselPrevious)).toThrow(/must be used within Carousel/)
    expect(() => render(CarouselNext)).toThrow(/must be used within Carousel/)
  })

  it('has no a11y violations with a named, filled carousel', async () => {
    const { container } = render(host({ ariaLabel: 'Customer stories' }))

    await expectNoA11yViolations(container)
  })
})
