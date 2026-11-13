import { toSfc } from '../../_shared/story-source'
import {
  blockScript,
  blockState,
  CLI_RESOURCE,
  getStarted,
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
  title: 'Templates/Platform/Detail/GetStarted',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The onboarding block for a resource made from the CLI: a section heading with a toggle between the CLI and GitHub Actions paths, then three numbered step cards, each with a code block for its commands. It sits under the summary on a resource Overview tab and at the end of a create wizard, on the deploy success screen. Built from `SegmentedButton`, `CardBox` and `CodeBlock`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Cli = story(
  getStarted(CLI_RESOURCE.name),
  'The CLI path: install the CLI from one of four package managers, link the project to this resource, then deploy and sync.'
)

export const Ci = story(
  getStarted(CLI_RESOURCE.name, 'actions'),
  'The GitHub Actions path: store a personal token as a repository secret, add the deploy workflow, then push to the production branch.'
)
