import Button from '@aziontech/webkit/button'
import TabView from '@aziontech/webkit/tab-view'
import Tag from '@aziontech/webkit/tag'
import { ref } from 'vue'

import { toSfc } from '../../_shared/story-source'

const APPLICATION_TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'build', label: 'Build' },
  { value: 'deployments', label: 'Deployments' },
  { value: 'device-groups', label: 'Device Groups' },
  { value: 'cache-settings', label: 'Cache Settings' },
  { value: 'functions-instances', label: 'Functions Instances' },
  { value: 'rules-engine', label: 'Rules Engine' },
  { value: 'main-settings', label: 'Settings' }
]

const WORKLOAD_TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'deployments', label: 'Deployments' },
  { value: 'settings', label: 'Settings' }
]

const tabsLine = (tabs) =>
  `const tabs = [\n${tabs
    .map((tab) => `  { value: '${tab.value}', label: '${tab.label}' }`)
    .join(',\n')}\n]`

const scriptLines = (imports, tabs) => [
  ...imports,
  "import { ref } from 'vue'",
  '',
  `const activeTab = ref('${tabs[0].value}')`,
  tabsLine(tabs)
]

const TAB_VIEW_IMPORT = "import TabView from '@aziontech/webkit/tab-view'"

const components = {
  Button,
  Tag,
  TabView,
  'TabView.List': TabView.List,
  'TabView.Item': TabView.Item
}

const BAR_OPEN = `<div class="border-b border-(--border-default)">
  <div class="layout-boundary-inline flex items-center gap-(--spacing-sm) py-(--spacing-sm)">
    <div class="-ml-(--spacing-xs) min-w-0 flex-1">
      <TabView v-model:value="activeTab">
        <TabView.List>
          <TabView.Item v-for="tab in tabs" :key="tab.value" :value="tab.value" :label="tab.label" />
        </TabView.List>
      </TabView>
    </div>`

const DEFAULT_TEMPLATE = `${BAR_OPEN}
  </div>
</div>`

const WITH_ACTIONS_TEMPLATE = `${BAR_OPEN}
    <div class="flex min-h-8 shrink-0 items-center gap-(--spacing-xs)">
      <Tag severity="warning" size="small" label="2 changes" />
      <Button label="Deploy" kind="primary" size="medium" icon="pi pi-cloud-upload" />
    </div>
  </div>
</div>`

const meta = {
  title: 'Templates/Platform/Page/PageTabs',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The second-level navigation bar of a resource detail page: a full-bleed strip under the global header, ruled at the bottom, whose tabs sit at the page boundary inset with room for the actions the whole resource owns on the right. Application, Workload, Firewall, Function and SQL Database detail pages open with it. Built from `TabView`, with `Button` and `Tag` in the trailing actions.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({ activeTab: ref('overview'), tabs: APPLICATION_TABS }),
    template: DEFAULT_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story: 'The application detail tabs, from Overview to Settings, with no trailing actions.'
      },
      source: { code: toSfc(scriptLines([TAB_VIEW_IMPORT], APPLICATION_TABS), DEFAULT_TEMPLATE) }
    }
  }
}

export const WithActions = {
  render: () => ({
    components,
    setup: () => ({ activeTab: ref('overview'), tabs: WORKLOAD_TABS }),
    template: WITH_ACTIONS_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The workload detail tabs with the actions the resource owns on the right: a staged-changes `Tag` and the medium Deploy button.'
      },
      source: {
        code: toSfc(
          scriptLines(
            [
              "import Button from '@aziontech/webkit/button'",
              TAB_VIEW_IMPORT,
              "import Tag from '@aziontech/webkit/tag'"
            ],
            WORKLOAD_TABS
          ),
          WITH_ACTIONS_TEMPLATE
        )
      }
    }
  }
}
