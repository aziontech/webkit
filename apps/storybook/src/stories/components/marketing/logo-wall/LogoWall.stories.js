import LogoWall from '@aziontech/webkit/logo-wall'
import Quote from '@aziontech/webkit/quote'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import LogoWall from '@aziontech/webkit/logo-wall'"

const ASIDE_IMPORTS = [IMPORT, "import Quote from '@aziontech/webkit/quote'"]

const ARIA_LABEL = 'Customers building on Azion'

const CLIENTS = [
  ['nzn', 'NZN'],
  ['axur', 'Axur'],
  ['radware', 'Radware'],
  ['arezzo', 'Arezzo'],
  ['contabilizei', 'Contabilizei'],
  ['magalu', 'Magalu'],
  ['fourbank', 'Fourbank'],
  ['herospark', 'HeroSpark'],
  ['crefisa', 'Crefisa'],
  ['netshoes', 'Netshoes'],
  ['dafiti', 'Dafiti'],
  ['global-fashion-group', 'Global Fashion Group']
]

const ITEMS = CLIENTS.map(([key, alt]) => ({ src: `/clients/${key}.svg`, alt }))

const LINKED_ITEMS = CLIENTS.map(([key, alt]) => ({
  src: `/clients/${key}.svg`,
  alt,
  href: `https://www.azion.com/en/success-case/${key}/`
}))

// The snippet has to be paste-and-run, so the marks are spelled out rather than mapped.
const itemsMarkup = (items) =>
  items
    .map((item) => {
      const href = item.href ? `, href: '${item.href}'` : ''
      return `    { src: '${item.src}', alt: '${item.alt}'${href} }`
    })
    .join(',\n')

/** @type {import('@storybook/vue3').Meta<typeof LogoWall>} */
const meta = {
  title: 'Components/Marketing/LogoWall',
  component: LogoWall,
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
          'The customer-proof band of a marketing page: a responsive grid of company marks, optionally linked, under one accessible group name. It is deliberately a static grid rather than an auto-scrolling strip — moving content needs a pause control to meet WCAG 2.2.2, and a wall a reader can scan beats one they have to wait for.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        "The marks rendered in the grid, in order; each item is `{ src, alt, href? }` where `src` is the mark's URL, `alt` names the company, and `href` links the mark when there is somewhere to go.",
      table: {
        category: 'props',
        type: { summary: 'LogoItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the group of marks, announced instead of an unnamed list.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    }
  },
  args: {
    items: ITEMS,
    ariaLabel: ARIA_LABEL
  }
}

export default meta

const Template = (args) => ({
  components: { LogoWall },
  setup() {
    return { args }
  },
  template: '<LogoWall v-bind="args" />'
})

const DEFAULT_MARKUP = `<LogoWall
  aria-label="${ARIA_LABEL}"
  :items="[
${itemsMarkup(ITEMS)}
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof LogoWall>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Twelve real customer marks, six to a row, resting at 60% opacity so the wall reads as the evidence behind the page rather than as twelve things competing with it. These are the white single-ink files the marks ship for a dark surface, which is what the component wants: it applies no colour filter, so the mark itself has to carry its legibility — flip the toolbar to the light theme and they disappear, which is the cost of a one-theme asset rather than a bug in the band. Nothing here is focusable: without an `href` a cell is an image, and `Tab` walks straight past the wall. Empty the `items` control and the band renders nothing at all rather than an empty frame.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const LINKED_MARKUP = `<LogoWall
  aria-label="${ARIA_LABEL}"
  :items="[
${itemsMarkup(LINKED_ITEMS)}
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof LogoWall>} */
export const Linked = {
  render: Template,
  args: {
    items: LINKED_ITEMS
  },
  parameters: {
    docs: {
      description: {
        story:
          'The same wall with every mark carrying an `href` to that customer’s success case, which is the only path to the anchor states: each cell becomes a link that comes up from 60% to full on hover and takes a visible focus ring, and `Tab` now reaches all twelve in DOM order. Link a mark only when there is somewhere worth going — a wall of links to nowhere costs a reader twelve tab stops and gives nothing back.'
      },
      source: { code: toSfc(IMPORT, LINKED_MARKUP) }
    }
  }
}

const QUOTE_MARKUP = `  <template #aside>
    <Quote
      logo="/clients/herospark.svg"
      logo-alt="HeroSpark"
      text="Azion transformed our operations, reducing costs and improving performance while freeing 200+ monthly hours for strategic development."
      source="Mateus Leonardi, CTO at HeroSpark"
    />
  </template>`

const ASIDE_MARKUP = `<LogoWall
  aria-label="${ARIA_LABEL}"
  :items="[
${itemsMarkup(ITEMS)}
  ]"
>
${QUOTE_MARKUP}
</LogoWall>`

/** @type {import('@storybook/vue3').StoryObj<typeof LogoWall>} */
export const WithAside = {
  render: (args) => ({
    components: { LogoWall, Quote },
    setup() {
      return { args }
    },
    template: `<LogoWall v-bind="args">\n${QUOTE_MARKUP}\n</LogoWall>`
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Fill the `aside` slot and the band splits from `lg` up: the wall on the start edge, one of those twelve customers speaking on the end edge. The wall narrows from six columns to four so the marks still breathe in half the width — twelve fills three full rows, which is why no row is ragged. The marks stay at 60% while the quotation and its own mark sit at full strength, so the crowd reads as the evidence behind the sentence; below `lg` the two stack and the quotation follows the wall.'
      },
      source: { code: toSfc(ASIDE_IMPORTS, ASIDE_MARKUP) }
    }
  }
}
