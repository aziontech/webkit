import Resizable from '@aziontech/webkit/resizable'
import ResizableHandle from '@aziontech/webkit/resizable-handle'
import ResizablePane from '@aziontech/webkit/resizable-pane'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

// The compound (`Resizable.Pane`) is the documented consumer form and what the
// snippets below show. The stories themselves render the FLAT bindings, because a runtime
// string template cannot resolve a dotted tag — `<Resizable.Pane>` silently renders
// nothing there.
const IMPORT = "import Resizable from '@aziontech/webkit/resizable'"

const components = { Resizable, ResizablePane, ResizableHandle }

const PANE = 'flex h-full items-center justify-center p-(--spacing-md) text-body-sm'

/** @type {import('@storybook/vue3').Meta<typeof Resizable>} */
const meta = {
  title: 'Components/Primitives/Layout/Resizable',
  component: Resizable,
  subcomponents: { ResizablePane, ResizableHandle },
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
          'A group of adjacent regions whose shared edges the reader can drag. It is the layout primitive behind a workspace — an editor with a terminal under it and a preview beside it — where every region is content the reader is working in and the split between them is theirs to set.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description:
        'Axis the panes are laid out on; horizontal places them side by side, vertical stacks them.',
      table: {
        category: 'props',
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'horizontal'" }
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the group as a whole.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    default: {
      control: false,
      description: 'The panes and handles, in the order they appear.',
      table: { category: 'slots', type: { summary: 'VNode | string' } }
    }
  },
  args: {
    orientation: 'horizontal',
    ariaLabel: 'Workspace'
  }
}

export default meta

const Template = (args) => ({
  components,
  setup() {
    const basis = ref(240)
    return { args, basis, PANE }
  },
  template: `
    <Resizable v-bind="args" class="h-64 w-full overflow-hidden rounded-(--shape-card) border border-(--border-default)">
      <ResizablePane aria-label="Document">
        <div :class="PANE">Flexible — no basis, so it takes what is left.</div>
      </ResizablePane>
      <ResizableHandle aria-label="Resize the panel" />
      <ResizablePane v-model:basis="basis" :min="160" :max="480" aria-label="Panel">
        <div :class="PANE">Sized — {{ basis }}px</div>
      </ResizablePane>
    </Resizable>
  `
})

const DEFAULT_MARKUP = `<Resizable orientation="horizontal" aria-label="Workspace" class="h-64">
  <Resizable.Pane aria-label="Document">Flexible — no basis, so it takes what is left.</Resizable.Pane>
  <Resizable.Handle aria-label="Resize the panel" />
  <Resizable.Pane v-model:basis="basis" :min="160" :max="480" aria-label="Panel">Sized</Resizable.Pane>
</Resizable>`

/** @type {import('@storybook/vue3').StoryObj<typeof Resizable>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'One flexible pane and one sized pane, divided by a handle. Drag the edge, or focus it and use the arrow keys.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const ORIENTATIONS_TEMPLATE = `<div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-2">
  <Resizable orientation="horizontal" aria-label="Side by side" class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)">
    <Resizable.Pane aria-label="Editor">Editor</Resizable.Pane>
    <Resizable.Handle aria-label="Resize the preview" />
    <Resizable.Pane :basis="200" :min="120" :max="400" aria-label="Preview">Preview</Resizable.Pane>
  </Resizable>
  <Resizable orientation="vertical" aria-label="Stacked" class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)">
    <Resizable.Pane aria-label="Editor">Editor</Resizable.Pane>
    <Resizable.Handle aria-label="Resize the terminal" />
    <Resizable.Pane :basis="96" :min="48" :max="200" aria-label="Terminal">Terminal</Resizable.Pane>
  </Resizable>
</div>`

export const Orientations = {
  render: () => ({
    components,
    setup: () => ({ PANE }),
    template: `<div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-2">
      <Resizable orientation="horizontal" aria-label="Side by side" class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)">
        <ResizablePane aria-label="Editor"><div :class="PANE">Editor</div></ResizablePane>
        <ResizableHandle aria-label="Resize the preview" />
        <ResizablePane :basis="200" :min="120" :max="400" aria-label="Preview"><div :class="PANE">Preview</div></ResizablePane>
      </Resizable>
      <Resizable orientation="vertical" aria-label="Stacked" class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)">
        <ResizablePane aria-label="Editor"><div :class="PANE">Editor</div></ResizablePane>
        <ResizableHandle aria-label="Resize the terminal" />
        <ResizablePane :basis="96" :min="48" :max="200" aria-label="Terminal"><div :class="PANE">Terminal</div></ResizablePane>
      </Resizable>
    </div>`
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The axis is this component’s only variant. A horizontal group divides side-by-side panes with a vertical rail; a vertical group stacks them and the rail runs across.'
      },
      source: { code: toSfc(IMPORT, ORIENTATIONS_TEMPLATE) }
    }
  }
}

const COLLAPSED_MARKUP = `<div class="flex flex-col gap-(--spacing-sm)">
  <button type="button" @click="collapsed = !collapsed">{{ collapsed ? 'Show' : 'Hide' }} the preview</button>
  <Resizable aria-label="Workspace" class="h-64">
    <Resizable.Pane aria-label="Editor">Editor</Resizable.Pane>
    <Resizable.Handle aria-label="Resize the preview" />
    <Resizable.Pane v-model:collapsed="collapsed" :basis="240" :min="160" collapsible aria-label="Preview">Preview</Resizable.Pane>
  </Resizable>
</div>`

export const Collapsed = {
  render: () => ({
    components,
    setup() {
      const collapsed = ref(true)
      return { collapsed, PANE }
    },
    template: `<div class="flex flex-col gap-(--spacing-sm)">
      <button
        type="button"
        class="self-start rounded-(--shape-button) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xxs) text-body-sm"
        @click="collapsed = !collapsed"
      >{{ collapsed ? 'Show' : 'Hide' }} the preview</button>
      <Resizable aria-label="Workspace" class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)">
        <ResizablePane aria-label="Editor"><div :class="PANE">Editor</div></ResizablePane>
        <ResizableHandle aria-label="Resize the preview" />
        <ResizablePane v-model:collapsed="collapsed" :basis="240" :min="160" collapsible aria-label="Preview"><div :class="PANE">Preview</div></ResizablePane>
      </Resizable>
    </div>`
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A collapsible pane renders at zero length and stays mounted, so its content keeps its state. The control that brings it back lives OUTSIDE it — a control that only exists inside the thing it hides cannot reopen it.'
      },
      source: { code: toSfc(IMPORT, COLLAPSED_MARKUP) }
    }
  }
}

const DISABLED_MARKUP = `<Resizable aria-label="Workspace" class="h-64">
  <Resizable.Pane aria-label="Document">Document</Resizable.Pane>
  <Resizable.Handle aria-label="Resize the panel" disabled />
  <Resizable.Pane :basis="240" aria-label="Panel">Fixed while the handle is disabled</Resizable.Pane>
</Resizable>`

export const Disabled = {
  render: () => ({
    components,
    setup: () => ({ PANE }),
    template: `<Resizable aria-label="Workspace" class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)">
      <ResizablePane aria-label="Document"><div :class="PANE">Document</div></ResizablePane>
      <ResizableHandle aria-label="Resize the panel" disabled />
      <ResizablePane :basis="240" aria-label="Panel"><div :class="PANE">Fixed while the handle is disabled</div></ResizablePane>
    </Resizable>`
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A disabled handle stays in place and stays announced, so the edge does not vanish from under a reader — it simply no longer moves.'
      },
      source: { code: toSfc(IMPORT, DISABLED_MARKUP) }
    }
  }
}
