import CodeBlock from '@aziontech/webkit/code-block'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import CodeBlock from '@aziontech/webkit/code-block'"

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

const fileNameTabs = [
  {
    label: 'Javascript',
    value: 'js',
    language: 'javascript',
    fileName: 'file name.js',
    code: sampleCode
  }
]

const diffTabs = [
  {
    label: 'Diff',
    value: 'diff',
    language: 'typescript',
    code: diffSampleCode,
    lineChanges: diffLineChanges
  }
]

const highlightedTabs = [
  {
    label: 'Highlighted',
    value: 'highlighted',
    language: 'typescript',
    code: sampleCode,
    highlightedLine: 6
  }
]

const animatedTabs = [
  {
    label: 'Javascript',
    value: 'js',
    language: 'javascript',
    fileName: 'handler.js',
    code: sampleCode
  }
]

// Serialize a tabs array into a runnable `const tabs = …` script line so the
// "Show code" snippet carries the exact data the canvas renders (zero drift).
const tabsConst = (tabs) => `const tabs = ${JSON.stringify(tabs, null, 2)}`

// Each story's snippet is a single runnable SFC: the real import + the tab data
// + the same props the canvas uses. PascalCase tag, no nested <template>.
const snippet = (tabs, attrs) => toSfc([IMPORT, '', tabsConst(tabs)], `<CodeBlock :tabs="tabs" ${attrs} />`)

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
        component:
          'Read-only code viewer for docs, API examples, and configuration previews. Four layouts share one monolithic shell — a tabbed language switcher, a raised filename bar, per-line diff markers, and a highlighted line — all rendered conditionally from the active tab’s data.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    tabs: {
      control: 'object',
      description:
        'Tab definitions. Pass source on each tab’s `code` field (required), plus optional `language`, `fileName`, `fileIcon`, `highlightedLine`, or `lineChanges`.',
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

const Template = (args) => ({
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

/** @type {import('@storybook/vue3').StoryObj<typeof CodeBlock>} */
export const Default = {
  args: {
    tabs: languageSwitcherTabs,
    defaultValue: 'js',
    showLineNumbers: true,
    copyAriaLabel: 'Copy code'
  },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Language switcher: two tabs with a filename bar, syntax highlighting, and copy.' },
      source: { code: snippet(languageSwitcherTabs, 'default-value="js" show-line-numbers') }
    }
  }
}

export const WithoutLineNumbers = {
  args: {
    tabs: languageSwitcherTabs,
    defaultValue: 'js',
    showLineNumbers: false,
    copyAriaLabel: 'Copy code'
  },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Same language switcher with the line-number gutter hidden.' },
      source: { code: snippet(languageSwitcherTabs, 'default-value="js" :show-line-numbers="false"') }
    }
  }
}

export const WithFileName = {
  args: {
    tabs: fileNameTabs,
    defaultValue: 'js',
    showLineNumbers: true,
    copyAriaLabel: 'Copy code'
  },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Single snippet with a raised filename bar and no tab header.' },
      source: { code: snippet(fileNameTabs, 'default-value="js" show-line-numbers') }
    }
  }
}

export const WithDiff = {
  args: {
    tabs: diffTabs,
    defaultValue: 'diff',
    showLineNumbers: true,
    copyAriaLabel: 'Copy code'
  },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Per-line added/removed markers driven by the active tab’s `lineChanges`.' },
      source: { code: snippet(diffTabs, 'default-value="diff" show-line-numbers') }
    }
  }
}

export const WithHighlightedLine = {
  args: {
    tabs: highlightedTabs,
    defaultValue: 'highlighted',
    showLineNumbers: true,
    copyAriaLabel: 'Copy code'
  },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'One active line with an info background and leading bar via `highlightedLine`.' },
      source: { code: snippet(highlightedTabs, 'default-value="highlighted" show-line-numbers') }
    }
  }
}

export const WithAnimatedLines = {
  args: {
    tabs: animatedTabs,
    defaultValue: 'js',
    showLineNumbers: true,
    animateLines: true,
    copyAriaLabel: 'Copy code'
  },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Staggered line entrance for website layouts via `animateLines`.' },
      source: { code: snippet(animatedTabs, 'default-value="js" show-line-numbers animate-lines') }
    }
  }
}
