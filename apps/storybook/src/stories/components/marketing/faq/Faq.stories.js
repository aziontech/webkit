import Faq from '@aziontech/webkit/faq'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Faq from '@aziontech/webkit/faq'"

const ITEMS = [
  {
    value: 'pricing',
    question: 'How does pricing work?',
    answer:
      'You pay for what you use — requests, data transfer and compute time — with no seats and no upfront commitment. Usage is metered and billed monthly.'
  },
  {
    value: 'free-tier',
    question: 'Is there a free tier?',
    answer:
      'Yes. Every core product has a monthly free allowance, and billing starts only once you pass it.'
  },
  {
    value: 'migration',
    question: 'How much work is it to migrate?',
    answer:
      'Most teams move a first workload in a day. Point the domain at us, keep the origin where it is, and cut traffic over once the numbers look right.'
  },
  {
    value: 'compliance',
    question: 'Where does my data run, and are you compliant?',
    answer:
      'You choose the regions a workload and its data are allowed in. Current audit reports and certifications are available on request.'
  },
  {
    value: 'support',
    question: 'What support do I get?',
    answer:
      'Every account has documentation, community and email support. Paid plans add a 24/7 incident channel and a named engineer.'
  }
]

/** @type {import('@storybook/vue3').Meta<typeof Faq>} */
const meta = {
  title: 'Components/Marketing/Faq',
  component: Faq,
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
          "The frequently-asked-questions band of a marketing page: a framed two-column panel with the section's question on the left and the answers as a disclosure list on the right. It is the page-level band, not the disclosure primitive — it composes `accordion`, which remains the right choice anywhere a bare expandable list is wanted."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Headline of the band, rendered as its `h2` in the left column.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    items: {
      control: 'object',
      description:
        "The questions and their answers, in order; each item is `{ value, question, answer }` where `value` is the item's stable key.",
      table: {
        category: 'props',
        type: { summary: 'FaqItem[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: {
    title: 'Frequently asked questions',
    items: ITEMS
  }
}

export default meta

const Template = (args) => ({
  components: { Faq },
  setup() {
    return { args }
  },
  template: '<Faq v-bind="args" />'
})

const DEFAULT_MARKUP = `<Faq
  title="Frequently asked questions"
  :items="[
    {
      value: 'pricing',
      question: 'How does pricing work?',
      answer:
        'You pay for what you use — requests, data transfer and compute time — with no seats and no upfront commitment. Usage is metered and billed monthly.'
    },
    {
      value: 'free-tier',
      question: 'Is there a free tier?',
      answer:
        'Yes. Every core product has a monthly free allowance, and billing starts only once you pass it.'
    },
    {
      value: 'migration',
      question: 'How much work is it to migrate?',
      answer:
        'Most teams move a first workload in a day. Point the domain at us, keep the origin where it is, and cut traffic over once the numbers look right.'
    },
    {
      value: 'compliance',
      question: 'Where does my data run, and are you compliant?',
      answer:
        'You choose the regions a workload and its data are allowed in. Current audit reports and certifications are available on request.'
    },
    {
      value: 'support',
      question: 'What support do I get?',
      answer:
        'Every account has documentation, community and email support. Paid plans add a 24/7 incident channel and a named engineer.'
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof Faq>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Five objections a buyer raises before signing, each written the way the reader would ask it. Every answer starts closed, so the band opens as a scannable list of questions rather than a wall of prose. Edit `title` and `items` in the Controls panel — a band with no items renders no frame at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
