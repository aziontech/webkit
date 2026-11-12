import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { useHelpPanelTutorialContext } from './composables/use-help-panel-tutorial-context'
import HelpPanel, {
  HelpPanelHeader,
  HelpPanelLinks,
  HelpPanelSection,
  HelpPanelTask,
  HelpPanelTutorial
} from './index'

const Topic = defineComponent({
  components: {
    HelpPanel,
    HelpPanelHeader,
    HelpPanelSection,
    HelpPanelLinks,
    HelpPanelTutorial,
    HelpPanelTask
  },
  props: {
    loading: { type: Boolean, default: false }
  },
  template: `
    <HelpPanel aria-label="Help: Workloads" :loading="loading">
      <HelpPanelHeader
        title="Workloads"
        description="Where your domains meet the applications that answer them."
      />
      <HelpPanelSection title="What is a workload?">
        <p>A workload binds one or more domains to an application.</p>
      </HelpPanelSection>
      <HelpPanelSection title="Who can edit it?">
        <p>Anyone with the Workloads permission.</p>
      </HelpPanelSection>
      <HelpPanelLinks>
        <a href="https://www.azion.com/en/documentation/">Workloads documentation</a>
        <a href="https://www.azion.com/en/documentation/">Domains and certificates</a>
      </HelpPanelLinks>
    </HelpPanel>
  `
})

const Guide = defineComponent({
  components: {
    HelpPanel,
    HelpPanelHeader,
    HelpPanelSection,
    HelpPanelLinks,
    HelpPanelTutorial,
    HelpPanelTask
  },
  props: {
    second: { type: String, default: 'current' },
    completed: { type: Boolean, default: false },
    withActions: { type: Boolean, default: true }
  },
  template: `
    <HelpPanel aria-label="Help: Get started">
      <HelpPanelTutorial
        title="Put your first site online"
        description="Three tasks, about five minutes."
        :completed="completed"
      >
        <HelpPanelTask title="Create an application" status="complete">
          Choose a template.
        </HelpPanelTask>
        <HelpPanelTask title="Create a workload" :status="second">
          Bind your domain.
        </HelpPanelTask>
        <HelpPanelTask title="Point your DNS">Add the CNAME record.</HelpPanelTask>
        <template v-if="withActions" #actions>
          <button type="button">Continue</button>
        </template>
      </HelpPanelTutorial>
    </HelpPanel>
  `
})

const tasksOf = (view: ReturnType<typeof render>) => view.getAllByTestId('content-help-panel-task')

describe('HelpPanel', () => {
  describe('compound API', () => {
    it('attaches every part to the root for dot-notation', () => {
      expect(HelpPanel.Header).toBe(HelpPanelHeader)
      expect(HelpPanel.Section).toBe(HelpPanelSection)
      expect(HelpPanel.Links).toBe(HelpPanelLinks)
      expect(HelpPanel.Tutorial).toBe(HelpPanelTutorial)
      expect(HelpPanel.Task).toBe(HelpPanelTask)
    })
  })

  describe('render', () => {
    it('exposes the fallback data-testid', () => {
      const view = render(HelpPanel)
      expect(view.getByTestId('content-help-panel')).toBeTruthy()
    })

    it('lets a consumer override data-testid', () => {
      const view = render(HelpPanel, { attrs: { 'data-testid': 'custom-help' } })
      expect(view.getByTestId('custom-help')).toBeTruthy()
      expect(view.queryByTestId('content-help-panel')).toBeNull()
    })

    it('renders a complementary landmark named by ariaLabel', () => {
      const view = render(Topic)
      expect(view.getByRole('complementary', { name: 'Help: Workloads' })).toBeTruthy()
    })

    it('defaults the landmark name to Help', () => {
      const view = render(HelpPanel)
      expect(view.getByRole('complementary', { name: 'Help' })).toBeTruthy()
    })
  })

  describe('loading', () => {
    it('replaces the content with hidden skeleton lines and sets aria-busy', () => {
      const view = render(Topic, { props: { loading: true } })
      const root = view.getByTestId('content-help-panel')
      expect(root.getAttribute('aria-busy')).toBe('true')
      expect(root.hasAttribute('data-loading')).toBe(true)
      const placeholder = view.getByTestId('content-help-panel__loading')
      expect(placeholder.getAttribute('aria-hidden')).toBe('true')
      expect(view.queryByTestId('content-help-panel-header')).toBeNull()
      expect(view.getByRole('complementary', { name: 'Help: Workloads' })).toBeTruthy()
    })

    it('renders the content and no aria-busy when not loading', () => {
      const view = render(Topic)
      const root = view.getByTestId('content-help-panel')
      expect(root.hasAttribute('aria-busy')).toBe(false)
      expect(root.hasAttribute('data-loading')).toBe(false)
      expect(view.queryByTestId('content-help-panel__loading')).toBeNull()
    })
  })

  describe('topic', () => {
    it('renders the header heading and description', () => {
      const view = render(Topic)
      expect(view.getByRole('heading', { level: 2, name: 'Workloads' })).toBeTruthy()
      expect(
        view.getByText('Where your domains meet the applications that answer them.')
      ).toBeTruthy()
    })

    it('labels each section by its heading', () => {
      const view = render(Topic)
      expect(view.getByRole('region', { name: 'What is a workload?' })).toBeTruthy()
      expect(view.getByRole('region', { name: 'Who can edit it?' })).toBeTruthy()
      expect(view.getAllByTestId('content-help-panel-section')).toHaveLength(2)
    })

    it('renders the links under a Learn more heading', () => {
      const view = render(Topic)
      const links = view.getByRole('region', { name: 'Learn more' })
      expect(links.getAttribute('data-testid')).toBe('content-help-panel-links')
      expect(links.querySelectorAll('a')).toHaveLength(2)
    })

    it('renders no section heading when the title is empty', () => {
      const view = render(HelpPanelSection, { slots: { default: '<p>Body</p>' } })
      expect(view.queryByRole('heading')).toBeNull()
      expect(view.getByTestId('content-help-panel-section').hasAttribute('aria-labelledby')).toBe(
        false
      )
    })
  })

  describe('tutorial', () => {
    it('numbers the tasks in order and mirrors their status', async () => {
      const view = render(Guide)
      await nextTick()
      const tasks = tasksOf(view)
      expect(tasks.map((task) => task.getAttribute('data-status'))).toEqual([
        'complete',
        'current',
        'upcoming'
      ])
      expect(tasks[1]?.textContent).toContain('2')
      expect(tasks[2]?.textContent).toContain('3')
    })

    it('marks only the current task with aria-current and announces each status', async () => {
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
      const progress = view.getByTestId('content-help-panel-tutorial__progress')
      expect(progress.textContent?.trim()).toBe('1 of 3 complete')
      expect(progress.getAttribute('aria-live')).toBe('polite')

      await view.rerender({ second: 'complete' })
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
      const tutorial = view.getByTestId('content-help-panel-tutorial')
      expect(tutorial.hasAttribute('data-completed')).toBe(false)
      expect(view.queryByTestId('content-help-panel-tutorial__completed')).toBeNull()

      await view.rerender({ completed: true })
      expect(tutorial.hasAttribute('data-completed')).toBe(true)
      expect(view.getByTestId('content-help-panel-tutorial__completed').textContent).toContain(
        'Completed'
      )
    })

    it('renders the actions row when the slot has content', () => {
      const view = render(Guide)
      const actions = view.getByTestId('content-help-panel-tutorial__actions')
      expect(actions.querySelector('button')?.textContent).toBe('Continue')
    })

    it('omits the actions row when the slot is empty', () => {
      const view = render(Guide, { props: { withActions: false } })
      expect(view.queryByTestId('content-help-panel-tutorial__actions')).toBeNull()
    })
  })

  describe('a11y', () => {
    it('has no axe violations on a help topic', async () => {
      const { container } = render(Topic)
      await expectNoA11yViolations(container)
    })

    it('has no axe violations in tutorial mode', async () => {
      const { container } = render(Guide, { props: { completed: true } })
      await nextTick()
      await expectNoA11yViolations(container)
    })

    it('has no axe violations while loading', async () => {
      const { container } = render(Topic, { props: { loading: true } })
      await expectNoA11yViolations(container)
    })
  })
})

describe('useHelpPanelTutorialContext', () => {
  it('throws when resolved outside a HelpPanel.Tutorial', () => {
    const Loose = defineComponent({
      setup() {
        useHelpPanelTutorialContext()
        return () => null
      }
    })

    expect(() => render(Loose)).toThrow(/must be used within a HelpPanel.Tutorial/)
  })

  it('throws when a Task is rendered outside a Tutorial', () => {
    expect(() => render(HelpPanelTask, { props: { title: 'Loose' } })).toThrow(
      /must be used within a HelpPanel.Tutorial/
    )
  })
})

describe('HelpPanel on devices', () => {
  it('is a named container for the content of the panel it sits in', () => {
    const view = render(HelpPanel)

    expect(view.getByTestId('content-help-panel').className).toContain('@container/help-panel')
  })
})
