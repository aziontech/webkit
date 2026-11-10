import SiteNav from '@aziontech/webkit/sections/site-nav'

import { sectionMarkup } from '../../../_shared/section-source'
import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/site-nav'

const IMPORT = "import SiteNav from '@aziontech/webkit/sections/site-nav'"

const LINK_SUMMARY = '{ label: string; href: string }'

/** @type {import('@storybook/vue3').Meta<typeof SiteNav>} */
const meta = {
  title: 'Components/Sections/SiteNav',
  component: SiteNav,
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
          "The marketing site's own navigation: a sticky bar with the Azion mark, the mega-menu triggers and plain links, and the contact, login and sign-up actions, plus the sheet that carries the same tree below `xl`. It is a page section — the site places it from a `{ _id: 'site-nav', props }` entry and binds `props` straight onto it — and it composes `global-header`, `brand`, `navigation-menu`, `icon-button`, `button`, `drawer`, `panel-header`, `panel-footer`, `scroll-area` and `menu`. Each mega-menu lists its panel as columns of groups, and the sheet's drill-down tree is projected from the same menus, so an entry added to a panel is in both. The open state of the sheet, its drill path and the bar's inline inset are local state."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    home: {
      control: 'text',
      description: 'Where the Azion mark links.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'/'" } }
    },
    menus: {
      control: 'object',
      description:
        'The mega-menus, in bar order; each is `{ value, label, columns }` where `columns` is an array of columns, each holding groups of `{ label, href?, items }` and each item `{ label, description?, href?, icon? }`.',
      table: { category: 'props', type: { summary: 'SiteNavMenu[]' } }
    },
    links: {
      control: 'object',
      description: 'Bar entries that open no panel, after the menus; each is `{ label, href }`.',
      table: {
        category: 'props',
        type: { summary: 'SiteNavLink[]', detail: LINK_SUMMARY },
        defaultValue: { summary: '[]' }
      }
    },
    contact: {
      control: 'object',
      description:
        "Contact link set in the bar from `xl` up and last in the sheet's tree; `{ label, href }`.",
      table: {
        category: 'props',
        type: { summary: 'SiteNavLink', detail: LINK_SUMMARY },
        defaultValue: { summary: 'undefined' }
      }
    },
    primaryAction: {
      control: 'object',
      description: 'The sign-up button, filled, in the bar and in the sheet footer; `{ label, href }`.',
      table: {
        category: 'props',
        type: { summary: 'SiteNavLink', detail: LINK_SUMMARY },
        defaultValue: { summary: 'undefined' }
      }
    },
    secondaryAction: {
      control: 'object',
      description: 'The login button beside it, in the bar and in the sheet footer; `{ label, href }`.',
      table: {
        category: 'props',
        type: { summary: 'SiteNavLink', detail: LINK_SUMMARY },
        defaultValue: { summary: 'undefined' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { SiteNav },
  setup() {
    return { args }
  },
  template: '<SiteNav v-bind="args" />'
})

const { body: DEFAULT_MARKUP, script: DEFAULT_SCRIPT } = sectionMarkup('SiteNav', SITE_SECTION.props)

/** @type {import('@storybook/vue3').StoryObj<typeof SiteNav>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          "The site's navigation with its four mega-menus, the Pricing link and the account actions. Widen past `xl` to see the menus in the bar; below it, open the sheet with the menu button."
      },
      source: { code: toSfc([IMPORT, '', ...DEFAULT_SCRIPT], DEFAULT_MARKUP) }
    }
  }
}
