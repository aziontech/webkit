import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Default from '../../../../examples/sticky-carousel/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import StickyCarousel from './sticky-carousel.vue'

describe('StickyCarousel', () => {
  it('renders nothing without a title or items', () => {
    const { queryByTestId } = render(StickyCarousel, { props: { title: 'T' } })
    expect(queryByTestId('sections-sticky-carousel')).toBeNull()
  })

  it('numbers the cards in an ordered list', () => {
    const { getByRole, getByText } = render(Default)
    expect(getByRole('list').querySelectorAll('li')).toHaveLength(6)
    expect(getByText('06')).toHaveAttribute('aria-hidden', 'true')
  })

  it('names the row by the title unless an ariaLabel is given', () => {
    const { getByRole, unmount } = render(Default)
    expect(getByRole('region', { name: 'Six reasons teams run on one platform' })).toHaveAttribute(
      'tabindex',
      '0'
    )
    unmount()
    const labelled = render(StickyCarousel, {
      props: { title: 'T', items: [{ title: 'a', description: 'b' }], ariaLabel: 'Reasons' }
    })
    expect(labelled.getByRole('region', { name: 'Reasons' })).toBeInTheDocument()
  })

  it('leaves the row unshifted when the band is not pinned', () => {
    const { getByRole } = render(Default)
    expect((getByRole('list') as HTMLElement).style.translate).toBe('')
  })

  it('carries the header offset as a custom property', () => {
    const { getByTestId } = render(StickyCarousel, {
      props: { title: 'T', items: [{ title: 'a', description: 'b' }], headerOffset: '4rem' }
    })
    expect(
      getByTestId('sections-sticky-carousel').style.getPropertyValue('--sticky-carousel-offset')
    ).toBe('4rem')
  })

  it('renders under rtl', () => {
    const { getByRole } = render({ render: () => h('div', { dir: 'rtl' }, [h(Default)]) })
    expect(getByRole('list').querySelectorAll('li')).toHaveLength(6)
  })

  it('has no axe violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })
})
