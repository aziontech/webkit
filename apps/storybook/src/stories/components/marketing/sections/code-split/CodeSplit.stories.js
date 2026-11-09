import CodeSplit from '@aziontech/webkit/code-split'

import { sectionMarkup } from '../../../../_shared/section-source'
import { toSfc } from '../../../../_shared/story-source'
import { ACCELERATOR_SECTION } from '../../../../templates/marketing/_sections/code-split'

const IMPORT = "import CodeSplit from '@aziontech/webkit/code-split'"

const DEFAULT_SOURCE = (() => {
  const { body, script } = sectionMarkup('CodeSplit', ACCELERATOR_SECTION.props)
  return toSfc([IMPORT, '', ...script], body)
})()

/** @type {import('@storybook/vue3').Meta<typeof CodeSplit>} */
const meta = {
  title: 'Components/Marketing/Sections/CodeSplit',
  component: CodeSplit,
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
          "The claim-beside-its-code band of a product page: a framed media split whose copy states the claim, with one or two large buttons under it, and whose media is a code sample on the pixelate texture, cut off by the frame's bottom rule. It is a page section — the site places it from a `{ _id: 'code-split', props }` entry and binds `props` straight onto it — and it composes `section-module`, `media-split`, `code-block` and `button`. One tab draws a filename bar; several draw a tab strip, and a tab that carries an `icon` shows that mark beside its label."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description:
        'Headline of the band, rendered by the media split as its `h2` and naming its region; the band renders nothing when empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    description: {
      control: 'text',
      description: 'Supporting sentence under the headline.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    codeTabs: {
      control: 'object',
      description:
        'The files of the code sample, in order; each is `{ label, value, code, language?, fileName?, fileIcon?, icon? }` where `icon` is a mark drawn beside the tab label. A tab without `code` is skipped.',
      table: {
        category: 'props',
        type: { summary: 'CodeSplitTab[]' },
        defaultValue: { summary: '[]' }
      }
    },
    copyAriaLabel: {
      control: 'text',
      description: "Accessible name of the sample's copy button; empty keeps the code block's own.",
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    primaryAction: {
      control: 'object',
      description:
        'First button under the copy; `{ label, href, trailing?, icon?, target? }`. Omitted when absent.',
      table: {
        category: 'props',
        type: { summary: 'CodeSplitAction' },
        defaultValue: { summary: 'undefined' }
      }
    },
    secondaryAction: {
      control: 'object',
      description:
        'Second, outlined button beside the first; `{ label, href, trailing?, icon?, target? }`. Omitted when absent.',
      table: {
        category: 'props',
        type: { summary: 'CodeSplitAction' },
        defaultValue: { summary: 'undefined' }
      }
    }
  },
  args: ACCELERATOR_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { CodeSplit },
  setup() {
    return { args }
  },
  template: '<CodeSplit v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof CodeSplit>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the Application Accelerator page places it: the claim and one large button beside a one-file sample, drawn with a filename bar. Edit the props in the Controls panel — add a second file to get a tab strip, or a `secondaryAction` for a second button.'
      },
      source: { code: DEFAULT_SOURCE }
    }
  }
}
