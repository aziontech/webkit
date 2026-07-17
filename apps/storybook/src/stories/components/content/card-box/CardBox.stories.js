import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import IconButton from '@aziontech/webkit/icon-button'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import CardBox from '@aziontech/webkit/card-box'"
const IMPORT_BUTTON = "import Button from '@aziontech/webkit/button'"
const IMPORT_ICON_BUTTON = "import IconButton from '@aziontech/webkit/icon-button'"

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
export const Header = {
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
    <div class="flex w-full items-center justify-between gap-[var(--spacing-sm)]">
      <span class="text-body-xs text-[var(--text-muted)]">
        <a href="/docs" class="text-link">Check documentation:</a>
      </span>
      <div class="flex gap-[var(--spacing-sm)]">
        <Button label="Cancel" kind="outlined" size="small" />
        <Button label="Save" kind="outlined" size="small" />
      </div>
    </div>
  </template>
</CardBox>`

/** @type {import('@storybook/vue3').StoryObj<typeof CardBox>} */
export const Footer = {
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
