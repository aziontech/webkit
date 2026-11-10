import SaveBar from '@aziontech/webkit/save-bar'

import Example0 from '../../../../../../../packages/webkit/examples/save-bar/default.vue'
import source0 from '../../../../../../../packages/webkit/examples/save-bar/default.vue?raw'
import Example1 from '../../../../../../../packages/webkit/examples/save-bar/docked.vue'
import source1 from '../../../../../../../packages/webkit/examples/save-bar/docked.vue?raw'
import Example2 from '../../../../../../../packages/webkit/examples/save-bar/plain.vue'
import source2 from '../../../../../../../packages/webkit/examples/save-bar/plain.vue?raw'

export default {
  title: 'Components/Primitives/Layout/SaveBar',
  component: SaveBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' },
      description: {
        component:
          'The bar at the bottom of a settings or create page that holds the status of unsaved work and its Discard (or Cancel) and Save actions. `floating` overlays the bottom of the scroll region without moving the content and is shown while the form is dirty; `docked` takes its own row at the bottom; `plain` closes a form column saved as one unit, always shown.'
      }
    }
  }
}

export const Floating = {
  render: () => ({ components: { Example: Example0 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'The bar a dirty settings page shows: it overlays the bottom of the scroll region without moving the content, with the status sentence on the left and Discard and Save on the right.'
      },
      source: { code: source0 }
    }
  }
}

export const Docked = {
  render: () => ({ components: { Example: Example1 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'The same bar on its own row at the bottom of the region, for a layout whose scroller ends above it; the status sentence carries a muted second clause.'
      },
      source: { code: source1 }
    }
  }
}

export const Plain = {
  render: () => ({ components: { Example: Example2 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'The footer that closes a form saved as one unit: Cancel and Save on the right of the form column, always shown.'
      },
      source: { code: source2 }
    }
  }
}
