import TabView from '@aziontech/webkit/navigation/tab-view'
import { expect, userEvent, within } from '@storybook/test'
import { ref } from 'vue'

const tabViewComponents = {
  TabView,
  TabViewList: TabView.List,
  TabViewItem: TabView.Item,
  TabViewPanel: TabView.Panel
}

/** @type {import('@storybook/vue3').Meta<typeof TabView>} */
const meta = {
  title: 'Webkit/Navigation/TabView',
  component: TabView,
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
          'Composable tab navigation (Figma TabView + TabViewItem). Root + List + Item + Panel. See `CONTRACT.md` in the package.'
      }
    }
  },
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Uncontrolled initial active tab value.',
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
    'onValue-change': {
      action: 'value-change',
      table: { category: 'events' }
    },
    default: {
      control: false,
      description: 'Tab list and panels.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  },
  args: {
    defaultValue: 'tab-1'
  }
}

export default meta

const figmaTabLabels = ['Tab Item', 'Tab Item', 'Tab Item', 'Tab Item', 'Tab Item', 'Tab Item', 'Tab Item']

const DefaultTemplate = {
  components: tabViewComponents,
  setup() {
    return { figmaTabLabels }
  },
  template: `
    <TabView default-value="tab-1" class="max-w-[53rem]">
      <TabView.List>
        <TabView.Item
          v-for="(label, index) in figmaTabLabels"
          :key="'tab-' + (index + 1)"
          :value="'tab-' + (index + 1)"
          :label="label"
        />
      </TabView.List>
      <TabView.Panel
        v-for="(label, index) in figmaTabLabels"
        :key="'panel-' + (index + 1)"
        :value="'tab-' + (index + 1)"
        class="min-h-[6rem] p-[var(--spacing-4)] text-body-sm text-[var(--text-default)]"
      >
        Content for {{ label }} ({{ index + 1 }})
      </TabView.Panel>
    </TabView>
  `
}

export const Default = {
  render: () => DefaultTemplate,
  parameters: {
    docs: {
      description: {
        story:
          'Matches Figma TabView: one Highlight tab and idle siblings. Panel content fades in when the active tab changes.'
      }
    }
  }
}

export const ItemStates = {
  render: () => ({
    components: { TabViewItem: TabView.Item },
    template: `
      <div class="flex flex-wrap items-center gap-[var(--spacing-2)] bg-[var(--bg-canvas)] p-[var(--spacing-4)]">
        <TabViewItem label="Tab Item" />
        <TabViewItem label="Tab Item" selected />
        <TabViewItem label="Tab Item" disabled />
        <TabViewItem
          label="Tab Item"
          closable
          selected
        >
          <template #leading><i class="ai ai-build-pillar" aria-hidden="true" /></template>
          <template #trailing><i class="ai ai-build-pillar" aria-hidden="true" /></template>
        </TabViewItem>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Figma TabViewItem variant set: Idle, Highlight (selected), Disabled, and closable with icons.'
      }
    }
  }
}

export const WithIcons = {
  render: () => ({
    components: tabViewComponents,
    template: `
      <TabView default-value="build" class="max-w-[40rem]">
        <TabView.List>
          <TabView.Item value="build" closable>
            <template #leading><i class="ai ai-build-pillar" aria-hidden="true" /></template>
            Build
            <template #trailing><i class="ai ai-edge-application" aria-hidden="true" /></template>
          </TabView.Item>
          <TabView.Item value="store" label="Store" />
        </TabView.List>
        <TabView.Panel value="build" class="p-[var(--spacing-4)] text-body-sm text-[var(--text-default)]">
          Build panel
        </TabView.Panel>
        <TabView.Panel value="store" class="p-[var(--spacing-4)] text-body-sm text-[var(--text-default)]">
          Store panel
        </TabView.Panel>
      </TabView>
    `
  })
}

export const Uncontrolled = {
  render: () => ({
    components: tabViewComponents,
    template: `
      <TabView default-value="one" class="max-w-[32rem]">
        <TabView.List>
          <TabView.Item value="one" label="One" />
          <TabView.Item value="two" label="Two" />
        </TabView.List>
        <TabView.Panel value="one" class="p-[var(--spacing-4)] text-body-sm">Panel one</TabView.Panel>
        <TabView.Panel value="two" class="p-[var(--spacing-4)] text-body-sm">Panel two</TabView.Panel>
      </TabView>
    `
  })
}

export const Controlled = {
  render: () => ({
    components: tabViewComponents,
    setup() {
      const activeTab = ref('alpha')
      return { activeTab }
    },
    template: `
      <div class="flex max-w-[32rem] flex-col gap-[var(--spacing-3)]">
        <p class="text-body-sm text-[var(--text-muted)]">Active: {{ activeTab }}</p>
        <TabView v-model:value="activeTab">
          <TabView.List>
            <TabView.Item value="alpha" label="Alpha" />
            <TabView.Item value="beta" label="Beta" />
          </TabView.List>
          <TabView.Panel value="alpha" class="p-[var(--spacing-4)] text-body-sm">Alpha panel</TabView.Panel>
          <TabView.Panel value="beta" class="p-[var(--spacing-4)] text-body-sm">Beta panel</TabView.Panel>
        </TabView>
      </div>
    `
  })
}

export const Closable = {
  render: () => ({
    components: tabViewComponents,
    setup() {
      const tabs = ref([
        { value: 'a', label: 'Tab A' },
        { value: 'b', label: 'Tab B' },
        { value: 'c', label: 'Tab C' }
      ])
      const activeTab = ref('a')

      const removeTab = (value) => {
        const index = tabs.value.findIndex((tab) => tab.value === value)
        if (index === -1) return
        tabs.value = tabs.value.filter((tab) => tab.value !== value)
        if (activeTab.value === value) {
          activeTab.value = tabs.value[0]?.value ?? null
        }
      }

      return { tabs, activeTab, removeTab }
    },
    template: `
      <TabView v-model:value="activeTab" class="max-w-[36rem]">
        <TabView.List>
          <TabView.Item
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value"
            :label="tab.label"
            closable
            @close="removeTab(tab.value)"
          />
        </TabView.List>
        <TabView.Panel
          v-for="tab in tabs"
          :key="'panel-' + tab.value"
          :value="tab.value"
          class="p-[var(--spacing-4)] text-body-sm text-[var(--text-default)]"
        >
          {{ tab.label }} content
        </TabView.Panel>
      </TabView>
    `
  })
}

export const LightDark = {
  render: () => DefaultTemplate,
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      description: {
        story: 'Toggle Storybook background to validate light and dark token contrast.'
      }
    }
  },
  globals: {
    backgrounds: { value: 'light' }
  }
}

export const Accessibility = {
  render: () => ({
    components: tabViewComponents,
    template: `
      <TabView default-value="tab-1" data-testid="tab-view-a11y" class="max-w-[32rem]">
        <TabView.List>
          <TabView.Item value="tab-1" label="First" />
          <TabView.Item value="tab-2" label="Second" />
          <TabView.Item value="tab-3" label="Third" />
        </TabView.List>
        <TabView.Panel value="tab-1" class="p-[var(--spacing-4)]">First panel</TabView.Panel>
        <TabView.Panel value="tab-2" class="p-[var(--spacing-4)]">Second panel</TabView.Panel>
        <TabView.Panel value="tab-3" class="p-[var(--spacing-4)]">Third panel</TabView.Panel>
      </TabView>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tablist = canvas.getByRole('tablist')
    const tabs = within(tablist).getAllByRole('tab')

    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'false')

    tabs[1].focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true')

    await userEvent.keyboard('{Home}')
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
  }
}

export const Playground = {
  render: (args) => ({
    components: tabViewComponents,
    setup() {
      return { args }
    },
    template: `
      <TabView v-bind="args" class="max-w-[40rem]">
        <TabView.List>
          <TabView.Item value="one" label="One" />
          <TabView.Item value="two" label="Two" />
          <TabView.Item value="three" label="Three" disabled />
        </TabView.List>
        <TabView.Panel value="one" class="p-[var(--spacing-4)] text-body-sm">One</TabView.Panel>
        <TabView.Panel value="two" class="p-[var(--spacing-4)] text-body-sm">Two</TabView.Panel>
        <TabView.Panel value="three" class="p-[var(--spacing-4)] text-body-sm">Three (disabled tab)</TabView.Panel>
      </TabView>
    `
  }),
  args: {
    defaultValue: 'one'
  }
}
