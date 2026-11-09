import { CLIENTS } from '@aziontech/webkit/assets/client-registry'
import gdprBadge from '@aziontech/webkit/assets/gdpr-symbol-color.svg'
import lgpdBadge from '@aziontech/webkit/assets/lgpd-symbol-color.svg'
import pciDssBadge from '@aziontech/webkit/assets/pci-dss-symbol-color.svg'
import socBadge from '@aziontech/webkit/assets/soc-symbol-color.svg'
import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'

import { AREZZO, AXUR, CONTABILIZEI, CREFISA } from '../../clients.js'

const registered = (name) => CLIENTS.find((client) => client.name === name) ?? { name }

const wallItem = (client) => ({ alt: client.name, src: client.logo ?? '', client })

export default {
  lang: 'en',
  source: 'https://www.azion.com/en/lp/secure-mock-page/',
  sections: [
    {
      section: 'Heroes',
      kind: 'centered-carousel',
      titleLength: 'long',
      title: 'Protect applications on a globally distributed platform',
      description:
        'A unified security platform that blocks bots and DDoS attacks that protects your application without compromising performance.',
      actions: [{ label: 'Start Free', href: '/signup', kind: 'secondary' }],
      carouselMarks: CLIENT_STRIP,
      carouselLabel: ''
    },
    {
      section: 'MediaSplitBand',
      title: 'Detect threads before they reach your application',
      illustration: 'request-inspection',
      actions: [
        { label: 'Start Free', href: '/signup' },
        { label: 'Talk to a Specialist', href: '/site/contact' }
      ]
    },
    {
      section: 'CapabilityGrid',
      items: [
        {
          icon: 'pi pi-sparkles',
          title: 'AI Native Security',
          description: 'Auto detect bots and attacks before they hit your Application'
        },
        {
          icon: 'pi pi-globe',
          title: 'Global Coverage',
          description: 'Protect and distribute your traffic among 100+ locations'
        },
        {
          icon: 'pi pi-verified',
          title: 'Enterprise Compliance',
          description: 'Nativelly certified for SOC 2 Type 3 / SOC 3, PCI and others.'
        }
      ]
    },
    {
      section: 'MediaSplitStack',
      kind: 'alternating',
      eyebrow: 'Safe by default',
      title: 'The Security Platform for Modern Applications',
      bands: [
        {
          title: 'DDoS Protection',
          description:
            'Adaptive DDoS mitigation. Native DNS protection against DDoS, spoofing, poisoning, and hijacking.',
          illustration: 'dns-protection'
        },
        {
          title: 'Firewall',
          description:
            'Managed WAF. Enterprise-grade defense against zero-day threats and emerging vulnerabilities with a Shared Threat Intelligence',
          illustration: 'enable-owasp-protection-with-customizable-rules'
        },
        {
          title: 'Bot Management',
          description:
            'Use AI to protect you from Bad Bots. Classify bots with AI intelligence. Block scrapers, credential stuffers, DDoS automatically. Control your traffic',
          illustration: 'detect-and-classify'
        },
        {
          title: 'Network Protection',
          description:
            'Protect before they hit your application. Restrict origin access to trusted traffic and reduce direct exposure.',
          illustration: 'network-lists-rules-engine'
        },
        {
          title: 'Certificates',
          description:
            'Simplify Certificate Management. Bring Your Own Certificate or automatically issue a new free certificate.',
          illustration: 'stay-in-control'
        }
      ]
    },
    {
      section: 'ComplianceBadges',
      eyebrow: "We've got you covered",
      title: 'Compliant with your current and future needs',
      description: '',
      certifications: [
        { label: 'SOC 2 Type 2', badge: socBadge, alt: 'AICPA SOC 2 Type 2 badge' },
        { label: 'SOC 3', badge: socBadge, alt: 'AICPA SOC 3 badge' },
        { label: 'PCI DSS', badge: pciDssBadge, alt: 'PCI DSS badge' },
        { label: 'GDPR', badge: gdprBadge, alt: 'GDPR' },
        { label: 'LGPD', badge: lgpdBadge, alt: 'LGPD badge' }
      ],
      more: null
    },
    {
      section: 'LogoWallQuote',
      eyebrow: 'Trusted by Enteprises',
      title: 'Battle tested on the biggest Banks and E-commerces',
      ariaLabel: 'Banks and e-commerce companies running on Azion',
      items: [
        wallItem(registered('NZN')),
        wallItem(AXUR),
        wallItem(registered('Radware')),
        wallItem(AREZZO),
        wallItem(CONTABILIZEI),
        wallItem(registered('Magalu')),
        wallItem(registered('Fourbank')),
        wallItem(CREFISA),
        wallItem(registered('Netshoes')),
        wallItem(registered('Dafiti')),
        wallItem(registered('Global Fashion Group'))
      ],
      quote: {
        text: 'Azion shielded us from sophisticated cyberattacks and empowered us to modernize our infrastructure, reduce costs, and deliver the best shopping experiences to millions of customers.',
        name: 'Allan Monteiro',
        jobTitle: 'CISO & Head of Technology',
        client: registered('GPA')
      }
    },
    {
      section: 'PlatformDirectory',
      title: 'All the Security Primitives you need',
      ariaLabel: 'Azion security primitives',
      groups: [
        {
          label: 'Compute',
          items: [
            {
              icon: 'ai ai-edge-functions',
              title: 'Functions',
              description: 'Run serverless code closer to users',
              href: '/site/products/functions'
            },
            {
              icon: 'ai ai-durable-objects',
              title: 'Durable Objects',
              description: 'Stateful compute, deployed worldwide',
              href: 'https://www.azion.com/en/products/durable-objects/'
            },
            {
              icon: 'ai ai-rules-engine',
              title: 'Rules Engine',
              description: 'Automate request handling with programmable rules',
              href: 'https://www.azion.com/en/documentation/products/build/applications/rules-engine/'
            },
            {
              icon: 'ai ai-load-balancer',
              title: 'Load Balancer',
              description: 'Distribute traffic for performance and availability',
              href: '/site/products/load-balancer'
            },
            {
              icon: 'ai ai-image-processor',
              title: 'Image Processor',
              description: 'Optimize and transform images in real time',
              href: '/site/products/image-processor'
            }
          ]
        },
        {
          label: 'AI',
          items: [
            {
              icon: 'ai ai-edge-ai',
              title: 'AI Inference',
              description: 'Run AI models closer to users',
              href: '/site/products/ai-inference'
            },
            {
              icon: 'ai ai-ai-gateway',
              title: 'AI Gateway',
              description: 'Secure, manage, and optimize AI traffic',
              href: '/site/products/ai-gateway'
            }
          ]
        },
        {
          label: 'Data',
          items: [
            {
              icon: 'ai ai-edge-storage',
              title: 'Object Storage',
              description: 'Scalable, durable storage for unstructured data',
              href: 'https://www.azion.com/en/products/object-storage/'
            },
            {
              icon: 'ai ai-edge-sql',
              title: 'SQL Database',
              description: 'Relational database built for distributed applications',
              href: '/site/products/sql-database'
            },
            {
              icon: 'ai ai-edge-kv',
              title: 'KV Store',
              description: 'Globally distributed, low-latency key-value store',
              href: '/site/products/kv-store'
            },
            {
              icon: 'ai ai-tiered-cache',
              title: 'Cache',
              description: 'Accelerate content delivery and reduce origin load',
              href: '/site/products/cache'
            }
          ]
        },
        {
          label: 'Security',
          items: [
            {
              icon: 'ai ai-edge-firewall',
              title: 'Web Application Firewall',
              description: 'Protect human and AI applications from threats',
              href: '/site/products/waf'
            },
            {
              icon: 'ai ai-azion-api',
              title: 'API Gateway',
              description: 'Secure, manage, and scale API traffic',
              href: 'https://www.azion.com/en/documentation/use-cases/secure-applications-and-networks/protect-public-apis-from-abuse/'
            },
            {
              icon: 'ai ai-bot-manager',
              title: 'Bot Manager',
              description: 'Detect and stop automated threats instantly',
              href: '/site/products/bot-manager'
            },
            {
              icon: 'ai ai-edge-dns',
              title: 'DNS',
              description: 'Reliably host authoritative DNS zones worldwide',
              href: '/site/products/edge-dns'
            }
          ]
        }
      ]
    },
    {
      section: 'FaqSection',
      title: 'Frequently Asked Questions',
      items: [
        {
          value: 'firewall',
          question: 'What does Azion Firewall protect against?',
          answer:
            'Azion Firewall helps protect applications and APIs against common web attacks such as SQL injection, XSS, CSRF, remote file inclusion, and protocol abuse. It combines managed WAF protections with custom rules and rate limiting to reduce risk before traffic reaches your infrastructure.'
        },
        {
          value: 'network-shield',
          question: 'How does Network Shield protect my origin?',
          answer:
            'Network Shield helps keep your origin private and harder to reach directly from the public internet. You can restrict access with Signed URLs, IP allowlisting, private backbone connectivity, and origin monitoring to reduce exposure and improve resilience.'
        },
        {
          value: 'firewall-vs-network-shield',
          question: 'What is the difference between Firewall and Network Shield?',
          answer:
            "Firewall is Azion's unified security resource for protecting workloads on its globally distributed infrastructure. It combines modules such as Web Application Firewall, Bot Manager, Network Shield, and Functions. Network Shield is one of those modules, focused on programmable network-layer policies to control who can access your applications, and from where."
        },
        {
          value: 'custom-logic',
          question: 'Can I create custom security logic?',
          answer:
            'Yes. You can build custom protections with Firewall Rules Engine and Functions using request attributes such as headers, cookies, query strings, URI, IP, ASN, and geolocation. That allows you to block, rate limit, return custom responses, or execute JavaScript across the distributed network.'
        },
        {
          value: 'api-gateway',
          question: 'How does API Gateway improve API security?',
          answer:
            'API Gateway creates a centralized entry point for API traffic, making it easier to enforce authentication, routing, rate limiting, and request controls consistently. It helps security teams and developers apply policies in one place while improving visibility across services.'
        },
        {
          value: 'ai-threat-detection',
          question: 'How does AI threat detection and takedown work?',
          answer:
            'Azion can use AI models to analyze digital assets, detect phishing, abuse, and malicious content, and automate classification and response workflows. This helps security teams identify threats faster and coordinate takedown actions across distributed environments.'
        },
        {
          value: 'certifications',
          question: 'What certifications does Azion provide?',
          answer:
            'Azion provides certifications such as SOC 2 Type 2 and PCI DSS to support customers with security, governance, and compliance requirements. These attestations help demonstrate operational controls for protecting applications, APIs, and digital assets.'
        }
      ]
    },
    {
      section: 'ClosingCallToAction',
      kind: 'split',
      eyebrow: 'Secure',
      title: 'Protected by default.',
      titleMuted: 'Always on.',
      description: 'Get stronger protection, less attack exposure, and less operational overhead.',
      actions: [{ label: 'Start free', href: '/signup', kind: 'secondary' }],
      aside: { label: 'Talk to a specialist', href: '/site/contact' }
    }
  ]
}
