import CollectionPreferences from '@aziontech/webkit/collection-preferences'

import Example0 from '../../../../../../../packages/webkit/examples/collection-preferences/default.vue'
import source0 from '../../../../../../../packages/webkit/examples/collection-preferences/default.vue?raw'
import Example1 from '../../../../../../../packages/webkit/examples/collection-preferences/in-a-drawer.vue'
import source1 from '../../../../../../../packages/webkit/examples/collection-preferences/in-a-drawer.vue?raw'

export default {
  title: 'Components/Primitives/Data/CollectionPreferences',
  component: CollectionPreferences,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' },
      description: {
        component:
          "The preferences panel of a collection, after Cloudscape's collection preferences: a cog button opens a dialog (or a drawer) with the page size, the columns (shown, hidden and ordered; a locked column always shows), wrapped lines, striped rows and density. Changes are a draft until Confirm; Cancel, `Esc` and the close button discard them. It holds no saved state itself: `useCollection` saves the confirmed value in `localStorage` and `preferencesProps` binds the value, the columns and the page sizes in one `v-bind`."
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
          'The cog button opens a dialog with page size, the columns (show, hide and move up or down; a locked column always shows), wrap lines, striped rows and density. Nothing changes until Confirm; Cancel, Esc and the close button discard the draft.'
      },
      source: { code: source0 }
    }
  }
}

export const InADrawer = {
  render: () => ({ components: { Example: Example1 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          '`container="drawer"` opens the panel from the side, `sections` keeps only the columns and the density, and the `trigger` slot replaces the cog with a labelled button.'
      },
      source: { code: source1 }
    }
  }
}
