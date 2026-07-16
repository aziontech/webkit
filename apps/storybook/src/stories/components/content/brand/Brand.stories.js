import Brand from '@aziontech/webkit/brand'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Brand from '@aziontech/webkit/brand'"

/** @type {import('@storybook/vue3').Meta<typeof Brand>} */
const meta = {
  title: 'Components/Content/Brand',
  component: Brand,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'The Azion brand logo, rendered as an inline SVG lockup. A single `kind` prop selects the lockup: `default` (the AZION wordmark) for standard surfaces, `reduced` (the "A" glyph) for compact headers and tight spaces, and `extended` (the AZION wordmark with the "move to the edge technologies®" tagline) for marketing-oriented layouts. It consolidates the loose `@aziontech/webkit/svg/azion/*` assets — which remain individually importable — behind one component.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['default', 'reduced', 'extended'],
      description: 'Brand lockup to render.',
      table: {
        category: 'props',
        type: { summary: "'default' | 'reduced' | 'extended'" },
        defaultValue: { summary: "'default'" }
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size token; sets the lockup height while width scales to preserve each kind’s aspect ratio.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    }
  },
  args: { kind: 'default', size: 'medium' }
}

export default meta

const Template = (args) => ({
  components: { Brand },
  setup: () => ({ props: args }),
  template: '<Brand v-bind="props" />'
})

const DEFAULT_MARKUP = '<Brand kind="default" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Brand>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'The default AZION wordmark lockup.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-wrap items-center gap-8">
  <Brand kind="default" />
  <Brand kind="reduced" />
  <Brand kind="extended" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Brand>} */
export const Types = {
  render: () => ({ components: { Brand }, template: TYPES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'All brand lockups side by side: default (AZION wordmark), reduced (the "A" glyph), and extended (wordmark with the "move to the edge technologies®" tagline).'
      },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-wrap items-center gap-8">
  <Brand kind="default" size="small" />
  <Brand kind="default" size="medium" />
  <Brand kind="default" size="large" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Brand>} */
export const Sizes = {
  render: () => ({ components: { Brand }, template: SIZES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'The lockup at each size token — small (16px), medium (24px), and large (32px) tall — with width scaling to preserve the aspect ratio.'
      },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}
