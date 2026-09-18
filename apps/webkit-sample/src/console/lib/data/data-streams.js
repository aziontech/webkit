// The data streams the sample is seeded with — the Observe → Data Stream module.
//
// A DATA STREAM ships one SOURCE of events (HTTP requests, WAF events, function
// invocations…) to one ENDPOINT (an S3 bucket, a Kafka topic, an HTTP collector).
// Both are enumerable and both are what people narrow by — "which streams feed
// Datadog", "who is still shipping WAF events" — so both become fields alongside
// Status.
import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

/** The event source a stream ships. */
export const STREAM_SOURCES = {
  'http-events': 'HTTP Events',
  'waf-events': 'WAF Events',
  'functions-events': 'Functions Events',
  'activity-history': 'Activity History'
}

/** Where a stream ships to. */
export const STREAM_ENDPOINTS = {
  s3: 'Amazon S3',
  kafka: 'Apache Kafka',
  datadog: 'Datadog',
  'standard-http': 'Standard HTTP/HTTPS POST',
  elasticsearch: 'Elasticsearch'
}

/** The label for a source id, falling back to the id itself. */
export const streamSourceLabel = (id) => STREAM_SOURCES[id] ?? id

/** The label for an endpoint id, falling back to the id itself. */
export const streamEndpointLabel = (id) => STREAM_ENDPOINTS[id] ?? id

/** The source list a filter field offers. */
export const streamSourceOptions = Object.entries(STREAM_SOURCES).map(([value, label]) => ({
  value,
  label
}))

/** The endpoint list a filter field offers. */
export const streamEndpointOptions = Object.entries(STREAM_ENDPOINTS).map(([value, label]) => ({
  value,
  label
}))

/** The seeded data streams, in list order. */
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

/**
 * A data stream as a LIST ROW — the record itself plus the fields its table displays.
 *
 * Exported because the seed is not the only source of rows any more: a stream created
 * in this session is stored as the answers the reader gave (../state/created-resources.js)
 * and has to arrive in the list as the SAME row, derived fields and all. Two projections
 * would be two lists that disagree about what a row is.
 *
 * @param {object} stream The base record.
 * @param {number} [index] Position in the seed — picks the round-robin author.
 * @returns {object} The row.
 */
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

/** A seeded data stream by id, or `undefined`. */
export const dataStreamById = (id) => DATA_STREAMS.find((stream) => stream.id === String(id))
