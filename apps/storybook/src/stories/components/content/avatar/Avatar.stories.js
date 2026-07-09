import Avatar from '@aziontech/webkit/avatar'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Avatar from '@aziontech/webkit/avatar'"

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
    layout: 'centered',
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
          'User avatar for profiles and lists. Renders an image when `src` is set, initials from `label` otherwise, and a fallback icon when neither is provided. Supports circle and square shapes and three sizes (24 / 32 / 48 px).'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'Image URL. When set, renders a photo and takes precedence over label and icon.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    alt: {
      control: 'text',
      description: 'Accessible description for the image. Use when `src` is set.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    label: {
      control: 'text',
      description: 'Initials shown when no image (normalized to two uppercase characters).',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the fallback when no image or label.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'pi pi-user'" }
      }
    },
    kind: {
      control: 'select',
      options: kinds,
      description: 'Visual shape of the avatar container.',
      table: {
        category: 'props',
        type: { summary: "'circle' | 'square'" },
        defaultValue: { summary: "'circle'" }
      }
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Size preset (small 24px, medium 32px, large 48px).',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    }
  },
  args: {
    src: '',
    alt: '',
    label: 'AB',
    icon: 'pi pi-user',
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

const DEFAULT_MARKUP = '<Avatar label="AB" kind="circle" size="medium" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Avatar>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default circle avatar with initials.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-wrap items-end gap-6">
  <div class="flex flex-col items-center gap-2">
    <Avatar kind="circle" label="AB" size="medium" />
    <span class="text-body-xs text-[var(--text-muted)]">Circle</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <Avatar kind="square" label="AB" size="medium" />
    <span class="text-body-xs text-[var(--text-muted)]">Square</span>
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Avatar>} */
export const Types = {
  render: () => ({ components: { Avatar }, template: TYPES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Both shape variants side by side: circle and square at medium size.' },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-wrap items-end gap-4">
  <Avatar label="AB" size="small" />
  <Avatar label="AB" size="medium" />
  <Avatar label="AB" size="large" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Avatar>} */
export const Sizes = {
  render: () => ({ components: { Avatar }, template: SIZES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All three size presets (24 / 32 / 48 px) with initials.' },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}

const FALLBACKS_TEMPLATE = `<div class="flex flex-wrap items-end gap-6">
  <div class="flex flex-col items-center gap-2">
    <Avatar src="${sampleImage}" alt="Portrait of a user" size="large" />
    <span class="text-body-xs text-[var(--text-muted)]">Image</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <Avatar label="JD" size="large" />
    <span class="text-body-xs text-[var(--text-muted)]">Initials</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <Avatar icon="pi pi-user" size="large" />
    <span class="text-body-xs text-[var(--text-muted)]">Icon</span>
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Avatar>} */
export const Fallbacks = {
  render: () => ({ components: { Avatar }, template: FALLBACKS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Content precedence: photo when `src` is set, initials from `label` when there is no image, and the fallback icon when neither is provided.'
      },
      source: { code: toSfc(IMPORT, FALLBACKS_TEMPLATE) }
    }
  }
}

const VARIANT_GRID_TEMPLATE = `<div class="flex flex-col gap-8">
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
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Avatar>} */
export const VariantGrid = {
  render: () => ({
    components: { Avatar },
    setup() {
      return { kinds, sizes, sampleImage }
    },
    template: VARIANT_GRID_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Full matrix of shapes and sizes across the three content modes (initials, icon, image).'
      },
      source: {
        code: toSfc(
          [
            IMPORT,
            '',
            "const kinds = ['circle', 'square']",
            "const sizes = ['small', 'medium', 'large']",
            'const sampleImage =',
            `  '${sampleImage}'`
          ],
          VARIANT_GRID_TEMPLATE
        )
      }
    }
  }
}
