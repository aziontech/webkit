import { toSfc } from '../../_shared/story-source'
import {
  APPLICATION_SUMMARY,
  blockScript,
  blockState,
  FIREWALL_SUMMARY,
  SUMMARY_COMPONENTS,
  WORKLOAD_SUMMARY
} from './_summary-markup'

const story = (block, description) => ({
  render: () => ({
    components: SUMMARY_COMPONENTS,
    setup: () => blockState(block),
    template: block.template
  }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(blockScript(block), block.template) }
    }
  }
})

const meta = {
  title: 'Templates/Platform/Detail/ResourceSummary',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The summary card that opens a resource Overview tab: a subject band with the primary link and the actions, a band of labelled facts, and a state band on the canvas fill. The console draws it on the Application, Workload and Firewall Overview tabs, each with its own facts and copy. Built from `CardBox`, `Button`, `IconButton`, `Dropdown`, `Popover`, `Tag`, `StatusIndicator`, `Avatar`, `CopyButton`, `Accordion`, `Message` and `Tooltip`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Application = story(
  APPLICATION_SUMMARY,
  'The Application Overview summary for a Git-connected application: the latest deployment, its domains with the overflow popover, status, author, repository and branch, framework, and how a push deploys it.'
)

export const Workload = story(
  WORKLOAD_SUMMARY,
  'The Workload Overview summary: the domain with its aliases in the overflow popover, the environment switcher and actions, the custom domains, status, workload ID and creation, and the Deployment Settings band that expands into its policies.'
)

export const Firewall = story(
  FIREWALL_SUMMARY,
  'The Firewall Overview summary: the application it protects, a Rules Engine shortcut and actions, then status, environment, rule count, last edit and the enabled modules, and what the firewall inspects.'
)
