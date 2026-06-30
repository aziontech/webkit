import { Toaster, toast } from '@aziontech/webkit/toast'
import Button from '@aziontech/webkit/button'

const IMPORTS = [
  '<script setup>',
  "import { Toaster, toast } from '@aziontech/webkit/toast'",
  "import Button from '@aziontech/webkit/button'",
  '</script>'
]

/** Indent a `<template>` body and wrap it in a runnable `<script setup>` SFC. */
const indent = (code) =>
  code
    .trim()
    .split('\n')
    .map((line) => (line ? `  ${line}` : line))
    .join('\n')

const sfc = (body) => [...IMPORTS, '', '<template>', indent(body), '</template>'].join('\n')

const components = { Toaster, Button }

// The canvas binds the Toaster's own props from `args` so the Controls panel
// (position / duration / max / expand / closable) drives the mounted region live.
// `live()` swaps the clean `<Toaster>` tag for that binding at render time only —
// the `*_TEMPLATE` constants stay consumer-clean for the "Show code" snippets.
// (Only the Toaster props are bound — action args like `onUndo` are used in the
// `toast()` calls, never passed to the Toaster.)
const LIVE_TOASTER =
  '<Toaster :position="args.position" :duration="args.duration" :max="args.max" :expand="args.expand" :closable="args.closable" />'
const live = (template) =>
  template
    .replace('<Toaster position="bottom-right" />', LIVE_TOASTER)
    .replace('<Toaster />', LIVE_TOASTER)

const meta = {
  title: 'Components/Feedback/Toast',
  component: Toaster,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div class="flex flex-wrap items-center justify-center gap-3"><story /></div>'
    })
  ],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'aria-allowed-attr', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component: [
          'Transient, non-blocking notifications that group into a collapsed stack, expand on hover, and pause their countdown while hovered.',
          '',
          '### Installation',
          '',
          'Mount `<Toaster />` once near your app root, then call `toast()` from anywhere (a component, a store, a plain util):',
          '',
          '```vue',
          '<script setup>',
          "import { Toaster, toast } from '@aziontech/webkit/toast'",
          '</script>',
          '',
          '<template>',
          '  <Toaster position="bottom-right" />',
          '  <button @click="() => toast(\'Saved\')">Save</button>',
          '</template>',
          '```',
          '',
          'Or install once in `main.js` and use `this.$toast` / `useToast()` anywhere:',
          '',
          '```js',
          "import { ToastPlugin } from '@aziontech/webkit/toast'",
          'app.use(ToastPlugin)',
          '```'
        ].join('\n')
      },
      source: {
        type: 'dynamic',
        excludeDecorators: true,
        transform: (code) => {
          const src = String(code).trim()
          if (/<script[\s>]/i.test(src)) return src
          const wrapped = src.match(/^<template>\s*([\s\S]*?)\s*<\/template>$/)
          return sfc(wrapped ? wrapped[1].trim() : src)
        }
      },
      canvas: {
        sourceState: 'shown'
      }
    }
  },
  argTypes: {
    position: {
      control: 'inline-radio',
      options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
      description: 'Corner (or edge-center) the stack is anchored to; a per-toast `position` overrides it.',
      table: {
        category: 'props',
        type: { summary: 'ToastPosition' },
        defaultValue: { summary: "'bottom-right'" }
      }
    },
    duration: {
      control: { type: 'number' },
      description: 'Default auto-dismiss time in ms each toast inherits; `0` keeps it until dismissed.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '4000' } }
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum simultaneously visible toasts per corner before the rest queue behind.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '3' } }
    },
    expand: {
      control: 'boolean',
      description:
        'Lay the stack out fully expanded with a gap; when `false` the resting stack overlaps into a peek.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    closable: {
      control: 'boolean',
      description:
        'Show an always-visible close control on every toast; a per-toast `closable` option overrides it.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    onUndo: {
      action: 'undo',
      description: 'Fires when the toast\'s inline "Undo" action is clicked (Default / WithAction stories).',
      table: { category: 'events' }
    },
    onClose: {
      action: 'close',
      description: 'Fires when a toast is dismissed via the `onClose` option (Closable story).',
      table: { category: 'events' }
    }
  },
  args: {
    position: 'bottom-right',
    duration: 4000,
    max: 3,
    expand: false,
    closable: false
  }
}

export default meta

const DEFAULT_TEMPLATE = `<Toaster position="bottom-right" />
<Button label="Show toast" @click="show" />`

export const Default = {
  render: (args) => ({
    components,
    setup() {
      const show = () =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          action: { label: 'Undo', onClick: args.onUndo }
        })
      return { args, show }
    },
    template: live(DEFAULT_TEMPLATE)
  }),
  parameters: {
    docs: {
      description: { story: 'A title, a description, and an inline "Undo" action — raised with a single `toast()` call.' },
      source: {
        code: [
          '<script setup>',
          "import { Toaster, toast } from '@aziontech/webkit/toast'",
          "import Button from '@aziontech/webkit/button'",
          '',
          'const show = () =>',
          "  toast('Event has been created', {",
          "    description: 'Sunday, December 03, 2023 at 9:00 AM',",
          "    action: { label: 'Undo', onClick: () => console.log('Undo') }",
          '  })',
          '</script>',
          '',
          '<template>',
          '  <Toaster position="bottom-right" />',
          '  <Button label="Show toast" @click="show" />',
          '</template>'
        ].join('\n')
      }
    }
  }
}

// Each type raised as a two-line toast (title + timestamp), matching the Figma set.
const TYPES_TEMPLATE = `<Toaster position="bottom-right" />
<div class="flex flex-wrap justify-center gap-2">
  <Button label="Default" kind="secondary" @click="() => toast('Event has been created', { description: 'Sunday, December 03, 2023 at 9:00 AM' })" />
  <Button label="Success" kind="primary" @click="() => toast.success('Event has been created', { description: 'Sunday, December 03, 2023 at 9:00 AM' })" />
  <Button label="Info" kind="outlined" @click="() => toast.info('Event has been created', { description: 'Sunday, December 03, 2023 at 9:00 AM' })" />
  <Button label="Warning" kind="outlined" @click="() => toast.warning('Event has been created', { description: 'Sunday, December 03, 2023 at 9:00 AM' })" />
  <Button label="Error" kind="danger" @click="() => toast.error('Event has been created', { description: 'Sunday, December 03, 2023 at 9:00 AM' })" />
  <Button label="Loading" kind="text" @click="() => toast.loading('Loading…', { description: 'Sunday, December 03, 2023 at 9:00 AM' })" />
</div>`

export const Types = {
  render: (args) => ({
    components,
    setup: () => ({ args, toast }),
    template: live(TYPES_TEMPLATE)
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Each type (default, success, info, warning, error, loading) with its own icon, as a two-line toast (title + timestamp) matching the Figma. Loading spins.'
      },
      source: { code: sfc(TYPES_TEMPLATE) }
    }
  }
}

const WITH_DESCRIPTION_TEMPLATE = `<Toaster position="bottom-right" />
<Button label="Show toast" @click="show" />`

export const WithDescription = {
  render: (args) => ({
    components,
    setup() {
      const show = () =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM'
        })
      return { args, show }
    },
    template: live(WITH_DESCRIPTION_TEMPLATE)
  }),
  parameters: {
    docs: {
      description: {
        story: 'A two-line body — a title plus a supporting `description` line — raised with a single `toast()` call.'
      },
      source: {
        code: [
          '<script setup>',
          "import { Toaster, toast } from '@aziontech/webkit/toast'",
          "import Button from '@aziontech/webkit/button'",
          '',
          'const show = () =>',
          "  toast('Event has been created', {",
          "    description: 'Sunday, December 03, 2023 at 9:00 AM'",
          '  })',
          '</script>',
          '',
          '<template>',
          '  <Toaster position="bottom-right" />',
          '  <Button label="Show toast" @click="show" />',
          '</template>'
        ].join('\n')
      }
    }
  }
}

const WITH_ACTION_TEMPLATE = `<Toaster position="bottom-right" />
<Button label="Show toast" @click="show" />`

export const WithAction = {
  render: (args) => ({
    components,
    setup() {
      const show = () =>
        toast('Event has been created', {
          action: { label: 'Undo', onClick: args.onUndo }
        })
      return { args, show }
    },
    template: live(WITH_ACTION_TEMPLATE)
  }),
  parameters: {
    docs: {
      description: {
        story: 'An inline "Undo" action — a label plus an `onClick` handler — raised with a single `toast()` call.'
      },
      source: {
        code: [
          '<script setup>',
          "import { Toaster, toast } from '@aziontech/webkit/toast'",
          "import Button from '@aziontech/webkit/button'",
          '',
          'const show = () =>',
          "  toast('Event has been created', {",
          "    action: { label: 'Undo', onClick: () => console.log('Undo') }",
          '  })',
          '</script>',
          '',
          '<template>',
          '  <Toaster position="bottom-right" />',
          '  <Button label="Show toast" @click="show" />',
          '</template>'
        ].join('\n')
      }
    }
  }
}

const CLOSABLE_TEMPLATE = `<Toaster position="bottom-right" />
<Button label="Show toast" @click="show" />`

export const Closable = {
  args: { closable: true, duration: 0 },
  render: (args) => ({
    components,
    setup() {
      const show = () =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          onClose: args.onClose
        })
      return { args, show }
    },
    template: live(CLOSABLE_TEMPLATE)
  }),
  parameters: {
    docs: {
      description: {
        story:
          'An always-visible close control — the `<Toaster closable>` prop adds a dismiss control to every toast (a per-toast `closable` option overrides it). Off by default.'
      },
      source: {
        code: [
          '<script setup>',
          "import { Toaster, toast } from '@aziontech/webkit/toast'",
          "import Button from '@aziontech/webkit/button'",
          '',
          'const show = () =>',
          "  toast('Event has been created', {",
          "    description: 'Sunday, December 03, 2023 at 9:00 AM'",
          '  })',
          '</script>',
          '',
          '<template>',
          '  <Toaster position="bottom-right" closable />',
          '  <Button label="Show toast" @click="show" />',
          '</template>'
        ].join('\n')
      }
    }
  }
}

const POSITIONS = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']

const POSITIONS_TEMPLATE = `<Toaster />
<div class="flex flex-wrap justify-center gap-2">
  <Button v-for="p in positions" :key="p" :label="p" kind="secondary" @click="() => toast(p, { position: p })" />
</div>`

export const Positions = {
  render: (args) => ({
    components,
    setup: () => ({ args, toast, positions: POSITIONS }),
    template: live(POSITIONS_TEMPLATE)
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Anchor a toast to any of the six corners via the per-toast `position` option (`toast(msg, { position })`) — it overrides the Toaster default.'
      },
      source: {
        code: [
          '<script setup>',
          "import { Toaster, toast } from '@aziontech/webkit/toast'",
          "import Button from '@aziontech/webkit/button'",
          '',
          "const positions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']",
          '</script>',
          '',
          '<template>',
          indent(POSITIONS_TEMPLATE),
          '</template>'
        ].join('\n')
      }
    }
  }
}
