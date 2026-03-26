import ButtonCancel from '@aziontech/webkit/button-cancel';

export default {
  title: 'Core/Buttons/ButtonCancel',
  component: ButtonCancel,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Text displayed on the button'
    },
    icon: {
      control: 'text',
      description: 'Icon class (PrimeIcons format)'
    },
    'iconPos': {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of the icon (left or right)'
    },
    severity: {
      control: 'select',
      options: ['', 'secondary', 'success', 'info', 'warning', 'danger', 'contrast'],
      description: 'Button severity/style variant'
    },
    size: {
      control: 'select',
      options: ['', 'small', 'large'],
      description: 'Button size'
    },
    outlined: {
      control: 'boolean',
      description: 'Whether the button is outlined'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled'
    }
  }
};

export const Default = {
  args: {
    label: 'Cancel',
    size: ''
  }
};

export const WithIcon = {
  args: {
    label: 'Cancel',
    icon: 'pi pi-times',
    size: 'large'
  }
};

export const IconRight = {
  args: {
    label: 'Cancel',
    icon: 'pi pi-times',
    'iconPos': 'right',
    size: 'large'
  }
};

export const Small = {
  args: {
    label: 'Cancel',
    size: 'small'
  }
};

export const Filled = {
  args: {
    label: 'Cancel',
    outlined: false,
    size: 'large'
  }
};

export const Disabled = {
  args: {
    label: 'Cancel',
    disabled: true,
    size: 'large'
  }
};
