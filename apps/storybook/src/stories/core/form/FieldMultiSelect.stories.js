import FieldMultiSelect from '@aziontech/webkit/field-multi-select';

export default {
  title: 'Core/Form/FieldMultiSelect',
  component: FieldMultiSelect,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission'
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the multi-select'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no options are selected'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the multi-select'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the multi-select'
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
    name: 'field-multiselect-default',
    label: 'Multi-Select Field',
    placeholder: 'Select options...',
    options: sampleOptions
  }
};

export const Disabled = {
  args: {
    name: 'field-multiselect-disabled',
    label: 'Disabled Multi-Select',
    placeholder: 'Cannot select',
    disabled: true,
    options: sampleOptions
  }
};

export const WithDescription = {
  args: {
    name: 'field-multiselect-desc',
    label: 'Multi-Select with Description',
    placeholder: 'Select options...',
    description: 'Select multiple options from the list',
    options: sampleOptions
  }
};
