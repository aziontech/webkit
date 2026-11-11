import { render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import Levels from '../../../../examples/doc-heading/levels.vue'
import { provideHeadingNav } from '../../../composables/use-heading-nav'
import { expectNoA11yViolations } from '../../../test/axe'
import DocHeading from './doc-heading.vue'

describe('DocHeading', () => {
  it('renders the heading tag for its level with the id', () => {
    const { getByRole } = render(DocHeading, { props: { level: 3, id: 'keys', label: 'Keys' } })
    const heading = getByRole('heading', { level: 3, name: 'Keys' })
    expect(heading).toHaveAttribute('id', 'keys')
    expect(heading).toHaveAttribute('data-doc-heading', '3')
  })

  it('links the text to its own anchor', () => {
    const { getByRole } = render(DocHeading, {
      props: { id: 'purge' },
      slots: { default: 'Purge' }
    })
    expect(getByRole('link', { name: 'Purge' })).toHaveAttribute('href', '#purge')
  })

  it('draws no link without an id', () => {
    const { queryByRole, getByRole } = render(DocHeading, { props: { label: 'Plain' } })
    expect(queryByRole('link')).toBeNull()
    expect(getByRole('heading', { name: 'Plain' })).not.toHaveAttribute('id')
  })

  it('hands the click to the page heading navigation', () => {
    const navigate = vi.fn((event: MouseEvent) => event.preventDefault())
    const Page = defineComponent({
      setup() {
        provideHeadingNav(navigate)
        return () => h(DocHeading, { id: 'rules', label: 'Rules' })
      }
    })
    const { getByRole } = render(Page)
    getByRole('link', { name: 'Rules' }).click()
    expect(navigate).toHaveBeenCalledWith(expect.any(MouseEvent), { id: 'rules' })
  })

  it('keeps the glyph out of the accessible name and at the inline end under rtl', () => {
    const { getByRole } = render({
      render: () => h('div', { dir: 'rtl' }, [h(DocHeading, { id: 'x', label: 'Cache' })])
    })
    const link = getByRole('link', { name: 'Cache' })
    expect(link.querySelector('i')).toHaveAttribute('aria-hidden', 'true')
    expect(link.querySelector('i')?.className).toContain('ms-')
  })

  it('has no axe violations', async () => {
    const { container } = render(Levels)
    await expectNoA11yViolations(container)
  })
})
