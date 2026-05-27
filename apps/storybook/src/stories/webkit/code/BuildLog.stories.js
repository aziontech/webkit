import LogView from '@aziontech/webkit/code/log-view'
import LogViewContent from '@aziontech/webkit/code/log-view-content'
import LogViewHeader from '@aziontech/webkit/code/log-view-header'
import { ref } from 'vue'

import { completeDeployLog } from './complete-deploy-log.js'

const composedComponents = {
  LogView,
  LogViewHeader,
  LogViewContent
}

/** @type {import('@storybook/vue3').Meta<typeof LogView>} */
const meta = {
  title: 'Webkit/Code/LogView',
  component: LogView,
  subcomponents: {
    LogViewHeader,
    LogViewContent
  },
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
          'Composition-based log viewer. LogView provides context; compose LogViewHeader (48px toolbar), LogViewContent, and optional LogViewFooter.'
      }
    }
  },
  argTypes: {
    lines: {
      control: false,
      description: 'Log entries to render (filtered client-side by warnings-only).',
      table: {
        type: { summary: 'LogViewLine[]' },
        defaultValue: { summary: '[]' },
        category: 'props'
      }
    },
    warningsOnly: {
      control: 'boolean',
      description: 'When true, shows only lines whose type is warning.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'props'
      }
    },
    showCopy: {
      control: 'boolean',
      description: 'Shows the transparent copy IconButton in LogViewHeader.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'props'
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables toolbar controls (copy, filter).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'props'
      }
    },
    'onUpdate:warningsOnly': {
      action: 'update:warningsOnly',
      description: 'Emitted when the warnings-only filter toggles (v-model:warnings-only).',
      table: { type: { summary: 'boolean' }, category: 'events' }
    },
    onCopy: {
      action: 'copy',
      description: 'Fires after copy; payload is the copied plain text.',
      table: { type: { summary: 'string' }, category: 'events' }
    }
  },
  args: {
    lines: completeDeployLog,
    warningsOnly: false,
    showCopy: true,
    disabled: false
  }
}

export default meta

/** @type {import('@storybook/vue3').StoryObj<typeof LogView>} */
export const Default = {
  render: (args) => ({
    components: composedComponents,
    setup() {
      const warningsOnly = ref(args.warningsOnly ?? false)
      const {
        'onUpdate:warningsOnly': onUpdateWarningsOnly,
        onCopy,
        ...props
      } = args

      return {
        props,
        warningsOnly,
        onUpdateWarningsOnly,
        onCopy
      }
    },
    template: `
      <LogView
        v-bind="props"
        v-model:warnings-only="warningsOnly"
        class="h-[640px]"
        @update:warnings-only="onUpdateWarningsOnly"
        @copy="onCopy"
      >
        <LogViewHeader />
        <LogViewContent />
      </LogView>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'LogViewHeader + LogViewContent. Header is 48px with transparent IconButton copy control.'
      }
    }
  }
}
