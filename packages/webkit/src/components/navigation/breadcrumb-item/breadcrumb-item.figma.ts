import figma from '@figma/code-connect/html'

import BreadcrumbItem from './breadcrumb-item.vue'

figma.connect(
  BreadcrumbItem,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6288',
  {
    props: {
      current: figma.boolean('lastItem'),
      showIcon: figma.boolean('showIcon'),
      label: figma.string('text')
    },
    example: ({ current, showIcon, label }) => {
      const currentAttr = current ? ' current' : ''
      const iconAttr = showIcon ? ' show-icon' : ''
      return `<BreadcrumbItem label="${label}"${currentAttr}${iconAttr} />`
    }
  }
)
