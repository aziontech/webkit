export interface FirewallModule {
  key: string
  title: string
  description: string
  locked: boolean
}

export const FIREWALL_MODULES: FirewallModule[] = [
  {
    key: 'ddos',
    title: 'DDoS Protection Unmetered',
    description:
      'Mitigate large and complex network, transport, presentation, and application-layer DDoS attacks.',
    locked: true
  },
  {
    key: 'functions',
    title: 'Functions',
    description: 'Build low-latency functions that run close to users.',
    locked: false
  },
  {
    key: 'network-shield',
    title: 'Network Shield',
    description:
      'Create lists to configure a programmable security perimeter for inbound and outbound traffic.',
    locked: false
  },
  {
    key: 'waf',
    title: 'Web Application Firewall',
    description: 'Protect applications against threats and attacks.',
    locked: false
  }
]
