import Button from '@aziontech/webkit/button'
import Avatar from '@aziontech/webkit/avatar'
import Item from '@aziontech/webkit/content/item'

const sampleAvatarSrc =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face'

const sampleThumbnailSrc =
  'https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?w=64&h=64&fit=crop'

const people = [
  {
    username: 'shadcn',
    avatar: 'https://github.com/shadcn.png',
    email: 'shadcn@vercel.com'
  },
  {
    username: 'maxleiter',
    avatar: 'https://github.com/maxleiter.png',
    email: 'maxleiter@vercel.com'
  },
  {
    username: 'evilrabbit',
    avatar: 'https://github.com/evilrabbit.png',
    email: 'evilrabbit@vercel.com'
  }
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
      }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['default', 'outline', 'muted'],
      description: 'Item root surface variant.',
      table: {
        type: { summary: "'default' | 'outline' | 'muted'" },
        defaultValue: { summary: 'default' },
        category: 'props'
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Item root density (padding and gap).',
      table: {
        type: { summary: "'small' | 'medium'" },
        defaultValue: { summary: 'medium' },
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
      control: 'select',
      options: ['default', 'icon', 'image'],
      description: 'ItemMedia region variant (icon frame, image frame).',
      table: {
        type: { summary: "'default' | 'icon' | 'image'" },
        defaultValue: { summary: 'default' },
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
    asChild: false,
    mediaKind: 'default'
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
          <ItemDescription>
            A simple item with title and description.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button label="Action" kind="outlined" size="small" />
        </ItemActions>
      </Item>
    </div>
  `
})

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Default surface with title, description, and a trailing action.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const Outline = {
  args: { kind: 'outline' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Outlined variant with a visible border.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const Muted = {
  args: { kind: 'muted' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Muted variant for secondary list rows.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const Small = {
  args: { size: 'small', kind: 'outline' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Compact density with reduced padding and gap.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithIconMedia = {
  render: (args) => ({
    components: itemSubcomponents,
    setup() {
      return { args }
    },
    template: `
      <div class="flex w-full max-w-lg flex-col gap-[var(--spacing-4)]">
        <Item kind="outline" v-bind="args">
          <ItemMedia media-kind="icon">
            <i class="ai ai-edge-firewall text-[length:inherit] leading-none" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Security Alert</ItemTitle>
            <ItemDescription>
              New login detected from unknown device.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button label="Review" kind="outlined" size="small" />
          </ItemActions>
        </Item>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'ItemMedia with mediaKind icon frames a leading icon before title and description.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithAvatar = {
  render: (args) => ({
    components: itemSubcomponents,
    setup() {
      return { args, sampleAvatarSrc }
    },
    template: `
      <div class="flex w-full max-w-lg flex-col gap-[var(--spacing-4)]">
        <Item kind="outline" v-bind="args">
          <ItemMedia>
            <Avatar
              :src="sampleAvatarSrc"
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
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default ItemMedia slot fits Avatar for profile-style rows.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithImageMedia = {
  render: (args) => ({
    components: itemSubcomponents,
    setup() {
      return { args, sampleThumbnailSrc }
    },
    template: `
      <div class="flex w-full max-w-md flex-col gap-[var(--spacing-4)]">
        <Item kind="outline" v-bind="args">
          <ItemMedia media-kind="image">
            <img
              :src="sampleThumbnailSrc"
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
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'ItemMedia with mediaKind image crops a thumbnail; a second ItemContent column can show metadata.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithAsChild = {
  render: (args) => ({
    components: itemSubcomponents,
    setup() {
      return { args }
    },
    template: `
      <div class="flex w-full max-w-md flex-col gap-[var(--spacing-4)]">
        <Item kind="outline" as-child>
          <a href="#" class="no-underline text-inherit">
            <ItemContent>
              <ItemTitle>Visit our documentation</ItemTitle>
              <ItemDescription>
                Learn how to get started with our components.
              </ItemDescription>
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
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'With asChild, layout classes merge onto the anchor; use native link focus styles or slotted Button for actions.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithGroup = {
  render: (args) => ({
    components: itemSubcomponents,
    setup() {
      return { args, people }
    },
    template: `
      <div class="flex w-full max-w-md flex-col gap-[var(--spacing-4)]">
        <ItemGroup>
          <template v-for="(person, index) in people" :key="person.username">
            <Item v-bind="args">
              <ItemMedia>
                <Avatar
                  :src="person.avatar"
                  :alt="person.username"
                  :label="person.username.charAt(0).toUpperCase()"
                  size="medium"
                />
              </ItemMedia>
              <ItemContent class="gap-[var(--spacing-1)]">
                <ItemTitle>{{ person.username }}</ItemTitle>
                <ItemDescription>{{ person.email }}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button label="Add" kind="text" size="small" icon="pi pi-plus" />
              </ItemActions>
            </Item>
            <ItemSeparator v-if="index !== people.length - 1" />
          </template>
        </ItemGroup>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'ItemGroup stacks rows with avatars, actions, and ItemSeparator between entries.'
      }
    }
  }
}
