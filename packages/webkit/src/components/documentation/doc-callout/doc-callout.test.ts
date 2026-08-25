import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/documentation/doc-callout/DocCallout.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import DocCallout from './doc-callout.vue'

// .claude/rules/testing.md: Vitest browser mode (real Chromium) loads NO Tailwind, so the
// tint, the border and the glyph colour of each kind emit nothing here — a computed-style
// assertion would read the user-agent default whether the class is right, misspelled or
// missing, passing identically in the broken and fixed states. What is asserted here is the
// part that survives without CSS: which severity and glyph each kind resolves to (they reach
// Message as props and land as attributes), the testid contract, and the copy.

const { Default, Kinds } = composeStories(stories)

const KINDS = [
  { kind: 'note', severity: 'info', icon: 'pi pi-info-circle', neutral: false },
  { kind: 'info', severity: 'info', icon: 'pi pi-info-circle', neutral: false },
  { kind: 'tip', severity: 'info', icon: 'pi pi-lightbulb', neutral: true },
  { kind: 'check', severity: 'success', icon: 'pi pi-check-circle', neutral: false },
  { kind: 'warning', severity: 'warning', icon: 'pi pi-exclamation-triangle', neutral: false },
  { kind: 'danger', severity: 'danger', icon: 'pi pi-times-circle', neutral: false }
] as const

describe('DocCallout', () => {
  describe('rendering & testid', () => {
    it('renders the copy with the derived testid', () => {
      const { getByTestId, getByText } = render(DocCallout, {
        slots: { default: 'Warm-up is per location.' }
      })
      expect(getByTestId('documentation-doc-callout')).toBeInTheDocument()
      expect(getByText('Warm-up is per location.')).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win', () => {
      const { getByTestId, queryByTestId } = render(DocCallout, {
        attrs: { 'data-testid': 'first-deploy-caveat' },
        slots: { default: 'Copy.' }
      })
      expect(getByTestId('first-deploy-caveat')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-callout')).not.toBeInTheDocument()
    })

    it('falls back to the label prop when the slot is empty', () => {
      const { getByText } = render(DocCallout, { props: { label: 'Fallback copy.' } })
      expect(getByText('Fallback copy.')).toBeInTheDocument()
    })
  })

  describe('kinds', () => {
    it.each(KINDS)('kind=$kind resolves severity $severity and its glyph', (entry) => {
      const { getByTestId, container } = render(DocCallout, {
        props: { kind: entry.kind },
        slots: { default: 'Copy.' }
      })
      const root = getByTestId('documentation-doc-callout')
      expect(root.getAttribute('data-kind')).toBe(entry.kind)
      // The glyph reaches Message as its `icon` prop and lands on an <i>.
      expect(container.querySelector(`i.${entry.icon.split(' ').join('.')}`)).toBeInTheDocument()
    })

    it('marks only the tip kind as neutral', () => {
      for (const entry of KINDS) {
        const { getByTestId, unmount } = render(DocCallout, {
          props: { kind: entry.kind },
          slots: { default: 'Copy.' }
        })
        const root = getByTestId('documentation-doc-callout')
        expect(root.hasAttribute('data-neutral')).toBe(entry.neutral)
        unmount()
      }
    })

    it('falls back to note for an unknown kind', () => {
      const { getByTestId, container } = render(DocCallout, {
        // @ts-expect-error — deliberately out of the union, to pin the runtime fallback
        props: { kind: 'nonsense' },
        slots: { default: 'Copy.' }
      })
      expect(getByTestId('documentation-doc-callout').hasAttribute('data-neutral')).toBe(false)
      expect(container.querySelector('i.pi.pi-info-circle')).toBeInTheDocument()
    })
  })

  describe('the DocProse contract', () => {
    it('marks itself as a block and as chrome', () => {
      const { getByTestId } = render(DocCallout, { slots: { default: 'Copy.' } })
      const root = getByTestId('documentation-doc-callout')
      expect(root.hasAttribute('data-doc-block')).toBe(true)
      expect(root.hasAttribute('data-doc-chrome')).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('has no violations on the default render', async () => {
      const { container } = render(Default())
      await expectNoA11yViolations(container)
    })

    it('has no violations across all six kinds', async () => {
      const { container } = render(Kinds())
      await expectNoA11yViolations(container)
    })
  })
})
