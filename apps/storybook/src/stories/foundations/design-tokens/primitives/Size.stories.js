import { tokenPage } from '../../../../foundations/token-page.js'

export default {
  title: 'Foundations/Design Tokens/Primitives/Size',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Fixed dimensions for icons, avatars and controls. --height-* is the same scale: every height token resolves to the size token with the same step, in code and in Figma.'
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
    title: 'Size',
    lede: 'Fixed dimensions for icons, avatars and controls. --height-* is the same scale: every height token resolves to the size token with the same step, in code and in Figma.',
    families: ['size']
  })
}
