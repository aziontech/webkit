import { fireEvent, render, screen, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import DeployDrawer from '../../../../blocks/create/deploy-drawer/deploy-drawer.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()
describe('deploy-drawer', () => {
  it('opens domains through Link in a new tab and names the version and overflow controls', async () => {
    render(DeployDrawer)
    await fireEvent.click(screen.getByRole('button', { name: 'Deploy' }))
    const dialog = await screen.findByRole('dialog')
    const external = within(dialog)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('target') === '_blank')
    expect(external.length).toBeGreaterThan(0)
    external.forEach((link) => expect(link.getAttribute('rel')).toBe('noopener noreferrer'))
    expect(
      within(dialog).getAllByRole('button', { name: /^Change version of / }).length
    ).toBeGreaterThan(0)
    expect(within(dialog).getAllByRole('button', { name: /more domains$/ }).length).toBeGreaterThan(
      0
    )
    expect(dialog.textContent).not.toMatch(/publish/i)
  })
})
