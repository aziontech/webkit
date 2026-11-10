import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import CliTerminal from '@aziontech/webkit/sections/cli-terminal'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/cli-terminal'

const IMPORT = "import CliTerminal from '@aziontech/webkit/sections/cli-terminal'"

const source = (section) => {
  const { body, script } = sectionMarkup('CliTerminal', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/CLI/CliTerminal',
  component: CliTerminal,
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
  components: { SectionContainer, SectionGap, CliTerminal },
  setup() {
    return { args }
  },
  template: inColumn('<CliTerminal v-bind="args" />')
})

export const Terminal = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The Functions band: the two-command deploy session under the headline, with the outlined install button.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const TerminalJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
