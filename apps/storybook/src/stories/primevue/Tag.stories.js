import Tag from '@aziontech/webkit/tag';

export default {
  title: 'PrimeVue/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Text to display inside the tag'
    },
    severity: {
      control: 'select',
      options: [undefined, 'secondary', 'success', 'info', 'warning', 'danger', 'contrast'],
      description: 'Severity type of the tag'
    },
    rounded: {
      control: 'boolean',
      description: 'Whether the tag has rounded corners'
    },
    icon: {
      control: 'text',
      description: 'Icon class name'
    },
    class: {
      control: 'text',
      description: 'Custom CSS class'
    }
  }
};

export const Default = {
  args: {
    value: 'New'
  }
};

export const Severities = {
  render: () => ({
    components: { Tag },
    template: `
      <div class="flex flex-wrap gap-2">
        <Tag value="Primary" />
        <Tag value="Secondary" severity="secondary" />
        <Tag value="Success" severity="success" />
        <Tag value="Info" severity="info" />
        <Tag value="Warning" severity="warning" />
        <Tag value="Danger" severity="danger" />
        <Tag value="Contrast" severity="contrast" />
      </div>
    `
  })
};

export const Rounded = {
  render: () => ({
    components: { Tag },
    template: `
      <div class="flex flex-wrap gap-2">
        <Tag value="Primary" rounded />
        <Tag value="Secondary" severity="secondary" rounded />
        <Tag value="Success" severity="success" rounded />
        <Tag value="Info" severity="info" rounded />
        <Tag value="Warning" severity="warning" rounded />
        <Tag value="Danger" severity="danger" rounded />
      </div>
    `
  })
};

export const WithIcon = {
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
};

export const IconOnly = {
  render: () => ({
    components: { Tag },
    template: `
      <div class="flex flex-wrap gap-2">
        <Tag icon="pi pi-check" severity="success" />
        <Tag icon="pi pi-times" severity="danger" />
        <Tag icon="pi pi-info-circle" severity="info" />
      </div>
    `
  })
};

export const CustomContent = {
  render: () => ({
    components: { Tag },
    template: `
      <div class="flex flex-wrap gap-2">
        <Tag severity="success">
          <span class="flex items-center gap-1">
            <i class="pi pi-check"></i>
            Verified
          </span>
        </Tag>
        <Tag severity="info" rounded>
          <span class="flex items-center gap-1">
            <i class="pi pi-star"></i>
            Featured
          </span>
        </Tag>
      </div>
    `
  })
};

export const StatusTags = {
  render: () => ({
    components: { Tag },
    template: `
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <span class="w-24">Status:</span>
          <Tag value="Active" severity="success" />
        </div>
        <div class="flex items-center gap-2">
          <span class="w-24">Status:</span>
          <Tag value="Pending" severity="warning" />
        </div>
        <div class="flex items-center gap-2">
          <span class="w-24">Status:</span>
          <Tag value="Failed" severity="danger" />
        </div>
        <div class="flex items-center gap-2">
          <span class="w-24">Status:</span>
          <Tag value="Inactive" severity="secondary" />
        </div>
      </div>
    `
  })
};
