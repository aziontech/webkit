const COLUMNS = [
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
  {
    title: 'Company',
    links: ['About', 'Customers', 'Partners', 'Careers', 'Blog', 'Contact']
  }
]

const SOCIALS = [
  { icon: 'pi pi-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' },
  {
    icon: 'pi pi-linkedin',
    label: 'Azion on LinkedIn',
    href: 'https://www.linkedin.com/company/aziontech'
  },
  { icon: 'pi pi-youtube', label: 'Azion on YouTube', href: 'https://www.youtube.com/aziontech' },
  { icon: 'ai ai-x', label: 'Azion on X', href: 'https://x.com/aziontech' },
  {
    icon: 'pi pi-instagram',
    label: 'Azion on Instagram',
    href: 'https://www.instagram.com/aziontech'
  },
  { icon: 'pi pi-discord', label: 'Azion on Discord', href: 'https://discord.gg/azion' },
  { icon: 'pi pi-reddit', label: 'Azion on Reddit', href: 'https://www.reddit.com/r/aziontech' }
]

export const SITE_SECTION = {
  _id: 'site-footer',
  props: {
    kind: 'site',
    ariaLabel: 'Footer',
    home: '#',
    homeAriaLabel: 'Azion home',
    columns: COLUMNS.map((column) => ({
      title: column.title,
      links: column.links.map((label) => ({ label, href: '#' }))
    })),
    socials: SOCIALS,
    statusLabel: 'All Systems Operational',
    languages: ['EN', 'PT-BR', 'ES'],
    languageAriaLabel: 'Language'
  }
}
