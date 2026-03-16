import FieldDropdownLazyLoaderWithFilter from '@aziontech/webkit/field-dropdown-lazy-loader-with-filter';

export default {
  title: 'Core/Form/FieldDropdownLazyLoaderWithFilter',
  component: FieldDropdownLazyLoaderWithFilter,
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
    name: 'field-dropdown-lazy-filter-default',
    label: 'Lazy Dropdown with Filter',
    placeholder: 'Select an option...',
    description: 'Type to filter options, scroll to load more'
  }
};

export const Disabled = {
  args: {
    name: 'field-dropdown-lazy-filter-disabled',
    label: 'Disabled Lazy Dropdown with Filter',
    placeholder: 'Cannot select',
    disabled: true
  }
};
