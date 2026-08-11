import Button from '@aziontech/webkit/button'
import SectionTitle from '@aziontech/webkit/section-title'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import SectionTitle from '@aziontech/webkit/section-title'"
const IMPORT_WITH_BUTTON = [IMPORT, "import Button from '@aziontech/webkit/button'"]

/** @type {import('@storybook/vue3').Meta<typeof SectionTitle>} */
const meta = {
  title: 'Components/Content/SectionTitle',
  component: SectionTitle,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark'
    },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          'The framed header row that opens a page section: an optional overline, the section’s `h2`, an optional description and an optional row of actions, held inside a registration frame whose bottom rule is what divides the header from the section body. `kind` picks the layout — `centered` for a symmetric opener, `left` for a reading-order one, and `horizontal` for a wide row that sets the headline against its description.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Headline of the section, rendered as the section’s `h2`.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    description: {
      control: 'text',
      description: 'Supporting sentence under the headline; overridden by the default slot.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    eyebrow: {
      control: 'text',
      description: 'Short uppercase overline rendered above the headline.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    kind: {
      control: 'inline-radio',
      options: ['centered', 'left', 'horizontal'],
      description:
        'Layout of the header: `centered` stacks and centers the copy, `left` stacks it at the start edge, `horizontal` sets the headline and its description in two columns.',
      table: {
        category: 'props',
        type: { summary: "'centered' | 'left' | 'horizontal'" },
        defaultValue: { summary: "'centered'" }
      }
    },
    hatch: {
      control: 'boolean',
      description: 'Draw the frame’s vertical hatch texture behind the copy.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    default: {
      control: false,
      description: 'Description body; replaces the `description` prop when provided.',
      table: { category: 'slots', type: { summary: 'VNode | string' } }
    },
    actions: {
      control: false,
      description: 'Call-to-action row under the copy, aligned with the chosen `kind`.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    title: 'Everything runs at the edge',
    description: 'One platform for applications, security and observability.',
    eyebrow: 'Platform',
    kind: 'centered',
    hatch: false
  }
}

export default meta

// One reactive render for the arg-driven story: every control updates the canvas live.
const Template = (args) => ({
  components: { SectionTitle },
  setup() {
    return { args }
  },
  template: '<SectionTitle v-bind="args" />'
})

const DEFAULT_MARKUP = `<SectionTitle
  eyebrow="Platform"
  title="Everything runs at the edge"
  description="One platform for applications, security and observability."
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof SectionTitle>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Overline, headline and description centered inside the frame. The frame’s bottom rule is what divides the header from the section body, so no margin is needed below it.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const KINDS_TEMPLATE = `<div>
  <SectionTitle
    kind="centered"
    eyebrow="Centered"
    title="A symmetric section opener"
    description="Copy capped at the reading width and centered in the frame — the default."
  />
  <SectionTitle
    kind="left"
    eyebrow="Left"
    title="The same stack, at the start edge"
    description="Same anatomy, aligned to the start — for a section that reads rather than announces."
  />
  <SectionTitle
    kind="horizontal"
    eyebrow="Horizontal"
    title="Headline in the first column"
    description="The description takes the third column, with the middle one left as air. Below the md breakpoint the grid collapses and this falls back under the headline."
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof SectionTitle>} */
export const Kinds = {
  render: () => ({ components: { SectionTitle }, template: KINDS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The three layouts stacked. `centered` and `left` share one column and differ only in alignment; `horizontal` puts the headline and its description in a three-column grid, which is what makes a wide band read as one row instead of a tall stack.'
      },
      source: { code: toSfc(IMPORT, KINDS_TEMPLATE) }
    }
  }
}

const WITH_ACTIONS_TEMPLATE = `<SectionTitle
  eyebrow="Platform"
  title="Everything runs at the edge"
  description="One platform for applications, security and observability."
>
  <template #actions>
    <Button label="Start building" />
    <Button kind="outlined" label="Read the docs" />
  </template>
</SectionTitle>`

/** @type {import('@storybook/vue3').StoryObj<typeof SectionTitle>} */
export const WithActions = {
  render: () => ({
    components: { SectionTitle, Button },
    template: WITH_ACTIONS_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The `actions` slot owns its own responsive layout: the controls stack full-width below `sm` and return to a content-width row above it, centered only when the header is.'
      },
      source: { code: toSfc(IMPORT_WITH_BUTTON, WITH_ACTIONS_TEMPLATE) }
    }
  }
}

const HATCH_TEMPLATE = `<SectionTitle
  hatch
  eyebrow="Platform"
  title="Everything runs at the edge"
  description="One platform for applications, security and observability."
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof SectionTitle>} */
export const Hatch = {
  render: () => ({ components: { SectionTitle }, template: HATCH_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'The frame’s vertical hatch texture drawn behind the copy, faded toward the edges.'
      },
      source: { code: toSfc(IMPORT, HATCH_TEMPLATE) }
    }
  }
}
