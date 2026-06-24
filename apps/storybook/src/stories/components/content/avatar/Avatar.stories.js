import { expect, within } from '@storybook/test'

import Avatar from '@aziontech/webkit/avatar'

const kinds = ['circle', 'square']
const sizes = ['small', 'medium', 'large']

const sampleImage =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face'

/** @type {import('@storybook/vue3').Meta<typeof Avatar>} */
const meta = {
 title: 'Components/Content/Avatar',
  component: Avatar,
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
          'User avatar for profiles and lists. Renders an image when `src` is set; otherwise initials from `label`; otherwise a user icon. Figma Webkit Avatar (node 477:882). Supports circle and square shapes and three sizes (24 / 32 / 48 px).'
      }
    }
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'Image URL. Takes precedence over label and icon.',
      table: {
        type: { summary: 'string' },
        category: 'props'
      }
    },
    alt: {
      control: 'text',
      description: 'Accessible description when `src` is set.',
      table: {
        type: { summary: 'string' },
        category: 'props'
      }
    },
    label: {
      control: 'text',
      description: 'Initials when no image (max two characters - uppercased).',
      table: {
        type: { summary: 'string' },
        category: 'props'
      }
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the fallback when no image or label.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'pi pi-user' },
        category: 'props'
      }
    },
    kind: {
      control: { type: 'select' },
      options: kinds,
      description: 'Visual shape of the container.',
      table: {
        type: { summary: 'AvatarKind' },
        defaultValue: { summary: 'circle' },
        category: 'props'
      }
    },
    size: {
      control: { type: 'select' },
      options: sizes,
      description: 'Size preset (small 24px, medium 32px, large 48px).',
      table: {
        type: { summary: 'AvatarSize' },
        defaultValue: { summary: 'medium' },
        category: 'props'
      }
    }
  },
  args: {
    label: 'AB',
    kind: 'circle',
    size: 'medium'
  }
}

export default meta

const Template = (args) => ({
  components: { Avatar },
  setup() {
    return { args }
  },
  template: '<Avatar v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof Avatar>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default circle avatar with initials.' } }
  }
}

export const KindCircle = {
  args: { kind: 'circle', label: 'AB' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Circular shape (Figma Shape=Circle).' } }
  }
}

export const KindSquare = {
  args: { kind: 'square', label: 'AB' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Square shape with `shape-elements` radius.' } }
  }
}

export const Kinds = {
  render: () => ({
    components: { Avatar },
    template: `
      <div class="flex flex-wrap items-end gap-6">
        <div class="flex flex-col items-center gap-2">
          <Avatar kind="circle" label="AB" size="medium" />
          <span class="text-body-xs text-[var(--text-muted)]">Circle</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Avatar kind="square" label="AB" size="medium" />
          <span class="text-body-xs text-[var(--text-muted)]">Square</span>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'Circle vs square at medium size.' } }
  }
}

export const SizeSmall = {
  args: { size: 'small', label: 'AB' },
  render: Template
}

export const SizeMedium = {
  args: { size: 'medium', label: 'AB' },
  render: Template
}

export const SizeLarge = {
  args: { size: 'large', label: 'AB' },
  render: Template
}

export const Sizes = {
  render: () => ({
    components: { Avatar },
    template: `
      <div class="flex flex-wrap items-end gap-4">
        <Avatar label="AB" size="small" />
        <Avatar label="AB" size="medium" />
        <Avatar label="AB" size="large" />
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'All three size presets with initials.' } }
  }
}

export const WithLabel = {
  args: { label: 'JD', kind: 'circle', size: 'medium' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Initials fallback (Figma Type=Text).' } }
  }
}

export const WithIcon = {
  args: { label: undefined, icon: 'pi pi-user', kind: 'circle', size: 'medium' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Icon fallback when no image or label (Figma Type=Icon).' } }
  }
}

export const WithImage = {
  args: {
    src: sampleImage,
    alt: 'Portrait of a user',
    label: undefined,
    kind: 'circle',
    size: 'large'
  },
  render: Template,
  parameters: {
    docs: { description: { story: 'Photo avatar (Figma Type=Image).' } }
  }
}

export const VariantGrid = {
  render: () => ({
    components: { Avatar },
    setup() {
      return { kinds, sizes, sampleImage }
    },
    template: `
      <div class="flex flex-col gap-8">
        <section v-for="kind in kinds" :key="kind" class="flex flex-col gap-4">
          <h3 class="text-heading-sm text-[var(--text-default)] capitalize">{{ kind }}</h3>
          <div class="flex flex-col gap-6">
            <div class="flex flex-wrap items-end gap-4">
              <span class="w-16 text-body-xs text-[var(--text-muted)]">Text</span>
              <Avatar v-for="size in sizes" :key="'l-' + kind + size" :kind="kind" :size="size" label="AB" />
            </div>
            <div class="flex flex-wrap items-end gap-4">
              <span class="w-16 text-body-xs text-[var(--text-muted)]">Icon</span>
              <Avatar v-for="size in sizes" :key="'i-' + kind + size" :kind="kind" :size="size" />
            </div>
            <div class="flex flex-wrap items-end gap-4">
              <span class="w-16 text-body-xs text-[var(--text-muted)]">Image</span>
              <Avatar
                v-for="size in sizes"
                :key="'img-' + kind + size"
                :kind="kind"
                :size="size"
                :src="sampleImage"
                alt="User portrait"
              />
            </div>
          </div>
        </section>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Matrix aligned with Figma node 477:882 (3 sizes; xl omitted from API).'
      }
    }
  }
}

export const LightDark = {
  parameters: {
    backgrounds: { default: 'light' },
    docs: { description: { story: 'Light canvas — verify raised surface and text contrast.' } }
  },
  render: () => ({
    components: { Avatar },
    template: `
      <div class="flex flex-wrap gap-4">
        <Avatar label="AB" kind="circle" size="medium" />
        <Avatar label="AB" kind="square" size="medium" />
        <Avatar icon="pi pi-user" kind="circle" size="medium" />
      </div>
    `
  })
}

export const Accessibility = {
  args: { label: 'AB', kind: 'circle', size: 'medium' },
  render: Template,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const avatar = canvas.getByRole('img', { name: 'AB' })
    await expect(avatar).toBeInTheDocument()
    await expect(canvas.getByTestId('content-avatar__label')).toHaveTextContent('AB')
  }
}

export const AccessibilityImage = {
  args: {
    src: sampleImage,
    alt: 'Portrait of a user',
    kind: 'circle',
    size: 'medium'
  },
  render: Template,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByRole('img', { name: 'Portrait of a user' })
    await expect(img).toBeInTheDocument()
    await expect(img).toHaveAttribute('src', sampleImage)
  }
}

export const Playground = {
  render: Template
}
