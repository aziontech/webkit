import Tabs from '@aziontech/webkit/tabs'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Tabs from '@aziontech/webkit/tabs'"

// Compound sub-components registered under their dot-notation names so they
// resolve in Storybook's runtime-compiled string templates: Vue compiles
// `<Tabs.List>` to `resolveComponent("Tabs.List")`, an exact-name lookup
// (a bare `Tabs` registration does not satisfy it). In a real SFC the dotted
// tag resolves off the imported `Tabs` binding, so consumer code needs only
// `import Tabs` — these extra registrations are a Storybook-runtime concern.
const components = {
  'Tabs.Root': Tabs.Root,
  'Tabs.List': Tabs.List,
  'Tabs.Item': Tabs.Item,
  'Tabs.Content': Tabs.Content,
  'Tabs.Panel': Tabs.Panel
}

/** @type {import('@storybook/vue3').Meta<typeof Tabs.Root>} */
const meta = {
  title: 'Components/Primitives/Navigation/Tabs',
  component: Tabs.Root,
  subcomponents: {
    'Tabs.List': Tabs.List,
    'Tabs.Item': Tabs.Item,
    'Tabs.Content': Tabs.Content,
    'Tabs.Panel': Tabs.Panel
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
          'Composable tab navigation that helps users move between views or sections. Compose `Tabs.Root`, `Tabs.List`, `Tabs.Item`, `Tabs.Content`, and `Tabs.Panel` off the PascalCase `Tabs` import. The active indicator slides between tabs and panel content animates in horizontally; the active tab is exposed via `v-model:value`.'
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
  <Tabs.Root
    :value="value"
    class="w-full max-w-[40rem]"
    @update:value="onUpdate"
  >
    <Tabs.List>
      <Tabs.Item value="tab-1" label="Tab Item" />
      <Tabs.Item value="tab-2" label="Tab Item" />
      <Tabs.Item value="tab-3" label="Tab Item" />
    </Tabs.List>
    <Tabs.Content class="mt-(--spacing-4)">
      <Tabs.Panel
        value="tab-1"
        class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)"
      >
        <p class="text-body-sm text-(--text-default)">Content for tab 1</p>
      </Tabs.Panel>
      <Tabs.Panel
        value="tab-2"
        class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)"
      >
        <p class="text-body-sm text-(--text-default)">Content for tab 2</p>
      </Tabs.Panel>
      <Tabs.Panel
        value="tab-3"
        class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)"
      >
        <p class="text-body-sm text-(--text-default)">Content for tab 3</p>
      </Tabs.Panel>
    </Tabs.Content>
  </Tabs.Root>
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

const DEFAULT_SOURCE = `<Tabs.Root v-model:value="active" class="w-full max-w-[40rem]">
  <Tabs.List>
    <Tabs.Item value="tab-1" label="Tab Item" />
    <Tabs.Item value="tab-2" label="Tab Item" />
    <Tabs.Item value="tab-3" label="Tab Item" />
  </Tabs.List>
  <Tabs.Content class="mt-(--spacing-4)">
    <Tabs.Panel
      value="tab-1"
      class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)"
    >
      <p class="text-body-sm text-(--text-default)">Content for tab 1</p>
    </Tabs.Panel>
    <Tabs.Panel
      value="tab-2"
      class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)"
    >
      <p class="text-body-sm text-(--text-default)">Content for tab 2</p>
    </Tabs.Panel>
    <Tabs.Panel
      value="tab-3"
      class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)"
    >
      <p class="text-body-sm text-(--text-default)">Content for tab 3</p>
    </Tabs.Panel>
  </Tabs.Content>
</Tabs.Root>`

/** @type {import('@storybook/vue3').StoryObj<typeof Tabs.Root>} */
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

// No Tabs.Root: each item reads its own `selected` instead of the injected context, and
// paints its own pill because there is no List indicator behind it to do that.
const STANDALONE_TEMPLATE = `
  <div class="flex items-center gap-(--spacing-xxs)">
    <Tabs.Item label="Selected" selected />
    <Tabs.Item label="Idle" />
    <Tabs.Item label="Disabled" disabled />
  </div>
`

const STANDALONE_SOURCE = `<div class="flex items-center gap-(--spacing-xxs)">
  <Tabs.Item label="Selected" selected />
  <Tabs.Item label="Idle" />
  <Tabs.Item label="Disabled" disabled />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Tabs.Item>} */
export const Standalone = {
  render: () => ({ components, template: STANDALONE_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A `Tabs.Item` used on its own, outside a `Tabs.Root` — a highlight chip rather than a tab. With no context to inject, the item reads its own `selected` prop, and it carries the pill treatment itself: the translucent mask, the hairline border and the small shadow that the List’s sliding indicator supplies in the composed case. This is the only story that renders that branch.'
      },
      source: { code: toSfc(IMPORT, STANDALONE_SOURCE) }
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
  <Tabs.Root v-model:value="active" class="w-full max-w-[20rem]">
    <Tabs.List>
      <Tabs.Item
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :label="tab.label"
      />
    </Tabs.List>
    <Tabs.Content class="mt-(--spacing-4)">
      <Tabs.Panel
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)"
      >
        <p class="text-body-sm text-(--text-default)">Content for {{ tab.label }}</p>
      </Tabs.Panel>
    </Tabs.Content>
  </Tabs.Root>
`

const SCROLLABLE_SOURCE = `<Tabs.Root v-model:value="active" class="w-full max-w-[20rem]">
  <Tabs.List>
    <Tabs.Item
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      :label="tab.label"
    />
  </Tabs.List>
  <Tabs.Content class="mt-(--spacing-4)">
    <Tabs.Panel
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)"
    >
      <p class="text-body-sm text-(--text-default)">Content for {{ tab.label }}</p>
    </Tabs.Panel>
  </Tabs.Content>
</Tabs.Root>`

/** @type {import('@storybook/vue3').StoryObj<typeof Tabs.Root>} */
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
