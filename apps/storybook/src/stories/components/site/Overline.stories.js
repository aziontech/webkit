import Overline from '@aziontech/webkit/site/overline';

export default {
  title: 'Components/Site/Overline',
  component: Overline,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'orange', 'black'],
      description: 'Text color variant',
      defaultValue: 'primary'
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'lg'],
      description: 'Text size',
      defaultValue: 'xs'
    }
  }
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

export const Orange = {
  args: {
    color: 'orange'
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
    size: 'xs',
    color: 'primary'
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
    size: 'sm',
    color: 'primary'
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
    size: 'lg',
    color: 'primary'
  },
  render: (args) => ({
    components: { Overline },
    setup() {
      return { args };
    },
    template: '<Overline v-bind="args">LARGE OVERLINE</Overline>'
  })
};
