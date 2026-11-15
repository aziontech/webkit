import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import ReleaseImpact from '../../../../blocks/create/release-impact/release-impact.vue'
import ReleaseImpactSettings from '../../../../blocks/create/release-impact/variants/choose-settings.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()
describe('release-impact', () => {
  it('names each resource card and gives the read-only resource a real control', async () => {
    const view = render(ReleaseImpact)
    expect(screen.getByRole('heading', { level: 1, name: 'Review and deploy' })).toBeTruthy()
    const regions = screen.getAllByRole('region')
    expect(regions.length).toBeGreaterThan(1)
    const resources = screen.getAllByRole('textbox', { name: 'Resource' })
    expect(resources.length).toBeGreaterThan(0)
    resources.forEach((input) => expect(input.hasAttribute('readonly')).toBe(true))
    expect(screen.getByRole('button', { name: /Deploy release/ })).toBeTruthy()
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('selects settings with an overflow chip and a no-match EmptyState', async () => {
    render(ReleaseImpactSettings)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Select Deployment Settings' })
    ).toBeTruthy()
    await fireEvent.update(
      screen.getByRole('textbox', { name: 'Search Deployment Settings' }),
      'nothing-like-this'
    )
    expect(screen.getByText('No Deployment Settings match')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.queryByText('No Deployment Settings match')).toBeNull()
  })
})
