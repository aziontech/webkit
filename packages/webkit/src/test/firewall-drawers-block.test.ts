import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Certificate from '../../blocks/platform/create/create-in-drawer/variants/certificate.vue'
import NetworkList from '../../blocks/platform/edit/attribute-editor/variants/network-list.vue'
import RulesReview from '../../blocks/platform/view/rules-list/variants/review-changes.vue'
import WafAllow from '../../blocks/platform/view/waf-tuning/variants/allow.vue'
import { expectNoA11yViolations } from './axe'

const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null

const openDrawer = async (label: RegExp) => {
  const trigger = Array.from(document.querySelectorAll('button')).find((button) =>
    label.test(button.textContent ?? '')
  ) as HTMLButtonElement
  await fireEvent.click(trigger)
  await waitFor(() => expect(dialog()).not.toBeNull())
  return dialog() as HTMLElement
}

const buttonIn = (root: HTMLElement, text: string) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement

describe('attribute-editor#NetworkList', () => {
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

describe('create-in-drawer#Certificate', () => {
  it('reads the pasted certificate and flags the missing private key only after Save', async () => {
    render(Certificate)
    const panel = await openDrawer(/Create Certificate/)
    const details = await waitFor(() => {
      const node = panel.querySelector('[data-testid="certificate-details"]')
      expect(node).not.toBeNull()
      return node as HTMLElement
    })
    expect(details.textContent).toContain('shop.example.com')
    expect(details.textContent).toContain('Example Test CA')
    expect(details.textContent).toContain('Nov 30, 2028')
    expect(panel.textContent).not.toContain('Paste the private key')
    await expectNoA11yViolations(panel)
    await fireEvent.click(buttonIn(panel, 'Save'))
    await waitFor(() =>
      expect(panel.textContent).toContain('Paste the private key that signed the certificate.')
    )
    await waitFor(() => expect(document.activeElement?.tagName).toBe('TEXTAREA'))
  })
})

describe('open dialogs of the firewall-rules blocks', () => {
  it('rules-list review dialog has no axe violations', async () => {
    render(RulesReview)
    await waitFor(() => expect(dialog()).not.toBeNull())
    await expectNoA11yViolations(dialog() as HTMLElement)
  })

  it('waf-tuning allow dialog flags the empty reason only after Allow rules, then has no axe violations', async () => {
    render(WafAllow)
    await waitFor(() => expect(dialog()).not.toBeNull())
    const panel = dialog() as HTMLElement
    expect(panel.textContent).toContain('Allow 2 rules')
    expect(panel.textContent).toContain('6 in all')
    expect(panel.textContent).not.toContain('Enter why these requests are legitimate.')
    await fireEvent.click(buttonIn(panel, 'Allow rules'))
    await waitFor(() =>
      expect(panel.textContent).toContain('Enter why these requests are legitimate.')
    )
    await waitFor(() => expect(document.activeElement?.tagName).toBe('TEXTAREA'))
    await expectNoA11yViolations(panel)
  })
})
