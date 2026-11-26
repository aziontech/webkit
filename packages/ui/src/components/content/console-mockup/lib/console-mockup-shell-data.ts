export const CONSOLE_MOCKUP_SHELL_RAIL = [
  {
    key: 'start',
    label: '',
    entries: [
      { key: 'overview', icon: 'az az-home', label: 'Overview' },
      { key: 'workloads', icon: 'az az-workloads', label: 'Workloads' },
      { key: 'deployments', icon: 'az az-deploy-pillar', label: 'Deployments' }
    ]
  },
  {
    key: 'build',
    label: 'Build',
    entries: [
      { key: 'applications', icon: 'az az-applications', label: 'Applications' },
      { key: 'functions', icon: 'az az-functions', label: 'Functions' },
      { key: 'variables', icon: 'az az-variables', label: 'Variables' },
      { key: 'connectors', icon: 'az az-connectors', label: 'Connectors' },
      { key: 'custom-pages', icon: 'az az-custom-pages', label: 'Custom Pages' }
    ]
  },
  {
    key: 'secure',
    label: 'Secure',
    entries: [
      { key: 'firewall', icon: 'az az-firewall', label: 'Firewall' },
      { key: 'edge-dns', icon: 'az az-edge-dns', label: 'Edge DNS' },
      { key: 'waf-rules', icon: 'az az-waf', label: 'WAF Rules' },
      {
        key: 'certificate-manager',
        icon: 'az az-certificate-manager',
        label: 'Certificate Manager'
      }
    ]
  }
]

export const CONSOLE_MOCKUP_SHELL_LEGACY_TOKENS = {
  '--text-label-lg-font-weight': '500',
  '--text-label-md-font-weight': '500',
  '--text-label-sm-font-weight': '500',
  '--text-button-lg-font-weight': '600',
  '--text-button-md-font-weight': '600',
  '--text-tag-sm-font-weight': '600',
  '--text-tag-md-font-weight': '600',
  '--text-tag-sm-font-size': '0.6875rem',
  '--text-body-lg-line-height': '1.5',
  '--text-body-md-line-height': '1.5',
  '--text-body-sm-line-height': '1.5',
  '--text-body-xs-line-height': '1.5'
}
