import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'

import Default from '../../../../examples/popover/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Popover, {
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from './index'

/** The panel Teleports to <body>, escaping the render container. */
const panel = () =>
  document.body.querySelector<HTMLElement>('[data-testid="overlay-popover__panel"]')

const byTestId = (id: string) => document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)
const control = () =>
  document.body.querySelector<HTMLElement>('[data-testid="overlay-popover__trigger"] button')!

/**
 * Realistic composed tree mirroring the Default example: a trigger wrapping a
 * native <button> (the trigger span is a passthrough — the child owns focus and
 * keyboard activation), a header with title + close, a description, free body
 * text and a footer. Anatomy toggles let tests exercise the aria gating that
 * PopoverTitle / PopoverDescription drive through the injected context.
 */
const host = (
  props: Record<string, unknown> = {},
  {
    withTitle = true,
    withDescription = true,
    withClose = true,
    attrs = ''
  }: { withTitle?: boolean; withDescription?: boolean; withClose?: boolean; attrs?: string } = {}
) =>
  defineComponent({
    components: {
      Popover,
      PopoverTrigger,
      PopoverContent,
      PopoverHeader,
      PopoverTitle,
      PopoverDescription,
      PopoverClose,
      PopoverFooter
    },
    setup() {
      return { props }
    },
    template: `
      <Popover v-bind="props" ${attrs}>
        <PopoverTrigger v-slot="{ isOpen }">
          <button type="button">{{ isOpen ? 'Hide filters' : 'Show filters' }}</button>
        </PopoverTrigger>

        <PopoverContent>
          <PopoverHeader>
            ${withTitle ? '<PopoverTitle>Filter domains</PopoverTitle>' : ''}
            ${withDescription ? '<PopoverDescription>Narrow the list by status.</PopoverDescription>' : ''}
            ${withClose ? '<PopoverClose />' : ''}
          </PopoverHeader>
          <p>Only active domains are shown by default.</p>
          <PopoverFooter>
            <button type="button">Apply</button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    `
  })

/** Anatomy with NO focusable content — the panel itself must receive focus. */
const textOnlyHost = defineComponent({
  components: { Popover, PopoverTrigger, PopoverContent },
  template: `
    <Popover>
      <PopoverTrigger>
        <button type="button">Open</button>
      </PopoverTrigger>
      <PopoverContent>
        <p>Static hint text with nothing focusable.</p>
      </PopoverContent>
    </Popover>
  `
})

afterEach(() => {
  // Unmount FIRST (idempotent — the global setup afterEach runs later and
  // no-ops), so Vue tears its Teleports down itself; only then scrub any panel
  // stranded by a mid-transition unmount, keeping document.body queries
  // deterministic without yanking a live Teleport target from under Vue.
  cleanup()
  document.body.querySelectorAll('[data-testid$="__panel"]').forEach((el) => el.remove())
})

describe('Popover (compound / overlay)', () => {
  // ---- Compound API: dot-notation resolves ----------------------------------
  it('attaches every sub-component to the compound root for dot-notation', () => {
    expect(Popover.Trigger).toBe(PopoverTrigger)
    expect(Popover.Content).toBe(PopoverContent)
    expect(Popover.Header).toBe(PopoverHeader)
    expect(Popover.Title).toBe(PopoverTitle)
    expect(Popover.Description).toBe(PopoverDescription)
    expect(Popover.Close).toBe(PopoverClose)
    expect(Popover.Footer).toBe(PopoverFooter)
  })

  // ---- Closed state ----------------------------------------------------------
  it('renders the root closed with default testid, placement and no panel', () => {
    const { getByTestId } = render(host())

    const root = getByTestId('overlay-popover')
    expect(root.getAttribute('data-state')).toBe('closed')
    expect(root.getAttribute('data-placement')).toBe('bottom-start')
    expect(root.hasAttribute('data-disabled')).toBe(false)
    expect(panel()).toBeNull()
  })

  it('forwards aria-haspopup/expanded/controls onto the slotted button instead of wrapping it', () => {
    const { getByTestId } = render(host())

    const trigger = getByTestId('overlay-popover__trigger')
    expect(trigger.tagName).toBe('SPAN')
    expect(trigger.hasAttribute('role')).toBe(false)
    expect(trigger.hasAttribute('tabindex')).toBe(false)
    expect(trigger.hasAttribute('aria-expanded')).toBe(false)
    expect(control().getAttribute('aria-haspopup')).toBe('dialog')
    expect(control().getAttribute('aria-expanded')).toBe('false')
    expect(control().getAttribute('aria-controls')).toBeTruthy()
    expect(control().id).toBeTruthy()
    expect(trigger.getAttribute('data-state')).toBe('closed')
    // The scoped slot receives isOpen — closed label while closed.
    expect(trigger.textContent).toContain('Show filters')
  })

  // ---- Open via the trigger ---------------------------------------------------
  it('clicking the trigger Teleports a role=dialog panel to document.body', async () => {
    const { getByTestId, getByRole } = render(host())

    await fireEvent.click(getByRole('button', { name: 'Show filters' }))
    await waitFor(() => expect(panel()).not.toBeNull())

    const dialog = panel() as HTMLElement
    expect(dialog.getAttribute('role')).toBe('dialog')
    expect(dialog.getAttribute('aria-modal')).toBe('false')
    expect(dialog.getAttribute('tabindex')).toBe('-1')
    expect(dialog.getAttribute('data-state')).toBe('open')
    // Teleported OUT of the component subtree.
    expect(dialog.closest('[data-testid="overlay-popover"]')).toBeNull()

    // PopoverContent Teleports the composed anatomy into the panel body.
    const body = byTestId('overlay-popover__body') as HTMLElement
    expect(dialog.contains(body)).toBe(true)
    expect(body.textContent).toContain('Only active domains are shown by default.')

    // Root + trigger reflect the injected open state; scoped slot flips.
    expect(getByTestId('overlay-popover').getAttribute('data-state')).toBe('open')
    const trigger = getByTestId('overlay-popover__trigger')
    expect(control().getAttribute('aria-expanded')).toBe('true')
    expect(control().getAttribute('aria-controls')).toBe(dialog.id)
    expect(trigger.getAttribute('data-state')).toBe('open')
    expect(trigger.textContent).toContain('Hide filters')
  })

  it('a second trigger click closes the panel again', async () => {
    const { getByTestId } = render(host())
    const trigger = getByTestId('overlay-popover__trigger')

    await fireEvent.click(trigger)
    await waitFor(() => expect(panel()).not.toBeNull())

    await fireEvent.click(trigger)
    await waitFor(() => expect(panel()).toBeNull())
    expect(control().getAttribute('aria-expanded')).toBe('false')
  })

  it('opens on Enter and Space keydown landing directly on the trigger wrapper', async () => {
    for (const key of ['Enter', ' ']) {
      const view = render(host())
      await fireEvent.keyDown(view.getByTestId('overlay-popover__trigger'), { key })
      await waitFor(() => expect(panel()).not.toBeNull())
      view.unmount()
      document.body.querySelectorAll('[data-testid$="__panel"]').forEach((el) => el.remove())
    }
  })

  // ---- Anatomy: header / title / description / footer / close ----------------
  it('renders the full anatomy with semantic tags and context-derived testids', async () => {
    render(host({}, {}))

    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())

    const header = byTestId('overlay-popover__header') as HTMLElement
    const title = byTestId('overlay-popover__title') as HTMLElement
    const description = byTestId('overlay-popover__description') as HTMLElement
    const footer = byTestId('overlay-popover__footer') as HTMLElement
    const close = byTestId('overlay-popover__close') as HTMLElement

    expect(header.tagName).toBe('HEADER')
    expect(title.tagName).toBe('H2')
    expect(title.textContent).toContain('Filter domains')
    expect(description.tagName).toBe('P')
    expect(description.textContent).toContain('Narrow the list by status.')
    expect(footer.tagName).toBe('FOOTER')
    // PopoverClose renders an IconButton with the fixed accessible name.
    expect(close.getAttribute('aria-label')).toBe('Close')
  })

  it('wires aria-labelledby / aria-describedby only while Title / Description are mounted', async () => {
    render(host())
    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())

    const dialog = panel() as HTMLElement
    const title = byTestId('overlay-popover__title') as HTMLElement
    const description = byTestId('overlay-popover__description') as HTMLElement
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id)
    expect(dialog.getAttribute('aria-describedby')).toBe(description.id)
  })

  it('omits aria-labelledby / aria-describedby when no Title / Description exist', async () => {
    render(host({}, { withTitle: false, withDescription: false }))
    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())

    const dialog = panel() as HTMLElement
    expect(dialog.hasAttribute('aria-labelledby')).toBe(false)
    expect(dialog.hasAttribute('aria-describedby')).toBe(false)
  })

  // ---- Focus management -------------------------------------------------------
  it('keeps focus on the trigger on open — does not pull it into the panel', async () => {
    render(host())
    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())

    // Focus is NOT auto-moved to the close button (or anywhere inside the panel).
    const close = byTestId('overlay-popover__close') as HTMLElement
    expect(document.activeElement).not.toBe(close)
    expect((panel() as HTMLElement).contains(document.activeElement)).toBe(false)
  })

  it('does not auto-focus the panel when it has no focusable content', async () => {
    render(textOnlyHost)
    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())

    expect(document.activeElement).not.toBe(panel())
  })

  it('does not close when focus moves to an outside element (Tab never dismisses)', async () => {
    const Outside = defineComponent({
      components: { Host: host() },
      template: `<div><Host /><button type="button" data-testid="outside">Elsewhere</button></div>`
    })
    const { getByTestId } = render(Outside)

    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())

    // Focus leaving the panel no longer closes it — only Esc / outside-click dismiss.
    getByTestId('outside').focus()
    expect(panel()).not.toBeNull()
  })

  it('Tab / Shift+Tab do not close the panel (focus is contained in trigger + panel)', async () => {
    render(host())
    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())

    await fireEvent.keyDown(document, { key: 'Tab' })
    expect(panel()).not.toBeNull()

    await fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(panel()).not.toBeNull()
  })

  it('Escape closes the panel from the document level (focus on the trigger)', async () => {
    render(host())
    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())

    await fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(panel()).toBeNull())
  })

  // ---- v-model:open round-trip -------------------------------------------------
  it('emits update:open(true) on open and update:open(false) on close', async () => {
    const events: boolean[] = []
    render(host({ 'onUpdate:open': (v: boolean) => events.push(v) }))

    const trigger = byTestId('overlay-popover__trigger') as HTMLElement
    await fireEvent.click(trigger)
    await waitFor(() => expect(panel()).not.toBeNull())
    expect(events).toEqual([true])

    await fireEvent.click(trigger)
    await waitFor(() => expect(panel()).toBeNull())
    expect(events).toEqual([true, false])
  })

  it('controlled open prop drives the panel: true renders it, false removes it', async () => {
    const view = render(host(), { props: {} })
    // Rerender through a controlled wrapper: mount open, then flip.
    const Controlled = defineComponent({
      components: { Popover, PopoverTrigger, PopoverContent },
      props: { open: { type: Boolean, default: false } },
      template: `
        <Popover :open="open">
          <PopoverTrigger><button type="button">Open</button></PopoverTrigger>
          <PopoverContent><p>Controlled body</p></PopoverContent>
        </Popover>
      `
    })
    view.unmount()

    const controlled = render(Controlled, { props: { open: true } })
    await waitFor(() => expect(panel()).not.toBeNull())

    await controlled.rerender({ open: false })
    await waitFor(() => expect(panel()).toBeNull())
  })

  // ---- Dismissal --------------------------------------------------------------
  it('Escape inside the panel closes it', async () => {
    render(host())
    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())

    await fireEvent.keyDown(panel() as HTMLElement, { key: 'Escape' })
    await waitFor(() => expect(panel()).toBeNull())
  })

  it('a mousedown outside the trigger and panel closes it', async () => {
    render(host())
    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())

    await fireEvent.mouseDown(document.body)
    await waitFor(() => expect(panel()).toBeNull())
  })

  it('PopoverClose closes the panel and emits update:open(false)', async () => {
    const onUpdate = vi.fn()
    render(host({ 'onUpdate:open': onUpdate }))

    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())

    await fireEvent.click(byTestId('overlay-popover__close') as HTMLElement)
    await waitFor(() => expect(panel()).toBeNull())
    expect(onUpdate).toHaveBeenLastCalledWith(false)
  })

  it('dismissible=false keeps the panel open on Escape and outside mousedown', async () => {
    render(host({ dismissible: false }))
    const trigger = byTestId('overlay-popover__trigger') as HTMLElement

    await fireEvent.click(trigger)
    await waitFor(() => expect(panel()).not.toBeNull())

    await fireEvent.keyDown(panel() as HTMLElement, { key: 'Escape' })
    await fireEvent.mouseDown(document.body)
    // Give any async close a chance; it must never happen.
    await Promise.resolve()
    expect(panel()).not.toBeNull()

    // The trigger itself still closes (explicit dismissal stays available).
    await fireEvent.click(trigger)
    await waitFor(() => expect(panel()).toBeNull())
  })

  // ---- Disabled suppression -----------------------------------------------------
  it('does NOT open when disabled, and mirrors data-disabled on root + trigger', async () => {
    const { getByTestId } = render(host({ disabled: true }))

    const root = getByTestId('overlay-popover')
    const trigger = getByTestId('overlay-popover__trigger')
    expect(root.getAttribute('data-disabled')).toBe('true')
    expect(trigger.getAttribute('data-disabled')).toBe('true')

    await fireEvent.click(trigger)
    await Promise.resolve()
    expect(panel()).toBeNull()
    expect(control().getAttribute('aria-expanded')).toBe('false')
    expect(control().getAttribute('aria-disabled')).toBe('true')
  })

  it('becomes the button itself when the slot holds no focusable control', () => {
    render(
      defineComponent({
        components: { Popover, PopoverTrigger, PopoverContent },
        template: `<Popover><PopoverTrigger>Filters</PopoverTrigger><PopoverContent>Body</PopoverContent></Popover>`
      })
    )
    const trigger = byTestId('overlay-popover__trigger') as HTMLElement
    expect(trigger.getAttribute('role')).toBe('button')
    expect(trigger.getAttribute('tabindex')).toBe('0')
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
  })

  it('has no axe violations on the closed trigger', async () => {
    const { container } = render(host())
    await expectNoA11yViolations(container)
  })

  // ---- Width + placement presets ------------------------------------------------
  it('leaves data-width off the panel when no width preset is given', async () => {
    render(host())
    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())
    expect((panel() as HTMLElement).hasAttribute('data-width')).toBe(false)
  })

  it.each(['small', 'medium', 'large'] as const)(
    'mirrors width=%s onto the open panel data-width',
    async (width) => {
      render(host({ width }))
      await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
      await waitFor(() => expect(panel()).not.toBeNull())
      expect((panel() as HTMLElement).getAttribute('data-width')).toBe(width)
    }
  )

  /**
   * Placement is a collision-aware preference (usePlacement flip): the side is
   * honored verbatim when it fits the viewport and flips to the opposite side
   * when it does not, always preserving the alignment. A spacer positions the
   * trigger so each case is deterministic in the real viewport.
   */
  const placedHost = (placement: string, spacerHeight = 0, rows = 1, wrapperStyle = '') =>
    defineComponent({
      components: { Popover, PopoverTrigger, PopoverContent },
      template: `
        <div style="${wrapperStyle}">
          <div style="height: ${spacerHeight}px"></div>
          <Popover placement="${placement}">
            <PopoverTrigger><button type="button">Open</button></PopoverTrigger>
            <PopoverContent>
              <p v-for="i in ${rows}" :key="i" style="height: 24px; margin: 0">Anchored content {{ i }}</p>
            </PopoverContent>
          </Popover>
        </div>
      `
    })

  it.each(['bottom-start', 'bottom-end'] as const)(
    'honors placement=%s verbatim when the panel fits below the trigger',
    async (placement) => {
      const { getByTestId } = render(placedHost(placement))
      expect(getByTestId('overlay-popover').getAttribute('data-placement')).toBe(placement)

      await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
      await waitFor(() => expect(panel()).not.toBeNull())
      expect((panel() as HTMLElement).getAttribute('data-placement')).toBe(placement)
    }
  )

  it.each(['top-start', 'top-end'] as const)(
    'honors placement=%s verbatim when the panel fits above the trigger',
    async (placement) => {
      // Spacer pushes the trigger down so room exists above.
      render(placedHost(placement, 400))

      await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
      await waitFor(() => expect(panel()).not.toBeNull())
      expect((panel() as HTMLElement).getAttribute('data-placement')).toBe(placement)
    }
  )

  it('flips a top placement to bottom (alignment preserved) when no room exists above', async () => {
    // Trigger at the very top of the viewport: top-start cannot fit.
    render(placedHost('top-start', 0))

    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())
    expect((panel() as HTMLElement).getAttribute('data-placement')).toBe('bottom-start')
  })

  // ---- Size-aware placement (ENG-47063) --------------------------------------------
  it('caps a panel taller than the viewport to the free space and scrolls it internally', async () => {
    // Trigger near the top; 60 x 24px rows cannot fit on either side.
    render(placedHost('bottom-start', 0, 60, 'position:fixed;top:8px;left:8px'))

    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())
    await nextTick()
    await nextTick()

    const p = panel() as HTMLElement
    const pr = p.getBoundingClientRect()
    const tr = (byTestId('overlay-popover__trigger') as HTMLElement).getBoundingClientRect()
    expect(p.getAttribute('data-placement')).toBe('bottom-start')
    expect(pr.top).toBeGreaterThanOrEqual(tr.bottom)
    expect(pr.bottom).toBeLessThanOrEqual(window.innerHeight)
    expect(p.style.maxHeight).not.toBe('')
    expect(p.scrollHeight).toBeGreaterThan(p.clientHeight)
  })

  it('stays inside the nearest scrolling ancestor instead of the window', async () => {
    // The trigger sits in a short scroll container; the panel must not extend past it.
    render(
      placedHost(
        'bottom-start',
        0,
        30,
        'position:fixed;top:40px;left:8px;width:400px;height:240px;overflow:auto'
      )
    )
    const wrapper = (byTestId('overlay-popover') as HTMLElement).parentElement as HTMLElement
    // Make the container actually scroll.
    const filler = document.createElement('div')
    filler.style.height = '1000px'
    wrapper.appendChild(filler)

    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())
    await nextTick()
    await nextTick()

    const pr = (panel() as HTMLElement).getBoundingClientRect()
    const wr = wrapper.getBoundingClientRect()
    expect(pr.bottom).toBeLessThanOrEqual(wr.top + wrapper.clientHeight + 1)
    expect((panel() as HTMLElement).style.maxHeight).not.toBe('')
  })

  it('placement=auto resolves to one of the four corners at open time', async () => {
    const { getByTestId } = render(host({ placement: 'auto' }))
    expect(getByTestId('overlay-popover').getAttribute('data-placement')).toBe('auto')

    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())
    expect(['bottom-start', 'bottom-end', 'top-start', 'top-end']).toContain(
      (panel() as HTMLElement).getAttribute('data-placement')
    )
  })

  // ---- Scrolling a long panel ------------------------------------------------------
  /**
   * The "+N overflow" shape: a long list scrolling inside the panel. The panel is
   * anchored to its trigger and re-anchors on page scroll — and that listener is
   * registered in the CAPTURE phase (scroll does not bubble), so it also sees the
   * panel's own scroll container. Re-anchoring on it read two bounding rects and
   * rewrote the inline style on every scrolled frame, for a trigger that had not
   * moved. Pinned both directions: inner scroll leaves the anchor alone, page
   * scroll still moves it.
   */
  const scrollableHost = () =>
    defineComponent({
      components: { Popover, PopoverTrigger, PopoverContent },
      template: `
        <div>
          <Popover>
            <PopoverTrigger><button type="button">Open</button></PopoverTrigger>
            <PopoverContent>
              <div data-testid="domain-list" style="max-height: 120px; overflow: auto">
                <p v-for="n in 60" :key="n" style="height: 24px">domain-{{ n }}.example.com</p>
              </div>
            </PopoverContent>
          </Popover>
          <div style="height: 2000px"></div>
        </div>
      `
    })

  it('does not re-measure the trigger when the panel scrolls, but does when the page does', async () => {
    render(scrollableHost())
    const trigger = byTestId('overlay-popover__trigger') as HTMLElement
    await fireEvent.click(trigger)
    await waitFor(() => expect(panel()).not.toBeNull())

    // Re-anchoring is invisible on an inner scroll (the trigger has not moved, so the
    // recomputed coordinates are identical) — asserting on `style.top` would pass in
    // the broken state too. The observable difference is the measurement itself.
    const measure = vi.spyOn(control(), 'getBoundingClientRect')
    // Opening anchors the panel over two ticks; let that settle before counting.
    await nextTick()
    await nextTick()
    measure.mockClear()

    const list = byTestId('domain-list') as HTMLElement
    list.scrollTop = 200
    list.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(measure).not.toHaveBeenCalled()

    // Control: a page scroll DOES move the trigger, so the panel re-anchors to it.
    globalThis.scrollTo(0, 400)
    await waitFor(() => expect(measure).toHaveBeenCalled())
    globalThis.scrollTo(0, 0)
    measure.mockRestore()
  })

  // ---- Consumer testid override ---------------------------------------------------
  it('a consumer data-testid overrides the root and prefixes the sub-component testids', async () => {
    const { getByTestId } = render(host({}, { attrs: 'data-testid="domain-filters"' }))

    expect(getByTestId('domain-filters')).toBeTruthy()
    const trigger = getByTestId('domain-filters__trigger')

    await fireEvent.click(trigger)
    await waitFor(() =>
      expect(document.body.querySelector('[data-testid="domain-filters__panel"]')).not.toBeNull()
    )
  })

  // ---- Accessibility ----------------------------------------------------------------
  it('has no axe violations on the open panel anatomy', async () => {
    render(host())
    await fireEvent.click(byTestId('overlay-popover__trigger') as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())

    // Scope axe to the overlay subtree the component owns (role=dialog +
    // labelled header anatomy); the bare harness page has no landmarks.
    await expectNoA11yViolations(panel() as HTMLElement)
  })

  // ---- Story smoke: the composed Default story opens through the real compound -----
  it('renders the Default story open through the real compound', async () => {
    // Drive `open` through the story args instead of clicking: the fixture's
    // mount glue re-renders the story right after mount, and a click landing on
    // the pre-settle instance is discarded with it (flaky). Controlled args are
    // race-free; the click path is covered by the direct compound tests above.
    const { getByRole } = render(Default, { props: { open: true } })

    await waitFor(() => expect(panel()).not.toBeNull())
    expect(getByRole('button', { name: 'Open popover' })).toBeTruthy()
    expect(getByRole('button', { name: 'Open popover' }).getAttribute('aria-expanded')).toBe('true')

    expect((byTestId('overlay-popover__title') as HTMLElement).textContent).toContain(
      'Popover title'
    )
  })
})

describe('keyboard map (spec)', () => {
  const openWith = async (key: string) => {
    render(host())
    control().focus()
    await userEvent.keyboard(key)
    await waitFor(() => expect(panel()).not.toBeNull())
  }

  it.each(['{Enter}', ' '])(
    '%s on the trigger opens the panel and keeps focus on the trigger',
    async (key) => {
      await openWith(key)
      expect(document.activeElement).toBe(control())
    }
  )

  it('Tab from the trigger moves into the panel, to its first control', async () => {
    await openWith('{Enter}')
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(byTestId('overlay-popover__close'))
  })

  it('Tab on the last control returns focus to the trigger', async () => {
    await openWith('{Enter}')
    const controls = panel()!.querySelectorAll<HTMLElement>('button')
    controls[controls.length - 1]!.focus()
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(control())
    expect(panel()).not.toBeNull()
  })

  it('Shift+Tab on the first control returns focus to the trigger', async () => {
    await openWith('{Enter}')
    byTestId('overlay-popover__close')!.focus()
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
    expect(document.activeElement).toBe(control())
  })

  it('Escape inside the panel closes it and returns focus to the trigger', async () => {
    await openWith('{Enter}')
    byTestId('overlay-popover__close')!.focus()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(control())
  })
})

describe('text input as the trigger control', () => {
  it('leaves the popup attributes off a textbox, where ARIA does not allow them', async () => {
    const Host = defineComponent({
      components: { Popover, PopoverTrigger, PopoverContent },
      template: `
        <Popover>
          <PopoverTrigger>
            <input type="text" aria-label="Domain" data-testid="domain-input" />
          </PopoverTrigger>
          <PopoverContent>Checks</PopoverContent>
        </Popover>
      `
    })
    const { getByTestId, container } = render(Host)
    await nextTick()
    const input = getByTestId('domain-input')
    expect(input.hasAttribute('aria-expanded')).toBe(false)
    expect(input.hasAttribute('aria-haspopup')).toBe(false)
    expect(input.hasAttribute('aria-controls')).toBe(false)
    await expectNoA11yViolations(container)
  })
})
