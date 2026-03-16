import FieldDropdownIcon from '@aziontech/webkit/field-dropdown-icon';

export default {
  title: 'Core/Form/FieldDropdownIcon',
  component: FieldDropdownIcon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission'
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the dropdown'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no option is selected'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the dropdown'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the dropdown'
    },
    options: {
      control: 'object',
      description: 'Array of options with icons'
    }
  }
};

const iconOptions = [
  { label: 'Dashboard', value: 'dashboard', icon: 'pi pi-home' },
  { label: 'Settings', value: 'settings', icon: 'pi pi-cog' },
  { label: 'Users', value: 'users', icon: 'pi pi-users' },
  { label: 'Reports', value: 'reports', icon: 'pi pi-chart-bar' }
];

export const Default = {
  args: {
    name: 'field-dropdown-icon-default',
    label: 'Dropdown with Icons',
    placeholder: 'Select an option...',
    options: iconOptions
  }
};

export const Disabled = {
  args: {
    name: 'field-dropdown-icon-disabled',
    label: 'Disabled Dropdown with Icons',
    placeholder: 'Cannot select',
    disabled: true,
    options: iconOptions
  }
};
