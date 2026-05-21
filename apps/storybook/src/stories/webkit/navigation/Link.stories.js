import Link from '@aziontech/webkit/navigation/link'

const sizes = ['large', 'medium']

export default {
  title: 'Webkit/Navigation/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on[A-Z].*' },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          'Text link with optional trailing icon and ghost hover surface. Maps to Figma Webkit Link (node 3548:578).'
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label rendered inside the link',
      table: { defaultValue: { summary: 'Learn More' } }
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Size token. Affects height, gap, and typography',
      table: { defaultValue: { summary: 'large' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled token set',
      table: { defaultValue: { summary: false } }
    },
    showIcon: {
      control: 'boolean',
      description: 'When true, renders the trailing icon',
      table: { defaultValue: { summary: true } }
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the trailing icon',
      table: { defaultValue: { summary: 'pi pi-external-link' } }
    },
    href: {
      control: 'text',
      description: 'Destination URL for the anchor',
      table: { defaultValue: { summary: '#' } }
    },
    target: {
      control: 'select',
      options: ['_self', '_blank'],
      description: 'Link target when navigating',
      table: { defaultValue: { summary: '_self' } }
    },
    onClick: {
      action: 'click',
      description: 'Emitted when the link is clicked (unless disabled)'
    }
  },
  args: {
    label: 'Learn More',
    size: 'large',
    disabled: false,
    showIcon: true,
    icon: 'pi pi-external-link',
    href: '#',
    target: '_self'
  }
}

export const Default = {
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Default large link with external icon (Figma Size=Large, State=Default).'
      }
    }
  },
  render: (args) => ({
    components: { Link },
    setup() {
      return { args }
    },
    template: '<Link v-bind="args" @click="args.onClick" />'
  })
}

export const Sizes = {
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Large and medium size variants side by side.'
      }
    }
  },
  render: () => ({
    components: { Link },
    setup() {
      return { sizes }
    },
    template: `
      <div class="flex flex-col items-start gap-6">
        <Link
          v-for="size in sizes"
          :key="size"
          :size="size"
          :label="size === 'large' ? 'Learn More' : 'Learn More'"
          href="#"
        />
      </div>
    `
  })
}

export const WithoutIcon = {
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Link without trailing icon (`showIcon=false`).'
      }
    }
  },
  args: {
    showIcon: false
  },
  render: (args) => ({
    components: { Link },
    setup() {
      return { args }
    },
    template: '<Link v-bind="args" @click="args.onClick" />'
  })
}

export const Disabled = {
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Disabled link — no navigation, muted text tokens.'
      }
    }
  },
  args: {
    disabled: true
  },
  render: (args) => ({
    components: { Link },
    setup() {
      return { args }
    },
    template: '<Link v-bind="args" />'
  })
}

export const ExternalLink = {
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Opens in a new tab with `rel="noopener noreferrer"`.'
      }
    }
  },
  args: {
    href: 'https://example.com',
    target: '_blank',
    label: 'Learn More'
  },
  render: (args) => ({
    components: { Link },
    setup() {
      return { args }
    },
    template: '<Link v-bind="args" @click="args.onClick" />'
  })
}

export const LightDark = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Link on light and dark canvas backgrounds for theme token verification.'
      }
    }
  },
  render: () => ({
    components: { Link },
    template: `
      <div class="flex flex-col gap-0">
        <section class="azion azion-light flex min-h-[12rem] items-center justify-center bg-[var(--bg-canvas)] p-8">
          <Link label="Learn More" href="#" size="large" />
        </section>
        <section class="azion azion-dark flex min-h-[12rem] items-center justify-center bg-[var(--bg-canvas)] p-8">
          <Link label="Learn More" href="#" size="large" />
        </section>
      </div>
    `
  })
}

export const Playground = {
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Interactive playground — adjust all props via controls.'
      }
    }
  },
  render: (args) => ({
    components: { Link },
    setup() {
      return { args }
    },
    template: '<Link v-bind="args" @click="args.onClick" />'
  })
}
