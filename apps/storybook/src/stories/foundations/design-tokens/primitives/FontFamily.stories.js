import { tokenPage } from '../../../../foundations/token-page.js'

export default {
  title: 'Foundations/Design Tokens/Primitives/Font Family',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Three faces: Sora for interface text, Roboto Mono for code, Proto Mono for display numerals. Components get them through the text-* classes; reach for --font-* only where no class fits.'
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
    title: 'Font Family',
    lede: 'Three faces: Sora for interface text, Roboto Mono for code, Proto Mono for display numerals. Components get them through the text-* classes; reach for --font-* only where no class fits.',
    families: ['font-family']
  })
}
