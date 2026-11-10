import CopyButton from '@aziontech/webkit/copy-button'
import Hint from '@aziontech/webkit/hint'
import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
import Link from '@aziontech/webkit/link'
import StatusIndicator from '@aziontech/webkit/status-indicator'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import KeyValuePairs from '@aziontech/webkit/key-value-pairs'"
const COPY_IMPORT = "import CopyButton from '@aziontech/webkit/copy-button'"
const HINT_IMPORT = "import Hint from '@aziontech/webkit/hint'"
const LINK_IMPORT = "import Link from '@aziontech/webkit/link'"
const STATUS_IMPORT = "import StatusIndicator from '@aziontech/webkit/status-indicator'"

const FACTS_IMPORTS = [IMPORT, COPY_IMPORT, LINK_IMPORT, STATUS_IMPORT]
const GROUPS_IMPORTS = [IMPORT, COPY_IMPORT, HINT_IMPORT, LINK_IMPORT, STATUS_IMPORT]

const components = {
  KeyValuePairs,
  'KeyValuePairs.Item': KeyValuePairs.Item,
  'KeyValuePairs.Group': KeyValuePairs.Group,
  CopyButton,
  Hint,
  Link,
  StatusIndicator
}

/** @type {import('@storybook/vue3').Meta<typeof KeyValuePairs>} */
const meta = {
  title: 'Components/Primitives/Content/KeyValuePairs',
  component: KeyValuePairs,
  subcomponents: {
    'KeyValuePairs.Item': KeyValuePairs.Item,
    'KeyValuePairs.Group': KeyValuePairs.Group
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A grid of labelled facts about one subject. Each pair is a key and its value, which can be plain text or a composed component such as a `Link`, `Tag`, `CopyButton` or `StatusIndicator`. It renders a native description list in 1 to 4 responsive columns, can split the facts into titled groups, and owns its loading and empty-value surfaces.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    columns: {
      control: 'select',
      options: [1, 2, 3, 4],
      description:
        'Columns at full width; collapses to one column below md and to two at md when set to 3 or 4.',
      table: {
        category: 'props',
        type: { summary: '1 | 2 | 3 | 4' },
        defaultValue: { summary: '1' }
      }
    },
    loading: {
      control: 'boolean',
      description:
        'Replaces every value with a skeleton while the data loads; labels stay visible.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the list when no visible heading names it.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    default: {
      control: false,
      description:
        'The `KeyValuePairs.Item` children, or `KeyValuePairs.Group` children, one shape per instance.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: { columns: 1, loading: false, ariaLabel: 'Workload details' }
}

export default meta

const FACTS = `
  <KeyValuePairs.Item label="Workload ID">
    <span>1752167890</span>
    <CopyButton value="1752167890" aria-label="Copy workload ID" />
  </KeyValuePairs.Item>
  <KeyValuePairs.Item label="Status">
    <StatusIndicator severity="success" label="Active" />
  </KeyValuePairs.Item>
  <KeyValuePairs.Item label="Created">Nov 10, 2026, 14:32</KeyValuePairs.Item>
  <KeyValuePairs.Item label="Region">South America (São Paulo)</KeyValuePairs.Item>
  <KeyValuePairs.Item label="Domain">
    <Link label="shop.example.com" href="https://shop.example.com" size="small" />
  </KeyValuePairs.Item>`

const Template = (args) => ({
  components,
  setup: () => ({ args }),
  template: `<KeyValuePairs v-bind="args">${FACTS}
</KeyValuePairs>`
})

const DEFAULT_MARKUP = `<KeyValuePairs aria-label="Workload details">${FACTS}
</KeyValuePairs>`

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The facts band of a resource detail page: an ID with its copy button, a status, the creation date, a region and a linked domain, in one column.'
      },
      source: { code: toSfc(FACTS_IMPORTS, DEFAULT_MARKUP) }
    }
  }
}

const COLUMNS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xl)">
  <KeyValuePairs :columns="2" aria-label="Workload details in two columns">${FACTS}
  </KeyValuePairs>
  <KeyValuePairs :columns="3" aria-label="Workload details in three columns">${FACTS}
  </KeyValuePairs>
  <KeyValuePairs :columns="4" aria-label="Workload details in four columns">${FACTS}
  </KeyValuePairs>
</div>`

export const Columns = {
  render: () => ({ components, template: COLUMNS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The same facts at 2, 3 and 4 columns. Below md every grid collapses to one column, and 3 or 4 columns fall back to two at md.'
      },
      source: { code: toSfc(FACTS_IMPORTS, COLUMNS_TEMPLATE) }
    }
  }
}

const GROUPS_TEMPLATE = `<KeyValuePairs :columns="3" aria-label="Workload details">
  <KeyValuePairs.Group title="General">
    <KeyValuePairs.Item label="Workload ID">
      <span>1752167890</span>
      <CopyButton value="1752167890" aria-label="Copy workload ID" />
    </KeyValuePairs.Item>
    <KeyValuePairs.Item label="Status">
      <StatusIndicator severity="success" label="Active" />
    </KeyValuePairs.Item>
    <KeyValuePairs.Item label="Created">Nov 10, 2026, 14:32</KeyValuePairs.Item>
  </KeyValuePairs.Group>
  <KeyValuePairs.Group title="Networking">
    <KeyValuePairs.Item label="Domain">
      <Link label="shop.example.com" href="https://shop.example.com" size="small" />
    </KeyValuePairs.Item>
    <KeyValuePairs.Item label="Region">
      <template #info>
        <Hint text="Where the workload was first provisioned." />
      </template>
      South America (São Paulo)
    </KeyValuePairs.Item>
    <KeyValuePairs.Item label="Custom certificate" />
  </KeyValuePairs.Group>
  <KeyValuePairs.Group title="Source">
    <KeyValuePairs.Item label="Repository">acme/storefront</KeyValuePairs.Item>
    <KeyValuePairs.Item label="Branch">main</KeyValuePairs.Item>
    <KeyValuePairs.Item label="Framework">Next.js</KeyValuePairs.Item>
  </KeyValuePairs.Group>
</KeyValuePairs>`

export const Groups = {
  render: () => ({ components, template: GROUPS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Facts split into titled columns, one group per column. The Region key carries an info hint, and the custom certificate has no value, so it shows the empty-value marker.'
      },
      source: { code: toSfc(GROUPS_IMPORTS, GROUPS_TEMPLATE) }
    }
  }
}

const LOADING_MARKUP = `<KeyValuePairs loading aria-label="Workload details">${FACTS}
</KeyValuePairs>`

export const Loading = {
  args: { loading: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'While the data loads, every value becomes a skeleton and the labels stay in place, so the layout does not jump when the values arrive.'
      },
      source: { code: toSfc(FACTS_IMPORTS, LOADING_MARKUP) }
    }
  }
}
