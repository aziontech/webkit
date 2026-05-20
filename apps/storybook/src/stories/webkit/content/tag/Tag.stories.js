import Tag from '@aziontech/webkit/content/tag'

export default {
  title: 'Webkit/Content/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Text to display inside the tag'
    },
    severity: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'accent', 'contrast'],
      description: 'Visual severity variant'
    },
    rounded: {
      control: 'boolean',
      description: 'Whether the tag has pill shape'
    },
    icon: {
      control: 'text',
      description: 'Custom icon class name'
    }
  }
}

export const Default = {
  args: {
    value: 'Label',
    severity: 'primary'
  }
}

export const Severities = {
  render: () => ({
    components: { Tag },
    template: `
      <div class="flex flex-wrap gap-2">
        <Tag value="Primary" severity="primary" />
        <Tag value="Secondary" severity="secondary" />
        <Tag value="Success" severity="success" />
        <Tag value="Info" severity="info" />
        <Tag value="Warning" severity="warning" />
        <Tag value="Danger" severity="danger" />
        <Tag value="Accent" severity="accent" />
        <Tag value="Contrast" severity="contrast" />
      </div>
    `
  })
}

export const Rounded = {
  render: () => ({
    components: { Tag },
    template: `
      <div class="flex flex-wrap gap-2">
        <Tag value="Primary" severity="primary" rounded />
        <Tag value="Secondary" severity="secondary" rounded />
        <Tag value="Success" severity="success" rounded />
        <Tag value="Info" severity="info" rounded />
        <Tag value="Warning" severity="warning" rounded />
        <Tag value="Danger" severity="danger" rounded />
      </div>
    `
  })
}

export const WithCustomIcon = {
  render: () => ({
    components: { Tag },
    template: `
      <div class="flex flex-wrap gap-2">
        <Tag value="Success" icon="pi pi-check" severity="success" />
        <Tag value="Info" icon="pi pi-info-circle" severity="info" />
        <Tag value="Warning" icon="pi pi-exclamation-triangle" severity="warning" />
        <Tag value="Danger" icon="pi pi-times" severity="danger" />
      </div>
    `
  })
}
