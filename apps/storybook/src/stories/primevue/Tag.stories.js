import PrimeTag from '@aziontech/webkit/prime-tag';

export default {
  title: 'PrimeVue/PrimeTag',
  component: PrimeTag,
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
    components: { PrimeTag },
    template: `
      <div class="flex flex-wrap gap-2">
        <PrimeTag value="Primary" />
        <PrimeTag value="Secondary" severity="secondary" />
        <PrimeTag value="Success" severity="success" />
        <PrimeTag value="Info" severity="info" />
        <PrimeTag value="Warning" severity="warning" />
        <PrimeTag value="Danger" severity="danger" />
        <PrimeTag value="Contrast" severity="contrast" />
      </div>
    `
  })
};

export const Rounded = {
  render: () => ({
    components: { PrimeTag },
    template: `
      <div class="flex flex-wrap gap-2">
        <PrimeTag value="Primary" rounded />
        <PrimeTag value="Secondary" severity="secondary" rounded />
        <PrimeTag value="Success" severity="success" rounded />
        <PrimeTag value="Info" severity="info" rounded />
        <PrimeTag value="Warning" severity="warning" rounded />
        <PrimeTag value="Danger" severity="danger" rounded />
      </div>
    `
  })
};

export const WithIcon = {
  render: () => ({
    components: { PrimeTag },
    template: `
      <div class="flex flex-wrap gap-2">
        <PrimeTag value="Success" icon="pi pi-check" severity="success" />
        <PrimeTag value="Info" icon="pi pi-info-circle" severity="info" />
        <PrimeTag value="Warning" icon="pi pi-exclamation-triangle" severity="warning" />
        <PrimeTag value="Danger" icon="pi pi-times" severity="danger" />
      </div>
    `
  })
};

export const IconOnly = {
  render: () => ({
    components: { PrimeTag },
    template: `
      <div class="flex flex-wrap gap-2">
        <PrimeTag icon="pi pi-check" severity="success" />
        <PrimeTag icon="pi pi-times" severity="danger" />
        <PrimeTag icon="pi pi-info-circle" severity="info" />
      </div>
    `
  })
};

export const CustomContent = {
  render: () => ({
    components: { PrimeTag },
    template: `
      <div class="flex flex-wrap gap-2">
        <PrimeTag severity="success">
          <span class="flex items-center gap-1">
            <i class="pi pi-check"></i>
            Verified
          </span>
        </PrimeTag>
        <PrimeTag severity="info" rounded>
          <span class="flex items-center gap-1">
            <i class="pi pi-star"></i>
            Featured
          </span>
        </PrimeTag>
      </div>
    `
  })
};

export const StatusTags = {
  render: () => ({
    components: { PrimeTag },
    template: `
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <span class="w-24">Status:</span>
          <PrimeTag value="Active" severity="success" />
        </div>
        <div class="flex items-center gap-2">
          <span class="w-24">Status:</span>
          <PrimeTag value="Pending" severity="warning" />
        </div>
        <div class="flex items-center gap-2">
          <span class="w-24">Status:</span>
          <PrimeTag value="Failed" severity="danger" />
        </div>
        <div class="flex items-center gap-2">
          <span class="w-24">Status:</span>
          <PrimeTag value="Inactive" severity="secondary" />
        </div>
      </div>
    `
  })
};
