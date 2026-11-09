import { BUILD_CTA, LEARNING_CENTER, quotesLedBy } from '../solutions.js'
import { solutionPage } from './solution.js'

const HERO = {
  eyebrow: 'Financial services',
  title: 'Fast financial applications, secure and compliant',
  description:
    "High availability, low latency, and advanced security for financial applications and APIs on Azion's distributed infrastructure. Reduce cloud costs, dependence on legacy CDNs, and operational complexity, with continuous compliance."
}

const CAPABILITIES = [
  {
    icon: 'pi pi-server',
    title: 'High availability',
    description:
      'Keep latency-sensitive financial applications and APIs running, with automatic scaling and real-time responses, even during transaction peaks.'
  },
  {
    icon: 'pi pi-shield',
    title: 'Advanced security',
    description:
      'Protect financial data and transactions with multilayer security built into the application. It mitigates API attacks, DDoS, and bots without adding operational complexity.'
  },
  {
    icon: 'pi pi-check-circle',
    title: 'Continuous compliance',
    description:
      'Meet regulatory requirements with consistent security policies and continuous auditing across distributed environments, without slowing performance or development.'
  }
]

const ARCHITECTURE = {
  title: 'Protect financial applications on a distributed architecture',
  illustration: 'protect-financial-applications',
  alt: 'Web application and API protection architecture diagram for the financial sector, showing security layers from the user to the origin.',
  href: 'https://www.azion.com/en/documentation/architectures/edge-firewall/web-application-and-api-protection-waap/'
}

const RESOURCES = {
  title: 'Guides and Resources',
  description:
    'Documentation, articles, and customer stories on building secure, compliant financial applications on a distributed architecture.',
  items: [
    {
      title: 'New to Azion? Start here',
      description: 'A guide to your first steps with Azion.',
      href: '/site/docs'
    },
    LEARNING_CENTER,
    {
      title: 'How Technology Can Help You Comply with Regulations for Fintech',
      description:
        'Distributed infrastructure brings security, compliance, and monitoring together for reliable, scalable operations.',
      href: 'https://www.azion.com/en/blog/how-technology-can-help-comply-with-regulations-for-fintech/'
    },
    {
      title: 'How Justa is evolving its technology to meet modern digital demands',
      description:
        'See how Justa uses the Azion Web Platform to improve security and performance in PIX and QR Code transactions.',
      href: 'https://www.azion.com/en/blog/how-justa-has-been-evolving-its-technology-to-meet-modern-digital-demands/'
    }
  ]
}

export const FINANCIAL_SERVICES_PAGE = solutionPage({
  hero: HERO,
  capabilities: CAPABILITIES,
  architecture: ARCHITECTURE,
  quotes: quotesLedBy('zoop'),
  resources: RESOURCES,
  compliance: true,
  primitivesTitle: 'Products that Scale with You',
  cta: BUILD_CTA
})
