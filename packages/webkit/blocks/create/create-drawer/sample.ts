import type { CreateDrawerCertificate, CreateDrawerEnvironment } from './create-drawer.vue'

export const sampleEnvironments: CreateDrawerEnvironment[] = [
  { value: 'Production', label: 'Production', deploymentPolicy: 'single_version' },
  { value: 'Preview', label: 'Preview', deploymentPolicy: 'versioned_urls' },
  { value: 'Stage', label: 'Stage', deploymentPolicy: 'versioned_urls' }
]

export const sampleConnectedEnvironments: string[] = ['Production', 'Preview']

export const sampleCertificates: CreateDrawerCertificate[] = [
  { value: '', label: 'Free platform certificate', subject: '' },
  { value: 'cert-8801', label: 'example.com wildcard', subject: '*.example.com' },
  { value: 'cert-8803', label: 'api.example.com', subject: 'api.example.com' },
  { value: 'cert-8805', label: 'staging wildcard', subject: '*.staging.example.com' },
  { value: 'cert-8802', label: 'example.org', subject: 'example.org' }
]
