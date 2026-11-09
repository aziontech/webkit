import { markRaw } from 'vue'

import { productWidget } from '../../ui/product-widget'
import {
  PLATFORM_DIRECTORY,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS,
  PRODUCT_SECURITY_CLOSING
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const FirewallFunctionFragment = productWidget('firewall-function')
const FirewallModulesFragment = productWidget('firewall-modules')
const FirewallRulesOrderFragment = productWidget('firewall-rules-order')

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
      'Run custom JavaScript security code and marketplace integrations on Azion’s distributed infrastructure.'
  },
  {
    icon: 'pi pi-sync',
    title: 'Real-time synchronization',
    description:
      'Rules sync automatically across every data center. SIEM integration keeps threat intelligence flowing.'
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
    title: 'Stay available for every customer',
    description:
      'Keep applications, content, and origin infrastructure available, backed by a 100% SLA.',
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
    description: 'Ship secure applications on schedule.',
    href: '/site/solutions/technology'
  }
]

export const FIREWALL_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'short',
    eyebrow: 'Firewall',
    title: 'Programmable firewall for distributed applications',
    description:
      'Protect users, applications, and networks with rules you program, from layer 3 to layer 7.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'FeatureWidgets',
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
          'Add a function to the firewall for JWT validation, fingerprinting, rate limiting, or payload validation. It runs in every data center.',
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
          'Firewall processes incoming traffic at OSI layers L3-L7 using criteria and behaviors you define in the Rules Engine. It evaluates requests against your conditions: headers, cookies, query strings, and network parameters. Rules run in sequence with conditional logic, so you control traffic precisely before it reaches the application.',
        href: PRODUCT_DOCS,
        illustration: 'profiles-per-application',
        illustrationLabel:
          'Applications passing through firewall rules into WAF, Application Accelerator and Rules Engine modules',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      },
      {
        title: 'Rule sync and SIEM integration',
        description:
          'Azion syncs your security rules across all data centers through API-driven deployment. Data Stream connectors forward real-time security events to your SIEM for correlation and threat intelligence feedback. API endpoints let you adjust network lists and security settings as external threat intelligence changes.',
        href: '/site/products/data-stream',
        illustration: 'stream-security-events-for-investigation-and-response',
        illustrationLabel:
          'Security events streamed in under 40 seconds to APIs, dashboards, SIEM and other interfaces',
        actions: [{ label: 'Data Stream', href: '/site/products/data-stream' }]
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'Used by security teams in banking, e-commerce, and technology',
    description:
      'Put Firewall in front of any application or API and control traffic on Azion’s distributed infrastructure, before it reaches your origin. Teams use it to:',
    action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('magalu') },
  PLATFORM_DIRECTORY,
  PRODUCT_SECURITY_CLOSING
]
