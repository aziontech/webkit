import Button from '@aziontech/webkit/button';

export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Text of the button'
    },
    icon: {
      control: 'text',
      description: 'Icon class name'
    },
    iconPos: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      description: 'Position of the icon'
    },
    severity: {
      control: 'select',
      options: [undefined, 'secondary', 'success', 'info', 'warning', 'danger', 'contrast'],
      description: 'Severity type of the button'
    },
    size: {
      control: 'select',
      options: [undefined, 'small', 'large'],
      description: 'Size of the button'
    },
    raised: {
      control: 'boolean',
      description: 'Adds a shadow to indicate elevation'
    },
    rounded: {
      control: 'boolean',
      description: 'Adds border radius'
    },
    text: {
      control: 'boolean',
      description: 'Makes button text only'
    },
    outlined: {
      control: 'boolean',
      description: 'Makes button outlined'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button'
    },
    loading: {
      control: 'boolean',
      description: 'Shows a loading indicator'
    },
    link: {
      control: 'boolean',
      description: 'Makes button appear as a link'
    }
  }
};

export const Default = {
  args: {
    label: 'Primary Button'
  }
};

export const Severities = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap gap-2">
        <Button label="Primary" />
        <Button label="Secondary" severity="secondary" />
        <Button label="Success" severity="success" />
        <Button label="Info" severity="info" />
        <Button label="Warning" severity="warning" />
        <Button label="Danger" severity="danger" />
        <Button label="Contrast" severity="contrast" />
      </div>
    `
  })
};

export const Outlined = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap gap-2">
        <Button label="Primary" outlined />
        <Button label="Secondary" severity="secondary" outlined />
        <Button label="Success" severity="success" outlined />
        <Button label="Info" severity="info" outlined />
        <Button label="Warning" severity="warning" outlined />
        <Button label="Danger" severity="danger" outlined />
      </div>
    `
  })
};

export const Text = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap gap-2">
        <Button label="Primary" text />
        <Button label="Secondary" severity="secondary" text />
        <Button label="Success" severity="success" text />
        <Button label="Info" severity="info" text />
        <Button label="Warning" severity="warning" text />
        <Button label="Danger" severity="danger" text />
      </div>
    `
  })
};

export const WithIcon = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap gap-2">
        <Button label="Search" icon="pi pi-search" />
        <Button label="Save" icon="pi pi-save" iconPos="right" />
        <Button icon="pi pi-check" severity="success" />
        <Button icon="pi pi-times" severity="danger" />
      </div>
    `
  })
};

export const Sizes = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <Button label="Small" size="small" />
        <Button label="Normal" />
        <Button label="Large" size="large" />
      </div>
    `
  })
};

export const Raised = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap gap-2">
        <Button label="Primary" raised />
        <Button label="Secondary" severity="secondary" raised />
        <Button label="Success" severity="success" raised />
      </div>
    `
  })
};

export const Rounded = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap gap-2">
        <Button label="Primary" rounded />
        <Button label="Secondary" severity="secondary" rounded />
        <Button label="Success" severity="success" rounded />
        <Button icon="pi pi-check" rounded />
      </div>
    `
  })
};

export const Loading = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap gap-2">
        <Button label="Loading" loading />
        <Button label="Saving..." loading severity="success" />
      </div>
    `
  })
};

export const Disabled = {
  args: {
    label: 'Disabled Button',
    disabled: true
  }
};

export const Link = {
  args: {
    label: 'Link Button',
    link: true
  }
};

export const IconOnly = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap gap-2">
        <Button icon="pi pi-check" severity="success" />
        <Button icon="pi pi-times" severity="danger" />
        <Button icon="pi pi-info-circle" severity="info" />
        <Button icon="pi pi-bell" severity="warning" />
      </div>
    `
  })
};
