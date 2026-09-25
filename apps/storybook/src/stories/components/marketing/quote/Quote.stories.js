import Quote from '@aziontech/webkit/quote'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Quote from '@aziontech/webkit/quote'"

const LOGO = '/logos/magalu.svg'

const TEXT =
  'Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks.'

const NAME = 'Allan Monteiro'
const JOB_TITLE = 'CISO & Head of Technology at Magalu'

/** @type {import('@storybook/vue3').Meta<typeof Quote>} */
const meta = {
  title: 'Components/Marketing/Quote',
  component: Quote,
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
          'A single customer testimonial: the quotation, who said it, and optionally the mark of the company they said it for. It is the smallest unit of social proof on a marketing page, and it is deliberately one quote — a wall of them is a layout built from several of these, not a prop on one.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    text: {
      control: 'text',
      description:
        'The quotation itself, rendered as the `blockquote` body; overridden by the default slot. Quote verbatim — the surrounding design carries the quoting, so do not add quotation marks.',
      table: {
        category: 'props',
        type: { summary: 'string', required: true }
      }
    },
    name: {
      control: 'text',
      description:
        "Who said it — the attribution's lead, and the source of the initials fallback in `highlight`.",
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    jobTitle: {
      control: 'text',
      description:
        'Their role and company, as one line. Named `jobTitle` rather than `role`, because `role` is the ARIA attribute and a prop of that name reads as one.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    kind: {
      control: 'inline-radio',
      options: ['inline', 'signed', 'highlight'],
      description:
        'Register of the quote: `inline` is the quiet unit inside a larger band, `signed` the band-sized client sentence, `highlight` the featured one.',
      table: {
        category: 'props',
        type: { summary: "'inline' | 'signed' | 'highlight'" },
        defaultValue: { summary: "'inline'" }
      }
    },
    photo: {
      control: 'text',
      description:
        "URL of the person's likeness, drawn by `highlight`; without one that register shows their initials.",
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    mark: {
      control: false,
      description:
        'The company mark; replaces the image built from `logo`, for a mark that owns its own theming.',
      table: { category: 'slots' }
    },
    actions: {
      control: false,
      description:
        'A trailing control under the attribution, floored so a row of quotes aligns on it.',
      table: { category: 'slots' }
    },
    logo: {
      control: 'text',
      description:
        'URL of the company mark shown above the quotation. Leave it empty and the quotation leads the block instead. The mark is drawn as-is, with no filter, so give it an asset that carries its own contrast — a mark drawn in a single ink reads on one theme and disappears on the other.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    logoAlt: {
      control: 'text',
      description: 'Alternative text for the mark; falls back to `jobTitle` when empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    }
  },
  args: {
    text: TEXT,
    name: NAME,
    jobTitle: JOB_TITLE,
    logo: LOGO,
    logoAlt: '',
    kind: 'inline'
  }
}

export default meta

const Template = (args) => ({
  components: { Quote },
  setup() {
    return { args }
  },
  template: '<Quote v-bind="args" />'
})

const DEFAULT_MARKUP = `<Quote
  text="${TEXT}"
  name="${NAME}"
  job-title="${JOB_TITLE}"
  logo="${LOGO}"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof Quote>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          "One statement, its attribution, and the company mark above it. Both are real: the mark is Magalu's, served from Storybook's static folder, and the sentence is quoted from the published success case the attribution names — point `logo` at your own asset. The wordmark ships in the brand blue rather than in one ink, so it reads on both themes; `logo` is a single URL with no per-theme swap, which a white-on-dark mark would need. `logoAlt` is empty here, so the mark takes its accessible name from `jobTitle`."
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const PHOTO =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face'

const TYPES_MARKUP = `<div class="flex flex-col gap-(--spacing-xxl)">
  <Quote
    kind="inline"
    text="${TEXT}"
    name="${NAME}"
    job-title="${JOB_TITLE}"
    logo="${LOGO}"
  />
  <Quote
    kind="signed"
    text="${TEXT}"
    name="${NAME}"
    job-title="${JOB_TITLE}"
    logo="${LOGO}"
  />
  <Quote
    kind="highlight"
    text="${TEXT}"
    name="${NAME}"
    job-title="${JOB_TITLE}"
    photo="${PHOTO}"
    logo="${LOGO}"
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Quote>} */
export const Types = {
  render: () => ({ components: { Quote }, template: TYPES_MARKUP }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The three registers, on one quotation. `inline` is the quiet unit that sits inside a cell of a larger band — small mark, the attribution one muted line. `signed` is the band-sized register a product page gives a client: the quotation at heading weight, the speaker's name in the accent beside their job title. `highlight` is the featured one: the quotation largest, the speaker carried by their likeness or initials, and the mark floated on a textured plate. Every register opens on the same quotation glyph, sized to its own measure, so `text` is quoted verbatim and never carries punctuation of its own."
      },
      source: { code: toSfc(IMPORT, TYPES_MARKUP) }
    }
  }
}

const WITHOUT_LOGO_MARKUP = `<Quote
  text="${TEXT}"
  name="${NAME}"
  job-title="${JOB_TITLE}"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof Quote>} */
export const WithoutLogo = {
  render: Template,
  args: {
    logo: ''
  },
  parameters: {
    docs: {
      description: {
        story:
          'The same quote with `logo` empty: no mark is rendered and the quotation moves up to lead the block. This is the shape to reach for when the surrounding section already names the customer, or when the quote sits in a grid whose cells would otherwise repeat the same mark.'
      },
      source: { code: toSfc(IMPORT, WITHOUT_LOGO_MARKUP) }
    }
  }
}
