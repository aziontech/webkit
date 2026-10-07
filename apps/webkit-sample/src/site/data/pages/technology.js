import { BUILD_CLIENT_STRIP } from '@shared/ui/brand/strips.js'

import { BUILD_CTA, LEARNING_CENTER, quotesLedBy } from '../solutions.js'
import { solutionPage } from './solution.js'

const HERO = {
  eyebrow: 'Technology',
  title: 'Build high-performance applications',
  description:
    'Develop modern applications with high-performance APIs and microservices on distributed infrastructure. Ensure low latency, scalability during traffic spikes, and advanced security for serverless applications, reducing operational complexity and bringing processing closer to users.',
  carouselMarks: BUILD_CLIENT_STRIP
}

const CAPABILITIES = [
  {
    icon: 'pi pi-bolt',
    title: 'API performance',
    description:
      'Build high-performance APIs and microservices with low latency and automatic scalability, maintaining consistency even during traffic spikes.'
  },
  {
    icon: 'pi pi-shield',
    title: 'API security',
    description:
      'Protect APIs and services with multilayer security integrated into distributed infrastructure, with automated threat detection and real-time monitoring.'
  },
  {
    icon: 'pi pi-code',
    title: 'Modern development',
    description:
      'Create serverless applications using your preferred frameworks, running code closer to users while simplifying deployments and operations.'
  }
]

const ARCHITECTURE = {
  title: 'Implement API Gateway security on distributed infrastructure',
  illustration: 'implement-api-gateway-security',
  alt: 'API Gateway Security Architecture Diagram',
  href: 'https://www.azion.com/en/documentation/architectures/api-gateways/implement-api-gateways-security/'
}

const RESOURCES = {
  title: 'Guides and Resources',
  description:
    'Documentation and articles on building, securing, and scaling modern applications on distributed infrastructure.',
  items: [
    {
      title: 'New at Azion? Start your Azion journey seamlessly',
      description: 'This documentation will guide you through your first steps with Azion.',
      href: '/site/docs'
    },
    LEARNING_CENTER,
    {
      title: 'Build modern applications with Functions',
      description: 'Learn how to create serverless functions that run closer to users.',
      href: 'https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/'
    },
    {
      title: 'SQL Database for modern applications',
      description:
        'Discover how to leverage SQL Database to build data-driven applications on distributed infrastructure.',
      href: 'https://www.azion.com/en/documentation/products/store/edge-sql/'
    }
  ]
}

export const TECHNOLOGY_PAGE = solutionPage({
  hero: HERO,
  capabilities: CAPABILITIES,
  architecture: ARCHITECTURE,
  quotes: quotesLedBy('contabilizei'),
  resources: RESOURCES,
  compliance: true,
  primitivesTitle: 'Primitives that Scale with You',
  cta: BUILD_CTA
})
