import { PRODUCT_STACK, RETAIL_CLIENT_STRIP } from '@shared/ui/brand/strips.js'

import { quotesLedBy } from '../solutions.js'
import { solutionPage } from './solution.js'

const HERO = {
  eyebrow: 'Application Performance and Reliability',
  title: 'Make your applications fast and always reliable',
  description:
    "Serve websites, web apps, and APIs from Azion's globally distributed infrastructure, keep them online when an origin fails, and cut origin load and egress costs during your biggest traffic peaks.",
  carouselMarks: RETAIL_CLIENT_STRIP
}

const CAPABILITIES = [
  {
    icon: 'pi pi-sliders-h',
    title: 'Tune delivery, not your origin',
    description:
      'Instantly change how each request is cached, routed, and answered without editing your application or waiting for the next release.'
  },
  {
    icon: 'pi pi-wallet',
    title: 'Lower cost at scale',
    description:
      'Requests served before they reach your origin never show up on your cloud bill. What speeds up your pages also cuts compute and egress costs.'
  },
  {
    icon: 'pi pi-search',
    title: 'Detect anomalies instantly',
    description:
      'Spot traffic spikes and error surges as they happen, so you can react before issues impact your business.'
  }
]

const USE_CASES = {
  title: 'Fast Everywhere, Online Through Every Peak',
  items: [
    {
      illustration: 'global-network',
      title: 'Content Delivery Network (CDN)',
      description:
        "Put Azion in front of your origin. Cacheable content is served from Azion's CDN, close to your users, and requests that still need the origin get there faster. Your application stays right where it is."
    },
    {
      illustration: 'retail-application-modernization',
      title: 'Load Balancing and Failover',
      description:
        'Load Balancer spreads requests across two or more origins, shifts traffic away from any origin that fails, and supports primary and backup origins for active-passive setups.'
    },
    {
      illustration: 'build-applications',
      title: 'Image Processing',
      description:
        'Image Processor resizes, crops, and converts images on the fly to the size and format each page needs, and Azion caches every variant. You keep just one original per image.'
    },
    {
      illustration: 'live-debugging',
      title: 'Performance Monitoring',
      description:
        'Collect real-user metrics from browsers and a log of every request, with no agents on your servers. Query the data in real time or stream it to the observability tools your team already uses.'
    }
  ]
}

const STACK = { label: 'Compatible With Your Stack', marks: PRODUCT_STACK }

const QUOTES = quotesLedBy(
  'dafiti',
  "One of the best CDN and WAF solutions I've ever used. Easy to implement and integrate, with speed and low latency that make a real difference for our customers."
)

const NETWORK_BAND = {
  eyebrow: 'Region: Earth.',
  title: 'One distributed infrastructure to build, secure and scale workloads anywhere.',
  lead: 'Built around your users. Distributed around your data.',
  claims: [
    '100+ data centers',
    '100+ Tbps network capacity',
    '30 ms median latency',
    '100% availability'
  ]
}

const FAQ = [
  {
    value: 'q1',
    question: 'How does Azion speed up an application that runs in one cloud region?',
    answer:
      "Your users' requests reach Azion's distributed infrastructure first, not your origin. Azion serves cached content the way a CDN does and applies a wide range of protocol optimizations that make your application faster and more available."
  },
  {
    value: 'q2',
    question: 'Do I need to move my application to use Azion?',
    answer:
      'No. Your application keeps running on its current origin. Just point your domain to Azion. You can also lock down your origin so it only accepts traffic from Azion.'
  },
  {
    value: 'q3',
    question: 'What happens when my origin fails?',
    answer:
      'Azion keeps serving cached content while your origin is down. You can also configure Load Balancer to detect errors and timeouts and stop sending traffic to a failing origin. It supports primary and backup origins, weighted round-robin, least connections, and IP hash for session affinity.'
  },
  {
    value: 'q4',
    question: 'How does Azion reduce origin load and egress costs?',
    answer:
      'Caching rules and tiered caching consolidate requests before they reach your origin, so your origin serves each object fewer times and sends less data out of your cloud.'
  },
  {
    value: 'q5',
    question: 'How does Azion optimize images?',
    answer:
      'Keep one original per image. Image Processor generates the size, crop, and format each page requests, and Azion caches every variant, so repeat requests are served straight from cache.'
  },
  {
    value: 'q6',
    question: 'How do I measure performance for real users?',
    answer:
      "Add a script to your pages to collect measurements from visitors' browsers. See them in real-time dashboards, query them through GraphQL, export every request's log to your observability platform, and drill into individual requests when something goes wrong."
  }
]

const CTA = {
  eyebrow: 'Performance',
  title: 'Fast everywhere.',
  titleMuted: 'Always reliable.',
  description:
    'Get lower latency, less origin load, and fewer outages during your biggest traffic peaks.'
}

export const PERFORMANCE_PAGE = solutionPage({
  hero: HERO,
  capabilities: CAPABILITIES,
  useCases: USE_CASES,
  stack: STACK,
  quotes: QUOTES,
  primitivesTitle: 'All the Platform Primitives You Need',
  network: NETWORK_BAND,
  faq: FAQ,
  cta: CTA
})
