import { markRaw } from 'vue'

import FirewallFunctionFragment from '../../ui/mockup/widgets/FirewallFunctionFragment.vue'
import FirewallModulesFragment from '../../ui/mockup/widgets/FirewallModulesFragment.vue'
import FirewallRulesOrderFragment from '../../ui/mockup/widgets/FirewallRulesOrderFragment.vue'
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
    title: 'Programmable rule engine',
    description:
      'Define custom rules and behaviors across OSI layers L3-L7 to control traffic before it reaches your applications.'
  },
  {
    icon: 'pi pi-code',
    title: 'Extensible with Functions',
    description:
      'Run custom JavaScript security code and marketplace integrations directly at global points of presence.'
  },
  {
    icon: 'pi pi-sync',
    title: 'Real-time synchronization',
    description:
      'Rules sync automatically across every point of presence, with SIEM integration for continuous threat intelligence.'
  }
]

const USE_CASES = [
  {
    icon: 'ai ai-azion-api',
    title: 'Protect legacy and modern applications/APIs',
    description: 'Protect attack surfaces against evolving web threats.',
    href: '/site/solutions/security'
  },
  {
    icon: 'pi pi-check-circle',
    title: 'Always deliver the best experience to customers',
    description:
      'Keep your applications, content, and origin infrastructure always available with our 100% SLA.',
    href: '/site/solutions/performance'
  },
  {
    icon: 'pi pi-verified',
    title: 'Compliance without complications',
    description:
      'Simplify compliance with security standards like PCI-DSS and an intuitive high-level platform.',
    href: '/site/solutions/financial-services'
  },
  {
    icon: 'ai ai-security-team',
    title: 'Implement DevSecOps processes',
    description: 'Ship secure applications at the right time.',
    href: '/site/solutions/technology'
  }
]

export const FIREWALL_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'long',
    eyebrow: 'Firewall',
    title: 'Programmable firewall for distributed applications',
    description: 'Protect your users, applications, and networks with a modern approach.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'WidgetGrid',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'Every security layer in one firewall',
    description:
      'The modules you turn on, the rules that run them in order and the functions they call live in one firewall, versioned and deployed together.',
    actions: PRODUCT_HERO_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'ai ai-edge-firewall',
        title: 'Turn on the modules each application needs',
        description:
          'Add Web Application Firewall against OWASP Top 10 threats and zero-day attacks, and Network Shield for smart rules, network lists and rate limiting, with DDoS Protection always on.',
        scene: { component: markRaw(FirewallModulesFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'ai ai-rules-engine',
        title: 'Rules that run in the order you set',
        description:
          'Match headers, cookies, query strings and network parameters, then run each rule in sequence to control traffic before it reaches the application.',
        scene: { component: markRaw(FirewallRulesOrderFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'ai ai-edge-functions',
        title: 'Functions for custom security logic',
        description:
          'Instantiate a function in the firewall for JWT validation, fingerprinting, rate limiting or payload validation, running at every point of presence.',
        scene: { component: markRaw(FirewallFunctionFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Programmable security modules and rule processing',
        description:
          'The Firewall processes incoming traffic at OSI layers L3-L7 using configurable criteria and behaviors defined in the Rules Engine. The system evaluates requests against user-defined conditions including headers, cookies, query strings, and network parameters. Rules execute sequentially with conditional logic, allowing precise control over traffic before application access.',
        href: PRODUCT_DOCS,
        illustration: 'programmable-security',
        illustrationLabel:
          'A request checked by programmable rules before it reaches the application',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      },
      {
        title: 'Distributed rule synchronization and SIEM integration',
        description:
          "The platform automatically synchronizes configured security rules across all global points of presence through API-driven deployment. Data Stream connectors enable forwarding of real-time security events to the customer's SIEM platforms for correlation analysis and threat intelligence feedback. API endpoints allow dynamic adjustment of network lists and security configurations based on external threat intelligence and operational requirements.",
        href: '/site/products/data-stream',
        illustration: 'global-network',
        illustrationLabel: 'A world map of the points of presence every synchronized rule reaches',
        actions: [{ label: 'Data Stream', href: '/site/products/data-stream' }]
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'Trusted by security experts in banking, e-commerce, technology, and other industries',
    description:
      'Put Firewall in front of any application or API and control traffic on Azion’s distributed infrastructure, before it reaches your origin. Teams use it to:',
    action: { label: 'View docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('magalu') },
  PLATFORM_DIRECTORY,
  {
    ...PRODUCT_CLOSING,
    eyebrow: 'Protect',
    title: 'Protected by default.',
    titleMuted: 'Always on.',
    description: 'Get stronger protection, less attack exposure, and less operational overhead.'
  }
]
