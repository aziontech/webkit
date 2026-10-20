import { tokenPage } from '../../../../foundations/token-page.js'

export default {
  title: 'Foundations/Design Tokens/Responsive/Spacing',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'The spacing steps components use. Each step is one CSS variable that changes value at a breakpoint, so a gap or a padding grows with the viewport without a breakpoint class.'
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
          'Every responsive spacing step parsed from the published @aziontech/theme stylesheet, as one table row: a live sample, its Tailwind utility, its CSS variable and its value at each breakpoint. The button at the end of the row copies the Tailwind utility.'
      }
    }
  },
  render: tokenPage({
    title: 'Spacing',
    lede: 'The spacing steps components use, from xxs to xxl. Each one changes value at a breakpoint, so the bar is the live value: resize the canvas to watch the larger steps grow. Raw lists the base value, then each breakpoint that changes it.',
    families: ['responsive-spacing']
  })
}
