import { toSfc } from '../../_shared/story-source'
import {
  PROJECT_STATUS_COMPONENTS,
  PROJECT_STATUS_TEMPLATE,
  projectStatusScript,
  projectStatusSetup
} from './_project-status-dashboard'

const meta = {
  title: 'Templates/Platform/Dashboards/ProjectStatusDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A project status dashboard: where a project stands against its plan, for one project and sprint at a time. The page opens with a heading over a filter row of two Selects (project and sprint), then a row of four StatTiles (completion, tasks done, open tasks and overdue, each against the previous sprint), over a 12-column grid of ChartCards. A DonutChart splits every task by status (done, in progress, not started, and blocked in the danger color) beside the sprint burndown, a Chart of two Lines (actual story points left against the ideal straight line to zero) tagged with how far behind the sprint runs. The milestone timeline and the at-risk list share the next row: the timeline is an Item list with the date, title and a StatusIndicator per checkpoint, since there is no timeline component; the at-risk list is Item rows with the reason and a Tag. The owners table closes the grid, a data-driven Table with each owner’s Avatar and name, open and done counts, and overdue as a danger Tag. Every card carries the same header: title with a Hint, its tags, and a menu with Copy link and Export CSV. Built from `StatTile`, `ChartCard`, `DonutChart`, `Chart`, `Item`, `StatusIndicator`, `Table`, `Avatar`, `Tag`, `Select`, `Hint`, `Dropdown`, `EmptyState`, `Skeleton` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const story = (state) => ({
  components: PROJECT_STATUS_COMPONENTS,
  setup: projectStatusSetup(state),
  template: PROJECT_STATUS_TEMPLATE
})

export const Default = {
  render: () => story('default'),
  parameters: {
    docs: {
      description: {
        story:
          'A product launch on day eight of a ten-day sprint: more than half the tasks done, the burndown above the ideal line, the next milestone at risk, and four tasks that explain why.'
      },
      source: { code: toSfc(projectStatusScript('default'), PROJECT_STATUS_TEMPLATE) }
    }
  }
}

export const Loading = {
  render: () => story('loading'),
  parameters: {
    docs: {
      description: {
        story:
          'While the first response loads, the tiles, both charts and the table hold their place with a Skeleton, and the two lists show Skeleton rows, so the grid does not reflow when data arrives.'
      },
      source: { code: toSfc(projectStatusScript('loading'), PROJECT_STATUS_TEMPLATE) }
    }
  }
}

export const Empty = {
  render: () => story('empty'),
  parameters: {
    docs: {
      description: {
        story:
          'A project with no tasks yet. The tiles show a dash with no delta or trend, every card keeps its box with an EmptyState that says what will appear there, and the completion card carries the one setup action, Add tasks.'
      },
      source: { code: toSfc(projectStatusScript('empty'), PROJECT_STATUS_TEMPLATE) }
    }
  }
}
