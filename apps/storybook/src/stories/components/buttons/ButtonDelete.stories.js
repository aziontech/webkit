import ButtonDelete from '@aziontech/webkit/button-delete';

export default {
  title: 'Components/Buttons/ButtonDelete',
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
    severity: {
      control: 'select',
      options: ['', 'danger', 'secondary', 'success', 'info', 'warning', 'contrast'],
      description: 'Button severity/style variant'
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
    label: 'Delete'
  }
};

export const WithCustomLabel = {
  args: {
    label: 'Remove Item',
    icon: 'pi pi-trash'
  }
};

export const Filled = {
  args: {
    label: 'Delete',
    outlined: false
  }
};

export const Disabled = {
  args: {
    label: 'Delete',
    disabled: true
  }
};

export const WithCustomIcon = {
  args: {
    label: 'Delete',
    icon: 'pi pi-times'
  }
};
