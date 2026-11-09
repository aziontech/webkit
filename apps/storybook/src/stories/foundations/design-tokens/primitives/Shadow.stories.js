import { tokenPage } from '../../../../foundations/token-page.js'

export default {
  title: 'Foundations/Design Tokens/Primitives/Shadow',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Elevation and depth, previewed on a light surface so the ink stays readable in both themes.'
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
    title: 'Shadow',
    lede: 'Elevation and depth, previewed on a light surface so the ink stays readable in both themes.',
    families: ['shadow', 'drop-shadow', 'inset-shadow']
  })
}
