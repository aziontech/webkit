import Steps from '@aziontech/webkit/steps';

export default {
  title: 'PrimeVue/Steps',
  component: Steps,
  tags: ['autodocs'],
  argTypes: {
    activeStep: {
      control: 'number',
      description: 'Index of the active step'
    },
    readonly: {
      control: 'boolean',
      description: 'Whether steps are clickable'
    }
  }
};

export const Basic = {
  args: {
    activeStep: 0,
    model: [
      { label: 'Personal', to: '/personal' },
      { label: 'Seat', to: '/seat' },
      { label: 'Payment', to: '/payment' },
      { label: 'Confirmation', to: '/confirmation' }
    ]
  }
};

export const Interactive = {
  args: {
    readonly: false,
    model: [
      { label: 'Step 1', to: '/step1' },
      { label: 'Step 2', to: '/step2' },
      { label: 'Step 3', to: '/step3' }
    ]
  }
};

export const WithIcons = {
  args: {
    activeStep: 1,
    model: [
      { label: 'Cart', icon: 'pi pi-shopping-cart', to: '/cart' },
      { label: 'Shipping', icon: 'pi pi-truck', to: '/shipping' },
      { label: 'Payment', icon: 'pi pi-credit-card', to: '/payment' },
      { label: 'Confirm', icon: 'pi pi-check', to: '/confirm' }
    ]
  }
};
