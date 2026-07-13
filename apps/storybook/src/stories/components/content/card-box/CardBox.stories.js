import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import IconButton from '@aziontech/webkit/icon-button'
import Tag from '@aziontech/webkit/tag'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import CardBox from '@aziontech/webkit/card-box'"
const IMPORT_BUTTON = "import Button from '@aziontech/webkit/button'"
const IMPORT_ICON_BUTTON = "import IconButton from '@aziontech/webkit/icon-button'"
const IMPORT_TAG = "import Tag from '@aziontech/webkit/tag'"

/** @type {import('@storybook/vue3').Meta<typeof CardBox>} */
const meta = {
  title: 'Components/Content/CardBox',
  component: CardBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
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
          'Displays content or metadata in a structured surface with optional header, body, and footer regions. Use `title` and the `header-action` slot for the default header layout, or the `header` slot for full control.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Heading in the default header when the `header` slot is empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    padded: {
      control: 'boolean',
      description:
        'Pads the content region. Set `false` for flush, edge-to-edge content such as an ItemList with full-width dividers.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    header: {
      control: false,
      description: 'Custom header content; replaces the default title + header-action layout.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    },
    'header-action': {
      control: false,
      description: 'Actions at the end of the default header; revealed on header hover/focus.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    },
    content: {
      control: false,
      description: 'Main card body.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    },
    footer: {
      control: false,
      description: 'Footer region; the footer bar is omitted when this slot is empty.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    title: 'Card Title',
    padded: true
  }
}

export default meta

const Template = (args) => ({
  components: { CardBox },
  setup() {
    return { args }
  },
  template: `
    <CardBox v-bind="args" class="w-full max-w-[512px]">
      <template #content>
        <p class="text-body-sm text-[var(--text-muted)]">
          Card body content. Place forms, tables, or any markup in the content slot.
        </p>
      </template>
    </CardBox>
  `
})

const DEFAULT_MARKUP = `<CardBox title="Card Title" class="w-full max-w-[512px]">
  <template #content>
    <p class="text-body-sm text-[var(--text-muted)]">
      Card body content. Place forms, tables, or any markup in the content slot.
    </p>
  </template>
</CardBox>`

/** @type {import('@storybook/vue3').StoryObj<typeof CardBox>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Default card with a title header and body content in the `content` slot.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const HEADER_ACTION_TEMPLATE = `<CardBox class="w-full max-w-[512px]">
  <template #header>
    <div class="flex items-center justify-between w-full">
      <h2 class="text-label-md text-[var(--text-default)]">Card Title</h2>
      <IconButton icon="pi pi-chevron-right" aria-label="Expand" kind="outlined" size="small" />
    </div>
  </template>
  <template #content>
    <p class="text-body-sm text-[var(--text-muted)]">
      An action rendered in the header slot stays visible, aligned to the end of the header.
    </p>
  </template>
</CardBox>`

/** @type {import('@storybook/vue3').StoryObj<typeof CardBox>} */
export const WithHeaderAction = {
  render: (args) => ({
    components: { CardBox, IconButton },
    setup() {
      return { args }
    },
    template: HEADER_ACTION_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'An action rendered through the `header` slot stays visible, aligned to the end of the header.'
      },
      source: { code: toSfc([IMPORT, IMPORT_ICON_BUTTON], HEADER_ACTION_TEMPLATE) }
    }
  }
}

const FOOTER_TEMPLATE = `<CardBox title="Card Title" class="w-full max-w-[512px]">
  <template #content>
    <p class="text-body-sm text-[var(--text-muted)]">
      The footer bar renders only when the footer slot is filled.
    </p>
  </template>
  <template #footer>
    <div class="flex w-full justify-end gap-[var(--spacing-sm)]">
      <Button label="Cancel" kind="outlined" size="small" />
      <Button label="Save" kind="outlined" size="small" />
    </div>
  </template>
</CardBox>`

/** @type {import('@storybook/vue3').StoryObj<typeof CardBox>} */
export const WithFooter = {
  render: (args) => ({
    components: { CardBox, Button },
    setup() {
      return { args }
    },
    template: FOOTER_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'Filling the `footer` slot renders the footer bar with actions or metadata.'
      },
      source: { code: toSfc([IMPORT, IMPORT_BUTTON], FOOTER_TEMPLATE) }
    }
  }
}

const CUSTOM_HEADER_TEMPLATE = `<CardBox class="w-full max-w-[512px]">
  <template #header>
    <div class="flex items-center justify-between w-full">
      <h2 class="text-label-md text-[var(--text-default)]">Custom Header</h2>
      <Button label="Action" kind="outlined" size="small" />
    </div>
  </template>
  <template #content>
    <p class="text-body-sm text-[var(--text-muted)]">
      The header slot replaces the default title + header-action layout for full control.
    </p>
  </template>
</CardBox>`

/** @type {import('@storybook/vue3').StoryObj<typeof CardBox>} */
export const CustomHeader = {
  render: (args) => ({
    components: { CardBox, Button },
    setup() {
      return { args }
    },
    template: CUSTOM_HEADER_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'The `header` slot replaces the default title layout when full control of the header is needed.'
      },
      source: { code: toSfc([IMPORT, IMPORT_BUTTON], CUSTOM_HEADER_TEMPLATE) }
    }
  }
}

const FLUSH_MARKUP = `<CardBox title="Card Title" :padded="false" class="w-full max-w-[512px]">
  <template #content>
    <p class="text-body-sm text-[var(--text-muted)] p-[var(--spacing-md)]">
      With padded=false the content sits flush to the card edges; the content owns its own padding (or renders an ItemList with full-width dividers).
    </p>
  </template>
</CardBox>`

/** @type {import('@storybook/vue3').StoryObj<typeof CardBox>} */
export const Flush = {
  render: (args) => ({
    components: { CardBox },
    setup() {
      return { args }
    },
    template: `
      <CardBox v-bind="args" :padded="false" title="Card Title" class="w-full max-w-[512px]">
        <template #content>
          <p class="text-body-sm text-[var(--text-muted)] p-[var(--spacing-md)]">
            With padded=false the content sits flush to the card edges; the content owns its own padding (or renders an ItemList with full-width dividers).
          </p>
        </template>
      </CardBox>
    `
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Set `padded=false` for edge-to-edge content such as an ItemList with full-width dividers.'
      },
      source: { code: toSfc(IMPORT, FLUSH_MARKUP) }
    }
  }
}

const CUSTOM_CONTENT_TEMPLATE = `<CardBox class="w-full max-w-[var(--container-5xl)]">
  <template #header>
    <div class="flex w-full items-center justify-between gap-[var(--spacing-md)]">
      <h2 class="text-heading-sm text-[var(--text-default)]">Production Deployment</h2>
      <div class="flex items-center gap-[var(--spacing-xs)]">
        <Button label="Repository" icon="pi pi-github" kind="text" size="small" />
        <Button label="Instant Rollback" icon="pi pi-history" kind="text" size="small" />
        <Button label="Visit" kind="outlined" size="small" />
        <IconButton icon="pi pi-chevron-down" aria-label="More visit options" kind="outlined" size="small" />
      </div>
    </div>
  </template>

  <template #content>
    <div class="flex gap-[var(--spacing-lg)]">
      <div class="flex w-[var(--container-2xs)] shrink-0 flex-col gap-[var(--spacing-sm)] rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] p-[var(--spacing-md)]">
        <div class="flex gap-[var(--spacing-xs)] text-body-xxs text-[var(--text-muted)]">
          <span>Home</span><span>About</span><span>API Data</span><span>Health</span>
        </div>
        <h3 class="text-label-md text-[var(--text-default)]">Welcome to Express on Vercel 🚀</h3>
        <p class="text-body-xxs text-[var(--text-muted)]">This is a minimal example without a database or forms.</p>
        <div class="size-[var(--spacing-xxl)] bg-[var(--bg-contrast)]"></div>
      </div>

      <div class="flex flex-1 flex-col gap-[var(--spacing-md)]">
        <div class="flex flex-col gap-[var(--spacing-xxs)]">
          <span class="text-label-sm text-[var(--text-muted)]">Deployment</span>
          <span class="text-body-sm text-[var(--text-default)]">new-teste-aae08zre4-personal-area.vercel.app</span>
        </div>

        <div class="flex flex-col gap-[var(--spacing-xxs)]">
          <span class="flex items-center gap-[var(--spacing-xxs)] text-label-sm text-[var(--text-muted)]">
            Domains
            <i class="pi pi-plus-circle shrink-0 text-[length:inherit] leading-none"></i>
          </span>
          <a href="https://new-teste-six.vercel.app" class="flex items-center gap-[var(--spacing-xxs)] text-body-sm text-link">
            new-teste-six.vercel.app
            <i class="pi pi-external-link shrink-0 text-[length:inherit] leading-none"></i>
          </a>
        </div>

        <div class="flex gap-[var(--spacing-xxl)]">
          <div class="flex flex-col gap-[var(--spacing-xxs)]">
            <span class="text-label-sm text-[var(--text-muted)]">Status</span>
            <span class="flex items-center gap-[var(--spacing-xs)] text-body-sm text-[var(--text-default)]">
              <span class="size-[var(--spacing-xs)] shrink-0 rounded-full bg-[var(--success)]"></span>
              Ready
            </span>
          </div>
          <div class="flex flex-col gap-[var(--spacing-xxs)]">
            <span class="text-label-sm text-[var(--text-muted)]">Created</span>
            <span class="flex items-center gap-[var(--spacing-xs)] text-body-sm text-[var(--text-default)]">
              Jun 19 by gab-az
              <span class="size-[var(--spacing-md)] shrink-0 rounded-full bg-[var(--bg-contrast)]"></span>
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-[var(--spacing-xxs)]">
          <span class="text-label-sm text-[var(--text-muted)]">Source</span>
          <span class="flex items-center gap-[var(--spacing-xs)] text-body-sm text-[var(--text-default)]">
            <i class="pi pi-code shrink-0 text-[length:inherit] leading-none text-[var(--text-muted)]"></i>
            <code class="rounded-[var(--shape-elements)] bg-[var(--bg-surface-raised)] px-[var(--spacing-xxs)] text-label-code-sm">main</code>
          </span>
          <span class="flex items-center gap-[var(--spacing-xs)] text-body-sm text-[var(--text-default)]">
            <i class="pi pi-circle shrink-0 text-[length:inherit] leading-none text-[var(--text-muted)]"></i>
            <code class="rounded-[var(--shape-elements)] bg-[var(--bg-surface-raised)] px-[var(--spacing-xxs)] text-label-code-sm">739af5f</code>
            <i class="pi pi-verified shrink-0 text-[length:inherit] leading-none text-[var(--text-muted)]"></i>
            Initial commit
          </span>
        </div>
      </div>
    </div>
  </template>

  <template #footer>
    <div class="flex w-full flex-col gap-[var(--spacing-sm)]">
      <span class="flex items-center gap-[var(--spacing-xs)]">
        <i class="pi pi-chevron-right shrink-0 text-[length:inherit] leading-none text-[var(--text-muted)]"></i>
        <span class="text-label-md text-[var(--text-default)]">Deployment Settings</span>
        <Tag severity="primary" size="small" rounded>4 Recommendations</Tag>
      </span>
      <div class="flex items-center justify-between gap-[var(--spacing-md)] border-t border-[var(--border-default)] pt-[var(--spacing-sm)]">
        <span class="text-body-sm text-[var(--text-muted)]">
          To update your Production Deployment, push to the
          <code class="rounded-[var(--shape-elements)] bg-[var(--bg-surface-raised)] px-[var(--spacing-xxs)] text-label-code-sm">main</code>
          branch.
        </span>
        <Button label="Deployments" icon="pi pi-sliders-h" kind="outlined" size="small" />
      </div>
    </div>
  </template>
</CardBox>`

/** @type {import('@storybook/vue3').StoryObj<typeof CardBox>} */
export const CustomContent = {
  render: (args) => ({
    components: { CardBox, Button, IconButton, Tag },
    setup() {
      return { args }
    },
    template: CUSTOM_CONTENT_TEMPLATE
  }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A rich deployment-summary example composing the `header`, `content`, and `footer` slots with Button, IconButton, and Tag — showing how far the custom-content slots can be pushed.'
      },
      source: { code: toSfc([IMPORT, IMPORT_BUTTON, IMPORT_ICON_BUTTON, IMPORT_TAG], CUSTOM_CONTENT_TEMPLATE) }
    }
  }
}
