import axurExtendedReversed from '@aziontech/webkit/assets/axur-extended-reversed.svg'
import exameExtendedReversed from '@aziontech/webkit/assets/exame-extended-reversed.svg'
import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'
import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'
import marisaExtendedReversed from '@aziontech/webkit/assets/marisa-extended-reversed.svg'
import panvelExtendedReversed from '@aziontech/webkit/assets/panvel-extended-reversed.svg'
import Button from '@aziontech/webkit/button'
import EmptyState from '@aziontech/webkit/empty-state'
import FrameBox from '@aziontech/webkit/frame-box'
import InputText from '@aziontech/webkit/input-text'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'
import Select, { SelectContent, SelectOption, SelectTrigger } from '@aziontech/webkit/select'

import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import {
  declareOptions,
  noMatches,
  searchScript,
  searchSlot,
  searchState
} from '../../_shared/select-search'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const TITLE = 'Companies building with Azion'
const READ_LABEL = 'Read story'
const MONOCHROME = 'brightness-0 [[data-theme=dark]_&]:invert'

const STORIES = [
  {
    key: 'case-gpa',
    slug: 'gpa',
    name: 'GPA',
    mark: 'gpaExtendedReversed',
    industry: 'Retail',
    solutions: ['Secure'],
    products: ['Bot Manager', 'Firewall', 'Functions', 'WAF'],
    description:
      'Grupo Pão de Açúcar (GPA) solved a targeted DNS attack, secured 100+ critical applications in 15 days, and reduced costs by 30%.'
  },
  {
    key: 'case-axur',
    slug: 'axur',
    name: 'Axur',
    mark: 'axurExtendedReversed',
    industry: 'Tech',
    solutions: ['Build', 'Secure'],
    products: ['AI Inference'],
    description:
      'See how moving AI inference off managed infrastructure unlocked the fastest automatic takedown in the market.'
  },
  {
    key: 'case-exame',
    slug: 'exame',
    name: 'Exame',
    mark: 'exameExtendedReversed',
    industry: 'Media',
    solutions: ['Build', 'Secure', 'Deploy', 'Observe'],
    products: ['Applications', 'Firewall', 'Edge DNS', 'Real-Time Metrics', 'Real-Time Events'],
    description:
      'Faster content delivery and resilient infrastructure enabled Exame to handle large traffic spikes during major news events.'
  },
  {
    key: 'case-fourbank',
    slug: 'fourbank',
    name: 'Fourbank',
    mark: 'fourbankExtendedReversed',
    industry: 'Tech',
    solutions: ['Build', 'Secure', 'Observe'],
    products: ['Applications', 'Firewall', 'Real-Time Metrics', 'Real-Time Events'],
    description:
      'FourBank strengthened the security of its financial services and increased resilience against DDoS attacks using the security capabilities of the Azion Platform.'
  },
  {
    key: 'case-panvel',
    slug: 'panvel',
    name: 'Panvel',
    mark: 'panvelExtendedReversed',
    industry: 'Retail',
    solutions: ['Build', 'Deploy'],
    products: ['Applications'],
    description:
      'Over 60% faster applications and 86% offloaded traffic allowed Panvel to scale its e-commerce using Azion’s distributed platform.'
  },
  {
    key: 'case-marisa',
    slug: 'marisa',
    name: 'Marisa',
    mark: 'marisaExtendedReversed',
    industry: 'Retail',
    solutions: ['Build', 'Deploy'],
    products: ['Application Accelerator', 'Cache', 'Image Processor'],
    description:
      'Discover how Marisa improved e-commerce performance with the Azion Platform, delivering 85% of traffic through distributed infrastructure, reducing origin costs, and supporting 96% online sales growth.'
  }
]

const optionsOf = (values) =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b)).map((value) => ({ value, label: value }))

const FACETS = [
  {
    key: 'industry',
    label: 'Industry',
    allLabel: 'All industries',
    options: optionsOf(STORIES.map((story) => story.industry))
  },
  {
    key: 'solution',
    label: 'Solution',
    allLabel: 'All solutions',
    options: optionsOf(STORIES.flatMap((story) => story.solutions))
  },
  {
    key: 'product',
    label: 'Product',
    allLabel: 'All products',
    options: optionsOf(STORIES.flatMap((story) => story.products))
  }
]

const SEARCH = {
  placeholder: 'Search by company or story',
  shortPlaceholder: 'Search stories',
  label: 'Search success stories'
}

const EMPTY = {
  title: 'No stories match these filters.',
  action: 'View all success stories'
}

const labelsOf = (facet) => facet.options.map((option) => option.label)

const SEARCH_SCRIPT = [
  "import { computed, ref } from 'vue'",
  ...FACETS.flatMap((facet) => [
    '',
    declareOptions(`${facet.key}Options`, labelsOf(facet)),
    '',
    ...searchScript(facet.key, `${facet.key}Options`)
  ])
]

const IMPORTS = [
  "import axurExtendedReversed from '@aziontech/webkit/assets/axur-extended-reversed.svg'",
  "import exameExtendedReversed from '@aziontech/webkit/assets/exame-extended-reversed.svg'",
  "import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'",
  "import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'",
  "import marisaExtendedReversed from '@aziontech/webkit/assets/marisa-extended-reversed.svg'",
  "import panvelExtendedReversed from '@aziontech/webkit/assets/panvel-extended-reversed.svg'",
  "import Button from '@aziontech/webkit/button'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import InputText from '@aziontech/webkit/input-text'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'",
  "import Select from '@aziontech/webkit/select'",
  ...SEARCH_SCRIPT
]

const EMPTY_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import InputText from '@aziontech/webkit/input-text'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'",
  "import Select from '@aziontech/webkit/select'",
  ...SEARCH_SCRIPT
]

const components = {
  Button,
  EmptyState,
  FrameBox,
  InputText,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle,
  Select,
  'Select.Content': SelectContent,
  'Select.Option': SelectOption,
  'Select.Trigger': SelectTrigger
}

const setup = () => ({
  axurExtendedReversed,
  exameExtendedReversed,
  fourbankExtendedReversed,
  gpaExtendedReversed,
  marisaExtendedReversed,
  panvelExtendedReversed,
  ...Object.assign({}, ...FACETS.map((facet) => searchState(facet.key, labelsOf(facet))))
})

const searchedSelect = (facet) => `<Select
  size="large"
  placeholder="${facet.allLabel}"
  @update:open="${facet.key}Query = ''"
>
  <Select.Trigger aria-label="${facet.label}" />
  <Select.Content>
${indent(searchSlot(facet.key, facet.label), 2)}
    <Select.Option
      v-for="option in ${facet.key}Matches"
      :key="option"
      :value="option"
    >
      {{ option }}
    </Select.Option>
${indent(noMatches(facet.key), 2)}
  </Select.Content>
</Select>`

const TOOLBAR = `<FrameBox flush borders="y">
  <div
    role="search"
    class="grid items-center gap-(--spacing-md) px-(--spacing-xl) py-(--spacing-lg) lg:grid-cols-[minmax(0,4fr)_repeat(3,minmax(0,1fr))]"
  >
    <InputText
      size="large"
      type="text"
      placeholder="${SEARCH.placeholder}"
      aria-label="${SEARCH.label}"
    >
      <template #iconLeft>
        <i class="pi pi-search text-(--text-muted)" />
      </template>
    </InputText>
${each(FACETS, searchedSelect, 2)}
  </div>
</FrameBox>`

const inLastRow = (index, columns) =>
  index >= STORIES.length - (((STORIES.length - 1) % columns) + 1)

const card = (story, index) => `<li
  ${inLastRow(index, 2) ? 'data-last-row-sm\n  ' : ''}${inLastRow(index, 3) ? 'data-last-row-lg\n  ' : ''}class="border-b border-(--border-default) last:border-b-0 sm:border-r sm:max-lg:even:border-r-0 sm:max-lg:data-last-row-sm:border-b-0 lg:nth-[3n]:border-r-0 lg:data-last-row-lg:border-b-0"
>
  <a
    href="/site/success-cases/${story.slug}"
    aria-label="${READ_LABEL}: ${story.name}"
    class="group/card flex h-full flex-col gap-(--spacing-lg) p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
  >
    <span class="flex h-8 items-center">
      <img
        :src="${story.mark}"
        alt=""
        class="${MONOCHROME} h-full w-auto max-w-36 object-contain object-left"
      />
    </span>
    <span class="text-overline-sm text-(--text-muted)">${story.industry}</span>
    <span class="text-pretty text-body-sm text-(--text-muted)">
      ${story.description}
    </span>
    <span
      aria-hidden="true"
      class="mt-auto flex items-center gap-(--spacing-xxs) pt-(--spacing-sm) text-overline-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance group-hover/card:text-(--text-default) motion-reduce:transition-none"
    >
      ${READ_LABEL}
      <i
        class="pi pi-arrow-up-right text-[length:inherit] leading-none transition-[translate] duration-moderate-02 ease-expressive-entrance group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 motion-reduce:transition-none"
      />
    </span>
  </a>
</li>`

const GRID = `<FrameBox flush borders="y" marks="bottom">
  <ul
    class="m-0 grid list-none grid-cols-1 p-0 sm:grid-cols-2 lg:grid-cols-3"
    aria-label="Success stories"
  >
${each(STORIES, card, 2)}
  </ul>
</FrameBox>`

const MORE = `<FrameBox flush borders="y" marks="bottom">
  <div class="flex justify-center p-(--spacing-xl)">
    <Button label="Load more" kind="outlined" size="large" />
  </div>
</FrameBox>`

const NO_RESULTS = `<FrameBox flush borders="y" marks="bottom">
  <EmptyState title="${EMPTY.title}" icon="pi pi-search" class="p-(--spacing-xxl)">
    <template #actions>
      <Button label="${EMPTY.action}" kind="secondary" size="large" />
    </template>
  </EmptyState>
</FrameBox>`

const band = (body) =>
  inColumn(`<SectionModule
  id="cases"
  :divided="false"
  :padded="false"
  class="scroll-mt-(--spacing-xxl)"
>
  <template #header>
    <SectionTitle kind="left" title="${TITLE}" />
  </template>

${indent(TOOLBAR, 1)}

${body}
</SectionModule>`)

const TEMPLATE = band(`${indent(GRID, 1)}

${indent(MORE, 1)}`)

const EMPTY_TEMPLATE = band(indent(NO_RESULTS, 1))

const LOGO_BASE = '/marketing-components/logos'

export const STORY_LIBRARY_SECTION = {
  _id: 'story-library',
  props: {
    anchor: 'cases',
    title: TITLE,
    items: STORIES.map((story) => ({
      key: story.key,
      href: `/site/success-cases/${story.slug}`,
      client: {
        name: story.name,
        logo: `${LOGO_BASE}/${story.slug}-extended-reversed.svg`
      },
      category: story.industry,
      description: story.description,
      facets: {
        industry: [story.industry],
        solution: story.solutions,
        product: story.products
      }
    })),
    facets: FACETS,
    search: SEARCH,
    empty: EMPTY
  }
}

const meta = {
  title: 'Templates/Marketing/Listings/StoryLibrary',
  excludeStories: ['STORY_LIBRARY_SECTION'],
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'Every success story of a company as one library, with the controls to narrow it: a left-aligned title band, a search field and one select per facet (industry, solution and product) on one row, then a grid of cards and a button that reveals the next page. Each card is one link, named by its company: the client mark in a single ink, the story’s industry as an overline, its description and a “Read story” line that nudges its arrow on hover. The grid runs one column on phones, two from `sm` and three from `lg`, and the cell rules stop under the last row. Below `lg` the three selects collapse into a filter button beside the search field, with the applied filters as chips under it; the Success Cases page (/site/success-cases) reads the facets from the query string. When nothing matches, an empty state offers to clear every filter. Built from `SectionModule`, `SectionTitle`, `FrameBox`, `InputText`, `Select`, `Button` and, when nothing matches, `EmptyState`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  ...editable(() => ({ components, setup, template: TEMPLATE })),
  parameters: {
    docs: {
      description: {
        story:
          'The library at rest, from lg up: no search and no facet applied, six stories across Retail, Tech and Media in a three-column grid, and the button that reveals the next page.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}

export const NoResults = {
  ...editable(() => ({ components, setup, template: EMPTY_TEMPLATE })),
  parameters: {
    docs: {
      description: {
        story:
          'The state when the search and the facets match no story: the grid gives way to an empty state whose action clears every filter.'
      },
      source: { code: toSfc(EMPTY_IMPORTS, EMPTY_TEMPLATE) }
    }
  }
}

export const StoryLibraryJson = {
  tags: ['!dev'],
  ...siteJsonStory(STORY_LIBRARY_SECTION)
}
