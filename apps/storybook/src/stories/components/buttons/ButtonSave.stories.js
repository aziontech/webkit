import ButtonSave from '@aziontech/webkit/button-save';

export default {
  title: 'Components/Buttons/ButtonSave',
  component: ButtonSave,
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
    loading: {
      control: 'boolean',
      description: 'Whether the button shows loading state'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled'
    }
  }
};

export const Default = {
  args: {
    label: 'Save',
    size: ''
  }
};

export const Loading = {
  args: {
    label: 'Saving...',
    loading: true,
    size: 'large'
  }
};

export const Small = {
  args: {
    label: 'Save',
    size: 'small'
  }
};

export const Filled = {
  args: {
    label: 'Save',
    outlined: false,
    size: 'large'
  }
};

export const Disabled = {
  args: {
    label: 'Save',
    disabled: true,
    size: 'large'
  }
};

export const WithCustomLabel = {
  args: {
    label: 'Save Changes',
    size: 'large'
  }
};

export const WithCustomIcon = {
  args: {
    label: 'Save',
    icon: 'pi pi-check',
    size: 'large'
  }
};

export const IconRight = {
  args: {
    label: 'Save',
    icon: 'pi pi-check',
    'iconPos': 'right',
    size: 'large'
  }
};

export const Success = {
  args: {
    label: 'Save',
    severity: 'success',
    size: 'large'
  }
};
