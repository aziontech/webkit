import { tokenPage } from '../../../../foundations/token-page.js'

export default {
  title: 'Foundations/Design Tokens/Primitives/Spacing',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Fixed lengths on a 4px step. Component spacing uses the responsive var(--spacing-xs \u2026 xxl) steps, which resolve to values on this scale.'
      },
      canvas: { sourceState: 'none' }
    }
  }
}

export const Overview = {
  name: 'Overview',
  parameters: {
    docs: {
      description: {
        story:
          'Every token parsed from the published @aziontech/theme stylesheet, as one table row: a live sample, its Tailwind utility, its CSS variable and its raw value. The button at the end of the row copies the Tailwind utility.'
      }
    }
  },
  render: tokenPage({
    title: 'Spacing',
    lede: 'Fixed lengths on a 4px step. Component spacing uses the responsive var(--spacing-xs \u2026 xxl) steps, which resolve to values on this scale.',
    families: ['spacing']
  })
}
