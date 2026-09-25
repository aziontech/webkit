import CardGrid from '@aziontech/webkit/card-grid'
import ClientKpiQuote from '@aziontech/webkit/client-kpi-quote'
import MiniButton from '@aziontech/webkit/mini-button'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import ClientKpiQuote from '@aziontech/webkit/client-kpi-quote'"
const IMPORT_MINI_BUTTON = "import MiniButton from '@aziontech/webkit/mini-button'"
const IMPORT_CARD_GRID = "import CardGrid from '@aziontech/webkit/card-grid'"

/** @type {import('@storybook/vue3').Meta<typeof ClientKpiQuote>} */
const meta = {
  title: 'Components/Marketing/ClientKpiQuote',
  component: ClientKpiQuote,
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
          "One cell of customer proof: the client's mark, the result that client got, and the sentence stating it. It is how a marketing page signs a number — the figure leads the claim in the default ink, the rest of the line runs muted behind it, and the mark above says whose workload it came from."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    client: {
      control: 'text',
      description:
        'Registry name of the client’s brand mark, as `brand-carousel` names one; a name the registry does not carry falls back to the typographic wordmark.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    clientName: {
      control: 'text',
      description:
        'The client’s name in prose — the mark’s accessible name, and the wordmark drawn when the registry has no artwork; falls back to the registry’s own label for `client`.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    kpi: {
      control: 'text',
      description:
        'The result itself — the figure or short phrase the claim leads with, set in the default ink.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    text: {
      control: 'text',
      description:
        'The rest of the claim, set muted after the `kpi` and read as one sentence with it.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    href: {
      control: 'text',
      description:
        'When set, the whole cell renders as an anchor link to this URL and takes hover and focus states; the `actions` slot is then not rendered, since a link cannot nest another.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    ariaLabel: {
      control: 'text',
      description:
        'Accessible name of a linked cell, replacing the claim read as the link text; use it to state the destination, since a cell that is its own link shows no link label.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    mark: {
      control: false,
      description:
        'The client’s mark; replaces the registry artwork, for a page that owns the file.',
      table: { category: 'slots', type: { summary: 'slot' } }
    },
    actions: {
      control: false,
      description:
        'A trailing control under the claim, floored so a row of cells aligns on it. Not rendered when `href` makes the cell itself the link.',
      table: { category: 'slots', type: { summary: 'slot' } }
    }
  },
  args: {
    client: 'dafiti',
    clientName: 'Dafiti',
    kpi: '86% faster',
    text: 'load times, with a 45% cost reduction in data transfer.',
    href: '',
    ariaLabel: ''
  }
}

export default meta

const Template = (args) => ({
  components: { ClientKpiQuote, MiniButton },
  setup() {
    return { args }
  },
  template: `<ClientKpiQuote v-bind="args">
  <template #actions>
    <MiniButton
      label="View success story"
      icon="pi pi-angle-right"
      href="https://www.azion.com/en/success-case/dafiti/"
    />
  </template>
</ClientKpiQuote>`
})

const DEFAULT_MARKUP = `<ClientKpiQuote
  client="dafiti"
  client-name="Dafiti"
  kpi="86% faster"
  text="load times, with a 45% cost reduction in data transfer."
>
  <template #actions>
    <MiniButton
      label="View success story"
      icon="pi pi-angle-right"
      href="https://www.azion.com/en/success-case/dafiti/"
    />
  </template>
</ClientKpiQuote>`

/** @type {import('@storybook/vue3').StoryObj<typeof ClientKpiQuote>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'One client, one result. The mark is named, not carried: `client` is a name from the same registry `brand-carousel` reads, so the page states who and the registry owns the artwork. Edit `kpi` and `text` in the Controls panel — they are set in one paragraph and read as one sentence, with the figure leading in the default ink.'
      },
      source: { code: toSfc([IMPORT, IMPORT_MINI_BUTTON], DEFAULT_MARKUP) }
    }
  }
}

const ROW_TEMPLATE = `<CardGrid
  kind="divider"
  :columns="3"
>
  <ClientKpiQuote
    client="magalu"
    client-name="Magalu"
    kpi="Hundreds of applications"
    text="kept highly available behind an enhanced security perimeter."
  >
    <template #actions>
      <MiniButton
        label="View success story"
        icon="pi pi-angle-right"
        href="https://www.azion.com/en/success-case/magalu/"
      />
    </template>
  </ClientKpiQuote>
  <ClientKpiQuote
    client="renner"
    client-name="Lojas Renner"
    kpi="67% saved"
    text="on data transfer costs, through massive traffic spikes."
  >
    <template #actions>
      <MiniButton
        label="View success story"
        icon="pi pi-angle-right"
        href="https://www.azion.com/en/success-case/renner/"
      />
    </template>
  </ClientKpiQuote>
  <ClientKpiQuote
    client="netshoes"
    client-name="Netshoes"
    kpi="4M+ threats"
    text="blocked in six months, across every shopping journey."
  >
    <template #actions>
      <MiniButton
        label="View success story"
        icon="pi pi-angle-right"
        href="https://www.azion.com/en/success-case/netshoes/"
      />
    </template>
  </ClientKpiQuote>
</CardGrid>`

/** @type {import('@storybook/vue3').StoryObj<typeof ClientKpiQuote>} */
export const Row = {
  render: () => ({
    components: { CardGrid, ClientKpiQuote, MiniButton },
    template: ROW_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Three cells on a hairline `card-grid`, the shape the component is built for. Each cell paints the page canvas and the grid’s `gap-px` seams draw the rules between them, so the row needs no borders of its own. The claim grows to fill the cell and the `actions` control is floored, so the links align across claims of different lengths.'
      },
      source: { code: toSfc([IMPORT, IMPORT_CARD_GRID, IMPORT_MINI_BUTTON], ROW_TEMPLATE) }
    }
  }
}

const LINKED_TEMPLATE = `<CardGrid
  kind="divider"
  :columns="3"
>
  <ClientKpiQuote
    client="magalu"
    client-name="Magalu"
    kpi="Hundreds of applications"
    text="kept highly available behind an enhanced security perimeter."
    href="https://www.azion.com/en/success-case/magalu/"
    aria-label="Magalu success story: hundreds of applications kept highly available behind an enhanced security perimeter."
  />
  <ClientKpiQuote
    client="renner"
    client-name="Lojas Renner"
    kpi="67% saved"
    text="on data transfer costs, through massive traffic spikes."
    href="https://www.azion.com/en/success-case/renner/"
    aria-label="Lojas Renner success story: 67% saved on data transfer costs, through massive traffic spikes."
  />
  <ClientKpiQuote
    client="netshoes"
    client-name="Netshoes"
    kpi="4M+ threats"
    text="blocked in six months, across every shopping journey."
    href="https://www.azion.com/en/success-case/netshoes/"
    aria-label="Netshoes success story: 4M+ threats blocked in six months, across every shopping journey."
  />
</CardGrid>`

/** @type {import('@storybook/vue3').StoryObj<typeof ClientKpiQuote>} */
export const Linked = {
  render: () => ({ components: { CardGrid, ClientKpiQuote }, template: LINKED_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'With `href` the cell IS the link, so a grid of stories is one target and one tab stop each instead of a repeated trailing control. Hover lays the faint `--bg-mask` veil over the whole surface — the same one the system’s controls use, rather than the heavier `--bg-hover`, because a lift sized for a button reads as a highlighted block at card size; `Tab` draws the focus ring INSET, because an offset ring would be clipped by the one-pixel seam of the next cell. Nothing visible names the destination once the trailing label is gone, so each cell states it in `aria-label` — the claim alone would be read as the link text and never say where it goes.'
      },
      source: { code: toSfc([IMPORT, IMPORT_CARD_GRID], LINKED_TEMPLATE) }
    }
  }
}

const WORDMARK_TEMPLATE = `<ClientKpiQuote
  client="panvel"
  client-name="Panvel"
  kpi="60% faster"
  text="e-commerce, at 100% availability under load."
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof ClientKpiQuote>} */
export const Wordmark = {
  render: () => ({ components: { ClientKpiQuote }, template: WORDMARK_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A client the mark registry does not carry yet. The signature falls back to the name set as a typographic wordmark rather than to an empty band, so a row of cells never quietly loses a client while its artwork is pending.'
      },
      source: { code: toSfc(IMPORT, WORDMARK_TEMPLATE) }
    }
  }
}
