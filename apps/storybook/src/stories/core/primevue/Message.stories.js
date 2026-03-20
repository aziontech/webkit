import Message from '@aziontech/webkit/message';

export default {
  title: 'Core/PrimeVue/Message',
  component: Message,
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'select',
      options: ['success', 'info', 'warn', 'error'],
      description: 'Severity type of the message'
    },
    closable: {
      control: 'boolean',
      description: 'Whether the message can be closed'
    },
    sticky: {
      control: 'boolean',
      description: 'Whether the message stays visible'
    },
    life: {
      control: 'number',
      description: 'Duration in milliseconds before hiding the message'
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
    severity: 'success',
    closable: true
  },
  render: (args) => ({
    components: { Message },
    setup() {
      return { args };
    },
    template: '<Message v-bind="args">Your changes have been saved successfully.</Message>'
  })
};

export const Info = {
  args: {
    severity: 'info',
    closable: true
  },
  render: (args) => ({
    components: { Message },
    setup() {
      return { args };
    },
    template: '<Message v-bind="args">New features are now available. Check the documentation for details.</Message>'
  })
};

export const Warning = {
  args: {
    severity: 'warn',
    closable: true
  },
  render: (args) => ({
    components: { Message },
    setup() {
      return { args };
    },
    template: '<Message v-bind="args">Your session will expire in 5 minutes.</Message>'
  })
};

export const Error = {
  args: {
    severity: 'error',
    closable: true
  },
  render: (args) => ({
    components: { Message },
    setup() {
      return { args };
    },
    template: '<Message v-bind="args">An error occurred while processing your request. Please try again.</Message>'
  })
};

export const AutoDismiss = {
  args: {
    severity: 'info',
    closable: false,
    sticky: false,
    life: 5000
  },
  render: (args) => ({
    components: { Message },
    setup() {
      return { args };
    },
    template: '<Message v-bind="args">This message will disappear in 5 seconds.</Message>'
  })
};

export const NonClosable = {
  args: {
    severity: 'info',
    closable: false
  },
  render: (args) => ({
    components: { Message },
    setup() {
      return { args };
    },
    template: '<Message v-bind="args">This message cannot be closed by the user.</Message>'
  })
};
