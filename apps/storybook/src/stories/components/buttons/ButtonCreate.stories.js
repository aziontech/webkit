import ButtonCreate from '@aziontech/webkit/button-create';

export default {
  title: 'Components/Buttons/ButtonCreate',
  component: ButtonCreate,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Text displayed on the button (required)'
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
      options: ['', 'primary', 'secondary', 'success', 'info', 'warning', 'danger', 'contrast'],
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
    label: 'Create New',
    size: ''
  }
};

export const WithCustomIcon = {
  args: {
    label: 'Add Item',
    icon: 'pi pi-plus-circle',
    size: 'large'
  }
};

export const IconRight = {
  args: {
    label: 'Create New',
    icon: 'pi pi-plus',
    'iconPos': 'right',
    size: 'large'
  }
};

export const Small = {
  args: {
    label: 'Create',
    size: 'small'
  }
};

export const Outlined = {
  args: {
    label: 'Create New',
    outlined: true,
    size: 'large'
  }
};

export const Disabled = {
  args: {
    label: 'Create New',
    disabled: true,
    size: 'large'
  }
};

export const Secondary = {
  args: {
    label: 'Create New',
    severity: 'secondary',
    size: 'large'
  }
};
