import FrameBox from '@aziontech/webkit/frame-box'
import LogoWall from '@aziontech/webkit/logo-wall'
import Quote from '@aziontech/webkit/quote'

import { toSfc } from '../_shared/story-source'

const IMPORTS = [
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import LogoWall from '@aziontech/webkit/logo-wall'"
]

const ASIDE_IMPORTS = [...IMPORTS, "import Quote from '@aziontech/webkit/quote'"]

const ARIA_LABEL = 'Clients running on Azion'

const CLIENTS = [
  { key: 'magalu', alt: 'Magalu' },
  { key: 'ifood', alt: 'iFood', shape: 'compact' },
  { key: 'stone', alt: 'Stone' },
  { key: 'netshoes', alt: 'Netshoes' },
  { key: 'nzn', alt: 'NZN' },
  { key: 'itau', alt: 'Itaú', shape: 'compact' }
]

const markFor = ({ key, alt, shape }) => ({
  src: `/clients/color/${key}.svg`,
  alt,
  ...(shape ? { shape } : {})
})

const LINKED_ITEMS = CLIENTS.map((client) => ({
  ...markFor(client),
  href: `https://www.azion.com/en/success-case/${client.key}/`
}))

const UNLINKED_ITEMS = CLIENTS.map(markFor)

const WALL_ITEMS = [...LINKED_ITEMS, ...LINKED_ITEMS]

// The snippet has to be paste-and-run, so the marks are spelled out rather than mapped.
const itemsMarkup = (items) =>
  items
    .map((item) => {
      const href = item.href ? `, href: '${item.href}'` : ''
      const shape = item.shape ? `, shape: '${item.shape}'` : ''
      return `      { src: '${item.src}', alt: '${item.alt}'${href}${shape} }`
    })
    .join(',\n')

const wallMarkup = (items, inner = '') => {
  const open = `  <LogoWall
    aria-label="${ARIA_LABEL}"
    :items="[
${itemsMarkup(items)}
    ]"`
  const body = inner ? `${open}\n  >\n${inner}\n  </LogoWall>` : `${open}\n  />`
  return `<FrameBox>\n${body}\n</FrameBox>`
}

const QUOTE_MARKUP = `    <template #aside>
      <Quote
        kind="signed"
        logo="/clients/color/herospark.svg"
        logo-alt="HeroSpark"
        text="Azion transformed our operations, reducing costs and improving performance while freeing 200+ monthly hours for strategic development."
        name="Mateus Leonardi"
        job-title="CTO at HeroSpark"
      />
    </template>`

/** @type {import('@storybook/vue3').Meta<typeof LogoWall>} */
const meta = {
  title: 'Marketing/LogoWall',
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
          "The customer-proof band of a marketing page: a framed grid of square cells, one company mark to a cell, each one optionally linked to that customer's story, under one accessible group name. It is deliberately a static grid rather than an auto-scrolling strip — moving content needs a pause control to meet WCAG 2.2.2, and a wall a reader can scan beats one they have to wait for."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        "The marks rendered in the grid, in order; each item is `{ src, alt, href?, shape? }` where `src` is the mark's URL, `alt` names the company, `href` links the cell to that customer's story, and `shape` sets a near-square mark taller than a wordmark.",
      table: {
        category: 'props',
        type: { summary: 'LogoItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the group of marks, announced instead of an unnamed region.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    linkLabel: {
      control: 'text',
      description:
        "Words revealed under a linked mark on hover and focus, and the lead of that link's accessible name.",
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Read story'" }
      }
    },
    onItemClick: {
      action: 'item-click',
      description:
        'Fired when a linked cell is activated; `item` is the matched `items` entry. Call `event.preventDefault()` to hand the navigation to a client-side router.',
      table: {
        category: 'events',
        type: { summary: '(event: MouseEvent, item: LogoItem)' }
      }
    }
  },
  args: {
    items: LINKED_ITEMS,
    ariaLabel: ARIA_LABEL,
    linkLabel: 'Read story'
  }
}

export default meta

const Template = (args) => ({
  components: { FrameBox, LogoWall },
  setup() {
    return { args }
  },
  template: '<FrameBox><LogoWall v-bind="args" /></FrameBox>'
})

/** @type {import('@storybook/vue3').StoryObj<typeof LogoWall>} */
export const Default = {
  render: (args) => ({
    components: { FrameBox, LogoWall, Quote },
    setup() {
      return { args }
    },
    template: `<FrameBox><LogoWall v-bind="args">\n${QUOTE_MARKUP}\n</LogoWall></FrameBox>`
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Web Apps band: six linked customer marks on the start edge, one of those customers speaking on the end edge. Each cell is a `card-grid` frame cell and a whole-square link to that customer’s success case — hover or `Tab` to one and a wash rises behind it, the mark lifts, and `Read story` slides in underneath. From `lg` up the band splits and the wall sits three to a row in half the width; below it the quote follows the wall. iFood and Itaú carry `shape: \'compact\'`, which sets a near-square mark taller so it reads at the same weight as the wordmarks. The wall assumes a surrounding `frame-box` draws its outer rules, which is why the snippet includes one.'
      },
      source: { code: toSfc(ASIDE_IMPORTS, wallMarkup(LINKED_ITEMS, QUOTE_MARKUP)) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof LogoWall>} */
export const Wall = {
  render: Template,
  args: {
    items: WALL_ITEMS
  },
  parameters: {
    docs: {
      description: {
        story:
          'With nothing in `aside` the wall spans the full width, six to a row from `lg` — the same cell size as the three-column wall beside a quote, so the two layouts share one rhythm. Twelve marks fill two full rows; give the wall a multiple of six here so the last row is never ragged. Empty the `items` control and the band renders nothing rather than an empty frame.'
      },
      source: { code: toSfc(IMPORTS, wallMarkup(WALL_ITEMS)) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof LogoWall>} */
export const Unlinked = {
  render: Template,
  args: {
    items: UNLINKED_ITEMS
  },
  parameters: {
    docs: {
      description: {
        story:
          'Without an `href` a cell is only its mark: no wash, no lift, no label, and no tab stop — `Tab` walks straight past the wall. Link a mark only when there is somewhere worth going; a wall of links to nowhere costs a reader a tab stop per cell and gives nothing back.'
      },
      source: { code: toSfc(IMPORTS, wallMarkup(UNLINKED_ITEMS)) }
    }
  }
}
