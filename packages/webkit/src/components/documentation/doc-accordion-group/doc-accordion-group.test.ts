import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent } from 'vue'

import Default from '../../../../examples/doc-accordion-group/default.vue'
import Multiple from '../../../../examples/doc-accordion-group/multiple.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocAccordionItem from '../doc-accordion-item/doc-accordion-item.vue'
import DocAccordionGroup from './doc-accordion-group.vue'

const host = (template: string) =>
  defineComponent({ components: { DocAccordionGroup, DocAccordionItem }, template })

describe('DocAccordionGroup', () => {
  it('renders the group under its testid and lets a consumer testid win', () => {
    const { getByTestId, unmount } = render(Default)
    expect(getByTestId('documentation-doc-accordion-group')).toHaveAttribute('data-doc-block')
    unmount()
    const custom = render(
      host(
        `<DocAccordionGroup data-testid="faq"><DocAccordionItem title="A">a</DocAccordionItem></DocAccordionGroup>`
      )
    )
    expect(custom.getByTestId('faq')).toBeInTheDocument()
  })

  it('builds one heading trigger per item from its title', () => {
    const { getAllByRole } = render(Default)
    const triggers = getAllByRole('button')
    expect(triggers).toHaveLength(3)
    expect(triggers[0]).toHaveTextContent('Why does my first request miss the cache?')
    expect(getAllByRole('heading', { level: 3 })).toHaveLength(3)
  })

  it('opens the default-open item and keeps the others closed', () => {
    const { getAllByRole, getByText } = render(Default)
    const [first, second] = getAllByRole('button')
    expect(first).toHaveAttribute('aria-expanded', 'true')
    expect(second).toHaveAttribute('aria-expanded', 'false')
    expect(getByText(/Warm-up is per location/)).toBeVisible()
  })

  it('opens one entry at a time in single mode, by keyboard', async () => {
    const { getAllByRole } = render(Default)
    const [first, second] = getAllByRole('button')
    second.focus()
    await userEvent.keyboard('{Enter}')
    expect(second).toHaveAttribute('aria-expanded', 'true')
    expect(first).toHaveAttribute('aria-expanded', 'false')
  })

  it('keeps several entries open in multiple mode', () => {
    const { getAllByRole } = render(Multiple)
    for (const trigger of getAllByRole('button'))
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders under rtl', () => {
    const { getByTestId } = render(
      host(
        `<div dir="rtl"><DocAccordionGroup><DocAccordionItem title="A">a</DocAccordionItem></DocAccordionGroup></div>`
      )
    )
    expect(getByTestId('documentation-doc-accordion-group').closest('[dir="rtl"]')).not.toBeNull()
  })

  it('has no axe violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })
})
