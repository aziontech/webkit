import { toSfc } from '../../_shared/story-source'
import {
  blockScript,
  blockState,
  POLICY_SUMMARY,
  RESOURCE_SUMMARY,
  SERVICE_SUMMARY,
  SUMMARY_COMPONENTS
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
  title: 'Templates/Platform/Detail/DetailsPage',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The summary card that opens a resource Overview tab: a subject band with the primary link and the actions, a band of labelled facts, and a state band on the canvas fill. It comes in three shapes — a resource, a service with its domains and environments, and a policy — each with its own facts and copy. Built from `CardBox`, `Button`, `IconButton`, `Dropdown`, `Popover`, `Tag`, `StatusIndicator`, `Avatar`, `CopyButton`, `Accordion`, `Message` and `Tooltip`.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'resource summary',
        'summary card',
        'overview card',
        'resource facts',
        'status card',
        'resumo do recurso',
        'cartão de resumo',
        'visão geral',
        'details page',
        'resource details',
        'página de detalhes'
      ],
      skills: ['webkit-layout']
    }
  }
}

export default meta

export const Resource = story(
  RESOURCE_SUMMARY,
  'The resource summary for a Git-connected resource: its generated domain with Visit and the Copy URL and Settings actions, the latest deployment with its environment, the domain, status, who deployed it, repository and branch, framework, and how a push deploys it.'
)

export const Service = story(
  SERVICE_SUMMARY,
  'The service summary: the domain with its aliases in the overflow popover, the environment menu (shown below md only; from md up the breadcrumb carries the environment) and actions, the custom domains, status, service ID and creation, and the shared Deployment Settings band that expands into its policies.'
)

export const Policy = story(
  POLICY_SUMMARY,
  'The policy summary: the resource it protects, a Rules shortcut and actions, then status, environment, rule count, last edit and the enabled modules, and what the policy inspects.'
)
