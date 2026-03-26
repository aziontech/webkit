import ButtonDelete from '@aziontech/webkit/button-delete';

export default {
  title: 'Core/Buttons/ButtonDelete',
  component: ButtonDelete,
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
      options: ['', 'danger', 'secondary', 'success', 'info', 'warning', 'contrast'],
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
    label: 'Delete',
    size: ''
  }
};

export const WithCustomLabel = {
  args: {
    label: 'Remove Item',
    icon: 'pi pi-trash',
    size: ''
  }
};

export const Filled = {
  args: {
    label: 'Delete',
    outlined: false,
    size: ''
  }
};

export const Disabled = {
  args: {
    label: 'Delete',
    disabled: true,
    size: ''
  }
};

export const Loading = {
  args: {
    label: 'Deleting...',
    loading: true,
    size: ''
  }
};

export const WithCustomIcon = {
  args: {
    label: 'Delete',
    icon: 'pi pi-times',
    size: ''
  }
};

export const IconRight = {
  args: {
    label: 'Delete',
    icon: 'pi pi-trash',
    'iconPos': 'right',
    size: ''
  }
};
