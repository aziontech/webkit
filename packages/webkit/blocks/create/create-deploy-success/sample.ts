import type {
  DeploySuccessDeployment,
  DeploySuccessNextStep,
  DeploySuccessResource
} from './create-deploy-success.vue'

export const sampleDeployment: DeploySuccessDeployment = {
  name: 'web-app',
  created: 'Created just now',
  domain: 'web-app-k3x9q2.example.com',
  url: 'https://web-app-k3x9q2.example.com',
  addDomainHref: '/services/1482736015?name=web-app&tab=settings',
  source: {
    scope: 'acme',
    icon: 'az az-github',
    repository: 'acme/web-app',
    href: 'https://github.com/acme/web-app',
    branch: 'main'
  }
}

export const sampleResources: DeploySuccessResource[] = [
  {
    key: 'service',
    kind: 'Service',
    icon: 'az az-server',
    name: 'web-app',
    state: 'created',
    reference: '1482736015'
  },
  {
    key: 'resource',
    kind: 'Resource',
    icon: 'az az-box',
    name: 'web-app',
    state: 'created',
    reference: '1739204418'
  },
  {
    key: 'integration',
    kind: 'Integration',
    icon: 'az az-link',
    name: 'web-app-storage',
    state: 'created',
    reference: '1215583907'
  },
  {
    key: 'storage',
    kind: 'Storage',
    icon: 'az az-inbox',
    name: 'web-app-assets',
    state: 'created',
    reference: '24 files · 1.2 MB'
  }
]

export const sampleNextSteps: DeploySuccessNextStep[] = [
  {
    icon: 'az az-globe',
    title: 'Customize domain',
    description:
      'Associate a custom domain and subdomains with this service to handle user access.',
    href: 'https://example.com/docs'
  },
  {
    icon: 'az az-sitemap',
    title: 'Point traffic',
    description:
      'Redirect the traffic of a domain to the platform and take advantage of the distributed network.',
    href: 'https://example.com/docs'
  },
  {
    icon: 'az az-chart-line',
    title: 'View analytics',
    description: 'Gain powerful insights into your performance, availability, and security.',
    href: 'https://example.com/docs'
  }
]

export const sampleCliResources: DeploySuccessResource[] = [
  {
    key: 'resource',
    kind: 'Resource',
    icon: 'az az-box',
    name: 'analytics-app',
    state: 'created',
    reference: '1650382274'
  }
]

export const sampleCliNextSteps: DeploySuccessNextStep[] = [
  {
    icon: 'az az-cloud-upload',
    title: 'Deploy this resource',
    description:
      'Provision a service for it and deploy, without leaving this flow. The platform names the domain, and you can change it after.',
    recommended: true
  },
  {
    icon: 'az az-server',
    title: 'Deploy using a new service',
    description: 'Name the service, put a policy in front of it, and compose the release yourself.',
    href: '/services/new?resource=analytics-app'
  }
]
