import Button from '@aziontech/webkit/button'
import FieldText from '@aziontech/webkit/field-text'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Button from '@aziontech/webkit/button'"

/** @type {import('@storybook/vue3').Meta<typeof Button>} */
const meta = {
  title: 'Components/Primitives/Actions/Button',
  component: Button,
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
          'Interactive control for user actions. `label` is required (use `IconButton` for icon-only controls). Supports optional icon, loading state, and link rendering when `href` is set. Set `type="submit"` to let it submit its form; `disabled` and `loading` still block the submission.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label text. Required — use `IconButton` for icon-only controls.',
      table: { category: 'props', type: { summary: 'string', required: true } }
    },
    kind: {
      control: 'select',
      options: ['primary', 'secondary', 'outlined', 'text', 'danger'],
      description: 'Visual variant.',
      table: {
        category: 'props',
        type: { summary: "'primary' | 'secondary' | 'outlined' | 'text' | 'danger'" },
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
      description: 'Disables interaction and applies disabled tokens.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading state and disables activation.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the icon drawn beside the label.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    iconPosition: {
      control: 'select',
      options: ['leading', 'trailing'],
      description:
        'Which side of the label the icon sits on. A leading glyph names the action; a trailing one points at where it goes.',
      table: {
        category: 'props',
        type: { summary: "'leading' | 'trailing'" },
        defaultValue: { summary: "'leading'" }
      }
    },
    animated: {
      control: 'boolean',
      description:
        'Nudges a trailing icon along its axis on hover. Off by default; marketing CTAs opt in.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    href: {
      control: 'text',
      description: 'When set, renders as a link (`<a>`).',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    target: {
      control: 'select',
      options: ['_self', '_blank'],
      description: 'Link target when `href` is set.',
      table: {
        category: 'props',
        type: { summary: "'_blank' | '_self'" },
        defaultValue: { summary: "'_self'" }
      }
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description:
        'Native button type. `submit` lets the control submit its form; `disabled` and `loading` still block it. Ignored when `href` is set.',
      table: {
        category: 'props',
        type: { summary: "'button' | 'submit' | 'reset'" },
        defaultValue: { summary: "'button'" }
      }
    },
    onClick: {
      action: 'click',
      description: 'Emitted when the button is activated.',
      table: { category: 'events', type: { summary: 'MouseEvent' } }
    }
  },
  args: {
    label: 'Button',
    kind: 'primary',
    size: 'large',
    disabled: false,
    loading: false,
    icon: '',
    iconPosition: 'leading',
    animated: false,
    href: '',
    target: '_self',
    type: 'button'
  }
}

export default meta

const Template = (args) => ({
  components: { Button },
  setup() {
    return { args }
  },
  template: '<Button v-bind="args" />'
})

const DEFAULT_MARKUP = '<Button kind="primary" size="large" label="Button" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default primary button at large size.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Button kind="primary" label="Button" />
  <Button kind="secondary" label="Button" />
  <Button kind="outlined" label="Button" />
  <Button kind="text" label="Button" />
  <Button kind="danger" label="Button" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Types = {
  render: () => ({ components: { Button }, template: TYPES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All kind variants side by side.' },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Button size="small" label="Button" />
  <Button size="medium" label="Button" />
  <Button size="large" label="Button" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Sizes = {
  render: () => ({ components: { Button }, template: SIZES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All size variants side by side.' },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}

const ICON_TEMPLATE = `<div class="flex flex-col gap-4">
  <div class="flex flex-wrap items-center gap-4">
    <Button kind="primary" label="Button" icon="pi pi-arrow-right" />
    <Button kind="secondary" label="Button" icon="pi pi-arrow-right" />
    <Button kind="outlined" label="Button" icon="pi pi-arrow-right" />
    <Button kind="text" label="Button" icon="pi pi-arrow-right" />
    <Button kind="danger" label="Button" icon="pi pi-trash" />
  </div>
  <div class="flex flex-wrap items-center gap-4">
    <Button kind="primary" label="Read the guide" icon="pi pi-chevron-right" icon-position="trailing" />
    <Button kind="secondary" label="Read the guide" icon="pi pi-chevron-right" icon-position="trailing" />
    <Button kind="outlined" label="Read the guide" icon="pi pi-chevron-right" icon-position="trailing" />
    <Button kind="text" label="Read the guide" icon="pi pi-chevron-right" icon-position="trailing" />
  </div>
  <div class="flex flex-wrap items-center gap-4">
    <Button kind="primary" label="Read the guide" icon="pi pi-chevron-right" icon-position="trailing" animated />
    <Button kind="secondary" label="Read the guide" icon="pi pi-chevron-right" icon-position="trailing" animated />
    <Button kind="outlined" label="Read the guide" icon="pi pi-chevron-right" icon-position="trailing" animated />
    <Button kind="text" label="Read the guide" icon="pi pi-chevron-right" icon-position="trailing" animated />
  </div>
  <div class="flex flex-wrap items-center gap-4">
    <Button kind="outlined" size="medium" label="Deploy now" icon="pi pi-chevron-right" icon-position="trailing" animated #prefix>
      <i class="ai ai-azion text-(--primary)" aria-hidden="true" />
    </Button>
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Icon = {
  render: () => ({ components: { Button }, template: ICON_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Icon + label via the `icon` prop (PrimeIcons class) paired with `label`. `icon-position` picks the side: leading names the action, trailing points at where it goes. Add `animated` (third row) to nudge a trailing glyph along its axis on hover — off by default so product UI stays still; marketing CTAs opt in. The `prefix` slot (last row) draws a mark before the label that stays first when the icon trails, so a brand mark and a chevron can share one control. `label` is required — for icon-only controls use `IconButton`.'
      },
      source: { code: toSfc(IMPORT, ICON_TEMPLATE) }
    }
  }
}

const LOADING_MARKUP = '<Button label="Button" loading />'

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Loading = {
  args: { loading: true, label: 'Button' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Loading adopts the disabled visual treatment for clarity: a spinner replaces the icon and activation is blocked while the async action runs.'
      },
      source: { code: toSfc(IMPORT, LOADING_MARKUP) }
    }
  }
}

const DISABLED_MARKUP = '<Button label="Button" disabled />'

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Disabled = {
  args: { disabled: true, label: 'Button' },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Disabled state.' },
      source: { code: toSfc(IMPORT, DISABLED_MARKUP) }
    }
  }
}

const FORM_IMPORTS = [IMPORT, "import FieldText from '@aziontech/webkit/field-text'"]

const FORM_SUBMIT_TEMPLATE = `<form class="flex w-80 flex-col gap-4" novalidate @submit.prevent>
  <FieldText label="Workspace name" input-id="button-form-name" name="name" />
  <div class="flex gap-2">
    <Button type="reset" label="Clear" kind="outlined" size="medium" />
    <Button type="submit" label="Create" kind="primary" size="medium" />
  </div>
</form>`

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const FormSubmit = {
  render: () => ({ components: { Button, FieldText }, template: FORM_SUBMIT_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`type="submit"` makes the Button its form\'s submit control, so a click or Enter inside a field submits it; `type="reset"` clears the form. The default `type="button"` never submits.'
      },
      source: { code: toSfc(FORM_IMPORTS, FORM_SUBMIT_TEMPLATE) }
    }
  }
}
