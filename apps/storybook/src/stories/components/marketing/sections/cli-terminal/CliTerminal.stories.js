import CliTerminal from '@aziontech/webkit/cli-terminal'

import { sectionMarkup } from '../../../../_shared/section-source'
import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/cli-terminal'

const IMPORT = "import CliTerminal from '@aziontech/webkit/cli-terminal'"

const DEFAULT_SOURCE = (() => {
  const { body, script } = sectionMarkup('CliTerminal', SITE_SECTION.props)
  return toSfc([IMPORT, '', ...script], body)
})()

/** @type {import('@storybook/vue3').Meta<typeof CliTerminal>} */
const meta = {
  title: 'Components/Marketing/Sections/CliTerminal',
  component: CliTerminal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          "The Azion CLI band of a product page: a horizontal section title with one outlined button, over a terminal session on the pixelate texture that runs off the frame's bottom rule, its lines entering one after another. It is a page section — the site places it from a `{ _id: 'cli-terminal', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `button`, `frame-box`, `texture-material` and `code-block`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    eyebrow: {
      control: 'text',
      description: 'Overline above the section title.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    title: {
      control: 'text',
      description:
        'Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    description: {
      control: 'text',
      description: 'Supporting sentence beside the headline.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    session: {
      control: 'text',
      description:
        'The terminal session shown under the header, commands and their output verbatim, highlighted as bash; the band renders nothing when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    copyAriaLabel: {
      control: 'text',
      description: "Accessible name of the session's copy button; empty keeps the code block's own.",
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    primaryAction: {
      control: 'object',
      description:
        'Outlined button in the section title; `{ label, href, trailing?, target? }`. Omitted when absent.',
      table: {
        category: 'props',
        type: { summary: 'CliTerminalAction' },
        defaultValue: { summary: 'undefined' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { CliTerminal },
  setup() {
    return { args }
  },
  template: '<CliTerminal v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof CliTerminal>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the Functions page places it: the two-command deploy, then a curl to the domain the CLI hands back, under the headline and its install button. Edit the props in the Controls panel — an empty `session` renders nothing at all.'
      },
      source: { code: DEFAULT_SOURCE }
    }
  }
}
