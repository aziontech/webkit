import type { SelectOptionItem } from '@aziontech/ui/select'

export interface ServiceWizardOption extends SelectOptionItem {
  description?: string
}
export type ServiceWizardCachePolicyId = 'images' | 'files-optimization'
export interface ServiceWizardCacheField {
  name: string
  label: string
  placeholder: string
  required: boolean
  description: string
}
export interface ServiceWizardCachePolicy {
  value: ServiceWizardCachePolicyId
  label: string
  description: string
  fields: ServiceWizardCacheField[]
}
export type ServiceWizardOriginType = 'http' | 'storage' | 'live-ingest'
export interface ServiceWizardOriginTextField {
  kind: 'text'
  name: string
  label: string
  placeholder: string
  required?: boolean
  description: string
}
export interface ServiceWizardOriginSelectField {
  kind: 'select'
  name: string
  label: string
  options: ServiceWizardOption[]
  required?: boolean
  description: string
}
export type ServiceWizardOriginField = ServiceWizardOriginTextField | ServiceWizardOriginSelectField
export interface ServiceWizardPickerInitial {
  chosen?: string
  message?: string
  loading?: boolean
}
export interface ServiceWizardScratch {
  cache: Record<ServiceWizardCachePolicyId, { enabled: boolean; values: Record<string, string> }>
  origin: { enabled: boolean; type: ServiceWizardOriginType; values: Record<string, string> }
}

/** A searchable, paged list of options, as the project and deployment pickers hold it. */
export interface ServiceWizardPicker {
  query: string
  chosen: string
  message: string
  loading: boolean
  paged: boolean
  matches: ServiceWizardOption[]
  visible: ServiceWizardOption[]
  remaining: number
  nextBatch: number
  summary: string
  loadMore: () => void
}

export const wireWidths = ['62%', '48%', '70%', '54%', '44%']
export const wireSubWidths = ['84%', '66%', '78%', '58%', '72%']

export const labelFor = (options: ServiceWizardOption[]) => (value: string) =>
  options.find((option) => option.value === value)?.label ?? ''

/** The domain and deployment answers of the Create Service wizard. */
export interface ServiceWizardForm {
  domainType: string
  domainPrefix: string
  domainHost: string
  name: string
  environment: string
  certificate: string
  deploymentMode: string
  minimumTlsVersion: string
  errorPage: string
  allowPlatformDomain: boolean
  active: boolean
}

/** The names the service, its deployment and its domain get. */
export interface ServiceWizardNames {
  service: string
  deployment: string
  domain: string
}

/** What a picker's summary line is computed from. */
export interface PickerSummaryInput {
  noun: string
  total: number
  query: string
  loading: boolean
  matches: number
  visible: number
  remaining: number
  nextBatch: number
}

export function pickerSummary(input: PickerSummaryInput): string {
  const { noun, total, query, loading, matches, visible, remaining, nextBatch } = input
  if (loading) return 'Loading ' + nextBatch + ' more ' + noun + 's'
  if (query.trim() && !matches) return 'No ' + noun + ' matches ' + query
  if (remaining) return visible + ' of ' + matches + ' ' + noun + 's'
  return query.trim() ? matches + ' of ' + total + ' ' + noun + 's' : total + ' ' + noun + 's'
}

export function filterOptions(
  options: ServiceWizardOption[],
  query: string
): ServiceWizardOption[] {
  const text = query.trim().toLowerCase()
  if (!text) return options
  return options.filter(
    (option) =>
      option.label.toLowerCase().includes(text) ||
      String(option.description ?? '')
        .toLowerCase()
        .includes(text)
  )
}
