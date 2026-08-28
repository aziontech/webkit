import { composeStories } from '@storybook/vue3'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/documentation/doc-tooltip/DocTooltip.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import DocTooltip from './doc-tooltip.vue'

// .claude/rules/testing.md: Vitest browser mode (real Chromium) loads NO Tailwind, so the
// dotted underline, the panel surface and the scale animation emit nothing here — those
// belong to the visual gate. What a real browser DOES give us is exactly what this
// component is about: the panel Teleports to <body>, focus really moves, and Escape really
// fires. So this suite asserts the two a11y contracts (tooltip vs dialog), the ARIA wiring
// that goes with each, and the focus hand-off — none of which jsdom could tell the truth about.

const { Default, Kinds } = composeStories(stories)

// The panel escapes the render container, so it is queried from document.body.
const settle = async () => {
  await nextTick()
  await nextTick()
}
const panel = () =>
  document.body.querySelector<HTMLElement>('[data-testid="documentation-doc-tooltip__panel"]')

const PASSIVE = { headline: 'workload', tip: 'A domain bound to an application.', delay: 0 }
const INTERACTIVE = { ...PASSIVE, cta: 'Read the guide', href: '/docs/workload' }

// focusin schedules the open through the same timer hover uses (the delay is the
// component's contract, not an implementation detail), so opening is polled rather
// than assumed to be synchronous.
const openByFocus = async (trigger: HTMLElement) => {
  await fireEvent.focusIn(trigger)
  await waitFor(() => expect(panel()).not.toBeNull())
  return panel() as HTMLElement
}

afterEach(async () => {
  vi.useRealTimers()
  await settle()
})

describe('DocTooltip', () => {
  describe('rendering & testid', () => {
    it('renders the glossed term with the derived testid', () => {
      const { getByTestId } = render(DocTooltip, {
        props: PASSIVE,
        slots: { default: 'workload' }
      })
      const trigger = getByTestId('documentation-doc-tooltip')
      expect(trigger).toBeInTheDocument()
      expect(trigger.tagName).toBe('BUTTON')
      expect(trigger.textContent?.trim()).toBe('workload')
    })

    it('lets a consumer-supplied data-testid win', () => {
      const { getByTestId, queryByTestId } = render(DocTooltip, {
        attrs: { 'data-testid': 'glossary-workload' },
        props: PASSIVE,
        slots: { default: 'workload' }
      })
      expect(getByTestId('glossary-workload')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-tooltip')).not.toBeInTheDocument()
    })

    it('falls back to the label prop when the slot is empty', () => {
      const { getByTestId } = render(DocTooltip, { props: { ...PASSIVE, label: 'workload' } })
      expect(getByTestId('documentation-doc-tooltip').textContent?.trim()).toBe('workload')
    })

    it('stays closed until the reader asks for it', () => {
      render(DocTooltip, { props: PASSIVE, slots: { default: 'workload' } })
      expect(panel()).toBeNull()
    })

    it('never opens with no content to show', async () => {
      const { getByTestId } = render(DocTooltip, {
        props: { delay: 0 },
        slots: { default: 'bare' }
      })
      await fireEvent.focusIn(getByTestId('documentation-doc-tooltip'))
      await new Promise((r) => setTimeout(r, 20))
      await settle()
      expect(panel()).toBeNull()
    })
  })

  describe('the passive contract: a real tooltip', () => {
    it('opens a role=tooltip panel on focus and describes its trigger', async () => {
      const { getByTestId } = render(DocTooltip, { props: PASSIVE, slots: { default: 'workload' } })
      const trigger = getByTestId('documentation-doc-tooltip')

      const p = await openByFocus(trigger)
      expect(p.getAttribute('role')).toBe('tooltip')
      // A passive gloss describes the term; it is not something to enter.
      expect(trigger.getAttribute('aria-describedby')).toBe(p?.id)
      expect(trigger.hasAttribute('aria-expanded')).toBe(false)
      expect(trigger.getAttribute('data-state')).toBe('open')
      expect(p?.hasAttribute('data-interactive')).toBe(false)
    })

    it('closes at once when the pointer leaves, having nothing to travel to', async () => {
      const { getByTestId } = render(DocTooltip, { props: PASSIVE, slots: { default: 'workload' } })
      const trigger = getByTestId('documentation-doc-tooltip')
      await openByFocus(trigger)

      await fireEvent.mouseLeave(trigger)
      await settle()
      expect(panel()).toBeNull()
    })
  })

  describe('the interactive contract: a dialog, because a tooltip holding a link is a trap', () => {
    it('is a named role=dialog announced through aria-expanded', async () => {
      const { getByTestId } = render(DocTooltip, {
        props: INTERACTIVE,
        slots: { default: 'workload' }
      })
      const trigger = getByTestId('documentation-doc-tooltip')

      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      const p = await openByFocus(trigger)
      expect(p.getAttribute('role')).toBe('dialog')
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
      expect(trigger.getAttribute('aria-controls')).toBe(p?.id)
      expect(p?.hasAttribute('data-interactive')).toBe(true)
      // A dialog with no accessible name is announced as an unlabelled group, so it
      // is named by the term it glosses.
      const labelledBy = p?.getAttribute('aria-labelledby')
      expect(labelledBy).toBeTruthy()
      expect(document.getElementById(labelledBy as string)?.textContent?.trim()).toBe('workload')
    })

    it('renders the call to action as a real link to the destination', async () => {
      const { getByTestId } = render(DocTooltip, {
        props: INTERACTIVE,
        slots: { default: 'workload' }
      })
      const p = await openByFocus(getByTestId('documentation-doc-tooltip'))

      const link = p.querySelector('a[href]')
      expect(link).not.toBeNull()
      expect(link?.getAttribute('href')).toBe('/docs/workload')
    })
  })

  describe('keyboard and focus', () => {
    it('Escape closes the panel and returns focus to the term', async () => {
      const { getByTestId } = render(DocTooltip, {
        props: INTERACTIVE,
        slots: { default: 'workload' }
      })
      const trigger = getByTestId('documentation-doc-tooltip')
      trigger.focus()
      await openByFocus(trigger)

      await fireEvent.keyDown(document, { key: 'Escape' })
      await settle()

      expect(panel()).toBeNull()
      // Returning focus must not re-open it: focusing the term fires focusin, which is
      // the very event that opens the panel, so the component makes that one inert.
      expect(document.activeElement).toBe(trigger)
      await settle()
      expect(panel()).toBeNull()
    })

    it('Tab from the trigger moves into an interactive panel', async () => {
      const { getByTestId } = render(DocTooltip, {
        props: INTERACTIVE,
        slots: { default: 'workload' }
      })
      const trigger = getByTestId('documentation-doc-tooltip')
      trigger.focus()
      await openByFocus(trigger)

      await fireEvent.keyDown(trigger, { key: 'Tab' })
      await settle()

      expect(panel()?.contains(document.activeElement)).toBe(true)
    })

    it('Tab from inside the panel closes it and hands focus back', async () => {
      const { getByTestId } = render(DocTooltip, {
        props: INTERACTIVE,
        slots: { default: 'workload' }
      })
      const trigger = getByTestId('documentation-doc-tooltip')
      trigger.focus()
      const p = await openByFocus(trigger)

      await fireEvent.keyDown(p, { key: 'Tab' })
      await settle()

      expect(panel()).toBeNull()
      expect(document.activeElement).toBe(trigger)
    })

    it('clicking the term toggles the panel', async () => {
      const { getByTestId } = render(DocTooltip, { props: PASSIVE, slots: { default: 'workload' } })
      const trigger = getByTestId('documentation-doc-tooltip')

      await fireEvent.click(trigger)
      await settle()
      expect(panel()).not.toBeNull()

      await fireEvent.click(trigger)
      await settle()
      expect(panel()).toBeNull()
    })
  })

  describe('hover open delay', () => {
    it('mouseenter opens only after the configured delay', async () => {
      vi.useFakeTimers()
      try {
        const { getByTestId } = render(DocTooltip, {
          props: { ...PASSIVE, delay: 200 },
          slots: { default: 'workload' }
        })
        await fireEvent.mouseEnter(getByTestId('documentation-doc-tooltip'))
        vi.advanceTimersByTime(150)
        await nextTick()
        expect(panel()).toBeNull()

        vi.advanceTimersByTime(60)
        await nextTick()
        await nextTick()
        expect(panel()).not.toBeNull()
      } finally {
        vi.useRealTimers()
      }
    })
  })

  describe('accessibility', () => {
    it('has no violations with the gloss closed', async () => {
      const { container } = render(Default())
      await expectNoA11yViolations(container)
    })

    it('has no violations across both contracts', async () => {
      const { container } = render(Kinds())
      await expectNoA11yViolations(container)
    })

    it('has no violations with an interactive panel open', async () => {
      const { getByTestId } = render(DocTooltip, {
        props: INTERACTIVE,
        slots: { default: 'workload' }
      })
      await openByFocus(getByTestId('documentation-doc-tooltip'))
      // The panel Teleports out of the render container, so axe runs over body.
      await expectNoA11yViolations(document.body)
    })
  })
})
