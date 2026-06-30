import { ref } from 'vue'

import CodeBlock from '@aziontech/webkit/code-block'

const sampleCode = `export default {
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

const languageSwitcherTabs = [
  {
    label: 'Javascript',
    value: 'js',
    language: 'javascript',
    fileName: 'file name.js',
    code: sampleCode
  },
  {
    label: 'Typescript',
    value: 'ts',
    language: 'typescript',
    fileName: 'file name.ts',
    code: sampleCode.replace('request)', 'request: Request)')
  }
]

const diffSampleCode = `export default {
  async fetch(request: Request): Promise<Response> {
    const { prompt } = await request.json();

    const modelResponse = await Azion.AI.run(
      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',
      {
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      }
    );

    return new Response(JSON.stringify(modelResponse))
  }
}`

const diffLineChanges = [
  { line: 3, change: 'removed' },
  { line: 4, change: 'removed' },
  { line: 5, change: 'removed' },
  { line: 6, change: 'added' },
  { line: 7, change: 'added' },
  { line: 8, change: 'added' },
  { line: 9, change: 'added' },
  { line: 10, change: 'added' },
  { line: 11, change: 'added' }
]

const componentDocsDescription = [
  'Read-only code viewer for docs, API examples, and configuration previews. Supports tabbed language switching, filename bars, diff markers, and highlighted lines.',
  '',
  '## Passing code',
  '',
  'There is no standalone `code` prop. Pass the source string on each tab’s **`code`** field inside **`tabs`**. The active tab’s value (via `v-model:value` or `defaultValue`) selects which snippet renders.',
  '',
  '### Single snippet (recommended)',
  '',
  'Use a template literal for multiline source, then reference it on one tab:',
  '',
  '```vue',
  '<script setup>',
  "import CodeBlock from '@aziontech/webkit/code-block'",
  '',
  'const code = `export default {',
  '  async fetch(request) {',
  "    return new Response('OK')",
  '  }',
  '}`',
  '',
  'const tabs = [',
  '  {',
  "    label: 'JavaScript',",
  "    value: 'js',",
  "    language: 'javascript',",
  "    fileName: 'handler.js',",
  '    code',
  '  }',
  ']',
  '</script>',
  '',
  '<template>',
  '  <CodeBlock :tabs="tabs" default-value="js" show-line-numbers />',
  '</template>',
  '```',
  '',
  '### Multiple languages',
  '',
  'Add one tab per snippet. Each tab carries its own `code`, `language`, and optional `fileName`:',
  '',
  '```vue',
  '<script setup>',
  "import { ref } from 'vue'",
  "import CodeBlock from '@aziontech/webkit/code-block'",
  '',
  'const activeTab = ref(\'js\')',
  '',
  'const tabs = [',
  '  { label: \'JavaScript\', value: \'js\', language: \'javascript\', code: jsSource },',
  '  { label: \'TypeScript\', value: \'ts\', language: \'typescript\', code: tsSource }',
  ']',
  '</script>',
  '',
  '<template>',
  '  <CodeBlock v-model:value="activeTab" :tabs="tabs" show-line-numbers />',
  '</template>',
  '```',
  '',
  '### Reactive updates',
  '',
  'Replace `tabs[n].code` or rebuild `tabs` when the source changes — the block re-renders and re-highlights automatically:',
  '',
  '```vue',
  '<script setup>',
  "import { computed, ref } from 'vue'",
  "import CodeBlock from '@aziontech/webkit/code-block'",
  '',
  'const source = ref(\'console.log("hello")\\n\')',
  '',
  'const tabs = computed(() => [',
  '  {',
  "    label: 'Console',",
  "    value: 'console',",
  "    language: 'javascript',",
  '    code: source.value',
  '  }',
  '])',
  '</script>',
  '',
  '<template>',
  '  <CodeBlock :tabs="tabs" default-value="console" />',
  '</template>',
  '```',
  '',
  '### `CodeBlockTab` shape',
  '',
  '| Field | Required | Notes |',
  '| --- | --- | --- |',
  '| `label` | yes | Tab label in the header |',
  '| `value` | yes | Stable id for `v-model:value` |',
  '| **`code`** | **yes** | **Raw source string (`\\n` line breaks)** |',
  '| `language` | no | Syntax highlighting (e.g. `javascript`, `typescript`) |',
  '| `fileName` | no | Shows the filename bar when set |',
  '| `fileIcon` | no | PrimeIcons class for the filename bar |',
  '| `highlightedLine` | no | 1-based line to highlight |',
  '| `lineChanges` | no | Diff markers (`{ line, change: \'added\' \\| \'removed\' }[]`) |'
].join('\n')

/** @type {import('@storybook/vue3').Meta<typeof CodeBlock>} */
const meta = {
  title: 'Components/Code/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    },
    docs: {
      description: {
        component: componentDocsDescription
      }
    }
  },
  argTypes: {
    tabs: {
      control: 'object',
      description:
        'Tab definitions. Pass source on each tab’s `code` field (required). See Docs → Passing code for single-snippet, multi-language, and reactive examples.',
      table: {
        category: 'props',
        type: { summary: 'CodeBlockTab[]' },
        detail: '{ label, value, code, language?, fileName?, fileIcon?, highlightedLine?, lineChanges? }'
      }
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
      description: 'Shows a fixed-width gutter with zero-padded line numbers before each code line.',
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
    animateLines: {
      control: 'boolean',
      description:
        'Staggered line entrance for website layouts: each line slides from -8px with opacity 0 → 1, 300ms apart.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
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

const renderCodeBlock = (args) => ({
  components: { CodeBlock },
  setup() {
    const value = ref(args.defaultValue ?? args.value ?? args.tabs?.[0]?.value ?? '')

    return { args, value }
  },
  template: `
    <div class="max-w-[692px]">
      <CodeBlock
        v-model:value="value"
        :tabs="args.tabs"
        :show-line-numbers="args.showLineNumbers"
        :copy-aria-label="args.copyAriaLabel"
        :animate-lines="args.animateLines"
        @copy="args.onCopy"
        @value-change="args.onValueChange"
      />
    </div>
  `
})

export const Default = {
  args: {
    tabs: languageSwitcherTabs,
    defaultValue: 'js',
    showLineNumbers: true,
    copyAriaLabel: 'Copy code'
  },
  render: renderCodeBlock
}

export const WithoutLineNumbers = {
  args: {
    tabs: languageSwitcherTabs,
    defaultValue: 'js',
    showLineNumbers: false,
    copyAriaLabel: 'Copy code'
  },
  render: renderCodeBlock
}

export const WithFileName = {
  args: {
    tabs: [
      {
        label: 'Javascript',
        value: 'js',
        language: 'javascript',
        fileName: 'file name.js',
        code: sampleCode
      }
    ],
    defaultValue: 'js',
    showLineNumbers: true,
    copyAriaLabel: 'Copy code'
  },
  render: renderCodeBlock
}

export const WithDiff = {
  args: {
    tabs: [
      {
        label: 'Diff',
        value: 'diff',
        language: 'typescript',
        code: diffSampleCode,
        lineChanges: diffLineChanges
      }
    ],
    defaultValue: 'diff',
    showLineNumbers: true,
    copyAriaLabel: 'Copy code'
  },
  render: renderCodeBlock
}

export const WithHighlightedLine = {
  args: {
    tabs: [
      {
        label: 'Highlighted',
        value: 'highlighted',
        language: 'typescript',
        code: sampleCode,
        highlightedLine: 6
      }
    ],
    defaultValue: 'highlighted',
    showLineNumbers: true,
    copyAriaLabel: 'Copy code'
  },
  render: renderCodeBlock
}

export const WithAnimatedLines = {
  args: {
    tabs: [
      {
        label: 'Javascript',
        value: 'js',
        language: 'javascript',
        fileName: 'handler.js',
        code: sampleCode
      }
    ],
    defaultValue: 'js',
    showLineNumbers: true,
    animateLines: true,
    copyAriaLabel: 'Copy code'
  },
  render: renderCodeBlock
}
