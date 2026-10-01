import Button from '@aziontech/webkit/button'
import FrameBox from '@aziontech/webkit/frame-box'
import QuoteTabs from '@aziontech/webkit/quote-tabs'
import { ref, watch } from 'vue'

import { toSfc } from '../_shared/story-source'

const IMPORT = "import QuoteTabs from '@aziontech/webkit/quote-tabs'"

const FRAME_IMPORTS = ["import FrameBox from '@aziontech/webkit/frame-box'", IMPORT]

const DEFAULT_IMPORTS = ["import Button from '@aziontech/webkit/button'", ...FRAME_IMPORTS]

const ACTIONS_MARKUP = `  <template #actions>
    <Button
      label="See success stories"
      kind="secondary"
      size="large"
      href="https://www.azion.com/en/success-case/"
      target="_blank"
      icon="pi pi-chevron-right"
      icon-position="trailing"
      animated
    />
  </template>`

const ARIA = 'Client stories'

const MAGALU = {
  logo: '/clients/color/magalu.svg',
  clientName: 'Magalu',
  text: 'Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks.',
  name: 'Allan Monteiro',
  jobTitle: 'CISO & Head of Technology at Magalu'
}

const CLIENTS = [
  MAGALU,
  {
    logo: '/clients/color/ifood.svg',
    clientName: 'iFood',
    shape: 'compact',
    text: 'iFood serves every order screen from the edge, so a lunch-hour peak reaches millions of customers without a capacity plan.',
    name: 'iFood',
    jobTitle: 'Food delivery'
  },
  {
    logo: '/clients/color/herospark.svg',
    clientName: 'HeroSpark',
    text: 'HeroSpark serves course pages and checkouts from the edge, so a launch day reaches every student without a capacity plan.',
    name: 'HeroSpark',
    jobTitle: 'Education technology'
  },
  {
    mark: 'fourbank',
    text: 'Fourbank runs its digital banking on Azion, keeping every account screen fast and protected from the first login.',
    name: 'Fourbank',
    jobTitle: 'Financial services'
  },
  {
    logo: '/clients/color/stone.svg',
    clientName: 'Stone',
    text: 'Stone keeps its payment flows answering in milliseconds for merchants across Brazil, peak day or not.',
    name: 'Stone',
    jobTitle: 'Payments'
  },
  {
    logo: '/clients/color/itau.svg',
    clientName: 'Itaú',
    shape: 'compact',
    text: 'Itaú protects its digital banking channels at the edge, before a request ever reaches its origin.',
    name: 'Itaú',
    jobTitle: 'Financial services'
  }
]

const FALLBACK_CLIENTS = [
  MAGALU,
  {
    clientName: 'Acme',
    text: 'Acme moved its storefront to the edge and now ships every release to all of its regions at once.',
    name: 'Acme',
    jobTitle: 'E-commerce'
  }
]

const escape = (value) => value.replace(/'/g, "\\'")

const field = (indent, key, value) => (value ? [`${indent}  ${key}: '${escape(value)}',`] : [])

const list = (items, indent = '    ') =>
  items
    .map((item) =>
      [
        `${indent}{`,
        ...field(indent, 'logo', item.logo),
        ...field(indent, 'mark', item.mark),
        ...field(indent, 'clientName', item.clientName),
        ...field(indent, 'shape', item.shape),
        ...field(indent, 'text', item.text),
        ...field(indent, 'name', item.name),
        `${indent}  jobTitle: '${escape(item.jobTitle)}'`,
        `${indent}}`
      ].join('\n')
    )
    .join(',\n')

/** @type {import('@storybook/vue3').Meta<typeof QuoteTabs>} */
const meta = {
  title: 'Marketing/QuoteTabs',
  component: QuoteTabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A testimonial band a reader browses by client: the selected client’s quotation featured at the top in the client’s own colours, and a wall of client cards below it that is the selector itself — clicking a card brings that client’s quotation in. It is the band a page reaches for when several customers have one strong sentence each and only one of them should be read at a time. The featured quotation is `Quote` in its `highlight` register, every card is the framed cell `LogoWall` draws, and the quotation travels sideways in the direction of the choice.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: { type: 'number', min: 0, step: 1 },
      description:
        'Index of the selected client, bound with `v-model`; left unbound the band keeps its own selection, starting on the first card.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '0' }
      }
    },
    items: {
      control: 'object',
      description:
        "The clients, in wall order; each item is `{ logo?, mark?, clientName?, shape?, text, name?, jobTitle?, photo? }` — the URL of the client's colour logo, the registry name of its one-ink mark, its name in prose, how tall its mark sits on the card, the quotation, who said it, their role and their likeness.",
      table: {
        category: 'props',
        type: { summary: 'QuoteTabsItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the wall of client cards.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    autoPlay: {
      control: 'boolean',
      description:
        'Advances to the next client on a timer; pauses under the pointer or keyboard focus, restarts its count on a selection, and never runs under reduced motion.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    autoPlayInterval: {
      control: { type: 'number', min: 1000, step: 500 },
      description: 'Milliseconds each client is held before the band advances.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '5000' }
      }
    },
    showProgress: {
      control: 'boolean',
      description:
        "Advances a hairline along the quotation panel's bottom edge while the timer runs, so a reader can see why the band is about to move.",
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description:
        'Emitted with the index of the card the reader selected, by click or by arrow key.',
      table: { category: 'events', type: { summary: 'number' } }
    }
  },
  args: {
    modelValue: 0,
    items: CLIENTS,
    ariaLabel: ARIA,
    autoPlay: true,
    autoPlayInterval: 5000,
    showProgress: true
  }
}

export default meta

const Template = (args) => ({
  components: { Button, FrameBox, QuoteTabs },
  setup() {
    const value = ref(args.modelValue ?? 0)

    watch(
      () => args.modelValue,
      (next) => {
        value.value = next ?? 0
      }
    )

    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:modelValue']?.(next)
    }

    return { args, value, onUpdate }
  },
  template: `<FrameBox><QuoteTabs v-bind="args" :model-value="value" @update:model-value="onUpdate">
${ACTIONS_MARKUP}
</QuoteTabs></FrameBox>`
})

const DEFAULT_MARKUP = `<FrameBox>
<QuoteTabs
  aria-label="${ARIA}"
  :items="[
${list(CLIENTS)}
  ]"
>
${ACTIONS_MARKUP}
</QuoteTabs>
</FrameBox>`

/** @type {import('@storybook/vue3').StoryObj<typeof QuoteTabs>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Six clients, one quotation on screen at a time. Left alone the band moves to the next client every five seconds, with an orange hairline filling along the panel’s bottom edge; pointing at the band or reaching it with `Tab` holds the quotation. Click a card, or focus the wall and use the arrow keys — `Tab` reaches only the selected card, `ArrowRight` and `ArrowLeft` move and select, wrapping at either end, and `Home` / `End` jump to the first and last client. A card later in the wall brings its quotation in from the right and sends the old one out to the left; an earlier card reverses it. The selected card sits on `--bg-selected`. Fourbank passes a registry `mark` instead of a `logo`, so it is drawn in the theme’s one ink.'
      },
      source: { code: toSfc(DEFAULT_IMPORTS, DEFAULT_MARKUP) }
    }
  }
}

const FALLBACK_MARKUP = `<FrameBox>
<QuoteTabs
  aria-label="${ARIA}"
  :items="[
${list(FALLBACK_CLIENTS)}
  ]"
/>
</FrameBox>`

/** @type {import('@storybook/vue3').StoryObj<typeof QuoteTabs>} */
export const Fallback = {
  render: () => ({ components: { FrameBox, QuoteTabs }, template: FALLBACK_MARKUP }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Acme has neither a colour `logo` nor a registered `mark`, so its card and its panel write the client’s name in heading type where the logo would sit. That is what lets a page add a client before its artwork lands — the card keeps its size either way, and adding the logo later changes nothing else at the call site.'
      },
      source: { code: toSfc(FRAME_IMPORTS, FALLBACK_MARKUP) }
    }
  }
}
