import LogView from '@aziontech/webkit/log-view'
import LogViewContent from '@aziontech/webkit/log-view-content'
import LogViewHeader from '@aziontech/webkit/log-view-header'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'
import { completeDeployLog } from './complete-deploy-log.js'

const components = { LogView, LogViewHeader, LogViewContent }

const IMPORT = [
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

const meta = {
  title: 'Components/Code/LogView',
  component: LogView,
  subcomponents: { LogViewHeader, LogViewContent },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'Composition-based log viewer for CI/deploy output. LogView provides context; compose LogViewHeader (48px toolbar), LogViewContent, and optional LogViewFooter. Search filters lines and highlights matches in the body.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    lines: {
      control: false,
      description: 'Log entries to render (filtered client-side by search and warnings-only).',
      table: { category: 'props', type: { summary: 'LogViewLine[]' }, defaultValue: { summary: '[]' } }
    },
    searchPlaceholder: {
      control: 'text',
      description: 'Placeholder for the default header search field.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'Find in Logs'" } }
    },
    showCopy: {
      control: 'boolean',
      description: 'Shows the copy-to-clipboard control in LogViewHeader.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables toolbar controls (copy, filter).',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    loading: {
      control: 'boolean',
      description: 'Replaces the log body with a centered spinner and label.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    loadingLabel: {
      control: 'text',
      description: 'Label shown beneath the spinner while loading.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'Loading...'" } }
    },
    search: {
      control: 'text',
      description: 'v-model:search — query that filters lines and highlights matches.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    warningsOnly: {
      control: 'boolean',
      description: 'v-model:warnings-only — when true, shows only warning lines.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    'onUpdate:search': {
      action: 'update:search',
      description: 'Emitted when the header search field changes (v-model:search).',
      table: { category: 'events', type: { summary: 'string' } }
    },
    'onUpdate:warningsOnly': {
      action: 'update:warningsOnly',
      description: 'Emitted when the warnings-only filter toggles (v-model:warnings-only).',
      table: { category: 'events', type: { summary: 'boolean' } }
    },
    onCopy: {
      action: 'copy',
      description: 'Fires after a successful copy; payload is the copied plain text.',
      table: { category: 'events', type: { summary: 'string' } }
    }
  },
  args: {
    searchPlaceholder: 'Find in Logs',
    showCopy: true,
    disabled: false,
    loading: false,
    loadingLabel: 'Loading...',
    search: '',
    warningsOnly: false
  }
}

export default meta

const DEFAULT_MARKUP = `<LogView :lines="lines" v-model:search="search" v-model:warnings-only="warningsOnly" class="h-[640px]">
  <LogViewHeader />
  <LogViewContent />
</LogView>`

export const Default = {
  render: (args) => ({
    components,
    setup() {
      const search = ref(args.search ?? '')
      const warningsOnly = ref(args.warningsOnly ?? false)
      return { args, lines: completeDeployLog, search, warningsOnly }
    },
    template: `
      <LogView
        :lines="lines"
        :search-placeholder="args.searchPlaceholder"
        :show-copy="args.showCopy"
        :disabled="args.disabled"
        :loading="args.loading"
        :loading-label="args.loadingLabel"
        v-model:search="search"
        v-model:warnings-only="warningsOnly"
        class="h-[640px]"
        @copy="args.onCopy"
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
          'LogViewHeader + LogViewContent over a realistic deploy log. Search filters lines and highlights matches in the body.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const LOADING_MARKUP = `<LogView :lines="lines" loading v-model:search="search" v-model:warnings-only="warningsOnly" class="h-[640px]">
  <LogViewHeader />
  <LogViewContent />
</LogView>`

export const Loading = {
  render: () => ({
    components,
    setup() {
      const search = ref('')
      const warningsOnly = ref(false)
      return { lines: completeDeployLog, search, warningsOnly }
    },
    template: `
      <LogView
        :lines="lines"
        loading
        v-model:search="search"
        v-model:warnings-only="warningsOnly"
        class="h-[640px]"
      >
        <LogViewHeader />
        <LogViewContent />
      </LogView>
    `
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'While `loading` is set, LogViewContent replaces the log body with a centered spinner and the `loadingLabel` text.'
      },
      source: { code: toSfc(IMPORT, LOADING_MARKUP) }
    }
  }
}
