import FieldDropdownMultiSelectLazyLoader from '@aziontech/webkit/field-dropdown-multi-select-lazy-loader';

export default {
  title: 'Core/Form/FieldDropdownMultiSelectLazyLoader',
  component: FieldDropdownMultiSelectLazyLoader,
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
    name: 'field-dropdown-multiselect-lazy-default',
    label: 'Multi-Select Lazy Loading Dropdown',
    placeholder: 'Select options...',
    description: 'Select multiple options, loaded on demand'
  }
};

export const Disabled = {
  args: {
    name: 'field-dropdown-multiselect-lazy-disabled',
    label: 'Disabled Multi-Select Lazy Dropdown',
    placeholder: 'Cannot select',
    disabled: true
  }
};
