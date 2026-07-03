import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/navigation/MenuItem.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import MenuItem from './menu-item.vue'

const { Default } = composeStories(stories)

const KINDS = ['option', 'group'] as const

// A <li> is only valid a11y semantics inside a list. Wrap the component in a
// real <ul> within the tracked container so axe's listitem rule is satisfied,
// mirroring how the component is actually consumed (see the story decorator).
const InList = (props: Record<string, unknown>) => ({
  render: () => h('ul', { class: 'list-none' }, [h(MenuItem, props)])
})

describe('MenuItem', () => {
  it('renders an option row (li + button) with the default testid', () => {
    const { getByTestId } = render(MenuItem, { props: { label: 'Home' } })

    const root = getByTestId('navigation-menu-item')
    expect(root.tagName).toBe('LI')
    // Default option with no href renders a <button>, not an <a>.
    const button = getByTestId('navigation-menu-item__button')
    expect(button.tagName).toBe('BUTTON')
    expect(button.getAttribute('type')).toBe('button')
    expect(getByTestId('navigation-menu-item__label').textContent?.trim()).toBe('Home')
  })

  it('honors a consumer-supplied data-testid and propagates it to child parts', () => {
    const { getByTestId } = render(MenuItem, {
      props: { label: 'Home' },
      attrs: { 'data-testid': 'my-item' }
    })

    expect(getByTestId('my-item').tagName).toBe('LI')
    expect(getByTestId('my-item__button')).toBeTruthy()
    expect(getByTestId('my-item__label').textContent?.trim()).toBe('Home')
  })

  it('renders the label prop, overridable by the default slot', () => {
    const withProp = render(MenuItem, { props: { label: 'FromProp' } })
    expect(withProp.getByTestId('navigation-menu-item__label').textContent?.trim()).toBe('FromProp')
    withProp.unmount()

    const withSlot = render(MenuItem, {
      props: { label: 'FromProp' },
      slots: { default: 'FromSlot' }
    })
    const label = withSlot.getByTestId('navigation-menu-item__label')
    expect(label.textContent).toContain('FromSlot')
    expect(label.textContent).not.toContain('FromProp')
  })

  it('emits click with the MouseEvent when an enabled option button is activated', async () => {
    const { getByTestId, emitted } = render(MenuItem, { props: { label: 'Home' } })

    await fireEvent.click(getByTestId('navigation-menu-item__button'))

    const events = emitted().click
    expect(events).toHaveLength(1)
    expect(events[0][0]).toBeInstanceOf(MouseEvent)
  })

  it('does not emit click when the option is disabled', async () => {
    const { getByTestId, emitted } = render(MenuItem, {
      props: { label: 'Home', disabled: true }
    })

    await fireEvent.click(getByTestId('navigation-menu-item__button'))

    expect(emitted().click).toBeUndefined()
  })

  it('does not emit click for a group kind (non-interactive presentation row)', async () => {
    const { getByTestId, emitted, queryByTestId } = render(MenuItem, {
      props: { kind: 'group', label: 'Section' }
    })

    const root = getByTestId('navigation-menu-item')
    expect(root.getAttribute('role')).toBe('presentation')
    // Group renders neither a link nor a button — only the label.
    expect(queryByTestId('navigation-menu-item__button')).toBeNull()
    expect(queryByTestId('navigation-menu-item__link')).toBeNull()
    expect(queryByTestId('navigation-menu-item__icon')).toBeNull()

    await fireEvent.click(root)
    expect(emitted().click).toBeUndefined()
  })

  it('reflects data-selected and aria-current when selected', () => {
    const { getByTestId } = render(MenuItem, {
      props: { label: 'Home', selected: true }
    })

    const root = getByTestId('navigation-menu-item')
    expect(root.hasAttribute('data-selected')).toBe(true)

    const button = getByTestId('navigation-menu-item__button')
    expect(button.getAttribute('aria-current')).toBe('page')
  })

  it('omits data-selected and aria-current when not selected', () => {
    const { getByTestId } = render(MenuItem, { props: { label: 'Home' } })

    expect(getByTestId('navigation-menu-item').getAttribute('data-selected')).toBeNull()
    expect(getByTestId('navigation-menu-item__button').getAttribute('aria-current')).toBeNull()
  })

  it('reflects data-disabled, aria-disabled and native disabled on a disabled button', () => {
    const { getByTestId } = render(MenuItem, {
      props: { label: 'Home', disabled: true }
    })

    expect(getByTestId('navigation-menu-item').hasAttribute('data-disabled')).toBe(true)

    const button = getByTestId('navigation-menu-item__button') as HTMLButtonElement
    expect(button.getAttribute('aria-disabled')).toBe('true')
    expect(button.disabled).toBe(true)
  })

  it('renders an anchor with href and _self target (no rel) when href is set', () => {
    const { getByTestId, queryByTestId } = render(MenuItem, {
      props: { label: 'Docs', href: 'https://azion.com' }
    })

    const link = getByTestId('navigation-menu-item__link') as HTMLAnchorElement
    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('https://azion.com')
    expect(link.getAttribute('target')).toBe('_self')
    expect(link.getAttribute('rel')).toBeNull()
    // Anchor branch replaces the button branch.
    expect(queryByTestId('navigation-menu-item__button')).toBeNull()
  })

  it('adds rel="noopener noreferrer" on an anchor when target is _blank', () => {
    const { getByTestId } = render(MenuItem, {
      props: { label: 'Docs', href: 'https://azion.com', target: '_blank' }
    })

    const link = getByTestId('navigation-menu-item__link')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('emits click when an enabled anchor option is clicked', async () => {
    const { getByTestId, emitted } = render(MenuItem, {
      props: { label: 'Docs', href: 'https://azion.com' }
    })

    await fireEvent.click(getByTestId('navigation-menu-item__link'))

    const events = emitted().click
    expect(events).toHaveLength(1)
    expect(events[0][0]).toBeInstanceOf(MouseEvent)
  })

  it('renders a disabled option with an href as a button (not an anchor) and does not emit', async () => {
    // isAnchor requires href AND !disabled, so a disabled+href option falls back to the button.
    const { getByTestId, queryByTestId, emitted } = render(MenuItem, {
      props: { label: 'Docs', href: 'https://azion.com', disabled: true }
    })

    expect(queryByTestId('navigation-menu-item__link')).toBeNull()
    const button = getByTestId('navigation-menu-item__button') as HTMLButtonElement
    expect(button.tagName).toBe('BUTTON')
    expect(button.disabled).toBe(true)

    await fireEvent.click(button)
    expect(emitted().click).toBeUndefined()
  })

  it('renders the leading icon element hidden from a11y with the provided class', () => {
    const { getByTestId } = render(MenuItem, {
      props: { label: 'Home', icon: 'pi pi-cog' }
    })

    const iconBox = getByTestId('navigation-menu-item__icon')
    expect(iconBox.getAttribute('aria-hidden')).toBe('true')
    const glyph = iconBox.querySelector('i')
    expect(glyph).toBeTruthy()
    expect(glyph?.classList.contains('pi')).toBe(true)
    expect(glyph?.classList.contains('pi-cog')).toBe(true)
  })

  it('does not render an icon glyph when icon is empty', () => {
    const { getByTestId } = render(MenuItem, {
      props: { label: 'Home', icon: '' }
    })

    // The icon box still renders; the <i> glyph inside is guarded by v-if="icon".
    expect(getByTestId('navigation-menu-item__icon').querySelector('i')).toBeNull()
  })

  it('renders a trailing tag from tagValue on an option row', () => {
    const { getByTestId } = render(MenuItem, {
      props: { label: 'Home', tagValue: 'Beta' }
    })

    const tag = getByTestId('navigation-menu-item__tag')
    expect(tag.textContent).toContain('Beta')
  })

  it('renders custom tag slot content in place of the default tag', () => {
    const { getByTestId } = render(MenuItem, {
      props: { label: 'Home' },
      slots: { tag: 'CustomBadge' }
    })

    expect(getByTestId('navigation-menu-item__tag').textContent).toContain('CustomBadge')
  })

  it('does not render a trailing tag when no tagValue or tag slot is given', () => {
    const { queryByTestId } = render(MenuItem, { props: { label: 'Home' } })

    expect(queryByTestId('navigation-menu-item__tag')).toBeNull()
  })

  it('does not render a tag on a group kind even when tagValue is set', () => {
    const { queryByTestId } = render(MenuItem, {
      props: { kind: 'group', label: 'Section', tagValue: 'Beta' }
    })

    expect(queryByTestId('navigation-menu-item__tag')).toBeNull()
  })

  it.each([...KINDS])('renders each kind with the correct root element for "%s"', (kind) => {
    const { getByTestId } = render(MenuItem, { props: { kind, label: 'X' } })

    const root = getByTestId('navigation-menu-item')
    expect(root.tagName).toBe('LI')
    if (kind === 'group') {
      expect(root.getAttribute('role')).toBe('presentation')
    } else {
      expect(root.getAttribute('role')).toBeNull()
    }
  })

  it('merges a consumer-supplied class onto the option root li', () => {
    const { getByTestId } = render(MenuItem, {
      props: { label: 'Home' },
      attrs: { class: 'consumer-class' }
    })

    expect(getByTestId('navigation-menu-item').classList.contains('consumer-class')).toBe(true)
  })

  it('has no a11y violations for a default option row', async () => {
    const { container } = render(InList({ label: 'Home' }))

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations for an anchor option with a trailing tag', async () => {
    const { container } = render(
      InList({ label: 'Docs', href: 'https://azion.com', tagValue: 'New', selected: true })
    )

    await expectNoA11yViolations(container)
  })

  it('renders the Default story fixture cleanly', async () => {
    const { getByTestId, container } = render(Default())

    expect(getByTestId('navigation-menu-item')).toBeTruthy()
    await expectNoA11yViolations(container)
  })
})
