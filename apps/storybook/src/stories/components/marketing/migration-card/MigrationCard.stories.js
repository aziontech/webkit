import MigrationCard from '@aziontech/webkit/migration-card'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import MigrationCard from '@aziontech/webkit/migration-card'"

const FROM_SRC = '/logos/contoso.svg'

const FROM_ALT = 'Contoso'

const TO_SRC = '/logos/northwind.svg'

const TO_ALT = 'Northwind'

const LABEL = 'Migrated in six weeks'

const HREF = '/customers/northwind'

/** @type {import('@storybook/vue3').Meta<typeof MigrationCard>} */
const meta = {
  title: 'Components/Marketing/MigrationCard',
  component: MigrationCard,
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
          'A link card stating one completed migration: the platform a customer left, the platform they moved to, and a short label naming the customer or the result. It is the unit of a "who moved, and from where" band, and its two marks are the whole message. The card is a registration frame — a hairline box with a tick at each corner, the label riding as an overline plate on its top edge and the two marks standing on its floor.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    fromSrc: {
      control: 'text',
      description: 'URL of the mark for the platform being left.',
      table: {
        category: 'props',
        type: { summary: 'string', required: true }
      }
    },
    fromAlt: {
      control: 'text',
      description:
        'Name of the platform being left, as the mark alternative text. It is half the sentence the card reads out.',
      table: {
        category: 'props',
        type: { summary: 'string', required: true }
      }
    },
    toSrc: {
      control: 'text',
      description: 'URL of the mark for the platform moved to.',
      table: {
        category: 'props',
        type: { summary: 'string', required: true }
      }
    },
    toAlt: {
      control: 'text',
      description: 'Name of the platform moved to, as the mark alternative text.',
      table: {
        category: 'props',
        type: { summary: 'string', required: true }
      }
    },
    label: {
      control: 'text',
      description:
        'Short caption naming the customer or the outcome. Make it the outcome — a label repeating either mark alternative text is redundant to a screen reader.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    href: {
      control: 'text',
      description:
        'When set, the whole card renders as an anchor link to this URL, and the hover and focus affordances come with it.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    }
  },
  args: {
    fromSrc: FROM_SRC,
    fromAlt: FROM_ALT,
    toSrc: TO_SRC,
    toAlt: TO_ALT,
    label: LABEL,
    href: ''
  }
}

export default meta

const Template = (args) => ({
  components: { MigrationCard },
  setup() {
    return { args }
  },
  template: '<MigrationCard v-bind="args" />'
})

const DEFAULT_MARKUP = `<MigrationCard
  from-src="${FROM_SRC}"
  from-alt="${FROM_ALT}"
  to-src="${TO_SRC}"
  to-alt="${TO_ALT}"
  label="${LABEL}"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof MigrationCard>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'One move, told by its two marks: the platform left, the platform arrived at, and the outcome on the plate above them. There is no arrow between the marks — reading order carries the direction, which is why both `alt` values have to name their platform. With no `href` the card renders as an `article`, is skipped by `Tab`, and holds no hover state, because nothing would happen if you clicked it. The `label` states the result rather than naming either platform — a caption that repeats a mark alternative text reads twice to a screen reader, and axe flags it as `image-redundant-alt`. The marks render at luminosity, so a full-colour logo arrives monochrome and a row of cards reads as one set; the placeholders here are already a single neutral grey. Clear `label` in the Controls panel and the frame keeps its shape, with the two marks alone on its floor.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const LINKED_MARKUP = `<MigrationCard
  from-src="${FROM_SRC}"
  from-alt="${FROM_ALT}"
  to-src="${TO_SRC}"
  to-alt="${TO_ALT}"
  label="${LABEL}"
  href="${HREF}"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof MigrationCard>} */
export const Linked = {
  render: Template,
  args: {
    href: HREF
  },
  parameters: {
    docs: {
      description: {
        story:
          'The same card with an `href`: the root element becomes an `a`, `data-linked` appears on it, and with it the only interactive states the card has. Hover it or reach it with `Tab` and three things move together — the frame fills, the label plate inverts to the contrast pair, and a primary square fades in at the top right, the one part of the card that promises a destination. It is drawn only on a linked card, which is why the unlinked story above has an empty corner. The whole card is the target, so there is one thing to hit and it announces once, with its own text as the accessible name. Point it at a case study worth reading; a card with nowhere to go should carry no `href` at all rather than link back to the page it sits on.'
      },
      source: { code: toSfc(IMPORT, LINKED_MARKUP) }
    }
  }
}
