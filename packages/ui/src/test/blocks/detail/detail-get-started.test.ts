import { cleanup, fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import DetailGetStarted from '../../../../blocks/detail/detail-get-started/detail-get-started.vue'
import Ci from '../../../../blocks/detail/detail-get-started/variants/ci.vue'
import { expectNoA11yViolations } from '../../axe'

afterEach(() => cleanup())

describe('detail/detail-get-started', () => {
  it('fills the link command with the resource it is given', async () => {
    const view = render(DetailGetStarted, { props: { resourceName: 'acme-store' } })
    expect(view.container.textContent).toContain('Install the CLI')
    expect(view.container.textContent).toContain('--name acme-store')
    expect(view.container.textContent).not.toContain('analytics-app')
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('switches paths and emits the new one', async () => {
    const view = render(DetailGetStarted)
    await fireEvent.click(view.getByRole('radio', { name: 'GitHub Actions' }))
    expect(view.emitted('update:modelValue')?.[0]).toEqual(['actions'])
    expect(view.container.textContent).toContain('Store your personal token')
  })

  it('opens on the GitHub Actions path in the Ci variant', () => {
    const view = render(Ci)
    expect(view.container.textContent).toContain('Push to deploy')
    expect(view.container.textContent).not.toContain('Install the CLI')
  })
})
