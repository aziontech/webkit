import { render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/subheader/default.vue'
import Sizes from '../../../../examples/subheader/sizes.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Subheader from './subheader.vue'

describe('Subheader', () => {
  it('renders the title as an h2 with the default testid', () => {
    const { getByTestId, getByRole } = within(
      render(Subheader, { props: { title: 'Payment methods' } }).container as HTMLElement
    )

    expect(getByTestId('subheader').tagName).toBe('HEADER')
    expect(getByRole('heading', { level: 2 }).textContent?.trim()).toBe('Payment methods')
  })

  it('honours a consumer data-testid', () => {
    const { getByTestId } = within(
      render(Subheader, {
        props: { title: 'Payment methods' },
        attrs: { 'data-testid': 'billing-methods' }
      }).container as HTMLElement
    )

    expect(getByTestId('billing-methods__title')).toBeTruthy()
  })

  it('renders the copy-link button and the h2 id only with an anchor', () => {
    const bare = within(render(Subheader, { props: { title: 'General' } }).container as HTMLElement)
    expect(bare.queryByTestId('subheader__copy-link')).toBeNull()
    expect(bare.getByRole('heading', { level: 2 }).id).toBe('')

    const anchored = within(
      render(Subheader, { props: { title: 'General', anchor: 'general' } }).container as HTMLElement
    )
    expect(anchored.getByRole('heading', { level: 2 }).id).toBe('general')
    expect(anchored.getByRole('button', { name: 'Copy link to the General section' })).toBeTruthy()
  })

  it('draws the copy-link with the link glyph, like SettingsGroup', () => {
    const view = within(
      render(Subheader, { props: { title: 'General', anchor: 'general' } }).container as HTMLElement
    )
    const button = view.getByRole('button', { name: 'Copy link to the General section' })
    expect(button.querySelector('.az-link')).toBeTruthy()
    expect(button.querySelector('.az-copy')).toBeNull()
  })

  it.each(['small', 'medium'] as const)('mirrors size=%s onto data-size', (size) => {
    const { getByTestId } = within(
      render(Subheader, { props: { title: 'General', size } }).container as HTMLElement
    )

    expect(getByTestId('subheader__title').getAttribute('data-size')).toBe(size)
    expect(getByTestId('subheader__title').className).toContain('text-(--text-default)')
    expect(getByTestId('subheader__title').className).not.toContain('text-label')
  })

  it('renders description and actions only when given', () => {
    const bare = within(render(Subheader, { props: { title: 'General' } }).container as HTMLElement)
    expect(bare.queryByTestId('subheader__description')).toBeNull()
    expect(bare.queryByTestId('subheader__actions')).toBeNull()

    const full = within(
      render(Subheader, {
        props: { title: 'General', description: 'Who you are.' },
        slots: { actions: '<button type="button">Update</button>' }
      }).container as HTMLElement
    )
    expect(full.getByTestId('subheader__description').textContent?.trim()).toBe('Who you are.')
    expect(full.getByRole('button', { name: 'Update' })).toBeTruthy()
  })

  it('renders the examples', () => {
    expect(
      within(render(Default).container as HTMLElement).getByRole('button', { name: 'Update' })
    ).toBeTruthy()
    expect(
      within(render(Sizes).container as HTMLElement).getAllByRole('heading', { level: 2 })
    ).toHaveLength(2)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })

  describe('on devices', () => {
    it('is a named container so its actions follow the box, not the window', () => {
      const view = render(Subheader, {
        props: { title: 'Domains' },
        slots: { actions: '<button type="button">Add</button>' }
      })

      expect(view.getByTestId('subheader').className).toContain('@container/subheader')
      expect(view.getByTestId('subheader__actions').className).toContain('@md/subheader:w-auto')
    })

    it('keeps the copy-link visible where there is no hover', () => {
      const view = render(Subheader, { props: { title: 'Domains', anchor: 'domains' } })
      const wrapper = view.getByTestId('subheader__copy-link').parentElement

      expect(wrapper?.className).toContain('[@media(hover:none)]:opacity-100')
    })
  })
})
