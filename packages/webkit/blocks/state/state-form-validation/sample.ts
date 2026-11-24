import type { FormValidationValues } from './state-form-validation.vue'
import type { FormValidationOrigin } from './types'

export const sampleValues: FormValidationValues = {
  key: 'API_BASE_URL',
  value: 'https://api.example.com/v2',
  environment: 'Production',
  description: 'Base URL the checkout service calls.'
}

export const sampleOrigins: FormValidationOrigin[] = [
  { value: 'origin-web-prod', label: 'web-origin-prod', kind: 'HTTP' },
  { value: 'origin-api-prod', label: 'api-origin-prod', kind: 'HTTP' },
  { value: 'origin-assets', label: 'assets-storage', kind: 'Storage' }
]

export const sampleReloadedOrigins: FormValidationOrigin[] = sampleOrigins.filter(
  (origin) => origin.value !== 'origin-web-prod'
)

export const sampleOriginError =
  'Origin "web-origin-prod" no longer exists. ' +
  "Another user deleted it while you were filling in this form, so the service wasn't created. " +
  'Nothing else was lost: reload the origin list and select another one.'
