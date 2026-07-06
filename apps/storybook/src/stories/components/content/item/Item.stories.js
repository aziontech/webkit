import Avatar from '@aziontech/webkit/avatar'
import Button from '@aziontech/webkit/button'
import Item from '@aziontech/webkit/item'

import { toSfc } from '../../../_shared/story-source'

const ITEM_IMPORT = "import Item from '@aziontech/webkit/item'"
const GROUP_IMPORT = "import ItemGroup from '@aziontech/webkit/item-group'"
const SEPARATOR_IMPORT = "import ItemSeparator from '@aziontech/webkit/item-separator'"
const MEDIA_IMPORT = "import ItemMedia from '@aziontech/webkit/item-media'"
const CONTENT_IMPORT = "import ItemContent from '@aziontech/webkit/item-content'"
const TITLE_IMPORT = "import ItemTitle from '@aziontech/webkit/item-title'"
const DESCRIPTION_IMPORT = "import ItemDescription from '@aziontech/webkit/item-description'"
const ACTIONS_IMPORT = "import ItemActions from '@aziontech/webkit/item-actions'"
const AVATAR_IMPORT = "import Avatar from '@aziontech/webkit/avatar'"
const BUTTON_IMPORT = "import Button from '@aziontech/webkit/button'"

const ROW_IMPORTS = [
  ITEM_IMPORT,
  CONTENT_IMPORT,
  TITLE_IMPORT,
  DESCRIPTION_IMPORT,
  ACTIONS_IMPORT,
  BUTTON_IMPORT
]

const itemSubcomponents = {
  Item,
  ItemGroup: Item.Group,
  ItemSeparator: Item.Separator,
  ItemMedia: Item.Media,
  ItemContent: Item.Content,
  ItemTitle: Item.Title,
  ItemDescription: Item.Description,
  ItemActions: Item.Actions,
  Button,
  Avatar
}

/** @type {import('@storybook/vue3').Meta<typeof Item>} */
const meta = {
  title: 'Components/Content/Item',
  component: Item,
  subcomponents: {
    ItemGroup: Item.Group,
    ItemSeparator: Item.Separator,
    ItemMedia: Item.Media,
    ItemContent: Item.Content,
    ItemTitle: Item.Title,
    ItemDescription: Item.Description,
    ItemActions: Item.Actions,
    ItemHeader: Item.Header,
    ItemFooter: Item.Footer
  },
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
          'Versatile flex row for title, description, media, and actions. Compose sub-components to reorder or omit regions; use ItemGroup for lists.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['default', 'outline', 'muted'],
      description: 'Item root surface variant.',
      table: {
        type: { summary: "'default' | 'outline' | 'muted'" },
        defaultValue: { summary: "'default'" },
        category: 'props'
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Item root density (padding and gap).',
      table: {
        type: { summary: "'small' | 'medium'" },
        defaultValue: { summary: "'medium'" },
        category: 'props'
      }
    },
    asChild: {
      control: 'boolean',
      description:
        'Merge row layout onto the single default-slot child (e.g. anchor). Focus and hover stay on slotted controls.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'props'
      }
    },
    mediaKind: {
      control: false,
      description:
        'ItemMedia region variant (icon frame, image frame). Prop of the ItemMedia sub-component — set it per region as media-kind.',
      table: {
        type: { summary: "'default' | 'icon' | 'image'" },
        defaultValue: { summary: "'default'" },
        category: 'props'
      }
    },
    default: {
      control: false,
      description: 'Every sub-component exposes default for its region.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  },
  args: {
    kind: 'default',
    size: 'medium',
    asChild: false
  }
}

export default meta

const Template = (args) => ({
  components: itemSubcomponents,
  setup() {
    return { args }
  },
  template: `
    <div class="flex w-full max-w-md flex-col gap-[var(--spacing-4)]">
      <Item v-bind="args">
        <ItemContent>
          <ItemTitle>Basic Item</ItemTitle>
          <ItemDescription>A simple item with title and description.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button label="Action" kind="outlined" size="small" />
        </ItemActions>
      </Item>
    </div>
  `
})

const DEFAULT_TEMPLATE = `<div class="flex w-full max-w-md flex-col gap-[var(--spacing-4)]">
  <Item>
    <ItemContent>
      <ItemTitle>Basic Item</ItemTitle>
      <ItemDescription>A simple item with title and description.</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button label="Action" kind="outlined" size="small" />
    </ItemActions>
  </Item>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default surface with title, description, and a trailing action.' },
      source: { code: toSfc(ROW_IMPORTS, DEFAULT_TEMPLATE) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex w-full max-w-md flex-col gap-[var(--spacing-4)]">
  <Item kind="default">
    <ItemContent>
      <ItemTitle>Default</ItemTitle>
      <ItemDescription>Default surface for plain rows.</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button label="Action" kind="outlined" size="small" />
    </ItemActions>
  </Item>
  <Item kind="outline">
    <ItemContent>
      <ItemTitle>Outline</ItemTitle>
      <ItemDescription>Outlined variant with a visible border.</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button label="Action" kind="outlined" size="small" />
    </ItemActions>
  </Item>
  <Item kind="muted">
    <ItemContent>
      <ItemTitle>Muted</ItemTitle>
      <ItemDescription>Muted variant for secondary list rows.</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button label="Action" kind="outlined" size="small" />
    </ItemActions>
  </Item>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const Types = {
  render: () => ({ components: itemSubcomponents, template: TYPES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All kind variants side by side: default, outline, and muted.' },
      source: { code: toSfc(ROW_IMPORTS, TYPES_TEMPLATE) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex w-full max-w-md flex-col gap-[var(--spacing-4)]">
  <Item kind="outline" size="small">
    <ItemContent>
      <ItemTitle>Small</ItemTitle>
      <ItemDescription>Compact density with reduced padding and gap.</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button label="Action" kind="outlined" size="small" />
    </ItemActions>
  </Item>
  <Item kind="outline" size="medium">
    <ItemContent>
      <ItemTitle>Medium</ItemTitle>
      <ItemDescription>Default density for standalone rows.</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button label="Action" kind="outlined" size="small" />
    </ItemActions>
  </Item>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const Sizes = {
  render: () => ({ components: itemSubcomponents, template: SIZES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Both density options side by side.' },
      source: { code: toSfc(ROW_IMPORTS, SIZES_TEMPLATE) }
    }
  }
}

const WITH_ICON_MEDIA_TEMPLATE = `<div class="flex w-full max-w-lg flex-col gap-[var(--spacing-4)]">
  <Item kind="outline">
    <ItemMedia media-kind="icon">
      <i class="ai ai-edge-firewall text-[length:inherit] leading-none" aria-hidden="true" />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Security Alert</ItemTitle>
      <ItemDescription>New login detected from unknown device.</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button label="Review" kind="outlined" size="small" />
    </ItemActions>
  </Item>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithIconMedia = {
  render: () => ({ components: itemSubcomponents, template: WITH_ICON_MEDIA_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'ItemMedia with mediaKind icon frames a leading icon before title and description.'
      },
      source: {
        code: toSfc(
          [
            ITEM_IMPORT,
            MEDIA_IMPORT,
            CONTENT_IMPORT,
            TITLE_IMPORT,
            DESCRIPTION_IMPORT,
            ACTIONS_IMPORT,
            BUTTON_IMPORT
          ],
          WITH_ICON_MEDIA_TEMPLATE
        )
      }
    }
  }
}

const WITH_AVATAR_TEMPLATE = `<div class="flex w-full max-w-lg flex-col gap-[var(--spacing-4)]">
  <Item kind="outline">
    <ItemMedia>
      <Avatar
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face"
        alt="Evil Rabbit"
        label="ER"
        size="medium"
      />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Evil Rabbit</ItemTitle>
      <ItemDescription>Last seen 5 months ago</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button label="Invite" kind="outlined" size="small" icon="pi pi-plus" />
    </ItemActions>
  </Item>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithAvatar = {
  render: () => ({ components: itemSubcomponents, template: WITH_AVATAR_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Default ItemMedia slot fits Avatar for profile-style rows.' },
      source: {
        code: toSfc(
          [
            ITEM_IMPORT,
            MEDIA_IMPORT,
            CONTENT_IMPORT,
            TITLE_IMPORT,
            DESCRIPTION_IMPORT,
            ACTIONS_IMPORT,
            AVATAR_IMPORT,
            BUTTON_IMPORT
          ],
          WITH_AVATAR_TEMPLATE
        )
      }
    }
  }
}

const WITH_IMAGE_MEDIA_TEMPLATE = `<div class="flex w-full max-w-md flex-col gap-[var(--spacing-4)]">
  <Item kind="outline">
    <ItemMedia media-kind="image">
      <img
        src="https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?w=64&h=64&fit=crop"
        alt="Midnight City Lights"
        class="object-cover size-10 grayscale rounded-[var(--shape-card)]"
      />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Midnight City Lights</ItemTitle>
      <ItemDescription>Neon Dreams · Electric Nights</ItemDescription>
    </ItemContent>
    <ItemContent class="flex-none text-center">
      <ItemDescription>3:45</ItemDescription>
    </ItemContent>
  </Item>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithImageMedia = {
  render: () => ({ components: itemSubcomponents, template: WITH_IMAGE_MEDIA_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'ItemMedia with mediaKind image crops a thumbnail; a second ItemContent column can show metadata.'
      },
      source: {
        code: toSfc(
          [ITEM_IMPORT, MEDIA_IMPORT, CONTENT_IMPORT, TITLE_IMPORT, DESCRIPTION_IMPORT],
          WITH_IMAGE_MEDIA_TEMPLATE
        )
      }
    }
  }
}

const WITH_AS_CHILD_TEMPLATE = `<div class="flex w-full max-w-md flex-col gap-[var(--spacing-4)]">
  <Item kind="outline" as-child>
    <a href="#" class="no-underline text-inherit">
      <ItemContent>
        <ItemTitle>Visit our documentation</ItemTitle>
        <ItemDescription>Learn how to get started with our components.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <i class="ai ai-angle-right text-[length:inherit] leading-none" aria-hidden="true" />
      </ItemActions>
    </a>
  </Item>
  <Item kind="outline" size="small" as-child>
    <a href="#" class="no-underline text-inherit">
      <ItemMedia media-kind="icon">
        <i class="ai ai-verified text-[length:inherit] leading-none" aria-hidden="true" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Your profile has been verified.</ItemTitle>
      </ItemContent>
      <ItemActions>
        <i class="ai ai-angle-right text-[length:inherit] leading-none" aria-hidden="true" />
      </ItemActions>
    </a>
  </Item>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithAsChild = {
  render: () => ({ components: itemSubcomponents, template: WITH_AS_CHILD_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'With asChild, layout classes merge onto the anchor; use native link focus styles or slotted Button for actions.'
      },
      source: {
        code: toSfc(
          [
            ITEM_IMPORT,
            MEDIA_IMPORT,
            CONTENT_IMPORT,
            TITLE_IMPORT,
            DESCRIPTION_IMPORT,
            ACTIONS_IMPORT
          ],
          WITH_AS_CHILD_TEMPLATE
        )
      }
    }
  }
}

const WITH_GROUP_TEMPLATE = `<div class="flex w-full max-w-md flex-col gap-[var(--spacing-4)]">
  <ItemGroup>
    <Item>
      <ItemMedia>
        <Avatar src="https://github.com/shadcn.png" alt="shadcn" label="S" size="medium" />
      </ItemMedia>
      <ItemContent class="gap-[var(--spacing-1)]">
        <ItemTitle>shadcn</ItemTitle>
        <ItemDescription>shadcn@vercel.com</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button label="Add" kind="text" size="small" icon="pi pi-plus" />
      </ItemActions>
    </Item>
    <ItemSeparator />
    <Item>
      <ItemMedia>
        <Avatar src="https://github.com/maxleiter.png" alt="maxleiter" label="M" size="medium" />
      </ItemMedia>
      <ItemContent class="gap-[var(--spacing-1)]">
        <ItemTitle>maxleiter</ItemTitle>
        <ItemDescription>maxleiter@vercel.com</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button label="Add" kind="text" size="small" icon="pi pi-plus" />
      </ItemActions>
    </Item>
    <ItemSeparator />
    <Item>
      <ItemMedia>
        <Avatar src="https://github.com/evilrabbit.png" alt="evilrabbit" label="E" size="medium" />
      </ItemMedia>
      <ItemContent class="gap-[var(--spacing-1)]">
        <ItemTitle>evilrabbit</ItemTitle>
        <ItemDescription>evilrabbit@vercel.com</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button label="Add" kind="text" size="small" icon="pi pi-plus" />
      </ItemActions>
    </Item>
  </ItemGroup>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithGroup = {
  render: () => ({ components: itemSubcomponents, template: WITH_GROUP_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'ItemGroup stacks rows with avatars, actions, and ItemSeparator between entries.'
      },
      source: {
        code: toSfc(
          [
            GROUP_IMPORT,
            ITEM_IMPORT,
            SEPARATOR_IMPORT,
            MEDIA_IMPORT,
            CONTENT_IMPORT,
            TITLE_IMPORT,
            DESCRIPTION_IMPORT,
            ACTIONS_IMPORT,
            AVATAR_IMPORT,
            BUTTON_IMPORT
          ],
          WITH_GROUP_TEMPLATE
        )
      }
    }
  }
}
