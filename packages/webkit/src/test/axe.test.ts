import { describe, expect, it } from 'vitest'

import { expectNoPlaceholderOnlyLabels } from './axe'

/**
 * The guard exists because axe cannot see this defect: `placeholder` is a valid
 * accname fallback per HTML-AAM, so `label` passes on a placeholder-only field and
 * `label-title-only` covers only `title` / `aria-describedby`. A guard that never
 * fires is worse than none — it reads as coverage — so its two directions are
 * asserted directly here rather than through a component.
 */
function mount(html: string): HTMLElement {
  const container = document.createElement('div')
  container.innerHTML = html
  document.body.appendChild(container)
  return container
}

describe('expectNoPlaceholderOnlyLabels', () => {
  describe('fails when the placeholder is the only accessible name', () => {
    it('flags a bare placeholder-only input', () => {
      const container = mount('<input placeholder="Search" />')

      expect(() => expectNoPlaceholderOnlyLabels(container)).toThrow(/placeholder/i)
    })

    it('flags a visible <span> that reads as a label but associates with nothing', () => {
      const container = mount('<span>Start</span><input placeholder="Jun 1, 2026" />')

      expect(() => expectNoPlaceholderOnlyLabels(container)).toThrow(/placeholder/i)
    })

    it('flags a textarea as well as an input', () => {
      const container = mount('<textarea placeholder="Notes"></textarea>')

      expect(() => expectNoPlaceholderOnlyLabels(container)).toThrow(/placeholder/i)
    })

    it('surfaces the offending control so the failure is actionable', () => {
      const container = mount('<input data-testid="input-text" placeholder="Search" />')

      // The offender list is the assertion's `actual`: the message states the rule,
      // and the reporter prints the array in the diff. Asserting `actual` pins the
      // detail without depending on how the reporter formats it.
      let thrown: unknown
      try {
        expectNoPlaceholderOnlyLabels(container)
      } catch (error) {
        thrown = error
      }

      expect((thrown as { actual?: string[] } | undefined)?.actual).toEqual([
        '<input data-testid="input-text" placeholder="Search">'
      ])
    })
  })

  describe('passes when a real accessible name exists', () => {
    it('accepts aria-label', () => {
      const container = mount('<input aria-label="Search" placeholder="Search" />')

      expect(() => expectNoPlaceholderOnlyLabels(container)).not.toThrow()
    })

    it('accepts a <label for> association', () => {
      const container = mount(
        '<label for="f">Start</label><input id="f" placeholder="Jun 1, 2026" />'
      )

      expect(() => expectNoPlaceholderOnlyLabels(container)).not.toThrow()
    })

    it('accepts a wrapping <label>', () => {
      const container = mount('<label>Start<input placeholder="Jun 1, 2026" /></label>')

      expect(() => expectNoPlaceholderOnlyLabels(container)).not.toThrow()
    })

    it('accepts aria-labelledby pointing at non-empty text', () => {
      const container = mount(
        '<span id="lbl">Start</span><input aria-labelledby="lbl" placeholder="Jun 1, 2026" />'
      )

      expect(() => expectNoPlaceholderOnlyLabels(container)).not.toThrow()
    })

    it('accepts title', () => {
      const container = mount('<input title="Search" placeholder="Search" />')

      expect(() => expectNoPlaceholderOnlyLabels(container)).not.toThrow()
    })
  })

  describe('stays silent where the rule does not apply', () => {
    it('ignores a field with no placeholder — naming it is the form layer’s job', () => {
      const container = mount('<input />')

      expect(() => expectNoPlaceholderOnlyLabels(container)).not.toThrow()
    })

    it('ignores a blank placeholder', () => {
      const container = mount('<input placeholder="   " />')

      expect(() => expectNoPlaceholderOnlyLabels(container)).not.toThrow()
    })

    it('ignores non-labelable inputs (submit, button, hidden)', () => {
      const container = mount(
        '<input type="submit" placeholder="Go" /><input type="hidden" placeholder="x" />'
      )

      expect(() => expectNoPlaceholderOnlyLabels(container)).not.toThrow()
    })

    it('treats an empty aria-labelledby target as no name at all', () => {
      const container = mount(
        '<span id="empty"></span><input aria-labelledby="empty" placeholder="Search" />'
      )

      expect(() => expectNoPlaceholderOnlyLabels(container)).toThrow(/placeholder/i)
    })
  })
})
