import userEvent from '@testing-library/user-event'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import Default from '../../../../examples/shortcuts-dialog/default.vue'
import { useShortcuts } from '../../../composables/use-shortcuts'
import { expectNoA11yViolations } from '../../../test/axe'
import ShortcutsDialog from './shortcuts-dialog.vue'

const settle = async () => {
  await nextTick()
  await nextTick()
}

const byTestId = (id: string) => document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)
const dialog = () => document.body.querySelector<HTMLElement>('[role="dialog"]')

const apple = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent || '')

describe('ShortcutsDialog', () => {
  it('opens on ? and lists every registered shortcut, grouped', async () => {
    render(Default)
    await settle()
    expect(dialog()).toBeNull()

    await userEvent.keyboard('?')
    await settle()

    const panel = dialog()
    expect(panel).toBeTruthy()
    expect(panel!.textContent).toContain('Keyboard shortcuts')
    const groups = Array.from(
      document.body.querySelectorAll<HTMLElement>('[data-testid="shortcuts-dialog__group"]')
    )
    expect(groups.map((group) => group.querySelector('h3')!.textContent!.trim())).toEqual([
      'General',
      'Page',
      'Editor'
    ])
    expect(groups[0]!.getAttribute('aria-labelledby')).toBe(groups[0]!.querySelector('h3')!.id)
    const labels = Array.from(panel!.querySelectorAll('dt')).map((dt) => dt.textContent!.trim())
    expect(labels).toEqual([
      'Show keyboard shortcuts',
      'Focus search',
      'Save changes',
      'Submit the form'
    ])
    await expectNoA11yViolations(panel!)
  })

  it('draws each key with Kbd, Command on Apple and Ctrl elsewhere', async () => {
    render(ShortcutsDialog, { props: { open: true } })
    const Page = defineComponent({
      setup() {
        useShortcuts({ keys: 'meta+s', label: 'Save changes', handler: () => {} })
        return () => h('div')
      }
    })
    render(Page)
    await settle()
    const row = Array.from(
      document.body.querySelectorAll<HTMLElement>('[data-testid="shortcuts-dialog__item"]')
    ).find((item) => item.textContent!.includes('Save changes'))!
    const keys = Array.from(row.querySelectorAll('[data-testid="kbd__key"]')).map((key) =>
      key.textContent!.trim()
    )
    expect(keys).toEqual([apple ? '⌘' : 'Ctrl', 'S'])
  })

  it('does not open while typing in a field', async () => {
    const { getByLabelText } = render(Default)
    await settle()

    await userEvent.click(getByLabelText('Search domains'))
    await userEvent.keyboard('?')
    await settle()

    expect(dialog()).toBeNull()
  })

  it('ignores IME composition', async () => {
    render(ShortcutsDialog)
    await settle()
    await fireEvent.keyDown(document.body, { key: '?', isComposing: true })
    await settle()
    expect(dialog()).toBeNull()
  })

  it('/ focuses the page search and the modifier shortcut works inside it', async () => {
    const { getByLabelText, getByText } = render(Default)
    await settle()

    await userEvent.keyboard('/')
    const search = getByLabelText('Search domains')
    expect(document.activeElement).toBe(search)

    await userEvent.keyboard(apple ? '{Meta>}s{/Meta}' : '{Control>}s{/Control}')
    await settle()
    expect(getByText('Changes saved.')).toBeTruthy()
  })

  it('Esc closes it and focus returns to where it was', async () => {
    const { getByRole } = render(Default)
    await settle()
    const trigger = getByRole('button', { name: 'Keyboard shortcuts' })
    trigger.focus()

    await userEvent.keyboard('?')
    await settle()
    expect(dialog()).toBeTruthy()

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(dialog()).toBeNull())
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger))
  })

  it('the trigger opens it and carries aria-keyshortcuts', async () => {
    const { getByRole } = render(Default)
    await settle()
    const trigger = getByRole('button', { name: 'Keyboard shortcuts' })
    expect(trigger.getAttribute('aria-keyshortcuts')).toBe('?')
    await userEvent.click(trigger)
    await settle()
    expect(dialog()).toBeTruthy()
  })

  it('a custom shortcut replaces ?, and an empty one binds nothing', async () => {
    const { rerender } = render(ShortcutsDialog, { props: { shortcut: 'shift+k' } })
    await settle()
    await userEvent.keyboard('?')
    await settle()
    expect(dialog()).toBeNull()
    await userEvent.keyboard('{Shift>}K{/Shift}')
    await settle()
    expect(dialog()).toBeTruthy()

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(dialog()).toBeNull())
    await rerender({ shortcut: '' })
    await settle()
    await userEvent.keyboard('{Shift>}K{/Shift}')
    await settle()
    expect(dialog()).toBeNull()
  })

  it('shows the empty state when nothing is registered', async () => {
    render(ShortcutsDialog, { props: { open: true, shortcut: '' } })
    await settle()
    expect(byTestId('shortcuts-dialog__empty')!.textContent).toContain('No keyboard shortcuts here')
  })

  it('honours a consumer data-testid and a title', async () => {
    render(ShortcutsDialog, {
      props: { open: true, title: 'Shortcuts' },
      attrs: { 'data-testid': 'help-shortcuts' }
    })
    await settle()
    expect(byTestId('help-shortcuts__group')).toBeTruthy()
    expect(dialog()!.textContent).toContain('Shortcuts')
  })

  it('emits update:open when ? opens it', async () => {
    const { emitted } = render(ShortcutsDialog)
    await settle()
    await userEvent.keyboard('?')
    await settle()
    expect(emitted()['update:open']?.[0]).toEqual([true])
  })
})
