import { ref } from 'vue'
import IconButton from '@aziontech/webkit/actions/icon-button'

const kinds = ['primary', 'secondary', 'outlined', 'transparent']
const sizes = ['large', 'medium', 'small']

export default {
  title: 'Webkit/Actions/Icon Button',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    }
  },
  argTypes: {
    icon: {
      control: 'text',
      description: 'PrimeIcons class (e.g. pi pi-plus)'
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for the icon-only button'
    },
    kind: {
      control: 'select',
      options: kinds,
      description: 'Visual variant (Figma Kind)'
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Button size'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state'
    },
    loading: {
      control: 'boolean',
      description: 'Loading state (shows spinner, blocks interaction)'
    },
    href: {
      control: 'text',
      description: 'When set, renders as an anchor'
    },
    target: {
      control: 'select',
      options: ['_self', '_blank'],
      description: 'Link target when href is set'
    }
  }
}

export const Default = {
  args: {
    icon: 'pi pi-plus',
    ariaLabel: 'Add',
    kind: 'primary',
    size: 'large',
    disabled: false
  },
  render: (args) => ({
    components: { IconButton },
    setup() {
      return { args }
    },
    template: `
        <IconButton v-bind="args" />
    `
  })
}

export const Loading = {
  render: () => ({
    components: { IconButton },
    setup() {
      const loading = ref(false)

      const handleClick = () => {
        if (loading.value) return

        loading.value = true
        window.setTimeout(() => {
          loading.value = false
        }, 2000)
      }

      return { loading, handleClick }
    },
    template: `
      <IconButton
        icon="pi pi-check"
        aria-label="Save"
        kind="primary"
        size="large"
        :loading="loading"
        @click="handleClick"
      />
    `
  })
}

export const AsLink = {
  args: {
    icon: 'pi pi-external-link',
    ariaLabel: 'Open link',
    kind: 'transparent',
    size: 'small',
    href: '#',
    target: '_self'
  },
  render: (args) => ({
    components: { IconButton },
    setup() {
      return { args }
    },
    template: `
        <IconButton v-bind="args" />
    `
  })
}

export const Sizes = {
  render: () => ({
    components: { IconButton },
    setup() {
      return { sizes }
    },
    template: `
      <div class="flex flex-wrap items-end gap-4">
        <IconButton
          v-for="size in sizes"
          :key="size"
          :size="size"
          icon="pi pi-plus"
          aria-label="Add"
          kind="primary"
        />
      </div>
    `
  })
}

export const VariantMatrix = {
  render: () => ({
    components: { IconButton },
    setup() {
      return { kinds }
    },
    template: `
      <div class="bg-[var(--bg-canvas)] p-8 rounded-lg flex flex-col gap-8">
        <section>
          <h3 class="text-[var(--text-default)] text-body-sm font-semibold mb-4">Default</h3>
          <div class="flex flex-wrap gap-4">
            <IconButton
              v-for="kind in kinds"
              :key="kind + '-default'"
              :kind="kind"
              size="large"
              icon="pi pi-plus"
              aria-label="Add"
            />
          </div>
        </section>
        <section>
          <h3 class="text-[var(--text-default)] text-body-sm font-semibold mb-4">Disabled</h3>
          <div class="flex flex-wrap gap-4">
            <IconButton
              v-for="kind in kinds"
              :key="kind + '-disabled'"
              :kind="kind"
              size="large"
              icon="pi pi-plus"
              aria-label="Add"
              disabled
            />
          </div>
        </section>
        <section>
          <h3 class="text-[var(--text-default)] text-body-sm font-semibold mb-4">Loading</h3>
          <div class="flex flex-wrap gap-4">
            <IconButton
              v-for="kind in kinds"
              :key="kind + '-loading'"
              :kind="kind"
              size="large"
              icon="pi pi-plus"
              aria-label="Add"
              loading
            />
          </div>
        </section>
      </div>
    `
  })
}
