import Provider from '@aziontech/webkit/provider'

import Example0 from '../../../../../../../packages/webkit/examples/provider/default.vue'
import source0 from '../../../../../../../packages/webkit/examples/provider/default.vue?raw'
import Example1 from '../../../../../../../packages/webkit/examples/provider/custom-messages.vue'
import source1 from '../../../../../../../packages/webkit/examples/provider/custom-messages.vue?raw'
import Example2 from '../../../../../../../packages/webkit/examples/provider/right-to-left.vue'
import source2 from '../../../../../../../packages/webkit/examples/provider/right-to-left.vue?raw'

export default {
  title: 'Components/Primitives/Utils/WebkitProvider',
  component: Provider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' },
      description: {
        component:
          "Sets the language and text direction of every WebKit component below it. Mount it once at the app root with the user's locale: built-in strings come from the `en`, `pt-BR` or `es` catalog, dates, numbers and plurals go through `Intl`, and the root carries `lang` and `dir`. With no provider, components fall back to English."
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
          'Mounted with `locale="pt-BR"`: Pagination and ConfirmDialog read their built-in labels in Portuguese and format numbers for Brazil.'
      },
      source: { code: source0 }
    }
  }
}

export const CustomMessages = {
  render: () => ({ components: { Example: Example1 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          '`messages` replaces one built-in string for the whole subtree; the rest of the catalog stays.'
      },
      source: { code: source1 }
    }
  }
}

export const RightToLeft = {
  render: () => ({ components: { Example: Example2 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          '`locale="ar"` derives `dir="rtl"`: the subtree reads right to left and strings with no Arabic catalog fall back to English.'
      },
      source: { code: source2 }
    }
  }
}
