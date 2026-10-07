import { PRODUCT_STACK, RETAIL_CLIENT_STRIP } from '@shared/ui/brand/strips.js'

import { quotesLedBy } from '../solutions.js'
import { solutionPage } from './solution.js'

const HERO = {
  eyebrow: 'Media and Streaming Delivery',
  title: 'Stream high-quality media and scale to millions',
  description:
    "Reach audiences worldwide through Azion's global infrastructure, with low latency, high availability, and lower streaming costs.",
  carouselMarks: RETAIL_CLIENT_STRIP
}

const CAPABILITIES = [
  {
    icon: 'pi pi-video',
    title: 'Go live without a media server',
    description:
      "Send your encoder's signal straight to Azion and deliver it in HLS or MPEG-DASH. No streaming origin of your own to run or scale."
  },
  {
    icon: 'pi pi-sitemap',
    title: 'One platform, every workload',
    description:
      'Serve your site, run serverless functions, and deliver streams on the same platform, with routing rules and metrics in one place. Built as one, not stitched together from acquisitions.'
  },
  {
    icon: 'pi pi-shield',
    title: 'Secure streams, full visibility',
    description:
      'Set your access and security policies once, and Azion enforces them on every request, everywhere, with real-time visibility while the event is still live.'
  }
]

const USE_CASES = {
  title: 'Live Events and Video Libraries, on One Platform',
  items: [
    {
      illustration: 'global-network',
      title: 'Live Streaming',
      description:
        'Azion can pull HLS or MPEG-DASH streams straight from your origin, or you can push your live signal from your encoder to Azion. Either way, origin requests stay flat as your audience grows from thousands to millions in minutes.'
    },
    {
      illustration: 'runtime',
      title: 'Video on Demand (VOD)',
      description:
        "Serve your video library stored on Azion or in your own storage. Azion's CDN caches segments near your audience so playback starts sooner, and access to paid content can be validated per request."
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
    question: 'Do I need my own streaming origin?',
    answer:
      'No. Your encoder can push the stream to Live Ingest over RTMP, which converts it to HLS, HDS, or MPEG-DASH for Azion to deliver directly. If you already run a media server or packager, Azion fetches manifests and segments from it instead.'
  },
  {
    value: 'q2',
    question: 'Which formats does Azion deliver?',
    answer:
      'Live streams can be delivered in HLS, HDS, or MPEG-DASH. On-demand libraries can be delivered in HLS or MPEG-DASH, from Object Storage or from your own origin.'
  },
  {
    value: 'q3',
    question: 'How does Azion keep origin load flat during a live event?',
    answer:
      'Azion caches segments with short TTLs and manifests for seconds, and Tiered Cache concentrates requests before they reach the origin. The origin sees a near-constant load regardless of audience size.'
  },
  {
    value: 'q4',
    question: 'Can I restrict access to paid content?',
    answer:
      'Yes. A function can validate an access token on each request before a segment is served, and Origin Shield lets your media origin accept traffic from Azion only.'
  },
  {
    value: 'q5',
    question: 'Can Azion host my video library?',
    answer:
      'Yes. Upload your encoded renditions to Object Storage and serve them through Cache, with no customer origin in the request flow. You can also keep the library in your own cloud bucket and let Azion cache the segments.'
  },
  {
    value: 'q6',
    question: 'How do I monitor audience traffic?',
    answer:
      'Real-Time Metrics shows traffic, hit ratio, and errors as they happen, Real-Time Events lets you investigate individual requests during the event, and Data Stream exports delivery logs to your observability or analytics platform.'
  }
]

const CTA = {
  eyebrow: 'Streaming',
  title: 'Stream to millions.',
  titleMuted: 'Without missing a beat.',
  description:
    'Get low latency, high availability, and lower streaming costs, even when everyone tunes in at once.'
}

export const STREAMING_PAGE = solutionPage({
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
