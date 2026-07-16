import { userEvent } from '@storybook/test'
import { composeStories } from '@storybook/vue3'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/theme-switcher/ThemeSwitcher.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import ThemeSwitcher from './theme-switcher.vue'

const { Default, Disabled } = composeStories(stories)

describe('ThemeSwitcher', () => {
  it('renders a radiogroup root with the default testid and three icon-only radio segments', () => {
    const { getByTestId, getAllByRole } = render(ThemeSwitcher)

    const root = getByTestId('input-theme-switcher')
    expect(root.getAttribute('role')).toBe('radiogroup')
    expect(root.getAttribute('aria-label')).toBe('Theme')

    const segments = getAllByRole('radio')
    expect(segments).toHaveLength(3)
    expect(segments.map((segment) => segment.getAttribute('aria-label'))).toEqual([
      'System',
      'Dark',
      'Light'
    ])

    for (const segment of segments) {
      expect(segment.tagName).toBe('BUTTON')
      expect(segment.getAttribute('type')).toBe('button')
      expect(segment.querySelector('i')?.getAttribute('aria-hidden')).toBe('true')
    }
  })

  it('honors a consumer-supplied data-testid on the root and derives the indicator testid from it', () => {
    const { getByTestId } = render(ThemeSwitcher, {
      attrs: { 'data-testid': 'my-switcher' }
    })

    expect(getByTestId('my-switcher').getAttribute('role')).toBe('radiogroup')
    expect(getByTestId('my-switcher__indicator')).toBeTruthy()
  })

  it('defaults to system: that segment is aria-checked, data-state=active and the only tab stop', () => {
    const { getByRole } = render(ThemeSwitcher)

    const system = getByRole('radio', { name: 'System' })
    expect(system.getAttribute('aria-checked')).toBe('true')
    expect(system.getAttribute('data-state')).toBe('active')
    expect(system.getAttribute('tabindex')).toBe('0')

    for (const name of ['Dark', 'Light']) {
      const segment = getByRole('radio', { name })
      expect(segment.getAttribute('aria-checked')).toBe('false')
      expect(segment.getAttribute('data-state')).toBe('inactive')
      expect(segment.getAttribute('tabindex')).toBe('-1')
    }
  })

  it('reflects the value prop: the matching segment becomes the active radio', async () => {
    const { getByRole, rerender } = render(ThemeSwitcher, {
      props: { value: 'dark' }
    })

    expect(getByRole('radio', { name: 'Dark' }).getAttribute('aria-checked')).toBe('true')
    expect(getByRole('radio', { name: 'System' }).getAttribute('aria-checked')).toBe('false')

    await rerender({ value: 'light' })

    expect(getByRole('radio', { name: 'Light' }).getAttribute('aria-checked')).toBe('true')
    expect(getByRole('radio', { name: 'Dark' }).getAttribute('aria-checked')).toBe('false')
  })

  it('applies a custom ariaLabel to the radiogroup', () => {
    const { getByTestId } = render(ThemeSwitcher, {
      props: { ariaLabel: 'Color scheme' }
    })

    expect(getByTestId('input-theme-switcher').getAttribute('aria-label')).toBe('Color scheme')
  })

  it('shows the aria-hidden selection indicator once mounted (real layout measurement)', async () => {
    const { getByTestId } = render(ThemeSwitcher)

    const indicator = getByTestId('input-theme-switcher__indicator')
    expect(indicator.getAttribute('aria-hidden')).toBe('true')

    await waitFor(() => {
      expect(indicator.style.display).not.toBe('none')
    })
  })

  it('emits update:value with the clicked mode', async () => {
    const { getByRole, emitted } = render(ThemeSwitcher)

    await userEvent.click(getByRole('radio', { name: 'Dark' }))

    const events = emitted()['update:value']
    expect(events).toBeTruthy()
    expect(events).toHaveLength(1)
    expect(events[0]).toEqual(['dark'])
  })

  it('moves focus to the selected segment with Tab (roving tabindex)', async () => {
    const { getByRole } = render(ThemeSwitcher, {
      props: { value: 'dark' }
    })

    await userEvent.tab()

    expect(document.activeElement).toBe(getByRole('radio', { name: 'Dark' }))
  })

  it('selects the next / previous mode with ArrowRight / ArrowLeft, wrapping at the edges and moving focus', async () => {
    const { getByRole, emitted } = render(ThemeSwitcher)

    const system = getByRole('radio', { name: 'System' })
    system.focus()

    await userEvent.keyboard('{ArrowRight}')
    expect(emitted()['update:value']).toEqual([['dark']])
    expect(document.activeElement).toBe(getByRole('radio', { name: 'Dark' }))

    await userEvent.keyboard('{ArrowRight}')
    expect(emitted()['update:value']).toEqual([['dark'], ['light']])
    expect(document.activeElement).toBe(getByRole('radio', { name: 'Light' }))

    await userEvent.keyboard('{ArrowRight}')
    expect(emitted()['update:value']).toEqual([['dark'], ['light'], ['system']])
    expect(document.activeElement).toBe(system)

    await userEvent.keyboard('{ArrowLeft}')
    expect(emitted()['update:value']).toEqual([['dark'], ['light'], ['system'], ['light']])
    expect(document.activeElement).toBe(getByRole('radio', { name: 'Light' }))
  })

  it('supports ArrowDown / ArrowUp and jumps to the edges with Home / End', async () => {
    const { getByRole, emitted } = render(ThemeSwitcher, {
      props: { value: 'dark' }
    })

    const dark = getByRole('radio', { name: 'Dark' })
    dark.focus()

    await userEvent.keyboard('{ArrowDown}')
    expect(emitted()['update:value']).toEqual([['light']])
    expect(document.activeElement).toBe(getByRole('radio', { name: 'Light' }))

    await userEvent.keyboard('{ArrowUp}')
    expect(emitted()['update:value']).toEqual([['light'], ['dark']])
    expect(document.activeElement).toBe(dark)

    await userEvent.keyboard('{End}')
    expect(emitted()['update:value']).toEqual([['light'], ['dark'], ['light']])
    expect(document.activeElement).toBe(getByRole('radio', { name: 'Light' }))

    await userEvent.keyboard('{Home}')
    expect(emitted()['update:value']).toEqual([['light'], ['dark'], ['light'], ['system']])
    expect(document.activeElement).toBe(getByRole('radio', { name: 'System' }))
  })

  it('selects the focused segment with Enter and Space', async () => {
    const { getByRole, emitted } = render(ThemeSwitcher)

    const dark = getByRole('radio', { name: 'Dark' })
    dark.focus()

    await userEvent.keyboard('{Enter}')
    expect(emitted()['update:value']).toEqual([['dark']])

    await userEvent.keyboard(' ')
    expect(emitted()['update:value']).toEqual([['dark'], ['dark']])
  })

  it('does NOT emit update:value when disabled — pointer or keyboard', async () => {
    const { getByRole, getByTestId, emitted } = render(ThemeSwitcher, {
      props: { disabled: true }
    })

    const root = getByTestId('input-theme-switcher')
    expect(root.hasAttribute('data-disabled')).toBe(true)
    expect(root.getAttribute('aria-disabled')).toBe('true')

    const dark = getByRole('radio', { name: 'Dark' }) as HTMLButtonElement
    expect(dark.disabled).toBe(true)

    await fireEvent.click(dark)
    await fireEvent.keyDown(dark, { key: 'ArrowRight' })
    await fireEvent.keyDown(dark, { key: 'Enter' })

    expect(emitted()['update:value']).toBeUndefined()
  })

  it('merges a consumer-supplied class onto the root', () => {
    const { getByTestId } = render(ThemeSwitcher, {
      attrs: { class: 'consumer-class' }
    })

    expect(getByTestId('input-theme-switcher').classList.contains('consumer-class')).toBe(true)
  })

  it('surfaces the mode label in a tooltip (Teleported to body) when a segment receives focus', async () => {
    const { getByRole } = render(ThemeSwitcher)

    getByRole('radio', { name: 'Dark' }).focus()

    await waitFor(() => {
      const panel = document.body.querySelector('[role="tooltip"]')
      expect(panel).toBeTruthy()
      expect(panel?.textContent?.trim()).toBe('Dark')
    })
  })

  it('has no a11y violations in the default render', async () => {
    const { container } = render(ThemeSwitcher)

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when disabled', async () => {
    const { container } = render(ThemeSwitcher, { props: { disabled: true } })

    await expectNoA11yViolations(container)
  })

  it('renders the Default story fixture cleanly', async () => {
    const { container } = render(Default())

    await expectNoA11yViolations(container)
  })

  it('renders the Disabled story fixture cleanly', async () => {
    const { container } = render(Disabled())

    await expectNoA11yViolations(container)
  })
})
