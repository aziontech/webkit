import { COMPANY_CLOSING } from '../product-pages.js'
import { MARKET_RECOGNITIONS } from './home.js'

const SPRING_LEADER = {
  src: '/recognitions/g2-spring-2026-leader-art.svg',
  alt: 'G2 Leader badge, Spring 2026',
  width: 360,
  height: 240
}
const SPRING_HIGH_PERFORMER = {
  src: '/recognitions/g2-spring-2026-high-performer-art.svg',
  alt: 'G2 High Performer badge, Spring 2026',
  width: 360,
  height: 240
}
const WINTER_HIGH_PERFORMER = {
  src: '/recognitions/g2-winter-2026-high-performer-art.svg',
  alt: 'G2 High Performer badge, Winter 2026',
  width: 360,
  height: 240
}

export const RECOGNITIONS_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    eyebrow: 'Recognition and awards',
    title: 'Recognized by analysts and customers',
    description: 'Where analysts and G2 reviewers rank the Azion Platform.',
    actions: []
  },
  {
    section: 'RecognitionMarquee',
    gap: false,
    eyebrow: '',
    title: '',
    ariaLabel: 'Recognitions',
    items: MARKET_RECOGNITIONS
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    eyebrow: 'Highlights',
    title: 'G2 Winter 2026 and G2 Spring 2026 Reports',
    description:
      'G2 ranks software on reviews from the teams that run it. These are the categories where Azion placed in its Winter and Spring 2026 reports.',
    bands: [
      {
        title: 'CDN',
        description:
          'Azion is recognized as a Leader in the CDN category in the G2 Winter and G2 Spring 2026 Reports.',
        image: SPRING_LEADER
      },
      {
        title: 'DDoS Protection',
        description:
          'Azion is recognized as a Leader in the G2 Spring 2026 Reports and as a High Performer in G2 Winter 2026 in the DDoS Protection category.',
        image: SPRING_LEADER
      },
      {
        title: 'Web Application Firewall (WAF)',
        description:
          'Azion is recognized as a High Performer in the G2 Spring and G2 Winter 2026 Reports.',
        image: SPRING_HIGH_PERFORMER
      },
      {
        title: 'Web Security Software',
        description:
          'Azion is recognized as a High Performer in the G2 Spring and G2 Winter 2026 Reports.',
        image: SPRING_HIGH_PERFORMER
      },
      {
        title: 'Bot Detection and Mitigation',
        description:
          'Azion is recognized as a High Performer in the G2 Spring and G2 Winter 2026 Reports.',
        image: SPRING_HIGH_PERFORMER
      },
      {
        title: 'SSL & TLS Certificate Tools',
        description:
          'Azion is recognized as a High Performer in the G2 Winter and G2 Spring 2026 Reports.',
        image: SPRING_HIGH_PERFORMER
      },
      {
        title: 'Cloud Security',
        description:
          'Azion is recognized as a High Performer in the Cloud Security category in the G2 Spring 2026 Reports.',
        image: SPRING_HIGH_PERFORMER
      },
      {
        title: 'API Security Tools',
        description:
          'Azion is recognized as a High Performer in the API Security Tools category in the G2 Spring 2026 Reports.',
        image: SPRING_HIGH_PERFORMER
      },
      {
        title: 'DNS Security',
        description:
          'Azion is recognized as a High Performer in the DNS Security category in the G2 Winter 2026 Reports.',
        image: WINTER_HIGH_PERFORMER,
        actions: [
          {
            label: 'Read G2 reviews',
            href: 'https://www.g2.com/products/azion/reviews#reviews',
            external: true
          }
        ]
      }
    ]
  },
  COMPANY_CLOSING
]
