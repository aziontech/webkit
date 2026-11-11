import { render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/section-header/default.vue'
import Sizes from '../../../../examples/section-header/sizes.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import SectionHeader from './section-header.vue'

describe('SectionHeader', () => {
  it('renders the title as an h2 with the default testid', () => {
    const { getByTestId, getByRole } = within(
      render(SectionHeader, { props: { title: 'Payment methods' } }).container
    )

    expect(getByTestId('layout-section-header').tagName).toBe('HEADER')
    expect(getByRole('heading', { level: 2 }).textContent?.trim()).toBe('Payment methods')
  })

  it('honours a consumer data-testid', () => {
    const { getByTestId } = within(
      render(SectionHeader, {
        props: { title: 'Payment methods' },
        attrs: { 'data-testid': 'billing-methods' }
      }).container
    )

    expect(getByTestId('billing-methods__title')).toBeTruthy()
  })

  it('renders the copy-link button and the h2 id only with an anchor', () => {
    const bare = within(render(SectionHeader, { props: { title: 'General' } }).container)
    expect(bare.queryByTestId('layout-section-header__copy-link')).toBeNull()
    expect(bare.getByRole('heading', { level: 2 }).id).toBe('')

    const anchored = within(
      render(SectionHeader, { props: { title: 'General', anchor: 'general' } }).container
    )
    expect(anchored.getByRole('heading', { level: 2 }).id).toBe('general')
    expect(anchored.getByRole('button', { name: 'Copy link to the General section' })).toBeTruthy()
  })

  it.each(['small', 'medium'] as const)('mirrors size=%s onto data-size', (size) => {
    const { getByTestId } = within(
      render(SectionHeader, { props: { title: 'General', size } }).container
    )

    expect(getByTestId('layout-section-header__title').getAttribute('data-size')).toBe(size)
  })

  it('renders description and actions only when given', () => {
    const bare = within(render(SectionHeader, { props: { title: 'General' } }).container)
    expect(bare.queryByTestId('layout-section-header__description')).toBeNull()
    expect(bare.queryByTestId('layout-section-header__actions')).toBeNull()

    const full = within(
      render(SectionHeader, {
        props: { title: 'General', description: 'Who you are.' },
        slots: { actions: '<button type="button">Update</button>' }
      }).container
    )
    expect(full.getByTestId('layout-section-header__description').textContent?.trim()).toBe(
      'Who you are.'
    )
    expect(full.getByRole('button', { name: 'Update' })).toBeTruthy()
  })

  it('renders the examples', () => {
    expect(within(render(Default).container).getByRole('button', { name: 'Update' })).toBeTruthy()
    expect(within(render(Sizes).container).getAllByRole('heading', { level: 2 })).toHaveLength(2)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })
})

describe('SectionHeader on devices', () => {
  it('is a named container so its actions follow the box, not the window', () => {
    const view = render(SectionHeader, {
      props: { title: 'Domains' },
      slots: { actions: '<button type="button">Add</button>' }
    })

    expect(view.getByTestId('layout-section-header').className).toContain(
      '@container/section-header'
    )
    expect(view.getByTestId('layout-section-header__actions').className).toContain(
      '@md/section-header:w-auto'
    )
  })

  it('keeps the copy-link visible where there is no hover', () => {
    const view = render(SectionHeader, { props: { title: 'Domains', anchor: 'domains' } })
    const wrapper = view.getByTestId('layout-section-header__copy-link').parentElement

    expect(wrapper?.className).toContain('[@media(hover:none)]:opacity-100')
  })
})
