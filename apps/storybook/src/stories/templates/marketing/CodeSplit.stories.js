import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import CodeSplit from '@aziontech/webkit/sections/code-split'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { ACCELERATOR_SECTION, AGENTS_SECTION, SITE_SECTION } from './_sections/code-split'

const IMPORT = "import CodeSplit from '@aziontech/webkit/sections/code-split'"

const source = (section) => {
  const { body, script } = sectionMarkup('CodeSplit', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Solutions/CodeSplit',
  component: CodeSplit,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const Template = (args) => ({
  components: { SectionContainer, SectionGap, CodeSplit },
  setup() {
    return { args }
  },
  template: inColumn('<CodeSplit v-bind="args" />')
})

export const Default = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The Functions band: a two-tab code sample beside the claim, with a large secondary button and an outlined GitHub button.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}

export const Accelerator = {
  render: Template,
  args: ACCELERATOR_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The Application Accelerator band: a one-file sample, drawn with a filename bar, and one large button.'
      },
      source: { code: source(ACCELERATOR_SECTION) }
    }
  }
}

export const AcceleratorJson = {
  tags: ['!dev'],
  ...siteJsonStory(ACCELERATOR_SECTION)
}

export const Agents = {
  render: Template,
  args: AGENTS_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          "The AI Gateway band: one tab per coding agent, each with the agent's mark beside its label, and one large button."
      },
      source: { code: source(AGENTS_SECTION) }
    }
  }
}

export const AgentsJson = {
  tags: ['!dev'],
  ...siteJsonStory(AGENTS_SECTION)
}
