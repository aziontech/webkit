import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import VariablesList from '../../../../blocks/edit/variables/variables.vue'
import NetworkList from '../../../../blocks/edit/variables/variants/network-list.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null

const openDrawer = async (label: RegExp) => {
  const trigger = Array.from(document.querySelectorAll('button')).find((button) =>
    label.test(button.textContent ?? '')
  ) as HTMLButtonElement
  await userEvent.click(trigger)
  await waitFor(() => expect(dialog()).not.toBeNull())
  return dialog() as HTMLElement
}

const buttonIn = (root: Document | HTMLElement, text: string) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement

const wait = { timeout: 4000 }

const restoreOnline = () =>
  Object.defineProperty(globalThis.navigator, 'onLine', { configurable: true, value: true })

afterEach(() => {
  restoreOnline()
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})

const openCreate = async () => {
  await userEvent.click(buttonIn(document, 'Create Variable'))
  await waitFor(() => expect(dialog()).not.toBeNull())
  const panel = dialog() as HTMLElement
  const [key, value] = Array.from(
    panel.querySelectorAll<HTMLInputElement>('input[id*="-key-"], input[id*="-value-"]')
  )
  return { panel, key, value }
}
describe('variables#NetworkList', () => {
  it('reports invalid and repeated lines, adds every new line as a row and shows each invalid row its error', async () => {
    render(NetworkList)
    const panel = await openDrawer(/Create Network List/)
    await waitFor(() => expect(panel.textContent).toContain('7 entries found.'))
    expect(panel.textContent).toContain(
      'Lines 4 and 8 are not an IPv4 or IPv6 address, or a CIDR range; they are added with an error to fix.'
    )
    expect(panel.textContent).toContain('Line 7 is already in the list and will be skipped.')
    await fireEvent.click(buttonIn(panel, 'Add 7 entries'))
    await waitFor(() => expect(panel.querySelectorAll('[data-testid$="__row"]').length).toBe(7))
    expect(panel.textContent).toContain(
      '198.51.100.300 is not an IPv4 or IPv6 address, or a CIDR range.'
    )
    expect(panel.textContent).toContain(
      '192.0.2.0/33 is not an IPv4 or IPv6 address, or a CIDR range.'
    )
    expect(panel.textContent).toContain('7 entries added from the pasted list. 2 need a fix.')
    await expectNoA11yViolations(panel)
  })
})

describe('variables#List', () => {
  it('draws the key and value fields with InputGroupInput and uppercases the key', async () => {
    render(VariablesList)
    const { key, value } = await openCreate()
    expect(key.dataset.testid).toBe('input-input-group-input')
    expect(value.dataset.testid).toBe('input-input-group-input')
    await userEvent.type(key, 'new key')
    expect(key.value).toBe('NEW_KEY')
  })

  it('raises a success toast after creating a variable', async () => {
    render(VariablesList)
    const { panel, key, value } = await openCreate()
    await userEvent.type(key, 'NEW_KEY')
    await userEvent.type(value, 'on')
    await fireEvent.click(buttonIn(panel, 'Save'))
    await waitFor(() => expect(document.body.textContent).toContain('NEW_KEY created.'), wait)
    await waitFor(() => expect(dialog()).toBeNull(), wait)
  })

  it('keeps the drawer open with a danger alert when the save fails', async () => {
    Object.defineProperty(globalThis.navigator, 'onLine', { configurable: true, value: false })
    render(VariablesList)
    const { panel, key, value } = await openCreate()
    await userEvent.type(key, 'NEW_KEY')
    await userEvent.type(value, 'on')
    await fireEvent.click(buttonIn(panel, 'Save'))
    await waitFor(
      () =>
        expect(panel.querySelector('[data-testid="variables-save-error"]')?.textContent).toContain(
          'Variables not saved.'
        ),
      wait
    )
    expect(dialog()).not.toBeNull()
    expect(key.value).toBe('NEW_KEY')
  })
})
