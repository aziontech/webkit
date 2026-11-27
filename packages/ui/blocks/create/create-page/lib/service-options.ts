export const protocolUsageOptions = [
  {
    value: 'http',
    label: 'HTTP support',
    description: 'Use only the HTTP protocol. Select from the available HTTP ports.'
  },
  {
    value: 'https',
    label: 'HTTP and HTTPS support',
    description:
      'Use both HTTP and HTTPS protocols. Select from the available HTTP and HTTPS ports.'
  },
  {
    value: 'http3',
    label: 'HTTP/3 support',
    description:
      'Use both HTTP and HTTPS protocols and enable HTTP/3 support. Only available for HTTP port 80 and HTTPS port 443.'
  }
]
export const httpPortOptions = [
  { label: '80, default', value: '80' },
  { label: '8080', value: '8080' },
  { label: '8008', value: '8008' }
]
export const httpsPortOptions = [
  { label: '443, default', value: '443' },
  { label: '8443', value: '8443' }
]
export const protocolPolicyOptions = [
  { value: 'preserve', label: 'Preserve HTTP/HTTPS' },
  { value: 'http', label: 'Enforce HTTP' },
  { value: 'https', label: 'Enforce HTTPS' }
]
export const browserCacheOptions = [
  { value: 'override', label: 'Override cache settings' },
  {
    value: 'honor',
    label: 'Honor cache policies',
    description:
      'Honor cache policies from the origin or define a new maximum cache TTL for browsers.'
  }
]
export const cacheOptions = [
  { value: 'override', label: 'Override cache settings' },
  {
    value: 'honor',
    label: 'Honor cache policies',
    description:
      "Honor cache policies from the origin or define a new maximum TTL for the cache. If a TTL isn't received from the origin, cache will be maintained at a default TTL."
  }
]

export const MAXIMUM_TTL_DESCRIPTION =
  'In seconds. Enable dynamic acceleration in the Main settings tab to use values lower than 60 seconds. A secondary cache requires a cache TTL equal to or greater than 3 seconds.'
