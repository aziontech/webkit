import TabView from '@aziontech/webkit/tab-view'

const tabViewComponents = {
  TabViewRoot: TabView.Root,
  TabViewList: TabView.List,
  TabViewItem: TabView.Item,
  TabViewContent: TabView.Content,
  TabViewPanel: TabView.Panel
}

/** @type {import('@storybook/vue3').Meta<typeof TabView.Root>} */
const meta = {
 title: 'Components/Navigation/TabView',
  component: TabView.Root,
  subcomponents: tabViewComponents,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          'Composable tab navigation. Compose `TabView.Root`, `TabView.List`, `TabView.Item`, `TabView.Content`, and `TabView.Panel`. The active indicator slides between tabs; panel content uses horizontal enter motion from theme `animate.js` tokens.'
      }
    }
  },
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Initial active tab when uncontrolled.',
      table: {
        type: { summary: 'string | number | null' },
        defaultValue: { summary: 'null' },
        category: 'props'
      }
    },
    value: {
      control: 'text',
      description: 'Controlled active tab (`v-model:value`).',
      table: {
        type: { summary: 'string | number | null' },
        category: 'props'
      }
    },
    'onUpdate:value': {
      action: 'update:value',
      table: { category: 'events' }
    },
    default: {
      control: false,
      description: 'Tab list, content region, and panels.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  },
  args: {
    defaultValue: 'tab-1'
  }
}

export default meta

/** @type {import('@storybook/vue3').StoryObj<typeof TabView.Root>} */
export const Default = {
  render: () => ({
    components: tabViewComponents,
    template: `
      <TabViewRoot default-value="tab-1" class="w-full max-w-[40rem]">
        <TabViewList>
          <TabViewItem value="tab-1" label="Tab Item" />
          <TabViewItem value="tab-2" label="Tab Item" />
          <TabViewItem value="tab-3" label="Tab Item" />
        </TabViewList>
        <TabViewContent class="mt-[var(--spacing-4)]">
          <TabViewPanel
            value="tab-1"
            class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
          >
            <p class="text-body-sm text-[var(--text-default)]">Content for tab 1</p>
          </TabViewPanel>
          <TabViewPanel
            value="tab-2"
            class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
          >
            <p class="text-body-sm text-[var(--text-default)]">Content for tab 2</p>
          </TabViewPanel>
          <TabViewPanel
            value="tab-3"
            class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
          >
            <p class="text-body-sm text-[var(--text-default)]">Content for tab 3</p>
          </TabViewPanel>
        </TabViewContent>
      </TabViewRoot>
    `
  })
}
