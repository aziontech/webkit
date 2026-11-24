import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/hint/default.vue'
import WithLink from '../../../../examples/hint/with-link.vue'
import { useEscapeToCancel } from '../../../composables/use-escape-to-cancel'
import { expectNoA11yViolations } from '../../../test/axe'
import Hint from './hint.vue'

const TEXT = 'Values are encrypted at rest and never displayed again after saving.'
const DOCS = 'https://example.com/docs/variables'

const settle = async () => {
  await nextTick()
  await nextTick()
}

const byTestId = (id: string) => document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)
const panel = () => byTestId('hint__panel')

afterEach(async () => {
  await settle()
})

describe('Hint', () => {
  it('renders the root with the default data-testid, closed', async () => {
    const { getByTestId } = render(Hint, { props: { content: TEXT } })
    await settle()

    const root = getByTestId('hint')
    expect(root.getAttribute('data-state')).toBe('closed')
    expect(panel()).toBeNull()
  })

  it('renders a non-submitting button with a catalog name and a decorative glyph', async () => {
    const { getByTestId } = render(Hint, { props: { content: TEXT } })
    await settle()

    const trigger = getByTestId('hint__trigger')
    expect(trigger.tagName).toBe('BUTTON')
    expect(trigger).toHaveAttribute('type', 'button')
    expect(trigger).toHaveAttribute('aria-label', 'More information')
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger.querySelector('i')).toHaveAttribute('aria-hidden', 'true')
  })

  it('names the button with ariaLabel when set', async () => {
    const { getByRole } = render(Hint, { props: { content: TEXT, ariaLabel: 'About sensitive' } })
    await settle()
    expect(getByRole('button', { name: 'About sensitive' })).toBeTruthy()
  })

  it('describes the closed button with the note text', async () => {
    const { getByTestId } = render(Hint, { props: { content: TEXT } })
    await settle()

    const trigger = getByTestId('hint__trigger')
    const description = document.getElementById(trigger.getAttribute('aria-describedby') ?? '')
    expect(description?.textContent).toBe(TEXT)
    expect(description?.hidden).toBe(true)
  })

  it('opens on click, not on hover or focus, and closes on a second click', async () => {
    const { getByTestId } = render(Hint, { props: { content: TEXT } })
    await settle()
    const trigger = getByTestId('hint__trigger')

    await userEvent.hover(trigger)
    await fireEvent.focusIn(trigger)
    await settle()
    expect(panel()).toBeNull()

    await userEvent.click(trigger)
    await settle()
    expect(getByTestId('hint').getAttribute('data-state')).toBe('open')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger.getAttribute('aria-controls')).toBe(panel()?.id)
    expect(panel()?.getAttribute('role')).toBe('dialog')
    expect(panel()?.textContent).toContain(TEXT)

    await userEvent.click(trigger)
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it.each(['{Enter}', ' '])('opens with %s on the focused glyph', async (key) => {
    const { getByTestId } = render(Hint, { props: { content: TEXT } })
    await settle()

    getByTestId('hint__trigger').focus()
    await userEvent.keyboard(key)
    await settle()
    expect(panel()?.textContent).toContain(TEXT)
  })

  it('closes on Escape and returns focus to the glyph', async () => {
    const { getByTestId } = render(Hint, { props: { content: TEXT, href: DOCS } })
    await settle()
    const trigger = getByTestId('hint__trigger')

    await userEvent.click(trigger)
    await settle()
    expect(panel()).not.toBeNull()

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(trigger)
  })

  it('closes on a click outside', async () => {
    const Page = defineComponent({
      setup: () => () => [
        h(Hint, { content: TEXT }),
        h('p', { 'data-testid': 'outside' }, 'Elsewhere')
      ]
    })
    const { getByTestId } = render(Page)
    await settle()

    await userEvent.click(getByTestId('hint__trigger'))
    await settle()
    expect(panel()).not.toBeNull()

    await fireEvent.mouseDown(getByTestId('outside'))
    await vi.waitFor(() => expect(panel()).toBeNull())
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

    await userEvent.click(getByTestId('hint__trigger'))
    await settle()
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(onEscape).not.toHaveBeenCalled()

    await new Promise((resolve) => setTimeout(resolve, 400))
    await userEvent.keyboard('{Escape}')
    expect(onEscape).toHaveBeenCalledTimes(1)
  })

  it('renders the docs link only when href is set, opening in a new tab by default', async () => {
    const bare = render(Hint, { props: { content: TEXT } })
    await userEvent.click(bare.getByTestId('hint__trigger'))
    await settle()
    expect(panel()).not.toBeNull()
    expect(byTestId('hint__link')).toBeNull()
    bare.unmount()
    await settle()

    const linked = render(Hint, { props: { content: TEXT, href: DOCS } })
    await userEvent.click(linked.getByTestId('hint__trigger'))
    await settle()
    const link = byTestId('hint__link')!
    expect(link.getAttribute('href')).toBe(DOCS)
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.textContent).toContain('Learn more')
  })

  it('uses linkLabel and target on the link', async () => {
    const { getByTestId } = render(Hint, {
      props: { content: TEXT, href: DOCS, linkLabel: 'Read the guide', target: '_self' }
    })
    await userEvent.click(getByTestId('hint__trigger'))
    await settle()
    const link = byTestId('hint__link')!
    expect(link.getAttribute('target')).toBe('_self')
    expect(link.textContent).toContain('Read the guide')
  })

  it('follows v-model:open both ways', async () => {
    const open = ref(false)
    const onUpdate = vi.fn((value: boolean) => {
      open.value = value
    })
    const Host = defineComponent({
      setup: () => () => h(Hint, { content: TEXT, open: open.value, 'onUpdate:open': onUpdate })
    })
    const { getByTestId } = render(Host)
    await settle()

    open.value = true
    await settle()
    expect(panel()).not.toBeNull()

    await userEvent.click(getByTestId('hint__trigger'))
    await settle()
    expect(onUpdate).toHaveBeenLastCalledWith(false)
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('forwards side to the anchor', async () => {
    const { getByTestId } = render(Hint, { props: { content: TEXT, side: 'end' } })
    await settle()
    expect(getByTestId('hint').getAttribute('data-side')).toBe('end')
  })

  it('opens below by default', async () => {
    const { getByTestId } = render(Hint, { props: { content: TEXT } })
    await settle()
    expect(getByTestId('hint').getAttribute('data-side')).toBe('bottom')
  })

  it('opens the note inside a label without toggling or focusing the labelled control', async () => {
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

    await userEvent.click(getByTestId('hint__trigger'))
    await settle()

    expect(checked.value).toBe(false)
    expect(document.activeElement).not.toBe(document.getElementById('sensitive'))
    expect(panel()?.textContent).toContain(TEXT)
  })

  it('honours a consumer-supplied data-testid on the root and its parts', async () => {
    const { getByTestId } = render(Hint, {
      props: { content: TEXT },
      attrs: { 'data-testid': 'custom-hint' }
    })
    await settle()

    expect(getByTestId('custom-hint')).toBeInTheDocument()
    await userEvent.click(getByTestId('custom-hint__trigger'))
    await settle()
    expect(byTestId('custom-hint__panel')).not.toBeNull()
  })

  it('has no a11y violations closed and open', async () => {
    const { container, getByTestId } = render(Hint, { props: { content: TEXT, href: DOCS } })
    await settle()
    await expectNoA11yViolations(container)

    await userEvent.click(getByTestId('hint__trigger'))
    await settle()
    await expectNoA11yViolations(document.body)
  })

  it('renders the examples', async () => {
    const view = render(Default)
    await settle()
    expect(view.getByTestId('hint__trigger')).toHaveAttribute('aria-label', 'More information')
    view.unmount()

    const linked = render(WithLink)
    await userEvent.click(linked.getByTestId('hint__trigger'))
    await settle()
    expect(byTestId('hint__link')?.getAttribute('href')).toBe(
      'https://example.com/docs/cache-settings'
    )
  })

  it('extends the trigger hit area with a touch-target span', () => {
    const { getByTestId } = render(Hint, { props: { content: TEXT } })
    const target = getByTestId('hint__trigger').querySelector('[data-slot="touch-target"]')
    expect(target?.getAttribute('aria-hidden')).toBe('true')
  })
})
