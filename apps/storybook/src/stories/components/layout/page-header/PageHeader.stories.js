import PageHeader from '@aziontech/webkit/page-header'

import Example0 from '../../../../../../../packages/webkit/examples/page-header/default.vue'
import source0 from '../../../../../../../packages/webkit/examples/page-header/default.vue?raw'
import Example1 from '../../../../../../../packages/webkit/examples/page-header/settings-page.vue'
import source1 from '../../../../../../../packages/webkit/examples/page-header/settings-page.vue?raw'
import Example2 from '../../../../../../../packages/webkit/examples/page-header/sizes.vue'
import source2 from '../../../../../../../packages/webkit/examples/page-header/sizes.vue?raw'
import Example3 from '../../../../../../../packages/webkit/examples/page-header/rich-description.vue'
import source3 from '../../../../../../../packages/webkit/examples/page-header/rich-description.vue?raw'

export default {
  title: 'Components/Primitives/Layout/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' },
      description: {
        component:
          'The heading that opens a console page: an h1 whose `size` picks the heading token by page level, a one-line description, and the actions the page owns on the right. When the row runs out of room the actions move below the copy together; on a phone they stack, each at full width. It replaces the header markup every list, detail, settings and create page used to copy by hand.'
      }
    }
  }
}

export const ListPage = {
  render: () => ({ components: { Example: Example0 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'A first-level list page: medium h1, one-line description, and the outlined Documentation and create actions on the right; on a phone they stack, each at full width.'
      },
      source: { code: source0 }
    }
  }
}

export const SettingsPage = {
  render: () => ({ components: { Example: Example1 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story: 'A settings sub-page or a detail tab: small title and description, no actions.'
      },
      source: { code: source1 }
    }
  }
}

export const Sizes = {
  render: () => ({ components: { Example: Example2 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'The three heading scales: large for a creation hub headline, medium for a first-level page, small for detail tabs and settings sub-pages.'
      },
      source: { code: source2 }
    }
  }
}

export const RichDescription = {
  render: () => ({ components: { Example: Example3 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'The `description` slot carries inline buttons or links when one plain sentence is not enough.'
      },
      source: { code: source3 }
    }
  }
}
