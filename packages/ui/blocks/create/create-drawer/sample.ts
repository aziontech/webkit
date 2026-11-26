import type { SchemaFormSchema } from '@aziontech/ui/schema-form'

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

export const sampleCertificatePem = `-----BEGIN CERTIFICATE-----
MIIBvjCCAWSgAwIBAgIUNDoJDa2hJas+aUcp2sbyD9PhjPwwCgYIKoZIzj0EAwIw
LDEYMBYGA1UEAwwPRXhhbXBsZSBUZXN0IENBMRAwDgYDVQQKDAdFeGFtcGxlMB4X
DTI2MTExMTEzMjM1N1oXDTI4MTEzMDEzMjM1N1owGzEZMBcGA1UEAwwQc2hvcC5l
eGFtcGxlLmNvbTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABGnMo5VQJ8H/vKzM
hmnv1ir/DMkDuDahalIy7Bx8GO2D1Dx4fgA6wGYjDCt2XNNnH3WCXXJnrZfjypxs
G1wnUWmjdTBzMDEGA1UdEQQqMCiCEHNob3AuZXhhbXBsZS5jb22CFHd3dy5zaG9w
LmV4YW1wbGUuY29tMB0GA1UdDgQWBBS8Wr4FRmN3ph2hf3/rKTHR2fOU3TAfBgNV
HSMEGDAWgBTXOAjUcHzQoG4oJOPNrSvBx3vxPjAKBggqhkjOPQQDAgNIADBFAiB3
v7BjiqHLNSigs9mHSq+kIKiq1syEkbuiq3g9yuLAFwIhAMLeH4vwZC+ftGD+p6Z9
mr+L2DBwFXtW2qJfNedf/9rU
-----END CERTIFICATE-----`

export interface FunctionInstanceFunction {
  value: string
  label: string
  runtime: string
  schema: SchemaFormSchema
}

export interface FunctionInstanceRecord {
  id: string
  name: string
  functionId: string
  args: Record<string, unknown>
}

export const sampleFunctions: FunctionInstanceFunction[] = [
  {
    value: 'image-resizer',
    label: 'image-resizer',
    runtime: 'JavaScript',
    schema: {
      type: 'object',
      required: ['width'],
      properties: {
        width: {
          type: 'integer',
          title: 'Width',
          description: 'Largest width served, in pixels.',
          minimum: 16,
          maximum: 4096
        },
        quality: {
          type: 'integer',
          title: 'Quality',
          description: 'Compression quality from 1 to 100.',
          minimum: 1,
          maximum: 100,
          default: 80
        },
        format: {
          type: 'string',
          title: 'Format',
          enum: ['webp', 'avif', 'jpeg'],
          default: 'webp'
        },
        keepMetadata: {
          type: 'boolean',
          title: 'Keep metadata',
          description: 'Keeps EXIF data such as the camera and the capture date.',
          default: false
        }
      }
    }
  },
  {
    value: 'geo-redirect',
    label: 'geo-redirect',
    runtime: 'JavaScript',
    schema: {
      type: 'object',
      required: ['targetUrl'],
      properties: {
        targetUrl: {
          type: 'string',
          title: 'Target URL',
          format: 'uri',
          description: 'Where matching visitors are sent.'
        },
        countries: {
          type: 'array',
          title: 'Countries',
          description: 'Two-letter country codes, one per line. Empty matches every country.',
          items: { type: 'string', minLength: 2, maxLength: 2 }
        },
        status: {
          type: 'integer',
          title: 'Status code',
          enum: [301, 302, 307],
          default: 302
        }
      }
    }
  },
  {
    value: 'header-injector',
    label: 'header-injector',
    runtime: 'TypeScript',
    schema: {
      type: 'object',
      required: ['headers'],
      properties: {
        headers: {
          type: 'object',
          title: 'Headers',
          description: 'Added to every response.',
          additionalProperties: { type: 'string' }
        },
        overwrite: {
          type: 'boolean',
          title: 'Overwrite existing headers',
          default: false
        }
      }
    }
  }
]

export const sampleFunctionInstances: FunctionInstanceRecord[] = [
  {
    id: 'instance-1',
    name: 'resize-product-images',
    functionId: 'image-resizer',
    args: { width: 800, quality: 75, format: 'avif', keepMetadata: false }
  },
  {
    id: 'instance-2',
    name: 'eu-storefront',
    functionId: 'geo-redirect',
    args: { targetUrl: 'https://eu.example.com', countries: ['DE', 'FR'], status: 302 }
  }
]
