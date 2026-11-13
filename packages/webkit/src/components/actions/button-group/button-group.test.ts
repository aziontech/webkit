import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/button-group/default.vue'
import WithOverflow from '../../../../examples/button-group/with-overflow.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import ButtonGroup, { type ButtonGroupItem } from './button-group.vue'

const items: ButtonGroupItem[] = [
  { id: 'copy', label: 'Copy', icon: 'pi pi-copy' },
  { id: 'off', label: 'Disabled', icon: 'pi pi-ban', disabled: true },
  { id: 'wrap', type: 'toggle', label: 'Wrap lines', icon: 'pi pi-arrows-h', pressed: true },
  {
    id: 'download',
    type: 'menu',
    label: 'Download',
    icon: 'pi pi-download',
    options: [
      { id: 'js', label: 'As .js' },
      { id: 'zip', label: 'As .zip' }
    ]
  }
]

const buttons = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLButtonElement>('[data-button-group-item]'))

const menuItems = () => Array.from(document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'))

describe('ButtonGroup', () => {
  it('renders a named toolbar with one icon button per item', () => {
    const { getByRole } = render(ButtonGroup, { props: { items, ariaLabel: 'Editor actions' } })
    const toolbar = getByRole('toolbar')
    expect(toolbar.getAttribute('aria-label')).toBe('Editor actions')
    expect(toolbar.getAttribute('data-testid')).toBe('actions-button-group')
    expect(buttons(toolbar).map((b) => b.getAttribute('aria-label'))).toEqual([
      'Copy',
      'Disabled',
      'Wrap lines',
      'Download'
    ])
  })

  it('emits click with the id, and toggle with the next pressed state', async () => {
    const view = render(ButtonGroup, { props: { items, ariaLabel: 'Actions' } })
    const [copy, disabled, wrap] = buttons(view.getByRole('toolbar'))
    expect(wrap!.getAttribute('aria-pressed')).toBe('true')
    expect(copy!.hasAttribute('aria-pressed')).toBe(false)
    await fireEvent.click(copy!)
    await fireEvent.click(disabled!)
    await fireEvent.click(wrap!)
    const clicks = view.emitted('click') as [Event, string][]
    expect(clicks).toHaveLength(1)
    expect(clicks[0]![0]).toBeInstanceOf(MouseEvent)
    expect(clicks[0]![1]).toBe('copy')
    expect(view.emitted('toggle')).toEqual([[{ id: 'wrap', pressed: false }]])
  })

  it('emits click with the keyboard event first when an action is activated with Enter', async () => {
    const user = userEvent.setup()
    const view = render(ButtonGroup, { props: { items, ariaLabel: 'Actions' } })
    const [copy] = buttons(view.getByRole('toolbar'))
    copy!.focus()
    await user.keyboard('{Enter}')
    const clicks = view.emitted('click') as [Event, string][]
    expect(clicks).toHaveLength(1)
    expect(clicks[0]![0]).toBeInstanceOf(Event)
    expect(clicks[0]![1]).toBe('copy')
  })

  it('keeps one tab stop and moves with arrows, Home and End, skipping disabled items', async () => {
    const view = render(ButtonGroup, { props: { items, ariaLabel: 'Actions' } })
    const [copy, disabled, wrap, download] = buttons(view.getByRole('toolbar'))
    expect([copy, wrap, download].map((b) => b!.tabIndex)).toEqual([0, -1, -1])
    expect(disabled!.disabled).toBe(true)
    copy!.focus()
    await fireEvent.keyDown(copy!, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(wrap)
    await waitFor(() => expect(wrap!.tabIndex).toBe(0))
    expect(copy!.tabIndex).toBe(-1)
    await fireEvent.keyDown(wrap!, { key: 'End' })
    expect(document.activeElement).toBe(download)
    await fireEvent.keyDown(download!, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(copy)
    await fireEvent.keyDown(copy!, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(download)
    await fireEvent.keyDown(download!, { key: 'Home' })
    expect(document.activeElement).toBe(copy)
  })

  it('swaps the arrow keys under rtl', async () => {
    const view = render(
      {
        components: { ButtonGroup },
        setup: () => ({ items }),
        template: '<div dir="rtl"><ButtonGroup :items="items" aria-label="Actions" /></div>'
      },
      {}
    )
    const [copy, , wrap] = buttons(view.getByRole('toolbar'))
    copy!.focus()
    await fireEvent.keyDown(copy!, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(wrap)
  })

  it('opens a menu item and emits click with the chosen option', async () => {
    const view = render(ButtonGroup, { props: { items, ariaLabel: 'Actions' } })
    const download = buttons(view.getByRole('toolbar'))[3]!
    expect(download.getAttribute('aria-haspopup')).toBe('menu')
    await fireEvent.click(download)
    await waitFor(() => expect(menuItems().length).toBe(2))
    await fireEvent.click(menuItems()[1]!)
    const clicks = view.emitted('click') as [Event, string][]
    expect(clicks).toHaveLength(1)
    expect(clicks[0]![0]).toBeInstanceOf(MouseEvent)
    expect(clicks[0]![1]).toBe('zip')
  })

  it('moves items past visibleCount into the More actions menu', async () => {
    const view = render(ButtonGroup, {
      props: { items, ariaLabel: 'Actions', visibleCount: 1 }
    })
    const toolbar = view.getByRole('toolbar')
    const controls = buttons(toolbar)
    expect(controls.map((b) => b.getAttribute('aria-label'))).toEqual(['Copy', 'More actions'])
    const more = view.getByTestId('actions-button-group__overflow-trigger')
    await fireEvent.click(more)
    await waitFor(() => expect(menuItems().length).toBe(4))
    expect(menuItems().map((m) => m.textContent?.trim())).toEqual([
      'Disabled',
      'Wrap linesOn',
      'As .js',
      'As .zip'
    ])
    expect(menuItems()[0]!.getAttribute('aria-disabled')).toBe('true')
    await fireEvent.click(menuItems()[1]!)
    expect(view.emitted('toggle')).toEqual([[{ id: 'wrap', pressed: false }]])
  })

  it('uses the overflowLabel override', () => {
    const view = render(ButtonGroup, {
      props: { items, ariaLabel: 'Actions', visibleCount: 0, overflowLabel: 'Options' }
    })
    expect(buttons(view.getByRole('toolbar')).map((b) => b.getAttribute('aria-label'))).toEqual([
      'Options'
    ])
  })

  it('maps kind and size onto the buttons', () => {
    const view = render(ButtonGroup, {
      props: { items, ariaLabel: 'Actions', kind: 'outlined', size: 'small' }
    })
    const root = view.getByRole('toolbar')
    expect(root.getAttribute('data-kind')).toBe('outlined')
    expect(root.getAttribute('data-size')).toBe('small')
    expect(buttons(root)[0]!.className).toContain('size-7')
  })

  it('renders the examples without axe violations', async () => {
    for (const example of [Default, WithOverflow]) {
      const { container, unmount } = render(example)
      await expectNoA11yViolations(container)
      unmount()
    }
  })
})

describe('ButtonGroup accessible name', () => {
  it('takes its name from the kebab aria-label attribute a template writes', () => {
    const { getByRole } = render({
      components: { ButtonGroup },
      data: () => ({ items }),
      template: '<ButtonGroup :items="items" aria-label="Editor actions" />'
    })

    expect(getByRole('toolbar', { name: 'Editor actions' })).toHaveAttribute(
      'aria-label',
      'Editor actions'
    )
  })

  it('takes a bound :aria-label and follows its changes', async () => {
    const { getByRole, getByTestId } = render({
      components: { ButtonGroup },
      data: () => ({ items, surface: 'Editor' }),
      template: `
        <div>
          <ButtonGroup :items="items" :aria-label="surface + ' actions'" />
          <button type="button" data-testid="rename" @click="surface = 'Preview'">rename</button>
        </div>
      `
    })

    expect(getByRole('toolbar', { name: 'Editor actions' })).toBeTruthy()
    await fireEvent.click(getByTestId('rename'))
    expect(getByRole('toolbar', { name: 'Preview actions' })).toBeTruthy()
  })

  it('renders no empty aria-label when aria-labelledby names it', async () => {
    const { getByRole, container } = render({
      components: { ButtonGroup },
      data: () => ({ items }),
      template: `
        <div>
          <h2 id="records-title">Records</h2>
          <ButtonGroup :items="items" aria-labelledby="records-title" />
        </div>
      `
    })

    const toolbar = getByRole('toolbar', { name: 'Records' })
    expect(toolbar).not.toHaveAttribute('aria-label')
    expect(toolbar).toHaveAttribute('aria-labelledby', 'records-title')
    await expectNoA11yViolations(container)
  })
})
