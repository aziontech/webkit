import TabView from '@aziontech/webkit/tab-view'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import TabView from '@aziontech/webkit/tab-view'"

// Compound sub-components registered under their dot-notation names so they
// resolve in Storybook's runtime-compiled string templates: Vue compiles
// `<TabView.List>` to `resolveComponent("TabView.List")`, an exact-name lookup
// (a bare `TabView` registration does not satisfy it). In a real SFC the dotted
// tag resolves off the imported `TabView` binding, so consumer code needs only
// `import TabView` — these extra registrations are a Storybook-runtime concern.
const components = {
  'TabView.Root': TabView.Root,
  'TabView.List': TabView.List,
  'TabView.Item': TabView.Item,
  'TabView.Content': TabView.Content,
  'TabView.Panel': TabView.Panel
}

/** @type {import('@storybook/vue3').Meta<typeof TabView.Root>} */
const meta = {
  title: 'Components/Navigation/TabView',
  component: TabView.Root,
  subcomponents: {
    'TabView.List': TabView.List,
    'TabView.Item': TabView.Item,
    'TabView.Content': TabView.Content,
    'TabView.Panel': TabView.Panel
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    },
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
          'Composable tab navigation that helps users move between views or sections. Compose `TabView.Root`, `TabView.List`, `TabView.Item`, `TabView.Content`, and `TabView.Panel` off the PascalCase `TabView` import. The active indicator slides between tabs and panel content animates in horizontally; the active tab is exposed via `v-model:value`.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Controlled active tab (`v-model:value`).',
      table: {
        category: 'props',
        type: { summary: 'string | number | null' },
        defaultValue: { summary: 'undefined' }
      }
    },
    defaultValue: {
      control: 'text',
      description: 'Initial active tab when uncontrolled.',
      table: {
        category: 'props',
        type: { summary: 'string | number | null' },
        defaultValue: { summary: 'null' }
      }
    },
    'onUpdate:value': {
      action: 'update:value',
      description: 'Emitted when the active tab changes (drives `v-model:value`).',
      table: { category: 'events', type: { summary: 'string | number | null' } }
    },
    default: {
      control: false,
      description: 'Tab list, content region, and panels.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    defaultValue: 'tab-1'
  }
}

export default meta

const DEFAULT_TEMPLATE = `
  <TabView.Root
    :value="value"
    class="w-full max-w-[40rem]"
    @update:value="onUpdate"
  >
    <TabView.List>
      <TabView.Item value="tab-1" label="Tab Item" />
      <TabView.Item value="tab-2" label="Tab Item" />
      <TabView.Item value="tab-3" label="Tab Item" />
    </TabView.List>
    <TabView.Content class="mt-[var(--spacing-4)]">
      <TabView.Panel
        value="tab-1"
        class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
      >
        <p class="text-body-sm text-[var(--text-default)]">Content for tab 1</p>
      </TabView.Panel>
      <TabView.Panel
        value="tab-2"
        class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
      >
        <p class="text-body-sm text-[var(--text-default)]">Content for tab 2</p>
      </TabView.Panel>
      <TabView.Panel
        value="tab-3"
        class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
      >
        <p class="text-body-sm text-[var(--text-default)]">Content for tab 3</p>
      </TabView.Panel>
    </TabView.Content>
  </TabView.Root>
`

const Template = (args) => ({
  components,
  setup() {
    const value = ref(args.value ?? args.defaultValue ?? null)
    watch(
      () => args.value,
      (next) => {
        if (next !== undefined && next !== null) {
          value.value = next
        }
      }
    )
    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:value']?.(next)
    }
    return { args, value, onUpdate }
  },
  template: DEFAULT_TEMPLATE
})

const DEFAULT_SOURCE = `<TabView.Root v-model:value="active" class="w-full max-w-[40rem]">
  <TabView.List>
    <TabView.Item value="tab-1" label="Tab Item" />
    <TabView.Item value="tab-2" label="Tab Item" />
    <TabView.Item value="tab-3" label="Tab Item" />
  </TabView.List>
  <TabView.Content class="mt-[var(--spacing-4)]">
    <TabView.Panel
      value="tab-1"
      class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
    >
      <p class="text-body-sm text-[var(--text-default)]">Content for tab 1</p>
    </TabView.Panel>
    <TabView.Panel
      value="tab-2"
      class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
    >
      <p class="text-body-sm text-[var(--text-default)]">Content for tab 2</p>
    </TabView.Panel>
    <TabView.Panel
      value="tab-3"
      class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
    >
      <p class="text-body-sm text-[var(--text-default)]">Content for tab 3</p>
    </TabView.Panel>
  </TabView.Content>
</TabView.Root>`

/** @type {import('@storybook/vue3').StoryObj<typeof TabView.Root>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Three tabs with sliding indicator and horizontally animated panels. The active tab is held in `v-model:value`; clicking a tab or using Arrow / Home / End keys updates it.'
      },
      source: {
        code: toSfc(
          [IMPORT, "import { ref } from 'vue'", '', "const active = ref('tab-1')"],
          DEFAULT_SOURCE
        )
      }
    }
  }
}

const SCROLLABLE_TABS = [
  { value: 'tab-1', label: 'Overview' },
  { value: 'tab-2', label: 'Metrics' },
  { value: 'tab-3', label: 'Logs' },
  { value: 'tab-4', label: 'Settings' },
  { value: 'tab-5', label: 'Security' },
  { value: 'tab-6', label: 'Integrations' },
  { value: 'tab-7', label: 'Billing' },
  { value: 'tab-8', label: 'Advanced' }
]

const SCROLLABLE_TEMPLATE = `
  <TabView.Root v-model:value="active" class="w-full max-w-[20rem]">
    <TabView.List>
      <TabView.Item
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :label="tab.label"
      />
    </TabView.List>
    <TabView.Content class="mt-[var(--spacing-4)]">
      <TabView.Panel
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
      >
        <p class="text-body-sm text-[var(--text-default)]">Content for {{ tab.label }}</p>
      </TabView.Panel>
    </TabView.Content>
  </TabView.Root>
`

const SCROLLABLE_SOURCE = `<TabView.Root v-model:value="active" class="w-full max-w-[20rem]">
  <TabView.List>
    <TabView.Item
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      :label="tab.label"
    />
  </TabView.List>
  <TabView.Content class="mt-[var(--spacing-4)]">
    <TabView.Panel
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
    >
      <p class="text-body-sm text-[var(--text-default)]">Content for {{ tab.label }}</p>
    </TabView.Panel>
  </TabView.Content>
</TabView.Root>`

/** @type {import('@storybook/vue3').StoryObj<typeof TabView.Root>} */
export const Scrollable = {
  render: () => ({
    components,
    setup() {
      const active = ref('tab-1')
      return { active, tabs: SCROLLABLE_TABS }
    },
    template: SCROLLABLE_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'More tabs than fit the container: on narrow (mobile) widths the tab bar scrolls horizontally instead of overflowing or wrapping, the scrollbar is hidden, and the active indicator stays aligned while scrolling.'
      },
      source: {
        code: toSfc(
          [
            IMPORT,
            "import { ref } from 'vue'",
            '',
            `const tabs = ${JSON.stringify(SCROLLABLE_TABS, null, 2)}`,
            "const active = ref('tab-1')"
          ],
          SCROLLABLE_SOURCE
        )
      }
    }
  }
}
