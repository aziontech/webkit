import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/doc-tab/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocTab from './doc-tab.vue'

describe('DocTab', () => {
  it('renders its body as a contents wrapper on its own', () => {
    const { getByTestId } = render(DocTab, {
      props: { title: 'CLI' },
      slots: { default: '<p>Run it</p>' }
    })
    const tab = getByTestId('documentation-doc-tab')
    expect(tab).toHaveClass('contents')
    expect(tab).toHaveTextContent('Run it')
  })

  it('gives DocTabs its title', () => {
    const { getByRole } = render(Default)
    expect(getByRole('tab', { name: 'CLI' })).toBeInTheDocument()
  })

  it('has no axe violations inside DocTabs', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })
})
