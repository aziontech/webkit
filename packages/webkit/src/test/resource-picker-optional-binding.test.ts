import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import OptionalBinding from '../../blocks/platform/create/resource-picker/variants/optional-binding.vue'
import { expectNoA11yViolations } from './axe'

describe('resource-picker#OptionalBinding', () => {
  it('opens on New with the name prefilled and the DDoS module locked on', async () => {
    const view = render(OptionalBinding)
    await expectNoA11yViolations(view.container)
    const name = screen.getByRole<HTMLInputElement>('textbox', { name: /Firewall name/ })
    expect(name.value).toBe('web-app-firewall')
    const ddos = screen.getByRole<HTMLInputElement>('switch', { name: 'DDoS Protection' })
    expect(ddos.hasAttribute('disabled') || ddos.getAttribute('aria-disabled') === 'true').toBe(
      true
    )
    expect(screen.getByRole('switch', { name: 'WAF' }).getAttribute('aria-checked')).toBe('true')
  })

  it('switches to Existing and pages the firewalls with a search', async () => {
    render(OptionalBinding)
    await fireEvent.click(screen.getByRole('radio', { name: 'Existing firewall' }))
    expect(screen.getByRole('status').textContent).toBe('5 of 7 firewalls')
    await fireEvent.click(screen.getByRole('button', { name: /api-firewall/ }))
    expect(screen.getByRole('button', { name: /api-firewall/, pressed: true })).toBeTruthy()
    await fireEvent.update(screen.getByRole('textbox', { name: 'Search firewalls' }), 'zzz')
    expect(screen.getByText(/No firewall matches “zzz”/)).toBeTruthy()
  })

  it('turning the switch off makes the binding inert', async () => {
    render(OptionalBinding)
    await fireEvent.click(screen.getByRole('switch', { name: 'Protect with a firewall' }))
    const name = screen.getByRole('textbox', { name: /Firewall name/ })
    expect(name.closest('[inert]')).not.toBeNull()
  })
})
