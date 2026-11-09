import PricingPlans from '@aziontech/webkit/sections/pricing-plans'

import { sectionMarkup } from '../../../_shared/section-source'
import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/pricing-plans'

const IMPORT = "import PricingPlans from '@aziontech/webkit/sections/pricing-plans'"

const DEFAULT_SOURCE = (() => {
  const { body, script } = sectionMarkup('PricingPlans', SITE_SECTION.props)
  return toSfc([IMPORT, '', ...script], body)
})()

/** @type {import('@storybook/vue3').Meta<typeof PricingPlans>} */
const meta = {
  title: 'Components/Sections/PricingPlans',
  component: PricingPlans,
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
          "The plan cards at the top of Pricing: a billing-period toggle over a framed row of pricing cards, each with its plan name, its price for the picked period, what it includes and one button. The recommended plan sits on a raised surface and carries a tag. It is a page section — the site places it from a `{ _id: 'pricing-plans', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `segmented-button`, `card-grid`, `card-pricing` and `button`; the picked period is local state."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    anchor: {
      control: 'text',
      description: 'In-page id set on the band so a hash link can target it.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    periods: {
      control: 'object',
      description:
        'The billing periods of the toggle, in order; each is `{ label, value }`. The toggle shows with two or more and opens on the first.',
      table: {
        category: 'props',
        type: { summary: 'PricingPlansPeriod[]' },
        defaultValue: { summary: '[]' }
      }
    },
    periodsAriaLabel: {
      control: 'text',
      description: 'Accessible name of the billing-period toggle.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    plans: {
      control: 'object',
      description:
        'The plan cards, in order; each is `{ name, highlighted?, tagLabel?, prices, featuresTitle?, features?, action? }` where a price is `{ period?, value, prefix?, suffix?, details? }`, a feature is `{ icon, label }` and `action` is `{ label, href }`; a plan without a name is dropped, and an action without a label or href is dropped.',
      table: {
        category: 'props',
        type: { summary: 'PricingPlansPlan[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { PricingPlans },
  setup() {
    return { args }
  },
  template: '<PricingPlans v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof PricingPlans>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Hobby, Pro and Enterprise with the Monthly / Annual toggle; only the Pro price changes with it. The Enterprise button points at the page contact band.'
      },
      source: { code: DEFAULT_SOURCE }
    }
  }
}
