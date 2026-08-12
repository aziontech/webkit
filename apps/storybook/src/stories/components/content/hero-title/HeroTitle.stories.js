import Button from '@aziontech/webkit/button'
import HeroTitle from '@aziontech/webkit/hero-title'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import HeroTitle from '@aziontech/webkit/hero-title'"
const IMPORT_WITH_BUTTON = [IMPORT, "import Button from '@aziontech/webkit/button'"]

/** @type {import('@storybook/vue3').Meta<typeof HeroTitle>} */
const meta = {
  title: 'Components/Content/HeroTitle',
  component: HeroTitle,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
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
          'The copy block of a hero band: an optional overline, the page’s `h1` (with an optional opening phrase painted in the brand accent), a description and a row of leading calls to action, at hero scale. It is the hero counterpart of `SectionTitle` and sits above a hero backdrop rather than drawing a frame of its own.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Headline of the page, rendered as the page’s `h1`.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    highlight: {
      control: 'text',
      description:
        'Opening phrase of the headline, painted in the brand accent; reads as one sentence with `title`.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
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
    centered: {
      control: 'boolean',
      description:
        'Center the whole block — copy, headline and actions — instead of aligning it to the start.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    default: {
      control: false,
      description: 'Description body; replaces the `description` prop when provided.',
      table: { category: 'slots', type: { summary: 'VNode | string' } }
    },
    actions: {
      control: false,
      description: 'Leading call-to-action row under the copy.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    title: 'Run it everywhere.',
    highlight: '',
    description: 'Ship applications, security and observability from one platform.',
    eyebrow: 'Edge platform',
    centered: false
  }
}

export default meta

// One reactive render for the arg-driven story: every control updates the canvas live.
const Template = (args) => ({
  components: { HeroTitle },
  setup() {
    return { args }
  },
  template: '<HeroTitle v-bind="args" />'
})

const DEFAULT_MARKUP = `<HeroTitle
  eyebrow="Edge platform"
  title="Run it everywhere."
  description="Ship applications, security and observability from one platform."
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof HeroTitle>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Overline, `h1` and description, aligned to the start — the alignment that pairs with a backdrop weighted to one side.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const HIGHLIGHT_TEMPLATE = `<HeroTitle
  eyebrow="Edge platform"
  highlight="Build anything."
  title="Run it everywhere."
  description="Ship applications, security and observability from one platform."
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof HeroTitle>} */
export const Highlight = {
  render: () => ({ components: { HeroTitle }, template: HIGHLIGHT_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The opening phrase painted in the brand accent. It is a `span` inside the same `h1`, so the accessible name is still the full sentence — only the paint differs.'
      },
      source: { code: toSfc(IMPORT, HIGHLIGHT_TEMPLATE) }
    }
  }
}

const CENTERED_TEMPLATE = `<HeroTitle
  centered
  eyebrow="Edge platform"
  highlight="Build anything."
  title="Run it everywhere."
  description="Ship applications, security and observability from one platform."
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof HeroTitle>} */
export const Centered = {
  render: () => ({ components: { HeroTitle }, template: CENTERED_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The whole block centered — for a hero whose backdrop is symmetric or that leads with one statement.'
      },
      source: { code: toSfc(IMPORT, CENTERED_TEMPLATE) }
    }
  }
}

const WITH_ACTIONS_TEMPLATE = `<HeroTitle
  eyebrow="Edge platform"
  highlight="Build anything."
  title="Run it everywhere."
  description="Ship applications, security and observability from one platform."
>
  <template #actions>
    <Button label="Start for free" />
    <Button kind="outlined" label="Talk to sales" />
  </template>
</HeroTitle>`

/** @type {import('@storybook/vue3').StoryObj<typeof HeroTitle>} */
export const WithActions = {
  render: () => ({ components: { HeroTitle, Button }, template: WITH_ACTIONS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The `actions` slot owns its own responsive layout: the CTAs stack full-width below `sm` — a hero button is the page’s primary target — and return to a content-width row above it.'
      },
      source: { code: toSfc(IMPORT_WITH_BUTTON, WITH_ACTIONS_TEMPLATE) }
    }
  }
}
