import DocPrompt from '@aziontech/webkit/doc-prompt'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import DocPrompt from '@aziontech/webkit/doc-prompt'"

const SHORT = 'Deploy this repository to Azion and show me the edge URL when it is live.'

const LONG =
  'You are working in an Azion Web Platform project. Read the repository, identify the ' +
  'framework and its build output directory, then create the edge application, bind a ' +
  'domain to it, and deploy. Before you deploy, tell me which framework you detected and ' +
  'which build command you are about to run, and wait for me to confirm. After the deploy ' +
  'succeeds, report the edge URL and the propagation time, and leave the build artifacts ' +
  'in place so I can inspect them.'

/** @type {import('@storybook/vue3').Meta<typeof DocPrompt>} */
const meta = {
  title: 'Components/Documentation/DocPrompt',
  component: DocPrompt,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The block a documentation page reaches for when the next step is to say something to an agent. It is the one component in this layer whose content is addressed to a machine, so it is the one that ships an affordance for handing it to one: a copy control wired to the exact string on screen. It is deliberately not a code block. A prompt is a sentence, so it carries no language, no gutter and no highlighting, and it takes the mono face only to say "this is the literal text, copy it as it stands". The prompt is written once, in the default slot, which is both the visible text and what the clipboard carries.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['block', 'line'],
      description: 'Wrapping paragraph capped at four lines, or one line that scrolls sideways.',
      table: {
        category: 'props',
        type: { summary: "'block' | 'line'" },
        defaultValue: { summary: "'block'" }
      }
    },
    title: {
      control: 'text',
      description: 'What the block is, in a word or two. Renders as a titled row above the prompt.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the glyph beside the title.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'pi pi-sparkles'" }
      }
    },
    label: {
      control: 'text',
      description: 'Fallback prompt text when the default slot is empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    default: {
      control: false,
      description:
        'The prompt itself: one or more sentences of literal text. Also the string the copy control carries.',
      table: { category: 'slots' }
    }
  },
  args: {
    kind: 'block',
    title: 'AI Assistant'
  }
}

export default meta

const Template = (args) => ({
  components: { DocPrompt },
  setup() {
    return { props: args, prompt: SHORT }
  },
  template: '<DocPrompt v-bind="props">{{ prompt }}</DocPrompt>'
})

const DEFAULT_MARKUP = `<DocPrompt title="AI Assistant">
  ${SHORT}
</DocPrompt>`

/** @type {import('@storybook/vue3').StoryObj<typeof DocPrompt>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The titled shape: a row naming what the block is, above the prompt and its copy control.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const KINDS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-lg)">
  <DocPrompt kind="block" title="AI Assistant">
    ${SHORT}
  </DocPrompt>
  <DocPrompt kind="line" title="AI Assistant">
    ${SHORT} Then open the deployment log, find the cold-start figure, and summarise it for me.
  </DocPrompt>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof DocPrompt>} */
export const Kinds = {
  render: () => ({ components: { DocPrompt }, template: KINDS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The two lengths, and they want opposite things. `block` wraps at the measure; `line` refuses to wrap — a single instruction broken across three lines reads as three instructions — and scrolls sideways instead, fading whichever edge has text behind it. It is also why the copy control sits at the top of a `block` and centred against a `line`: the control is 28px and one line of the prompt face is 19.5px, so a shape that never grows downward has nothing to top-align to.'
      },
      source: { code: toSfc(IMPORT, KINDS_TEMPLATE) }
    }
  }
}

const CAPPED_TEMPLATE = `<DocPrompt title="Priming prompt">
  ${LONG}
</DocPrompt>`

/** @type {import('@storybook/vue3').StoryObj<typeof DocPrompt>} */
export const Capped = {
  render: () => ({ components: { DocPrompt }, template: CAPPED_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Past four lines a `block` prompt is capped rather than shown whole — a nine-line prompt above the step it belongs to pushes that step off the screen. The cut is a fade into the block own surface plus a Show more control, never an ellipsis: an ellipsis says text was removed, and nothing here was. The cap is measured, so a prompt that fits earns no control, and the full text is in the DOM either way.'
      },
      source: { code: toSfc(IMPORT, CAPPED_TEMPLATE) }
    }
  }
}

const BARE_TEMPLATE = `<div class="flex flex-col gap-(--spacing-sm)">
  <DocPrompt kind="line">Show me this application traffic for the last 24 hours.</DocPrompt>
  <DocPrompt kind="line">Add a rate-limit rule to the firewall in front of it.</DocPrompt>
  <DocPrompt kind="line">Roll the last deployment back and tell me what changed.</DocPrompt>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof DocPrompt>} */
export const Bare = {
  render: () => ({ components: { DocPrompt }, template: BARE_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'With no `title` the block is the bare line — the shape a "Prompts to try" list wants, where the heading above has already said what these are and a framed title on each of three one-line prompts would be three times the chrome of the content. Each prompt is exactly one line, so the copy control is centred against it rather than hung from the top of the row.'
      },
      source: { code: toSfc(IMPORT, BARE_TEMPLATE) }
    }
  }
}
