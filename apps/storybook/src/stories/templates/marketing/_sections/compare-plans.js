const SECTIONS = [
  {
    eyebrow: 'Managed infrastructure',
    title: 'Azion Platform',
    description: 'Run applications on a global distributed infrastructure.',
    rows: [
      { label: 'Global infrastructure', group: true, values: ['', '', ''] },
      { label: '100+ data centers', values: ['✓', '✓', '✓'] },
      {
        label: 'Automatic routing with load balancing and failover',
        values: ['✓', '✓', '✓']
      },
      { label: 'Management', group: true, values: ['', '', ''] },
      {
        label: 'Workspaces (Multi-Org)',
        hint: 'A workspace is an isolated set of resources, users and billing inside your organization.',
        values: ['1 Workspace', '1 Workspace', 'Custom']
      },
      { label: 'Users', values: ['Unlimited', 'Unlimited', 'Unlimited'] },
      { label: 'Access security', group: true, values: ['', '', ''] },
      {
        label: 'Role-Based Access Control (RBAC)',
        hint: 'Gives each user only the permissions their role needs, instead of full account access.',
        values: ['Team level', 'Team level', 'Team and workspace levels']
      },
      {
        label: 'Multi-Factor Authentication (MFA)',
        hint: 'Requires a second factor beyond the password when signing in.',
        values: ['✓', '✓', '✓']
      },
      { label: 'Login OAuth (Google, GitHub)', values: ['✓', '✓', '✓'] },
      {
        label: 'SAML Single Sign-On (SSO)',
        hint: 'Lets your team sign in through your own identity provider instead of Azion credentials.',
        values: ['✓', '✓', '✓']
      },
      { label: 'Workloads', group: true, values: ['', '', ''] },
      {
        label: 'Workloads',
        hint: 'A workload is the domain and TLS configuration that exposes an application or firewall to the internet.',
        values: ['10 included', '20 included', 'Custom']
      },
      { label: 'Data transfer', values: ['1 TB / mo included', '2 TB / mo included', 'Custom'] },
      { label: 'Requests', values: ['10M / mo included', '20M / mo included', 'Custom'] },
      { label: 'TLS encryption', values: ['✓', '✓', '✓'] },
      {
        label: 'Mutual TLS (mTLS)',
        hint: 'Requires the client to present a certificate too, not just the server.',
        values: ['✓', '✓', '✓']
      },
      {
        label: 'Certificate Manager',
        hint: 'Where TLS certificates are issued, imported and renewed for your workloads.',
        group: true,
        values: ['', '', '']
      },
      { label: "Let's Encrypt certificate", values: ['✓', '✓', '✓'] },
      { label: 'Bring your own certificate', values: ['✓', '✓', '✓'] },
      { label: 'Developer tools', group: true, values: ['', '', ''] },
      { label: 'CLI, API, GraphQL API, Terraform', values: ['✓', '✓', '✓'] }
    ]
  },
  {
    eyebrow: 'Build',
    title: 'Applications',
    description: 'Build, run and scale applications globally.',
    rows: [
      { label: 'Applications', group: true, values: ['', '', ''] },
      {
        label: 'Rules Engine',
        hint: 'Conditional rules that change how a request is handled, evaluated at request and response time.',
        values: ['✓', '✓', '✓']
      },
      { label: 'Rules per application', values: ['10 included', '20 included', 'Custom'] },
      { label: 'Redirects', values: ['✓', '✓', '✓'] },
      {
        label: 'Reverse proxy using Connectors',
        hint: 'Connectors define the origins an application fetches from, including headers and failover.',
        values: ['✓', '✓', '✓']
      },
      { label: 'Functions', group: true, values: ['', '', ''] },
      {
        label: 'Compute time',
        hint: 'The total execution time your functions consume, billed by the hour.',
        values: ['8 hours / mo included', '10 hours / mo included', 'Custom']
      },
      { label: 'Requests', values: ['3M / mo included', '10M / mo included', 'Custom'] },
      { label: 'Cache', group: true, values: ['', '', ''] },
      {
        label: 'Purges',
        hint: 'A purge invalidates cached content before its TTL expires.',
        values: ['1,000 / mo included', '2,000 / mo included', 'Custom']
      },
      {
        label: 'Tiered Cache',
        hint: 'Adds a second cache layer between the network and your origin, so fewer requests reach it.',
        values: ['✓', '✓', '✓']
      },
      {
        label: 'Application Accelerator',
        hint: 'Extends caching and routing control to dynamic content and APIs.',
        group: true,
        values: ['', '', '']
      },
      { label: 'Data transfer', values: ['1 TB / mo included', '2 TB / mo included', 'Custom'] },
      {
        label: 'Custom Cache Keys',
        hint: 'Choose which parts of a request — query string, cookies, headers — make two responses distinct.',
        values: ['✓', '✓', '✓']
      },
      { label: 'Path Rewrites', values: ['✓', '✓', '✓'] },
      {
        label: 'Image Processor',
        hint: 'Resizes, crops and converts images on the fly from a single stored original.',
        group: true,
        values: ['', '', '']
      },
      { label: 'Images', values: ['5,000 / mo included', '10,000 / mo included', 'Custom'] },
      {
        label: 'AI Inference',
        hint: 'Runs model inference on Azion’s distributed infrastructure, close to the user.',
        group: true,
        tag: 'Preview',
        values: ['', '', '']
      },
      {
        label: 'Preview access',
        values: ['On request (subject to approval)', 'On request (subject to approval)', 'Custom']
      }
    ]
  },
  {
    eyebrow: 'Azion Platform',
    title: 'Compliance',
    description: 'Audits and certifications for regulated workloads.',
    rows: [
      {
        label: 'PCI DSS 4.0.1 Level 1 Service Provider',
        hint: 'Azion is assessed annually as a Level 1 service provider under PCI DSS 4.0.1.',
        group: true,
        values: ['—', '—', '✓']
      },
      {
        label: 'SOC 2 Type 2 / SOC 3',
        hint: "Independent audit of Azion's security, availability and confidentiality controls over time.",
        group: true,
        values: ['—', '—', '✓']
      },
      {
        label: 'FIPS 140-2 Level 3',
        hint: 'Cryptographic keys are held in hardware validated to FIPS 140-2 Level 3.',
        group: true,
        values: ['—', '—', 'Included with Secure Key Store (paid add-on)']
      }
    ]
  },
  {
    eyebrow: 'Contractual commitments',
    title: 'Commit and Save',
    description: 'Commit up front and save more.',
    rows: [
      {
        label: 'Capacity Reservation',
        hint: 'Commit to a usage volume up front in exchange for a lower unit price.',
        group: true,
        values: ['—', '—', 'Available']
      },
      {
        label: 'Savings Plan',
        hint: 'Commit to a spend amount over a 1, 2 or 3 year term in exchange for a lower unit price.',
        group: true,
        values: ['—', '—', 'Available']
      }
    ]
  }
]

export const SITE_SECTION = {
  _id: 'compare-plans',
  props: {
    anchor: 'comparison',
    caption: 'Feature and included-usage comparison across the Hobby, Pro and Enterprise plans.',
    columnLabel: 'Features',
    pickerAriaLabel: 'Plan being compared',
    includedLabel: 'Included',
    excludedLabel: 'Not included',
    plans: [
      {
        id: 'hobby',
        name: 'Hobby',
        highlighted: false,
        action: {
          label: 'Start for free',
          href: 'https://console.azion.com/signup?plan=hobby'
        }
      },
      {
        id: 'pro',
        name: 'Pro',
        highlighted: true,
        action: {
          label: 'Start with Pro',
          href: 'https://console.azion.com/signup?plan=pro&billing-cycle=monthly'
        }
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        highlighted: false,
        action: {
          label: 'Talk to a specialist',
          href: '/en/contact/'
        }
      }
    ],
    sections: SECTIONS,
    primaryAction: {
      label: 'See on-demand pricing',
      href: 'https://www.azion.com/en/documentation/products/pricing/'
    }
  }
}
