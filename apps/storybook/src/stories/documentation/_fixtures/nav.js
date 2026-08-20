// Fixture navigation for the documentation stories — the shape a docs site
// hands the shell, not part of the component API.

/** The section tree shown in the documentation rail. */
export const DOC_NAV = [
  {
    label: 'Start',
    items: [
      { label: 'What is Azion', href: '#' },
      { label: 'Create an account', href: '#' },
      { label: 'Deploy an application', href: '#', active: true }
    ]
  },
  {
    label: 'Build',
    items: [
      { label: 'Templates', href: '#' },
      { label: 'Import from GitHub', href: '#' },
      { label: 'Azion CLI', href: '#' },
      { label: 'Runtime APIs', href: '#' }
    ]
  },
  {
    label: 'Operate',
    items: [
      { label: 'Cache settings', href: '#' },
      { label: 'Rules Engine', href: '#' },
      { label: 'Observability', href: '#' }
    ]
  }
]

/** The trail above the example page's title. */
export const PAGE_BREADCRUMB = [{ label: 'Start', href: '#' }, { label: 'Deploy an application' }]

/** The page before the example page. */
export const DOC_PREVIOUS = { title: 'Create an account', href: '#' }

/** The page after the example page. */
export const DOC_NEXT = { title: 'Configure a domain', href: '#' }
