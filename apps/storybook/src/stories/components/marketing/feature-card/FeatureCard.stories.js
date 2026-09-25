import FeatureCard from '@aziontech/webkit/feature-card'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import FeatureCard from '@aziontech/webkit/feature-card'"

const ICON = 'pi pi-bolt'

const TITLE = 'Run code at the edge'

const DESCRIPTION =
  'Every request runs in the location closest to the user, so there is no region to choose and no round trip to origin.'

const HREF = '/products/edge-application'

/** @type {import('@storybook/vue3').Meta<typeof FeatureCard>} */
const meta = {
  title: 'Components/Marketing/FeatureCard',
  component: FeatureCard,
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
          'One feature stated as a tile: an optional icon and overline, a short headline, a sentence of explanation, and — when there is somewhere to go — the whole tile as a link. It is the repeated unit of a marketing feature grid, and it fills the height of its row, so a page can put several side by side and they line up whatever each one says.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description:
        'Headline of the tile, rendered as its `h3`. Keep it to a few words — the tile is a promise, not the proof.',
      table: {
        category: 'props',
        type: { summary: 'string', required: true }
      }
    },
    description: {
      control: 'text',
      description:
        'One sentence explaining the headline; overridden by the default slot. One long description sets the height of every tile in the row.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    eyebrow: {
      control: 'text',
      description:
        'Short uppercase overline rendered above the headline, naming the area the feature belongs to.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    icon: {
      control: 'text',
      description:
        'PrimeIcons class for the glyph above the copy, such as `pi pi-bolt`. The glyph is decorative and carries no meaning the copy does not.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    href: {
      control: 'text',
      description:
        'When set, the whole tile renders as an anchor link to this URL, and the hover and focus affordances come with it.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    default: {
      control: false,
      description: 'Description body; replaces the `description` prop when provided.',
      table: { category: 'slots' }
    }
  },
  args: {
    icon: ICON,
    eyebrow: '',
    title: TITLE,
    description: DESCRIPTION,
    href: ''
  }
}

export default meta

const Template = (args) => ({
  components: { FeatureCard },
  setup() {
    return { args }
  },
  template: '<FeatureCard v-bind="args" />'
})

const DEFAULT_MARKUP = `<FeatureCard
  icon="${ICON}"
  title="${TITLE}"
  description="${DESCRIPTION}"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FeatureCard>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A tile with nowhere to go: it renders as an `article`, is skipped by `Tab`, and has no hover affordance, because nothing would happen if you clicked it. It leads with the icon and no eyebrow — two labels over a three-word headline is more furniture than signal, so pick one. Add an `eyebrow` in the Controls panel to see the other option, or clear `description` and the sentence disappears without the tile changing shape.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const LINKED_MARKUP = `<FeatureCard
  icon="${ICON}"
  title="${TITLE}"
  description="${DESCRIPTION}"
  href="${HREF}"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FeatureCard>} */
export const Linked = {
  render: Template,
  args: {
    href: HREF
  },
  parameters: {
    docs: {
      description: {
        story:
          'The same tile with an `href`: the root element becomes an `a`, `data-linked` appears on it, and with it the only interactive states the tile has — the surface warms on hover and a focus ring appears when `Tab` reaches it. Give the whole tile the destination rather than putting a link inside it: one target is easier to hit, and the tile announces once, with its own text as the accessible name.'
      },
      source: { code: toSfc(IMPORT, LINKED_MARKUP) }
    }
  }
}
