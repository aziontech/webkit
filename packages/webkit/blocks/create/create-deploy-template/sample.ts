import type { DeployTemplateTemplate } from './create-deploy-template.vue'

export const sampleTemplate: DeployTemplateTemplate = {
  name: 'Nuxt E-commerce',
  description: 'Launch a Nuxt e-commerce or content app in a few steps.',
  icon: 'az-color az-nuxt',
  provider: 'GitHub',
  providerIcon: 'az az-github',
  scope: 'acme',
  path: 'templates/nuxt-ecommerce'
}

export const sampleAccount = 'name@example.com'

export const sampleImportedRepository: DeployTemplateTemplate = {
  name: 'acme-web',
  description: 'Import and deploy the acme-web repository from GitHub.',
  icon: 'az az-github',
  provider: 'GitHub',
  providerIcon: 'az az-github',
  scope: 'acme',
  path: 'acme-web',
  source: 'Importing from GitHub'
}

export const sampleUploadedProject: DeployTemplateTemplate = {
  name: 'acme-landing',
  description: 'Deploy this project straight from your machine.',
  icon: 'az az-folder'
}

export const sampleIntegration: DeployTemplateTemplate = {
  name: 'Origin Proxy',
  description:
    'Front an origin you already run. The service receives the traffic and passes it on.',
  icon: 'az az-arrow-right-left'
}
