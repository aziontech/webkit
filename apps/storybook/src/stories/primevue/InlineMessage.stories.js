import InlineMessage from '@aziontech/webkit/inlinemessage';

export default {
  title: 'PrimeVue/InlineMessage',
  component: InlineMessage,
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'select',
      options: ['success', 'info', 'warn', 'error'],
      description: 'Severity type of the message'
    },
    icon: {
      control: 'text',
      description: 'Custom icon class'
    },
    class: {
      control: 'text',
      description: 'Custom CSS class'
    }
  }
};

export const Success = {
  args: {
    severity: 'success'
  },
  render: (args) => ({
    components: { InlineMessage },
    setup() {
      return { args };
    },
    template: '<InlineMessage v-bind="args">Operation successful!</InlineMessage>'
  })
};

export const Info = {
  args: {
    severity: 'info'
  },
  render: (args) => ({
    components: { InlineMessage },
    setup() {
      return { args };
    },
    template: '<InlineMessage v-bind="args">This is an informational message.</InlineMessage>'
  })
};

export const Warning = {
  args: {
    severity: 'warn'
  },
  render: (args) => ({
    components: { InlineMessage },
    setup() {
      return { args };
    },
    template: '<InlineMessage v-bind="args">Warning: Please review your changes.</InlineMessage>'
  })
};

export const Error = {
  args: {
    severity: 'error'
  },
  render: (args) => ({
    components: { InlineMessage },
    setup() {
      return { args };
    },
    template: '<InlineMessage v-bind="args">Error: Invalid input detected.</InlineMessage>'
  })
};

export const CustomIcon = {
  args: {
    severity: 'info',
    icon: 'pi pi-send'
  },
  render: (args) => ({
    components: { InlineMessage },
    setup() {
      return { args };
    },
    template: '<InlineMessage v-bind="args">Custom icon message</InlineMessage>'
  })
};
