import { markRaw } from 'vue'

import ApplicationsCreateMethodFragment from '../../ui/mockup/widgets/ApplicationsCreateMethodFragment.vue'
import ApplicationsDeviceGroupFragment from '../../ui/mockup/widgets/ApplicationsDeviceGroupFragment.vue'
import ApplicationsRulePhasesFragment from '../../ui/mockup/widgets/ApplicationsRulePhasesFragment.vue'
import {
  PLATFORM_DIRECTORY,
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const PILLARS = [
  {
    icon: 'ai ai-edge-functions',
    title: 'Functions',
    description:
      'Build discrete programmable logic in your web applications on the Azion Web Platform, closer to your users and devices.'
  },
  {
    icon: 'ai ai-tiered-cache',
    title: 'Cache',
    description:
      'Enable an additional cache layer that reduces traffic to your origin, improving performance and availability.'
  },
  {
    icon: 'ai ai-load-balancer',
    title: 'Load Balancer',
    description:
      'Distribute traffic across your origins, ensuring optimal reliability and network congestion control.'
  }
]

const USE_CASES = [
  {
    icon: 'pi pi-shield',
    title: 'Build a Zero Trust security model on a distributed architecture',
    description:
      'Protect your application against sophisticated attacks like BGP hijacking and DDoS.',
    href: '/site/solutions/security'
  },
  {
    icon: 'ai ai-edge-functions',
    title: 'Deliver serverless applications on a distributed architecture',
    description: 'Provide a personalized experience for every customer.',
    href: '/site/solutions/web-apps'
  },
  {
    icon: 'ai ai-edge-application',
    title: 'Build sites on a distributed architecture',
    description:
      'Process directly in our global points of presence without reaching any origin infrastructure.',
    href: '/site/solutions/performance'
  },
  {
    icon: 'pi pi-video',
    title: 'Accelerate delivery',
    description:
      'Deliver high-resolution video streaming content to your application by caching it closer to your users.',
    href: '/site/solutions/streaming'
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is Applications?',
    answer:
      'Applications is the Azion product for building and running web applications on the Azion Web Platform. It processes incoming requests through configurable business rules, including request rewriting, header manipulation, and cache control.'
  },
  {
    value: 'modules',
    question: 'What modules can I integrate with Applications?',
    answer:
      'Applications serves as a foundation for integrated modules, including Functions, Load Balancer, Image Processor, and Cache. You can enable modules on demand with comprehensive application controls.'
  },
  {
    value: 'rules-engine',
    question: 'How does Rules Engine work?',
    answer:
      'The Rules Engine evaluates conditions and applies behaviors including cache bypass, origin redirect, and generation of customized responses. You can configure no-code logic for cookie handling, response modification, and device-based behavior.'
  },
  {
    value: 'multiple-origins',
    question: 'Can Applications connect to multiple origins?',
    answer:
      'Yes. The platform establishes connections with multiple external services, including web servers, on-premises and cloud services, and AI model providers through flexible addressing.'
  },
  {
    value: 'protocols',
    question: 'What protocols are supported?',
    answer:
      'Applications supports HTTP/1.1, HTTP/2, and HTTP/3 with QUIC. You can configure protocol selection, custom timeouts, and persistent connections for optimal performance.'
  },
  {
    value: 'ipv6',
    question: 'Does Applications support IPv6?',
    answer:
      'Yes. Enterprise-grade features support IPv6, mandatory TLS enforcement, HMAC authentication, and compliance requirements for production workloads.'
  },
  {
    value: 'deploy',
    question: 'How do I deploy an application?',
    answer:
      'You can deploy applications from Git repositories with continuous deployment, use the Azion CLI, or configure directly in the console. Marketplace solutions also accelerate development with pre-built resources.'
  }
]

export const APPLICATIONS_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'long',
    eyebrow: 'Applications',
    title: 'Build and run distributed web applications',
    description:
      'Applications lets you build your web applications to run on the Azion Web Platform.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'WidgetGrid',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'The logic behind every request, in one application',
    description:
      'Rules that act on each phase, the device groups they target and the way the code arrives live in the application, deployed together.',
    actions: PRODUCT_HERO_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'ai ai-rules-engine',
        title: 'Rules for requests and responses',
        description:
          'Rewrite requests, set headers and control cache with no-code rules that run in order, first on the request, then on the response.',
        scene: { component: markRaw(ApplicationsRulePhasesFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-mobile',
        title: 'Behavior defined by device',
        description:
          'Group requests by User-Agent, then let rules adapt responses, cache and routing to each device group.',
        scene: { component: markRaw(ApplicationsDeviceGroupFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'ai ai-azion-cli',
        title: 'Deploy the way you already work',
        description:
          'Import a Git repository with continuous deployment, push from the Azion CLI, or start from a pre-built template.',
        scene: { component: markRaw(ApplicationsCreateMethodFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Module integration and application orchestration',
        description:
          'Applications serves as a foundation for integrated modules, including Functions, Load Balancer, Image Processor, and Cache. The system provides on-demand module management with comprehensive application controls, including custom error responses and device group adaptation. Enterprise-grade features support IPv6, mandatory TLS enforcement, HMAC authentication, and compliance requirements for production workloads.',
        href: '/site/products/functions',
        illustration: 'build-applications',
        illustrationLabel:
          'Framework projects passing through the platform to image, page and data modules',
        actions: [{ label: 'Functions', href: '/site/products/functions' }]
      },
      {
        title: 'Origin management and workload distribution',
        description:
          'The platform establishes connections with multiple external services, including web servers, on-premises and cloud services, and AI model providers through flexible addressing. Workload distribution optimizes traffic routing based on origin availability, custom timeouts, and protocol selection, including HTTP/3 with QUIC. Integrated marketplace solutions accelerate development with pre-built security resources, A/B testing, and data processing for rapid application deployment.',
        href: '/site/products/load-balancer',
        illustration: 'retail-application-modernization',
        illustrationLabel:
          'Client devices and APIs joined through the platform to the services behind it',
        actions: [{ label: 'Load Balancer', href: '/site/products/load-balancer' }]
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'Use cases',
    description:
      'Put Applications in front of any origin and decide what happens to each request on Azion’s distributed infrastructure, with the rules and modules you configure. Teams use it to:',
    action: { label: 'View docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('magalu') },
  PLATFORM_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]
