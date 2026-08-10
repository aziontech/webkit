import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/hint/Hint.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Hint from './hint.vue'

const { Default } = composeStories(stories)

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
// the Hint root (`input-hint__panel`), not from Tooltip's own fallback.
const panel = () => byTestId('input-hint__panel')

afterEach(async () => {
  await settle()
})

describe('Hint', () => {
  it('renders the tooltip-anchored root carrying the default data-testid', async () => {
    const { getByTestId } = render(Hint, { props: { text: TEXT } })
    await settle()

    const root = getByTestId('input-hint')
    expect(root).toBeInTheDocument()
    expect(root.getAttribute('data-state')).toBe('closed')
  })

  it('renders a non-submitting button named by the text prop', async () => {
    const { getByTestId } = render(Hint, { props: { text: TEXT } })
    await settle()

    const trigger = getByTestId('input-hint__trigger')
    expect(trigger.tagName).toBe('BUTTON')
    expect(trigger).toHaveAttribute('type', 'button')
    expect(trigger).toHaveAttribute('aria-label', TEXT)
  })

  it('marks the glyph decorative so the button name is the hint text alone', async () => {
    const { getByTestId } = render(Hint, { props: { text: TEXT } })
    await settle()

    const glyph = getByTestId('input-hint__trigger').querySelector('i')
    expect(glyph).not.toBeNull()
    expect(glyph!).toHaveAttribute('aria-hidden', 'true')
  })

  it('opens a role=tooltip panel carrying the text when the trigger takes focus', async () => {
    const { getByTestId } = render(Hint, { props: { text: TEXT } })
    await settle()

    const root = getByTestId('input-hint')
    await fireEvent.focusIn(getByTestId('input-hint__trigger'))
    await settle()

    expect(root.getAttribute('data-state')).toBe('open')

    const tip = panel()
    expect(tip).not.toBeNull()
    expect(tip!.getAttribute('role')).toBe('tooltip')
    expect(tip!.textContent).toContain(TEXT)
  })

  it('forwards placement to the tooltip anchor', async () => {
    const { getByTestId } = render(Hint, { props: { text: TEXT, placement: 'right' } })
    await settle()

    expect(getByTestId('input-hint').getAttribute('data-placement')).toBe('right')
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
          <Hint :text="TEXT" />
        </label>
        <input id="sensitive" type="checkbox" v-model="checked" />
      `
    })

    const { getByTestId } = render(composed)
    await settle()

    await fireEvent.click(getByTestId('input-hint__trigger'))
    await settle()

    expect(checked.value).toBe(false)
  })

  it('honours a consumer-supplied data-testid on the root and the trigger', async () => {
    const { getByTestId } = render(Hint, {
      props: { text: TEXT },
      attrs: { 'data-testid': 'custom-hint' }
    })
    await settle()

    expect(getByTestId('custom-hint')).toBeInTheDocument()
    expect(getByTestId('custom-hint__trigger').tagName).toBe('BUTTON')
  })

  it('has no a11y violations while closed', async () => {
    const { container } = render(Hint, { props: { text: TEXT } })
    await settle()
    await expectNoA11yViolations(container)
  })

  it('composes the Default story fixture', async () => {
    const { getByTestId } = render(Default)
    await settle()

    expect(getByTestId('input-hint__trigger')).toHaveAttribute('aria-label', TEXT)
  })
})
