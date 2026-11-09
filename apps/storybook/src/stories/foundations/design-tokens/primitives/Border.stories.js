import { tokenPage } from '../../../../foundations/token-page.js'

export default {
  title: 'Foundations/Design Tokens/Primitives/Border',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component: 'Stroke weights, and the gap between an element and its focus ring.'
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
    title: 'Border',
    lede: 'Stroke weights, and the gap between an element and its focus ring.',
    families: ['border', 'ring-offset']
  })
}
