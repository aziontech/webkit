import Avatar from '@aziontech/webkit/avatar'
import Button from '@aziontech/webkit/button'
import DropdownMenu, {
  DropdownMenuGroup,
  DropdownMenuOption,
  DropdownMenuTrigger
} from '@aziontech/webkit/dropdown-menu'
import IconButton from '@aziontech/webkit/icon-button'
import Input from '@aziontech/webkit/input'
import Tag from '@aziontech/webkit/tag'

import { toSfc } from '../../../_shared/story-source'

const components = {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuOption,
  Avatar,
  Button,
  IconButton,
  Input,
  Tag
}

const DROPDOWN_IMPORT =
  "import DropdownMenu, { DropdownMenuGroup, DropdownMenuOption, DropdownMenuTrigger } from '@aziontech/webkit/dropdown-menu'"
const AVATAR_IMPORT = "import Avatar from '@aziontech/webkit/avatar'"
const BUTTON_IMPORT = "import Button from '@aziontech/webkit/button'"
const ICON_BUTTON_IMPORT = "import IconButton from '@aziontech/webkit/icon-button'"
const INPUT_TEXT_IMPORT = "import Input from '@aziontech/webkit/input'"
const TAG_IMPORT = "import Tag from '@aziontech/webkit/tag'"

/** @type {import('@storybook/vue3').Meta<typeof DropdownMenu>} */
const meta = {
  title: 'Components/Primitives/Navigation/DropdownMenu',
  component: DropdownMenu,
  subcomponents: { DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuOption },
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
          'Overlay menu that opens from a consumer-supplied trigger and renders a list of selectable options grouped into named sections. `DropdownMenu.Trigger` wires the ARIA attributes, `DropdownMenu.Group` groups options under an optional uppercase label, and `DropdownMenu.Option` is the selectable row with left/right/command affordances.'
      },
      canvas: { sourceState: 'shown' }
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
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end', 'auto'],
      description:
        "Where the panel opens relative to the trigger. `'auto'` picks the best-fitting corner at open time.",
      table: {
        category: 'props',
        type: { summary: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'auto'" },
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
    default: {
      control: false,
      description: 'Place the trigger followed by one or more groups.',
      table: { category: 'slots', type: { summary: 'DropdownMenu.Trigger + DropdownMenu.Group[]' } }
    },
    top: {
      control: false,
      description: 'Sticky region rendered above the scrollable group list (e.g. a search input).',
      table: { category: 'slots', type: { summary: 'VNode' } }
    },
    bottom: {
      control: false,
      description: 'Sticky region rendered below the scrollable group list (e.g. a footer action).',
      table: { category: 'slots', type: { summary: 'VNode' } }
    },
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
        type: { summary: '(event: MouseEvent | KeyboardEvent, value: string | number)' }
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
    <DropdownMenu v-bind="args">
      <DropdownMenuTrigger>
        <IconButton kind="outlined" icon="pi pi-plus" aria-label="Open menu" />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuOption value="profile" label="Profile" />
        <DropdownMenuOption value="settings" label="Settings" />
        <DropdownMenuOption value="billing" label="Billing" />
        <DropdownMenuOption value="invite" label="Invite members" />
        <DropdownMenuOption value="logs" label="Audit log" />
        <DropdownMenuOption value="signout" label="Sign out" />
      </DropdownMenuGroup>
    </DropdownMenu>
  `
})

const DEFAULT_MARKUP = `<DropdownMenu>
  <DropdownMenuTrigger>
    <IconButton kind="outlined" icon="pi pi-plus" aria-label="Open menu" />
  </DropdownMenuTrigger>
  <DropdownMenuGroup>
    <DropdownMenuOption value="profile" label="Profile" />
    <DropdownMenuOption value="settings" label="Settings" />
    <DropdownMenuOption value="billing" label="Billing" />
    <DropdownMenuOption value="invite" label="Invite members" />
    <DropdownMenuOption value="logs" label="Audit log" />
    <DropdownMenuOption value="signout" label="Sign out" />
  </DropdownMenuGroup>
</DropdownMenu>`

/** @type {import('@storybook/vue3').StoryObj<typeof DropdownMenu>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Default dropdown with a single unlabeled group of six options and no left/right affordances. Click the trigger to open; controls drive placement, offset, and disabled.'
      },
      source: { code: toSfc([DROPDOWN_IMPORT, ICON_BUTTON_IMPORT], DEFAULT_MARKUP) }
    }
  }
}

const GROUPS_TEMPLATE = `<DropdownMenu>
  <DropdownMenuTrigger>
    <IconButton kind="outlined" icon="pi pi-plus" aria-label="Open menu" />
  </DropdownMenuTrigger>
  <DropdownMenuGroup label="Account">
    <DropdownMenuOption value="profile" label="Profile" command="⌘P" />
    <DropdownMenuOption value="settings" label="Settings" />
  </DropdownMenuGroup>
  <DropdownMenuGroup label="Workspace">
    <DropdownMenuOption value="invite" label="Invite members" />
    <DropdownMenuOption value="logs" label="Audit log" selected />
  </DropdownMenuGroup>
</DropdownMenu>`

/** @type {import('@storybook/vue3').StoryObj<typeof DropdownMenu>} */
export const Groups = {
  render: () => ({ components, template: GROUPS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Two labeled groups (`Account`, `Workspace`) separated by an automatic top divider on the second group. One option carries a `command` hint, another is `selected` — the central anatomy of this component.'
      },
      source: { code: toSfc([DROPDOWN_IMPORT, ICON_BUTTON_IMPORT], GROUPS_TEMPLATE) }
    }
  }
}

const STATES_TEMPLATE = `<DropdownMenu :open="true">
  <DropdownMenuTrigger>
    <IconButton kind="outlined" icon="pi pi-plus" aria-label="Open menu" />
  </DropdownMenuTrigger>
  <DropdownMenuGroup label="Option states">
    <DropdownMenuOption value="default" label="Default" />
    <DropdownMenuOption value="selected" label="Selected" selected />
    <DropdownMenuOption value="disabled" label="Disabled" disabled />
  </DropdownMenuGroup>
</DropdownMenu>`

/** @type {import('@storybook/vue3').StoryObj<typeof DropdownMenu>} */
export const States = {
  render: () => ({ components, template: STATES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      story: { inline: false, iframeHeight: '320px' },
      description: {
        story:
          'Panel forced open (`open="true"`) showing each spec-declared option state side-by-side: `default`, `selected`, and `disabled`. The `hover` and `focus-visible` states are interactive — focus an option with the keyboard (`Down` / `Up`) or hover with the pointer to see them.'
      },
      source: { code: toSfc([DROPDOWN_IMPORT, ICON_BUTTON_IMPORT], STATES_TEMPLATE) }
    }
  }
}

const PLACEMENTS_TEMPLATE = `<div class="grid grid-cols-2 gap-(--spacing-xl) place-items-center min-h-[24rem]">
  <DropdownMenu placement="bottom-start">
    <DropdownMenuTrigger>
      <Button kind="outlined" label="bottom-start" />
    </DropdownMenuTrigger>
    <DropdownMenuGroup>
      <DropdownMenuOption value="a" label="Option A" />
      <DropdownMenuOption value="b" label="Option B" />
    </DropdownMenuGroup>
  </DropdownMenu>

  <DropdownMenu placement="bottom-end">
    <DropdownMenuTrigger>
      <Button kind="outlined" label="bottom-end" />
    </DropdownMenuTrigger>
    <DropdownMenuGroup>
      <DropdownMenuOption value="a" label="Option A" />
      <DropdownMenuOption value="b" label="Option B" />
    </DropdownMenuGroup>
  </DropdownMenu>

  <DropdownMenu placement="top-start">
    <DropdownMenuTrigger>
      <Button kind="outlined" label="top-start" />
    </DropdownMenuTrigger>
    <DropdownMenuGroup>
      <DropdownMenuOption value="a" label="Option A" />
      <DropdownMenuOption value="b" label="Option B" />
    </DropdownMenuGroup>
  </DropdownMenu>

  <DropdownMenu placement="top-end">
    <DropdownMenuTrigger>
      <Button kind="outlined" label="top-end" />
    </DropdownMenuTrigger>
    <DropdownMenuGroup>
      <DropdownMenuOption value="a" label="Option A" />
      <DropdownMenuOption value="b" label="Option B" />
    </DropdownMenuGroup>
  </DropdownMenu>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof DropdownMenu>} */
export const Placements = {
  render: () => ({ components, template: PLACEMENTS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          "All four explicit `placement` values side-by-side. Click each trigger to see how the panel anchors against it. Panels are teleported to `body` and positioned with `position: fixed` against the trigger's bounding rect — no external positioning runtime."
      },
      source: { code: toSfc([DROPDOWN_IMPORT, BUTTON_IMPORT], PLACEMENTS_TEMPLATE) }
    }
  }
}

const AUTO_PLACEMENT_TEMPLATE = `<div class="relative h-[28rem] w-full border border-dashed border-(--border-muted)">
  <p class="absolute top-(--spacing-md) left-1/2 -translate-x-1/2 text-body-sm text-(--text-muted) text-center max-w-md">
    All four triggers use <code>placement="auto"</code>.<br />
    Each panel resolves to the best-fitting corner based on its position in the viewport.
  </p>

  <div class="absolute top-(--spacing-md) left-(--spacing-md)">
    <DropdownMenu placement="auto">
      <DropdownMenuTrigger>
        <Button kind="outlined" label="top-left trigger" />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuOption value="a" label="Option A" />
        <DropdownMenuOption value="b" label="Option B" />
      </DropdownMenuGroup>
    </DropdownMenu>
  </div>

  <div class="absolute top-(--spacing-md) right-(--spacing-md)">
    <DropdownMenu placement="auto">
      <DropdownMenuTrigger>
        <Button kind="outlined" label="top-right trigger" />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuOption value="a" label="Option A" />
        <DropdownMenuOption value="b" label="Option B" />
      </DropdownMenuGroup>
    </DropdownMenu>
  </div>

  <div class="absolute bottom-(--spacing-md) left-(--spacing-md)">
    <DropdownMenu placement="auto">
      <DropdownMenuTrigger>
        <Button kind="outlined" label="bottom-left trigger" />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuOption value="a" label="Option A" />
        <DropdownMenuOption value="b" label="Option B" />
      </DropdownMenuGroup>
    </DropdownMenu>
  </div>

  <div class="absolute bottom-(--spacing-md) right-(--spacing-md)">
    <DropdownMenu placement="auto">
      <DropdownMenuTrigger>
        <Button kind="outlined" label="bottom-right trigger" />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuOption value="a" label="Option A" />
        <DropdownMenuOption value="b" label="Option B" />
      </DropdownMenuGroup>
    </DropdownMenu>
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof DropdownMenu>} */
export const AutoPlacement = {
  render: () => ({ components, template: AUTO_PLACEMENT_TEMPLATE }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      controls: { disable: true },
      description: {
        story:
          '`placement="auto"` lets the dropdown choose the best-fitting corner at open time. The four triggers below all use the same prop value — each resolves to a different placement based on the available space around them. The resolved value is reflected in `data-placement` on the open panel.'
      },
      source: { code: toSfc([DROPDOWN_IMPORT, BUTTON_IMPORT], AUTO_PLACEMENT_TEMPLATE) }
    }
  }
}

const OPTION_AFFORDANCES_TEMPLATE = `<DropdownMenu :open="true">
  <DropdownMenuTrigger>
    <IconButton kind="outlined" icon="pi pi-plus" aria-label="Open menu" />
  </DropdownMenuTrigger>
  <DropdownMenuGroup label="Affordances">
    <DropdownMenuOption value="plain" label="Plain label" />
    <DropdownMenuOption value="command" label="With command hint" command="⌘P" />
    <DropdownMenuOption value="left">
      <template #left>
        <i class="pi pi-user" aria-hidden="true" />
      </template>
      Left icon
    </DropdownMenuOption>
    <DropdownMenuOption value="right" label="Right slot">
      <template #right>
        <Tag label="New" />
      </template>
    </DropdownMenuOption>
    <DropdownMenuOption value="selected" label="Selected" selected />
    <DropdownMenuOption value="disabled" label="Disabled" disabled />
  </DropdownMenuGroup>
</DropdownMenu>`

/** @type {import('@storybook/vue3').StoryObj<typeof DropdownMenu>} */
export const OptionAffordances = {
  render: () => ({ components, template: OPTION_AFFORDANCES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      story: { inline: false, iframeHeight: '360px' },
      description: {
        story:
          'Panel forced open showing every option affordance: plain label, `command` keyboard hint, `left` icon slot, `right` content slot (with a `Tag`), `selected` state, and `disabled` state. The `command` prop and the `right` slot are mutually exclusive — pick one per option.'
      },
      source: {
        code: toSfc([DROPDOWN_IMPORT, ICON_BUTTON_IMPORT, TAG_IMPORT], OPTION_AFFORDANCES_TEMPLATE)
      }
    }
  }
}

const WITH_TOP_AND_BOTTOM_SLOTS_TEMPLATE = `<DropdownMenu :open="true">
  <DropdownMenuTrigger>
    <IconButton kind="outlined" icon="pi pi-plus" aria-label="Open menu" />
  </DropdownMenuTrigger>

  <template #top>
    <div class="p-(--spacing-xxs)">
      <Input placeholder="Search options…" size="small" />
    </div>
  </template>

  <DropdownMenuGroup label="Suggestions">
    <DropdownMenuOption value="profile" label="Profile" />
    <DropdownMenuOption value="settings" label="Settings" />
    <DropdownMenuOption value="billing" label="Billing" />
  </DropdownMenuGroup>

  <template #bottom>
    <div class="flex justify-end p-(--spacing-xxs)">
      <Button kind="transparent" size="small" label="View all" />
    </div>
  </template>
</DropdownMenu>`

/** @type {import('@storybook/vue3').StoryObj<typeof DropdownMenu>} */
export const WithTopAndBottomSlots = {
  render: () => ({ components, template: WITH_TOP_AND_BOTTOM_SLOTS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      story: { inline: false, iframeHeight: '360px' },
      description: {
        story:
          'Root `top` and `bottom` named slots in use — typically a search input at the top and a footer action at the bottom. Both regions stick to their edges and stay outside the scrollable group list.'
      },
      source: {
        code: toSfc(
          [DROPDOWN_IMPORT, BUTTON_IMPORT, ICON_BUTTON_IMPORT, INPUT_TEXT_IMPORT],
          WITH_TOP_AND_BOTTOM_SLOTS_TEMPLATE
        )
      }
    }
  }
}

const GROUPS_WITH_TOP_AND_BOTTOM_SLOTS_TEMPLATE = `<DropdownMenu :open="true">
  <DropdownMenuTrigger>
    <IconButton kind="outlined" icon="pi pi-plus" aria-label="Open menu" />
  </DropdownMenuTrigger>

  <DropdownMenuGroup label="Account">
    <template #top>
      <span class="text-label-sm text-(--text-muted)">Signed in as jordan.silva@example.com</span>
    </template>

    <DropdownMenuOption value="profile" label="Profile" command="⌘P" />
    <DropdownMenuOption value="settings" label="Settings" />

    <template #bottom>
      <Button kind="transparent" size="small" label="Manage account" class="w-full" />
    </template>
  </DropdownMenuGroup>

  <DropdownMenuGroup label="Workspace">
    <template #top>
      <span class="text-label-sm text-(--text-muted)">Azion · 12 members</span>
    </template>

    <DropdownMenuOption value="invite" label="Invite members" />
    <DropdownMenuOption value="logs" label="Audit log" />

    <template #bottom>
      <Button kind="transparent" size="small" label="Workspace settings" class="w-full" />
    </template>
  </DropdownMenuGroup>
</DropdownMenu>`

/** @type {import('@storybook/vue3').StoryObj<typeof DropdownMenu>} */
export const GroupsWithTopAndBottomSlots = {
  render: () => ({ components, template: GROUPS_WITH_TOP_AND_BOTTOM_SLOTS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      story: { inline: false, iframeHeight: '420px' },
      description: {
        story:
          'Two groups each using the `top` and `bottom` slots — a per-section caption above the options and a footer action below. Different from the root `top`/`bottom` (which are sticky outside the scroll area), group-level slots render inline within the section.'
      },
      source: {
        code: toSfc(
          [DROPDOWN_IMPORT, BUTTON_IMPORT, ICON_BUTTON_IMPORT],
          GROUPS_WITH_TOP_AND_BOTTOM_SLOTS_TEMPLATE
        )
      }
    }
  }
}

const CUSTOM_TRIGGERS_TEMPLATE = `<div class="flex flex-wrap gap-(--spacing-lg) items-center">
  <DropdownMenu>
    <DropdownMenuTrigger>
      <IconButton icon="pi pi-ellipsis-h" aria-label="More actions" />
    </DropdownMenuTrigger>
    <DropdownMenuGroup>
      <DropdownMenuOption value="edit" label="Edit" />
      <DropdownMenuOption value="duplicate" label="Duplicate" />
      <DropdownMenuOption value="delete" label="Delete" />
    </DropdownMenuGroup>
  </DropdownMenu>

  <DropdownMenu>
    <DropdownMenuTrigger>
      <Avatar label="IB" aria-label="Account menu" class="cursor-pointer" />
    </DropdownMenuTrigger>
    <DropdownMenuGroup label="Account">
      <DropdownMenuOption value="profile" label="Profile" />
      <DropdownMenuOption value="settings" label="Settings" />
      <DropdownMenuOption value="signout" label="Sign out" />
    </DropdownMenuGroup>
  </DropdownMenu>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof DropdownMenu>} */
export const CustomTriggers = {
  render: () => ({ components, template: CUSTOM_TRIGGERS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      story: { inline: false, iframeHeight: '320px' },
      description: {
        story:
          '`DropdownMenu.Trigger` is abstract — it wires `aria-haspopup`/`aria-expanded`/`aria-controls` and the open/close click onto whatever element you put inside its default slot. Here it wraps an `IconButton` (row actions) and an `Avatar` (account menu).'
      },
      source: {
        code: toSfc([DROPDOWN_IMPORT, AVATAR_IMPORT, ICON_BUTTON_IMPORT], CUSTOM_TRIGGERS_TEMPLATE)
      }
    }
  }
}
