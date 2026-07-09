import PickList from '@aziontech/webkit/pick-list'
import PickListControls from '@aziontech/webkit/pick-list-controls'
import PickListSource from '@aziontech/webkit/pick-list-source'
import PickListTarget from '@aziontech/webkit/pick-list-target'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

// Compound sub-components registered under their dot-notation names so they
// resolve in Storybook's runtime-compiled string templates: Vue compiles
// `<PickList.Source>` to `resolveComponent("PickList.Source")`, an exact-name
// lookup (a bare `PickList` registration does not satisfy it). In a real SFC the
// dotted tag resolves off the imported `PickList` binding, so consumer code
// needs only `import PickList` — these extra registrations are a Storybook
// runtime concern.
const components = {
  PickList,
  'PickList.Source': PickListSource,
  'PickList.Target': PickListTarget,
  'PickList.Controls': PickListControls
}

const sampleModel = () => [
  [
    { id: 1, label: 'Edge Functions' },
    { id: 2, label: 'WAF' },
    { id: 3, label: 'Image Processor' }
  ],
  [{ id: 4, label: 'Cache' }]
]

// "Show code" source. The render composes the root with three sub-components and
// an #item slot, which Storybook's dynamic source cannot introspect — so each
// story sets an explicit, runnable `source.code` built with `toSfc`. One builder
// keeps the SFCs in sync; each story passes only the extra attributes it sets.
const SOURCE_MODEL = `const model = ref([
  [
    { id: 1, label: 'Edge Functions' },
    { id: 2, label: 'WAF' },
    { id: 3, label: 'Image Processor' }
  ],
  [{ id: 4, label: 'Cache' }]
])`

const sourceFor = ({ root = [], source = [], target = [] } = {}) =>
  toSfc(
    [
      "import PickList from '@aziontech/webkit/pick-list'",
      "import { ref } from 'vue'",
      '',
      SOURCE_MODEL
    ],
    [
      '<PickList',
      '  v-model="model"',
      '  data-key="id"',
      ...root.map((attr) => `  ${attr}`),
      '>',
      '  <PickList.Source',
      '    header="Available"',
      ...source.map((attr) => `    ${attr}`),
      '  >',
      '    <template #item="{ item }">{{ item.label }}</template>',
      '  </PickList.Source>',
      '',
      '  <PickList.Controls />',
      '',
      '  <PickList.Target',
      '    header="Selected"',
      ...target.map((attr) => `    ${attr}`),
      '  >',
      '    <template #item="{ item }">{{ item.label }}</template>',
      '  </PickList.Target>',
      '</PickList>'
    ].join('\n')
  )

/** @type {import('@storybook/vue3').Meta<typeof PickList>} */
const meta = {
  title: 'Components/Data/PickList',
  component: PickList,
  subcomponents: { PickListSource, PickListTarget, PickListControls },
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
          'Dual-list transfer control with a compound API: the root `<PickList>` owns the bound `[source, target]` pair and the shared selection/move state, and the consumer composes `<PickList.Source>`, `<PickList.Controls>`, and `<PickList.Target>`. The context-aware `<PickList.Controls>` wires the move buttons with no props; double-clicking an item moves it to the opposite list. Use it to build a subset from a pool where both the chosen set and the remaining pool stay visible.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: false,
      description: 'Bound pair of lists as [sourceItems, targetItems] (v-model).',
      table: {
        type: { summary: '[unknown[], unknown[]]' },
        defaultValue: { summary: '[[], []]' },
        category: 'props'
      }
    },
    dataKey: {
      control: 'text',
      description: 'Item field that uniquely identifies a record.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" }, category: 'props' }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all selection and move controls and applies disabled tokens.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    moveOnDoubleClick: {
      control: 'boolean',
      description:
        'When true (default), double-clicking an item moves it to the opposite list. Set false to keep `item-double-click` firing without the move.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'props' }
    },
    sourceHeader: {
      control: 'text',
      description: 'Heading text for the source list (the `header` prop of `PickList.Source`).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
        category: 'sub-component props (story control)'
      }
    },
    targetHeader: {
      control: 'text',
      description: 'Heading text for the target list (the `header` prop of `PickList.Target`).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
        category: 'sub-component props (story control)'
      }
    },
    loading: {
      control: { type: 'select' },
      options: [false, 'source', 'target', true],
      description:
        "Drives the `loading` prop of each list. true = both lists; 'source'/'target' = one side. A loading list shows a spinner and locks moves.",
      table: {
        type: { summary: "boolean | 'source' | 'target'" },
        defaultValue: { summary: 'false' },
        category: 'sub-component props (story control)'
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
    onItemDoubleClick: {
      action: 'item-double-click',
      description:
        'Fired when an option is double-clicked, with the item, its index, and which list it was in.',
      table: {
        type: { summary: "(event: MouseEvent, payload: { list: 'source' | 'target'; item: unknown; index: number })" },
        category: 'events'
      }
    },
    default: {
      control: false,
      description:
        'Composition slot receiving `PickList.Source`, `PickList.Controls`, and `PickList.Target` in flow order. The scope exposes the move actions plus selection/loading state for consumers rendering custom controls.',
      table: {
        type: { summary: '{ move, moveAll, hasSelection, count, disabled, loading }' },
        category: 'slots'
      }
    }
  },
  args: {
    dataKey: 'id',
    sourceHeader: 'Available',
    targetHeader: 'Selected',
    disabled: false,
    moveOnDoubleClick: true,
    loading: false
  }
}

export default meta

const Template = (args) => ({
  components,
  setup() {
    const value = ref(args.modelValue ?? sampleModel())
    watch(
      () => args.modelValue,
      (next) => {
        value.value = next ?? sampleModel()
      }
    )
    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:modelValue']?.(next)
    }
    return { args, value, onUpdate }
  },
  template: `
    <div class="max-w-[var(--container-xl)]">
      <PickList
        :model-value="value"
        :data-key="args.dataKey"
        :disabled="args.disabled"
        :move-on-double-click="args.moveOnDoubleClick"
        @update:model-value="onUpdate"
        @move="args.onMove"
        @item-double-click="args.onItemDoubleClick"
      >
        <PickList.Source
          :header="args.sourceHeader"
          :loading="args.loading === true || args.loading === 'source'"
        >
          <template #item="{ item }">{{ item.label }}</template>
        </PickList.Source>

        <PickList.Controls />

        <PickList.Target
          :header="args.targetHeader"
          :loading="args.loading === true || args.loading === 'target'"
        >
          <template #item="{ item }">{{ item.label }}</template>
        </PickList.Target>
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
      description: {
        story:
          'Two lists with select-and-move and move-all controls. Double-clicking an item moves it to the opposite list (and fires `item-double-click`); toggle the `moveOnDoubleClick` control to cancel the auto-move.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof PickList>} */
export const Disabled = {
  args: { disabled: true },
  render: Template,
  parameters: {
    docs: {
      source: { code: sourceFor({ root: ['disabled'] }) },
      description: { story: 'Disabled state: selection and all move controls are inert.' }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof PickList>} */
export const Loading = {
  args: { loading: 'source' },
  render: Template,
  parameters: {
    docs: {
      source: { code: sourceFor({ source: ['loading'] }) },
      description: {
        story:
          "One side loading: the source shows a spinner and its moves are locked while the target stays interactive. Set the `loading` control to `true` for both sides, or `'target'` for the other side."
      }
    }
  }
}
