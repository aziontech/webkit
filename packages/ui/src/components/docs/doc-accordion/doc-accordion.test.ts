import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/doc-accordion/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocAccordion from './doc-accordion.vue'

describe('DocAccordion', () => {
  it('renders its body as a contents wrapper on its own', () => {
    const { getByTestId } = render(DocAccordion, {
      props: { title: 'Q' },
      slots: { default: '<p>Answer</p>' }
    })
    const item = getByTestId('doc-accordion')
    expect(item).toHaveClass('contents')
    expect(item).toHaveTextContent('Answer')
  })

  it('gives the group its title and open state', () => {
    const { getByRole, getByText } = render(Default)
    expect(getByRole('button', { name: /stale object/ })).toHaveAttribute('aria-expanded', 'true')
    expect(getByText(/last good copy/)).toBeVisible()
  })

  it('has no axe violations inside a group', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })
})
