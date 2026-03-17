import FieldDropdownIcon from '@aziontech/webkit/field-dropdown-icon';

export default {
  title: 'Core/Form/FieldDropdownIcon',
  component: FieldDropdownIcon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission (required)'
    },
    value: {
      control: 'text',
      description: 'Initial value of the dropdown'
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
    readonly: {
      control: 'boolean',
      description: 'Makes the dropdown read-only'
    },
    icon: {
      control: 'text',
      description: 'Icon class to display in the input addon (e.g., "pi pi-search")'
    },
    suggestions: {
      control: 'object',
      description: 'Array of options with icons'
    },
    onComplete: {
      control: false,
      description: 'Callback function when user types'
    },
    completeOnFocus: {
      control: 'boolean',
      description: 'Whether to show suggestions on focus'
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
    suggestions: iconOptions
  }
};

export const Disabled = {
  args: {
    name: 'field-dropdown-icon-disabled',
    label: 'Disabled Dropdown with Icons',
    placeholder: 'Cannot select',
    disabled: true,
    suggestions: iconOptions
  }
};

export const WithDescription = {
  args: {
    name: 'field-dropdown-icon-desc',
    label: 'Dropdown with Description',
    placeholder: 'Select an option...',
    description: 'Choose an option from the dropdown',
    suggestions: iconOptions
  }
};

export const WithIcon = {
  args: {
    name: 'field-dropdown-icon-withicon',
    label: 'Search Dropdown',
    placeholder: 'Search...',
    icon: 'pi pi-search',
    suggestions: iconOptions
  }
};

export const Readonly = {
  args: {
    name: 'field-dropdown-icon-readonly',
    label: 'Read-only Dropdown',
    value: 'dashboard',
    readonly: true,
    suggestions: iconOptions
  }
};
