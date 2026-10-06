import QuoteCarousel from '@aziontech/webkit/quote-carousel'
import SectionTitle from '@aziontech/webkit/section-title'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import QuoteCarousel from '@aziontech/webkit/quote-carousel'"

const TITLE = "Battle-Tested by the World's Largest Banks and E-commerce Companies"

const ARIA = 'Customer testimonials'

const TESTIMONIALS = [
  {
    text: 'With Azion, we scale proprietary AI models without managing infrastructure — inspecting millions of websites daily and automating the fastest threat takedown in the market.',
    name: 'Fabio Ramos',
    jobTitle: 'CEO',
    mark: 'axur'
  },
  {
    text: 'Filing season triples our traffic in a week. Azion absorbs it without a capacity conversation, and we ship changes to the edge in minutes.',
    name: 'Vitor Torres',
    jobTitle: 'CEO',
    mark: 'contabilizei'
  },
  {
    text: 'Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks.',
    name: 'Allan Monteiro',
    jobTitle: 'CISO & Head of Technology',
    mark: 'magalu'
  },
  {
    text: 'One of the best CDN and WAF solutions I have ever used. Easy to implement and integrate, with the speed and low latency that make a real difference for our customers.',
    name: 'Julian H',
    jobTitle: 'IT OPS, SRE & SEC Manager',
    mark: 'dafiti'
  },
  {
    text: 'We block more than four million threats in six months without a single rule running on our own servers, and the security team reads one dashboard instead of five.',
    name: 'Renata Alves',
    jobTitle: 'Head of Information Security',
    mark: 'netshoes'
  }
]

const FALLBACK_TESTIMONIALS = [
  {
    text: 'Orders peak in the same forty minutes every night. Azion holds the edge steady through it, so our release window is no longer the riskiest hour of the day.',
    name: 'Camila Duarte',
    jobTitle: 'VP of Engineering',
    mark: 'iFood'
  },
  {
    text: 'Payments cannot wait on an origin round trip. Running the checks at the edge cut our approval latency in half and took a whole tier out of the stack.',
    name: 'Rafael Nunes',
    jobTitle: 'CTO',
    mark: 'Zoop'
  },
  {
    text: 'Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks.',
    name: 'Allan Monteiro',
    jobTitle: 'CISO & Head of Technology',
    mark: 'magalu'
  }
]

// The snippet has to be paste-and-run, so the array is spelled out rather than mapped.
const list = (items, indent = '    ') =>
  items
    .map((item) =>
      [
        `${indent}{`,
        `${indent}  text: '${item.text.replace(/'/g, "\\'")}',`,
        ...(item.name ? [`${indent}  name: '${item.name}',`] : []),
        `${indent}  jobTitle: '${item.jobTitle.replace(/'/g, "\\'")}',`,
        `${indent}  mark: '${item.mark}'`,
        `${indent}}`
      ].join('\n')
    )
    .join(',\n')

const RECOGNITIONS = [
  {
    text: 'Named a Leader and Fast Mover, and the only vendor whose platform meets every key criterion the report sets for a full-stack edge deployment.',
    jobTitle: 'GigaOm Radar for Full-Stack Edge Deployments v3 — May 2026',
    mark: 'gigaom'
  },
  {
    text: 'Evaluated as a Strong Performer among the edge development platforms that matter most.',
    jobTitle: 'The Forrester Wave™: Edge Development Platforms, Q1 2026 — March 2026',
    mark: 'forrester'
  },
  {
    text: 'Covered as a vendor in the market guide that defines the edge distribution platform category, in two consecutive editions.',
    jobTitle: 'Gartner Market Guide for Edge Distribution Platforms — November 2025',
    mark: 'gartner'
  },
  {
    text: 'Recognized as Latin America Company of the Year in the edge distribution platform industry.',
    jobTitle: 'Frost & Sullivan, 2026 Latin America Company of the Year — June 2026',
    mark: 'frost-and-sullivan'
  }
]

/** @type {import('@storybook/vue3').Meta<typeof QuoteCarousel>} */
const meta = {
  title: 'Components/Marketing/QuoteCarousel',
  component: QuoteCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A band of testimonials laid out as one scrollable row of flush cards — the wall form of `Quote`. The cards sit edge to edge with no gutter, each drawing its own hairline over its neighbour’s, so the row reads as one ruled strip rather than a set of floating tiles. The track snaps card by card, drags under the mouse, and fades at both ends, which is what says the strip continues past the band’s edge. A card signed by a person leads with their likeness; one signed by a firm — an analyst recognition — leads with the firm’s mark alone.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        "The testimonials rendered as cards, in order; each item is `{ text, name?, jobTitle?, photo?, mark? }` — the quotation, who said it, the rest of the attribution, their likeness and the registry name of the company's mark.",
      table: {
        category: 'props',
        type: { summary: 'QuoteCarouselItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    ariaLabel: {
      control: 'text',
      description:
        'Accessible name for the scrollable row of testimonials, announced before its contents.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    }
  },
  args: {
    items: TESTIMONIALS,
    ariaLabel: ARIA
  }
}

export default meta

const Template = (args) => ({
  components: { QuoteCarousel, SectionTitle },
  setup() {
    return { args }
  },
  template: `<div class="flex flex-col gap-(--spacing-xl) py-(--spacing-xxl)">
  <SectionTitle kind="left" :framed="false" title="${TITLE}" />
  <QuoteCarousel v-bind="args" />
</div>`
})

const DEFAULT_MARKUP = `<div class="flex flex-col gap-(--spacing-xl) py-(--spacing-xxl)">
  <SectionTitle
    kind="left"
    :framed="false"
    title="${TITLE}"
  />
  <QuoteCarousel
    aria-label="${ARIA}"
    :items="[
${list(TESTIMONIALS, '      ')}
    ]"
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof QuoteCarousel>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Five testimonials under a section headline. Drag the row, swipe it, or focus it and use the arrow keys — the track is native scrolling with CSS snap points, so every card lands flush at the start edge and nothing advances on its own. The cards carry no gutter: the band sets the track gap to zero and every card pulls a pixel left, so two hairlines land as one and the strip reads as a single ruled band. The fade at either end is one spacing step wide, so it softens the cut without ever reaching the words inside a card. On a mouse the row takes a grab cursor and drags directly; touch keeps the browser’s own momentum scrolling. Each card is a `Quote` in its `inline` register — the speaker’s likeness beside their company mark, then the quotation, then the attribution — and the mark is drawn in `currentColor`, so it takes the card’s ink and follows the theme without a second asset.'
      },
      source: {
        code: toSfc(
          [IMPORT, "import SectionTitle from '@aziontech/webkit/section-title'"],
          DEFAULT_MARKUP
        )
      }
    }
  }
}

const FALLBACK_MARKUP = `<QuoteCarousel
  aria-label="Customer testimonials"
  :items="[
${list(FALLBACK_TESTIMONIALS, '    ')}
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof QuoteCarousel>} */
export const Fallback = {
  render: (args) => ({
    components: { QuoteCarousel },
    setup() {
      return { args }
    },
    template: '<div class="py-(--spacing-xxl)"><QuoteCarousel v-bind="args" /></div>'
  }),
  args: {
    items: FALLBACK_TESTIMONIALS
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Two of these three companies have no artwork in the mark registry, so their cards write the company name in the heading scale instead of leaving a gap. That is what lets a page state the testimonials it means to state before every asset has landed — the card keeps its header row, its measure and its rhythm either way, and adding the artwork later changes nothing at the call site. None of the three speakers has a `photo`, so each likeness falls back to that person’s initials.'
      },
      source: { code: toSfc(IMPORT, FALLBACK_MARKUP) }
    }
  }
}

const RECOGNITIONS_MARKUP = `<QuoteCarousel
  aria-label="Analyst recognitions"
  :items="[
${list(RECOGNITIONS, '    ')}
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof QuoteCarousel>} */
export const Recognitions = {
  render: (args) => ({
    components: { QuoteCarousel },
    setup() {
      return { args }
    },
    template: '<div class="py-(--spacing-xxl)"><QuoteCarousel v-bind="args" /></div>'
  }),
  args: {
    items: RECOGNITIONS,
    ariaLabel: 'Analyst recognitions'
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The second register: the source is a firm, not a person. Leave `name` out and the card draws no likeness — the analyst mark leads it alone, and `jobTitle` carries the report the claim comes from. The firm is named in that line as well as by its mark, because the mark is decorative and a screen reader never reaches it. This is the shape a "Recognized as a market leader" band takes, and the reason the component is not called TestimonialCarousel: a quotation is a quotation whoever signed it.'
      },
      source: { code: toSfc(IMPORT, RECOGNITIONS_MARKUP) }
    }
  }
}
