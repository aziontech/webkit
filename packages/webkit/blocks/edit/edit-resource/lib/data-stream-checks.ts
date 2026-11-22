import type { sampleDataStream } from '../sample'
import type { FieldProblem, FieldProblems } from '../use-deploy-on-save'

type DataStreamRecord = typeof sampleDataStream
type Need = (id: keyof DataStreamRecord) => boolean
type Check = (form: DataStreamRecord, errors: FieldProblems, need: Need) => void

const URL_PATTERN = /^https?:\/\/[^\s/$.?#][^\s]*$/
const HEADERS_PATTERN = /^[^:\n]+:[^\n]*\S[^\n]*(\n[^:\n]+:[^\n]*\S[^\n]*){0,4}$/
const SERVERS_PATTERN = /^[^\s,]+(,[^\s,]+)*$/
const WORKLOADS_PATTERN = /^[^\n]*\S[^\n]*(\n[^\n]*\S[^\n]*)*$/

const invalid = (message: string): FieldProblem => ({ type: 'invalid', message })

const checkSource: Check = (form, errors, need) => {
  if (need('name') && form.name.trim().length > 250)
    errors.name = invalid('Use at most 250 characters.')
  if (
    form.scope === 'filtered' &&
    need('workloads') &&
    !WORKLOADS_PATTERN.test(form.workloads.trim())
  )
    errors.workloads = invalid('Remove the empty lines. Every line holds one workload.')
  if (form.scope === 'all' && form.sampling) {
    const rate = Number(form.samplingRate)
    if (!Number.isFinite(rate) || rate < 1 || rate > 100)
      errors.samplingRate = invalid('Enter a rate from 1 to 100.')
  }
}

const dataSetProblem = (text: string): string => {
  let parsed: unknown = null
  try {
    parsed = JSON.parse(text)
  } catch {
    parsed = null
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
    return 'Write the data set as a JSON object.'
  if (!Object.keys(parsed).length) return 'Add at least one variable to the data set.'
  return ''
}

const checkTemplate: Check = (form, errors, need) => {
  if (form.template !== 'custom') return
  need('templateName')
  if (!need('dataSet')) return
  const message = dataSetProblem(form.dataSet)
  if (message) errors.dataSet = invalid(message)
}

const checkStandard: Check = (form, errors, need) => {
  if (need('url') && !URL_PATTERN.test(form.url.trim()))
    errors.url = invalid('Enter a valid URL. Example: https://collector.example.com/ingest.')
  need('payloadFormat')
  need('lineSeparator')
  if (form.headers.trim() && !HEADERS_PATTERN.test(form.headers.trim()))
    errors.headers = invalid('Write up to 5 headers, one per line, in the Key:Value format.')
}

const checkKafka: Check = (form, errors, need) => {
  if (need('bootstrapServers') && !SERVERS_PATTERN.test(form.bootstrapServers.trim()))
    errors.bootstrapServers = invalid('Separate the servers with a comma and no space.')
  need('topic')
}

const checkStorage: Check = (_form, _errors, need) => {
  need('bucket')
  need('region')
  need('accessKey')
  need('secretKey')
}

const checkAnalytics: Check = (form, errors, need) => {
  if (need('analyticsUrl') && !URL_PATTERN.test(form.analyticsUrl.trim()))
    errors.analyticsUrl = invalid(
      'Enter a valid URL. Example: https://logs.example.com/api/v2/logs.'
    )
  need('apiKey')
}

const DESTINATION_CHECKS: Record<string, Check> = {
  standard: checkStandard,
  kafka: checkKafka,
  s3: checkStorage,
  analytics: checkAnalytics
}

export function checkDataStream(form: DataStreamRecord, errors: FieldProblems): boolean {
  Object.keys(errors).forEach((key) => delete errors[key])
  const need: Need = (id) => {
    if (String(form[id] ?? '').trim()) return true
    errors[id] = { type: 'required', message: 'This field is required.' }
    return false
  }
  checkSource(form, errors, need)
  checkTemplate(form, errors, need)
  DESTINATION_CHECKS[form.connector]?.(form, errors, need)
  return Object.keys(errors).length === 0
}
