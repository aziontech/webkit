import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/layout/Sidebar.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import MenuItem from '../../navigation/menu-item/menu-item.vue'
import SidebarGroup from './sidebar-group.vue'

const { Default } = composeStories(stories)

// Without an injected Sidebar context the group falls back to this testid.
const TESTID = 'layout-sidebar__group'

describe('SidebarGroup', () => {
  it('renders a section with the fallback testid and a list, no label by default', () => {
    const { getByTestId, queryByTestId } = render(SidebarGroup)
    const root = getByTestId(TESTID)

    expect(root).toBeInTheDocument()
    expect(root.tagName).toBe('SECTION')
    // list is always rendered and its testid derives from the root testid
    expect(getByTestId(`${TESTID}__list`)).toBeInTheDocument()
    // no label prop → no group MenuItem and no aria-label
    expect(queryByTestId(`${TESTID}__label`)).toBeNull()
    expect(root).not.toHaveAttribute('aria-label')
  })

  it('renders a group MenuItem and sets aria-label when the label prop is provided', () => {
    const { getByTestId } = render(SidebarGroup, { props: { label: 'Build' } })
    const root = getByTestId(TESTID)
    const label = getByTestId(`${TESTID}__label`)

    expect(root).toHaveAttribute('aria-label', 'Build')
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent('Build')
  })

  it('renders default slot content inside the list', () => {
    const { getByTestId } = render(SidebarGroup, {
      global: { components: { MenuItem } },
      slots: {
        default: '<MenuItem label="Home" href="/" data-testid="slot-item" />'
      }
    })

    const list = getByTestId(`${TESTID}__list`)
    const item = getByTestId('slot-item')

    expect(list.tagName).toBe('UL')
    expect(list).toContainElement(item)
    expect(item).toHaveTextContent('Home')
  })

  it('forwards a consumer data-testid onto the root and derives child testids from it', () => {
    const { getByTestId } = render(SidebarGroup, {
      attrs: { 'data-testid': 'my-group' },
      props: { label: 'Secure' }
    })

    const root = getByTestId('my-group')
    expect(root.tagName).toBe('SECTION')
    expect(getByTestId('my-group__list')).toBeInTheDocument()
    expect(getByTestId('my-group__label')).toHaveTextContent('Secure')
  })

  it('merges consumer classes onto the root without dropping the base layout classes', () => {
    const { getByTestId } = render(SidebarGroup, {
      attrs: { class: 'custom-group-class' }
    })
    const root = getByTestId(TESTID)

    expect(root).toHaveClass('custom-group-class')
    expect(root).toHaveClass('flex')
  })

  it('has no a11y violations without a label', async () => {
    const { container } = render(SidebarGroup, {
      global: { components: { MenuItem } },
      slots: {
        default: '<MenuItem label="Home" href="/" />'
      }
    })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with a labelled group', async () => {
    const { container } = render(SidebarGroup, {
      global: { components: { MenuItem } },
      props: { label: 'Build' },
      slots: {
        default: '<MenuItem label="Applications" href="/applications" />'
      }
    })
    await expectNoA11yViolations(container)
  })

  describe('stories', () => {
    it('renders the Default story fixture with its sidebar groups', () => {
      const { getAllByTestId } = render(Default())

      // The Default sidebar composes multiple SidebarGroups; each renders a list.
      const lists = getAllByTestId(`${TESTID}__list`)
      expect(lists.length).toBeGreaterThan(0)
    })
  })
})
