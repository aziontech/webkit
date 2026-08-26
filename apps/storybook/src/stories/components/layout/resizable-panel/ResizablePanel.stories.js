import ResizablePanel from '@aziontech/webkit/resizable-panel'
import ResizablePanelHandle from '@aziontech/webkit/resizable-panel-handle'
import ResizablePanelPane from '@aziontech/webkit/resizable-panel-pane'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

// The compound (`ResizablePanel.Pane`) is the documented consumer form and what the
// snippets below show. The stories themselves render the FLAT bindings, because a runtime
// string template cannot resolve a dotted tag — `<ResizablePanel.Pane>` silently renders
// nothing there.
const IMPORT = "import ResizablePanel from '@aziontech/webkit/resizable-panel'"

const components = { ResizablePanel, ResizablePanelPane, ResizablePanelHandle }

const PANE = 'flex h-full items-center justify-center p-(--spacing-md) text-body-sm'

/** @type {import('@storybook/vue3').Meta<typeof ResizablePanel>} */
const meta = {
  title: 'Components/Layout/ResizablePanel',
  component: ResizablePanel,
  subcomponents: { ResizablePanelPane, ResizablePanelHandle },
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
    <ResizablePanel v-bind="args" class="h-64 w-full overflow-hidden rounded-(--shape-card) border border-(--border-default)">
      <ResizablePanelPane aria-label="Document">
        <div :class="PANE">Flexible — no basis, so it takes what is left.</div>
      </ResizablePanelPane>
      <ResizablePanelHandle aria-label="Resize the panel" />
      <ResizablePanelPane v-model:basis="basis" :min="160" :max="480" aria-label="Panel">
        <div :class="PANE">Sized — {{ basis }}px</div>
      </ResizablePanelPane>
    </ResizablePanel>
  `
})

const DEFAULT_MARKUP = `<ResizablePanel orientation="horizontal" aria-label="Workspace" class="h-64">
  <ResizablePanel.Pane aria-label="Document">Flexible — no basis, so it takes what is left.</ResizablePanel.Pane>
  <ResizablePanel.Handle aria-label="Resize the panel" />
  <ResizablePanel.Pane v-model:basis="basis" :min="160" :max="480" aria-label="Panel">Sized</ResizablePanel.Pane>
</ResizablePanel>`

/** @type {import('@storybook/vue3').StoryObj<typeof ResizablePanel>} */
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
  <ResizablePanel orientation="horizontal" aria-label="Side by side" class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)">
    <ResizablePanel.Pane aria-label="Editor">Editor</ResizablePanel.Pane>
    <ResizablePanel.Handle aria-label="Resize the preview" />
    <ResizablePanel.Pane :basis="200" :min="120" :max="400" aria-label="Preview">Preview</ResizablePanel.Pane>
  </ResizablePanel>
  <ResizablePanel orientation="vertical" aria-label="Stacked" class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)">
    <ResizablePanel.Pane aria-label="Editor">Editor</ResizablePanel.Pane>
    <ResizablePanel.Handle aria-label="Resize the terminal" />
    <ResizablePanel.Pane :basis="96" :min="48" :max="200" aria-label="Terminal">Terminal</ResizablePanel.Pane>
  </ResizablePanel>
</div>`

export const Orientations = {
  render: () => ({
    components,
    setup: () => ({ PANE }),
    template: `<div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-2">
      <ResizablePanel orientation="horizontal" aria-label="Side by side" class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)">
        <ResizablePanelPane aria-label="Editor"><div :class="PANE">Editor</div></ResizablePanelPane>
        <ResizablePanelHandle aria-label="Resize the preview" />
        <ResizablePanelPane :basis="200" :min="120" :max="400" aria-label="Preview"><div :class="PANE">Preview</div></ResizablePanelPane>
      </ResizablePanel>
      <ResizablePanel orientation="vertical" aria-label="Stacked" class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)">
        <ResizablePanelPane aria-label="Editor"><div :class="PANE">Editor</div></ResizablePanelPane>
        <ResizablePanelHandle aria-label="Resize the terminal" />
        <ResizablePanelPane :basis="96" :min="48" :max="200" aria-label="Terminal"><div :class="PANE">Terminal</div></ResizablePanelPane>
      </ResizablePanel>
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
  <ResizablePanel aria-label="Workspace" class="h-64">
    <ResizablePanel.Pane aria-label="Editor">Editor</ResizablePanel.Pane>
    <ResizablePanel.Handle aria-label="Resize the preview" />
    <ResizablePanel.Pane v-model:collapsed="collapsed" :basis="240" :min="160" collapsible aria-label="Preview">Preview</ResizablePanel.Pane>
  </ResizablePanel>
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
      <ResizablePanel aria-label="Workspace" class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)">
        <ResizablePanelPane aria-label="Editor"><div :class="PANE">Editor</div></ResizablePanelPane>
        <ResizablePanelHandle aria-label="Resize the preview" />
        <ResizablePanelPane v-model:collapsed="collapsed" :basis="240" :min="160" collapsible aria-label="Preview"><div :class="PANE">Preview</div></ResizablePanelPane>
      </ResizablePanel>
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

const DISABLED_MARKUP = `<ResizablePanel aria-label="Workspace" class="h-64">
  <ResizablePanel.Pane aria-label="Document">Document</ResizablePanel.Pane>
  <ResizablePanel.Handle aria-label="Resize the panel" disabled />
  <ResizablePanel.Pane :basis="240" aria-label="Panel">Fixed while the handle is disabled</ResizablePanel.Pane>
</ResizablePanel>`

export const Disabled = {
  render: () => ({
    components,
    setup: () => ({ PANE }),
    template: `<ResizablePanel aria-label="Workspace" class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)">
      <ResizablePanelPane aria-label="Document"><div :class="PANE">Document</div></ResizablePanelPane>
      <ResizablePanelHandle aria-label="Resize the panel" disabled />
      <ResizablePanelPane :basis="240" aria-label="Panel"><div :class="PANE">Fixed while the handle is disabled</div></ResizablePanelPane>
    </ResizablePanel>`
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
