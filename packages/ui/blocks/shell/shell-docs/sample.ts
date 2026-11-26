import type { DocLayoutNavGroup, DocLayoutSection } from '@aziontech/ui/doc-layout'
import type { DocTableOfContentsGroup } from '@aziontech/ui/doc-table-of-contents'

import type { ShellDocsFooterColumn, ShellDocsSocial } from './shell-docs.vue'

export const sampleSections: DocLayoutSection[] = [
  { label: 'Reference', href: '/docs/reference' },
  { label: 'Guides', href: '/docs/guides' },
  { label: 'Dev tools', href: '/docs/dev-tools' }
]

export const sampleNavigation: DocLayoutNavGroup[] = [
  {
    label: 'Get started',
    items: [
      { id: 'overview', label: 'Overview', href: '/docs' },
      {
        id: 'get-started',
        label: 'Get started',
        type: 'inline',
        defaultOpen: true,
        children: [
          {
            id: 'create-an-account',
            label: 'Create an account',
            href: '/docs/get-started/create-an-account'
          },
          { id: 'first-deploy', label: 'First deploy', href: '/docs/get-started/first-deploy' }
        ]
      }
    ]
  },
  {
    label: 'Functions',
    items: [
      { id: 'functions-overview', label: 'Overview', href: '/docs/functions' },
      {
        id: 'functions-getting-started',
        label: 'Getting started',
        href: '/docs/functions/getting-started'
      },
      { id: 'functions-limits', label: 'Limits', href: '/docs/functions/limits' }
    ]
  },
  {
    label: 'Applications',
    items: [
      { id: 'applications-overview', label: 'Overview', href: '/docs/applications' },
      { id: 'applications-cache', label: 'Cache', href: '/docs/applications/cache' }
    ]
  },
  {
    label: 'Dev tools',
    items: [
      { id: 'azion-cli', label: 'Azion CLI', href: '/docs/dev-tools/cli' },
      {
        id: 'agent-setup-group',
        label: 'Agent setup',
        type: 'inline',
        defaultOpen: true,
        children: [
          { id: 'agent-setup', label: 'Overview', href: '/docs/agent-setup' },
          { id: 'claude-code', label: 'Claude Code', href: '/docs/agent-setup/claude-code' }
        ]
      }
    ]
  }
]

export const sampleOutlineGroups: DocTableOfContentsGroup[] = [
  {
    label: 'GitHub',
    links: [
      { label: 'Azion Docs', href: 'https://github.com/aziontech', icon: 'az az-github' },
      {
        label: 'Contribute to this page',
        href: 'https://github.com/aziontech/azion',
        icon: 'az az-pencil'
      }
    ]
  },
  {
    label: 'Community',
    links: [
      { label: 'Discord', href: 'https://discord.gg/azion', icon: 'az az-discord' },
      { label: 'X', href: 'https://x.com/aziontech', icon: 'az az-x-brand' }
    ]
  }
]

export const sampleFooterColumns: ShellDocsFooterColumn[] = [
  {
    title: 'Products',
    links: [
      'Functions',
      'Cache',
      'Object Storage',
      'SQL Database',
      'WAF',
      'Edge DNS',
      'Data Stream'
    ]
  },
  {
    title: 'Solutions',
    links: ['Web Apps', 'AI', 'Application Security', 'Financial Services', 'Retail', 'Technology']
  },
  {
    title: 'Developers',
    links: ['Docs', 'API Reference', 'Dev Tools', 'Release Notes', 'Marketplace', 'Status']
  },
  { title: 'Company', links: ['About', 'Customers', 'Partners', 'Careers', 'Blog', 'Contact'] }
]

export const sampleSocials: ShellDocsSocial[] = [
  { icon: 'az az-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' },
  {
    icon: 'az az-linkedin',
    label: 'Azion on LinkedIn',
    href: 'https://www.linkedin.com/company/aziontech'
  },
  {
    icon: 'az az-youtube',
    label: 'Azion on YouTube',
    href: 'https://www.youtube.com/aziontech'
  },
  { icon: 'az az-x-brand', label: 'Azion on X', href: 'https://x.com/aziontech' },
  {
    icon: 'az az-instagram',
    label: 'Azion on Instagram',
    href: 'https://www.instagram.com/aziontech'
  },
  { icon: 'az az-discord', label: 'Azion on Discord', href: 'https://discord.gg/azion' },
  { icon: 'az az-reddit', label: 'Azion on Reddit', href: 'https://www.reddit.com/r/aziontech' }
]
