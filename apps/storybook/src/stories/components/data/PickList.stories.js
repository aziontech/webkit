import PickList from '@aziontech/webkit/pick-list'
import { ref } from 'vue'

const sampleModel = () => [
  [
    { id: 1, label: 'Edge Functions' },
    { id: 2, label: 'WAF' },
    { id: 3, label: 'Image Processor' }
  ],
  [{ id: 4, label: 'Cache' }]
]

// "Show code" source. The render is multi-element (a wrapper, the v-model
// wiring, and the #item slot), which Storybook's dynamic source can't
// introspect — so each story sets an explicit, runnable `docs.source.code`.
// One builder keeps the SFCs in sync; each story passes only the extra
// PickList attributes it sets on top of the shared base.
const SOURCE_MODEL = `const model = ref([
  [
    { id: 1, label: 'Edge Functions' },
    { id: 2, label: 'WAF' },
    { id: 3, label: 'Image Processor' }
  ],
  [{ id: 4, label: 'Cache' }]
])`

const sourceFor = (extraAttrs = []) =>
  [
    '<script setup>',
    "import PickList from '@aziontech/webkit/pick-list'",
    "import { ref } from 'vue'",
    '',
    SOURCE_MODEL,
    '</script>',
    '',
    '<template>',
    '  <PickList',
    '    v-model="model"',
    '    data-key="id"',
    '    source-header="Available"',
    '    target-header="Selected"',
    ...extraAttrs.map((attr) => `    ${attr}`),
    '  >',
    '    <template #item="{ item }">{{ item.label }}</template>',
    '  </PickList>',
    '</template>'
  ].join('\n')

/** @type {import('@storybook/vue3').Meta<typeof PickList>} */
const meta = {
  title: 'Components/Data/PickList',
  component: PickList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Dual-list transfer control: a labelled source listbox and a labelled target listbox with controls to move items between them and (optionally) reorder items within a list. Use it when the consumer needs to build an ordered subset from a pool of options where both the chosen set and the remaining pool stay visible.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: false,
      description: 'Bound pair of lists as [sourceItems, targetItems] (v-model).',
      table: { type: { summary: '[unknown[], unknown[]]' }, category: 'props' }
    },
    dataKey: {
      control: 'text',
      description: 'Item field that uniquely identifies a record.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" }, category: 'props' }
    },
    sourceHeader: {
      control: 'text',
      description: 'Heading text for the source list; also its accessible name.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" }, category: 'props' }
    },
    targetHeader: {
      control: 'text',
      description: 'Heading text for the target list; also its accessible name.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" }, category: 'props' }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all selection and move controls and applies disabled tokens.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    reorderable: {
      control: 'boolean',
      description: 'Shows up/down reorder controls that move selected items within their own list.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    loading: {
      control: { type: 'select' },
      options: [false, 'source', 'target', true],
      description: "Shows a spinner in place of a list's items and locks moves. true = both lists; 'source'/'target' = one side.",
      table: {
        type: { summary: "boolean | 'source' | 'target'" },
        defaultValue: { summary: 'false' },
        category: 'props'
      }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted with the new [sourceItems, targetItems] pair.',
      table: { type: { summary: '[unknown[], unknown[]]' }, category: 'events' }
    },
    onMove: {
      action: 'move',
      description: 'Fired after items move between lists, with the moved items.',
      table: {
        type: { summary: "{ direction: 'to-target' | 'to-source'; items: unknown[] }" },
        category: 'events'
      }
    },
    onReorder: {
      action: 'reorder',
      description: 'Fired after a reorder, with the items in the affected list.',
      table: {
        type: { summary: "{ list: 'source' | 'target'; items: unknown[] }" },
        category: 'events'
      }
    },
    item: {
      control: false,
      description: 'Renders a single row; receives the item, its index, and which list it belongs to.',
      table: { type: { summary: 'slot' }, category: 'slots' }
    },
    sourceHeaderSlot: {
      control: false,
      name: 'sourceHeader',
      description: 'Overrides the source heading content.',
      table: { type: { summary: 'slot' }, category: 'slots' }
    },
    targetHeaderSlot: {
      control: false,
      name: 'targetHeader',
      description: 'Overrides the target heading content.',
      table: { type: { summary: 'slot' }, category: 'slots' }
    }
  },
  args: {
    dataKey: 'id',
    sourceHeader: 'Available',
    targetHeader: 'Selected',
    disabled: false,
    reorderable: false,
    loading: false
  }
}

export default meta

const Template = (args) => ({
  components: { PickList },
  setup() {
    const value = ref(args.modelValue ?? sampleModel())
    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:modelValue']?.(next)
    }
    return { args, value, onUpdate }
  },
  template: `
    <div class="max-w-[var(--container-xl)]">
      <PickList
        v-bind="args"
        :model-value="value"
        @update:model-value="onUpdate"
        @move="args.onMove"
        @reorder="args.onReorder"
      >
        <template #item="{ item }">{{ item.label }}</template>
      </PickList>
    </div>
  `
})

/** @type {import('@storybook/vue3').StoryObj<typeof PickList>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      source: { code: sourceFor() },
      description: { story: 'Two lists with select-and-move and move-all controls.' }
    }
  }
}

export const Disabled = {
  args: { disabled: true },
  render: Template,
  parameters: {
    docs: {
      source: { code: sourceFor(['disabled']) },
      description: { story: 'Disabled state: selection and all move controls are inert.' }
    }
  }
}

export const Loading = {
  args: { loading: 'source' },
  render: Template,
  parameters: {
    docs: {
      source: { code: sourceFor(['loading="source"']) },
      description: {
        story:
          "One side loading: the source shows a spinner and its moves are locked while the target stays interactive. Set the `loading` control to `true` for both sides, or `'target'` for the other side."
      }
    }
  }
}

export const WithReorder = {
  args: { reorderable: true },
  render: Template,
  parameters: {
    docs: {
      source: { code: sourceFor(['reorderable']) },
      description: {
        story:
          'Reorder controls (up/down) appear above the target list and move the selected items within their own list.'
      }
    }
  }
}
