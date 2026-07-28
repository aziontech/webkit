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
          'Composable tab navigation that helps users move between views or sections. Compose `TabView.Root`, `TabView.List`, `TabView.Item`, `TabView.Content`, and `TabView.Panel` off the PascalCase `TabView` import. Tabs use an underline model: the active tab is marked by a sliding accent bar over the list baseline, keeping labels optically aligned. The active tab is exposed via `v-model:value`.'
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

// --- Default (arg-driven): plain labels, no icons -------------------------

const DEFAULT_TEMPLATE = `
  <TabView.Root
    :value="value"
    class="w-full max-w-[40rem]"
    @update:value="onUpdate"
  >
    <TabView.List>
      <TabView.Item value="tab-1" label="Overview" />
      <TabView.Item value="tab-2" label="Activity" />
      <TabView.Item value="tab-3" label="Settings" />
    </TabView.List>
    <TabView.Content class="mt-[var(--spacing-4)]">
      <TabView.Panel
        value="tab-1"
        class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
      >
        <p class="text-body-sm text-[var(--text-default)]">Content for Overview</p>
      </TabView.Panel>
      <TabView.Panel
        value="tab-2"
        class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
      >
        <p class="text-body-sm text-[var(--text-default)]">Content for Activity</p>
      </TabView.Panel>
      <TabView.Panel
        value="tab-3"
        class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
      >
        <p class="text-body-sm text-[var(--text-default)]">Content for Settings</p>
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
    <TabView.Item value="tab-1" label="Overview" />
    <TabView.Item value="tab-2" label="Activity" />
    <TabView.Item value="tab-3" label="Settings" />
  </TabView.List>
  <TabView.Content class="mt-[var(--spacing-4)]">
    <TabView.Panel
      value="tab-1"
      class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
    >
      <p class="text-body-sm text-[var(--text-default)]">Content for Overview</p>
    </TabView.Panel>
    <TabView.Panel
      value="tab-2"
      class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
    >
      <p class="text-body-sm text-[var(--text-default)]">Content for Activity</p>
    </TabView.Panel>
    <TabView.Panel
      value="tab-3"
      class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
    >
      <p class="text-body-sm text-[var(--text-default)]">Content for Settings</p>
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
          'Three tabs with labels only — no icons by default. The active tab is held in `v-model:value`; clicking a tab or using Arrow / Home / End keys updates it.'
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

// --- With icons: leading glyph via the `icon` prop ------------------------

const WITH_ICONS_MARKUP = `<TabView.Root default-value="github" class="w-full max-w-[40rem]">
  <TabView.List>
    <TabView.Item value="github" label="GitHub" icon="pi pi-github" />
    <TabView.Item value="bitbucket" label="Bitbucket" icon="ai-cor ai-bitbucket" />
    <TabView.Item value="gitlab" label="GitLab" icon="ai-cor ai-gitlab" />
  </TabView.List>
  <TabView.Content class="mt-[var(--spacing-4)]">
    <TabView.Panel
      value="github"
      class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
    >
      <p class="text-body-sm text-[var(--text-default)]">Connect a GitHub repository</p>
    </TabView.Panel>
    <TabView.Panel
      value="bitbucket"
      class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
    >
      <p class="text-body-sm text-[var(--text-default)]">Connect a Bitbucket repository</p>
    </TabView.Panel>
    <TabView.Panel
      value="gitlab"
      class="rounded-[var(--shape-card)] border border-[var(--border-default)] p-[var(--spacing-4)]"
    >
      <p class="text-body-sm text-[var(--text-default)]">Connect a GitLab repository</p>
    </TabView.Panel>
  </TabView.Content>
</TabView.Root>`

export const WithIcons = {
  render: () => ({ components, template: WITH_ICONS_MARKUP }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A leading brand icon per tab via the `icon` prop (a full icon class from `@aziontech/icons`, e.g. `pi pi-github`, `ai-cor ai-gitlab`).'
      },
      source: { code: toSfc(IMPORT, WITH_ICONS_MARKUP) }
    }
  }
}

// --- Disabled: a non-interactive tab in the set ---------------------------

const DISABLED_MARKUP = `<TabView.Root default-value="tab-1" class="w-full max-w-[40rem]">
  <TabView.List>
    <TabView.Item value="tab-1" label="Overview" />
    <TabView.Item value="tab-2" label="Activity" disabled />
    <TabView.Item value="tab-3" label="Settings" />
  </TabView.List>
</TabView.Root>`

export const Disabled = {
  render: () => ({ components, template: DISABLED_MARKUP }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A `disabled` tab is dimmed, removed from the tab order, and skipped by Arrow-key navigation.'
      },
      source: { code: toSfc(IMPORT, DISABLED_MARKUP) }
    }
  }
}

// --- Leading & trailing slots: custom adornments --------------------------

const SLOTS_MARKUP = `<TabView.Root default-value="tab-1" class="w-full max-w-[40rem]">
  <TabView.List>
    <TabView.Item value="tab-1" label="Profile">
      <template #leading><i class="pi pi-user" /></template>
    </TabView.Item>
    <TabView.Item value="tab-2" label="Notifications">
      <template #leading><i class="pi pi-bell" /></template>
      <template #trailing><i class="pi pi-circle-fill text-[var(--danger)]" /></template>
    </TabView.Item>
    <TabView.Item value="tab-3" label="Docs">
      <template #trailing><i class="pi pi-external-link" /></template>
    </TabView.Item>
  </TabView.List>
</TabView.Root>`

export const LeadingAndTrailing = {
  render: () => ({ components, template: SLOTS_MARKUP }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The `leading` and `trailing` slots place custom adornments around the label — here a leading glyph and a trailing status dot / external-link icon.'
      },
      source: { code: toSfc(IMPORT, SLOTS_MARKUP) }
    }
  }
}
