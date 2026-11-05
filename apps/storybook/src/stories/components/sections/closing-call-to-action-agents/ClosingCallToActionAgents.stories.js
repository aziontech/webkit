import ClosingCallToActionAgents from '@aziontech/webkit/sections/closing-call-to-action-agents'

import { sectionMarkup } from '../../../_shared/section-source'
import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/closing-call-to-action-agents'

const IMPORT =
  "import ClosingCallToActionAgents from '@aziontech/webkit/sections/closing-call-to-action-agents'"

const AUDIENCE_SUMMARY =
  "{ value: string; label: string; copy?: { label: string; text: string }; actions?: { label: string; href: string; kind?: 'secondary' | 'outlined'; trailing?: boolean }[] }"

const text = (description) => ({
  control: 'text',
  description,
  table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
})

/** @type {import('@storybook/vue3').Meta<typeof ClosingCallToActionAgents>} */
const meta = {
  title: 'Components/Sections/ClosingCallToActionAgents',
  component: ClosingCallToActionAgents,
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
          "The close for a reader who may be a person or an agent: one centred ask in the loud `primary` register under a pixelated, waving texture, with a segmented switch that picks the way in. Each audience carries an optional copyable line and its actions; under them a line types its words behind a blinking cursor, then a closing sentence, so the band keeps its height when the switch changes. It is a page section — the site places it from a `{ _id: 'closing-call-to-action-agents', props }` entry and binds `props` straight onto it — and it composes `section-module`, `call-to-action`, `segmented-button`, `input-group`, `copy-button`, `button`, `frame-box` and `texture-material`. Under reduced motion every word shows at once and nothing blinks."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    anchor: text('In-page id set on the band so a `#hash` link can scroll to it.'),
    title: text(
      'Headline of the band, rendered by the call to action as its `h2`; the band renders nothing when empty.'
    ),
    typedLead: text('Fixed opening of the typed line, before the typed word.'),
    typedWords: {
      control: 'object',
      description:
        'Words typed, held, erased and typed again in order after `typedLead`; the typed line renders only when there are words.',
      table: { category: 'props', type: { summary: 'string[]' }, defaultValue: { summary: '[]' } }
    },
    description: text('Closing sentence under the typed line, the same for every audience.'),
    audiences: {
      control: 'object',
      description:
        'The ways in, in switch order; each is `{ value, label, copy?, actions? }` and the first one opens. The switch renders only with two or more.',
      table: {
        category: 'props',
        type: { summary: 'ClosingCallToActionAgentsAudience[]', detail: AUDIENCE_SUMMARY },
        defaultValue: { summary: '[]' }
      }
    },
    audiencesAriaLabel: text('Accessible name of the audience switch.'),
    lineAriaLabel: text(
      "Accessible name of the read-only field that shows an audience's copyable line."
    )
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { ClosingCallToActionAgents },
  setup() {
    return { args }
  },
  template: '<ClosingCallToActionAgents v-bind="args" />'
})

const DEFAULT = sectionMarkup('ClosingCallToActionAgents', SITE_SECTION.props)

/** @type {import('@storybook/vue3').StoryObj<typeof ClosingCallToActionAgents>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'For humans opens on two actions; For agents swaps in the copyable prompt and the agent docs. The typed word loops under both.'
      },
      source: { code: toSfc([IMPORT, '', ...DEFAULT.script], DEFAULT.body) }
    }
  }
}
