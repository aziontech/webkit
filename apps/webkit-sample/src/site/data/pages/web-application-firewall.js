import { markRaw } from 'vue'

import { productWidget } from '../../ui/product-widget'
import {
  PLATFORM_DIRECTORY,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS,
  PRODUCT_SECURITY_CLOSING
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const WafAllowedRuleFragment = productWidget('waf-allowed-rule')
const WafFirewallRuleFragment = productWidget('waf-firewall-rule')
const WafThreatFragment = productWidget('waf-threat')

const PILLARS = [
  {
    icon: 'pi pi-shield',
    title: 'Zero-day defense',
    description: "Block zero-day exploits and emerging threats with rules you don't need to update."
  },
  {
    icon: 'pi pi-gauge',
    title: 'Global performance',
    description:
      'Protection runs on Azion’s distributed infrastructure, so applications stay secure and fast.'
  },
  {
    icon: 'ai ai-waf-rules',
    title: 'Low false positives',
    description: 'Rules adapt to your application and stop only malicious traffic.'
  }
]

const USE_CASES = [
  {
    icon: 'ai ai-abuse-prevention',
    title: 'Stop checkout abuse at peak traffic',
    description:
      'WAF rules block bots and credential stuffing automatically, keeping checkout available for real users during peak events.',
    href: '/site/solutions/retail'
  },
  {
    icon: 'ai ai-azion-api',
    title: 'Secure APIs from injection and abuse',
    description:
      'Protect REST and GraphQL APIs from injection attacks, abusive traffic, and automated exploitation attempts.',
    href: '/site/solutions/security'
  },
  {
    icon: 'pi pi-credit-card',
    title: 'Protect sensitive financial data',
    description:
      'Block attacks targeting payment flows and sensitive information while supporting PCI-DSS and regulatory compliance requirements.',
    href: '/site/solutions/financial-services'
  },
  {
    icon: 'pi pi-sitemap',
    title: 'Secure multi-tenant applications at scale',
    description:
      'Apply policies across multi-tenant SaaS environments. They scale automatically as traffic grows.',
    href: '/site/solutions/technology'
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is a WAF and how does it work?',
    answer:
      'A WAF (Web Application Firewall) monitors, filters, and blocks HTTP/HTTPS traffic at Layer 7. It analyzes each request against security rules to detect and block threats like SQL injection, cross-site scripting (XSS), and OWASP Top 10 attacks before they reach your origin servers.'
  },
  {
    value: 'under-attack',
    question: "I'm under attack. What should I do?",
    answer:
      'Get immediate expert help. Our security specialists connect with you instantly, analyze the attack in real time, deploy custom security rules to block it, and activate advanced protection. Every second counts during an active attack.'
  },
  {
    value: 'existing-tools',
    question: 'Can I use WAF alongside my existing security tools?',
    answer:
      'Yes. Azion WAF integrates with your existing security stack and can be deployed alongside CDNs, load balancers, and other security solutions. Unlike standalone WAFs, Azion operates as part of a unified security platform: combine WAF with Bot Manager, Network Shield, and custom Functions for layered protection. Stream security events to your SIEM via Data Stream for centralized visibility across all tools.'
  },
  {
    value: 'vs-firewall',
    question: 'What is the difference between a WAF and a traditional firewall?',
    answer:
      'Traditional firewalls operate at the network layer (Layer 3-4) and filter traffic based on IP addresses, ports, and protocols. A WAF operates at the application layer (Layer 7) and understands HTTP/HTTPS protocols, analyzing request content, headers, cookies, and payloads to detect application-specific attacks. While network firewalls protect infrastructure, WAFs specifically protect web applications from threats like SQL injection, XSS, and zero-day exploits that traditional firewalls cannot detect.'
  },
  {
    value: 'deploy-time',
    question: 'How long does it take to deploy and implement a WAF?',
    answer:
      'Azion WAF can be deployed in under 30 minutes with no hardware provisioning or complex setup required. Point your DNS to Azion, enable WAF protection in the console, and select your security rules. Start in Learning Mode to observe traffic patterns, tune sensitivity levels to eliminate false positives, then switch to Blocking Mode. Unlike traditional WAF solutions that take weeks or months to implement, Azion WAF provides immediate protection with minimal configuration.'
  },
  {
    value: 'owasp',
    question: 'Does Azion WAF protect against OWASP Top 10 vulnerabilities?',
    answer:
      'Yes. Azion WAF protects against all OWASP Top 10 threats, including SQL injection, cross-site scripting (XSS), broken authentication, sensitive data exposure, XML external entities (XXE), broken access control, security misconfigurations, cross-site request forgery (CSRF), insecure deserialization, and components with known vulnerabilities. Rule sets are updated continuously with threat intelligence and zero-day signatures.'
  },
  {
    value: 'attack-types',
    question: "What types of attacks can Azion's security platform prevent?",
    answer:
      "Azion's security platform combines WAF, Bot Manager, and Network Shield to prevent attacks including SQL injection, cross-site scripting (XSS), XML external entities (XXE), remote file inclusion (RFI), local file inclusion (LFI), command injection, path traversal, cross-site request forgery (CSRF), server-side request forgery (SSRF), unsafe redirects, and zero-day exploits. For APIs, Azion WAF defends against injection attacks, broken object-level authorization (BOLA), excessive data exposure in requests, lack of rate limiting, broken function-level authorization (BFLA), unrestricted resource consumption, and server-side request forgery (SSRF). Bot Manager handles credential stuffing, scraping, and automation abuse. Network Shield provides network-layer DDoS protection. Our risk scoring detects both known attack signatures and anomalous behavior patterns."
  },
  {
    value: 'cost',
    question: 'How much does a web application firewall cost?',
    answer:
      'Azion WAF uses transparent usage-based pricing where you only pay for requests analyzed by the WAF. Start with $300 in free credits to test the service with no credit card required. Pricing scales with your traffic volume, with no hidden fees, infrastructure costs, or vendor lock-in. Our distributed architecture eliminates the need for centralized cloud infrastructure, reducing costs and latency. Enterprise plans include custom rule development, dedicated support, and volume discounts. Most customers save 30-60% compared to traditional enterprise WAF solutions while eliminating infrastructure management costs entirely.'
  },
  {
    value: 'cdn-or-load-balancer',
    question: 'Do I need a WAF if I already have a CDN or load balancer?',
    answer:
      'Yes, CDNs and load balancers do not provide application-layer security against web attacks. While CDNs optimize content delivery and load balancers distribute traffic, they cannot detect or block SQL injection, XSS, or other OWASP Top 10 threats. Azion WAF integrates directly with our CDN and distributed platform, providing comprehensive security without adding latency. You get both performance optimization and enterprise-grade protection in a single platform, with security events analyzed before requests reach your origin servers.'
  }
]

export const WEB_APPLICATION_FIREWALL_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'long',
    eyebrow: 'WAF',
    title: 'Protect applications and APIs with rules you control',
    description:
      'Stop emerging threats on Azion’s distributed infrastructure without slowing your applications.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'FeatureWidgets',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'Protection applied to every request',
    description:
      'Threat types, the firewall rule that runs them, and exceptions for trusted traffic live in one versioned configuration. They deploy together.',
    actions: PRODUCT_HERO_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'ai ai-waf-rules',
        title: 'Turn on OWASP protection, tune the rules',
        description:
          'Start from preset OWASP protections, then tune sensitivity to cut false positives and keep applications available.',
        scene: { component: markRaw(WafThreatFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'ai ai-edge-firewall',
        title: 'Detect advanced threats with behavioral analysis',
        description:
          'Behavioral patterns and threat signatures catch zero-day vulnerabilities and OWASP Top 10 attacks. Use Learning Mode to validate protections before you enforce them.',
        scene: { component: markRaw(WafFirewallRuleFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-check-circle',
        title: 'Adapt protection to legitimate traffic',
        description:
          'Create Custom Allowed Rules for trusted traffic patterns. Malicious requests are still blocked before they reach your applications.',
        scene: { component: markRaw(WafAllowedRuleFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Stream security events for investigation and response',
        description:
          'Send security events to your SIEM, Splunk, Datadog, or analytics tools and see suspicious traffic and application threats fast.',
        href: PRODUCT_DOCS,
        illustration: 'stream-security-events-for-investigation-and-response',
        illustrationLabel:
          'Security events streamed in under 40 seconds to APIs, dashboards, SIEM and other interfaces',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      },
      {
        title: 'Extend protection with custom logic',
        description:
          'Write custom security rules with Functions for business-specific protections and automated mitigation. Extend WAF with your own detection logic or AI models.',
        href: '/site/products/functions',
        illustration: 'custom-rules-mitigation',
        illustrationLabel: 'A custom rule in code returning block, rate limit or alert',
        actions: [{ label: 'Functions', href: '/site/products/functions' }]
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'Protect critical applications and APIs',
    description:
      'Put WAF in front of any application or API and stop attacks on Azion’s distributed infrastructure, before they reach your origin. Teams use it to:',
    action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('magalu') },
  PLATFORM_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  PRODUCT_SECURITY_CLOSING
]
