import { render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Bordered from '../../../../examples/empty-state/bordered.vue'
import Default from '../../../../examples/empty-state/default.vue'
import Sizes from '../../../../examples/empty-state/sizes.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import EmptyState from './empty-state.vue'

describe('EmptyState', () => {
  it('renders the title and defaults the testid to feedback-empty-state', () => {
    const { getByTestId } = within(
      render(EmptyState, { props: { title: 'No resource yet' } }).container as HTMLElement
    )

    const root = getByTestId('empty-state')
    expect(root).toBeTruthy()
    expect(getByTestId('empty-state__title').textContent).toBe('No resource yet')
  })

  it('exposes role=status on the root for assistive announcement', () => {
    const { getByTestId } = within(
      render(EmptyState, { props: { title: 'Empty' } }).container as HTMLElement
    )

    expect(getByTestId('empty-state').getAttribute('role')).toBe('status')
  })

  it('honours a consumer-supplied data-testid across the whole subtree', () => {
    const { getByTestId } = within(
      render(EmptyState, {
        props: { title: 'Empty', icon: 'az az-inbox' },
        attrs: { 'data-testid': 'custom-empty' }
      }).container as HTMLElement
    )

    expect(getByTestId('custom-empty').getAttribute('role')).toBe('status')
    expect(getByTestId('custom-empty__title').textContent).toBe('Empty')
    expect(getByTestId('custom-empty__icon')).toBeTruthy()
  })

  it('renders the description only when provided', () => {
    const withDesc = within(
      render(EmptyState, { props: { title: 'Empty', description: 'Add your first item.' } })
        .container as HTMLElement
    )
    expect(withDesc.getByTestId('empty-state__description').textContent).toBe(
      'Add your first item.'
    )

    const withoutDesc = within(
      render(EmptyState, { props: { title: 'Empty' } }).container as HTMLElement
    )
    expect(withoutDesc.queryByTestId('empty-state__description')).toBeNull()
  })

  it('renders no adornment when neither the icon prop nor the icon slot is provided', () => {
    const { queryByTestId } = within(
      render(EmptyState, { props: { title: 'Empty' } }).container as HTMLElement
    )

    expect(queryByTestId('empty-state__icon')).toBeNull()
  })

  it('renders the standardized featured-icon tile when the icon prop is set', () => {
    const { getByTestId } = within(
      render(EmptyState, { props: { title: 'Empty', icon: 'az az-inbox' } })
        .container as HTMLElement
    )

    const icon = getByTestId('empty-state__icon')
    expect(icon.getAttribute('aria-hidden')).toBe('true')
    // The tile carries the consumer-supplied icon glyph.
    expect(icon.querySelector('i.az.az-inbox')).toBeTruthy()
  })

  it('renders custom icon slot content, overriding the icon prop tile', () => {
    const { getByTestId } = within(
      render(EmptyState, {
        props: { title: 'Empty', icon: 'az az-inbox' },
        slots: { icon: '<span data-testid="my-icon">glyph</span>' }
      }).container as HTMLElement
    )

    const icon = getByTestId('empty-state__icon')
    expect(icon.getAttribute('aria-hidden')).toBe('true')
    expect(getByTestId('my-icon').textContent).toBe('glyph')
    // Slot wins: the prop's default tile glyph is not rendered.
    expect(icon.querySelector('i.az.az-inbox')).toBeNull()
  })

  it('renders the actions region only when the actions slot is supplied', () => {
    const withActions = within(
      render(EmptyState, {
        props: { title: 'Empty' },
        slots: { actions: '<button data-testid="cta">Create</button>' }
      }).container as HTMLElement
    )
    expect(withActions.getByTestId('empty-state__actions')).toBeTruthy()
    expect(withActions.getByTestId('cta').textContent).toBe('Create')

    const withoutActions = within(
      render(EmptyState, { props: { title: 'Empty' } }).container as HTMLElement
    )
    expect(withoutActions.queryByTestId('empty-state__actions')).toBeNull()
  })

  it('does not set data-bordered by default and sets it when bordered', () => {
    const plain = within(render(EmptyState, { props: { title: 'Empty' } }).container as HTMLElement)
    expect(plain.getByTestId('empty-state').hasAttribute('data-bordered')).toBe(false)

    const bordered = within(
      render(EmptyState, { props: { title: 'Empty', bordered: true } }).container as HTMLElement
    )
    expect(bordered.getByTestId('empty-state').getAttribute('data-bordered')).toBe('true')
  })

  it('defaults data-size to medium and reflects the size prop', () => {
    const def = within(render(EmptyState, { props: { title: 'Empty' } }).container as HTMLElement)
    expect(def.getByTestId('empty-state').getAttribute('data-size')).toBe('medium')

    const small = within(
      render(EmptyState, { props: { title: 'Empty', size: 'small' } }).container as HTMLElement
    )
    expect(small.getByTestId('empty-state').getAttribute('data-size')).toBe('small')
  })

  it.each(['small', 'medium'] as const)(
    'mirrors size=%s onto data-size of the root and the icon tile',
    (size) => {
      const { getByTestId } = within(
        render(EmptyState, { props: { title: 'Empty', size, icon: 'az az-inbox' } })
          .container as HTMLElement
      )
      expect(getByTestId('empty-state').getAttribute('data-size')).toBe(size)
      expect(getByTestId('empty-state__icon').getAttribute('data-size')).toBe(size)
    }
  )

  it('has no accessibility violations on the default (transparent) render', async () => {
    const { container } = render(EmptyState, {
      props: {
        title: 'No resource yet',
        description: 'Get started by creating your first resource.'
      }
    })
    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations when bordered with an actions region', async () => {
    const { container } = render(EmptyState, {
      props: {
        title: 'No resource yet',
        description: 'Get started by creating your first resource.',
        bordered: true
      },
      slots: { actions: '<button type="button">Create item</button>' }
    })
    await expectNoA11yViolations(container)
  })

  describe('composed stories', () => {
    it('renders the Default story fixture', () => {
      const { getByTestId } = within(render(Default).container as HTMLElement)
      expect(getByTestId('empty-state__title').textContent).toBe('No resource yet')
      expect(getByTestId('empty-state__actions')).toBeTruthy()
    })

    it('renders the Bordered story with data-bordered set', () => {
      const { getByTestId } = within(render(Bordered).container as HTMLElement)
      expect(getByTestId('empty-state').getAttribute('data-bordered')).toBe('true')
    })

    it('renders the Sizes story with all size variants', () => {
      const { getAllByTestId } = within(render(Sizes).container as HTMLElement)
      const roots = getAllByTestId('empty-state')
      expect(roots.map((el) => el.getAttribute('data-size'))).toEqual(['small', 'medium'])
    })
  })

  describe('on devices', () => {
    it('keeps every action in the slot inside one centred action column', () => {
      const view = render(EmptyState, {
        props: { title: 'No domains' },
        slots: {
          actions: '<button type="button">Add domain</button><a href="#docs">Read the docs</a>'
        }
      })

      const actions = view.getByTestId('empty-state__actions')
      expect(actions.contains(view.getByRole('button', { name: 'Add domain' }))).toBe(true)
      expect(actions.contains(view.getByRole('link', { name: 'Read the docs' }))).toBe(true)
    })
  })
})
