import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

export const STREAM_SOURCES = {
  'http-events': 'HTTP Events',
  'waf-events': 'WAF Events',
  'functions-events': 'Functions Events',
  'activity-history': 'Activity History'
}

export const STREAM_ENDPOINTS = {
  s3: 'Amazon S3',
  kafka: 'Apache Kafka',
  datadog: 'Datadog',
  'standard-http': 'Standard HTTP/HTTPS POST',
  elasticsearch: 'Elasticsearch',
  'big-query': 'Google BigQuery',
  splunk: 'Splunk',
  'aws-kinesis-firehose': 'AWS Kinesis Data Firehose',
  qradar: 'IBM QRadar',
  'azure-monitor': 'Azure Monitor',
  'azure-blob-storage': 'Azure Blob Storage'
}

export const streamSourceLabel = (id) => STREAM_SOURCES[id] ?? id

export const streamEndpointLabel = (id) => STREAM_ENDPOINTS[id] ?? id

export const streamSourceOptions = Object.entries(STREAM_SOURCES).map(([value, label]) => ({
  value,
  label
}))

export const streamEndpointOptions = Object.entries(STREAM_ENDPOINTS).map(([value, label]) => ({
  value,
  label
}))

export const DATA_STREAMS = [
  {
    id: 'ds-6601',
    name: 'http-to-datadog',
    source: 'http-events',
    endpoint: 'datadog',
    sampling: 100,
    status: 'Active',
    modifiedAt: daysAgo(3)
  },
  {
    id: 'ds-6602',
    name: 'waf-to-s3',
    source: 'waf-events',
    endpoint: 's3',
    sampling: 100,
    status: 'Active',
    modifiedAt: daysAgo(17)
  },
  {
    id: 'ds-6603',
    name: 'functions-to-kafka',
    source: 'functions-events',
    endpoint: 'kafka',
    sampling: 50,
    status: 'Active',
    modifiedAt: daysAgo(9)
  },
  {
    id: 'ds-6604',
    name: 'audit-to-elastic',
    source: 'activity-history',
    endpoint: 'elasticsearch',
    sampling: 100,
    status: 'Inactive',
    modifiedAt: daysAgo(112)
  },
  {
    id: 'ds-6605',
    name: 'http-sample-to-collector',
    source: 'http-events',
    endpoint: 'standard-http',
    sampling: 10,
    status: 'Active',
    modifiedAt: daysAgo(1)
  },
  {
    id: 'ds-6606',
    name: 'waf-to-datadog',
    source: 'waf-events',
    endpoint: 'datadog',
    sampling: 100,
    status: 'Active',
    modifiedAt: daysAgo(46)
  }
].map(dataStreamRow)

export function dataStreamRow(stream, index = 0) {
  const person = authorAt(index)
  return {
    ...stream,
    sourceLabel: streamSourceLabel(stream.source),
    endpointLabel: streamEndpointLabel(stream.endpoint),
    samplingLabel: `${stream.sampling}%`,
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(stream.modifiedAt)
  }
}

export const dataStreamById = (id) => DATA_STREAMS.find((stream) => stream.id === String(id))
