export const crumbs = [
  { label: 'Fundamentals', href: '/docs/fundamentals' },
  { label: 'Get started', href: '/docs/get-started' },
  { label: 'First deploy' }
]

export const metaActions = [
  { value: 'copy', label: 'Copy as Markdown', icon: 'az az-copy' },
  { value: 'markdown', label: 'View as Markdown', icon: 'az az-eye' },
  {
    value: 'agent-setup',
    label: 'Agent setup',
    icon: 'az az-microchip-ai',
    href: '/docs/agent-setup'
  }
]

export const testTabs = [
  {
    label: 'Shell',
    value: 'shell',
    language: 'bash',
    code: 'curl -I https://<your-azion-domain>',
    output: 'HTTP/2 200'
  }
]
export const installTabs = [
  {
    label: 'Shell',
    value: 'shell',
    language: 'bash',
    code: 'curl -fsSL https://cli.azion.app/install.sh | bash'
  }
]
export const deployTabs = [
  { label: 'Shell', value: 'shell', language: 'bash', code: 'azion login\nazion deploy' }
]

export const related = [
  {
    title: 'Applications',
    icon: 'az az-layout-grid',
    href: '/docs/applications',
    text: 'Route requests, cache responses and run code with rules.'
  },
  {
    title: 'Functions',
    icon: 'az az-code',
    href: '/docs/functions',
    text: 'Serverless code that runs close to your users.'
  },
  {
    title: 'Azion CLI',
    icon: 'az az-desktop',
    href: '/docs/azion-cli',
    text: 'Build and deploy from your terminal.'
  }
]
