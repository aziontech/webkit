import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import Default from '../../../../examples/doc-steps/default.vue'
import WithBody from '../../../../examples/doc-steps/with-body.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocStepsRoot from './doc-steps.vue'
import DocStepsStep from './doc-steps-step.vue'
import DocSteps from './index'

// Browser mode loads no Tailwind — circle/rail/spacing belong to the visual gate;
// asserted here: the provide/inject numbering registry, the connector markup, testids.

const host = (template: string) =>
  defineComponent({
    components: { DocStepsStep, DocSteps },
    template
  })

const THREE_STEPS = `<DocSteps>
  <DocStepsStep title="Install the Azion CLI" />
  <DocStepsStep title="Link the project" />
  <DocStepsStep title="Deploy" />
</DocSteps>`

/** The circled index is the first hidden span inside a step. */
const circleText = (step: Element) =>
  step.querySelector('span[aria-hidden="true"]')?.textContent?.trim()

describe('DocSteps', () => {
  describe('rendering & testid', () => {
    it('renders the column with the derived testid and every step title', () => {
      const { getByTestId, getByText } = render(host(THREE_STEPS))
      expect(getByTestId('doc-steps')).toBeInTheDocument()
      expect(getByText('Install the Azion CLI')).toBeInTheDocument()
      expect(getByText('Link the project')).toBeInTheDocument()
      expect(getByText('Deploy')).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win', () => {
      const { getByTestId, queryByTestId } = render(
        host(`<DocSteps data-testid="walkthrough"><DocStepsStep title="Only" /></DocSteps>`)
      )
      expect(getByTestId('walkthrough')).toBeInTheDocument()
      expect(queryByTestId('doc-steps')).not.toBeInTheDocument()
    })
  })

  describe('numbering arrives via context in DOM order', () => {
    it('numbers three steps 1, 2, 3', () => {
      const { getAllByTestId } = render(host(THREE_STEPS))
      const steps = getAllByTestId('doc-steps-step')
      expect(steps).toHaveLength(3)
      expect(steps.map(circleText)).toEqual(['1', '2', '3'])
    })

    it('renumbers when a step unmounts and marks the new final step last', async () => {
      const Dynamic = defineComponent({
        components: { DocStepsStep, DocSteps },
        props: { titles: { type: Array, required: true } },
        template: `<DocSteps><DocStepsStep v-for="t in titles" :key="t" :title="t" /></DocSteps>`
      })
      const view = render(Dynamic, { props: { titles: ['First', 'Second', 'Third'] } })
      await view.rerender({ titles: ['First', 'Third'] })

      const steps = view.getAllByTestId('doc-steps-step')
      expect(steps).toHaveLength(2)
      // Renumbering works because an unmount happens outside the parent's render pass.
      expect(steps.map(circleText)).toEqual(['1', '2'])
    })

    it('numbers a step inserted between two others by its place on the page', async () => {
      const Dynamic = defineComponent({
        components: { DocStepsStep, DocSteps },
        props: { titles: { type: Array, required: true } },
        template: `<DocSteps><DocStepsStep v-for="t in titles" :key="t" :title="t" /></DocSteps>`
      })
      const view = render(Dynamic, { props: { titles: ['First', 'Third'] } })
      await view.rerender({ titles: ['First', 'Second', 'Third'] })

      const steps = view.getAllByTestId('doc-steps-step')
      expect(steps.map((step) => step.textContent?.replace(/\d/g, '').trim())).toEqual([
        'First',
        'Second',
        'Third'
      ])
      expect(steps.map(circleText)).toEqual(['1', '2', '3'])
    })
  })

  describe('the last step suppresses the connector', () => {
    it('renders a connector inside every step, for CSS to suppress on the last', () => {
      const { getAllByTestId, container } = render(host(THREE_STEPS))
      const steps = getAllByTestId('doc-steps-step')

      // Last-ness is decided by a last-child CSS variant, not the registration count
      // (a count read at each step's setup would make every step think it is last),
      // so the markup is uniform and the suppression belongs to the visual gate.
      expect(container.querySelectorAll('[data-step-connector]')).toHaveLength(3)
      for (const step of steps) {
        expect(step.querySelector('[data-step-connector]')).not.toBeNull()
        expect(step.querySelector('[data-step-body]')).not.toBeNull()
      }
    })
  })

  describe('accessibility', () => {
    it('has no violations on the default walkthrough', async () => {
      const { container } = render(Default)
      await expectNoA11yViolations(container)
    })

    it('has no violations when steps carry body content', async () => {
      const { container } = render(WithBody)
      await expectNoA11yViolations(container)
    })
  })

  describe('DocSteps.Step', () => {
    describe('compound', () => {
      it('attaches the step to the root as DocSteps.Step', () => {
        expect(DocSteps).toBe(DocStepsRoot)
        expect(DocSteps.Step).toBe(DocStepsStep)
      })
    })

    describe('rendering & testid', () => {
      it('renders its title with the derived testid', () => {
        const { getByTestId, getByText } = render(
          host(`<DocSteps><DocStepsStep title="Install the Azion CLI" /></DocSteps>`)
        )
        expect(getByTestId('doc-steps-step')).toBeInTheDocument()
        expect(getByText('Install the Azion CLI')).toBeInTheDocument()
      })

      it('lets a consumer-supplied data-testid win', () => {
        const { getByTestId, queryByTestId } = render(
          host(`<DocSteps><DocStepsStep data-testid="install-step" title="Install" /></DocSteps>`)
        )
        expect(getByTestId('install-step')).toBeInTheDocument()
        expect(queryByTestId('doc-steps-step')).not.toBeInTheDocument()
      })
    })

    describe('body slot', () => {
      it('renders body content under the heading when the slot is filled', () => {
        const { getByTestId, getByText } = render(
          host(
            `<DocSteps><DocStepsStep title="Link the project"><p>Reads your project and picks a preset.</p></DocStepsStep></DocSteps>`
          )
        )
        const step = getByTestId('doc-steps-step')
        const body = getByText('Reads your project and picks a preset.')
        expect(step.contains(body)).toBe(true)
      })

      it('renders only the index and the heading when the slot is empty', () => {
        const { getByTestId } = render(host(`<DocSteps><DocStepsStep title="Deploy" /></DocSteps>`))
        const step = getByTestId('doc-steps-step')
        // Assert the two parts rather than the concatenated text: Vue condenses the
        // whitespace between the circle and the heading, so textContent has no separator.
        expect(step.querySelector('span[aria-hidden="true"]')?.textContent?.trim()).toBe('1')
        expect(step.textContent).toContain('Deploy')
      })
    })

    describe('context requirement', () => {
      it('throws a clear error when rendered outside DocSteps', () => {
        expect(() => render(DocStepsStep, { props: { title: 'Loose step' } })).toThrow(
          'useDocStepsContext must be used within DocSteps.'
        )
      })
    })

    describe('decorative anatomy', () => {
      it('hides the circled index and the connector from assistive tech', () => {
        const { getAllByTestId } = render(
          host(`<DocSteps><DocStepsStep title="First" /><DocStepsStep title="Second" /></DocSteps>`)
        )
        const [first] = getAllByTestId('doc-steps-step')
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
            `<DocSteps><DocStepsStep title="First"><p>Body copy.</p></DocStepsStep><DocStepsStep title="Second" /></DocSteps>`
          )
        )
        await expectNoA11yViolations(container)
      })
    })
  })
})
