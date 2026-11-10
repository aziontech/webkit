import SiteFooter from '@aziontech/webkit/site-footer'

import { sectionMarkup } from '../../../../_shared/section-source'
import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/site-footer'

const IMPORT = "import SiteFooter from '@aziontech/webkit/site-footer'"

/** @type {import('@storybook/vue3').Meta<typeof SiteFooter>} */
const meta = {
  title: 'Components/Marketing/Sections/SiteFooter',
  component: SiteFooter,
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
          "The footer under every marketing page: the link columns, then the social row beside the status indicator and the language select. It is a page section — the site places it from a `{ _id: 'site-footer', props }` entry and binds `props` straight onto it — and it composes `footer`, `brand`, `icon-button`, `status-indicator` and `select`. From `lg` the Azion mark leads the social row; below it the mark moves to the footer's signature band, so the icons get the row to themselves."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['site', 'content'],
      description:
        'Where the footer sits: `site` closes a framed marketing page and draws its frame, `content` runs the bands full bleed.',
      table: {
        category: 'props',
        type: { summary: 'SiteFooterKind' },
        defaultValue: { summary: "'site'" }
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the footer landmark.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Footer'" }
      }
    },
    home: {
      control: 'text',
      description: 'Destination of the Azion mark; the mark is not rendered when empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    homeAriaLabel: {
      control: 'text',
      description: 'Accessible name of the Azion mark link.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Azion home'" }
      }
    },
    columns: {
      control: 'object',
      description:
        'The link columns, in order; each is `{ title, links }` where every link is `{ label, href }`.',
      table: {
        category: 'props',
        type: { summary: 'SiteFooterColumn[]' },
        defaultValue: { summary: '[]' }
      }
    },
    socials: {
      control: 'object',
      description:
        'The profile icon buttons, in order; each is `{ icon, label, href }` where `label` names the button for assistive tech. They open in a new tab.',
      table: {
        category: 'props',
        type: { summary: 'SiteFooterSocial[]' },
        defaultValue: { summary: '[]' }
      }
    },
    statusLabel: {
      control: 'text',
      description: 'Line of the system status indicator; the indicator is not rendered when empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    languages: {
      control: 'object',
      description:
        'Options of the language select, as the reader sees them; the first one is selected. The select is not rendered when empty.',
      table: {
        category: 'props',
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' }
      }
    },
    languageAriaLabel: {
      control: 'text',
      description: 'Accessible name of the language select, also its placeholder.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Language'" }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { SiteFooter },
  setup() {
    return { args }
  },
  template: '<SiteFooter v-bind="args" />'
})

const DEFAULT = sectionMarkup('SiteFooter', SITE_SECTION.props)

/** @type {import('@storybook/vue3').StoryObj<typeof SiteFooter>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The site footer with its four link columns, social row, status line and language select. Edit the props in the Controls panel — clear `home` to drop the Azion mark, `statusLabel` to drop the status line, or `languages` to drop the select.'
      },
      source: { code: toSfc([IMPORT, '', ...DEFAULT.script], DEFAULT.body) }
    }
  }
}
