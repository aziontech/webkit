import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import Hotspot from '../hotspot/hotspot.vue'
import TutorialPanel, { type Tutorial, TutorialPanelProvider } from './index'

const tutorials: Tutorial[] = [
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
  components: { TutorialPanel, TutorialPanelProvider, Hotspot },
  props: {
    withDeploy: { type: Boolean, default: true },
    list: { type: Array, default: () => tutorials }
  },
  setup() {
    const active = ref<string | null>(null)
    const step = ref(0)
    const events = ref<string[]>([])
    return { active, step, events }
  },
  template: `
    <TutorialPanelProvider
      v-model:active="active"
      v-model:step="step"
      :tutorials="list"
      @start="(id) => events.push('start:' + id)"
      @exit="(id) => events.push('exit:' + id)"
      @finish="(id) => events.push('finish:' + id)"
    >
      <main>
        <h1>Applications</h1>
        <Hotspot hotspot-id="create"><button type="button">Create</button></Hotspot>
        <Hotspot hotspot-id="name" side="start"><label>Name <input /></label></Hotspot>
        <Hotspot v-if="withDeploy" hotspot-id="deploy"><button type="button">Deploy</button></Hotspot>
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
  container.querySelector('[data-testid="content-tutorial-panel"]') as HTMLElement
const markers = () =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-testid="content-hotspot__marker"]'))
const openStep = () =>
  document.querySelector<HTMLElement>('[data-testid="content-hotspot__popover__panel"]')

describe('TutorialPanel', () => {
  it('lists the tutorials with their counts and completion', async () => {
    const { container, getAllByRole, getByText } = render(Page)
    const panel = panelOf(container)
    expect(panel.dataset['view']).toBe('list')
    expect(getByText('Tutorials')).toBeTruthy()
    const items = panel.querySelectorAll('[data-testid="content-tutorial-panel__item"]')
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
    const current = panelOf(container).querySelector('[aria-current="step"][data-tutorial-step]')
    expect(current?.textContent).toContain('Open the create menu')
  })

  it('moves with Next and Previous and finishes on the last step', async () => {
    const { container, getByRole, getByTestId } = render(Page)
    getByRole('button', { name: 'Start tutorial' }).click()
    await tick()
    ;(openStep()?.querySelector('[data-testid="content-hotspot__next"]') as HTMLElement).click()
    await tick()
    expect(openStep()?.textContent).toContain('Name it')
    expect(openStep()?.textContent).toContain('Step 2 of 3')
    ;(openStep()?.querySelector('[data-testid="content-hotspot__previous"]') as HTMLElement).click()
    await tick()
    expect(openStep()?.textContent).toContain('Step 1 of 3')
    ;(openStep()?.querySelector('[data-testid="content-hotspot__next"]') as HTMLElement).click()
    await tick()
    ;(openStep()?.querySelector('[data-testid="content-hotspot__next"]') as HTMLElement).click()
    await tick()
    const finish = openStep()?.querySelector('[data-testid="content-hotspot__next"]') as HTMLElement
    expect(finish.textContent).toContain('Finish')
    finish.click()
    await tick()
    expect(panelOf(container).dataset['view']).toBe('complete')
    expect(openStep()).toBeNull()
    expect(markers()).toHaveLength(0)
    expect(document.activeElement?.textContent).toContain('Tutorial complete')
    expect(getByTestId('state').textContent).toContain('finish:first-site')
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
    ;(openStep()?.querySelector('[data-testid="content-hotspot__next"]') as HTMLElement).click()
    await tick()
    ;(openStep()?.querySelector('[data-testid="content-hotspot__next"]') as HTMLElement).click()
    await tick()
    const current = panelOf(container).querySelector('[aria-current="step"][data-tutorial-step]')
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

  it('shows the empty line with no tutorials', () => {
    const { getByText } = render(Page, { props: { list: [] } })
    expect(getByText('No tutorials yet.')).toBeTruthy()
  })

  it('renders a hotspot outside a provider as its content only', () => {
    const { container } = render(Hotspot, {
      props: { hotspotId: 'x' },
      slots: { default: '<button type="button">Plain</button>' }
    })
    expect(container.querySelector('[data-testid="content-hotspot__marker"]')).toBeNull()
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
    const marker = name.querySelector('[data-testid="content-hotspot__marker"]') as HTMLElement
    const input = name.querySelector('input') as HTMLElement
    expect(marker.getBoundingClientRect().left).toBeGreaterThan(input.getBoundingClientRect().left)
    await expectNoA11yViolations(container)
  })
})
