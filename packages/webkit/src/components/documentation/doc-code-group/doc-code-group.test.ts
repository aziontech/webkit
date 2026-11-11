import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { h } from 'vue'

import Default from '../../../../examples/doc-code-group/default.vue'
import Group from '../../../../examples/doc-code-group/group.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocCodeGroup from './doc-code-group.vue'

describe('DocCodeGroup', () => {
  it('renders one sample as a code block', () => {
    const { getByTestId } = render(Default)
    const root = getByTestId('documentation-doc-code-group')
    expect(root).toHaveAttribute('data-doc-chrome')
    expect(root.querySelector('code')?.textContent).toContain('azion link --preset vue')
  })

  it('renders several samples as tabs labelled by what differs', async () => {
    const { getAllByRole, container } = render(Group)
    const tabs = getAllByRole('tab')
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual(['npm', 'pnpm', 'yarn'])
    await userEvent.click(tabs[1])
    expect(container.textContent).toContain('pnpm add @aziontech/webkit')
  })

  it('falls back to the language for a label', () => {
    const { getAllByRole } = render(DocCodeGroup, {
      props: {
        samples: [
          { language: 'bash', code: 'a' },
          { language: 'js', code: 'b' }
        ]
      }
    })
    expect(getAllByRole('tab').map((tab) => tab.textContent?.trim())).toEqual(['bash', 'js'])
  })

  it('renders nothing inside the wrapper without samples', () => {
    const { getByTestId } = render(DocCodeGroup)
    expect(getByTestId('documentation-doc-code-group').children).toHaveLength(0)
  })

  it('renders under rtl', () => {
    const { container } = render({ render: () => h('div', { dir: 'rtl' }, [h(Default)]) })
    expect(container.textContent).toContain('azion link')
  })

  it('has no axe violations', async () => {
    const { container } = render(Group)
    await expectNoA11yViolations(container)
  })
})
