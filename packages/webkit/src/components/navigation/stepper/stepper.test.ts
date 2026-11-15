import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { useStepperContext } from './composables/use-stepper-context'
import Stepper, { StepperStep } from './index'

const Rail = defineComponent({
  components: { Stepper, StepperStep },
  props: {
    start: { type: String, default: 'host' },
    configureStatus: { type: String, default: 'pending' },
    reviewDisabled: { type: Boolean, default: false }
  },
  data() {
    return { step: this.start }
  },
  template: `
    <Stepper v-model="step" aria-label="Create network list">
      <StepperStep
        value="host"
        title="Where it runs"
        description="The firewall that reads this list."
        status="success"
      />
      <StepperStep value="configure" title="Configure" :status="configureStatus" />
      <StepperStep value="review" title="Review" :disabled="reviewDisabled" />
    </Stepper>
  `
})

const Single = defineComponent({
  components: { Stepper, StepperStep },
  props: {
    current: { type: String, default: '' },
    status: { type: String, default: 'pending' }
  },
  template: `
    <Stepper :model-value="current" aria-label="Steps">
      <StepperStep value="one" title="One" :status="status" />
    </Stepper>
  `
})

const stepsOf = (view: ReturnType<typeof render>) => view.getAllByTestId('navigation-stepper-step')

const statesOf = (view: ReturnType<typeof render>) =>
  stepsOf(view).map((step) =>
    step.hasAttribute('data-active') ? 'active' : step.getAttribute('data-status')
  )

const buttonIn = (step: Element) => step.querySelector('button') as globalThis.HTMLButtonElement

describe('Stepper', () => {
  describe('compound API', () => {
    it('attaches Step to the root for dot-notation', () => {
      expect(Stepper.Step).toBe(StepperStep)
    })
  })

  describe('rendering & testid', () => {
    it('renders the rail with the derived testid, orientation and every step title', () => {
      const view = render(Rail)

      const root = view.getByTestId('navigation-stepper')
      expect(root.tagName).toBe('NAV')
      expect(root.getAttribute('data-orientation')).toBe('vertical')
      expect(root.getAttribute('aria-label')).toBe('Create network list')

      expect(view.getByText('Where it runs')).toBeInTheDocument()
      expect(view.getByText('Configure')).toBeInTheDocument()
      expect(view.getByText('Review')).toBeInTheDocument()
      expect(stepsOf(view)).toHaveLength(3)
    })

    it('falls back to the default aria-label when the consumer sets none', () => {
      const view = render(Single)
      expect(view.getByTestId('navigation-stepper').getAttribute('aria-label')).toBe('Steps')
    })

    it('lets a consumer-supplied data-testid win on the root and on a step', () => {
      const Custom = defineComponent({
        components: { Stepper, StepperStep },
        template: `
          <Stepper data-testid="wizard" aria-label="Wizard">
            <StepperStep value="one" title="One" data-testid="wizard-first" />
          </Stepper>
        `
      })
      const view = render(Custom)

      expect(view.getByTestId('wizard')).toBeInTheDocument()
      expect(view.queryByTestId('navigation-stepper')).not.toBeInTheDocument()
      expect(view.getByTestId('wizard-first')).toBeInTheDocument()
      expect(view.queryByTestId('navigation-stepper-step')).not.toBeInTheDocument()
    })

    it('renumbers in document order when a step is inserted between two that exist', async () => {
      const Branching = defineComponent({
        components: { Stepper, StepperStep },
        props: { branched: { type: Boolean, default: false } },
        template: `
          <Stepper model-value="" aria-label="Steps">
            <StepperStep value="method" title="Method" />
            <StepperStep v-if="branched" value="template" title="Template" />
            <StepperStep value="source" title="Source" />
            <StepperStep value="deploy" title="Deploy" />
          </Stepper>
        `
      })
      const view = render(Branching)
      await nextTick()

      await view.rerender({ branched: true })
      await nextTick()

      // Vue reuses the instances either side of the inserted step, so they never
      // re-register: only document order can renumber them.
      expect(stepsOf(view).map((step) => step.textContent)).toEqual([
        expect.stringContaining('1'),
        expect.stringContaining('2'),
        expect.stringContaining('3'),
        expect.stringContaining('4')
      ])
      expect(stepsOf(view).map((step) => step.querySelector('span')?.textContent)).toBeTruthy()
    })

    it('numbers the steps from the registration order', () => {
      const Unanswered = defineComponent({
        components: { Stepper, StepperStep },
        template: `
          <Stepper model-value="" aria-label="Steps">
            <StepperStep value="host" title="Where it runs" />
            <StepperStep value="configure" title="Configure" />
            <StepperStep value="review" title="Review" />
          </Stepper>
        `
      })
      const view = render(Unanswered)
      expect(stepsOf(view).map((step) => step.textContent)).toEqual([
        expect.stringContaining('1'),
        expect.stringContaining('2'),
        expect.stringContaining('3')
      ])
    })

    it('replaces the number with the state glyph once a step is no longer pending', () => {
      const view = render(Rail, { props: { start: '' } })
      expect(stepsOf(view)[0].textContent).not.toContain('1')
      expect(stepsOf(view)[1].textContent).toContain('2')
    })
  })

  describe('status prop maps to data-status', () => {
    it.each(['pending', 'success', 'error', 'running'])(
      'renders status="%s" as data-status when it is not the active step',
      (status) => {
        const view = render(Single, { props: { current: 'other', status } })
        const step = stepsOf(view)[0]
        expect(step.getAttribute('data-status')).toBe(status)
        expect(step.hasAttribute('data-active')).toBe(false)
        expect(step.hasAttribute('data-completed')).toBe(status === 'success')
        expect(step.hasAttribute('data-state')).toBe(false)
      }
    )
  })

  describe('active is derived from the root v-model', () => {
    it('marks the step whose value matches the model', () => {
      const view = render(Rail, { props: { start: 'configure' } })
      expect(statesOf(view)).toEqual(['success', 'active', 'pending'])
      expect(view.getByTestId('navigation-stepper').getAttribute('data-active')).toBe('configure')
    })

    it('marks no step when the model matches nothing', () => {
      const view = render(Rail, { props: { start: '' } })
      expect(statesOf(view)).toEqual(['success', 'pending', 'pending'])
    })

    it.each([
      ['error', 'error'],
      ['running', 'running'],
      ['success', 'active'],
      ['pending', 'active']
    ])('resolves status="%s" on the active step as %s', (status, expected) => {
      const view = render(Single, { props: { current: 'one', status } })
      expect(statesOf(view)).toEqual([expected])
    })
  })

  describe('activation drives the v-model', () => {
    it('writes the clicked step value back to the model', async () => {
      const view = render(Rail, { props: { start: 'host' } })
      const root = view.getByTestId('navigation-stepper')
      expect(root.getAttribute('data-active')).toBe('host')

      await userEvent.click(buttonIn(stepsOf(view)[1]))

      expect(root.getAttribute('data-active')).toBe('configure')
      expect(statesOf(view)).toEqual(['success', 'active', 'pending'])
    })

    it('does not move the model when the step is disabled', async () => {
      const view = render(Rail, { props: { start: 'host', reviewDisabled: true } })
      const root = view.getByTestId('navigation-stepper')

      const review = buttonIn(stepsOf(view)[2])
      expect(review.disabled).toBe(true)

      await userEvent.click(review)

      expect(root.getAttribute('data-active')).toBe('host')
      expect(statesOf(view)).toEqual(['active', 'pending', 'pending'])
    })

    it('mirrors the disabled prop onto the step', () => {
      const view = render(Rail, { props: { reviewDisabled: true } })
      const [, , review] = stepsOf(view)
      expect(review.getAttribute('data-disabled')).toBe('true')
      expect(stepsOf(view)[1].getAttribute('data-disabled')).toBeNull()
    })
  })

  describe('ARIA', () => {
    it('puts aria-current="step" on the current step only', () => {
      const view = render(Rail, { props: { start: 'configure' } })
      const current = view
        .getAllByRole('button')
        .filter((button) => button.getAttribute('aria-current') === 'step')

      expect(current).toHaveLength(1)
      expect(current[0].textContent).toContain('Configure')
    })

    it('marks a loading step aria-busy and leaves the others alone', () => {
      const view = render(Rail, { props: { start: 'host', configureStatus: 'running' } })
      const [host, configure, review] = stepsOf(view).map(buttonIn)

      expect(configure.getAttribute('aria-busy')).toBe('true')
      expect(host.getAttribute('aria-busy')).toBeNull()
      expect(review.getAttribute('aria-busy')).toBeNull()
    })

    it('names each step state for screen readers', () => {
      const view = render(Rail, { props: { start: 'configure' } })
      expect(view.getByText('Completed')).toBeInTheDocument()
      expect(view.getByText('Current step')).toBeInTheDocument()
      expect(view.getByText('Not started')).toBeInTheDocument()
    })
  })

  describe('the connector', () => {
    it('is rendered between steps and omitted on the last one', async () => {
      const view = render(Rail)
      await nextTick()

      const [host, configure, review] = stepsOf(view)
      expect(host.querySelector('[data-slot="step-connector"]')).not.toBeNull()
      expect(configure.querySelector('[data-slot="step-connector"]')).not.toBeNull()
      expect(review.querySelector('[data-slot="step-connector"]')).toBeNull()
      expect(view.container.querySelectorAll('[data-slot="step-connector"]')).toHaveLength(2)
    })

    it('is omitted entirely on a single-step rail', async () => {
      const view = render(Single)
      await nextTick()
      expect(view.container.querySelectorAll('[data-slot="step-connector"]')).toHaveLength(0)
    })
  })

  describe('accessibility', () => {
    it('has no violations on a realistic rail', async () => {
      const { container } = render(Rail, { props: { start: 'configure' } })
      await nextTick()
      await expectNoA11yViolations(container)
    })

    it('has no violations with a loading step and a closed step', async () => {
      const { container } = render(Rail, {
        props: { start: 'configure', configureStatus: 'loading', reviewDisabled: true }
      })
      await nextTick()
      await expectNoA11yViolations(container)
    })
  })

  describe('useStepperContext', () => {
    it('throws when resolved outside a Stepper provider', () => {
      const Loose = defineComponent({
        setup() {
          useStepperContext()
          return () => null
        }
      })

      expect(() => render(Loose)).toThrow(/must be used within a Stepper/)
    })
  })

  describe('step body', () => {
    it('renders the default slot outside the step button so a link in it is not nested', async () => {
      const { container, getByRole } = render(
        defineComponent({
          components: { Stepper, StepperStep },
          template: `
          <Stepper model-value="deploy" aria-label="Deploy">
            <StepperStep value="deploy" title="Deploy" status="error">
              <a href="https://example.com/logs">View logs</a>
            </StepperStep>
            <StepperStep value="verify" title="Verify" />
          </Stepper>
        `
        })
      )
      await nextTick()
      const link = getByRole('link', { name: 'View logs' })
      expect(link.closest('button')).toBeNull()
      expect(link.closest('li')).not.toBeNull()
      await expectNoA11yViolations(container)
    })
  })
})
