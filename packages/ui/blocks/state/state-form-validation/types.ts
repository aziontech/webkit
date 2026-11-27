/** One origin the Origin select offers. */
export interface FormValidationOrigin {
  /** Option value, the origin id. */
  value: string
  /** Display name. */
  label: string
  /** Origin type, such as HTTP or Storage. */
  kind: string
}

/** The entries of the Create Service form, and the values a save sends. */
export interface FormValidationService {
  /** Service name. */
  name: string
  /** Protocol usage option value. */
  protocolUsage: string
  /** HTTP port option values. */
  httpPorts: string[]
  /** Compress responses. */
  compression: boolean
  /** Limit requests per client. */
  rateLimiting: boolean
  /** Optimize images on the fly. */
  imageOptimization: boolean
  /** Add a second caching layer. */
  secondaryCache: boolean
  /** The linked origin id. */
  originId: string
  /** Host header sent to the origin. */
  hostHeader: string
  /** Browser maximum TTL, in seconds. */
  browserMaxTtl: number
  /** Cache maximum TTL, in seconds. */
  cacheMaxTtl: number
  /** List executed rules in the logs. */
  debugRules: boolean
}
