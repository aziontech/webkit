import Accordion from '@aziontech/webkit/accordion'
import LogView from '@aziontech/webkit/log-view'
import LogViewContent from '@aziontech/webkit/log-view-content'
import LogViewHeader from '@aziontech/webkit/log-view-header'
import { ref } from 'vue'

import { completeDeployLog } from '../../code/log-view/complete-deploy-log.js'
import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Accordion from '@aziontech/webkit/accordion'"

const components = {
  Accordion,
  AccordionItem: Accordion.Item,
  AccordionTrigger: Accordion.Trigger,
  AccordionContent: Accordion.Content,
  LogView,
  LogViewHeader,
  LogViewContent
}

/** @type {import('@storybook/vue3').Meta<typeof Accordion>} */
const meta = {
  title: 'Components/Content/Accordion',
  component: Accordion,
  subcomponents: {
    'Accordion.Item': Accordion.Item,
    'Accordion.Trigger': Accordion.Trigger,
    'Accordion.Content': Accordion.Content
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'aria-required-attr', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'A vertically stacked set of disclosure items: each item has a clickable header that expands or collapses its content panel. Use it to condense long content into scannable sections. Unlike `tab-view` (mutually-exclusive panels shown in place), an accordion can keep one item open at a time (`type="single"`) or several at once (`type="multiple"`), and its content expands inline below each header.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Whether one or multiple items can be open at the same time.',
      table: {
        category: 'props',
        type: { summary: "'single' | 'multiple'" },
        defaultValue: { summary: "'single'" }
      }
    },
    value: {
      control: 'text',
      description:
        'Controlled open item(s): a single `value` string in single mode, an array of values in multiple mode. Use with `v-model:value`.',
      table: { category: 'props', type: { summary: 'string | string[] | null' } }
    },
    defaultValue: {
      control: 'text',
      description: 'Initial open item(s) when uncontrolled.',
      table: {
        category: 'props',
        type: { summary: 'string | string[] | null' },
        defaultValue: { summary: 'null' }
      }
    },
    collapsible: {
      control: 'boolean',
      description: 'In single mode, lets the open item collapse so that no item is open.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    size: {
      control: 'select',
      options: ['medium', 'large'],
      description: 'Size token; affects header height and typography.',
      table: {
        category: 'props',
        type: { summary: "'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    arrowPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Side of the header the chevron sits on.',
      table: {
        category: 'props',
        type: { summary: "'left' | 'right'" },
        defaultValue: { summary: "'right'" }
      }
    },
    'onUpdate:value': {
      action: 'update:value',
      description: '`v-model:value`. Fires when the open item(s) change.',
      table: { category: 'events' }
    },
    default: {
      control: false,
      description: 'The `Accordion.Item` children.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  },
  args: {
    type: 'single',
    collapsible: true,
    size: 'medium',
    arrowPosition: 'right'
  }
}

export default meta

const DEFAULT_MARKUP = `<Accordion type="single" collapsible default-value="overview" size="medium" arrow-position="right" class="w-full max-w-[40rem]">
  <Accordion.Item value="overview">
    <Accordion.Trigger>What is Azion?</Accordion.Trigger>
    <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="pricing">
    <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
    <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="support">
    <Accordion.Trigger>Enterprise support</Accordion.Trigger>
    <Accordion.Content>Available on Business and Enterprise plans.</Accordion.Content>
  </Accordion.Item>
</Accordion>`

const Template = (args) => ({
  components,
  setup() {
    return { args }
  },
  template: `
    <Accordion
      v-bind="args"
      class="w-full max-w-[40rem]"
    >
      <AccordionItem value="overview">
        <AccordionTrigger>What is Azion?</AccordionTrigger>
        <AccordionContent>Azion runs your code at the edge, close to users.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="pricing">
        <AccordionTrigger>How does pricing work?</AccordionTrigger>
        <AccordionContent>Pay only for what you use, with no upfront cost.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger>Enterprise support</AccordionTrigger>
        <AccordionContent>Available on Business and Enterprise plans.</AccordionContent>
      </AccordionItem>
    </Accordion>
  `
})

/** @type {import('@storybook/vue3').StoryObj<typeof Accordion>} */
export const Default = {
  args: { defaultValue: 'overview' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Single-mode accordion with one item open via `default-value`.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const SIZES_MARKUP = `<div class="flex flex-col gap-8 w-full max-w-[40rem]">
  <Accordion type="single" collapsible default-value="overview" size="medium">
    <Accordion.Item value="overview">
      <Accordion.Trigger>What is Azion?</Accordion.Trigger>
      <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="pricing">
      <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
      <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>
    </Accordion.Item>
  </Accordion>
  <Accordion type="single" collapsible default-value="overview" size="large">
    <Accordion.Item value="overview">
      <Accordion.Trigger>What is Azion?</Accordion.Trigger>
      <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="pricing">
      <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
      <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>
    </Accordion.Item>
  </Accordion>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Accordion>} */
export const Sizes = {
  render: () => ({
    components,
    template: `
      <div class="flex flex-col gap-8 w-full max-w-[40rem]">
        <Accordion type="single" collapsible default-value="overview" size="medium">
          <AccordionItem value="overview">
            <AccordionTrigger>What is Azion?</AccordionTrigger>
            <AccordionContent>Azion runs your code at the edge, close to users.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="pricing">
            <AccordionTrigger>How does pricing work?</AccordionTrigger>
            <AccordionContent>Pay only for what you use, with no upfront cost.</AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible default-value="overview" size="large">
          <AccordionItem value="overview">
            <AccordionTrigger>What is Azion?</AccordionTrigger>
            <AccordionContent>Azion runs your code at the edge, close to users.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="pricing">
            <AccordionTrigger>How does pricing work?</AccordionTrigger>
            <AccordionContent>Pay only for what you use, with no upfront cost.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: { story: '`medium` and `large` sizes side by side.' },
      controls: { disable: true },
      source: { code: toSfc(IMPORT, SIZES_MARKUP) }
    }
  }
}

const ARROW_MARKUP = `<div class="flex flex-col gap-8 w-full max-w-[40rem]">
  <Accordion type="single" collapsible default-value="overview" arrow-position="right">
    <Accordion.Item value="overview">
      <Accordion.Trigger>What is Azion?</Accordion.Trigger>
      <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="pricing">
      <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
      <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>
    </Accordion.Item>
  </Accordion>
  <Accordion type="single" collapsible default-value="overview" arrow-position="left">
    <Accordion.Item value="overview">
      <Accordion.Trigger>What is Azion?</Accordion.Trigger>
      <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="pricing">
      <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
      <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>
    </Accordion.Item>
  </Accordion>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Accordion>} */
export const ArrowPosition = {
  render: () => ({
    components,
    template: `
      <div class="flex flex-col gap-8 w-full max-w-[40rem]">
        <Accordion type="single" collapsible default-value="overview" arrow-position="right">
          <AccordionItem value="overview">
            <AccordionTrigger>What is Azion?</AccordionTrigger>
            <AccordionContent>Azion runs your code at the edge, close to users.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="pricing">
            <AccordionTrigger>How does pricing work?</AccordionTrigger>
            <AccordionContent>Pay only for what you use, with no upfront cost.</AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible default-value="overview" arrow-position="left">
          <AccordionItem value="overview">
            <AccordionTrigger>What is Azion?</AccordionTrigger>
            <AccordionContent>Azion runs your code at the edge, close to users.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="pricing">
            <AccordionTrigger>How does pricing work?</AccordionTrigger>
            <AccordionContent>Pay only for what you use, with no upfront cost.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: { story: '`right` and `left` chevron placement side by side.' },
      controls: { disable: true },
      source: { code: toSfc(IMPORT, ARROW_MARKUP) }
    }
  }
}

const DISABLED_MARKUP = `<Accordion type="single" collapsible default-value="overview" class="w-full max-w-[40rem]">
  <Accordion.Item value="overview">
    <Accordion.Trigger>What is Azion?</Accordion.Trigger>
    <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="pricing" disabled>
    <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
    <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="support">
    <Accordion.Trigger>Enterprise support</Accordion.Trigger>
    <Accordion.Content>Available on Business and Enterprise plans.</Accordion.Content>
  </Accordion.Item>
</Accordion>`

/** @type {import('@storybook/vue3').StoryObj<typeof Accordion>} */
export const Disabled = {
  render: () => ({
    components,
    template: `
      <Accordion type="single" collapsible default-value="overview" class="w-full max-w-[40rem]">
        <AccordionItem value="overview">
          <AccordionTrigger>What is Azion?</AccordionTrigger>
          <AccordionContent>Azion runs your code at the edge, close to users.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="pricing" disabled>
          <AccordionTrigger>How does pricing work?</AccordionTrigger>
          <AccordionContent>Pay only for what you use, with no upfront cost.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="support">
          <AccordionTrigger>Enterprise support</AccordionTrigger>
          <AccordionContent>Available on Business and Enterprise plans.</AccordionContent>
        </AccordionItem>
      </Accordion>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'The middle item carries the per-item `disabled` prop and cannot toggle.'
      },
      controls: { disable: true },
      source: { code: toSfc(IMPORT, DISABLED_MARKUP) }
    }
  }
}

const MULTIPLE_MARKUP = `<Accordion type="multiple" :default-value="['overview', 'pricing']" class="w-full max-w-[40rem]">
  <Accordion.Item value="overview">
    <Accordion.Trigger>What is Azion?</Accordion.Trigger>
    <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="pricing">
    <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
    <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="support">
    <Accordion.Trigger>Enterprise support</Accordion.Trigger>
    <Accordion.Content>Available on Business and Enterprise plans.</Accordion.Content>
  </Accordion.Item>
</Accordion>`

const WITH_LOG_VIEW_IMPORT = [
  "import Accordion from '@aziontech/webkit/accordion'",
  "import LogView from '@aziontech/webkit/log-view'",
  "import LogViewHeader from '@aziontech/webkit/log-view-header'",
  "import LogViewContent from '@aziontech/webkit/log-view-content'",
  "import { ref } from 'vue'",
  '',
  'const lines = [',
  "  { id: '1', time: '13:47:33', type: 'text', message: 'Deploy started successfully!' },",
  "  { id: '2', time: '13:47:41', type: 'success', message: 'Build finished' },",
  "  { id: '3', time: '13:47:42', type: 'folder', message: 'dist/index.js', folderType: 'asset', size: '12.4 kB', gzipSize: '4.1 kB' },",
  "  { id: '4', time: '13:47:43', type: 'warning', message: 'Bundle larger than recommended' }",
  ']',
  "const search = ref('')",
  'const warningsOnly = ref(false)'
]

const WITH_LOG_VIEW_MARKUP = `<Accordion type="single" collapsible default-value="deploy-482" class="w-full max-w-[48rem]">
  <Accordion.Item value="deploy-482">
    <Accordion.Trigger>Deploy #482 — production</Accordion.Trigger>
    <Accordion.Content>
      <LogView :lines="lines" v-model:search="search" v-model:warnings-only="warningsOnly" class="h-[420px]">
        <LogViewHeader />
        <LogViewContent />
      </LogView>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="deploy-481">
    <Accordion.Trigger>Deploy #481 — production</Accordion.Trigger>
    <Accordion.Content>Completed at 12:04. No warnings.</Accordion.Content>
  </Accordion.Item>
</Accordion>`

/** @type {import('@storybook/vue3').StoryObj<typeof Accordion>} */
export const WithLogView = {
  render: () => ({
    components,
    setup() {
      const search = ref('')
      const warningsOnly = ref(false)
      return { lines: completeDeployLog, search, warningsOnly }
    },
    template: `
      <Accordion type="single" collapsible default-value="deploy-482" class="w-full max-w-[48rem]">
        <AccordionItem value="deploy-482">
          <AccordionTrigger>Deploy #482 — production</AccordionTrigger>
          <AccordionContent>
            <LogView :lines="lines" v-model:search="search" v-model:warnings-only="warningsOnly" class="h-[420px]">
              <LogViewHeader />
              <LogViewContent />
            </LogView>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="deploy-481">
          <AccordionTrigger>Deploy #481 — production</AccordionTrigger>
          <AccordionContent>Completed at 12:04. No warnings.</AccordionContent>
        </AccordionItem>
      </Accordion>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Composição real: o slot `Accordion.Content` aceita qualquer componente. Aqui, cada item de deploy encapsula um `LogView` completo (header + content) sobre um log de deploy real.'
      },
      controls: { disable: true },
      source: { code: toSfc(WITH_LOG_VIEW_IMPORT, WITH_LOG_VIEW_MARKUP) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Accordion>} */
export const Multiple = {
  render: () => ({
    components,
    setup() {
      return { openValues: ['overview', 'pricing'] }
    },
    template: `
      <Accordion type="multiple" :default-value="openValues" class="w-full max-w-[40rem]">
        <AccordionItem value="overview">
          <AccordionTrigger>What is Azion?</AccordionTrigger>
          <AccordionContent>Azion runs your code at the edge, close to users.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="pricing">
          <AccordionTrigger>How does pricing work?</AccordionTrigger>
          <AccordionContent>Pay only for what you use, with no upfront cost.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="support">
          <AccordionTrigger>Enterprise support</AccordionTrigger>
          <AccordionContent>Available on Business and Enterprise plans.</AccordionContent>
        </AccordionItem>
      </Accordion>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: '`type="multiple"` with two items open at once via an array `default-value`.'
      },
      controls: { disable: true },
      source: { code: toSfc(IMPORT, MULTIPLE_MARKUP) }
    }
  }
}
