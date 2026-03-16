import FieldDropdownLazyLoaderDynamic from '@aziontech/webkit/field-dropdown-lazy-loader-dynamic';

export default {
  title: 'Core/Form/FieldDropdownLazyLoaderDynamic',
  component: FieldDropdownLazyLoaderDynamic,
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
    name: 'field-dropdown-lazy-dynamic-default',
    label: 'Dynamic Lazy Loading Dropdown',
    placeholder: 'Select an option...',
    description: 'Options are loaded dynamically based on context'
  }
};

export const Disabled = {
  args: {
    name: 'field-dropdown-lazy-dynamic-disabled',
    label: 'Disabled Dynamic Lazy Dropdown',
    placeholder: 'Cannot select',
    disabled: true
  }
};
