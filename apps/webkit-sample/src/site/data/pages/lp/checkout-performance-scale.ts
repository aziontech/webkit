import type { LandingPage } from '.'

export default {
  lang: 'en',
  source: 'https://www.azion.com/en/lp/checkout-performance-scale/',
  sections: [
    {
      section: 'HeroForm',
      title: 'Checkout Performance at Scale',
      paragraphs: [
        'How can you maintain conversion and revenue as traffic grows without relying on backend scaling?',
        'Learn how to reduce p95/p99 latency, avoid silent degradation, and apply caching and distributed execution to protect performance and revenue during high-demand periods.',
        'This practical guide breaks down the architectural patterns that leading retailers rely on to keep checkout fast and reliable during peak events such as Black Friday, flash sales, and major product launches, so you can deliver resilient buying experiences without over-provisioning your backend or rewriting your stack.'
      ],
      carouselMarks: [],
      fields: ['phone'],
      country: 'BR',
      labels: { email: 'Work email', submit: 'Download' }
    },
    {
      section: 'CapabilityGrid',
      items: [
        {
          title: "What you'll learn",
          description:
            "How to maintain checkout performance under high demand without losing consistency. Includes selective caching, distributed execution, and traffic control. You'll also see how to identify the bottlenecks that quietly erode conversion before they turn into visible incidents."
        },
        {
          title: 'Who this is for',
          description:
            'Technical leaders, platform teams, SREs, and backend engineers responsible for performance and conversion in high-traffic applications.'
        },
        {
          title: 'Why this matters',
          description:
            'Checkout issues are rarely visible failures, they are silent degradations that impact conversion and revenue without triggering alerts.'
        },
        {
          title: 'Where to start',
          description:
            'Map critical dependencies, reduce backend load with caching and distributed execution, implement traffic control, and monitor p95/p99. Start with the highest-impact paths and expand coverage as you measure results in production.'
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
