import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import VariablesList, {
  type VariablesSavePayload
} from '../../../../blocks/edit/edit-variables/edit-variables.vue'
import NetworkList from '../../../../blocks/edit/edit-variables/variants/network-list.vue'
import PasteEnv from '../../../../blocks/edit/edit-variables/variants/paste-env.vue'
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

const visibleText = (element: HTMLElement) => {
  const copy = element.cloneNode(true) as HTMLElement
  copy.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove())
  return copy.textContent?.trim()
}

const buttonIn = (root: Document | HTMLElement, text: string) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => visibleText(button) === text
  ) as HTMLButtonElement

const wait = { timeout: 4000 }

afterEach(() => {
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

describe('variables#PasteEnv', () => {
  it('adds the pasted pairs as rows and confirms a save in a toast, as the list does', async () => {
    render(PasteEnv)
    const panel = await openDrawer(/Create Variable/)
    await waitFor(() => expect(panel.textContent).toContain('3 variables found.'))
    await fireEvent.click(buttonIn(panel, 'Add 3 variables'))
    await waitFor(() => expect(panel.querySelectorAll('input[id*="-key-"]').length).toBe(3))
    for (const key of ['API_BASE_URL', 'FEATURE_FLAGS']) {
      const input = Array.from(panel.querySelectorAll<HTMLInputElement>('input[id*="-key-"]')).find(
        (el) => el.value === key
      )!
      await fireEvent.update(input, `NEW_${key}`)
    }
    await fireEvent.click(buttonIn(panel, 'Save'))
    await waitFor(() => expect(document.body.textContent).toContain('3 variables created.'), wait)
  })

  it('confirms a single created variable by name', async () => {
    render(PasteEnv)
    const panel = await openDrawer(/Create Variable/)
    await fireEvent.click(buttonIn(panel, 'Cancel'))
    await fireEvent.click(buttonIn(panel, 'Save'))
    await waitFor(() => expect(document.body.textContent).toContain('CACHE_TTL created.'), wait)
  })
})

describe('variables#List', () => {
  it('draws the key and value fields with InputGroupInput and uppercases the key', async () => {
    render(VariablesList)
    const { key, value } = await openCreate()
    expect(key.dataset.testid).toBe('input-group-input')
    expect(value.dataset.testid).toBe('input-group-input')
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
    render(VariablesList, { props: { saveError: 'EditVariables not saved. You are offline.' } })
    const { panel, key, value } = await openCreate()
    await userEvent.type(key, 'NEW_KEY')
    await userEvent.type(value, 'on')
    await fireEvent.click(buttonIn(panel, 'Save'))
    await waitFor(
      () =>
        expect(panel.querySelector('[data-testid="variables-save-error"]')?.textContent).toContain(
          'EditVariables not saved.'
        ),
      wait
    )
    expect(dialog()).not.toBeNull()
    expect(key.value).toBe('NEW_KEY')
  })
})

describe('variables data contract', () => {
  const given = [
    {
      id: 'v-100',
      key: 'ACME_REGION',
      value: 'us-east',
      secret: false,
      scope: [{ type: 'global', id: '', name: '' }],
      lastEditor: 'Priya Patel',
      lastEditorAvatar: '',
      lastModified: '5 minutes ago'
    }
  ]

  it('renders the variables it is given instead of the sample', async () => {
    render(VariablesList, { props: { variables: given } })
    await waitFor(() => expect(document.body.textContent).toContain('ACME_REGION'))
    expect(document.body.textContent).not.toContain('API_BASE_URL')
  })

  it('shows the state-first-use empty state for an empty list', async () => {
    render(VariablesList, { props: { variables: [] } })
    await waitFor(() => expect(document.body.textContent).toContain('No variables yet'))
  })

  it('emits refresh instead of faking a reload', async () => {
    const { emitted } = render(VariablesList, { props: { variables: given } })
    await userEvent.click(document.querySelector('[aria-label="Refresh"]') as HTMLElement)
    expect(emitted().refresh).toHaveLength(1)
  })

  it('emits save with the pairs and waits for saving to end before closing', async () => {
    const saves: VariablesSavePayload[] = []
    const { emitted, rerender } = render(VariablesList, {
      props: {
        variables: given,
        onSave: (_event: Event, payload: VariablesSavePayload) => {
          saves.push(payload)
          void rerender({ variables: given, saving: true })
        }
      }
    })
    const { panel, key, value } = await openCreate()
    await userEvent.type(key, 'NEW_KEY')
    await userEvent.type(value, 'on')
    await fireEvent.click(buttonIn(panel, 'Save'))
    await waitFor(() => expect(saves).toHaveLength(1))
    const [[event, payload]] = emitted().save as [[Event, VariablesSavePayload]]
    expect(event).toBeInstanceOf(Event)
    expect(payload.variable).toBeNull()
    expect(payload.values).toEqual([
      { key: 'NEW_KEY', value: 'on', secret: false, scope: [{ type: 'global', id: '', name: '' }] }
    ])
    expect(dialog()).not.toBeNull()
    await rerender({ variables: given, saving: false })
    await waitFor(() => expect(document.body.textContent).toContain('NEW_KEY created.'), wait)
    await waitFor(() => expect(dialog()).toBeNull(), wait)
  })

  it('opens on the create drawer with defaultOpen', async () => {
    render(VariablesList, { props: { variables: given, defaultOpen: true } })
    await waitFor(() => expect(dialog()?.textContent).toContain('Create Variable'))
  })
})

const apple = /mac/i.test(navigator.platform || navigator.userAgent)
const pressShortcut = (key: string, target: Element = document.body) => {
  const event = new KeyboardEvent('keydown', {
    key,
    metaKey: apple,
    ctrlKey: !apple,
    bubbles: true,
    cancelable: true
  })
  target.dispatchEvent(event)
  return event
}

describe('edit-variables keyboard', () => {
  it('submits the create drawer on Command Enter from a field', async () => {
    const { emitted } = render(VariablesList)
    const { panel, key, value } = await openCreate()
    const save = Array.from(panel.querySelectorAll('button')).find(
      (button) => visibleText(button) === 'Save'
    ) as HTMLButtonElement
    expect(save.getAttribute('aria-keyshortcuts')).toBe('Meta+Enter Control+Enter')
    await userEvent.type(key, 'NEW_KEY')
    await userEvent.type(value, 'on')
    expect(pressShortcut('Enter', value).defaultPrevented).toBe(true)
    await waitFor(() => expect(emitted().save).toHaveLength(1))
  })
})
