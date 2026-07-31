import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/switch/Switch.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Switch from './switch.vue'

const { Default, Types, Disabled } = composeStories(stories)

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

  describe('disabled', () => {
    it('mirrors disabled on data-disabled, aria-disabled and the native button', () => {
      const { getByTestId } = render(Switch, {
        props: { disabled: true },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      const root = getByTestId('input-switch') as globalThis.HTMLButtonElement
      expect(root.getAttribute('data-disabled')).toBe('true')
      expect(root.getAttribute('aria-disabled')).toBe('true')
      expect(root.disabled).toBe(true)
    })

    it('omits the disabled attributes when enabled', () => {
      const { getByTestId } = render(Switch, {
        props: { disabled: false },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      const root = getByTestId('input-switch') as globalThis.HTMLButtonElement
      expect(root.getAttribute('data-disabled')).toBeNull()
      expect(root.getAttribute('aria-disabled')).toBeNull()
      expect(root.disabled).toBe(false)
    })

    it('does not emit update:modelValue on click when disabled', async () => {
      const { getByTestId, emitted } = render(Switch, {
        props: { modelValue: false, disabled: true },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      await fireEvent.click(getByTestId('input-switch'))

      expect(emitted()['update:modelValue']).toBeUndefined()
    })

    it.each([[' '], ['Enter']])(
      'does not emit update:modelValue on %s when disabled',
      async (key) => {
        const { getByTestId, emitted } = render(Switch, {
          props: { modelValue: false, disabled: true },
          attrs: { 'aria-label': 'Toggle setting' }
        })

        await fireEvent.keyDown(getByTestId('input-switch'), { key })

        expect(emitted()['update:modelValue']).toBeUndefined()
      }
    )

    it('renders the locked visual in both positions — the track never keeps the checked accent', () => {
      // Each render() mounts into the SAME document, so scope every query to its
      // own container instead of the shared getByTestId.
      const trackOf = (props: { modelValue: boolean; disabled?: boolean }) => {
        const { container } = render(Switch, {
          props,
          attrs: { 'aria-label': 'Toggle setting' }
        })
        const root = container.querySelector('[data-testid="input-switch"]')
        return globalThis.getComputedStyle(root as globalThis.Element).backgroundColor
      }

      const offLocked = trackOf({ modelValue: false, disabled: true })
      const onLocked = trackOf({ modelValue: true, disabled: true })
      const onEnabled = trackOf({ modelValue: true })

      // Disabled wins over checked, so a locked switch reads the same either way...
      expect(onLocked).toBe(offLocked)
      // ...and the enabled checked track is genuinely a different colour.
      expect(onEnabled).not.toBe(onLocked)
    })

    it('has no a11y violations when disabled', async () => {
      const { container } = render(Switch, {
        props: { modelValue: true, disabled: true },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      await expectNoA11yViolations(container)
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

    it('renders the Disabled story locked in both positions', () => {
      const { getAllByTestId } = render(Disabled())
      const switches = getAllByTestId('input-switch') as globalThis.HTMLButtonElement[]

      expect(switches.length).toBe(2)
      expect(switches.every((node) => node.disabled)).toBe(true)
      expect(switches.map((node) => node.getAttribute('aria-checked'))).toEqual(['false', 'true'])
    })
  })
})
