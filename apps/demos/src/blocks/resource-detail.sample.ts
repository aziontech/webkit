import type { ResourceDetailResource } from './resource-detail.vue'

const referenceTime = Date.UTC(2026, 10, 10, 12)

export const sampleResource: ResourceDetailResource = {
  name: 'analytics-app',
  domain: 'analytics-app-z1x2c3.example.com',
  deploymentId: '1213275262',
  environment: 'Production',
  status: 'Ready',
  statusSeverity: 'success',
  createdAt: new Date(referenceTime - 14 * 86_400_000),
  createdBy: 'John Smith',
  framework: 'Next.js',
  frameworkIcon: 'az-color az-nextjs'
}
