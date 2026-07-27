import figma, { html } from '@figma/code-connect/html'

const FIGMA_NODE = 'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3548-578'

figma.connect(FIGMA_NODE, {
  label: 'Link',
  imports: ['import Link from "@aziontech/webkit/link"'],
  props: {
    label: figma.string('label'),
    size: figma.enum('Size', {
      Large: 'large',
      Medium: 'medium',
      Small: 'small'
    }),
    showIcon: figma.boolean('showIcon')
  },
  example: ({ label, size, showIcon }) => html`
    <link
      label=${label}
      size=${size}
      :show-icon=${showIcon}
      href="#"
    />
  `
})
