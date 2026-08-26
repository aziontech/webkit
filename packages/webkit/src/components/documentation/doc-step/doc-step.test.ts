import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import DocSteps from '../doc-steps/doc-steps.vue'
import DocStep from './doc-step.vue'

// .claude/rules/testing.md: Vitest browser mode (real Chromium) loads NO Tailwind, so the
// circled index's geometry and the rail's hairline emit nothing here — those belong to the
// visual gate. What is real without CSS: the title and body structure, the decorative
// (aria-hidden) index and connector, the testid contract, and the loud failure when a step
// is rendered outside its DocSteps provider.

const host = (template: string) =>
  defineComponent({
    components: { DocStep, DocSteps },
    template
  })

describe('DocStep', () => {
  describe('rendering & testid', () => {
    it('renders its title with the derived testid', () => {
      const { getByTestId, getByText } = render(
        host(`<DocSteps><DocStep title="Install the Azion CLI" /></DocSteps>`)
      )
      expect(getByTestId('documentation-doc-step')).toBeInTheDocument()
      expect(getByText('Install the Azion CLI')).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win', () => {
      const { getByTestId, queryByTestId } = render(
        host(`<DocSteps><DocStep data-testid="install-step" title="Install" /></DocSteps>`)
      )
      expect(getByTestId('install-step')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-step')).not.toBeInTheDocument()
    })
  })

  describe('body slot', () => {
    it('renders body content under the heading when the slot is filled', () => {
      const { getByTestId, getByText } = render(
        host(
          `<DocSteps><DocStep title="Link the project"><p>Reads your project and picks a preset.</p></DocStep></DocSteps>`
        )
      )
      const step = getByTestId('documentation-doc-step')
      const body = getByText('Reads your project and picks a preset.')
      expect(step.contains(body)).toBe(true)
    })

    it('renders only the index and the heading when the slot is empty', () => {
      const { getByTestId } = render(host(`<DocSteps><DocStep title="Deploy" /></DocSteps>`))
      const step = getByTestId('documentation-doc-step')
      // Assert the two parts rather than the concatenated text: Vue condenses the
      // whitespace between the circle and the heading, so textContent has no separator.
      expect(step.querySelector('span[aria-hidden="true"]')?.textContent?.trim()).toBe('1')
      expect(step.textContent).toContain('Deploy')
    })
  })

  describe('context requirement', () => {
    it('throws a clear error when rendered outside DocSteps', () => {
      expect(() => render(DocStep, { props: { title: 'Loose step' } })).toThrow(
        'useDocStepsContext must be used within DocSteps.'
      )
    })
  })

  describe('decorative anatomy', () => {
    it('hides the circled index and the connector from assistive tech', () => {
      const { getAllByTestId } = render(
        host(`<DocSteps><DocStep title="First" /><DocStep title="Second" /></DocSteps>`)
      )
      const [first] = getAllByTestId('documentation-doc-step')
      const circle = first.querySelector('span[aria-hidden="true"]')
      expect(circle?.textContent?.trim()).toBe('1')
      // The connector is always rendered; the final step hides it with a last-child
      // CSS variant, which this unstyled environment cannot observe (visual gate).
      const connector = first.querySelector('[data-step-connector]')
      expect(connector).not.toBeNull()
      expect(connector?.getAttribute('aria-hidden')).toBe('true')
    })
  })

  describe('accessibility', () => {
    it('has no violations on a composed pair of steps', async () => {
      const { container } = render(
        host(
          `<DocSteps><DocStep title="First"><p>Body copy.</p></DocStep><DocStep title="Second" /></DocSteps>`
        )
      )
      await expectNoA11yViolations(container)
    })
  })
})
