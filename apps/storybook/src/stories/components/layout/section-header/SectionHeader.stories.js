import SectionHeader from '@aziontech/webkit/section-header'

import Example0 from '../../../../../../../packages/webkit/examples/section-header/default.vue'
import source0 from '../../../../../../../packages/webkit/examples/section-header/default.vue?raw'
import Example1 from '../../../../../../../packages/webkit/examples/section-header/with-actions.vue'
import source1 from '../../../../../../../packages/webkit/examples/section-header/with-actions.vue?raw'
import Example2 from '../../../../../../../packages/webkit/examples/section-header/sizes.vue'
import source2 from '../../../../../../../packages/webkit/examples/section-header/sizes.vue?raw'

export default {
  title: 'Components/Primitives/Layout/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' },
      description: {
        component:
          "The heading of one band inside a page: an h2 with a one-line description, a copy-link button that appears when the heading is hovered or focused (when it has an `anchor`), and the band's own actions on the right. Below `md` the actions drop under the copy."
      }
    }
  }
}

export const Default = {
  render: () => ({ components: { Example: Example0 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          "A band heading with an anchor: the h2 takes the id, a copy-link button appears when the heading is hovered or focused, and the band's action sits on the right."
      },
      source: { code: source0 }
    }
  }
}

export const WithActions = {
  render: () => ({ components: { Example: Example1 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'The Billing payment-methods heading, with the outlined Add payment method action and its plus glyph on the right.'
      },
      source: { code: source1 }
    }
  }
}

export const Sizes = {
  render: () => ({ components: { Example: Example2 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: { story: 'Medium, the band heading, and small, a muted label-sized heading.' },
      source: { code: source2 }
    }
  }
}
