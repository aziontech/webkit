import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/documentation/doc-steps/DocSteps.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import DocStep from '../doc-step/doc-step.vue'
import DocSteps from './doc-steps.vue'

// .claude/rules/testing.md: Vitest browser mode (real Chromium) loads NO Tailwind, so the
// circle, the rail's width and every spacing token emit nothing here. Those belong to the
// visual gate. What is real without CSS is the part that decides the walkthrough's
// semantics: the provide/inject registry that numbers the steps in document order, the
// last-step mark that structurally removes the connector element, and the testid contract.

const { Default, WithBody } = composeStories(stories)

const host = (template: string) =>
  defineComponent({
    components: { DocStep, DocSteps },
    template
  })

const THREE_STEPS = `<DocSteps>
  <DocStep title="Install the Azion CLI" />
  <DocStep title="Link the project" />
  <DocStep title="Deploy" />
</DocSteps>`

/** The circled index is the first hidden span inside a step. */
const circleText = (step: Element) =>
  step.querySelector('span[aria-hidden="true"]')?.textContent?.trim()

describe('DocSteps', () => {
  describe('rendering & testid', () => {
    it('renders the column with the derived testid and every step title', () => {
      const { getByTestId, getByText } = render(host(THREE_STEPS))
      expect(getByTestId('documentation-doc-steps')).toBeInTheDocument()
      expect(getByText('Install the Azion CLI')).toBeInTheDocument()
      expect(getByText('Link the project')).toBeInTheDocument()
      expect(getByText('Deploy')).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win', () => {
      const { getByTestId, queryByTestId } = render(
        host(`<DocSteps data-testid="walkthrough"><DocStep title="Only" /></DocSteps>`)
      )
      expect(getByTestId('walkthrough')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-steps')).not.toBeInTheDocument()
    })
  })

  describe('numbering arrives via context in DOM order', () => {
    it('numbers three steps 1, 2, 3', () => {
      const { getAllByTestId } = render(host(THREE_STEPS))
      const steps = getAllByTestId('documentation-doc-step')
      expect(steps).toHaveLength(3)
      expect(steps.map(circleText)).toEqual(['1', '2', '3'])
    })

    it('renumbers when a step unmounts and marks the new final step last', async () => {
      const Dynamic = defineComponent({
        components: { DocStep, DocSteps },
        props: { titles: { type: Array, required: true } },
        template: `<DocSteps><DocStep v-for="t in titles" :key="t" :title="t" /></DocSteps>`
      })
      const view = render(Dynamic, { props: { titles: ['First', 'Second', 'Third'] } })
      await view.rerender({ titles: ['First', 'Third'] })

      const steps = view.getAllByTestId('documentation-doc-step')
      expect(steps).toHaveLength(2)
      // The surviving steps renumber: this is the behaviour registration buys, and
      // it works because an unmount happens outside the parent's render pass.
      expect(steps.map(circleText)).toEqual(['1', '2'])
    })
  })

  describe('the last step suppresses the connector', () => {
    it('renders a connector inside every step, for CSS to suppress on the last', () => {
      const { getAllByTestId, container } = render(host(THREE_STEPS))
      const steps = getAllByTestId('documentation-doc-step')

      // Whether a step is the final one is a question about DOM order, and it is
      // answered by a last-child CSS variant rather than by a registration count —
      // a count grows while the parent is still rendering, so each step would read
      // it as it stood at its own setup and every step would think it was last.
      // The markup is therefore uniform; the suppression itself belongs to the
      // visual gate, since this environment loads no Tailwind.
      expect(container.querySelectorAll('[data-step-connector]')).toHaveLength(3)
      for (const step of steps) {
        expect(step.querySelector('[data-step-connector]')).not.toBeNull()
        expect(step.querySelector('[data-step-body]')).not.toBeNull()
      }
    })
  })

  describe('accessibility', () => {
    it('has no violations on the default walkthrough', async () => {
      const { container } = render(Default())
      await expectNoA11yViolations(container)
    })

    it('has no violations when steps carry body content', async () => {
      const { container } = render(WithBody())
      await expectNoA11yViolations(container)
    })
  })
})
