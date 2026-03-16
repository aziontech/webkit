import FieldDropdown from '@aziontech/webkit/field-dropdown';

export default {
  title: 'Core/Form/FieldDropdown',
  component: FieldDropdown,
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
      description: 'Array of options to display'
    }
  }
};

const sampleOptions = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Option 4', value: 'option4' }
];

export const Default = {
  args: {
    name: 'field-dropdown-default',
    label: 'Dropdown Field',
    placeholder: 'Select an option...',
    options: sampleOptions
  }
};

export const Disabled = {
  args: {
    name: 'field-dropdown-disabled',
    label: 'Disabled Dropdown',
    placeholder: 'Cannot select',
    disabled: true,
    options: sampleOptions
  }
};

export const WithDescription = {
  args: {
    name: 'field-dropdown-desc',
    label: 'Dropdown with Description',
    placeholder: 'Select an option...',
    description: 'Choose one option from the dropdown list',
    options: sampleOptions
  }
};

export const WithPreselectedValue = {
  args: {
    name: 'field-dropdown-preselected',
    label: 'Preselected Dropdown',
    value: 'option2',
    options: sampleOptions
  }
};
