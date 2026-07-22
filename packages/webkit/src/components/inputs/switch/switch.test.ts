import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/switch/Switch.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Switch from './switch.vue'

const { Default, Types } = composeStories(stories)

describe('Switch', () => {
  describe('data-testid', () => {
    it('renders the input-switch fallback testid on the root button and handle', () => {
      const { getByTestId } = render(Switch, {
        attrs: { 'aria-label': 'Toggle setting' }
      })

      expect(getByTestId('input-switch')).toBeTruthy()
      expect(getByTestId('input-switch__handle')).toBeTruthy()
    })

    it('honors a consumer-supplied data-testid on the root and handle', () => {
      const { getByTestId } = render(Switch, {
        attrs: { 'data-testid': 'my-switch', 'aria-label': 'Toggle setting' }
      })

      expect(getByTestId('my-switch')).toBeTruthy()
      expect(getByTestId('my-switch__handle')).toBeTruthy()
    })
  })

  describe('root semantics', () => {
    it('renders a native button with role=switch and type=button', () => {
      const { getByTestId } = render(Switch, {
        attrs: { 'aria-label': 'Toggle setting' }
      })

      const root = getByTestId('input-switch') as HTMLButtonElement
      expect(root.tagName).toBe('BUTTON')
      expect(root.getAttribute('type')).toBe('button')
      expect(root.getAttribute('role')).toBe('switch')
    })
  })

  describe('checked state derivation', () => {
    it('reflects modelValue=true via aria-checked and data-checked', () => {
      const { getByTestId } = render(Switch, {
        props: { modelValue: true },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      const root = getByTestId('input-switch')
      expect(root.getAttribute('aria-checked')).toBe('true')
      expect(root.getAttribute('data-checked')).toBe('true')
    })

    it('reflects modelValue=false via aria-checked and omits data-checked', () => {
      const { getByTestId } = render(Switch, {
        props: { modelValue: false },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      const root = getByTestId('input-switch')
      expect(root.getAttribute('aria-checked')).toBe('false')
      expect(root.getAttribute('data-checked')).toBeNull()
    })
  })

  describe('data-kind variant', () => {
    it('reflects the default type on data-kind', () => {
      const { getByTestId } = render(Switch, {
        attrs: { 'aria-label': 'Toggle setting' }
      })

      expect(getByTestId('input-switch').getAttribute('data-kind')).toBe('default')
    })

    it('reflects the privacy type on data-kind', () => {
      const { getByTestId } = render(Switch, {
        props: { kind: 'privacy' },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      expect(getByTestId('input-switch').getAttribute('data-kind')).toBe('privacy')
    })
  })

  describe('data-focused', () => {
    it('sets data-focused when focused is true', () => {
      const { getByTestId } = render(Switch, {
        props: { focused: true },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      expect(getByTestId('input-switch').getAttribute('data-focused')).toBe('true')
    })

    it('omits data-focused when focused is false', () => {
      const { getByTestId } = render(Switch, {
        props: { focused: false },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      expect(getByTestId('input-switch').getAttribute('data-focused')).toBeNull()
    })
  })

  describe('update:modelValue — click', () => {
    it('emits the negated boolean when clicking from off', async () => {
      const { getByTestId, emitted } = render(Switch, {
        props: { modelValue: false },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      await fireEvent.click(getByTestId('input-switch'))

      expect(emitted()['update:modelValue']).toBeTruthy()
      expect(emitted()['update:modelValue'][0]).toEqual([true])
    })

    it('emits false when clicking from on', async () => {
      const { getByTestId, emitted } = render(Switch, {
        props: { modelValue: true },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      await fireEvent.click(getByTestId('input-switch'))

      expect(emitted()['update:modelValue'][0]).toEqual([false])
    })
  })

  describe('update:modelValue — keyboard', () => {
    it('toggles on Space', async () => {
      const { getByTestId, emitted } = render(Switch, {
        props: { modelValue: false },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      await fireEvent.keyDown(getByTestId('input-switch'), { key: ' ' })

      expect(emitted()['update:modelValue']).toBeTruthy()
      expect(emitted()['update:modelValue'][0]).toEqual([true])
    })

    it('toggles on Enter', async () => {
      const { getByTestId, emitted } = render(Switch, {
        props: { modelValue: true },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      await fireEvent.keyDown(getByTestId('input-switch'), { key: 'Enter' })

      expect(emitted()['update:modelValue'][0]).toEqual([false])
    })

    it('does not toggle on an unrelated key', async () => {
      const { getByTestId, emitted } = render(Switch, {
        props: { modelValue: false },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      await fireEvent.keyDown(getByTestId('input-switch'), { key: 'a' })

      expect(emitted()['update:modelValue']).toBeUndefined()
    })
  })

  describe('a11y', () => {
    it('has no violations in the off state with an accessible name', async () => {
      const { container } = render(Switch, {
        props: { modelValue: false },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      await expectNoA11yViolations(container)
    })

    it('has no violations in the on privacy state with an accessible name', async () => {
      const { container } = render(Switch, {
        props: { modelValue: true, kind: 'privacy' },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      await expectNoA11yViolations(container)
    })
  })

  describe('privacy lock icon', () => {
    it('renders no lock icon when kind=default', () => {
      const { getByTestId } = render(Switch, {
        props: { kind: 'default', modelValue: true },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      const handle = getByTestId('input-switch__handle')
      expect(handle.querySelector('i.pi')).toBeNull()
    })

    it('renders pi-lock tinted var(--bg-surface) when privacy is off', () => {
      const { getByTestId } = render(Switch, {
        props: { kind: 'privacy', modelValue: false },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      const icon = getByTestId('input-switch__handle').querySelector('i.pi') as HTMLElement | null
      expect(icon).not.toBeNull()
      expect(icon!.classList.contains('pi-lock')).toBe(true)
      expect(icon!.classList.contains('pi-lock-open')).toBe(false)
      expect(icon!.className).toContain('text-[var(--bg-surface)]')
      expect(icon!.getAttribute('aria-hidden')).toBe('true')
    })

    it('renders pi-lock-open tinted var(--text-default) when privacy is on (contrasts against handle, not track)', () => {
      const { getByTestId } = render(Switch, {
        props: { kind: 'privacy', modelValue: true },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      const icon = getByTestId('input-switch__handle').querySelector('i.pi') as HTMLElement | null
      expect(icon).not.toBeNull()
      expect(icon!.classList.contains('pi-lock-open')).toBe(true)
      expect(icon!.classList.contains('pi-lock')).toBe(false)
      // The on icon must NOT reuse --success-contrast (the surrounding track color)
      // — that made the icon "blend" into the track visually. It uses --text-default
      // so it contrasts against the handle's --bg-canvas fill in both themes.
      expect(icon!.className).toContain('text-[var(--text-default)]')
      expect(icon!.className).not.toContain('text-[var(--success-contrast)]')
    })
  })

  describe('smoke over type variants', () => {
    it.each([['default'], ['privacy']] as const)('renders data-kind=%s', (type) => {
      const { getByTestId } = render(Switch, {
        props: { kind: type },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      expect(getByTestId('input-switch').getAttribute('data-kind')).toBe(type)
    })
  })

  describe('story fixtures (composeStories)', () => {
    it('renders the Default story', () => {
      const { getByTestId } = render(Default())
      expect(getByTestId('input-switch')).toBeTruthy()
      expect(getByTestId('input-switch').getAttribute('role')).toBe('switch')
    })

    it('renders the Types story with four switches', () => {
      const { getAllByTestId } = render(Types())
      const switches = getAllByTestId('input-switch')
      expect(switches.length).toBe(4)
    })
  })
})
