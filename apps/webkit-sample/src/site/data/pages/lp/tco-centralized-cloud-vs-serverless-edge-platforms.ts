import type { LandingPage } from '.'

export default {
  lang: 'en',
  source: 'https://www.azion.com/en/lp/tco-centralized-cloud-vs-serverless-edge-platforms/',
  sections: [
    {
      section: 'HeroForm',
      title: 'The Real Economics of Serverless Edge Platforms',
      paragraphs: [
        'In this whitepaper, Determining Total Cost of Ownership Across Cloud and Serverless Edge Architectures, we apply a structured framework to compare infrastructure, operations, and deployment costs across both architectural models.',
        'Turns out, the biggest cost differences come from architecture, not location.',
        'Whether you are planning a migration or optimizing workloads you already run, this whitepaper gives you a repeatable model to quantify savings across infrastructure, engineering effort, and day-to-day operations, helping you build a clear, defensible business case for adopting a serverless edge platform.'
      ],
      carouselMarks: [],
      fields: ['phone'],
      country: 'BR',
      labels: { email: 'Work email', submit: 'Download' }
    },
    {
      section: 'StatsBand',
      items: [
        { prefix: '+', value: '65', suffix: '%', label: 'reduction in infrastructure costs' },
        { value: '87', suffix: '%', label: 'fewer maintenance hours' },
        { value: '68', suffix: '%', label: 'lower deployment effort' }
      ]
    },
    {
      section: 'CapabilityGrid',
      items: [
        {
          title: "What you'll learn",
          description:
            'Understand how serverless edge platforms reduce infrastructure, development, and operational costs, and where those savings come from across a typical application lifecycle.'
        },
        {
          title: 'Who this is for',
          description:
            'CTOs, infrastructure architects, SREs, and platform leaders optimizing cloud efficiency.'
        },
        {
          title: 'Why this matters',
          description:
            'Serverless edge platforms shift costs from provisioned capacity to actual usage.'
        },
        {
          title: 'What changes',
          description:
            'Resolve more requests closer to users and reduce dependency on centralized infrastructure. The result is lower egress, fewer moving parts to maintain, and more predictable spend as you scale.'
        }
      ]
    },
    {
      section: 'ClosingCallToAction',
      kind: 'split',
      title: 'Build modern applications',
      description: 'Access to all features.',
      actions: [{ label: 'Start Free', href: '/signup', kind: 'secondary' }]
    }
  ]
} satisfies LandingPage
