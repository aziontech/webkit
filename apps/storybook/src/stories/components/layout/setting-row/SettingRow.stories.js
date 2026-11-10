import SettingRow from '@aziontech/webkit/setting-row'

import Example0 from '../../../../../../../packages/webkit/examples/setting-row/default.vue'
import source0 from '../../../../../../../packages/webkit/examples/setting-row/default.vue?raw'
import Example1 from '../../../../../../../packages/webkit/examples/setting-row/compact-rows.vue'
import source1 from '../../../../../../../packages/webkit/examples/setting-row/compact-rows.vue?raw'
import Example2 from '../../../../../../../packages/webkit/examples/setting-row/with-message.vue'
import source2 from '../../../../../../../packages/webkit/examples/setting-row/with-message.vue?raw'
import Example3 from '../../../../../../../packages/webkit/examples/setting-row/nested.vue'
import source3 from '../../../../../../../packages/webkit/examples/setting-row/nested.vue?raw'

export default {
  title: 'Components/Primitives/Layout/SettingRow',
  component: SettingRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' },
      description: {
        component:
          'One setting inside a flush `Card`: an `Item` whose content carries the title and description, with the control placed by what it needs. A typed or picked field sits in a right cell capped at the 3xs container so every field on the card ends at the same edge (`field`); a switch or a button sits hard right at its natural width (`compact`); a textarea, list, radio group or editor drops under the copy at the full measure (`stacked`). A child setting indents one or two levels under a rule (`level`).'
      }
    }
  }
}

export const SettingsCard = {
  render: () => ({ components: { Example: Example0 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'Field rows inside a flush Card: typed fields sit in a right cell capped at the 3xs container (`field`), and a textarea drops under the copy at the full measure (`stacked`).'
      },
      source: { code: source0 }
    }
  }
}

export const CompactRows = {
  render: () => ({ components: { Example: Example1 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'Login settings: two switches and a Manage button, each at its natural width against the right edge (`compact`).'
      },
      source: { code: source1 }
    }
  }
}

export const WithMessage = {
  render: () => ({ components: { Example: Example2 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'A Name row after Save was pressed with it empty: the input carries its required state and the HelperText message sits under it in the control column.'
      },
      source: { code: source2 }
    }
  }
}

export const Nested = {
  render: () => ({ components: { Example: Example3 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'Protocol rows that depend on a switch above them: HTTPS rows indent one level (`level` 1) and HTTP/3 ports a second level (`level` 2), each behind a rule.'
      },
      source: { code: source3 }
    }
  }
}
