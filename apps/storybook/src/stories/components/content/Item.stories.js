import Avatar from '@aziontech/webkit/avatar'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Item from '@aziontech/webkit/item'

import { toSfc } from '../../_shared/story-source'

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
  ItemList: Item.List,
  ItemSeparator: Item.Separator,
  ItemMedia: Item.Media,
  ItemContent: Item.Content,
  ItemTitle: Item.Title,
  ItemDescription: Item.Description,
  ItemActions: Item.Actions,
  Button,
  Avatar,
  CardBox
}

/** @type {import('@storybook/vue3').Meta<typeof Item>} */
const meta = {
  title: 'Components/Content/Item',
  component: Item,
  subcomponents: {
    ItemGroup: Item.Group,
    ItemList: Item.List,
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
          'Versatile flex row for title, description, media, and actions. Compose sub-components to reorder or omit regions; use ItemGroup for gapped off-card lists and ItemList (inside a CardBox with padded=false) for divided in-card lists.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['default', 'outline', 'muted', 'inline'],
      description:
        'Item root surface variant. inline removes the outer padding for inline placement and divided in-card lists.',
      table: {
        type: { summary: "'default' | 'outline' | 'muted' | 'inline'" },
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
        'Merge row layout onto the single default-slot child (e.g. anchor). The merged child becomes the focusable element and draws the focus-visible ring.',
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

const BASIC_IMPORTS = [
  "import Item from '@aziontech/webkit/item'",
  "import Button from '@aziontech/webkit/button'"
]

const basicMarkup = (attrs = '') => `<Item${attrs}>
  <Item.Content>
    <Item.Title>Basic Item</Item.Title>
    <Item.Description>A simple item with title and description.</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button label="Action" kind="outlined" size="small" />
  </Item.Actions>
</Item>`

const Template = (args) => ({
  components: itemSubcomponents,
  setup() {
    return { args }
  },
  template: `
    <div class="flex w-full flex-col gap-[var(--spacing-4)]">
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
      },
      source: { code: toSfc(BASIC_IMPORTS, basicMarkup()) }
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
      },
      source: { code: toSfc(BASIC_IMPORTS, basicMarkup(' kind="outline"')) }
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
      },
      source: { code: toSfc(BASIC_IMPORTS, basicMarkup(' kind="muted"')) }
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
      },
      source: { code: toSfc(BASIC_IMPORTS, basicMarkup(' kind="outline" size="small"')) }
    }
  }
}

const ICON_MEDIA_MARKUP = `<Item kind="outline">
  <Item.Media media-kind="icon">
    <i class="ai ai-edge-firewall text-[length:inherit] leading-none" aria-hidden="true" />
  </Item.Media>
  <Item.Content>
    <Item.Title>Security Alert</Item.Title>
    <Item.Description>New login detected from unknown device.</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button label="Review" kind="outlined" size="small" />
  </Item.Actions>
</Item>`

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithIconMedia = {
  render: (args) => ({
    components: itemSubcomponents,
    setup() {
      return { args }
    },
    template: `
      <div class="flex w-full flex-col gap-[var(--spacing-4)]">
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
      },
      source: { code: toSfc(BASIC_IMPORTS, ICON_MEDIA_MARKUP) }
    }
  }
}

const AVATAR_IMPORTS = [
  "import Item from '@aziontech/webkit/item'",
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Button from '@aziontech/webkit/button'"
]

const AVATAR_MARKUP = `<Item kind="outline">
  <Item.Media>
    <Avatar src="${sampleAvatarSrc}" alt="Evil Rabbit" label="ER" size="medium" />
  </Item.Media>
  <Item.Content>
    <Item.Title>Evil Rabbit</Item.Title>
    <Item.Description>Last seen 5 months ago</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button label="Invite" kind="outlined" size="small" icon="pi pi-plus" />
  </Item.Actions>
</Item>`

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithAvatar = {
  render: (args) => ({
    components: itemSubcomponents,
    setup() {
      return { args, sampleAvatarSrc }
    },
    template: `
      <div class="flex w-full flex-col gap-[var(--spacing-4)]">
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
      },
      source: { code: toSfc(AVATAR_IMPORTS, AVATAR_MARKUP) }
    }
  }
}

const IMAGE_IMPORTS = ["import Item from '@aziontech/webkit/item'"]

const IMAGE_MARKUP = `<Item kind="outline">
  <Item.Media media-kind="image">
    <img
      src="${sampleThumbnailSrc}"
      alt="Midnight City Lights"
      class="object-cover size-10 grayscale rounded-[var(--shape-card)]"
    />
  </Item.Media>
  <Item.Content>
    <Item.Title>Midnight City Lights</Item.Title>
    <Item.Description>Neon Dreams · Electric Nights</Item.Description>
  </Item.Content>
  <Item.Content class="flex-none text-center">
    <Item.Description>3:45</Item.Description>
  </Item.Content>
</Item>`

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithImageMedia = {
  render: (args) => ({
    components: itemSubcomponents,
    setup() {
      return { args, sampleThumbnailSrc }
    },
    template: `
      <div class="flex w-full flex-col gap-[var(--spacing-4)]">
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
      },
      source: { code: toSfc(IMAGE_IMPORTS, IMAGE_MARKUP) }
    }
  }
}

const AS_CHILD_IMPORTS = ["import Item from '@aziontech/webkit/item'"]

const AS_CHILD_MARKUP = `<div class="flex w-full flex-col gap-[var(--spacing-4)]">
  <Item kind="outline" as-child>
    <a href="#" class="no-underline text-inherit">
      <Item.Content>
        <Item.Title>Visit our documentation</Item.Title>
        <Item.Description>Learn how to get started with our components.</Item.Description>
      </Item.Content>
      <Item.Actions>
        <i class="ai ai-angle-right text-[length:inherit] leading-none" aria-hidden="true" />
      </Item.Actions>
    </a>
  </Item>
  <Item kind="outline" size="small" as-child>
    <a href="#" class="no-underline text-inherit">
      <Item.Media media-kind="icon">
        <i class="pi pi-verified text-[length:inherit] leading-none" aria-hidden="true" />
      </Item.Media>
      <Item.Content>
        <Item.Title>Your profile has been verified.</Item.Title>
      </Item.Content>
      <Item.Actions>
        <i class="ai ai-angle-right text-[length:inherit] leading-none" aria-hidden="true" />
      </Item.Actions>
    </a>
  </Item>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithAsChild = {
  render: () => ({
    components: itemSubcomponents,
    template: `
      <div class="flex w-full flex-col gap-[var(--spacing-4)]">
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
              <i class="pi pi-verified text-[length:inherit] leading-none" aria-hidden="true" />
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
          'With asChild, layout classes merge onto the anchor, which becomes the single focusable element of the row and draws the focus-visible ring. Tab to a row to see it.'
      },
      source: { code: toSfc(AS_CHILD_IMPORTS, AS_CHILD_MARKUP) }
    }
  }
}

const GROUP_IMPORTS = [
  "import Item from '@aziontech/webkit/item'",
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Button from '@aziontech/webkit/button'"
]

const groupRow = (person) => `  <Item>
    <Item.Media>
      <Avatar src="${person.avatar}" alt="${person.username}" label="${person.username
  .charAt(0)
  .toUpperCase()}" size="medium" />
    </Item.Media>
    <Item.Content class="gap-[var(--spacing-1)]">
      <Item.Title>${person.username}</Item.Title>
      <Item.Description>${person.email}</Item.Description>
    </Item.Content>
    <Item.Actions>
      <Button label="Add" kind="text" size="small" icon="pi pi-plus" />
    </Item.Actions>
  </Item>`

const GROUP_MARKUP = `<Item.Group>
${people.map(groupRow).join('\n')}
</Item.Group>`

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithGroup = {
  render: (args) => ({
    components: itemSubcomponents,
    setup() {
      return { args, people }
    },
    template: `
      <div class="flex w-full">
        <ItemGroup>
          <Item
            v-for="person in people"
            :key="person.username"
            v-bind="args"
          >
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
        </ItemGroup>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'ItemGroup is the off-card list: it stacks rows with a gap between them (no dividers) and forces its items inline (no per-item surface/padding) to avoid a box-in-box effect.'
      },
      source: { code: toSfc(GROUP_IMPORTS, GROUP_MARKUP) }
    }
  }
}

const WITH_LIST_IMPORTS = [
  "import Item from '@aziontech/webkit/item'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import Button from '@aziontech/webkit/button'"
]

const WITH_LIST_ROW = `      <Item>
        <Item.Media media-kind="icon">
          <i class="ai ai-edge-application text-[length:inherit] leading-none" aria-hidden="true" />
        </Item.Media>
        <Item.Content>
          <Item.Title>Basic Item</Item.Title>
          <Item.Description>A simple item with title and description.</Item.Description>
        </Item.Content>
        <Item.Actions>
          <Button label="Action" kind="outlined" size="small" />
        </Item.Actions>
      </Item>`

const WITH_LIST_MARKUP = `<CardBox :padded="false" class="w-full">
  <template #content>
    <Item.List>
${WITH_LIST_ROW}
${WITH_LIST_ROW}
${WITH_LIST_ROW}
    </Item.List>
  </template>
</CardBox>`

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithList = {
  render: (args) => ({
    components: itemSubcomponents,
    setup() {
      return { args }
    },
    template: `
      <CardBox :padded="false" class="w-full">
        <template #content>
          <ItemList>
            <Item v-bind="args" v-for="n in 3" :key="n">
              <ItemMedia media-kind="icon">
                <i class="ai ai-edge-application text-[length:inherit] leading-none" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Basic Item</ItemTitle>
                <ItemDescription>A simple item with title and description.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button label="Action" kind="outlined" size="small" />
              </ItemActions>
            </Item>
          </ItemList>
        </template>
      </CardBox>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'ItemList is the in-card list: placed inside a CardBox with padded=false, rows are separated by full-width dividers and sit flush to the card edges.'
      },
      source: { code: toSfc(WITH_LIST_IMPORTS, WITH_LIST_MARKUP) }
    }
  }
}

const AS_CHILD_LIST_IMPORTS = [
  "import Item from '@aziontech/webkit/item'",
  "import CardBox from '@aziontech/webkit/card-box'"
]

const AS_CHILD_LIST_ROW = `      <Item as-child>
        <a href="#" class="no-underline text-inherit">
          <Item.Media media-kind="icon">
            <i class="ai ai-edge-application text-[length:inherit] leading-none" aria-hidden="true" />
          </Item.Media>
          <Item.Content>
            <Item.Title>Basic Item</Item.Title>
            <Item.Description>A simple item with title and description.</Item.Description>
          </Item.Content>
          <i class="pi pi-arrow-right text-[var(--text-muted)]" aria-hidden="true" />
        </a>
      </Item>`

const AS_CHILD_LIST_MARKUP = `<CardBox :padded="false" class="w-full">
  <template #content>
    <Item.List>
${AS_CHILD_LIST_ROW}
${AS_CHILD_LIST_ROW}
${AS_CHILD_LIST_ROW}
    </Item.List>
  </template>
</CardBox>`

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const WithListAsChild = {
  render: () => ({
    components: itemSubcomponents,
    template: `
      <CardBox :padded="false" class="w-full">
        <template #content>
          <ItemList>
            <Item as-child v-for="n in 3" :key="n">
              <a href="#" class="no-underline text-inherit">
                <ItemMedia media-kind="icon">
                  <i class="ai ai-edge-application text-[length:inherit] leading-none" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Basic Item</ItemTitle>
                  <ItemDescription>A simple item with title and description.</ItemDescription>
                </ItemContent>
                <i class="pi pi-arrow-right text-[var(--text-muted)]" aria-hidden="true" />
              </a>
            </Item>
          </ItemList>
        </template>
      </CardBox>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'asChild rows inside an ItemList: each whole row is an anchor (data-kind forced to default by the list), separated by full-width dividers, with row-level hover and a focus-visible ring on Tab.'
      },
      source: { code: toSfc(AS_CHILD_LIST_IMPORTS, AS_CHILD_LIST_MARKUP) }
    }
  }
}

const INLINE_IMPORTS = ["import Item from '@aziontech/webkit/item'"]

const inlineRow = (icon, title, description) => `  <Item kind="inline" size="small">
    <Item.Media media-kind="icon">
      <i class="ai ${icon} text-[length:inherit] leading-none" aria-hidden="true" />
    </Item.Media>
    <Item.Content>
      <Item.Title>${title}</Item.Title>
      <Item.Description>${description}</Item.Description>
    </Item.Content>
    <i class="pi pi-arrow-right text-[var(--text-muted)]" aria-hidden="true" />
  </Item>`

const INLINE_MARKUP = `<Item.Group>
${inlineRow('ai-domains', 'Customize Domain', 'Link custom domains and subdomains to Azion.')}
${inlineRow('ai-network-lists', 'Point Traffic', 'Redirect domain traffic to Azion.')}
${inlineRow('ai-real-time-metrics', 'View Analytics', 'Monitor performance, availability, and security.')}
</Item.Group>`

/** @type {import('@storybook/vue3').StoryObj<typeof Item>} */
export const Inline = {
  render: (args) => ({
    components: itemSubcomponents,
    setup() {
      return { args }
    },
    template: `
      <div class="flex w-full">
        <ItemGroup>
          <Item kind="inline" size="small" v-bind="args">
            <ItemMedia media-kind="icon">
              <i class="ai ai-domains text-[length:inherit] leading-none" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Customize Domain</ItemTitle>
              <ItemDescription>Link custom domains and subdomains to Azion.</ItemDescription>
            </ItemContent>
            <i class="pi pi-arrow-right text-[var(--text-muted)]" aria-hidden="true" />
          </Item>
          <Item kind="inline" size="small" v-bind="args">
            <ItemMedia media-kind="icon">
              <i class="ai ai-network-lists text-[length:inherit] leading-none" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Point Traffic</ItemTitle>
              <ItemDescription>Redirect domain traffic to Azion.</ItemDescription>
            </ItemContent>
            <i class="pi pi-arrow-right text-[var(--text-muted)]" aria-hidden="true" />
          </Item>
          <Item kind="inline" size="small" v-bind="args">
            <ItemMedia media-kind="icon">
              <i class="ai ai-real-time-metrics text-[length:inherit] leading-none" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>View Analytics</ItemTitle>
              <ItemDescription>Monitor performance, availability, and security.</ItemDescription>
            </ItemContent>
            <i class="pi pi-arrow-right text-[var(--text-muted)]" aria-hidden="true" />
          </Item>
        </ItemGroup>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'kind="inline" removes the outer padding so items sit flush; placed in a gapped ItemGroup directly on the page (no card, no dividers).'
      },
      source: { code: toSfc(INLINE_IMPORTS, INLINE_MARKUP) }
    }
  }
}
