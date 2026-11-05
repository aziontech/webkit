import HeroWithOpening from '@aziontech/webkit/sections/hero-with-opening'

import { toSfc } from '../../../_shared/story-source'
import { THREE_SECTION } from '../../../templates/marketing/_sections/hero-with-opening'

const IMPORT = "import HeroWithOpening from '@aziontech/webkit/sections/hero-with-opening'"

const ACTION_SUMMARY = "{ label: string; href: string; trailing?: boolean; target?: '_blank' | '_self' }"

/** @type {import('@storybook/vue3').Meta<typeof HeroWithOpening>} */
const meta = {
  title: 'Components/Sections/HeroWithOpening',
  component: HeroWithOpening,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          "The opening band of a product page followed straight by its arguments: a large centered title band with the page `h1`, overline, sentence and up to two actions, then a frame grid of three-column argument cells in the page column, closed by a hatched gap. It is a page section — the site places it from a `{ _id: 'hero-with-opening', props }` entry and binds `props` straight onto it — and it composes `hero`, `hero-title`, `button`, `section-container`, `section-module`, `frame-box`, `card-grid`, `topic` and `section-gap`. The grid starts at the hero floor with no gap, so the arguments read as the second half of the hero."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    eyebrow: {
      control: 'text',
      description: 'Short overline above the headline.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    title: {
      control: 'text',
      description:
        'Page headline, rendered as the page `h1`; the band renders nothing when empty. A title longer than 45 characters widens the headline column.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    description: {
      control: 'text',
      description: 'Sentence under the headline.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    primaryAction: {
      control: 'object',
      description:
        'First button under the headline; `{ label, href, trailing?, target? }`. Shown only with a label and a link.',
      table: {
        category: 'props',
        type: { summary: 'HeroWithOpeningAction', detail: ACTION_SUMMARY },
        defaultValue: { summary: 'undefined' }
      }
    },
    secondaryAction: {
      control: 'object',
      description:
        'Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link.',
      table: {
        category: 'props',
        type: { summary: 'HeroWithOpeningAction', detail: ACTION_SUMMARY },
        defaultValue: { summary: 'undefined' }
      }
    },
    items: {
      control: 'object',
      description:
        'The arguments in reading order, three to a row; each is `{ icon, title, description }`. The grid renders only when there are items.',
      table: {
        category: 'props',
        type: { summary: 'HeroWithOpeningItem[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: THREE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { HeroWithOpening },
  setup() {
    return { args }
  },
  template: '<HeroWithOpening v-bind="args" />'
})

const DEFAULT_MARKUP = `<HeroWithOpening
  eyebrow="Firewall"
  title="Programmable firewall for distributed applications"
  description="Protect users, applications, and networks with rules you program, from layer 3 to layer 7."
  :primary-action="{ label: 'Start for free', href: 'https://console.azion.com/signup/' }"
  :secondary-action="{ label: 'Docs', href: 'https://www.azion.com/en/documentation/', trailing: true }"
  :items="[
    {
      icon: 'pi pi-shield',
      title: 'Programmable rule engine',
      description: 'Define custom rules and behaviors across OSI layers L3-L7 to control traffic before it reaches your applications.'
    },
    {
      icon: 'pi pi-code',
      title: 'Extensible with Functions',
      description: 'Run custom JavaScript security code and marketplace integrations on Azion’s distributed infrastructure.'
    },
    {
      icon: 'pi pi-sync',
      title: 'Real-time synchronization',
      description: 'Rules sync automatically across every data center. SIEM integration keeps threat intelligence flowing.'
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof HeroWithOpening>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The Firewall opening: a long headline that widens its column, both actions, and one row of three arguments under the hero floor. Edit the props in the Controls panel — a band with no items drops the grid, and one with no title renders nothing.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
