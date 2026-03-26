import ButtonClone from '@aziontech/webkit/button-clone';

export default {
  title: 'Core/Buttons/ButtonClone',
  component: ButtonClone,
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
      options: ['', 'secondary', 'primary', 'success', 'info', 'warning', 'danger', 'contrast'],
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
    label: 'Clone',
    size: ''
  }
};

export const WithCustomLabel = {
  args: {
    label: 'Duplicate',
    size: 'large'
  }
};

export const Small = {
  args: {
    label: 'Clone',
    size: 'small'
  }
};

export const Filled = {
  args: {
    label: 'Clone',
    outlined: false,
    size: 'large'
  }
};

export const Disabled = {
  args: {
    label: 'Clone',
    disabled: true,
    size: 'large'
  }
};

export const WithCustomIcon = {
  args: {
    label: 'Clone',
    icon: 'pi pi-clone',
    size: 'large'
  }
};

export const IconRight = {
  args: {
    label: 'Clone',
    icon: 'pi pi-clone',
    'iconPos': 'right',
    size: 'large'
  }
};
