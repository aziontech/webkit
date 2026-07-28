import { composeStories } from '@storybook/vue3'
import { render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/feedback/empty-state/EmptyState.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import EmptyState from './empty-state.vue'

const { Default, Bordered, Sizes } = composeStories(stories)

describe('EmptyState', () => {
  it('renders the title and defaults the testid to feedback-empty-state', () => {
    const { getByTestId } = within(
      render(EmptyState, { props: { title: 'No resource yet' } }).container
    )

    const root = getByTestId('feedback-empty-state')
    expect(root).toBeTruthy()
    expect(getByTestId('feedback-empty-state__title').textContent).toBe('No resource yet')
  })

  it('exposes role=status on the root for assistive announcement', () => {
    const { getByTestId } = within(render(EmptyState, { props: { title: 'Empty' } }).container)

    expect(getByTestId('feedback-empty-state').getAttribute('role')).toBe('status')
  })

  it('honours a consumer-supplied data-testid across the whole subtree', () => {
    const { getByTestId } = within(
      render(EmptyState, {
        props: { title: 'Empty', icon: 'pi pi-inbox' },
        attrs: { 'data-testid': 'custom-empty' }
      }).container
    )

    expect(getByTestId('custom-empty').getAttribute('role')).toBe('status')
    expect(getByTestId('custom-empty__title').textContent).toBe('Empty')
    expect(getByTestId('custom-empty__icon')).toBeTruthy()
  })

  it('renders the description only when provided', () => {
    const withDesc = within(
      render(EmptyState, { props: { title: 'Empty', description: 'Add your first item.' } })
        .container
    )
    expect(withDesc.getByTestId('feedback-empty-state__description').textContent).toBe(
      'Add your first item.'
    )

    const withoutDesc = within(render(EmptyState, { props: { title: 'Empty' } }).container)
    expect(withoutDesc.queryByTestId('feedback-empty-state__description')).toBeNull()
  })

  it('renders no adornment when neither the icon prop nor the icon slot is provided', () => {
    const { queryByTestId } = within(render(EmptyState, { props: { title: 'Empty' } }).container)

    expect(queryByTestId('feedback-empty-state__icon')).toBeNull()
  })

  it('renders the standardized featured-icon tile when the icon prop is set', () => {
    const { getByTestId } = within(
      render(EmptyState, { props: { title: 'Empty', icon: 'pi pi-inbox' } }).container
    )

    const icon = getByTestId('feedback-empty-state__icon')
    expect(icon.getAttribute('aria-hidden')).toBe('true')
    // The tile carries the consumer-supplied icon glyph.
    expect(icon.querySelector('i.pi.pi-inbox')).toBeTruthy()
  })

  it('renders custom icon slot content, overriding the icon prop tile', () => {
    const { getByTestId } = within(
      render(EmptyState, {
        props: { title: 'Empty', icon: 'pi pi-inbox' },
        slots: { icon: '<span data-testid="my-icon">glyph</span>' }
      }).container
    )

    const icon = getByTestId('feedback-empty-state__icon')
    expect(icon.getAttribute('aria-hidden')).toBe('true')
    expect(getByTestId('my-icon').textContent).toBe('glyph')
    // Slot wins: the prop's default tile glyph is not rendered.
    expect(icon.querySelector('i.pi.pi-inbox')).toBeNull()
  })

  it('renders the actions region only when the actions slot is supplied', () => {
    const withActions = within(
      render(EmptyState, {
        props: { title: 'Empty' },
        slots: { actions: '<button data-testid="cta">Create</button>' }
      }).container
    )
    expect(withActions.getByTestId('feedback-empty-state__actions')).toBeTruthy()
    expect(withActions.getByTestId('cta').textContent).toBe('Create')

    const withoutActions = within(render(EmptyState, { props: { title: 'Empty' } }).container)
    expect(withoutActions.queryByTestId('feedback-empty-state__actions')).toBeNull()
  })

  it('does not set data-bordered by default and sets it when bordered', () => {
    const plain = within(render(EmptyState, { props: { title: 'Empty' } }).container)
    expect(plain.getByTestId('feedback-empty-state').hasAttribute('data-bordered')).toBe(false)

    const bordered = within(
      render(EmptyState, { props: { title: 'Empty', bordered: true } }).container
    )
    expect(bordered.getByTestId('feedback-empty-state').getAttribute('data-bordered')).toBe('true')
  })

  it('defaults data-size to medium and reflects the size prop', () => {
    const def = within(render(EmptyState, { props: { title: 'Empty' } }).container)
    expect(def.getByTestId('feedback-empty-state').getAttribute('data-size')).toBe('medium')

    const small = within(render(EmptyState, { props: { title: 'Empty', size: 'small' } }).container)
    expect(small.getByTestId('feedback-empty-state').getAttribute('data-size')).toBe('small')
  })

  it.each(['small', 'medium'] as const)(
    'mirrors size=%s onto data-size of the root and the icon tile',
    (size) => {
      const { getByTestId } = within(
        render(EmptyState, { props: { title: 'Empty', size, icon: 'pi pi-inbox' } }).container
      )
      expect(getByTestId('feedback-empty-state').getAttribute('data-size')).toBe(size)
      expect(getByTestId('feedback-empty-state__icon').getAttribute('data-size')).toBe(size)
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
      const { getByTestId } = within(render(Default).container)
      expect(getByTestId('feedback-empty-state__title').textContent).toBe('No resource yet')
      expect(getByTestId('feedback-empty-state__actions')).toBeTruthy()
    })

    it('renders the Bordered story with data-bordered set', () => {
      const { getByTestId } = within(render(Bordered).container)
      expect(getByTestId('feedback-empty-state').getAttribute('data-bordered')).toBe('true')
    })

    it('renders the Sizes story with all size variants', () => {
      const { getAllByTestId } = within(render(Sizes).container)
      const roots = getAllByTestId('feedback-empty-state')
      expect(roots.map((el) => el.getAttribute('data-size'))).toEqual(['small', 'medium'])
    })
  })
})
