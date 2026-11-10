import FeatureWidgets from '@aziontech/webkit/feature-widgets'

import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/feature-widgets'

const IMPORT = "import FeatureWidgets from '@aziontech/webkit/feature-widgets'"

/** @type {import('@storybook/vue3').Meta<typeof FeatureWidgets>} */
const meta = {
  title: 'Components/Marketing/Sections/FeatureWidgets',
  component: FeatureWidgets,
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
          'The "three ways to start" band of a product page: a centered section title with up to two calls to action, over a bento grid where every cell is an illustration above a bold-led sentence and one affordance — a link button or a copy button that puts a prompt on the clipboard. It is a page section — the site places it from a `{ _id: \'feature-widgets\', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `button`, `frame-box`, `bento-grid`, `illustration` and `button-highlight`.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    anchor: {
      control: 'text',
      description: 'In-page id set on the band so a `#hash` link can scroll to it.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    eyebrow: {
      control: 'text',
      description: 'Overline above the section title.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    title: {
      control: 'text',
      description:
        'Headline of the band, rendered by the centered section title as its `h2`, and the accessible name of the grid.',
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
    primaryAction: {
      control: 'object',
      description:
        'First button under the headline; `{ label, href, trailing? }`. Omitted when absent.',
      table: {
        category: 'props',
        type: { summary: 'FeatureWidgetsAction' },
        defaultValue: { summary: 'undefined' }
      }
    },
    secondaryAction: {
      control: 'object',
      description:
        'Second, outlined button under the headline; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent.',
      table: {
        category: 'props',
        type: { summary: 'FeatureWidgetsAction' },
        defaultValue: { summary: 'undefined' }
      }
    },
    columns: {
      control: 'select',
      options: [2, 3, 4],
      description: 'Column count of the grid from the medium breakpoint up: `2`, `3` or `4`.',
      table: {
        category: 'props',
        type: { summary: 'FeatureWidgetsColumns' },
        defaultValue: { summary: '3' }
      }
    },
    items: {
      control: 'object',
      description:
        'The cells, in order; each is `{ title, description, illustration, action?, copy? }` where `action` is `{ label, href }` rendered as an outlined link button and `copy` is `{ label, text }` rendered as a copy button that puts `text` on the clipboard.',
      table: {
        category: 'props',
        type: { summary: 'FeatureWidgetsItem[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { FeatureWidgets },
  setup() {
    return { args }
  },
  template: '<FeatureWidgets v-bind="args" />'
})

const DEFAULT_MARKUP = `<FeatureWidgets
  anchor="get-started"
  eyebrow="Get started"
  title="Start where you already work"
  description="The same function, three ways to ship it. Hand it to a coding agent, build it in the Console, or deploy it from the terminal."
  :primary-action="{ label: 'Start for free', href: '/signup' }"
  :secondary-action="{ label: 'Docs', href: '/site/docs', trailing: true }"
  :columns="3"
  :items="[
    {
      title: 'Ask your coding agent',
      description: 'Connect the Azion MCP servers to Claude Code, Cursor or ChatGPT, and the agent creates, instances and routes the function, with a dry run before every write.',
      illustration: 'deploy-secure-mcp-server',
      copy: {
        label: 'Copy prompt',
        text: 'Create a function that answers 401 when a request has no Authorization header.'
      }
    },
    {
      title: 'Build it in the Console',
      description: 'Choose the application it runs on, write the handler in the editor, name it, and create it. The rule that runs it is drafted for you.',
      illustration: 'build-applications',
      action: { label: 'Docs', href: '/site/docs' }
    },
    {
      title: 'Ship it from the terminal',
      description: 'azion init scaffolds from 25 presets, azion dev serves it on localhost:3333, and azion deploy puts it on a live domain.',
      illustration: 'quick-start-with-templates',
      action: { label: 'Docs', href: '/site/docs' }
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FeatureWidgets>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the Functions page places it: the overline, headline and lead centered over two calls to action, then three illustrated cells in a three-column bento grid — a copy button that puts a prompt on the clipboard for the agent path, and outlined link buttons for the Console and terminal paths. Edit the props in the Controls panel — a band with no items renders nothing at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
