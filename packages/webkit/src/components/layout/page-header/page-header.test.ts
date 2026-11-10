import { render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/page-header/default.vue'
import RichDescription from '../../../../examples/page-header/rich-description.vue'
import Sizes from '../../../../examples/page-header/sizes.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import PageHeader from './page-header.vue'

describe('PageHeader', () => {
  it('renders a header landmark with the title as the h1 and the default testid', () => {
    const { getByTestId, getByRole } = within(
      render(PageHeader, { props: { title: 'Resources' } }).container
    )

    expect(getByTestId('layout-page-header').tagName).toBe('HEADER')
    expect(getByRole('heading', { level: 1 }).textContent?.trim()).toBe('Resources')
  })

  it('honours a consumer data-testid across the subtree', () => {
    const { getByTestId } = within(
      render(PageHeader, {
        props: { title: 'Resources', description: 'All of them.' },
        attrs: { 'data-testid': 'resources-header' }
      }).container
    )

    expect(getByTestId('resources-header__title').textContent?.trim()).toBe('Resources')
    expect(getByTestId('resources-header__description').textContent?.trim()).toBe('All of them.')
  })

  it.each(['small', 'medium', 'large'] as const)('mirrors size=%s onto data-size', (size) => {
    const { getByTestId } = within(
      render(PageHeader, { props: { title: 'Resources', size } }).container
    )

    expect(getByTestId('layout-page-header').getAttribute('data-size')).toBe(size)
    expect(getByTestId('layout-page-header__title').getAttribute('data-size')).toBe(size)
  })

  it('defaults to the medium size', () => {
    const { getByTestId } = within(render(PageHeader, { props: { title: 'Resources' } }).container)

    expect(getByTestId('layout-page-header').getAttribute('data-size')).toBe('medium')
  })

  it('renders the description and actions regions only when given', () => {
    const bare = within(render(PageHeader, { props: { title: 'Resources' } }).container)
    expect(bare.queryByTestId('layout-page-header__description')).toBeNull()
    expect(bare.queryByTestId('layout-page-header__actions')).toBeNull()

    const full = within(
      render(PageHeader, {
        props: { title: 'Resources' },
        slots: {
          description: 'Read the <a href="#docs">docs</a>.',
          actions: '<button type="button">Create Resource</button>'
        }
      }).container
    )
    expect(full.getByTestId('layout-page-header__description').querySelector('a')).toBeTruthy()
    expect(full.getByRole('button', { name: 'Create Resource' })).toBeTruthy()
  })

  it('sets titleId on the h1 so a landmark can reference it', () => {
    const { getByRole } = within(
      render(PageHeader, { props: { title: 'Profile', titleId: 'profile-title' } }).container
    )

    expect(getByRole('heading', { level: 1 }).id).toBe('profile-title')
  })

  it('renders the examples', () => {
    const def = within(render(Default).container)
    expect(def.getAllByRole('link').length + def.getAllByRole('button').length).toBe(2)

    const sizes = within(render(Sizes).container)
    expect(sizes.getAllByTestId('layout-page-header').map((el) => el.dataset['size'])).toEqual([
      'large',
      'medium',
      'small'
    ])

    const rich = within(render(RichDescription).container)
    expect(rich.getAllByRole('button')).toHaveLength(2)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })
})
