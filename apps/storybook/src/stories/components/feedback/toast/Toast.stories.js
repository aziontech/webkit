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
  }
}

export default meta

const DEFAULT_TEMPLATE = `<Toaster position="bottom-right" />
<Button label="Show toast" @click="show" />`

export const Default = {
  render: () => ({
    components,
    setup() {
      const show = () =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          action: { label: 'Undo', onClick: () => console.log('Undo') }
        })
      return { show }
    },
    template: DEFAULT_TEMPLATE
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

const TYPES_TEMPLATE = `<Toaster position="bottom-right" />
<div class="flex flex-wrap justify-center gap-2">
  <Button label="Default" kind="secondary" @click="() => toast('Notification')" />
  <Button label="Success" kind="primary" @click="() => toast.success('Deployed')" />
  <Button label="Info" kind="outlined" @click="() => toast.info('Heads up')" />
  <Button label="Warning" kind="outlined" @click="() => toast.warning('Check this')" />
  <Button label="Error" kind="danger" @click="() => toast.error('Failed')" />
  <Button label="Loading" kind="text" @click="() => toast.loading('Uploading…')" />
</div>`

export const Types = {
  render: () => ({
    components,
    setup: () => ({ toast }),
    template: TYPES_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story: 'Each type (default, success, info, warning, error, loading) with its own icon. Loading spins.'
      },
      source: { code: sfc(TYPES_TEMPLATE) }
    }
  }
}

const WITH_DESCRIPTION_TEMPLATE = `<Toaster position="bottom-right" />
<Button label="Show toast" @click="show" />`

export const WithDescription = {
  render: () => ({
    components,
    setup() {
      const show = () =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM'
        })
      return { show }
    },
    template: WITH_DESCRIPTION_TEMPLATE
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
  render: () => ({
    components,
    setup() {
      const show = () =>
        toast('Event has been created', {
          action: { label: 'Undo', onClick: () => console.log('Undo') }
        })
      return { show }
    },
    template: WITH_ACTION_TEMPLATE
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

const POSITIONS =['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']

const POSITIONS_TEMPLATE = `<Toaster />
<div class="flex flex-wrap justify-center gap-2">
  <Button v-for="p in positions" :key="p" :label="p" kind="secondary" @click="() => toast(p, { position: p })" />
</div>`

export const Positions = {
  render: () => ({
    components,
    setup: () => ({ toast, positions: POSITIONS }),
    template: POSITIONS_TEMPLATE
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
