import Dropdown, {
  DropdownGroup,
  DropdownOption,
  DropdownTrigger
} from '@aziontech/webkit/dropdown'
import Button from '@aziontech/webkit/button'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Tag from '@aziontech/webkit/tag'

const components = {
  Dropdown,
  DropdownTrigger,
  DropdownGroup,
  DropdownOption,
  Button,
  IconButton,
  InputText,
  Tag
}

/** @type {import('@storybook/vue3').Meta<typeof Dropdown>} */
const meta = {
  title: 'Components/Navigation/Dropdown',
  component: Dropdown,
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
          { id: 'focus-order-semantics', enabled: true },
          { id: 'aria-required-children', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Overlay menu that opens from a consumer-supplied trigger and renders a list of selectable options grouped into named sections. The root `Dropdown` owns open/closed state, positioning, focus return, and keyboard navigation; `Dropdown.Trigger` wires aria-haspopup/aria-expanded/aria-controls; `Dropdown.Group` groups options under an optional uppercase label; `Dropdown.Option` is the selectable row with leading/trailing/command affordances.'
      }
    }
  },
  argTypes: {
    open: {
      control: 'boolean',
      description:
        'Controlled open state. Use with `v-model:open` or `@update:open`. When omitted, the component is uncontrolled.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' }
      }
    },
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
      description: 'Where the panel opens relative to the trigger.',
      table: {
        category: 'props',
        type: { summary: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'" },
        defaultValue: { summary: "'bottom-start'" }
      }
    },
    offset: {
      control: { type: 'number', min: 0, max: 24, step: 1 },
      description: 'Pixel gap between the trigger and the panel.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '4' }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents the trigger from opening the panel and applies disabled tokens.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    default: { control: false, table: { category: 'slots' } },
    top: { control: false, table: { category: 'slots' } },
    bottom: { control: false, table: { category: 'slots' } },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Fires on every open/closed transition; supports `v-model:open`.',
      table: { category: 'events', type: { summary: 'boolean' } }
    },
    onSelect: {
      action: 'select',
      description: 'Fires when an enabled option is activated. The panel closes automatically.',
      table: {
        category: 'events',
        type: { summary: '{ value: string | number; event: MouseEvent | KeyboardEvent }' }
      }
    }
  },
  args: {
    placement: 'bottom-start',
    offset: 4,
    disabled: false
  }
}

export default meta

const Template = (args) => ({
  components,
  setup() {
    return { args }
  },
  template: `
    <Dropdown v-bind="args">
      <DropdownTrigger>
        <Button kind="outlined" label="Open menu" />
      </DropdownTrigger>
      <DropdownGroup>
        <DropdownOption value="profile" label="Profile" />
        <DropdownOption value="settings" label="Settings" />
        <DropdownOption value="billing" label="Billing" />
        <DropdownOption value="invite" label="Invite members" />
        <DropdownOption value="logs" label="Audit log" />
        <DropdownOption value="signout" label="Sign out" />
      </DropdownGroup>
    </Dropdown>
  `
})

/** @type {import('@storybook/vue3').StoryObj<typeof Dropdown>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Default dropdown with a single unlabeled group of six options and no leading/trailing affordances.'
      },
      source: {
        code: `<script setup>
import Dropdown, { DropdownGroup, DropdownOption, DropdownTrigger } from '@aziontech/webkit/dropdown'
import Button from '@aziontech/webkit/button'
</script>

<template>
  <Dropdown>
    <DropdownTrigger>
      <Button kind="outlined" label="Open menu" />
    </DropdownTrigger>
    <DropdownGroup>
      <DropdownOption value="profile" label="Profile" />
      <DropdownOption value="settings" label="Settings" />
      <DropdownOption value="billing" label="Billing" />
      <DropdownOption value="invite" label="Invite members" />
      <DropdownOption value="logs" label="Audit log" />
      <DropdownOption value="signout" label="Sign out" />
    </DropdownGroup>
  </Dropdown>
</template>`
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Dropdown>} */
export const Groups = {
  render: (args) => ({
    components,
    setup() {
      return { args }
    },
    template: `
      <Dropdown v-bind="args">
        <DropdownTrigger>
          <Button kind="outlined" label="Open menu" />
        </DropdownTrigger>
        <DropdownGroup label="Account">
          <DropdownOption value="profile" label="Profile" command="⌘P" />
          <DropdownOption value="settings" label="Settings" />
        </DropdownGroup>
        <DropdownGroup label="Workspace">
          <DropdownOption value="invite" label="Invite members" />
          <DropdownOption value="logs" label="Audit log" selected />
        </DropdownGroup>
      </Dropdown>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Two labeled groups (`Account`, `Workspace`) separated by an automatic top divider on the second group. One option carries a `command` hint, another is `selected` — the central anatomy of this component.'
      },
      source: {
        code: `<script setup>
import Dropdown, { DropdownGroup, DropdownOption, DropdownTrigger } from '@aziontech/webkit/dropdown'
import Button from '@aziontech/webkit/button'
</script>

<template>
  <Dropdown>
    <DropdownTrigger>
      <Button kind="outlined" label="Open menu" />
    </DropdownTrigger>
    <DropdownGroup label="Account">
      <DropdownOption value="profile" label="Profile" command="⌘P" />
      <DropdownOption value="settings" label="Settings" />
    </DropdownGroup>
    <DropdownGroup label="Workspace">
      <DropdownOption value="invite" label="Invite members" />
      <DropdownOption value="logs" label="Audit log" selected />
    </DropdownGroup>
  </Dropdown>
</template>`
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Dropdown>} */
export const States = {
  render: (args) => ({
    components,
    setup() {
      return { args }
    },
    template: `
      <Dropdown v-bind="args" :open="true">
        <DropdownTrigger>
          <Button kind="outlined" label="Open menu" />
        </DropdownTrigger>
        <DropdownGroup label="Option states">
          <DropdownOption value="default" label="Default" />
          <DropdownOption value="selected" label="Selected" selected />
          <DropdownOption value="disabled" label="Disabled" disabled />
        </DropdownGroup>
      </Dropdown>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Panel forced open (`open="true"`) showing each spec-declared option state side-by-side: `default`, `selected`, and `disabled`. The `hover` and `focus-visible` states are interactive — focus an option with the keyboard (`Down` / `Up`) or hover with the pointer to see them.'
      },
      source: {
        code: `<script setup>
import Dropdown, { DropdownGroup, DropdownOption, DropdownTrigger } from '@aziontech/webkit/dropdown'
import Button from '@aziontech/webkit/button'
</script>

<template>
  <Dropdown :open="true">
    <DropdownTrigger>
      <Button kind="outlined" label="Open menu" />
    </DropdownTrigger>
    <DropdownGroup label="Option states">
      <DropdownOption value="default" label="Default" />
      <DropdownOption value="selected" label="Selected" selected />
      <DropdownOption value="disabled" label="Disabled" disabled />
    </DropdownGroup>
  </Dropdown>
</template>`
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Dropdown>} */
export const Disabled = {
  args: { disabled: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Root `disabled` — the trigger refuses to open the panel and applies disabled tokens.'
      },
      source: {
        code: `<script setup>
import Dropdown, { DropdownGroup, DropdownOption, DropdownTrigger } from '@aziontech/webkit/dropdown'
import Button from '@aziontech/webkit/button'
</script>

<template>
  <Dropdown disabled>
    <DropdownTrigger>
      <Button kind="outlined" label="Open menu" />
    </DropdownTrigger>
    <DropdownGroup>
      <DropdownOption value="profile" label="Profile" />
      <DropdownOption value="settings" label="Settings" />
      <DropdownOption value="billing" label="Billing" />
      <DropdownOption value="invite" label="Invite members" />
      <DropdownOption value="logs" label="Audit log" />
      <DropdownOption value="signout" label="Sign out" />
    </DropdownGroup>
  </Dropdown>
</template>`
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Dropdown>} */
export const Placements = {
  render: () => ({
    components,
    template: `
      <div class="grid grid-cols-2 gap-[var(--spacing-xl)] place-items-center min-h-[24rem]">
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <Button kind="outlined" label="bottom-start" />
          </DropdownTrigger>
          <DropdownGroup>
            <DropdownOption value="a" label="Option A" />
            <DropdownOption value="b" label="Option B" />
          </DropdownGroup>
        </Dropdown>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button kind="outlined" label="bottom-end" />
          </DropdownTrigger>
          <DropdownGroup>
            <DropdownOption value="a" label="Option A" />
            <DropdownOption value="b" label="Option B" />
          </DropdownGroup>
        </Dropdown>

        <Dropdown placement="top-start">
          <DropdownTrigger>
            <Button kind="outlined" label="top-start" />
          </DropdownTrigger>
          <DropdownGroup>
            <DropdownOption value="a" label="Option A" />
            <DropdownOption value="b" label="Option B" />
          </DropdownGroup>
        </Dropdown>

        <Dropdown placement="top-end">
          <DropdownTrigger>
            <Button kind="outlined" label="top-end" />
          </DropdownTrigger>
          <DropdownGroup>
            <DropdownOption value="a" label="Option A" />
            <DropdownOption value="b" label="Option B" />
          </DropdownGroup>
        </Dropdown>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          "All four `placement` values side-by-side. Click each trigger to see how the panel anchors against it. Panels are teleported to `body` and positioned with `position: fixed` against the trigger's bounding rect — no `@floating-ui` runtime."
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Dropdown>} */
export const OptionAffordances = {
  render: () => ({
    components,
    template: `
      <Dropdown :open="true">
        <DropdownTrigger>
          <Button kind="outlined" label="Open menu" />
        </DropdownTrigger>
        <DropdownGroup label="Affordances">
          <DropdownOption value="plain" label="Plain label" />
          <DropdownOption value="command" label="With command hint" command="⌘P" />
          <DropdownOption value="leading">
            <template #leading>
              <i class="pi pi-user" aria-hidden="true" />
            </template>
            Leading icon
          </DropdownOption>
          <DropdownOption value="trailing" label="Trailing slot">
            <template #trailing>
              <Tag label="New" />
            </template>
          </DropdownOption>
          <DropdownOption value="selected" label="Selected" selected />
          <DropdownOption value="disabled" label="Disabled" disabled />
        </DropdownGroup>
      </Dropdown>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Panel forced open showing every `<DropdownOption>` affordance: plain label, `command` keyboard hint, `#leading` icon slot, `#trailing` content slot (with a `<Tag>`), `selected` state, and `disabled` state. The `command` prop and the `#trailing` slot are mutually exclusive — pick one per option.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Dropdown>} */
export const WithTopAndBottomSlots = {
  render: () => ({
    components,
    template: `
      <Dropdown :open="true">
        <DropdownTrigger>
          <Button kind="outlined" label="Open menu" />
        </DropdownTrigger>

        <template #top>
          <div class="p-[var(--spacing-xxs)]">
            <InputText placeholder="Search options…" size="small" />
          </div>
        </template>

        <DropdownGroup label="Suggestions">
          <DropdownOption value="profile" label="Profile" />
          <DropdownOption value="settings" label="Settings" />
          <DropdownOption value="billing" label="Billing" />
        </DropdownGroup>

        <template #bottom>
          <div class="flex justify-end p-[var(--spacing-xxs)]">
            <Button kind="text" size="small" label="View all" />
          </div>
        </template>
      </Dropdown>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Root `top` and `bottom` named slots in use — typically a search input at the top and a footer action at the bottom. Both regions stick to their edges and stay outside the scrollable group list.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Dropdown>} */
export const CustomTriggers = {
  render: () => ({
    components,
    template: `
      <div class="flex flex-wrap gap-[var(--spacing-lg)] items-center">
        <Dropdown>
          <DropdownTrigger>
            <Button kind="primary" label="Primary button" />
          </DropdownTrigger>
          <DropdownGroup>
            <DropdownOption value="a" label="Option A" />
            <DropdownOption value="b" label="Option B" />
          </DropdownGroup>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <IconButton icon="pi pi-ellipsis-h" aria-label="More actions" />
          </DropdownTrigger>
          <DropdownGroup>
            <DropdownOption value="edit" label="Edit" />
            <DropdownOption value="duplicate" label="Duplicate" />
            <DropdownOption value="delete" label="Delete" />
          </DropdownGroup>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <span class="cursor-pointer text-label-md underline-offset-2 hover:underline text-[var(--text-default)]">
              Plain text trigger
            </span>
          </DropdownTrigger>
          <DropdownGroup>
            <DropdownOption value="a" label="Option A" />
            <DropdownOption value="b" label="Option B" />
          </DropdownGroup>
        </Dropdown>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          '`<DropdownTrigger>` is abstract — it wires `aria-haspopup`/`aria-expanded`/`aria-controls` and the open/close click onto whatever element you put inside its default slot. Here it wraps a primary `Button`, an `IconButton`, and a plain `<span>`.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Dropdown>} */
export const Playground = {
  render: (args) => ({
    components,
    setup() {
      const { onUpdateOpen, onSelect, ...props } = args
      return { props, onUpdateOpen, onSelect }
    },
    template: `
      <Dropdown v-bind="props" @update:open="onUpdateOpen" @select="onSelect">
        <DropdownTrigger>
          <Button kind="outlined" label="Open menu" />
        </DropdownTrigger>
        <DropdownGroup label="Playground">
          <DropdownOption value="plain" label="Plain option" />
          <DropdownOption value="command" label="With command" command="⌘K" />
          <DropdownOption value="selected" label="Selected" selected />
          <DropdownOption value="disabled" label="Disabled" disabled />
        </DropdownGroup>
      </Dropdown>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Controls-driven story: toggle `open`, `placement`, `offset`, and `disabled` from the Storybook Controls panel to exercise every root arg without leaving the page.'
      }
    }
  }
}
