import ClosingCallToActionTemplates from '@aziontech/webkit/closing-call-to-action-templates'

import { sectionMarkup } from '../../../../_shared/section-source'
import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/closing-call-to-action-templates'

const IMPORT =
  "import ClosingCallToActionTemplates from '@aziontech/webkit/closing-call-to-action-templates'"

const actionType = {
  control: 'object',
  table: {
    category: 'props',
    type: {
      summary: 'ClosingCallToActionTemplatesAction',
      detail: "{ label: string; href: string; trailing?: boolean; target?: '_self' | '_blank' }"
    },
    defaultValue: { summary: 'undefined' }
  }
}

const text = (description) => ({
  control: 'text',
  description,
  table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
})

/** @type {import('@storybook/vue3').Meta<typeof ClosingCallToActionTemplates>} */
const meta = {
  title: 'Components/Marketing/Sections/ClosingCallToActionTemplates',
  component: ClosingCallToActionTemplates,
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
          "The close for a page whose last ask is to start from a template: a framed split with the ask on the left, over the pixelated, waving texture of the `primary` close, and a scrolling two-column grid of deployable template cards on the right, then the tall hatched closing frame. Below `lg` the cells stack, the ask first. It merges the `primary` close of `ClosingCallToAction` with the scrolling template wall of `TemplateGallery`. It is a page section — the site places it from a `{ _id: 'closing-call-to-action-templates', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `button`, `scroll-area`, `card-grid`, `frame-box` and `texture-material`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    anchor: text('In-page id set on the band so a `#hash` link can scroll to it.'),
    title: text(
      'Headline of the band, rendered as its `h2` and naming its region; the band renders nothing when empty.'
    ),
    description: text('Sentence under the headline.'),
    primaryAction: {
      ...actionType,
      description:
        'The white button under the copy; `{ label, href, trailing?, target? }` where `trailing` adds the chevron. Omitted when absent.'
    },
    secondaryAction: {
      ...actionType,
      description:
        'The outlined button beside the primary one; `{ label, href, trailing?, target? }`. Omitted when absent.'
    },
    templates: {
      control: 'object',
      description:
        'The template cards of the scrolling grid beside the copy, in order; each is `{ title, description?, icon?, invertInDark?, href? }`. Templates without a title are skipped and the grid is omitted when none is left.',
      table: {
        category: 'props',
        type: { summary: 'ClosingCallToActionTemplatesTemplate[]' },
        defaultValue: { summary: '[]' }
      }
    },
    deployLabel: text(
      'Label of the deploy button on each card; a card renders its button only when both this and its `href` are set.'
    ),
    templatesAriaLabel: text('Accessible name of the scrolling grid of templates.')
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { ClosingCallToActionTemplates },
  setup() {
    return { args }
  },
  template: '<ClosingCallToActionTemplates v-bind="args" />'
})

const DEFAULT = sectionMarkup('ClosingCallToActionTemplates', SITE_SECTION.props)

/** @type {import('@storybook/vue3').StoryObj<typeof ClosingCallToActionTemplates>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The ask and its two actions on the left over the waving texture, eight templates to deploy in a scrolling grid on the right, then the closing frame. Marks flagged `invertInDark` invert under the dark theme.'
      },
      source: { code: toSfc([IMPORT, '', ...DEFAULT.script], DEFAULT.body) }
    }
  }
}
