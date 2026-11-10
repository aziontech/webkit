import PageTabs from '@aziontech/webkit/page-tabs'

import Example0 from '../../../../../../../packages/webkit/examples/page-tabs/default.vue'
import source0 from '../../../../../../../packages/webkit/examples/page-tabs/default.vue?raw'
import Example1 from '../../../../../../../packages/webkit/examples/page-tabs/with-actions.vue'
import source1 from '../../../../../../../packages/webkit/examples/page-tabs/with-actions.vue?raw'

export default {
  title: 'Components/Primitives/Navigation/PageTabs',
  component: PageTabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' },
      description: {
        component:
          'The second-level navigation strip of a resource detail page: a full-bleed bar ruled at the bottom, its `Tabs` at the page boundary inset, with room for the actions the whole resource owns on the right (a staged-changes `Tag`, Deploy). It is `Tabs` plus the strip and the actions region, so every detail page stops re-creating the same bar.'
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
          'The second-level navigation of a resource detail page: a full-bleed strip ruled at the bottom, its tabs at the page boundary inset.'
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
          "A service's detail tabs with the actions the resource owns on the right: the staged-changes Tag and the outlined medium Deploy button."
      },
      source: { code: source1 }
    }
  }
}
