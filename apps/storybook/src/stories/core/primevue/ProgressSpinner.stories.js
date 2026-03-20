import ProgressSpinner from '@aziontech/webkit/progressspinner';

export default {
  title: 'Core/PrimeVue/ProgressSpinner',
  component: ProgressSpinner,
  tags: ['autodocs'],
  argTypes: {
    strokeWidth: {
      control: 'text',
      description: 'Width of the circle stroke'
    },
    fill: {
      control: 'text',
      description: 'Color for the background of the circle'
    },
    animationDuration: {
      control: 'text',
      description: 'Duration of the animation'
    }
  }
};

export const Basic = {
  args: {}
};

export const CustomStyle = {
  args: {
    strokeWidth: '4',
    fill: 'var(--surface-ground)',
    animationDuration: '1s'
  }
};

export const Sizes = {
  render: () => ({
    components: { ProgressSpinner },
    template: `
      <div class="flex items-center gap-4">
        <ProgressSpinner style="width: 30px; height: 30px" />
        <ProgressSpinner style="width: 50px; height: 50px" />
        <ProgressSpinner style="width: 70px; height: 70px" />
      </div>
    `
  })
};
