<script setup>
  import { PRODUCT_STACK, SECURITY_CLIENT_STRIP } from '@shared/ui/brand/strips.js'

  import { quotesLedBy } from '../data/solutions.js'
  import SolutionPage from './SolutionPage.vue'

  const HERO = {
    eyebrow: 'Application Security',
    title: 'Protect your applications and APIs at the speed of AI',
    description:
      'A unified, globally distributed security platform that stops DDoS attacks, exploits, malicious bots, fraud, and AI-driven threats before they reach your applications and APIs.',
    carouselMarks: SECURITY_CLIENT_STRIP
  }

  const CAPABILITIES = [
    {
      icon: 'pi pi-globe',
      title: 'Planet-scale defense',
      description:
        'Battle-tested against the largest attacks. Always-on mitigation autonomously blocks multiple hyper-volumetric attacks every day across our globally distributed infrastructure.'
    },
    {
      icon: 'pi pi-shield',
      title: 'Instant hardening',
      description:
        'Active protection by default. Deploy enterprise-grade WAF, rate limiting, mTLS, Origin Shield, and Bot Manager with a single DNS change — no agents, no appliances.'
    },
    {
      icon: 'pi pi-microchip-ai',
      title: 'AI-native programmability',
      description:
        'Real-time programmability for agentic AI. Give AI agents the security controls and telemetry they need — build your own workflows or start from pre-built configurations.'
    },
    {
      icon: 'pi pi-verified',
      title: 'No zero-day exploits in 10 years',
      description:
        'Our unique detection and blocking engine is built to stop zero-day attacks, blocking unknown threats before they reach your code without custom rules or emergency patches.'
    },
    {
      icon: 'pi pi-objects-column',
      title: 'Unified control plane',
      description:
        'Manage WAF, API security, and bot protection from the console, API, Terraform, or CLI — one policy engine, not stitched-together tools.'
    },
    {
      icon: 'pi pi-bolt',
      title: 'No performance trade-off',
      description:
        'Inline protection that boosts application performance — applications stay highly available and run faster than any cloud.'
    }
  ]

  const USE_CASES = {
    title: 'Stop Threats Before They Reach Your Applications',
    items: [
      {
        illustration: 'implement-api-gateway-security',
        title: 'Web Application and API Protection',
        description:
          'Protect web applications and APIs with WAF, Bot Manager, and DDoS Protection working as one — consistent enforcement on every request, without tool sprawl.'
      },
      {
        illustration: 'automate-threat-mitigation',
        title: 'Bot Management',
        description:
          'Detect, classify, and control automated traffic before it reaches your applications — block malicious bots while allowing real users and trusted bots through.'
      },
      {
        illustration: 'distributed-apis',
        title: 'AI and API Gateway',
        description:
          'Secure and control AI and API traffic with Azion as your gateway — enforcing authentication, rate limiting, input validation, and consistent policies across every request.'
      },
      {
        illustration: 'protect-financial-applications',
        title: 'Fraud and Abuse Prevention',
        description:
          'Stop credential stuffing, account takeover, scraping, and checkout abuse with AI-driven bot classification — blocking malicious automation while letting real users and trusted bots through.'
      },
      {
        illustration: 'dns-protection',
        title: 'DNS Protection',
        description:
          'Keep domains online and trusted with authoritative Edge DNS — native DDoS protection at the DNS layer and DNSSEC that blocks spoofing, poisoning, and hijacking, with high availability built in.'
      }
    ]
  }

  const STACK = { label: 'Compatible With Your Stack', marks: PRODUCT_STACK }

  const QUOTES = quotesLedBy(
    'magalu',
    'Azion shielded us from sophisticated cyberattacks and empowered us to modernize our infrastructure, reduce costs, and deliver the best shopping experiences to millions of customers.'
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
        "Azion uses AI across its security products — and, beyond that, lets you build your own AI agents. Using AI models, these agents can detect phishing, abuse, and malicious content and automate takedown, running on Azion's distributed infrastructure."
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
    description: 'Get stronger protection, less attack exposure, and less operational overhead.'
  }
</script>

<template>
  <SolutionPage
    :hero="HERO"
    :capabilities="CAPABILITIES"
    :use-cases="USE_CASES"
    :stack="STACK"
    :quotes="QUOTES"
    primitives-title="All the Security Primitives You Need"
    :network="NETWORK_BAND"
    :faq="FAQ"
    :cta="CTA"
  />
</template>
