import { clientPhoto } from '@aziontech/webkit/assets/client-registry'
import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'

import { successCaseArticle, successCaseLink, successCaseSlug } from '../success-case-articles.js'
import { FEATURED_CASES, SUCCESS_CASES } from '../success-cases.js'
import { HOME_RECOGNITIONS } from './home.js'

const unique = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b))

const optionsOf = (values) => unique(values).map((value) => ({ value, label: value }))

const PRODUCTS_SHOWN = 2

const productsOf = (products) =>
  [
    ...products.slice(0, PRODUCTS_SHOWN),
    ...(products.length > PRODUCTS_SHOWN ? [`+${products.length - PRODUCTS_SHOWN}`] : [])
  ].join(' · ')

const INDUSTRIES = unique(SUCCESS_CASES.map((story) => story.industry))

const FEATURED_CELLS = FEATURED_CASES.map((story, index) => {
  const photo = clientPhoto(story.client)
  return {
    name: story.client.name,
    logo: story.client.logo ?? story.client.logoLight ?? '',
    href: successCaseLink(story).href,
    story: story.description,
    span: index === 0 ? '2' : '1',
    fill: 'surface',
    ...(photo ? { photo } : {})
  }
})

const STORY_ROWS = SUCCESS_CASES.map((story) => ({
  href: successCaseLink(story).href,
  group: story.industry,
  values: {
    story: successCaseArticle(successCaseSlug(story))?.title ?? story.client.name,
    products: productsOf(story.products)
  },
  facets: {
    industry: [story.industry],
    solution: story.solutions,
    product: story.products
  }
}))

export const SUCCESS_CASES_CLOSING = {
  section: 'ClosingCallToAction',
  kind: 'split',
  eyebrow: 'Build',
  title: 'Build once.',
  titleMuted: 'Run everywhere.',
  description: 'Get a faster path to launch, lower latency, and less infrastructure overhead.',
  actions: [{ label: 'Start Free', href: '/signup', kind: 'secondary' }],
  aside: { label: 'Talk to our team', href: '/site/contact' }
}

export const SUCCESS_CASES_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-carousel',
    title: 'Trusted by Leading Companies',
    actions: [
      { label: 'See cases', href: '#cases', kind: 'secondary' },
      { label: 'Talk to a Specialist', href: '/site/contact', kind: 'outlined', trailing: true }
    ],
    carouselLabel: 'Trusted by mission-critical workloads',
    carouselMarks: CLIENT_STRIP
  },
  {
    section: 'ClientMosaic',
    cells: FEATURED_CELLS,
    ariaLabel: 'Featured success stories',
    storyLabel: 'Read story'
  },
  {
    section: 'ListingBrowser',
    anchor: 'cases',
    title: 'Organizations shaping the future of the web with us',
    columns: [
      { key: 'story', label: 'Story', grow: 3 },
      { key: 'products', label: 'Products', grow: 2 }
    ],
    rows: STORY_ROWS,
    groups: INDUSTRIES,
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
      placeholder: 'Search by company or product',
      shortPlaceholder: 'Search stories',
      label: 'Search success stories'
    },
    empty: {
      title: 'No results found for these applied filters.',
      description: 'Try another industry, solution or product.',
      action: 'View all success stories'
    }
  },
  {
    section: 'RecognitionMarquee',
    title: 'Recognized as a Market Leader',
    items: HOME_RECOGNITIONS
  },
  SUCCESS_CASES_CLOSING
]
