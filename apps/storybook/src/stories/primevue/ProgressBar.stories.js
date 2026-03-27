import ProgressBar from '@aziontech/webkit/progressbar';

export default {
  title: 'PrimeVue/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'Current progress value (0-100)'
    },
    mode: {
      control: 'select',
      options: ['determinate', 'indeterminate'],
      description: 'Mode of the progress bar'
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to show the progress value'
    }
  }
};

export const Determinate = {
  args: {
    value: 40
  }
};

export const Indeterminate = {
  args: {
    mode: 'indeterminate'
  }
};

export const WithoutValue = {
  args: {
    value: 75,
    showValue: false
  }
};

export const Dynamic = {
  render: () => ({
    components: { ProgressBar },
    data() {
      return {
        value: 0
      };
    },
    mounted() {
      this.interval = setInterval(() => {
        this.value = this.value >= 100 ? 0 : this.value + 10;
      }, 1000);
    },
    beforeUnmount() {
      clearInterval(this.interval);
    },
    template: `
      <div>
        <p class="mb-2">Progress: {{ value }}%</p>
        <ProgressBar :value="value" />
      </div>
    `
  })
};
