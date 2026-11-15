import '../../../test/reflow.css'

import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/switch/default.vue'
import Disabled from '../../../../examples/switch/disabled.vue'
import Types from '../../../../examples/switch/variants.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Switch from './switch.vue'

describe('Switch', () => {
  describe('data-testid', () => {
    it('renders the input-switch fallback testid on the root button and handle', () => {
      const { getByTestId } = render(Switch, {
        attrs: { 'aria-label': 'Toggle setting' }
      })

      expect(getByTestId('switch')).toBeTruthy()
      expect(getByTestId('switch__handle')).toBeTruthy()
    })

    it('honors a consumer-supplied data-testid on the root and handle', () => {
      const { getByTestId } = render(Switch, {
        attrs: { 'data-testid': 'my-switch', 'aria-label': 'Toggle setting' }
      })

      expect(getByTestId('my-switch')).toBeTruthy()
      expect(getByTestId('my-switch__handle')).toBeTruthy()
    })
  })

  describe('invalid', () => {
    it('marks the switch aria-invalid and data-invalid from its own prop', async () => {
      const view = render(Switch, { props: { invalid: true }, attrs: { 'aria-label': 'Alerts' } })
      const root = view.getByTestId('switch')
      expect(root.getAttribute('aria-invalid')).toBe('true')
      expect(root.hasAttribute('data-invalid')).toBe(true)
      await view.rerender({ invalid: false })
      expect(root.hasAttribute('aria-invalid')).toBe(false)
      expect(root.hasAttribute('data-invalid')).toBe(false)
    })
  })

  describe('root semantics', () => {
    it('renders a native button with role=switch and type=button', () => {
      const { getByTestId } = render(Switch, {
        attrs: { 'aria-label': 'Toggle setting' }
      })

      const root = getByTestId('switch') as HTMLButtonElement
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

      const root = getByTestId('switch')
      expect(root.getAttribute('aria-checked')).toBe('true')
      expect(root.getAttribute('data-checked')).toBe('true')
    })

    it('reflects modelValue=false via aria-checked and omits data-checked', () => {
      const { getByTestId } = render(Switch, {
        props: { modelValue: false },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      const root = getByTestId('switch')
      expect(root.getAttribute('aria-checked')).toBe('false')
      expect(root.getAttribute('data-checked')).toBeNull()
    })
  })

  describe('data-variant variant', () => {
    it('reflects the default type on data-variant', () => {
      const { getByTestId } = render(Switch, {
        attrs: { 'aria-label': 'Toggle setting' }
      })

      expect(getByTestId('switch').getAttribute('data-variant')).toBe('default')
    })

    it('reflects the privacy type on data-variant', () => {
      const { getByTestId } = render(Switch, {
        props: { variant: 'privacy' },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      expect(getByTestId('switch').getAttribute('data-variant')).toBe('privacy')
    })
  })

  describe('focused (removed in 6.0)', () => {
    it('neither marks data-focused nor moves focus when focused is passed', () => {
      const { getByTestId } = render(Switch, {
        attrs: { focused: true, 'aria-label': 'Toggle setting' }
      })

      expect(getByTestId('switch').getAttribute('data-focused')).toBeNull()
      expect(document.activeElement).not.toBe(getByTestId('switch'))
    })
  })

  describe('update:modelValue — click', () => {
    it('emits the negated boolean when clicking from off', async () => {
      const { getByTestId, emitted } = render(Switch, {
        props: { modelValue: false },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      await fireEvent.click(getByTestId('switch'))

      expect(emitted()['update:modelValue']).toBeTruthy()
      expect(emitted()['update:modelValue'][0]).toEqual([true])
    })

    it('emits false when clicking from on', async () => {
      const { getByTestId, emitted } = render(Switch, {
        props: { modelValue: true },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      await fireEvent.click(getByTestId('switch'))

      expect(emitted()['update:modelValue'][0]).toEqual([false])
    })
  })

  describe('v-model', () => {
    it('toggles its own state when unbound (uncontrolled)', async () => {
      const { getByTestId, emitted } = render(Switch, {
        attrs: { 'aria-label': 'Toggle setting' }
      })
      const root = getByTestId('switch')

      expect(root.getAttribute('aria-checked')).toBe('false')
      await fireEvent.click(root)
      expect(root.getAttribute('aria-checked')).toBe('true')
      await fireEvent.click(root)
      expect(root.getAttribute('aria-checked')).toBe('false')
      expect(emitted()['update:modelValue']).toEqual([[true], [false]])
    })

    it('round-trips the bound value with the parent (controlled)', async () => {
      const on = ref(false)
      const Host = defineComponent({
        setup: () => () =>
          h(Switch, {
            'aria-label': 'Toggle setting',
            modelValue: on.value,
            'onUpdate:modelValue': (next: boolean) => {
              on.value = next
            }
          })
      })
      const { getByTestId } = render(Host)
      const root = getByTestId('switch')

      await fireEvent.click(root)
      expect(on.value).toBe(true)
      expect(root.getAttribute('aria-checked')).toBe('true')

      on.value = false
      await nextTick()
      expect(root.getAttribute('aria-checked')).toBe('false')
    })

    it('stays on the parent value when a controlled parent refuses the change', async () => {
      const Host = defineComponent({
        setup: () => () =>
          h(Switch, {
            'aria-label': 'Toggle setting',
            modelValue: false,
            'onUpdate:modelValue': () => {}
          })
      })
      const { getByTestId } = render(Host)

      await fireEvent.click(getByTestId('switch'))
      expect(getByTestId('switch').getAttribute('aria-checked')).toBe('false')
    })
  })

  describe('update:modelValue — keyboard', () => {
    it('toggles on Space', async () => {
      const { getByTestId, emitted } = render(Switch, {
        props: { modelValue: false },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      await fireEvent.keyDown(getByTestId('switch'), { key: ' ' })

      expect(emitted()['update:modelValue']).toBeTruthy()
      expect(emitted()['update:modelValue'][0]).toEqual([true])
    })

    it('toggles on Enter', async () => {
      const { getByTestId, emitted } = render(Switch, {
        props: { modelValue: true },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      await fireEvent.keyDown(getByTestId('switch'), { key: 'Enter' })

      expect(emitted()['update:modelValue'][0]).toEqual([false])
    })

    it('does not toggle on an unrelated key', async () => {
      const { getByTestId, emitted } = render(Switch, {
        props: { modelValue: false },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      await fireEvent.keyDown(getByTestId('switch'), { key: 'a' })

      expect(emitted()['update:modelValue']).toBeUndefined()
    })
  })

  describe('disabled', () => {
    it('mirrors disabled on data-disabled, aria-disabled and the native button', () => {
      const { getByTestId } = render(Switch, {
        props: { disabled: true },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      const root = getByTestId('switch') as globalThis.HTMLButtonElement
      expect(root.getAttribute('data-disabled')).toBe('true')
      expect(root.getAttribute('aria-disabled')).toBe('true')
      expect(root.disabled).toBe(true)
    })

    it('omits the disabled attributes when enabled', () => {
      const { getByTestId } = render(Switch, {
        props: { disabled: false },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      const root = getByTestId('switch') as globalThis.HTMLButtonElement
      expect(root.getAttribute('data-disabled')).toBeNull()
      expect(root.getAttribute('aria-disabled')).toBeNull()
      expect(root.disabled).toBe(false)
    })

    it('does not emit update:modelValue on click when disabled', async () => {
      const { getByTestId, emitted } = render(Switch, {
        props: { modelValue: false, disabled: true },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      await fireEvent.click(getByTestId('switch'))

      expect(emitted()['update:modelValue']).toBeUndefined()
    })

    it.each([[' '], ['Enter']])(
      'does not emit update:modelValue on %s when disabled',
      async (key) => {
        const { getByTestId, emitted } = render(Switch, {
          props: { modelValue: false, disabled: true },
          attrs: { 'aria-label': 'Toggle setting' }
        })

        await fireEvent.keyDown(getByTestId('switch'), { key })

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
        const root = container.querySelector('[data-testid="switch"]')
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
        props: { modelValue: true, variant: 'privacy' },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      await expectNoA11yViolations(container)
    })
  })

  describe('smoke over type variants', () => {
    it.each([['default'], ['privacy']] as const)('renders data-variant=%s', (type) => {
      const { getByTestId } = render(Switch, {
        props: { variant: type },
        attrs: { 'aria-label': 'Toggle setting' }
      })

      expect(getByTestId('switch').getAttribute('data-variant')).toBe(type)
    })
  })

  describe('documented examples', () => {
    it('renders the Default story', () => {
      const { getByTestId } = render(Default)
      expect(getByTestId('switch')).toBeTruthy()
      expect(getByTestId('switch').getAttribute('role')).toBe('switch')
    })

    it('renders the Types story with four switches', () => {
      const { getAllByTestId } = render(Types)
      const switches = getAllByTestId('switch')
      expect(switches.length).toBe(4)
    })

    it('renders the Disabled story locked in both positions', () => {
      const { getAllByTestId } = render(Disabled)
      const switches = getAllByTestId('switch') as globalThis.HTMLButtonElement[]

      expect(switches.length).toBe(2)
      expect(switches.every((node) => node.disabled)).toBe(true)
      expect(switches.map((node) => node.getAttribute('aria-checked'))).toEqual(['false', 'true'])
    })
  })

  describe('touch target', () => {
    it('extends its hit area to 24px, and 44px on coarse pointers', () => {
      const view = render(Switch, { attrs: { 'aria-label': 'Enabled' } })

      expect(view.getByRole('switch').className).toContain(
        'pointer-coarse:after:inset-[min(0rem,calc(50%-22px))]'
      )
    })
  })

  describe('direction', () => {
    it('mirrors the checked handle slide under rtl', () => {
      const view = render(Switch, {
        props: { modelValue: true },
        attrs: { 'aria-label': 'Enabled' }
      })
      const handle = view.getByTestId('switch__handle').className
      expect(handle).toContain('group-data-[checked]:translate-x-3.5')
      expect(handle).toContain('rtl:group-data-[checked]:-translate-x-3.5')
    })
  })

  describe('autofocus and privacy lock', () => {
    it('focuses itself on mount with autofocus', () => {
      const host = document.createElement('div')
      document.body.appendChild(host)
      const app = createApp(Switch, { autofocus: true, 'aria-label': 'Public' })
      app.mount(host)
      const node = host.querySelector('[role="switch"]')
      expect(document.activeElement).toBe(node)
      expect(node?.hasAttribute('data-focused')).toBe(false)
      app.unmount()
      host.remove()
    })

    it('renders both lock glyphs for variant="privacy" and none for default', () => {
      const privacy = render(Switch, {
        props: { variant: 'privacy' },
        attrs: { 'aria-label': 'Public' }
      })
      expect(privacy.getByTestId('switch__lock')).toBeTruthy()
      expect(privacy.getByTestId('switch__lock-open')).toBeTruthy()
      privacy.unmount()
      const plain = render(Switch, { attrs: { 'aria-label': 'Public' } })
      expect(plain.queryByTestId('switch__lock')).toBeNull()
    })
  })

  describe('native form submit', () => {
    it('submits on under its name while on, and nothing while off', async () => {
      const { getByTestId, getByRole } = render(
        defineComponent({
          components: { Switch },
          setup: () => ({ on: ref(true) }),
          template:
            '<form data-testid="form"><Switch v-model="on" name="alerts" aria-label="Alerts" /></form>'
        })
      )
      const form = getByTestId('form') as HTMLFormElement
      expect(new FormData(form).get('alerts')).toBe('on')
      await fireEvent.click(getByRole('switch'))
      expect(new FormData(form).has('alerts')).toBe(false)
    })
  })
})
