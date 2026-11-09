import { BUILD_CTA, LEARNING_CENTER, quotesLedBy } from '../solutions.js'
import { solutionPage } from './solution.js'

const HERO = {
  eyebrow: 'Technology',
  title: 'Build high-performance applications',
  description:
    "Build APIs and microservices on Azion's distributed infrastructure. Get low latency, scale through traffic spikes, and security for serverless applications, with less operational complexity and processing close to users."
}

const CAPABILITIES = [
  {
    icon: 'pi pi-bolt',
    title: 'API performance',
    description:
      'Build high-performance APIs and microservices with low latency and automatic scaling, and keep response times steady during traffic spikes.'
  },
  {
    icon: 'pi pi-shield',
    title: 'API security',
    description:
      'Protect APIs and services with multilayer security built into the distributed infrastructure, with automated threat detection and real-time monitoring.'
  },
  {
    icon: 'pi pi-code',
    title: 'Modern development',
    description:
      'Create serverless applications with your preferred frameworks. Code runs close to users, and deployments and operations stay simple.'
  }
]

const ARCHITECTURE = {
  title: 'Implement API Gateway security on a distributed architecture',
  illustration: 'implement-api-gateway-security',
  alt: 'API Gateway Security Architecture Diagram',
  href: 'https://www.azion.com/en/documentation/architectures/api-gateways/implement-api-gateways-security/'
}

const RESOURCES = {
  title: 'Guides and Resources',
  description:
    'Documentation and articles on building, securing, and scaling modern applications on a distributed architecture.',
  items: [
    {
      title: 'New to Azion? Start here',
      description: 'A guide to your first steps with Azion.',
      href: '/site/docs'
    },
    LEARNING_CENTER,
    {
      title: 'Build modern applications with Functions',
      description: 'Create serverless functions that run close to users.',
      href: 'https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/'
    },
    {
      title: 'SQL Database for modern applications',
      description:
        'Build data-driven applications with SQL Database on a distributed architecture.',
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
  primitivesTitle: 'Products that Scale with You',
  cta: BUILD_CTA
})
