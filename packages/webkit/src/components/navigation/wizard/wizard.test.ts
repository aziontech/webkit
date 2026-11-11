import '../../../test/reflow.css'

import { userEvent } from '@storybook/test'
import { render, within } from '@testing-library/vue'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import { useWizardContext } from './composables/use-wizard-context'
import Wizard, { WizardStep } from './index'

const Flow = defineComponent({
  components: { Wizard, WizardStep },
  props: {
    start: { type: Number, default: 0 },
    loading: { type: Boolean, default: false },
    block: { type: Boolean, default: false }
  },
  emits: ['next', 'submit', 'cancel'],
  data() {
    return { step: this.start }
  },
  methods: {
    onNext(event: MouseEvent, step: number) {
      if (this.block) event.preventDefault()
      this.$emit('next', event, step)
    }
  },
  template: `
    <Wizard
      v-model:active-step="step"
      aria-label="Create resource"
      submit-label="Deploy"
      :loading="loading"
      @next="onNext"
      @submit="$emit('submit', $event)"
      @cancel="$emit('cancel', $event)"
    >
      <WizardStep title="Configure" description="Name the resource and choose where it runs.">
        <label>Name <input type="text" /></label>
      </WizardStep>
      <WizardStep title="Settings" optional>
        <p>Settings fields</p>
      </WizardStep>
      <WizardStep title="Review">
        <p>Review summary</p>
      </WizardStep>
    </Wizard>
    <output data-testid="model">{{ step }}</output>
  `
})

beforeAll(async () => {
  await page.viewport(1280, 900)
})

const mount = async (props: Record<string, unknown> = {}) => {
  const view = render(Flow, { props })
  await nextTick()
  await nextTick()
  return view
}

const rootOf = (view: ReturnType<typeof render>) => view.getByTestId('navigation-wizard')

const headingOf = (view: ReturnType<typeof render>) => view.getByRole('heading', { level: 2 })

const railButtons = (view: ReturnType<typeof render>) =>
  within(view.getByRole('navigation')).getAllByRole('button') as globalThis.HTMLButtonElement[]

const button = (view: ReturnType<typeof render>, name: string) =>
  view.getByRole('button', { name }) as globalThis.HTMLButtonElement

describe('Wizard', () => {
  describe('compound API', () => {
    it('attaches Step to the root for dot-notation', () => {
      expect(Wizard.Step).toBe(WizardStep)
    })
  })

  describe('rendering & testid', () => {
    it('renders a named section with the derived testid, the rail and the first step', async () => {
      const view = await mount()
      const root = rootOf(view)

      expect(root.tagName).toBe('SECTION')
      expect(root.getAttribute('aria-label')).toBe('Create resource')
      expect(root.getAttribute('data-active-step')).toBe('0')
      expect(railButtons(view)).toHaveLength(3)
      expect(headingOf(view).textContent?.trim()).toBe('Configure')
      expect(within(view.getByRole('group')).getByText('Step 1 of 3')).toBeInTheDocument()
      expect(view.getByText('Name the resource and choose where it runs.')).toBeInTheDocument()
    })

    it('renders only the active step and hides the others', async () => {
      const view = await mount()
      const steps = view.getAllByTestId('navigation-wizard-step')

      expect(steps).toHaveLength(3)
      expect(steps.map((step) => step.hasAttribute('data-active'))).toEqual([true, false, false])
      expect(steps.map((step) => step.hidden)).toEqual([false, true, true])
      expect(view.queryByText('Settings fields')).not.toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win on the root and on a step', async () => {
      const Custom = defineComponent({
        components: { Wizard, WizardStep },
        template: `
          <Wizard data-testid="create-flow" aria-label="Create">
            <WizardStep title="Only" data-testid="create-flow-only" />
          </Wizard>
        `
      })
      const view = render(Custom)
      await nextTick()

      expect(view.getByTestId('create-flow')).toBeInTheDocument()
      expect(view.queryByTestId('navigation-wizard')).not.toBeInTheDocument()
      expect(view.getByTestId('create-flow-only')).toBeInTheDocument()
      expect(view.queryByTestId('navigation-wizard-step')).not.toBeInTheDocument()
    })

    it('omits aria-label when the consumer sets none', async () => {
      const Bare = defineComponent({
        components: { Wizard, WizardStep },
        template: `<Wizard><WizardStep title="Only" /></Wizard>`
      })
      const view = render(Bare)
      await nextTick()
      expect(rootOf(view).hasAttribute('aria-label')).toBe(false)
    })
  })

  describe('navigation', () => {
    it('hides Previous on the first step and moves forward and back with Next and Previous', async () => {
      const view = await mount()
      expect(view.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument()

      await userEvent.click(button(view, 'Next'))
      expect(rootOf(view).getAttribute('data-active-step')).toBe('1')
      expect(headingOf(view).textContent?.trim()).toBe('Settings')
      expect(within(view.getByRole('group')).getByText('Step 2 of 3')).toBeInTheDocument()

      await userEvent.click(button(view, 'Previous'))
      expect(rootOf(view).getAttribute('data-active-step')).toBe('0')
      expect(headingOf(view).textContent?.trim()).toBe('Configure')
    })

    it('emits next with the index of the step being left', async () => {
      const view = await mount({ start: 1 })
      await userEvent.click(button(view, 'Next'))

      const calls = view.emitted('next') as [MouseEvent, number][]
      expect(calls).toHaveLength(1)
      expect(calls[0][0]).toBeInstanceOf(MouseEvent)
      expect(calls[0][1]).toBe(1)
    })

    it('stays on the step when the next handler calls preventDefault', async () => {
      const view = await mount({ block: true })
      await userEvent.click(button(view, 'Next'))

      expect(view.emitted('next')).toHaveLength(1)
      expect(rootOf(view).getAttribute('data-active-step')).toBe('0')
      expect(view.getByTestId('model').textContent).toBe('0')
      expect(headingOf(view).textContent?.trim()).toBe('Configure')
    })

    it('turns Next into the submit action on the last step', async () => {
      const view = await mount({ start: 2 })
      expect(view.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()

      await userEvent.click(button(view, 'Deploy'))

      const calls = view.emitted('submit') as [MouseEvent][]
      expect(calls).toHaveLength(1)
      expect(calls[0][0]).toBeInstanceOf(MouseEvent)
      expect(view.emitted('next')).toBeUndefined()
      expect(rootOf(view).getAttribute('data-active-step')).toBe('2')
    })

    it('makes the primary action the submit action from the start on a single step', async () => {
      const Single = defineComponent({
        components: { Wizard, WizardStep },
        template: `<Wizard aria-label="Create"><WizardStep title="Only" /></Wizard>`
      })
      const view = render(Single)
      await nextTick()

      expect(view.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument()
      expect(view.getByRole('button', { name: 'Create' })).toBeInTheDocument()
    })

    it('emits cancel without changing the step', async () => {
      const view = await mount({ start: 1 })
      await userEvent.click(button(view, 'Cancel'))

      const calls = view.emitted('cancel') as [MouseEvent][]
      expect(calls).toHaveLength(1)
      expect(calls[0][0]).toBeInstanceOf(MouseEvent)
      expect(rootOf(view).getAttribute('data-active-step')).toBe('1')
    })
  })

  describe('loading', () => {
    it('busies the primary action, disables Cancel, Previous and the rail, and suppresses every event', async () => {
      const view = await mount({ start: 2, loading: true })
      const root = rootOf(view)
      expect(root.getAttribute('data-loading')).toBe('true')

      const submit = button(view, 'Deploy')
      expect(submit.getAttribute('aria-busy')).toBe('true')
      expect(button(view, 'Cancel').disabled).toBe(true)
      expect(button(view, 'Previous').disabled).toBe(true)
      expect(railButtons(view).every((rail) => rail.disabled)).toBe(true)

      await userEvent.click(submit)
      await userEvent.click(button(view, 'Cancel'))
      await userEvent.click(button(view, 'Previous'))
      await userEvent.click(railButtons(view)[0])

      expect(view.emitted('submit')).toBeUndefined()
      expect(view.emitted('cancel')).toBeUndefined()
      expect(root.getAttribute('data-active-step')).toBe('2')
    })

    it('does not mark the root loading by default', async () => {
      const view = await mount()
      expect(rootOf(view).hasAttribute('data-loading')).toBe(false)
    })
  })

  describe('v-model:activeStep', () => {
    it('writes Next back to the bound model', async () => {
      const view = await mount()
      await userEvent.click(button(view, 'Next'))
      expect(view.getByTestId('model').textContent).toBe('1')
    })

    it('follows the bound model when the consumer changes it', async () => {
      const Controlled = defineComponent({
        components: { Wizard, WizardStep },
        data() {
          return { step: 0 }
        },
        template: `
          <button type="button" @click="step = 2">Jump</button>
          <Wizard v-model:active-step="step" aria-label="Create">
            <WizardStep title="One" />
            <WizardStep title="Two" />
            <WizardStep title="Three" />
          </Wizard>
        `
      })
      const view = render(Controlled)
      await nextTick()

      await userEvent.click(view.getByRole('button', { name: 'Jump' }))
      expect(rootOf(view).getAttribute('data-active-step')).toBe('2')
      expect(headingOf(view).textContent?.trim()).toBe('Three')
    })

    it('clamps an out-of-range model without writing it back', async () => {
      const view = await mount({ start: 7 })
      expect(rootOf(view).getAttribute('data-active-step')).toBe('2')
      expect(view.getByTestId('model').textContent).toBe('7')
    })
  })

  describe('the rail', () => {
    it('marks earlier steps complete and disables every later step', async () => {
      const view = await mount({ start: 1 })
      const states = view
        .getAllByTestId('navigation-stepper-step')
        .map((step) => step.getAttribute('data-state'))

      expect(states).toEqual(['complete', 'current', 'upcoming'])
      expect(railButtons(view).map((rail) => rail.disabled)).toEqual([false, false, true])
      expect(railButtons(view)[1].getAttribute('aria-current')).toBe('step')
    })

    it('jumps back to a completed step when it is activated', async () => {
      const view = await mount({ start: 2 })
      await userEvent.click(railButtons(view)[0])

      expect(rootOf(view).getAttribute('data-active-step')).toBe('0')
      expect(view.getByTestId('model').textContent).toBe('0')
      expect(headingOf(view).textContent?.trim()).toBe('Configure')
      expect(view.emitted('next')).toBeUndefined()
    })
  })

  describe('focus', () => {
    it('does not steal focus on the initial render', async () => {
      const view = await mount({ start: 1 })
      expect(document.activeElement).not.toBe(headingOf(view))
    })

    it('moves focus to the new step heading on every step change', async () => {
      const view = await mount()
      await userEvent.click(button(view, 'Next'))

      await vi.waitFor(() => expect(document.activeElement).toBe(headingOf(view)))
      expect(headingOf(view).textContent?.trim()).toBe('Settings')
      expect(headingOf(view).getAttribute('tabindex')).toBe('-1')

      await userEvent.click(button(view, 'Previous'))
      await vi.waitFor(() => expect(document.activeElement).toBe(headingOf(view)))
      expect(headingOf(view).textContent?.trim()).toBe('Configure')
    })
  })

  describe('optional', () => {
    it('shows Optional in the rail and, on its own step, in the header', async () => {
      const view = await mount()
      const steps = view.getAllByTestId('navigation-wizard-step')
      expect(steps.map((step) => step.hasAttribute('data-optional'))).toEqual([false, true, false])
      expect(view.getAllByText('Optional')).toHaveLength(1)

      await userEvent.click(button(view, 'Next'))
      expect(view.getAllByText('Optional')).toHaveLength(2)
    })
  })

  describe('ARIA', () => {
    it('labels the active step group by its heading and describes the heading by the counter', async () => {
      const view = await mount()
      const group = view.getByRole('group')
      const heading = headingOf(view)

      expect(group.getAttribute('aria-labelledby')).toBe(heading.id)
      const counter = document.getElementById(heading.getAttribute('aria-describedby') ?? '')
      expect(counter?.textContent?.trim()).toBe('Step 1 of 3')
    })
  })

  describe('accessibility', () => {
    it('has no violations on a realistic flow', async () => {
      const { container } = await mount({ start: 1 })
      await expectNoA11yViolations(container)
    })

    it('has no violations while loading on the last step', async () => {
      const { container } = await mount({ start: 2, loading: true })
      await expectNoA11yViolations(container)
    })
  })
})

describe('useWizardContext', () => {
  it('throws when a step renders outside a Wizard', () => {
    const Loose = defineComponent({
      setup() {
        useWizardContext()
        return () => null
      }
    })

    expect(() => render(Loose)).toThrow(/must be used within a Wizard/)
  })

  it('throws when a Wizard.Step renders outside a Wizard', () => {
    expect(() => render(WizardStep, { props: { title: 'Loose' } })).toThrow(
      /must be used within a Wizard/
    )
  })
})

describe('Wizard on devices', () => {
  const inBox = (width: number, locale = 'en') =>
    defineComponent({
      components: { Flow, WebkitProvider },
      setup: () => ({ width: `${width}px`, locale }),
      template: `<WebkitProvider :locale="locale"><div :style="{ width }"><Flow /></div></WebkitProvider>`
    })

  const progressOf = (view: ReturnType<typeof render>) =>
    view.getByTestId('navigation-wizard__progress')

  it('shows a polite Step n of N line when the rail hides in a narrow box', async () => {
    const view = render(inBox(400))
    await nextTick()
    await nextTick()
    const progress = progressOf(view)

    expect(progress.getAttribute('aria-live')).toBe('polite')
    expect(progress.textContent?.trim()).toBe('Step 1 of 3')
    expect(getComputedStyle(progress).display).not.toBe('none')
    const counter = within(view.getByRole('group')).getByText('Step 1 of 3')
    expect(getComputedStyle(counter).display).toBe('none')

    await userEvent.click(view.getByRole('button', { name: 'Next' }))
    await nextTick()
    expect(progress.textContent?.trim()).toBe('Step 2 of 3')
  })

  it('hides the line when the rail is visible', async () => {
    const view = render(inBox(1200))
    await nextTick()
    await nextTick()

    expect(getComputedStyle(progressOf(view)).display).toBe('none')
    const counter = within(view.getByRole('group')).getByText('Step 1 of 3')
    expect(getComputedStyle(counter).display).not.toBe('none')
  })

  it('translates the line', async () => {
    const view = render(inBox(400, 'pt-BR'))
    await nextTick()
    await nextTick()

    expect(progressOf(view).textContent?.trim()).toBe('Etapa 1 de 3')
  })

  it('hides the step rail when its own box is narrow, not the window', async () => {
    const view = await mount()
    const rail = view.getByRole('navigation').parentElement

    expect(rootOf(view).className).toContain('@container/wizard')
    expect(rail?.className).toContain('@max-2xl/wizard:hidden')
  })
})
