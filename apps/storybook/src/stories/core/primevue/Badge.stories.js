import Badge from '@aziontech/webkit/badge';

export default {
  title: 'Core/PrimeVue/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Value to display inside the badge'
    },
    severity: {
      control: 'select',
      options: [undefined, 'secondary', 'success', 'info', 'warning', 'danger', 'contrast'],
      description: 'Severity type of the badge'
    },
    size: {
      control: 'select',
      options: [undefined, 'large', 'xlarge'],
      description: 'Size of the badge'
    },
    class: {
      control: 'text',
      description: 'Custom CSS class'
    }
  }
};

export const Default = {
  render: (args) => ({
    components: { Badge },
    setup() {
      return { args };
    },
    template: `
      <div class="flex">
        <Badge v-bind="args" />
      </div>
    `
  }),
  args: {
    value: 5
  }
};

export const Severities = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-wrap gap-4">
        <Badge value="5" />
        <Badge value="3" severity="secondary" />
        <Badge value="8" severity="success" />
        <Badge value="2" severity="info" />
        <Badge value="6" severity="warning" />
        <Badge value="9" severity="danger" />
        <Badge value="1" severity="contrast" />
      </div>
    `
  })
};

export const Sizes = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-wrap items-end gap-4">
        <Badge value="Normal" />
        <Badge value="Large" size="large" />
        <Badge value="Extra Large" size="xlarge" />
      </div>
    `
  })
};

export const Numeric = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-wrap gap-4">
        <Badge :value="0" />
        <Badge :value="5" />
        <Badge :value="99" />
        <Badge :value="999" />
      </div>
    `
  })
};

export const Text = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-wrap gap-4">
        <Badge value="New" severity="info" />
        <Badge value="Hot" severity="danger" />
        <Badge value="Beta" severity="warning" />
        <Badge value="Pro" severity="success" />
      </div>
    `
  })
};

export const NotificationBadges = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-4">
          <div class="relative inline-flex">
            <i class="pi pi-bell text-2xl"></i>
            <Badge value="3" severity="danger" class="absolute -top-2 -right-2" />
          </div>
          <span>Notifications</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="relative inline-flex">
            <i class="pi pi-inbox text-2xl"></i>
            <Badge value="12" severity="info" class="absolute -top-2 -right-2" />
          </div>
          <span>Messages</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="relative inline-flex">
            <i class="pi pi-shopping-cart text-2xl"></i>
            <Badge value="5" severity="success" class="absolute -top-2 -right-2" />
          </div>
          <span>Cart Items</span>
        </div>
      </div>
    `
  })
};

export const WithLargeSize = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-wrap gap-4">
        <Badge value="New" size="large" severity="info" />
        <Badge value="99+" size="large" severity="danger" />
        <Badge value="Hot" size="large" severity="warning" />
      </div>
    `
  })
};

export const WithExtraLargeSize = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-wrap gap-4">
        <Badge value="Premium" size="xlarge" severity="success" />
        <Badge value="VIP" size="xlarge" severity="contrast" />
      </div>
    `
  })
};
