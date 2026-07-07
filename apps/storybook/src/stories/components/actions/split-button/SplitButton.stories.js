import SplitButton from '@aziontech/webkit/split-button'

import { toSfc } from '../../../_shared/story-source'

// Imports + a runnable `items` const so every "Show code" snippet is
// self-contained and matches the canvas exactly.
const SNIPPET_IMPORTS = [
  "import SplitButton from '@aziontech/webkit/split-button'",
  '',
  'const items = [',
  "  { label: 'Update', value: 'update', icon: 'pi pi-refresh' },",
  "  { label: 'Duplicate', value: 'duplicate', icon: 'pi pi-copy' },",
  "  { label: 'Delete', value: 'delete', icon: 'pi pi-trash', disabled: true }",
  ']'
]

const ITEMS = [
  { label: 'Update', value: 'update', icon: 'pi pi-refresh' },
  { label: 'Duplicate', value: 'duplicate', icon: 'pi pi-copy' },
  { label: 'Delete', value: 'delete', icon: 'pi pi-trash', disabled: true }
]

const meta = {
  title: 'Components/Actions/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
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
          'A primary command button visually joined to a chevron toggle that opens an overlay menu of related actions defined by a `model` array. The primary button runs the default action; the joined toggle composes the navigation Dropdown to present the rest.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label text on the primary command button.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    icon: {
      control: 'text',
      description: "PrimeIcons class for the primary button's leading icon.",
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    model: {
      control: 'object',
      description: 'Actions rendered as rows in the attached overlay menu.',
      table: {
        category: 'props',
        type: { summary: 'SplitButtonItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    kind: {
      control: 'select',
      options: ['primary', 'secondary', 'outlined'],
      description: 'Visual variant applied to both joined segments.',
      table: {
        category: 'props',
        type: { summary: "'primary' | 'secondary' | 'outlined'" },
        defaultValue: { summary: "'primary'" }
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size token; affects height, padding, and typography.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'large'" }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables both segments and prevents the menu from opening.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    loading: {
      control: 'boolean',
      description:
        'Shows a spinner on the primary button and takes the disabled status: both segments are disabled and the menu cannot open while it resolves.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    updateLabelOnSelect: {
      control: 'boolean',
      description:
        "When true, selecting a menu action updates the primary button's label and icon to mirror that action and marks it as selected in the menu.",
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    onClick: {
      action: 'click',
      description:
        'Fired by the primary command button on activation; the second argument is the action currently mirrored on the primary (when updateLabelOnSelect is on), otherwise null.',
      table: {
        category: 'events',
        type: { summary: '(event: MouseEvent, item: SplitButtonItem | null)' }
      }
    },
    onItemClick: {
      action: 'item-click',
      description: 'Fired when a menu action is selected; carries the matched model item.',
      table: { category: 'events', type: { summary: 'SplitButtonItem' } }
    }
  },
  args: {
    label: 'Save',
    icon: 'pi pi-check',
    model: ITEMS,
    kind: 'primary',
    size: 'large',
    disabled: false,
    loading: false,
    updateLabelOnSelect: false
  }
}

export default meta

const Template = (args) => ({
  components: { SplitButton },
  setup() {
    const { onClick, onItemClick, ...props } = args

    return { props, onClick, onItemClick }
  },
  template: '<SplitButton v-bind="props" @click="onClick" @item-click="onItemClick" />'
})

const DEFAULT_MARKUP = `<SplitButton
  label="Save"
  icon="pi pi-check"
  :model="items"
  @click="onSave"
  @item-click="onAction"
/>`

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Primary split button at large size with a three-action menu.' },
      source: { code: toSfc(SNIPPET_IMPORTS, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_MARKUP = `<div class="flex flex-wrap items-center gap-4">
  <SplitButton kind="primary" label="Primary" :model="items" />
  <SplitButton kind="secondary" label="Secondary" :model="items" />
  <SplitButton kind="outlined" label="Outlined" :model="items" />
</div>`

export const Types = {
  render: () => ({
    components: { SplitButton },
    setup() {
      return { items: ITEMS }
    },
    template: TYPES_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All kind variants side by side.' },
      source: { code: toSfc(SNIPPET_IMPORTS, TYPES_MARKUP) }
    }
  }
}

const SIZES_MARKUP = `<div class="flex flex-wrap items-center gap-4">
  <SplitButton size="small" label="Small" :model="items" />
  <SplitButton size="medium" label="Medium" :model="items" />
  <SplitButton size="large" label="Large" :model="items" />
</div>`

export const Sizes = {
  render: () => ({
    components: { SplitButton },
    setup() {
      return { items: ITEMS }
    },
    template: SIZES_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All size variants side by side.' },
      source: { code: toSfc(SNIPPET_IMPORTS, SIZES_MARKUP) }
    }
  }
}

const LOADING_MARKUP = `<SplitButton
  label="Saving"
  icon="pi pi-check"
  loading
  :model="items"
/>`

export const Loading = {
  args: { loading: true, label: 'Saving' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Loading state: the whole control takes the disabled status — a spinner replaces the primary icon, activation is blocked, the toggle is disabled, and the menu cannot open.'
      },
      source: { code: toSfc(SNIPPET_IMPORTS, LOADING_MARKUP) }
    }
  }
}

const DISABLED_MARKUP = `<SplitButton
  label="Save"
  icon="pi pi-check"
  disabled
  :model="items"
/>`

export const Disabled = {
  args: { disabled: true },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Disabled state: both segments are inert and the menu cannot open.' },
      source: { code: toSfc(SNIPPET_IMPORTS, DISABLED_MARKUP) }
    }
  }
}

const UPDATE_LABEL_MARKUP = `<SplitButton
  label="Save"
  icon="pi pi-check"
  :model="items"
  update-label-on-select
  @item-click="onAction"
/>`

export const UpdateLabelOnSelect = {
  args: { updateLabelOnSelect: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          "Opt-in: choosing a menu action swaps the primary button's label and icon to that action and marks the row selected. Open the menu and pick an action to see the primary segment update."
      },
      source: { code: toSfc(SNIPPET_IMPORTS, UPDATE_LABEL_MARKUP) }
    }
  }
}
