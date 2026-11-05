const LOGO_BASE = '/marketing-components/logos'

const STORIES = [
  {
    slug: 'gpa',
    name: 'GPA',
    industry: 'Retail',
    solutions: ['Secure'],
    products: ['Bot Manager', 'Firewall', 'Functions', 'WAF'],
    description:
      'Grupo Pão de Açúcar (GPA) solved a targeted DNS attack, secured 100+ critical applications in 15 days, and reduced costs by 30%.'
  },
  {
    slug: 'axur',
    name: 'Axur',
    industry: 'Tech',
    solutions: ['Build', 'Secure'],
    products: ['AI Inference'],
    description:
      'See how moving AI inference off managed infrastructure unlocked the fastest automatic takedown in the market.'
  },
  {
    slug: 'exame',
    name: 'Exame',
    industry: 'Media',
    solutions: ['Build', 'Secure', 'Deploy', 'Observe'],
    products: ['Applications', 'Firewall', 'Edge DNS', 'Real-Time Metrics', 'Real-Time Events'],
    description:
      'Faster content delivery and resilient infrastructure enabled Exame to handle large traffic spikes during major news events.'
  },
  {
    slug: 'fourbank',
    name: 'Fourbank',
    industry: 'Tech',
    solutions: ['Build', 'Secure', 'Observe'],
    products: ['Applications', 'Firewall', 'Real-Time Metrics', 'Real-Time Events'],
    description:
      'FourBank strengthened the security of its financial services and increased resilience against DDoS attacks using the security capabilities of the Azion Platform.'
  },
  {
    slug: 'panvel',
    name: 'Panvel',
    industry: 'Retail',
    solutions: ['Build', 'Deploy'],
    products: ['Applications'],
    description:
      'Over 60% faster applications and 86% offloaded traffic allowed Panvel to scale its e-commerce using Azion’s distributed platform.'
  },
  {
    slug: 'marisa',
    name: 'Marisa',
    industry: 'Retail',
    solutions: ['Build', 'Deploy'],
    products: ['Application Accelerator', 'Cache', 'Image Processor'],
    description:
      'Discover how Marisa improved e-commerce performance with the Azion Platform, delivering 85% of traffic through distributed infrastructure, reducing origin costs, and supporting 96% online sales growth.'
  }
]

const optionsOf = (values) =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b)).map((value) => ({ value, label: value }))

export const STORY_LIBRARY_SECTION = {
  _id: 'story-library',
  props: {
    anchor: 'cases',
    title: 'Companies building with Azion',
    items: STORIES.map((story) => ({
      key: `case-${story.slug}`,
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
    facets: [
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
    ],
    search: {
      placeholder: 'Search by company or story',
      label: 'Search success stories'
    },
    empty: {
      title: 'No stories match these filters.',
      action: 'View all success stories'
    },
    linkLabel: 'Read story',
    moreLabel: 'Load more',
    ariaLabel: 'Success stories'
  }
}

export const NO_RESULTS_SECTION = {
  _id: 'story-library',
  props: {
    ...STORY_LIBRARY_SECTION.props,
    items: []
  }
}
