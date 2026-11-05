import StoryLibrary from '@aziontech/webkit/sections/story-library'

import { withStoryAssets } from '../../../_shared/site-assets'
import { toSfc } from '../../../_shared/story-source'
import { STORY_LIBRARY_SECTION } from '../../../templates/marketing/_sections/story-library'

const IMPORT = "import StoryLibrary from '@aziontech/webkit/sections/story-library'"

/** @type {import('@storybook/vue3').Meta<typeof StoryLibrary>} */
const meta = {
  title: 'Components/Sections/StoryLibrary',
  component: StoryLibrary,
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
          "Every success story of a company as one filterable library: a left-aligned title over a search field and one searchable select per facet, then a grid of story cards and a load-more button. Search and facets combine; when nothing matches, an empty state offers to clear every filter. It is a page section — the site places it from a `{ _id: 'story-library', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `input-text`, `select`, `button` and `empty-state`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    anchor: {
      control: 'text',
      description: 'In-page id set on the band so a `#hash` link can scroll to it.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    title: {
      control: 'text',
      description:
        'Headline of the band, rendered left-aligned as its `h2`; the band renders no header when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    items: {
      control: 'object',
      description:
        'The stories, in order; each is `{ key, href, client, category, description, facets? }`.',
      table: {
        category: 'props',
        type: { summary: 'StoryLibraryItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    facets: {
      control: 'object',
      description: 'The facet selects, in order; each is `{ key, label, allLabel, options }`.',
      table: {
        category: 'props',
        type: { summary: 'StoryLibraryFacet[]' },
        defaultValue: { summary: '[]' }
      }
    },
    search: {
      control: 'object',
      description:
        "The search field's `placeholder` and accessible `label`; the field is omitted when absent.",
      table: {
        category: 'props',
        type: { summary: 'StoryLibrarySearch' },
        defaultValue: { summary: 'undefined' }
      }
    },
    empty: {
      control: 'object',
      description:
        "The no-match state's `title` and the `action` label of its clear-filters button.",
      table: {
        category: 'props',
        type: { summary: 'StoryLibraryEmpty' },
        defaultValue: { summary: 'undefined' }
      }
    },
    linkLabel: {
      control: 'text',
      description: 'Read cue at the foot of each card, also the lead of its accessible name.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    moreLabel: {
      control: 'text',
      description:
        'Label of the load-more button under the grid; the button is omitted when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the list of stories.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    }
  },
  args: withStoryAssets(STORY_LIBRARY_SECTION.props)
}

export default meta

const Template = (args) => ({
  components: { StoryLibrary },
  setup() {
    return { args }
  },
  template: '<StoryLibrary v-bind="args" />'
})

const FACETS = `[
    {
      key: 'industry',
      label: 'Industry',
      allLabel: 'All industries',
      options: [
        { value: 'Media', label: 'Media' },
        { value: 'Retail', label: 'Retail' },
        { value: 'Tech', label: 'Tech' }
      ]
    },
    {
      key: 'solution',
      label: 'Solution',
      allLabel: 'All solutions',
      options: [
        { value: 'Build', label: 'Build' },
        { value: 'Deploy', label: 'Deploy' },
        { value: 'Secure', label: 'Secure' }
      ]
    }
  ]`

const DEFAULT_MARKUP = `<StoryLibrary
  anchor="cases"
  title="Companies building with Azion"
  aria-label="Success stories"
  link-label="Read story"
  more-label="Load more"
  :items="[
    {
      key: 'case-gpa',
      href: '/site/success-cases/gpa',
      client: { name: 'GPA', logo: '/marketing-components/logos/gpa-extended-reversed.svg' },
      category: 'Retail',
      description: 'Grupo Pão de Açúcar (GPA) solved a targeted DNS attack, secured 100+ critical applications in 15 days, and reduced costs by 30%.',
      facets: { industry: ['Retail'], solution: ['Secure'] }
    },
    {
      key: 'case-axur',
      href: '/site/success-cases/axur',
      client: { name: 'Axur', logo: '/marketing-components/logos/axur-extended-reversed.svg' },
      category: 'Tech',
      description: 'See how moving AI inference off managed infrastructure unlocked the fastest automatic takedown in the market.',
      facets: { industry: ['Tech'], solution: ['Build', 'Secure'] }
    },
    {
      key: 'case-exame',
      href: '/site/success-cases/exame',
      client: { name: 'Exame', logo: '/marketing-components/logos/exame-extended-reversed.svg' },
      category: 'Media',
      description: 'Faster content delivery and resilient infrastructure enabled Exame to handle large traffic spikes during major news events.',
      facets: { industry: ['Media'], solution: ['Build', 'Deploy'] }
    }
  ]"
  :facets="${FACETS}"
  :search="{ placeholder: 'Search by company or story', label: 'Search success stories' }"
  :empty="{ title: 'No stories match these filters.', action: 'View all success stories' }"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof StoryLibrary>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The library at rest: type in the search field or pick a facet to narrow the grid; when nothing matches, the empty state clears every filter.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const NO_RESULTS_TEMPLATE = `<StoryLibrary
  anchor="cases"
  title="Companies building with Azion"
  aria-label="Success stories"
  :items="[]"
  :facets="${FACETS}"
  :search="{ placeholder: 'Search by company or story', label: 'Search success stories' }"
  :empty="{ title: 'No stories match these filters.', action: 'View all success stories' }"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof StoryLibrary>} */
export const NoResults = {
  render: () => ({ components: { StoryLibrary }, template: NO_RESULTS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'No story matches: the grid gives way to the empty state and its clear-filters action.'
      },
      source: { code: toSfc(IMPORT, NO_RESULTS_TEMPLATE) }
    }
  }
}
