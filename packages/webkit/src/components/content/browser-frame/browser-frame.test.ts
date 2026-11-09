import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import BrowserFrame from './browser-frame.vue'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('BrowserFrame', () => {
  it('renders and exposes the fallback data-testid', () => {
    const { getByTestId } = render(BrowserFrame)
    expect(getByTestId('content-browser-frame')).toBeTruthy()
    expect(getByTestId('content-browser-frame__viewport').tagName).toBe('IFRAME')
    expect(getByTestId('content-browser-frame__width-handle')).toBeTruthy()
    expect(getByTestId('content-browser-frame__height-handle')).toBeTruthy()
    expect(getByTestId('content-browser-frame__corner-handle')).toBeTruthy()
  })

  it('lets a consumer override data-testid', () => {
    const { getByTestId } = render(BrowserFrame, { attrs: { 'data-testid': 'custom-testid' } })
    expect(getByTestId('custom-testid')).toBeTruthy()
    expect(getByTestId('custom-testid__viewport')).toBeTruthy()
    expect(getByTestId('custom-testid__width-handle')).toBeTruthy()
    expect(getByTestId('custom-testid__height-handle')).toBeTruthy()
    expect(getByTestId('custom-testid__corner-handle')).toBeTruthy()
  })

  it('publishes the separator semantics on the width handle', () => {
    const { getByTestId } = render(BrowserFrame, {
      props: { width: 768, minWidth: 360, maxWidth: 1440 }
    })
    const handle = getByTestId('content-browser-frame__width-handle')
    const viewport = getByTestId('content-browser-frame__viewport')
    expect(handle.getAttribute('role')).toBe('separator')
    expect(handle.getAttribute('tabindex')).toBe('0')
    expect(handle.getAttribute('aria-orientation')).toBe('vertical')
    expect(handle.getAttribute('aria-valuenow')).toBe('768')
    expect(handle.getAttribute('aria-valuemin')).toBe('360')
    expect(handle.getAttribute('aria-valuemax')).toBe('1440')
    expect(handle.getAttribute('aria-valuetext')).toBe('768 pixels wide')
    expect(handle.getAttribute('aria-controls')).toBe(viewport.id)
  })

  it('publishes the separator semantics on the height handle', () => {
    const { getByTestId } = render(BrowserFrame, {
      props: { height: 1024, minHeight: 400, maxHeight: 1200 }
    })
    const handle = getByTestId('content-browser-frame__height-handle')
    const viewport = getByTestId('content-browser-frame__viewport')
    expect(handle.getAttribute('role')).toBe('separator')
    expect(handle.getAttribute('tabindex')).toBe('0')
    expect(handle.getAttribute('aria-orientation')).toBe('horizontal')
    expect(handle.getAttribute('aria-valuenow')).toBe('1024')
    expect(handle.getAttribute('aria-valuemin')).toBe('400')
    expect(handle.getAttribute('aria-valuemax')).toBe('1200')
    expect(handle.getAttribute('aria-valuetext')).toBe('1024 pixels tall')
    expect(handle.getAttribute('aria-controls')).toBe(viewport.id)
  })

  it('reports the default height and limits', () => {
    const { getByTestId } = render(BrowserFrame)
    const handle = getByTestId('content-browser-frame__height-handle')
    expect(handle.getAttribute('aria-valuenow')).toBe('800')
    expect(handle.getAttribute('aria-valuemin')).toBe('320')
    expect(handle.getAttribute('aria-valuemax')).toBe('1440')
  })

  it('names the handles with the defaults and the overrides', () => {
    const defaults = render(BrowserFrame)
    expect(
      defaults.getByTestId('content-browser-frame__width-handle').getAttribute('aria-label')
    ).toBe('Resize preview width')
    expect(
      defaults.getByTestId('content-browser-frame__height-handle').getAttribute('aria-label')
    ).toBe('Resize preview height')
    defaults.unmount()

    const { getByTestId } = render(BrowserFrame, {
      props: { widthHandleAriaLabel: 'Page width', heightHandleAriaLabel: 'Page height' }
    })
    expect(getByTestId('content-browser-frame__width-handle').getAttribute('aria-label')).toBe(
      'Page width'
    )
    expect(getByTestId('content-browser-frame__height-handle').getAttribute('aria-label')).toBe(
      'Page height'
    )
  })

  it('keeps the corner handle pointer-only and hidden from assistive tech', () => {
    const { getAllByRole, getByTestId } = render(BrowserFrame)
    const corner = getByTestId('content-browser-frame__corner-handle')
    expect(corner.getAttribute('aria-hidden')).toBe('true')
    expect(corner.hasAttribute('tabindex')).toBe(false)
    expect(getAllByRole('separator')).toEqual([
      getByTestId('content-browser-frame__width-handle'),
      getByTestId('content-browser-frame__height-handle')
    ])
  })

  it('keeps aria-valuenow within its range before the container is measured', () => {
    const host = globalThis.document.createElement('div')
    host.style.display = 'none'
    globalThis.document.body.appendChild(host)
    const { getByTestId, unmount } = render(BrowserFrame, { container: host })
    const handle = getByTestId('content-browser-frame__width-handle')
    expect(handle.getAttribute('aria-valuenow')).toBe('320')
    expect(handle.getAttribute('aria-valuetext')).toBe('320 pixels wide')
    unmount()
    host.remove()
  })

  it('hides the chrome decoration from assistive tech but keeps the copy button exposed', async () => {
    const { getByTestId, getByText } = render(BrowserFrame, {
      props: { address: 'https://www.azion.com/en/pricing', width: 600, height: 700 }
    })
    const address = getByTestId('content-browser-frame__address')
    const dots = address.parentElement?.firstElementChild
    expect(dots?.getAttribute('aria-hidden')).toBe('true')
    expect(getByText('https://www.azion.co').closest('[aria-hidden="true"]')).toBeTruthy()
    expect(getByText('m/en/pricing').closest('[aria-hidden="true"]')).toBeTruthy()
    expect(getByTestId('content-browser-frame__copy').closest('[aria-hidden="true"]')).toBeNull()

    await fireEvent.focus(getByTestId('content-browser-frame__width-handle'))
    expect(getByText('600 × 700').closest('[aria-hidden="true"]')).toBeTruthy()
  })

  it('renders the address bar only when address is set', () => {
    const empty = render(BrowserFrame)
    expect(empty.queryByTestId('content-browser-frame__address')).toBeNull()
    empty.unmount()

    const { getByTestId } = render(BrowserFrame, {
      props: { address: 'https://www.azion.com/en/pricing' }
    })
    expect(getByTestId('content-browser-frame__address').textContent).toBe(
      'https://www.azion.com/en/pricing'
    )
  })

  it('renders the copy button only when address is set', () => {
    const empty = render(BrowserFrame)
    expect(empty.queryByTestId('content-browser-frame__copy')).toBeNull()
    expect(empty.queryByRole('button')).toBeNull()
    empty.unmount()

    const { getByTestId } = render(BrowserFrame, {
      props: { address: 'https://www.azion.com/en/pricing' }
    })
    const copy = getByTestId('content-browser-frame__copy')
    expect(getByTestId('content-browser-frame__address').contains(copy)).toBe(true)
    expect(copy.querySelector('button')).toBeTruthy()
  })

  it('names the copy button with the default and the override', () => {
    const defaults = render(BrowserFrame, { props: { address: 'https://azion.com' } })
    expect(defaults.getByRole('button', { name: 'Copy address' }).tagName).toBe('BUTTON')
    defaults.unmount()

    const { getByRole, queryByRole } = render(BrowserFrame, {
      props: { address: 'https://azion.com', copyAriaLabel: 'Copy preview URL' }
    })
    expect(getByRole('button', { name: 'Copy preview URL' }).tagName).toBe('BUTTON')
    expect(queryByRole('button', { name: 'Copy address' })).toBeNull()
  })

  it('names the copy test id after a consumer data-testid', () => {
    const { getByTestId } = render(BrowserFrame, {
      props: { address: 'https://azion.com' },
      attrs: { 'data-testid': 'custom-testid' }
    })
    expect(getByTestId('custom-testid__copy').querySelector('button')).toBeTruthy()
  })

  it('copies the full address on click without emitting an event of its own', async () => {
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    const address = 'https://www.azion.com/en/products/application-accelerator?ref=docs'
    const { getByRole, emitted } = render(BrowserFrame, { props: { address } })

    await fireEvent.click(getByRole('button', { name: 'Copy address' }))

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(address))
    expect(emitted().copy).toBeUndefined()
  })

  it('shows the size readout while a handle is focused', async () => {
    const { getByTestId } = render(BrowserFrame, { props: { width: 600, height: 700 } })
    const root = getByTestId('content-browser-frame')
    expect(root.textContent).not.toContain('600 × 700')

    await fireEvent.focus(getByTestId('content-browser-frame__height-handle'))
    expect(root.textContent).toContain('600 × 700')

    await fireEvent.blur(getByTestId('content-browser-frame__height-handle'))
    expect(root.textContent).not.toContain('600 × 700')
  })

  it('emits update:width from the keyboard map, clamped to minWidth and maxWidth', async () => {
    const { getByTestId, emitted } = render(BrowserFrame, {
      props: { width: 600, maxWidth: 650, 'onUpdate:width': () => undefined }
    })
    const handle = getByTestId('content-browser-frame__width-handle')

    await fireEvent.keyDown(handle, { key: 'ArrowRight' })
    await fireEvent.keyDown(handle, { key: 'ArrowRight', shiftKey: true })
    await fireEvent.keyDown(handle, { key: 'ArrowLeft' })
    await fireEvent.keyDown(handle, { key: 'ArrowLeft', shiftKey: true })
    await fireEvent.keyDown(handle, { key: 'Home' })
    await fireEvent.keyDown(handle, { key: 'End' })
    await fireEvent.keyDown(handle, { key: 'ArrowUp' })

    expect(emitted()['update:width']).toEqual([[610], [650], [590], [500], [320], [650]])
    expect(emitted()['update:height']).toBeUndefined()
  })

  it('emits update:height from the keyboard map, clamped to minHeight and maxHeight', async () => {
    const { getByTestId, emitted } = render(BrowserFrame, {
      props: { height: 700, maxHeight: 750, 'onUpdate:height': () => undefined }
    })
    const handle = getByTestId('content-browser-frame__height-handle')

    await fireEvent.keyDown(handle, { key: 'ArrowDown' })
    await fireEvent.keyDown(handle, { key: 'ArrowDown', shiftKey: true })
    await fireEvent.keyDown(handle, { key: 'ArrowUp' })
    await fireEvent.keyDown(handle, { key: 'ArrowUp', shiftKey: true })
    await fireEvent.keyDown(handle, { key: 'Home' })
    await fireEvent.keyDown(handle, { key: 'End' })
    await fireEvent.keyDown(handle, { key: 'ArrowRight' })

    expect(emitted()['update:height']).toEqual([[710], [750], [690], [600], [320], [750]])
    expect(emitted()['update:width']).toBeUndefined()
  })

  it('teleports the default slot into the viewport document', async () => {
    const { getByTestId, queryByTestId } = render(BrowserFrame, {
      slots: { default: () => h('p', { 'data-testid': 'slot-content' }, 'Hello frame') }
    })
    const iframe = getByTestId('content-browser-frame__viewport') as globalThis.HTMLIFrameElement
    await waitFor(() =>
      expect(
        iframe.contentDocument?.body.querySelector('[data-testid="slot-content"]')?.textContent
      ).toBe('Hello frame')
    )
    expect(queryByTestId('slot-content')).toBeNull()
  })

  it('has no axe violations on the default render', async () => {
    const { container } = render(BrowserFrame, {
      props: { address: 'https://www.azion.com/en/pricing' }
    })
    await expectNoA11yViolations(container)
  })
})
