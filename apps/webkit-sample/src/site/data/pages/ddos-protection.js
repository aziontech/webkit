import { markRaw } from 'vue'

import DdosFirewallModulesFragment from '../../ui/mockup/widgets/DdosFirewallModulesFragment.vue'
import DdosHttpEventsFragment from '../../ui/mockup/widgets/DdosHttpEventsFragment.vue'
import DdosRequestsMetricFragment from '../../ui/mockup/widgets/DdosRequestsMetricFragment.vue'
import {
  PLATFORM_DIRECTORY,
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const PILLARS = [
  {
    icon: 'pi pi-verified',
    title: 'Guarantee application uptime',
    description:
      'Maintain service availability for applications, content, and origin infrastructure with a 100% uptime SLA.'
  },
  {
    icon: 'pi pi-shield',
    title: 'Block multi-layer attacks',
    description:
      'Mitigate orchestrated attacks across layers 3, 4, 6, and 7 before they reach your infrastructure.'
  },
  {
    icon: 'pi pi-arrow-up-right-and-arrow-down-left-from-center',
    title: 'Scale protection limitlessly',
    description:
      'Handle attacks of any volume without performance impact on legitimate customer traffic.'
  }
]

const USE_CASES = [
  {
    icon: 'pi pi-shopping-cart',
    title: 'Protect e-commerce during traffic spikes',
    description:
      'Mitigate volumetric attacks during Black Friday and flash sales, keeping checkout available for real customers while blocking malicious traffic.',
    href: '/site/solutions/retail'
  },
  {
    icon: 'pi pi-dollar',
    title: 'Secure banking APIs from application-layer attacks',
    description:
      'Detect and block HTTP flood attacks targeting financial APIs without degrading response times for legitimate transactions.',
    href: '/site/solutions/financial-services'
  },
  {
    icon: 'pi pi-play',
    title: 'Maintain streaming availability under attack',
    description:
      'Protect media streaming platforms from bandwidth exhaustion attacks that target live events and high-demand content.',
    href: '/site/solutions/streaming'
  },
  {
    icon: 'pi pi-cloud',
    title: 'Protect SaaS platforms at scale',
    description:
      'Apply distributed DDoS protection across multi-tenant environments with security policies that scale automatically with traffic.',
    href: '/site/solutions/technology'
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is DDoS Protection and how does it work?',
    answer:
      'DDoS Protection is a security capability that defends applications and infrastructure from Distributed Denial of Service attacks. It monitors network traffic at layers 3, 4, 6, and 7, using pattern recognition, signature algorithms, and Deep Packet Inspection (DPI) to detect malicious traffic. When an attack is identified, traffic is automatically diverted through global scrubbing centers that filter malicious requests while allowing legitimate traffic to reach your applications.'
  },
  {
    value: 'under-attack',
    question: "I'm under attack. What should I do?",
    answer:
      "Your system is under attack right now? Get immediate expert help. What happens next: Connect with our security specialists instantly, real-time attack analysis and threat identification, custom security rules deployed to block the attack, and advanced protection activated immediately. Don't wait—every second counts during an active attack."
  },
  {
    value: 'existing-tools',
    question: 'Can I use DDoS Protection alongside my existing security tools?',
    answer:
      'Yes. Azion DDoS Protection integrates with your existing security stack and operates as part of a unified security platform—combine DDoS Protection with WAF, Bot Manager, Network Shield, and custom Functions for comprehensive protection. Stream security events to your SIEM via Data Stream for centralized visibility across all security tools, reducing operational complexity while strengthening your security posture.'
  },
  {
    value: 'attack-types',
    question: 'What types of DDoS attacks does Azion protect against?',
    answer:
      'Azion DDoS Protection defends against volumetric attacks (UDP floods, ICMP floods, amplification attacks), protocol attacks (SYN floods, packet floods, ping of death), and application-layer attacks (HTTP floods, slowloris, DNS query floods). The system monitors traffic at layers 3, 4, 6, and 7, with automated mitigation in under 3 seconds across all attack types. Unlimited bandwidth protection ensures availability regardless of attack volume.'
  },
  {
    value: 'deploy-time',
    question: 'How long does it take to deploy DDoS Protection?',
    answer:
      "Azion DDoS Protection deploys in under 30 minutes with no hardware provisioning required. Simply configure your DNS to point to Azion's network and enable DDoS Protection in the console. Always-on protection is automatically active—no manual intervention needed during attacks. Unlike traditional DDoS mitigation services that require manual activation, Azion provides continuous protection that responds automatically within seconds."
  },
  {
    value: 'performance',
    question: 'Does DDoS Protection affect application performance?',
    answer:
      "No. Azion DDoS Protection operates on a globally distributed infrastructure that filters malicious traffic before it reaches your origin. Legitimate traffic experiences minimal latency while malicious traffic is blocked at scrubbing centers worldwide. The system mitigates attacks in under 3 seconds without performance degradation for real users. Unlike legacy DDoS solutions that route all traffic through centralized scrubbing centers, Azion's distributed architecture maintains performance even during large-scale attacks."
  },
  {
    value: 'cost',
    question: 'How much does DDoS Protection cost?',
    answer:
      'Azion DDoS Protection is included with the platform at no additional cost for basic mitigation. Start with $300 in free credits to test the service with no credit card required. Pricing scales with your traffic volume with unlimited mitigation bandwidth—no surprise charges during attacks. Our distributed architecture eliminates the need for separate DDoS infrastructure, reducing costs and operational complexity compared to standalone DDoS services.'
  },
  {
    value: 'with-waf',
    question: 'Do I need DDoS Protection if I already have a WAF?',
    answer:
      "Yes. While WAF protects against application-layer attacks like SQL injection and XSS, it cannot defend against volumetric and protocol-level DDoS attacks that overwhelm infrastructure. Azion's unified security platform combines DDoS Protection with WAF, Bot Manager, and Network Shield for comprehensive coverage across all attack vectors. Each protection layer addresses different threat types—DDoS Protection handles volumetric attacks while WAF focuses on application-layer exploits."
  }
]

export const DDOS_PROTECTION_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'long',
    eyebrow: 'DDoS Protection',
    title: 'Security that never sleeps, protection that never slows',
    description:
      'Automatically detect and stop DDoS attacks in real time without impacting application performance.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'WidgetGrid',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'Always-on protection in every firewall',
    description:
      'DDoS Protection runs in every firewall beside the modules it works with, and the traffic it absorbs shows up in metrics and events as it happens.',
    actions: PRODUCT_HERO_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'pi pi-cog',
        title: 'Reduce security complexity',
        description:
          'Consolidate DDoS protection into a unified security platform instead of managing separate tools, with Network Shield and WAF one switch away.',
        scene: { component: markRaw(DdosFirewallModulesFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-bolt',
        title: 'Respond in under 3 seconds',
        description:
          'Detect and mitigate attacks automatically with always-on protection across the global network, and read every spike in Real-Time Metrics.',
        scene: { component: markRaw(DdosRequestsMetricFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-chart-bar',
        title: 'Monitor attacks in real time',
        description:
          'Query every request in Real-Time Events and stream security events to SIEM platforms for unified visibility and faster incident response.',
        scene: { component: markRaw(DdosHttpEventsFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Detect threats continuously across all layers',
        description:
          'Monitor network flows at layers 3, 4, 6, and 7 using advanced pattern recognition and signature algorithms. Deep Packet Inspection (DPI) and AI-powered analysis detect abnormal traffic behavior with minimal false positives—inspecting requests in real time to identify both single-IP attacks and large-scale botnet assaults.',
        href: PRODUCT_DOCS,
        illustration: 'automate-threat-mitigation',
        illustrationLabel: 'Traffic passing a line of inspection steps before the origin',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      },
      {
        title: 'Mitigate attacks automatically with secure routing',
        description:
          'SDN algorithms divert malicious traffic through global scrubbing centers, while MANRS-compliant routing prevents BGP hijacking and IP spoofing. Automated mitigation protects across network, transport, and application layers.',
        href: '/site/products/our-network',
        illustration: 'global-network',
        illustrationLabel: 'Traffic routed across a global network of locations',
        actions: [{ label: 'Our Network', href: '/site/products/our-network' }]
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'Protect critical applications and infrastructure',
    description:
      'Put DDoS Protection in front of any application or infrastructure and absorb attacks on Azion’s distributed infrastructure, before they reach your origin. Teams use it to:',
    action: { label: 'View docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('magalu') },
  PLATFORM_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  {
    ...PRODUCT_CLOSING,
    eyebrow: 'Protect',
    title: 'Protected by default.',
    titleMuted: 'Always on.',
    description: 'Get stronger protection, less attack exposure, and less operational overhead.'
  }
]
