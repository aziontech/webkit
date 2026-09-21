const port = (value, label = String(value)) => ({ value, label })

export const HTTP_PORT_OPTIONS = [
  port(80, '80 (Default)'),
  port(8008),
  port(8080),
  port(8880)
]

export const HTTPS_PORT_OPTIONS = [
  port(443, '443 (Default)'),
  port(8443),
  port(9440),
  port(9441),
  port(9442),
  port(9443),
  port(7777),
  port(8888),
  port(9553),
  port(9653),
  port(8035),
  port(8090)
]

export const HTTP3_PORT_OPTIONS = [
  port(443, '443 (Default)'),
  port(7777),
  port(8035),
  port(8090),
  port(8443),
  port(8888),
  port(9440),
  port(9441),
  port(9442),
  port(9443),
  port(9553),
  port(9653)
]

export const TLS_VERSION_OPTIONS = [
  { value: 'tls_1_3', label: 'TLS v1.3 (Default)' },
  { value: 'tls_1_2', label: 'TLS v1.2' },
  { value: 'tls_1_1', label: 'TLS v1.1 (Deprecated)' },
  { value: 'tls_1_0', label: 'TLS v1.0 (Deprecated)' }
]

export const CIPHER_SUITE_OPTIONS = [
  { value: 7, label: 'Modern v2025Q1' },
  { value: 6, label: 'Compatible v2025Q1' },
  { value: 5, label: 'Legacy v2025Q1' },
  { value: 4, label: 'Modern v2022Q1 (migration TLS 1.3)' },
  { value: 3, label: 'Modern v2022Q1 - TLS 1.2' },
  { value: 2, label: 'Compatible v2018Q1 - TLS 1.2' },
  { value: 1, label: 'Legacy v2018Q1 - TLS 1.2' }
]

export const MTLS_MODE_OPTIONS = [
  {
    value: 'enforce',
    label: 'Enforce',
    description:
      "Blocks the client certificate during the TLS handshake when the Trusted CA can't be validated."
  },
  {
    value: 'permissive',
    label: 'Permissive',
    description:
      "Attempts to verify the client certificate, but allows the handshake even when the Trusted CA can't be validated. Check which certificate attempted the request in Firewall."
  }
]

export const labelForPort = (value) =>
  [...HTTP_PORT_OPTIONS, ...HTTPS_PORT_OPTIONS, ...HTTP3_PORT_OPTIONS].find(
    (option) => option.value === value
  )?.label ?? String(value)

export const tlsVersionLabel = (value) =>
  TLS_VERSION_OPTIONS.find((option) => option.value === value)?.label ?? value

export const cipherSuiteLabel = (value) =>
  CIPHER_SUITE_OPTIONS.find((option) => option.value === value)?.label ?? String(value)

export const mtlsModeLabel = (value) =>
  MTLS_MODE_OPTIONS.find((option) => option.value === value)?.label ?? value

export const workloadProtocolDefaults = () => ({
  httpPorts: [80],
  useHttps: true,
  httpsPorts: [443],
  useHttp3: false,
  http3Ports: [443],
  minimumTlsVersion: 'tls_1_3',
  cipherSuite: 7
})

export const workloadMutualAuthDefaults = () => ({
  enabled: false,
  mode: 'enforce',
  certificate: '',
  crl: []
})
