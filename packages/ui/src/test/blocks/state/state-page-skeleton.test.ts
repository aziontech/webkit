import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import PageSkeleton from '../../../../blocks/state/state-page-skeleton/state-page-skeleton.vue'
import SessionHome from '../../../../blocks/state/state-page-skeleton/variants/session-home.vue'
import { expectNoA11yViolations } from '../../axe'

describe('state/state-page-skeleton', () => {
  it('Overview: one busy status region reads its label', () => {
    const view = render(PageSkeleton)
    const status = view.getByRole('status')
    expect(status).toHaveAttribute('aria-busy', 'true')
    expect(status.textContent).toContain('Loading the overview.')
  })

  it('SessionHome: the Overview wire inside the shell, with one status region', async () => {
    const view = render(SessionHome)
    const regions = view.getAllByRole('status')
    expect(regions).toHaveLength(1)
    expect(regions[0]).toHaveAttribute('aria-busy', 'true')
    expect(regions[0].textContent).toContain('Session expired. Signing you out.')
    expect(view.container.textContent).not.toContain('Loading the overview.')
    await expectNoA11yViolations(view.container as HTMLElement)
  })
})
