import { COMPANY_CLOSING } from '../product-pages.js'
import { successCaseLink } from '../success-case-articles.js'
import { FEATURED_CASES, SUCCESS_CASES } from '../success-cases.js'
import { HOME_RECOGNITIONS } from './home.js'

const unique = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b))

const optionsOf = (values) => unique(values).map((value) => ({ value, label: value }))

const FEATURED_CELLS = FEATURED_CASES.map((story) => ({
  name: story.client.name,
  logo: story.client.logo ?? story.client.logoLight ?? '',
  client: story.client,
  brand: story.brand,
  href: successCaseLink(story).href,
  story: story.description
}))

const STORY_ITEMS = SUCCESS_CASES.map((story) => {
  const link = successCaseLink(story)
  return {
    key: story.key,
    href: link.href,
    external: link.external,
    client: story.client,
    category: story.industry,
    description: story.description,
    facets: {
      industry: [story.industry],
      solution: story.solutions,
      product: story.products
    }
  }
})

export const SUCCESS_CASES_CLOSING = COMPANY_CLOSING

export const SUCCESS_CASES_PAGE = [
  {
    section: 'Heroes',
    eyebrow: 'Customers',
    kind: 'title-band',
    title: 'Trusted by leading companies',
    actions: [
      { label: 'See customer stories', href: '#cases', kind: 'secondary' },
      { label: 'Talk to sales', href: '/site/contact', kind: 'outlined', trailing: true }
    ]
  },
  {
    section: 'ClientMosaic',
    gap: false,
    kind: 'columns',
    cells: FEATURED_CELLS,
    ariaLabel: 'Featured success stories',
    storyLabel: 'Read story'
  },
  {
    section: 'StoryLibrary',
    anchor: 'cases',
    title: 'Companies building with Azion',
    items: STORY_ITEMS,
    facets: [
      {
        key: 'industry',
        label: 'Industry',
        allLabel: 'All industries',
        options: optionsOf(SUCCESS_CASES.map((story) => story.industry))
      },
      {
        key: 'solution',
        label: 'Solution',
        allLabel: 'All solutions',
        options: optionsOf(SUCCESS_CASES.flatMap((story) => story.solutions))
      },
      {
        key: 'product',
        label: 'Product',
        allLabel: 'All products',
        options: optionsOf(SUCCESS_CASES.flatMap((story) => story.products))
      }
    ],
    search: {
      placeholder: 'Search by company or story',
      shortPlaceholder: 'Search stories',
      label: 'Search success stories'
    },
    empty: {
      title: 'No stories match these filters',
      action: 'View all success stories'
    }
  },
  {
    section: 'RecognitionMarquee',
    title: 'Recognized as a market leader',
    items: HOME_RECOGNITIONS
  },
  SUCCESS_CASES_CLOSING
]
