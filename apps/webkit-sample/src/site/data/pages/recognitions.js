import { markRaw } from 'vue'

import RecognitionSealScene from '../../ui/RecognitionSealScene.vue'
import { COMPANY_CLOSING } from '../product-pages.js'
import { MARKET_RECOGNITIONS } from './home.js'

// azion.com/en/recognitions, read verbatim; the marquee reuses the home's market-leader ticker.
// Each band shows the G2 badge the source shows, under the source's alt.

const seal = (src, alt) => ({ component: markRaw(RecognitionSealScene), props: { src, alt } })

const SPRING_LEADER = '/recognitions/g2-spring-2026-leader.png'
const SPRING_HIGH_PERFORMER = '/recognitions/g2-spring-2026-high-performer.png'
const WINTER_HIGH_PERFORMER = '/recognitions/g2-winter-2026-high-performer.png'

const HIGH_PERFORMER = 'G2 badge of High Performer'

export const RECOGNITIONS_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-band',
    plain: true,
    eyebrow: 'Recognition and Awards',
    eyebrowPrefix: '//',
    title: 'Recognized by analysts and customers',
    description: 'What experts and customers say about Azion.',
    actions: []
  },
  {
    section: 'RecognitionMarquee',
    gap: false,
    ariaLabel: 'Recognitions',
    items: MARKET_RECOGNITIONS
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    eyebrow: 'Highlights',
    title: 'G2 Winter 2026 and G2 Spring 2026 Reports',
    description:
      "G2 is one of the world's largest software review platforms. Recognition across its Winter and Spring 2026 reports reflects Azion's proven impact in production.",
    bands: [
      {
        title: 'CDN (Content Delivery Network)',
        description:
          'The Azion platform is recognized as a Leader in the CDN category in the G2 Winter and G2 Spring 2026 Reports.',
        scene: seal(SPRING_LEADER, 'G2 badge of Leader')
      },
      {
        title: 'DDoS Protection',
        description:
          'Azion is recognized as a Leader in the G2 Spring 2026 Reports and as a High Performer in G2 Winter 2026 in the DDoS Protection category.',
        scene: seal(SPRING_LEADER, HIGH_PERFORMER)
      },
      {
        title: 'Web Application Firewall (WAF)',
        description:
          'Azion is recognized as a High Performer in the G2 Spring and G2 Winter 2026 Reports.',
        scene: seal(SPRING_HIGH_PERFORMER, HIGH_PERFORMER)
      },
      {
        title: 'Web Security Software',
        description:
          'Azion is recognized as a High Performer in the G2 Spring and G2 Winter 2026 Reports.',
        scene: seal(SPRING_HIGH_PERFORMER, HIGH_PERFORMER)
      },
      {
        title: 'Bot Detection & Mitigation',
        description:
          'Azion is recognized as a High Performer in the G2 Spring and G2 Winter 2026 Reports.',
        scene: seal(SPRING_HIGH_PERFORMER, HIGH_PERFORMER)
      },
      {
        title: 'SSL & TLS Certificate Tools',
        description:
          'Azion is recognized as a High Performer in the G2 Winter and G2 Spring 2026 Reports.',
        scene: seal(SPRING_HIGH_PERFORMER, HIGH_PERFORMER)
      },
      {
        title: 'Cloud Security',
        description:
          'Azion is recognized as a High Performer in the Cloud Security category in the G2 Spring 2026 Reports.',
        scene: seal(SPRING_HIGH_PERFORMER, HIGH_PERFORMER)
      },
      {
        title: 'API Security Tools',
        description:
          'Azion is recognized as a High Performer in the API Security Tools category in the G2 Spring 2026 Reports.',
        scene: seal(SPRING_HIGH_PERFORMER, HIGH_PERFORMER)
      },
      {
        title: 'DNS Security',
        description:
          'Azion is recognized as a High Performer in the DNS Security category in the G2 Winter 2026 Reports.',
        scene: seal(WINTER_HIGH_PERFORMER, HIGH_PERFORMER),
        actions: [
          {
            label: 'Learn More',
            href: 'https://www.g2.com/products/azion/reviews#reviews',
            external: true
          }
        ]
      }
    ]
  },
  COMPANY_CLOSING
]
