import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import ResourcePicker from '../../../../blocks/create/resource-picker/resource-picker.vue'
import ResourcePickerEmpty from '../../../../blocks/create/resource-picker/variants/empty.vue'
import OptionalBinding from '../../../../blocks/create/resource-picker/variants/optional-binding.vue'
import { expectNoA11yViolations } from '../../axe'

describe('resource-picker', () => {
  it('opens on New with no toggle when nothing exists to bind', async () => {
    const view = render(ResourcePickerEmpty)
    expect(screen.queryByRole('radiogroup')).toBeNull()
    expect(screen.queryByRole('radio', { name: 'Existing project' })).toBeNull()
    expect(screen.getByRole('textbox', { name: /Name/ })).toBeTruthy()
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('keeps the toggle and gives every project a repository when projects exist', () => {
    render(ResourcePicker)
    expect(screen.getByRole('radio', { name: 'Existing project' })).toBeTruthy()
    expect(document.body.textContent).not.toMatch(/· \s*(\n|$)/)
    expect(document.body.textContent).not.toContain('shopco')
  })
})

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
