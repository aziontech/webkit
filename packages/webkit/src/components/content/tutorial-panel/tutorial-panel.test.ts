import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import CompletedExample from '../../../../examples/tutorial-panel/completed.vue'
import DefaultExample from '../../../../examples/tutorial-panel/default.vue'
import LoadingExample from '../../../../examples/tutorial-panel/loading.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import HelpPanel from '../help-panel/help-panel.vue'
import { useTutorialPanelTasksContext } from './composables/use-tutorial-panel-tasks-context'
import TutorialPanel, { TutorialPanelProvider, type TutorialPanelTutorial } from './index'
import TutorialPanelTask from './parts/tutorial-panel-task.vue'
import TutorialPanelTasks from './parts/tutorial-panel-tasks.vue'
import TutorialPanelHotspot from './tutorial-panel-hotspot/tutorial-panel-hotspot.vue'

const tutorials: TutorialPanelTutorial[] = [
  {
    id: 'first-site',
    title: 'Put your first site online',
    description: 'Two tasks, about five minutes.',
    tasks: [
      {
        title: 'Create an application',
        steps: [
          { title: 'Open the create menu', content: 'Select Create.', hotspotId: 'create' },
          { title: 'Name it', content: 'Type a name.', hotspotId: 'name' }
        ]
      },
      {
        title: 'Publish it',
        steps: [{ title: 'Deploy', content: 'Select Deploy.', hotspotId: 'deploy' }]
      }
    ]
  },
  {
    id: 'domains',
    title: 'Add a domain',
    completed: true,
    tasks: [
      {
        title: 'Point your DNS',
        steps: [{ title: 'Copy the record', content: 'Copy it.', hotspotId: 'dns' }]
      }
    ]
  }
]

const Page = defineComponent({
  components: { TutorialPanel, TutorialPanelProvider, TutorialPanelHotspot },
  props: {
    withDeploy: { type: Boolean, default: true },
    list: { type: Array, default: () => tutorials }
  },
  setup() {
    const active = ref<string | null>(null)
    const step = ref(0)
    const events = ref<string[]>([])
    const log = (name: string, event: unknown, id: string) =>
      events.value.push((event instanceof Event ? '' : '!') + name + ':' + id)
    return { active, step, events, log }
  },
  template: `
    <TutorialPanelProvider
      v-model:active-key="active"
      v-model:step="step"
      :tutorials="list"
      @start="(event, id) => log('start', event, id)"
      @exit="(event, id) => log('exit', event, id)"
      @complete="(event, id) => log('complete', event, id)"
    >
      <main>
        <h1>Applications</h1>
        <TutorialPanelHotspot hotspot-id="create"><button type="button">Create</button></TutorialPanelHotspot>
        <TutorialPanelHotspot hotspot-id="name" side="start"><label>Name <input /></label></TutorialPanelHotspot>
        <TutorialPanelHotspot v-if="withDeploy" hotspot-id="deploy"><button type="button">Deploy</button></TutorialPanelHotspot>
      </main>
      <TutorialPanel>
        <template #completion><a href="#feedback">Give feedback</a></template>
      </TutorialPanel>
      <output data-testid="state">{{ active }}|{{ step }}|{{ events.join(',') }}</output>
    </TutorialPanelProvider>
  `
})

const tick = async () => {
  await nextTick()
  await nextTick()
  await new Promise((resolve) => globalThis.setTimeout(resolve, 20))
}

const panelOf = (container: Element) =>
  container.querySelector('[data-testid="tutorial-panel"]') as HTMLElement
const markers = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>('[data-testid="tutorial-panel-hotspot__marker"]')
  )
const openStep = () =>
  document.querySelector<HTMLElement>('[data-testid="tutorial-panel-hotspot__popover__panel"]')

describe('TutorialPanel', () => {
  it('lists the tutorials with their counts and completion', async () => {
    const { container, getAllByRole, getByText } = render(Page)
    const panel = panelOf(container)
    expect(panel.dataset['view']).toBe('list')
    expect(getByText('Tutorials')).toBeTruthy()
    const items = panel.querySelectorAll('[data-testid="tutorial-panel__item"]')
    expect(items).toHaveLength(2)
    expect(items[0]?.textContent).toContain('2 tasks')
    expect(items[0]?.textContent).toContain('3 steps')
    expect(items[1]?.textContent).toContain('1 task')
    expect(items[1]?.getAttribute('data-completed')).not.toBeNull()
    expect(getAllByRole('button', { name: 'Start tutorial' })).toHaveLength(1)
    expect(getAllByRole('button', { name: 'Restart tutorial' })).toHaveLength(1)
    expect(markers()).toHaveLength(0)
  })

  it('runs a tutorial: hotspots appear, the current step opens and takes focus', async () => {
    const { container, getByRole, getByTestId } = render(Page)
    getByRole('button', { name: 'Start tutorial' }).click()
    await tick()
    expect(panelOf(container).dataset['view']).toBe('running')
    expect(markers()).toHaveLength(3)
    const dialog = openStep()
    expect(dialog?.textContent).toContain('Open the create menu')
    expect(dialog?.textContent).toContain('Step 1 of 3')
    expect(document.activeElement).toBe(dialog)
    expect(getByTestId('state').textContent).toContain('first-site|0|start:first-site')
    const current = panelOf(container).querySelector(
      '[aria-current="step"][data-slot="tutorial-step"]'
    )
    expect(current?.textContent).toContain('Open the create menu')
  })

  it('moves with Next and Previous and finishes on the last step', async () => {
    const { container, getByRole, getByTestId } = render(Page)
    getByRole('button', { name: 'Start tutorial' }).click()
    await tick()
    ;(
      openStep()?.querySelector('[data-testid="tutorial-panel-hotspot__next"]') as HTMLElement
    ).click()
    await tick()
    expect(openStep()?.textContent).toContain('Name it')
    expect(openStep()?.textContent).toContain('Step 2 of 3')
    ;(
      openStep()?.querySelector('[data-testid="tutorial-panel-hotspot__previous"]') as HTMLElement
    ).click()
    await tick()
    expect(openStep()?.textContent).toContain('Step 1 of 3')
    ;(
      openStep()?.querySelector('[data-testid="tutorial-panel-hotspot__next"]') as HTMLElement
    ).click()
    await tick()
    ;(
      openStep()?.querySelector('[data-testid="tutorial-panel-hotspot__next"]') as HTMLElement
    ).click()
    await tick()
    const finish = openStep()?.querySelector(
      '[data-testid="tutorial-panel-hotspot__next"]'
    ) as HTMLElement
    expect(finish.textContent).toContain('Finish')
    finish.click()
    await tick()
    expect(panelOf(container).dataset['view']).toBe('complete')
    expect(openStep()).toBeNull()
    expect(markers()).toHaveLength(0)
    expect(document.activeElement?.textContent).toContain('Tutorial complete')
    expect(getByTestId('state').textContent).toContain('complete:first-site')
    expect(container.textContent).toContain('Give feedback')
    getByRole('button', { name: 'Back to tutorials' }).click()
    await tick()
    expect(panelOf(container).dataset['view']).toBe('list')
    expect(getByTestId('state').textContent).toContain('exit:first-site')
  })

  it('dismisses a step with Escape, keeps the marker, and reopens it from the marker', async () => {
    const { getByRole } = render(Page)
    getByRole('button', { name: 'Start tutorial' }).click()
    await tick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await tick()
    expect(openStep()).toBeNull()
    const marker = markers()[0] as HTMLElement
    expect(marker.getAttribute('aria-expanded')).toBe('false')
    marker.click()
    await tick()
    expect(openStep()?.textContent).toContain('Open the create menu')
    ;(markers()[2] as HTMLElement).click()
    await tick()
    expect(openStep()?.textContent).toContain('Deploy')
  })

  it('focuses the step in the panel when its hotspot is not on the page', async () => {
    const { container, getByRole } = render(Page, { props: { withDeploy: false } })
    getByRole('button', { name: 'Start tutorial' }).click()
    await tick()
    ;(
      openStep()?.querySelector('[data-testid="tutorial-panel-hotspot__next"]') as HTMLElement
    ).click()
    await tick()
    ;(
      openStep()?.querySelector('[data-testid="tutorial-panel-hotspot__next"]') as HTMLElement
    ).click()
    await tick()
    const current = panelOf(container).querySelector(
      '[aria-current="step"][data-slot="tutorial-step"]'
    )
    expect(current?.textContent).toContain('Deploy')
    expect(document.activeElement).toBe(current)
  })

  it('exits from the running view', async () => {
    const { getByRole, getByTestId } = render(Page)
    getByRole('button', { name: 'Start tutorial' }).click()
    await tick()
    getByRole('button', { name: 'Exit tutorial' }).click()
    await tick()
    expect(markers()).toHaveLength(0)
    expect(getByTestId('state').textContent).toBe('|0|start:first-site,exit:first-site')
  })

  it('shows the EmptyState with no tutorials', () => {
    const { getByText, getByTestId } = render(Page, { props: { list: [] } })
    expect(getByText('No tutorials yet.')).toBeTruthy()
    expect(getByTestId('tutorial-panel__empty__title')).toHaveTextContent('No tutorials yet.')
  })

  it('keeps the running tutorial and step locally when v-model is unbound', async () => {
    const Loose = defineComponent({
      components: { TutorialPanel, TutorialPanelProvider, TutorialPanelHotspot },
      setup: () => ({ tutorials }),
      template: `
        <TutorialPanelProvider :tutorials="tutorials">
          <TutorialPanelHotspot hotspot-id="create"><button type="button">Create</button></TutorialPanelHotspot>
          <TutorialPanelHotspot hotspot-id="name"><label>Name <input /></label></TutorialPanelHotspot>
          <TutorialPanel />
        </TutorialPanelProvider>
      `
    })
    const { getAllByRole, findAllByText } = render(Loose)
    getAllByRole('button', { name: /start/i })[0]!.click()
    await tick()
    expect((await findAllByText('Open the create menu')).length).toBeGreaterThan(0)
  })

  it('renders a hotspot outside a provider as its content only', () => {
    const { container } = render(TutorialPanelHotspot, {
      props: { hotspotId: 'x' },
      slots: { default: '<button type="button">Plain</button>' }
    })
    expect(container.querySelector('[data-testid="tutorial-panel-hotspot__marker"]')).toBeNull()
    expect(container.textContent).toContain('Plain')
  })

  it('throws a clear error outside a provider', () => {
    expect(() => render(TutorialPanel)).toThrow(/TutorialPanel.Provider/)
  })

  it('has no axe violations in the list, running and RTL views', async () => {
    const { container, getByRole } = render(Page)
    await expectNoA11yViolations(container)
    getByRole('button', { name: 'Start tutorial' }).click()
    await tick()
    await expectNoA11yViolations(container)
    await expectNoA11yViolations(openStep() as HTMLElement)
  })

  it('mirrors in RTL', async () => {
    const { container, getByRole } = render({
      components: { Page },
      template: '<div dir="rtl"><Page /></div>'
    })
    getByRole('button', { name: 'Start tutorial' }).click()
    await tick()
    const name = container.querySelector('[data-side="start"]') as HTMLElement
    const marker = name.querySelector(
      '[data-testid="tutorial-panel-hotspot__marker"]'
    ) as HTMLElement
    const input = name.querySelector('input') as HTMLElement
    expect(marker.getBoundingClientRect().left).toBeGreaterThan(input.getBoundingClientRect().left)
    await expectNoA11yViolations(container)
  })

  const Guide = defineComponent({
    components: { HelpPanel, TutorialPanelTasks, TutorialPanelTask },
    props: {
      second: { type: String, default: 'pending' },
      secondActive: { type: Boolean, default: true },
      completed: { type: Boolean, default: false },
      withActions: { type: Boolean, default: true }
    },
    template: `
    <HelpPanel aria-label="Help: Get started">
      <TutorialPanelTasks
        title="Put your first site online"
        description="Three tasks, about five minutes."
        :completed="completed"
      >
        <TutorialPanelTask title="Create an application" status="success">
          Choose a template.
        </TutorialPanelTask>
        <TutorialPanelTask title="Create a workload" :status="second" :active="secondActive">
          Bind your domain.
        </TutorialPanelTask>
        <TutorialPanelTask title="Point your DNS">Add the CNAME record.</TutorialPanelTask>
        <template v-if="withActions" #actions>
          <button type="button">Continue</button>
        </template>
      </TutorialPanelTasks>
    </HelpPanel>
  `
  })

  const tasksOf = (view: ReturnType<typeof render>) => view.getAllByTestId('tutorial-panel-task')

  describe('task list', () => {
    it('numbers the tasks in order and mirrors their status', async () => {
      const view = render(Guide)
      await nextTick()
      const tasks = tasksOf(view)
      expect(tasks.map((task) => task.getAttribute('data-status'))).toEqual([
        'success',
        'pending',
        'pending'
      ])
      expect(tasks.map((task) => task.hasAttribute('data-active'))).toEqual([false, true, false])
      expect(tasks[1]?.textContent).toContain('2')
      expect(tasks[2]?.textContent).toContain('3')
    })

    it('marks only the active task with aria-current and announces each status', async () => {
      const view = render(Guide)
      await nextTick()
      const tasks = tasksOf(view)
      expect(tasks.map((task) => task.getAttribute('aria-current'))).toEqual([null, 'step', null])
      expect(tasks[0]?.textContent).toContain('Complete')
      expect(tasks[1]?.textContent).toContain('Current task')
      expect(tasks[2]?.textContent).toContain('Not started')
    })

    it('derives the progress line from the task statuses', async () => {
      const view = render(Guide)
      await nextTick()
      const progress = view.getByTestId('tutorial-panel-tasks__progress')
      expect(progress.textContent?.trim()).toBe('1 of 3 complete')
      expect(progress.getAttribute('aria-live')).toBe('polite')

      await view.rerender({ second: 'success', secondActive: false })
      await nextTick()
      expect(progress.textContent?.trim()).toBe('2 of 3 complete')
    })

    it('renders the tasks inside an ordered list labelled by the tutorial heading', () => {
      const view = render(Guide)
      const tutorial = view.getByRole('region', { name: 'Put your first site online' })
      expect(tutorial.querySelector('ol')?.children).toHaveLength(3)
    })

    it('shows the Completed tag only when the owner marks the tutorial done', async () => {
      const view = render(Guide)
      const tutorial = view.getByTestId('tutorial-panel-tasks')
      expect(tutorial.hasAttribute('data-completed')).toBe(false)
      expect(view.queryByTestId('tutorial-panel-tasks__completed')).toBeNull()

      await view.rerender({ completed: true })
      expect(tutorial.hasAttribute('data-completed')).toBe(true)
      expect(view.getByTestId('tutorial-panel-tasks__completed').textContent).toContain('Completed')
    })

    it('renders the actions row when the slot has content', () => {
      const view = render(Guide)
      const actions = view.getByTestId('tutorial-panel-tasks__actions')
      expect(actions.querySelector('button')?.textContent).toBe('Continue')
    })

    it('omits the actions row when the slot is empty', () => {
      const view = render(Guide, { props: { withActions: false } })
      expect(view.queryByTestId('tutorial-panel-tasks__actions')).toBeNull()
    })

    it('has no axe violations with a completed tutorial', async () => {
      const { container } = render(Guide, { props: { completed: true } })
      await nextTick()
      await expectNoA11yViolations(container)
    })
  })

  describe('useTutorialPanelTasksContext', () => {
    it('throws when resolved outside a TutorialPanel task list', () => {
      const Loose = defineComponent({
        setup() {
          useTutorialPanelTasksContext()
          return () => null
        }
      })

      expect(() => render(Loose)).toThrow(/must be used within a TutorialPanel/)
    })

    it('throws when a Task is rendered outside a task list', () => {
      expect(() => render(TutorialPanelTask, { props: { title: 'Loose' } })).toThrow(
        /must be used within a TutorialPanel/
      )
    })
  })

  const guideTutorials: TutorialPanelTutorial[] = [
    {
      id: 'guide',
      title: 'Guide',
      tasks: [
        {
          title: 'Task one',
          steps: [
            { title: 'First', content: 'Do the first thing.', hotspotId: 'a' },
            { title: 'Second', content: 'Do the second thing.', hotspotId: 'b' }
          ]
        }
      ]
    }
  ]

  const GuideHost = defineComponent({
    components: { TutorialPanelProvider, TutorialPanelHotspot },
    props: {
      active: { type: String, default: null },
      step: { type: Number, default: 0 }
    },
    setup(props) {
      const current = ref(props.active)
      const at = ref(props.step)
      return { guideTutorials, current, at }
    },
    template: `
    <TutorialPanelProvider v-model:active-key="current" v-model:step="at" :tutorials="guideTutorials">
      <TutorialPanelHotspot hotspot-id="a"><button type="button">Alpha</button></TutorialPanelHotspot>
      <TutorialPanelHotspot hotspot-id="b"><button type="button">Beta</button></TutorialPanelHotspot>
      <TutorialPanelHotspot hotspot-id="z"><button type="button">Other</button></TutorialPanelHotspot>
    </TutorialPanelProvider>
  `
  })

  describe('hotspot', () => {
    it('renders no marker while no tutorial runs', () => {
      render(GuideHost)
      expect(markers()).toHaveLength(0)
    })

    it('shows a marker only beside the running tutorial’s steps, the current one open and pulsing', async () => {
      const { container } = render(GuideHost, { props: { active: 'guide', step: 1 } })
      await tick()
      expect(markers()).toHaveLength(2)
      const current = container.querySelector('[data-active]') as HTMLElement
      expect(container.querySelectorAll('[data-marker]')).toHaveLength(2)
      expect(current.textContent).toContain('Beta')
      expect(current.querySelector('.animate-ping-settle')).not.toBeNull()
      expect(markers()[1]?.getAttribute('aria-label')).toBe('Tutorial step: Second')
      expect(markers()[1]?.getAttribute('aria-expanded')).toBe('true')
      const panel = document.querySelector('[data-testid="tutorial-panel-hotspot__popover__panel"]')
      expect(panel?.textContent).toContain('Step 2 of 2')
      expect(panel?.textContent).toContain('Task one')
      expect(panel?.textContent).toContain('Finish')
      expect(panel?.textContent).toContain('Previous')
    })

    it('opens from the keyboard on Enter on a marker', async () => {
      render(GuideHost, { props: { active: 'guide', step: 1 } })
      await tick()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      await tick()
      const marker = markers()[0] as HTMLElement
      marker.focus()
      await userEvent.keyboard('{Enter}')
      await tick()
      const panel = document.querySelector('[data-testid="tutorial-panel-hotspot__popover__panel"]')
      expect(panel?.textContent).toContain('First')
      expect(panel?.textContent).not.toContain('Previous')
    })

    it('places the marker before the content with side="start"', async () => {
      const { getByRole, container } = render({
        components: { TutorialPanelProvider, TutorialPanelHotspot },
        setup: () => ({ guideTutorials }),
        template: `
        <TutorialPanelProvider :tutorials="guideTutorials" active-key="guide" :step="0">
          <TutorialPanelHotspot hotspot-id="a" side="start"><button type="button">Alpha</button></TutorialPanelHotspot>
        </TutorialPanelProvider>
      `
      })
      await tick()
      const marker = container.querySelector<HTMLElement>(
        '[data-testid="tutorial-panel-hotspot__marker"]'
      ) as HTMLElement
      const button = getByRole('button', { name: 'Alpha' })
      expect(marker.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })

    it('has no axe violations', async () => {
      const { container } = render(GuideHost, { props: { active: 'guide', step: 0 } })
      await tick()
      await expectNoA11yViolations(container)
    })

    it('renders the testid fallback and lets a consumer testid win', async () => {
      const { container } = render({
        components: { TutorialPanelProvider, TutorialPanelHotspot },
        setup: () => ({ guideTutorials }),
        template: `
        <TutorialPanelProvider :tutorials="guideTutorials" active-key="guide" :step="0">
          <TutorialPanelHotspot hotspot-id="a"><button type="button">Alpha</button></TutorialPanelHotspot>
          <TutorialPanelHotspot hotspot-id="b" data-testid="beta-spot"><button type="button">Beta</button></TutorialPanelHotspot>
        </TutorialPanelProvider>
      `
      })
      await tick()
      expect(container.querySelectorAll('[data-testid="tutorial-panel-hotspot"]')).toHaveLength(1)
      expect(container.querySelector('[data-testid="beta-spot"]')?.textContent).toContain('Beta')
      expect(container.querySelector('[data-testid="beta-spot__marker"]')).not.toBeNull()
    })

    it('closes the open step on Escape and returns focus to its marker', async () => {
      render(GuideHost, { props: { active: 'guide', step: 0 } })
      await tick()
      const marker = markers()[0] as HTMLElement
      expect(marker.getAttribute('aria-expanded')).toBe('true')
      await userEvent.keyboard('{Escape}')
      await tick()
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(marker.getAttribute('aria-expanded')).toBe('false')
      expect(document.activeElement).toBe(marker)
    })

    it('sets the step title in the medium-weight title role of a popover title', async () => {
      render(GuideHost, { props: { active: 'guide', step: 0 } })
      await tick()
      const title = document.querySelector('[data-testid="tutorial-panel-hotspot__title"]')
      expect(title?.textContent).toContain('First')
      expect(title?.classList.contains('text-title-sm')).toBe(true)
    })
  })

  describe('open steps', () => {
    const openDialogs = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"][data-state="open"]'))

    it.each([
      ['default', DefaultExample],
      ['completed', CompletedExample],
      ['loading', LoadingExample]
    ])('opens no step when the %s example mounts', async (_name, example) => {
      render(example)
      await tick()
      expect(openDialogs()).toHaveLength(0)
    })

    it('shows one primary button in the default example', async () => {
      const { container } = render(DefaultExample)
      await tick()
      const primaries = container.querySelectorAll('button[data-variant="primary"]')
      expect(primaries).toHaveLength(1)
      expect(primaries[0]?.getAttribute('data-testid')).toBe('tutorial-panel__start')
    })

    const Twin = defineComponent({
      components: { TutorialPanel, TutorialPanelProvider, TutorialPanelHotspot },
      props: { name: { type: String, required: true }, preset: { type: Boolean, default: false } },
      setup(props) {
        const active = ref<string | null>(props.preset ? 'guide' : null)
        const step = ref(0)
        return { active, step, guideTutorials }
      },
      template: `
      <TutorialPanelProvider v-model:active-key="active" v-model:step="step" :tutorials="guideTutorials">
        <TutorialPanelHotspot hotspot-id="a" :data-testid="name"><button type="button">Alpha</button></TutorialPanelHotspot>
        <TutorialPanel :title="name" :data-testid="name + '-panel'" />
      </TutorialPanelProvider>
    `
    })

    const Pair = defineComponent({
      components: { Twin },
      props: { preset: { type: Boolean, default: false } },
      template: `<div><Twin name="one" :preset="preset" /><Twin name="two" :preset="preset" /></div>`
    })

    const startIn = async (panel: string) => {
      const root = document.querySelector(`[data-testid="${panel}-panel"]`) as HTMLElement
      await userEvent.click(
        Array.from(root.querySelectorAll('button')).find((b) => /start/i.test(b.textContent ?? ''))!
      )
      await tick()
    }

    it('keeps one step open when a second provider starts a tutorial', async () => {
      render(Pair)
      await startIn('one')
      expect(openDialogs()).toHaveLength(1)
      expect(openDialogs()[0]?.textContent).toContain('First')
      await startIn('two')
      expect(openDialogs()).toHaveLength(1)
      const one = document.querySelector('[data-testid="one__marker"]') as HTMLElement
      const two = document.querySelector('[data-testid="two__marker"]') as HTMLElement
      expect(one.getAttribute('aria-expanded')).toBe('false')
      expect(two.getAttribute('aria-expanded')).toBe('true')
      await userEvent.click(one)
      await tick()
      expect(openDialogs()).toHaveLength(1)
      expect(one.getAttribute('aria-expanded')).toBe('true')
      expect(two.getAttribute('aria-expanded')).toBe('false')
    })

    it('opens at most one step when two providers mount with a running tutorial', async () => {
      render(Pair, { props: { preset: true } })
      await tick()
      expect(openDialogs()).toHaveLength(1)
    })
  })
})
