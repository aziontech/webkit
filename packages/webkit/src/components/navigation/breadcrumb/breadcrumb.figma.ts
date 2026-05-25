import figma from '@figma/code-connect/html'

import Breadcrumb from './breadcrumb.vue'

figma.connect(
  Breadcrumb,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6301',
  {
    props: {
      level: figma.enum('Level', {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5'
      })
    },
    example: () =>
      `<Breadcrumb :items="[
  { label: 'Page Name', href: '#' },
  { label: 'Page Name', href: '#' },
  { label: 'Page Name', href: '#' },
  { label: 'Page Name', href: '#' },
  { label: 'Current Page', current: true }
]" />`
  }
)
