import { markRaw } from 'vue'

import NetworkShieldIpListFragment from '../../ui/mockup/widgets/NetworkShieldIpListFragment.vue'
import NetworkShieldListsFragment from '../../ui/mockup/widgets/NetworkShieldListsFragment.vue'
import NetworkShieldRuleFragment from '../../ui/mockup/widgets/NetworkShieldRuleFragment.vue'
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
    title: 'Block traffic before origin',
    description:
      'Use Network Lists of IP addresses, CIDR blocks, ASNs, and countries combined with Rules Engine to create layered defense policies.'
  },
  {
    icon: 'pi pi-dollar',
    title: 'Eliminate bandwidth waste from attacks',
    description:
      'Block abusive traffic on the Azion Web Platform so your origin servers never process malicious requests.'
  },
  {
    icon: 'pi pi-clock',
    title: 'Propagate rules in seconds',
    description:
      'Update Network Lists via Console or API and see changes live across all locations in seconds. No service interruptions, no downtime windows.'
  }
]

const USE_CASES = [
  {
    icon: 'ai ai-data-stream',
    title: 'Automate threat response',
    description:
      'Stream events to your SIEM in real time and trigger automated playbooks to update Network Lists via API. Changes propagate in seconds.',
    href: '/site/solutions/security'
  },
  {
    icon: 'ai ai-origin-shield',
    title: 'Lock down your infrastructure',
    description:
      "Use Origin Shield to restrict inbound traffic to your origin servers exclusively from Azion's trusted IP addresses. The dynamic Network List is maintained by Azion and updated automatically.",
    href: '/site/solutions/web-apps'
  },
  {
    icon: 'pi pi-eye-slash',
    title: 'Block anonymized traffic',
    description:
      "Use Azion-managed lists like the Tor Exit Nodes list, which is automatically maintained and updated by Azion's security team.",
    href: '/site/solutions/financial-services'
  },
  {
    icon: 'ai ai-waf-rules',
    title: 'Combine with WAF',
    description:
      'Network Shield blocks known bad actors and regions, while WAF inspects the content of allowed requests for application-level threats.',
    href: PRODUCT_DOCS
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is Network Shield and how does it work?',
    answer:
      "Network Shield is a Firewall module on the Azion Web Platform that provides programmable network-layer protection. It allows you to create Network Lists based on IP/CIDR addresses, Autonomous System Numbers (ASNs), and countries (geolocation), then reference those lists in the Firewall Rules Engine to block, deny, or rate-limit traffic. When a request arrives at an Azion location, it's evaluated against your configured rules and network lists , filtering out known offenders before the request reaches your infrastructure."
  },
  {
    value: 'vs-waf',
    question: 'What is the difference between Network Shield and a Web Application Firewall (WAF)?',
    answer:
      "Network Shield operates at the network layer (Layer 3/4), filtering traffic based on IP addresses, CIDR blocks, ASNs, and geolocation before requests are processed. WAF operates at the application layer (Layer 7), analyzing HTTP/HTTPS request content to detect attacks like SQL injection and XSS. Both are modules within Azion's Firewall and can be combined in the same firewall configuration for comprehensive protection — Network Shield blocks known bad actors and regions, while WAF inspects the content of allowed requests for application-level threats."
  },
  {
    value: 'list-types',
    question: 'What types of Network Lists can I create?',
    answer:
      "Network Shield supports three types of Network Lists: IP/CIDR lists for blocking or allowing specific IP addresses and CIDR ranges, ASN lists for filtering traffic by Autonomous System Number (groups of IP networks managed by specific operators), and Country lists for geolocation-based access control. You can also use Azion-managed lists like the Tor Exit Nodes list, which is automatically maintained and updated by Azion's security team."
  },
  {
    value: 'propagation',
    question: 'How quickly do Network List updates propagate?',
    answer:
      "Network List updates propagate across Azion's entire global infrastructure in seconds. When you update a list via Console or API, changes are automatically applied to all firewalls that reference that list — without any service interruption or downtime window. This near-instant propagation enables real-time threat response, allowing your security automation tools to update blocklists and see immediate effects across all locations."
  },
  {
    value: 'share-lists',
    question: 'Can I share Network Lists across multiple firewalls?',
    answer:
      'Yes. A single Network List can be associated with multiple firewalls and rules. When you update the list, changes propagate automatically to all associated firewalls. This centralized management approach ensures consistent security policies across all your applications without duplicating configuration or risking policy drift between environments.'
  },
  {
    value: 'origin-shield',
    question: 'What is Origin Shield and how does it relate to Network Shield?',
    answer:
      "Origin Shield is a security add-on that provides a dynamic Network List containing all IP/CIDR addresses used by Azion's infrastructure. By configuring your origin server's firewall to accept traffic only from Origin Shield addresses, you create a Layer 3/4 perimeter that blocks all direct external access to your origin. Origin Shield requires the Network Shield module to be enabled and is maintained automatically by Azion, with clients notified 7 days before any changes to the IP list."
  },
  {
    value: 'cost',
    question: 'How much does Network Shield cost?',
    answer:
      "Network Shield is included as a module within Azion's Firewall product. You can start with $300 in free credits to test the service with no credit card required. Pricing is usage-based with no hidden fees or infrastructure costs. Since Network Shield blocks unwanted traffic before it reaches your infrastructure, most customers see significant cost savings on bandwidth and infrastructure. For detailed pricing, visit the pricing page."
  },
  {
    value: 'automation',
    question: 'Can I automate Network List updates with my SIEM or security tools?',
    answer:
      'Yes. Network Shield integrates with your existing security infrastructure through the Azion API. Stream security events in real time to your SIEM using Data Stream, then use automated playbooks to update Network Lists via API with effects propagated in seconds. You can also use Functions to implement programmable per-request logic, enabling dynamic threat response that adapts to evolving attack patterns without manual intervention.'
  }
]

export const NETWORK_SHIELD_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'long',
    eyebrow: 'Network Shield',
    title: 'Block threats at the network layer before origin',
    description:
      "Programmable network-layer protection on Azion's distributed architecture. Filter traffic by IP/CIDR, ASN, and geolocation before it reaches your origin.",
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'WidgetGrid',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'Network lists every firewall can reference',
    description:
      'Lists of IPs, ASNs and countries, the firewall rules that match them and the entries your tools add live in one versioned configuration, deployed together.',
    actions: PRODUCT_HERO_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'pi pi-server',
        title: 'Protect any environment consistently',
        description:
          'One set of rules protects workloads across AWS, GCP, Azure, on-premises data centers, and hybrid architectures.',
        scene: { component: markRaw(NetworkShieldRuleFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-cog',
        title: 'Share lists across firewalls',
        description:
          'Create a catalog of Network Lists and reference them across multiple Firewall configurations. Update once, propagate everywhere.',
        scene: { component: markRaw(NetworkShieldListsFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-chart-line',
        title: 'Automate threat response at scale',
        description:
          'Stream security events to your SIEM and trigger automated playbooks to update Network Lists via API.',
        scene: { component: markRaw(NetworkShieldIpListFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Programmable network-layer security',
        description:
          'Define access policies with lists that combine IP addresses, CIDR blocks, geolocation, ASNs, and reputation scores. Reference these lists directly in the Firewall Rules Engine. Updates propagate automatically across all associated firewalls, with no service interruption.',
        href: PRODUCT_DOCS,
        illustration: 'programmable-security',
        illustrationLabel: 'A shield and a code block standing between Azion and the application',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      },
      {
        title: 'Rule-based traffic control with centralized list management',
        description:
          'Create custom allowlists and blocklists using IPs, CIDR blocks, ASNs, countries, or Azion-managed lists like Tor Exit Nodes. Segment access by region or network type, and share the same lists across multiple firewalls for consistent policies at scale.',
        href: '/site/products/firewall',
        illustration: 'implement-api-gateway-security',
        illustrationLabel: 'Users and API traffic passing a row of checkpoints before the server',
        actions: [{ label: 'Firewall', href: '/site/products/firewall' }]
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'Block threats at the network layer, before they consume resources',
    description:
      'Put Network Shield in front of any origin and filter traffic by IP, ASN and country on Azion’s distributed infrastructure, before it reaches your servers. Teams use it to:',
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
