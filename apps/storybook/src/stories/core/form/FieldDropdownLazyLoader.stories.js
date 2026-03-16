import FieldDropdownLazyLoader from '@aziontech/webkit/field-dropdown-lazy-loader';

export default {
  title: 'Core/Form/FieldDropdownLazyLoader',
  component: FieldDropdownLazyLoader,
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
    }
  }
};

export const Default = {
  args: {
    name: 'field-dropdown-lazy-default',
    label: 'Lazy Loading Dropdown',
    placeholder: 'Select an option...',
    description: 'Options are loaded on demand as you scroll'
  }
};

export const Disabled = {
  args: {
    name: 'field-dropdown-lazy-disabled',
    label: 'Disabled Lazy Dropdown',
    placeholder: 'Cannot select',
    disabled: true
  }
};
