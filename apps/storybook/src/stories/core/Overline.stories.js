import Overline from '@aziontech/webkit/overline';

export default {
  title: 'Core/Overline',
  component: Overline,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'muted', 'black'],
      description: 'Text color variant',
      defaultValue: 'muted'
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'lg'],
      description: 'Text size',
      defaultValue: 'xs'
    }
  }
};

export const Default = {
  args: {
    color: 'default'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">OVERLINE TEXT</Overline>'
  })
};

export const Primary = {
  args: {
    color: 'primary'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">OVERLINE TEXT</Overline>'
  })
};

export const Muted = {
  args: {
    color: 'muted'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">OVERLINE TEXT</Overline>'
  })
};

export const Black = {
  args: {
    color: 'black'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">OVERLINE TEXT</Overline>'
  })
};

export const SizeXS = {
  args: {
    size: 'xs'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">EXTRA SMALL OVERLINE</Overline>'
  })
};

export const SizeSM = {
  args: {
    size: 'sm'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">SMALL OVERLINE</Overline>'
  })
};

export const SizeLG = {
  args: {
    size: 'lg'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">LARGE OVERLINE</Overline>'
  })
};
