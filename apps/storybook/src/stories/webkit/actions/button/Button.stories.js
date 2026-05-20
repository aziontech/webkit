import { ref } from 'vue'
import Button from '@aziontech/webkit/actions/button'

const kinds = ['primary', 'secondary', 'outlined', 'text']
const sizes = ['large', 'medium', 'small']

export default {
  title: 'Webkit/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Button label text'
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
    icon: {
      control: 'text',
      description: 'PrimeIcons class (e.g. pi pi-arrow-right)'
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
    label: 'Button',
    kind: 'primary',
    size: 'large',
    disabled: false
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: `
        <Button v-bind="args" />
    `
  })
}

export const Loading = {
  render: () => ({
    components: { Button },
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
      <Button
        label="Save"
        kind="primary"
        size="large"
        :loading="loading"
        @click="handleClick"
      />
    `
  })
}

export const WithIcon = {
  args: {
    label: 'Button',
    kind: 'primary',
    size: 'large',
    icon: 'pi pi-arrow-right'
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: `
        <Button v-bind="args" />
    `
  })
}

export const AsLink = {
  args: {
    label: 'Learn more',
    kind: 'text',
    size: 'small',
    href: '#',
    target: '_self'
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: `
        <Button v-bind="args" />
    `
  })
}

export const Sizes = {
  render: () => ({
    components: { Button },
    setup() {
      return { sizes }
    },
    template: `
      <div class="flex flex-wrap items-end gap-4">
        <Button
          size="large"
          label="Large"
          kind="primary"
          class="!min-w-0 w-fit"
        />
        <Button
          size="medium"
          label="Medium"
          kind="primary"
          class="!min-w-0 w-fit"
        />
        <Button
          size="small"
          label="Small"
          kind="primary"
          class="!min-w-0 w-fit"
        />
      </div>
    `
  })
}

export const VariantMatrix = {
  render: () => ({
    components: { Button },
    setup() {
      return { kinds }
    },
    template: `
      <div class="bg-[var(--bg-canvas)] p-8 rounded-lg flex flex-col gap-8">
        <section>
          <h3 class="text-[var(--text-default)] text-body-sm font-semibold mb-4">Default</h3>
          <div class="flex flex-wrap gap-4">
            <Button
              v-for="kind in kinds"
              :key="kind + '-default'"
              :kind="kind"
              size="large"
              label="Button"
              class="!min-w-0 w-fit"
            />
          </div>
        </section>
        <section>
          <h3 class="text-[var(--text-default)] text-body-sm font-semibold mb-4">Disabled</h3>
          <div class="flex flex-wrap gap-4">
            <Button
              v-for="kind in kinds"
              :key="kind + '-disabled'"
              :kind="kind"
              size="large"
              label="Button"
              disabled
              class="!min-w-0 w-fit"
            />
          </div>
        </section>
        <section>
          <h3 class="text-[var(--text-default)] text-body-sm font-semibold mb-4">Loading</h3>
          <div class="flex flex-wrap gap-4">
            <Button
              v-for="kind in kinds"
              :key="kind + '-loading'"
              :kind="kind"
              size="large"
              label="Button"
              loading
              class="!min-w-0 w-fit"
            />
          </div>
        </section>
      </div>
    `
  })
}
