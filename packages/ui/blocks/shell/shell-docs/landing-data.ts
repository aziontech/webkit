export const prompt =
  'Set up the Azion CLI, connect the Azion docs over MCP and link this project to my Azion account.'

export const interfaces = [
  {
    title: 'Console',
    href: '/docs/console',
    icon: 'az az-azion',
    link: 'Access the Console',
    text: 'Configure it visually: applications, firewall rules, metrics, and events.'
  },
  {
    title: 'CLI',
    href: '/docs/cli',
    icon: 'az az-azion-cli',
    link: 'Install the CLI',
    text: 'Stay in the terminal: link a project, run it locally, and deploy with a single binary.'
  },
  {
    title: 'API',
    href: '/docs/api',
    icon: 'az az-azion-api',
    link: 'Call the API',
    text: 'Drive it from your own systems: create and change resources over REST, token authenticated.'
  }
]
export const objectives = [
  {
    title: 'Build your application',
    href: '/docs/build-your-application',
    icon: 'az az-box',
    text: 'Deploy from a template, a repo, or the CLI.'
  },
  {
    title: 'Accelerate your application',
    href: '/docs/accelerate-your-application',
    icon: 'az az-gauge',
    text: 'Cache responses so your origin stops repeating itself.'
  },
  {
    title: 'Secure your application',
    href: '/docs/secure-your-application',
    icon: 'az az-shield',
    text: 'A firewall in front, with a block rule you can verify.'
  },
  {
    title: 'Execute AI inference',
    href: '/docs/execute-ai-inference',
    icon: 'az az-sparkles',
    text: 'A hosted model behind an OpenAI-compatible endpoint.'
  }
]
export const templates = [
  { title: 'React', icon: 'az-color az-react', href: '/docs/templates/react' },
  { title: 'Next.js', icon: 'az-color az-nextjs', href: '/docs/templates/next-js' },
  { title: 'Astro', icon: 'az-color az-astro', href: '/docs/templates/astro' },
  { title: 'Vue.js', icon: 'az-color az-vue', href: '/docs/templates/vue-js' },
  { title: 'Angular', icon: 'az-color az-angular', href: '/docs/templates/angular' },
  { title: 'Gatsby Blog', icon: 'az az-gatsby', href: '/docs/templates/gatsby-blog' },
  { title: 'Hono', icon: 'az az-hono', href: '/docs/templates/hono' },
  { title: 'Hugo', icon: 'az az-hugo', href: '/docs/templates/hugo' }
]
export const attacks = [
  {
    title: 'Add a firewall',
    href: '/docs/add-a-firewall',
    icon: 'az az-shield',
    text: 'Bind it to your workload and prove a deny rule with curl.'
  },
  {
    title: 'Block injection attacks',
    href: '/docs/block-injection-attacks',
    icon: 'az az-filter',
    text: 'A SQL Injection rule set, with the blocks visible in events.'
  },
  {
    title: 'Tune false positives',
    href: '/docs/tune-false-positives',
    icon: 'az az-list-check',
    text: 'Turn WAF false positives into allowed rules.'
  },
  {
    title: 'Deny bad bots',
    href: '/docs/deny-bad-bots',
    icon: 'az az-microchip',
    text: 'Deny automated requests that score above your threshold.'
  },
  {
    title: 'Network blocklists',
    href: '/docs/network-blocklists',
    icon: 'az az-map',
    text: 'Drop unwanted traffic before it reaches your application.'
  },
  {
    title: 'Install TLS certificates',
    href: '/docs/install-tls-certificates',
    icon: 'az az-key',
    text: 'Upload a certificate and key, then check the handshake.'
  }
]
export const compliance = [
  {
    title: 'Shared Responsibility Model',
    href: '/docs/shared-responsibility-model',
    icon: 'az az-verified',
    text: 'What Azion covers, and what stays yours.'
  },
  {
    title: 'Governance, Risk and Compliance',
    href: '/docs/governance-risk-and-compliance',
    icon: 'az az-id-card',
    text: 'The tools and certifications behind your compliance work.'
  },
  {
    title: 'PCI DSS compliance',
    href: '/docs/pci-dss-compliance',
    icon: 'az az-wallet',
    text: 'PCI DSS 4.0 Level 1, and what it covers for cardholder data.'
  },
  {
    title: 'SOC compliance',
    href: '/docs/soc-compliance',
    icon: 'az az-lock',
    text: 'SOC 2 Type 2 and SOC 3 reports, twice a year.'
  },
  {
    title: 'Activity History',
    href: '/docs/activity-history',
    icon: 'az az-history',
    text: 'The audit trail: who changed what, and when.'
  },
  {
    title: 'Security Response Team',
    href: '/docs/security-response-team',
    icon: 'az az-users',
    text: 'Azion security specialists to analyze threats and investigate attacks.'
  }
]
export const followAlong = [
  {
    title: 'Release notes',
    href: '/docs/release-notes',
    icon: 'az az-megaphone',
    text: 'What changed in Azion products, as it ships.'
  },
  {
    title: 'Blog',
    href: 'https://www.azion.com/en/blog/',
    icon: 'az az-book',
    text: 'Engineering posts and how customers run on Azion.',
    link: 'Read the blog',
    target: '_blank' as const
  },
  {
    title: 'YouTube',
    href: 'https://www.youtube.com/aziontech',
    icon: 'az az-youtube',
    text: 'Walkthroughs, demos, and recorded sessions.',
    link: 'Watch on YouTube',
    target: '_blank' as const
  },
  {
    title: 'Discord',
    href: 'https://discord.gg/azion',
    icon: 'az az-discord',
    text: 'Ask questions and compare notes with other builders.',
    link: 'Join the Discord',
    target: '_blank' as const
  }
]
