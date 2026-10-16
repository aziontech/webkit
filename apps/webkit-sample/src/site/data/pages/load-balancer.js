import { markRaw } from 'vue'

import LoadBalancerAddressFragment from '../../ui/mockup/widgets/LoadBalancerAddressFragment.vue'
import LoadBalancerMethodFragment from '../../ui/mockup/widgets/LoadBalancerMethodFragment.vue'
import LoadBalancerOriginsFragment from '../../ui/mockup/widgets/LoadBalancerOriginsFragment.vue'
import {
  PLATFORM_DIRECTORY,
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const PILLARS = [
  {
    icon: 'pi pi-shield',
    title: 'Eliminate single points of failure',
    description:
      'Automated failover distributes traffic across multiple origins, detecting failures in real time and rerouting to healthy servers.'
  },
  {
    icon: 'pi pi-clock',
    title: 'Deploy in minutes',
    description:
      'Start immediately with preset algorithms. No hardware provisioning or complex setup required.'
  },
  {
    icon: 'pi pi-chart-line',
    title: 'Scale automatically',
    description:
      'Handle traffic spikes with distributed global architecture delivering low-latency responses in any region.'
  }
]

const USE_CASES = [
  {
    icon: 'pi pi-shopping-cart',
    title: 'E-commerce and retail platforms',
    description:
      'Handle peak shopping events and flash sales without downtime. Distribute traffic across multiple origins to ensure fast checkout experiences and prevent cart abandonment during high-traffic periods.',
    href: '/site/solutions/retail'
  },
  {
    icon: 'ai ai-live-ingest',
    title: 'Media streaming and content delivery',
    description:
      'Deliver video and audio content with low latency and high availability. Balance traffic across CDN origins and streaming servers to maintain quality during live events and peak viewing times.',
    href: '/site/solutions/streaming'
  },
  {
    icon: 'pi pi-credit-card',
    title: 'Financial services and banking',
    description:
      'Ensure transaction processing reliability with automated failover. Distribute API traffic across multiple data centers to maintain service availability for critical financial operations.',
    href: '/site/solutions/financial-services'
  },
  {
    icon: 'ai ai-azion-api',
    title: 'SaaS and API platforms',
    description:
      'Maintain API uptime and performance for customers worldwide. Route requests intelligently across regions and automatically failover during maintenance or outages without impacting users.',
    href: '/site/solutions/technology'
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is Load Balancer and how does it work?',
    answer:
      'Load Balancer distributes incoming traffic across multiple origin servers using configurable algorithms. It monitors server health in real time and automatically routes requests to healthy servers, ensuring high availability and optimal performance. You can choose from Round-Robin, Least Connections, or IP Hash algorithms to match your traffic patterns.'
  },
  {
    value: 'algorithms',
    question: 'What load balancing algorithms are available?',
    answer:
      'Azion Load Balancer supports three algorithms: Round-Robin (distributes requests evenly across all servers), Least Connections (routes to the server with fewest active connections), and IP Hash (routes based on client IP for session persistence). You can configure weights for each origin to control traffic distribution.'
  },
  {
    value: 'failover',
    question: 'How does automated failover work?',
    answer:
      'Load Balancer continuously monitors origin health through configurable health checks. When a server fails to respond or returns errors (5xx, 404, timeouts), traffic is automatically rerouted to healthy servers within seconds. You can set primary and backup roles, and configure connection and byte-timeout thresholds for detection sensitivity.'
  },
  {
    value: 'multi-cloud',
    question: 'Can I use Load Balancer with multi-cloud or hybrid infrastructure?',
    answer:
      'Yes. Load Balancer works across any environment — multi-cloud, hybrid, or on-premises. You can add multiple origin addresses from different cloud providers or data centers within a single configuration. This provides vendor independence and eliminates single points of failure.'
  },
  {
    value: 'deploy-time',
    question: 'How long does it take to deploy Load Balancer?',
    answer:
      'Deployment takes minutes. Configure your origins, select a load balancing algorithm, and start distributing traffic immediately. No hardware provisioning, no complex setup, and no maintenance overhead required.'
  },
  {
    value: 'all-origins-fail',
    question: 'What happens if all origins fail?',
    answer:
      'If all configured origins become unavailable, Load Balancer will return an error response to the client. To prevent this, configure origins across multiple data centers or cloud providers, set appropriate health check intervals, and monitor origin status through Real-Time Metrics and Data Stream.'
  },
  {
    value: 'monitoring',
    question: 'How do I monitor origin health and performance?',
    answer:
      'Monitor origin health through Real-Time Metrics for immediate status visibility and Data Stream for detailed analytics. Track connection timeouts, byte timeouts, error rates, and response times. Set up alerts to notify you when origins fail or performance degrades.'
  },
  {
    value: 'session-persistence',
    question: 'Does Load Balancer support session persistence?',
    answer:
      'Yes. Use the IP Hash algorithm to route requests from the same client IP to the same origin server, maintaining session persistence. This ensures users stay connected to the same backend server throughout their session, which is critical for stateful applications.'
  }
]

export const LOAD_BALANCER_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'long',
    eyebrow: 'Load Balancer',
    title: 'Minimize downtime and achieve true scalability for your applications',
    description:
      'Avoid service interruptions for optimal performance with traffic distribution that automatically routes around server failures in real time.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'WidgetGrid',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'Every origin behind one connector',
    description:
      'The balancing method, the addresses behind it and the role and weight of each one live in the connector, versioned and deployed with it.',
    actions: PRODUCT_HERO_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'pi pi-directions-alt',
        title: 'Actively manage traffic with intelligent routing',
        description:
          'Choose Round-Robin, Least Connections, or IP Hash algorithms. Adjust weights dynamically and monitor origin health in real time.',
        scene: { component: markRaw(LoadBalancerAddressFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-link',
        title: 'Session persistence for stateful applications',
        description:
          'Maintain user sessions with IP-based persistence, routing returning users to the same origin server.',
        scene: { component: markRaw(LoadBalancerMethodFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-cloud',
        title: 'Multi-cloud and on-premises redundancy strategy',
        description:
          'Configure primary and backup origins across multiple cloud providers with automatic failover when primary sources are unavailable.',
        scene: { component: markRaw(LoadBalancerOriginsFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Intelligent Traffic distribution and origin monitoring',
        description:
          'Manage requests between servers with configurable algorithms such as Round-Robin, Least Connections, and IP Hash. Adjust weights, monitor origin health in real time, and keep your infrastructure optimized and stable.',
        href: PRODUCT_DOCS,
        illustration: 'runtime',
        illustrationLabel: 'Request lines passing through a single server',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      },
      {
        title: 'Failover and error handling',
        description:
          'Detect origin failures in real time, respond to HTTP 5xx and 404 errors, timeouts, and connectivity loss, and reroute traffic to healthy servers without disrupting service. Set primary and backup roles to trigger only when necessary, and tune connection and byte-timeout settings to speed detection and recovery.',
        href: '/site/products/real-time-metrics',
        illustration: 'live-debugging',
        illustrationLabel: 'A time window of traffic with its requests, errors and events counted',
        actions: [{ label: 'Real-Time Metrics', href: '/site/products/real-time-metrics' }]
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'Optimize traffic distribution across industries',
    description:
      'Put Load Balancer in front of your origins and spread traffic across them on Azion’s distributed infrastructure, with the method, weights and failover roles you set. Teams use it to:',
    action: { label: 'View docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('magalu') },
  PLATFORM_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]
