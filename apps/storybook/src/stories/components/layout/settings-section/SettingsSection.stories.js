import SettingsSection from '@aziontech/webkit/settings-section'

import Example0 from '../../../../../../../packages/webkit/examples/settings-section/default.vue'
import source0 from '../../../../../../../packages/webkit/examples/settings-section/default.vue?raw'
import Example1 from '../../../../../../../packages/webkit/examples/settings-section/stacked.vue'
import source1 from '../../../../../../../packages/webkit/examples/settings-section/stacked.vue?raw'
import Example2 from '../../../../../../../packages/webkit/examples/settings-section/collapsible.vue'
import source2 from '../../../../../../../packages/webkit/examples/settings-section/collapsible.vue?raw'

export default {
  title: 'Components/Primitives/Layout/SettingsSection',
  component: SettingsSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' },
      description: {
        component:
          'A band of a settings page: an h2 with a `Hint` glyph that carries the one-sentence guidance, over the band body (usually a flush `Card` of `SettingRow` rows). Bands stack at the section gap with no rule between them. An anchored band shows a copy-link button in the gutter when the heading is hovered or focused; a collapsible band turns the heading into a disclosure that unfolds the body along the grid track.'
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
          'One anchored band: the h2 with its Hint guidance and a gutter copy-link, over a flush Card of SettingRow rows.'
      },
      source: { code: source0 }
    }
  }
}

export const Stacked = {
  render: () => ({ components: { Example: Example1 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          "A resource's Settings tab: the General and Features bands stacked one under the other at the section gap, with no rule between them."
      },
      source: { code: source1 }
    }
  }
}

export const Collapsible = {
  render: () => ({ components: { Example: Example2 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'The collapsible Advanced band, closed: the cog glyph and the title are the disclosure trigger, and the body unfolds along the grid track when it opens.'
      },
      source: { code: source2 }
    }
  }
}
