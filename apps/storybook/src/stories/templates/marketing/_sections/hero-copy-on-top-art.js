export const SITE_SECTION = {
  _id: 'hero-copy-on-top-art',
  props: {
    eyebrow: 'Workloads',
    title: 'Put your application close to users in seconds',
    description:
      'A workload is the hostname, the certificate and the routing that make an application reachable. Create one and it is live in every Azion data center — no servers to size, no regions to pick.',
    primaryAction: {
      label: 'Start for free',
      href: 'https://console.azion.com/signup'
    },
    secondaryAction: {
      label: 'Docs',
      href: 'https://www.azion.com/en/documentation/',
      trailing: true
    },
    levels: [
      {
        nodes: [
          {
            eyebrow: 'Domain',
            icon: 'ai ai-domains',
            title: 'shop.example.com',
            label: 'Public',
            severity: 'info'
          },
          {
            eyebrow: 'Domain',
            icon: 'ai ai-domains',
            title: 'api.example.com',
            label: 'Public',
            severity: 'info'
          }
        ]
      },
      {
        nodes: [
          {
            eyebrow: 'Workload',
            icon: 'ai ai-workloads',
            title: 'shop-prod',
            label: 'Live',
            severity: 'success',
            lit: true
          }
        ]
      },
      {
        nodes: [
          {
            eyebrow: 'Application',
            icon: 'ai ai-edge-application',
            title: 'storefront',
            label: 'Active',
            severity: 'success'
          },
          {
            eyebrow: 'Firewall',
            icon: 'ai ai-edge-firewall',
            title: 'shop-rules',
            label: 'Active',
            severity: 'success'
          }
        ]
      }
    ]
  }
}
