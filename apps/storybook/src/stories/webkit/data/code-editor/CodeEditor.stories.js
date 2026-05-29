import { ref } from 'vue'

import CodeEditor from '@aziontech/webkit/data/code-editor'

const sampleTabs = [
  {
    label: 'Label',
    value: 'label-1',
    language: 'javascript',
    code: `export default {
  async fetch(request) {
    const { prompt } = await request.json()

    const modelResponse = await Azion.AI.run(
      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',
      {
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ]
      }
    )

    return new Response(JSON.stringify(modelResponse))
  }
}`
  },
  {
    label: 'Label',
    value: 'label-2',
    language: 'javascript',
    code: `export default {
  async fetch(request) {
    return new Response('Tab two')
  }
}`
  },
  {
    label: 'Label',
    value: 'label-3',
    language: 'javascript',
    code: `export default {
  async fetch(request) {
    return new Response('Tab three')
  }
}`
  },
  {
    label: 'Label',
    value: 'label-4',
    language: 'javascript',
    code: `export default {
  async fetch(request) {
    return new Response('Tab four')
  }
}`
  },
  {
    label: 'Label',
    value: 'label-5',
    language: 'javascript',
    code: `export default {
  async fetch(request) {
    return new Response('Tab five')
  }
}`
  }
]

/** @type {import('@storybook/vue3').Meta<typeof CodeEditor>} */
const meta = {
  title: 'Webkit/Data/Code Editor',
  component: CodeEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    },
    docs: {
      description: {
        component: `Read-only code viewer with tabbed snippets, syntax highlighting, animated tab indicator, and copy.

\`\`\`vue
<script setup>
import { ref } from 'vue'
import CodeEditor from '@aziontech/webkit/data/code-editor'

const activeTab = ref('js')

const tabs = [
  {
    label: 'JavaScript',
    value: 'js',
    language: 'javascript',
    code: "export default {\\n  async fetch(request) {\\n    return new Response('OK')\\n  }\\n}"
  },
  {
    label: 'TypeScript',
    value: 'ts',
    language: 'typescript',
    code: "export default {\\n  async fetch(request: Request): Promise<Response> {\\n    return new Response('OK')\\n  }\\n}"
  }
]
</script>

<template>
  <CodeEditor v-model:value="activeTab" :tabs="tabs" show-line-numbers />
</template>
\`\`\``
      }
    }
  },
  argTypes: {
    tabs: {
      control: 'object',
      description: 'Tab definitions with label, value, code, and optional language for highlighting.',
      table: { category: 'props', type: { summary: 'CodeEditorTab[]' } }
    },
    value: {
      control: 'text',
      description: 'Controlled active tab value (`v-model:value`).',
      table: { category: 'props', type: { summary: 'string' } }
    },
    defaultValue: {
      control: 'text',
      description: 'Initial active tab when uncontrolled.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    showLineNumbers: {
      control: 'boolean',
      description: 'Shows a fixed-width gutter with line numbers before each code line.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    copyAriaLabel: {
      control: 'text',
      description: 'Accessible name for the copy IconButton.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Copy code'" }
      }
    },
    onUpdateValue: {
      action: 'update:value',
      table: { category: 'events' }
    },
    onValueChange: {
      action: 'value-change',
      table: { category: 'events' }
    },
    onCopy: {
      action: 'copy',
      table: { category: 'events' }
    }
  }
}

export default meta

export const Default = {
  args: {
    tabs: sampleTabs,
    defaultValue: 'label-1',
    showLineNumbers: true,
    copyAriaLabel: 'Copy code'
  },
  render: (args) => ({
    components: { CodeEditor },
    setup() {
      const value = ref(args.defaultValue ?? args.value ?? 'label-1')

      return { args, value }
    },
    template: `
      <div class="max-w-[692px]">
        <CodeEditor
          v-model:value="value"
          :tabs="args.tabs"
          :show-line-numbers="args.showLineNumbers"
          :copy-aria-label="args.copyAriaLabel"
          @copy="args.onCopy"
          @value-change="args.onValueChange"
        />
      </div>
    `
  })
}

export const WithoutLineNumbers = {
  args: {
    tabs: sampleTabs.slice(0, 2),
    defaultValue: 'label-1',
    showLineNumbers: false,
    copyAriaLabel: 'Copy code'
  },
  render: (args) => ({
    components: { CodeEditor },
    setup() {
      const value = ref(args.defaultValue ?? 'label-1')

      return { args, value }
    },
    template: `
      <div class="max-w-[692px]">
        <CodeEditor
          v-model:value="value"
          :tabs="args.tabs"
          :show-line-numbers="args.showLineNumbers"
          :copy-aria-label="args.copyAriaLabel"
        />
      </div>
    `
  })
}
