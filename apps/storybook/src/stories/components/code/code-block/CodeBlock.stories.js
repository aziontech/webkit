import CodeBlock from '@aziontech/webkit/code-block'
import { ref, watch } from 'vue'

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

// A CLI snippet exercises every shape the shell tokeniser recognises: a full-line
// comment, a program, its flags, a pipe handing off to a second program, a sub-command,
// a shell keyword, a quoted string, and a variable expansion.
const shellSampleCode = `# Install the Azion CLI
curl -fsSL https://cli.azion.app/install.sh | bash

export AZION_TOKEN="$MY_TOKEN"
azion link --preset vue
azion deploy --auto # ship it`

const unevenTabs = [
  {
    label: 'Shell',
    value: 'shell',
    language: 'bash',
    code: 'npx azion deploy --local'
  },
  {
    label: 'Javascript',
    value: 'js',
    language: 'javascript',
    code: `const response = await fetch('https://api.azion.com/v4/workspace/workloads', {
  headers: { Authorization: \`Token \${token}\` }
})

const { results } = await response.json()`
  }
]

const singleLineTabs = [
  {
    label: 'Shell',
    value: 'single',
    language: 'bash',
    code: 'npx azion deploy --local'
  }
]

const shellTabs = [
  {
    label: 'Shell',
    value: 'shell',
    language: 'bash',
    code: shellSampleCode
  }
]

// Serialize a tabs array into a runnable `const tabs = …` script line so the
// "Show code" snippet carries the exact data the canvas renders (zero drift).
const tabsConst = (tabs) => `const tabs = ${JSON.stringify(tabs, null, 2)}`

// Each story's snippet is a single runnable SFC: the real import + the tab data
// + the same wrapper and props the canvas renders. PascalCase tag, no nested <template>.
const snippet = (tabs, attrs) =>
  toSfc(
    [IMPORT, '', tabsConst(tabs)],
    `<div class="max-w-[692px]">
  <CodeBlock :tabs="tabs" ${attrs} />
</div>`
  )

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
        type: {
          summary: 'CodeBlockTab[]',
          detail:
            '{ label, value, code, language?, fileName?, fileIcon?, highlightedLine?, lineChanges? }'
        },
        defaultValue: { summary: '[]' }
      }
    },
    value: {
      control: 'text',
      description: 'Controlled active tab value (`v-model:value`).',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    defaultValue: {
      control: 'text',
      description: 'Initial active tab when uncontrolled.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    showLineNumbers: {
      control: 'boolean',
      description:
        'Shows a fixed-width gutter with zero-padded line numbers before each code line.',
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
    border: {
      control: 'boolean',
      description:
        'Draw the outer card border around the block. On by default; set to false to render flush inside a surface that already frames it.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    'onUpdate:value': {
      action: 'update:value',
      description: 'v-model:value update emitted when the active tab changes.',
      table: { category: 'events', type: { summary: 'string' } }
    },
    onCopy: {
      action: 'copy',
      description: 'Emitted after the active tab code is copied to the clipboard.',
      table: { category: 'events', type: { summary: 'string' } }
    }
  },
  args: {
    tabs: languageSwitcherTabs,
    defaultValue: 'js',
    showLineNumbers: true,
    copyAriaLabel: 'Copy code',
    animateLines: false,
    border: true
  }
}

export default meta

const Template = (args) => ({
  components: { CodeBlock },
  setup() {
    const value = ref(args.value ?? args.defaultValue ?? args.tabs?.[0]?.value ?? '')

    watch(
      () => args.value ?? args.defaultValue,
      (next) => {
        value.value = next ?? args.tabs?.[0]?.value ?? ''
      }
    )

    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:value']?.(next)
    }

    return { args, value, onUpdate }
  },
  template: `
    <div class="max-w-[692px]">
      <CodeBlock v-bind="args" :value="value" @update:value="onUpdate" />
    </div>
  `
})

/** @type {import('@storybook/vue3').StoryObj<typeof CodeBlock>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Language switcher: two tabs with a filename bar, syntax highlighting, and copy.'
      },
      source: { code: snippet(languageSwitcherTabs, 'default-value="js" show-line-numbers') }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof CodeBlock>} */
export const WithoutLineNumbers = {
  args: {
    showLineNumbers: false
  },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Same language switcher with the line-number gutter hidden.' },
      source: {
        code: snippet(languageSwitcherTabs, 'default-value="js" :show-line-numbers="false"')
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof CodeBlock>} */
export const WithFileName = {
  args: {
    tabs: fileNameTabs
  },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Single snippet with a raised filename bar and no tab header.' },
      source: { code: snippet(fileNameTabs, 'default-value="js" show-line-numbers') }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof CodeBlock>} */
export const WithDiff = {
  args: {
    tabs: diffTabs,
    defaultValue: 'diff'
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Per-line added/removed markers driven by the active tab’s `lineChanges`.'
      },
      source: { code: snippet(diffTabs, 'default-value="diff" show-line-numbers') }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof CodeBlock>} */
export const WithHighlightedLine = {
  args: {
    tabs: highlightedTabs,
    defaultValue: 'highlighted'
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'One active line with an info background and leading bar via `highlightedLine`.'
      },
      source: { code: snippet(highlightedTabs, 'default-value="highlighted" show-line-numbers') }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof CodeBlock>} */
export const WithAnimatedLines = {
  args: {
    tabs: animatedTabs,
    animateLines: true
  },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Staggered line entrance for website layouts via `animateLines`.' },
      source: { code: snippet(animatedTabs, 'default-value="js" show-line-numbers animate-lines') }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof CodeBlock>} */
export const Shell = {
  args: {
    tabs: shellTabs
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A CLI snippet under `language: "bash"`. A command line has a different shape from an expression, so it is read as one: the first word is the program being run, flags modify it, an operator hands off to the next program, and the rest is data — mapped onto the same code-sintax palette JavaScript uses, with no new syntax token. `sh`, `shell`, `zsh` and `console` resolve here too.'
      },
      source: { code: snippet(shellTabs, 'default-value="shell" show-line-numbers') }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof CodeBlock>} */
export const Borderless = {
  args: {
    border: false
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The outer card border dropped via `:border="false"` — for embedding inside a surface that already frames the block. Internal dividers are unaffected.'
      },
      source: {
        code: snippet(languageSwitcherTabs, 'default-value="js" show-line-numbers :border="false"')
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof CodeBlock>} */
export const SingleLine = {
  args: {
    tabs: singleLineTabs,
    showLineNumbers: false
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The smallest block there is: one line, no tabs, no filename bar. The copy control is centred on that single row instead of pinned to a top inset it would overshoot, and the line reserves the control its own width so a long command scrolls under nothing.'
      },
      source: { code: snippet(singleLineTabs, ':show-line-numbers="false"') }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof CodeBlock>} */
export const UnevenTabs = {
  args: {
    tabs: unevenTabs,
    showLineNumbers: false
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Two tabs holding a different number of lines — the only geometry where the shell changes height on a swap. It animates between the two heights while the new snippet enters line by line, so neither the block nor the page under it jumps a whole row set in one frame.'
      },
      source: { code: snippet(unevenTabs, 'default-value="shell" :show-line-numbers="false"') }
    }
  }
}
