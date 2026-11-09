import { tokenPage } from '../../../../foundations/token-page.js'

export default {
  title: 'Foundations/Design Tokens/Primitives/Z-index',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Stacking order for inputs and their overlays. Consume as z-(--z-input-*), never a numeric z-index.'
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
    title: 'Z-index',
    lede: 'Stacking order for inputs and their overlays. Consume as z-(--z-input-*), never a numeric z-index.',
    families: ['z-index']
  })
}
