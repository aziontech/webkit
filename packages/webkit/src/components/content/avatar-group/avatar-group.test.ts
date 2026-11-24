import { render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import Default from '../../../../examples/avatar-group/default.vue'
import Overflow from '../../../../examples/avatar-group/overflow.vue'
import Sizes from '../../../../examples/avatar-group/sizes.vue'
import Vertical from '../../../../examples/avatar-group/vertical.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import AvatarGroup from './avatar-group.vue'

const people = (count: number) =>
  Array.from({ length: count }, (_, index) => ({ name: `Person ${index + 1}` }))

const PHOTO =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="8" height="8"%3E%3Crect width="8" height="8"/%3E%3C/svg%3E'

const isOpen = (el: Element) => el.matches(':popover-open')

describe('AvatarGroup', () => {
  it('renders a named group with the default testid and defaults', () => {
    const { getByTestId, getByRole } = render(AvatarGroup, { props: { items: people(2) } })

    const root = getByTestId('avatar-group')
    expect(root).toHaveAttribute('data-size', 'medium')
    expect(root).toHaveAttribute('data-orientation', 'horizontal')
    expect(getByRole('group', { name: '2 people' })).toBe(root)
  })

  it('lets a consumer data-testid win and carries it to the inner parts', () => {
    const { getByTestId } = render(AvatarGroup, {
      props: { items: people(3), max: 1 },
      attrs: { 'data-testid': 'owners' }
    })

    expect(getByTestId('owners')).toHaveAttribute('role', 'group')
    expect(getByTestId('owners__avatar')).toBeTruthy()
    expect(getByTestId('owners__overflow')).toBeTruthy()
    expect(getByTestId('owners__list')).toBeTruthy()
  })

  it('merges a consumer class onto the root', () => {
    const { getByTestId } = render(AvatarGroup, {
      props: { items: people(1) },
      attrs: { class: 'ms-auto' }
    })

    expect(getByTestId('avatar-group').classList.contains('ms-auto')).toBe(true)
  })

  it('uses the singular noun for one person and the ariaLabel prop over the count', async () => {
    const { getByRole, rerender } = render(AvatarGroup, { props: { items: people(1) } })
    expect(getByRole('group', { name: '1 person' })).toBeTruthy()

    await rerender({ items: people(3), ariaLabel: 'Owners' })
    expect(getByRole('group', { name: 'Owners' })).toBeTruthy()
  })

  it('names each avatar by the person and derives initials from the first and last words', () => {
    const { getAllByTestId, getByRole } = render(AvatarGroup, {
      props: { items: [{ name: 'Jane Q. Doe' }, { name: 'Sam', label: 'sx' }] }
    })

    const [jane, sam] = getAllByTestId('avatar-group__avatar')
    expect(jane).toHaveAttribute('aria-label', 'Jane Q. Doe')
    expect(jane).toHaveAttribute('title', 'Jane Q. Doe')
    expect(jane!.textContent?.trim()).toBe('JD')
    expect(sam!.textContent?.trim()).toBe('SX')
    expect(getByRole('img', { name: 'Sam' })).toBe(sam)
  })

  it('shows one initial at small size, so the next avatar never covers half of it', () => {
    const { getAllByTestId } = render(AvatarGroup, {
      props: { size: 'small', items: [{ name: 'Jane Doe' }, { name: 'Sam', label: 'sx' }] }
    })

    const [jane, sam] = getAllByTestId('avatar-group__avatar')
    expect(jane!.textContent?.trim()).toBe('J')
    expect(jane).toHaveAttribute('aria-label', 'Jane Doe')
    expect(sam!.textContent?.trim()).toBe('S')
  })

  it('keeps a whole character when one initial is drawn from a name outside the basic plane', () => {
    const { getByTestId } = render(AvatarGroup, {
      props: { size: 'small', items: [{ name: '\u{1D49C}lex Morgan' }] }
    })

    expect(getByTestId('avatar-group__avatar').textContent?.trim()).toBe('\u{1D49C}')
  })

  it('gives the +N button a 44px hit area on a coarse pointer', () => {
    const { getByTestId } = render(AvatarGroup, { props: { items: people(6), max: 3 } })
    const hit = getByTestId('avatar-group__touch-target')

    expect(getByTestId('avatar-group__overflow').contains(hit)).toBe(true)
    expect(hit.getAttribute('aria-hidden')).toBe('true')
    expect(hit.classList.contains('pointer-coarse:block')).toBe(true)
  })

  it('renders a photo with the name as its alt', () => {
    const { getByAltText, getByTestId } = render(AvatarGroup, {
      props: { items: [{ name: 'Jane Doe', src: PHOTO }] }
    })

    expect(getByAltText('Jane Doe')).toHaveAttribute('src', PHOTO)
    expect(getByTestId('avatar-group__avatar')).toHaveAttribute('data-content', 'image')
  })

  it('falls back to the initials when a photo fails to load', async () => {
    const { getByRole, getByTestId } = render(AvatarGroup, {
      props: { items: [{ name: 'Jane Doe', src: 'data:image/png;base64,broken' }] }
    })

    const avatar = getByTestId('avatar-group__avatar')
    await waitFor(() => expect(avatar).toHaveAttribute('data-content', 'label'))
    expect(getByRole('img', { name: 'Jane Doe' })).toBe(avatar)
    expect(avatar.textContent?.trim()).toBe('JD')
  })

  it('shows max avatars and a +N button for the rest', () => {
    const { getAllByTestId, getByRole } = render(AvatarGroup, {
      props: { items: people(6), max: 4 }
    })

    expect(getAllByTestId('avatar-group__avatar')).toHaveLength(4)
    const button = getByRole('button', { name: '2 more people' })
    expect(button.textContent?.trim()).toBe('+2')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('data-state', 'closed')
  })

  it('renders every avatar and no button when max is 0 or the items fit', async () => {
    const { getAllByTestId, queryByTestId, rerender } = render(AvatarGroup, {
      props: { items: people(6), max: 0 }
    })
    expect(getAllByTestId('avatar-group__avatar')).toHaveLength(6)
    expect(queryByTestId('avatar-group__overflow')).toBeNull()

    await rerender({ items: people(4), max: 4 })
    expect(getAllByTestId('avatar-group__avatar')).toHaveLength(4)
    expect(queryByTestId('avatar-group__overflow')).toBeNull()
    expect(queryByTestId('avatar-group__list')).toBeNull()
  })

  it('opens the list of hidden names on click and closes it on a second click', async () => {
    const { getByRole, getByTestId } = render(AvatarGroup, {
      props: {
        items: [{ name: 'Jane Doe' }, { name: 'John Smith' }, { name: 'Alex Morgan' }],
        max: 1
      }
    })
    const button = getByRole('button', { name: '2 more people' })
    const list = getByTestId('avatar-group__list')
    expect(isOpen(list)).toBe(false)

    await userEvent.click(button)

    await waitFor(() => expect(isOpen(list)).toBe(true))
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(button).toHaveAttribute('data-state', 'open')
    expect(button).toHaveAttribute('aria-controls', list.id)
    const names = within(getByRole('list', { name: '2 more people' })).getAllByRole('listitem')
    expect(names.map((item) => item.textContent?.trim())).toEqual(['John Smith', 'Alex Morgan'])

    await userEvent.click(button)
    await waitFor(() => expect(isOpen(list)).toBe(false))
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('is reachable by Tab, opens with Enter and Space, and Escape closes and keeps focus', async () => {
    const { getByRole, getByTestId } = render(AvatarGroup, {
      props: { items: people(5), max: 3 }
    })
    const button = getByRole('button', { name: '2 more people' })
    const list = getByTestId('avatar-group__list')

    await userEvent.tab()
    expect(document.activeElement).toBe(button)

    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(isOpen(list)).toBe(true))
    expect(within(list).getByText('Person 4')).toBeTruthy()

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(isOpen(list)).toBe(false))
    expect(document.activeElement).toBe(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await userEvent.keyboard(' ')
    await waitFor(() => expect(isOpen(list)).toBe(true))
  })

  it('moves Tab into the open list and returns focus to the button on Escape', async () => {
    const { getByRole, getByTestId } = render(AvatarGroup, {
      props: { items: people(40), max: 4 }
    })
    const button = getByRole('button', { name: '36 more people' })
    const list = getByTestId('avatar-group__list')

    button.focus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(isOpen(list)).toBe(true))

    await userEvent.tab()
    expect(getByRole('list', { name: '36 more people' })).toBe(document.activeElement)

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(isOpen(list)).toBe(false))
    expect(document.activeElement).toBe(button)
  })

  it('closes the list on a click outside', async () => {
    const { getByRole, getByTestId } = render(AvatarGroup, {
      props: { items: people(5), max: 3 }
    })
    const list = getByTestId('avatar-group__list')

    await userEvent.click(getByRole('button', { name: '2 more people' }))
    await waitFor(() => expect(isOpen(list)).toBe(true))

    const outside = document.createElement('button')
    outside.textContent = 'Outside'
    document.body.append(outside)
    await userEvent.click(outside)
    await waitFor(() => expect(isOpen(list)).toBe(false))
    outside.remove()
  })

  it.each(['small', 'medium', 'large'] as const)('mirrors size=%s on the root', (size) => {
    const { getByTestId, getAllByTestId } = render(AvatarGroup, {
      props: { items: people(2), size }
    })

    expect(getByTestId('avatar-group')).toHaveAttribute('data-size', size)
    expect(getAllByTestId('avatar-group__avatar')).toHaveLength(2)
  })

  it('mirrors orientation onto the root', () => {
    const { getByTestId } = render(AvatarGroup, {
      props: { items: people(5), max: 2, orientation: 'vertical' }
    })

    expect(getByTestId('avatar-group')).toHaveAttribute('data-orientation', 'vertical')
  })

  it('renders an empty group for no items', () => {
    const { getByTestId, queryByTestId } = render(AvatarGroup)

    expect(getByTestId('avatar-group')).toHaveAttribute('aria-label', '0 people')
    expect(queryByTestId('avatar-group__avatar')).toBeNull()
  })

  it('renders max avatars, one button and no list items for 1,000 people', () => {
    const { getAllByTestId, getByRole, getByTestId } = render(AvatarGroup, {
      props: { items: people(1000), max: 4 }
    })

    expect(getAllByTestId('avatar-group__avatar')).toHaveLength(4)
    expect(getByRole('button', { name: '996 more people' }).textContent?.trim()).toBe('+996')
    expect(getByRole('group', { name: '1,000 people' })).toBeTruthy()
    expect(within(getByTestId('avatar-group__list')).queryAllByRole('listitem')).toHaveLength(0)
  })

  it.each([
    ['Default', Default],
    ['Sizes', Sizes],
    ['Overflow', Overflow],
    ['Vertical', Vertical]
  ])('renders the %s example with no a11y violations', async (_, Example) => {
    const { container } = render(Example)

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with the list open', async () => {
    const { container, getByRole, getByTestId } = render(Overflow)

    await userEvent.click(getByRole('button', { name: '36 more people' }))
    await waitFor(() => expect(isOpen(getByTestId('avatar-group__list'))).toBe(true))

    await expectNoA11yViolations(container)
  })
})
