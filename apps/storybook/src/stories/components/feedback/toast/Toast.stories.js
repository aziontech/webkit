import Button from '@aziontech/webkit/button'
import { Toaster, toast } from '@aziontech/webkit/toast'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = [
  "import { Toaster, toast } from '@aziontech/webkit/toast'",
  "import Button from '@aziontech/webkit/button'"
]

const components = { Toaster, Button }

// The canvas binds the Toaster's own props from `args` so the Controls panel
// (position / duration / max / expand / closable) drives the mounted region
// live. The `source.code` snippets stay consumer-clean with concrete props.
const LIVE_TOASTER =
  '<Toaster :position="args.position" :duration="args.duration" :max="args.max" :expand="args.expand" :closable="args.closable" />'

const POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right'
]

/** @type {import('@storybook/vue3').Meta<typeof Toaster>} */
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
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Transient, non-blocking notifications: mount `Toaster` once near the app root, then raise toasts imperatively from anywhere with the exported `toast()` function and its type shortcuts (`toast.success`, `toast.error`, `toast.info`, `toast.warning`, `toast.loading`). Each notification stacks in a corner, expands on hover, pauses its countdown while hovered, auto-dismisses, and is announced to assistive technology without stealing focus.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    position: {
      control: 'inline-radio',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right'
      ],
      description:
        'Corner (or edge-center) the stack is anchored to; a per-toast `position` overrides it.',
      table: {
        category: 'props',
        type: {
          summary:
            "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'"
        },
        defaultValue: { summary: "'bottom-right'" }
      }
    },
    duration: {
      control: 'number',
      description:
        'Default auto-dismiss time in ms each toast inherits; a per-toast `duration` overrides it, and `0` keeps the toast until dismissed.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '4000' } }
    },
    max: {
      control: 'number',
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
    default: {
      control: false,
      description:
        'Scoped slot to override a single toast body — receives `{ toast, dismiss }`. When omitted, the Toaster composes `ToastItem` from the store entry.',
      table: { category: 'slots', type: { summary: 'slot' } }
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

const DEFAULT_SCRIPT = [
  "import { Toaster, toast } from '@aziontech/webkit/toast'",
  "import Button from '@aziontech/webkit/button'",
  '',
  'const show = () =>',
  "  toast('Event has been created', {",
  "    description: 'Sunday, December 03, 2023 at 9:00 AM',",
  "    action: { label: 'Undo', onClick: () => {} }",
  '  })'
]

const DEFAULT_MARKUP = `<Toaster position="bottom-right" />
<Button label="Show toast" @click="show" />`

/** @type {import('@storybook/vue3').StoryObj<typeof Toaster>} */
export const Default = {
  render: (args) => ({
    components,
    setup() {
      const show = () =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          action: { label: 'Undo', onClick: () => {} }
        })
      return { args, show }
    },
    template: `${LIVE_TOASTER}\n<Button label="Show toast" @click="show" />`
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A title, a description, and an inline "Undo" action — raised with a single `toast()` call.'
      },
      source: { code: toSfc(DEFAULT_SCRIPT, DEFAULT_MARKUP) }
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

/** @type {import('@storybook/vue3').StoryObj<typeof Toaster>} */
export const Types = {
  render: () => ({
    components,
    setup: () => ({ toast }),
    template: TYPES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Each type (default, success, info, warning, error, loading) with its own icon, as a two-line toast (title + timestamp) matching the Figma. Loading spins.'
      },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}

const WITH_DESCRIPTION_SCRIPT = [
  "import { Toaster, toast } from '@aziontech/webkit/toast'",
  "import Button from '@aziontech/webkit/button'",
  '',
  'const show = () =>',
  "  toast('Event has been created', {",
  "    description: 'Sunday, December 03, 2023 at 9:00 AM'",
  '  })'
]

const WITH_DESCRIPTION_MARKUP = `<Toaster position="bottom-right" />
<Button label="Show toast" @click="show" />`

/** @type {import('@storybook/vue3').StoryObj<typeof Toaster>} */
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
    template: `${LIVE_TOASTER}\n<Button label="Show toast" @click="show" />`
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A two-line body — a title plus a supporting `description` line — raised with a single `toast()` call.'
      },
      source: { code: toSfc(WITH_DESCRIPTION_SCRIPT, WITH_DESCRIPTION_MARKUP) }
    }
  }
}

const WITH_ACTION_SCRIPT = [
  "import { Toaster, toast } from '@aziontech/webkit/toast'",
  "import Button from '@aziontech/webkit/button'",
  '',
  'const show = () =>',
  "  toast('Event has been created', {",
  "    action: { label: 'Undo', onClick: () => {} }",
  '  })'
]

const WITH_ACTION_MARKUP = `<Toaster position="bottom-right" />
<Button label="Show toast" @click="show" />`

/** @type {import('@storybook/vue3').StoryObj<typeof Toaster>} */
export const WithAction = {
  render: (args) => ({
    components,
    setup() {
      const show = () =>
        toast('Event has been created', {
          action: { label: 'Undo', onClick: () => {} }
        })
      return { args, show }
    },
    template: `${LIVE_TOASTER}\n<Button label="Show toast" @click="show" />`
  }),
  parameters: {
    docs: {
      description: {
        story:
          'An inline "Undo" action — a label plus an `onClick` handler — raised with a single `toast()` call.'
      },
      source: { code: toSfc(WITH_ACTION_SCRIPT, WITH_ACTION_MARKUP) }
    }
  }
}

const CLOSABLE_SCRIPT = [
  "import { Toaster, toast } from '@aziontech/webkit/toast'",
  "import Button from '@aziontech/webkit/button'",
  '',
  'const show = () =>',
  "  toast('Event has been created', {",
  "    description: 'Sunday, December 03, 2023 at 9:00 AM'",
  '  })'
]

const CLOSABLE_MARKUP = `<Toaster position="bottom-right" closable />
<Button label="Show toast" @click="show" />`

/** @type {import('@storybook/vue3').StoryObj<typeof Toaster>} */
export const Closable = {
  args: { closable: true, duration: 0 },
  render: (args) => ({
    components,
    setup() {
      const show = () =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM'
        })
      return { args, show }
    },
    template: `${LIVE_TOASTER}\n<Button label="Show toast" @click="show" />`
  }),
  parameters: {
    docs: {
      description: {
        story:
          'An always-visible close control — the `closable` Toaster prop adds a dismiss control to every toast (a per-toast `closable` option overrides it). Off by default.'
      },
      source: { code: toSfc(CLOSABLE_SCRIPT, CLOSABLE_MARKUP) }
    }
  }
}

const POSITIONS_SCRIPT = [
  "import { Toaster, toast } from '@aziontech/webkit/toast'",
  "import Button from '@aziontech/webkit/button'",
  '',
  "const positions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']"
]

const POSITIONS_TEMPLATE = `<Toaster position="bottom-right" />
<div class="flex flex-wrap justify-center gap-2">
  <Button v-for="p in positions" :key="p" :label="p" kind="secondary" @click="() => toast(p, { position: p })" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Toaster>} */
export const Positions = {
  render: () => ({
    components,
    setup: () => ({ toast, positions: POSITIONS }),
    template: POSITIONS_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Anchor a toast to any of the six corners via the per-toast `position` option (`toast(msg, { position })`) — it overrides the Toaster default.'
      },
      source: { code: toSfc(POSITIONS_SCRIPT, POSITIONS_TEMPLATE) }
    }
  }
}
