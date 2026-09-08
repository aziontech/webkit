import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/documentation/doc-card-group/DocCardGroup.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import DocCardGroup from './doc-card-group.vue'

// .claude/rules/testing.md: Vitest browser mode (real Chromium) loads NO Tailwind, so the
// frame, the 1px gaps, the cell rings and the column tracks all emit nothing here — those
// belong to the visual gate. What is real without CSS is what drives them: the data
// attributes the grid switches its column count on, the children rendering through the
// frame, and the testid contract.

const { Default, Columns } = composeStories(stories)

describe('DocCardGroup', () => {
  describe('rendering & testid', () => {
    it('renders its children inside the frame with the derived testid', () => {
      const { getByTestId, getByText } = render(DocCardGroup, {
        slots: { default: '<span>Cell one</span><span>Cell two</span>' }
      })
      expect(getByTestId('documentation-doc-card-group')).toBeInTheDocument()
      expect(getByText('Cell one')).toBeInTheDocument()
      expect(getByText('Cell two')).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win', () => {
      const { getByTestId, queryByTestId } = render(DocCardGroup, {
        attrs: { 'data-testid': 'docs-home-band' },
        slots: { default: '<span>Cell</span>' }
      })
      expect(getByTestId('docs-home-band')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-card-group')).not.toBeInTheDocument()
    })

    it('marks itself as a DocProse block', () => {
      const { getByTestId } = render(DocCardGroup, {
        slots: { default: '<span>Cell</span>' }
      })
      expect(getByTestId('documentation-doc-card-group').hasAttribute('data-doc-block')).toBe(true)
    })
  })

  describe('the column props land as data attributes', () => {
    it('defaults to two columns wide and one on a phone', () => {
      const { getByTestId } = render(DocCardGroup, {
        slots: { default: '<span>Cell</span>' }
      })
      const root = getByTestId('documentation-doc-card-group')
      expect(root.getAttribute('data-cols')).toBe('2')
      const grid = root.querySelector('[data-mobile-cols]')
      expect(grid).not.toBeNull()
      expect(grid?.getAttribute('data-cols')).toBe('2')
      expect(grid?.getAttribute('data-mobile-cols')).toBe('1')
    })

    it('mirrors cols and mobileCols onto the grid', () => {
      const { getByTestId } = render(DocCardGroup, {
        props: { cols: 4, mobileCols: 2 },
        slots: { default: '<span>Cell</span>' }
      })
      const root = getByTestId('documentation-doc-card-group')
      expect(root.getAttribute('data-cols')).toBe('4')
      const grid = root.querySelector('[data-mobile-cols]')
      expect(grid?.getAttribute('data-cols')).toBe('4')
      expect(grid?.getAttribute('data-mobile-cols')).toBe('2')
    })

    it('renders the slot children as the grid cells', () => {
      const { getByTestId } = render(DocCardGroup, {
        slots: { default: '<a href="#a">A</a><a href="#b">B</a><a href="#c">C</a>' }
      })
      const grid = getByTestId('documentation-doc-card-group').querySelector('[data-mobile-cols]')
      expect(grid?.children).toHaveLength(3)
    })
  })

  describe('accessibility', () => {
    it('has no violations on the default render', async () => {
      const { container } = render(Default())
      await expectNoA11yViolations(container)
    })

    it('has no violations on the three-column grid of cards', async () => {
      const { container } = render(Columns())
      await expectNoA11yViolations(container)
    })
  })
})
