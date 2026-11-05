import ClosingCallToAction from '@aziontech/webkit/sections/closing-call-to-action'

import { sectionMarkup } from '../../../_shared/section-source'
import { toSfc } from '../../../_shared/story-source'
import { SPLIT_SECTION } from '../../../templates/marketing/_sections/closing-call-to-action'

const IMPORT = "import ClosingCallToAction from '@aziontech/webkit/sections/closing-call-to-action'"

const ACTION_SUMMARY = '{ label: string; href: string; trailing?: boolean }'

/** @type {import('@storybook/vue3').Meta<typeof ClosingCallToAction>} */
const meta = {
  title: 'Components/Sections/ClosingCallToAction',
  component: ClosingCallToAction,
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
          "The last ask at the end of a landing page, followed by a hatched closing frame with no rules of its own, because the site footer under it opens with one. It is a page section — the site places it from a `{ _id: 'closing-call-to-action', props }` entry and binds `props` straight onto it — and it composes `section-module`, `call-to-action`, `button`, `frame-box` and `texture-material`. `kind` picks the layout only: `split` sets the headline and the primary action in a raised lead cell beside an aside cell carrying the description and the secondary action, over a tall closing frame; `panel` sets the copy and its actions on one surface, over a short closing frame; `primary` is one centred ask on the canvas under a pixelated, waving texture, over a tall closing frame."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['split', 'panel', 'primary'],
      description:
        'Layout of the band: `split` is a raised lead cell beside an aside cell over a tall closing frame, `panel` one surface over a short closing frame, `primary` a centred ask under a pixelated texture over a tall closing frame.',
      table: {
        category: 'props',
        type: { summary: 'ClosingCallToActionKind' },
        defaultValue: { summary: "'split'" }
      }
    },
    anchor: {
      control: 'text',
      description: 'In-page id set on the band so a `#hash` link can scroll to it.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    eyebrow: {
      control: 'text',
      description: 'Short overline above the headline; not drawn in `primary`.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    title: {
      control: 'text',
      description:
        'Headline of the band, rendered by the call to action as its `h2`; the band renders nothing when empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    titleMuted: {
      control: 'text',
      description: 'Second line of the headline in muted ink; drawn in `split` only.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    description: {
      control: 'text',
      description:
        'Supporting sentence: in the aside cell in `split`, under the headline in `panel`.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    primaryAction: {
      control: 'object',
      description:
        'The white button of the band, under the headline in `split`; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent.',
      table: {
        category: 'props',
        type: { summary: 'ClosingCallToActionAction', detail: ACTION_SUMMARY },
        defaultValue: { summary: 'undefined' }
      }
    },
    secondaryAction: {
      control: 'object',
      description:
        'The outlined button of the band, in the aside cell in `split` and beside the primary one in `panel` and `primary`; `{ label, href, trailing? }`. Omitted when absent.',
      table: {
        category: 'props',
        type: { summary: 'ClosingCallToActionAction', detail: ACTION_SUMMARY },
        defaultValue: { summary: 'undefined' }
      }
    }
  },
  args: SPLIT_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { ClosingCallToAction },
  setup() {
    return { args }
  },
  template: '<ClosingCallToAction v-bind="args" />'
})

const DEFAULT = sectionMarkup('ClosingCallToAction', SPLIT_SECTION.props)

/** @type {import('@storybook/vue3').StoryObj<typeof ClosingCallToAction>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The `split` close the solution pages end with: the headline and the white button in the lead cell, the sentence and the outlined button in the aside cell, over the tall closing frame. Edit the props in the Controls panel — a band with no title renders nothing.'
      },
      source: { code: toSfc([IMPORT, '', ...DEFAULT.script], DEFAULT.body) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xl)">
  <ClosingCallToAction
    kind="split"
    anchor="contact"
    eyebrow="Build"
    title="Build once."
    title-muted="Run everywhere."
    description="Get a faster path to launch, lower latency, and less infrastructure overhead."
    :primary-action="{ label: 'Start for free', href: 'https://console.azion.com/signup?tck=build_cta' }"
    :secondary-action="{ label: 'Talk to a specialist', href: 'https://www.azion.com/en/contact/', trailing: true }"
  />
  <ClosingCallToAction
    kind="panel"
    title="Ready to join us?"
    description="See our open positions and find the right fit."
    :primary-action="{ label: 'See open roles', href: '/en/careers/jobs/', trailing: true }"
  />
  <ClosingCallToAction
    kind="primary"
    title="Build, run, and protect applications everywhere."
    description="Get faster launches, lower latency, and less infrastructure overhead from day one."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Docs', href: '/docs', trailing: true }"
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof ClosingCallToAction>} */
export const Types = {
  render: () => ({ components: { ClosingCallToAction }, template: TYPES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The three layouts stacked: the `split` close with two actions over the tall closing frame, the `panel` close with one action over the short closing frame, then the loud `primary` close under its pixelated texture.'
      },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}
