import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent } from 'vue'

import Default from '../../../../examples/doc-tabs/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocTab from '../doc-tab/doc-tab.vue'
import DocTabs from './doc-tabs.vue'

describe('DocTabs', () => {
  it('builds one tab per DocTab from its title and selects the first', () => {
    const { getAllByRole, getByTestId } = render(Default)
    const tabs = getAllByRole('tab')
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual(['macOS', 'Linux', 'Windows'])
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(getByTestId('documentation-doc-tabs')).toHaveAttribute('data-doc-block')
  })

  it('labels a tab with no title by its position', () => {
    const { getAllByRole } = render(
      defineComponent({
        components: { DocTabs, DocTab },
        template: `<DocTabs><DocTab title="A">a</DocTab><DocTab>b</DocTab></DocTabs>`
      })
    )
    expect(getAllByRole('tab')[1]).toHaveTextContent('2')
  })

  it('moves between tabs with the arrow keys', async () => {
    const { getAllByRole } = render(Default)
    const tabs = getAllByRole('tab')
    tabs[0].focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(tabs[1])
  })

  it('shows the selected panel body', async () => {
    const { getAllByRole, getByText } = render(Default)
    await userEvent.click(getAllByRole('tab')[1])
    expect(getByText(/Download the binary/)).toBeVisible()
  })

  it('renders under rtl', () => {
    const { getAllByRole } = render(
      defineComponent({ components: { Default }, template: `<div dir="rtl"><Default /></div>` })
    )
    expect(getAllByRole('tab')).toHaveLength(3)
  })

  it('has no axe violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })
})
