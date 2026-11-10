import FaqSection from '@aziontech/webkit/faq-section'

import { toSfc } from '../../../../_shared/story-source'
import { WITH_LINK_SECTION } from '../../../../templates/marketing/_sections/faq-section'

const IMPORT = "import FaqSection from '@aziontech/webkit/faq-section'"

/** @type {import('@storybook/vue3').Meta<typeof FaqSection>} */
const meta = {
  title: 'Components/Marketing/Sections/FaqSection',
  component: FaqSection,
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
          "The frequently asked questions band near the end of a landing page: the heading in the left column and the questions on the right, each answer closed until the reader opens it, one at a time. It is a page section — the site places it from a `{ _id: 'faq-section', props }` entry and binds `props` straight onto it — and it composes `section-module` and `faq`. An answer is a markdown string, so it can run to several paragraphs (split by a blank line) and `- ` bullet lists, and a sentence can carry a link, bold or italic text, all without a slot or `v-html`."
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
    title: {
      control: 'text',
      description: 'Headline of the band, rendered by the FAQ as its `h2` in the left column.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    items: {
      control: 'object',
      description:
        'The questions in display order; each is `{ question, answer }` where `answer` is markdown carrying paragraphs, bullet lists, links, bold and italic text.',
      table: {
        category: 'props',
        type: { summary: 'FaqSectionItem[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: WITH_LINK_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { FaqSection },
  setup() {
    return { args }
  },
  template: '<FaqSection v-bind="args" />'
})

const DEFAULT_MARKUP = `<FaqSection
  anchor="faq"
  title="Frequently asked questions"
  :items="[
    {
      question: 'What types of storefronts can I build and deploy on Azion?',
      answer: 'You can build and deploy storefronts, marketplaces, campaign pages, and supporting retail apps. Any web app or website runs on Azion. The platform also covers much of the backend, for static and dynamic workloads on a distributed architecture.'
    },
    {
      question: 'Which frameworks are compatible?',
      answer: 'Azion is compatible with modern frameworks such as Next.js, React, Vue, Astro, Angular, Nuxt, Svelte, and others, so you can reuse your current stack without a full rewrite. See the full [frameworks compatibility list](/en/documentation/products/devtools/azion-edge-runtime/frameworks-compatibility/).'
    },
    {
      question: 'How do preview deployments work?',
      answer: 'You can validate storefront changes in preview environments before release, share results across teams, and promote approved versions to production with a controlled workflow.'
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FaqSection>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The Retail page questions. The second answer carries a markdown link inside its sentence; open it to see the link rendered in place. Edit the props in the Controls panel — a band with no items renders nothing.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
