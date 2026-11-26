import type { SelectOptionItem } from '@aziontech/webkit/select'

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

/** One text setting of the deploy form. */
export interface DeployFormSetting {
  /** The key its value is kept under. */
  name: string
  /** The field label, also named in its required message. */
  label: string
  /** The field placeholder. */
  placeholder: string
  /** The guidance under the field. */
  description: string
  /** Deploy flags the field while it is empty. */
  required: boolean
  /** The value the field starts with. */
  defaultValue: string
}

/** One environment variable the template asks for. */
export interface DeployFormVariable {
  /** The key its value is kept under. */
  name: string
  /** The variable name, shown in the locked Key field. */
  variable: string
  /** The placeholder of the Value field. */
  placeholder: string
  /** Deploy flags the variable while its value is empty. */
  required: boolean
  /** The value is hidden until Show value is pressed. */
  secret: boolean
}

export const sampleScopes: SelectOptionItem[] = [
  { label: 'jane-doe', value: 'jane-doe' },
  { label: 'acme', value: 'acme' },
  { label: 'acme-templates', value: 'acme-templates' }
]

export const samplePresets: SelectOptionItem[] = [
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Next.js', value: 'next' },
  { label: 'Vite', value: 'vite' },
  { label: 'Astro', value: 'astro' },
  { label: 'Static files', value: 'static' }
]

export const sampleSettings: DeployFormSetting[] = [
  {
    name: 'storeDomain',
    label: 'Store domain',
    placeholder: 'https://shop.example.com',
    description: 'The domain your store answers on.',
    required: false,
    defaultValue: ''
  }
]

export const sampleBuildSettings: DeployFormSetting[] = [
  {
    name: 'rootDirectory',
    label: 'Root directory',
    placeholder: '/',
    description: "The folder that holds the project's package.json.",
    required: true,
    defaultValue: '/'
  },
  {
    name: 'installCommand',
    label: 'Install command',
    placeholder: 'npm install',
    description: "Installs the project's dependencies before the build runs.",
    required: true,
    defaultValue: 'npm install'
  }
]

export const sampleVariables: DeployFormVariable[] = [
  {
    name: 'storeAccessToken',
    variable: 'NUXT_STORE_ACCESS_TOKEN',
    placeholder: 'Access token',
    required: true,
    secret: true
  },
  {
    name: 'storeRevalidationSecret',
    variable: 'NUXT_STORE_REVALIDATION_SECRET',
    placeholder: 'Revalidation secret',
    required: false,
    secret: true
  }
]
