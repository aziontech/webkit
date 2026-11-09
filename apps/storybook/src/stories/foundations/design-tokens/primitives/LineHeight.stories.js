import { tokenPage } from '../../../../foundations/token-page.js'

export default {
  title: 'Foundations/Design Tokens/Primitives/Line Height',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Two ways to set a line box: a fixed height in pixels, or a ratio of the font size. The semantic text classes carry their own line height; these are for the rare case outside them.'
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
    title: 'Line Height',
    lede: 'Two ways to set a line box: a fixed height in pixels, or a ratio of the font size. The semantic text classes carry their own line height; these are for the rare case outside them.',
    families: ['line-height', 'leading']
  })
}
