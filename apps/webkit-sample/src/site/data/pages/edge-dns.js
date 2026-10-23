import { markRaw } from 'vue'

import { productWidget } from '../../ui/product-widget'
import {
  PLATFORM_DIRECTORY,
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const EdgeDnsDnssecFragment = productWidget('edge-dns-dnssec')
const EdgeDnsNameserverFragment = productWidget('edge-dns-nameserver')
const EdgeDnsRecordFragment = productWidget('edge-dns-record')

const PILLARS = [
  {
    icon: 'pi pi-globe',
    title: 'Global distributed architecture',
    description:
      'Host authoritative DNS on distributed nameservers with automatic geographic redundancy, so domains stay reachable worldwide.'
  },
  {
    icon: 'pi pi-lock',
    title: 'Enterprise-grade security',
    description:
      'Built-in DDoS protection, DNSSEC, and threat detection block poisoning, hijacking, and unauthorized zone access.'
  },
  {
    icon: 'pi pi-cog',
    title: 'Manage zones your way',
    description: 'Create, update, and manage DNS records in the console or through the REST API.'
  }
]

const USE_CASES = [
  {
    icon: 'pi pi-shopping-cart',
    title: 'E-commerce and payment platforms',
    description:
      'Keep DNS available during peak traffic and block DNS-based attacks that could disrupt payment processing. Built-in DDoS protection and geographic redundancy keep payment systems reachable.',
    href: '/site/solutions/retail'
  },
  {
    icon: 'pi pi-credit-card',
    title: 'Financial services and banking',
    description:
      'Meet regulatory compliance with DNSSEC, monitor all DNS queries with Real-Time Events, and protect against DNS-based fraud and account takeover attacks.',
    href: '/site/solutions/financial-services'
  },
  {
    icon: 'pi pi-cloud',
    title: 'SaaS and software platforms',
    description:
      'Give your customers reliable, secure DNS through the API. Scale to millions of queries without managing infrastructure.',
    href: '/site/solutions/technology'
  },
  {
    icon: 'pi pi-video',
    title: 'Media and streaming services',
    description:
      'Deliver content globally with instant DNS failover. Support millions of concurrent viewers without DNS bottlenecks or interruptions.',
    href: '/site/solutions/streaming'
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is an authoritative DNS service?',
    answer:
      'An authoritative DNS service stores the official DNS records for a domain and responds directly to DNS queries from users and applications. Unlike recursive resolvers that cache responses from other servers, authoritative DNS ensures accurate and up-to-date domain resolution. Edge DNS delivers authoritative DNS from Azion’s distributed infrastructure, with high availability, fast response times, and geographic redundancy.'
  },
  {
    value: 'uptime',
    question: 'How does Edge DNS achieve 99.99% uptime?',
    answer:
      'Edge DNS achieves high availability through geographic distribution, infrastructure redundancy, and automatic failover. It operates across multiple global data centers and automatically routes queries to available servers if any data center becomes unavailable. That removes single points of failure and keeps DNS available.'
  },
  {
    value: 'dnssec',
    question: 'What is DNSSEC and do I need it?',
    answer:
      'DNSSEC (Domain Name System Security Extensions) adds cryptographic digital signatures to DNS responses, helping prevent DNS spoofing and poisoning attacks. It ensures users reach authentic destinations instead of attacker-controlled domains. While not mandatory for basic DNS usage, DNSSEC is strongly recommended for financial services, government platforms, and any application where domain trust and integrity are critical. Edge DNS supports full DNSSEC implementation.'
  },
  {
    value: 'vs-provider',
    question: 'How is Edge DNS different from my current DNS provider?',
    answer:
      'Edge DNS combines authoritative DNS hosting with security and performance built into the Azion Platform. Unlike traditional DNS providers, Edge DNS offers built-in DDoS protection, DNSSEC support, real-time threat detection, and global geographic distribution, all in one platform.'
  },
  {
    value: 'programmatic',
    question: 'Can I manage Edge DNS programmatically?',
    answer:
      'Yes. Edge DNS offers REST and GraphQL APIs for zone creation, record management, DNSSEC configuration, and monitoring. Use them to automate DNS operations, plug into CI/CD pipelines, and manage large environments.'
  },
  {
    value: 'ddos',
    question: 'What happens during a DDoS attack on my DNS?',
    answer:
      'During a DNS DDoS attack, malicious traffic attempts to overwhelm DNS servers and disrupt domain resolution. Edge DNS automatically detects and mitigates these attacks using intelligent traffic analysis, rate limiting, and threat detection mechanisms that block flood and amplification attacks before they impact availability, keeping DNS services responsive even under attack.'
  },
  {
    value: 'pricing',
    question: 'How does Edge DNS pricing work?',
    answer:
      'Edge DNS pricing is based on the number of DNS queries processed. You pay only for what you use — no hidden fees for zones, records, or DNSSEC. Check the pricing page for current rates, or contact sales for volume discounts and enterprise agreements.'
  },
  {
    value: 'migrate',
    question: 'Can I migrate my existing DNS to Edge DNS?',
    answer:
      "Yes. Import your DNS zone files, update your domain registrar's nameserver records to point to Azion's nameservers, and monitor the migration with Real-Time Metrics. The entire process typically takes minutes, with zero downtime when done correctly. Our documentation provides step-by-step migration guides."
  }
]

export const EDGE_DNS_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'long',
    eyebrow: 'Edge DNS',
    title: 'Secure, highly available authoritative DNS',
    description:
      'Run your zones on Azion’s global distributed infrastructure with DNSSEC, DDoS protection, and real-time query visibility.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'FeatureWidgets',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'Every DNS setting in one zone',
    description:
      'The nameservers you delegate to, the DNSSEC keys your provider needs and the records the zone answers with live together, served from every data center once the zone is active.',
    actions: PRODUCT_HERO_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'pi pi-bolt',
        title: 'Fast DNS answers worldwide',
        description:
          'Point your domain at Azion’s nameservers, and automatic geographic routing resolves each query from the nearest data center, in under 10ms on average.',
        scene: { component: markRaw(EdgeDnsNameserverFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-key',
        title: 'DNSSEC and cryptographic authentication',
        description:
          'Enable DNSSEC to sign every response, then add the Key Tag and Digest at your domain provider to complete the Chain of Trust.',
        scene: { component: markRaw(EdgeDnsDnssecFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-code',
        title: 'Developer-first API',
        description:
          'Add records in the console, or automate zone management, record operations and DNSSEC configuration with the GraphQL and REST APIs.',
        scene: { component: markRaw(EdgeDnsRecordFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Authoritative DNS with enterprise uptime',
        description:
          'Run your DNS on authoritative nameservers across the Azion Platform. You get a 99.99% uptime SLA, automatic failover, real-time health monitoring, and instant global propagation.',
        href: PRODUCT_DOCS,
        illustration: 'global-network',
        illustrationLabel: 'Nameservers spread across data centers worldwide',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      },
      {
        title: 'Built-in DDoS protection and threat detection',
        description:
          'Mitigate DNS floods, amplification attempts, and malicious queries with traffic analysis, automatic rate limiting, and real-time threat detection. Every query is evaluated proactively, with no additional configuration.',
        href: 'https://www.azion.com/en/documentation/platform/workloads/ddos-protection/ddos-mitigation/',
        illustration: 'dns-protection',
        illustrationLabel:
          'DNS queries filtered by a protective layer before they reach the nameservers',
        actions: [
          {
            label: 'DDoS Protection',
            href: 'https://www.azion.com/en/documentation/platform/workloads/ddos-protection/ddos-mitigation/'
          }
        ]
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'Safe and reliable authoritative DNS',
    description:
      'Put Edge DNS in front of any domain and answer every query from Azion’s distributed infrastructure, with DNSSEC and DDoS protection built in. Teams use it to:',
    action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('magalu') },
  PLATFORM_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]
