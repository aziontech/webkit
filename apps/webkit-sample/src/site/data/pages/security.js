import { PRODUCT_STACK } from '@shared/ui/brand/strips.js'

import { EARTH_NETWORK, quotesLedBy } from '../solutions.js'
import { solutionPage } from './solution.js'

const HERO = {
  eyebrow: 'Application Security',
  title: 'Protect applications and APIs from AI-driven attacks',
  description:
    'One security platform on Azion’s distributed infrastructure. It stops DDoS attacks, exploits, malicious bots, fraud, and AI-driven threats before they reach your applications and APIs.'
}

const CAPABILITIES = [
  {
    icon: 'pi pi-globe',
    title: 'Defense at global scale',
    description:
      'Always-on mitigation blocks multiple hyper-volumetric attacks every day across Azion’s global distributed infrastructure.'
  },
  {
    icon: 'pi pi-shield',
    title: 'Instant hardening',
    description:
      'Active protection by default. Deploy enterprise-grade WAF, rate limiting, mTLS, Origin Shield, and Bot Manager with a single DNS change. No agents, no appliances.'
  },
  {
    icon: 'pi pi-microchip-ai',
    title: 'Programmable for AI agents',
    description:
      'Give AI agents the security controls and telemetry they need in real time. Build your own workflows or start from pre-built configurations.'
  },
  {
    icon: 'pi pi-verified',
    title: 'No zero-day exploits in 10 years',
    description:
      'Azion’s detection and blocking engine stops zero-day attacks. Unknown threats are blocked before they reach your code, with no custom rules or emergency patches.'
  },
  {
    icon: 'pi pi-objects-column',
    title: 'Unified control plane',
    description:
      'Manage WAF, API security, and bot protection from the console, API, Terraform, or CLI. One policy engine, not stitched-together tools.'
  },
  {
    icon: 'pi pi-bolt',
    title: 'No performance trade-off',
    description: 'Inline protection that keeps applications highly available and fast.'
  }
]

const USE_CASES = {
  title: 'Stop Threats Before They Reach Your Applications',
  items: [
    {
      illustration: 'request-inspection',
      title: 'Web Application and API Protection',
      description:
        'Protect web applications and APIs with WAF, Bot Manager, and DDoS Protection working together. Enforcement is consistent on every request, with no tool sprawl.'
    },
    {
      illustration: 'detect-and-classify',
      title: 'Bot Management',
      description:
        'Detect, classify, and control automated traffic before it reaches your applications. Block malicious bots and let real users and trusted bots through.'
    },
    {
      illustration: 'api-endpoints',
      title: 'AI and API Gateway',
      description:
        'Use Azion as the gateway for AI and API traffic. Enforce authentication, rate limiting, input validation, and consistent policies on every request.'
    },
    {
      illustration: 'intent-to-policy',
      title: 'Fraud and Abuse Prevention',
      description:
        'Stop credential stuffing, account takeover, scraping, and checkout abuse with AI-driven bot classification. Malicious automation is blocked; real users and trusted bots get through.'
    },
    {
      illustration: 'dns-protection',
      title: 'DNS Protection',
      description:
        'Keep domains online and trusted with authoritative Edge DNS. DDoS protection at the DNS layer and DNSSEC block spoofing, poisoning, and hijacking, with high availability built in.'
    }
  ]
}

const STACK = { label: 'Compatible With Your Stack', marks: PRODUCT_STACK }

const QUOTES = quotesLedBy(
  'magalu',
  'Azion shielded us from sophisticated cyberattacks and empowered us to modernize our infrastructure, reduce costs, and deliver the best shopping experiences to millions of customers.'
)

const FAQ = [
  {
    value: 'q1',
    question: 'What does Azion Firewall protect against?',
    answer:
      'Azion Firewall combines modules that each address a specific aspect of traffic inspection and threat mitigation: Web Application Firewall protects applications against threats, including zero-day attacks; Bot Manager stops malicious bots; Network Shield enforces network-layer protections; DDoS Protection mitigates DDoS attacks; and Functions adds a programmability layer to extend the Firewall, including with AI agents.'
  },
  {
    value: 'q2',
    question: 'How does Network Shield protect my applications?',
    answer:
      'Network Shield lets you configure Network Lists based on IP/CIDR, geolocation, and ASN, then apply rules based on those lists—such as blocking, allowing, or rate limiting traffic—to control who can reach your applications, and from where.'
  },
  {
    value: 'q3',
    question: 'What is the difference between Firewall and Web Application Firewall?',
    answer:
      "Firewall is Azion's unified security resource for protecting workloads on its globally distributed infrastructure. It combines modules such as Web Application Firewall, Bot Manager, Network Shield, DDoS Protection, and Functions. Web Application Firewall is one of those modules, focused specifically on protecting applications and APIs against web attacks, including the OWASP Top 10 and zero-day threats."
  },
  {
    value: 'q4',
    question: 'Can I create custom security logic?',
    answer:
      'Yes. With Functions, you can run your own security code integrated directly into Azion Firewall — and call Azion AI Inference to run security agents. For simpler customizations, the Firewall Rules Engine lets you build custom rules that analyze requests based on multiple parameters and decide what to do with them — block, rate limit, or return a custom response.'
  },
  {
    value: 'q5',
    question: 'How does API Gateway improve API security?',
    answer:
      'You can use Azion as the gateway for your APIs, enforcing security policies consistently across all of them from a single control plane while improving visibility across services.'
  },
  {
    value: 'q6',
    question: 'How does AI threat detection and takedown work?',
    answer:
      "Azion uses AI across its security products and lets you build your own AI agents. Using AI models, these agents detect phishing, abuse, and malicious content and automate takedown, running on Azion's distributed infrastructure."
  },
  {
    value: 'q7',
    question: 'What certifications does Azion provide?',
    answer:
      'Azion is PCI DSS certified and maintains compliance attestations such as SOC 2 Type 2 / SOC 3, while also complying with data protection regulations like GDPR and LGPD. These independent audits and attestations demonstrate the operational controls that protect your applications, APIs, and data.'
  }
]

const CTA = {
  eyebrow: 'Secure',
  title: 'Protected by default.',
  titleMuted: 'Always on.',
  description: 'Stronger protection, less attack exposure, less operational drag.'
}

export const SECURITY_PAGE = solutionPage({
  hero: HERO,
  capabilities: CAPABILITIES,
  useCases: USE_CASES,
  stack: STACK,
  quotes: QUOTES,
  primitivesTitle: 'All the Security Tools You Need',
  network: EARTH_NETWORK,
  faq: FAQ,
  cta: CTA
})
