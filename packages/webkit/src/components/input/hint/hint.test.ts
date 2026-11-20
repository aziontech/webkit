import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/hint/default.vue'
import { useEscapeToCancel } from '../../../composables/use-escape-to-cancel'
import { expectNoA11yViolations } from '../../../test/axe'
import Hint from './hint.vue'

const TEXT = 'Values are encrypted at rest and never displayed again after saving.'

// The tooltip panel is Teleported to <body>, so it escapes the render container
// and must be queried from document.body. Two frames let the enter Transition
// and Tooltip's onMounted listener settle.
const settle = async () => {
  await nextTick()
  await nextTick()
}

const byTestId = (id: string) => document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)

// Hint hands its own testid to Tooltip, so the Teleported panel is derived from
// the Hint root (`hint__panel`), not from Tooltip's own fallback.
const panel = () => byTestId('hint__panel')

afterEach(async () => {
  await settle()
})

describe('Hint', () => {
  it('renders the tooltip-anchored root carrying the default data-testid', async () => {
    const { getByTestId } = render(Hint, { props: { content: TEXT } })
    await settle()

    const root = getByTestId('hint')
    expect(root).toBeInTheDocument()
    expect(root.getAttribute('data-state')).toBe('closed')
  })

  it('renders a non-submitting button named by the content prop', async () => {
    const { getByTestId } = render(Hint, { props: { content: TEXT } })
    await settle()

    const trigger = getByTestId('hint__trigger')
    expect(trigger.tagName).toBe('BUTTON')
    expect(trigger).toHaveAttribute('type', 'button')
    expect(trigger).toHaveAttribute('aria-label', TEXT)
  })

  it('marks the glyph decorative so the button name is the hint text alone', async () => {
    const { getByTestId } = render(Hint, { props: { content: TEXT } })
    await settle()

    const glyph = getByTestId('hint__trigger').querySelector('i')
    expect(glyph).not.toBeNull()
    expect(glyph!).toHaveAttribute('aria-hidden', 'true')
  })

  it('opens a role=tooltip panel carrying the text when the trigger takes focus', async () => {
    const { getByTestId } = render(Hint, { props: { content: TEXT } })
    await settle()

    const root = getByTestId('hint')
    await fireEvent.focusIn(getByTestId('hint__trigger'))
    await settle()

    expect(root.getAttribute('data-state')).toBe('open')

    const tip = panel()
    expect(tip).not.toBeNull()
    expect(tip!.getAttribute('role')).toBe('tooltip')
    expect(tip!.textContent).toContain(TEXT)
  })

  it('forwards side to the tooltip anchor', async () => {
    const { getByTestId } = render(Hint, { props: { content: TEXT, side: 'end' } })
    await settle()

    expect(getByTestId('hint').getAttribute('data-side')).toBe('end')
  })

  it('prevents the click default so a Hint inside a label never toggles its control', async () => {
    const checked = ref(false)
    const composed = defineComponent({
      components: { Hint },
      setup() {
        return { checked, TEXT }
      },
      template: `
        <label for="sensitive">
          Sensitive
          <Hint :content="TEXT" />
        </label>
        <input id="sensitive" type="checkbox" v-model="checked" />
      `
    })

    const { getByTestId } = render(composed)
    await settle()

    await fireEvent.click(getByTestId('hint__trigger'))
    await settle()

    expect(checked.value).toBe(false)
  })

  it('closes when Tab leaves the trigger and leaves the next Escape to the page', async () => {
    const onEscape = vi.fn()
    const Form = defineComponent({
      setup() {
        useEscapeToCancel(onEscape)
        return () => [
          h(Hint, { content: TEXT }),
          h('input', { 'aria-label': 'Name', 'data-testid': 'name' })
        ]
      }
    })
    const { getByTestId } = render(Form)
    await settle()

    getByTestId('hint__trigger').focus()
    await settle()
    expect(getByTestId('hint').getAttribute('data-state')).toBe('open')

    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(getByTestId('name'))
    expect(getByTestId('hint').getAttribute('data-state')).toBe('closed')
    expect(panel()?.getAttribute('data-state') ?? 'closed').toBe('closed')

    await userEvent.keyboard('{Escape}')
    expect(onEscape).toHaveBeenCalledTimes(1)
  })

  it('takes Escape only while open, then hands the next one on', async () => {
    const onEscape = vi.fn()
    const Form = defineComponent({
      setup() {
        useEscapeToCancel(onEscape)
        return () => h(Hint, { content: TEXT })
      }
    })
    const { getByTestId } = render(Form)
    await settle()

    getByTestId('hint__trigger').focus()
    await settle()
    await userEvent.keyboard('{Escape}')
    await settle()
    expect(getByTestId('hint').getAttribute('data-state')).toBe('closed')
    expect(onEscape).not.toHaveBeenCalled()

    await new Promise((resolve) => setTimeout(resolve, 400))
    await userEvent.keyboard('{Escape}')
    expect(onEscape).toHaveBeenCalledTimes(1)
  })

  it('honours a consumer-supplied data-testid on the root and the trigger', async () => {
    const { getByTestId } = render(Hint, {
      props: { content: TEXT },
      attrs: { 'data-testid': 'custom-hint' }
    })
    await settle()

    expect(getByTestId('custom-hint')).toBeInTheDocument()
    expect(getByTestId('custom-hint__trigger').tagName).toBe('BUTTON')
  })

  it('has no a11y violations while closed', async () => {
    const { container } = render(Hint, { props: { content: TEXT } })
    await settle()
    await expectNoA11yViolations(container)
  })

  it('composes the Default story fixture', async () => {
    const { getByTestId } = render(Default)
    await settle()

    expect(getByTestId('hint__trigger')).toHaveAttribute('aria-label', TEXT)
  })

  describe('touch target', () => {
    it('extends the trigger hit area with a touch-target span', () => {
      const { getByTestId } = render(Hint, { props: { content: 'Shown on hover' } })
      const target = getByTestId('hint__trigger').querySelector('[data-slot="touch-target"]')
      expect(target?.getAttribute('aria-hidden')).toBe('true')
    })
  })
})
