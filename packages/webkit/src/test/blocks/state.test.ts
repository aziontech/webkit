import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import AsyncSubmit from '../../../blocks/state/async-submit/async-submit.vue'
import SectionRejected from '../../../blocks/state/form-validation/variants/section-rejected.vue'

afterEach(() => cleanup())
describe('state async-submit and form-validation', () => {
  it('async-submit: no simulation panel, and Deploy starts the run', async () => {
    const view = render(AsyncSubmit)
    expect(view.queryByRole('complementary', { name: 'Scenario simulation' })).toBeNull()
    expect(view.getByRole('heading', { level: 1, name: 'Deploy web-app' })).toBeTruthy()
    await fireEvent.click(view.getByRole('button', { name: 'Deploy' }))
    await waitFor(() => expect(view.container.textContent).toContain('Deploying'))
    view.unmount()
  })

  it('form-validation SectionRejected: the section alert recovers with Reload origins', async () => {
    const view = render(SectionRejected)
    expect(view.queryByRole('complementary', { name: 'Scenario simulation' })).toBeNull()
    expect(view.getByRole('link', { name: 'Services' })).toBeTruthy()
    expect(view.container.textContent).toContain('This origin no longer exists.')
    await fireEvent.click(view.getByRole('button', { name: 'Reload origins' }))
    await waitFor(
      () => expect(view.container.textContent).toContain('Select an origin to continue.'),
      { timeout: 4000 }
    )
    expect(view.container.textContent).not.toContain('This origin no longer exists.')
  })
})
