import figma from '@figma/code-connect/html'

import MenuItem from './menu-item.vue'

/**
 * Figma Webkit MenuItem (3601:2693) — option row and group overline.
 */
figma.connect(
  MenuItem,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3601-2693',
  {
    props: {
      kind: figma.enum('Type', {
        Option: 'option',
        Group: 'group'
      }),
      selected: figma.boolean('Selected'),
      label: figma.string('Label'),
      tagValue: figma.boolean('Show Tag', {
        true: 'Label',
        false: undefined
      })
    },
    example: ({ kind, selected, label, tagValue }) => {
      const selectedAttr = selected ? ' selected' : ''
      const tagAttr = tagValue ? ` tag-value="${tagValue}" tag-severity="info"` : ''
      return `<MenuItem kind="${kind}" label="${label}"${selectedAttr}${tagAttr} icon="pi pi-home" />`
    }
  }
)
