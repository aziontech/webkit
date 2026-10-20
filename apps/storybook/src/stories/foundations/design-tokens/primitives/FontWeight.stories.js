import { tokenPage } from '../../../../foundations/token-page.js'

export default {
  title: 'Foundations/Design Tokens/Primitives/Font Weight',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'The weights Sora draws, 100 to 800. --font-weight-black (900) still ships, but Sora stops at 800, so it would render as extrabold and is left off this page.'
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
    title: 'Font Weight',
    lede: 'The weights Sora draws, 100 to 800. --font-weight-black (900) still ships, but Sora stops at 800, so it would render as extrabold and is left off this page.',
    families: ['font-weight']
  })
}
