import SectionModule from '@aziontech/webkit/section-module'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import SectionModule from '@aziontech/webkit/section-module'"

const BODY = 'text-body-md text-(--text-muted)'

/** @type {import('@storybook/vue3').Meta<typeof SectionModule>} */
const meta = {
  title: 'Components/Marketing/SectionModule',
  component: SectionModule,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'The brick of the page column: a section whose header row is divided from its body by a hairline and which is divided from the module above it by another. Stacked inside a `SectionContainer`, a run of modules reads as one continuous frame, because each module draws only its own top rule and hands its sides to the column.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Headline of the module’s header row, rendered as its `h2`.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    description: {
      control: 'text',
      description: 'Supporting sentence under the headline.',
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
      description: 'Layout of the default header row.',
      table: {
        category: 'props',
        type: { summary: "'centered' | 'left' | 'horizontal'" },
        defaultValue: { summary: "'left'" }
      }
    },
    divided: {
      control: 'boolean',
      description: 'Draw the top rule that divides this module from the one above it.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    padded: {
      control: 'boolean',
      description:
        'Pad the module’s body. Leave off for an edge-to-edge grid that owns its cell padding.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    }
  },
  args: {
    title: 'Build, run, and protect applications',
    description: 'One sentence naming what the band is about.',
    eyebrow: 'Platform',
    kind: 'left',
    divided: true,
    padded: true
  }
}

export default meta

const Template = (args) => ({
  components: { SectionModule },
  setup() {
    return { args, body: BODY }
  },
  template: `
    <SectionModule v-bind="args">
      <p class="m-0" :class="body">Everything the band has to say.</p>
    </SectionModule>
  `
})

const DEFAULT_MARKUP = `<SectionModule
  eyebrow="Platform"
  title="Build, run, and protect applications"
  description="One sentence naming what the band is about."
>
  <p class="m-0 ${BODY}">Everything the band has to say.</p>
</SectionModule>`

/** @type {import('@storybook/vue3').StoryObj<typeof SectionModule>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A header row divided from the body by one hairline. The header is a `SectionTitle`, so the module never re-implements that anatomy.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const KINDS_TEMPLATE = `<div>
  <SectionModule :divided="false" kind="left" eyebrow="Platform" title="Left">
    <p class="m-0 ${BODY}">The header sits at the start edge.</p>
  </SectionModule>
  <SectionModule kind="centered" eyebrow="Platform" title="Centered">
    <p class="m-0 ${BODY}">The header is centered.</p>
  </SectionModule>
  <SectionModule kind="horizontal" eyebrow="Platform" title="Horizontal" description="The description takes its own column.">
    <p class="m-0 ${BODY}">The headline and its description share a row.</p>
  </SectionModule>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof SectionModule>} */
export const Kinds = {
  render: () => ({ components: { SectionModule }, template: KINDS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The three header layouts, stacked — they differ only in where the copy sits.'
      },
      source: { code: toSfc(IMPORT, KINDS_TEMPLATE) }
    }
  }
}

const DIVIDED_TEMPLATE = `<div>
  <SectionModule :divided="false" title="First module">
    <p class="m-0 ${BODY}">Its top edge belongs to the hero above it, so it draws none.</p>
  </SectionModule>
  <SectionModule title="Second module">
    <p class="m-0 ${BODY}">This one draws the rule that divides the two.</p>
  </SectionModule>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof SectionModule>} */
export const Divided = {
  render: () => ({ components: { SectionModule }, template: DIVIDED_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Two modules, the first undivided. A shared edge is invisible on a single module — the stack is what proves the rule is drawn once.'
      },
      source: { code: toSfc(IMPORT, DIVIDED_TEMPLATE) }
    }
  }
}

const PADDED_TEMPLATE = `<SectionModule :padded="false" title="Edge-to-edge body">
  <div class="border-t border-(--border-default) p-(--spacing-xl) ${BODY}">
    The body owns its own padding, so the grid inside it meets the frame with no gutter.
  </div>
</SectionModule>`

/** @type {import('@storybook/vue3').StoryObj<typeof SectionModule>} */
export const Padded = {
  render: () => ({ components: { SectionModule }, template: PADDED_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'With `padded` off the body runs edge to edge, for a grid that owns its cell padding.'
      },
      source: { code: toSfc(IMPORT, PADDED_TEMPLATE) }
    }
  }
}
